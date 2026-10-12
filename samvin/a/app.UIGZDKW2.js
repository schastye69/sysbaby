(()=>{var iy=t=>{try{return typeof matchMedia=="function"?matchMedia(t):null}catch{return null}},Um=iy("(prefers-reduced-motion: reduce)"),km=iy("(pointer: coarse)"),Fm=typeof navigator<"u"&&navigator.userAgent||"",ey=typeof navigator<"u"&&navigator.maxTouchPoints||0,Gt={reducedMotion:!!(Um&&Um.matches),coarse:!!(km&&km.matches),touch:ey>0,ios:/iPad|iPhone|iPod/.test(Fm)||/Macintosh/.test(Fm)&&ey>1,android:/Android/i.test(Fm)},ty=[];function ry(t,e){t&&(t.addEventListener?t.addEventListener("change",e):t.addListener&&t.addListener(e))}ry(Um,t=>{Gt.reducedMotion=!!t.matches;for(let e=0;e<ty.length;e++)try{ty[e](Gt.reducedMotion)}catch(n){lt("env:rm","reduced-motion listener failed",n)}});ry(km,t=>{Gt.coarse=!!t.matches});var ny=new Set;function lt(t,...e){if(!ny.has(t)){ny.add(t);try{console.warn(`[sam.vin] ${t}:`,...e)}catch{}}}var Dh=new Map,_e={on(t,e){let n=Dh.get(t);return n||(n=[],Dh.set(t,n)),n.push(e),()=>_e.off(t,e)},off(t,e){let n=Dh.get(t);if(!n)return;let i=n.indexOf(e);i<0&&(i=n.findIndex(r=>r.orig===e)),i>=0&&n.splice(i,1)},once(t,e){let n=i=>{_e.off(t,n),e(i)};return n.orig=e,_e.on(t,n),()=>_e.off(t,n)},emit(t,e){let n=Dh.get(t);if(!n||n.length===0)return;let i=n.slice();for(let r=0;r<i.length;r++)try{i[r](e)}catch(s){lt(`bus:${t}`,`listener for '${t}' threw`,s)}}};var xc=Object.freeze(["void","abyss","deep","steel","slate","pewter","silver","white","obsidian","ember","emberDeep","electrum","paper","ink"]),vc=Object.freeze({void:"--void",abyss:"--abyss",deep:"--deep",steel:"--steel",slate:"--slate",pewter:"--pewter",silver:"--silver",white:"--white",obsidian:"--obsidian",ember:"--ember",emberDeep:"--ember-deep",electrum:"--electrum",paper:"--paper",ink:"--ink"}),Ha=Object.freeze({void:"#04060A",abyss:"#070B12",deep:"#0C1420",steel:"#13202F",slate:"#233446",pewter:"#5E6E80",silver:"#B8C4D0",white:"#EEF2F6",obsidian:"#0B1119",ember:"#FF6A2B",emberDeep:"#B23A12",electrum:"#E8C872",paper:"#E6EAEE",ink:"#0C1420"}),sy=Object.freeze({void:"#E6EAEE",abyss:"#E6EAEE",deep:"#E6EAEE",steel:"#9AA6B4",slate:"#9AA6B4",silver:"#0C1420",white:"#0C1420",obsidian:"#D3D9DF"});function Bm(t){return parseInt(t.slice(1),16)}function oy(t,e=[0,0,0]){let n=Bm(t);return e[0]=(n>>16&255)/255,e[1]=(n>>8&255)/255,e[2]=(n&255)/255,e}function Fh(t,e){let n={};for(let i of Object.keys(t))n[i]=e(t[i]);return Object.freeze(n)}var rD=Fh(Ha,Bm),AA=Fh(Ha,t=>Object.freeze(oy(t))),sD=Fh(sy,Bm),TA=Fh(sy,t=>Object.freeze(oy(t)));function Uh(t,e,n=[0,0,0]){let i=AA[t],r=TA[t]||i;return n[0]=i[0]+(r[0]-i[0])*e,n[1]=i[1]+(r[1]-i[1])*e,n[2]=i[2]+(r[2]-i[2])*e,n}var oD=Object.freeze({giant:.07,counter:.12,status:.85,scrim:.6,scrimBreath:[.58,.62],leader:.7,line:.55,vertex:.4,inlay:.45,fresnel:.55,grains:.35,grainsBreath:[.32,.38],axisInside:.35,marginalia:.8,legendBand:.4,column:.7,dimmed:.4,hoverOthers:.55,dome:.45,contours:.4,doneLight:.12,ghost:.6,ghostStroke:.3,whale:.3,spark:.3,rimBoot:[.06,.12],bandHover:1.25}),aD=Object.freeze({maxFrac:.03,peakFrac:.06,peakMs:1500,maxLinePx:2,maxDotPx:6,maxTextPx:11,burnCoolMs:1200}),lD=Object.freeze({maxMs:2500,coolMs:600,nightNucleus:.55}),_s=Object.freeze({nucleusIntensity:.55,litAlpha:.7,breathMs:7e3,drowsyBreathMs:5600,mixMs:1200,yawnMs:1200}),cD=Object.freeze({sans:'"Geologica", system-ui, sans-serif',mono:'"Martian", ui-monospace, monospace'}),uD=Object.freeze({giant:{family:"sans",wght:100,tracking:-.04,lh:.8,desktop:"38vw",phone:"62vmin",alpha:.07},display:{family:"sans",wght:220,tracking:-.035,lh:.9,desktop:"clamp(56px, 8.4vw, 148px)",phone:"13vmin"},heading:{family:"sans",wght:560,desktop:[28,34],phone:[26,31]},lead:{family:"sans",wght:300,desktop:[22,30],phone:[19,26]},brief:{family:"sans",wght:380,desktop:[19,28],phone:[17,25]},body:{family:"sans",wght:380,desktop:[17,25],phone:[16,24],measureCh:36},status:{family:"sans",wght:400,desktop:[16,22],phone:[16,22],maxChars:34,measureCh:44},label:{family:"mono",wght:500,wdth:87.5,tracking:.08,upper:!0,desktop:[11,14],phone:[11,14]},data:{family:"mono",wght:250,wdth:100,tabular:!0,desktop:[72,72],phone:[48,48]},micro:{family:"mono",wght:450,wdth:75,tracking:.1,upper:!0,desktop:[9.5,12],phone:[10,13]}}),Yr=Object.freeze({sign:'700 {px}px "Geologica"',burn:'700 {px}px "Geologica"',sand:'700 {px}px "Geologica"',ring:'500 {px}px "Martian"'});var Oh=Object.freeze({base:20,range:80,perDay:.08,perSecret:.06});function zm(t,e){return Math.min(1,Oh.perDay*t+Oh.perSecret*e)}function ay(t,e){return Math.round(Oh.base+Oh.range*zm(t,e))}var hD=Object.freeze([120,240,480,960,1920]),fD=Object.freeze({o1:120,o2:240,o3:480,o4:960,o5:1920}),ly=Object.freeze({heavy:Object.freeze({omega:6,zeta:1}),medium:Object.freeze({omega:12,zeta:1}),light:Object.freeze({omega:22,zeta:1}),struck:Object.freeze({omega:18,zeta:.18}),notice:Object.freeze({omega:6.3,zeta:.95}),reindex:Object.freeze({omega:9,zeta:1}),hot:Object.freeze({omega:14,zeta:1}),hint:Object.freeze({omega:8,zeta:.25})}),Oi=Object.freeze({inertiaDecay:.92,frameMs:16.7,spinDecay:.96,overshootMax:.04,snapOvershoot:.04,settleOvershoot:.02,anticipationFrac:.03,anticipationMs:120,anticipationMinDisp:.1,responseMs:80,pressScale:.96,pressMs:90,rippleMs:260,ripplePx:48}),Wa=Object.freeze({periodMs:4200,inhaleMs:1800,exhaleMs:2400,drowsyMs:5600,nightMs:7e3,reducedAmp:.25,nucleus:[.8,1],gap:[.02,.026],grainAlpha:[.32,.38],scrim:[.58,.62],edgeSwayPx:.2,droneDb:2});function Nh(t,e,n,i){let r=3*t,s=3*(n-t)-r,o=1-r-s,a=3*e,l=3*(i-e)-a,c=1-a-l,u=d=>((o*d+s)*d+r)*d,f=d=>((c*d+l)*d+a)*d,h=d=>(3*o*d+2*s)*d+r;return function(g){if(g<=0)return 0;if(g>=1)return 1;let x=g;for(let _=0;_<8;_++){let M=u(x)-g;if(Math.abs(M)<1e-6)return f(x);let v=h(x);if(Math.abs(v)<1e-6)break;x-=M/v}let m=0,p=1;x=g;for(let _=0;_<24;_++){let M=u(x);if(Math.abs(M-g)<1e-6)break;M<g?m=x:p=x,x=(m+p)/2}return f(x)}}var dD=Object.freeze({camera:Object.freeze([.7,0,.15,1]),reveal:Object.freeze([.16,1,.3,1]),phosphor:Object.freeze([.2,0,0,1])}),cy=Object.freeze({camera:Nh(.7,0,.15,1),reveal:Nh(.16,1,.3,1),phosphor:Nh(.2,0,0,1),linear:t=>t<=0?0:t>=1?1:t,sine:t=>.5-.5*Math.cos(Math.PI*(t<=0?0:t>=1?1:t))}),Ee=Object.freeze({dive:1600,diveFirst:2400,diveFirstScale:1.375,diveFirstHold:200,diveSwapAt:1200,diveSwapAtFirst:1850,recall:1200,recallSwapAt:1e3,recallRatchetMs:40,liftBase:900,liftPerBoundary:280,liftMax:1800,slice:280,sliceSwap:140,depart:240,arrive:600,readableOut:120,retargetMin:600,retargetFactor:.8,skipSpeed:3,interactiveU:.7,releaseSourceMs:300,tierFreezeMs:300,unfold:1600,unfoldFirst:2200,refold:900,memberFocus:900,memberBack:600,shluz:1400,shluzBack:900,extract:600,workshop:1200,zenith:2400,nadirFirst:2800,focusReduced:160,bootDesktop:7200,bootReturning:3500,bootSameDay:2e3,bootReduced:2e3,lockStep:220,lockStepSameDay:110,firstLock:3400,ignite:4940,ignitionReturning:2640,typeMsPerChar:28,scanMs:800,burnMsPerLetter:70,burnCoolMs:1200,assemble:480,drawIn:600,phoneActivateWindow:1500,phonePartialHold:2500,phonePartialDrift:900,phoneHintDelay:2200,phoneHintReturning:4e3,lockIn:480,lockInReduced:160,revealMsPerChar:12,revealMax:240,beamCps:22,phosphor:900,statusIn:240,statusHold:4e3,idleRotate:2e4,leadDefault:4e3,leaderDraw:240,leaderStagger:40,labelLowpass:120,coordHz:10,keyHoverTrigger:120,keyHoverIn:480,keyHoverOut:520,dimsDraw:240,navHover:240,navTwin:240,longPress:800,relaunch:2e3,relaunchRingDelay:300,hintGlint:1200,overpullHold:600,stringRing:900,stringFlash:120,shudder:240,hintArriveWindow:3e4,idleLampMs:3e3,lampSweepMs:9e3,lampBlendMs:600,shardFlight:900,electrum:2500,electrumCool:600});var uy=Math.log(1e3),pD=Object.freeze([-1,0,1,2]),hy=1.5,Vm=Object.freeze({near:.002,far:400}),Rr=Object.freeze({min:3.2,max:12,rest:7.2,wheelFactor:1.1,wheelStepPx:100}),mD=Object.freeze({d0:12,k:uy,wheelDiv:2400,pinchGain:1.5,pauseMs:400,decay:.92,elevationDeg:8,settleIdleMs:600,settleMs:1600,settleTo:7.2,leadMs:4e3,strutTickMax:30,stages:Object.freeze([["КЛЮЧ",60],["ЗАЛ ЯДРА",600],["VIN",3600],["VIN ЦЕЛИКОМ",12e3]]),passLatticeD:[300,620]}),fy=Object.freeze({d0:.06,k:uy,miniKeyBelow:.05}),gD=Object.freeze({height:2400,diameter:1240,radius:620}),Wo=Object.freeze({H:2.4,R:.62,k:1.35,halfH:1.2});function It(t){let e=Math.min(1,Math.abs(t)/Wo.halfH);return Wo.R*(1-Math.pow(e,Wo.k))}var Zt=Object.freeze([{i:0,sign:"S",code:"SIGNAL",top:1.2,bot:.98,n:3,hollow:0,k:72},{i:1,sign:"A",code:"ARCHIVE",top:.96,bot:.66,n:5,hollow:0,k:120},{i:2,sign:"M",code:"MEMBERS",top:.64,bot:.28,n:7,hollow:0,k:168},{i:3,sign:"•",code:"CORE",top:.26,bot:-.26,n:12,hollow:.3,k:288},{i:4,sign:"V",code:"VOYAGES",top:-.28,bot:-.64,n:7,hollow:0,k:168},{i:5,sign:"I",code:"INSIGNIA",top:-.66,bot:-.96,n:5,hollow:0,k:120},{i:6,sign:"N",code:"NADIR",top:-.98,bot:-1.2,n:3,hollow:0,k:72}].map(t=>Object.freeze({...t,height:Math.round((t.top-t.bot)*1e3)/1e3,mid:(t.top+t.bot)/2,rTop:It(t.top),rBot:It(t.bot),rMax:t.top>0&&t.bot<0?Wo.R:Math.max(It(t.top),It(t.bot))}))),yc=Object.freeze(["S","A","M","•","V","I","N"]),$o=Object.freeze([0,1/3,2/3,1]),Bt=Object.freeze({rest:.02,breath:.026,leanAdd:.01,hover:.09,hoverNeighbourPush:.012,dive:.3,unfold:.42,recallStart:.3}),$t=Object.freeze({radius:1.25,apertureD:.09,ringEngraveW:.004,hollowR:.3,sign:Object.freeze({depth:.004,heightFrac:.7,strokeFrac:.12,face:0}),friezeH:.018,ticksPerFace:12,tickLen:.025,backFace:6,hoverSlide:.06,diveSlide:.25,diveTurnAwayDeg:20,contract:.03,nucleusAnticipation:1.6,lattice:Object.freeze({faceShift:.75,segmentsPerGenerator:8,generators:2016,segments:16128,solidBelowCamDist:2.4}),r1:Object.freeze({spLo:3,spHi:6}),unfold:Object.freeze({camFrom:7.2,camTo:Object.freeze([0,.04,.95]),ringScale:2.4,ringR:1.3,ringArcDeg:300,ringCap:.06,coreRingCap:.12,platesR:.16,plateSize:.05,platesPeriodS:24,orbitYawDeg:35}),pitchFlipDeg:110,pitchResist:.35,pitchResistMaxDeg:30,yawMaxDeg:180,yawReturnMs:2e3}),ni=Object.freeze({r:.035,detail:1,glowR:.0528,breathRingR:.09,apertureAlignDeg:Object.freeze([35,10]),gapOpen:Object.freeze([.03,.09]),minVisibility:.25,hotGain:.4,intensity:Object.freeze([.8,1]),birthdayPulse:1.3}),pr=Object.freeze({half:1.2,extend:3.2,widthPx:2,alphaInside:.35,shootMs:240}),xD=Object.freeze({driftYawDeg:14,driftPeriodS:40,swayDeg:1.5,swayPeriodsS:Object.freeze([11,13,17,19,23,29,31]),faceViewerDeg:16,reindexMs:Object.freeze([23e3,41e3]),reindexBackMs:1600,reindexTurnMs:620,noticeMaxDeg:7,noticeBootDeg:6,tauBaseMs:40,tauStepMs:40,hotDelayMs:220,hotDelayLateMs:90,hotTrackMs:3e3,hotRampMs:1e3,leanSpeedPx:300,leanRadius:1.2,leanDz:.08,flinchSpeedPx:2500,flinchRadius:1.5,flinchInMs:120,flinchRelaxMs:700,flinchScatter:.05,repelR:.35,repelCap:.06,repelBackMs:900}),$a=Object.freeze({T3:24576,T2:16384,T1:8192,annulus:Object.freeze([1.15,1.9]),kepler:.06,jitter:.002,sizePx:Object.freeze([1.2,2]),chunk:4096}),Xo=Object.freeze({faces:Object.freeze([11,0,1]),stratum:3,apertureSkip:.06,dotPx:1.5,emitterM:1.2}),vD=Object.freeze({max:7,size:.1,r:1.05,tiltDeg:12,periodS:90}),yD=Object.freeze({size:.24,r:1.6,periodS:60,bpm:71,arriveDay:10,flyMs:2400});var dy=Object.freeze({SIGNAL:1090,ARCHIVE:810,MEMBERS:460,CORE:0,VOYAGES:-460,INSIGNIA:-810,NADIR:-1090,ZENITH:1260,WORKSHOP:484}),py=Object.freeze({SIGNAL:[980,1200],ARCHIVE:[660,960],MEMBERS:[280,640],CORE:[-260,260],VOYAGES:[-640,-280],INSIGNIA:[-960,-660],NADIR:[-1200,-980],ZENITH:[1200,1400],WORKSHOP:[482,487]}),In=Object.freeze({wallsNear:300,wallsFar:620,wallVis:Object.freeze([.08,.14]),strutSpacing:Object.freeze([13,60]),ringStep:20,irisR:18,irisBlades:7,irisBladeDeg:51.4,irisPassR:12,deckR:60,deckRingStep:4,beadR:1.8,beadStep:25,beadCount:97,coreRimR:300,coreIrisY:260,liftOffset:Object.freeze([12,0,6]),drawCalls:40,triangles:12e4,labels:24,labelsLow:16}),st=Object.freeze({fov:35,fovWide:40,core:Object.freeze({pos:[0,.75,7.2],target:[0,0,0],fov:35,phoneOffsetY:-.06}),boot:Object.freeze({start:[0,.4,16],dolly:9.5,rest:7.2,driftM:.08,driftHz:[.13,.11],tiltDeg:3}),phoneStart:Object.freeze({dist:5.2,keyFrac:.78,centreFrac:.47}),members:Object.freeze({pos:[0,10,48],target:[0,12.5,0],fov:35,phonePos:[0,11,40]}),voyages:Object.freeze({pos:[0,70,44],target:[0,0,-6],fov:35,altRange:[60,140],phonePos:[0,96,30],phonePitchDeg:-70}),archive:Object.freeze({tubeR:9,eyeBelowBand:.4}),signal:Object.freeze({pos:[0,2,26],target:[0,30,0],fov:40,phonePos:[0,2,30],phonePitchDeg:40,apexH:110,apexR:12}),insignia:Object.freeze({pos:[0,1.7,0],fov:40,sphereR:30}),nadir:Object.freeze({depth:110}),zenith:Object.freeze({aboveApex:60,pitchDeg:-62,phonePitchDeg:-70}),workshop:Object.freeze({chamber:4.4,grid:2.4,nodeStep:.4})}),bt=Object.freeze({phoneMaxShort:600,landMaxH:500,desktop:Object.freeze({cols:12,margin:48,gutter:24,chrome:24,edgeInset:14,statusBottom:40,datumFrac:.62}),phone:Object.freeze({cols:4,margin:16,gutter:12,chrome:16,edgeInset:10,statusAboveBand:12,datumPx:120,titleTopPx:72}),measureCh:36,statusMeasureCh:44,hit:44,hitRow:56,crossPx:7,leader:Object.freeze({widthPx:.5,alpha:.7,elbowMin:24,elbowMax:64,runMax:120,maxAnchors:24,maxAnchorsLow:16}),dims:Object.freeze({widthPx:.5,arrowPx:6,extPx:4,gapPx:4,offsetPx:24}),scrim:Object.freeze({scale:1.4,featherPx:40}),nav:Object.freeze({w:56,h:300,hoverW:260,right:24,widthScale:.36,needlePx:12,slotPx:3,zenithDotPx:2,zenithDotAbove:10,twinPx:40,magnetPx:12,wheelPxPerDetent:120,rubber:.35,rubberMax:48,overpullPx:140,letterPx:11}),band:Object.freeze({h:88,sideW:72,letterPx:13,minCell:44}),sheet:Object.freeze({maxFrac:.62,peek:120,handle:24,sideFrac:.44}),elevator:Object.freeze({pxPerHall:360,resistance:.22,tickPx:60}),edge:Object.freeze({pluckPxMs:.4,bendPx:8,twitchPx:2}),sound:Object.freeze({w:32,h:12,bars:8,fps:30}),cursorPx:6,rippleMaxPx:48,beamHeadPx:3,statusDotPx:6}),pn=Object.freeze({r1:Object.freeze({lo:3,hi:6,bayer:8}),r2:Object.freeze({fresnelPow:3,fresnelGain:.55,spec:Object.freeze([[24,.35],[160,.6]])}),r3:Object.freeze({widthPx:1,primaryPx:1.5,axisPx:2,alpha:.55,glintPow:24,glintGain:.9,farFadeStart:.55,primaryEdges:12}),r4:Object.freeze({atlas:1024,atlasLow:512,rakeLo:.55,rakeHi:.9,inlay:.45,heightTaps:4}),r5:Object.freeze({radiusFactor:2.2,elevationDeg:12,idleMs:3e3,sweepMs:9e3,blendMs:600}),r6:Object.freeze({threshold:.82,levels:4,spritePx:64}),r7:Object.freeze({grain:.02,grainBoot:.025,grainBootUntilMs:1800,grainFps:24,clearInPx:120,clearOutPx:180,vignette:.18,vignetteFrom:.35}),r8:Object.freeze({fogVis:Object.freeze([.08,.14])}),dprCap:Object.freeze({T3:2,T2:1.5,T1:1.25}),dprStep:.25,governor:Object.freeze({windowFrames:90,lowFps:52,dropAfterMs:3e3,highFps:58,upgradeAfterMs:1e4}),budget:Object.freeze({drawCalls:40,triangles:12e4,textureMB:12})}),my=30;var be={kind:"desktop",isPhone:!1,w:0,h:0,dpr:1,safe:{t:0,r:0,b:0,l:0}},Xa=null;function EA(){if(typeof document>"u"||!document.body)return;Xa||(Xa=document.createElement("div"),Xa.setAttribute("aria-hidden","true"),Xa.style.cssText="position:fixed;left:0;top:0;width:0;height:0;visibility:hidden;pointer-events:none;padding:env(safe-area-inset-top,0px) env(safe-area-inset-right,0px) env(safe-area-inset-bottom,0px) env(safe-area-inset-left,0px)",document.body.appendChild(Xa));let t=getComputedStyle(Xa);be.safe.t=parseFloat(t.paddingTop)||0,be.safe.r=parseFloat(t.paddingRight)||0,be.safe.b=parseFloat(t.paddingBottom)||0,be.safe.l=parseFloat(t.paddingLeft)||0}var Gm=null;function RA(){try{return Gm||(Gm=matchMedia("(pointer: coarse)")),Gm.matches}catch{return!1}}function kh(){if(typeof window>"u")return!1;let t=Math.max(1,Math.round(window.innerWidth||document.documentElement.clientWidth||1)),e=Math.max(1,Math.round(window.innerHeight||document.documentElement.clientHeight||1)),n=RA()&&Math.min(t,e)<=bt.phoneMaxShort,i=n?e<bt.landMaxH?"phone-land":"phone":"desktop",r=window.devicePixelRatio||1,s=be.safe.t,o=be.safe.r,a=be.safe.b,l=be.safe.l;EA();let c=t!==be.w||e!==be.h||i!==be.kind||r!==be.dpr||s!==be.safe.t||o!==be.safe.r||a!==be.safe.b||l!==be.safe.l;return be.w=t,be.h=e,be.kind=i,be.isPhone=n,be.dpr=r,c}var Hm=0;function Wm(){if(Hm)return;let t=()=>{Hm=0,kh()&&_e.emit("layout:change",{kind:be.kind,w:be.w,h:be.h})};Hm=typeof requestAnimationFrame=="function"?requestAnimationFrame(t):setTimeout(t,16)}if(typeof window<"u"){kh(),window.addEventListener("resize",Wm),window.addEventListener("orientationchange",Wm);try{matchMedia("(pointer: coarse)").addEventListener("change",Wm)}catch{}}var ee={phase:"boot",room:"CORE",route:{room:"CORE",sub:null,hash:"#/core"},u:0,tier:"T2",soundOn:!0,night:!1,drowsy:!1,birthday:!1,owner:!1,inverted:!1,unfolded:!1,pullNest:0,resonancePct:0,status:"",columns:[],satellites:0,companion:!1,booting:!0,hintTarget:null,show:{active:!1,scene:-1},guests:0,fx:{stage:null}};function Fi(t){let e=ee.phase;t!==e&&(ee.phase=t,_e.emit("phase:change",{phase:t,prev:e}))}var Yo={operator:{id:"sam",name:"Сэм",aliases:["сэм","sam","сэмми","семён","semyon"],callsign:"ВЕДУЩИЙ",birthday:"2018-04-12",heightM:1.3,papaHeightM:null},clan:{name:"SAM.VIN",motto:"Ни один — не один.",about:"Играем всерьёз. Тех, кто слабее, защищаем ещё серьёзнее — в игре и в жизни.",founded:"2025-03-14",frequency:14.03,sigil:[[3,21],[21,45],[45,27],[27,3],[21,27],[3,45]],code:["Ждать — тоже сила.","Дал слово — держи.","Команда важнее меня.","Новенький — уже свой.","Всё по-честному.","Слово сильнее кулака.","Не проходим мимо."]},members:[{id:"sam",name:"Сэм",callsign:"ВЕДУЩИЙ",role:"основатель",status:"на связи",level:12,missions:21,seed:7,note:"D4",glyph:null,trait:"Придумал клан на перемене. Зовёт всех и ждёт каждого.",joke:"Говорит «я рядом», когда он на другом конце карты.",achievements:["start","bridge","onehp","newbie","peace"]},{id:"lev",name:"Лёва",callsign:"ЯКОРЬ",role:"защита",status:"на связи",level:11,missions:17,seed:23,note:"G3",glyph:[[3,38],[9,11],[38,29],[38,33]],trait:"Если Лёва держит точку — точка держится.",joke:"Знает все карты наизусть. Даже те, которых нет.",achievements:["start","bridge","newbie"]},{id:"tim",name:"Тимур",callsign:"ЭХО",role:"поиск",status:"в пути",level:9,missions:14,seed:41,note:"A3",glyph:[[21,9],[9,39],[39,27]],trait:"Слышит соперника раньше, чем тот появится.",joke:"Всегда приходит последним — и спасает всех.",achievements:["three"]},{id:"kira",name:"Кира",callsign:"ЛИСА",role:"наблюдение",status:"на связи",level:10,missions:15,seed:5,note:"B3",glyph:[[8,38],[38,12],[12,8],[8,2],[12,4]],trait:"Видит то, что пропустили все.",joke:"Однажды спряталась так, что её не нашли до конца матча.",achievements:["silent","three","peace"]},{id:"danya",name:"Даня",callsign:"ГРОМ",role:"заводила",status:"отдыхает",level:8,missions:11,seed:17,note:"E4",glyph:[[4,23],[23,25],[25,44]],trait:"Громкий только в голосовом чате.",joke:"Прыгнул через пропасть. Долетел. До сих пор этим гордится.",achievements:["roof"]},{id:"misha",name:"Миша",callsign:"КОМЕТА",role:"связь",status:"в пути",level:7,missions:9,seed:31,note:"G4",glyph:[[36,12],[36,26],[36,18]],trait:"Быстрый. Иногда слишком.",joke:"Первым добежал до финиша. В другую сторону.",achievements:["pizza"]},{id:"ars",name:"Арсений",callsign:"ТИШИНА",role:"идеи",status:"на связи",level:3,missions:2,seed:13,note:"A4",glyph:[[21,27],[24,17]],trait:"Пришёл новеньким. Уже удивил всех.",joke:"Спросил, где кнопка «победить». Мы ищем до сих пор.",achievements:["newbie"]}],missions:[{code:"001",title:"Первая высадка",status:"done",where:"игра",brief:"Первый матч клана в полном составе.",conditions:["4 игрока","одна попытка"],crew:["sam","lev","tim","kira"],result:"Проиграли 0:12. Но вместе.",reward:"start",log:"Зонд нашёл на месте высадки старый флаг клана. Он всё ещё там."},{code:"002",title:"Мост над пропастью",status:"done",where:"игра",brief:"Перебраться всей командой. Никто не должен упасть.",conditions:["вся команда","без возрождений"],crew:["sam","lev","danya","misha"],result:"Упали двое. Вернулись.",reward:"bridge",log:"Зонд проверил мост. Мост держится. Лёва, видимо, тоже."},{code:"003",title:"Тихая гавань",status:"done",where:"игра",brief:"Удержать маяк до заката и ни разу не потерять связь.",conditions:["втроём","никого не бросить","до заката"],crew:["sam","kira","tim"],result:"Маяк горит. Связь — сто процентов.",reward:"silent",log:"Зонд вернулся. На маяке кто-то оставил пиццу."},{code:"004",title:"Северная башня",status:"active",where:"игра",brief:"Добраться до вершины втроём.",conditions:["3 игрока","без возрождений"],crew:["sam","lev","ars"],result:"",reward:"tower",log:"Зонд долетел до середины башни. Вершина видна. Она высокая."},{code:"005",title:"Ночная смена",status:"new",where:"игра",brief:"Продержаться до рассвета. Говорить только шёпотом.",conditions:["4 игрока","шёпотом","до рассвета"],crew:[],result:"",reward:"night",log:"Зонд слушал всю ночь. Кто-то храпел. Не будем говорить кто."},{code:"006",title:"Тёмная вода",status:"locked",decodeDays:5,where:"игра",brief:"Найти, откуда идёт сигнал под водой.",conditions:["5 игроков","с фонарями"],crew:[],result:"",reward:null,log:"Зонд нырнул. Сигнал идёт снизу. Там что-то светится."},{code:"007",title:"Город без карты",status:"locked",unlockAtDays:7,where:"игра",brief:"Пройти город, где никто не был, и нарисовать его карту.",conditions:["весь клан","без подсказок"],crew:[],result:"",reward:null,log:"Зонд нарисовал карту. Город похож на ключ. Совпадение?"},{code:"008",title:"Сто ступеней",status:"locked",unlockAtDays:14,where:"игра",brief:"Подняться по самой длинной лестнице, не упав ни разу.",conditions:["2 игрока","ни одного падения"],crew:[],result:"",reward:null,log:"Зонд насчитал 101 ступень. Одна была лишняя."},{code:"000",title:"Исток",status:"sealed",where:"игра",brief:"Вернуться туда, где всё началось, и оставить там свой знак.",conditions:["весь клан","знак лидера"],crew:[],result:"",reward:"origin",log:"Зонд вернулся с фото первого матча. Все улыбаются. Даже проигравшие."},{code:"009",title:"Новенький — в игру",status:"done",where:"жизнь",brief:"В классе новенький. Позвать его в игру и познакомить со всеми.",conditions:["вся команда","по-доброму","в первый же день"],crew:["sam","lev","ars"],result:"Арсений теперь в клане. И уже зовёт других.",reward:"newbie",log:"Зонд облетел школьный двор. Новенький там больше не один."},{code:"010",title:"Мир на перемене",status:"done",where:"жизнь",brief:"Двое друзей поссорились. Помочь им договориться — без крика и не выбирая, кто прав.",conditions:["словами","выслушать обоих","без крика"],crew:["sam","kira"],result:"Договорились. Теперь играют в одной команде.",reward:"peace",log:"Зонд прислушался. На перемене снова смеются вдвоём."},{code:"011",title:"Заступиться словом",status:"active",where:"жизнь",brief:"Если кого-то обижают — встать рядом и спокойно сказать: «Так нельзя». Если нужно — позвать взрослого.",conditions:["словами","вместе","спокойно"],crew:["sam","lev","kira"],result:"",reward:"shield",log:"Зонд облетел школу. Если кого-то обидят, клан будет рядом."},{code:"012",title:"Игра для всех",status:"new",where:"жизнь",brief:"Придумать игру на перемене, в которую возьмут каждого, кто захочет. Даже тех, кто стоит в стороне.",conditions:["весь клан","берём каждого","честные правила"],crew:[],result:"",reward:"allgame",log:"Зонд облетел площадку. Места хватит всем. Осталось придумать игру."},{code:"013",title:"Не пройти мимо",status:"new",where:"жизнь",brief:"Кому-то во дворе нужна помощь. Заметить, позвать своих и помочь — вместе.",conditions:["вся команда","не проходить мимо"],crew:[],result:"",reward:null,log:"Зонд видел во дворе малыша с большим мешком. Вчетвером такой мешок нести легко."}],achievements:[{id:"start",title:"Начало",shape:"nested",rarity:"обычная",earned:!0,date:"2025-03-15",where:"игра",who:["sam","lev","tim","kira"],text:"Мы сыграли первый матч вместе."},{id:"roof",title:"Прыжок через пропасть",shape:"knot",rarity:"легендарная",earned:!0,date:"2025-05-30",where:"игра",who:["danya"],text:"Никто не верил. Гром прыгнул. Гром долетел."},{id:"bridge",title:"Мост выстоял",shape:"twisted",rarity:"редкая",earned:!0,date:"2025-06-02",where:"игра",who:["sam","lev","danya","misha"],text:"Мост качался. Мы держали его, пока не перешли все."},{id:"three",title:"Трое за всех",shape:"stellated",rarity:"легендарная",earned:!0,date:"2025-08-19",where:"игра",who:["tim","kira","sam"],text:"Нас было трое. Мы вернулись за каждым, кто отстал, и дошли вместе."},{id:"silent",title:"Тишина в эфире",shape:"bipyramid",rarity:"редкая",earned:!0,date:"2025-09-27",where:"игра",who:["kira","tim","sam"],text:"Целый раунд без единого слова. И победили."},{id:"onehp",title:"Победа с 1 HP",shape:"stellated",rarity:"редкая",earned:!0,date:"2025-12-20",where:"игра",who:["sam"],text:"Одна жизнь. Одна попытка. Этого хватило."},{id:"pizza",title:"Пицца-протокол",shape:"nested",rarity:"обычная",earned:!0,date:"2026-01-04",where:"игра",who:["misha","danya"],text:"Перерыв на пиццу посреди решающего матча. Всё равно выиграли."},{id:"tower",title:"Северная башня",shape:"bipyramid",rarity:"редкая",earned:!1,where:"игра",text:"Подняться на вершину втроём."},{id:"night",title:"Ночная смена",shape:"knot",rarity:"обычная",earned:!1,where:"игра",text:"Продержаться до рассвета шёпотом."},{id:"hundred",title:"Сотня",shape:"twisted",rarity:"легендарная",earned:!1,where:"игра",text:"Сыграть сто матчей вместе."},{id:"origin",title:"Исток",shape:"stellated",rarity:"легендарная",earned:!1,where:"игра",text:"Пройти вылазку 000."},{id:"newbie",title:"Новенький — свой",shape:"nested",rarity:"обычная",earned:!0,date:"2026-04-15",where:"жизнь",who:["sam","lev","ars"],text:"Арсений пришёл новеньким. В тот же день он был в команде."},{id:"peace",title:"Договорились",shape:"twisted",rarity:"редкая",earned:!0,date:"2026-05-20",where:"жизнь",who:["sam","kira"],text:"Двое друзей поссорились. Мы выслушали обоих. Они помирились."},{id:"shield",title:"Заступиться словом",shape:"bipyramid",rarity:"легендарная",earned:!1,where:"жизнь",text:"Заступиться за того, кого обижают. Словами и вместе."},{id:"allgame",title:"Игра для всех",shape:"stellated",rarity:"редкая",earned:!1,where:"жизнь",text:"Придумать игру, в которую берут каждого."}],legends:[{id:"found",date:"2025-03-14",kind:"эпичное",title:"Основание",where:"игра",text:"Три человека, один ноутбук, ноль побед. Так всё началось."},{id:"jump",date:"2025-05-30",kind:"победа",title:"Прыжок через пропасть",where:"игра",text:"Никто не верил. Гром прыгнул. Гром долетел."},{id:"nights",date:"2025-11-14",kind:"эпичное",title:"Ночь трёх возрождений",where:"игра",text:"Остался один. Поднял всех. Никто до сих пор не понимает как."},{id:"wifi",date:"2026-03-12",kind:"смешное",title:"Великое падение Wi-Fi",where:"игра",text:"Мы почти выиграли. Почти. Роутер помнит всё."},{id:"seventh",date:"2026-04-15",kind:"эпичное",title:"Седьмой",where:"жизнь",text:"Новенький стоял один у стены. Сэм позвал его в игру. Так в клане стало семеро."},{id:"recess",date:"2026-05-20",kind:"эпичное",title:"Мир на перемене",where:"жизнь",text:"Двое не разговаривали неделю. Клан позвал обоих в одну игру. Теперь они в одной команде."}],moments:[{id:"hide",date:"2025-04-20",title:"Лучшее укрытие",who:["kira"],where:"игра",text:"Кира спряталась так хорошо, что её не нашли до конца матча. Даже свои."},{id:"bug",date:"2025-07-08",title:"Великий баг на мосту",who:["danya"],where:"игра",text:"Мост исчез у всех, кроме Дани. Даня стоял в воздухе и не понимал, почему все кричат."},{id:"room",date:"2025-10-02",title:"Секретная комната",who:["lev"],where:"игра",text:"Лёва нашёл секретную комнату и двадцать минут не мог из неё выйти."},{id:"wrong",date:"2026-02-15",title:"Не туда",who:["misha"],where:"игра",text:"Миша первым добежал до финиша. В другую сторону."},{id:"button",date:"2026-06-01",title:"Кнопка «победить»",who:["ars"],where:"игра",text:"Арсений спросил, где кнопка «победить». Мы ищем до сих пор."},{id:"mic",date:"2026-08-23",title:"Тихий план",who:["tim"],where:"игра",text:"Тимур полчаса рассказывал план. Микрофон был выключен. План сработал всё равно."},{id:"umbrella",date:"2026-04-28",title:"Зонт на троих",who:["lev","kira"],where:"жизнь",text:"Лёва и Кира поделили зонт с первоклассником, которого даже не знали. Теперь знают."},{id:"slide",date:"2026-09-18",title:"Горка для всех",who:["sam"],where:"жизнь",text:"Старшие не пускали малышей на горку. Сэм не стал толкаться — он договорился. Теперь горка общая."},{id:"yard",date:"2026-09-25",title:"Давайте вместе?",who:["sam","misha","danya","tim"],where:"жизнь",text:"После праздника двор был весь в фантиках. Сэм сказал: «Давайте вместе?» Через десять минут было чисто."}],jokes:[{id:"key",date:"2025-03-20",hidden:!1,trigger:"ключ",text:"Кто взял ключ? — Никто не брал ключ."},{id:"cover",date:"2025-06-10",hidden:!1,trigger:"прикрывал",text:"Я не отстал. Я прикрывал."},{id:"maps",date:"2025-09-01",hidden:!0,trigger:"карты",text:"Правило №1: не спорить с Лёвой про карты."},{id:"micro",date:"2025-10-15",hidden:!0,trigger:"микрофон",text:"Кто опять забыл включить микрофон?"},{id:"pizza",date:"2026-01-04",hidden:!0,trigger:"пицца",text:"ПИЦЦА-ПРОТОКОЛ АКТИВИРОВАН."},{id:"tactic",date:"2026-04-01",hidden:!0,trigger:"манёвр",text:"Это был тактический манёвр."},{id:"lava",date:"2025-03-20",hidden:!1,trigger:"лава",text:"Своих не бросаем. Даже в лаве."}],transmissions:[{from:"VIN",text:"Добро пожаловать в VIN. Здесь всё ваше."},{from:"VIN",text:"Новая вылазка откроется в субботу. Готовьтесь."},{from:"ПАПА",text:"Горжусь вашим кланом. Конец связи."},{from:"VIN",text:"Напоминание: вода — тоже снаряжение."},{from:"VIN",text:"На маяке нашли пиццу. Расследование продолжается."},{from:"МАМА",text:"Уроки — это тоже миссия. Секретная."},{from:"VIN",text:"Сегодня отличный день, чтобы найти что-нибудь новое."},{from:"VIN",text:"Если увидишь кита — передай привет."},{from:"ПАПА",text:"Тот, кто читает эту передачу, — молодец. Да, ты."},{from:"VIN",text:"Ключ светится ярче, когда вы вместе."},{from:"ПАПА",text:"Видел, как вы позвали новенького. Вот это клан."},{from:"VIN",text:"Клан играет в игры. А защищает — везде."}],signal:{secret:"Частота 14.03 — день, когда всё началось. Ты её нашёл. Об этом знают только свои."},capsule:{openAfterDays:7,text:"Если ты это читаешь — ты вернулся. Настоящий исследователь всегда возвращается. — Папа"},zenith:{message:"Отсюда видно всё, что вы построили. Это только начало."},nadir:{origin:"Всё началось 14 марта 2025 года. Сэм придумал название на перемене: SAM.VIN. Первый матч мы проиграли 0:12. Никто не ушёл. Потом мы поняли: команда нужна не только в игре. С тех пор ключ светится."},night:{from:21,to:7,drowsyFrom:20,story:"Ночью в VIN тихо. Узлы светятся вполсилы, как окна в доме, где все уже спят."},companion:{name:"Искра"}};function $m(t){let e=Math.max(0,Math.min(48,t|0));return{x:e%7/6,y:Math.floor(e/7)/6}}function gy(t){if(typeof t=="number")return Number.isFinite(t)?Math.round(t):NaN;if(typeof t=="string"&&t.trim()!==""){let e=Number(t.trim());return Number.isFinite(e)?Math.round(e):NaN}return NaN}function qo(t){let e=[];if(!Array.isArray(t))return e;let n=new Set;for(let i=0;i<t.length&&e.length<24;i++){let r=t[i];if(!Array.isArray(r)||r.length!==2)continue;let s=gy(r[0]),o=gy(r[1]);if(!(s>=0&&s<=48&&o>=0&&o<=48)||s===o)continue;let a=Math.min(s,o),l=Math.max(s,o),c=a*64+l;n.has(c)||(n.add(c),e.push([a,l]))}return e}function _c(t){let e=t>>>0;return function(){e=e+1831565813>>>0;let i=e;return i=Math.imul(i^i>>>15,i|1),i^=i+Math.imul(i^i>>>7,i|61),((i^i>>>14)>>>0)/4294967296}}function Xm(t){let e=2166136261,n=String(t);for(let i=0;i<n.length;i++)e^=n.charCodeAt(i),e=Math.imul(e,16777619);return e>>>0}var RD=.5*(Math.sqrt(3)-1),CD=(3-Math.sqrt(3))/6,PD=new Float32Array([1,1,-1,1,1,-1,-1,-1,1,0,-1,0,0,1,0,-1]);function Bh(t,e,n,i){let r=Math.floor(Math.abs(Number(t)||0)),s=r%10,o=r%100;return o>=11&&o<=14?i:s===1?e:s>=2&&s<=4?n:i}function CA(t){let e="";for(let n=0;n<t.length;n++)n>0&&(t.length-n)%3===0&&(e+=" "),e+=t[n];return e}function vy(t,e=2){let n=Number(t)||0,i=Math.abs(n).toFixed(e),r=i.indexOf("."),s=r>=0?i.slice(0,r):i,o=r>=0?i.slice(r):"";return(Number(i)===0?"±":n>0?"+":"−")+CA(s)+o}var xy=t=>(t<10?"0":"")+t;function io(t,e="dd.mm.yyyy"){if(t==null)return"";let n=String(t),i,r,s,o=/^(\d{4})-(\d{2})-(\d{2})$/.exec(n);if(o)i=+o[1],r=+o[2],s=+o[3];else{let l=Date.parse(n);if(!Number.isFinite(l))return"";let c=new Date(l);i=c.getFullYear(),r=c.getMonth()+1,s=c.getDate()}let a=`${xy(s)}.${xy(r)}`;return e==="dd.mm"?a:`${a}.${i}`}function Cr(t){return String(t??"").toLocaleUpperCase("ru")}var yy=Object.freeze({"boot.pointer":{text:"вижу тебя.",p:3},"boot.nopointer":{text:"система проснулась.",p:3},"return.sameDay":{text:"снова ты.",p:3},"return.days":{text:"ты вернулся. тебя не было {N} {N:день|дня|дней}.",p:3},"return.days.owner":{text:"привет, {name}. тебя не было {N} {N:день|дня|дней}.",p:3},"return.node":{text:"пока тебя не было: +1 узел.",p:2},night:{text:"спокойной ночи, {name}.",p:3},drowsy:{text:"скоро ночь.",p:3},"night.flinch":{text:"ещё не сплю.",p:1},"tab.back":{text:"вот ты где.",p:3},"drawing.boot":{text:"помню твой рисунок.",p:3},"drawing.saved":{text:"запомнил.",p:1},"glyph.saved":{text:"запомнил.",p:1},"probe.sent":{text:"зонд {code} в пути. вернётся завтра.",p:1},"probe.back":{text:"зонд {code} вернулся. есть запись.",p:2},"transmission.new":{text:"пришла передача.",p:2},"mission.decoded":{text:"вылазка {code} расшифрована.",p:2},"companion.far":{text:"кто-то летит к нам.",p:2},"companion.near":{text:"он ближе. осталось {n} {n:день|дня|дней}.",p:2},"companion.arrived":{text:"он прилетел. его зовут {name}.",p:1},"capsule.open":{text:"капсула открыта.",p:1},birthday:{text:"с днём рождения, {name}!",p:2},anniversary:{text:"сегодня {title}. {years} {years:год|года|лет} назад.",p:2},found:{text:"найдено.",p:1},shard:{text:"осколок {k} из 5 на месте.",p:1},"nadir.open":{text:"внизу что-то открылось.",p:1},rank:{text:"новый ранг: {rank}.",p:1},dizzy:{text:"всё кружится.",p:1},"dizzy.after":{text:"уже лучше.",p:1},whale:{text:"смотри. кит.",p:1},drone:{text:"дрон принёс шутку.",p:1},pull:{text:"ты всё ещё внутри sam.vin.",p:1},relaunch:{text:"сплю. разбуди меня.",p:1},"member.typed":{text:"{callsign} на связи.",p:1},"hint.done":{text:"пока всё найдено.",p:1},"hint.time":{text:"остальное придёт само. возвращайся.",p:1},sealed:{text:"запечатано. осколков {k} из 5.",p:1},"route.missing":{text:"здесь ничего нет. пока.",p:1},"idle.nodes":{text:"{n} {n:узел горит|узла горят|узлов горят}.",p:5},"idle.mission":{text:"вылазка {code} ждёт.",p:5},echo:{text:"эхо от стены: {m} м.",p:4},"guests.in":{text:"гости приняты.",p:1},"guests.none":{text:"покажу сам.",p:4},"sbor.done":{text:"клан откликнулся.",p:1},"code.new":{text:"новое правило клана.",p:1},"lost.here":{text:"кто-то маленький потерялся.",p:4},"lost.saved":{text:"ты не прошёл мимо.",p:1},"lost.gentle":{text:"ты был бережным.",p:1},"pair.here":{text:"двое не слышат друг друга.",p:4},"pair.done":{text:"договорились.",p:1},"pair.fact":{text:"ты помог им услышать друг друга.",p:1},"proposal.saved":{text:"записано. покажи папе.",p:1},"proposal.real":{text:"твоя вылазка {code} стала настоящей.",p:2},"reply.saved":{text:"ответ сохранён. покажи папе.",p:1},"show.dark":{text:"разбуди меня.",p:1}});var zh=Wa.inhaleMs/Wa.periodMs,Ln={value:0,phase:0,periodMs:Wa.periodMs,amp:Gt.reducedMotion?Wa.reducedAmp:1,setPeriod(t){t>0&&(Ln.periodMs=t)},held:!1,hold(t){Ln.held=!!t},mix(t,e){return t+(e-t)*(.5+(Ln.value-.5)*Ln.amp)}};function PA(t){return t<zh?.5-.5*Math.cos(Math.PI*(t/zh)):.5+.5*Math.cos(Math.PI*((t-zh)/(1-zh)))}var Ya=new Map,IA=1;function ot(t,e){let n=IA++;return Ya.set(n,{at:pe.now+Math.max(0,t||0),fn:e}),n}function Vn(t){Ya.delete(t)}var qa=new Set;function qn(t,e,n){let i,r=new Promise(o=>{i=o}),s={start:pe.now,ms:Math.max(0,t||0),fn:e,ease:n||null,resolve:i,live:!0};if(s.ms===0){try{e(1)}finally{i()}return{done:r,cancel(){}}}return qa.add(s),{done:r,cancel(){s.live&&(s.live=!1,qa.delete(s),i())}}}var bc=[],Ym=-1,qm=0;function LA(t,e){t.at<=qm&&bc.push(e)}function DA(t){let e=(qm-t.start)/t.ms;if(e>=1){t.live=!1,qa.delete(t);try{t.fn(1)}catch(n){lt("clock:tween","tween callback threw",n)}t.resolve()}else{let n=e<=0?0:e;try{t.fn(t.ease?t.ease(n):n)}catch(i){lt("clock:tween","tween callback threw",i),t.live=!1,qa.delete(t),t.resolve()}}}function NA(t,e){qm=e,Ln.amp=Gt.reducedMotion?Wa.reducedAmp:1;let n=Ym<0?0:Math.max(0,e-Ym);Ym=e;let i=Math.min(1,Math.max(0,+pe.timeScale||0));if(Ln.phase=(Ln.phase+n*i*(Ln.held?0:1)/Ln.periodMs)%1,Ln.value=PA(Ln.phase),Ya.size){bc.length=0,Ya.forEach(LA);for(let r=0;r<bc.length;r++){let s=Ya.get(bc[r]);if(s){Ya.delete(bc[r]);try{s.fn()}catch(o){lt("clock:after","timer callback threw",o)}}}}qa.size&&qa.forEach(DA)}function _y(){pe.add(NA,zt.CLOCK)}try{_y()}catch{Promise.resolve().then(_y)}var qr=[],Ui=null,ro=null,jo=0,jm=0,OA=0,Vh=0;function FA(t,e){return t.replace(/\{(\w+)(?::([^|}]*)\|([^|}]*)\|([^}]*))?\}/g,(n,i,r,s,o)=>{let a=e?e[i]:void 0;return a==null?n:r!=null?Bh(a,r,s,o):String(a)})}function UA(t){ii.current=t,ee.status=t.text,ro&&(ro.textContent=t.text),Ui&&(Ui.classList.remove("is-in"),Ui.textContent=t.text,Vh&&cancelAnimationFrame(Vh),Vh=requestAnimationFrame(()=>{Vh=0,Ui.classList.add("is-in")})),jo&&Vn(jo),jo=ot(Ee.statusHold,kA),_e.emit("status:show",{key:t.key,text:t.text,p:t.p})}function Zm(){return!ii.current||pe.now-ii.current.at>=Ee.statusHold}function kA(){jo=0,qr.length&&Gh(qr.shift())}function Gh(t){t.at=pe.now,UA(t)}function BA(t){if(qr.some(n=>n.text===t.text))return;let e=qr.length;for(;e>0&&qr[e-1].p>t.p;)e--;qr.splice(e,0,t),qr.length>4&&qr.pop()}function zA(){for(let t=0;t<2;t++){if(OA++%2===0)return{key:"idle.nodes",vars:{n:Y.litNodes|0}};let n=xt.missions||[];for(let i=0;i<n.length;i++){let r=null;try{r=Hh(n[i])}catch{r=null}if(r&&(r.state==="active"||r.state==="new"))return{key:"idle.mission",vars:{code:r.numberShown||n[i].code}}}}return{key:"idle.nodes",vars:{n:Y.litNodes|0}}}function by(){if(jm=ot(Ee.idleRotate,by),ee.booting||qr.length||!Zm())return;let t=ii.current;if(t&&t.p<5&&pe.now-t.at<Ee.idleRotate)return;let e=zA();ii.say(e.key,e.vars)}var ii={current:null,init(t){let e=document.getElementById("chrome");return Ui=document.getElementById("status"),!Ui&&e&&(Ui=document.createElement("p"),Ui.id="status",Ui.className="t-status",Ui.setAttribute("aria-hidden","true"),e.appendChild(Ui)),ro=document.getElementById("status-live"),ro&&ro.getAttribute("aria-live")!=="polite"&&ro.setAttribute("aria-live","polite"),jm||(jm=ot(Ee.idleRotate,by)),ii},say(t,e={},n={}){let i=yy[t];if(!i)return!1;let r={key:t,text:FA(i.text,e),p:i.p,at:0},s=ii.current;return s&&s.text===r.text&&!Zm()?!0:n&&n.force||!s||Zm()||r.p===1&&s.p>1?(Gh(r),!0):(BA(r),!0)},clear(){qr.length=0,ii.current=null,ee.status="",jo&&(Vn(jo),jo=0),Ui&&(Ui.classList.remove("is-in"),Ui.textContent=""),ro&&(ro.textContent="")}};var VA={done:"ЗАВЕРШЕНА",active:"В ПУТИ",new:"НОВАЯ",sealed:"ЗАПЕЧАТАНА"};function GA(t){let e=t.decodeDays!=null?t.decodeDays:t.unlockAtDays;return t.status!=="locked"||!e?null:Math.min(100,Math.round(100*Y.distinctDays/e))}function Hh(t){let e=t,n=Y.data||{},i=e.status,r=GA(e);i==="sealed"&&n.nadirOpen&&(i="new"),i==="locked"&&r===100&&(i="new");let s=null;if(i==="locked")if(e.decodeDays!=null)s="Расшифровка идёт. Возвращайся завтра — будет больше.";else{let l=Math.max(1,e.unlockAtDays-Y.distinctDays);s=`Откроется через ${l} ${Bh(l,"день","дня","дней")}.`}else i==="sealed"&&(s="Ключ к ней — в самом низу.");let o=Array.isArray(n.decoded)?n.decoded:[],a=Km(e.code);return{code:e.code,title:e.title,state:i,label:i==="locked"?`СИГНАЛ ЗАШИФРОВАН ${r}%`:VA[i],p:e.status==="locked"?r:null,numberShown:i==="locked"?"0??":e.code,lockedText:s,decodeReady:e.status==="locked"&&r===100&&!o.includes(e.code),probe:a,canProbe:(i==="done"||i==="active"||i==="new")&&a==="none",mission:e}}function Km(t){let e=Y.data&&Y.data.probes?Y.data.probes[t]:null;return e?e.back?"back":"out":"none"}var Jm=["operator","clan","members","missions","achievements","legends","moments","jokes","transmissions","signal","capsule","zenith","nadir","night","companion"],Ty={members:12,missions:24,achievements:24,legends:32,moments:64,jokes:64,transmissions:400},HA=["G2","A2","B2","D3","E3","G3","A3","B3","D4","E4","G4","A4","B4","D5","E5","G5","A5","B5","D6","E6","G6","A6","B6","D7"],WA=["D4","G3","A3","B3","E4","G4","A4","B4","D5","E5","G5","A5"],My=["stellated","twisted","nested","bipyramid","knot"],ja=t=>t!==null&&typeof t=="object"&&!Array.isArray(t),Dn=(t,e)=>t[e]!==void 0&&t[e]!==null,Sc=t=>typeof structuredClone=="function"?structuredClone(t):JSON.parse(JSON.stringify(t)),hi=t=>{try{return JSON.stringify(t).slice(0,40)}catch{return String(t)}};function Ht(t,e,n,i,r){if(typeof t!="string"&&!(typeof t=="number"&&Number.isFinite(t)))return r(`${i}: ${hi(t)} invalid`),{ok:!1};let s=String(t).normalize("NFC").trim().replace(/\s+/g," ");return s===""&&n?(r(`${i}: empty`),{ok:!1}):(s.length>e&&(s=s.slice(0,e-1)+"…",r(`${i}: longer than ${e}, cut`)),{ok:!0,v:s})}function Ms(t,e,n){if(typeof t!="string"&&typeof t!="number")return n(`${e}: ${hi(t)} invalid`),{ok:!1};let i=String(t).trim().toLowerCase().replace(/[^a-z0-9_-]/g,"");return i?(i.length>24&&(i=i.slice(0,24),n(`${e}: longer than 24, cut`)),i!==String(t)&&n(`${e}: ${hi(t)} → "${i}"`),{ok:!0,v:i}):(n(`${e}: ${hi(t)} invalid`),{ok:!1})}function Sy(t,e,n){return typeof t=="number"&&Number.isInteger(t)&&t>=0&&t<=999?{ok:!0,v:String(t).padStart(3,"0")}:typeof t=="string"&&/^\d{3}$/.test(t.trim())?{ok:!0,v:t.trim()}:(n(`${e}: ${hi(t)} invalid`),{ok:!1})}function wy(t,e,n){if(t<2e3||t>2100||e<1||e>12||n<1)return!1;let i=new Date(Date.UTC(t,e,0)).getUTCDate();return n<=i}function Ka(t,e,n){if(typeof t=="string"){let i=t.trim(),r=/^(\d{4})-(\d{2})-(\d{2})$/.exec(i);if(r&&wy(+r[1],+r[2],+r[3]))return{ok:!0,v:i};if(r=/^(\d{2})\.(\d{2})\.(\d{4})$/.exec(i),r&&wy(+r[3],+r[2],+r[1]))return{ok:!0,v:`${r[3]}-${r[2]}-${r[1]}`}}return n(`${e}: ${hi(t)} invalid date`),{ok:!1}}function e0(t,e){return typeof t=="number"?t:typeof t=="string"&&t.trim()!==""?Number(e?t.trim().replace(",","."):t.trim()):NaN}function bs(t,e,n,i,r){let s=e0(t,!1);if(!Number.isFinite(s))return r(`${i}: ${hi(t)} invalid`),{ok:!1};let o=Math.round(s);return(o<e||o>n)&&(o=Math.min(n,Math.max(e,o)),r(`${i}: ${hi(t)} clamped → ${o}`)),{ok:!0,v:o}}function $A(t,e,n,i,r,s){let o=e0(t,!0);if(!Number.isFinite(o))return s(`${r}: ${hi(t)} invalid`),{ok:!1};let a=Math.pow(10,i),l=Math.round(o*a)/a;return(l<e||l>n)&&(l=Math.min(n,Math.max(e,l)),s(`${r}: ${hi(t)} clamped → ${l}`)),{ok:!0,v:l}}function Ey(t,e,n){return t===!0||t===1||t==="true"||t==="да"?{ok:!0,v:!0}:t===!1||t===0||t==="false"||t==="нет"?{ok:!0,v:!1}:(n(`${e}: ${hi(t)} invalid`),{ok:!1})}function Za(t,e,n,i){if(typeof t=="string"){let r=t.trim().toLowerCase();if(e.includes(r))return{ok:!0,v:r}}return i(`${n}: ${hi(t)} invalid`),{ok:!1}}function Ry(t,e,n){if(!Array.isArray(t))return n(`${e}: not a list`),{ok:!1};let i=qo(t);return i.length!==t.length&&n(`${e}: ${t.length-i.length} edge(s) dropped`),i.length?{ok:!0,v:i}:{ok:!1}}function Ay(t,e,n,i,r,s){let o=e0(t,!0);if(!Number.isFinite(o))return s(`${r}: ${hi(t)} invalid`),{ok:!1};let a=Math.pow(10,i),l=Math.round(o*a)/a;return l<e||l>n?(s(`${r}: ${hi(t)} out of range`),{ok:!1}):{ok:!0,v:l}}var XA=["игра","жизнь"],Wh=(t,e,n)=>ft(t,"where",i=>Za(i,XA,`${e}.where`,n),null);function ft(t,e,n,i){if(!Dn(t,e))return i;let r=n(t[e]);return r.ok?r.v:i}function Cy(t,e,n,i,r,s){if(!Dn(t,e))return[];let o=t[e];if(!Array.isArray(o))return s(`${r}: not a list`),[];let a=[];for(let l=0;l<o.length;l++){if(a.length>=n){s(`${r}: more than ${n}, rest dropped`);break}let c=Ht(o[l],i,!0,`${r}[${l}]`,s);c.ok&&a.push(c.v)}return a}function $h(t,e,n,i,r){if(!Dn(t,e))return[];let s=t[e];if(!Array.isArray(s))return r(`${i}: not a list`),[];let o=[];for(let a=0;a<s.length&&o.length<n;a++){let l=Ms(s[a],`${i}[${a}]`,r);l.ok&&o.push(l.v)}return s.length>n&&r(`${i}: more than ${n}, rest dropped`),o}function Tc(t,e){let n=t,i=2;for(;e.has(n);)n=`${t}-${i++}`;return e.add(n),n}function Qm(t){return String(t).toLocaleLowerCase("ru").replace(/[^a-zа-яё0-9]/g,"")}function Ko(t,e,n,i){let r=[],s=Ty[e];for(let o=0;o<t.length;o++){let a=`${e}[${o}]`;if(r.length>=s){i(`${e}: more than ${s}, rest dropped`);break}if(!ja(t[o])){i(`${a}: not an object, dropped`);continue}let l=n(t[o],o,a);l&&r.push(l)}return r}function YA(t,e){let n=new Set;return Ko(t,"achievements",(i,r,s)=>{let o=Dn(i,"title")?Ht(i.title,40,!0,`${s}.title`,e):{ok:!1};if(!o.ok)return e(`${s}: no title, dropped`),null;let a=Dn(i,"id")?Ms(i.id,`${s}.id`,e):{ok:!1},l=Tc(a.ok?a.v:`a${r+1}`,n),c=ft(i,"earned",u=>Ey(u,`${s}.earned`,e),!1);return{id:l,title:o.v,shape:ft(i,"shape",u=>Za(u,My,`${s}.shape`,e),My[r%5]),rarity:ft(i,"rarity",u=>Za(u,["обычная","редкая","легендарная"],`${s}.rarity`,e),"обычная"),earned:c,date:c?ft(i,"date",u=>Ka(u,`${s}.date`,e),null):null,who:$h(i,"who",12,`${s}.who`,e),text:ft(i,"text",u=>Ht(u,200,!1,`${s}.text`,e),""),where:Wh(i,s,e)}},e)}function qA(t,e){let n=new Set(["workshop"]);return Ko(t,"members",(i,r,s)=>{let o=Dn(i,"name")?Ht(i.name,24,!0,`${s}.name`,e):{ok:!1};if(!o.ok)return e(`${s}: no name, dropped`),null;let a=Dn(i,"id")?Ms(i.id,`${s}.id`,e):{ok:!1},l=Tc(a.ok?a.v:`m${r+1}`,n),c=WA[r%12];if(Dn(i,"note")){let u=typeof i.note=="string"?i.note.trim().toUpperCase():"";HA.includes(u)?c=u:e(`${s}.note: ${hi(i.note)} invalid → "${c}"`)}return{id:l,name:o.v,callsign:ft(i,"callsign",u=>Ht(u,16,!1,`${s}.callsign`,e),""),role:ft(i,"role",u=>Ht(u,32,!1,`${s}.role`,e),""),status:ft(i,"status",u=>Za(u,["на связи","в пути","отдыхает"],`${s}.status`,e),"на связи"),level:ft(i,"level",u=>bs(u,0,99,`${s}.level`,e),1),missions:ft(i,"missions",u=>bs(u,0,999,`${s}.missions`,e),0),seed:ft(i,"seed",u=>bs(u,0,9999,`${s}.seed`,e),Xm(l)%100),note:c,glyph:ft(i,"glyph",u=>Ry(u,`${s}.glyph`,e),null),trait:ft(i,"trait",u=>Ht(u,120,!1,`${s}.trait`,e),""),joke:ft(i,"joke",u=>Ht(u,160,!1,`${s}.joke`,e),""),achievements:$h(i,"achievements",16,`${s}.achievements`,e)}},e)}function jA(t,e){let n=new Set;for(let r of t)if(ja(r)&&Dn(r,"code")){let s=Sy(r.code,"",()=>{});s.ok&&n.add(s.v)}let i=new Set;return Ko(t,"missions",(r,s,o)=>{let a=null;if(Dn(r,"code")){let f=Sy(r.code,`${o}.code`,e);if(f.ok&&(a=f.v,i.has(a)))return e(`${o}: duplicate code ${a}, dropped`),null}if(a===null&&(a=String(s+1).padStart(3,"0"),i.has(a)||n.has(a)))return e(`${o}: no code (${a} taken), dropped`),null;i.add(a);let l=ft(r,"status",f=>Za(f,["done","active","new","locked","sealed"],`${o}.status`,e),"new"),c=ft(r,"decodeDays",f=>bs(f,1,365,`${o}.decodeDays`,e),null),u=ft(r,"unlockAtDays",f=>bs(f,1,365,`${o}.unlockAtDays`,e),null);return l!=="locked"?(c=null,u=null):c!=null&&u!=null?(u=null,e(`${o}: locked with both day fields → decodeDays kept`)):c==null&&u==null&&(c=7,e(`${o}: locked without days → decodeDays 7`)),{code:a,title:ft(r,"title",f=>Ht(f,48,!0,`${o}.title`,e),`Вылазка ${a}`),status:l,brief:ft(r,"brief",f=>Ht(f,240,!1,`${o}.brief`,e),""),conditions:Cy(r,"conditions",6,40,`${o}.conditions`,e),crew:$h(r,"crew",12,`${o}.crew`,e),result:ft(r,"result",f=>Ht(f,160,!1,`${o}.result`,e),""),reward:ft(r,"reward",f=>Ms(f,`${o}.reward`,e),null),log:ft(r,"log",f=>Ht(f,200,!1,`${o}.log`,e),""),decodeDays:c,unlockAtDays:u,proposedBy:ft(r,"proposedBy",f=>Ms(f,`${o}.proposedBy`,e),null),where:Wh(r,o,e)}},e)}function ZA(t,e){let n=new Set;return Ko(t,"legends",(i,r,s)=>{let o=Dn(i,"date")?Ka(i.date,`${s}.date`,e):{ok:!1},a=Dn(i,"title")?Ht(i.title,48,!0,`${s}.title`,e):{ok:!1};if(!o.ok||!a.ok)return e(`${s}: needs date and title, dropped`),null;let l=Dn(i,"id")?Ms(i.id,`${s}.id`,e):{ok:!1};return{id:Tc(l.ok?l.v:`l${r+1}`,n),date:o.v,kind:ft(i,"kind",c=>Za(c,["победа","смешное","эпичное"],`${s}.kind`,e),"эпичное"),title:a.v,text:ft(i,"text",c=>Ht(c,300,!1,`${s}.text`,e),""),where:Wh(i,s,e)}},e)}function KA(t,e){let n=new Set;return Ko(t,"moments",(i,r,s)=>{let o=Dn(i,"date")?Ka(i.date,`${s}.date`,e):{ok:!1},a=Dn(i,"title")?Ht(i.title,48,!0,`${s}.title`,e):{ok:!1};if(!o.ok||!a.ok)return e(`${s}: needs date and title, dropped`),null;let l=Dn(i,"id")?Ms(i.id,`${s}.id`,e):{ok:!1};return{id:Tc(l.ok?l.v:`mo${r+1}`,n),date:o.v,title:a.v,who:$h(i,"who",12,`${s}.who`,e),text:ft(i,"text",c=>Ht(c,300,!0,`${s}.text`,e),a.v),where:Wh(i,s,e)}},e)}function JA(t,e){let n=new Set;return Ko(t,"jokes",(i,r,s)=>{let o=Dn(i,"text")?Ht(i.text,160,!0,`${s}.text`,e):{ok:!1};if(!o.ok)return e(`${s}: no text, dropped`),null;let a=Dn(i,"id")?Ms(i.id,`${s}.id`,e):{ok:!1},l=ft(i,"trigger",c=>Ht(c,24,!1,`${s}.trigger`,e),"");return{id:Tc(a.ok?a.v:`j${r+1}`,n),date:ft(i,"date",c=>Ka(c,`${s}.date`,e),null),hidden:ft(i,"hidden",c=>Ey(c,`${s}.hidden`,e),!1),trigger:Qm(l),text:o.v}},e)}function QA(t,e){return Ko(t,"transmissions",(n,i,r)=>{let s=Dn(n,"text")?Ht(n.text,240,!0,`${r}.text`,e):{ok:!1};return s.ok?{from:ft(n,"from",o=>Ht(o,16,!0,`${r}.from`,e),"VIN"),text:s.v}:(e(`${r}: no text, dropped`),null)},e)}function eT(t,e){let n=Yo.clan;return{name:ft(t,"name",i=>Ht(i,24,!0,"clan.name",e),n.name),motto:ft(t,"motto",i=>Ht(i,80,!0,"clan.motto",e),n.motto),about:ft(t,"about",i=>Ht(i,120,!1,"clan.about",e),n.about),founded:ft(t,"founded",i=>Ka(i,"clan.founded",e),n.founded),frequency:ft(t,"frequency",i=>$A(i,0,99.99,2,"clan.frequency",e),n.frequency),sigil:ft(t,"sigil",i=>Ry(i,"clan.sigil",e),qo(n.sigil)),code:tT(t,e)}}function tT(t,e){let n=Yo.clan.code;if(!Dn(t,"code"))return n.slice();let i=t.code;if(!Array.isArray(i))return e("clan.code: not a list, default used"),n.slice();i.length>7&&e("clan.code: more than 7, rest dropped");let r=[];for(let s=0;s<7;s++){if(s>=i.length){r.push(n[s]);continue}let o=i[s];if(typeof o!="string"){e(`clan.code[${s}]: ${hi(o)} invalid → ""`),r.push("");continue}let a=Ht(o,40,!1,`clan.code[${s}]`,e);r.push(a.ok?a.v:"")}return r}function nT(t,e,n){let i=Yo.operator,r=Dn(t,"name")?Ht(t.name,24,!0,"operator.name",n):{ok:!1},s,o=Dn(t,"id")?Ms(t.id,"operator.id",n):{ok:!1};if(o.ok)s=o.v,e.some(c=>c.id===s)||n(`operator.id: "${s}" matches no member (kept)`);else{let c=r.ok?e.find(u=>u.name.toLocaleLowerCase("ru")===r.v.toLocaleLowerCase("ru")):null;s=c?c.id:e.length?e[0].id:"sam"}let a=e.find(c=>c.id===s)||null,l=r.ok?r.v:a?a.name:i.name;return{id:s,name:l,aliases:Cy(t,"aliases",8,24,"operator.aliases",n),callsign:ft(t,"callsign",c=>Ht(c,16,!1,"operator.callsign",n),a?a.callsign:""),birthday:ft(t,"birthday",c=>Ka(c,"operator.birthday",n),null),heightM:ft(t,"heightM",c=>Ay(c,.8,2.2,2,"operator.heightM",n),i.heightM!=null?i.heightM:1.3),papaHeightM:ft(t,"papaHeightM",c=>Ay(c,1.4,2.3,2,"operator.papaHeightM",n),null)}}function iT(t,e,n){let i=Yo,r=(s,o)=>{try{t[s]=o(ja(e[s])?e[s]:i[s])}catch{n(`${s}: crashed, default used`),t[s]=Sc(i[s])}};r("signal",s=>({secret:ft(s,"secret",o=>Ht(o,240,!0,"signal.secret",n),i.signal.secret)})),r("capsule",s=>({openAfterDays:ft(s,"openAfterDays",o=>bs(o,0,365,"capsule.openAfterDays",n),i.capsule.openAfterDays),text:ft(s,"text",o=>Ht(o,300,!0,"capsule.text",n),i.capsule.text)})),r("zenith",s=>({message:ft(s,"message",o=>Ht(o,160,!0,"zenith.message",n),i.zenith.message)})),r("nadir",s=>({origin:ft(s,"origin",o=>Ht(o,400,!0,"nadir.origin",n),i.nadir.origin)})),r("night",s=>({from:ft(s,"from",o=>bs(o,0,23,"night.from",n),i.night.from),to:ft(s,"to",o=>bs(o,0,23,"night.to",n),i.night.to),drowsyFrom:ft(s,"drowsyFrom",o=>bs(o,0,23,"night.drowsyFrom",n),i.night.drowsyFrom),story:ft(s,"story",o=>Ht(o,240,!0,"night.story",n),i.night.story)})),r("companion",s=>({name:ft(s,"name",o=>Ht(o,16,!0,"companion.name",n),i.companion.name)}))}function rT(t){let e=[],n=u=>{e.push(u)},i=Yo,r=t;ja(r)||(r={});let s={},o=[];try{o=Object.keys(r)}catch{o=[]}for(let u of o)Jm.includes(u)||n(`unknown key ${u}`);let a={};for(let u of Jm){let f;try{f=r[u]}catch{f=void 0}let d=u in Ty?Array.isArray(f):ja(f);!d&&f!==void 0&&n(`${u}: default used`),a[u]=d?f:Sc(i[u])}let l=[["achievements",YA],["members",qA],["missions",jA],["legends",ZA],["moments",KA],["jokes",JA],["transmissions",QA]];for(let[u,f]of l)try{s[u]=f(a[u],n)}catch{n(`${u}: crashed, default used`);try{s[u]=f(Sc(i[u]),()=>{})}catch{s[u]=[]}}try{s.clan=eT(a.clan,n)}catch{n("clan: crashed, default used"),s.clan=Sc(i.clan)}try{s.operator=nT(a.operator,s.members,n)}catch{n("operator: crashed, default used"),s.operator={...Sc(i.operator),aliases:[]}}iT(s,a,n);try{let u=new Set(s.members.map(d=>d.id)),f=new Set(s.achievements.map(d=>d.id)),h=(d,g,x)=>{let m=[];for(let p of d){if(!g.has(p)){n(`${x}: unknown "${p}" removed`);continue}m.includes(p)||m.push(p)}return m};s.members.forEach((d,g)=>{d.achievements=h(d.achievements,f,`members[${g}].achievements`)}),s.missions.forEach((d,g)=>{d.crew=h(d.crew,u,`missions[${g}].crew`),d.reward!=null&&!f.has(d.reward)&&(n(`missions[${g}].reward: unknown "${d.reward}" removed`),d.reward=null),d.proposedBy!=null&&!u.has(d.proposedBy)&&(n(`missions[${g}].proposedBy: unknown "${d.proposedBy}" removed`),d.proposedBy=null)}),s.achievements.forEach((d,g)=>{d.who=h(d.who,u,`achievements[${g}].who`)}),s.moments.forEach((d,g)=>{d.who=h(d.who,u,`moments[${g}].who`)})}catch{n("refs: crashed")}for(let u of s.jokes)u.date==null&&(u.date=s.clan.founded);try{let u=[];for(let h of s.operator.aliases){let d=Qm(h);d.length>=2&&d.length<=24&&!u.includes(d)&&u.push(d)}let f=Qm(s.operator.name);f.length>=2&&!u.includes(f)&&u.push(f),s.operator.aliases=u}catch{s.operator.aliases=[]}let c={};for(let u of Jm)c[u]=s[u];return{world:c,issues:e}}function Py(t){if(t&&typeof t=="object"&&!Object.isFrozen(t)){Object.freeze(t);for(let e of Object.keys(t))Py(t[e])}return t}var Ac,Iy="file";try{Ac=typeof window<"u"?window.SAMVIN_WORLD:void 0}catch{Ac=void 0}ja(Ac)||(Iy="default",Ac=Yo,lt("world","world.js missing or broken — using built-in defaults"));var wc=rT(Ac);wc.issues.length&&lt("world-issues",`world.js: ${wc.issues.length} issue(s)`,wc.issues);var Ly=Iy,Dy=Object.freeze(wc.issues.slice()),xt=Py(wc.world);var uN=Object.freeze({members:"Здесь пока никого нет.",missions:"Вылазок пока нет.",achievements:"Трофеев пока нет.",transmissions:"Передач пока нет.",probeLog:"Зонд вернулся. Записи нет."}),sT=/^S(0[1-9]|1[0-4])$/;function Ny(){let t=Y.data||{},e=t.transmissions||{delivered:0,read:[]},n=Math.max(0,Math.min(e.delivered|0,xt.transmissions.length)),i=Array.isArray(e.read)?e.read:[],r=0;for(let u=0;u<n;u++)i.includes(u)||r++;let s=new Set(xt.jokes.map(u=>u.id)),o=new Set((Array.isArray(t.jokesFound)?t.jokesFound:[]).filter(u=>s.has(u))).size,a=0,l=0;for(let u of xt.missions)Hh(u).state==="done"&&a++,Km(u.code)==="out"&&l++;let c=t.found&&typeof t.found=="object"?Object.keys(t.found).filter(u=>sT.test(u)).length:0;return{delivered:n,unread:r,legends:xt.legends.length,moments:xt.moments.length,jokesFound:o,members:xt.members.length,online:xt.members.filter(u=>u.status==="на связи").length,founded:io(xt.clan.founded,"dd.mm.yyyy"),daysSinceFounded:Math.max(0,Zo(xt.clan.founded,Y.today||xt.clan.founded)),missions:xt.missions.length,done:a,probesOut:l,earned:xt.achievements.filter(u=>u.earned).length,achievements:xt.achievements.length,secrets:c,shards:t.shards|0,nadirOpen:!!t.nadirOpen,life:xt.missions.filter(u=>u.where==="жизнь").length}}var oT=864e5,Oy=t=>(t<10?"0":"")+t,Xh=t=>t instanceof Date?t:new Date(t??Ss());function Ss(){return Date.now()}function Yh(t){let e=Xh(t);return`${e.getFullYear()}-${Oy(e.getMonth()+1)}-${Oy(e.getDate())}`}function Fy(t){let e=/^(\d{4})-(\d{2})-(\d{2})/.exec(String(t||""));return e?Math.round(Date.UTC(+e[1],+e[2]-1,+e[3])/oT):NaN}function Zo(t,e){let n=Fy(t),i=Fy(e);return Number.isFinite(n)&&Number.isFinite(i)?i-n:0}function Uy(t,e,n){return e>n?t>=e||t<n:e<n?t>=e&&t<n:!1}function t0(t){let e=xt.night;return Uy(Xh(t).getHours(),e.from,e.to)}function ky(t){let e=xt.night;return t0(t)||e.drowsyFrom===e.from?!1:Uy(Xh(t).getHours(),e.drowsyFrom,e.from)}function aT(t){let e=/^(\d{4})-(\d{2})-(\d{2})$/.exec(String(t||""));return e?{y:+e[1],m:+e[2],d:+e[3]}:null}function n0(t){let e=aT(xt.operator.birthday);if(!e)return!1;let n=Xh(t),i=n.getFullYear(),r=n.getMonth()+1,s=n.getDate();return e.m===2&&e.d===29&&!(i%4===0&&i%100!==0||i%400===0)?r===2&&s===28:r===e.m&&s===e.d}var p_=0,N0=1,m_=2;var tu=1,g_=2,bl=3,is=0,Ii=1,rs=2,Bi=0,Or=1,oa=2,O0=3,F0=4,rd=5;var Ns=100,x_=101,v_=102,y_=103,__=104,b_=200,nu=201,M_=202,S_=203,U0=204,Ml=205,w_=206,A_=207,T_=208,E_=209,R_=210,C_=211,P_=212,I_=213,L_=214,bf=0,Mf=1,Sf=2,dl=3,wf=4,Af=5,Tf=6,Ef=7,k0=0,D_=1,N_=2,Qi=0,B0=1,z0=2,V0=3,G0=4,H0=5,W0=6,$0=7;var X0=300,vo=301,aa=302,sd=303,od=304,iu=306,Rf=1e3,mi=1001,Cf=1002,Qn=1003,O_=1004;var ru=1005;var Lt=1006,ad=1007;var yo=1008;var er=1009,Y0=1010,q0=1011,Sl=1012,ld=1013,Fr=1014,xr=1015,gi=1016,cd=1017,ud=1018,wl=1020,j0=35902,Z0=35899,K0=1021,J0=1022,ri=1023,Kr=1026,_o=1027,hd=1028,fd=1029,bo=1030,dd=1031;var pd=1033,su=33776,ou=33777,au=33778,lu=33779,md=35840,gd=35841,xd=35842,vd=35843,yd=36196,_d=37492,bd=37496,Md=37488,Sd=37489,cu=37490,wd=37491,Ad=37808,Td=37809,Ed=37810,Rd=37811,Cd=37812,Pd=37813,Id=37814,Ld=37815,Dd=37816,Nd=37817,Od=37818,Fd=37819,Ud=37820,kd=37821,Bd=36492,zd=36494,Vd=36495,Gd=36283,Hd=36284,uu=36285,Wd=36286;var Nc=2300,Pf=2301,yf=2302,T0=2303,E0=2400,R0=2401,C0=2402;var F_=3200;var Q0=0,U_=1,Os="",Ki="srgb",ia="srgb-linear",Oc="linear",Kt="srgb";var _f=7680;var k_=519,B_=512,z_=513,V_=514,$d=515,G_=516,H_=517,Xd=518,W_=519,eg=35044;var tg="300 es",Nr=2e3,Fc=2001;function cT(t){for(let e=t.length-1;e>=0;--e)if(t[e]>=65535)return!0;return!1}function uT(t){return ArrayBuffer.isView(t)&&!(t instanceof DataView)}function Uc(t){return document.createElementNS("http://www.w3.org/1999/xhtml",t)}function $_(){let t=Uc("canvas");return t.style.display="block",t}var By={},pl=null;function kc(...t){let e="THREE."+t.shift();pl?pl("log",e,...t):console.log(e,...t)}function X_(t){let e=t[0];if(typeof e=="string"&&e.startsWith("TSL:")){let n=t[1];n&&n.isStackTrace?t[0]+=" "+n.getLocation():t[1]='Stack trace not available. Enable "THREE.Node.captureStackTrace" to capture stack traces.'}return t}function dt(...t){t=X_(t);let e="THREE."+t.shift();if(pl)pl("warn",e,...t);else{let n=t[0];n&&n.isStackTrace?console.warn(n.getError(e)):console.warn(e,...t)}}function gt(...t){t=X_(t);let e="THREE."+t.shift();if(pl)pl("error",e,...t);else{let n=t[0];n&&n.isStackTrace?console.error(n.getError(e)):console.error(e,...t)}}function na(...t){let e=t.join(" ");e in By||(By[e]=!0,dt(...t))}function Y_(t,e,n){return new Promise(function(i,r){function s(){switch(t.clientWaitSync(e,t.SYNC_FLUSH_COMMANDS_BIT,0)){case t.WAIT_FAILED:r();break;case t.TIMEOUT_EXPIRED:setTimeout(s,n);break;default:i()}}setTimeout(s,n)})}var q_={[bf]:Mf,[Sf]:Tf,[wf]:Ef,[dl]:Af,[Mf]:bf,[Tf]:Sf,[Ef]:wf,[Af]:dl},Jr=class{addEventListener(e,n){this._listeners===void 0&&(this._listeners={});let i=this._listeners;i[e]===void 0&&(i[e]=[]),i[e].indexOf(n)===-1&&i[e].push(n)}hasEventListener(e,n){let i=this._listeners;return i===void 0?!1:i[e]!==void 0&&i[e].indexOf(n)!==-1}removeEventListener(e,n){let i=this._listeners;if(i===void 0)return;let r=i[e];if(r!==void 0){let s=r.indexOf(n);s!==-1&&r.splice(s,1)}}dispatchEvent(e){let n=this._listeners;if(n===void 0)return;let i=n[e.type];if(i!==void 0){e.target=this;let r=i.slice(0);for(let s=0,o=r.length;s<o;s++)r[s].call(this,e);e.target=null}}},fi=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"];var i0=Math.PI/180,If=180/Math.PI;function ho(){let t=Math.random()*4294967295|0,e=Math.random()*4294967295|0,n=Math.random()*4294967295|0,i=Math.random()*4294967295|0;return(fi[t&255]+fi[t>>8&255]+fi[t>>16&255]+fi[t>>24&255]+"-"+fi[e&255]+fi[e>>8&255]+"-"+fi[e>>16&15|64]+fi[e>>24&255]+"-"+fi[n&63|128]+fi[n>>8&255]+"-"+fi[n>>16&255]+fi[n>>24&255]+fi[i&255]+fi[i>>8&255]+fi[i>>16&255]+fi[i>>24&255]).toLowerCase()}function Nt(t,e,n){return Math.max(e,Math.min(n,t))}function hT(t,e){return(t%e+e)%e}function r0(t,e,n){return(1-n)*t+n*e}function Zr(t,e){switch(e.constructor){case Float32Array:return t;case Uint32Array:return t/4294967295;case Uint16Array:return t/65535;case Uint8Array:case Uint8ClampedArray:return t/255;case Int32Array:return Math.max(t/2147483647,-1);case Int16Array:return Math.max(t/32767,-1);case Int8Array:return Math.max(t/127,-1);default:throw new Error("THREE.MathUtils: Invalid component type.")}}function cn(t,e){switch(e.constructor){case Float32Array:return t;case Uint32Array:return Math.round(t*4294967295);case Uint16Array:return Math.round(t*65535);case Uint8Array:case Uint8ClampedArray:return Math.round(t*255);case Int32Array:return Math.round(t*2147483647);case Int16Array:return Math.round(t*32767);case Int8Array:return Math.round(t*127);default:throw new Error("THREE.MathUtils: Invalid component type.")}}var og=class og{constructor(e=0,n=0){this.x=e,this.y=n}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,n){return this.x=e,this.y=n,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,n){switch(e){case 0:this.x=n;break;case 1:this.y=n;break;default:throw new Error("THREE.Vector2: index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw new Error("THREE.Vector2: index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,n){return this.x=e.x+n.x,this.y=e.y+n.y,this}addScaledVector(e,n){return this.x+=e.x*n,this.y+=e.y*n,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,n){return this.x=e.x-n.x,this.y=e.y-n.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){let n=this.x,i=this.y,r=e.elements;return this.x=r[0]*n+r[3]*i+r[6],this.y=r[1]*n+r[4]*i+r[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,n){return this.x=Nt(this.x,e.x,n.x),this.y=Nt(this.y,e.y,n.y),this}clampScalar(e,n){return this.x=Nt(this.x,e,n),this.y=Nt(this.y,e,n),this}clampLength(e,n){let i=this.length();return this.divideScalar(i||1).multiplyScalar(Nt(i,e,n))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){let n=Math.sqrt(this.lengthSq()*e.lengthSq());if(n===0)return Math.PI/2;let i=this.dot(e)/n;return Math.acos(Nt(i,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){let n=this.x-e.x,i=this.y-e.y;return n*n+i*i}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,n){return this.x+=(e.x-this.x)*n,this.y+=(e.y-this.y)*n,this}lerpVectors(e,n,i){return this.x=e.x+(n.x-e.x)*i,this.y=e.y+(n.y-e.y)*i,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,n=0){return this.x=e[n],this.y=e[n+1],this}toArray(e=[],n=0){return e[n]=this.x,e[n+1]=this.y,e}fromBufferAttribute(e,n){return this.x=e.getX(n),this.y=e.getY(n),this}rotateAround(e,n){let i=Math.cos(n),r=Math.sin(n),s=this.x-e.x,o=this.y-e.y;return this.x=s*i-o*r+e.x,this.y=s*r+o*i+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}};og.prototype.isVector2=!0;var pt=og,gr=class{constructor(e=0,n=0,i=0,r=1){this.isQuaternion=!0,this._x=e,this._y=n,this._z=i,this._w=r}static slerpFlat(e,n,i,r,s,o,a){let l=i[r+0],c=i[r+1],u=i[r+2],f=i[r+3],h=s[o+0],d=s[o+1],g=s[o+2],x=s[o+3];if(f!==x||l!==h||c!==d||u!==g){let m=l*h+c*d+u*g+f*x;m<0&&(h=-h,d=-d,g=-g,x=-x,m=-m);let p=1-a;if(m<.9995){let _=Math.acos(m),M=Math.sin(_);p=Math.sin(p*_)/M,a=Math.sin(a*_)/M,l=l*p+h*a,c=c*p+d*a,u=u*p+g*a,f=f*p+x*a}else{l=l*p+h*a,c=c*p+d*a,u=u*p+g*a,f=f*p+x*a;let _=1/Math.sqrt(l*l+c*c+u*u+f*f);l*=_,c*=_,u*=_,f*=_}}e[n]=l,e[n+1]=c,e[n+2]=u,e[n+3]=f}static multiplyQuaternionsFlat(e,n,i,r,s,o){let a=i[r],l=i[r+1],c=i[r+2],u=i[r+3],f=s[o],h=s[o+1],d=s[o+2],g=s[o+3];return e[n]=a*g+u*f+l*d-c*h,e[n+1]=l*g+u*h+c*f-a*d,e[n+2]=c*g+u*d+a*h-l*f,e[n+3]=u*g-a*f-l*h-c*d,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,n,i,r){return this._x=e,this._y=n,this._z=i,this._w=r,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,n=!0){let i=e._x,r=e._y,s=e._z,o=e._order,a=Math.cos,l=Math.sin,c=a(i/2),u=a(r/2),f=a(s/2),h=l(i/2),d=l(r/2),g=l(s/2);switch(o){case"XYZ":this._x=h*u*f+c*d*g,this._y=c*d*f-h*u*g,this._z=c*u*g+h*d*f,this._w=c*u*f-h*d*g;break;case"YXZ":this._x=h*u*f+c*d*g,this._y=c*d*f-h*u*g,this._z=c*u*g-h*d*f,this._w=c*u*f+h*d*g;break;case"ZXY":this._x=h*u*f-c*d*g,this._y=c*d*f+h*u*g,this._z=c*u*g+h*d*f,this._w=c*u*f-h*d*g;break;case"ZYX":this._x=h*u*f-c*d*g,this._y=c*d*f+h*u*g,this._z=c*u*g-h*d*f,this._w=c*u*f+h*d*g;break;case"YZX":this._x=h*u*f+c*d*g,this._y=c*d*f+h*u*g,this._z=c*u*g-h*d*f,this._w=c*u*f-h*d*g;break;case"XZY":this._x=h*u*f-c*d*g,this._y=c*d*f-h*u*g,this._z=c*u*g+h*d*f,this._w=c*u*f+h*d*g;break;default:dt("Quaternion: .setFromEuler() encountered an unknown order: "+o)}return n===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,n){let i=n/2,r=Math.sin(i);return this._x=e.x*r,this._y=e.y*r,this._z=e.z*r,this._w=Math.cos(i),this._onChangeCallback(),this}setFromRotationMatrix(e){let n=e.elements,i=n[0],r=n[4],s=n[8],o=n[1],a=n[5],l=n[9],c=n[2],u=n[6],f=n[10],h=i+a+f;if(h>0){let d=.5/Math.sqrt(h+1);this._w=.25/d,this._x=(u-l)*d,this._y=(s-c)*d,this._z=(o-r)*d}else if(i>a&&i>f){let d=2*Math.sqrt(1+i-a-f);this._w=(u-l)/d,this._x=.25*d,this._y=(r+o)/d,this._z=(s+c)/d}else if(a>f){let d=2*Math.sqrt(1+a-i-f);this._w=(s-c)/d,this._x=(r+o)/d,this._y=.25*d,this._z=(l+u)/d}else{let d=2*Math.sqrt(1+f-i-a);this._w=(o-r)/d,this._x=(s+c)/d,this._y=(l+u)/d,this._z=.25*d}return this._onChangeCallback(),this}setFromUnitVectors(e,n){let i=e.dot(n)+1;return i<1e-8?(i=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=i):(this._x=0,this._y=-e.z,this._z=e.y,this._w=i)):(this._x=e.y*n.z-e.z*n.y,this._y=e.z*n.x-e.x*n.z,this._z=e.x*n.y-e.y*n.x,this._w=i),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(Nt(this.dot(e),-1,1)))}rotateTowards(e,n){let i=this.angleTo(e);if(i===0)return this;let r=Math.min(1,n/i);return this.slerp(e,r),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x=this._x*e,this._y=this._y*e,this._z=this._z*e,this._w=this._w*e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,n){let i=e._x,r=e._y,s=e._z,o=e._w,a=n._x,l=n._y,c=n._z,u=n._w;return this._x=i*u+o*a+r*c-s*l,this._y=r*u+o*l+s*a-i*c,this._z=s*u+o*c+i*l-r*a,this._w=o*u-i*a-r*l-s*c,this._onChangeCallback(),this}slerp(e,n){let i=e._x,r=e._y,s=e._z,o=e._w,a=this.dot(e);a<0&&(i=-i,r=-r,s=-s,o=-o,a=-a);let l=1-n;if(a<.9995){let c=Math.acos(a),u=Math.sin(c);l=Math.sin(l*c)/u,n=Math.sin(n*c)/u,this._x=this._x*l+i*n,this._y=this._y*l+r*n,this._z=this._z*l+s*n,this._w=this._w*l+o*n,this._onChangeCallback()}else this._x=this._x*l+i*n,this._y=this._y*l+r*n,this._z=this._z*l+s*n,this._w=this._w*l+o*n,this.normalize();return this}slerpQuaternions(e,n,i){return this.copy(e).slerp(n,i)}random(){let e=2*Math.PI*Math.random(),n=2*Math.PI*Math.random(),i=Math.random(),r=Math.sqrt(1-i),s=Math.sqrt(i);return this.set(r*Math.sin(e),r*Math.cos(e),s*Math.sin(n),s*Math.cos(n))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,n=0){return this._x=e[n],this._y=e[n+1],this._z=e[n+2],this._w=e[n+3],this._onChangeCallback(),this}toArray(e=[],n=0){return e[n]=this._x,e[n+1]=this._y,e[n+2]=this._z,e[n+3]=this._w,e}fromBufferAttribute(e,n){return this._x=e.getX(n),this._y=e.getY(n),this._z=e.getZ(n),this._w=e.getW(n),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}},ag=class ag{constructor(e=0,n=0,i=0){this.x=e,this.y=n,this.z=i}set(e,n,i){return i===void 0&&(i=this.z),this.x=e,this.y=n,this.z=i,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,n){switch(e){case 0:this.x=n;break;case 1:this.y=n;break;case 2:this.z=n;break;default:throw new Error("THREE.Vector3: index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("THREE.Vector3: index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,n){return this.x=e.x+n.x,this.y=e.y+n.y,this.z=e.z+n.z,this}addScaledVector(e,n){return this.x+=e.x*n,this.y+=e.y*n,this.z+=e.z*n,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,n){return this.x=e.x-n.x,this.y=e.y-n.y,this.z=e.z-n.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,n){return this.x=e.x*n.x,this.y=e.y*n.y,this.z=e.z*n.z,this}applyEuler(e){return this.applyQuaternion(zy.setFromEuler(e))}applyAxisAngle(e,n){return this.applyQuaternion(zy.setFromAxisAngle(e,n))}applyMatrix3(e){let n=this.x,i=this.y,r=this.z,s=e.elements;return this.x=s[0]*n+s[3]*i+s[6]*r,this.y=s[1]*n+s[4]*i+s[7]*r,this.z=s[2]*n+s[5]*i+s[8]*r,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){let n=this.x,i=this.y,r=this.z,s=e.elements,o=1/(s[3]*n+s[7]*i+s[11]*r+s[15]);return this.x=(s[0]*n+s[4]*i+s[8]*r+s[12])*o,this.y=(s[1]*n+s[5]*i+s[9]*r+s[13])*o,this.z=(s[2]*n+s[6]*i+s[10]*r+s[14])*o,this}applyQuaternion(e){let n=this.x,i=this.y,r=this.z,s=e.x,o=e.y,a=e.z,l=e.w,c=2*(o*r-a*i),u=2*(a*n-s*r),f=2*(s*i-o*n);return this.x=n+l*c+o*f-a*u,this.y=i+l*u+a*c-s*f,this.z=r+l*f+s*u-o*c,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){let n=this.x,i=this.y,r=this.z,s=e.elements;return this.x=s[0]*n+s[4]*i+s[8]*r,this.y=s[1]*n+s[5]*i+s[9]*r,this.z=s[2]*n+s[6]*i+s[10]*r,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,n){return this.x=Nt(this.x,e.x,n.x),this.y=Nt(this.y,e.y,n.y),this.z=Nt(this.z,e.z,n.z),this}clampScalar(e,n){return this.x=Nt(this.x,e,n),this.y=Nt(this.y,e,n),this.z=Nt(this.z,e,n),this}clampLength(e,n){let i=this.length();return this.divideScalar(i||1).multiplyScalar(Nt(i,e,n))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,n){return this.x+=(e.x-this.x)*n,this.y+=(e.y-this.y)*n,this.z+=(e.z-this.z)*n,this}lerpVectors(e,n,i){return this.x=e.x+(n.x-e.x)*i,this.y=e.y+(n.y-e.y)*i,this.z=e.z+(n.z-e.z)*i,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,n){let i=e.x,r=e.y,s=e.z,o=n.x,a=n.y,l=n.z;return this.x=r*l-s*a,this.y=s*o-i*l,this.z=i*a-r*o,this}projectOnVector(e){let n=e.lengthSq();if(n===0)return this.set(0,0,0);let i=e.dot(this)/n;return this.copy(e).multiplyScalar(i)}projectOnPlane(e){return s0.copy(this).projectOnVector(e),this.sub(s0)}reflect(e){return this.sub(s0.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){let n=Math.sqrt(this.lengthSq()*e.lengthSq());if(n===0)return Math.PI/2;let i=this.dot(e)/n;return Math.acos(Nt(i,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){let n=this.x-e.x,i=this.y-e.y,r=this.z-e.z;return n*n+i*i+r*r}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,n,i){let r=Math.sin(n)*e;return this.x=r*Math.sin(i),this.y=Math.cos(n)*e,this.z=r*Math.cos(i),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,n,i){return this.x=e*Math.sin(n),this.y=i,this.z=e*Math.cos(n),this}setFromMatrixPosition(e){let n=e.elements;return this.x=n[12],this.y=n[13],this.z=n[14],this}setFromMatrixScale(e){let n=this.setFromMatrixColumn(e,0).length(),i=this.setFromMatrixColumn(e,1).length(),r=this.setFromMatrixColumn(e,2).length();return this.x=n,this.y=i,this.z=r,this}setFromMatrixColumn(e,n){return this.fromArray(e.elements,n*4)}setFromMatrix3Column(e,n){return this.fromArray(e.elements,n*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,n=0){return this.x=e[n],this.y=e[n+1],this.z=e[n+2],this}toArray(e=[],n=0){return e[n]=this.x,e[n+1]=this.y,e[n+2]=this.z,e}fromBufferAttribute(e,n){return this.x=e.getX(n),this.y=e.getY(n),this.z=e.getZ(n),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){let e=Math.random()*Math.PI*2,n=Math.random()*2-1,i=Math.sqrt(1-n*n);return this.x=i*Math.cos(e),this.y=n,this.z=i*Math.sin(e),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}};ag.prototype.isVector3=!0;var P=ag,s0=new P,zy=new gr,lg=class lg{constructor(e,n,i,r,s,o,a,l,c){this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,n,i,r,s,o,a,l,c)}set(e,n,i,r,s,o,a,l,c){let u=this.elements;return u[0]=e,u[1]=r,u[2]=a,u[3]=n,u[4]=s,u[5]=l,u[6]=i,u[7]=o,u[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){let n=this.elements,i=e.elements;return n[0]=i[0],n[1]=i[1],n[2]=i[2],n[3]=i[3],n[4]=i[4],n[5]=i[5],n[6]=i[6],n[7]=i[7],n[8]=i[8],this}extractBasis(e,n,i){return e.setFromMatrix3Column(this,0),n.setFromMatrix3Column(this,1),i.setFromMatrix3Column(this,2),this}setFromMatrix4(e){let n=e.elements;return this.set(n[0],n[4],n[8],n[1],n[5],n[9],n[2],n[6],n[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,n){let i=e.elements,r=n.elements,s=this.elements,o=i[0],a=i[3],l=i[6],c=i[1],u=i[4],f=i[7],h=i[2],d=i[5],g=i[8],x=r[0],m=r[3],p=r[6],_=r[1],M=r[4],v=r[7],S=r[2],w=r[5],E=r[8];return s[0]=o*x+a*_+l*S,s[3]=o*m+a*M+l*w,s[6]=o*p+a*v+l*E,s[1]=c*x+u*_+f*S,s[4]=c*m+u*M+f*w,s[7]=c*p+u*v+f*E,s[2]=h*x+d*_+g*S,s[5]=h*m+d*M+g*w,s[8]=h*p+d*v+g*E,this}multiplyScalar(e){let n=this.elements;return n[0]*=e,n[3]*=e,n[6]*=e,n[1]*=e,n[4]*=e,n[7]*=e,n[2]*=e,n[5]*=e,n[8]*=e,this}determinant(){let e=this.elements,n=e[0],i=e[1],r=e[2],s=e[3],o=e[4],a=e[5],l=e[6],c=e[7],u=e[8];return n*o*u-n*a*c-i*s*u+i*a*l+r*s*c-r*o*l}invert(){let e=this.elements,n=e[0],i=e[1],r=e[2],s=e[3],o=e[4],a=e[5],l=e[6],c=e[7],u=e[8],f=u*o-a*c,h=a*l-u*s,d=c*s-o*l,g=n*f+i*h+r*d;if(g===0)return this.set(0,0,0,0,0,0,0,0,0);let x=1/g;return e[0]=f*x,e[1]=(r*c-u*i)*x,e[2]=(a*i-r*o)*x,e[3]=h*x,e[4]=(u*n-r*l)*x,e[5]=(r*s-a*n)*x,e[6]=d*x,e[7]=(i*l-c*n)*x,e[8]=(o*n-i*s)*x,this}transpose(){let e,n=this.elements;return e=n[1],n[1]=n[3],n[3]=e,e=n[2],n[2]=n[6],n[6]=e,e=n[5],n[5]=n[7],n[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){let n=this.elements;return e[0]=n[0],e[1]=n[3],e[2]=n[6],e[3]=n[1],e[4]=n[4],e[5]=n[7],e[6]=n[2],e[7]=n[5],e[8]=n[8],this}setUvTransform(e,n,i,r,s,o,a){let l=Math.cos(s),c=Math.sin(s);return this.set(i*l,i*c,-i*(l*o+c*a)+o+e,-r*c,r*l,-r*(-c*o+l*a)+a+n,0,0,1),this}scale(e,n){return na("Matrix3: .scale() is deprecated. Use .makeScale() instead."),this.premultiply(o0.makeScale(e,n)),this}rotate(e){return na("Matrix3: .rotate() is deprecated. Use .makeRotation() instead."),this.premultiply(o0.makeRotation(-e)),this}translate(e,n){return na("Matrix3: .translate() is deprecated. Use .makeTranslation() instead."),this.premultiply(o0.makeTranslation(e,n)),this}makeTranslation(e,n){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,n,0,0,1),this}makeRotation(e){let n=Math.cos(e),i=Math.sin(e);return this.set(n,-i,0,i,n,0,0,0,1),this}makeScale(e,n){return this.set(e,0,0,0,n,0,0,0,1),this}equals(e){let n=this.elements,i=e.elements;for(let r=0;r<9;r++)if(n[r]!==i[r])return!1;return!0}fromArray(e,n=0){for(let i=0;i<9;i++)this.elements[i]=e[i+n];return this}toArray(e=[],n=0){let i=this.elements;return e[n]=i[0],e[n+1]=i[1],e[n+2]=i[2],e[n+3]=i[3],e[n+4]=i[4],e[n+5]=i[5],e[n+6]=i[6],e[n+7]=i[7],e[n+8]=i[8],e}clone(){return new this.constructor().fromArray(this.elements)}};lg.prototype.isMatrix3=!0;var _t=lg,o0=new _t,Vy=new _t().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),Gy=new _t().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function fT(){let t={enabled:!0,workingColorSpace:ia,spaces:{},convert:function(r,s,o){return this.enabled===!1||s===o||!s||!o||(this.spaces[s].transfer===Kt&&(r.r=Cs(r.r),r.g=Cs(r.g),r.b=Cs(r.b)),this.spaces[s].primaries!==this.spaces[o].primaries&&(r.applyMatrix3(this.spaces[s].toXYZ),r.applyMatrix3(this.spaces[o].fromXYZ)),this.spaces[o].transfer===Kt&&(r.r=fl(r.r),r.g=fl(r.g),r.b=fl(r.b))),r},workingToColorSpace:function(r,s){return this.convert(r,this.workingColorSpace,s)},colorSpaceToWorking:function(r,s){return this.convert(r,s,this.workingColorSpace)},getPrimaries:function(r){return this.spaces[r].primaries},getTransfer:function(r){return r===Os?Oc:this.spaces[r].transfer},getToneMappingMode:function(r){return this.spaces[r].outputColorSpaceConfig.toneMappingMode||"standard"},getLuminanceCoefficients:function(r,s=this.workingColorSpace){return r.fromArray(this.spaces[s].luminanceCoefficients)},define:function(r){Object.assign(this.spaces,r)},_getMatrix:function(r,s,o){return r.copy(this.spaces[s].toXYZ).multiply(this.spaces[o].fromXYZ)},_getDrawingBufferColorSpace:function(r){return this.spaces[r].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(r=this.workingColorSpace){return this.spaces[r].workingColorSpaceConfig.unpackColorSpace},fromWorkingColorSpace:function(r,s){return na("ColorManagement: .fromWorkingColorSpace() has been renamed to .workingToColorSpace()."),t.workingToColorSpace(r,s)},toWorkingColorSpace:function(r,s){return na("ColorManagement: .toWorkingColorSpace() has been renamed to .colorSpaceToWorking()."),t.colorSpaceToWorking(r,s)}},e=[.64,.33,.3,.6,.15,.06],n=[.2126,.7152,.0722],i=[.3127,.329];return t.define({[ia]:{primaries:e,whitePoint:i,transfer:Oc,toXYZ:Vy,fromXYZ:Gy,luminanceCoefficients:n,workingColorSpaceConfig:{unpackColorSpace:Ki},outputColorSpaceConfig:{drawingBufferColorSpace:Ki}},[Ki]:{primaries:e,whitePoint:i,transfer:Kt,toXYZ:Vy,fromXYZ:Gy,luminanceCoefficients:n,outputColorSpaceConfig:{drawingBufferColorSpace:Ki}}}),t}var Et=fT();function Cs(t){return t<.04045?t*.0773993808:Math.pow(t*.9478672986+.0521327014,2.4)}function fl(t){return t<.0031308?t*12.92:1.055*Math.pow(t,.41666)-.055}var Ja,Lf=class{static getDataURL(e,n="image/png"){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>"u")return e.src;let i;if(e instanceof HTMLCanvasElement)i=e;else{Ja===void 0&&(Ja=Uc("canvas")),Ja.width=e.width,Ja.height=e.height;let r=Ja.getContext("2d");e instanceof ImageData?r.putImageData(e,0,0):r.drawImage(e,0,0,e.width,e.height),i=Ja}return i.toDataURL(n)}static sRGBToLinear(e){if(typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&e instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&e instanceof ImageBitmap){let n=Uc("canvas");n.width=e.width,n.height=e.height;let i=n.getContext("2d");i.drawImage(e,0,0,e.width,e.height);let r=i.getImageData(0,0,e.width,e.height),s=r.data;for(let o=0;o<s.length;o++)s[o]=Cs(s[o]/255)*255;return i.putImageData(r,0,0),n}else if(e.data){let n=e.data.slice(0);for(let i=0;i<n.length;i++)n instanceof Uint8Array||n instanceof Uint8ClampedArray?n[i]=Math.floor(Cs(n[i]/255)*255):n[i]=Cs(n[i]);return{data:n,width:e.width,height:e.height}}else return dt("ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),e}},dT=0,ml=class{constructor(e=null){this.isTextureSource=!0,Object.defineProperty(this,"id",{value:dT++}),this.uuid=ho(),this.data=e,this.dataReady=!0,this.version=0}getSize(e){let n=this.data;return typeof HTMLVideoElement<"u"&&n instanceof HTMLVideoElement?e.set(n.videoWidth,n.videoHeight,0):typeof VideoFrame<"u"&&n instanceof VideoFrame?e.set(n.displayWidth,n.displayHeight,0):n!==null?e.set(n.width,n.height,n.depth||0):e.set(0,0,0),e}set needsUpdate(e){e===!0&&this.version++}toJSON(e){let n=e===void 0||typeof e=="string";if(!n&&e.images[this.uuid]!==void 0)return e.images[this.uuid];let i={uuid:this.uuid,url:""},r=this.data;if(r!==null){let s;if(Array.isArray(r)){s=[];for(let o=0,a=r.length;o<a;o++)r[o].isDataTexture?s.push(a0(r[o].image)):s.push(a0(r[o]))}else s=a0(r);i.url=s}return n||(e.images[this.uuid]=i),i}};function a0(t){return typeof HTMLImageElement<"u"&&t instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&t instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&t instanceof ImageBitmap?Lf.getDataURL(t):t.data?{data:Array.from(t.data),width:t.width,height:t.height,type:t.data.constructor.name}:(dt("Texture: Unable to serialize Texture."),{})}var pT=0,l0=new P,Ci=class t extends Jr{constructor(e=t.DEFAULT_IMAGE,n=t.DEFAULT_MAPPING,i=mi,r=mi,s=Lt,o=yo,a=ri,l=er,c=t.DEFAULT_ANISOTROPY,u=Os){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:pT++}),this.uuid=ho(),this.name="",this.source=new ml(e),this.mipmaps=[],this.mapping=n,this.channel=0,this.wrapS=i,this.wrapT=r,this.magFilter=s,this.minFilter=o,this.anisotropy=c,this.format=a,this.internalFormat=null,this.type=l,this.offset=new pt(0,0),this.repeat=new pt(1,1),this.center=new pt(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new _t,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=u,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(e&&e.depth&&e.depth>1),this.pmremVersion=0,this.normalized=!1}get width(){return this.source.getSize(l0).x}get height(){return this.source.getSize(l0).y}get depth(){return this.source.getSize(l0).z}get image(){return this.source.data}set image(e){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(e,n){this.updateRanges.push({start:e,count:n})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.normalized=e.normalized,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.renderTarget=e.renderTarget,this.isRenderTargetTexture=e.isRenderTargetTexture,this.isArrayTexture=e.isArrayTexture,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}setValues(e){for(let n in e){let i=e[n];if(i===void 0){dt(`Texture.setValues(): parameter '${n}' has value of undefined.`);continue}let r=this[n];if(r===void 0){dt(`Texture.setValues(): property '${n}' does not exist.`);continue}r&&i&&r.isVector2&&i.isVector2||r&&i&&r.isVector3&&i.isVector3||r&&i&&r.isMatrix3&&i.isMatrix3?r.copy(i):this[n]=i}}toJSON(e){let n=e===void 0||typeof e=="string";if(!n&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];let i={metadata:{version:4.7,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,normalized:this.normalized,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(i.userData=this.userData),n||(e.textures[this.uuid]=i),i}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(e){if(this.mapping!==X0)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case Rf:e.x=e.x-Math.floor(e.x);break;case mi:e.x=e.x<0?0:1;break;case Cf:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x=e.x-Math.floor(e.x);break}if(e.y<0||e.y>1)switch(this.wrapT){case Rf:e.y=e.y-Math.floor(e.y);break;case mi:e.y=e.y<0?0:1;break;case Cf:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y=e.y-Math.floor(e.y);break}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(e){e===!0&&this.pmremVersion++}};Ci.DEFAULT_IMAGE=null;Ci.DEFAULT_MAPPING=X0;Ci.DEFAULT_ANISOTROPY=1;var cg=class cg{constructor(e=0,n=0,i=0,r=1){this.x=e,this.y=n,this.z=i,this.w=r}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,n,i,r){return this.x=e,this.y=n,this.z=i,this.w=r,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,n){switch(e){case 0:this.x=n;break;case 1:this.y=n;break;case 2:this.z=n;break;case 3:this.w=n;break;default:throw new Error("THREE.Vector4: index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("THREE.Vector4: index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w!==void 0?e.w:1,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,n){return this.x=e.x+n.x,this.y=e.y+n.y,this.z=e.z+n.z,this.w=e.w+n.w,this}addScaledVector(e,n){return this.x+=e.x*n,this.y+=e.y*n,this.z+=e.z*n,this.w+=e.w*n,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,n){return this.x=e.x-n.x,this.y=e.y-n.y,this.z=e.z-n.z,this.w=e.w-n.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){let n=this.x,i=this.y,r=this.z,s=this.w,o=e.elements;return this.x=o[0]*n+o[4]*i+o[8]*r+o[12]*s,this.y=o[1]*n+o[5]*i+o[9]*r+o[13]*s,this.z=o[2]*n+o[6]*i+o[10]*r+o[14]*s,this.w=o[3]*n+o[7]*i+o[11]*r+o[15]*s,this}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this.w/=e.w,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);let n=Math.sqrt(1-e.w*e.w);return n<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/n,this.y=e.y/n,this.z=e.z/n),this}setAxisAngleFromRotationMatrix(e){let n,i,r,s,l=e.elements,c=l[0],u=l[4],f=l[8],h=l[1],d=l[5],g=l[9],x=l[2],m=l[6],p=l[10];if(Math.abs(u-h)<.01&&Math.abs(f-x)<.01&&Math.abs(g-m)<.01){if(Math.abs(u+h)<.1&&Math.abs(f+x)<.1&&Math.abs(g+m)<.1&&Math.abs(c+d+p-3)<.1)return this.set(1,0,0,0),this;n=Math.PI;let M=(c+1)/2,v=(d+1)/2,S=(p+1)/2,w=(u+h)/4,E=(f+x)/4,y=(g+m)/4;return M>v&&M>S?M<.01?(i=0,r=.707106781,s=.707106781):(i=Math.sqrt(M),r=w/i,s=E/i):v>S?v<.01?(i=.707106781,r=0,s=.707106781):(r=Math.sqrt(v),i=w/r,s=y/r):S<.01?(i=.707106781,r=.707106781,s=0):(s=Math.sqrt(S),i=E/s,r=y/s),this.set(i,r,s,n),this}let _=Math.sqrt((m-g)*(m-g)+(f-x)*(f-x)+(h-u)*(h-u));return Math.abs(_)<.001&&(_=1),this.x=(m-g)/_,this.y=(f-x)/_,this.z=(h-u)/_,this.w=Math.acos((c+d+p-1)/2),this}setFromMatrixPosition(e){let n=e.elements;return this.x=n[12],this.y=n[13],this.z=n[14],this.w=n[15],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,n){return this.x=Nt(this.x,e.x,n.x),this.y=Nt(this.y,e.y,n.y),this.z=Nt(this.z,e.z,n.z),this.w=Nt(this.w,e.w,n.w),this}clampScalar(e,n){return this.x=Nt(this.x,e,n),this.y=Nt(this.y,e,n),this.z=Nt(this.z,e,n),this.w=Nt(this.w,e,n),this}clampLength(e,n){let i=this.length();return this.divideScalar(i||1).multiplyScalar(Nt(i,e,n))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,n){return this.x+=(e.x-this.x)*n,this.y+=(e.y-this.y)*n,this.z+=(e.z-this.z)*n,this.w+=(e.w-this.w)*n,this}lerpVectors(e,n,i){return this.x=e.x+(n.x-e.x)*i,this.y=e.y+(n.y-e.y)*i,this.z=e.z+(n.z-e.z)*i,this.w=e.w+(n.w-e.w)*i,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,n=0){return this.x=e[n],this.y=e[n+1],this.z=e[n+2],this.w=e[n+3],this}toArray(e=[],n=0){return e[n]=this.x,e[n+1]=this.y,e[n+2]=this.z,e[n+3]=this.w,e}fromBufferAttribute(e,n){return this.x=e.getX(n),this.y=e.getY(n),this.z=e.getZ(n),this.w=e.getW(n),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}};cg.prototype.isVector4=!0;var Vt=cg,Df=class extends Jr{constructor(e=1,n=1,i={}){super(),i=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:Lt,depthBuffer:!0,stencilBuffer:!1,resolveColorBuffer:!0,resolveDepthBuffer:!0,resolveStencilBuffer:!0,storeMultisampledColorBuffer:!0,storeMultisampledDepthBuffer:!0,storeMultisampledStencilBuffer:!0,depthTexture:null,samples:0,count:1,depth:1,multiview:!1,useArrayDepthTexture:!1},i),this.isRenderTarget=!0,this.width=e,this.height=n,this.depth=i.depth,this.scissor=new Vt(0,0,e,n),this.scissorTest=!1,this.viewport=new Vt(0,0,e,n),this.textures=[];let r={width:e,height:n,depth:i.depth},s=new Ci(r),o=i.count;for(let a=0;a<o;a++)this.textures[a]=s.clone(),this.textures[a].isRenderTargetTexture=!0,this.textures[a].renderTarget=this;this._setTextureOptions(i),this.depthBuffer=i.depthBuffer,this.stencilBuffer=i.stencilBuffer,this.resolveColorBuffer=i.resolveColorBuffer,this.resolveDepthBuffer=i.resolveDepthBuffer,this.resolveStencilBuffer=i.resolveStencilBuffer,this.storeMultisampledColorBuffer=i.storeMultisampledColorBuffer,this.storeMultisampledDepthBuffer=i.storeMultisampledDepthBuffer,this.storeMultisampledStencilBuffer=i.storeMultisampledStencilBuffer,this._depthTexture=null,this.depthTexture=i.depthTexture,this.samples=i.samples,this.multiview=i.multiview,this.useArrayDepthTexture=i.useArrayDepthTexture}_setTextureOptions(e={}){let n={minFilter:Lt,generateMipmaps:!1,flipY:!1,internalFormat:null};e.mapping!==void 0&&(n.mapping=e.mapping),e.wrapS!==void 0&&(n.wrapS=e.wrapS),e.wrapT!==void 0&&(n.wrapT=e.wrapT),e.wrapR!==void 0&&(n.wrapR=e.wrapR),e.magFilter!==void 0&&(n.magFilter=e.magFilter),e.minFilter!==void 0&&(n.minFilter=e.minFilter),e.format!==void 0&&(n.format=e.format),e.type!==void 0&&(n.type=e.type),e.anisotropy!==void 0&&(n.anisotropy=e.anisotropy),e.colorSpace!==void 0&&(n.colorSpace=e.colorSpace),e.flipY!==void 0&&(n.flipY=e.flipY),e.generateMipmaps!==void 0&&(n.generateMipmaps=e.generateMipmaps),e.internalFormat!==void 0&&(n.internalFormat=e.internalFormat);for(let i=0;i<this.textures.length;i++)this.textures[i].setValues(n)}get texture(){return this.textures[0]}set texture(e){this.textures[0]=e}set depthTexture(e){this._depthTexture!==null&&this._depthTexture.renderTarget===this&&(this._depthTexture.renderTarget=null),e!==null&&e.renderTarget===null&&(e.renderTarget=this),this._depthTexture=e}get depthTexture(){return this._depthTexture}setSize(e,n,i=1){if(this.width!==e||this.height!==n||this.depth!==i){this.width=e,this.height=n,this.depth=i;for(let r=0,s=this.textures.length;r<s;r++)this.textures[r].image.width=e,this.textures[r].image.height=n,this.textures[r].image.depth=i,this.textures[r].isData3DTexture!==!0&&(this.textures[r].isArrayTexture=this.textures[r].image.depth>1);this.dispose()}this.viewport.set(0,0,e,n),this.scissor.set(0,0,e,n)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.textures.length=0;for(let n=0,i=e.textures.length;n<i;n++){this.textures[n]=e.textures[n].clone(),this.textures[n].isRenderTargetTexture=!0,this.textures[n].renderTarget=this;let r=Object.assign({},e.textures[n].image);this.textures[n].source=new ml(r)}if(this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,this.resolveColorBuffer=e.resolveColorBuffer,this.resolveDepthBuffer=e.resolveDepthBuffer,this.resolveStencilBuffer=e.resolveStencilBuffer,this.storeMultisampledColorBuffer=e.storeMultisampledColorBuffer,this.storeMultisampledDepthBuffer=e.storeMultisampledDepthBuffer,this.storeMultisampledStencilBuffer=e.storeMultisampledStencilBuffer,e.depthTexture!==null)if(e.depthTexture.renderTarget===e){let n=e.depthTexture.clone();n.renderTarget=null,this.depthTexture=n}else this.depthTexture=e.depthTexture;return this.samples=e.samples,this.multiview=e.multiview,this.useArrayDepthTexture=e.useArrayDepthTexture,this}dispose(){this.dispatchEvent({type:"dispose"})}},Hn=class extends Df{constructor(e=1,n=1,i={}){super(e,n,i),this.isWebGLRenderTarget=!0}},Bc=class extends Ci{constructor(e=null,n=1,i=1,r=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:n,height:i,depth:r},this.magFilter=Qn,this.minFilter=Qn,this.wrapR=mi,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}copy(e){return super.copy(e),this.wrapR=e.wrapR,this}addLayerUpdate(e){this.layerUpdates.add(e)}clearLayerUpdates(){this.layerUpdates.clear()}};var Nf=class extends Ci{constructor(e=null,n=1,i=1,r=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:n,height:i,depth:r},this.magFilter=Qn,this.minFilter=Qn,this.wrapR=mi,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}copy(e){return super.copy(e),this.wrapR=e.wrapR,this}};var id=class id{constructor(e,n,i,r,s,o,a,l,c,u,f,h,d,g,x,m){this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,n,i,r,s,o,a,l,c,u,f,h,d,g,x,m)}set(e,n,i,r,s,o,a,l,c,u,f,h,d,g,x,m){let p=this.elements;return p[0]=e,p[4]=n,p[8]=i,p[12]=r,p[1]=s,p[5]=o,p[9]=a,p[13]=l,p[2]=c,p[6]=u,p[10]=f,p[14]=h,p[3]=d,p[7]=g,p[11]=x,p[15]=m,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new id().fromArray(this.elements)}copy(e){let n=this.elements,i=e.elements;return n[0]=i[0],n[1]=i[1],n[2]=i[2],n[3]=i[3],n[4]=i[4],n[5]=i[5],n[6]=i[6],n[7]=i[7],n[8]=i[8],n[9]=i[9],n[10]=i[10],n[11]=i[11],n[12]=i[12],n[13]=i[13],n[14]=i[14],n[15]=i[15],this}copyPosition(e){let n=this.elements,i=e.elements;return n[12]=i[12],n[13]=i[13],n[14]=i[14],this}setFromMatrix3(e){let n=e.elements;return this.set(n[0],n[3],n[6],0,n[1],n[4],n[7],0,n[2],n[5],n[8],0,0,0,0,1),this}extractBasis(e,n,i){return this.determinantAffine()===0?(e.set(1,0,0),n.set(0,1,0),i.set(0,0,1),this):(e.setFromMatrixColumn(this,0),n.setFromMatrixColumn(this,1),i.setFromMatrixColumn(this,2),this)}makeBasis(e,n,i){return this.set(e.x,n.x,i.x,0,e.y,n.y,i.y,0,e.z,n.z,i.z,0,0,0,0,1),this}extractRotation(e){if(e.determinantAffine()===0)return this.identity();let n=this.elements,i=e.elements,r=1/Qa.setFromMatrixColumn(e,0).length(),s=1/Qa.setFromMatrixColumn(e,1).length(),o=1/Qa.setFromMatrixColumn(e,2).length();return n[0]=i[0]*r,n[1]=i[1]*r,n[2]=i[2]*r,n[3]=0,n[4]=i[4]*s,n[5]=i[5]*s,n[6]=i[6]*s,n[7]=0,n[8]=i[8]*o,n[9]=i[9]*o,n[10]=i[10]*o,n[11]=0,n[12]=0,n[13]=0,n[14]=0,n[15]=1,this}makeRotationFromEuler(e){let n=this.elements,i=e.x,r=e.y,s=e.z,o=Math.cos(i),a=Math.sin(i),l=Math.cos(r),c=Math.sin(r),u=Math.cos(s),f=Math.sin(s);if(e.order==="XYZ"){let h=o*u,d=o*f,g=a*u,x=a*f;n[0]=l*u,n[4]=-l*f,n[8]=c,n[1]=d+g*c,n[5]=h-x*c,n[9]=-a*l,n[2]=x-h*c,n[6]=g+d*c,n[10]=o*l}else if(e.order==="YXZ"){let h=l*u,d=l*f,g=c*u,x=c*f;n[0]=h+x*a,n[4]=g*a-d,n[8]=o*c,n[1]=o*f,n[5]=o*u,n[9]=-a,n[2]=d*a-g,n[6]=x+h*a,n[10]=o*l}else if(e.order==="ZXY"){let h=l*u,d=l*f,g=c*u,x=c*f;n[0]=h-x*a,n[4]=-o*f,n[8]=g+d*a,n[1]=d+g*a,n[5]=o*u,n[9]=x-h*a,n[2]=-o*c,n[6]=a,n[10]=o*l}else if(e.order==="ZYX"){let h=o*u,d=o*f,g=a*u,x=a*f;n[0]=l*u,n[4]=g*c-d,n[8]=h*c+x,n[1]=l*f,n[5]=x*c+h,n[9]=d*c-g,n[2]=-c,n[6]=a*l,n[10]=o*l}else if(e.order==="YZX"){let h=o*l,d=o*c,g=a*l,x=a*c;n[0]=l*u,n[4]=x-h*f,n[8]=g*f+d,n[1]=f,n[5]=o*u,n[9]=-a*u,n[2]=-c*u,n[6]=d*f+g,n[10]=h-x*f}else if(e.order==="XZY"){let h=o*l,d=o*c,g=a*l,x=a*c;n[0]=l*u,n[4]=-f,n[8]=c*u,n[1]=h*f+x,n[5]=o*u,n[9]=d*f-g,n[2]=g*f-d,n[6]=a*u,n[10]=x*f+h}return n[3]=0,n[7]=0,n[11]=0,n[12]=0,n[13]=0,n[14]=0,n[15]=1,this}makeRotationFromQuaternion(e){return this.compose(mT,e,gT)}lookAt(e,n,i){let r=this.elements;return ji.subVectors(e,n),ji.lengthSq()===0&&(ji.z=1),ji.normalize(),so.crossVectors(i,ji),so.lengthSq()===0&&(Math.abs(i.z)===1?ji.x+=1e-4:ji.z+=1e-4,ji.normalize(),so.crossVectors(i,ji)),so.normalize(),qh.crossVectors(ji,so),r[0]=so.x,r[4]=qh.x,r[8]=ji.x,r[1]=so.y,r[5]=qh.y,r[9]=ji.y,r[2]=so.z,r[6]=qh.z,r[10]=ji.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,n){let i=e.elements,r=n.elements,s=this.elements,o=i[0],a=i[4],l=i[8],c=i[12],u=i[1],f=i[5],h=i[9],d=i[13],g=i[2],x=i[6],m=i[10],p=i[14],_=i[3],M=i[7],v=i[11],S=i[15],w=r[0],E=r[4],y=r[8],T=r[12],R=r[1],F=r[5],O=r[9],z=r[13],L=r[2],V=r[6],N=r[10],D=r[14],H=r[3],G=r[7],$=r[11],J=r[15];return s[0]=o*w+a*R+l*L+c*H,s[4]=o*E+a*F+l*V+c*G,s[8]=o*y+a*O+l*N+c*$,s[12]=o*T+a*z+l*D+c*J,s[1]=u*w+f*R+h*L+d*H,s[5]=u*E+f*F+h*V+d*G,s[9]=u*y+f*O+h*N+d*$,s[13]=u*T+f*z+h*D+d*J,s[2]=g*w+x*R+m*L+p*H,s[6]=g*E+x*F+m*V+p*G,s[10]=g*y+x*O+m*N+p*$,s[14]=g*T+x*z+m*D+p*J,s[3]=_*w+M*R+v*L+S*H,s[7]=_*E+M*F+v*V+S*G,s[11]=_*y+M*O+v*N+S*$,s[15]=_*T+M*z+v*D+S*J,this}multiplyScalar(e){let n=this.elements;return n[0]*=e,n[4]*=e,n[8]*=e,n[12]*=e,n[1]*=e,n[5]*=e,n[9]*=e,n[13]*=e,n[2]*=e,n[6]*=e,n[10]*=e,n[14]*=e,n[3]*=e,n[7]*=e,n[11]*=e,n[15]*=e,this}determinant(){let e=this.elements,n=e[0],i=e[4],r=e[8],s=e[12],o=e[1],a=e[5],l=e[9],c=e[13],u=e[2],f=e[6],h=e[10],d=e[14],g=e[3],x=e[7],m=e[11],p=e[15],_=l*d-c*h,M=a*d-c*f,v=a*h-l*f,S=o*d-c*u,w=o*h-l*u,E=o*f-a*u;return n*(x*_-m*M+p*v)-i*(g*_-m*S+p*w)+r*(g*M-x*S+p*E)-s*(g*v-x*w+m*E)}determinantAffine(){let e=this.elements,n=e[0],i=e[4],r=e[8],s=e[1],o=e[5],a=e[9],l=e[2],c=e[6],u=e[10];return n*(o*u-a*c)-i*(s*u-a*l)+r*(s*c-o*l)}transpose(){let e=this.elements,n;return n=e[1],e[1]=e[4],e[4]=n,n=e[2],e[2]=e[8],e[8]=n,n=e[6],e[6]=e[9],e[9]=n,n=e[3],e[3]=e[12],e[12]=n,n=e[7],e[7]=e[13],e[13]=n,n=e[11],e[11]=e[14],e[14]=n,this}setPosition(e,n,i){let r=this.elements;return e.isVector3?(r[12]=e.x,r[13]=e.y,r[14]=e.z):(r[12]=e,r[13]=n,r[14]=i),this}invert(){let e=this.elements,n=e[0],i=e[1],r=e[2],s=e[3],o=e[4],a=e[5],l=e[6],c=e[7],u=e[8],f=e[9],h=e[10],d=e[11],g=e[12],x=e[13],m=e[14],p=e[15],_=n*a-i*o,M=n*l-r*o,v=n*c-s*o,S=i*l-r*a,w=i*c-s*a,E=r*c-s*l,y=u*x-f*g,T=u*m-h*g,R=u*p-d*g,F=f*m-h*x,O=f*p-d*x,z=h*p-d*m,L=_*z-M*O+v*F+S*R-w*T+E*y;if(L===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);let V=1/L;return e[0]=(a*z-l*O+c*F)*V,e[1]=(r*O-i*z-s*F)*V,e[2]=(x*E-m*w+p*S)*V,e[3]=(h*w-f*E-d*S)*V,e[4]=(l*R-o*z-c*T)*V,e[5]=(n*z-r*R+s*T)*V,e[6]=(m*v-g*E-p*M)*V,e[7]=(u*E-h*v+d*M)*V,e[8]=(o*O-a*R+c*y)*V,e[9]=(i*R-n*O-s*y)*V,e[10]=(g*w-x*v+p*_)*V,e[11]=(f*v-u*w-d*_)*V,e[12]=(a*T-o*F-l*y)*V,e[13]=(n*F-i*T+r*y)*V,e[14]=(x*M-g*S-m*_)*V,e[15]=(u*S-f*M+h*_)*V,this}scale(e){let n=this.elements,i=e.x,r=e.y,s=e.z;return n[0]*=i,n[4]*=r,n[8]*=s,n[1]*=i,n[5]*=r,n[9]*=s,n[2]*=i,n[6]*=r,n[10]*=s,n[3]*=i,n[7]*=r,n[11]*=s,this}getMaxScaleOnAxis(){let e=this.elements,n=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],i=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],r=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(n,i,r))}makeTranslation(e,n,i){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,n,0,0,1,i,0,0,0,1),this}makeRotationX(e){let n=Math.cos(e),i=Math.sin(e);return this.set(1,0,0,0,0,n,-i,0,0,i,n,0,0,0,0,1),this}makeRotationY(e){let n=Math.cos(e),i=Math.sin(e);return this.set(n,0,i,0,0,1,0,0,-i,0,n,0,0,0,0,1),this}makeRotationZ(e){let n=Math.cos(e),i=Math.sin(e);return this.set(n,-i,0,0,i,n,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,n){let i=Math.cos(n),r=Math.sin(n),s=1-i,o=e.x,a=e.y,l=e.z,c=s*o,u=s*a;return this.set(c*o+i,c*a-r*l,c*l+r*a,0,c*a+r*l,u*a+i,u*l-r*o,0,c*l-r*a,u*l+r*o,s*l*l+i,0,0,0,0,1),this}makeScale(e,n,i){return this.set(e,0,0,0,0,n,0,0,0,0,i,0,0,0,0,1),this}makeShear(e,n,i,r,s,o){return this.set(1,i,s,0,e,1,o,0,n,r,1,0,0,0,0,1),this}compose(e,n,i){let r=this.elements,s=n._x,o=n._y,a=n._z,l=n._w,c=s+s,u=o+o,f=a+a,h=s*c,d=s*u,g=s*f,x=o*u,m=o*f,p=a*f,_=l*c,M=l*u,v=l*f,S=i.x,w=i.y,E=i.z;return r[0]=(1-(x+p))*S,r[1]=(d+v)*S,r[2]=(g-M)*S,r[3]=0,r[4]=(d-v)*w,r[5]=(1-(h+p))*w,r[6]=(m+_)*w,r[7]=0,r[8]=(g+M)*E,r[9]=(m-_)*E,r[10]=(1-(h+x))*E,r[11]=0,r[12]=e.x,r[13]=e.y,r[14]=e.z,r[15]=1,this}decompose(e,n,i){let r=this.elements;e.x=r[12],e.y=r[13],e.z=r[14];let s=this.determinantAffine();if(s===0)return i.set(1,1,1),n.identity(),this;let o=Qa.set(r[0],r[1],r[2]).length(),a=Qa.set(r[4],r[5],r[6]).length(),l=Qa.set(r[8],r[9],r[10]).length();s<0&&(o=-o),Pr.copy(this);let c=1/o,u=1/a,f=1/l;return Pr.elements[0]*=c,Pr.elements[1]*=c,Pr.elements[2]*=c,Pr.elements[4]*=u,Pr.elements[5]*=u,Pr.elements[6]*=u,Pr.elements[8]*=f,Pr.elements[9]*=f,Pr.elements[10]*=f,n.setFromRotationMatrix(Pr),i.x=o,i.y=a,i.z=l,this}makePerspective(e,n,i,r,s,o,a=Nr,l=!1){let c=this.elements,u=2*s/(n-e),f=2*s/(i-r),h=(n+e)/(n-e),d=(i+r)/(i-r),g,x;if(l)g=s/(o-s),x=o*s/(o-s);else if(a===Nr)g=-(o+s)/(o-s),x=-2*o*s/(o-s);else if(a===Fc)g=-o/(o-s),x=-o*s/(o-s);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+a);return c[0]=u,c[4]=0,c[8]=h,c[12]=0,c[1]=0,c[5]=f,c[9]=d,c[13]=0,c[2]=0,c[6]=0,c[10]=g,c[14]=x,c[3]=0,c[7]=0,c[11]=-1,c[15]=0,this}makeOrthographic(e,n,i,r,s,o,a=Nr,l=!1){let c=this.elements,u=2/(n-e),f=2/(i-r),h=-(n+e)/(n-e),d=-(i+r)/(i-r),g,x;if(l)g=1/(o-s),x=o/(o-s);else if(a===Nr)g=-2/(o-s),x=-(o+s)/(o-s);else if(a===Fc)g=-1/(o-s),x=-s/(o-s);else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+a);return c[0]=u,c[4]=0,c[8]=0,c[12]=h,c[1]=0,c[5]=f,c[9]=0,c[13]=d,c[2]=0,c[6]=0,c[10]=g,c[14]=x,c[3]=0,c[7]=0,c[11]=0,c[15]=1,this}equals(e){let n=this.elements,i=e.elements;for(let r=0;r<16;r++)if(n[r]!==i[r])return!1;return!0}fromArray(e,n=0){for(let i=0;i<16;i++)this.elements[i]=e[i+n];return this}toArray(e=[],n=0){let i=this.elements;return e[n]=i[0],e[n+1]=i[1],e[n+2]=i[2],e[n+3]=i[3],e[n+4]=i[4],e[n+5]=i[5],e[n+6]=i[6],e[n+7]=i[7],e[n+8]=i[8],e[n+9]=i[9],e[n+10]=i[10],e[n+11]=i[11],e[n+12]=i[12],e[n+13]=i[13],e[n+14]=i[14],e[n+15]=i[15],e}};id.prototype.isMatrix4=!0;var Ot=id,Qa=new P,Pr=new Ot,mT=new P(0,0,0),gT=new P(1,1,1),so=new P,qh=new P,ji=new P,Hy=new Ot,Wy=new gr,fo=class t{constructor(e=0,n=0,i=0,r=t.DEFAULT_ORDER){this.isEuler=!0,this._x=e,this._y=n,this._z=i,this._order=r}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,n,i,r=this._order){return this._x=e,this._y=n,this._z=i,this._order=r,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,n=this._order,i=!0){let r=e.elements,s=r[0],o=r[4],a=r[8],l=r[1],c=r[5],u=r[9],f=r[2],h=r[6],d=r[10];switch(n){case"XYZ":this._y=Math.asin(Nt(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(-u,d),this._z=Math.atan2(-o,s)):(this._x=Math.atan2(h,c),this._z=0);break;case"YXZ":this._x=Math.asin(-Nt(u,-1,1)),Math.abs(u)<.9999999?(this._y=Math.atan2(a,d),this._z=Math.atan2(l,c)):(this._y=Math.atan2(-f,s),this._z=0);break;case"ZXY":this._x=Math.asin(Nt(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(-f,d),this._z=Math.atan2(-o,c)):(this._y=0,this._z=Math.atan2(l,s));break;case"ZYX":this._y=Math.asin(-Nt(f,-1,1)),Math.abs(f)<.9999999?(this._x=Math.atan2(h,d),this._z=Math.atan2(l,s)):(this._x=0,this._z=Math.atan2(-o,c));break;case"YZX":this._z=Math.asin(Nt(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-u,c),this._y=Math.atan2(-f,s)):(this._x=0,this._y=Math.atan2(a,d));break;case"XZY":this._z=Math.asin(-Nt(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(h,c),this._y=Math.atan2(a,s)):(this._x=Math.atan2(-u,d),this._y=0);break;default:dt("Euler: .setFromRotationMatrix() encountered an unknown order: "+n)}return this._order=n,i===!0&&this._onChangeCallback(),this}setFromQuaternion(e,n,i){return Hy.makeRotationFromQuaternion(e),this.setFromRotationMatrix(Hy,n,i)}setFromVector3(e,n=this._order){return this.set(e.x,e.y,e.z,n)}reorder(e){return Wy.setFromEuler(this),this.setFromQuaternion(Wy,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],n=0){return e[n]=this._x,e[n+1]=this._y,e[n+2]=this._z,e[n+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}};fo.DEFAULT_ORDER="XYZ";var gl=class{constructor(){this.mask=1}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return(this.mask&(1<<e|0))!==0}},xT=0,$y=new P,el=new gr,ws=new Ot,jh=new P,Ec=new P,vT=new P,yT=new gr,Xy=new P(1,0,0),Yy=new P(0,1,0),qy=new P(0,0,1),jy={type:"added"},_T={type:"removed"},tl={type:"childadded",child:null},c0={type:"childremoved",child:null},ki=class t extends Jr{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:xT++}),this.uuid=ho(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=t.DEFAULT_UP.clone();let e=new P,n=new fo,i=new gr,r=new P(1,1,1);function s(){i.setFromEuler(n,!1)}function o(){n.setFromQuaternion(i,void 0,!1)}n._onChange(s),i._onChange(o),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:e},rotation:{configurable:!0,enumerable:!0,value:n},quaternion:{configurable:!0,enumerable:!0,value:i},scale:{configurable:!0,enumerable:!0,value:r},modelViewMatrix:{value:new Ot},normalMatrix:{value:new _t}}),this.matrix=new Ot,this.matrixWorld=new Ot,this.matrixAutoUpdate=t.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=t.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new gl,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.static=!1,this.userData={},this.pivot=null}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,n){this.quaternion.setFromAxisAngle(e,n)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,n){return el.setFromAxisAngle(e,n),this.quaternion.multiply(el),this}rotateOnWorldAxis(e,n){return el.setFromAxisAngle(e,n),this.quaternion.premultiply(el),this}rotateX(e){return this.rotateOnAxis(Xy,e)}rotateY(e){return this.rotateOnAxis(Yy,e)}rotateZ(e){return this.rotateOnAxis(qy,e)}translateOnAxis(e,n){return $y.copy(e).applyQuaternion(this.quaternion),this.position.add($y.multiplyScalar(n)),this}translateX(e){return this.translateOnAxis(Xy,e)}translateY(e){return this.translateOnAxis(Yy,e)}translateZ(e){return this.translateOnAxis(qy,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(ws.copy(this.matrixWorld).invert())}lookAt(e,n,i){e.isVector3?jh.copy(e):jh.set(e,n,i);let r=this.parent;this.updateWorldMatrix(!0,!1),Ec.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?ws.lookAt(Ec,jh,this.up):ws.lookAt(jh,Ec,this.up),this.quaternion.setFromRotationMatrix(ws),r&&(ws.extractRotation(r.matrixWorld),el.setFromRotationMatrix(ws),this.quaternion.premultiply(el.invert()))}add(e){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.add(arguments[n]);return this}return e===this?(gt("Object3D.add: object can't be added as a child of itself.",e),this):(e&&e.isObject3D?(e.removeFromParent(),e.parent=this,this.children.push(e),e.dispatchEvent(jy),tl.child=e,this.dispatchEvent(tl),tl.child=null):gt("Object3D.add: object not an instance of THREE.Object3D.",e),this)}remove(e){if(arguments.length>1){for(let i=0;i<arguments.length;i++)this.remove(arguments[i]);return this}let n=this.children.indexOf(e);return n!==-1&&(e.parent=null,this.children.splice(n,1),e.dispatchEvent(_T),c0.child=e,this.dispatchEvent(c0),c0.child=null),this}removeFromParent(){let e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),ws.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),ws.multiply(e.parent.matrixWorld)),e.applyMatrix4(ws),e.removeFromParent(),e.parent=this,this.children.push(e),e.updateWorldMatrix(!1,!0),e.dispatchEvent(jy),tl.child=e,this.dispatchEvent(tl),tl.child=null,this}getObjectById(e){return this.getObjectByProperty("id",e)}getObjectByName(e){return this.getObjectByProperty("name",e)}getObjectByProperty(e,n){if(this[e]===n)return this;for(let i=0,r=this.children.length;i<r;i++){let o=this.children[i].getObjectByProperty(e,n);if(o!==void 0)return o}}getObjectsByProperty(e,n,i=[]){this[e]===n&&i.push(this);let r=this.children;for(let s=0,o=r.length;s<o;s++)r[s].getObjectsByProperty(e,n,i);return i}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Ec,e,vT),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Ec,yT,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);let n=this.matrixWorld.elements;return e.set(n[8],n[9],n[10]).normalize()}raycast(){}intersectsFrustum(){}traverse(e){e(this);let n=this.children;for(let i=0,r=n.length;i<r;i++)n[i].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);let n=this.children;for(let i=0,r=n.length;i<r;i++)n[i].traverseVisible(e)}traverseAncestors(e){let n=this.parent;n!==null&&(e(n),n.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale);let e=this.pivot;if(e!==null){let n=e.x,i=e.y,r=e.z,s=this.matrix.elements;s[12]+=n-s[0]*n-s[4]*i-s[8]*r,s[13]+=i-s[1]*n-s[5]*i-s[9]*r,s[14]+=r-s[2]*n-s[6]*i-s[10]*r}this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,e=!0);let n=this.children;for(let i=0,r=n.length;i<r;i++)n[i].updateMatrixWorld(e)}updateWorldMatrix(e,n,i=!1){let r=this.parent;if(e===!0&&r!==null&&r.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||i)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,i=!0),n===!0){let s=this.children;for(let o=0,a=s.length;o<a;o++)s[o].updateWorldMatrix(!1,!0,i)}}toJSON(e){let n=e===void 0||typeof e=="string",i={};n&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},i.metadata={version:4.7,type:"Object",generator:"Object3D.toJSON"});let r={};r.uuid=this.uuid,r.type=this.type,r.name=this.name,r.castShadow=this.castShadow,r.receiveShadow=this.receiveShadow,r.visible=this.visible,r.frustumCulled=this.frustumCulled,r.renderOrder=this.renderOrder,r.static=this.static,r.matrixAutoUpdate=this.matrixAutoUpdate,Object.keys(this.userData).length>0&&(r.userData=this.userData),r.layers=this.layers.mask,r.matrix=this.matrix.toArray(),r.up=this.up.toArray(),this.pivot!==null&&(r.pivot=this.pivot.toArray()),this.morphTargetDictionary!==void 0&&(r.morphTargetDictionary=Object.assign({},this.morphTargetDictionary)),this.morphTargetInfluences!==void 0&&(r.morphTargetInfluences=this.morphTargetInfluences.slice()),this.isInstancedMesh&&(r.type="InstancedMesh",r.count=this.count,r.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(r.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(r.type="BatchedMesh",r.perObjectFrustumCulled=this.perObjectFrustumCulled,r.sortObjects=this.sortObjects,r.drawRanges=this._drawRanges,r.reservedRanges=this._reservedRanges,r.geometryInfo=this._geometryInfo.map(a=>({...a,boundingBox:a.boundingBox?a.boundingBox.toJSON():void 0,boundingSphere:a.boundingSphere?a.boundingSphere.toJSON():void 0})),r.instanceInfo=this._instanceInfo.map(a=>({...a})),r.availableInstanceIds=this._availableInstanceIds.slice(),r.availableGeometryIds=this._availableGeometryIds.slice(),r.nextIndexStart=this._nextIndexStart,r.nextVertexStart=this._nextVertexStart,r.geometryCount=this._geometryCount,r.maxInstanceCount=this._maxInstanceCount,r.maxVertexCount=this._maxVertexCount,r.maxIndexCount=this._maxIndexCount,r.geometryInitialized=this._geometryInitialized,r.matricesTexture=this._matricesTexture.toJSON(e),r.indirectTexture=this._indirectTexture.toJSON(e),this._colorsTexture!==null&&(r.colorsTexture=this._colorsTexture.toJSON(e)),this.boundingSphere!==null&&(r.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(r.boundingBox=this.boundingBox.toJSON()));function s(a,l){return a[l.uuid]===void 0&&(a[l.uuid]=l.toJSON(e)),l.uuid}if(this.isScene)this.background&&(this.background.isColor?r.background=this.background.toJSON():this.background.isTexture&&(r.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(r.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){r.geometry=s(e.geometries,this.geometry);let a=this.geometry.parameters;if(a!==void 0&&a.shapes!==void 0){let l=a.shapes;if(Array.isArray(l))for(let c=0,u=l.length;c<u;c++){let f=l[c];s(e.shapes,f)}else s(e.shapes,l)}}if(this.isSkinnedMesh&&(r.bindMode=this.bindMode,r.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(s(e.skeletons,this.skeleton),r.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){let a=[];for(let l=0,c=this.material.length;l<c;l++)a.push(s(e.materials,this.material[l]));r.material=a}else r.material=s(e.materials,this.material);if(this.children.length>0){r.children=[];for(let a=0;a<this.children.length;a++)r.children.push(this.children[a].toJSON(e).object)}if(this.animations.length>0){r.animations=[];for(let a=0;a<this.animations.length;a++){let l=this.animations[a];r.animations.push(s(e.animations,l))}}if(n){let a=o(e.geometries),l=o(e.materials),c=o(e.textures),u=o(e.images),f=o(e.shapes),h=o(e.skeletons),d=o(e.animations),g=o(e.nodes);a.length>0&&(i.geometries=a),l.length>0&&(i.materials=l),c.length>0&&(i.textures=c),u.length>0&&(i.images=u),f.length>0&&(i.shapes=f),h.length>0&&(i.skeletons=h),d.length>0&&(i.animations=d),g.length>0&&(i.nodes=g)}return i.object=r,i;function o(a){let l=[];for(let c in a){let u=a[c];delete u.metadata,l.push(u)}return l}}clone(e){return new this.constructor().copy(this,e)}copy(e,n=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.pivot=e.pivot!==null?e.pivot.clone():null,this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.static=e.static,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),n===!0)for(let i=0;i<e.children.length;i++){let r=e.children[i];this.add(r.clone())}return this}dispose(){this.dispatchEvent({type:"dispose"})}};ki.DEFAULT_UP=new P(0,1,0);ki.DEFAULT_MATRIX_AUTO_UPDATE=!0;ki.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;var un=class extends ki{constructor(){super(),this.isGroup=!0,this.type="Group"}},bT={type:"move"},xl=class{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new un,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new un,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new P,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new P),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new un,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new P,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new P,this._grip.eventsEnabled=!1),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){let n=this._hand;if(n)for(let i of e.hand.values())this._getHandJoint(n,i)}return this.dispatchEvent({type:"connected",data:e}),this}disconnect(e){return this.dispatchEvent({type:"disconnected",data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,n,i){let r=null,s=null,o=null,a=this._targetRay,l=this._grip,c=this._hand;if(e&&n.session.visibilityState!=="visible-blurred"){if(c&&e.hand){o=!0;for(let x of e.hand.values()){let m=n.getJointPose(x,i),p=this._getHandJoint(c,x);m!==null&&(p.matrix.fromArray(m.transform.matrix),p.matrix.decompose(p.position,p.rotation,p.scale),p.matrixWorldNeedsUpdate=!0,p.jointRadius=m.radius),p.visible=m!==null}let u=c.joints["index-finger-tip"],f=c.joints["thumb-tip"],h=u.position.distanceTo(f.position),d=.02,g=.005;c.inputState.pinching&&h>d+g?(c.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:e.handedness,target:this})):!c.inputState.pinching&&h<=d-g&&(c.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:e.handedness,target:this}))}else l!==null&&e.gripSpace&&(s=n.getPose(e.gripSpace,i),s!==null&&(l.matrix.fromArray(s.transform.matrix),l.matrix.decompose(l.position,l.rotation,l.scale),l.matrixWorldNeedsUpdate=!0,s.linearVelocity?(l.hasLinearVelocity=!0,l.linearVelocity.copy(s.linearVelocity)):l.hasLinearVelocity=!1,s.angularVelocity?(l.hasAngularVelocity=!0,l.angularVelocity.copy(s.angularVelocity)):l.hasAngularVelocity=!1,l.eventsEnabled&&l.dispatchEvent({type:"gripUpdated",data:e,target:this})));a!==null&&(r=n.getPose(e.targetRaySpace,i),r===null&&s!==null&&(r=s),r!==null&&(a.matrix.fromArray(r.transform.matrix),a.matrix.decompose(a.position,a.rotation,a.scale),a.matrixWorldNeedsUpdate=!0,r.linearVelocity?(a.hasLinearVelocity=!0,a.linearVelocity.copy(r.linearVelocity)):a.hasLinearVelocity=!1,r.angularVelocity?(a.hasAngularVelocity=!0,a.angularVelocity.copy(r.angularVelocity)):a.hasAngularVelocity=!1,this.dispatchEvent(bT)))}return a!==null&&(a.visible=r!==null),l!==null&&(l.visible=s!==null),c!==null&&(c.visible=o!==null),this}_getHandJoint(e,n){if(e.joints[n.jointName]===void 0){let i=new un;i.matrixAutoUpdate=!1,i.visible=!1,e.joints[n.jointName]=i,e.add(i)}return e.joints[n.jointName]}},j_={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},oo={h:0,s:0,l:0},Zh={h:0,s:0,l:0};function u0(t,e,n){return n<0&&(n+=1),n>1&&(n-=1),n<1/6?t+(e-t)*6*n:n<1/2?e:n<2/3?t+(e-t)*6*(2/3-n):t}var Pt=class{constructor(e,n,i){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,n,i)}set(e,n,i){if(n===void 0&&i===void 0){let r=e;r&&r.isColor?this.copy(r):typeof r=="number"?this.setHex(r):typeof r=="string"&&this.setStyle(r)}else this.setRGB(e,n,i);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,n=Ki){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,Et.colorSpaceToWorking(this,n),this}setRGB(e,n,i,r=Et.workingColorSpace){return this.r=e,this.g=n,this.b=i,Et.colorSpaceToWorking(this,r),this}setHSL(e,n,i,r=Et.workingColorSpace){if(e=hT(e,1),n=Nt(n,0,1),i=Nt(i,0,1),n===0)this.r=this.g=this.b=i;else{let s=i<=.5?i*(1+n):i+n-i*n,o=2*i-s;this.r=u0(o,s,e+1/3),this.g=u0(o,s,e),this.b=u0(o,s,e-1/3)}return Et.colorSpaceToWorking(this,r),this}setStyle(e,n=Ki){function i(s){s!==void 0&&parseFloat(s)<1&&dt("Color: Alpha component of "+e+" will be ignored.")}let r;if(r=/^(\w+)\(([^\)]*)\)/.exec(e)){let s,o=r[1],a=r[2];switch(o){case"rgb":case"rgba":if(s=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return i(s[4]),this.setRGB(Math.min(255,parseInt(s[1],10))/255,Math.min(255,parseInt(s[2],10))/255,Math.min(255,parseInt(s[3],10))/255,n);if(s=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return i(s[4]),this.setRGB(Math.min(100,parseInt(s[1],10))/100,Math.min(100,parseInt(s[2],10))/100,Math.min(100,parseInt(s[3],10))/100,n);break;case"hsl":case"hsla":if(s=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return i(s[4]),this.setHSL(parseFloat(s[1])/360,parseFloat(s[2])/100,parseFloat(s[3])/100,n);break;default:dt("Color: Unknown color model "+e)}}else if(r=/^\#([A-Fa-f\d]+)$/.exec(e)){let s=r[1],o=s.length;if(o===3)return this.setRGB(parseInt(s.charAt(0),16)/15,parseInt(s.charAt(1),16)/15,parseInt(s.charAt(2),16)/15,n);if(o===6)return this.setHex(parseInt(s,16),n);dt("Color: Invalid hex color "+e)}else if(e&&e.length>0)return this.setColorName(e,n);return this}setColorName(e,n=Ki){let i=j_[e.toLowerCase()];return i!==void 0?this.setHex(i,n):dt("Color: Unknown color "+e),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=Cs(e.r),this.g=Cs(e.g),this.b=Cs(e.b),this}copyLinearToSRGB(e){return this.r=fl(e.r),this.g=fl(e.g),this.b=fl(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=Ki){return Et.workingToColorSpace(di.copy(this),e),Math.round(Nt(di.r*255,0,255))*65536+Math.round(Nt(di.g*255,0,255))*256+Math.round(Nt(di.b*255,0,255))}getHexString(e=Ki){return("000000"+this.getHex(e).toString(16)).slice(-6)}getHSL(e,n=Et.workingColorSpace){Et.workingToColorSpace(di.copy(this),n);let i=di.r,r=di.g,s=di.b,o=Math.max(i,r,s),a=Math.min(i,r,s),l,c,u=(a+o)/2;if(a===o)l=0,c=0;else{let f=o-a;switch(c=u<=.5?f/(o+a):f/(2-o-a),o){case i:l=(r-s)/f+(r<s?6:0);break;case r:l=(s-i)/f+2;break;case s:l=(i-r)/f+4;break}l/=6}return e.h=l,e.s=c,e.l=u,e}getRGB(e,n=Et.workingColorSpace){return Et.workingToColorSpace(di.copy(this),n),e.r=di.r,e.g=di.g,e.b=di.b,e}getStyle(e=Ki){Et.workingToColorSpace(di.copy(this),e);let n=di.r,i=di.g,r=di.b;return e!==Ki?`color(${e} ${n.toFixed(3)} ${i.toFixed(3)} ${r.toFixed(3)})`:`rgb(${Math.round(n*255)},${Math.round(i*255)},${Math.round(r*255)})`}offsetHSL(e,n,i){return this.getHSL(oo),this.setHSL(oo.h+e,oo.s+n,oo.l+i)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,n){return this.r=e.r+n.r,this.g=e.g+n.g,this.b=e.b+n.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,n){return this.r+=(e.r-this.r)*n,this.g+=(e.g-this.g)*n,this.b+=(e.b-this.b)*n,this}lerpColors(e,n,i){return this.r=e.r+(n.r-e.r)*i,this.g=e.g+(n.g-e.g)*i,this.b=e.b+(n.b-e.b)*i,this}lerpHSL(e,n){this.getHSL(oo),e.getHSL(Zh);let i=r0(oo.h,Zh.h,n),r=r0(oo.s,Zh.s,n),s=r0(oo.l,Zh.l,n);return this.setHSL(i,r,s),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){let n=this.r,i=this.g,r=this.b,s=e.elements;return this.r=s[0]*n+s[3]*i+s[6]*r,this.g=s[1]*n+s[4]*i+s[7]*r,this.b=s[2]*n+s[5]*i+s[8]*r,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,n=0){return this.r=e[n],this.g=e[n+1],this.b=e[n+2],this}toArray(e=[],n=0){return e[n]=this.r,e[n+1]=this.g,e[n+2]=this.b,e}fromBufferAttribute(e,n){return this.r=e.getX(n),this.g=e.getY(n),this.b=e.getZ(n),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}},di=new Pt;Pt.NAMES=j_;var Ps=class extends ki{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new fo,this.environmentIntensity=1,this.environmentRotation=new fo,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(e,n){return super.copy(e,n),e.background!==null&&(this.background=e.background.clone()),e.environment!==null&&(this.environment=e.environment.clone()),e.fog!==null&&(this.fog=e.fog.clone()),this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,this.backgroundRotation.copy(e.backgroundRotation),this.environmentIntensity=e.environmentIntensity,this.environmentRotation.copy(e.environmentRotation),e.overrideMaterial!==null&&(this.overrideMaterial=e.overrideMaterial.clone()),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){let n=super.toJSON(e);return this.fog!==null&&(n.object.fog=this.fog.toJSON()),n.object.backgroundBlurriness=this.backgroundBlurriness,n.object.backgroundIntensity=this.backgroundIntensity,n.object.backgroundRotation=this.backgroundRotation.toArray(),n.object.environmentIntensity=this.environmentIntensity,n.object.environmentRotation=this.environmentRotation.toArray(),n}},Ir=new P,As=new P,h0=new P,Ts=new P,nl=new P,il=new P,Zy=new P,f0=new P,d0=new P,p0=new P,m0=new Vt,g0=new Vt,x0=new Vt,uo=class t{constructor(e=new P,n=new P,i=new P){this.a=e,this.b=n,this.c=i}static getNormal(e,n,i,r){r.subVectors(i,n),Ir.subVectors(e,n),r.cross(Ir);let s=r.lengthSq();return s>0?r.multiplyScalar(1/Math.sqrt(s)):r.set(0,0,0)}static getBarycoord(e,n,i,r,s){Ir.subVectors(r,n),As.subVectors(i,n),h0.subVectors(e,n);let o=Ir.dot(Ir),a=Ir.dot(As),l=Ir.dot(h0),c=As.dot(As),u=As.dot(h0),f=o*c-a*a;if(f===0)return s.set(0,0,0),null;let h=1/f,d=(c*l-a*u)*h,g=(o*u-a*l)*h;return s.set(1-d-g,g,d)}static containsPoint(e,n,i,r){return this.getBarycoord(e,n,i,r,Ts)===null?!1:Ts.x>=0&&Ts.y>=0&&Ts.x+Ts.y<=1}static getInterpolation(e,n,i,r,s,o,a,l){return this.getBarycoord(e,n,i,r,Ts)===null?(l.x=0,l.y=0,"z"in l&&(l.z=0),"w"in l&&(l.w=0),null):(l.setScalar(0),l.addScaledVector(s,Ts.x),l.addScaledVector(o,Ts.y),l.addScaledVector(a,Ts.z),l)}static getInterpolatedAttribute(e,n,i,r,s,o){return m0.setScalar(0),g0.setScalar(0),x0.setScalar(0),m0.fromBufferAttribute(e,n),g0.fromBufferAttribute(e,i),x0.fromBufferAttribute(e,r),o.setScalar(0),o.addScaledVector(m0,s.x),o.addScaledVector(g0,s.y),o.addScaledVector(x0,s.z),o}static isFrontFacing(e,n,i,r){return Ir.subVectors(i,n),As.subVectors(e,n),Ir.cross(As).dot(r)<0}set(e,n,i){return this.a.copy(e),this.b.copy(n),this.c.copy(i),this}setFromPointsAndIndices(e,n,i,r){return this.a.copy(e[n]),this.b.copy(e[i]),this.c.copy(e[r]),this}setFromAttributeAndIndices(e,n,i,r){return this.a.fromBufferAttribute(e,n),this.b.fromBufferAttribute(e,i),this.c.fromBufferAttribute(e,r),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return Ir.subVectors(this.c,this.b),As.subVectors(this.a,this.b),Ir.cross(As).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(e){return t.getNormal(this.a,this.b,this.c,e)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(e,n){return t.getBarycoord(e,this.a,this.b,this.c,n)}getInterpolation(e,n,i,r,s){return t.getInterpolation(e,this.a,this.b,this.c,n,i,r,s)}containsPoint(e){return t.containsPoint(e,this.a,this.b,this.c)}isFrontFacing(e){return t.isFrontFacing(this.a,this.b,this.c,e)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,n){let i=this.a,r=this.b,s=this.c,o,a;nl.subVectors(r,i),il.subVectors(s,i),f0.subVectors(e,i);let l=nl.dot(f0),c=il.dot(f0);if(l<=0&&c<=0)return n.copy(i);d0.subVectors(e,r);let u=nl.dot(d0),f=il.dot(d0);if(u>=0&&f<=u)return n.copy(r);let h=l*f-u*c;if(h<=0&&l>=0&&u<=0)return o=l/(l-u),n.copy(i).addScaledVector(nl,o);p0.subVectors(e,s);let d=nl.dot(p0),g=il.dot(p0);if(g>=0&&d<=g)return n.copy(s);let x=d*c-l*g;if(x<=0&&c>=0&&g<=0)return a=c/(c-g),n.copy(i).addScaledVector(il,a);let m=u*g-d*f;if(m<=0&&f-u>=0&&d-g>=0)return Zy.subVectors(s,r),a=(f-u)/(f-u+(d-g)),n.copy(r).addScaledVector(Zy,a);let p=1/(m+x+h);return o=x*p,a=h*p,n.copy(i).addScaledVector(nl,o).addScaledVector(il,a)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}},Qr=class{constructor(e=new P(1/0,1/0,1/0),n=new P(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=n}set(e,n){return this.min.copy(e),this.max.copy(n),this}setFromArray(e){this.makeEmpty();for(let n=0,i=e.length;n<i;n+=3)this.expandByPoint(Lr.fromArray(e,n));return this}setFromBufferAttribute(e){this.makeEmpty();for(let n=0,i=e.count;n<i;n++)this.expandByPoint(Lr.fromBufferAttribute(e,n));return this}setFromPoints(e){this.makeEmpty();for(let n=0,i=e.length;n<i;n++)this.expandByPoint(e[n]);return this}setFromCenterAndSize(e,n){let i=Lr.copy(n).multiplyScalar(.5);return this.min.copy(e).sub(i),this.max.copy(e).add(i),this}setFromObject(e,n=!1){return this.makeEmpty(),this.expandByObject(e,n)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,n=!1){e.updateWorldMatrix(!1,!1);let i=e.geometry;if(i!==void 0){let s=i.getAttribute("position");if(n===!0&&s!==void 0&&e.isInstancedMesh!==!0)for(let o=0,a=s.count;o<a;o++)e.isMesh===!0?e.getVertexPosition(o,Lr):Lr.fromBufferAttribute(s,o),Lr.applyMatrix4(e.matrixWorld),this.expandByPoint(Lr);else e.boundingBox!==void 0?(e.boundingBox===null&&e.computeBoundingBox(),Kh.copy(e.boundingBox)):(i.boundingBox===null&&i.computeBoundingBox(),Kh.copy(i.boundingBox)),Kh.applyMatrix4(e.matrixWorld),this.union(Kh)}let r=e.children;for(let s=0,o=r.length;s<o;s++)this.expandByObject(r[s],n);return this}containsPoint(e){return e.x>=this.min.x&&e.x<=this.max.x&&e.y>=this.min.y&&e.y<=this.max.y&&e.z>=this.min.z&&e.z<=this.max.z}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,n){return n.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return e.max.x>=this.min.x&&e.min.x<=this.max.x&&e.max.y>=this.min.y&&e.min.y<=this.max.y&&e.max.z>=this.min.z&&e.min.z<=this.max.z}intersectsSphere(e){return this.clampPoint(e.center,Lr),Lr.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let n,i;return e.normal.x>0?(n=e.normal.x*this.min.x,i=e.normal.x*this.max.x):(n=e.normal.x*this.max.x,i=e.normal.x*this.min.x),e.normal.y>0?(n+=e.normal.y*this.min.y,i+=e.normal.y*this.max.y):(n+=e.normal.y*this.max.y,i+=e.normal.y*this.min.y),e.normal.z>0?(n+=e.normal.z*this.min.z,i+=e.normal.z*this.max.z):(n+=e.normal.z*this.max.z,i+=e.normal.z*this.min.z),n<=-e.constant&&i>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(Rc),Jh.subVectors(this.max,Rc),rl.subVectors(e.a,Rc),sl.subVectors(e.b,Rc),ol.subVectors(e.c,Rc),ao.subVectors(sl,rl),lo.subVectors(ol,sl),Jo.subVectors(rl,ol);let n=[0,-ao.z,ao.y,0,-lo.z,lo.y,0,-Jo.z,Jo.y,ao.z,0,-ao.x,lo.z,0,-lo.x,Jo.z,0,-Jo.x,-ao.y,ao.x,0,-lo.y,lo.x,0,-Jo.y,Jo.x,0];return!v0(n,rl,sl,ol,Jh)||(n=[1,0,0,0,1,0,0,0,1],!v0(n,rl,sl,ol,Jh))?!1:(Qh.crossVectors(ao,lo),n=[Qh.x,Qh.y,Qh.z],v0(n,rl,sl,ol,Jh))}clampPoint(e,n){return n.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,Lr).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(Lr).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()?this:(Es[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),Es[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),Es[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),Es[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),Es[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),Es[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),Es[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),Es[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(Es),this)}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(e){return this.min.fromArray(e.min),this.max.fromArray(e.max),this}},Es=[new P,new P,new P,new P,new P,new P,new P,new P],Lr=new P,Kh=new Qr,rl=new P,sl=new P,ol=new P,ao=new P,lo=new P,Jo=new P,Rc=new P,Jh=new P,Qh=new P,Qo=new P;function v0(t,e,n,i,r){for(let s=0,o=t.length-3;s<=o;s+=3){Qo.fromArray(t,s);let a=r.x*Math.abs(Qo.x)+r.y*Math.abs(Qo.y)+r.z*Math.abs(Qo.z),l=e.dot(Qo),c=n.dot(Qo),u=i.dot(Qo);if(Math.max(-Math.max(l,c,u),Math.min(l,c,u))>a)return!1}return!0}var Gn=new P,ef=new pt,MT=0,hn=class extends Jr{constructor(e,n,i=!1){if(super(),Array.isArray(e))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:MT++}),this.name="",this.array=e,this.itemSize=n,this.count=e!==void 0?e.length/n:0,this.normalized=i,this.usage=eg,this.updateRanges=[],this.gpuType=xr,this.version=0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,n){this.updateRanges.push({start:e,count:n})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this}copyAt(e,n,i){e*=this.itemSize,i*=n.itemSize;for(let r=0,s=this.itemSize;r<s;r++)this.array[e+r]=n.array[i+r];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let n=0,i=this.count;n<i;n++)ef.fromBufferAttribute(this,n),ef.applyMatrix3(e),this.setXY(n,ef.x,ef.y);else if(this.itemSize===3)for(let n=0,i=this.count;n<i;n++)Gn.fromBufferAttribute(this,n),Gn.applyMatrix3(e),this.setXYZ(n,Gn.x,Gn.y,Gn.z);return this}applyMatrix4(e){for(let n=0,i=this.count;n<i;n++)Gn.fromBufferAttribute(this,n),Gn.applyMatrix4(e),this.setXYZ(n,Gn.x,Gn.y,Gn.z);return this}applyNormalMatrix(e){for(let n=0,i=this.count;n<i;n++)Gn.fromBufferAttribute(this,n),Gn.applyNormalMatrix(e),this.setXYZ(n,Gn.x,Gn.y,Gn.z);return this}transformDirection(e){for(let n=0,i=this.count;n<i;n++)Gn.fromBufferAttribute(this,n),Gn.transformDirection(e),this.setXYZ(n,Gn.x,Gn.y,Gn.z);return this}set(e,n=0){return this.array.set(e,n),this}getComponent(e,n){let i=this.array[e*this.itemSize+n];return this.normalized&&(i=Zr(i,this.array)),i}setComponent(e,n,i){return this.normalized&&(i=cn(i,this.array)),this.array[e*this.itemSize+n]=i,this}getX(e){let n=this.array[e*this.itemSize];return this.normalized&&(n=Zr(n,this.array)),n}setX(e,n){return this.normalized&&(n=cn(n,this.array)),this.array[e*this.itemSize]=n,this}getY(e){let n=this.array[e*this.itemSize+1];return this.normalized&&(n=Zr(n,this.array)),n}setY(e,n){return this.normalized&&(n=cn(n,this.array)),this.array[e*this.itemSize+1]=n,this}getZ(e){let n=this.array[e*this.itemSize+2];return this.normalized&&(n=Zr(n,this.array)),n}setZ(e,n){return this.normalized&&(n=cn(n,this.array)),this.array[e*this.itemSize+2]=n,this}getW(e){let n=this.array[e*this.itemSize+3];return this.normalized&&(n=Zr(n,this.array)),n}setW(e,n){return this.normalized&&(n=cn(n,this.array)),this.array[e*this.itemSize+3]=n,this}setXY(e,n,i){return e*=this.itemSize,this.normalized&&(n=cn(n,this.array),i=cn(i,this.array)),this.array[e+0]=n,this.array[e+1]=i,this}setXYZ(e,n,i,r){return e*=this.itemSize,this.normalized&&(n=cn(n,this.array),i=cn(i,this.array),r=cn(r,this.array)),this.array[e+0]=n,this.array[e+1]=i,this.array[e+2]=r,this}setXYZW(e,n,i,r,s){return e*=this.itemSize,this.normalized&&(n=cn(n,this.array),i=cn(i,this.array),r=cn(r,this.array),s=cn(s,this.array)),this.array[e+0]=n,this.array[e+1]=i,this.array[e+2]=r,this.array[e+3]=s,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){let e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return e.name=this.name,e.usage=this.usage,e.gpuType=this.gpuType,e}dispose(){this.dispatchEvent({type:"dispose"})}};var zc=class extends hn{constructor(e,n,i){super(new Uint16Array(e),n,i)}};var Vc=class extends hn{constructor(e,n,i){super(new Uint32Array(e),n,i)}};var rn=class extends hn{constructor(e,n,i){super(new Float32Array(e),n,i)}},ST=new Qr,Cc=new P,y0=new P,es=class{constructor(e=new P,n=-1){this.isSphere=!0,this.center=e,this.radius=n}set(e,n){return this.center.copy(e),this.radius=n,this}setFromPoints(e,n){let i=this.center;n!==void 0?i.copy(n):ST.setFromPoints(e).getCenter(i);let r=0;for(let s=0,o=e.length;s<o;s++)r=Math.max(r,i.distanceToSquared(e[s]));return this.radius=Math.sqrt(r),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){let n=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=n*n}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,n){let i=this.center.distanceToSquared(e);return n.copy(e),i>this.radius*this.radius&&(n.sub(this.center).normalize(),n.multiplyScalar(this.radius).add(this.center)),n}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius=this.radius*e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;Cc.subVectors(e,this.center);let n=Cc.lengthSq();if(n>this.radius*this.radius){let i=Math.sqrt(n),r=(i-this.radius)*.5;this.center.addScaledVector(Cc,r/i),this.radius+=r}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(y0.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(Cc.copy(e.center).add(y0)),this.expandByPoint(Cc.copy(e.center).sub(y0))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(e){return this.radius=e.radius,this.center.fromArray(e.center),this}},wT=0,mr=new Ot,_0=new ki,al=new P,Zi=new Qr,Pc=new Qr,Jn=new P,Fn=class t extends Jr{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:wT++}),this.uuid=ho(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.indirectOffset=0,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={},this._transformed=!1}getIndex(){return this.index}setIndex(e){return Array.isArray(e)?this.index=new(cT(e)?Vc:zc)(e,1):this.index=e,this}setIndirect(e,n=0){return this.indirect=e,this.indirectOffset=n,this}getIndirect(){return this.indirect}getAttribute(e){return this.attributes[e]}setAttribute(e,n){return this.attributes[e]=n,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,n,i=0){this.groups.push({start:e,count:n,materialIndex:i})}clearGroups(){this.groups=[]}setDrawRange(e,n){this.drawRange.start=e,this.drawRange.count=n}applyMatrix4(e){let n=this.attributes.position;n!==void 0&&(n.applyMatrix4(e),n.needsUpdate=!0);let i=this.attributes.normal;if(i!==void 0){let s=new _t().getNormalMatrix(e);i.applyNormalMatrix(s),i.needsUpdate=!0}let r=this.attributes.tangent;return r!==void 0&&(r.transformDirection(e),r.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this._transformed=!0,this}applyQuaternion(e){return mr.makeRotationFromQuaternion(e),this.applyMatrix4(mr),this}rotateX(e){return mr.makeRotationX(e),this.applyMatrix4(mr),this}rotateY(e){return mr.makeRotationY(e),this.applyMatrix4(mr),this}rotateZ(e){return mr.makeRotationZ(e),this.applyMatrix4(mr),this}translate(e,n,i){return mr.makeTranslation(e,n,i),this.applyMatrix4(mr),this}scale(e,n,i){return mr.makeScale(e,n,i),this.applyMatrix4(mr),this}lookAt(e){return _0.lookAt(e),_0.updateMatrix(),this.applyMatrix4(_0.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(al).negate(),this.translate(al.x,al.y,al.z),this}setFromPoints(e){let n=this.getAttribute("position");if(n===void 0){let i=[];for(let r=0,s=e.length;r<s;r++){let o=e[r];i.push(o.x,o.y,o.z||0)}this.setAttribute("position",new rn(i,3))}else{let i=Math.min(e.length,n.count);for(let r=0;r<i;r++){let s=e[r];n.setXYZ(r,s.x,s.y,s.z||0)}e.length>n.count&&dt("BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),n.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new Qr);let e=this.attributes.position,n=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){gt("BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new P(-1/0,-1/0,-1/0),new P(1/0,1/0,1/0));return}if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),n)for(let i=0,r=n.length;i<r;i++){let s=n[i];Zi.setFromBufferAttribute(s),this.morphTargetsRelative?(Jn.addVectors(this.boundingBox.min,Zi.min),this.boundingBox.expandByPoint(Jn),Jn.addVectors(this.boundingBox.max,Zi.max),this.boundingBox.expandByPoint(Jn)):(this.boundingBox.expandByPoint(Zi.min),this.boundingBox.expandByPoint(Zi.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&gt('BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new es);let e=this.attributes.position,n=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){gt("BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new P,1/0);return}if(e){let i=this.boundingSphere.center;if(Zi.setFromBufferAttribute(e),n)for(let s=0,o=n.length;s<o;s++){let a=n[s];Pc.setFromBufferAttribute(a),this.morphTargetsRelative?(Jn.addVectors(Zi.min,Pc.min),Zi.expandByPoint(Jn),Jn.addVectors(Zi.max,Pc.max),Zi.expandByPoint(Jn)):(Zi.expandByPoint(Pc.min),Zi.expandByPoint(Pc.max))}Zi.getCenter(i);let r=0;for(let s=0,o=e.count;s<o;s++)Jn.fromBufferAttribute(e,s),r=Math.max(r,i.distanceToSquared(Jn));if(n)for(let s=0,o=n.length;s<o;s++){let a=n[s],l=this.morphTargetsRelative;for(let c=0,u=a.count;c<u;c++)Jn.fromBufferAttribute(a,c),l&&(al.fromBufferAttribute(e,c),Jn.add(al)),r=Math.max(r,i.distanceToSquared(Jn))}this.boundingSphere.radius=Math.sqrt(r),isNaN(this.boundingSphere.radius)&&gt('BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){let e=this.index,n=this.attributes;if(e===null||n.position===void 0||n.normal===void 0||n.uv===void 0){gt("BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}let i=n.position,r=n.normal,s=n.uv,o=this.getAttribute("tangent");(o===void 0||o.count!==i.count)&&(o=new hn(new Float32Array(4*i.count),4),this.setAttribute("tangent",o));let a=[],l=[];for(let y=0;y<i.count;y++)a[y]=new P,l[y]=new P;let c=new P,u=new P,f=new P,h=new pt,d=new pt,g=new pt,x=new P,m=new P;function p(y,T,R){c.fromBufferAttribute(i,y),u.fromBufferAttribute(i,T),f.fromBufferAttribute(i,R),h.fromBufferAttribute(s,y),d.fromBufferAttribute(s,T),g.fromBufferAttribute(s,R),u.sub(c),f.sub(c),d.sub(h),g.sub(h);let F=1/(d.x*g.y-g.x*d.y);isFinite(F)&&(x.copy(u).multiplyScalar(g.y).addScaledVector(f,-d.y).multiplyScalar(F),m.copy(f).multiplyScalar(d.x).addScaledVector(u,-g.x).multiplyScalar(F),a[y].add(x),a[T].add(x),a[R].add(x),l[y].add(m),l[T].add(m),l[R].add(m))}let _=this.groups;_.length===0&&(_=[{start:0,count:e.count}]);for(let y=0,T=_.length;y<T;++y){let R=_[y],F=R.start,O=R.count;for(let z=F,L=F+O;z<L;z+=3)p(e.getX(z+0),e.getX(z+1),e.getX(z+2))}let M=new P,v=new P,S=new P,w=new P;function E(y){S.fromBufferAttribute(r,y),w.copy(S);let T=a[y];M.copy(T),M.sub(S.multiplyScalar(S.dot(T))).normalize(),v.crossVectors(w,T);let F=v.dot(l[y])<0?-1:1;o.setXYZW(y,M.x,M.y,M.z,F)}for(let y=0,T=_.length;y<T;++y){let R=_[y],F=R.start,O=R.count;for(let z=F,L=F+O;z<L;z+=3)E(e.getX(z+0)),E(e.getX(z+1)),E(e.getX(z+2))}this._transformed=!0}computeVertexNormals(){let e=this.index,n=this.getAttribute("position");if(n!==void 0){let i=this.getAttribute("normal");if(i===void 0||i.count!==n.count)i=new hn(new Float32Array(n.count*3),3),this.setAttribute("normal",i);else for(let h=0,d=i.count;h<d;h++)i.setXYZ(h,0,0,0);let r=new P,s=new P,o=new P,a=new P,l=new P,c=new P,u=new P,f=new P;if(e)for(let h=0,d=e.count;h<d;h+=3){let g=e.getX(h+0),x=e.getX(h+1),m=e.getX(h+2);r.fromBufferAttribute(n,g),s.fromBufferAttribute(n,x),o.fromBufferAttribute(n,m),u.subVectors(o,s),f.subVectors(r,s),u.cross(f),a.fromBufferAttribute(i,g),l.fromBufferAttribute(i,x),c.fromBufferAttribute(i,m),a.add(u),l.add(u),c.add(u),i.setXYZ(g,a.x,a.y,a.z),i.setXYZ(x,l.x,l.y,l.z),i.setXYZ(m,c.x,c.y,c.z)}else for(let h=0,d=n.count;h<d;h+=3)r.fromBufferAttribute(n,h+0),s.fromBufferAttribute(n,h+1),o.fromBufferAttribute(n,h+2),u.subVectors(o,s),f.subVectors(r,s),u.cross(f),i.setXYZ(h+0,u.x,u.y,u.z),i.setXYZ(h+1,u.x,u.y,u.z),i.setXYZ(h+2,u.x,u.y,u.z);this.normalizeNormals(),i.needsUpdate=!0}}normalizeNormals(){let e=this.attributes.normal;for(let n=0,i=e.count;n<i;n++)Jn.fromBufferAttribute(e,n),Jn.normalize(),e.setXYZ(n,Jn.x,Jn.y,Jn.z)}toNonIndexed(){function e(a,l){let c=a.array,u=a.itemSize,f=a.normalized,h=new c.constructor(l.length*u),d=0,g=0;for(let x=0,m=l.length;x<m;x++){a.isInterleavedBufferAttribute?d=l[x]*a.data.stride+a.offset:d=l[x]*u;for(let p=0;p<u;p++)h[g++]=c[d++]}return new hn(h,u,f)}if(this.index===null)return dt("BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;let n=new t,i=this.index.array,r=this.attributes;for(let a in r){let l=r[a],c=e(l,i);n.setAttribute(a,c)}let s=this.morphAttributes;for(let a in s){let l=[],c=s[a];for(let u=0,f=c.length;u<f;u++){let h=c[u],d=e(h,i);l.push(d)}n.morphAttributes[a]=l}n.morphTargetsRelative=this.morphTargetsRelative;let o=this.groups;for(let a=0,l=o.length;a<l;a++){let c=o[a];n.addGroup(c.start,c.count,c.materialIndex)}return n}toJSON(){let e={metadata:{version:4.7,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(e.uuid=this.uuid,e.type=this.parameters!==void 0&&this._transformed===!0?"BufferGeometry":this.type,e.name=this.name,Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0&&this._transformed!==!0){let l=this.parameters;for(let c in l)l[c]!==void 0&&(e[c]=l[c]);return e}e.data={attributes:{}};let n=this.index;n!==null&&(e.data.index={type:n.array.constructor.name,array:Array.prototype.slice.call(n.array)});let i=this.attributes;for(let l in i){let c=i[l];e.data.attributes[l]=c.toJSON(e.data)}let r={},s=!1;for(let l in this.morphAttributes){let c=this.morphAttributes[l],u=[];for(let f=0,h=c.length;f<h;f++){let d=c[f];u.push(d.toJSON(e.data))}u.length>0&&(r[l]=u,s=!0)}s&&(e.data.morphAttributes=r,e.data.morphTargetsRelative=this.morphTargetsRelative);let o=this.groups;o.length>0&&(e.data.groups=JSON.parse(JSON.stringify(o)));let a=this.boundingSphere;return a!==null&&(e.data.boundingSphere=a.toJSON()),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;let n={};this.name=e.name;let i=e.index;i!==null&&this.setIndex(i.clone());let r=e.attributes;for(let c in r){let u=r[c];this.setAttribute(c,u.clone(n))}let s=e.morphAttributes;for(let c in s){let u=[],f=s[c];for(let h=0,d=f.length;h<d;h++)u.push(f[h].clone(n));this.morphAttributes[c]=u}this.morphTargetsRelative=e.morphTargetsRelative;let o=e.groups;for(let c=0,u=o.length;c<u;c++){let f=o[c];this.addGroup(f.start,f.count,f.materialIndex)}let a=e.boundingBox;a!==null&&(this.boundingBox=a.clone());let l=e.boundingSphere;return l!==null&&(this.boundingSphere=l.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this._transformed=e._transformed,this}dispose(){this.dispatchEvent({type:"dispose"})}},Of=class{constructor(e,n){this.isInterleavedBuffer=!0,this.array=e,this.stride=n,this.count=e!==void 0?e.length/n:0,this.usage=eg,this.updateRanges=[],this.version=0,this.uuid=ho()}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,n){this.updateRanges.push({start:e,count:n})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.array=new e.array.constructor(e.array),this.count=e.count,this.stride=e.stride,this.usage=e.usage,this}copyAt(e,n,i){e*=this.stride,i*=n.stride;for(let r=0,s=this.stride;r<s;r++)this.array[e+r]=n.array[i+r];return this}set(e,n=0){return this.array.set(e,n),this}clone(e){e.arrayBuffers===void 0&&(e.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=ho()),e.arrayBuffers[this.array.buffer._uuid]===void 0&&(e.arrayBuffers[this.array.buffer._uuid]=this.array.slice(0).buffer);let n=new this.array.constructor(e.arrayBuffers[this.array.buffer._uuid]),i=new this.constructor(n,this.stride);return i.setUsage(this.usage),i}onUpload(e){return this.onUploadCallback=e,this}toJSON(e){e.arrayBuffers===void 0&&(e.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=ho()),e.arrayBuffers[this.array.buffer._uuid]===void 0&&(e.arrayBuffers[this.array.buffer._uuid]=Array.from(new Uint32Array(this.array.buffer)));let n={uuid:this.uuid,buffer:this.array.buffer._uuid,type:this.array.constructor.name,stride:this.stride};return n.usage=this.usage,n}},Ri=new P,vl=class t{constructor(e,n,i,r=!1){this.isInterleavedBufferAttribute=!0,this.name="",this.data=e,this.itemSize=n,this.offset=i,this.normalized=r}get count(){return this.data.count}get array(){return this.data.array}set needsUpdate(e){this.data.needsUpdate=e}applyMatrix4(e){for(let n=0,i=this.data.count;n<i;n++)Ri.fromBufferAttribute(this,n),Ri.applyMatrix4(e),this.setXYZ(n,Ri.x,Ri.y,Ri.z);return this}applyNormalMatrix(e){for(let n=0,i=this.count;n<i;n++)Ri.fromBufferAttribute(this,n),Ri.applyNormalMatrix(e),this.setXYZ(n,Ri.x,Ri.y,Ri.z);return this}transformDirection(e){for(let n=0,i=this.count;n<i;n++)Ri.fromBufferAttribute(this,n),Ri.transformDirection(e),this.setXYZ(n,Ri.x,Ri.y,Ri.z);return this}getComponent(e,n){let i=this.array[e*this.data.stride+this.offset+n];return this.normalized&&(i=Zr(i,this.array)),i}setComponent(e,n,i){return this.normalized&&(i=cn(i,this.array)),this.data.array[e*this.data.stride+this.offset+n]=i,this}setX(e,n){return this.normalized&&(n=cn(n,this.array)),this.data.array[e*this.data.stride+this.offset]=n,this}setY(e,n){return this.normalized&&(n=cn(n,this.array)),this.data.array[e*this.data.stride+this.offset+1]=n,this}setZ(e,n){return this.normalized&&(n=cn(n,this.array)),this.data.array[e*this.data.stride+this.offset+2]=n,this}setW(e,n){return this.normalized&&(n=cn(n,this.array)),this.data.array[e*this.data.stride+this.offset+3]=n,this}getX(e){let n=this.data.array[e*this.data.stride+this.offset];return this.normalized&&(n=Zr(n,this.array)),n}getY(e){let n=this.data.array[e*this.data.stride+this.offset+1];return this.normalized&&(n=Zr(n,this.array)),n}getZ(e){let n=this.data.array[e*this.data.stride+this.offset+2];return this.normalized&&(n=Zr(n,this.array)),n}getW(e){let n=this.data.array[e*this.data.stride+this.offset+3];return this.normalized&&(n=Zr(n,this.array)),n}setXY(e,n,i){return e=e*this.data.stride+this.offset,this.normalized&&(n=cn(n,this.array),i=cn(i,this.array)),this.data.array[e+0]=n,this.data.array[e+1]=i,this}setXYZ(e,n,i,r){return e=e*this.data.stride+this.offset,this.normalized&&(n=cn(n,this.array),i=cn(i,this.array),r=cn(r,this.array)),this.data.array[e+0]=n,this.data.array[e+1]=i,this.data.array[e+2]=r,this}setXYZW(e,n,i,r,s){return e=e*this.data.stride+this.offset,this.normalized&&(n=cn(n,this.array),i=cn(i,this.array),r=cn(r,this.array),s=cn(s,this.array)),this.data.array[e+0]=n,this.data.array[e+1]=i,this.data.array[e+2]=r,this.data.array[e+3]=s,this}clone(e){if(e===void 0){kc("InterleavedBufferAttribute.clone(): Cloning an interleaved buffer attribute will de-interleave buffer data.");let n=[];for(let i=0;i<this.count;i++){let r=i*this.data.stride+this.offset;for(let s=0;s<this.itemSize;s++)n.push(this.data.array[r+s])}return new hn(new this.array.constructor(n),this.itemSize,this.normalized)}else return e.interleavedBuffers===void 0&&(e.interleavedBuffers={}),e.interleavedBuffers[this.data.uuid]===void 0&&(e.interleavedBuffers[this.data.uuid]=this.data.clone(e)),new t(e.interleavedBuffers[this.data.uuid],this.itemSize,this.offset,this.normalized)}toJSON(e){if(e===void 0){kc("InterleavedBufferAttribute.toJSON(): Serializing an interleaved buffer attribute will de-interleave buffer data.");let n=[];for(let i=0;i<this.count;i++){let r=i*this.data.stride+this.offset;for(let s=0;s<this.itemSize;s++)n.push(this.data.array[r+s])}return{itemSize:this.itemSize,type:this.array.constructor.name,array:n,normalized:this.normalized}}else return e.interleavedBuffers===void 0&&(e.interleavedBuffers={}),e.interleavedBuffers[this.data.uuid]===void 0&&(e.interleavedBuffers[this.data.uuid]=this.data.toJSON(e)),{isInterleavedBufferAttribute:!0,itemSize:this.itemSize,data:this.data.uuid,offset:this.offset,normalized:this.normalized}}},b0=new P,AT=new P,TT=new _t,Dr=class{constructor(e=new P(1,0,0),n=0){this.isPlane=!0,this.normal=e,this.constant=n}set(e,n){return this.normal.copy(e),this.constant=n,this}setComponents(e,n,i,r){return this.normal.set(e,n,i),this.constant=r,this}setFromNormalAndCoplanarPoint(e,n){return this.normal.copy(e),this.constant=-n.dot(this.normal),this}setFromCoplanarPoints(e,n,i){let r=b0.subVectors(i,n).cross(AT.subVectors(e,n)).normalize();return this.setFromNormalAndCoplanarPoint(r,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){let e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,n){return n.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,n,i=!0){let r=e.delta(b0),s=this.normal.dot(r);if(s===0)return this.distanceToPoint(e.start)===0?n.copy(e.start):null;let o=-(e.start.dot(this.normal)+this.constant)/s;return i===!0&&(o<0||o>1)?null:n.copy(e.start).addScaledVector(r,o)}intersectsLine(e){let n=this.distanceToPoint(e.start),i=this.distanceToPoint(e.end);return n<0&&i>0||i<0&&n>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,n){let i=n||TT.getNormalMatrix(e),r=this.coplanarPoint(b0).applyMatrix4(e),s=this.normal.applyMatrix3(i).normalize();return this.constant=-r.dot(s),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}toJSON(){return{normal:this.normal.toArray(),constant:this.constant}}fromJSON(e){return this.normal.fromArray(e.normal),this.constant=e.constant,this}},ET=0,Is=class extends Jr{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:ET++}),this.uuid=ho(),this.name="",this.type="Material",this.blending=Or,this.side=is,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=U0,this.blendDst=Ml,this.blendEquation=Ns,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new Pt(0,0,0),this.blendAlpha=0,this.depthFunc=dl,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=k_,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=_f,this.stencilZFail=_f,this.stencilZPass=_f,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(let n in e){let i=e[n];if(i===void 0){dt(`Material: parameter '${n}' has value of undefined.`);continue}let r=this[n];if(r===void 0){dt(`Material: '${n}' is not a property of THREE.${this.type}.`);continue}r&&r.isColor?r.set(i):r&&r.isVector2&&i&&i.isVector2||r&&r.isEuler&&i&&i.isEuler||r&&r.isVector3&&i&&i.isVector3?r.copy(i):this[n]=i}}toJSON(e){let n=e===void 0||typeof e=="string";n&&(e={textures:{},images:{}});let i={metadata:{version:4.7,type:"Material",generator:"Material.toJSON"}};i.uuid=this.uuid,i.type=this.type,i.blending=this.blending,i.side=this.side,i.shadowSide=this.shadowSide,i.vertexColors=this.vertexColors,i.opacity=this.opacity,i.transparent=this.transparent,i.blendSrc=this.blendSrc,i.blendDst=this.blendDst,i.blendEquation=this.blendEquation,i.blendSrcAlpha=this.blendSrcAlpha,i.blendDstAlpha=this.blendDstAlpha,i.blendEquationAlpha=this.blendEquationAlpha,i.blendColor=this.blendColor.getHex(),i.blendAlpha=this.blendAlpha,i.depthFunc=this.depthFunc,i.depthTest=this.depthTest,i.depthWrite=this.depthWrite,i.colorWrite=this.colorWrite,i.clipIntersection=this.clipIntersection,i.clipShadows=this.clipShadows,i.stencilWriteMask=this.stencilWriteMask,i.stencilFunc=this.stencilFunc,i.stencilRef=this.stencilRef,i.stencilFuncMask=this.stencilFuncMask,i.stencilFail=this.stencilFail,i.stencilZFail=this.stencilZFail,i.stencilZPass=this.stencilZPass,i.stencilWrite=this.stencilWrite,i.polygonOffset=this.polygonOffset,i.polygonOffsetFactor=this.polygonOffsetFactor,i.polygonOffsetUnits=this.polygonOffsetUnits,i.dithering=this.dithering,i.alphaTest=this.alphaTest,i.alphaHash=this.alphaHash,i.alphaToCoverage=this.alphaToCoverage,i.premultipliedAlpha=this.premultipliedAlpha,i.forceSinglePass=this.forceSinglePass,i.allowOverride=this.allowOverride,i.visible=this.visible,i.toneMapped=this.toneMapped,i.name=this.name,this.color&&this.color.isColor&&(i.color=this.color.getHex()),this.roughness!==void 0&&(i.roughness=this.roughness),this.metalness!==void 0&&(i.metalness=this.metalness),this.sheen!==void 0&&(i.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(i.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(i.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(i.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&(i.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(i.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(i.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(i.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(i.shininess=this.shininess),this.clearcoat!==void 0&&(i.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(i.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(i.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(i.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(i.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,i.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.sheenColorMap&&this.sheenColorMap.isTexture&&(i.sheenColorMap=this.sheenColorMap.toJSON(e).uuid),this.sheenRoughnessMap&&this.sheenRoughnessMap.isTexture&&(i.sheenRoughnessMap=this.sheenRoughnessMap.toJSON(e).uuid),this.dispersion!==void 0&&(i.dispersion=this.dispersion),this.retroreflectivity!==void 0&&(i.retroreflectivity=this.retroreflectivity),this.iridescence!==void 0&&(i.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(i.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(i.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(i.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(i.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(i.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(i.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(i.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(i.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(i.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(i.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(i.lightMap=this.lightMap.toJSON(e).uuid,i.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(i.aoMap=this.aoMap.toJSON(e).uuid,i.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(i.bumpMap=this.bumpMap.toJSON(e).uuid,i.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(i.normalMap=this.normalMap.toJSON(e).uuid,i.normalMapType=this.normalMapType,i.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(i.displacementMap=this.displacementMap.toJSON(e).uuid,i.displacementScale=this.displacementScale,i.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(i.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(i.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(i.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(i.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(i.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(i.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(i.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(i.combine=this.combine)),this.envMapRotation!==void 0&&(i.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(i.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(i.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(i.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(i.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(i.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(i.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(i.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(i.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&(i.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(i.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(i.size=this.size),this.sizeAttenuation!==void 0&&(i.sizeAttenuation=this.sizeAttenuation),Array.isArray(this.clippingPlanes)&&this.clippingPlanes.length>0&&(i.clippingPlanes=this.clippingPlanes.map(s=>s.toJSON())),this.rotation!==void 0&&(i.rotation=this.rotation),this.depthPacking!==void 0&&(i.depthPacking=this.depthPacking),this.linewidth!==void 0&&(i.linewidth=this.linewidth),this.linecap!==void 0&&(i.linecap=this.linecap),this.linejoin!==void 0&&(i.linejoin=this.linejoin),this.dashSize!==void 0&&(i.dashSize=this.dashSize),this.gapSize!==void 0&&(i.gapSize=this.gapSize),this.scale!==void 0&&(i.scale=this.scale),this.wireframe!==void 0&&(i.wireframe=this.wireframe),this.wireframeLinewidth!==void 0&&(i.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!==void 0&&(i.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!==void 0&&(i.wireframeLinejoin=this.wireframeLinejoin),this.flatShading!==void 0&&(i.flatShading=this.flatShading),this.fog!==void 0&&(i.fog=this.fog),Object.keys(this.userData).length>0&&(i.userData=this.userData);function r(s){let o=[];for(let a in s){let l=s[a];delete l.metadata,o.push(l)}return o}if(n){let s=r(e.textures),o=r(e.images);s.length>0&&(i.textures=s),o.length>0&&(i.images=o)}return i}fromJSON(e,n){if(e.uuid!==void 0&&(this.uuid=e.uuid),e.name!==void 0&&(this.name=e.name),e.color!==void 0&&this.color!==void 0&&this.color.setHex(e.color),e.roughness!==void 0&&(this.roughness=e.roughness),e.metalness!==void 0&&(this.metalness=e.metalness),e.sheen!==void 0&&(this.sheen=e.sheen),e.sheenColor!==void 0&&(this.sheenColor=new Pt().setHex(e.sheenColor)),e.sheenRoughness!==void 0&&(this.sheenRoughness=e.sheenRoughness),e.emissive!==void 0&&this.emissive!==void 0&&this.emissive.setHex(e.emissive),e.specular!==void 0&&this.specular!==void 0&&this.specular.setHex(e.specular),e.specularIntensity!==void 0&&(this.specularIntensity=e.specularIntensity),e.specularColor!==void 0&&this.specularColor!==void 0&&this.specularColor.setHex(e.specularColor),e.shininess!==void 0&&(this.shininess=e.shininess),e.clearcoat!==void 0&&(this.clearcoat=e.clearcoat),e.clearcoatRoughness!==void 0&&(this.clearcoatRoughness=e.clearcoatRoughness),e.dispersion!==void 0&&(this.dispersion=e.dispersion),e.retroreflectivity!==void 0&&(this.retroreflectivity=e.retroreflectivity),e.iridescence!==void 0&&(this.iridescence=e.iridescence),e.iridescenceIOR!==void 0&&(this.iridescenceIOR=e.iridescenceIOR),e.iridescenceThicknessRange!==void 0&&(this.iridescenceThicknessRange=e.iridescenceThicknessRange),e.transmission!==void 0&&(this.transmission=e.transmission),e.thickness!==void 0&&(this.thickness=e.thickness),e.attenuationDistance!==void 0&&(this.attenuationDistance=e.attenuationDistance),e.attenuationColor!==void 0&&this.attenuationColor!==void 0&&this.attenuationColor.setHex(e.attenuationColor),e.anisotropy!==void 0&&(this.anisotropy=e.anisotropy),e.anisotropyRotation!==void 0&&(this.anisotropyRotation=e.anisotropyRotation),e.fog!==void 0&&(this.fog=e.fog),e.flatShading!==void 0&&(this.flatShading=e.flatShading),e.blending!==void 0&&(this.blending=e.blending),e.combine!==void 0&&(this.combine=e.combine),e.side!==void 0&&(this.side=e.side),e.shadowSide!==void 0&&(this.shadowSide=e.shadowSide),e.opacity!==void 0&&(this.opacity=e.opacity),e.transparent!==void 0&&(this.transparent=e.transparent),e.alphaTest!==void 0&&(this.alphaTest=e.alphaTest),e.alphaHash!==void 0&&(this.alphaHash=e.alphaHash),e.depthFunc!==void 0&&(this.depthFunc=e.depthFunc),e.depthTest!==void 0&&(this.depthTest=e.depthTest),e.depthWrite!==void 0&&(this.depthWrite=e.depthWrite),e.colorWrite!==void 0&&(this.colorWrite=e.colorWrite),e.clippingPlanes!==void 0&&(this.clippingPlanes=e.clippingPlanes.map(i=>new Dr().fromJSON(i))),e.clipIntersection!==void 0&&(this.clipIntersection=e.clipIntersection),e.clipShadows!==void 0&&(this.clipShadows=e.clipShadows),e.depthPacking!==void 0&&(this.depthPacking=e.depthPacking),e.blendSrc!==void 0&&(this.blendSrc=e.blendSrc),e.blendDst!==void 0&&(this.blendDst=e.blendDst),e.blendEquation!==void 0&&(this.blendEquation=e.blendEquation),e.blendSrcAlpha!==void 0&&(this.blendSrcAlpha=e.blendSrcAlpha),e.blendDstAlpha!==void 0&&(this.blendDstAlpha=e.blendDstAlpha),e.blendEquationAlpha!==void 0&&(this.blendEquationAlpha=e.blendEquationAlpha),e.blendColor!==void 0&&this.blendColor!==void 0&&this.blendColor.setHex(e.blendColor),e.blendAlpha!==void 0&&(this.blendAlpha=e.blendAlpha),e.stencilWriteMask!==void 0&&(this.stencilWriteMask=e.stencilWriteMask),e.stencilFunc!==void 0&&(this.stencilFunc=e.stencilFunc),e.stencilRef!==void 0&&(this.stencilRef=e.stencilRef),e.stencilFuncMask!==void 0&&(this.stencilFuncMask=e.stencilFuncMask),e.stencilFail!==void 0&&(this.stencilFail=e.stencilFail),e.stencilZFail!==void 0&&(this.stencilZFail=e.stencilZFail),e.stencilZPass!==void 0&&(this.stencilZPass=e.stencilZPass),e.stencilWrite!==void 0&&(this.stencilWrite=e.stencilWrite),e.wireframe!==void 0&&(this.wireframe=e.wireframe),e.wireframeLinewidth!==void 0&&(this.wireframeLinewidth=e.wireframeLinewidth),e.wireframeLinecap!==void 0&&(this.wireframeLinecap=e.wireframeLinecap),e.wireframeLinejoin!==void 0&&(this.wireframeLinejoin=e.wireframeLinejoin),e.rotation!==void 0&&(this.rotation=e.rotation),e.linewidth!==void 0&&(this.linewidth=e.linewidth),e.linecap!==void 0&&(this.linecap=e.linecap),e.linejoin!==void 0&&(this.linejoin=e.linejoin),e.dashSize!==void 0&&(this.dashSize=e.dashSize),e.gapSize!==void 0&&(this.gapSize=e.gapSize),e.scale!==void 0&&(this.scale=e.scale),e.polygonOffset!==void 0&&(this.polygonOffset=e.polygonOffset),e.polygonOffsetFactor!==void 0&&(this.polygonOffsetFactor=e.polygonOffsetFactor),e.polygonOffsetUnits!==void 0&&(this.polygonOffsetUnits=e.polygonOffsetUnits),e.dithering!==void 0&&(this.dithering=e.dithering),e.alphaToCoverage!==void 0&&(this.alphaToCoverage=e.alphaToCoverage),e.premultipliedAlpha!==void 0&&(this.premultipliedAlpha=e.premultipliedAlpha),e.forceSinglePass!==void 0&&(this.forceSinglePass=e.forceSinglePass),e.allowOverride!==void 0&&(this.allowOverride=e.allowOverride),e.visible!==void 0&&(this.visible=e.visible),e.toneMapped!==void 0&&(this.toneMapped=e.toneMapped),e.userData!==void 0&&(this.userData=e.userData),e.vertexColors!==void 0&&(typeof e.vertexColors=="number"?this.vertexColors=e.vertexColors>0:this.vertexColors=e.vertexColors),e.size!==void 0&&(this.size=e.size),e.sizeAttenuation!==void 0&&(this.sizeAttenuation=e.sizeAttenuation),e.map!==void 0&&(this.map=n[e.map]||null),e.matcap!==void 0&&(this.matcap=n[e.matcap]||null),e.alphaMap!==void 0&&(this.alphaMap=n[e.alphaMap]||null),e.bumpMap!==void 0&&(this.bumpMap=n[e.bumpMap]||null),e.bumpScale!==void 0&&(this.bumpScale=e.bumpScale),e.normalMap!==void 0&&(this.normalMap=n[e.normalMap]||null),e.normalMapType!==void 0&&(this.normalMapType=e.normalMapType),e.normalScale!==void 0){let i=e.normalScale;Array.isArray(i)===!1&&(i=[i,i]),this.normalScale=new pt().fromArray(i)}return e.displacementMap!==void 0&&(this.displacementMap=n[e.displacementMap]||null),e.displacementScale!==void 0&&(this.displacementScale=e.displacementScale),e.displacementBias!==void 0&&(this.displacementBias=e.displacementBias),e.roughnessMap!==void 0&&(this.roughnessMap=n[e.roughnessMap]||null),e.metalnessMap!==void 0&&(this.metalnessMap=n[e.metalnessMap]||null),e.emissiveMap!==void 0&&(this.emissiveMap=n[e.emissiveMap]||null),e.emissiveIntensity!==void 0&&(this.emissiveIntensity=e.emissiveIntensity),e.specularMap!==void 0&&(this.specularMap=n[e.specularMap]||null),e.specularIntensityMap!==void 0&&(this.specularIntensityMap=n[e.specularIntensityMap]||null),e.specularColorMap!==void 0&&(this.specularColorMap=n[e.specularColorMap]||null),e.envMap!==void 0&&(this.envMap=n[e.envMap]||null),e.envMapRotation!==void 0&&this.envMapRotation.fromArray(e.envMapRotation),e.envMapIntensity!==void 0&&(this.envMapIntensity=e.envMapIntensity),e.reflectivity!==void 0&&(this.reflectivity=e.reflectivity),e.refractionRatio!==void 0&&(this.refractionRatio=e.refractionRatio),e.lightMap!==void 0&&(this.lightMap=n[e.lightMap]||null),e.lightMapIntensity!==void 0&&(this.lightMapIntensity=e.lightMapIntensity),e.aoMap!==void 0&&(this.aoMap=n[e.aoMap]||null),e.aoMapIntensity!==void 0&&(this.aoMapIntensity=e.aoMapIntensity),e.gradientMap!==void 0&&(this.gradientMap=n[e.gradientMap]||null),e.clearcoatMap!==void 0&&(this.clearcoatMap=n[e.clearcoatMap]||null),e.clearcoatRoughnessMap!==void 0&&(this.clearcoatRoughnessMap=n[e.clearcoatRoughnessMap]||null),e.clearcoatNormalMap!==void 0&&(this.clearcoatNormalMap=n[e.clearcoatNormalMap]||null),e.clearcoatNormalScale!==void 0&&(this.clearcoatNormalScale=new pt().fromArray(e.clearcoatNormalScale)),e.iridescenceMap!==void 0&&(this.iridescenceMap=n[e.iridescenceMap]||null),e.iridescenceThicknessMap!==void 0&&(this.iridescenceThicknessMap=n[e.iridescenceThicknessMap]||null),e.transmissionMap!==void 0&&(this.transmissionMap=n[e.transmissionMap]||null),e.thicknessMap!==void 0&&(this.thicknessMap=n[e.thicknessMap]||null),e.anisotropyMap!==void 0&&(this.anisotropyMap=n[e.anisotropyMap]||null),e.sheenColorMap!==void 0&&(this.sheenColorMap=n[e.sheenColorMap]||null),e.sheenRoughnessMap!==void 0&&(this.sheenRoughnessMap=n[e.sheenRoughnessMap]||null),this}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;let n=e.clippingPlanes,i=null;if(n!==null){let r=n.length;i=new Array(r);for(let s=0;s!==r;++s)i[s]=n[s].clone()}return this.clippingPlanes=i,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.allowOverride=e.allowOverride,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(e){e===!0&&this.version++}};var Rs=new P,M0=new P,tf=new P,nf=new P,Ls=class{constructor(e=new P,n=new P(0,0,-1)){this.origin=e,this.direction=n}set(e,n){return this.origin.copy(e),this.direction.copy(n),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,n){return n.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,Rs)),this}closestPointToPoint(e,n){n.subVectors(e,this.origin);let i=n.dot(this.direction);return i<0?n.copy(this.origin):n.copy(this.origin).addScaledVector(this.direction,i)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){let n=Rs.subVectors(e,this.origin).dot(this.direction);return n<0?this.origin.distanceToSquared(e):(Rs.copy(this.origin).addScaledVector(this.direction,n),Rs.distanceToSquared(e))}distanceSqToSegment(e,n,i,r){M0.copy(e).add(n).multiplyScalar(.5),tf.copy(n).sub(e).normalize(),nf.copy(this.origin).sub(M0);let s=e.distanceTo(n)*.5,o=-this.direction.dot(tf),a=nf.dot(this.direction),l=-nf.dot(tf),c=nf.lengthSq(),u=Math.abs(1-o*o),f,h,d,g;if(u>0)if(f=o*l-a,h=o*a-l,g=s*u,f>=0)if(h>=-g)if(h<=g){let x=1/u;f*=x,h*=x,d=f*(f+o*h+2*a)+h*(o*f+h+2*l)+c}else h=s,f=Math.max(0,-(o*h+a)),d=-f*f+h*(h+2*l)+c;else h=-s,f=Math.max(0,-(o*h+a)),d=-f*f+h*(h+2*l)+c;else h<=-g?(f=Math.max(0,-(-o*s+a)),h=f>0?-s:Math.min(Math.max(-s,-l),s),d=-f*f+h*(h+2*l)+c):h<=g?(f=0,h=Math.min(Math.max(-s,-l),s),d=h*(h+2*l)+c):(f=Math.max(0,-(o*s+a)),h=f>0?s:Math.min(Math.max(-s,-l),s),d=-f*f+h*(h+2*l)+c);else h=o>0?-s:s,f=Math.max(0,-(o*h+a)),d=-f*f+h*(h+2*l)+c;return i&&i.copy(this.origin).addScaledVector(this.direction,f),r&&r.copy(M0).addScaledVector(tf,h),d}intersectSphere(e,n){if(e.radius<0)return null;Rs.subVectors(e.center,this.origin);let i=Rs.dot(this.direction),r=Rs.dot(Rs)-i*i,s=e.radius*e.radius;if(r>s)return null;let o=Math.sqrt(s-r),a=i-o,l=i+o;return l<0?null:a<0?this.at(l,n):this.at(a,n)}intersectsSphere(e){return e.radius<0?!1:this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){let n=e.normal.dot(this.direction);if(n===0)return e.distanceToPoint(this.origin)===0?0:null;let i=-(this.origin.dot(e.normal)+e.constant)/n;return i>=0?i:null}intersectPlane(e,n){let i=this.distanceToPlane(e);return i===null?null:this.at(i,n)}intersectsPlane(e){let n=e.distanceToPoint(this.origin);return n===0||e.normal.dot(this.direction)*n<0}intersectBox(e,n){let i,r,s,o,a,l,c=1/this.direction.x,u=1/this.direction.y,f=1/this.direction.z,h=this.origin;return c>=0?(i=(e.min.x-h.x)*c,r=(e.max.x-h.x)*c):(i=(e.max.x-h.x)*c,r=(e.min.x-h.x)*c),u>=0?(s=(e.min.y-h.y)*u,o=(e.max.y-h.y)*u):(s=(e.max.y-h.y)*u,o=(e.min.y-h.y)*u),i>o||s>r||((s>i||isNaN(i))&&(i=s),(o<r||isNaN(r))&&(r=o),f>=0?(a=(e.min.z-h.z)*f,l=(e.max.z-h.z)*f):(a=(e.max.z-h.z)*f,l=(e.min.z-h.z)*f),i>l||a>r)||((a>i||i!==i)&&(i=a),(l<r||r!==r)&&(r=l),r<0)?null:this.at(i>=0?i:r,n)}intersectsBox(e){return this.intersectBox(e,Rs)!==null}intersectTriangle(e,n,i,r,s){let o=this.origin,a=this.direction,l=a.x,c=a.y,u=a.z,f=e.x-o.x,h=e.y-o.y,d=e.z-o.z,g=n.x-o.x,x=n.y-o.y,m=n.z-o.z,p=i.x-o.x,_=i.y-o.y,M=i.z-o.z,v=Math.abs(l),S=Math.abs(c),w=Math.abs(u),E,y,T,R,F,O,z,L,V,N,D,H;if(v>=S&&v>=w?(T=l,O=f,V=g,H=p,l>=0?(E=c,y=u,R=h,F=d,z=x,L=m,N=_,D=M):(E=u,y=c,R=d,F=h,z=m,L=x,N=M,D=_)):S>=w?(T=c,O=h,V=x,H=_,c>=0?(E=u,y=l,R=d,F=f,z=m,L=g,N=M,D=p):(E=l,y=u,R=f,F=d,z=g,L=m,N=p,D=M)):(T=u,O=d,V=m,H=M,u>=0?(E=l,y=c,R=f,F=h,z=g,L=x,N=p,D=_):(E=c,y=l,R=h,F=f,z=x,L=g,N=_,D=p)),T===0)return null;let G=E/T,$=y/T,J=1/T,ve=R-G*O,ye=F-$*O,rt=z-G*V,ze=L-$*V,nt=N-G*H,Z=D-$*H,te=nt*ze-Z*rt,Te=ve*Z-ye*nt,je=rt*ye-ze*ve;if(r){if(te<0||Te<0||je<0)return null}else if((te<0||Te<0||je<0)&&(te>0||Te>0||je>0))return null;let Re=te+Te+je;if(Re===0)return null;let le=J*(te*O+Te*V+je*H);return(Re>0?le<0:le>0)?null:this.at(le/Re,s)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}},Gc=class extends Is{constructor(e){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new Pt(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new fo,this.combine=k0,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}},Ky=new Ot,ea=new Ls,rf=new es,Jy=new P,sf=new P,of=new P,af=new P,S0=new P,lf=new P,Qy=new P,cf=new P,Xt=class extends ki{constructor(e=new Fn,n=new Gc){super(),this.isMesh=!0,this.type="Mesh",this.geometry=e,this.material=n,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(e,n){return super.copy(e,n),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){let n=this.geometry.morphAttributes,i=Object.keys(n);if(i.length>0){let r=n[i[0]];if(r!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let s=0,o=r.length;s<o;s++){let a=r[s].name||String(s);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=s}}}}getVertexPosition(e,n){let i=this.geometry,r=i.attributes.position,s=i.morphAttributes.position,o=i.morphTargetsRelative;n.fromBufferAttribute(r,e);let a=this.morphTargetInfluences;if(s&&a){lf.set(0,0,0);for(let l=0,c=s.length;l<c;l++){let u=a[l],f=s[l];u!==0&&(S0.fromBufferAttribute(f,e),o?lf.addScaledVector(S0,u):lf.addScaledVector(S0.sub(n),u))}n.add(lf)}return n}intersectsFrustum(e){return e.intersectsObject(this)}raycast(e,n){let i=this.geometry,r=this.material,s=this.matrixWorld;r!==void 0&&(i.boundingSphere===null&&i.computeBoundingSphere(),rf.copy(i.boundingSphere),rf.applyMatrix4(s),ea.copy(e.ray).recast(e.near),!(rf.containsPoint(ea.origin)===!1&&(ea.intersectSphere(rf,Jy)===null||ea.origin.distanceToSquared(Jy)>(e.far-e.near)**2))&&(Ky.copy(s).invert(),ea.copy(e.ray).applyMatrix4(Ky),!(i.boundingBox!==null&&ea.intersectsBox(i.boundingBox)===!1)&&this._computeIntersections(e,n,ea)))}_computeIntersections(e,n,i){let r,s=this.geometry,o=this.material,a=s.index,l=s.attributes.position,c=s.attributes.uv,u=s.attributes.uv1,f=s.attributes.normal,h=s.groups,d=s.drawRange;if(a!==null)if(Array.isArray(o))for(let g=0,x=h.length;g<x;g++){let m=h[g],p=o[m.materialIndex],_=Math.max(m.start,d.start),M=Math.min(a.count,Math.min(m.start+m.count,d.start+d.count));for(let v=_,S=M;v<S;v+=3){let w=a.getX(v),E=a.getX(v+1),y=a.getX(v+2);r=uf(this,p,e,i,c,u,f,w,E,y),r&&(r.faceIndex=Math.floor(v/3),r.face.materialIndex=m.materialIndex,n.push(r))}}else{let g=Math.max(0,d.start),x=Math.min(a.count,d.start+d.count);for(let m=g,p=x;m<p;m+=3){let _=a.getX(m),M=a.getX(m+1),v=a.getX(m+2);r=uf(this,o,e,i,c,u,f,_,M,v),r&&(r.faceIndex=Math.floor(m/3),n.push(r))}}else if(l!==void 0)if(Array.isArray(o))for(let g=0,x=h.length;g<x;g++){let m=h[g],p=o[m.materialIndex],_=Math.max(m.start,d.start),M=Math.min(l.count,Math.min(m.start+m.count,d.start+d.count));for(let v=_,S=M;v<S;v+=3){let w=v,E=v+1,y=v+2;r=uf(this,p,e,i,c,u,f,w,E,y),r&&(r.faceIndex=Math.floor(v/3),r.face.materialIndex=m.materialIndex,n.push(r))}}else{let g=Math.max(0,d.start),x=Math.min(l.count,d.start+d.count);for(let m=g,p=x;m<p;m+=3){let _=m,M=m+1,v=m+2;r=uf(this,o,e,i,c,u,f,_,M,v),r&&(r.faceIndex=Math.floor(m/3),n.push(r))}}}};function RT(t,e,n,i,r,s,o,a){let l;if(e.side===Ii?l=i.intersectTriangle(o,s,r,!0,a):l=i.intersectTriangle(r,s,o,e.side===is,a),l===null)return null;cf.copy(a),cf.applyMatrix4(t.matrixWorld);let c=n.ray.origin.distanceTo(cf);return c<n.near||c>n.far?null:{distance:c,point:cf.clone(),object:t}}function uf(t,e,n,i,r,s,o,a,l,c){t.getVertexPosition(a,sf),t.getVertexPosition(l,of),t.getVertexPosition(c,af);let u=RT(t,e,n,i,sf,of,af,Qy);if(u){let f=new P;uo.getBarycoord(Qy,sf,of,af,f),r&&(u.uv=uo.getInterpolatedAttribute(r,a,l,c,f,new pt)),s&&(u.uv1=uo.getInterpolatedAttribute(s,a,l,c,f,new pt)),o&&(u.normal=uo.getInterpolatedAttribute(o,a,l,c,f,new P),u.normal.dot(i.direction)>0&&u.normal.multiplyScalar(-1));let h={a,b:l,c,normal:new P,materialIndex:0};uo.getNormal(sf,of,af,h.normal),u.face=h,u.barycoord=f}return u}var Hc=class extends Ci{constructor(e=null,n=1,i=1,r,s,o,a,l,c=Qn,u=Qn,f,h){super(null,o,a,l,c,u,r,s,f,h),this.isDataTexture=!0,this.image={data:e,width:n,height:i},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}};var Pi=class extends hn{constructor(e,n,i,r=1){super(e,n,i),this.isInstancedBufferAttribute=!0,this.meshPerAttribute=r}copy(e){return super.copy(e),this.meshPerAttribute=e.meshPerAttribute,this}toJSON(){let e=super.toJSON();return e.meshPerAttribute=this.meshPerAttribute,e.isInstancedBufferAttribute=!0,e}},ll=new Ot,e_=new Ot,hf=[],t_=new Qr,CT=new Ot,Ic=new Xt,Lc=new es,Wc=class extends Xt{constructor(e,n,i){super(e,n),this.isInstancedMesh=!0,this.instanceMatrix=new Pi(new Float32Array(i*16),16),this.instanceColor=null,this.morphTexture=null,this.count=i,this.boundingBox=null,this.boundingSphere=null;for(let r=0;r<i;r++)this.setMatrixAt(r,CT)}computeBoundingBox(){let e=this.geometry,n=this.count;this.boundingBox===null&&(this.boundingBox=new Qr),e.boundingBox===null&&e.computeBoundingBox(),this.boundingBox.makeEmpty();for(let i=0;i<n;i++)this.getMatrixAt(i,ll),t_.copy(e.boundingBox).applyMatrix4(ll),this.boundingBox.union(t_)}computeBoundingSphere(){let e=this.geometry,n=this.count;this.boundingSphere===null&&(this.boundingSphere=new es),e.boundingSphere===null&&e.computeBoundingSphere(),this.boundingSphere.makeEmpty();for(let i=0;i<n;i++)this.getMatrixAt(i,ll),Lc.copy(e.boundingSphere).applyMatrix4(ll),this.boundingSphere.union(Lc)}copy(e,n){return super.copy(e,n),this.instanceMatrix.copy(e.instanceMatrix),e.morphTexture!==null&&(this.morphTexture=e.morphTexture.clone()),e.instanceColor!==null&&(this.instanceColor=e.instanceColor.clone()),this.count=e.count,e.boundingBox!==null&&(this.boundingBox=e.boundingBox.clone()),e.boundingSphere!==null&&(this.boundingSphere=e.boundingSphere.clone()),this}getColorAt(e,n){return this.instanceColor===null?n.setRGB(1,1,1):n.fromArray(this.instanceColor.array,e*3)}getMatrixAt(e,n){return n.fromArray(this.instanceMatrix.array,e*16)}getMorphAt(e,n){let i=n.morphTargetInfluences,r=this.morphTexture.source.data.data,s=i.length+1,o=e*s+1;for(let a=0;a<i.length;a++)i[a]=r[o+a]}raycast(e,n){let i=this.matrixWorld,r=this.count;if(Ic.geometry=this.geometry,Ic.material=this.material,Ic.material!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),Lc.copy(this.boundingSphere),Lc.applyMatrix4(i),e.ray.intersectsSphere(Lc)!==!1))for(let s=0;s<r;s++){this.getMatrixAt(s,ll),e_.multiplyMatrices(i,ll),Ic.matrixWorld=e_,Ic.raycast(e,hf);for(let o=0,a=hf.length;o<a;o++){let l=hf[o];l.instanceId=s,l.object=this,n.push(l)}hf.length=0}}setColorAt(e,n){return this.instanceColor===null&&(this.instanceColor=new Pi(new Float32Array(this.instanceMatrix.count*3).fill(1),3)),n.toArray(this.instanceColor.array,e*3),this}setMatrixAt(e,n){return n.toArray(this.instanceMatrix.array,e*16),this}setMorphAt(e,n){let i=n.morphTargetInfluences,r=i.length+1;this.morphTexture===null&&(this.morphTexture=new Hc(new Float32Array(r*this.count),r,this.count,hd,xr));let s=this.morphTexture.source.data.data,o=0;for(let c=0;c<i.length;c++)o+=i[c];let a=this.geometry.morphTargetsRelative?1:1-o,l=r*e;return s[l]=a,s.set(i,l+1),this}updateMorphTargets(){}dispose(){super.dispose(),this.morphTexture!==null&&(this.morphTexture.dispose(),this.morphTexture=null)}},ta=new es,PT=new pt(.5,.5),ff=new P,$c=class{constructor(e=new Dr,n=new Dr,i=new Dr,r=new Dr,s=new Dr,o=new Dr){this.planes=[e,n,i,r,s,o]}set(e,n,i,r,s,o){let a=this.planes;return a[0].copy(e),a[1].copy(n),a[2].copy(i),a[3].copy(r),a[4].copy(s),a[5].copy(o),this}copy(e){let n=this.planes;for(let i=0;i<6;i++)n[i].copy(e.planes[i]);return this}setFromProjectionMatrix(e,n=Nr,i=!1){let r=this.planes,s=e.elements,o=s[0],a=s[1],l=s[2],c=s[3],u=s[4],f=s[5],h=s[6],d=s[7],g=s[8],x=s[9],m=s[10],p=s[11],_=s[12],M=s[13],v=s[14],S=s[15];if(r[0].setComponents(c-o,d-u,p-g,S-_).normalize(),r[1].setComponents(c+o,d+u,p+g,S+_).normalize(),r[2].setComponents(c+a,d+f,p+x,S+M).normalize(),r[3].setComponents(c-a,d-f,p-x,S-M).normalize(),i)r[4].setComponents(l,h,m,v).normalize(),r[5].setComponents(c-l,d-h,p-m,S-v).normalize();else if(r[4].setComponents(c-l,d-h,p-m,S-v).normalize(),n===Nr)r[5].setComponents(c+l,d+h,p+m,S+v).normalize();else if(n===Fc)r[5].setComponents(l,h,m,v).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+n);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),ta.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{let n=e.geometry;n.boundingSphere===null&&n.computeBoundingSphere(),ta.copy(n.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(ta)}intersectsSprite(e){ta.center.set(0,0,0);let n=PT.distanceTo(e.center);return ta.radius=.7071067811865476+n,ta.applyMatrix4(e.matrixWorld),this.intersectsSphere(ta)}intersectsSphere(e){let n=this.planes,i=e.center,r=-e.radius;for(let s=0;s<6;s++)if(n[s].distanceToPoint(i)<r)return!1;return!0}intersectsBox(e){let n=this.planes;for(let i=0;i<6;i++){let r=n[i];if(ff.x=r.normal.x>0?e.max.x:e.min.x,ff.y=r.normal.y>0?e.max.y:e.min.y,ff.z=r.normal.z>0?e.max.z:e.min.z,r.distanceToPoint(ff)<0)return!1}return!0}containsPoint(e){let n=this.planes;for(let i=0;i<6;i++)if(n[i].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}};var Ff=class extends Is{constructor(e){super(),this.isLineBasicMaterial=!0,this.type="LineBasicMaterial",this.color=new Pt(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.linewidth=e.linewidth,this.linecap=e.linecap,this.linejoin=e.linejoin,this.fog=e.fog,this}},Uf=new P,kf=new P,n_=new Ot,Dc=new Ls,df=new es,w0=new P,i_=new P,Bf=class extends ki{constructor(e=new Fn,n=new Ff){super(),this.isLine=!0,this.type="Line",this.geometry=e,this.material=n,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(e,n){return super.copy(e,n),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}computeLineDistances(){let e=this.geometry;if(e.index===null){let n=e.attributes.position,i=[0];for(let r=1,s=n.count;r<s;r++)Uf.fromBufferAttribute(n,r-1),kf.fromBufferAttribute(n,r),i[r]=i[r-1],i[r]+=Uf.distanceTo(kf);e.setAttribute("lineDistance",new rn(i,1))}else dt("Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}intersectsFrustum(e){return e.intersectsObject(this)}raycast(e,n){let i=this.geometry,r=this.matrixWorld,s=e.params.Line.threshold,o=i.drawRange;if(i.boundingSphere===null&&i.computeBoundingSphere(),df.copy(i.boundingSphere),df.applyMatrix4(r),df.radius+=s,e.ray.intersectsSphere(df)===!1)return;n_.copy(r).invert(),Dc.copy(e.ray).applyMatrix4(n_);let a=s/((this.scale.x+this.scale.y+this.scale.z)/3),l=a*a,c=this.isLineSegments?2:1,u=i.index,h=i.attributes.position;if(u!==null){let d=Math.max(0,o.start),g=Math.min(u.count,o.start+o.count);for(let x=d,m=g-1;x<m;x+=c){let p=u.getX(x),_=u.getX(x+1),M=pf(this,e,Dc,l,p,_,x);M&&n.push(M)}if(this.isLineLoop){let x=u.getX(g-1),m=u.getX(d),p=pf(this,e,Dc,l,x,m,g-1);p&&n.push(p)}}else{let d=Math.max(0,o.start),g=Math.min(h.count,o.start+o.count);for(let x=d,m=g-1;x<m;x+=c){let p=pf(this,e,Dc,l,x,x+1,x);p&&n.push(p)}if(this.isLineLoop){let x=pf(this,e,Dc,l,g-1,d,g-1);x&&n.push(x)}}}updateMorphTargets(){let n=this.geometry.morphAttributes,i=Object.keys(n);if(i.length>0){let r=n[i[0]];if(r!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let s=0,o=r.length;s<o;s++){let a=r[s].name||String(s);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=s}}}}};function pf(t,e,n,i,r,s,o){let a=t.geometry.attributes.position;if(Uf.fromBufferAttribute(a,r),kf.fromBufferAttribute(a,s),n.distanceSqToSegment(Uf,kf,w0,i_)>i)return;w0.applyMatrix4(t.matrixWorld);let c=e.ray.origin.distanceTo(w0);if(!(c<e.near||c>e.far))return{distance:c,point:i_.clone().applyMatrix4(t.matrixWorld),index:o,face:null,faceIndex:null,barycoord:null,object:t}}var r_=new P,s_=new P,Xc=class extends Bf{constructor(e,n){super(e,n),this.isLineSegments=!0,this.type="LineSegments"}computeLineDistances(){let e=this.geometry;if(e.index===null){let n=e.attributes.position,i=[];for(let r=0,s=n.count;r<s;r+=2)r_.fromBufferAttribute(n,r),s_.fromBufferAttribute(n,r+1),i[r]=r===0?0:i[r-1],i[r+1]=i[r]+r_.distanceTo(s_);e.setAttribute("lineDistance",new rn(i,1))}else dt("LineSegments.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}};var zf=class extends Is{constructor(e){super(),this.isPointsMaterial=!0,this.type="PointsMaterial",this.color=new Pt(16777215),this.map=null,this.alphaMap=null,this.size=1,this.sizeAttenuation=!0,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.alphaMap=e.alphaMap,this.size=e.size,this.sizeAttenuation=e.sizeAttenuation,this.fog=e.fog,this}},o_=new Ot,P0=new Ls,mf=new es,gf=new P,Yc=class extends ki{constructor(e=new Fn,n=new zf){super(),this.isPoints=!0,this.type="Points",this.geometry=e,this.material=n,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(e,n){return super.copy(e,n),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}intersectsFrustum(e){return e.intersectsObject(this)}raycast(e,n){let i=this.geometry,r=this.matrixWorld,s=e.params.Points.threshold,o=i.drawRange;if(i.boundingSphere===null&&i.computeBoundingSphere(),mf.copy(i.boundingSphere),mf.applyMatrix4(r),mf.radius+=s,e.ray.intersectsSphere(mf)===!1)return;o_.copy(r).invert(),P0.copy(e.ray).applyMatrix4(o_);let a=s/((this.scale.x+this.scale.y+this.scale.z)/3),l=a*a,c=i.index,f=i.attributes.position;if(c!==null){let h=Math.max(0,o.start),d=Math.min(c.count,o.start+o.count);for(let g=h,x=d;g<x;g++){let m=c.getX(g);gf.fromBufferAttribute(f,m),a_(gf,m,l,r,e,n,this)}}else{let h=Math.max(0,o.start),d=Math.min(f.count,o.start+o.count);for(let g=h,x=d;g<x;g++)gf.fromBufferAttribute(f,g),a_(gf,g,l,r,e,n,this)}}updateMorphTargets(){let n=this.geometry.morphAttributes,i=Object.keys(n);if(i.length>0){let r=n[i[0]];if(r!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let s=0,o=r.length;s<o;s++){let a=r[s].name||String(s);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=s}}}}};function a_(t,e,n,i,r,s,o){let a=P0.distanceSqToPoint(t);if(a<n){let l=new P;P0.closestPointToPoint(t,l),l.applyMatrix4(i);let c=r.ray.origin.distanceTo(l);if(c<r.near||c>r.far)return;s.push({distance:c,distanceToRay:Math.sqrt(a),point:l,index:e,face:null,faceIndex:null,barycoord:null,object:o})}}var qc=class extends Ci{constructor(e=[],n=vo,i,r,s,o,a,l,c,u){super(e,n,i,r,s,o,a,l,c,u),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}},ts=class extends Ci{constructor(e,n,i,r,s,o,a,l,c){super(e,n,i,r,s,o,a,l,c),this.isCanvasTexture=!0,this.needsUpdate=!0}};var po=class extends Ci{constructor(e,n,i=Fr,r,s,o,a=Qn,l=Qn,c,u=Kr,f=1){if(u!==Kr&&u!==_o)throw new Error("THREE.DepthTexture: format must be either THREE.DepthFormat or THREE.DepthStencilFormat");let h={width:e,height:n,depth:f};super(h,r,s,o,a,l,u,i,c),this.isDepthTexture=!0,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.source=new ml(Object.assign({},e.image)),this.compareFunction=e.compareFunction,this}toJSON(e){let n=super.toJSON(e);return n.compareFunction=this.compareFunction,n}},Vf=class extends po{constructor(e,n=Fr,i=vo,r,s,o=Qn,a=Qn,l,c=Kr){let u={width:e,height:e,depth:1},f=[u,u,u,u,u,u];super(e,e,n,i,r,s,o,a,l,c),this.image=f,this.isCubeDepthTexture=!0,this.isCubeTexture=!0}get images(){return this.image}set images(e){this.image=e}},jc=class extends Ci{constructor(e=null){super(),this.sourceTexture=e,this.isExternalTexture=!0}copy(e){return super.copy(e),this.sourceTexture=e.sourceTexture,this}},yl=class t extends Fn{constructor(e=1,n=1,i=1,r=1,s=1,o=1){super(),this.type="BoxGeometry",this.parameters={width:e,height:n,depth:i,widthSegments:r,heightSegments:s,depthSegments:o};let a=this;r=Math.floor(r),s=Math.floor(s),o=Math.floor(o);let l=[],c=[],u=[],f=[],h=0,d=0;g("z","y","x",-1,-1,i,n,e,o,s,0),g("z","y","x",1,-1,i,n,-e,o,s,1),g("x","z","y",1,1,e,i,n,r,o,2),g("x","z","y",1,-1,e,i,-n,r,o,3),g("x","y","z",1,-1,e,n,i,r,s,4),g("x","y","z",-1,-1,e,n,-i,r,s,5),this.setIndex(l),this.setAttribute("position",new rn(c,3)),this.setAttribute("normal",new rn(u,3)),this.setAttribute("uv",new rn(f,2));function g(x,m,p,_,M,v,S,w,E,y,T){let R=v/E,F=S/y,O=v/2,z=S/2,L=w/2,V=E+1,N=y+1,D=0,H=0,G=new P;for(let $=0;$<N;$++){let J=$*F-z;for(let ve=0;ve<V;ve++){let ye=ve*R-O;G[x]=ye*_,G[m]=J*M,G[p]=L,c.push(G.x,G.y,G.z),G[x]=0,G[m]=0,G[p]=w>0?1:-1,u.push(G.x,G.y,G.z),f.push(ve/E),f.push(1-$/y),D+=1}}for(let $=0;$<y;$++)for(let J=0;J<E;J++){let ve=h+J+V*$,ye=h+J+V*($+1),rt=h+(J+1)+V*($+1),ze=h+(J+1)+V*$;l.push(ve,ye,ze),l.push(ye,rt,ze),H+=6}a.addGroup(d,H,T),d+=H,h+=D}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new t(e.width,e.height,e.depth,e.widthSegments,e.heightSegments,e.depthSegments)}};var Zc=class t extends Fn{constructor(e=[],n=[],i=1,r=0){super(),this.type="PolyhedronGeometry",this.parameters={vertices:e,indices:n,radius:i,detail:r};let s=[],o=[];a(r),c(i),u(),this.setAttribute("position",new rn(s,3)),this.setAttribute("normal",new rn(s.slice(),3)),this.setAttribute("uv",new rn(o,2)),r===0?this.computeVertexNormals():this.normalizeNormals();function a(_){let M=new P,v=new P,S=new P;for(let w=0;w<n.length;w+=3)d(n[w+0],M),d(n[w+1],v),d(n[w+2],S),l(M,v,S,_)}function l(_,M,v,S){let w=S+1,E=[];for(let y=0;y<=w;y++){E[y]=[];let T=_.clone().lerp(v,y/w),R=M.clone().lerp(v,y/w),F=w-y;for(let O=0;O<=F;O++)O===0&&y===w?E[y][O]=T:E[y][O]=T.clone().lerp(R,O/F)}for(let y=0;y<w;y++)for(let T=0;T<2*(w-y)-1;T++){let R=Math.floor(T/2);T%2===0?(h(E[y][R+1]),h(E[y+1][R]),h(E[y][R])):(h(E[y][R+1]),h(E[y+1][R+1]),h(E[y+1][R]))}}function c(_){let M=new P;for(let v=0;v<s.length;v+=3)M.x=s[v+0],M.y=s[v+1],M.z=s[v+2],M.normalize().multiplyScalar(_),s[v+0]=M.x,s[v+1]=M.y,s[v+2]=M.z}function u(){let _=new P;for(let M=0;M<s.length;M+=3){_.x=s[M+0],_.y=s[M+1],_.z=s[M+2];let v=m(_)/2/Math.PI+.5,S=p(_)/Math.PI+.5;o.push(v,1-S)}g(),f()}function f(){for(let _=0;_<o.length;_+=6){let M=o[_+0],v=o[_+2],S=o[_+4],w=Math.max(M,v,S),E=Math.min(M,v,S);w>.9&&E<.1&&(M<.2&&(o[_+0]+=1),v<.2&&(o[_+2]+=1),S<.2&&(o[_+4]+=1))}}function h(_){s.push(_.x,_.y,_.z)}function d(_,M){let v=_*3;M.x=e[v+0],M.y=e[v+1],M.z=e[v+2]}function g(){let _=new P,M=new P,v=new P,S=new P,w=new pt,E=new pt,y=new pt;for(let T=0,R=0;T<s.length;T+=9,R+=6){_.set(s[T+0],s[T+1],s[T+2]),M.set(s[T+3],s[T+4],s[T+5]),v.set(s[T+6],s[T+7],s[T+8]),w.set(o[R+0],o[R+1]),E.set(o[R+2],o[R+3]),y.set(o[R+4],o[R+5]),S.copy(_).add(M).add(v).divideScalar(3);let F=m(S);x(w,R+0,_,F),x(E,R+2,M,F),x(y,R+4,v,F)}}function x(_,M,v,S){S<0&&_.x===1&&(o[M]=_.x-1),v.x===0&&v.z===0&&(o[M]=S/2/Math.PI+.5)}function m(_){return Math.atan2(_.z,-_.x)}function p(_){return Math.atan2(-_.y,Math.sqrt(_.x*_.x+_.z*_.z))}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new t(e.vertices,e.indices,e.radius,e.detail)}};var ra=class t extends Zc{constructor(e=1,n=0){let i=(1+Math.sqrt(5))/2,r=[-1,i,0,1,i,0,-1,-i,0,1,-i,0,0,-1,i,0,1,i,0,-1,-i,0,1,-i,i,0,-1,i,0,1,-i,0,-1,-i,0,1],s=[0,11,5,0,5,1,0,1,7,0,7,10,0,10,11,1,5,9,5,11,4,11,10,2,10,7,6,7,1,8,3,9,4,3,4,2,3,2,6,3,6,8,3,8,9,4,9,5,2,4,11,6,2,10,8,6,7,9,8,1];super(r,s,e,n),this.type="IcosahedronGeometry",this.parameters={radius:e,detail:n}}static fromJSON(e){return new t(e.radius,e.detail)}};var Kc=class t extends Zc{constructor(e=1,n=0){let i=[1,0,0,-1,0,0,0,1,0,0,-1,0,0,0,1,0,0,-1],r=[0,2,4,0,4,3,0,3,5,0,5,2,1,2,5,1,5,3,1,3,4,1,4,2];super(i,r,e,n),this.type="OctahedronGeometry",this.parameters={radius:e,detail:n}}static fromJSON(e){return new t(e.radius,e.detail)}},ns=class t extends Fn{constructor(e=1,n=1,i=1,r=1){super(),this.type="PlaneGeometry",this.parameters={width:e,height:n,widthSegments:i,heightSegments:r};let s=e/2,o=n/2,a=Math.floor(i),l=Math.floor(r),c=a+1,u=l+1,f=e/a,h=n/l,d=[],g=[],x=[],m=[];for(let p=0;p<u;p++){let _=p*h-o;for(let M=0;M<c;M++){let v=M*f-s;g.push(v,-_,0),x.push(0,0,1),m.push(M/a),m.push(1-p/l)}}for(let p=0;p<l;p++)for(let _=0;_<a;_++){let M=_+c*p,v=_+c*(p+1),S=_+1+c*(p+1),w=_+1+c*p;d.push(M,v,w),d.push(v,S,w)}this.setIndex(d),this.setAttribute("position",new rn(g,3)),this.setAttribute("normal",new rn(x,3)),this.setAttribute("uv",new rn(m,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new t(e.width,e.height,e.widthSegments,e.heightSegments)}};function la(t){let e={};for(let n in t){e[n]={};for(let i in t[n]){let r=t[n][i];if(l_(r))r.isRenderTargetTexture?(dt("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),e[n][i]=null):e[n][i]=r.clone();else if(Array.isArray(r))if(l_(r[0])){let s=[];for(let o=0,a=r.length;o<a;o++)s[o]=r[o].clone();e[n][i]=s}else e[n][i]=r.slice();else e[n][i]=r}}return e}function xi(t){let e={};for(let n=0;n<t.length;n++){let i=la(t[n]);for(let r in i)e[r]=i[r]}return e}function l_(t){return t&&(t.isColor||t.isMatrix3||t.isMatrix4||t.isVector2||t.isVector3||t.isVector4||t.isTexture||t.isQuaternion)}function IT(t){let e=[];for(let n=0;n<t.length;n++)e.push(t[n].clone());return e}function ng(t){let e=t.getRenderTarget();return e===null?t.outputColorSpace:e.isXRRenderTarget===!0?e.texture.colorSpace:Et.workingColorSpace}var Z_={clone:la,merge:xi},LT=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,DT=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`,Ft=class extends Is{constructor(e){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=LT,this.fragmentShader=DT,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=la(e.uniforms),this.uniformsGroups=IT(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this.defaultAttributeValues=Object.assign({},e.defaultAttributeValues),this.index0AttributeName=e.index0AttributeName,this.uniformsNeedUpdate=e.uniformsNeedUpdate,this}toJSON(e){let n=super.toJSON(e);n.glslVersion=this.glslVersion,n.uniforms={};for(let r in this.uniforms){let o=this.uniforms[r].value;o&&o.isTexture?n.uniforms[r]={type:"t",value:o.toJSON(e).uuid}:o&&o.isColor?n.uniforms[r]={type:"c",value:o.getHex()}:o&&o.isVector2?n.uniforms[r]={type:"v2",value:o.toArray()}:o&&o.isVector3?n.uniforms[r]={type:"v3",value:o.toArray()}:o&&o.isVector4?n.uniforms[r]={type:"v4",value:o.toArray()}:o&&o.isMatrix3?n.uniforms[r]={type:"m3",value:o.toArray()}:o&&o.isMatrix4?n.uniforms[r]={type:"m4",value:o.toArray()}:n.uniforms[r]={value:o}}Object.keys(this.defines).length>0&&(n.defines=this.defines),n.vertexShader=this.vertexShader,n.fragmentShader=this.fragmentShader,n.lights=this.lights,n.clipping=this.clipping;let i={};for(let r in this.extensions)this.extensions[r]===!0&&(i[r]=!0);return Object.keys(i).length>0&&(n.extensions=i),n}fromJSON(e,n){if(super.fromJSON(e,n),e.uniforms!==void 0)for(let i in e.uniforms){let r=e.uniforms[i];switch(this.uniforms[i]={},r.type){case"t":this.uniforms[i].value=n[r.value]||null;break;case"c":this.uniforms[i].value=new Pt().setHex(r.value);break;case"v2":this.uniforms[i].value=new pt().fromArray(r.value);break;case"v3":this.uniforms[i].value=new P().fromArray(r.value);break;case"v4":this.uniforms[i].value=new Vt().fromArray(r.value);break;case"m3":this.uniforms[i].value=new _t().fromArray(r.value);break;case"m4":this.uniforms[i].value=new Ot().fromArray(r.value);break;default:this.uniforms[i].value=r.value}}if(e.defines!==void 0&&(this.defines=e.defines),e.vertexShader!==void 0&&(this.vertexShader=e.vertexShader),e.fragmentShader!==void 0&&(this.fragmentShader=e.fragmentShader),e.glslVersion!==void 0&&(this.glslVersion=e.glslVersion),e.extensions!==void 0)for(let i in e.extensions)this.extensions[i]=e.extensions[i];return e.lights!==void 0&&(this.lights=e.lights),e.clipping!==void 0&&(this.clipping=e.clipping),this}},Gf=class extends Ft{constructor(e){super(e),this.isRawShaderMaterial=!0,this.type="RawShaderMaterial"}};var Hf=class extends Is{constructor(e){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=F_,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}},Wf=class extends Is{constructor(e){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}};function cl(t,e){return!t||t.constructor===e?t:typeof e.BYTES_PER_ELEMENT=="number"?new e(t):Array.prototype.slice.call(t)}function A0(t){return t!==void 0&&t.inTangents!==void 0&&t.outTangents!==void 0}var mo=class{constructor(e,n,i,r){this.parameterPositions=e,this._cachedIndex=0,this.resultBuffer=r!==void 0?r:new n.constructor(i),this.sampleValues=n,this.valueSize=i,this.settings=null,this.DefaultSettings_={}}evaluate(e){let n=this.parameterPositions,i=this._cachedIndex,r=n[i],s=n[i-1];n:{e:{let o;t:{i:if(!(e<r)){for(let a=i+2;;){if(r===void 0){if(e<s)break i;return i=n.length,this._cachedIndex=i,this.copySampleValue_(i-1)}if(i===a)break;if(s=r,r=n[++i],e<r)break e}o=n.length;break t}if(!(e>=s)){let a=n[1];e<a&&(i=2,s=a);for(let l=i-2;;){if(s===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(i===l)break;if(r=s,s=n[--i-1],e>=s)break e}o=i,i=0;break t}break n}for(;i<o;){let a=i+o>>>1;e<n[a]?o=a:i=a+1}if(r=n[i],s=n[i-1],s===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(r===void 0)return i=n.length,this._cachedIndex=i,this.copySampleValue_(i-1)}this._cachedIndex=i,this.intervalChanged_(i,s,r)}return this.interpolate_(i,s,e,r)}getSettings_(){return this.settings||this.DefaultSettings_}copySampleValue_(e){let n=this.resultBuffer,i=this.sampleValues,r=this.valueSize,s=e*r;for(let o=0;o!==r;++o)n[o]=i[s+o];return n}interpolate_(){throw new Error("THREE.Interpolant: Call to abstract method.")}intervalChanged_(){}},$f=class extends mo{constructor(e,n,i,r){super(e,n,i,r),this._weightPrev=-0,this._offsetPrev=-0,this._weightNext=-0,this._offsetNext=-0,this.DefaultSettings_={endingStart:E0,endingEnd:E0}}intervalChanged_(e,n,i){let r=this.parameterPositions,s=e-2,o=e+1,a=r[s],l=r[o];if(a===void 0)switch(this.getSettings_().endingStart){case R0:s=e,a=2*n-i;break;case C0:s=r.length-2,a=n+r[s]-r[s+1];break;default:s=e,a=i}if(l===void 0)switch(this.getSettings_().endingEnd){case R0:o=e,l=2*i-n;break;case C0:o=1,l=i+r[1]-r[0];break;default:o=e-1,l=n}let c=(i-n)*.5,u=this.valueSize;this._weightPrev=c/(n-a),this._weightNext=c/(l-i),this._offsetPrev=s*u,this._offsetNext=o*u}interpolate_(e,n,i,r){let s=this.resultBuffer,o=this.sampleValues,a=this.valueSize,l=e*a,c=l-a,u=this._offsetPrev,f=this._offsetNext,h=this._weightPrev,d=this._weightNext,g=(i-n)/(r-n),x=g*g,m=x*g,p=-h*m+2*h*x-h*g,_=(1+h)*m+(-1.5-2*h)*x+(-.5+h)*g+1,M=(-1-d)*m+(1.5+d)*x+.5*g,v=d*m-d*x;for(let S=0;S!==a;++S)s[S]=p*o[u+S]+_*o[c+S]+M*o[l+S]+v*o[f+S];return s}},Xf=class extends mo{constructor(e,n,i,r){super(e,n,i,r)}interpolate_(e,n,i,r){let s=this.resultBuffer,o=this.sampleValues,a=this.valueSize,l=e*a,c=l-a,u=(i-n)/(r-n),f=1-u;for(let h=0;h!==a;++h)s[h]=o[c+h]*f+o[l+h]*u;return s}},Yf=class extends mo{constructor(e,n,i,r){super(e,n,i,r)}interpolate_(e){return this.copySampleValue_(e-1)}},qf=class extends mo{interpolate_(e,n,i,r){let s=this.resultBuffer,o=this.sampleValues,a=this.valueSize,l=e*a,c=l-a,u=this.inTangents,f=this.outTangents;if(!u||!f){let g=(i-n)/(r-n),x=1-g;for(let m=0;m!==a;++m)s[m]=o[c+m]*x+o[l+m]*g;return s}let h=a*2,d=e-1;for(let g=0;g!==a;++g){let x=o[c+g],m=o[l+g],p=d*h+g*2,_=f[p],M=f[p+1],v=e*h+g*2,S=u[v],w=u[v+1],E=OT(i,n,_,S,r);s[g]=K_(E,x,M,w,m)}return s}};function K_(t,e,n,i,r){let s=1-t;return s*s*s*e+3*s*s*t*n+3*s*t*t*i+t*t*t*r}function NT(t,e,n,i,r){let s=1-t;return 3*s*s*(n-e)+6*s*t*(i-n)+3*t*t*(r-i)}function OT(t,e,n,i,r){let s=(t-e)/(r-e);for(let o=0;o<8;o++){let a=K_(s,e,n,i,r)-t;if(Math.abs(a)<1e-10)break;let l=NT(s,e,n,i,r);if(Math.abs(l)<1e-10)break;s=Math.max(0,Math.min(1,s-a/l))}return s}var Ji=class{constructor(e,n,i,r){if(e===void 0)throw new Error("THREE.KeyframeTrack: track name is undefined");if(n===void 0||n.length===0)throw new Error("THREE.KeyframeTrack: no keyframes in track named "+e);this.name=e,this.times=cl(n,this.TimeBufferType),this.values=cl(i,this.ValueBufferType),this.setInterpolation(r||this.DefaultInterpolation)}static toJSON(e){let n=e.constructor,i;if(n.toJSON!==this.toJSON)i=n.toJSON(e);else{i={name:e.name,times:cl(e.times,Array),values:cl(e.values,Array)};let r=e.getInterpolation();r!==e.DefaultInterpolation&&(i.interpolation=r),A0(e.settings)&&(i.settings={inTangents:cl(e.settings.inTangents,Array),outTangents:cl(e.settings.outTangents,Array)})}return i.type=e.ValueTypeName,i}InterpolantFactoryMethodDiscrete(e){return new Yf(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodLinear(e){return new Xf(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodSmooth(e){return new $f(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodBezier(e){let n=new qf(this.times,this.values,this.getValueSize(),e);return this.settings&&(n.inTangents=this.settings.inTangents,n.outTangents=this.settings.outTangents),n}setInterpolation(e){let n;switch(e){case Nc:n=this.InterpolantFactoryMethodDiscrete;break;case Pf:n=this.InterpolantFactoryMethodLinear;break;case yf:n=this.InterpolantFactoryMethodSmooth;break;case T0:n=this.InterpolantFactoryMethodBezier;break}if(n===void 0){let i="unsupported interpolation for "+this.ValueTypeName+" keyframe track named "+this.name;if(this.createInterpolant===void 0)if(e!==this.DefaultInterpolation)this.setInterpolation(this.DefaultInterpolation);else throw new Error(i);return dt("KeyframeTrack:",i),this}return this.createInterpolant=n,this}getInterpolation(){switch(this.createInterpolant){case this.InterpolantFactoryMethodDiscrete:return Nc;case this.InterpolantFactoryMethodLinear:return Pf;case this.InterpolantFactoryMethodSmooth:return yf;case this.InterpolantFactoryMethodBezier:return T0}}getValueSize(){return this.values.length/this.times.length}shift(e){if(e!==0){let n=this.times;for(let i=0,r=n.length;i!==r;++i)n[i]+=e}return this}scale(e){if(e!==1){let n=this.times;for(let i=0,r=n.length;i!==r;++i)n[i]*=e;A0(this.settings)&&(c_(this.settings.inTangents,e),c_(this.settings.outTangents,e))}return this}trim(e,n){let i=this.times,r=i.length,s=0,o=r-1;for(;s!==r&&i[s]<e;)++s;for(;o!==-1&&i[o]>n;)--o;if(++o,s!==0||o!==r){s>=o&&(o=Math.max(o,1),s=o-1);let a=this.getValueSize();this.times=i.slice(s,o),this.values=this.values.slice(s*a,o*a)}return this}validate(){let e=!0,n=this.getValueSize();n-Math.floor(n)!==0&&(gt("KeyframeTrack: Invalid value size in track.",this),e=!1);let i=this.times,r=this.values,s=i.length;s===0&&(gt("KeyframeTrack: Track is empty.",this),e=!1);let o=null;for(let a=0;a!==s;a++){let l=i[a];if(typeof l=="number"&&isNaN(l)){gt("KeyframeTrack: Time is not a valid number.",this,a,l),e=!1;break}if(o!==null&&o>l){gt("KeyframeTrack: Out of order keys.",this,a,l,o),e=!1;break}o=l}if(r!==void 0&&uT(r))for(let a=0,l=r.length;a!==l;++a){let c=r[a];if(isNaN(c)){gt("KeyframeTrack: Value is not a valid number.",this,a,c),e=!1;break}}return e}optimize(){let e=this.times.slice(),n=this.values.slice(),i=this.getValueSize(),r=this.getInterpolation()===yf,s=e.length-1,o=1;for(let a=1;a<s;++a){let l=!1,c=e[a],u=e[a+1];if(c!==u&&(a!==1||c!==e[0]))if(r)l=!0;else{let f=a*i,h=f-i,d=f+i;for(let g=0;g!==i;++g){let x=n[f+g];if(x!==n[h+g]||x!==n[d+g]){l=!0;break}}}if(l){if(a!==o){e[o]=e[a];let f=a*i,h=o*i;for(let d=0;d!==i;++d)n[h+d]=n[f+d]}++o}}if(s>0){e[o]=e[s];for(let a=s*i,l=o*i,c=0;c!==i;++c)n[l+c]=n[a+c];++o}return o!==e.length?(this.times=e.slice(0,o),this.values=n.slice(0,o*i)):(this.times=e,this.values=n),this}clone(){let e=this.times.slice(),n=this.values.slice(),i=this.constructor,r=new i(this.name,e,n);return r.createInterpolant=this.createInterpolant,A0(this.settings)&&(r.settings={inTangents:this.settings.inTangents.slice(),outTangents:this.settings.outTangents.slice()}),r}};function c_(t,e){for(let n=0,i=t.length;n!==i;n+=2)t[n]*=e}Ji.prototype.ValueTypeName="";Ji.prototype.TimeBufferType=Float32Array;Ji.prototype.ValueBufferType=Float32Array;Ji.prototype.DefaultInterpolation=Pf;var go=class extends Ji{constructor(e,n,i){super(e,n,i)}};go.prototype.ValueTypeName="bool";go.prototype.ValueBufferType=Array;go.prototype.DefaultInterpolation=Nc;go.prototype.InterpolantFactoryMethodLinear=void 0;go.prototype.InterpolantFactoryMethodSmooth=void 0;var jf=class extends Ji{constructor(e,n,i,r){super(e,n,i,r)}};jf.prototype.ValueTypeName="color";var Zf=class extends Ji{constructor(e,n,i,r){super(e,n,i,r)}};Zf.prototype.ValueTypeName="number";var Kf=class extends mo{constructor(e,n,i,r){super(e,n,i,r)}interpolate_(e,n,i,r){let s=this.resultBuffer,o=this.sampleValues,a=this.valueSize,l=(i-n)/(r-n),c=e*a;for(let u=c+a;c!==u;c+=4)gr.slerpFlat(s,0,o,c-a,o,c,l);return s}},Jc=class extends Ji{constructor(e,n,i,r){super(e,n,i,r)}InterpolantFactoryMethodLinear(e){return new Kf(this.times,this.values,this.getValueSize(),e)}};Jc.prototype.ValueTypeName="quaternion";Jc.prototype.InterpolantFactoryMethodSmooth=void 0;var xo=class extends Ji{constructor(e,n,i){super(e,n,i)}};xo.prototype.ValueTypeName="string";xo.prototype.ValueBufferType=Array;xo.prototype.DefaultInterpolation=Nc;xo.prototype.InterpolantFactoryMethodLinear=void 0;xo.prototype.InterpolantFactoryMethodSmooth=void 0;var Jf=class extends Ji{constructor(e,n,i,r){super(e,n,i,r)}};Jf.prototype.ValueTypeName="vector";var Qf=class{constructor(e,n,i){let r=this,s=!1,o=0,a=0,l,c=[];this.onStart=void 0,this.onLoad=e,this.onProgress=n,this.onError=i,this._abortController=null,this.itemStart=function(u){a++,s===!1&&r.onStart!==void 0&&r.onStart(u,o,a),s=!0},this.itemEnd=function(u){o++,r.onProgress!==void 0&&r.onProgress(u,o,a),o===a&&(s=!1,r.onLoad!==void 0&&r.onLoad())},this.itemError=function(u){r.onError!==void 0&&r.onError(u)},this.resolveURL=function(u){return u=u.normalize("NFC"),l?l(u):u},this.setURLModifier=function(u){return l=u,this},this.addHandler=function(u,f){return c.push(u,f),this},this.removeHandler=function(u){let f=c.indexOf(u);return f!==-1&&c.splice(f,2),this},this.getHandler=function(u){for(let f=0,h=c.length;f<h;f+=2){let d=c[f],g=c[f+1];if(d.global&&(d.lastIndex=0),d.test(u))return g}return null},this.abort=function(){return this.abortController.abort(),this._abortController=null,this}}get abortController(){return this._abortController||(this._abortController=new AbortController),this._abortController}},J_=new Qf,ed=class{constructor(e){this.manager=e!==void 0?e:J_,this.crossOrigin="anonymous",this.withCredentials=!1,this.path="",this.resourcePath="",this.requestHeader={},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}load(){}loadAsync(e,n){let i=this;return new Promise(function(r,s){i.load(e,r,n,s)})}parse(){}setCrossOrigin(e){return this.crossOrigin=e,this}setWithCredentials(e){return this.withCredentials=e,this}setPath(e){return this.path=e,this}setResourcePath(e){return this.resourcePath=e,this}setRequestHeader(e){return this.requestHeader=e,this}abort(){return this}};ed.DEFAULT_MATERIAL_NAME="__DEFAULT";var xf=new P,vf=new gr,jr=new P,Qc=class extends ki{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new Ot,this.projectionMatrix=new Ot,this.projectionMatrixInverse=new Ot,this.coordinateSystem=Nr,this._reversedDepth=!1}get reversedDepth(){return this._reversedDepth}copy(e,n){return super.copy(e,n),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorld.decompose(xf,vf,jr),jr.x===1&&jr.y===1&&jr.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(xf,vf,jr.set(1,1,1)).invert()}updateWorldMatrix(e,n,i=!1){super.updateWorldMatrix(e,n,i),this.matrixWorld.decompose(xf,vf,jr),jr.x===1&&jr.y===1&&jr.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(xf,vf,jr.set(1,1,1)).invert()}clone(){return new this.constructor().copy(this)}},co=new P,u_=new pt,h_=new pt,pi=class extends Qc{constructor(e=50,n=1,i=.1,r=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=e,this.zoom=1,this.near=i,this.far=r,this.focus=10,this.aspect=n,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,n){return super.copy(e,n),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){let n=.5*this.getFilmHeight()/e;this.fov=If*2*Math.atan(n),this.updateProjectionMatrix()}getFocalLength(){let e=Math.tan(i0*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return If*2*Math.atan(Math.tan(i0*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(e,n,i){co.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),n.set(co.x,co.y).multiplyScalar(-e/co.z),co.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),i.set(co.x,co.y).multiplyScalar(-e/co.z)}getViewSize(e,n){return this.getViewBounds(e,u_,h_),n.subVectors(h_,u_)}setViewOffset(e,n,i,r,s,o){this.aspect=e/n,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=n,this.view.offsetX=i,this.view.offsetY=r,this.view.width=s,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let e=this.near,n=e*Math.tan(i0*.5*this.fov)/this.zoom,i=2*n,r=this.aspect*i,s=-.5*r,o=this.view;if(this.view!==null&&this.view.enabled){let l=o.fullWidth,c=o.fullHeight;s+=o.offsetX*r/l,n-=o.offsetY*i/c,r*=o.width/l,i*=o.height/c}let a=this.filmOffset;a!==0&&(s+=e*a/this.getFilmWidth()),this.projectionMatrix.makePerspective(s,s+r,n,n-i,e,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){let n=super.toJSON(e);return n.object.fov=this.fov,n.object.zoom=this.zoom,n.object.near=this.near,n.object.far=this.far,n.object.focus=this.focus,n.object.aspect=this.aspect,this.view!==null&&(n.object.view=Object.assign({},this.view)),n.object.filmGauge=this.filmGauge,n.object.filmOffset=this.filmOffset,n}};var Ds=class extends Qc{constructor(e=-1,n=1,i=1,r=-1,s=.1,o=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=e,this.right=n,this.top=i,this.bottom=r,this.near=s,this.far=o,this.updateProjectionMatrix()}copy(e,n){return super.copy(e,n),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,n,i,r,s,o){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=n,this.view.offsetX=i,this.view.offsetY=r,this.view.width=s,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let e=(this.right-this.left)/(2*this.zoom),n=(this.top-this.bottom)/(2*this.zoom),i=(this.right+this.left)/2,r=(this.top+this.bottom)/2,s=i-e,o=i+e,a=r+n,l=r-n;if(this.view!==null&&this.view.enabled){let c=(this.right-this.left)/this.view.fullWidth/this.zoom,u=(this.top-this.bottom)/this.view.fullHeight/this.zoom;s+=c*this.view.offsetX,o=s+c*this.view.width,a-=u*this.view.offsetY,l=a-u*this.view.height}this.projectionMatrix.makeOrthographic(s,o,a,l,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){let n=super.toJSON(e);return n.object.zoom=this.zoom,n.object.left=this.left,n.object.right=this.right,n.object.top=this.top,n.object.bottom=this.bottom,n.object.near=this.near,n.object.far=this.far,this.view!==null&&(n.object.view=Object.assign({},this.view)),n}};var sa=class extends Fn{constructor(){super(),this.isInstancedBufferGeometry=!0,this.type="InstancedBufferGeometry",this.instanceCount=1/0}copy(e){return super.copy(e),this.instanceCount=e.instanceCount,this}toJSON(){let e=super.toJSON();return e.instanceCount=this.instanceCount,e.isInstancedBufferGeometry=!0,e}};var ul=-90,hl=1,td=class extends ki{constructor(e,n,i){super(),this.type="CubeCamera",this.renderTarget=i,this.coordinateSystem=null,this.activeMipmapLevel=0;let r=new pi(ul,hl,e,n);r.layers=this.layers,this.add(r);let s=new pi(ul,hl,e,n);s.layers=this.layers,this.add(s);let o=new pi(ul,hl,e,n);o.layers=this.layers,this.add(o);let a=new pi(ul,hl,e,n);a.layers=this.layers,this.add(a);let l=new pi(ul,hl,e,n);l.layers=this.layers,this.add(l);let c=new pi(ul,hl,e,n);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){let e=this.coordinateSystem,n=this.children.concat(),[i,r,s,o,a,l]=n;for(let c of n)this.remove(c);if(e===Nr)i.up.set(0,1,0),i.lookAt(1,0,0),r.up.set(0,1,0),r.lookAt(-1,0,0),s.up.set(0,0,-1),s.lookAt(0,1,0),o.up.set(0,0,1),o.lookAt(0,-1,0),a.up.set(0,1,0),a.lookAt(0,0,1),l.up.set(0,1,0),l.lookAt(0,0,-1);else if(e===Fc)i.up.set(0,-1,0),i.lookAt(-1,0,0),r.up.set(0,-1,0),r.lookAt(1,0,0),s.up.set(0,0,1),s.lookAt(0,1,0),o.up.set(0,0,-1),o.lookAt(0,-1,0),a.up.set(0,-1,0),a.lookAt(0,0,1),l.up.set(0,-1,0),l.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+e);for(let c of n)this.add(c),c.updateMatrixWorld()}update(e,n){this.parent===null&&this.updateMatrixWorld();let{renderTarget:i,activeMipmapLevel:r}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());let[s,o,a,l,c,u]=this.children,f=e.getRenderTarget(),h=e.getActiveCubeFace(),d=e.getActiveMipmapLevel(),g=e.xr.enabled;e.xr.enabled=!1;let x=i.texture.generateMipmaps;i.texture.generateMipmaps=!1;let m=!1;e.isWebGLRenderer===!0?m=e.state.buffers.depth.getReversed():m=e.reversedDepthBuffer,e.setRenderTarget(i,0,r),m&&e.autoClear===!1&&e.clearDepth(),e.render(n,s),e.setRenderTarget(i,1,r),m&&e.autoClear===!1&&e.clearDepth(),e.render(n,o),e.setRenderTarget(i,2,r),m&&e.autoClear===!1&&e.clearDepth(),e.render(n,a),e.setRenderTarget(i,3,r),m&&e.autoClear===!1&&e.clearDepth(),e.render(n,l),e.setRenderTarget(i,4,r),m&&e.autoClear===!1&&e.clearDepth(),e.render(n,c),i.texture.generateMipmaps=x,e.setRenderTarget(i,5,r),m&&e.autoClear===!1&&e.clearDepth(),e.render(n,u),e.setRenderTarget(f,h,d),e.xr.enabled=g,i.texture.needsPMREMUpdate=!0}},nd=class extends pi{constructor(e=[]){super(),this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=e}};var ig="\\[\\]\\.:\\/",FT=new RegExp("["+ig+"]","g"),rg="[^"+ig+"]",UT="[^"+ig.replace("\\.","")+"]",kT=/((?:WC+[\/:])*)/.source.replace("WC",rg),BT=/(WCOD+)?/.source.replace("WCOD",UT),zT=/(?:\.(WC+)(?:\[(.+)\])?)?/.source.replace("WC",rg),VT=/\.(WC+)(?:\[(.+)\])?/.source.replace("WC",rg),GT=new RegExp("^"+kT+BT+zT+VT+"$"),HT=["material","materials","bones","map"],I0=class{constructor(e,n,i){let r=i||bn.parseTrackName(n);this._targetGroup=e,this._bindings=e.subscribe_(n,r)}getValue(e,n){this.bind();let i=this._targetGroup.nCachedObjects_,r=this._bindings[i];r!==void 0&&r.getValue(e,n)}setValue(e,n){let i=this._bindings;for(let r=this._targetGroup.nCachedObjects_,s=i.length;r!==s;++r)i[r].setValue(e,n)}bind(){let e=this._bindings;for(let n=this._targetGroup.nCachedObjects_,i=e.length;n!==i;++n)e[n].bind()}unbind(){let e=this._bindings;for(let n=this._targetGroup.nCachedObjects_,i=e.length;n!==i;++n)e[n].unbind()}},bn=class t{constructor(e,n,i){this.path=n,this.parsedPath=i||t.parseTrackName(n),this.node=t.findNode(e,this.parsedPath.nodeName),this.rootNode=e,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}static create(e,n,i){return e&&e.isAnimationObjectGroup?new t.Composite(e,n,i):new t(e,n,i)}static sanitizeNodeName(e){return e.replace(/\s/g,"_").replace(FT,"")}static parseTrackName(e){let n=GT.exec(e);if(n===null)throw new Error("THREE.PropertyBinding: Cannot parse trackName: "+e);let i={nodeName:n[2],objectName:n[3],objectIndex:n[4],propertyName:n[5],propertyIndex:n[6]},r=i.nodeName&&i.nodeName.lastIndexOf(".");if(r!==void 0&&r!==-1){let s=i.nodeName.substring(r+1);HT.indexOf(s)!==-1&&(i.nodeName=i.nodeName.substring(0,r),i.objectName=s)}if(i.propertyName===null||i.propertyName.length===0)throw new Error("THREE.PropertyBinding: can not parse propertyName from trackName: "+e);return i}static findNode(e,n){if(n===void 0||n===""||n==="."||n===-1||n===e.name||n===e.uuid)return e;if(e.skeleton){let i=e.skeleton.getBoneByName(n);if(i!==void 0)return i}if(e.children){let i=function(s){for(let o=0;o<s.length;o++){let a=s[o];if(a.name===n||a.uuid===n)return a;let l=i(a.children);if(l)return l}return null},r=i(e.children);if(r)return r}return null}_getValue_unavailable(){}_setValue_unavailable(){}_getValue_direct(e,n){e[n]=this.targetObject[this.propertyName]}_getValue_array(e,n){let i=this.resolvedProperty;for(let r=0,s=i.length;r!==s;++r)e[n++]=i[r]}_getValue_arrayElement(e,n){e[n]=this.resolvedProperty[this.propertyIndex]}_getValue_toArray(e,n){this.resolvedProperty.toArray(e,n)}_setValue_direct(e,n){this.targetObject[this.propertyName]=e[n]}_setValue_direct_setNeedsUpdate(e,n){this.targetObject[this.propertyName]=e[n],this.targetObject.needsUpdate=!0}_setValue_direct_setMatrixWorldNeedsUpdate(e,n){this.targetObject[this.propertyName]=e[n],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_array(e,n){let i=this.resolvedProperty;for(let r=0,s=i.length;r!==s;++r)i[r]=e[n++]}_setValue_array_setNeedsUpdate(e,n){let i=this.resolvedProperty;for(let r=0,s=i.length;r!==s;++r)i[r]=e[n++];this.targetObject.needsUpdate=!0}_setValue_array_setMatrixWorldNeedsUpdate(e,n){let i=this.resolvedProperty;for(let r=0,s=i.length;r!==s;++r)i[r]=e[n++];this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_arrayElement(e,n){this.resolvedProperty[this.propertyIndex]=e[n]}_setValue_arrayElement_setNeedsUpdate(e,n){this.resolvedProperty[this.propertyIndex]=e[n],this.targetObject.needsUpdate=!0}_setValue_arrayElement_setMatrixWorldNeedsUpdate(e,n){this.resolvedProperty[this.propertyIndex]=e[n],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_fromArray(e,n){this.resolvedProperty.fromArray(e,n)}_setValue_fromArray_setNeedsUpdate(e,n){this.resolvedProperty.fromArray(e,n),this.targetObject.needsUpdate=!0}_setValue_fromArray_setMatrixWorldNeedsUpdate(e,n){this.resolvedProperty.fromArray(e,n),this.targetObject.matrixWorldNeedsUpdate=!0}_getValue_unbound(e,n){this.bind(),this.getValue(e,n)}_setValue_unbound(e,n){this.bind(),this.setValue(e,n)}bind(){let e=this.node,n=this.parsedPath,i=n.objectName,r=n.propertyName,s=n.propertyIndex;if(e||(e=t.findNode(this.rootNode,n.nodeName),this.node=e),this.getValue=this._getValue_unavailable,this.setValue=this._setValue_unavailable,!e){dt("PropertyBinding: No target node found for track: "+this.path+".");return}if(i){let c=n.objectIndex;switch(i){case"materials":if(!e.material){gt("PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!e.material.materials){gt("PropertyBinding: Can not bind to material.materials as node.material does not have a materials array.",this);return}e=e.material.materials;break;case"bones":if(!e.skeleton){gt("PropertyBinding: Can not bind to bones as node does not have a skeleton.",this);return}e=e.skeleton.bones;for(let u=0;u<e.length;u++)if(e[u].name===c){c=u;break}break;case"map":if("map"in e){e=e.map;break}if(!e.material){gt("PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!e.material.map){gt("PropertyBinding: Can not bind to material.map as node.material does not have a map.",this);return}e=e.material.map;break;default:if(e[i]===void 0){gt("PropertyBinding: Can not bind to objectName of node undefined.",this);return}e=e[i]}if(c!==void 0){if(e[c]===void 0){gt("PropertyBinding: Trying to bind to objectIndex of objectName, but is undefined.",this,e);return}e=e[c]}}let o=e[r];if(o===void 0){let c=n.nodeName;gt("PropertyBinding: Trying to update property for track: "+c+"."+r+" but it wasn't found.",e);return}let a=this.Versioning.None;this.targetObject=e,e.isMaterial===!0?a=this.Versioning.NeedsUpdate:e.isObject3D===!0&&(a=this.Versioning.MatrixWorldNeedsUpdate);let l=this.BindingType.Direct;if(s!==void 0){if(r==="morphTargetInfluences"){if(!e.geometry){gt("PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.",this);return}if(!e.geometry.morphAttributes){gt("PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.morphAttributes.",this);return}e.morphTargetDictionary[s]!==void 0&&(s=e.morphTargetDictionary[s])}l=this.BindingType.ArrayElement,this.resolvedProperty=o,this.propertyIndex=s}else o.fromArray!==void 0&&o.toArray!==void 0?(l=this.BindingType.HasFromToArray,this.resolvedProperty=o):Array.isArray(o)?(l=this.BindingType.EntireArray,this.resolvedProperty=o):this.propertyName=r;this.getValue=this.GetterByBindingType[l],this.setValue=this.SetterByBindingTypeAndVersioning[l][a]}unbind(){this.node=null,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}};bn.Composite=I0;bn.prototype.BindingType={Direct:0,EntireArray:1,ArrayElement:2,HasFromToArray:3};bn.prototype.Versioning={None:0,NeedsUpdate:1,MatrixWorldNeedsUpdate:2};bn.prototype.GetterByBindingType=[bn.prototype._getValue_direct,bn.prototype._getValue_array,bn.prototype._getValue_arrayElement,bn.prototype._getValue_toArray];bn.prototype.SetterByBindingTypeAndVersioning=[[bn.prototype._setValue_direct,bn.prototype._setValue_direct_setNeedsUpdate,bn.prototype._setValue_direct_setMatrixWorldNeedsUpdate],[bn.prototype._setValue_array,bn.prototype._setValue_array_setNeedsUpdate,bn.prototype._setValue_array_setMatrixWorldNeedsUpdate],[bn.prototype._setValue_arrayElement,bn.prototype._setValue_arrayElement_setNeedsUpdate,bn.prototype._setValue_arrayElement_setMatrixWorldNeedsUpdate],[bn.prototype._setValue_fromArray,bn.prototype._setValue_fromArray_setNeedsUpdate,bn.prototype._setValue_fromArray_setMatrixWorldNeedsUpdate]];var dN=new Float32Array(1);var _l=class extends Of{constructor(e,n,i=1){super(e,n),this.isInstancedInterleavedBuffer=!0,this.meshPerAttribute=i}copy(e){return super.copy(e),this.meshPerAttribute=e.meshPerAttribute,this}clone(e){let n=super.clone(e);return n.meshPerAttribute=this.meshPerAttribute,n}toJSON(e){let n=super.toJSON(e);return n.isInstancedInterleavedBuffer=!0,n.meshPerAttribute=this.meshPerAttribute,n}};var f_=new Ot,eu=class{constructor(e,n,i=0,r=1/0){this.ray=new Ls(e,n),this.near=i,this.far=r,this.camera=null,this.layers=new gl,this.params={Mesh:{},Line:{threshold:1},LOD:{},Points:{threshold:1},Sprite:{}}}set(e,n){this.ray.set(e,n)}setFromCamera(e,n){n.isPerspectiveCamera?(this.ray.origin.setFromMatrixPosition(n.matrixWorld),this.ray.direction.set(e.x,e.y,.5).unproject(n).sub(this.ray.origin).normalize(),this.camera=n):n.isOrthographicCamera?(this.ray.origin.set(e.x,e.y,n.projectionMatrix.elements[14]).unproject(n),this.ray.direction.set(0,0,-1).transformDirection(n.matrixWorld),this.camera=n):gt("Raycaster: Unsupported camera type: "+n.type)}setFromXRController(e){return f_.identity().extractRotation(e.matrixWorld),this.ray.origin.setFromMatrixPosition(e.matrixWorld),this.ray.direction.set(0,0,-1).applyMatrix4(f_),this}intersectObject(e,n=!0,i=[]){return L0(e,this,i,n),i.sort(d_),i}intersectObjects(e,n=!0,i=[]){for(let r=0,s=e.length;r<s;r++)L0(e[r],this,i,n);return i.sort(d_),i}};function d_(t,e){return t.distance-e.distance}function L0(t,e,n,i){let r=!0;if(t.layers.test(e.layers)&&t.raycast(e,n)===!1&&(r=!1),r===!0&&i===!0){let s=t.children;for(let o=0,a=s.length;o<a;o++)L0(s[o],e,n,!0)}}var ug=class ug{constructor(e,n,i,r){this.elements=[1,0,0,1],e!==void 0&&this.set(e,n,i,r)}identity(){return this.set(1,0,0,1),this}fromArray(e,n=0){for(let i=0;i<4;i++)this.elements[i]=e[i+n];return this}set(e,n,i,r){let s=this.elements;return s[0]=e,s[2]=n,s[1]=i,s[3]=r,this}};ug.prototype.isMatrix2=!0;var D0=ug;function sg(t,e,n,i){let r=WT(i);switch(n){case K0:return t*e;case hd:return t*e/r.components*r.byteLength;case fd:return t*e/r.components*r.byteLength;case bo:return t*e*2/r.components*r.byteLength;case dd:return t*e*2/r.components*r.byteLength;case J0:return t*e*3/r.components*r.byteLength;case ri:return t*e*4/r.components*r.byteLength;case pd:return t*e*4/r.components*r.byteLength;case su:case ou:return Math.floor((t+3)/4)*Math.floor((e+3)/4)*8;case au:case lu:return Math.floor((t+3)/4)*Math.floor((e+3)/4)*16;case gd:case vd:return Math.max(t,16)*Math.max(e,8)/4;case md:case xd:return Math.max(t,8)*Math.max(e,8)/2;case yd:case _d:case Md:case Sd:return Math.floor((t+3)/4)*Math.floor((e+3)/4)*8;case bd:case cu:case wd:return Math.floor((t+3)/4)*Math.floor((e+3)/4)*16;case Ad:return Math.floor((t+3)/4)*Math.floor((e+3)/4)*16;case Td:return Math.floor((t+4)/5)*Math.floor((e+3)/4)*16;case Ed:return Math.floor((t+4)/5)*Math.floor((e+4)/5)*16;case Rd:return Math.floor((t+5)/6)*Math.floor((e+4)/5)*16;case Cd:return Math.floor((t+5)/6)*Math.floor((e+5)/6)*16;case Pd:return Math.floor((t+7)/8)*Math.floor((e+4)/5)*16;case Id:return Math.floor((t+7)/8)*Math.floor((e+5)/6)*16;case Ld:return Math.floor((t+7)/8)*Math.floor((e+7)/8)*16;case Dd:return Math.floor((t+9)/10)*Math.floor((e+4)/5)*16;case Nd:return Math.floor((t+9)/10)*Math.floor((e+5)/6)*16;case Od:return Math.floor((t+9)/10)*Math.floor((e+7)/8)*16;case Fd:return Math.floor((t+9)/10)*Math.floor((e+9)/10)*16;case Ud:return Math.floor((t+11)/12)*Math.floor((e+9)/10)*16;case kd:return Math.floor((t+11)/12)*Math.floor((e+11)/12)*16;case Bd:case zd:case Vd:return Math.ceil(t/4)*Math.ceil(e/4)*16;case Gd:case Hd:return Math.ceil(t/4)*Math.ceil(e/4)*8;case uu:case Wd:return Math.ceil(t/4)*Math.ceil(e/4)*16}throw new Error(`Unable to determine texture byte length for ${n} format.`)}function WT(t){switch(t){case er:case Y0:return{byteLength:1,components:1};case Sl:case q0:case gi:return{byteLength:2,components:1};case cd:case ud:return{byteLength:2,components:4};case Fr:case ld:case xr:return{byteLength:4,components:1};case j0:case Z0:return{byteLength:4,components:3}}throw new Error(`THREE.TextureUtils: Unknown texture type ${t}.`)}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:"186"}}));typeof window<"u"&&(window.__THREE__?dt("WARNING: Multiple instances of Three.js being imported."):window.__THREE__="186");function _b(){let t=null,e=!1,n=null,i=null;function r(s,o){i=t.requestAnimationFrame(r),n(s,o)}return{start:function(){e!==!0&&n!==null&&t!==null&&(i=t.requestAnimationFrame(r),e=!0)},stop:function(){t!==null&&t.cancelAnimationFrame(i),e=!1},setAnimationLoop:function(s){n=s},setContext:function(s){t=s}}}function XT(t){let e=new WeakMap;function n(a,l){let c=a.array,u=a.usage,f=c.byteLength,h=t.createBuffer();t.bindBuffer(l,h),t.bufferData(l,c,u),a.onUploadCallback();let d;if(c instanceof Float32Array)d=t.FLOAT;else if(typeof Float16Array<"u"&&c instanceof Float16Array)d=t.HALF_FLOAT;else if(c instanceof Uint16Array)a.isFloat16BufferAttribute?d=t.HALF_FLOAT:d=t.UNSIGNED_SHORT;else if(c instanceof Int16Array)d=t.SHORT;else if(c instanceof Uint32Array)d=t.UNSIGNED_INT;else if(c instanceof Int32Array)d=t.INT;else if(c instanceof Int8Array)d=t.BYTE;else if(c instanceof Uint8Array)d=t.UNSIGNED_BYTE;else if(c instanceof Uint8ClampedArray)d=t.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+c);return{buffer:h,type:d,bytesPerElement:c.BYTES_PER_ELEMENT,version:a.version,size:f}}function i(a,l,c){let u=l.array,f=l.updateRanges;if(t.bindBuffer(c,a),f.length===0)t.bufferSubData(c,0,u);else{f.sort((d,g)=>d.start-g.start);let h=0;for(let d=1;d<f.length;d++){let g=f[h],x=f[d];x.start<=g.start+g.count+1?g.count=Math.max(g.count,x.start+x.count-g.start):(++h,f[h]=x)}f.length=h+1;for(let d=0,g=f.length;d<g;d++){let x=f[d];t.bufferSubData(c,x.start*u.BYTES_PER_ELEMENT,u,x.start,x.count)}l.clearUpdateRanges()}l.onUploadCallback()}function r(a){return a.isInterleavedBufferAttribute&&(a=a.data),e.get(a)}function s(a){a.isInterleavedBufferAttribute&&(a=a.data);let l=e.get(a);l&&(t.deleteBuffer(l.buffer),e.delete(a))}function o(a,l){if(a.isInterleavedBufferAttribute&&(a=a.data),a.isGLBufferAttribute){let u=e.get(a);(!u||u.version<a.version)&&e.set(a,{buffer:a.buffer,type:a.type,bytesPerElement:a.elementSize,version:a.version});return}let c=e.get(a);if(c===void 0)e.set(a,n(a,l));else if(c.version<a.version){if(c.size!==a.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");i(c.buffer,a,l),c.version=a.version}}return{get:r,remove:s,update:o}}var YT=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,qT=`#ifdef USE_ALPHAHASH
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
#endif`,jT=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,ZT=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,KT=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,JT=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,QT=`#ifdef USE_AOMAP
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
#endif`,fE=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#endif`,dE=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
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
#endif`,TE=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
#endif`,EE=`#ifdef USE_ENVMAP
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
#endif`,e2=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,t2=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,n2=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
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
#endif`,i2=`#if defined( USE_POINTS_UV )
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
#endif`,r2=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,s2=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,o2=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,a2=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,l2=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,c2=`#ifdef USE_MORPHTARGETS
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
#endif`,u2=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,h2=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
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
vec3 nonPerturbedNormal = normal;`,f2=`#ifdef USE_NORMALMAP_OBJECTSPACE
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
#endif`,d2=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,p2=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,m2=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
		#ifdef FLIP_SIDED
			vBitangent = - vBitangent;
		#endif
	#endif
#endif`,g2=`#ifdef USE_NORMALMAP
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
#endif`,x2=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,v2=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,y2=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,_2=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,b2=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,M2=`vec3 packNormalToRGB( const in vec3 normal ) {
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
}`,S2=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,w2=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,A2=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,T2=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,E2=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,R2=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,C2=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,P2=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,I2=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_SUN_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
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
#endif`,L2=`float getShadowMask() {
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
}`,D2=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,N2=`#ifdef USE_SKINNING
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
#endif`,O2=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,F2=`#ifdef USE_SKINNING
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
#endif`,U2=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,k2=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,B2=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,z2=`#ifndef saturate
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
vec3 CustomToneMapping( vec3 color ) { return color; }`,V2=`#ifdef USE_TRANSMISSION
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
#endif`,G2=`#ifdef USE_TRANSMISSION
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
#endif`,H2=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,W2=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,$2=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,X2=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`,Y2=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,q2=`uniform sampler2D t2D;
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
}`,j2=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Z2=`#ifdef ENVMAP_TYPE_CUBE
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
}`,K2=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,J2=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Q2=`#include <common>
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
}`,fR=`#define MATCAP
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
}`,dR=`#define NORMAL
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
}`,TR=`uniform vec3 diffuse;
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
}`,At={alphahash_fragment:YT,alphahash_pars_fragment:qT,alphamap_fragment:jT,alphamap_pars_fragment:ZT,alphatest_fragment:KT,alphatest_pars_fragment:JT,aomap_fragment:QT,aomap_pars_fragment:eE,batching_pars_vertex:tE,batching_vertex:nE,begin_vertex:iE,beginnormal_vertex:rE,bsdfs:sE,iridescence_fragment:oE,bumpmap_pars_fragment:aE,clipping_planes_fragment:lE,clipping_planes_pars_fragment:cE,clipping_planes_pars_vertex:uE,clipping_planes_vertex:hE,color_fragment:fE,color_pars_fragment:dE,color_pars_vertex:pE,color_vertex:mE,common:gE,cube_uv_reflection_fragment:xE,defaultnormal_vertex:vE,displacementmap_pars_vertex:yE,displacementmap_vertex:_E,emissivemap_fragment:bE,emissivemap_pars_fragment:ME,colorspace_fragment:SE,colorspace_pars_fragment:wE,envmap_fragment:AE,envmap_common_pars_fragment:TE,envmap_pars_fragment:EE,envmap_pars_vertex:RE,envmap_physical_pars_fragment:BE,envmap_vertex:CE,fog_vertex:PE,fog_pars_vertex:IE,fog_fragment:LE,fog_pars_fragment:DE,gradientmap_pars_fragment:NE,lightmap_pars_fragment:OE,lights_lambert_fragment:FE,lights_lambert_pars_fragment:UE,lights_pars_begin:kE,lights_toon_fragment:zE,lights_toon_pars_fragment:VE,lights_phong_fragment:GE,lights_phong_pars_fragment:HE,lights_physical_fragment:WE,lights_physical_pars_fragment:$E,lights_fragment_begin:XE,lights_fragment_maps:YE,lights_fragment_end:qE,lightprobes_pars_fragment:jE,logdepthbuf_fragment:ZE,logdepthbuf_pars_fragment:KE,logdepthbuf_pars_vertex:JE,logdepthbuf_vertex:QE,map_fragment:e2,map_pars_fragment:t2,map_particle_fragment:n2,map_particle_pars_fragment:i2,metalnessmap_fragment:r2,metalnessmap_pars_fragment:s2,morphinstance_vertex:o2,morphcolor_vertex:a2,morphnormal_vertex:l2,morphtarget_pars_vertex:c2,morphtarget_vertex:u2,normal_fragment_begin:h2,normal_fragment_maps:f2,normal_pars_fragment:d2,normal_pars_vertex:p2,normal_vertex:m2,normalmap_pars_fragment:g2,clearcoat_normal_fragment_begin:x2,clearcoat_normal_fragment_maps:v2,clearcoat_pars_fragment:y2,iridescence_pars_fragment:_2,opaque_fragment:b2,packing:M2,premultiplied_alpha_fragment:S2,project_vertex:w2,dithering_fragment:A2,dithering_pars_fragment:T2,roughnessmap_fragment:E2,roughnessmap_pars_fragment:R2,shadowmap_pars_fragment:C2,shadowmap_pars_vertex:P2,shadowmap_vertex:I2,shadowmask_pars_fragment:L2,skinbase_vertex:D2,skinning_pars_vertex:N2,skinning_vertex:O2,skinnormal_vertex:F2,specularmap_fragment:U2,specularmap_pars_fragment:k2,tonemapping_fragment:B2,tonemapping_pars_fragment:z2,transmission_fragment:V2,transmission_pars_fragment:G2,uv_pars_fragment:H2,uv_pars_vertex:W2,uv_vertex:$2,worldpos_vertex:X2,background_vert:Y2,background_frag:q2,backgroundCube_vert:j2,backgroundCube_frag:Z2,cube_vert:K2,cube_frag:J2,depth_vert:Q2,depth_frag:eR,distance_vert:tR,distance_frag:nR,equirect_vert:iR,equirect_frag:rR,linedashed_vert:sR,linedashed_frag:oR,meshbasic_vert:aR,meshbasic_frag:lR,meshlambert_vert:cR,meshlambert_frag:uR,meshmatcap_vert:hR,meshmatcap_frag:fR,meshnormal_vert:dR,meshnormal_frag:pR,meshphong_vert:mR,meshphong_frag:gR,meshphysical_vert:xR,meshphysical_frag:vR,meshtoon_vert:yR,meshtoon_frag:_R,points_vert:bR,points_frag:MR,shadow_vert:SR,shadow_frag:wR,sprite_vert:AR,sprite_frag:TR},ke={common:{diffuse:{value:new Pt(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new _t},alphaMap:{value:null},alphaMapTransform:{value:new _t},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new _t}},envmap:{envMap:{value:null},envMapRotation:{value:new _t},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98},dfgLUT:{value:null}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new _t}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new _t}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new _t},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new _t},normalScale:{value:new pt(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new _t},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new _t}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new _t}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new _t}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new Pt(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},sunLights:{value:[],properties:{direction:{},color:{}}},sunLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},sunShadowMatrix:{value:[]},sunShadowCascade:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null},probesSH:{value:null},probesMin:{value:new P},probesMax:{value:new P},probesResolution:{value:new P}},points:{diffuse:{value:new Pt(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new _t},alphaTest:{value:0},uvTransform:{value:new _t}},sprite:{diffuse:{value:new Pt(16777215)},opacity:{value:1},center:{value:new pt(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new _t},alphaMap:{value:null},alphaMapTransform:{value:new _t},alphaTest:{value:0}}},os={basic:{uniforms:xi([ke.common,ke.specularmap,ke.envmap,ke.aomap,ke.lightmap,ke.fog]),vertexShader:At.meshbasic_vert,fragmentShader:At.meshbasic_frag},lambert:{uniforms:xi([ke.common,ke.specularmap,ke.envmap,ke.aomap,ke.lightmap,ke.emissivemap,ke.bumpmap,ke.normalmap,ke.displacementmap,ke.fog,ke.lights,{emissive:{value:new Pt(0)},envMapIntensity:{value:1}}]),vertexShader:At.meshlambert_vert,fragmentShader:At.meshlambert_frag},phong:{uniforms:xi([ke.common,ke.specularmap,ke.envmap,ke.aomap,ke.lightmap,ke.emissivemap,ke.bumpmap,ke.normalmap,ke.displacementmap,ke.fog,ke.lights,{emissive:{value:new Pt(0)},specular:{value:new Pt(1118481)},shininess:{value:30},envMapIntensity:{value:1}}]),vertexShader:At.meshphong_vert,fragmentShader:At.meshphong_frag},standard:{uniforms:xi([ke.common,ke.envmap,ke.aomap,ke.lightmap,ke.emissivemap,ke.bumpmap,ke.normalmap,ke.displacementmap,ke.roughnessmap,ke.metalnessmap,ke.fog,ke.lights,{emissive:{value:new Pt(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:At.meshphysical_vert,fragmentShader:At.meshphysical_frag},toon:{uniforms:xi([ke.common,ke.aomap,ke.lightmap,ke.emissivemap,ke.bumpmap,ke.normalmap,ke.displacementmap,ke.gradientmap,ke.fog,ke.lights,{emissive:{value:new Pt(0)}}]),vertexShader:At.meshtoon_vert,fragmentShader:At.meshtoon_frag},matcap:{uniforms:xi([ke.common,ke.bumpmap,ke.normalmap,ke.displacementmap,ke.fog,{matcap:{value:null}}]),vertexShader:At.meshmatcap_vert,fragmentShader:At.meshmatcap_frag},points:{uniforms:xi([ke.points,ke.fog]),vertexShader:At.points_vert,fragmentShader:At.points_frag},dashed:{uniforms:xi([ke.common,ke.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:At.linedashed_vert,fragmentShader:At.linedashed_frag},depth:{uniforms:xi([ke.common,ke.displacementmap]),vertexShader:At.depth_vert,fragmentShader:At.depth_frag},normal:{uniforms:xi([ke.common,ke.bumpmap,ke.normalmap,ke.displacementmap,{opacity:{value:1}}]),vertexShader:At.meshnormal_vert,fragmentShader:At.meshnormal_frag},sprite:{uniforms:xi([ke.sprite,ke.fog]),vertexShader:At.sprite_vert,fragmentShader:At.sprite_frag},background:{uniforms:{uvTransform:{value:new _t},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:At.background_vert,fragmentShader:At.background_frag},backgroundCube:{uniforms:{envMap:{value:null},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new _t}},vertexShader:At.backgroundCube_vert,fragmentShader:At.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:At.cube_vert,fragmentShader:At.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:At.equirect_vert,fragmentShader:At.equirect_frag},distance:{uniforms:xi([ke.common,ke.displacementmap,{referencePosition:{value:new P},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:At.distance_vert,fragmentShader:At.distance_frag},shadow:{uniforms:xi([ke.lights,ke.fog,{color:{value:new Pt(0)},opacity:{value:1}}]),vertexShader:At.shadow_vert,fragmentShader:At.shadow_frag}};os.physical={uniforms:xi([os.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new _t},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new _t},clearcoatNormalScale:{value:new pt(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new _t},dispersion:{value:0},retroreflectivity:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new _t},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new _t},sheen:{value:0},sheenColor:{value:new Pt(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new _t},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new _t},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new _t},transmissionSamplerSize:{value:new pt},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new _t},attenuationDistance:{value:0},attenuationColor:{value:new Pt(0)},specularColor:{value:new Pt(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new _t},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new _t},anisotropyVector:{value:new pt},anisotropyMap:{value:null},anisotropyMapTransform:{value:new _t}}]),vertexShader:At.meshphysical_vert,fragmentShader:At.meshphysical_frag};var Yd={r:0,b:0,g:0},ER=new Ot,bb=new _t;bb.set(-1,0,0,0,1,0,0,0,1);function RR(t,e,n,i,r,s){let o=new Pt(0),a=r===!0?0:1,l,c,u=null,f=0,h=null;function d(_){let M=_.isScene===!0?_.background:null;if(M&&M.isTexture){let v=_.backgroundBlurriness>0;M=e.get(M,v)}return M}function g(_){let M=!1,v=d(_);v===null?m(o,a):v&&v.isColor&&(m(v,1),M=!0);let S=t.xr.getEnvironmentBlendMode();S==="additive"?n.buffers.color.setClear(0,0,0,1,s):S==="alpha-blend"&&n.buffers.color.setClear(0,0,0,0,s),(t.autoClear||M)&&(n.buffers.depth.setTest(!0),n.buffers.depth.setMask(!0),n.buffers.color.setMask(!0),t.clear(t.autoClearColor,t.autoClearDepth,t.autoClearStencil))}function x(_,M){let v=d(M);v&&(v.isCubeTexture||v.mapping===iu)?(c===void 0&&(c=new Xt(new yl(1,1,1),new Ft({name:"BackgroundCubeMaterial",uniforms:la(os.backgroundCube.uniforms),vertexShader:os.backgroundCube.vertexShader,fragmentShader:os.backgroundCube.fragmentShader,side:Ii,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),c.geometry.deleteAttribute("normal"),c.geometry.deleteAttribute("uv"),c.onBeforeRender=function(S,w,E){this.matrixWorld.copyPosition(E.matrixWorld)},Object.defineProperty(c.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),i.update(c)),c.material.uniforms.envMap.value=v,c.material.uniforms.backgroundBlurriness.value=M.backgroundBlurriness,c.material.uniforms.backgroundIntensity.value=M.backgroundIntensity,c.material.uniforms.backgroundRotation.value.setFromMatrix4(ER.makeRotationFromEuler(M.backgroundRotation)).transpose(),v.isCubeTexture&&v.isRenderTargetTexture===!1&&c.material.uniforms.backgroundRotation.value.premultiply(bb),c.material.toneMapped=Et.getTransfer(v.colorSpace)!==Kt,(u!==v||f!==v.version||h!==t.toneMapping)&&(c.material.needsUpdate=!0,u=v,f=v.version,h=t.toneMapping),c.layers.enableAll(),_.unshift(c,c.geometry,c.material,0,0,null)):v&&v.isTexture&&(l===void 0&&(l=new Xt(new ns(2,2),new Ft({name:"BackgroundMaterial",uniforms:la(os.background.uniforms),vertexShader:os.background.vertexShader,fragmentShader:os.background.fragmentShader,side:is,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),l.geometry.deleteAttribute("normal"),Object.defineProperty(l.material,"map",{get:function(){return this.uniforms.t2D.value}}),i.update(l)),l.material.uniforms.t2D.value=v,l.material.uniforms.backgroundIntensity.value=M.backgroundIntensity,l.material.toneMapped=Et.getTransfer(v.colorSpace)!==Kt,v.matrixAutoUpdate===!0&&v.updateMatrix(),l.material.uniforms.uvTransform.value.copy(v.matrix),(u!==v||f!==v.version||h!==t.toneMapping)&&(l.material.needsUpdate=!0,u=v,f=v.version,h=t.toneMapping),l.layers.enableAll(),_.unshift(l,l.geometry,l.material,0,0,null))}function m(_,M){_.getRGB(Yd,ng(t)),n.buffers.color.setClear(Yd.r,Yd.g,Yd.b,M,s)}function p(){c!==void 0&&(c.geometry.dispose(),c.material.dispose(),c=void 0),l!==void 0&&(l.geometry.dispose(),l.material.dispose(),l=void 0)}return{getClearColor:function(){return o},setClearColor:function(_,M=1){o.set(_),a=M,m(o,a)},getClearAlpha:function(){return a},setClearAlpha:function(_){a=_,m(o,a)},render:g,addToRenderList:x,dispose:p}}function CR(t,e){let n=t.getParameter(t.MAX_VERTEX_ATTRIBS),i={},r=h(null),s=r,o=!1;function a(F,O,z,L,V){let N=!1,D=f(F,L,z,O);s!==D&&(s=D,c(s.object)),N=d(F,L,z,V),N&&g(F,L,z,V),V!==null&&e.update(V,t.ELEMENT_ARRAY_BUFFER),(N||o)&&(o=!1,v(F,O,z,L),V!==null&&t.bindBuffer(t.ELEMENT_ARRAY_BUFFER,e.get(V).buffer))}function l(){return t.createVertexArray()}function c(F){return t.bindVertexArray(F)}function u(F){return t.deleteVertexArray(F)}function f(F,O,z,L){let V=L.wireframe===!0,N=i[O.id];N===void 0&&(N={},i[O.id]=N);let D=F.isInstancedMesh===!0?F.id:0,H=N[D];H===void 0&&(H={},N[D]=H);let G=H[z.id];G===void 0&&(G={},H[z.id]=G);let $=G[V];return $===void 0&&($=h(l()),G[V]=$),$}function h(F){let O=[],z=[],L=[];for(let V=0;V<n;V++)O[V]=0,z[V]=0,L[V]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:O,enabledAttributes:z,attributeDivisors:L,object:F,attributes:{},index:null}}function d(F,O,z,L){let V=s.attributes,N=O.attributes,D=0,H=z.getAttributes();for(let G in H)if(H[G].location>=0){let J=V[G],ve=N[G];if(ve===void 0&&(G==="instanceMatrix"&&F.instanceMatrix&&(ve=F.instanceMatrix),G==="instanceColor"&&F.instanceColor&&(ve=F.instanceColor)),J===void 0||J.attribute!==ve||ve&&J.data!==ve.data)return!0;D++}return s.attributesNum!==D||s.index!==L}function g(F,O,z,L){let V={},N=O.attributes,D=0,H=z.getAttributes();for(let G in H)if(H[G].location>=0){let J=N[G];J===void 0&&(G==="instanceMatrix"&&F.instanceMatrix&&(J=F.instanceMatrix),G==="instanceColor"&&F.instanceColor&&(J=F.instanceColor));let ve={};ve.attribute=J,J&&J.data&&(ve.data=J.data),V[G]=ve,D++}s.attributes=V,s.attributesNum=D,s.index=L}function x(){let F=s.newAttributes;for(let O=0,z=F.length;O<z;O++)F[O]=0}function m(F){p(F,0)}function p(F,O){let z=s.newAttributes,L=s.enabledAttributes,V=s.attributeDivisors;z[F]=1,L[F]===0&&(t.enableVertexAttribArray(F),L[F]=1),V[F]!==O&&(t.vertexAttribDivisor(F,O),V[F]=O)}function _(){let F=s.newAttributes,O=s.enabledAttributes;for(let z=0,L=O.length;z<L;z++)O[z]!==F[z]&&(t.disableVertexAttribArray(z),O[z]=0)}function M(F,O,z,L,V,N,D){D===!0?t.vertexAttribIPointer(F,O,z,V,N):t.vertexAttribPointer(F,O,z,L,V,N)}function v(F,O,z,L){x();let V=L.attributes,N=z.getAttributes(),D=O.defaultAttributeValues;for(let H in N){let G=N[H];if(G.location>=0){let $=V[H];if($===void 0&&(H==="instanceMatrix"&&F.instanceMatrix&&($=F.instanceMatrix),H==="instanceColor"&&F.instanceColor&&($=F.instanceColor)),$!==void 0){let J=$.normalized,ve=$.itemSize,ye=e.get($);if(ye===void 0)continue;let rt=ye.buffer,ze=ye.type,nt=ye.bytesPerElement,Z=ze===t.INT||ze===t.UNSIGNED_INT||$.gpuType===ld;if($.isInterleavedBufferAttribute){let te=$.data,Te=te.stride,je=$.offset;if(te.isInstancedInterleavedBuffer){for(let Re=0;Re<G.locationSize;Re++)p(G.location+Re,te.meshPerAttribute);F.isInstancedMesh!==!0&&L._maxInstanceCount===void 0&&(L._maxInstanceCount=te.meshPerAttribute*te.count)}else for(let Re=0;Re<G.locationSize;Re++)m(G.location+Re);t.bindBuffer(t.ARRAY_BUFFER,rt);for(let Re=0;Re<G.locationSize;Re++)M(G.location+Re,ve/G.locationSize,ze,J,Te*nt,(je+ve/G.locationSize*Re)*nt,Z)}else{if($.isInstancedBufferAttribute){for(let te=0;te<G.locationSize;te++)p(G.location+te,$.meshPerAttribute);F.isInstancedMesh!==!0&&L._maxInstanceCount===void 0&&(L._maxInstanceCount=$.meshPerAttribute*$.count)}else for(let te=0;te<G.locationSize;te++)m(G.location+te);t.bindBuffer(t.ARRAY_BUFFER,rt);for(let te=0;te<G.locationSize;te++)M(G.location+te,ve/G.locationSize,ze,J,ve*nt,ve/G.locationSize*te*nt,Z)}}else if(D!==void 0){let J=D[H];if(J!==void 0)switch(J.length){case 2:t.vertexAttrib2fv(G.location,J);break;case 3:t.vertexAttrib3fv(G.location,J);break;case 4:t.vertexAttrib4fv(G.location,J);break;default:t.vertexAttrib1fv(G.location,J)}}}}_()}function S(){T();for(let F in i){let O=i[F];for(let z in O){let L=O[z];for(let V in L){let N=L[V];for(let D in N)u(N[D].object),delete N[D];delete L[V]}}delete i[F]}}function w(F){if(i[F.id]===void 0)return;let O=i[F.id];for(let z in O){let L=O[z];for(let V in L){let N=L[V];for(let D in N)u(N[D].object),delete N[D];delete L[V]}}delete i[F.id]}function E(F){for(let O in i){let z=i[O];for(let L in z){let V=z[L];if(V[F.id]===void 0)continue;let N=V[F.id];for(let D in N)u(N[D].object),delete N[D];delete V[F.id]}}}function y(F){for(let O in i){let z=i[O],L=F.isInstancedMesh===!0?F.id:0,V=z[L];if(V!==void 0){for(let N in V){let D=V[N];for(let H in D)u(D[H].object),delete D[H];delete V[N]}delete z[L],Object.keys(z).length===0&&delete i[O]}}}function T(){R(),o=!0,s!==r&&(s=r,c(s.object))}function R(){r.geometry=null,r.program=null,r.wireframe=!1}return{setup:a,reset:T,resetDefaultState:R,dispose:S,releaseStatesOfGeometry:w,releaseStatesOfObject:y,releaseStatesOfProgram:E,initAttributes:x,enableAttribute:m,disableUnusedAttributes:_}}function PR(t,e,n){let i;function r(l){i=l}function s(l,c){t.drawArrays(i,l,c),n.update(c,i,1)}function o(l,c,u){u!==0&&(t.drawArraysInstanced(i,l,c,u),n.update(c,i,u))}function a(l,c,u){if(u===0)return;e.get("WEBGL_multi_draw").multiDrawArraysWEBGL(i,l,0,c,0,u);let h=0;for(let d=0;d<u;d++)h+=c[d];n.update(h,i,1)}this.setMode=r,this.render=s,this.renderInstances=o,this.renderMultiDraw=a}function IR(t,e,n,i){let r;function s(){if(r!==void 0)return r;if(e.has("EXT_texture_filter_anisotropic")===!0){let E=e.get("EXT_texture_filter_anisotropic");r=t.getParameter(E.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else r=0;return r}function o(E){return!(E!==ri&&i.convert(E)!==t.getParameter(t.IMPLEMENTATION_COLOR_READ_FORMAT))}function a(E){let y=E===gi&&(e.has("EXT_color_buffer_half_float")||e.has("EXT_color_buffer_float"));return!(E!==er&&E!==xr&&!y&&i.convert(E)!==t.getParameter(t.IMPLEMENTATION_COLOR_READ_TYPE))}function l(E){if(E==="highp"){if(t.getShaderPrecisionFormat(t.VERTEX_SHADER,t.HIGH_FLOAT).precision>0&&t.getShaderPrecisionFormat(t.FRAGMENT_SHADER,t.HIGH_FLOAT).precision>0)return"highp";E="mediump"}return E==="mediump"&&t.getShaderPrecisionFormat(t.VERTEX_SHADER,t.MEDIUM_FLOAT).precision>0&&t.getShaderPrecisionFormat(t.FRAGMENT_SHADER,t.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let c=n.precision!==void 0?n.precision:"highp",u=l(c);u!==c&&(dt("WebGLRenderer:",c,"not supported, using",u,"instead."),c=u);let f=n.logarithmicDepthBuffer===!0,h=n.reversedDepthBuffer===!0&&e.has("EXT_clip_control");n.reversedDepthBuffer===!0&&h===!1&&dt("WebGLRenderer: Unable to use reversed depth buffer due to missing EXT_clip_control extension. Fallback to default depth buffer.");let d=t.getParameter(t.MAX_TEXTURE_IMAGE_UNITS),g=t.getParameter(t.MAX_VERTEX_TEXTURE_IMAGE_UNITS),x=t.getParameter(t.MAX_TEXTURE_SIZE),m=t.getParameter(t.MAX_CUBE_MAP_TEXTURE_SIZE),p=t.getParameter(t.MAX_VERTEX_ATTRIBS),_=t.getParameter(t.MAX_VERTEX_UNIFORM_VECTORS),M=t.getParameter(t.MAX_VARYING_VECTORS),v=t.getParameter(t.MAX_FRAGMENT_UNIFORM_VECTORS),S=t.getParameter(t.MAX_SAMPLES),w=t.getParameter(t.SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:s,getMaxPrecision:l,textureFormatReadable:o,textureTypeReadable:a,precision:c,logarithmicDepthBuffer:f,reversedDepthBuffer:h,maxTextures:d,maxVertexTextures:g,maxTextureSize:x,maxCubemapSize:m,maxAttributes:p,maxVertexUniforms:_,maxVaryings:M,maxFragmentUniforms:v,maxSamples:S,samples:w}}function LR(t){let e=this,n=null,i=0,r=!1,s=!1,o=new Dr,a=new _t,l={value:null,needsUpdate:!1};this.uniform=l,this.numPlanes=0,this.numIntersection=0,this.init=function(f,h){let d=f.length!==0||h||i!==0||r;return r=h,i=f.length,d},this.beginShadows=function(){s=!0,u(null)},this.endShadows=function(){s=!1},this.setGlobalState=function(f,h){n=u(f,h,0)},this.setState=function(f,h,d){let g=f.clippingPlanes,x=f.clipIntersection,m=f.clipShadows,p=t.get(f);if(!r||g===null||g.length===0||s&&!m)s?u(null):c();else{let _=s?0:i,M=_*4,v=p.clippingState||null;l.value=v,v=u(g,h,M,d);for(let S=0;S!==M;++S)v[S]=n[S];p.clippingState=v,this.numIntersection=x?this.numPlanes:0,this.numPlanes+=_}};function c(){l.value!==n&&(l.value=n,l.needsUpdate=i>0),e.numPlanes=i,e.numIntersection=0}function u(f,h,d,g){let x=f!==null?f.length:0,m=null;if(x!==0){if(m=l.value,g!==!0||m===null){let p=d+x*4,_=h.matrixWorldInverse;a.getNormalMatrix(_),(m===null||m.length<p)&&(m=new Float32Array(p));for(let M=0,v=d;M!==x;++M,v+=4)o.copy(f[M]).applyMatrix4(_,a),o.normal.toArray(m,v),m[v+3]=o.constant}l.value=m,l.needsUpdate=!0}return e.numPlanes=x,e.numIntersection=0,m}}var Tl=4,DR=6,NR=20,OR=256,hu=new Ds,Q_=new Pt,hg=null,fg=0,dg=0,pg=!1,FR=new P,ca=new P,jd=class{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._sizeLods=[],this._lodMeshes=[],this._backgroundBox=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._blurMaterial=null,this._ggxMaterial=null}fromScene(e,n=0,i=.1,r=100,s={}){let{size:o=256,position:a=FR}=s;hg=this._renderer.getRenderTarget(),fg=this._renderer.getActiveCubeFace(),dg=this._renderer.getActiveMipmapLevel(),pg=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(o);let l=this._allocateTargets();return l.depthBuffer=!0,this._sceneToCubeUV(e,i,r,l,a),n>0&&this._blur(l,0,0,n),this._applyPMREM(l),this._cleanup(l),l}fromEquirectangular(e,n=null){return this._fromTexture(e,n)}fromCubemap(e,n=null){return this._fromTexture(e,n)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=nb(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=tb(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose(),this._backgroundBox!==null&&(this._backgroundBox.geometry.dispose(),this._backgroundBox.material.dispose())}_setSize(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._ggxMaterial!==null&&this._ggxMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let e=0;e<this._lodMeshes.length;e++)this._lodMeshes[e].geometry.dispose()}_cleanup(e){this._renderer.setRenderTarget(hg,fg,dg),this._renderer.xr.enabled=pg,e.scissorTest=!1,Al(e,0,0,e.width,e.height)}_fromTexture(e,n){e.mapping===vo||e.mapping===aa?this._setSize(e.image.length===0?16:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4),hg=this._renderer.getRenderTarget(),fg=this._renderer.getActiveCubeFace(),dg=this._renderer.getActiveMipmapLevel(),pg=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;let i=n||this._allocateTargets();return this._textureToCubeUV(e,i),this._applyPMREM(i),this._cleanup(i),i}_allocateTargets(){let e=3*Math.max(this._cubeSize,112),n=4*this._cubeSize,i={magFilter:Lt,minFilter:Lt,generateMipmaps:!1,type:gi,format:ri,colorSpace:ia,depthBuffer:!1},r=eb(e,n,i);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==e||this._pingPongRenderTarget.height!==n){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=eb(e,n,i);let{_lodMax:s}=this;({lodMeshes:this._lodMeshes,sizeLods:this._sizeLods}=UR(s)),this._blurMaterial=BR(s,e,n),this._ggxMaterial=kR(s,e,n)}return r}_compileMaterial(e){let n=new Xt(new Fn,e);this._renderer.compile(n,hu)}_sceneToCubeUV(e,n,i,r,s){let l=new pi(90,1,n,i),c=[1,-1,1,1,1,1],u=[1,1,1,-1,-1,-1],f=this._renderer,h=f.autoClear,d=f.toneMapping;f.getClearColor(Q_),f.toneMapping=Qi,f.autoClear=!1,f.state.buffers.depth.getReversed()&&(f.setRenderTarget(r),f.clearDepth(),f.setRenderTarget(null)),this._backgroundBox===null&&(this._backgroundBox=new Xt(new yl,new Gc({name:"PMREM.Background",side:Ii,depthWrite:!1,depthTest:!1})));let x=this._backgroundBox,m=x.material,p=!1,_=e.background;_?_.isColor&&(m.color.copy(_),e.background=null,p=!0):(m.color.copy(Q_),p=!0);for(let M=0;M<6;M++){let v=M%3;v===0?(l.up.set(0,c[M],0),l.position.set(s.x,s.y,s.z),l.lookAt(s.x+u[M],s.y,s.z)):v===1?(l.up.set(0,0,c[M]),l.position.set(s.x,s.y,s.z),l.lookAt(s.x,s.y+u[M],s.z)):(l.up.set(0,c[M],0),l.position.set(s.x,s.y,s.z),l.lookAt(s.x,s.y,s.z+u[M]));let S=this._cubeSize;Al(r,v*S,M>2?S:0,S,S),f.setRenderTarget(r),p&&f.render(x,l),f.render(e,l)}f.toneMapping=d,f.autoClear=h,e.background=_}_textureToCubeUV(e,n){let i=this._renderer,r=e.mapping===vo||e.mapping===aa;r?(this._cubemapMaterial===null&&(this._cubemapMaterial=nb()),this._cubemapMaterial.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=tb());let s=r?this._cubemapMaterial:this._equirectMaterial,o=this._lodMeshes[0];o.material=s;let a=s.uniforms;a.envMap.value=e;let l=this._cubeSize;Al(n,0,0,3*l,2*l),i.setRenderTarget(n),i.render(o,hu)}_applyPMREM(e){let n=this._renderer,i=n.autoClear;n.autoClear=!1;let r=this._lodMeshes.length;for(let s=1;s<r;s++)this._applyGGXFilter(e,s-1,s);n.autoClear=i}_applyGGXFilter(e,n,i){let r=this._renderer,s=this._pingPongRenderTarget,o=this._ggxMaterial,a=this._lodMeshes[i];a.material=o;let l=o.uniforms,c=i/(this._lodMeshes.length-1),u=n/(this._lodMeshes.length-1),f=Math.sqrt(c*c-u*u),h=c*1.25,d=f*h,{_lodMax:g}=this,x=this._sizeLods[i],m=3*x*(i>g-Tl?i-g+Tl:0),p=4*(this._cubeSize-x);l.envMap.value=e.texture,l.roughness.value=d,l.mipInt.value=g-n,Al(s,m,p,3*x,2*x),r.setRenderTarget(s),r.render(a,hu),l.envMap.value=s.texture,l.roughness.value=0,l.mipInt.value=g-i,Al(e,m,p,3*x,2*x),r.setRenderTarget(e),r.render(a,hu)}_blur(e,n,i,r){let s=this._pingPongRenderTarget,o=Math.min(r,Math.PI)/Math.SQRT2;this._blurPass(e,s,n,i,o),this._blurPass(s,e,i,i,o)}_blurPass(e,n,i,r,s){let o=this._renderer,a=this._blurMaterial,l=this._lodMeshes[r];l.material=a;let c=a.uniforms;c.envMap.value=e.texture,c.sigma.value=s,c.mipInt.value=this._lodMax-i;let u=this._sizeLods[r],f=3*u*(r>this._lodMax-Tl?r-this._lodMax+Tl:0),h=4*(this._cubeSize-u);Al(n,f,h,3*u,2*u),o.setRenderTarget(n),o.render(l,hu)}};function UR(t){let e=[],n=[],i=t,r=t-Tl+1+DR;for(let s=0;s<r;s++){let o=Math.pow(2,i);e.push(o);let a=1/(o-2),l=-a,c=1+a,u=[l,l,c,l,c,c,l,l,c,c,l,c],f=6,h=6,d=3,g=new Float32Array(d*h*f),x=new Float32Array(d*h*f);for(let p=0;p<f;p++){let _=p%3*2/3-1,M=p>2?0:-1,v=[_,M,0,_+2/3,M,0,_+2/3,M+1,0,_,M,0,_+2/3,M+1,0,_,M+1,0];g.set(v,d*h*p);for(let S=0;S<h;S++){let w=u[S*2]*2-1,E=u[S*2+1]*2-1;p===0?ca.set(1,E,w):p===1?ca.set(-w,1,-E):p===2?ca.set(-w,E,1):p===3?ca.set(-1,E,-w):p===4?ca.set(-w,-1,E):ca.set(w,E,-1),ca.toArray(x,(p*h+S)*d)}}let m=new Fn;m.setAttribute("position",new hn(g,d)),m.setAttribute("outputDirection",new hn(x,d)),n.push(new Xt(m,null)),i>Tl&&i--}return{lodMeshes:n,sizeLods:e}}function eb(t,e,n){let i=new Hn(t,e,n);return i.texture.mapping=iu,i.texture.name="PMREM.cubeUv",i.scissorTest=!0,i}function Al(t,e,n,i,r){t.viewport.set(e,n,i,r),t.scissor.set(e,n,i,r)}function kR(t,e,n){return new Ft({name:"PMREMGGXConvolution",defines:{GGX_SAMPLES:OR,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/n,CUBEUV_MAX_MIP:`${t}.0`},uniforms:{envMap:{value:null},roughness:{value:0},mipInt:{value:0}},vertexShader:Jd(),fragmentShader:`

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
		`,blending:Bi,depthTest:!1,depthWrite:!1})}function BR(t,e,n){return new Ft({name:"SphericalGaussianBlur",defines:{SAMPLES:NR,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/n,CUBEUV_MAX_MIP:`${t}.0`},uniforms:{envMap:{value:null},sigma:{value:0},mipInt:{value:0}},vertexShader:Jd(),fragmentShader:`

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
		`,blending:Bi,depthTest:!1,depthWrite:!1})}function tb(){return new Ft({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:Jd(),fragmentShader:`

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
		`,blending:Bi,depthTest:!1,depthWrite:!1})}function nb(){return new Ft({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:Jd(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:Bi,depthTest:!1,depthWrite:!1})}function Jd(){return`

		precision mediump float;
		precision mediump int;

		attribute vec3 outputDirection;

		varying vec3 vOutputDirection;

		void main() {

			vOutputDirection = outputDirection;
			gl_Position = vec4( position, 1.0 );

		}
	`}var Zd=class extends Hn{constructor(e=1,n={}){super(e,e,n),this.isWebGLCubeRenderTarget=!0;let i={width:e,height:e,depth:1},r=[i,i,i,i,i,i];this.texture=new qc(r),this._setTextureOptions(n),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(e,n){this.texture.type=n.type,this.texture.colorSpace=n.colorSpace,this.texture.generateMipmaps=n.generateMipmaps,this.texture.minFilter=n.minFilter,this.texture.magFilter=n.magFilter;let i={uniforms:{tEquirect:{value:null}},vertexShader:`

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
			`},r=new yl(5,5,5),s=new Ft({name:"CubemapFromEquirect",uniforms:la(i.uniforms),vertexShader:i.vertexShader,fragmentShader:i.fragmentShader,side:Ii,blending:Bi});s.uniforms.tEquirect.value=n;let o=new Xt(r,s),a=n.minFilter;return n.minFilter===yo&&(n.minFilter=Lt),new td(1,10,this).update(e,o),n.minFilter=a,o.geometry.dispose(),o.material.dispose(),this}clear(e,n=!0,i=!0,r=!0){let s=e.getRenderTarget();for(let o=0;o<6;o++)e.setRenderTarget(this,o),e.clear(n,i,r);e.setRenderTarget(s)}};function zR(t){let e=new WeakMap,n=new WeakMap,i=null;function r(h,d=!1){return h==null?null:d?o(h):s(h)}function s(h){if(h&&h.isTexture){let d=h.mapping;if(d===sd||d===od)if(e.has(h)){let g=e.get(h).texture;return a(g,h.mapping)}else{let g=h.image;if(g&&g.height>0){let x=new Zd(g.height);return x.fromEquirectangularTexture(t,h),e.set(h,x),h.addEventListener("dispose",c),a(x.texture,h.mapping)}else return null}}return h}function o(h){if(h&&h.isTexture){let d=h.mapping,g=d===sd||d===od,x=d===vo||d===aa;if(g||x){let m=n.get(h),p=m!==void 0?m.texture.pmremVersion:0;if(h.isRenderTargetTexture&&h.pmremVersion!==p)return i===null&&(i=new jd(t)),m=g?i.fromEquirectangular(h,m):i.fromCubemap(h,m),m.texture.pmremVersion=h.pmremVersion,n.set(h,m),m.texture;if(m!==void 0)return m.texture;{let _=h.image;return g&&_&&_.height>0||x&&_&&l(_)?(i===null&&(i=new jd(t)),m=g?i.fromEquirectangular(h):i.fromCubemap(h),m.texture.pmremVersion=h.pmremVersion,n.set(h,m),h.addEventListener("dispose",u),m.texture):null}}}return h}function a(h,d){return d===sd?h.mapping=vo:d===od&&(h.mapping=aa),h}function l(h){let d=0,g=6;for(let x=0;x<g;x++)h[x]!==void 0&&d++;return d===g}function c(h){let d=h.target;d.removeEventListener("dispose",c);let g=e.get(d);g!==void 0&&(e.delete(d),g.dispose())}function u(h){let d=h.target;d.removeEventListener("dispose",u);let g=n.get(d);g!==void 0&&(n.delete(d),g.dispose())}function f(){e=new WeakMap,n=new WeakMap,i!==null&&(i.dispose(),i=null)}return{get:r,dispose:f}}function VR(t){let e={};function n(i){if(e[i]!==void 0)return e[i];let r=t.getExtension(i);return e[i]=r,r}return{has:function(i){return n(i)!==null},init:function(){n("EXT_color_buffer_float"),n("WEBGL_clip_cull_distance"),n("OES_texture_float_linear"),n("EXT_color_buffer_half_float"),n("WEBGL_multisampled_render_to_texture"),n("WEBGL_render_shared_exponent")},get:function(i){let r=n(i);return r===null&&na("WebGLRenderer: "+i+" extension not supported."),r}}}function GR(t,e,n,i){let r={},s=new WeakMap;function o(f){let h=f.target;h.index!==null&&e.remove(h.index);for(let g in h.attributes)e.remove(h.attributes[g]);h.removeEventListener("dispose",o),delete r[h.id];let d=s.get(h);d&&(e.remove(d),s.delete(h)),i.releaseStatesOfGeometry(h),h.isInstancedBufferGeometry===!0&&delete h._maxInstanceCount,n.memory.geometries--}function a(f,h){return r[h.id]===!0||(h.addEventListener("dispose",o),r[h.id]=!0,n.memory.geometries++),h}function l(f){let h=f.attributes;for(let d in h)e.update(h[d],t.ARRAY_BUFFER)}function c(f){let h=[],d=f.index,g=f.attributes.position,x=0;if(g===void 0)return;if(d!==null){let _=d.array;x=d.version;for(let M=0,v=_.length;M<v;M+=3){let S=_[M+0],w=_[M+1],E=_[M+2];h.push(S,w,w,E,E,S)}}else{let _=g.array;x=g.version;for(let M=0,v=_.length/3-1;M<v;M+=3){let S=M+0,w=M+1,E=M+2;h.push(S,w,w,E,E,S)}}let m=new(g.count>=65535?Vc:zc)(h,1);m.version=x;let p=s.get(f);p&&e.remove(p),s.set(f,m)}function u(f){let h=s.get(f);if(h){let d=f.index;d!==null&&h.version<d.version&&c(f)}else c(f);return s.get(f)}return{get:a,update:l,getWireframeAttribute:u}}function HR(t,e,n){let i;function r(f){i=f}let s,o;function a(f){s=f.type,o=f.bytesPerElement}function l(f,h){t.drawElements(i,h,s,f*o),n.update(h,i,1)}function c(f,h,d){d!==0&&(t.drawElementsInstanced(i,h,s,f*o,d),n.update(h,i,d))}function u(f,h,d){if(d===0)return;e.get("WEBGL_multi_draw").multiDrawElementsWEBGL(i,h,0,s,f,0,d);let x=0;for(let m=0;m<d;m++)x+=h[m];n.update(x,i,1)}this.setMode=r,this.setIndex=a,this.render=l,this.renderInstances=c,this.renderMultiDraw=u}function WR(t){let e={geometries:0,textures:0},n={frame:0,calls:0,triangles:0,points:0,lines:0};function i(s,o,a){switch(n.calls++,o){case t.TRIANGLES:n.triangles+=a*(s/3);break;case t.LINES:n.lines+=a*(s/2);break;case t.LINE_STRIP:n.lines+=a*(s-1);break;case t.LINE_LOOP:n.lines+=a*s;break;case t.POINTS:n.points+=a*s;break;default:gt("WebGLInfo: Unknown draw mode:",o);break}}function r(){n.calls=0,n.triangles=0,n.points=0,n.lines=0}return{memory:e,render:n,programs:null,autoReset:!0,reset:r,update:i}}function $R(t,e,n){let i=new WeakMap,r=new Vt;function s(o,a,l){let c=o.morphTargetInfluences,u=a.morphAttributes.position||a.morphAttributes.normal||a.morphAttributes.color,f=u!==void 0?u.length:0,h=i.get(a);if(h===void 0||h.count!==f){let T=function(){E.dispose(),i.delete(a),a.removeEventListener("dispose",T)};h!==void 0&&h.texture.dispose();let d=a.morphAttributes.position!==void 0,g=a.morphAttributes.normal!==void 0,x=a.morphAttributes.color!==void 0,m=a.morphAttributes.position||[],p=a.morphAttributes.normal||[],_=a.morphAttributes.color||[],M=0;d===!0&&(M=1),g===!0&&(M=2),x===!0&&(M=3);let v=a.attributes.position.count*M,S=1;v>e.maxTextureSize&&(S=Math.ceil(v/e.maxTextureSize),v=e.maxTextureSize);let w=new Float32Array(v*S*4*f),E=new Bc(w,v,S,f);E.type=xr,E.needsUpdate=!0;let y=M*4;for(let R=0;R<f;R++){let F=m[R],O=p[R],z=_[R],L=v*S*4*R;for(let V=0;V<F.count;V++){let N=V*y;d===!0&&(r.fromBufferAttribute(F,V),w[L+N+0]=r.x,w[L+N+1]=r.y,w[L+N+2]=r.z,w[L+N+3]=0),g===!0&&(r.fromBufferAttribute(O,V),w[L+N+4]=r.x,w[L+N+5]=r.y,w[L+N+6]=r.z,w[L+N+7]=0),x===!0&&(r.fromBufferAttribute(z,V),w[L+N+8]=r.x,w[L+N+9]=r.y,w[L+N+10]=r.z,w[L+N+11]=z.itemSize===4?r.w:1)}}h={count:f,texture:E,size:new pt(v,S)},i.set(a,h),a.addEventListener("dispose",T)}if(o.isInstancedMesh===!0&&o.morphTexture!==null)l.getUniforms().setValue(t,"morphTexture",o.morphTexture,n);else{let d=0;for(let x=0;x<c.length;x++)d+=c[x];let g=a.morphTargetsRelative?1:1-d;l.getUniforms().setValue(t,"morphTargetBaseInfluence",g),l.getUniforms().setValue(t,"morphTargetInfluences",c)}l.getUniforms().setValue(t,"morphTargetsTexture",h.texture,n),l.getUniforms().setValue(t,"morphTargetsTextureSize",h.size)}return{update:s}}function XR(t,e,n,i,r){let s=new WeakMap;function o(c){let u=r.render.frame,f=c.geometry,h=e.get(c,f);if(s.get(h)!==u&&(e.update(h),s.set(h,u)),c.isInstancedMesh&&(c.hasEventListener("dispose",l)===!1&&c.addEventListener("dispose",l),s.get(c)!==u&&(n.update(c.instanceMatrix,t.ARRAY_BUFFER),c.instanceColor!==null&&n.update(c.instanceColor,t.ARRAY_BUFFER),s.set(c,u))),c.isSkinnedMesh){let d=c.skeleton;s.get(d)!==u&&(d.update(),s.set(d,u))}return h}function a(){s=new WeakMap}function l(c){let u=c.target;u.removeEventListener("dispose",l),i.releaseStatesOfObject(u),n.remove(u.instanceMatrix),u.instanceColor!==null&&n.remove(u.instanceColor)}return{update:o,dispose:a}}var YR={[B0]:"LINEAR_TONE_MAPPING",[z0]:"REINHARD_TONE_MAPPING",[V0]:"CINEON_TONE_MAPPING",[G0]:"ACES_FILMIC_TONE_MAPPING",[W0]:"AGX_TONE_MAPPING",[$0]:"NEUTRAL_TONE_MAPPING",[H0]:"CUSTOM_TONE_MAPPING"};function qR(t,e,n,i,r,s){let o=new Hn(e,n,{type:t,depthBuffer:r,stencilBuffer:s,samples:i?4:0,storeMultisampledDepthBuffer:!1,storeMultisampledStencilBuffer:!1,resolveDepthBuffer:!1,resolveStencilBuffer:!1}),a=null,l=null,c=new Fn;c.setAttribute("position",new rn([-1,3,0,-1,-1,0,3,-1,0],3)),c.setAttribute("uv",new rn([0,2,0,0,2,0],2));let u=new Gf({uniforms:{tDiffuse:{value:null}},vertexShader:`
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
			}`,depthTest:!1,depthWrite:!1}),f=new Xt(c,u),h=new Ds(-1,1,1,-1,0,1),d=null,g=null,x=!1,m,p=null,_=[],M=!1;this.setSize=function(v,S){o.setSize(v,S),a!==null&&a.setSize(v,S),l!==null&&l.setSize(v,S);for(let w=0;w<_.length;w++){let E=_[w];E.setSize&&E.setSize(v,S)}},this.setEffects=function(v){_=v,M=_.length>0&&_[0].isRenderPass===!0;let S=o.width,w=o.height;_.length>0&&a===null&&(a=new Hn(S,w,{type:gi,depthBuffer:!1,stencilBuffer:!1}),l=new Hn(S,w,{type:gi,depthBuffer:!1,stencilBuffer:!1}));for(let E=0;E<_.length;E++){let y=_[E];y.setSize&&y.setSize(S,w)}},this.begin=function(v,S){if(x||v.toneMapping===Qi&&_.length===0)return!1;if(p=S,S!==null){let w=S.width,E=S.height;(o.width!==w||o.height!==E)&&this.setSize(w,E)}return M===!1&&v.setRenderTarget(o),m=v.toneMapping,v.toneMapping=Qi,!0},this.hasRenderPass=function(){return M},this.end=function(v,S){v.toneMapping=m,x=!0;let w=o,E=a;for(let y=0;y<_.length;y++){let T=_[y];T.enabled!==!1&&(T.render(v,E,w,S),T.needsSwap!==!1&&(w=E,E=E===a?l:a))}if(d!==v.outputColorSpace||g!==v.toneMapping){d=v.outputColorSpace,g=v.toneMapping,u.defines={},Et.getTransfer(d)===Kt&&(u.defines.SRGB_TRANSFER="");let y=YR[g];y&&(u.defines[y]=""),u.needsUpdate=!0}u.uniforms.tDiffuse.value=w.texture,v.setRenderTarget(p),v.render(f,h),p=null,x=!1},this.isCompositing=function(){return x},this.dispose=function(){o.dispose(),a!==null&&a.dispose(),l!==null&&l.dispose(),c.dispose(),u.dispose()}}var Mb=new Ci,xg=new po(1,1),Sb=new Bc,wb=new Nf,Ab=new qc,ib=[],rb=[],sb=new Float32Array(16),ob=new Float32Array(9),ab=new Float32Array(4);function Rl(t,e,n){let i=t[0];if(i<=0||i>0)return t;let r=e*n,s=ib[r];if(s===void 0&&(s=new Float32Array(r),ib[r]=s),e!==0){i.toArray(s,0);for(let o=1,a=0;o!==e;++o)a+=n,t[o].toArray(s,a)}return s}function jn(t,e){if(t.length!==e.length)return!1;for(let n=0,i=t.length;n<i;n++)if(t[n]!==e[n])return!1;return!0}function Zn(t,e){for(let n=0,i=e.length;n<i;n++)t[n]=e[n]}function Qd(t,e){let n=rb[e];n===void 0&&(n=new Int32Array(e),rb[e]=n);for(let i=0;i!==e;++i)n[i]=t.allocateTextureUnit();return n}function jR(t,e){let n=this.cache;n[0]!==e&&(t.uniform1f(this.addr,e),n[0]=e)}function ZR(t,e){let n=this.cache;if(e.x!==void 0)(n[0]!==e.x||n[1]!==e.y)&&(t.uniform2f(this.addr,e.x,e.y),n[0]=e.x,n[1]=e.y);else{if(jn(n,e))return;t.uniform2fv(this.addr,e),Zn(n,e)}}function KR(t,e){let n=this.cache;if(e.x!==void 0)(n[0]!==e.x||n[1]!==e.y||n[2]!==e.z)&&(t.uniform3f(this.addr,e.x,e.y,e.z),n[0]=e.x,n[1]=e.y,n[2]=e.z);else if(e.r!==void 0)(n[0]!==e.r||n[1]!==e.g||n[2]!==e.b)&&(t.uniform3f(this.addr,e.r,e.g,e.b),n[0]=e.r,n[1]=e.g,n[2]=e.b);else{if(jn(n,e))return;t.uniform3fv(this.addr,e),Zn(n,e)}}function JR(t,e){let n=this.cache;if(e.x!==void 0)(n[0]!==e.x||n[1]!==e.y||n[2]!==e.z||n[3]!==e.w)&&(t.uniform4f(this.addr,e.x,e.y,e.z,e.w),n[0]=e.x,n[1]=e.y,n[2]=e.z,n[3]=e.w);else{if(jn(n,e))return;t.uniform4fv(this.addr,e),Zn(n,e)}}function QR(t,e){let n=this.cache,i=e.elements;if(i===void 0){if(jn(n,e))return;t.uniformMatrix2fv(this.addr,!1,e),Zn(n,e)}else{if(jn(n,i))return;ab.set(i),t.uniformMatrix2fv(this.addr,!1,ab),Zn(n,i)}}function eC(t,e){let n=this.cache,i=e.elements;if(i===void 0){if(jn(n,e))return;t.uniformMatrix3fv(this.addr,!1,e),Zn(n,e)}else{if(jn(n,i))return;ob.set(i),t.uniformMatrix3fv(this.addr,!1,ob),Zn(n,i)}}function tC(t,e){let n=this.cache,i=e.elements;if(i===void 0){if(jn(n,e))return;t.uniformMatrix4fv(this.addr,!1,e),Zn(n,e)}else{if(jn(n,i))return;sb.set(i),t.uniformMatrix4fv(this.addr,!1,sb),Zn(n,i)}}function nC(t,e){let n=this.cache;n[0]!==e&&(t.uniform1i(this.addr,e),n[0]=e)}function iC(t,e){let n=this.cache;if(e.x!==void 0)(n[0]!==e.x||n[1]!==e.y)&&(t.uniform2i(this.addr,e.x,e.y),n[0]=e.x,n[1]=e.y);else{if(jn(n,e))return;t.uniform2iv(this.addr,e),Zn(n,e)}}function rC(t,e){let n=this.cache;if(e.x!==void 0)(n[0]!==e.x||n[1]!==e.y||n[2]!==e.z)&&(t.uniform3i(this.addr,e.x,e.y,e.z),n[0]=e.x,n[1]=e.y,n[2]=e.z);else{if(jn(n,e))return;t.uniform3iv(this.addr,e),Zn(n,e)}}function sC(t,e){let n=this.cache;if(e.x!==void 0)(n[0]!==e.x||n[1]!==e.y||n[2]!==e.z||n[3]!==e.w)&&(t.uniform4i(this.addr,e.x,e.y,e.z,e.w),n[0]=e.x,n[1]=e.y,n[2]=e.z,n[3]=e.w);else{if(jn(n,e))return;t.uniform4iv(this.addr,e),Zn(n,e)}}function oC(t,e){let n=this.cache;n[0]!==e&&(t.uniform1ui(this.addr,e),n[0]=e)}function aC(t,e){let n=this.cache;if(e.x!==void 0)(n[0]!==e.x||n[1]!==e.y)&&(t.uniform2ui(this.addr,e.x,e.y),n[0]=e.x,n[1]=e.y);else{if(jn(n,e))return;t.uniform2uiv(this.addr,e),Zn(n,e)}}function lC(t,e){let n=this.cache;if(e.x!==void 0)(n[0]!==e.x||n[1]!==e.y||n[2]!==e.z)&&(t.uniform3ui(this.addr,e.x,e.y,e.z),n[0]=e.x,n[1]=e.y,n[2]=e.z);else{if(jn(n,e))return;t.uniform3uiv(this.addr,e),Zn(n,e)}}function cC(t,e){let n=this.cache;if(e.x!==void 0)(n[0]!==e.x||n[1]!==e.y||n[2]!==e.z||n[3]!==e.w)&&(t.uniform4ui(this.addr,e.x,e.y,e.z,e.w),n[0]=e.x,n[1]=e.y,n[2]=e.z,n[3]=e.w);else{if(jn(n,e))return;t.uniform4uiv(this.addr,e),Zn(n,e)}}function uC(t,e,n){let i=this.cache,r=n.allocateTextureUnit();i[0]!==r&&(t.uniform1i(this.addr,r),i[0]=r);let s;this.type===t.SAMPLER_2D_SHADOW?(xg.compareFunction=n.isReversedDepthBuffer()?Xd:$d,s=xg):s=Mb,n.setTexture2D(e||s,r)}function hC(t,e,n){let i=this.cache,r=n.allocateTextureUnit();i[0]!==r&&(t.uniform1i(this.addr,r),i[0]=r),n.setTexture3D(e||wb,r)}function fC(t,e,n){let i=this.cache,r=n.allocateTextureUnit();i[0]!==r&&(t.uniform1i(this.addr,r),i[0]=r),n.setTextureCube(e||Ab,r)}function dC(t,e,n){let i=this.cache,r=n.allocateTextureUnit();i[0]!==r&&(t.uniform1i(this.addr,r),i[0]=r),n.setTexture2DArray(e||Sb,r)}function pC(t){switch(t){case 5126:return jR;case 35664:return ZR;case 35665:return KR;case 35666:return JR;case 35674:return QR;case 35675:return eC;case 35676:return tC;case 5124:case 35670:return nC;case 35667:case 35671:return iC;case 35668:case 35672:return rC;case 35669:case 35673:return sC;case 5125:return oC;case 36294:return aC;case 36295:return lC;case 36296:return cC;case 35678:case 36198:case 36298:case 36306:case 35682:return uC;case 35679:case 36299:case 36307:return hC;case 35680:case 36300:case 36308:case 36293:return fC;case 36289:case 36303:case 36311:case 36292:return dC}}function mC(t,e){t.uniform1fv(this.addr,e)}function gC(t,e){let n=Rl(e,this.size,2);t.uniform2fv(this.addr,n)}function xC(t,e){let n=Rl(e,this.size,3);t.uniform3fv(this.addr,n)}function vC(t,e){let n=Rl(e,this.size,4);t.uniform4fv(this.addr,n)}function yC(t,e){let n=Rl(e,this.size,4);t.uniformMatrix2fv(this.addr,!1,n)}function _C(t,e){let n=Rl(e,this.size,9);t.uniformMatrix3fv(this.addr,!1,n)}function bC(t,e){let n=Rl(e,this.size,16);t.uniformMatrix4fv(this.addr,!1,n)}function MC(t,e){t.uniform1iv(this.addr,e)}function SC(t,e){t.uniform2iv(this.addr,e)}function wC(t,e){t.uniform3iv(this.addr,e)}function AC(t,e){t.uniform4iv(this.addr,e)}function TC(t,e){t.uniform1uiv(this.addr,e)}function EC(t,e){t.uniform2uiv(this.addr,e)}function RC(t,e){t.uniform3uiv(this.addr,e)}function CC(t,e){t.uniform4uiv(this.addr,e)}function PC(t,e,n){let i=this.cache,r=e.length,s=Qd(n,r);jn(i,s)||(t.uniform1iv(this.addr,s),Zn(i,s));let o;this.type===t.SAMPLER_2D_SHADOW?o=xg:o=Mb;for(let a=0;a!==r;++a)n.setTexture2D(e[a]||o,s[a])}function IC(t,e,n){let i=this.cache,r=e.length,s=Qd(n,r);jn(i,s)||(t.uniform1iv(this.addr,s),Zn(i,s));for(let o=0;o!==r;++o)n.setTexture3D(e[o]||wb,s[o])}function LC(t,e,n){let i=this.cache,r=e.length,s=Qd(n,r);jn(i,s)||(t.uniform1iv(this.addr,s),Zn(i,s));for(let o=0;o!==r;++o)n.setTextureCube(e[o]||Ab,s[o])}function DC(t,e,n){let i=this.cache,r=e.length,s=Qd(n,r);jn(i,s)||(t.uniform1iv(this.addr,s),Zn(i,s));for(let o=0;o!==r;++o)n.setTexture2DArray(e[o]||Sb,s[o])}function NC(t){switch(t){case 5126:return mC;case 35664:return gC;case 35665:return xC;case 35666:return vC;case 35674:return yC;case 35675:return _C;case 35676:return bC;case 5124:case 35670:return MC;case 35667:case 35671:return SC;case 35668:case 35672:return wC;case 35669:case 35673:return AC;case 5125:return TC;case 36294:return EC;case 36295:return RC;case 36296:return CC;case 35678:case 36198:case 36298:case 36306:case 35682:return PC;case 35679:case 36299:case 36307:return IC;case 35680:case 36300:case 36308:case 36293:return LC;case 36289:case 36303:case 36311:case 36292:return DC}}var vg=class{constructor(e,n,i){this.id=e,this.addr=i,this.cache=[],this.type=n.type,this.setValue=pC(n.type)}},yg=class{constructor(e,n,i){this.id=e,this.addr=i,this.cache=[],this.type=n.type,this.size=n.size,this.setValue=NC(n.type)}},_g=class{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,n,i){let r=this.seq;for(let s=0,o=r.length;s!==o;++s){let a=r[s];a.setValue(e,n[a.id],i)}}},mg=/(\w+)(\])?(\[|\.)?/g;function lb(t,e){t.seq.push(e),t.map[e.id]=e}function OC(t,e,n){let i=t.name,r=i.length;for(mg.lastIndex=0;;){let s=mg.exec(i),o=mg.lastIndex,a=s[1],l=s[2]==="]",c=s[3];if(l&&(a=a|0),c===void 0||c==="["&&o+2===r){lb(n,c===void 0?new vg(a,t,e):new yg(a,t,e));break}else{let f=n.map[a];f===void 0&&(f=new _g(a),lb(n,f)),n=f}}}var El=class{constructor(e,n){this.seq=[],this.map={};let i=e.getProgramParameter(n,e.ACTIVE_UNIFORMS);for(let o=0;o<i;++o){let a=e.getActiveUniform(n,o),l=e.getUniformLocation(n,a.name);OC(a,l,this)}let r=[],s=[];for(let o of this.seq)o.type===e.SAMPLER_2D_SHADOW||o.type===e.SAMPLER_CUBE_SHADOW||o.type===e.SAMPLER_2D_ARRAY_SHADOW?r.push(o):s.push(o);r.length>0&&(this.seq=r.concat(s))}setValue(e,n,i,r){let s=this.map[n];s!==void 0&&s.setValue(e,i,r)}setOptional(e,n,i){let r=n[i];r!==void 0&&this.setValue(e,i,r)}static upload(e,n,i,r){for(let s=0,o=n.length;s!==o;++s){let a=n[s],l=i[a.id];l.needsUpdate!==!1&&a.setValue(e,l.value,r)}}static seqWithValue(e,n){let i=[];for(let r=0,s=e.length;r!==s;++r){let o=e[r];o.id in n&&i.push(o)}return i}};function cb(t,e,n){let i=t.createShader(e);return t.shaderSource(i,n),t.compileShader(i),i}var FC=37297,UC=0;function kC(t,e){let n=t.split(`
`),i=[],r=Math.max(e-6,0),s=Math.min(e+6,n.length);for(let o=r;o<s;o++){let a=o+1;i.push(`${a===e?">":" "} ${a}: ${n[o]}`)}return i.join(`
`)}var ub=new _t;function BC(t){Et._getMatrix(ub,Et.workingColorSpace,t);let e=`mat3( ${ub.elements.map(n=>n.toFixed(4))} )`;switch(Et.getTransfer(t)){case Oc:return[e,"LinearTransferOETF"];case Kt:return[e,"sRGBTransferOETF"];default:return dt("WebGLProgram: Unsupported color space: ",t),[e,"LinearTransferOETF"]}}function hb(t,e,n){let i=t.getShaderParameter(e,t.COMPILE_STATUS),s=(t.getShaderInfoLog(e)||"").trim();if(i&&s==="")return"";let o=/ERROR: 0:(\d+)/.exec(s);if(o){let a=parseInt(o[1]);return n.toUpperCase()+`

`+s+`

`+kC(t.getShaderSource(e),a)}else return s}function zC(t,e){let n=BC(e);return[`vec4 ${t}( vec4 value ) {`,`	return ${n[1]}( vec4( value.rgb * ${n[0]}, value.a ) );`,"}"].join(`
`)}var VC={[B0]:"Linear",[z0]:"Reinhard",[V0]:"Cineon",[G0]:"ACESFilmic",[W0]:"AgX",[$0]:"Neutral",[H0]:"Custom"};function GC(t,e){let n=VC[e];return n===void 0?(dt("WebGLProgram: Unsupported toneMapping:",e),"vec3 "+t+"( vec3 color ) { return LinearToneMapping( color ); }"):"vec3 "+t+"( vec3 color ) { return "+n+"ToneMapping( color ); }"}var qd=new P;function HC(){Et.getLuminanceCoefficients(qd);let t=qd.x.toFixed(4),e=qd.y.toFixed(4),n=qd.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${t}, ${e}, ${n} );`,"	return dot( weights, rgb );","}"].join(`
`)}function WC(t){return[t.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",t.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(du).join(`
`)}function $C(t){let e=[];for(let n in t){let i=t[n];i!==!1&&e.push("#define "+n+" "+i)}return e.join(`
`)}function XC(t,e){let n={},i=t.getProgramParameter(e,t.ACTIVE_ATTRIBUTES);for(let r=0;r<i;r++){let s=t.getActiveAttrib(e,r),o=s.name,a=1;s.type===t.FLOAT_MAT2&&(a=2),s.type===t.FLOAT_MAT3&&(a=3),s.type===t.FLOAT_MAT4&&(a=4),n[o]={type:s.type,location:t.getAttribLocation(e,o),locationSize:a}}return n}function du(t){return t!==""}function fb(t,e){let n=e.numSpotLightShadows+e.numSpotLightMaps-e.numSpotLightShadowsWithMaps;return t.replace(/NUM_SUN_LIGHTS/g,e.numSunLights).replace(/NUM_DIR_LIGHTS/g,e.numDirLights).replace(/NUM_SPOT_LIGHTS/g,e.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,e.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,n).replace(/NUM_RECT_AREA_LIGHTS/g,e.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,e.numPointLights).replace(/NUM_HEMI_LIGHTS/g,e.numHemiLights).replace(/NUM_SUN_LIGHT_SHADOWS/g,e.numSunLightShadows).replace(/NUM_DIR_LIGHT_SHADOWS/g,e.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,e.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,e.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,e.numPointLightShadows)}function db(t,e){return t.replace(/NUM_CLIPPING_PLANES/g,e.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,e.numClippingPlanes-e.numClipIntersection)}var YC=/^[ \t]*#include +<([\w\d./]+)>/gm;function bg(t){return t.replace(YC,jC)}var qC=new Map;function jC(t,e){let n=At[e];if(n===void 0){let i=qC.get(e);if(i!==void 0)n=At[i],dt('WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',e,i);else throw new Error("THREE.WebGLProgram: Can not resolve #include <"+e+">")}return bg(n)}var ZC=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function pb(t){return t.replace(ZC,KC)}function KC(t,e,n,i){let r="";for(let s=parseInt(e);s<parseInt(n);s++)r+=i.replace(/\[\s*i\s*\]/g,"[ "+s+" ]").replace(/UNROLLED_LOOP_INDEX/g,s);return r}function mb(t){let e=`precision ${t.precision} float;
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
#define LOW_PRECISION`),e}var JC={[tu]:"SHADOWMAP_TYPE_PCF",[bl]:"SHADOWMAP_TYPE_VSM"};function QC(t){return JC[t.shadowMapType]||"SHADOWMAP_TYPE_BASIC"}var e3={[vo]:"ENVMAP_TYPE_CUBE",[aa]:"ENVMAP_TYPE_CUBE",[iu]:"ENVMAP_TYPE_CUBE_UV"};function t3(t){return t.envMap===!1?"ENVMAP_TYPE_CUBE":e3[t.envMapMode]||"ENVMAP_TYPE_CUBE"}var n3={[aa]:"ENVMAP_MODE_REFRACTION"};function i3(t){return t.envMap===!1?"ENVMAP_MODE_REFLECTION":n3[t.envMapMode]||"ENVMAP_MODE_REFLECTION"}var r3={[k0]:"ENVMAP_BLENDING_MULTIPLY",[D_]:"ENVMAP_BLENDING_MIX",[N_]:"ENVMAP_BLENDING_ADD"};function s3(t){return t.envMap===!1?"ENVMAP_BLENDING_NONE":r3[t.combine]||"ENVMAP_BLENDING_NONE"}function o3(t){let e=t.envMapCubeUVHeight;if(e===null)return null;let n=Math.log2(e)-2,i=1/e;return{texelWidth:1/(3*Math.max(Math.pow(2,n),112)),texelHeight:i,maxMip:n}}function a3(t,e,n,i){let r=t.getContext(),s=n.defines,o=n.vertexShader,a=n.fragmentShader,l=QC(n),c=t3(n),u=i3(n),f=s3(n),h=o3(n),d=WC(n),g=$C(s),x=r.createProgram(),m,p,_=n.glslVersion?"#version "+n.glslVersion+`
`:"";n.isRawShaderMaterial?(m=["#define SHADER_TYPE "+n.shaderType,"#define SHADER_NAME "+n.shaderName,g].filter(du).join(`
`),m.length>0&&(m+=`
`),p=["#define SHADER_TYPE "+n.shaderType,"#define SHADER_NAME "+n.shaderName,g].filter(du).join(`
`),p.length>0&&(p+=`
`)):(m=[mb(n),"#define SHADER_TYPE "+n.shaderType,"#define SHADER_NAME "+n.shaderName,g,n.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",n.batching?"#define USE_BATCHING":"",n.batchingColor?"#define USE_BATCHING_COLOR":"",n.instancing?"#define USE_INSTANCING":"",n.instancingColor?"#define USE_INSTANCING_COLOR":"",n.instancingMorph?"#define USE_INSTANCING_MORPH":"",n.useFog&&n.fog?"#define USE_FOG":"",n.useFog&&n.fogExp2?"#define FOG_EXP2":"",n.map?"#define USE_MAP":"",n.envMap?"#define USE_ENVMAP":"",n.envMap?"#define "+u:"",n.lightMap?"#define USE_LIGHTMAP":"",n.aoMap?"#define USE_AOMAP":"",n.bumpMap?"#define USE_BUMPMAP":"",n.normalMap?"#define USE_NORMALMAP":"",n.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",n.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",n.displacementMap?"#define USE_DISPLACEMENTMAP":"",n.emissiveMap?"#define USE_EMISSIVEMAP":"",n.anisotropy?"#define USE_ANISOTROPY":"",n.anisotropyMap?"#define USE_ANISOTROPYMAP":"",n.clearcoatMap?"#define USE_CLEARCOATMAP":"",n.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",n.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",n.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",n.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",n.specularMap?"#define USE_SPECULARMAP":"",n.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",n.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",n.roughnessMap?"#define USE_ROUGHNESSMAP":"",n.metalnessMap?"#define USE_METALNESSMAP":"",n.alphaMap?"#define USE_ALPHAMAP":"",n.alphaHash?"#define USE_ALPHAHASH":"",n.transmission?"#define USE_TRANSMISSION":"",n.transmissionMap?"#define USE_TRANSMISSIONMAP":"",n.thicknessMap?"#define USE_THICKNESSMAP":"",n.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",n.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",n.mapUv?"#define MAP_UV "+n.mapUv:"",n.alphaMapUv?"#define ALPHAMAP_UV "+n.alphaMapUv:"",n.lightMapUv?"#define LIGHTMAP_UV "+n.lightMapUv:"",n.aoMapUv?"#define AOMAP_UV "+n.aoMapUv:"",n.emissiveMapUv?"#define EMISSIVEMAP_UV "+n.emissiveMapUv:"",n.bumpMapUv?"#define BUMPMAP_UV "+n.bumpMapUv:"",n.normalMapUv?"#define NORMALMAP_UV "+n.normalMapUv:"",n.displacementMapUv?"#define DISPLACEMENTMAP_UV "+n.displacementMapUv:"",n.metalnessMapUv?"#define METALNESSMAP_UV "+n.metalnessMapUv:"",n.roughnessMapUv?"#define ROUGHNESSMAP_UV "+n.roughnessMapUv:"",n.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+n.anisotropyMapUv:"",n.clearcoatMapUv?"#define CLEARCOATMAP_UV "+n.clearcoatMapUv:"",n.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+n.clearcoatNormalMapUv:"",n.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+n.clearcoatRoughnessMapUv:"",n.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+n.iridescenceMapUv:"",n.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+n.iridescenceThicknessMapUv:"",n.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+n.sheenColorMapUv:"",n.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+n.sheenRoughnessMapUv:"",n.specularMapUv?"#define SPECULARMAP_UV "+n.specularMapUv:"",n.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+n.specularColorMapUv:"",n.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+n.specularIntensityMapUv:"",n.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+n.transmissionMapUv:"",n.thicknessMapUv?"#define THICKNESSMAP_UV "+n.thicknessMapUv:"",n.vertexTangents&&n.flatShading===!1?"#define USE_TANGENT":"",n.vertexNormals?"#define HAS_NORMAL":"",n.vertexColors?"#define USE_COLOR":"",n.vertexAlphas?"#define USE_COLOR_ALPHA":"",n.vertexUv1s?"#define USE_UV1":"",n.vertexUv2s?"#define USE_UV2":"",n.vertexUv3s?"#define USE_UV3":"",n.pointsUvs?"#define USE_POINTS_UV":"",n.flatShading?"#define FLAT_SHADED":"",n.skinning?"#define USE_SKINNING":"",n.morphTargets?"#define USE_MORPHTARGETS":"",n.morphNormals&&n.flatShading===!1?"#define USE_MORPHNORMALS":"",n.morphColors?"#define USE_MORPHCOLORS":"",n.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+n.morphTextureStride:"",n.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+n.morphTargetsCount:"",n.doubleSided?"#define DOUBLE_SIDED":"",n.flipSided?"#define FLIP_SIDED":"",n.shadowMapEnabled?"#define USE_SHADOWMAP":"",n.shadowMapEnabled?"#define "+l:"",n.sizeAttenuation?"#define USE_SIZEATTENUATION":"",n.numLightProbes>0?"#define USE_LIGHT_PROBES":"",n.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",n.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(du).join(`
`),p=[mb(n),"#define SHADER_TYPE "+n.shaderType,"#define SHADER_NAME "+n.shaderName,g,n.useFog&&n.fog?"#define USE_FOG":"",n.useFog&&n.fogExp2?"#define FOG_EXP2":"",n.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",n.map?"#define USE_MAP":"",n.matcap?"#define USE_MATCAP":"",n.envMap?"#define USE_ENVMAP":"",n.envMap?"#define "+c:"",n.envMap?"#define "+u:"",n.envMap?"#define "+f:"",h?"#define CUBEUV_TEXEL_WIDTH "+h.texelWidth:"",h?"#define CUBEUV_TEXEL_HEIGHT "+h.texelHeight:"",h?"#define CUBEUV_MAX_MIP "+h.maxMip+".0":"",n.lightMap?"#define USE_LIGHTMAP":"",n.aoMap?"#define USE_AOMAP":"",n.bumpMap?"#define USE_BUMPMAP":"",n.normalMap?"#define USE_NORMALMAP":"",n.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",n.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",n.packedNormalMap?"#define USE_PACKED_NORMALMAP":"",n.emissiveMap?"#define USE_EMISSIVEMAP":"",n.anisotropy?"#define USE_ANISOTROPY":"",n.anisotropyMap?"#define USE_ANISOTROPYMAP":"",n.clearcoat?"#define USE_CLEARCOAT":"",n.clearcoatMap?"#define USE_CLEARCOATMAP":"",n.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",n.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",n.dispersion?"#define USE_DISPERSION":"",n.retroreflection?"#define USE_RETROREFLECTION":"",n.iridescence?"#define USE_IRIDESCENCE":"",n.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",n.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",n.specularMap?"#define USE_SPECULARMAP":"",n.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",n.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",n.roughnessMap?"#define USE_ROUGHNESSMAP":"",n.metalnessMap?"#define USE_METALNESSMAP":"",n.alphaMap?"#define USE_ALPHAMAP":"",n.alphaTest?"#define USE_ALPHATEST":"",n.alphaHash?"#define USE_ALPHAHASH":"",n.sheen?"#define USE_SHEEN":"",n.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",n.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",n.transmission?"#define USE_TRANSMISSION":"",n.transmissionMap?"#define USE_TRANSMISSIONMAP":"",n.thicknessMap?"#define USE_THICKNESSMAP":"",n.vertexTangents&&n.flatShading===!1?"#define USE_TANGENT":"",n.vertexColors||n.instancingColor?"#define USE_COLOR":"",n.vertexAlphas||n.batchingColor?"#define USE_COLOR_ALPHA":"",n.vertexUv1s?"#define USE_UV1":"",n.vertexUv2s?"#define USE_UV2":"",n.vertexUv3s?"#define USE_UV3":"",n.pointsUvs?"#define USE_POINTS_UV":"",n.gradientMap?"#define USE_GRADIENTMAP":"",n.flatShading?"#define FLAT_SHADED":"",n.doubleSided?"#define DOUBLE_SIDED":"",n.flipSided?"#define FLIP_SIDED":"",n.shadowMapEnabled?"#define USE_SHADOWMAP":"",n.shadowMapEnabled?"#define "+l:"",n.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",n.numLightProbes>0?"#define USE_LIGHT_PROBES":"",n.numLightProbeGrids>0?"#define USE_LIGHT_PROBES_GRID":"",n.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",n.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",n.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",n.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",n.toneMapping!==Qi?"#define TONE_MAPPING":"",n.toneMapping!==Qi?At.tonemapping_pars_fragment:"",n.toneMapping!==Qi?GC("toneMapping",n.toneMapping):"",n.dithering?"#define DITHERING":"",n.opaque?"#define OPAQUE":"",At.colorspace_pars_fragment,zC("linearToOutputTexel",n.outputColorSpace),HC(),n.useDepthPacking?"#define DEPTH_PACKING "+n.depthPacking:"",`
`].filter(du).join(`
`)),o=bg(o),o=fb(o,n),o=db(o,n),a=bg(a),a=fb(a,n),a=db(a,n),o=pb(o),a=pb(a),n.isRawShaderMaterial!==!0&&(_=`#version 300 es
`,m=[d,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+m,p=["#define varying in",n.glslVersion===tg?"":"layout(location = 0) out highp vec4 pc_fragColor;",n.glslVersion===tg?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+p);let M=_+m+o,v=_+p+a,S=cb(r,r.VERTEX_SHADER,M),w=cb(r,r.FRAGMENT_SHADER,v);r.attachShader(x,S),r.attachShader(x,w),n.index0AttributeName!==void 0?r.bindAttribLocation(x,0,n.index0AttributeName):n.hasPositionAttribute===!0&&r.bindAttribLocation(x,0,"position"),r.linkProgram(x);function E(F){if(t.debug.checkShaderErrors){let O=r.getProgramInfoLog(x)||"",z=r.getShaderInfoLog(S)||"",L=r.getShaderInfoLog(w)||"",V=O.trim(),N=z.trim(),D=L.trim(),H=!0,G=!0;if(r.getProgramParameter(x,r.LINK_STATUS)===!1)if(H=!1,typeof t.debug.onShaderError=="function")t.debug.onShaderError(r,x,S,w);else{let $=hb(r,S,"vertex"),J=hb(r,w,"fragment");gt("WebGLProgram: Shader Error "+r.getError()+" - VALIDATE_STATUS "+r.getProgramParameter(x,r.VALIDATE_STATUS)+`

Material Name: `+F.name+`
Material Type: `+F.type+`

Program Info Log: `+V+`
`+$+`
`+J)}else V!==""?dt("WebGLProgram: Program Info Log:",V):(N===""||D==="")&&(G=!1);G&&(F.diagnostics={runnable:H,programLog:V,vertexShader:{log:N,prefix:m},fragmentShader:{log:D,prefix:p}})}r.deleteShader(S),r.deleteShader(w),y=new El(r,x),T=XC(r,x)}let y;this.getUniforms=function(){return y===void 0&&E(this),y};let T;this.getAttributes=function(){return T===void 0&&E(this),T};let R=n.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return R===!1&&(R=r.getProgramParameter(x,FC)),R},this.destroy=function(){i.releaseStatesOfProgram(this),r.deleteProgram(x),this.program=void 0},this.type=n.shaderType,this.name=n.shaderName,this.id=UC++,this.cacheKey=e,this.usedTimes=1,this.program=x,this.vertexShader=S,this.fragmentShader=w,this}var l3=0,Mg=class{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e,n,i){let r=this._getShaderCacheForMaterial(e);return r.has(n)===!1&&(r.add(n),n.usedTimes++),r.has(i)===!1&&(r.add(i),i.usedTimes++),this}remove(e){let n=this.materialCache.get(e);for(let i of n)i.usedTimes--,i.usedTimes===0&&this.shaderCache.delete(i.code);return this.materialCache.delete(e),this}getVertexShaderStage(e){return this._getShaderStage(e.vertexShader)}getFragmentShaderStage(e){return this._getShaderStage(e.fragmentShader)}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){let n=this.materialCache,i=n.get(e);return i===void 0&&(i=new Set,n.set(e,i)),i}_getShaderStage(e){let n=this.shaderCache,i=n.get(e);return i===void 0&&(i=new Sg(e),n.set(e,i)),i}},Sg=class{constructor(e){this.id=l3++,this.code=e,this.usedTimes=0}};function c3(t){return t===bo||t===cu||t===uu}function u3(t,e,n,i,r,s){let o=new gl,a=new Mg,l=new Set,c=[],u=new Map,f=i.logarithmicDepthBuffer,h=i.precision,d={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distance",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function g(y){return l.add(y),y===0?"uv":`uv${y}`}function x(y,T,R,F,O,z){let L=F.fog,V=O.geometry,N=y.isMeshStandardMaterial||y.isMeshLambertMaterial||y.isMeshPhongMaterial?F.environment:null,D=y.isMeshStandardMaterial||y.isMeshLambertMaterial&&!y.envMap||y.isMeshPhongMaterial&&!y.envMap,H=e.get(y.envMap||N,D),G=H&&H.mapping===iu?H.image.height:null,$=d[y.type];y.precision!==null&&(h=i.getMaxPrecision(y.precision),h!==y.precision&&dt("WebGLProgram.getParameters:",y.precision,"not supported, using",h,"instead."));let J=V.morphAttributes.position||V.morphAttributes.normal||V.morphAttributes.color,ve=J!==void 0?J.length:0,ye=0;V.morphAttributes.position!==void 0&&(ye=1),V.morphAttributes.normal!==void 0&&(ye=2),V.morphAttributes.color!==void 0&&(ye=3);let rt,ze,nt,Z;if($){let an=os[$];rt=an.vertexShader,ze=an.fragmentShader}else{rt=y.vertexShader,ze=y.fragmentShader;let an=a.getVertexShaderStage(y),Ut=a.getFragmentShaderStage(y);a.update(y,an,Ut),nt=an.id,Z=Ut.id}let te=t.getRenderTarget(),Te=t.state.buffers.depth.getReversed(),je=O.isInstancedMesh===!0,Re=O.isBatchedMesh===!0,le=!!y.map,ge=!!y.matcap,Oe=!!H,Ze=!!y.aoMap,St=!!y.lightMap,Ce=!!y.bumpMap&&y.wireframe===!1,Le=!!y.normalMap,at=!!y.displacementMap,on=!!y.emissiveMap,tn=!!y.metalnessMap,nn=!!y.roughnessMap,k=y.anisotropy>0,Bn=y.clearcoat>0,Tt=y.dispersion>0,I=y.retroreflectivity>0,b=y.iridescence>0,W=y.sheen>0,K=y.transmission>0,ne=k&&!!y.anisotropyMap,we=Bn&&!!y.clearcoatMap,Fe=Bn&&!!y.clearcoatNormalMap,re=Bn&&!!y.clearcoatRoughnessMap,oe=b&&!!y.iridescenceMap,De=b&&!!y.iridescenceThicknessMap,Qe=W&&!!y.sheenColorMap,C=W&&!!y.sheenRoughnessMap,X=!!y.specularMap,ae=!!y.specularColorMap,Se=!!y.specularIntensityMap,We=K&&!!y.transmissionMap,U=K&&!!y.thicknessMap,Me=!!y.gradientMap,ie=!!y.alphaMap,Ae=y.alphaTest>0,ue=!!y.alphaHash,se=!!y.extensions,Ne=Qi;y.toneMapped&&(te===null||te.isXRRenderTarget===!0)&&(Ne=t.toneMapping);let Ge={shaderID:$,shaderType:y.type,shaderName:y.name,vertexShader:rt,fragmentShader:ze,defines:y.defines,customVertexShaderID:nt,customFragmentShaderID:Z,isRawShaderMaterial:y.isRawShaderMaterial===!0,glslVersion:y.glslVersion,precision:h,batching:Re,batchingColor:Re&&O._colorsTexture!==null,instancing:je,instancingColor:je&&O.instanceColor!==null,instancingMorph:je&&O.morphTexture!==null,outputColorSpace:te===null?t.outputColorSpace:te.isXRRenderTarget===!0?te.texture.colorSpace:Et.workingColorSpace,alphaToCoverage:!!y.alphaToCoverage,map:le,matcap:ge,envMap:Oe,envMapMode:Oe&&H.mapping,envMapCubeUVHeight:G,aoMap:Ze,lightMap:St,bumpMap:Ce,normalMap:Le,displacementMap:at,emissiveMap:on,normalMapObjectSpace:Le&&y.normalMapType===U_,normalMapTangentSpace:Le&&y.normalMapType===Q0,packedNormalMap:Le&&y.normalMapType===Q0&&c3(y.normalMap.format),metalnessMap:tn,roughnessMap:nn,anisotropy:k,anisotropyMap:ne,clearcoat:Bn,clearcoatMap:we,clearcoatNormalMap:Fe,clearcoatRoughnessMap:re,dispersion:Tt,retroreflection:I,iridescence:b,iridescenceMap:oe,iridescenceThicknessMap:De,sheen:W,sheenColorMap:Qe,sheenRoughnessMap:C,specularMap:X,specularColorMap:ae,specularIntensityMap:Se,transmission:K,transmissionMap:We,thicknessMap:U,gradientMap:Me,opaque:y.transparent===!1&&y.blending===Or&&y.alphaToCoverage===!1,alphaMap:ie,alphaTest:Ae,alphaHash:ue,combine:y.combine,mapUv:le&&g(y.map.channel),aoMapUv:Ze&&g(y.aoMap.channel),lightMapUv:St&&g(y.lightMap.channel),bumpMapUv:Ce&&g(y.bumpMap.channel),normalMapUv:Le&&g(y.normalMap.channel),displacementMapUv:at&&g(y.displacementMap.channel),emissiveMapUv:on&&g(y.emissiveMap.channel),metalnessMapUv:tn&&g(y.metalnessMap.channel),roughnessMapUv:nn&&g(y.roughnessMap.channel),anisotropyMapUv:ne&&g(y.anisotropyMap.channel),clearcoatMapUv:we&&g(y.clearcoatMap.channel),clearcoatNormalMapUv:Fe&&g(y.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:re&&g(y.clearcoatRoughnessMap.channel),iridescenceMapUv:oe&&g(y.iridescenceMap.channel),iridescenceThicknessMapUv:De&&g(y.iridescenceThicknessMap.channel),sheenColorMapUv:Qe&&g(y.sheenColorMap.channel),sheenRoughnessMapUv:C&&g(y.sheenRoughnessMap.channel),specularMapUv:X&&g(y.specularMap.channel),specularColorMapUv:ae&&g(y.specularColorMap.channel),specularIntensityMapUv:Se&&g(y.specularIntensityMap.channel),transmissionMapUv:We&&g(y.transmissionMap.channel),thicknessMapUv:U&&g(y.thicknessMap.channel),alphaMapUv:ie&&g(y.alphaMap.channel),vertexTangents:!!V.attributes.tangent&&(Le||k),vertexNormals:!!V.attributes.normal,vertexColors:y.vertexColors,vertexAlphas:y.vertexColors===!0&&!!V.attributes.color&&V.attributes.color.itemSize===4,pointsUvs:O.isPoints===!0&&!!V.attributes.uv&&(le||ie),fog:!!L,useFog:y.fog===!0,fogExp2:!!L&&L.isFogExp2,flatShading:y.wireframe===!1&&(y.flatShading===!0||V.attributes.normal===void 0&&Le===!1&&(y.isMeshLambertMaterial||y.isMeshPhongMaterial||y.isMeshStandardMaterial||y.isMeshPhysicalMaterial)),sizeAttenuation:y.sizeAttenuation===!0,logarithmicDepthBuffer:f,reversedDepthBuffer:Te,skinning:O.isSkinnedMesh===!0,hasPositionAttribute:V.attributes.position!==void 0,morphTargets:V.morphAttributes.position!==void 0,morphNormals:V.morphAttributes.normal!==void 0,morphColors:V.morphAttributes.color!==void 0,morphTargetsCount:ve,morphTextureStride:ye,numSunLights:T.sun.length,numDirLights:T.directional.length,numPointLights:T.point.length,numSpotLights:T.spot.length,numSpotLightMaps:T.spotLightMap.length,numRectAreaLights:T.rectArea.length,numHemiLights:T.hemi.length,numSunLightShadows:T.sunShadowMap.length,numDirLightShadows:T.directionalShadowMap.length,numPointLightShadows:T.pointShadowMap.length,numSpotLightShadows:T.spotShadowMap.length,numSpotLightShadowsWithMaps:T.numSpotLightShadowsWithMaps,numLightProbes:T.numLightProbes,numLightProbeGrids:z.length,numClippingPlanes:s.numPlanes,numClipIntersection:s.numIntersection,dithering:y.dithering,shadowMapEnabled:t.shadowMap.enabled&&R.length>0,shadowMapType:t.shadowMap.type,toneMapping:Ne,decodeVideoTexture:le&&y.map.isVideoTexture===!0&&Et.getTransfer(y.map.colorSpace)===Kt,decodeVideoTextureEmissive:on&&y.emissiveMap.isVideoTexture===!0&&Et.getTransfer(y.emissiveMap.colorSpace)===Kt,premultipliedAlpha:y.premultipliedAlpha,doubleSided:y.side===rs,flipSided:y.side===Ii,useDepthPacking:y.depthPacking>=0,depthPacking:y.depthPacking||0,index0AttributeName:y.index0AttributeName,extensionClipCullDistance:se&&y.extensions.clipCullDistance===!0&&n.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(se&&y.extensions.multiDraw===!0||Re)&&n.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:n.has("KHR_parallel_shader_compile"),customProgramCacheKey:y.customProgramCacheKey()};return Ge.vertexUv1s=l.has(1),Ge.vertexUv2s=l.has(2),Ge.vertexUv3s=l.has(3),l.clear(),Ge}function m(y){let T=[];if(y.shaderID?T.push(y.shaderID):(T.push(y.customVertexShaderID),T.push(y.customFragmentShaderID)),y.defines!==void 0)for(let R in y.defines)T.push(R),T.push(y.defines[R]);return y.isRawShaderMaterial===!1&&(p(T,y),_(T,y),T.push(t.outputColorSpace)),T.push(y.customProgramCacheKey),T.join()}function p(y,T){y.push(T.precision),y.push(T.outputColorSpace),y.push(T.envMapMode),y.push(T.envMapCubeUVHeight),y.push(T.mapUv),y.push(T.alphaMapUv),y.push(T.lightMapUv),y.push(T.aoMapUv),y.push(T.bumpMapUv),y.push(T.normalMapUv),y.push(T.displacementMapUv),y.push(T.emissiveMapUv),y.push(T.metalnessMapUv),y.push(T.roughnessMapUv),y.push(T.anisotropyMapUv),y.push(T.clearcoatMapUv),y.push(T.clearcoatNormalMapUv),y.push(T.clearcoatRoughnessMapUv),y.push(T.iridescenceMapUv),y.push(T.iridescenceThicknessMapUv),y.push(T.sheenColorMapUv),y.push(T.sheenRoughnessMapUv),y.push(T.specularMapUv),y.push(T.specularColorMapUv),y.push(T.specularIntensityMapUv),y.push(T.transmissionMapUv),y.push(T.thicknessMapUv),y.push(T.combine),y.push(T.fogExp2),y.push(T.sizeAttenuation),y.push(T.morphTargetsCount),y.push(T.morphAttributeCount),y.push(T.numSunLights),y.push(T.numDirLights),y.push(T.numPointLights),y.push(T.numSpotLights),y.push(T.numSpotLightMaps),y.push(T.numHemiLights),y.push(T.numRectAreaLights),y.push(T.numSunLightShadows),y.push(T.numDirLightShadows),y.push(T.numPointLightShadows),y.push(T.numSpotLightShadows),y.push(T.numSpotLightShadowsWithMaps),y.push(T.numLightProbes),y.push(T.shadowMapType),y.push(T.toneMapping),y.push(T.numClippingPlanes),y.push(T.numClipIntersection),y.push(T.depthPacking)}function _(y,T){o.disableAll(),T.instancing&&o.enable(0),T.instancingColor&&o.enable(1),T.instancingMorph&&o.enable(2),T.matcap&&o.enable(3),T.envMap&&o.enable(4),T.normalMapObjectSpace&&o.enable(5),T.normalMapTangentSpace&&o.enable(6),T.clearcoat&&o.enable(7),T.iridescence&&o.enable(8),T.alphaTest&&o.enable(9),T.vertexColors&&o.enable(10),T.vertexAlphas&&o.enable(11),T.vertexUv1s&&o.enable(12),T.vertexUv2s&&o.enable(13),T.vertexUv3s&&o.enable(14),T.vertexTangents&&o.enable(15),T.anisotropy&&o.enable(16),T.alphaHash&&o.enable(17),T.batching&&o.enable(18),T.dispersion&&o.enable(19),T.retroreflection&&o.enable(24),T.batchingColor&&o.enable(20),T.gradientMap&&o.enable(21),T.packedNormalMap&&o.enable(22),T.vertexNormals&&o.enable(23),y.push(o.mask),o.disableAll(),T.fog&&o.enable(0),T.useFog&&o.enable(1),T.flatShading&&o.enable(2),T.logarithmicDepthBuffer&&o.enable(3),T.reversedDepthBuffer&&o.enable(4),T.skinning&&o.enable(5),T.morphTargets&&o.enable(6),T.morphNormals&&o.enable(7),T.morphColors&&o.enable(8),T.premultipliedAlpha&&o.enable(9),T.shadowMapEnabled&&o.enable(10),T.doubleSided&&o.enable(11),T.flipSided&&o.enable(12),T.useDepthPacking&&o.enable(13),T.dithering&&o.enable(14),T.transmission&&o.enable(15),T.sheen&&o.enable(16),T.opaque&&o.enable(17),T.pointsUvs&&o.enable(18),T.decodeVideoTexture&&o.enable(19),T.decodeVideoTextureEmissive&&o.enable(20),T.alphaToCoverage&&o.enable(21),T.numLightProbeGrids>0&&o.enable(22),T.hasPositionAttribute&&o.enable(23),y.push(o.mask)}function M(y){let T=d[y.type],R;if(T){let F=os[T];R=Z_.clone(F.uniforms)}else R=y.uniforms;return R}function v(y,T){let R=u.get(T);return R!==void 0?++R.usedTimes:(R=new a3(t,T,y,r),c.push(R),u.set(T,R)),R}function S(y){if(--y.usedTimes===0){let T=c.indexOf(y);c[T]=c[c.length-1],c.pop(),u.delete(y.cacheKey),y.destroy()}}function w(y){a.remove(y)}function E(){a.dispose()}return{getParameters:x,getProgramCacheKey:m,getUniforms:M,acquireProgram:v,releaseProgram:S,releaseShaderCache:w,programs:c,dispose:E}}function h3(){let t=new WeakMap;function e(o){return t.has(o)}function n(o){let a=t.get(o);return a===void 0&&(a={},t.set(o,a)),a}function i(o){t.delete(o)}function r(o,a,l){t.get(o)[a]=l}function s(){t=new WeakMap}return{has:e,get:n,remove:i,update:r,dispose:s}}function f3(t,e){return t.groupOrder!==e.groupOrder?t.groupOrder-e.groupOrder:t.renderOrder!==e.renderOrder?t.renderOrder-e.renderOrder:t.material.id!==e.material.id?t.material.id-e.material.id:t.materialVariant!==e.materialVariant?t.materialVariant-e.materialVariant:t.z!==e.z?t.z-e.z:t.id-e.id}function gb(t,e){return t.groupOrder!==e.groupOrder?t.groupOrder-e.groupOrder:t.renderOrder!==e.renderOrder?t.renderOrder-e.renderOrder:t.z!==e.z?e.z-t.z:t.id-e.id}function xb(){let t=[],e=0,n=[],i=[],r=[];function s(){e=0,n.length=0,i.length=0,r.length=0}function o(h){let d=0;return h.isInstancedMesh&&(d+=2),h.isSkinnedMesh&&(d+=1),d}function a(h,d,g,x,m,p){let _=t[e];return _===void 0?(_={id:h.id,object:h,geometry:d,material:g,materialVariant:o(h),groupOrder:x,renderOrder:h.renderOrder,z:m,group:p},t[e]=_):(_.id=h.id,_.object=h,_.geometry=d,_.material=g,_.materialVariant=o(h),_.groupOrder=x,_.renderOrder=h.renderOrder,_.z=m,_.group=p),e++,_}function l(h,d,g,x,m,p,_){_.reversedDepth===!0&&(m=-m);let M=a(h,d,g,x,m,p);g.transmission>0?i.push(M):g.transparent===!0?r.push(M):n.push(M)}function c(h,d,g,x,m,p){let _=a(h,d,g,x,m,p);g.transmission>0?i.unshift(_):g.transparent===!0?r.unshift(_):n.unshift(_)}function u(h,d){n.length>1&&n.sort(h||f3),i.length>1&&i.sort(d||gb),r.length>1&&r.sort(d||gb)}function f(){for(let h=e,d=t.length;h<d;h++){let g=t[h];if(g.id===null)break;g.id=null,g.object=null,g.geometry=null,g.material=null,g.group=null}}return{opaque:n,transmissive:i,transparent:r,init:s,push:l,unshift:c,finish:f,sort:u}}function d3(){let t=new WeakMap;function e(i,r){let s=t.get(i),o;return s===void 0?(o=new xb,t.set(i,[o])):r>=s.length?(o=new xb,s.push(o)):o=s[r],o}function n(){t=new WeakMap}return{get:e,dispose:n}}function p3(){let t={};return{get:function(e){if(t[e.id]!==void 0)return t[e.id];let n;switch(e.type){case"SunLight":case"DirectionalLight":n={direction:new P,color:new Pt};break;case"SpotLight":n={position:new P,direction:new P,color:new Pt,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":n={position:new P,color:new Pt,distance:0,decay:0};break;case"HemisphereLight":n={direction:new P,skyColor:new Pt,groundColor:new Pt};break;case"RectAreaLight":n={color:new Pt,position:new P,halfWidth:new P,halfHeight:new P};break}return t[e.id]=n,n}}}function m3(){let t={};return{get:function(e){if(t[e.id]!==void 0)return t[e.id];let n;switch(e.type){case"SunLight":case"DirectionalLight":n={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new pt};break;case"SpotLight":n={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new pt};break;case"PointLight":n={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new pt,shadowCameraNear:1,shadowCameraFar:1e3};break}return t[e.id]=n,n}}}var g3=0;function x3(t,e){return(e.castShadow?2:0)-(t.castShadow?2:0)+(e.map?1:0)-(t.map?1:0)}function v3(t){let e=new p3,n=m3(),i={version:0,hash:{sunLength:-1,directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numSunShadows:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],sun:[],sunShadow:[],sunShadowMap:[],sunShadowMatrix:[],sunShadowCascade:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let c=0;c<9;c++)i.probe.push(new P);let r=new P,s=new Ot,o=new Ot;function a(c){let u=0,f=0,h=0;for(let O=0;O<9;O++)i.probe[O].set(0,0,0);let d=0,g=0,x=0,m=0,p=0,_=0,M=0,v=0,S=0,w=0,E=0,y=0,T=0,R=0;c.sort(x3);for(let O=0,z=c.length;O<z;O++){let L=c[O],V=L.color,N=L.intensity,D=L.distance,H=null;if(L.shadow&&L.shadow.map&&(L.shadow.map.texture.format===bo?H=L.shadow.map.texture:H=L.shadow.map.depthTexture||L.shadow.map.texture),L.isAmbientLight)u+=V.r*N,f+=V.g*N,h+=V.b*N;else if(L.isLightProbe){for(let G=0;G<9;G++)i.probe[G].addScaledVector(L.sh.coefficients[G],N);R++}else if(L.isSunLight){let G=e.get(L);if(G.color.copy(L.color).multiplyScalar(L.intensity),L.castShadow){let $=L.shadow,J=n.get(L);J.shadowIntensity=$.intensity,J.shadowBias=$.bias,J.shadowNormalBias=$.normalBias,J.shadowRadius=$.radius,J.shadowMapSize.copy($.mapSize).multiply($.getFrameExtents()),i.sunShadow[g]=J,i.sunShadowMap[g]=H;let ve=$.getViewportCount();for(let ye=0;ye<ve;ye++)i.sunShadowMatrix[x+ye]=$.getMatrix(ye),i.sunShadowCascade[x+ye]=$._cascadeData[ye];x+=ve,g++}i.sun[d]=G,d++}else if(L.isDirectionalLight){let G=e.get(L);if(G.color.copy(L.color).multiplyScalar(L.intensity),L.castShadow){let $=L.shadow,J=n.get(L);J.shadowIntensity=$.intensity,J.shadowBias=$.bias,J.shadowNormalBias=$.normalBias,J.shadowRadius=$.radius,J.shadowMapSize=$.mapSize,i.directionalShadow[m]=J,i.directionalShadowMap[m]=H,i.directionalShadowMatrix[m]=L.shadow.matrix,S++}i.directional[m]=G,m++}else if(L.isSpotLight){let G=e.get(L);G.position.setFromMatrixPosition(L.matrixWorld),G.color.copy(V).multiplyScalar(N),G.distance=D,G.coneCos=Math.cos(L.angle),G.penumbraCos=Math.cos(L.angle*(1-L.penumbra)),G.decay=L.decay,i.spot[_]=G;let $=L.shadow;if(L.map&&(i.spotLightMap[y]=L.map,y++,$.updateMatrices(L),L.castShadow&&T++),i.spotLightMatrix[_]=$.matrix,L.castShadow){let J=n.get(L);J.shadowIntensity=$.intensity,J.shadowBias=$.bias,J.shadowNormalBias=$.normalBias,J.shadowRadius=$.radius,J.shadowMapSize=$.mapSize,i.spotShadow[_]=J,i.spotShadowMap[_]=H,E++}_++}else if(L.isRectAreaLight){let G=e.get(L);G.color.copy(V).multiplyScalar(N),G.halfWidth.set(L.width*.5,0,0),G.halfHeight.set(0,L.height*.5,0),i.rectArea[M]=G,M++}else if(L.isPointLight){let G=e.get(L);if(G.color.copy(L.color).multiplyScalar(L.intensity),G.distance=L.distance,G.decay=L.decay,L.castShadow){let $=L.shadow,J=n.get(L);J.shadowIntensity=$.intensity,J.shadowBias=$.bias,J.shadowNormalBias=$.normalBias,J.shadowRadius=$.radius,J.shadowMapSize=$.mapSize,J.shadowCameraNear=$.camera.near,J.shadowCameraFar=$.camera.far,i.pointShadow[p]=J,i.pointShadowMap[p]=H,i.pointShadowMatrix[p]=L.shadow.matrix,w++}i.point[p]=G,p++}else if(L.isHemisphereLight){let G=e.get(L);G.skyColor.copy(L.color).multiplyScalar(N),G.groundColor.copy(L.groundColor).multiplyScalar(N),i.hemi[v]=G,v++}}M>0&&(t.has("OES_texture_float_linear")===!0?(i.rectAreaLTC1=ke.LTC_FLOAT_1,i.rectAreaLTC2=ke.LTC_FLOAT_2):(i.rectAreaLTC1=ke.LTC_HALF_1,i.rectAreaLTC2=ke.LTC_HALF_2)),i.ambient[0]=u,i.ambient[1]=f,i.ambient[2]=h;let F=i.hash;(F.sunLength!==d||F.directionalLength!==m||F.pointLength!==p||F.spotLength!==_||F.rectAreaLength!==M||F.hemiLength!==v||F.numSunShadows!==g||F.numDirectionalShadows!==S||F.numPointShadows!==w||F.numSpotShadows!==E||F.numSpotMaps!==y||F.numLightProbes!==R)&&(i.sun.length=d,i.directional.length=m,i.spot.length=_,i.rectArea.length=M,i.point.length=p,i.hemi.length=v,i.sunShadow.length=g,i.sunShadowMap.length=g,i.sunShadowMatrix.length=x,i.sunShadowCascade.length=x,i.directionalShadow.length=S,i.directionalShadowMap.length=S,i.directionalShadowMatrix.length=S,i.pointShadow.length=w,i.pointShadowMap.length=w,i.pointShadowMatrix.length=w,i.spotShadow.length=E,i.spotShadowMap.length=E,i.spotLightMatrix.length=E+y-T,i.spotLightMap.length=y,i.numSpotLightShadowsWithMaps=T,i.numLightProbes=R,F.sunLength=d,F.directionalLength=m,F.pointLength=p,F.spotLength=_,F.rectAreaLength=M,F.hemiLength=v,F.numSunShadows=g,F.numDirectionalShadows=S,F.numPointShadows=w,F.numSpotShadows=E,F.numSpotMaps=y,F.numLightProbes=R,i.version=g3++)}function l(c,u){let f=0,h=0,d=0,g=0,x=0,m=0,p=u.matrixWorldInverse;for(let _=0,M=c.length;_<M;_++){let v=c[_];if(v.isSunLight){let S=i.sun[f];S.direction.setFromMatrixPosition(v.matrixWorld),S.direction.transformDirection(p),f++}else if(v.isDirectionalLight){let S=i.directional[h];S.direction.setFromMatrixPosition(v.matrixWorld),r.setFromMatrixPosition(v.target.matrixWorld),S.direction.sub(r),S.direction.transformDirection(p),h++}else if(v.isSpotLight){let S=i.spot[g];S.position.setFromMatrixPosition(v.matrixWorld),S.position.applyMatrix4(p),S.direction.setFromMatrixPosition(v.matrixWorld),r.setFromMatrixPosition(v.target.matrixWorld),S.direction.sub(r),S.direction.transformDirection(p),g++}else if(v.isRectAreaLight){let S=i.rectArea[x];S.position.setFromMatrixPosition(v.matrixWorld),S.position.applyMatrix4(p),o.identity(),s.copy(v.matrixWorld),s.premultiply(p),o.extractRotation(s),S.halfWidth.set(v.width*.5,0,0),S.halfHeight.set(0,v.height*.5,0),S.halfWidth.applyMatrix4(o),S.halfHeight.applyMatrix4(o),x++}else if(v.isPointLight){let S=i.point[d];S.position.setFromMatrixPosition(v.matrixWorld),S.position.applyMatrix4(p),d++}else if(v.isHemisphereLight){let S=i.hemi[m];S.direction.setFromMatrixPosition(v.matrixWorld),S.direction.transformDirection(p),m++}}}return{setup:a,setupView:l,state:i}}function vb(t){let e=new v3(t),n=[],i=[],r=[];function s(h){f.camera=h,n.length=0,i.length=0,r.length=0}function o(h){n.push(h)}function a(h){i.push(h)}function l(h){r.push(h)}function c(){e.setup(n)}function u(h){e.setupView(n,h)}let f={lightsArray:n,shadowsArray:i,lightProbeGridArray:r,camera:null,lights:e,transmissionRenderTarget:{},textureUnits:0};return{init:s,state:f,setupLights:c,setupLightsView:u,pushLight:o,pushShadow:a,pushLightProbeGrid:l}}function y3(t){let e=new WeakMap;function n(r,s=0){let o=e.get(r),a;return o===void 0?(a=new vb(t),e.set(r,[a])):s>=o.length?(a=new vb(t),o.push(a)):a=o[s],a}function i(){e=new WeakMap}return{get:n,dispose:i}}var _3=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,b3=`uniform sampler2D shadow_pass;
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
}`,M3=[new P(1,0,0),new P(-1,0,0),new P(0,1,0),new P(0,-1,0),new P(0,0,1),new P(0,0,-1)],S3=[new P(0,-1,0),new P(0,-1,0),new P(0,0,1),new P(0,0,-1),new P(0,-1,0),new P(0,-1,0)],yb=new Ot,fu=new P,gg=new P;function w3(t,e,n){let i=new $c,r=new pt,s=new pt,o=new Vt,a=new Hf,l=new Wf,c={},u=n.maxTextureSize,f={[is]:Ii,[Ii]:is,[rs]:rs},h=new Ft({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new pt},radius:{value:4}},vertexShader:_3,fragmentShader:b3}),d=h.clone();d.defines.HORIZONTAL_PASS=1;let g=new Fn;g.setAttribute("position",new hn(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));let x=new Xt(g,h),m=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=tu;let p=this.type;this.render=function(w,E,y){if(m.enabled===!1||m.autoUpdate===!1&&m.needsUpdate===!1||w.length===0)return;this.type===g_&&(dt("WebGLShadowMap: PCFSoftShadowMap has been removed. Using PCFShadowMap instead."),this.type=tu);let T=t.getRenderTarget(),R=t.getActiveCubeFace(),F=t.getActiveMipmapLevel(),O=t.state;O.setBlending(Bi),O.buffers.depth.getReversed()===!0?O.buffers.color.setClear(0,0,0,0):O.buffers.color.setClear(1,1,1,1),O.buffers.depth.setTest(!0),O.setScissorTest(!1);let z=p!==this.type;z&&E.traverse(function(L){L.material&&(Array.isArray(L.material)?L.material.forEach(V=>V.needsUpdate=!0):L.material.needsUpdate=!0)});for(let L=0,V=w.length;L<V;L++){let N=w[L],D=N.shadow;if(D===void 0){dt("WebGLShadowMap:",N,"has no shadow.");continue}if(D.autoUpdate===!1&&D.needsUpdate===!1)continue;r.copy(D.mapSize);let H=D.getFrameExtents();r.multiply(H),s.copy(D.mapSize),(r.x>u||r.y>u)&&(r.x>u&&(s.x=Math.floor(u/H.x),r.x=s.x*H.x,D.mapSize.x=s.x),r.y>u&&(s.y=Math.floor(u/H.y),r.y=s.y*H.y,D.mapSize.y=s.y));let G=t.state.buffers.depth.getReversed();if(D.camera._reversedDepth=G,D.map===null||z===!0){if(D.map!==null&&(D.map.depthTexture!==null&&(D.map.depthTexture.dispose(),D.map.depthTexture=null),D.map.dispose()),this.type===bl){if(N.isPointLight){dt("WebGLShadowMap: VSM shadow maps are not supported for PointLights. Use PCF or BasicShadowMap instead.");continue}D.map=new Hn(r.x,r.y,{format:bo,type:gi,minFilter:Lt,magFilter:Lt,generateMipmaps:!1}),D.map.texture.name=N.name+".shadowMap",D.map.depthTexture=new po(r.x,r.y,xr),D.map.depthTexture.name=N.name+".shadowMapDepth",D.map.depthTexture.format=Kr,D.map.depthTexture.compareFunction=null,D.map.depthTexture.minFilter=Qn,D.map.depthTexture.magFilter=Qn}else N.isPointLight?(D.map=new Zd(r.x),D.map.depthTexture=new Vf(r.x,Fr)):(D.map=new Hn(r.x,r.y),D.map.depthTexture=new po(r.x,r.y,Fr)),D.map.depthTexture.name=N.name+".shadowMap",D.map.depthTexture.format=Kr,this.type===tu?(D.map.depthTexture.compareFunction=G?Xd:$d,D.map.depthTexture.minFilter=Lt,D.map.depthTexture.magFilter=Lt):(D.map.depthTexture.compareFunction=null,D.map.depthTexture.minFilter=Qn,D.map.depthTexture.magFilter=Qn);D.camera.updateProjectionMatrix()}D.map.isWebGLCubeRenderTarget!==!0&&(D.map.width!==r.x||D.map.height!==r.y)&&D.map.setSize(r.x,r.y);let $=D.map.isWebGLCubeRenderTarget?6:D.getViewportCount();N.isPointLight!==!0&&D.updateMatrices(N,y);for(let J=0;J<$;J++){let ve=D.getCamera(J);if(N.isPointLight){let ye=D.camera,rt=D.matrix,ze=N.distance||ye.far;ze!==ye.far&&(ye.far=ze,ye.updateProjectionMatrix()),fu.setFromMatrixPosition(N.matrixWorld),ye.position.copy(fu),gg.copy(ye.position),gg.add(M3[J]),ye.up.copy(S3[J]),ye.lookAt(gg),ye.updateMatrixWorld(),rt.makeTranslation(-fu.x,-fu.y,-fu.z),yb.multiplyMatrices(ye.projectionMatrix,ye.matrixWorldInverse),D._frustum.setFromProjectionMatrix(yb,ye.coordinateSystem,ye.reversedDepth)}if(D.map.isWebGLCubeRenderTarget)t.setRenderTarget(D.map,J),t.clear();else{J===0&&(t.setRenderTarget(D.map),t.clear());let ye=D.getViewport(J);o.set(s.x*ye.x,s.y*ye.y,s.x*ye.z,s.y*ye.w),O.viewport(o)}i=D.getFrustum(J),v(E,y,ve,N,this.type)}D.isPointLightShadow!==!0&&this.type===bl&&_(D,y),D.needsUpdate=!1}p=this.type,m.needsUpdate=!1,t.setRenderTarget(T,R,F)};function _(w,E){let y=e.update(x);h.defines.VSM_SAMPLES!==w.blurSamples&&(h.defines.VSM_SAMPLES=w.blurSamples,d.defines.VSM_SAMPLES=w.blurSamples,h.needsUpdate=!0,d.needsUpdate=!0),w.mapPass===null?w.mapPass=new Hn(r.x,r.y,{format:bo,type:gi}):(w.mapPass.width!==w.map.width||w.mapPass.height!==w.map.height)&&w.mapPass.setSize(w.map.width,w.map.height),h.uniforms.shadow_pass.value=w.map.depthTexture,h.uniforms.resolution.value.set(w.map.width,w.map.height),h.uniforms.radius.value=w.radius,t.setRenderTarget(w.mapPass),t.clear(),t.renderBufferDirect(E,null,y,h,x,null),d.uniforms.shadow_pass.value=w.mapPass.texture,d.uniforms.resolution.value.set(w.map.width,w.map.height),d.uniforms.radius.value=w.radius,t.setRenderTarget(w.map),t.clear(),t.renderBufferDirect(E,null,y,d,x,null)}function M(w,E,y,T){let R=null,F=y.isPointLight===!0?w.customDistanceMaterial:w.customDepthMaterial;if(F!==void 0)R=F;else if(R=y.isPointLight===!0?l:a,t.localClippingEnabled&&E.clipShadows===!0&&Array.isArray(E.clippingPlanes)&&E.clippingPlanes.length!==0||E.displacementMap&&E.displacementScale!==0||E.alphaMap&&E.alphaTest>0||E.map&&E.alphaTest>0||E.alphaToCoverage===!0){let O=R.uuid,z=E.uuid,L=c[O];L===void 0&&(L={},c[O]=L);let V=L[z];V===void 0&&(V=R.clone(),L[z]=V,E.addEventListener("dispose",S)),R=V}if(R.visible=E.visible,R.wireframe=E.wireframe,T===bl?R.side=E.shadowSide!==null?E.shadowSide:E.side:R.side=E.shadowSide!==null?E.shadowSide:f[E.side],R.alphaMap=E.alphaMap,R.alphaTest=E.alphaToCoverage===!0?.5:E.alphaTest,R.map=E.map,R.clipShadows=E.clipShadows,R.clippingPlanes=E.clippingPlanes,R.clipIntersection=E.clipIntersection,R.displacementMap=E.displacementMap,R.displacementScale=E.displacementScale,R.displacementBias=E.displacementBias,R.wireframeLinewidth=E.wireframeLinewidth,R.linewidth=E.linewidth,y.isPointLight===!0&&R.isMeshDistanceMaterial===!0){let O=t.properties.get(R);O.light=y}return R}function v(w,E,y,T,R){if(w.visible===!1)return;if(w.layers.test(E.layers)&&(w.isMesh||w.isLine||w.isPoints)&&(w.castShadow||w.receiveShadow&&R===bl)&&(!w.frustumCulled||w.intersectsFrustum(i))){w.modelViewMatrix.multiplyMatrices(y.matrixWorldInverse,w.matrixWorld);let z=e.update(w),L=w.material;if(Array.isArray(L)){let V=z.groups;for(let N=0,D=V.length;N<D;N++){let H=V[N],G=L[H.materialIndex];if(G&&G.visible){let $=M(w,G,T,R);w.onBeforeShadow(t,w,E,y,z,$,H),t.renderBufferDirect(y,null,z,$,w,H),w.onAfterShadow(t,w,E,y,z,$,H)}}}else if(L.visible){let V=M(w,L,T,R);w.onBeforeShadow(t,w,E,y,z,V,null),t.renderBufferDirect(y,null,z,V,w,null),w.onAfterShadow(t,w,E,y,z,V,null)}}let O=w.children;for(let z=0,L=O.length;z<L;z++)v(O[z],E,y,T,R)}function S(w){w.target.removeEventListener("dispose",S);for(let y in c){let T=c[y],R=w.target.uuid;R in T&&(T[R].dispose(),delete T[R])}}}function A3(t,e){function n(){let U=!1,Me=new Vt,ie=null,Ae=new Vt(0,0,0,0);return{setMask:function(ue){ie!==ue&&!U&&(t.colorMask(ue,ue,ue,ue),ie=ue)},setLocked:function(ue){U=ue},setClear:function(ue,se,Ne,Ge,an){an===!0&&(ue*=Ge,se*=Ge,Ne*=Ge),Me.set(ue,se,Ne,Ge),Ae.equals(Me)===!1&&(t.clearColor(ue,se,Ne,Ge),Ae.copy(Me))},reset:function(){U=!1,ie=null,Ae.set(-1,0,0,0)}}}function i(){let U=!1,Me=!1,ie=null,Ae=null,ue=null;return{setReversed:function(se){if(Me!==se){let Ne=e.get("EXT_clip_control");se?Ne.clipControlEXT(Ne.LOWER_LEFT_EXT,Ne.ZERO_TO_ONE_EXT):Ne.clipControlEXT(Ne.LOWER_LEFT_EXT,Ne.NEGATIVE_ONE_TO_ONE_EXT),Me=se;let Ge=ue;ue=null,this.setClear(Ge)}},getReversed:function(){return Me},setTest:function(se){se?te(t.DEPTH_TEST):Te(t.DEPTH_TEST)},setMask:function(se){ie!==se&&!U&&(t.depthMask(se),ie=se)},setFunc:function(se){if(Me&&(se=q_[se]),Ae!==se){switch(se){case bf:t.depthFunc(t.NEVER);break;case Mf:t.depthFunc(t.ALWAYS);break;case Sf:t.depthFunc(t.LESS);break;case dl:t.depthFunc(t.LEQUAL);break;case wf:t.depthFunc(t.EQUAL);break;case Af:t.depthFunc(t.GEQUAL);break;case Tf:t.depthFunc(t.GREATER);break;case Ef:t.depthFunc(t.NOTEQUAL);break;default:t.depthFunc(t.LEQUAL)}Ae=se}},setLocked:function(se){U=se},setClear:function(se){ue!==se&&(ue=se,Me&&(se=1-se),t.clearDepth(se))},reset:function(){U=!1,ie=null,Ae=null,ue=null,Me=!1}}}function r(){let U=!1,Me=null,ie=null,Ae=null,ue=null,se=null,Ne=null,Ge=null,an=null;return{setTest:function(Ut){U||(Ut?te(t.STENCIL_TEST):Te(t.STENCIL_TEST))},setMask:function(Ut){Me!==Ut&&!U&&(t.stencilMask(Ut),Me=Ut)},setFunc:function(Ut,ci,fr){(ie!==Ut||Ae!==ci||ue!==fr)&&(t.stencilFunc(Ut,ci,fr),ie=Ut,Ae=ci,ue=fr)},setOp:function(Ut,ci,fr){(se!==Ut||Ne!==ci||Ge!==fr)&&(t.stencilOp(Ut,ci,fr),se=Ut,Ne=ci,Ge=fr)},setLocked:function(Ut){U=Ut},setClear:function(Ut){an!==Ut&&(t.clearStencil(Ut),an=Ut)},reset:function(){U=!1,Me=null,ie=null,Ae=null,ue=null,se=null,Ne=null,Ge=null,an=null}}}let s=new n,o=new i,a=new r,l=new WeakMap,c=new WeakMap,u={},f={},h={},d=new WeakMap,g=[],x=null,m=!1,p=null,_=null,M=null,v=null,S=null,w=null,E=null,y=new Pt(0,0,0),T=0,R=!1,F=null,O=null,z=null,L=null,V=null,N=t.getParameter(t.MAX_COMBINED_TEXTURE_IMAGE_UNITS),D=!1,H=0,G=t.getParameter(t.VERSION);G.indexOf("WebGL")!==-1?(H=parseFloat(/^WebGL (\d)/.exec(G)[1]),D=H>=1):G.indexOf("OpenGL ES")!==-1&&(H=parseFloat(/^OpenGL ES (\d)/.exec(G)[1]),D=H>=2);let $=null,J={},ve=t.getParameter(t.SCISSOR_BOX),ye=t.getParameter(t.VIEWPORT),rt=new Vt().fromArray(ve),ze=new Vt().fromArray(ye);function nt(U,Me,ie,Ae){let ue=new Uint8Array(4),se=t.createTexture();t.bindTexture(U,se),t.texParameteri(U,t.TEXTURE_MIN_FILTER,t.NEAREST),t.texParameteri(U,t.TEXTURE_MAG_FILTER,t.NEAREST);for(let Ne=0;Ne<ie;Ne++)U===t.TEXTURE_3D||U===t.TEXTURE_2D_ARRAY?t.texImage3D(Me,0,t.RGBA,1,1,Ae,0,t.RGBA,t.UNSIGNED_BYTE,ue):t.texImage2D(Me+Ne,0,t.RGBA,1,1,0,t.RGBA,t.UNSIGNED_BYTE,ue);return se}let Z={};Z[t.TEXTURE_2D]=nt(t.TEXTURE_2D,t.TEXTURE_2D,1),Z[t.TEXTURE_CUBE_MAP]=nt(t.TEXTURE_CUBE_MAP,t.TEXTURE_CUBE_MAP_POSITIVE_X,6),Z[t.TEXTURE_2D_ARRAY]=nt(t.TEXTURE_2D_ARRAY,t.TEXTURE_2D_ARRAY,1,1),Z[t.TEXTURE_3D]=nt(t.TEXTURE_3D,t.TEXTURE_3D,1,1),s.setClear(0,0,0,1),o.setClear(1),a.setClear(0),te(t.DEPTH_TEST),o.setFunc(dl),Ce(!1),Le(N0),te(t.CULL_FACE),Ze(Bi);function te(U){u[U]!==!0&&(t.enable(U),u[U]=!0)}function Te(U){u[U]!==!1&&(t.disable(U),u[U]=!1)}function je(U,Me){return h[U]!==Me?(t.bindFramebuffer(U,Me),h[U]=Me,U===t.DRAW_FRAMEBUFFER&&(h[t.FRAMEBUFFER]=Me),U===t.FRAMEBUFFER&&(h[t.DRAW_FRAMEBUFFER]=Me),!0):!1}function Re(U,Me){let ie=g,Ae=!1;if(U){ie=d.get(Me),ie===void 0&&(ie=[],d.set(Me,ie));let ue=U.textures;if(ie.length!==ue.length||ie[0]!==t.COLOR_ATTACHMENT0){for(let se=0,Ne=ue.length;se<Ne;se++)ie[se]=t.COLOR_ATTACHMENT0+se;ie.length=ue.length,Ae=!0}}else ie[0]!==t.BACK&&(ie[0]=t.BACK,Ae=!0);Ae&&t.drawBuffers(ie)}function le(U){return x!==U?(t.useProgram(U),x=U,!0):!1}let ge={[Ns]:t.FUNC_ADD,[x_]:t.FUNC_SUBTRACT,[v_]:t.FUNC_REVERSE_SUBTRACT};ge[y_]=t.MIN,ge[__]=t.MAX;let Oe={[b_]:t.ZERO,[nu]:t.ONE,[M_]:t.SRC_COLOR,[U0]:t.SRC_ALPHA,[R_]:t.SRC_ALPHA_SATURATE,[T_]:t.DST_COLOR,[w_]:t.DST_ALPHA,[S_]:t.ONE_MINUS_SRC_COLOR,[Ml]:t.ONE_MINUS_SRC_ALPHA,[E_]:t.ONE_MINUS_DST_COLOR,[A_]:t.ONE_MINUS_DST_ALPHA,[C_]:t.CONSTANT_COLOR,[P_]:t.ONE_MINUS_CONSTANT_COLOR,[I_]:t.CONSTANT_ALPHA,[L_]:t.ONE_MINUS_CONSTANT_ALPHA};function Ze(U,Me,ie,Ae,ue,se,Ne,Ge,an,Ut){if(U===Bi){m===!0&&(Te(t.BLEND),m=!1);return}if(m===!1&&(te(t.BLEND),m=!0),U!==rd){if(U!==p||Ut!==R){if((_!==Ns||S!==Ns)&&(t.blendEquation(t.FUNC_ADD),_=Ns,S=Ns),Ut)switch(U){case Or:t.blendFuncSeparate(t.ONE,t.ONE_MINUS_SRC_ALPHA,t.ONE,t.ONE_MINUS_SRC_ALPHA);break;case oa:t.blendFunc(t.ONE,t.ONE);break;case O0:t.blendFuncSeparate(t.ZERO,t.ONE_MINUS_SRC_COLOR,t.ZERO,t.ONE);break;case F0:t.blendFuncSeparate(t.DST_COLOR,t.ONE_MINUS_SRC_ALPHA,t.ZERO,t.ONE);break;default:gt("WebGLState: Invalid blending: ",U);break}else switch(U){case Or:t.blendFuncSeparate(t.SRC_ALPHA,t.ONE_MINUS_SRC_ALPHA,t.ONE,t.ONE_MINUS_SRC_ALPHA);break;case oa:t.blendFuncSeparate(t.SRC_ALPHA,t.ONE,t.ONE,t.ONE);break;case O0:gt("WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true");break;case F0:gt("WebGLState: MultiplyBlending requires material.premultipliedAlpha = true");break;default:gt("WebGLState: Invalid blending: ",U);break}M=null,v=null,w=null,E=null,y.set(0,0,0),T=0,p=U,R=Ut}return}ue=ue||Me,se=se||ie,Ne=Ne||Ae,(Me!==_||ue!==S)&&(t.blendEquationSeparate(ge[Me],ge[ue]),_=Me,S=ue),(ie!==M||Ae!==v||se!==w||Ne!==E)&&(t.blendFuncSeparate(Oe[ie],Oe[Ae],Oe[se],Oe[Ne]),M=ie,v=Ae,w=se,E=Ne),(Ge.equals(y)===!1||an!==T)&&(t.blendColor(Ge.r,Ge.g,Ge.b,an),y.copy(Ge),T=an),p=U,R=!1}function St(U,Me){U.side===rs?Te(t.CULL_FACE):te(t.CULL_FACE);let ie=U.side===Ii;Me&&(ie=!ie),Ce(ie),U.blending===Or&&U.transparent===!1?Ze(Bi):Ze(U.blending,U.blendEquation,U.blendSrc,U.blendDst,U.blendEquationAlpha,U.blendSrcAlpha,U.blendDstAlpha,U.blendColor,U.blendAlpha,U.premultipliedAlpha),o.setFunc(U.depthFunc),o.setTest(U.depthTest),o.setMask(U.depthWrite),s.setMask(U.colorWrite);let Ae=U.stencilWrite;a.setTest(Ae),Ae&&(a.setMask(U.stencilWriteMask),a.setFunc(U.stencilFunc,U.stencilRef,U.stencilFuncMask),a.setOp(U.stencilFail,U.stencilZFail,U.stencilZPass)),on(U.polygonOffset,U.polygonOffsetFactor,U.polygonOffsetUnits),U.alphaToCoverage===!0?te(t.SAMPLE_ALPHA_TO_COVERAGE):Te(t.SAMPLE_ALPHA_TO_COVERAGE)}function Ce(U){F!==U&&(U?t.frontFace(t.CW):t.frontFace(t.CCW),F=U)}function Le(U){U!==p_?(te(t.CULL_FACE),U!==O&&(U===N0?t.cullFace(t.BACK):U===m_?t.cullFace(t.FRONT):t.cullFace(t.FRONT_AND_BACK))):Te(t.CULL_FACE),O=U}function at(U){U!==z&&(D&&t.lineWidth(U),z=U)}function on(U,Me,ie){U?(te(t.POLYGON_OFFSET_FILL),(L!==Me||V!==ie)&&(L=Me,V=ie,o.getReversed()&&(Me=-Me),t.polygonOffset(Me,ie))):Te(t.POLYGON_OFFSET_FILL)}function tn(U){U?te(t.SCISSOR_TEST):Te(t.SCISSOR_TEST)}function nn(U){U===void 0&&(U=t.TEXTURE0+N-1),$!==U&&(t.activeTexture(U),$=U)}function k(U,Me,ie){ie===void 0&&($===null?ie=t.TEXTURE0+N-1:ie=$);let Ae=J[ie];Ae===void 0&&(Ae={type:void 0,texture:void 0},J[ie]=Ae),(Ae.type!==U||Ae.texture!==Me)&&($!==ie&&(t.activeTexture(ie),$=ie),t.bindTexture(U,Me||Z[U]),Ae.type=U,Ae.texture=Me)}function Bn(){let U=J[$];U!==void 0&&U.type!==void 0&&(t.bindTexture(U.type,null),U.type=void 0,U.texture=void 0)}function Tt(){try{t.compressedTexImage2D(...arguments)}catch(U){gt("WebGLState:",U)}}function I(){try{t.compressedTexImage3D(...arguments)}catch(U){gt("WebGLState:",U)}}function b(){try{t.texSubImage2D(...arguments)}catch(U){gt("WebGLState:",U)}}function W(){try{t.texSubImage3D(...arguments)}catch(U){gt("WebGLState:",U)}}function K(){try{t.compressedTexSubImage2D(...arguments)}catch(U){gt("WebGLState:",U)}}function ne(){try{t.compressedTexSubImage3D(...arguments)}catch(U){gt("WebGLState:",U)}}function we(){try{t.texStorage2D(...arguments)}catch(U){gt("WebGLState:",U)}}function Fe(){try{t.texStorage3D(...arguments)}catch(U){gt("WebGLState:",U)}}function re(){try{t.texImage2D(...arguments)}catch(U){gt("WebGLState:",U)}}function oe(){try{t.texImage3D(...arguments)}catch(U){gt("WebGLState:",U)}}function De(U){return f[U]!==void 0?f[U]:t.getParameter(U)}function Qe(U,Me){f[U]!==Me&&(t.pixelStorei(U,Me),f[U]=Me)}function C(U){rt.equals(U)===!1&&(t.scissor(U.x,U.y,U.z,U.w),rt.copy(U))}function X(U){ze.equals(U)===!1&&(t.viewport(U.x,U.y,U.z,U.w),ze.copy(U))}function ae(U,Me){let ie=c.get(Me);ie===void 0&&(ie=new WeakMap,c.set(Me,ie));let Ae=ie.get(U);Ae===void 0&&(Ae=t.getUniformBlockIndex(Me,U.name),ie.set(U,Ae))}function Se(U,Me){let Ae=c.get(Me).get(U);l.get(Me)!==Ae&&(t.uniformBlockBinding(Me,Ae,U.__bindingPointIndex),l.set(Me,Ae))}function We(){t.disable(t.BLEND),t.disable(t.CULL_FACE),t.disable(t.DEPTH_TEST),t.disable(t.POLYGON_OFFSET_FILL),t.disable(t.SCISSOR_TEST),t.disable(t.STENCIL_TEST),t.disable(t.SAMPLE_ALPHA_TO_COVERAGE),t.blendEquation(t.FUNC_ADD),t.blendFunc(t.ONE,t.ZERO),t.blendFuncSeparate(t.ONE,t.ZERO,t.ONE,t.ZERO),t.blendColor(0,0,0,0),t.colorMask(!0,!0,!0,!0),t.clearColor(0,0,0,0),t.depthMask(!0),t.depthFunc(t.LESS),o.setReversed(!1),t.clearDepth(1),t.stencilMask(4294967295),t.stencilFunc(t.ALWAYS,0,4294967295),t.stencilOp(t.KEEP,t.KEEP,t.KEEP),t.clearStencil(0),t.cullFace(t.BACK),t.frontFace(t.CCW),t.polygonOffset(0,0),t.activeTexture(t.TEXTURE0),t.bindFramebuffer(t.FRAMEBUFFER,null),t.bindFramebuffer(t.DRAW_FRAMEBUFFER,null),t.bindFramebuffer(t.READ_FRAMEBUFFER,null),t.useProgram(null),t.lineWidth(1),t.scissor(0,0,t.canvas.width,t.canvas.height),t.viewport(0,0,t.canvas.width,t.canvas.height),t.pixelStorei(t.PACK_ALIGNMENT,4),t.pixelStorei(t.UNPACK_ALIGNMENT,4),t.pixelStorei(t.UNPACK_FLIP_Y_WEBGL,!1),t.pixelStorei(t.UNPACK_PREMULTIPLY_ALPHA_WEBGL,!1),t.pixelStorei(t.UNPACK_COLORSPACE_CONVERSION_WEBGL,t.BROWSER_DEFAULT_WEBGL),t.pixelStorei(t.PACK_ROW_LENGTH,0),t.pixelStorei(t.PACK_SKIP_PIXELS,0),t.pixelStorei(t.PACK_SKIP_ROWS,0),t.pixelStorei(t.UNPACK_ROW_LENGTH,0),t.pixelStorei(t.UNPACK_IMAGE_HEIGHT,0),t.pixelStorei(t.UNPACK_SKIP_PIXELS,0),t.pixelStorei(t.UNPACK_SKIP_ROWS,0),t.pixelStorei(t.UNPACK_SKIP_IMAGES,0),u={},f={},$=null,J={},h={},d=new WeakMap,g=[],x=null,m=!1,p=null,_=null,M=null,v=null,S=null,w=null,E=null,y=new Pt(0,0,0),T=0,R=!1,F=null,O=null,z=null,L=null,V=null,rt.set(0,0,t.canvas.width,t.canvas.height),ze.set(0,0,t.canvas.width,t.canvas.height),s.reset(),o.reset(),a.reset()}return{buffers:{color:s,depth:o,stencil:a},enable:te,disable:Te,bindFramebuffer:je,drawBuffers:Re,useProgram:le,setBlending:Ze,setMaterial:St,setFlipSided:Ce,setCullFace:Le,setLineWidth:at,setPolygonOffset:on,setScissorTest:tn,activeTexture:nn,bindTexture:k,unbindTexture:Bn,compressedTexImage2D:Tt,compressedTexImage3D:I,texImage2D:re,texImage3D:oe,pixelStorei:Qe,getParameter:De,updateUBOMapping:ae,uniformBlockBinding:Se,texStorage2D:we,texStorage3D:Fe,texSubImage2D:b,texSubImage3D:W,compressedTexSubImage2D:K,compressedTexSubImage3D:ne,scissor:C,viewport:X,reset:We}}function T3(t,e,n,i,r,s,o){let a=e.has("WEBGL_multisampled_render_to_texture")?e.get("WEBGL_multisampled_render_to_texture"):null,l=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),c=new pt,u=new WeakMap,f=new Set,h,d=new WeakMap,g=!1;try{g=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function x(I,b){return g?new OffscreenCanvas(I,b):Uc("canvas")}function m(I,b,W){let K=1,ne=Tt(I);if((ne.width>W||ne.height>W)&&(K=W/Math.max(ne.width,ne.height)),K<1)if(typeof HTMLImageElement<"u"&&I instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&I instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&I instanceof ImageBitmap||typeof VideoFrame<"u"&&I instanceof VideoFrame){let we=Math.floor(K*ne.width),Fe=Math.floor(K*ne.height);h===void 0&&(h=x(we,Fe));let re=b?x(we,Fe):h;return re.width=we,re.height=Fe,re.getContext("2d").drawImage(I,0,0,we,Fe),dt("WebGLRenderer: Texture has been resized from ("+ne.width+"x"+ne.height+") to ("+we+"x"+Fe+")."),re}else return"data"in I&&dt("WebGLRenderer: Image in DataTexture is too big ("+ne.width+"x"+ne.height+")."),I;return I}function p(I){return I.generateMipmaps}function _(I){t.generateMipmap(I)}function M(I){return I.isWebGLCubeRenderTarget?t.TEXTURE_CUBE_MAP:I.isWebGL3DRenderTarget?t.TEXTURE_3D:I.isWebGLArrayRenderTarget||I.isCompressedArrayTexture?t.TEXTURE_2D_ARRAY:t.TEXTURE_2D}function v(I,b,W,K,ne,we=!1){if(I!==null){if(t[I]!==void 0)return t[I];dt("WebGLRenderer: Attempt to use non-existing WebGL internal format '"+I+"'")}let Fe;K&&(Fe=e.get("EXT_texture_norm16"),Fe||dt("WebGLRenderer: Unable to use normalized textures without EXT_texture_norm16 extension"));let re=b;if(b===t.RED&&(W===t.FLOAT&&(re=t.R32F),W===t.HALF_FLOAT&&(re=t.R16F),W===t.UNSIGNED_BYTE&&(re=t.R8),W===t.UNSIGNED_SHORT&&Fe&&(re=Fe.R16_EXT),W===t.SHORT&&Fe&&(re=Fe.R16_SNORM_EXT)),b===t.RED_INTEGER&&(W===t.UNSIGNED_BYTE&&(re=t.R8UI),W===t.UNSIGNED_SHORT&&(re=t.R16UI),W===t.UNSIGNED_INT&&(re=t.R32UI),W===t.BYTE&&(re=t.R8I),W===t.SHORT&&(re=t.R16I),W===t.INT&&(re=t.R32I)),b===t.RG&&(W===t.FLOAT&&(re=t.RG32F),W===t.HALF_FLOAT&&(re=t.RG16F),W===t.UNSIGNED_BYTE&&(re=t.RG8),W===t.UNSIGNED_SHORT&&Fe&&(re=Fe.RG16_EXT),W===t.SHORT&&Fe&&(re=Fe.RG16_SNORM_EXT)),b===t.RG_INTEGER&&(W===t.UNSIGNED_BYTE&&(re=t.RG8UI),W===t.UNSIGNED_SHORT&&(re=t.RG16UI),W===t.UNSIGNED_INT&&(re=t.RG32UI),W===t.BYTE&&(re=t.RG8I),W===t.SHORT&&(re=t.RG16I),W===t.INT&&(re=t.RG32I)),b===t.RGB_INTEGER&&(W===t.UNSIGNED_BYTE&&(re=t.RGB8UI),W===t.UNSIGNED_SHORT&&(re=t.RGB16UI),W===t.UNSIGNED_INT&&(re=t.RGB32UI),W===t.BYTE&&(re=t.RGB8I),W===t.SHORT&&(re=t.RGB16I),W===t.INT&&(re=t.RGB32I)),b===t.RGBA_INTEGER&&(W===t.UNSIGNED_BYTE&&(re=t.RGBA8UI),W===t.UNSIGNED_SHORT&&(re=t.RGBA16UI),W===t.UNSIGNED_INT&&(re=t.RGBA32UI),W===t.BYTE&&(re=t.RGBA8I),W===t.SHORT&&(re=t.RGBA16I),W===t.INT&&(re=t.RGBA32I)),b===t.RGB&&(W===t.UNSIGNED_SHORT&&Fe&&(re=Fe.RGB16_EXT),W===t.SHORT&&Fe&&(re=Fe.RGB16_SNORM_EXT),W===t.UNSIGNED_INT_5_9_9_9_REV&&(re=t.RGB9_E5),W===t.UNSIGNED_INT_10F_11F_11F_REV&&(re=t.R11F_G11F_B10F)),b===t.RGBA){let oe=we?Oc:Et.getTransfer(ne);W===t.FLOAT&&(re=t.RGBA32F),W===t.HALF_FLOAT&&(re=t.RGBA16F),W===t.UNSIGNED_BYTE&&(re=oe===Kt?t.SRGB8_ALPHA8:t.RGBA8),W===t.UNSIGNED_SHORT&&Fe&&(re=Fe.RGBA16_EXT),W===t.SHORT&&Fe&&(re=Fe.RGBA16_SNORM_EXT),W===t.UNSIGNED_SHORT_4_4_4_4&&(re=t.RGBA4),W===t.UNSIGNED_SHORT_5_5_5_1&&(re=t.RGB5_A1)}return(re===t.R16F||re===t.R32F||re===t.RG16F||re===t.RG32F||re===t.RGBA16F||re===t.RGBA32F)&&e.get("EXT_color_buffer_float"),re}function S(I,b){let W;return I?b===null||b===Fr||b===wl?W=t.DEPTH24_STENCIL8:b===xr?W=t.DEPTH32F_STENCIL8:b===Sl&&(W=t.DEPTH24_STENCIL8,dt("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):b===null||b===Fr||b===wl?W=t.DEPTH_COMPONENT24:b===xr?W=t.DEPTH_COMPONENT32F:b===Sl&&(W=t.DEPTH_COMPONENT16),W}function w(I,b){return p(I)===!0||I.isFramebufferTexture&&I.minFilter!==Qn&&I.minFilter!==Lt?Math.log2(Math.max(b.width,b.height))+1:I.mipmaps!==void 0&&I.mipmaps.length>0?I.mipmaps.length:I.isCompressedTexture&&Array.isArray(I.image)?b.mipmaps.length:1}function E(I){let b=I.target;b.removeEventListener("dispose",E),T(b),b.isVideoTexture&&u.delete(b),b.isHTMLTexture&&f.delete(b)}function y(I){let b=I.target;b.removeEventListener("dispose",y),F(b)}function T(I){let b=i.get(I);if(b.__webglInit===void 0)return;let W=I.source,K=d.get(W);if(K){let ne=K[b.__cacheKey];ne.usedTimes--,ne.usedTimes===0&&R(I),Object.keys(K).length===0&&d.delete(W)}i.remove(I)}function R(I){let b=i.get(I);t.deleteTexture(b.__webglTexture);let W=I.source,K=d.get(W);delete K[b.__cacheKey],o.memory.textures--}function F(I){let b=i.get(I);if(I.depthTexture&&(I.depthTexture.dispose(),i.remove(I.depthTexture)),I.isWebGLCubeRenderTarget)for(let K=0;K<6;K++){if(Array.isArray(b.__webglFramebuffer[K]))for(let ne=0;ne<b.__webglFramebuffer[K].length;ne++)t.deleteFramebuffer(b.__webglFramebuffer[K][ne]);else t.deleteFramebuffer(b.__webglFramebuffer[K]);b.__webglDepthbuffer&&t.deleteRenderbuffer(b.__webglDepthbuffer[K])}else{if(Array.isArray(b.__webglFramebuffer))for(let K=0;K<b.__webglFramebuffer.length;K++)t.deleteFramebuffer(b.__webglFramebuffer[K]);else t.deleteFramebuffer(b.__webglFramebuffer);if(b.__webglDepthbuffer&&t.deleteRenderbuffer(b.__webglDepthbuffer),b.__webglMultisampledFramebuffer&&t.deleteFramebuffer(b.__webglMultisampledFramebuffer),b.__webglColorRenderbuffer)for(let K=0;K<b.__webglColorRenderbuffer.length;K++)b.__webglColorRenderbuffer[K]&&t.deleteRenderbuffer(b.__webglColorRenderbuffer[K]);b.__webglDepthRenderbuffer&&t.deleteRenderbuffer(b.__webglDepthRenderbuffer)}let W=I.textures;for(let K=0,ne=W.length;K<ne;K++){let we=i.get(W[K]);we.__webglTexture&&(t.deleteTexture(we.__webglTexture),o.memory.textures--),i.remove(W[K])}i.remove(I)}let O=0;function z(){O=0}function L(){return O}function V(I){O=I}function N(){let I=O;return I>=r.maxTextures&&dt("WebGLTextures: Trying to use "+(I+1)+" texture units while this GPU supports only "+r.maxTextures),O+=1,I}function D(I){let b=[];return b.push(I.wrapS),b.push(I.wrapT),b.push(I.wrapR||0),b.push(I.magFilter),b.push(I.minFilter),b.push(I.anisotropy),b.push(I.internalFormat),b.push(I.format),b.push(I.type),b.push(I.generateMipmaps),b.push(I.premultiplyAlpha),b.push(I.flipY),b.push(I.unpackAlignment),b.push(I.colorSpace),b.join()}function H(I,b){let W=i.get(I);if(I.isVideoTexture&&k(I),I.isRenderTargetTexture===!1&&I.isExternalTexture!==!0&&I.version>0&&W.__version!==I.version){let K=I.image;if(K===null)dt("WebGLRenderer: Texture marked for update but no image data found.");else if(K.complete===!1)dt("WebGLRenderer: Texture marked for update but image is incomplete");else{Te(W,I,b);return}}else I.isExternalTexture&&(W.__webglTexture=I.sourceTexture?I.sourceTexture:null);n.bindTexture(t.TEXTURE_2D,W.__webglTexture,t.TEXTURE0+b)}function G(I,b){let W=i.get(I);if(I.isRenderTargetTexture===!1&&I.version>0&&W.__version!==I.version){Te(W,I,b);return}else I.isExternalTexture&&(W.__webglTexture=I.sourceTexture?I.sourceTexture:null);n.bindTexture(t.TEXTURE_2D_ARRAY,W.__webglTexture,t.TEXTURE0+b)}function $(I,b){let W=i.get(I);if(I.isRenderTargetTexture===!1&&I.version>0&&W.__version!==I.version){Te(W,I,b);return}n.bindTexture(t.TEXTURE_3D,W.__webglTexture,t.TEXTURE0+b)}function J(I,b){let W=i.get(I);if(I.isCubeDepthTexture!==!0&&I.version>0&&W.__version!==I.version){je(W,I,b);return}n.bindTexture(t.TEXTURE_CUBE_MAP,W.__webglTexture,t.TEXTURE0+b)}let ve={[Rf]:t.REPEAT,[mi]:t.CLAMP_TO_EDGE,[Cf]:t.MIRRORED_REPEAT},ye={[Qn]:t.NEAREST,[O_]:t.NEAREST_MIPMAP_NEAREST,[ru]:t.NEAREST_MIPMAP_LINEAR,[Lt]:t.LINEAR,[ad]:t.LINEAR_MIPMAP_NEAREST,[yo]:t.LINEAR_MIPMAP_LINEAR},rt={[B_]:t.NEVER,[W_]:t.ALWAYS,[z_]:t.LESS,[$d]:t.LEQUAL,[V_]:t.EQUAL,[Xd]:t.GEQUAL,[G_]:t.GREATER,[H_]:t.NOTEQUAL};function ze(I,b){if(b.type===xr&&e.has("OES_texture_float_linear")===!1&&(b.magFilter===Lt||b.magFilter===ad||b.magFilter===ru||b.magFilter===yo||b.minFilter===Lt||b.minFilter===ad||b.minFilter===ru||b.minFilter===yo)&&dt("WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),t.texParameteri(I,t.TEXTURE_WRAP_S,ve[b.wrapS]),t.texParameteri(I,t.TEXTURE_WRAP_T,ve[b.wrapT]),(I===t.TEXTURE_3D||I===t.TEXTURE_2D_ARRAY)&&t.texParameteri(I,t.TEXTURE_WRAP_R,ve[b.wrapR]),t.texParameteri(I,t.TEXTURE_MAG_FILTER,ye[b.magFilter]),t.texParameteri(I,t.TEXTURE_MIN_FILTER,ye[b.minFilter]),b.compareFunction&&(t.texParameteri(I,t.TEXTURE_COMPARE_MODE,t.COMPARE_REF_TO_TEXTURE),t.texParameteri(I,t.TEXTURE_COMPARE_FUNC,rt[b.compareFunction])),e.has("EXT_texture_filter_anisotropic")===!0){if(b.magFilter===Qn||b.minFilter!==ru&&b.minFilter!==yo||b.type===xr&&e.has("OES_texture_float_linear")===!1)return;if(b.anisotropy>1||i.get(b).__currentAnisotropy){let W=e.get("EXT_texture_filter_anisotropic");t.texParameterf(I,W.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(b.anisotropy,r.getMaxAnisotropy())),i.get(b).__currentAnisotropy=b.anisotropy}}}function nt(I,b){let W=!1;I.__webglInit===void 0&&(I.__webglInit=!0,b.addEventListener("dispose",E));let K=b.source,ne=d.get(K);ne===void 0&&(ne={},d.set(K,ne));let we=D(b);if(we!==I.__cacheKey){ne[we]===void 0&&(ne[we]={texture:t.createTexture(),usedTimes:0},o.memory.textures++,W=!0),ne[we].usedTimes++;let Fe=ne[I.__cacheKey];Fe!==void 0&&(ne[I.__cacheKey].usedTimes--,Fe.usedTimes===0&&R(b)),I.__cacheKey=we,I.__webglTexture=ne[we].texture}return W}function Z(I,b,W){return Math.floor(Math.floor(I/W)/b)}function te(I,b,W,K){let we=I.updateRanges;if(we.length===0)n.texSubImage2D(t.TEXTURE_2D,0,0,0,b.width,b.height,W,K,b.data);else{we.sort((Qe,C)=>Qe.start-C.start);let Fe=0;for(let Qe=1;Qe<we.length;Qe++){let C=we[Fe],X=we[Qe],ae=C.start+C.count,Se=Z(X.start,b.width,4),We=Z(C.start,b.width,4);X.start<=ae+1&&Se===We&&Z(X.start+X.count-1,b.width,4)===Se?C.count=Math.max(C.count,X.start+X.count-C.start):(++Fe,we[Fe]=X)}we.length=Fe+1;let re=n.getParameter(t.UNPACK_ROW_LENGTH),oe=n.getParameter(t.UNPACK_SKIP_PIXELS),De=n.getParameter(t.UNPACK_SKIP_ROWS);n.pixelStorei(t.UNPACK_ROW_LENGTH,b.width);for(let Qe=0,C=we.length;Qe<C;Qe++){let X=we[Qe],ae=Math.floor(X.start/4),Se=Math.ceil(X.count/4),We=ae%b.width,U=Math.floor(ae/b.width),Me=Se,ie=1;n.pixelStorei(t.UNPACK_SKIP_PIXELS,We),n.pixelStorei(t.UNPACK_SKIP_ROWS,U),n.texSubImage2D(t.TEXTURE_2D,0,We,U,Me,ie,W,K,b.data)}I.clearUpdateRanges(),n.pixelStorei(t.UNPACK_ROW_LENGTH,re),n.pixelStorei(t.UNPACK_SKIP_PIXELS,oe),n.pixelStorei(t.UNPACK_SKIP_ROWS,De)}}function Te(I,b,W){let K=t.TEXTURE_2D;(b.isDataArrayTexture||b.isCompressedArrayTexture)&&(K=t.TEXTURE_2D_ARRAY),b.isData3DTexture&&(K=t.TEXTURE_3D);let ne=nt(I,b),we=b.source;n.bindTexture(K,I.__webglTexture,t.TEXTURE0+W);let Fe=i.get(we);if(we.version!==Fe.__version||ne===!0){if(n.activeTexture(t.TEXTURE0+W),(typeof ImageBitmap<"u"&&b.image instanceof ImageBitmap)===!1){let ie=Et.getPrimaries(Et.workingColorSpace),Ae=b.colorSpace===Os?null:Et.getPrimaries(b.colorSpace),ue=b.colorSpace===Os||ie===Ae?t.NONE:t.BROWSER_DEFAULT_WEBGL;n.pixelStorei(t.UNPACK_FLIP_Y_WEBGL,b.flipY),n.pixelStorei(t.UNPACK_PREMULTIPLY_ALPHA_WEBGL,b.premultiplyAlpha),n.pixelStorei(t.UNPACK_COLORSPACE_CONVERSION_WEBGL,ue)}n.pixelStorei(t.UNPACK_ALIGNMENT,b.unpackAlignment);let oe=m(b.image,!1,r.maxTextureSize);oe=Bn(b,oe);let De=s.convert(b.format,b.colorSpace),Qe=s.convert(b.type),C=v(b.internalFormat,De,Qe,b.normalized,b.colorSpace,b.isVideoTexture);ze(K,b);let X,ae=b.mipmaps,Se=b.isVideoTexture!==!0,We=Fe.__version===void 0||ne===!0,U=we.dataReady,Me=w(b,oe);if(b.isDepthTexture)C=S(b.format===_o,b.type),We&&(Se?n.texStorage2D(t.TEXTURE_2D,1,C,oe.width,oe.height):n.texImage2D(t.TEXTURE_2D,0,C,oe.width,oe.height,0,De,Qe,null));else if(b.isDataTexture)if(ae.length>0){Se&&We&&n.texStorage2D(t.TEXTURE_2D,Me,C,ae[0].width,ae[0].height);for(let ie=0,Ae=ae.length;ie<Ae;ie++)X=ae[ie],Se?U&&n.texSubImage2D(t.TEXTURE_2D,ie,0,0,X.width,X.height,De,Qe,X.data):n.texImage2D(t.TEXTURE_2D,ie,C,X.width,X.height,0,De,Qe,X.data);b.generateMipmaps=!1}else Se?(We&&n.texStorage2D(t.TEXTURE_2D,Me,C,oe.width,oe.height),U&&te(b,oe,De,Qe)):n.texImage2D(t.TEXTURE_2D,0,C,oe.width,oe.height,0,De,Qe,oe.data);else if(b.isCompressedTexture)if(b.isCompressedArrayTexture){Se&&We&&n.texStorage3D(t.TEXTURE_2D_ARRAY,Me,C,ae[0].width,ae[0].height,oe.depth);for(let ie=0,Ae=ae.length;ie<Ae;ie++)if(X=ae[ie],b.format!==ri)if(De!==null)if(Se){if(U)if(b.layerUpdates.size>0){let ue=sg(X.width,X.height,b.format,b.type);for(let se of b.layerUpdates){let Ne=X.data.subarray(se*ue/X.data.BYTES_PER_ELEMENT,(se+1)*ue/X.data.BYTES_PER_ELEMENT);n.compressedTexSubImage3D(t.TEXTURE_2D_ARRAY,ie,0,0,se,X.width,X.height,1,De,Ne)}}else n.compressedTexSubImage3D(t.TEXTURE_2D_ARRAY,ie,0,0,0,X.width,X.height,oe.depth,De,X.data)}else n.compressedTexImage3D(t.TEXTURE_2D_ARRAY,ie,C,X.width,X.height,oe.depth,0,X.data,0,0);else dt("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else Se?U&&n.texSubImage3D(t.TEXTURE_2D_ARRAY,ie,0,0,0,X.width,X.height,oe.depth,De,Qe,X.data):n.texImage3D(t.TEXTURE_2D_ARRAY,ie,C,X.width,X.height,oe.depth,0,De,Qe,X.data);b.layerUpdates.size>0&&b.clearLayerUpdates()}else{Se&&We&&n.texStorage2D(t.TEXTURE_2D,Me,C,ae[0].width,ae[0].height);for(let ie=0,Ae=ae.length;ie<Ae;ie++)X=ae[ie],b.format!==ri?De!==null?Se?U&&n.compressedTexSubImage2D(t.TEXTURE_2D,ie,0,0,X.width,X.height,De,X.data):n.compressedTexImage2D(t.TEXTURE_2D,ie,C,X.width,X.height,0,X.data):dt("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):Se?U&&n.texSubImage2D(t.TEXTURE_2D,ie,0,0,X.width,X.height,De,Qe,X.data):n.texImage2D(t.TEXTURE_2D,ie,C,X.width,X.height,0,De,Qe,X.data)}else if(b.isDataArrayTexture)if(Se){if(We&&n.texStorage3D(t.TEXTURE_2D_ARRAY,Me,C,oe.width,oe.height,oe.depth),U)if(b.layerUpdates.size>0){let ie=sg(oe.width,oe.height,b.format,b.type);for(let Ae of b.layerUpdates){let ue=oe.data.subarray(Ae*ie/oe.data.BYTES_PER_ELEMENT,(Ae+1)*ie/oe.data.BYTES_PER_ELEMENT);n.texSubImage3D(t.TEXTURE_2D_ARRAY,0,0,0,Ae,oe.width,oe.height,1,De,Qe,ue)}b.clearLayerUpdates()}else n.texSubImage3D(t.TEXTURE_2D_ARRAY,0,0,0,0,oe.width,oe.height,oe.depth,De,Qe,oe.data)}else n.texImage3D(t.TEXTURE_2D_ARRAY,0,C,oe.width,oe.height,oe.depth,0,De,Qe,oe.data);else if(b.isData3DTexture)Se?(We&&n.texStorage3D(t.TEXTURE_3D,Me,C,oe.width,oe.height,oe.depth),U&&n.texSubImage3D(t.TEXTURE_3D,0,0,0,0,oe.width,oe.height,oe.depth,De,Qe,oe.data)):n.texImage3D(t.TEXTURE_3D,0,C,oe.width,oe.height,oe.depth,0,De,Qe,oe.data);else if(b.isFramebufferTexture){if(We)if(Se)n.texStorage2D(t.TEXTURE_2D,Me,C,oe.width,oe.height);else{let ie=oe.width,Ae=oe.height;for(let ue=0;ue<Me;ue++)n.texImage2D(t.TEXTURE_2D,ue,C,ie,Ae,0,De,Qe,null),ie>>=1,Ae>>=1}}else if(b.isHTMLTexture){if("texElementImage2D"in t){let ie=t.canvas;if(ie.hasAttribute("layoutsubtree")||ie.setAttribute("layoutsubtree","true"),oe.parentNode!==ie){ie.appendChild(oe),f.add(b),ie.onpaint=Ae=>{let ue=Ae.changedElements;for(let se of f)ue.includes(se.image)&&(se.needsUpdate=!0)},ie.requestPaint();return}if(t.texElementImage2D.length===3)t.texElementImage2D(t.TEXTURE_2D,t.RGBA8,oe);else{let ue=t.RGBA,se=t.RGBA,Ne=t.UNSIGNED_BYTE;t.texElementImage2D(t.TEXTURE_2D,0,ue,se,Ne,oe)}t.texParameteri(t.TEXTURE_2D,t.TEXTURE_MIN_FILTER,t.LINEAR),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_WRAP_S,t.CLAMP_TO_EDGE),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_WRAP_T,t.CLAMP_TO_EDGE)}}else if(ae.length>0){if(Se&&We){let ie=Tt(ae[0]);n.texStorage2D(t.TEXTURE_2D,Me,C,ie.width,ie.height)}for(let ie=0,Ae=ae.length;ie<Ae;ie++)X=ae[ie],Se?U&&n.texSubImage2D(t.TEXTURE_2D,ie,0,0,De,Qe,X):n.texImage2D(t.TEXTURE_2D,ie,C,De,Qe,X);b.generateMipmaps=!1}else if(Se){if(We){let ie=Tt(oe);n.texStorage2D(t.TEXTURE_2D,Me,C,ie.width,ie.height)}U&&n.texSubImage2D(t.TEXTURE_2D,0,0,0,De,Qe,oe)}else n.texImage2D(t.TEXTURE_2D,0,C,De,Qe,oe);p(b)&&_(K),Fe.__version=we.version,b.onUpdate&&b.onUpdate(b)}I.__version=b.version}function je(I,b,W){if(b.image.length!==6)return;let K=nt(I,b),ne=b.source;n.bindTexture(t.TEXTURE_CUBE_MAP,I.__webglTexture,t.TEXTURE0+W);let we=i.get(ne);if(ne.version!==we.__version||K===!0){n.activeTexture(t.TEXTURE0+W);let Fe=Et.getPrimaries(Et.workingColorSpace),re=b.colorSpace===Os?null:Et.getPrimaries(b.colorSpace),oe=b.colorSpace===Os||Fe===re?t.NONE:t.BROWSER_DEFAULT_WEBGL;n.pixelStorei(t.UNPACK_FLIP_Y_WEBGL,b.flipY),n.pixelStorei(t.UNPACK_PREMULTIPLY_ALPHA_WEBGL,b.premultiplyAlpha),n.pixelStorei(t.UNPACK_ALIGNMENT,b.unpackAlignment),n.pixelStorei(t.UNPACK_COLORSPACE_CONVERSION_WEBGL,oe);let De=b.isCompressedTexture||b.image[0].isCompressedTexture,Qe=b.image[0]&&b.image[0].isDataTexture,C=[];for(let se=0;se<6;se++)!De&&!Qe?C[se]=m(b.image[se],!0,r.maxCubemapSize):C[se]=Qe?b.image[se].image:b.image[se],C[se]=Bn(b,C[se]);let X=C[0],ae=s.convert(b.format,b.colorSpace),Se=s.convert(b.type),We=v(b.internalFormat,ae,Se,b.normalized,b.colorSpace),U=b.isVideoTexture!==!0,Me=we.__version===void 0||K===!0,ie=ne.dataReady,Ae=w(b,X);ze(t.TEXTURE_CUBE_MAP,b);let ue;if(De){U&&Me&&n.texStorage2D(t.TEXTURE_CUBE_MAP,Ae,We,X.width,X.height);for(let se=0;se<6;se++){ue=C[se].mipmaps;for(let Ne=0;Ne<ue.length;Ne++){let Ge=ue[Ne];b.format!==ri?ae!==null?U?ie&&n.compressedTexSubImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+se,Ne,0,0,Ge.width,Ge.height,ae,Ge.data):n.compressedTexImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+se,Ne,We,Ge.width,Ge.height,0,Ge.data):dt("WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):U?ie&&n.texSubImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+se,Ne,0,0,Ge.width,Ge.height,ae,Se,Ge.data):n.texImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+se,Ne,We,Ge.width,Ge.height,0,ae,Se,Ge.data)}}}else{if(ue=b.mipmaps,U&&Me){ue.length>0&&Ae++;let se=Tt(C[0]);n.texStorage2D(t.TEXTURE_CUBE_MAP,Ae,We,se.width,se.height)}for(let se=0;se<6;se++)if(Qe){U?ie&&n.texSubImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+se,0,0,0,C[se].width,C[se].height,ae,Se,C[se].data):n.texImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+se,0,We,C[se].width,C[se].height,0,ae,Se,C[se].data);for(let Ne=0;Ne<ue.length;Ne++){let an=ue[Ne].image[se].image;U?ie&&n.texSubImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+se,Ne+1,0,0,an.width,an.height,ae,Se,an.data):n.texImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+se,Ne+1,We,an.width,an.height,0,ae,Se,an.data)}}else{U?ie&&n.texSubImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+se,0,0,0,ae,Se,C[se]):n.texImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+se,0,We,ae,Se,C[se]);for(let Ne=0;Ne<ue.length;Ne++){let Ge=ue[Ne];U?ie&&n.texSubImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+se,Ne+1,0,0,ae,Se,Ge.image[se]):n.texImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+se,Ne+1,We,ae,Se,Ge.image[se])}}}p(b)&&_(t.TEXTURE_CUBE_MAP),we.__version=ne.version,b.onUpdate&&b.onUpdate(b)}I.__version=b.version}function Re(I,b,W,K,ne,we){let Fe=s.convert(W.format,W.colorSpace),re=s.convert(W.type),oe=v(W.internalFormat,Fe,re,W.normalized,W.colorSpace),De=i.get(b),Qe=i.get(W);if(Qe.__renderTarget=b,!De.__hasExternalTextures){let C=Math.max(1,b.width>>we),X=Math.max(1,b.height>>we);ne===t.TEXTURE_3D||ne===t.TEXTURE_2D_ARRAY?n.texImage3D(ne,we,oe,C,X,b.depth,0,Fe,re,null):n.texImage2D(ne,we,oe,C,X,0,Fe,re,null)}n.bindFramebuffer(t.FRAMEBUFFER,I),nn(b)?a.framebufferTexture2DMultisampleEXT(t.FRAMEBUFFER,K,ne,Qe.__webglTexture,0,tn(b)):(ne===t.TEXTURE_2D||ne>=t.TEXTURE_CUBE_MAP_POSITIVE_X&&ne<=t.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&t.framebufferTexture2D(t.FRAMEBUFFER,K,ne,Qe.__webglTexture,we),n.bindFramebuffer(t.FRAMEBUFFER,null)}function le(I,b,W){if(t.bindRenderbuffer(t.RENDERBUFFER,I),b.depthBuffer){let K=b.depthTexture,ne=K&&K.isDepthTexture?K.type:null,we=S(b.stencilBuffer,ne),Fe=b.stencilBuffer?t.DEPTH_STENCIL_ATTACHMENT:t.DEPTH_ATTACHMENT;nn(b)?a.renderbufferStorageMultisampleEXT(t.RENDERBUFFER,tn(b),we,b.width,b.height):W?t.renderbufferStorageMultisample(t.RENDERBUFFER,tn(b),we,b.width,b.height):t.renderbufferStorage(t.RENDERBUFFER,we,b.width,b.height),t.framebufferRenderbuffer(t.FRAMEBUFFER,Fe,t.RENDERBUFFER,I)}else{let K=b.textures;for(let ne=0;ne<K.length;ne++){let we=K[ne],Fe=s.convert(we.format,we.colorSpace),re=s.convert(we.type),oe=v(we.internalFormat,Fe,re,we.normalized,we.colorSpace);nn(b)?a.renderbufferStorageMultisampleEXT(t.RENDERBUFFER,tn(b),oe,b.width,b.height):W?t.renderbufferStorageMultisample(t.RENDERBUFFER,tn(b),oe,b.width,b.height):t.renderbufferStorage(t.RENDERBUFFER,oe,b.width,b.height)}}t.bindRenderbuffer(t.RENDERBUFFER,null)}function ge(I,b,W){let K=b.isWebGLCubeRenderTarget===!0;if(n.bindFramebuffer(t.FRAMEBUFFER,I),!(b.depthTexture&&b.depthTexture.isDepthTexture))throw new Error("THREE.WebGLTextures: renderTarget.depthTexture must be an instance of THREE.DepthTexture.");let ne=i.get(b.depthTexture);if(ne.__renderTarget=b,(!ne.__webglTexture||b.depthTexture.image.width!==b.width||b.depthTexture.image.height!==b.height)&&(b.depthTexture.image.width=b.width,b.depthTexture.image.height=b.height,b.depthTexture.needsUpdate=!0),K){if(ne.__webglInit===void 0&&(ne.__webglInit=!0,b.depthTexture.addEventListener("dispose",E)),ne.__webglTexture===void 0){ne.__webglTexture=t.createTexture(),n.bindTexture(t.TEXTURE_CUBE_MAP,ne.__webglTexture),ze(t.TEXTURE_CUBE_MAP,b.depthTexture);let De=s.convert(b.depthTexture.format),Qe=s.convert(b.depthTexture.type),C;b.depthTexture.format===Kr?C=t.DEPTH_COMPONENT24:b.depthTexture.format===_o&&(C=t.DEPTH24_STENCIL8);for(let X=0;X<6;X++)t.texImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+X,0,C,b.width,b.height,0,De,Qe,null)}}else H(b.depthTexture,0);let we=ne.__webglTexture,Fe=tn(b),re=K?t.TEXTURE_CUBE_MAP_POSITIVE_X+W:t.TEXTURE_2D,oe=b.depthTexture.format===_o?t.DEPTH_STENCIL_ATTACHMENT:t.DEPTH_ATTACHMENT;if(b.depthTexture.format===Kr)nn(b)?a.framebufferTexture2DMultisampleEXT(t.FRAMEBUFFER,oe,re,we,0,Fe):t.framebufferTexture2D(t.FRAMEBUFFER,oe,re,we,0);else if(b.depthTexture.format===_o)nn(b)?a.framebufferTexture2DMultisampleEXT(t.FRAMEBUFFER,oe,re,we,0,Fe):t.framebufferTexture2D(t.FRAMEBUFFER,oe,re,we,0);else throw new Error("THREE.WebGLTextures: Unknown depthTexture format.")}function Oe(I){let b=i.get(I),W=I.isWebGLCubeRenderTarget===!0;if(b.__boundDepthTexture!==I.depthTexture){let K=I.depthTexture;if(b.__depthDisposeCallback&&b.__depthDisposeCallback(),K){let ne=()=>{delete b.__boundDepthTexture,delete b.__depthDisposeCallback,K.removeEventListener("dispose",ne)};K.addEventListener("dispose",ne),b.__depthDisposeCallback=ne}b.__boundDepthTexture=K}if(I.depthTexture&&!b.__autoAllocateDepthBuffer)if(W)for(let K=0;K<6;K++)ge(b.__webglFramebuffer[K],I,K);else{let K=I.texture.mipmaps;K&&K.length>0?ge(b.__webglFramebuffer[0],I,0):ge(b.__webglFramebuffer,I,0)}else if(W){b.__webglDepthbuffer=[];for(let K=0;K<6;K++)if(n.bindFramebuffer(t.FRAMEBUFFER,b.__webglFramebuffer[K]),b.__webglDepthbuffer[K]===void 0)b.__webglDepthbuffer[K]=t.createRenderbuffer(),le(b.__webglDepthbuffer[K],I,!1);else{let ne=I.stencilBuffer?t.DEPTH_STENCIL_ATTACHMENT:t.DEPTH_ATTACHMENT,we=b.__webglDepthbuffer[K];t.bindRenderbuffer(t.RENDERBUFFER,we),t.framebufferRenderbuffer(t.FRAMEBUFFER,ne,t.RENDERBUFFER,we)}}else{let K=I.texture.mipmaps;if(K&&K.length>0?n.bindFramebuffer(t.FRAMEBUFFER,b.__webglFramebuffer[0]):n.bindFramebuffer(t.FRAMEBUFFER,b.__webglFramebuffer),b.__webglDepthbuffer===void 0)b.__webglDepthbuffer=t.createRenderbuffer(),le(b.__webglDepthbuffer,I,!1);else{let ne=I.stencilBuffer?t.DEPTH_STENCIL_ATTACHMENT:t.DEPTH_ATTACHMENT,we=b.__webglDepthbuffer;t.bindRenderbuffer(t.RENDERBUFFER,we),t.framebufferRenderbuffer(t.FRAMEBUFFER,ne,t.RENDERBUFFER,we)}}n.bindFramebuffer(t.FRAMEBUFFER,null)}function Ze(I,b,W){let K=i.get(I);b!==void 0&&Re(K.__webglFramebuffer,I,I.texture,t.COLOR_ATTACHMENT0,t.TEXTURE_2D,0),W!==void 0&&Oe(I)}function St(I){let b=I.texture,W=i.get(I),K=i.get(b);I.addEventListener("dispose",y);let ne=I.textures,we=I.isWebGLCubeRenderTarget===!0,Fe=ne.length>1;if(Fe||(K.__webglTexture===void 0&&(K.__webglTexture=t.createTexture()),K.__version=b.version,o.memory.textures++),we){W.__webglFramebuffer=[];for(let re=0;re<6;re++)if(b.mipmaps&&b.mipmaps.length>0){W.__webglFramebuffer[re]=[];for(let oe=0;oe<b.mipmaps.length;oe++)W.__webglFramebuffer[re][oe]=t.createFramebuffer()}else W.__webglFramebuffer[re]=t.createFramebuffer()}else{if(b.mipmaps&&b.mipmaps.length>0){W.__webglFramebuffer=[];for(let re=0;re<b.mipmaps.length;re++)W.__webglFramebuffer[re]=t.createFramebuffer()}else W.__webglFramebuffer=t.createFramebuffer();if(Fe)for(let re=0,oe=ne.length;re<oe;re++){let De=i.get(ne[re]);De.__webglTexture===void 0&&(De.__webglTexture=t.createTexture(),o.memory.textures++)}if(I.samples>0&&nn(I)===!1){W.__webglMultisampledFramebuffer=t.createFramebuffer(),W.__webglColorRenderbuffer=[],n.bindFramebuffer(t.FRAMEBUFFER,W.__webglMultisampledFramebuffer);for(let re=0;re<ne.length;re++){let oe=ne[re];W.__webglColorRenderbuffer[re]=t.createRenderbuffer(),t.bindRenderbuffer(t.RENDERBUFFER,W.__webglColorRenderbuffer[re]);let De=s.convert(oe.format,oe.colorSpace),Qe=s.convert(oe.type),C=v(oe.internalFormat,De,Qe,oe.normalized,oe.colorSpace,I.isXRRenderTarget===!0),X=tn(I);t.renderbufferStorageMultisample(t.RENDERBUFFER,X,C,I.width,I.height),t.framebufferRenderbuffer(t.FRAMEBUFFER,t.COLOR_ATTACHMENT0+re,t.RENDERBUFFER,W.__webglColorRenderbuffer[re])}t.bindRenderbuffer(t.RENDERBUFFER,null),I.depthBuffer&&(W.__webglDepthRenderbuffer=t.createRenderbuffer(),le(W.__webglDepthRenderbuffer,I,!0)),n.bindFramebuffer(t.FRAMEBUFFER,null)}}if(we){n.bindTexture(t.TEXTURE_CUBE_MAP,K.__webglTexture),ze(t.TEXTURE_CUBE_MAP,b);for(let re=0;re<6;re++)if(b.mipmaps&&b.mipmaps.length>0)for(let oe=0;oe<b.mipmaps.length;oe++)Re(W.__webglFramebuffer[re][oe],I,b,t.COLOR_ATTACHMENT0,t.TEXTURE_CUBE_MAP_POSITIVE_X+re,oe);else Re(W.__webglFramebuffer[re],I,b,t.COLOR_ATTACHMENT0,t.TEXTURE_CUBE_MAP_POSITIVE_X+re,0);p(b)&&_(t.TEXTURE_CUBE_MAP),n.unbindTexture()}else if(Fe){for(let re=0,oe=ne.length;re<oe;re++){let De=ne[re],Qe=i.get(De),C=t.TEXTURE_2D;(I.isWebGL3DRenderTarget||I.isWebGLArrayRenderTarget)&&(C=I.isWebGL3DRenderTarget?t.TEXTURE_3D:t.TEXTURE_2D_ARRAY),n.bindTexture(C,Qe.__webglTexture),ze(C,De),Re(W.__webglFramebuffer,I,De,t.COLOR_ATTACHMENT0+re,C,0),p(De)&&_(C)}n.unbindTexture()}else{let re=t.TEXTURE_2D;if((I.isWebGL3DRenderTarget||I.isWebGLArrayRenderTarget)&&(re=I.isWebGL3DRenderTarget?t.TEXTURE_3D:t.TEXTURE_2D_ARRAY),n.bindTexture(re,K.__webglTexture),ze(re,b),b.mipmaps&&b.mipmaps.length>0)for(let oe=0;oe<b.mipmaps.length;oe++)Re(W.__webglFramebuffer[oe],I,b,t.COLOR_ATTACHMENT0,re,oe);else Re(W.__webglFramebuffer,I,b,t.COLOR_ATTACHMENT0,re,0);p(b)&&_(re),n.unbindTexture()}I.depthBuffer&&Oe(I)}function Ce(I){let b=I.textures;for(let W=0,K=b.length;W<K;W++){let ne=b[W];if(p(ne)){let we=M(I),Fe=i.get(ne).__webglTexture;n.bindTexture(we,Fe),_(we),n.unbindTexture()}}}let Le=[],at=[];function on(I){if(I.samples>0){if(nn(I)===!1){let b=I.textures,W=I.width,K=I.height,ne=t.COLOR_BUFFER_BIT,we=I.stencilBuffer?t.DEPTH_STENCIL_ATTACHMENT:t.DEPTH_ATTACHMENT,Fe=i.get(I),re=b.length>1;if(re)for(let De=0;De<b.length;De++)n.bindFramebuffer(t.FRAMEBUFFER,Fe.__webglMultisampledFramebuffer),t.framebufferRenderbuffer(t.FRAMEBUFFER,t.COLOR_ATTACHMENT0+De,t.RENDERBUFFER,null),n.bindFramebuffer(t.FRAMEBUFFER,Fe.__webglFramebuffer),t.framebufferTexture2D(t.DRAW_FRAMEBUFFER,t.COLOR_ATTACHMENT0+De,t.TEXTURE_2D,null,0);n.bindFramebuffer(t.READ_FRAMEBUFFER,Fe.__webglMultisampledFramebuffer);let oe=I.texture.mipmaps;oe&&oe.length>0?n.bindFramebuffer(t.DRAW_FRAMEBUFFER,Fe.__webglFramebuffer[0]):n.bindFramebuffer(t.DRAW_FRAMEBUFFER,Fe.__webglFramebuffer);for(let De=0;De<b.length;De++){if(I.resolveDepthBuffer&&(I.depthBuffer&&(ne|=t.DEPTH_BUFFER_BIT),I.stencilBuffer&&I.resolveStencilBuffer&&(ne|=t.STENCIL_BUFFER_BIT)),re){t.framebufferRenderbuffer(t.READ_FRAMEBUFFER,t.COLOR_ATTACHMENT0,t.RENDERBUFFER,Fe.__webglColorRenderbuffer[De]);let Qe=i.get(b[De]).__webglTexture;t.framebufferTexture2D(t.DRAW_FRAMEBUFFER,t.COLOR_ATTACHMENT0,t.TEXTURE_2D,Qe,0)}t.blitFramebuffer(0,0,W,K,0,0,W,K,ne,t.NEAREST),l===!0&&(Le.length=0,at.length=0,Le.push(t.COLOR_ATTACHMENT0+De),I.depthBuffer&&I.storeMultisampledDepthBuffer===!1&&(Le.push(we),at.push(we),t.invalidateFramebuffer(t.DRAW_FRAMEBUFFER,at)),t.invalidateFramebuffer(t.READ_FRAMEBUFFER,Le))}if(n.bindFramebuffer(t.READ_FRAMEBUFFER,null),n.bindFramebuffer(t.DRAW_FRAMEBUFFER,null),re)for(let De=0;De<b.length;De++){n.bindFramebuffer(t.FRAMEBUFFER,Fe.__webglMultisampledFramebuffer),t.framebufferRenderbuffer(t.FRAMEBUFFER,t.COLOR_ATTACHMENT0+De,t.RENDERBUFFER,Fe.__webglColorRenderbuffer[De]);let Qe=i.get(b[De]).__webglTexture;n.bindFramebuffer(t.FRAMEBUFFER,Fe.__webglFramebuffer),t.framebufferTexture2D(t.DRAW_FRAMEBUFFER,t.COLOR_ATTACHMENT0+De,t.TEXTURE_2D,Qe,0)}n.bindFramebuffer(t.DRAW_FRAMEBUFFER,Fe.__webglMultisampledFramebuffer)}else if(I.depthBuffer&&I.storeMultisampledDepthBuffer===!1&&l){let b=I.stencilBuffer?t.DEPTH_STENCIL_ATTACHMENT:t.DEPTH_ATTACHMENT;t.invalidateFramebuffer(t.DRAW_FRAMEBUFFER,[b])}}}function tn(I){return Math.min(r.maxSamples,I.samples)}function nn(I){let b=i.get(I);return I.samples>0&&e.has("WEBGL_multisampled_render_to_texture")===!0&&b.__useRenderToTexture!==!1}function k(I){let b=o.render.frame;u.get(I)!==b&&(u.set(I,b),I.update())}function Bn(I,b){let W=I.colorSpace,K=I.format,ne=I.type;return I.isCompressedTexture===!0||I.isVideoTexture===!0||W!==ia&&W!==Os&&(Et.getTransfer(W)===Kt?(K!==ri||ne!==er)&&dt("WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):gt("WebGLTextures: Unsupported texture color space:",W)),b}function Tt(I){return typeof HTMLImageElement<"u"&&I instanceof HTMLImageElement?(c.width=I.naturalWidth||I.width,c.height=I.naturalHeight||I.height):typeof VideoFrame<"u"&&I instanceof VideoFrame?(c.width=I.displayWidth,c.height=I.displayHeight):(c.width=I.width,c.height=I.height),c}this.allocateTextureUnit=N,this.resetTextureUnits=z,this.getTextureUnits=L,this.setTextureUnits=V,this.setTexture2D=H,this.setTexture2DArray=G,this.setTexture3D=$,this.setTextureCube=J,this.rebindTextures=Ze,this.setupRenderTarget=St,this.updateRenderTargetMipmap=Ce,this.updateMultisampleRenderTarget=on,this.setupDepthRenderbuffer=Oe,this.setupFrameBufferTexture=Re,this.useMultisampledRTT=nn,this.isReversedDepthBuffer=function(){return n.buffers.depth.getReversed()}}function E3(t,e){function n(i,r=Os){let s,o=Et.getTransfer(r);if(i===er)return t.UNSIGNED_BYTE;if(i===cd)return t.UNSIGNED_SHORT_4_4_4_4;if(i===ud)return t.UNSIGNED_SHORT_5_5_5_1;if(i===j0)return t.UNSIGNED_INT_5_9_9_9_REV;if(i===Z0)return t.UNSIGNED_INT_10F_11F_11F_REV;if(i===Y0)return t.BYTE;if(i===q0)return t.SHORT;if(i===Sl)return t.UNSIGNED_SHORT;if(i===ld)return t.INT;if(i===Fr)return t.UNSIGNED_INT;if(i===xr)return t.FLOAT;if(i===gi)return t.HALF_FLOAT;if(i===K0)return t.ALPHA;if(i===J0)return t.RGB;if(i===ri)return t.RGBA;if(i===Kr)return t.DEPTH_COMPONENT;if(i===_o)return t.DEPTH_STENCIL;if(i===hd)return t.RED;if(i===fd)return t.RED_INTEGER;if(i===bo)return t.RG;if(i===dd)return t.RG_INTEGER;if(i===pd)return t.RGBA_INTEGER;if(i===su||i===ou||i===au||i===lu)if(o===Kt)if(s=e.get("WEBGL_compressed_texture_s3tc_srgb"),s!==null){if(i===su)return s.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(i===ou)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(i===au)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(i===lu)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(s=e.get("WEBGL_compressed_texture_s3tc"),s!==null){if(i===su)return s.COMPRESSED_RGB_S3TC_DXT1_EXT;if(i===ou)return s.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(i===au)return s.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(i===lu)return s.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(i===md||i===gd||i===xd||i===vd)if(s=e.get("WEBGL_compressed_texture_pvrtc"),s!==null){if(i===md)return s.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(i===gd)return s.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(i===xd)return s.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(i===vd)return s.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(i===yd||i===_d||i===bd||i===Md||i===Sd||i===cu||i===wd)if(s=e.get("WEBGL_compressed_texture_etc"),s!==null){if(i===yd||i===_d)return o===Kt?s.COMPRESSED_SRGB8_ETC2:s.COMPRESSED_RGB8_ETC2;if(i===bd)return o===Kt?s.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:s.COMPRESSED_RGBA8_ETC2_EAC;if(i===Md)return s.COMPRESSED_R11_EAC;if(i===Sd)return s.COMPRESSED_SIGNED_R11_EAC;if(i===cu)return s.COMPRESSED_RG11_EAC;if(i===wd)return s.COMPRESSED_SIGNED_RG11_EAC}else return null;if(i===Ad||i===Td||i===Ed||i===Rd||i===Cd||i===Pd||i===Id||i===Ld||i===Dd||i===Nd||i===Od||i===Fd||i===Ud||i===kd)if(s=e.get("WEBGL_compressed_texture_astc"),s!==null){if(i===Ad)return o===Kt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:s.COMPRESSED_RGBA_ASTC_4x4_KHR;if(i===Td)return o===Kt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:s.COMPRESSED_RGBA_ASTC_5x4_KHR;if(i===Ed)return o===Kt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:s.COMPRESSED_RGBA_ASTC_5x5_KHR;if(i===Rd)return o===Kt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:s.COMPRESSED_RGBA_ASTC_6x5_KHR;if(i===Cd)return o===Kt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:s.COMPRESSED_RGBA_ASTC_6x6_KHR;if(i===Pd)return o===Kt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:s.COMPRESSED_RGBA_ASTC_8x5_KHR;if(i===Id)return o===Kt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:s.COMPRESSED_RGBA_ASTC_8x6_KHR;if(i===Ld)return o===Kt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:s.COMPRESSED_RGBA_ASTC_8x8_KHR;if(i===Dd)return o===Kt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:s.COMPRESSED_RGBA_ASTC_10x5_KHR;if(i===Nd)return o===Kt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:s.COMPRESSED_RGBA_ASTC_10x6_KHR;if(i===Od)return o===Kt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:s.COMPRESSED_RGBA_ASTC_10x8_KHR;if(i===Fd)return o===Kt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:s.COMPRESSED_RGBA_ASTC_10x10_KHR;if(i===Ud)return o===Kt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:s.COMPRESSED_RGBA_ASTC_12x10_KHR;if(i===kd)return o===Kt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:s.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(i===Bd||i===zd||i===Vd)if(s=e.get("EXT_texture_compression_bptc"),s!==null){if(i===Bd)return o===Kt?s.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:s.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(i===zd)return s.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(i===Vd)return s.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(i===Gd||i===Hd||i===uu||i===Wd)if(s=e.get("EXT_texture_compression_rgtc"),s!==null){if(i===Gd)return s.COMPRESSED_RED_RGTC1_EXT;if(i===Hd)return s.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(i===uu)return s.COMPRESSED_RED_GREEN_RGTC2_EXT;if(i===Wd)return s.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return i===wl?t.UNSIGNED_INT_24_8:t[i]!==void 0?t[i]:null}return{convert:n}}var R3=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,C3=`
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

}`,wg=class{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,n){if(this.texture===null){let i=new jc(e.texture);(e.depthNear!==n.depthNear||e.depthFar!==n.depthFar)&&(this.depthNear=e.depthNear,this.depthFar=e.depthFar),this.texture=i}}getMesh(e){if(this.texture!==null&&this.mesh===null){let n=e.cameras[0].viewport,i=new Ft({vertexShader:R3,fragmentShader:C3,uniforms:{depthColor:{value:this.texture},depthWidth:{value:n.z},depthHeight:{value:n.w}}});this.mesh=new Xt(new ns(20,20),i)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}},Ag=class extends Jr{constructor(e,n){super();let i=this,r=null,s=1,o=null,a="local-floor",l=1,c=null,u=null,f=null,h=null,d=null,g=null,x=typeof XRWebGLBinding<"u",m=new wg,p={},_=n.getContextAttributes(),M=null,v=null,S=[],w=[],E=new pt,y=null,T=null,R=new pi;R.viewport=new Vt;let F=new pi;F.viewport=new Vt;let O=[R,F],z=new nd,L=null,V=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(Z){let te=S[Z];return te===void 0&&(te=new xl,S[Z]=te),te.getTargetRaySpace()},this.getControllerGrip=function(Z){let te=S[Z];return te===void 0&&(te=new xl,S[Z]=te),te.getGripSpace()},this.getHand=function(Z){let te=S[Z];return te===void 0&&(te=new xl,S[Z]=te),te.getHandSpace()};function N(Z){let te=w.indexOf(Z.inputSource);if(te===-1)return;let Te=S[te];Te!==void 0&&(Te.update(Z.inputSource,Z.frame,c||o),Te.dispatchEvent({type:Z.type,data:Z.inputSource}))}function D(){r.removeEventListener("select",N),r.removeEventListener("selectstart",N),r.removeEventListener("selectend",N),r.removeEventListener("squeeze",N),r.removeEventListener("squeezestart",N),r.removeEventListener("squeezeend",N),r.removeEventListener("end",D),r.removeEventListener("inputsourceschange",H);for(let Z=0;Z<S.length;Z++){let te=w[Z];te!==null&&(w[Z]=null,S[Z].disconnect(te))}L=null,V=null,m.reset();for(let Z in p)delete p[Z];if(e.setRenderTarget(M),d=null,h=null,f=null,r=null,v=null,nt.stop(),i.isPresenting=!1,e.setPixelRatio(y),e.setSize(E.width,E.height,!1),T!==null){let Z=T.camera;Z.fov=T.fov,Z.zoom=T.zoom,Z.updateProjectionMatrix(),T=null}i.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(Z){s=Z,i.isPresenting===!0&&dt("WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(Z){a=Z,i.isPresenting===!0&&dt("WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return c||o},this.setReferenceSpace=function(Z){c=Z},this.getBaseLayer=function(){return h!==null?h:d},this.getBinding=function(){return f===null&&x&&(f=new XRWebGLBinding(r,n)),f},this.getFrame=function(){return g},this.getSession=function(){return r},this.setSession=async function(Z){if(r=Z,r!==null){if(M=e.getRenderTarget(),r.addEventListener("select",N),r.addEventListener("selectstart",N),r.addEventListener("selectend",N),r.addEventListener("squeeze",N),r.addEventListener("squeezestart",N),r.addEventListener("squeezeend",N),r.addEventListener("end",D),r.addEventListener("inputsourceschange",H),_.xrCompatible!==!0&&await n.makeXRCompatible(),y=e.getPixelRatio(),e.getSize(E),x&&"createProjectionLayer"in XRWebGLBinding.prototype){let Te=null,je=null,Re=null;_.depth&&(Re=_.stencil?n.DEPTH24_STENCIL8:n.DEPTH_COMPONENT24,Te=_.stencil?_o:Kr,je=_.stencil?wl:Fr);let le={colorFormat:n.RGBA8,depthFormat:Re,scaleFactor:s};f=this.getBinding(),h=f.createProjectionLayer(le),r.updateRenderState({layers:[h]}),e.setPixelRatio(1),e.setSize(h.textureWidth,h.textureHeight,!1),v=new Hn(h.textureWidth,h.textureHeight,{format:ri,type:er,depthTexture:new po(h.textureWidth,h.textureHeight,je,void 0,void 0,void 0,void 0,void 0,void 0,Te),stencilBuffer:_.stencil,colorSpace:e.outputColorSpace,samples:_.antialias?4:0,resolveDepthBuffer:h.ignoreDepthValues===!1,resolveStencilBuffer:h.ignoreDepthValues===!1,storeMultisampledDepthBuffer:h.ignoreDepthValues===!1,storeMultisampledStencilBuffer:h.ignoreDepthValues===!1})}else{let Te={antialias:_.antialias,alpha:!0,depth:_.depth,stencil:_.stencil,framebufferScaleFactor:s};d=new XRWebGLLayer(r,n,Te),r.updateRenderState({baseLayer:d}),e.setPixelRatio(1),e.setSize(d.framebufferWidth,d.framebufferHeight,!1),v=new Hn(d.framebufferWidth,d.framebufferHeight,{format:ri,type:er,colorSpace:e.outputColorSpace,stencilBuffer:_.stencil,resolveDepthBuffer:d.ignoreDepthValues===!1,resolveStencilBuffer:d.ignoreDepthValues===!1,storeMultisampledDepthBuffer:d.ignoreDepthValues===!1,storeMultisampledStencilBuffer:d.ignoreDepthValues===!1})}v.isXRRenderTarget=!0,this.setFoveation(l),c=null,o=await r.requestReferenceSpace(a),nt.setContext(r),nt.start(),i.isPresenting=!0,i.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(r!==null)return r.environmentBlendMode},this.getDepthTexture=function(){return m.getDepthTexture()};function H(Z){for(let te=0;te<Z.removed.length;te++){let Te=Z.removed[te],je=w.indexOf(Te);je>=0&&(w[je]=null,S[je].disconnect(Te))}for(let te=0;te<Z.added.length;te++){let Te=Z.added[te],je=w.indexOf(Te);if(je===-1){for(let le=0;le<S.length;le++)if(le>=w.length){w.push(Te),je=le;break}else if(w[le]===null){w[le]=Te,je=le;break}if(je===-1)break}let Re=S[je];Re&&Re.connect(Te)}}let G=new P,$=new P;function J(Z,te,Te){G.setFromMatrixPosition(te.matrixWorld),$.setFromMatrixPosition(Te.matrixWorld);let je=G.distanceTo($),Re=te.projectionMatrix.elements,le=Te.projectionMatrix.elements,ge=Re[14]/(Re[10]-1),Oe=Re[14]/(Re[10]+1),Ze=(Re[9]+1)/Re[5],St=(Re[9]-1)/Re[5],Ce=(Re[8]-1)/Re[0],Le=(le[8]+1)/le[0],at=ge*Ce,on=ge*Le,tn=je/(-Ce+Le),nn=tn*-Ce;if(te.matrixWorld.decompose(Z.position,Z.quaternion,Z.scale),Z.translateX(nn),Z.translateZ(tn),Z.matrixWorld.compose(Z.position,Z.quaternion,Z.scale),Z.matrixWorldInverse.copy(Z.matrixWorld).invert(),Re[10]===-1)Z.projectionMatrix.copy(te.projectionMatrix),Z.projectionMatrixInverse.copy(te.projectionMatrixInverse);else{let k=ge+tn,Bn=Oe+tn,Tt=at-nn,I=on+(je-nn),b=Ze*Oe/Bn*k,W=St*Oe/Bn*k;Z.projectionMatrix.makePerspective(Tt,I,b,W,k,Bn),Z.projectionMatrixInverse.copy(Z.projectionMatrix).invert()}}function ve(Z,te){te===null?Z.matrixWorld.copy(Z.matrix):Z.matrixWorld.multiplyMatrices(te.matrixWorld,Z.matrix),Z.matrixWorldInverse.copy(Z.matrixWorld).invert()}this.updateCamera=function(Z){if(r===null)return;let te=Z.near,Te=Z.far;m.texture!==null&&(m.depthNear>0&&(te=m.depthNear),m.depthFar>0&&(Te=m.depthFar)),z.near=F.near=R.near=te,z.far=F.far=R.far=Te,(L!==z.near||V!==z.far)&&(r.updateRenderState({depthNear:z.near,depthFar:z.far}),L=z.near,V=z.far),z.layers.mask=Z.layers.mask|6,R.layers.mask=z.layers.mask&-5,F.layers.mask=z.layers.mask&-3;let je=Z.parent,Re=z.cameras;ve(z,je);for(let le=0;le<Re.length;le++)ve(Re[le],je);Re.length===2?J(z,R,F):z.projectionMatrix.copy(R.projectionMatrix),T===null&&Z.isPerspectiveCamera&&(T={camera:Z,fov:Z.fov,zoom:Z.zoom}),ye(Z,z,je)};function ye(Z,te,Te){Te===null?Z.matrix.copy(te.matrixWorld):(Z.matrix.copy(Te.matrixWorld),Z.matrix.invert(),Z.matrix.multiply(te.matrixWorld)),Z.matrix.decompose(Z.position,Z.quaternion,Z.scale),Z.updateMatrixWorld(!0),Z.projectionMatrix.copy(te.projectionMatrix),Z.projectionMatrixInverse.copy(te.projectionMatrixInverse),Z.isPerspectiveCamera&&(Z.fov=If*2*Math.atan(1/Z.projectionMatrix.elements[5]),Z.zoom=1)}this.getCamera=function(){return z},this.getFoveation=function(){if(!(h===null&&d===null))return l},this.setFoveation=function(Z){l=Z,h!==null&&(h.fixedFoveation=Z),d!==null&&d.fixedFoveation!==void 0&&(d.fixedFoveation=Z)},this.hasDepthSensing=function(){return m.texture!==null},this.getDepthSensingMesh=function(){return m.getMesh(z)},this.getCameraTexture=function(Z){return p[Z]};let rt=null;function ze(Z,te){if(u=te.getViewerPose(c||o),g=te,u!==null){let Te=u.views;d!==null&&(e.setRenderTargetFramebuffer(v,d.framebuffer),e.setRenderTarget(v));let je=!1;Te.length!==z.cameras.length&&(z.cameras.length=0,je=!0);for(let Oe=0;Oe<Te.length;Oe++){let Ze=Te[Oe],St=null;if(d!==null)St=d.getViewport(Ze);else{let Le=f.getViewSubImage(h,Ze);St=Le.viewport,Oe===0&&(e.setRenderTargetTextures(v,Le.colorTexture,Le.depthStencilTexture),e.setRenderTarget(v))}let Ce=O[Oe];Ce===void 0&&(Ce=new pi,Ce.layers.enable(Oe),Ce.viewport=new Vt,O[Oe]=Ce),Ce.matrix.fromArray(Ze.transform.matrix),Ce.matrix.decompose(Ce.position,Ce.quaternion,Ce.scale),Ce.projectionMatrix.fromArray(Ze.projectionMatrix),Ce.projectionMatrixInverse.copy(Ce.projectionMatrix).invert(),Ce.viewport.set(St.x,St.y,St.width,St.height),Oe===0&&(z.matrix.copy(Ce.matrix),z.matrix.decompose(z.position,z.quaternion,z.scale)),je===!0&&z.cameras.push(Ce)}let Re=r.enabledFeatures;if(Re&&Re.includes("depth-sensing")&&r.depthUsage=="gpu-optimized"&&x){f=i.getBinding();let Oe=f.getDepthInformation(Te[0]);Oe&&Oe.isValid&&Oe.texture&&m.init(Oe,r.renderState)}if(Re&&Re.includes("camera-access")&&x){e.state.unbindTexture(),f=i.getBinding();for(let Oe=0;Oe<Te.length;Oe++){let Ze=Te[Oe].camera;if(Ze){let St=p[Ze];St||(St=new jc,p[Ze]=St);let Ce=f.getCameraImage(Ze);St.sourceTexture=Ce}}}}for(let Te=0;Te<S.length;Te++){let je=w[Te],Re=S[Te];je!==null&&Re!==void 0&&Re.update(je,te,c||o)}rt&&rt(Z,te),te.detectedPlanes&&i.dispatchEvent({type:"planesdetected",data:te}),g=null}let nt=new _b;nt.setAnimationLoop(ze),this.setAnimationLoop=function(Z){rt=Z},this.dispose=function(){}}},P3=new Ot,Tb=new _t;Tb.set(-1,0,0,0,1,0,0,0,1);function I3(t,e){function n(m,p){m.matrixAutoUpdate===!0&&m.updateMatrix(),p.value.copy(m.matrix)}function i(m,p){p.color.getRGB(m.fogColor.value,ng(t)),p.isFog?(m.fogNear.value=p.near,m.fogFar.value=p.far):p.isFogExp2&&(m.fogDensity.value=p.density)}function r(m,p,_,M,v){p.isNodeMaterial?p.uniformsNeedUpdate=!1:p.isMeshBasicMaterial?s(m,p):p.isMeshLambertMaterial?(s(m,p),p.envMap&&(m.envMapIntensity.value=p.envMapIntensity)):p.isMeshToonMaterial?(s(m,p),f(m,p)):p.isMeshPhongMaterial?(s(m,p),u(m,p),p.envMap&&(m.envMapIntensity.value=p.envMapIntensity)):p.isMeshStandardMaterial?(s(m,p),h(m,p),p.isMeshPhysicalMaterial&&d(m,p,v)):p.isMeshMatcapMaterial?(s(m,p),g(m,p)):p.isMeshDepthMaterial?s(m,p):p.isMeshDistanceMaterial?(s(m,p),x(m,p)):p.isMeshNormalMaterial?s(m,p):p.isLineBasicMaterial?(o(m,p),p.isLineDashedMaterial&&a(m,p)):p.isPointsMaterial?l(m,p,_,M):p.isSpriteMaterial?c(m,p):p.isShadowMaterial?(m.color.value.copy(p.color),m.opacity.value=p.opacity):p.isShaderMaterial&&(p.uniformsNeedUpdate=!1)}function s(m,p){m.opacity.value=p.opacity,p.color&&m.diffuse.value.copy(p.color),p.emissive&&m.emissive.value.copy(p.emissive).multiplyScalar(p.emissiveIntensity),p.map&&(m.map.value=p.map,n(p.map,m.mapTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,n(p.alphaMap,m.alphaMapTransform)),p.bumpMap&&(m.bumpMap.value=p.bumpMap,n(p.bumpMap,m.bumpMapTransform),m.bumpScale.value=p.bumpScale,p.side===Ii&&(m.bumpScale.value*=-1)),p.normalMap&&(m.normalMap.value=p.normalMap,n(p.normalMap,m.normalMapTransform),m.normalScale.value.copy(p.normalScale),p.side===Ii&&m.normalScale.value.negate()),p.displacementMap&&(m.displacementMap.value=p.displacementMap,n(p.displacementMap,m.displacementMapTransform),m.displacementScale.value=p.displacementScale,m.displacementBias.value=p.displacementBias),p.emissiveMap&&(m.emissiveMap.value=p.emissiveMap,n(p.emissiveMap,m.emissiveMapTransform)),p.specularMap&&(m.specularMap.value=p.specularMap,n(p.specularMap,m.specularMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest);let _=e.get(p),M=_.envMap,v=_.envMapRotation;M&&(m.envMap.value=M,m.envMapRotation.value.setFromMatrix4(P3.makeRotationFromEuler(v)).transpose(),M.isCubeTexture&&M.isRenderTargetTexture===!1&&m.envMapRotation.value.premultiply(Tb),m.reflectivity.value=p.reflectivity,m.ior.value=p.ior,m.refractionRatio.value=p.refractionRatio),p.lightMap&&(m.lightMap.value=p.lightMap,m.lightMapIntensity.value=p.lightMapIntensity,n(p.lightMap,m.lightMapTransform)),p.aoMap&&(m.aoMap.value=p.aoMap,m.aoMapIntensity.value=p.aoMapIntensity,n(p.aoMap,m.aoMapTransform))}function o(m,p){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,p.map&&(m.map.value=p.map,n(p.map,m.mapTransform))}function a(m,p){m.dashSize.value=p.dashSize,m.totalSize.value=p.dashSize+p.gapSize,m.scale.value=p.scale}function l(m,p,_,M){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,m.size.value=p.size*_,m.scale.value=M*.5,p.map&&(m.map.value=p.map,n(p.map,m.uvTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,n(p.alphaMap,m.alphaMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest)}function c(m,p){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,m.rotation.value=p.rotation,p.map&&(m.map.value=p.map,n(p.map,m.mapTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,n(p.alphaMap,m.alphaMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest)}function u(m,p){m.specular.value.copy(p.specular),m.shininess.value=Math.max(p.shininess,1e-4)}function f(m,p){p.gradientMap&&(m.gradientMap.value=p.gradientMap)}function h(m,p){m.metalness.value=p.metalness,p.metalnessMap&&(m.metalnessMap.value=p.metalnessMap,n(p.metalnessMap,m.metalnessMapTransform)),m.roughness.value=p.roughness,p.roughnessMap&&(m.roughnessMap.value=p.roughnessMap,n(p.roughnessMap,m.roughnessMapTransform)),p.envMap&&(m.envMapIntensity.value=p.envMapIntensity)}function d(m,p,_){m.ior.value=p.ior,p.sheen>0&&(m.sheenColor.value.copy(p.sheenColor).multiplyScalar(p.sheen),m.sheenRoughness.value=p.sheenRoughness,p.sheenColorMap&&(m.sheenColorMap.value=p.sheenColorMap,n(p.sheenColorMap,m.sheenColorMapTransform)),p.sheenRoughnessMap&&(m.sheenRoughnessMap.value=p.sheenRoughnessMap,n(p.sheenRoughnessMap,m.sheenRoughnessMapTransform))),p.clearcoat>0&&(m.clearcoat.value=p.clearcoat,m.clearcoatRoughness.value=p.clearcoatRoughness,p.clearcoatMap&&(m.clearcoatMap.value=p.clearcoatMap,n(p.clearcoatMap,m.clearcoatMapTransform)),p.clearcoatRoughnessMap&&(m.clearcoatRoughnessMap.value=p.clearcoatRoughnessMap,n(p.clearcoatRoughnessMap,m.clearcoatRoughnessMapTransform)),p.clearcoatNormalMap&&(m.clearcoatNormalMap.value=p.clearcoatNormalMap,n(p.clearcoatNormalMap,m.clearcoatNormalMapTransform),m.clearcoatNormalScale.value.copy(p.clearcoatNormalScale),p.side===Ii&&m.clearcoatNormalScale.value.negate())),p.dispersion>0&&(m.dispersion.value=p.dispersion),p.retroreflectivity>0&&(m.retroreflectivity.value=p.retroreflectivity),p.iridescence>0&&(m.iridescence.value=p.iridescence,m.iridescenceIOR.value=p.iridescenceIOR,m.iridescenceThicknessMinimum.value=p.iridescenceThicknessRange[0],m.iridescenceThicknessMaximum.value=p.iridescenceThicknessRange[1],p.iridescenceMap&&(m.iridescenceMap.value=p.iridescenceMap,n(p.iridescenceMap,m.iridescenceMapTransform)),p.iridescenceThicknessMap&&(m.iridescenceThicknessMap.value=p.iridescenceThicknessMap,n(p.iridescenceThicknessMap,m.iridescenceThicknessMapTransform))),p.transmission>0&&(m.transmission.value=p.transmission,m.transmissionSamplerMap.value=_.texture,m.transmissionSamplerSize.value.set(_.width,_.height),p.transmissionMap&&(m.transmissionMap.value=p.transmissionMap,n(p.transmissionMap,m.transmissionMapTransform)),m.thickness.value=p.thickness,p.thicknessMap&&(m.thicknessMap.value=p.thicknessMap,n(p.thicknessMap,m.thicknessMapTransform)),m.attenuationDistance.value=p.attenuationDistance,m.attenuationColor.value.copy(p.attenuationColor)),p.anisotropy>0&&(m.anisotropyVector.value.set(p.anisotropy*Math.cos(p.anisotropyRotation),p.anisotropy*Math.sin(p.anisotropyRotation)),p.anisotropyMap&&(m.anisotropyMap.value=p.anisotropyMap,n(p.anisotropyMap,m.anisotropyMapTransform))),m.specularIntensity.value=p.specularIntensity,m.specularColor.value.copy(p.specularColor),p.specularColorMap&&(m.specularColorMap.value=p.specularColorMap,n(p.specularColorMap,m.specularColorMapTransform)),p.specularIntensityMap&&(m.specularIntensityMap.value=p.specularIntensityMap,n(p.specularIntensityMap,m.specularIntensityMapTransform))}function g(m,p){p.matcap&&(m.matcap.value=p.matcap)}function x(m,p){let _=e.get(p).light;m.referencePosition.value.setFromMatrixPosition(_.matrixWorld),m.nearDistance.value=_.shadow.camera.near,m.farDistance.value=_.shadow.camera.far}return{refreshFogUniforms:i,refreshMaterialUniforms:r}}function L3(t,e,n,i){let r={},s={},o=[],a=t.getParameter(t.MAX_UNIFORM_BUFFER_BINDINGS);function l(v,S){let w=S.program;i.uniformBlockBinding(v,w)}function c(v,S){let w=r[v.id];w===void 0&&(m(v),w=u(v),r[v.id]=w,v.addEventListener("dispose",_));let E=S.program;i.updateUBOMapping(v,E);let y=e.render.frame;s[v.id]!==y&&(h(v),s[v.id]=y)}function u(v){let S=f();v.__bindingPointIndex=S;let w=t.createBuffer(),E=v.__size,y=v.usage;return t.bindBuffer(t.UNIFORM_BUFFER,w),t.bufferData(t.UNIFORM_BUFFER,E,y),t.bindBuffer(t.UNIFORM_BUFFER,null),t.bindBufferBase(t.UNIFORM_BUFFER,S,w),w}function f(){for(let v=0;v<a;v++)if(o.indexOf(v)===-1)return o.push(v),v;return gt("WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function h(v){let S=r[v.id],w=v.uniforms,E=v.__cache;t.bindBuffer(t.UNIFORM_BUFFER,S);for(let y=0,T=w.length;y<T;y++){let R=w[y];if(Array.isArray(R))for(let F=0,O=R.length;F<O;F++)d(R[F],y,F,E);else d(R,y,0,E)}t.bindBuffer(t.UNIFORM_BUFFER,null)}function d(v,S,w,E){if(x(v,S,w,E)===!0){let y=v.__offset,T=v.value;if(Array.isArray(T)){let R=0;for(let F=0;F<T.length;F++){let O=T[F],z=p(O);g(O,v.__data,R),typeof O!="number"&&typeof O!="boolean"&&!O.isMatrix3&&!ArrayBuffer.isView(O)&&(R+=z.storage/Float32Array.BYTES_PER_ELEMENT)}}else g(T,v.__data,0);t.bufferSubData(t.UNIFORM_BUFFER,y,v.__data)}}function g(v,S,w){typeof v=="number"||typeof v=="boolean"?S[0]=v:v.isMatrix3?(S[0]=v.elements[0],S[1]=v.elements[1],S[2]=v.elements[2],S[3]=0,S[4]=v.elements[3],S[5]=v.elements[4],S[6]=v.elements[5],S[7]=0,S[8]=v.elements[6],S[9]=v.elements[7],S[10]=v.elements[8],S[11]=0):ArrayBuffer.isView(v)?S.set(new v.constructor(v.buffer,v.byteOffset,S.length)):v.toArray(S,w)}function x(v,S,w,E){let y=v.value,T=S+"_"+w;if(E[T]===void 0)return typeof y=="number"||typeof y=="boolean"?E[T]=y:ArrayBuffer.isView(y)?E[T]=y.slice():E[T]=y.clone(),!0;{let R=E[T];if(typeof y=="number"||typeof y=="boolean"){if(R!==y)return E[T]=y,!0}else{if(ArrayBuffer.isView(y))return!0;if(R.equals(y)===!1)return R.copy(y),!0}}return!1}function m(v){let S=v.uniforms,w=0,E=16;for(let T=0,R=S.length;T<R;T++){let F=Array.isArray(S[T])?S[T]:[S[T]];for(let O=0,z=F.length;O<z;O++){let L=F[O],V=Array.isArray(L.value)?L.value:[L.value];for(let N=0,D=V.length;N<D;N++){let H=V[N],G=p(H),$=w%E,J=$%G.boundary,ve=$+J;w+=J,ve!==0&&E-ve<G.storage&&(w+=E-ve),L.__data=new Float32Array(G.storage/Float32Array.BYTES_PER_ELEMENT),L.__offset=w,w+=G.storage}}}let y=w%E;return y>0&&(w+=E-y),v.__size=w,v.__cache={},this}function p(v){let S={boundary:0,storage:0};return typeof v=="number"||typeof v=="boolean"?(S.boundary=4,S.storage=4):v.isVector2?(S.boundary=8,S.storage=8):v.isVector3||v.isColor?(S.boundary=16,S.storage=12):v.isVector4?(S.boundary=16,S.storage=16):v.isMatrix3?(S.boundary=48,S.storage=48):v.isMatrix4?(S.boundary=64,S.storage=64):v.isTexture?dt("WebGLRenderer: Texture samplers can not be part of an uniforms group."):ArrayBuffer.isView(v)?(S.boundary=16,S.storage=v.byteLength):dt("WebGLRenderer: Unsupported uniform value type.",v),S}function _(v){let S=v.target;S.removeEventListener("dispose",_);let w=o.indexOf(S.__bindingPointIndex);o.splice(w,1),t.deleteBuffer(r[S.id]),delete r[S.id],delete s[S.id]}function M(){for(let v in r)t.deleteBuffer(r[v]);o=[],r={},s={}}return{bind:l,update:c,dispose:M}}var D3=new Uint16Array([12469,15057,12620,14925,13266,14620,13807,14376,14323,13990,14545,13625,14713,13328,14840,12882,14931,12528,14996,12233,15039,11829,15066,11525,15080,11295,15085,10976,15082,10705,15073,10495,13880,14564,13898,14542,13977,14430,14158,14124,14393,13732,14556,13410,14702,12996,14814,12596,14891,12291,14937,11834,14957,11489,14958,11194,14943,10803,14921,10506,14893,10278,14858,9960,14484,14039,14487,14025,14499,13941,14524,13740,14574,13468,14654,13106,14743,12678,14818,12344,14867,11893,14889,11509,14893,11180,14881,10751,14852,10428,14812,10128,14765,9754,14712,9466,14764,13480,14764,13475,14766,13440,14766,13347,14769,13070,14786,12713,14816,12387,14844,11957,14860,11549,14868,11215,14855,10751,14825,10403,14782,10044,14729,9651,14666,9352,14599,9029,14967,12835,14966,12831,14963,12804,14954,12723,14936,12564,14917,12347,14900,11958,14886,11569,14878,11247,14859,10765,14828,10401,14784,10011,14727,9600,14660,9289,14586,8893,14508,8533,15111,12234,15110,12234,15104,12216,15092,12156,15067,12010,15028,11776,14981,11500,14942,11205,14902,10752,14861,10393,14812,9991,14752,9570,14682,9252,14603,8808,14519,8445,14431,8145,15209,11449,15208,11451,15202,11451,15190,11438,15163,11384,15117,11274,15055,10979,14994,10648,14932,10343,14871,9936,14803,9532,14729,9218,14645,8742,14556,8381,14461,8020,14365,7603,15273,10603,15272,10607,15267,10619,15256,10631,15231,10614,15182,10535,15118,10389,15042,10167,14963,9787,14883,9447,14800,9115,14710,8665,14615,8318,14514,7911,14411,7507,14279,7198,15314,9675,15313,9683,15309,9712,15298,9759,15277,9797,15229,9773,15166,9668,15084,9487,14995,9274,14898,8910,14800,8539,14697,8234,14590,7790,14479,7409,14367,7067,14178,6621,15337,8619,15337,8631,15333,8677,15325,8769,15305,8871,15264,8940,15202,8909,15119,8775,15022,8565,14916,8328,14804,8009,14688,7614,14569,7287,14448,6888,14321,6483,14088,6171,15350,7402,15350,7419,15347,7480,15340,7613,15322,7804,15287,7973,15229,8057,15148,8012,15046,7846,14933,7611,14810,7357,14682,7069,14552,6656,14421,6316,14251,5948,14007,5528,15356,5942,15356,5977,15353,6119,15348,6294,15332,6551,15302,6824,15249,7044,15171,7122,15070,7050,14949,6861,14818,6611,14679,6349,14538,6067,14398,5651,14189,5311,13935,4958,15359,4123,15359,4153,15356,4296,15353,4646,15338,5160,15311,5508,15263,5829,15188,6042,15088,6094,14966,6001,14826,5796,14678,5543,14527,5287,14377,4985,14133,4586,13869,4257,15360,1563,15360,1642,15358,2076,15354,2636,15341,3350,15317,4019,15273,4429,15203,4732,15105,4911,14981,4932,14836,4818,14679,4621,14517,4386,14359,4156,14083,3795,13808,3437,15360,122,15360,137,15358,285,15355,636,15344,1274,15322,2177,15281,2765,15215,3223,15120,3451,14995,3569,14846,3567,14681,3466,14511,3305,14344,3121,14037,2800,13753,2467,15360,0,15360,1,15359,21,15355,89,15346,253,15325,479,15287,796,15225,1148,15133,1492,15008,1749,14856,1882,14685,1886,14506,1783,14324,1608,13996,1398,13702,1183]),ss=null;function N3(){return ss===null&&(ss=new Hc(D3,16,16,bo,gi),ss.name="DFG_LUT",ss.minFilter=Lt,ss.magFilter=Lt,ss.wrapS=mi,ss.wrapT=mi,ss.generateMipmaps=!1,ss.needsUpdate=!0),ss}var Kd=class{constructor(e={}){let{canvas:n=$_(),context:i=null,depth:r=!0,stencil:s=!1,alpha:o=!1,antialias:a=!1,premultipliedAlpha:l=!0,preserveDrawingBuffer:c=!1,powerPreference:u="default",failIfMajorPerformanceCaveat:f=!1,reversedDepthBuffer:h=!1,outputBufferType:d=er}=e;this.isWebGLRenderer=!0;let g;if(i!==null){if(typeof WebGLRenderingContext<"u"&&i instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");g=i.getContextAttributes().alpha}else g=o;let x=d,m=new Set([pd,dd,fd]),p=new Set([er,Fr,Sl,wl,cd,ud]),_=new Uint32Array(4),M=new Int32Array(4),v=new P,S=null,w=null,E=[],y=[],T=null;this.domElement=n,this.debug={checkShaderErrors:!0,diagnostics:{keywords:!1},onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=Qi,this.toneMappingExposure=1,this.transmissionResolutionScale=1;let R=this,F=!1,O=null,z=null,L=null,V=null;this._outputColorSpace=Ki;let N=0,D=0,H=null,G=-1,$=null,J=new Vt,ve=new Vt,ye=null,rt=new Pt(0),ze=0,nt=n.width,Z=n.height,te=1,Te=null,je=null,Re=new Vt(0,0,nt,Z),le=new Vt(0,0,nt,Z),ge=!1,Oe=new $c,Ze=!1,St=!1,Ce=new Ot,Le=new P,at=new Vt,on={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0},tn=!1;function nn(){return H===null?te:1}let k=i;function Bn(A,B){return n.getContext(A,B)}let Tt,I,b,W,K,ne,we,Fe,re,oe,De,Qe,C,X,ae,Se,We,U,Me,ie,Ae,ue,se;try{let A={alpha:!0,depth:r,stencil:s,antialias:a,premultipliedAlpha:l,preserveDrawingBuffer:c,powerPreference:u,failIfMajorPerformanceCaveat:f};if("setAttribute"in n&&n.setAttribute("data-engine",`three.js r${"186"}`),n.addEventListener("webglcontextlost",an,!1),n.addEventListener("webglcontextrestored",Ut,!1),n.addEventListener("webglcontextcreationerror",ci,!1),k===null){let B="webgl2";if(k=Bn(B,A),k===null)throw Bn(B)?new Error("THREE.WebGLRenderer: Error creating WebGL context with your selected attributes."):new Error("THREE.WebGLRenderer: Error creating WebGL context.")}Ne()}catch(A){throw n.removeEventListener("webglcontextlost",an,!1),n.removeEventListener("webglcontextrestored",Ut,!1),n.removeEventListener("webglcontextcreationerror",ci,!1),gt("WebGLRenderer: "+A.message),A}function Ne(){Tt=new VR(k),Tt.init(),Ae=new E3(k,Tt),I=new IR(k,Tt,e,Ae),b=new A3(k,Tt),I.reversedDepthBuffer&&h&&b.buffers.depth.setReversed(!0),z=k.createFramebuffer(),L=k.createFramebuffer(),V=k.createFramebuffer(),W=new WR(k),K=new h3,ne=new T3(k,Tt,b,K,I,Ae,W),we=new zR(R),Fe=new XT(k),ue=new CR(k,Fe),re=new GR(k,Fe,W,ue),oe=new XR(k,re,Fe,ue,W),U=new $R(k,I,ne),ae=new LR(K),De=new u3(R,we,Tt,I,ue,ae),Qe=new I3(R,K),C=new d3,X=new y3(Tt),We=new RR(R,we,b,oe,g,l),Se=new w3(R,oe,I),se=new L3(k,W,I,b),Me=new PR(k,Tt,W),ie=new HR(k,Tt,W),W.programs=De.programs,R.capabilities=I,R.extensions=Tt,R.properties=K,R.renderLists=C,R.shadowMap=Se,R.state=b,R.info=W}x!==er&&(T=new qR(x,n.width,n.height,a,r,s));let Ge=new Ag(R,k);this.xr=Ge,this.getContext=function(){return k},this.getContextAttributes=function(){return k.getContextAttributes()},this.forceContextLoss=function(){let A=Tt.get("WEBGL_lose_context");A&&A.loseContext()},this.forceContextRestore=function(){let A=Tt.get("WEBGL_lose_context");A&&A.restoreContext()},this.getPixelRatio=function(){return te},this.setPixelRatio=function(A){A!==void 0&&(te=A,this.setSize(nt,Z,!1))},this.getSize=function(A){return A.set(nt,Z)},this.setSize=function(A,B,Q=!0){if(Ge.isPresenting){dt("WebGLRenderer: Can't change size while VR device is presenting.");return}nt=A,Z=B,n.width=Math.floor(A*te),n.height=Math.floor(B*te),Q===!0&&(n.style.width=A+"px",n.style.height=B+"px"),T!==null&&T.setSize(n.width,n.height),this.setViewport(0,0,A,B)},this.getDrawingBufferSize=function(A){return A.set(nt*te,Z*te).floor()},this.setDrawingBufferSize=function(A,B,Q){nt=A,Z=B,te=Q,n.width=Math.floor(A*Q),n.height=Math.floor(B*Q),this.setViewport(0,0,A,B)},this.setEffects=function(A){if(x===er){gt("WebGLRenderer: setEffects() requires outputBufferType set to HalfFloatType or FloatType.");return}if(A){for(let B=0;B<A.length;B++)if(A[B].isOutputPass===!0){dt("WebGLRenderer: OutputPass is not needed in setEffects(). Tone mapping and color space conversion are applied automatically.");break}}T.setEffects(A||[])},this.getCurrentViewport=function(A){return A.copy(J)},this.getViewport=function(A){return A.copy(Re)},this.setViewport=function(A,B,Q,q){A.isVector4?Re.set(A.x,A.y,A.z,A.w):Re.set(A,B,Q,q),b.viewport(J.copy(Re).multiplyScalar(te).round())},this.getScissor=function(A){return A.copy(le)},this.setScissor=function(A,B,Q,q){A.isVector4?le.set(A.x,A.y,A.z,A.w):le.set(A,B,Q,q),b.scissor(ve.copy(le).multiplyScalar(te).round())},this.getScissorTest=function(){return ge},this.setScissorTest=function(A){b.setScissorTest(ge=A)},this.setOpaqueSort=function(A){Te=A},this.setTransparentSort=function(A){je=A},this.getClearColor=function(A){return A.copy(We.getClearColor())},this.setClearColor=function(){We.setClearColor(...arguments)},this.getClearAlpha=function(){return We.getClearAlpha()},this.setClearAlpha=function(){We.setClearAlpha(...arguments)},this.clear=function(A=!0,B=!0,Q=!0){let q=0;if(A){let j=!1;if(H!==null){let Ve=H.texture.format;j=m.has(Ve)}if(j){let Ve=H.texture.type,Ye=p.has(Ve),Be=We.getClearColor(),Ke=We.getClearAlpha(),tt=Be.r,wt=Be.g,Ct=Be.b;Ye?(_[0]=tt,_[1]=wt,_[2]=Ct,_[3]=Ke,k.clearBufferuiv(k.COLOR,0,_)):(M[0]=tt,M[1]=wt,M[2]=Ct,M[3]=Ke,k.clearBufferiv(k.COLOR,0,M))}else q|=k.COLOR_BUFFER_BIT}B&&(q|=k.DEPTH_BUFFER_BIT,this.state.buffers.depth.setMask(!0)),Q&&(q|=k.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),q!==0&&k.clear(q)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.setNodesHandler=function(A){A.setRenderer(this),O=A},this.dispose=function(){n.removeEventListener("webglcontextlost",an,!1),n.removeEventListener("webglcontextrestored",Ut,!1),n.removeEventListener("webglcontextcreationerror",ci,!1),We.dispose(),C.dispose(),X.dispose(),K.dispose(),we.dispose(),oe.dispose(),ue.dispose(),se.dispose(),De.dispose(),Ge.dispose(),Ge.removeEventListener("sessionstart",$v),Ge.removeEventListener("sessionend",Xv),Ho.stop()};function an(A){A.preventDefault(),kc("WebGLRenderer: Context Lost."),F=!0}function Ut(){kc("WebGLRenderer: Context Restored."),F=!1;let A=W.autoReset,B=Se.enabled,Q=Se.autoUpdate,q=Se.needsUpdate,j=Se.type;Ne(),W.autoReset=A,Se.enabled=B,Se.autoUpdate=Q,Se.needsUpdate=q,Se.type=j}function ci(A){gt("WebGLRenderer: A WebGL context could not be created. Reason: ",A.statusMessage)}function fr(A){let B=A.target;B.removeEventListener("dispose",fr),Ch(B)}function Ch(A){Nm(A),K.remove(A)}function Nm(A){let B=K.get(A).programs;B!==void 0&&(B.forEach(function(Q){De.releaseProgram(Q)}),A.isShaderMaterial&&De.releaseShaderCache(A))}this.renderBufferDirect=function(A,B,Q,q,j,Ve){B===null&&(B=on);let Ye=j.isMesh&&j.matrixWorld.determinantAffine()<0,Be=MA(A,B,Q,q,j);b.setMaterial(q,Ye);let Ke=Q.index,tt=1;if(q.wireframe===!0){if(Ke=re.getWireframeAttribute(Q),Ke===void 0)return;tt=2}let wt=Q.drawRange,Ct=Q.attributes.position,Je=wt.start*tt,jt=(wt.start+wt.count)*tt;Ve!==null&&(Je=Math.max(Je,Ve.start*tt),jt=Math.min(jt,(Ve.start+Ve.count)*tt)),Ke!==null?(Je=Math.max(Je,0),jt=Math.min(jt,Ke.count)):Ct!=null&&(Je=Math.max(Je,0),jt=Math.min(jt,Ct.count));let zn=jt-Je;if(zn<0||zn===1/0)return;ue.setup(j,q,Be,Q,Ke);let _n,dn=Me;if(Ke!==null&&(_n=Fe.get(Ke),dn=ie,dn.setIndex(_n)),j.isMesh)q.wireframe===!0?(b.setLineWidth(q.wireframeLinewidth*nn()),dn.setMode(k.LINES)):dn.setMode(k.TRIANGLES);else if(j.isLine){let ui=q.linewidth;ui===void 0&&(ui=1),b.setLineWidth(ui*nn()),j.isLineSegments?dn.setMode(k.LINES):j.isLineLoop?dn.setMode(k.LINE_LOOP):dn.setMode(k.LINE_STRIP)}else j.isPoints?dn.setMode(k.POINTS):j.isSprite&&dn.setMode(k.TRIANGLES);if(j.isBatchedMesh)if(Tt.get("WEBGL_multi_draw"))dn.renderMultiDraw(j._multiDrawStarts,j._multiDrawCounts,j._multiDrawCount);else{let ui=j._multiDrawStarts,Xe=j._multiDrawCounts,Ei=j._multiDrawCount,kt=Ke?Fe.get(Ke).bytesPerElement:1,dr=K.get(q).currentProgram.getUniforms();for(let Xr=0;Xr<Ei;Xr++)dr.setValue(k,"_gl_DrawID",Xr),dn.render(ui[Xr]/kt,Xe[Xr])}else if(j.isInstancedMesh)dn.renderInstances(Je,zn,j.count);else if(Q.isInstancedBufferGeometry){let ui=Q._maxInstanceCount!==void 0?Q._maxInstanceCount:1/0,Xe=Math.min(Q.instanceCount,ui);dn.renderInstances(Je,zn,Xe)}else dn.render(Je,zn)};function Ph(A,B,Q,q){O!==null&&A.isNodeMaterial&&O.setObject(q,A),Ze===!0&&ae.setState(A,Q,!1),A.transparent===!0&&A.side===rs&&A.forceSinglePass===!1?(A.side=Ii,A.needsUpdate=!0,Lh(A,B,q),A.side=is,A.needsUpdate=!0,Lh(A,B,q),A.side=rs):Lh(A,B,q)}this.compile=function(A,B,Q=null){Q===null&&(Q=A),O!==null&&O.renderStart(A,B,Q),w=X.get(Q),w.init(B),y.push(w),Q.traverseVisible(function(j){j.isLight&&j.layers.test(B.layers)&&(w.pushLight(j),j.castShadow&&w.pushShadow(j))}),A!==Q&&A.traverseVisible(function(j){j.isLight&&j.layers.test(B.layers)&&(w.pushLight(j),j.castShadow&&w.pushShadow(j))}),w.setupLights(),O!==null&&O.updateLights(w.state.lightsArray),St=this.localClippingEnabled,Ze=ae.init(this.clippingPlanes,St),Ze===!0&&ae.setGlobalState(this.clippingPlanes,B),O!==null&&Se.render(w.state.shadowsArray,Q,B);let q=new Set;return A.traverse(function(j){if(!(j.isMesh||j.isPoints||j.isLine||j.isSprite))return;let Ve=j.material;if(Ve)if(Array.isArray(Ve))for(let Ye=0;Ye<Ve.length;Ye++){let Be=Ve[Ye];Ph(Be,Q,B,j),q.add(Be)}else Ph(Ve,Q,B,j),q.add(Ve)}),w=y.pop(),O!==null&&O.renderEnd(),q},this.compileAsync=function(A,B,Q=null){let q=this.compile(A,B,Q);return new Promise(j=>{function Ve(){if(q.forEach(function(Ye){let Ke=K.get(Ye).currentProgram;(Ke===void 0||Ke.isReady())&&q.delete(Ye)}),q.size===0){j(A);return}setTimeout(Ve,10)}Tt.get("KHR_parallel_shader_compile")!==null?Ve():setTimeout(Ve,10)})};let Go=null;function gc(A){Go&&Go(A)}function $v(){Ho.stop()}function Xv(){Ho.start()}let Ho=new _b;Ho.setAnimationLoop(gc),typeof self<"u"&&Ho.setContext(self),this.setAnimationLoop=function(A){Go=A,Ge.setAnimationLoop(A),A===null?Ho.stop():Ho.start()},Ge.addEventListener("sessionstart",$v),Ge.addEventListener("sessionend",Xv),this.render=function(A,B){if(B!==void 0&&B.isCamera!==!0){gt("WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(F===!0)return;O!==null&&O.renderStart(A,B);let Q=Ge.enabled===!0&&Ge.isPresenting===!0,q=T!==null&&(H===null||Q)&&T.begin(R,H);if(A.matrixWorldAutoUpdate===!0&&A.updateMatrixWorld(),B.parent===null&&B.matrixWorldAutoUpdate===!0&&B.updateMatrixWorld(),Ge.enabled===!0&&Ge.isPresenting===!0&&(T===null||T.isCompositing()===!1)&&(Ge.cameraAutoUpdate===!0&&Ge.updateCamera(B),B=Ge.getCamera()),A.isScene===!0&&A.onBeforeRender(R,A,B,H),w=X.get(A,y.length),w.init(B),w.state.textureUnits=ne.getTextureUnits(),y.push(w),Ce.multiplyMatrices(B.projectionMatrix,B.matrixWorldInverse),Oe.setFromProjectionMatrix(Ce,Nr,B.reversedDepth),St=this.localClippingEnabled,Ze=ae.init(this.clippingPlanes,St),S=C.get(A,E.length),S.init(),E.push(S),Ge.enabled===!0&&Ge.isPresenting===!0){let Ye=R.xr.getDepthSensingMesh();Ye!==null&&Om(Ye,B,-1/0,R.sortObjects)}Om(A,B,0,R.sortObjects),S.finish(),O!==null&&O.updateLights(w.state.lightsArray),R.sortObjects===!0&&S.sort(Te,je),tn=Ge.enabled===!1||Ge.isPresenting===!1||Ge.hasDepthSensing()===!1,tn&&We.addToRenderList(S,A),this.info.render.frame++,this.info.autoReset===!0&&this.info.reset(),Ze===!0&&ae.beginShadows();let j=w.state.shadowsArray;if(Se.render(j,A,B),Ze===!0&&ae.endShadows(),(q&&T.hasRenderPass())===!1){let Ye=S.opaque,Be=S.transmissive;if(w.setupLights(),B.isArrayCamera){let Ke=B.cameras;if(Be.length>0)for(let tt=0,wt=Ke.length;tt<wt;tt++){let Ct=Ke[tt];qv(Ye,Be,A,Ct)}tn&&We.render(A);for(let tt=0,wt=Ke.length;tt<wt;tt++){let Ct=Ke[tt];Yv(S,A,Ct,Ct.viewport)}}else Be.length>0&&qv(Ye,Be,A,B),tn&&We.render(A),Yv(S,A,B)}H!==null&&D===0&&(ne.updateMultisampleRenderTarget(H),ne.updateRenderTargetMipmap(H)),q&&T.end(R),A.isScene===!0&&A.onAfterRender(R,A,B),ue.resetDefaultState(),G=-1,$=null,y.pop(),y.length>0?(w=y[y.length-1],ne.setTextureUnits(w.state.textureUnits),Ze===!0&&ae.setGlobalState(R.clippingPlanes,w.state.camera)):w=null,E.pop(),E.length>0?S=E[E.length-1]:S=null,O!==null&&O.renderEnd()};function Om(A,B,Q,q){if(A.visible===!1)return;if(A.layers.test(B.layers)){if(A.isGroup)Q=A.renderOrder;else if(A.isLOD)A.autoUpdate===!0&&A.update(B);else if(A.isLightProbeGrid)w.pushLightProbeGrid(A);else if(A.isLight)w.pushLight(A),A.castShadow&&w.pushShadow(A);else if(A.isSprite){if(!A.frustumCulled||A.intersectsFrustum(Oe)){q&&at.setFromMatrixPosition(A.matrixWorld).applyMatrix4(Ce);let Ye=oe.update(A),Be=A.material;Be.visible&&S.push(A,Ye,Be,Q,at.z,null,B)}}else if((A.isMesh||A.isLine||A.isPoints)&&(!A.frustumCulled||A.intersectsFrustum(Oe))){let Ye=oe.update(A),Be=A.material;if(q&&(A.boundingSphere!==void 0?(A.boundingSphere===null&&A.computeBoundingSphere(),at.copy(A.boundingSphere.center)):(Ye.boundingSphere===null&&Ye.computeBoundingSphere(),at.copy(Ye.boundingSphere.center)),at.applyMatrix4(A.matrixWorld).applyMatrix4(Ce)),Array.isArray(Be)){let Ke=Ye.groups;for(let tt=0,wt=Ke.length;tt<wt;tt++){let Ct=Ke[tt],Je=Be[Ct.materialIndex];Je&&Je.visible&&S.push(A,Ye,Je,Q,at.z,Ct,B)}}else Be.visible&&S.push(A,Ye,Be,Q,at.z,null,B)}}let Ve=A.children;for(let Ye=0,Be=Ve.length;Ye<Be;Ye++)Om(Ve[Ye],B,Q,q)}function Yv(A,B,Q,q){let{opaque:j,transmissive:Ve,transparent:Ye}=A;w.setupLightsView(Q),Ze===!0&&ae.setGlobalState(R.clippingPlanes,Q),q&&b.viewport(J.copy(q)),j.length>0&&Ih(j,B,Q),Ve.length>0&&Ih(Ve,B,Q),Ye.length>0&&Ih(Ye,B,Q),b.buffers.depth.setTest(!0),b.buffers.depth.setMask(!0),b.buffers.color.setMask(!0),b.setPolygonOffset(!1)}function qv(A,B,Q,q){if((Q.isScene===!0?Q.overrideMaterial:null)!==null)return;if(w.state.transmissionRenderTarget[q.id]===void 0){let Je=Tt.has("EXT_color_buffer_half_float")||Tt.has("EXT_color_buffer_float");w.state.transmissionRenderTarget[q.id]=new Hn(1,1,{generateMipmaps:!0,type:Je?gi:er,minFilter:yo,samples:Math.max(4,I.samples),stencilBuffer:s,resolveDepthBuffer:!1,resolveStencilBuffer:!1,storeMultisampledDepthBuffer:!1,storeMultisampledStencilBuffer:!1,colorSpace:Et.workingColorSpace})}let Ve=w.state.transmissionRenderTarget[q.id],Ye=q.viewport||J;Ve.setSize(Ye.z*R.transmissionResolutionScale,Ye.w*R.transmissionResolutionScale);let Be=R.getRenderTarget(),Ke=R.getActiveCubeFace(),tt=R.getActiveMipmapLevel();R.setRenderTarget(Ve),R.getClearColor(rt),ze=R.getClearAlpha(),ze<1&&R.setClearColor(16777215,.5),R.clear(),tn&&We.render(Q);let wt=R.toneMapping;R.toneMapping=Qi;let Ct=q.viewport;if(q.viewport!==void 0&&(q.viewport=void 0),w.setupLightsView(q),Ze===!0&&ae.setGlobalState(R.clippingPlanes,q),Ih(A,Q,q),ne.updateMultisampleRenderTarget(Ve),ne.updateRenderTargetMipmap(Ve),Tt.has("WEBGL_multisampled_render_to_texture")===!1){let Je=!1;for(let jt=0,zn=B.length;jt<zn;jt++){let _n=B[jt],{object:dn,geometry:ui,material:Xe,group:Ei}=_n;if(Xe.side===rs&&dn.layers.test(q.layers)){let kt=Xe.side;Xe.side=Ii,Xe.needsUpdate=!0,jv(dn,Q,q,ui,Xe,Ei),Xe.side=kt,Xe.needsUpdate=!0,Je=!0}}Je===!0&&(ne.updateMultisampleRenderTarget(Ve),ne.updateRenderTargetMipmap(Ve))}R.setRenderTarget(Be,Ke,tt),R.setClearColor(rt,ze),Ct!==void 0&&(q.viewport=Ct),R.toneMapping=wt}function Ih(A,B,Q){let q=B.isScene===!0?B.overrideMaterial:null;for(let j=0,Ve=A.length;j<Ve;j++){let Ye=A[j],{object:Be,geometry:Ke,group:tt}=Ye,wt=Ye.material;wt.allowOverride===!0&&q!==null&&(wt=q),Be.layers.test(Q.layers)&&jv(Be,B,Q,Ke,wt,tt)}}function jv(A,B,Q,q,j,Ve){O!==null&&j.isNodeMaterial&&O.setObject(A,j),A.onBeforeRender(R,B,Q,q,j,Ve),A.modelViewMatrix.multiplyMatrices(Q.matrixWorldInverse,A.matrixWorld),A.normalMatrix.getNormalMatrix(A.modelViewMatrix),j.onBeforeRender(R,B,Q,q,A,Ve),j.transparent===!0&&j.side===rs&&j.forceSinglePass===!1?(j.side=Ii,j.needsUpdate=!0,R.renderBufferDirect(Q,B,q,j,A,Ve),j.side=is,j.needsUpdate=!0,R.renderBufferDirect(Q,B,q,j,A,Ve),j.side=rs):R.renderBufferDirect(Q,B,q,j,A,Ve),A.onAfterRender(R,B,Q,q,j,Ve)}function Lh(A,B,Q){B.isScene!==!0&&(B=on);let q=K.get(A),j=w.state.lights,Ve=w.state.shadowsArray,Ye=j.state.version,Be=De.getParameters(A,j.state,Ve,B,Q,w.state.lightProbeGridArray),Ke=De.getProgramCacheKey(Be),tt=q.programs;q.environment=A.isMeshStandardMaterial||A.isMeshLambertMaterial||A.isMeshPhongMaterial?B.environment:null,q.fog=B.fog;let wt=A.isMeshStandardMaterial||A.isMeshLambertMaterial&&!A.envMap||A.isMeshPhongMaterial&&!A.envMap;q.envMap=we.get(A.envMap||q.environment,wt),q.envMapRotation=q.environment!==null&&A.envMap===null?B.environmentRotation:A.envMapRotation,tt===void 0&&(A.addEventListener("dispose",fr),tt=new Map,q.programs=tt);let Ct=tt.get(Ke);if(Ct!==void 0){if(q.currentProgram===Ct&&q.lightsStateVersion===Ye)return Kv(A,Be),Ct}else Be.uniforms=De.getUniforms(A),O!==null&&A.isNodeMaterial&&O.build(A,Q,Be),A.onBeforeCompile(Be,R),Ct=De.acquireProgram(Be,Ke),tt.set(Ke,Ct),q.uniforms=Be.uniforms;let Je=q.uniforms;return(!A.isShaderMaterial&&!A.isRawShaderMaterial||A.clipping===!0)&&(Je.clippingPlanes=ae.uniform),Kv(A,Be),q.needsLights=wA(A),q.lightsStateVersion=Ye,q.needsLights&&(Je.ambientLightColor.value=j.state.ambient,Je.lightProbe.value=j.state.probe,Je.sunLights.value=j.state.sun,Je.sunLightShadows.value=j.state.sunShadow,Je.directionalLights.value=j.state.directional,Je.directionalLightShadows.value=j.state.directionalShadow,Je.spotLights.value=j.state.spot,Je.spotLightShadows.value=j.state.spotShadow,Je.rectAreaLights.value=j.state.rectArea,Je.ltc_1.value=j.state.rectAreaLTC1,Je.ltc_2.value=j.state.rectAreaLTC2,Je.pointLights.value=j.state.point,Je.pointLightShadows.value=j.state.pointShadow,Je.hemisphereLights.value=j.state.hemi,Je.sunShadowMatrix.value=j.state.sunShadowMatrix,Je.sunShadowCascade.value=j.state.sunShadowCascade,Je.directionalShadowMatrix.value=j.state.directionalShadowMatrix,Je.spotLightMatrix.value=j.state.spotLightMatrix,Je.spotLightMap.value=j.state.spotLightMap,Je.pointShadowMatrix.value=j.state.pointShadowMatrix),q.lightProbeGrid=w.state.lightProbeGridArray.length>0,q.currentProgram=Ct,q.uniformsList=null,Ct}function Zv(A){if(A.uniformsList===null){let B=A.currentProgram.getUniforms();A.uniformsList=El.seqWithValue(B.seq,A.uniforms)}return A.uniformsList}function Kv(A,B){let Q=K.get(A);Q.outputColorSpace=B.outputColorSpace,Q.batching=B.batching,Q.batchingColor=B.batchingColor,Q.instancing=B.instancing,Q.instancingColor=B.instancingColor,Q.instancingMorph=B.instancingMorph,Q.skinning=B.skinning,Q.morphTargets=B.morphTargets,Q.morphNormals=B.morphNormals,Q.morphColors=B.morphColors,Q.morphTargetsCount=B.morphTargetsCount,Q.numClippingPlanes=B.numClippingPlanes,Q.numIntersection=B.numClipIntersection,Q.vertexAlphas=B.vertexAlphas,Q.vertexTangents=B.vertexTangents,Q.toneMapping=B.toneMapping}function bA(A,B){if(A.length===0)return null;if(A.length===1)return A[0].texture!==null?A[0]:null;v.setFromMatrixPosition(B.matrixWorld);for(let Q=0,q=A.length;Q<q;Q++){let j=A[Q];if(j.texture!==null&&j.boundingBox.containsPoint(v))return j}return null}function MA(A,B,Q,q,j){B.isScene!==!0&&(B=on),ne.resetTextureUnits();let Ve=B.fog,Ye=q.isMeshStandardMaterial||q.isMeshLambertMaterial||q.isMeshPhongMaterial?B.environment:null,Be=H===null?R.outputColorSpace:H.isXRRenderTarget===!0?H.texture.colorSpace:Et.workingColorSpace,Ke=q.isMeshStandardMaterial||q.isMeshLambertMaterial&&!q.envMap||q.isMeshPhongMaterial&&!q.envMap,tt=we.get(q.envMap||Ye,Ke),wt=q.vertexColors===!0&&!!Q.attributes.color&&Q.attributes.color.itemSize===4,Ct=!!Q.attributes.tangent&&(!!q.normalMap||q.anisotropy>0),Je=!!Q.morphAttributes.position,jt=!!Q.morphAttributes.normal,zn=!!Q.morphAttributes.color,_n=Qi;q.toneMapped&&(H===null||H.isXRRenderTarget===!0)&&(_n=R.toneMapping);let dn=Q.morphAttributes.position||Q.morphAttributes.normal||Q.morphAttributes.color,ui=dn!==void 0?dn.length:0,Xe=K.get(q),Ei=w.state.lights;if(Ze===!0&&(St===!0||A!==$)){let xn=A===$&&q.id===G;ae.setState(q,A,xn)}let kt=!1;q.version===Xe.__version?(Xe.needsLights&&Xe.lightsStateVersion!==Ei.state.version||Xe.outputColorSpace!==Be||j.isBatchedMesh&&Xe.batching===!1||!j.isBatchedMesh&&Xe.batching===!0||j.isBatchedMesh&&Xe.batchingColor===!0&&j._colorsTexture===null||j.isBatchedMesh&&Xe.batchingColor===!1&&j._colorsTexture!==null||j.isInstancedMesh&&Xe.instancing===!1||!j.isInstancedMesh&&Xe.instancing===!0||j.isSkinnedMesh&&Xe.skinning===!1||!j.isSkinnedMesh&&Xe.skinning===!0||j.isInstancedMesh&&Xe.instancingColor===!0&&j.instanceColor===null||j.isInstancedMesh&&Xe.instancingColor===!1&&j.instanceColor!==null||j.isInstancedMesh&&Xe.instancingMorph===!0&&j.morphTexture===null||j.isInstancedMesh&&Xe.instancingMorph===!1&&j.morphTexture!==null||Xe.envMap!==tt||q.fog===!0&&Xe.fog!==Ve||Xe.numClippingPlanes!==void 0&&(Xe.numClippingPlanes!==ae.numPlanes||Xe.numIntersection!==ae.numIntersection)||Xe.vertexAlphas!==wt||Xe.vertexTangents!==Ct||Xe.morphTargets!==Je||Xe.morphNormals!==jt||Xe.morphColors!==zn||Xe.toneMapping!==_n||Xe.morphTargetsCount!==ui||!!Xe.lightProbeGrid!=w.state.lightProbeGridArray.length>0)&&(kt=!0):(kt=!0,Xe.__version=q.version);let dr=Xe.currentProgram;kt===!0&&(dr=Lh(q,B,j),O&&q.isNodeMaterial&&O.onUpdateProgram(q,dr,Xe));let Xr=!1,eo=!1,Va=!1,ln=dr.getUniforms(),On=Xe.uniforms;if(b.useProgram(dr.program)&&(Xr=!0,eo=!0,Va=!0),q.id!==G&&(G=q.id,eo=!0),Xe.needsLights){let xn=bA(w.state.lightProbeGridArray,j);Xe.lightProbeGrid!==xn&&(Xe.lightProbeGrid=xn,eo=!0)}if(Xr||$!==A){b.buffers.depth.getReversed()&&A.reversedDepth!==!0&&(A._reversedDepth=!0,A.updateProjectionMatrix()),ln.setValue(k,"projectionMatrix",A.projectionMatrix),ln.setValue(k,"viewMatrix",A.matrixWorldInverse);let no=ln.map.cameraPosition;no!==void 0&&no.setValue(k,Le.setFromMatrixPosition(A.matrixWorld)),I.logarithmicDepthBuffer&&ln.setValue(k,"logDepthBufFC",2/(Math.log(A.far+1)/Math.LN2)),(q.isMeshPhongMaterial||q.isMeshToonMaterial||q.isMeshLambertMaterial||q.isMeshBasicMaterial||q.isMeshStandardMaterial||q.isShaderMaterial)&&ln.setValue(k,"isOrthographic",A.isOrthographicCamera===!0),$!==A&&($=A,eo=!0,Va=!0)}if(Xe.needsLights&&(Ei.state.sunShadowMap.length>0&&ln.setValue(k,"sunShadowMap",Ei.state.sunShadowMap,ne),Ei.state.directionalShadowMap.length>0&&ln.setValue(k,"directionalShadowMap",Ei.state.directionalShadowMap,ne),Ei.state.spotShadowMap.length>0&&ln.setValue(k,"spotShadowMap",Ei.state.spotShadowMap,ne),Ei.state.pointShadowMap.length>0&&ln.setValue(k,"pointShadowMap",Ei.state.pointShadowMap,ne)),j.isSkinnedMesh){ln.setOptional(k,j,"bindMatrix"),ln.setOptional(k,j,"bindMatrixInverse");let xn=j.skeleton;xn&&(xn.boneTexture===null&&xn.computeBoneTexture(),ln.setValue(k,"boneTexture",xn.boneTexture,ne))}j.isBatchedMesh&&(ln.setOptional(k,j,"batchingTexture"),ln.setValue(k,"batchingTexture",j._matricesTexture,ne),ln.setOptional(k,j,"batchingIdTexture"),ln.setValue(k,"batchingIdTexture",j._indirectTexture,ne),ln.setOptional(k,j,"batchingColorTexture"),j._colorsTexture!==null&&ln.setValue(k,"batchingColorTexture",j._colorsTexture,ne));let to=Q.morphAttributes;if((to.position!==void 0||to.normal!==void 0||to.color!==void 0)&&U.update(j,Q,dr),(eo||Xe.receiveShadow!==j.receiveShadow)&&(Xe.receiveShadow=j.receiveShadow,ln.setValue(k,"receiveShadow",j.receiveShadow)),(q.isMeshStandardMaterial||q.isMeshLambertMaterial||q.isMeshPhongMaterial)&&q.envMap===null&&B.environment!==null&&(On.envMapIntensity.value=B.environmentIntensity),On.dfgLUT!==void 0&&(On.dfgLUT.value=N3()),eo){if(ln.setValue(k,"toneMappingExposure",R.toneMappingExposure),Xe.needsLights&&SA(On,Va),Ve&&q.fog===!0&&Qe.refreshFogUniforms(On,Ve),Qe.refreshMaterialUniforms(On,q,te,Z,w.state.transmissionRenderTarget[A.id]),Xe.needsLights&&Xe.lightProbeGrid){let xn=Xe.lightProbeGrid;On.probesSH.value=xn.texture,On.probesMin.value.copy(xn.boundingBox.min),On.probesMax.value.copy(xn.boundingBox.max),On.probesResolution.value.copy(xn.resolution)}El.upload(k,Zv(Xe),On,ne)}if(q.isShaderMaterial&&q.uniformsNeedUpdate===!0&&(El.upload(k,Zv(Xe),On,ne),q.uniformsNeedUpdate=!1),q.isSpriteMaterial&&ln.setValue(k,"center",j.center),ln.setValue(k,"modelViewMatrix",j.modelViewMatrix),ln.setValue(k,"normalMatrix",j.normalMatrix),ln.setValue(k,"modelMatrix",j.matrixWorld),q.uniformsGroups!==void 0){let xn=q.uniformsGroups;for(let no=0,Ga=xn.length;no<Ga;no++){let Qv=xn[no];se.update(Qv,dr),se.bind(Qv,dr)}}return dr}function SA(A,B){A.ambientLightColor.needsUpdate=B,A.lightProbe.needsUpdate=B,A.sunLights.needsUpdate=B,A.sunLightShadows.needsUpdate=B,A.directionalLights.needsUpdate=B,A.directionalLightShadows.needsUpdate=B,A.pointLights.needsUpdate=B,A.pointLightShadows.needsUpdate=B,A.spotLights.needsUpdate=B,A.spotLightShadows.needsUpdate=B,A.rectAreaLights.needsUpdate=B,A.hemisphereLights.needsUpdate=B}function wA(A){return A.isMeshLambertMaterial||A.isMeshToonMaterial||A.isMeshPhongMaterial||A.isMeshStandardMaterial||A.isShadowMaterial||A.isShaderMaterial&&A.lights===!0}this.getActiveCubeFace=function(){return N},this.getActiveMipmapLevel=function(){return D},this.getRenderTarget=function(){return H},this.setRenderTargetTextures=function(A,B,Q){let q=K.get(A);q.__autoAllocateDepthBuffer=A.resolveDepthBuffer===!1,q.__autoAllocateDepthBuffer===!1&&(q.__useRenderToTexture=!1),K.get(A.texture).__webglTexture=B,K.get(A.depthTexture).__webglTexture=q.__autoAllocateDepthBuffer?void 0:Q,q.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(A,B){let Q=K.get(A);Q.__webglFramebuffer=B,Q.__useDefaultFramebuffer=B===void 0},this.setRenderTarget=function(A,B=0,Q=0){H=A,N=B,D=Q;let q=null,j=!1,Ve=!1;if(A){let Be=K.get(A);if(Be.__useDefaultFramebuffer!==void 0){b.bindFramebuffer(k.FRAMEBUFFER,Be.__webglFramebuffer),J.copy(A.viewport),ve.copy(A.scissor),ye=A.scissorTest,b.viewport(J),b.scissor(ve),b.setScissorTest(ye),G=-1;return}else if(Be.__webglFramebuffer===void 0)ne.setupRenderTarget(A);else if(Be.__hasExternalTextures)ne.rebindTextures(A,K.get(A.texture).__webglTexture,K.get(A.depthTexture).__webglTexture);else if(A.depthBuffer){let wt=A.depthTexture;if(Be.__boundDepthTexture!==wt){if(wt!==null&&K.has(wt)&&(A.width!==wt.image.width||A.height!==wt.image.height))throw new Error("THREE.WebGLRenderer: Attached DepthTexture is initialized to the incorrect size.");ne.setupDepthRenderbuffer(A)}}let Ke=A.texture;(Ke.isData3DTexture||Ke.isDataArrayTexture||Ke.isCompressedArrayTexture)&&(Ve=!0);let tt=K.get(A).__webglFramebuffer;A.isWebGLCubeRenderTarget?(Array.isArray(tt[B])?q=tt[B][Q]:q=tt[B],j=!0):A.samples>0&&ne.useMultisampledRTT(A)===!1?q=K.get(A).__webglMultisampledFramebuffer:Array.isArray(tt)?q=tt[Q]:q=tt,J.copy(A.viewport),ve.copy(A.scissor),ye=A.scissorTest}else J.copy(Re).multiplyScalar(te).floor(),ve.copy(le).multiplyScalar(te).floor(),ye=ge;if(Q!==0&&(q=z),b.bindFramebuffer(k.FRAMEBUFFER,q)&&b.drawBuffers(A,q),b.viewport(J),b.scissor(ve),b.setScissorTest(ye),j){let Be=K.get(A.texture);k.framebufferTexture2D(k.FRAMEBUFFER,k.COLOR_ATTACHMENT0,k.TEXTURE_CUBE_MAP_POSITIVE_X+B,Be.__webglTexture,Q)}else if(Ve){let Be=B;for(let Ke=0;Ke<A.textures.length;Ke++){let tt=K.get(A.textures[Ke]);k.framebufferTextureLayer(k.FRAMEBUFFER,k.COLOR_ATTACHMENT0+Ke,tt.__webglTexture,Q,Be)}}else if(A!==null&&Q!==0){let Be=K.get(A.texture);k.framebufferTexture2D(k.FRAMEBUFFER,k.COLOR_ATTACHMENT0,k.TEXTURE_2D,Be.__webglTexture,Q)}G=-1};function Jv(A){let B=K.get(A);return(B.__readFormat!==A.format||B.__readType!==A.type)&&(B.__readFormat=A.format,B.__readType=A.type,B.__formatReadable=I.textureFormatReadable(A.format),B.__typeReadable=I.textureTypeReadable(A.type)),B}this.readRenderTargetPixels=function(A,B,Q,q,j,Ve,Ye,Be=0){if(!(A&&A.isWebGLRenderTarget)){gt("WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let Ke=K.get(A).__webglFramebuffer;if(A.isWebGLCubeRenderTarget&&Ye!==void 0&&(Ke=Ke[Ye]),Ke){b.bindFramebuffer(k.FRAMEBUFFER,Ke);try{let tt=A.textures[Be],wt=tt.format,Ct=tt.type;A.textures.length>1&&k.readBuffer(k.COLOR_ATTACHMENT0+Be);let Je=Jv(tt);if(Je.__formatReadable===!1){gt("WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(Je.__typeReadable===!1){gt("WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}B>=0&&B<=A.width-q&&Q>=0&&Q<=A.height-j&&k.readPixels(B,Q,q,j,Ae.convert(wt),Ae.convert(Ct),Ve)}finally{let tt=H!==null?K.get(H).__webglFramebuffer:null;b.bindFramebuffer(k.FRAMEBUFFER,tt)}}},this.readRenderTargetPixelsAsync=async function(A,B,Q,q,j,Ve,Ye,Be=0){if(!(A&&A.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let Ke=K.get(A).__webglFramebuffer;if(A.isWebGLCubeRenderTarget&&Ye!==void 0&&(Ke=Ke[Ye]),Ke)if(B>=0&&B<=A.width-q&&Q>=0&&Q<=A.height-j){b.bindFramebuffer(k.FRAMEBUFFER,Ke);let tt=A.textures[Be],wt=tt.format,Ct=tt.type;A.textures.length>1&&k.readBuffer(k.COLOR_ATTACHMENT0+Be);let Je=Jv(tt);if(Je.__formatReadable===!1)throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(Je.__typeReadable===!1)throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");let jt=k.createBuffer();k.bindBuffer(k.PIXEL_PACK_BUFFER,jt),k.bufferData(k.PIXEL_PACK_BUFFER,Ve.byteLength,k.STREAM_READ),k.readPixels(B,Q,q,j,Ae.convert(wt),Ae.convert(Ct),0),k.bindBuffer(k.PIXEL_PACK_BUFFER,null);let zn=H!==null?K.get(H).__webglFramebuffer:null;b.bindFramebuffer(k.FRAMEBUFFER,zn);let _n=k.fenceSync(k.SYNC_GPU_COMMANDS_COMPLETE,0);return k.flush(),await Y_(k,_n,4),k.bindBuffer(k.PIXEL_PACK_BUFFER,jt),k.getBufferSubData(k.PIXEL_PACK_BUFFER,0,Ve),k.bindBuffer(k.PIXEL_PACK_BUFFER,null),k.deleteBuffer(jt),k.deleteSync(_n),Ve}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")},this.copyFramebufferToTexture=function(A,B=null,Q=0){let q=Math.pow(2,-Q),j=Math.floor(A.image.width*q),Ve=Math.floor(A.image.height*q),Ye=B!==null?B.x:0,Be=B!==null?B.y:0;ne.setTexture2D(A,0),k.copyTexSubImage2D(k.TEXTURE_2D,Q,0,0,Ye,Be,j,Ve),b.unbindTexture()},this.copyTextureToTexture=function(A,B,Q=null,q=null,j=0,Ve=0){let Ye,Be,Ke,tt,wt,Ct,Je,jt,zn,_n=A.isCompressedTexture?A.mipmaps[Ve]:A.image;if(Q!==null)Ye=Q.max.x-Q.min.x,Be=Q.max.y-Q.min.y,Ke=Q.isBox3?Q.max.z-Q.min.z:1,tt=Q.min.x,wt=Q.min.y,Ct=Q.isBox3?Q.min.z:0;else{let On=Math.pow(2,-j);Ye=Math.floor(_n.width*On),Be=Math.floor(_n.height*On),A.isDataArrayTexture?Ke=_n.depth:A.isData3DTexture?Ke=Math.floor(_n.depth*On):Ke=1,tt=0,wt=0,Ct=0}q!==null?(Je=q.x,jt=q.y,zn=q.z):(Je=0,jt=0,zn=0);let dn=Ae.convert(B.format),ui=Ae.convert(B.type),Xe;B.isData3DTexture?(ne.setTexture3D(B,0),Xe=k.TEXTURE_3D):B.isDataArrayTexture||B.isCompressedArrayTexture?(ne.setTexture2DArray(B,0),Xe=k.TEXTURE_2D_ARRAY):(ne.setTexture2D(B,0),Xe=k.TEXTURE_2D),b.activeTexture(k.TEXTURE0),b.pixelStorei(k.UNPACK_FLIP_Y_WEBGL,B.flipY),b.pixelStorei(k.UNPACK_PREMULTIPLY_ALPHA_WEBGL,B.premultiplyAlpha),b.pixelStorei(k.UNPACK_ALIGNMENT,B.unpackAlignment);let Ei=b.getParameter(k.UNPACK_ROW_LENGTH),kt=b.getParameter(k.UNPACK_IMAGE_HEIGHT),dr=b.getParameter(k.UNPACK_SKIP_PIXELS),Xr=b.getParameter(k.UNPACK_SKIP_ROWS),eo=b.getParameter(k.UNPACK_SKIP_IMAGES);b.pixelStorei(k.UNPACK_ROW_LENGTH,_n.width),b.pixelStorei(k.UNPACK_IMAGE_HEIGHT,_n.height),b.pixelStorei(k.UNPACK_SKIP_PIXELS,tt),b.pixelStorei(k.UNPACK_SKIP_ROWS,wt),b.pixelStorei(k.UNPACK_SKIP_IMAGES,Ct);let Va=A.isDataArrayTexture||A.isData3DTexture,ln=B.isDataArrayTexture||B.isData3DTexture;if(A.isDepthTexture){let On=K.get(A),to=K.get(B),xn=K.get(On.__renderTarget),no=K.get(to.__renderTarget);b.bindFramebuffer(k.READ_FRAMEBUFFER,xn.__webglFramebuffer),b.bindFramebuffer(k.DRAW_FRAMEBUFFER,no.__webglFramebuffer);for(let Ga=0;Ga<Ke;Ga++)Va&&(k.framebufferTextureLayer(k.READ_FRAMEBUFFER,k.COLOR_ATTACHMENT0,K.get(A).__webglTexture,j,Ct+Ga),k.framebufferTextureLayer(k.DRAW_FRAMEBUFFER,k.COLOR_ATTACHMENT0,K.get(B).__webglTexture,Ve,zn+Ga)),k.blitFramebuffer(tt,wt,Ye,Be,Je,jt,Ye,Be,k.DEPTH_BUFFER_BIT,k.NEAREST);b.bindFramebuffer(k.READ_FRAMEBUFFER,null),b.bindFramebuffer(k.DRAW_FRAMEBUFFER,null)}else if(j!==0||A.isRenderTargetTexture||K.has(A)){let On=K.get(A),to=K.get(B);b.bindFramebuffer(k.READ_FRAMEBUFFER,L),b.bindFramebuffer(k.DRAW_FRAMEBUFFER,V);for(let xn=0;xn<Ke;xn++)Va?k.framebufferTextureLayer(k.READ_FRAMEBUFFER,k.COLOR_ATTACHMENT0,On.__webglTexture,j,Ct+xn):k.framebufferTexture2D(k.READ_FRAMEBUFFER,k.COLOR_ATTACHMENT0,k.TEXTURE_2D,On.__webglTexture,j),ln?k.framebufferTextureLayer(k.DRAW_FRAMEBUFFER,k.COLOR_ATTACHMENT0,to.__webglTexture,Ve,zn+xn):k.framebufferTexture2D(k.DRAW_FRAMEBUFFER,k.COLOR_ATTACHMENT0,k.TEXTURE_2D,to.__webglTexture,Ve),j!==0?k.blitFramebuffer(tt,wt,Ye,Be,Je,jt,Ye,Be,k.COLOR_BUFFER_BIT,k.NEAREST):ln?k.copyTexSubImage3D(Xe,Ve,Je,jt,zn+xn,tt,wt,Ye,Be):k.copyTexSubImage2D(Xe,Ve,Je,jt,tt,wt,Ye,Be);b.bindFramebuffer(k.READ_FRAMEBUFFER,null),b.bindFramebuffer(k.DRAW_FRAMEBUFFER,null)}else ln?A.isDataTexture||A.isData3DTexture?k.texSubImage3D(Xe,Ve,Je,jt,zn,Ye,Be,Ke,dn,ui,_n.data):B.isCompressedArrayTexture?k.compressedTexSubImage3D(Xe,Ve,Je,jt,zn,Ye,Be,Ke,dn,_n.data):k.texSubImage3D(Xe,Ve,Je,jt,zn,Ye,Be,Ke,dn,ui,_n):A.isDataTexture?k.texSubImage2D(k.TEXTURE_2D,Ve,Je,jt,Ye,Be,dn,ui,_n.data):A.isCompressedTexture?k.compressedTexSubImage2D(k.TEXTURE_2D,Ve,Je,jt,_n.width,_n.height,dn,_n.data):k.texSubImage2D(k.TEXTURE_2D,Ve,Je,jt,Ye,Be,dn,ui,_n);b.pixelStorei(k.UNPACK_ROW_LENGTH,Ei),b.pixelStorei(k.UNPACK_IMAGE_HEIGHT,kt),b.pixelStorei(k.UNPACK_SKIP_PIXELS,dr),b.pixelStorei(k.UNPACK_SKIP_ROWS,Xr),b.pixelStorei(k.UNPACK_SKIP_IMAGES,eo),Ve===0&&B.generateMipmaps&&k.generateMipmap(Xe),b.unbindTexture()},this.initRenderTarget=function(A){K.get(A).__webglFramebuffer===void 0&&ne.setupRenderTarget(A)},this.initTexture=function(A){A.isCubeTexture?ne.setTextureCube(A,0):A.isData3DTexture?ne.setTexture3D(A,0):A.isDataArrayTexture||A.isCompressedArrayTexture?ne.setTexture2DArray(A,0):ne.setTexture2D(A,0),b.unbindTexture()},this.resetState=function(){N=0,D=0,H=null,b.reset(),ue.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return Nr}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;let n=this.getContext();n.drawingBufferColorSpace=Et._getDrawingBufferColorSpace(e),n.unpackColorSpace=Et._getUnpackColorSpace()}};var vi=Object.freeze({DEFAULT:0,EMISSIVE:1,NOFOG:2}),zi=()=>({value:new Pt(0,0,0)}),he={uTime:{value:0},uBreath:{value:.5},uLamp:{value:new P(0,0,3)},uLampOn:{value:1},uCamPos:{value:new P},uResolution:{value:new pt(1,1)},uPixelRatio:{value:1},uPxPerUnit:{value:1},uWorldScale:{value:1},uFogDensity:{value:.00485},uInvert:{value:0},uNight:{value:0},uEmissivePass:{value:0},uWorldTime:{value:0},uWave0a:{value:new Vt},uWave0b:{value:new Vt},uWave1a:{value:new Vt},uWave1b:{value:new Vt},uImpact:{value:0},uImpactWarm:{value:0},uPulse:{value:0},uFocus:{value:new P},uFxCaps:{value:new pt},uFxLineA:{value:1},uGap:{value:.02},uCut:{value:[0,0,0,0,0,0,0]},cVoid:zi(),cAbyss:zi(),cDeep:zi(),cSteel:zi(),cSlate:zi(),cPewter:zi(),cSilver:zi(),cWhite:zi(),cObsidian:zi(),cEmber:zi(),cEmberDeep:zi(),cElectrum:zi(),cPaper:zi(),cInk:zi()};function ep(t){return"c"+t.charAt(0).toUpperCase()+t.slice(1)}function yi(t){return he[ep(t)]||he.cSilver}function ua(){let t=new Array(7);for(let e=0;e<7;e++)t[e]=new Ot;return{value:t}}function ha(){return{value:[1,1,1,1,1,1,1]}}var Eb=new Map;function fa(t,e){t&&Eb.set(t,Math.max(0,e||0))}function Rb(){let t=0;for(let e of Eb.values())t+=e;return t/1048576}var vn=Object.freeze({...cy});function Dt(t){return t<=0?0:t>=1?1:t}function Yt(t,e,n){return t+(e-t)*n}function da(t,e,n){if(t===e)return n<t?0:1;let i=Dt((n-t)/(e-t));return i*i*(3-2*i)}var tr=`
uniform float uFogDensity; uniform vec3 cAbyss;
float fogVis(float dist) { float f = uFogDensity * dist; return exp(-f * f); }
vec3 applyFog(vec3 col, float dist) { return mix(cAbyss, col, fogVis(dist)); }`,Fs=null,Tg=new Map,tp=1,Eg=()=>{he.uFogDensity.value=vr.density*tp},vr={density:he.uFogDensity.value,set(t){Fs&&(Fs.cancel(),Fs=null),vr.density=t,Eg()},to(t,e,n=vn.camera){Fs&&(Fs.cancel(),Fs=null);let i=vr.density,r=qn(e,s=>{vr.density=i+(t-i)*s,Eg()},n);return Fs=r,r.done.then(()=>{Fs===r&&(Fs=null)})},factor(t,e){let n=+e;n===1||!(n>0)?Tg.delete(t):Tg.set(t,n),tp=1,Tg.forEach(i=>{tp*=i}),Eg()},factors(){return tp}};var np={T3:Object.freeze({dustPool:65536,dustAmbient:49152,stir:!0,heptagon:!0,deposition:!0,prosvetWidth:1.5,threadDust:2e3,swarf:900,shed:300,puff:200,widthDof:!0}),T2:Object.freeze({dustPool:32768,dustAmbient:24576,stir:!0,heptagon:!0,deposition:!0,prosvetWidth:1.5,threadDust:600,swarf:900,shed:300,puff:200,widthDof:!0}),T1:Object.freeze({dustPool:6144,dustAmbient:4096,stir:!1,heptagon:!1,deposition:!1,prosvetWidth:1,threadDust:0,swarf:300,shed:0,puff:0,widthDof:!1})},Rg=t=>Object.freeze({dustLoops:t==="T1"?1:2,shadowDb:Gt.coarse?-12:-26}),_i=Object.freeze({T3:Object.freeze({dprCap:2,msaa:!0,grains:24576,stars:Object.freeze({signal:2e3,zenith:3e3}),bloom:"kawase",lattice:1,atlas:1024,contours:12,ringTex:Object.freeze([2048,128]),labels:24,sandText:!0,fx:np.T3,audio:Rg("T3")}),T2:Object.freeze({dprCap:1.5,msaa:!0,grains:16384,stars:Object.freeze({signal:2e3,zenith:3e3}),bloom:"sprites",lattice:1,atlas:1024,contours:12,ringTex:Object.freeze([2048,128]),labels:24,sandText:!0,fx:np.T2,audio:Rg("T2")}),T1:Object.freeze({dprCap:1.25,msaa:!1,grains:8192,stars:Object.freeze({signal:800,zenith:1200}),bloom:"sprites",lattice:.5,atlas:512,contours:8,ringTex:Object.freeze([1024,64]),labels:16,sandText:!1,fx:np.T1,audio:Rg("T1")})}),O3=Object.freeze({...np.T2,dustPool:16384,dustAmbient:12288,heptagon:!1,deposition:!1,prosvetWidth:1,threadDust:300,swarf:400,widthDof:!1}),xu=["T1","T2","T3"],F3=/SwiftShader|llvmpipe|Software|Mali-4|Adreno \(TM\) 3/i,Us=pn.governor;function Db(){try{return matchMedia("(pointer: coarse)").matches&&Math.min(window.innerWidth,window.innerHeight)<=600}catch{return!1}}function Cg(t){let e=_i[t];return e?Db()?Object.freeze({...e,msaa:t==="T2"?!1:e.msaa,labels:16,fx:t==="T2"?O3:e.fx}):e:null}function Cb(t){return null}var pu=null,ap=!1,Nb=!0,Pg=-1e9,ip=null,lp=0,Pb=!1,Ib=new Float32Array(Us.windowFrames),Cl=0,Pl=0,mu=0,gu=-1,Il=-1,rp=-1;function Ig(){Cl=0,Pl=0,mu=0,gu=-1,Il=-1}var Ob=30,Lb=new Float32Array(Ob),sp=0,Ll="off",Fb=0,op=null;function U3(t,e){let n=Array.prototype.slice.call(t,0,e).sort((i,r)=>i-r);return e?e%2?n[(e-1)/2]:(n[e/2-1]+n[e/2])/2:0}function Ub(t){let e=xu.indexOf(t);return e>0?xu[e-1]:t}function k3(t){let e=xu.indexOf(t);return e>=0&&e<xu.length-1?xu[e+1]:t}function B3(){let t=pe.now,e=rp<0?0:t-rp;if(rp=t,!(yt.tier==="T0"||e<=0)){if(ip&&t-Pg>=300){let n=ip;ip=null,yt.setTier(n,"deferred")}if(Ll==="wait"&&t>=Fb&&(Ll="run"),Ll==="run"){if(Lb[sp++]=e,sp>=Ob){Ll="done";let n=U3(Lb,sp),i=yt.tier;n>20?i="T1":n>=12&&(i=Ub(i)),i!==yt.tier&&yt.setTier(i,`benchmark ${n.toFixed(1)} ms`),op&&(op(yt.tier),op=null),Ig(),lp=t}return}if(!ap&&t-lp>Us.upgradeAfterMs&&Y.data&&Y.data.tier!==yt.tier)try{Y.set("tier",yt.tier)}catch{}ap||!Nb||yt.governor.update(e/1e3)}}var yt={tier:"T2",params:_i.T2,detect(){let t="T0",e=null;try{let i=document.createElement("canvas").getContext("webgl2");if(!i)throw new Error("no WebGL2");let r="";try{let g=i.getExtension("WEBGL_debug_renderer_info");r=String(g?i.getParameter(g.UNMASKED_RENDERER_WEBGL):i.getParameter(i.RENDERER)||"")}catch{r=""}try{let g=i.getExtension("WEBGL_lose_context");g&&g.loseContext()}catch{}let s=F3.test(r),o=navigator.hardwareConcurrency||4,a=navigator.deviceMemory,l=(()=>{try{return matchMedia("(pointer: fine)").matches}catch{return!1}})(),c=Db(),u=Y.data&&Y.data.tier;u?t=u:s||o<=4||a!=null&&a<=3?t="T1":l&&o>=8?t="T3":(!c||a!=null&&a>=6,t="T2"),s&&(t="T1");let f=Cb("tier");if(f&&/^T[0-3]$/.test(f)&&(t=f,ap=!0),Cb("gov")==="0"&&(Nb=!1),t==="T0")throw new Error("forced T0");let h=Cg(t),d=document.getElementById("gl");if(e=d&&d.getContext("webgl2",{antialias:h.msaa,alpha:!0,premultipliedAlpha:!0,depth:!0,stencil:!1,powerPreference:"high-performance",preserveDrawingBuffer:!1}),!e)throw new Error("context creation failed")}catch{t="T0",e=null}return yt.tier=t,yt.params=Cg(t),ee.tier=t,{tier:t,gl:e}},benchmark(){return ap||yt.tier==="T0"||Ll!=="off"?Promise.resolve(yt.tier):(Ll="wait",sp=0,Fb=pe.now+600,new Promise(t=>{op=t}))},setTier(t,e=""){if(!_i[t]||t===yt.tier||yt.tier==="T0")return;if(ee.phase==="transition"&&pe.now-Pg<300){ip=t;return}let n=yt.tier;yt.tier=t,yt.params=Cg(t),ee.tier=t,yt.governor.dropSteps=0,lp=pe.now,Ig();let i=pu&&pu.renderer;if(i)try{i.setTier(t),i.setDprDrop(0)}catch(r){lt("quality:renderer",r)}_e.emit("tier:change",{tier:t,prev:n})},governor:{fps:60,dropSteps:0,update(t){let e=t*1e3;if(!(e>0)||(Cl===Us.windowFrames?mu-=Ib[Pl]:Cl++,Ib[Pl]=e,mu+=e,Pl=(Pl+1)%Us.windowFrames,Cl<Us.windowFrames))return;let n=1e3/(mu/Cl);yt.governor.fps=n;let i=pe.now;if(n<Us.lowFps){Il=-1,gu<0&&(gu=i);let r=pu&&pu.renderer,s=Math.min(typeof devicePixelRatio=="number"?devicePixelRatio:1,_i[yt.tier].dprCap);if(i-gu>Us.dropAfterMs&&yt.tier!=="T1"){yt.setTier(Ub(yt.tier),`governor ${n.toFixed(0)} fps`);return}if(r&&s-pn.dprStep*(yt.governor.dropSteps+1)>=1-1e-6){yt.governor.dropSteps++;try{r.setDprDrop(yt.governor.dropSteps)}catch(o){lt("quality:dpr",o)}Cl=0,Pl=0,mu=0}}else gu=-1,n>Us.highFps&&!Pb?(Il<0&&(Il=i),i-Il>Us.upgradeAfterMs&&yt.tier!=="T3"&&(Pb=!0,yt.setTier(k3(yt.tier),`governor ${n.toFixed(0)} fps`))):Il=-1}},init(t){pu=t,lp=pe.now,pe.add(B3,zt.UI)}};_e.on("travel:start",()=>{Pg=pe.now});_e.on("visibility",()=>{Ig(),rp=-1});var as=null;function z3(){if(as)return as;let t=document.createElement("canvas");t.width=t.height=64;let e=t.getContext("2d"),n=e.createImageData(64,64);for(let i=0;i<64;i++)for(let r=0;r<64;r++){let s=(r+.5)/32-1,o=(i+.5)/32-1,a=Math.min(1,Math.sqrt(s*s+o*o)),l=(.72*Math.exp(-a*a*18)+.28*Math.exp(-a*a*4.2))*(1-a*a)*(1-a),c=(i*64+r)*4;n.data[c]=n.data[c+1]=n.data[c+2]=255,n.data[c+3]=Math.round(255*Math.min(1,l))}return e.putImageData(n,0,0),as=new ts(t),as.minFilter=Lt,as.magFilter=Lt,as.generateMipmaps=!1,as.wrapS=as.wrapT=mi,fa(as,4096*4),as}var V3=`
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
}`,G3=`
${tr}
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
}`,vu=new Set,Lg=null;function kb(){return Lg||(Lg=new ns(1,1)),Lg}function Bb(t,e){let n={};e&&(n.USE_BATCH=""),t.fog!==!1&&(n.USE_FOG="");let i={uTex:{value:z3()},uColor:yi(t.color||"ember"),uRadius:{value:t.radius!=null?t.radius:.05},uIntensity:{value:t.intensity!=null?t.intensity:1},uNightMix:{value:t.night?1:0},uNightI:{value:t.nightIntensity!=null?t.nightIntensity:.55},uFlash:{value:0},uNight:he.uNight,cElectrum:he.cElectrum,cWhite:he.cWhite,cAbyss:he.cAbyss,uFogDensity:he.uFogDensity};return new Ft({uniforms:i,defines:n,vertexShader:V3,fragmentShader:G3,transparent:!0,depthWrite:!1,depthTest:t.depthTest!==!1,blending:oa,premultipliedAlpha:!0})}function Dg(t,e){let n=e==="T3";t.core?(n?t.core.layers.enable(vi.EMISSIVE):t.core.layers.disable(vi.EMISSIVE),t._tierHidden=n):(n?t.sprite.layers.enable(vi.EMISSIVE):t.sprite.layers.disable(vi.EMISSIVE),t._tierHidden=!1),t._sync()}_e.on("tier:change",({tier:t})=>{for(let e of vu)Dg(e,t)});function cp(t={}){let e=new un,n=Bb(t,!1),i=new Xt(kb(),n);i.frustumCulled=!1,i.renderOrder=t.renderOrder!=null?t.renderOrder:5,e.add(i),t.core&&e.add(t.core);let r={object:e,sprite:i,core:t.core||null,uniforms:n.uniforms,_tierHidden:!1,_sync(){i.visible=!r._tierHidden&&n.uniforms.uIntensity.value>0},setIntensity(s){n.uniforms.uIntensity.value=s,r._sync()},setColor(s){n.uniforms.uColor=yi(s)},setRadius(s){n.uniforms.uRadius.value=s},setFlash(s){n.uniforms.uFlash.value=s},dispose(){vu.delete(r),n.dispose(),e.parent&&e.parent.remove(e)}};return vu.add(r),Dg(r,yt.tier),r}function up(t={}){let e=t.positions||new Float32Array(3),n=Math.max(1,Math.floor(e.length/3)),i=kb(),r=new sa;r.setIndex(i.index.clone()),r.setAttribute("position",i.getAttribute("position").clone()),r.setAttribute("uv",i.getAttribute("uv").clone());let s=new Pi(new Float32Array(n*3),3);s.array.set(e.subarray(0,n*3)),r.setAttribute("aOffset",s);let o=t.count!=null?Math.min(n,t.count):n;r.instanceCount=o;let a=Bb(t,!0),l=new Xt(r,a);l.frustumCulled=!1,l.renderOrder=t.renderOrder!=null?t.renderOrder:5;let c={object:l,sprite:l,core:null,uniforms:a.uniforms,_tierHidden:!1,_sync(){l.visible=o>0&&a.uniforms.uIntensity.value>0},get count(){return o},setCount(u){o=Math.max(0,Math.min(n,u|0)),r.instanceCount=o,c._sync()},setIntensity(u){a.uniforms.uIntensity.value=u,c._sync()},setColor(u){a.uniforms.uColor=yi(u)},setRadius(u){a.uniforms.uRadius.value=u},setPositions(u,f){let h=Math.min(n,f??Math.floor(u.length/3));s.array.set(u.subarray(0,h*3)),s.needsUpdate=!0,c.setCount(h)},dispose(){vu.delete(c),r.dispose(),a.dispose(),l.parent&&l.parent.remove(l)}};return vu.add(c),Dg(c,yt.tier),c}var Dl=" ",Nl="−";function ks(t,e,n,i,r,s,o,a,l,c,u,f,h,d,g,x,m,p,_,M,v){let S=dy[t],[w,E]=py[t];return Object.freeze({id:t,slug:e,sign:n,stratum:i,num:r,code:s,title:o,titleOpen:a,name:l,nameOpen:c,line:u,alt:S,level:f,giant:h,floor:w,ceil:E,n:d,fog:g,far:x,wet:m,root:p,note:_,hidden:M,parent:v,anchor:Object.freeze(new P(0,S,0))})}var ce=Object.freeze({SIGNAL:ks("SIGNAL","signal","S",0,"01","SIGNAL","СВЯЗЬ",null,"Связь",null,"передачи и сигналы",`+1${Dl}090.00`,`+1${Dl}090`,3,.014,400,.22,220,392,!1,null),ARCHIVE:ks("ARCHIVE","archive","A",1,"02","ARCHIVE","ЛЕТОПИСЬ",null,"Летопись",null,"легенды, моменты, шутки","+810.00","+810",5,.006,500,.22,196,440,!1,null),MEMBERS:ks("MEMBERS","members","M",2,"03","MEMBERS","КЛАН",null,"Клан",null,"кто с нами","+460.00","+460",7,.0034,800,.22,164.81,493.88,!1,null),CORE:ks("CORE","core","•",3,"04","CORE","ЯДРО",null,"Ядро",null,"имя, девиз, всё о нас","±0.00","±0",12,.00485,700,.22,146.83,587.33,!1,null),VOYAGES:ks("VOYAGES","voyages","V",4,"05","VOYAGES","ВЫЛАЗКИ",null,"Вылазки",null,"экспедиции и зонды",`${Nl}460.00`,`${Nl}460`,7,.0034,800,.3,123.47,659.25,!1,null),INSIGNIA:ks("INSIGNIA","insignia","I",5,"06","INSIGNIA","ХРАНИЛИЩЕ",null,"Хранилище",null,"трофеи и находки",`${Nl}810.00`,`${Nl}810`,5,.006,500,0,110,783.99,!1,null),NADIR:ks("NADIR","nadir","N",6,"07","NADIR","ЗАПЕЧАТАНО","ИСТОК","Запечатано","Исток","осколков {k} из 5",`${Nl}1${Dl}090.00`,`${Nl}1${Dl}090`,3,.014,400,.22,98,880,!1,null),ZENITH:ks("ZENITH","zenith",null,-1,"00","ZENITH","НАД ВСЕМ",null,"Над всем",null,"—",`+1${Dl}260.00`,`+1${Dl}260`,3,35e-5,4e3,.35,220,392,!0,"SIGNAL"),WORKSHOP:ks("WORKSHOP","workshop",null,2,"03","WORKSHOP","МАСТЕРСКАЯ",null,"Мастерская",null,"—","+484.00","+484",7,.06,30,.22,164.81,493.88,!0,"MEMBERS")});var Un=Object.freeze(["SIGNAL","ARCHIVE","MEMBERS","CORE","VOYAGES","INSIGNIA","NADIR"]);var fk=new Map(Un.map(t=>[ce[t].sign,ce[t]])),H3=new Map(Object.values(ce).map(t=>[t.slug,t]));function zb(t){return H3.get(String(t||"").toLowerCase())||null}function hp(t){let e=Un[t];return e?ce[e]:null}var fp=[-1,0,1,2],Mo=new Map,pa=new Map,W3=new Map,Ng=[],Og=new Map,si=new Map([[-1,0],[0,1],[1,1],[2,0]]),ls={grow:[],shrink:[]},$3=new P,yu=null,Vb=-1;function dp(t){let e=si.get(t),n=pa.get(t);n&&n.setFade(t===-1&&_u?1:e);let i=Mo.get(t);i&&t!==0&&(i.visible=e>0||t===-1&&_u),t===0&&yu&&yu.key&&yu.key.group&&(yu.key.group.visible=e>0)}var _u=!1,Cn={init(t){yu=t;let e=et.root;for(let r of fp){let s=new un;s.name=`nest:${r}`,s.scale.setScalar(Math.pow(1e3,r)),e.add(s),Mo.set(r,s)}let n=(yt.params||_i.T2).lattice;for(let r of[1,2]){let s=bu({perStratum:!1,latticeDensity:r===1?n:.5,hallLod:r===1,far:ce.CORE.far});Mo.get(r).add(s.group),pa.set(r,s);let o=pp({scale:Math.pow(1e3,r)});o.setCount(Y.litNodes),Mo.get(r).add(o.object),Og.set(r,o)}let i=bu({perStratum:!1,lattice:!1,far:1});Mo.get(-1).add(i.group),pa.set(-1,i);for(let r of[-1,1,2]){let s=cp({color:"ember",radius:ni.glowR,intensity:1,depthTest:!1,night:!0,fog:!1});Mo.get(r).add(s.object),W3.set(r,s),Ng.push({j:r,e:s,g:Mo.get(r),h:Wo.H*Math.pow(1e3,r)})}for(let r of fp)dp(r);return pe.add(Cn.update,zt.WORLD),_e.on("room:arrive",({room:r})=>{let s=(ce[r]||ce.CORE).far;for(let o of[1,2])pa.get(o).setFar(s)}),_e.on("tier:change",({tier:r})=>{let s=_i[r];s&&pa.get(1).setLatticeDensity(s.lattice)}),_e.on("night:change",({night:r})=>{for(let s of Og.values())s.setNight(r)}),Cn},level(t){return Mo.get(t)||null},structure(t){return pa.get(t)||null},litNodes(t){return Og.get(t)||null},fade(t){return si.has(t)?si.get(t):0},setFade(t,e){if(!si.has(t))return;let n=Math.max(0,Math.min(1,e));n!==si.get(t)&&(si.set(t,n),dp(t))},setHallLod(t){let e=t?ce[t]:null;Vb=e&&e.stratum>=0?e.stratum:-1;let n=pa.get(1);n&&n.setHideCaps(Vb)},shift(t){let e=fp.map(n=>si.get(n));if(t==="grow"){ls.grow.push(e[3]);let n=ls.shrink.length?ls.shrink.pop():0;si.set(2,e[2]),si.set(1,e[1]),si.set(0,e[0]),si.set(-1,n)}else{ls.shrink.push(e[0]);let n=ls.grow.length?ls.grow.pop():0;si.set(-1,e[1]),si.set(0,e[2]),si.set(1,e[3]),si.set(2,n)}ls.grow.length>8&&ls.grow.shift(),ls.shrink.length>8&&ls.shrink.shift();for(let n of fp)dp(n)},update(){let t=Pe.camera;if(!t)return;let e=et.s,n=$3.copy(t.position).sub(et.Q).length()/e,i=n<fy.miniKeyBelow;i!==_u&&(_u=i,dp(-1));for(let r=0;r<Ng.length;r++){let{j:s,e:o,g:a,h:l}=Ng[r],c=(s===-1?_u||si.get(-1)>0:si.get(s)>0)&&n>l*hy;o.object.visible=c&&a.visible!==!1}}};var X3=new P,Fg=null;function Mu(){let t=et.root;t&&(t.scale.setScalar(et.s),t.position.copy(et.Q),t.updateMatrix()),he.uWorldScale.value=et.s}function Gb(t){let e=Pe.camera;e&&t(e.position),Pe.pose&&(t(Pe.pose.pos),t(Pe.pose.target)),Pe.remapHistory(t),et.focus&&t(et.focus)}var et={root:null,s:1,Q:new P,n:0,focus:new P,init(t,e){return e&&(Fg=e),et.root||(et.root=new un,et.root.name="scaleRoot",et.root.matrixAutoUpdate=!1),t&&et.root.parent!==t&&t.add(et.root),Mu(),et},set(t,e){et.s=t,e&&et.Q.copy(e),Mu()},scaleAbout(t,e){let n=et.s;t!==n&&(et.Q.x+=e.x*(n-t),et.Q.y+=e.y*(n-t),et.Q.z+=e.z*(n-t),et.s=t,Mu())},fixedPoint(t){let e=1-et.s;return Math.abs(e)<1e-9?t.set(0,0,0):t.copy(et.Q).multiplyScalar(1/e)},logLerp(t,e,n){return Math.exp(Math.log(t)+(Math.log(e)-Math.log(t))*n)},toRender(t,e){return e.copy(t).multiplyScalar(et.s).add(et.Q)},toCanonical(t,e){return e.copy(t).sub(et.Q).multiplyScalar(1/et.s)},rebase(t){let n={kind:t,k:(t==="grow"?1e3:.001)/et.s,T:et.Q.clone(),s:et.s,Q:et.Q.clone()};Gb(r=>et.mapPoint(r,n,r)),et.s=1,et.Q.set(0,0,0),Mu(),Cn.shift(t);let i=Fg&&Fg.key;return i&&typeof i.onRebase=="function"&&i.onRebase(t),_e.emit("scale:rebase",{kind:t,k:n.k,T:n.T}),n},unrebase(t){Gb(e=>e.multiplyScalar(1/t.k).add(t.T)),et.s=t.s,et.Q.copy(t.Q),Mu(),Cn.shift(t.kind==="grow"?"shrink":"grow")},mapPoint(t,e,n){return n.copy(t).sub(e.T).multiplyScalar(e.k)},fitClip(t){let e=Math.max(1e-5,X3.copy(t.position).sub(et.focus).length());t.near=Vm.near*e,t.far=Vm.far*e}};var Y3=Math.PI/180,q3=.08,mp=new P,gp=new P,Ur=new P,Ug=new P,Hb=new P,kg=new pt,xp=!1,Wb=new Map,Bg=[],cs={until:0,ms:0,amp:0,off:new P},Pe={camera:null,pose:{pos:new P(0,.75,7.2),target:new P(0,0,0),fov:st.fov,offsetY:0,roll:0},velocity:new P,init(t){return Pe.camera=t,xp=!1,Pe},setPose(t){t&&(t.pos&&Pe.pose.pos.copy(t.pos),t.target&&Pe.pose.target.copy(t.target),Pe.pose.fov=t.fov!=null?t.fov:st.fov,Pe.pose.offsetY=t.offsetY||0,Pe.pose.roll=t.roll||0)},setOffset(t,e,n=0){let i=Wb.get(t);if(!e&&!n){i&&(i.on=!1);return}i||(i={pos:new P,fov:0,on:!0},Wb.set(t,i),Bg.push(i)),e?i.pos.copy(e):i.pos.set(0,0,0),i.fov=n,i.on=!0},tremble(t=1,e=120){Gt.reducedMotion||(cs.amp=t,cs.ms=e,cs.until=pe.now+e)},apply(t=1/60){let e=Pe.camera;if(!e)return;let n=Pe.pose;mp.set(0,0,0);let i=n.fov;for(let l=0;l<Bg.length;l++){let c=Bg[l];c.on&&(mp.add(c.pos),i+=c.fov)}let r=Math.max(1e-6,gp.copy(n.target).sub(n.pos).length());if(cs.until>pe.now&&cs.ms>0){let l=(cs.until-pe.now)/cs.ms,c=cs.amp*l*r/Math.max(1e-6,he.uPxPerUnit.value);cs.off.set((Math.random()*2-1)*c,(Math.random()*2-1)*c,0).applyQuaternion(e.quaternion),mp.add(cs.off)}e.position.copy(n.pos).add(mp),gp.copy(n.target).sub(e.position);let s=gp.length();s>1e-9&&Math.abs(gp.y/s)>.999?e.up.set(0,0,-1):e.up.set(0,1,0),e.lookAt(n.target),n.roll&&e.rotateZ(n.roll),e.fov=i;let o=Math.max(1,be.w),a=Math.max(1,be.h);e.aspect=o/a,n.offsetY?e.setViewOffset(o,a,0,-n.offsetY*a,o,a):e.view&&e.view.enabled&&e.clearViewOffset(),et.focus.copy(n.target),et.fitClip(e),e.updateProjectionMatrix(),e.updateMatrixWorld(),he.uCamPos.value.copy(e.position),he.uPxPerUnit.value=a/(2*Math.tan(i*Y3/2)),xp&&t>0&&(Hb.copy(e.position).sub(Ug).multiplyScalar(1/t),Pe.velocity.lerp(Hb,1-Math.exp(-t/q3))),Ug.copy(e.position),xp=!0},project(t,e){let n=Pe.camera;return n?(Ur.copy(t).applyMatrix4(n.matrixWorldInverse),e.depth=-Ur.z,Ur.applyMatrix4(n.projectionMatrix),e.x=(Ur.x+1)*.5*be.w,e.y=(1-Ur.y)*.5*be.h,e.visible=e.depth>0&&Ur.x>=-1&&Ur.x<=1&&Ur.y>=-1&&Ur.y<=1,e):(e.x=-9999,e.y=-9999,e.depth=0,e.visible=!1,e)},unproject(t,e,n,i){let r=Pe.camera;if(!r)return i.set(0,0,0);Pe.ray(t,e,vp),Ur.set(0,0,-1).transformDirection(r.matrixWorld);let s=Math.max(1e-6,vp.direction.dot(Ur));return i.copy(vp.origin).addScaledVector(vp.direction,n/s)},ray(t,e,n){let i=Pe.camera;return kg.set(t/Math.max(1,be.w)*2-1,-(e/Math.max(1,be.h))*2+1),n.origin.setFromMatrixPosition(i.matrixWorld),n.direction.set(kg.x,kg.y,.5).unproject(i).sub(n.origin).normalize(),n},remapHistory(t){xp&&t(Ug)}},vp=new Ls;var Su=`
uniform float uPxPerUnit;
float bayer2(vec2 a) { a = floor(a); return fract(dot(a, vec2(0.5, a.y * 0.75))); }
float bayer4(vec2 a) { return bayer2(0.5 * a) * 0.25 + bayer2(a); }
float bayer8(vec2 a) { return bayer4(0.5 * a) * 0.25 + bayer2(a); }
// strut: strut spacing in LOCAL units (aStrut); modelScale: length(modelMatrix[0].xyz); depth: view-space depth (render units)
float r1Lattice(float strut, float modelScale, float depth) {
  float sp = strut * modelScale * uPxPerUnit / max(depth, 1e-6);
  return smoothstep(3.0, 6.0, sp);
}`,ma=`
uniform mat4 uStrataM[7];
uniform float uStrataA[7];
int strataIndex(float face) { return int(clamp(floor(face / 16.0 + 0.001), 0.0, 6.0)); }
mat4 strataMatrix(float face) { return uStrataM[strataIndex(face)]; }
float strataAlpha(float face) { return uStrataA[strataIndex(face)]; }`;var bi={};for(let t=0;t<7;t++)bi[`sign:${t}`]=[128*t,0,128,128];bi["glyph:back"]=[896,0,128,128];bi.frieze=[0,128,1024,32];bi.ticks=[0,160,1024,32];for(let t=0;t<16;t++)bi[`capital:${t}`]=[128*(t%8),192+128*Math.floor(t/8),128,128];bi.deck=[0,448,256,256];for(let t=0;t<7;t++)bi[`free:${t}`]=t<3?[256*(t+1),448,256,256]:[256*(t-3),704,256,256];bi["code:0"]=[0,960,512,64];bi["code:1"]=[512,960,512,64];bi["code:2"]=[512,320,512,64];bi["code:3"]=[512,384,512,64];bi["code:4"]=[0,704,512,64];bi["code:5"]=[0,768,512,64];bi["code:6"]=[0,832,512,64];var wu=null,Au=null,ga=null,yp=null;function j3(t,e){let n=()=>{let s=document.createElement("canvas");return s.width=t,s.height=e,s};(!ga||ga.width<t||ga.height<e)&&(ga=n(),yp=n());let i=ga.getContext("2d",{willReadFrequently:!0}),r=yp.getContext("2d",{willReadFrequently:!0});return i.setTransform(1,0,0,1,0,0),r.setTransform(1,0,0,1,0,0),i.clearRect(0,0,ga.width,ga.height),r.clearRect(0,0,yp.width,yp.height),[i,r]}function Z3(t,e,n,i){for(let r=0;r<n;r++)for(let s=0;s<e;s++){let o=0,a=0;for(let l=-1;l<=1;l++){let c=r+l;if(!(c<0||c>=n))for(let u=-1;u<=1;u++){let f=s+u;f<0||f>=e||(o+=t[(c*e+f)*4+3],a++)}}i[r*e+s]=o/a}}var Jt={texture:null,size:1024,REGIONS:bi,init(t){if(Jt.texture)return Jt;Jt.size=t==="T1"?512:1024,wu=document.createElement("canvas"),wu.width=wu.height=Jt.size,Au=wu.getContext("2d",{willReadFrequently:!0}),Au.fillStyle="rgb(255,0,0)",Au.fillRect(0,0,Jt.size,Jt.size);let e=new ts(wu);return e.flipY=!1,e.generateMipmaps=!1,e.minFilter=Lt,e.magFilter=Lt,e.wrapS=e.wrapT=mi,e.premultiplyAlpha=!1,Jt.texture=e,fa(e,Jt.size*Jt.size*4),Jt},region(t){let e=bi[t];if(!e)return null;let n=Jt.size/1024,i=e[0]*n,r=e[1]*n,s=e[2]*n,o=e[3]*n;return{x:i,y:r,w:s,h:o,rect:new Vt(e[0]/1024,e[1]/1024,(e[0]+e[2])/1024,(e[1]+e[3])/1024)}},draw(t,e={}){if(!Jt.texture)return!1;let n=Jt.region(t);if(!n)return!1;let i=Math.round(n.w),r=Math.round(n.h),[s,o]=j3(i,r);try{e.height&&e.height(s,i,r)}catch{}try{e.inlay&&e.inlay(o,i,r)}catch{}let a=s.getImageData(0,0,i,r).data,l=o.getImageData(0,0,i,r).data,c=new Float32Array(i*r);Z3(a,i,r,c);let u=Au.createImageData(i,r),f=u.data;for(let h=0,d=0;d<i*r;d++,h+=4)f[h]=255-Math.round(c[d]),f[h+1]=l[h+3],f[h+2]=0,f[h+3]=255;return Au.putImageData(u,Math.round(n.x),Math.round(n.y)),Jt.texture.needsUpdate=!0,!0}};var Bs=`
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
}`;var $b=`
float fxHeptagon(vec2 pc) {                             // 7-blade aperture SDF, one flat side down; pc in [-1,1]
  float a = atan(pc.x, -pc.y); float k = 6.2831853 / 7.0;
  float r = cos(floor(0.5 + a / k) * k - a) * length(pc); return r;  // < cos(π/7) inside
}`;function zs(){return{uWave0a:he.uWave0a,uWave0b:he.uWave0b,uWave1a:he.uWave1a,uWave1b:he.uWave1b,uImpact:he.uImpact,uImpactWarm:he.uImpactWarm,uPulse:he.uPulse,uFxLineA:he.uFxLineA,uFocus:he.uFocus,uFxCaps:he.uFxCaps,uWorldScale:he.uWorldScale}}var K3=`
${Su}
${ma}
${Bs}
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
}`,J3=`
${tr}
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
}`,zg=null;function Vg(t={}){let e={},n=t.engrave!=null?t.engrave:null;n==="key"?e.USE_KEYGEO="":typeof n=="string"&&(e.USE_REGION=""),t.r1!==!1&&(e.USE_R1=""),t.strut==null&&(n==="key"||t.aStrut)&&(e.USE_ASTRUT=""),t.strata?e.USE_STRATA="":t.strataAlpha&&(e.USE_STRATA_A=""),t.fog!==!1&&(e.USE_FOG=""),Jt.texture||Jt.init(yt.tier);let i=typeof n=="string"&&n!=="key"?Jt.region(n):null,r=Jt.size||1024;return zg||(zg={uN:{value:Zt.map(o=>o.n)},uCodeBand:{value:_p.map(o=>new pt(o.vc,o.vh))},uCodeRect:{value:Zt.map((o,a)=>{let l=Jt.region(`code:${a}`).rect;return new Vt(l.x,l.y,l.z-l.x,l.w-l.y)})},uCodeU:{value:new pt(_p[0].u0,_p[0].u1)}}),new Ft({uniforms:{uBase:yi(t.tint||"obsidian"),uAlpha:{value:1},uFlash:{value:0},uEdgeEmber:{value:0},uRim:{value:t.rim!=null?t.rim:pn.r2.fresnelGain},uStrut:{value:t.strut!=null?t.strut:.05},uHideCapsOf:{value:-1},uAtlas:{value:Jt.texture},uTexel:{value:1/r},uRegion:{value:i?i.rect:new Vt(0,0,0,0)},uFriezeH:{value:$t.friezeH},uTickL:{value:$t.tickLen},uApertureR:{value:$t.apertureD/2},uStrataM:t.strata||ua(),uStrataA:t.strataAlpha||ha(),cSilver:he.cSilver,cWhite:he.cWhite,cPaper:he.cPaper,cInk:he.cInk,cAbyss:he.cAbyss,uLamp:he.uLamp,uLampOn:he.uLampOn,uInvert:he.uInvert,uPixelRatio:he.uPixelRatio,uPxPerUnit:he.uPxPerUnit,uFogDensity:he.uFogDensity,uCut:he.uCut,...zg,...zs()},defines:e,vertexShader:K3,fragmentShader:J3,side:t.side!=null?t.side:is,transparent:!1,depthWrite:!0})}var Xb=()=>(ce[ee.room]||ce.CORE).far,Yb=`
float lampReach(vec3 p) { float r = 2.0 * max(length(uCamPos - uLamp), 1e-4); float d = length(p - uLamp) / r; return 1.0 / (1.0 + d * d); }`,Q3=new Float32Array([0,-1,0,1,-1,0,0,1,0,1,1,0]),eP=[0,1,2,2,1,3],tP=`
${Su}
${Bs}
attribute vec3 aA; attribute vec3 aB; attribute float aW; attribute float aAl;
#ifdef USE_COL_ATTR
attribute vec3 aCol;
#endif
#ifdef USE_STRATA
attribute float aFace;
${ma}
#endif
uniform vec3 uColor; uniform vec3 cWhite;
uniform float uWidth, uAlpha, uFar, uGlint, uFlatten, uFlattenY, uDrawA, uDrawB, uCount, uFlash, uStrut;
uniform vec2 uResolution; uniform float uPixelRatio; uniform vec3 uLamp; uniform vec3 uCamPos;   // uWorldScale: FX_GLSL
${Yb}
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
${tr}
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
}`;function bp(t,e){let n=new Float32Array(t);return n.fill(e),n}function nr(t={}){let e=t.segments||new Float32Array(6),n=t.count!=null?t.count:Math.floor(e.length/6),i=Math.max(1,Math.floor(e.length/6)),r=new sa;r.setAttribute("position",new hn(Q3,3)),r.setIndex(eP);let s=new _l(e,6),o=()=>{r.setAttribute("aA",new vl(s,3,0)),r.setAttribute("aB",new vl(s,3,3))};o();let a=t.width instanceof Float32Array?t.width:bp(i,1),l=t.alpha instanceof Float32Array?t.alpha:bp(i,1);r.setAttribute("aW",new Pi(a,1)),r.setAttribute("aAl",new Pi(l,1));let c={},u=t.color instanceof Float32Array;u&&(r.setAttribute("aCol",new Pi(t.color,3)),c.USE_COL_ATTR=""),t.faces&&t.strata&&(r.setAttribute("aFace",new Pi(t.faces,1)),c.USE_STRATA=""),t.dash&&(c.USE_DASH=""),t.strut!=null&&(c.USE_STRUT=""),t.flatten&&(c.USE_FLATTEN=""),t.fog!==!1&&(c.USE_FOG=""),r.instanceCount=n;let f={uColor:yi(u?"silver":t.color||"silver"),uWidth:{value:typeof t.width=="number"?t.width:1},uAlpha:{value:typeof t.alpha=="number"?t.alpha:t.alpha instanceof Float32Array?1:pn.r3.alpha},uFar:{value:t.far!=null?t.far:Xb()},uGlint:{value:t.glint!=null?t.glint:pn.r3.glintGain},uFlatten:{value:0},uFlattenY:{value:0},uDrawA:{value:0},uDrawB:{value:1},uCount:{value:n},uFlash:{value:0},uStrut:{value:t.strut!=null?t.strut:0},uDash:{value:new pt(t.dash?t.dash[0]:1,t.dash?t.dash[1]:0)},uStrataM:t.strata||ua(),uStrataA:t.strataAlpha||ha(),cWhite:he.cWhite,cAbyss:he.cAbyss,uFogDensity:he.uFogDensity,uLamp:he.uLamp,uCamPos:he.uCamPos,uResolution:he.uResolution,uPixelRatio:he.uPixelRatio,uPxPerUnit:he.uPxPerUnit,uWorldScale:he.uWorldScale,...zs()},h=new Ft({uniforms:f,defines:c,vertexShader:tP,fragmentShader:nP,transparent:!0,depthWrite:!1,depthTest:t.depthTest!==!1,blending:t.additive?oa:Or}),d=new Xt(r,h);return d.frustumCulled=!1,t.layer!=null&&d.layers.set(t.layer),t.renderOrder!=null&&(d.renderOrder=t.renderOrder),{mesh:d,uniforms:f,get count(){return n},setSegments(x,m){let p=m??Math.floor(x.length/6);p<=i&&x!==s.array?(s.array.set(x.subarray(0,p*6)),s.needsUpdate=!0):x!==s.array?(i=Math.max(p,Math.floor(x.length/6)),s=new _l(x,6),o(),a.length<i&&!(t.width instanceof Float32Array)&&r.setAttribute("aW",new Pi(bp(i,1),1)),l.length<i&&!(t.alpha instanceof Float32Array)&&r.setAttribute("aAl",new Pi(bp(i,1),1))):s.needsUpdate=!0,n=p,r.instanceCount=p,f.uCount.value=p},setColor(x){x instanceof Float32Array?(r.setAttribute("aCol",new Pi(x,3)),h.defines.USE_COL_ATTR===void 0&&(h.defines.USE_COL_ATTR="",h.needsUpdate=!0)):(f.uColor=yi(x||"silver"),h.defines.USE_COL_ATTR!==void 0&&(delete h.defines.USE_COL_ATTR,h.needsUpdate=!0))},setAlpha(x){f.uAlpha.value=x,d.visible=x>0},setWidth(x){f.uWidth.value=x},setDrawRange01(x,m){f.uDrawA.value=x,f.uDrawB.value=m},setFlatten(x,m){f.uFlatten.value=x,f.uFlattenY.value=m},dispose(){r.dispose(),h.dispose(),d.parent&&d.parent.remove(d)}}}var iP=`
${Su}
${Bs}
#ifdef USE_STRATA
attribute float aFace;
${ma}
#endif
#ifdef USE_ASTRUT
attribute float aStrut;
#endif
#ifdef USE_DIR
attribute vec3 aDir;
#endif
uniform float uStrut, uAlpha, uFar, uGlint, uFade; uniform vec3 uLamp; uniform vec3 uColor; uniform vec3 uCamPos; uniform vec3 cWhite;
${Yb}
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
${tr}
varying vec3 vCol; varying float vAlpha; varying float vDist;
void main() {
  if (vAlpha <= 0.002) discard;
  vec3 col = vCol;
#ifdef USE_FOG
  col = applyFog(col, vDist);
#endif
  gl_FragColor = vec4(col, vAlpha);
}`;function qb(t={}){let e={};return t.strut==null&&(e.USE_ASTRUT=""),t.strata&&(e.USE_STRATA=""),t.dir!==!1&&(e.USE_DIR=""),t.fog!==!1&&(e.USE_FOG=""),new Ft({uniforms:{uStrut:{value:t.strut!=null?t.strut:0},uAlpha:{value:t.alpha!=null?t.alpha:pn.r3.alpha},uFade:{value:1},uFar:{value:t.far!=null?t.far:Xb()},uGlint:{value:t.glint!=null?t.glint:pn.r3.glintGain},uColor:yi(t.color||"silver"),uStrataM:t.strata||ua(),uStrataA:t.strataAlpha||ha(),uLamp:he.uLamp,uCamPos:he.uCamPos,uWorldScale:he.uWorldScale,uPxPerUnit:he.uPxPerUnit,cAbyss:he.cAbyss,uFogDensity:he.uFogDensity,cWhite:he.cWhite,...zs()},defines:e,vertexShader:iP,fragmentShader:rP,transparent:!0,depthWrite:!1,blending:Or})}var sP=`
${Bs}
attribute float aSize; attribute float aAlpha;
#ifdef USE_STRATA
attribute float aFace;
${ma}
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
${tr}
${$b}
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
}`;function Mp(t,e){let n=new Float32Array(Math.max(1,t));return n.fill(e),n}function So(t={}){let e=t.positions||new Float32Array(3),n=Math.floor(e.length/3),i=t.count!=null?Math.min(t.count,n):n,r=new Fn;r.setAttribute("position",new hn(e,3)),r.setAttribute("aSize",new hn(t.sizes||Mp(n,1),1)),r.setAttribute("aAlpha",new hn(t.alphas||Mp(n,1),1));let s={};t.faces&&t.strata&&(r.setAttribute("aFace",new hn(t.faces,1)),s.USE_STRATA=""),t.fog!==!1&&(s.USE_FOG=""),r.setDrawRange(0,i);let o={uColor:yi(t.color||"white"),uAlpha:{value:t.alpha!=null?t.alpha:.4},uSize:{value:t.sizePx!=null?t.sizePx:2},uStrataM:t.strata||ua(),uStrataA:t.strataAlpha||ha(),uPixelRatio:he.uPixelRatio,cAbyss:he.cAbyss,uFogDensity:he.uFogDensity,...zs()},a=new Ft({uniforms:o,defines:s,vertexShader:sP,fragmentShader:oP,transparent:!0,depthWrite:!1,depthTest:t.depthTest!==!1,blending:Or}),l=new Yc(r,a);return l.frustumCulled=t.frustumCulled===!0,l.layers.set(t.layer!=null?t.layer:vi.DEFAULT),t.renderOrder!=null&&(l.renderOrder=t.renderOrder),{object:l,uniforms:o,get count(){return i},setCount(c){i=Math.max(0,Math.min(n,c|0)),r.setDrawRange(0,i)},setAlpha(c){o.uAlpha.value=c,l.visible=c>0},setSize(c){o.uSize.value=c},setColor(c){o.uColor=yi(c),a.uniforms.uColor=o.uColor},setPositions(c,u){let f=u??Math.floor(c.length/3);f<=n&&c!==e?e.set(c.subarray(0,f*3)):c!==e&&(e=c,n=Math.floor(c.length/3),r.setAttribute("position",new hn(e,3)),r.setAttribute("aSize",new hn(Mp(n,1),1)),r.setAttribute("aAlpha",new hn(Mp(n,1),1))),r.attributes.position.needsUpdate=!0,i=Math.min(f,n),r.setDrawRange(0,i)},dispose(){r.dispose(),a.dispose(),l.parent&&l.parent.remove(l)}}}var Gg=Math.PI*2,Ol=99,aP=$t.sign.heightFrac;function yr(t,e,n,i,r,s){let o=Math.floor(i),a=i-o,l=Gg*o/t-Math.PI/t,c=l+Gg/t,u=Math.sin(l)*e,f=Math.cos(l)*e,h=Math.sin(c)*e,d=Math.cos(c)*e;r[s]=u+(h-u)*a,r[s+1]=n,r[s+2]=f+(d-f)*a}function Sp(t,e,n,i,r=t.k){return n*t.n/r+(e<0?.5*t.n/r:0)+e*$t.lattice.faceShift*i}var Hg=2,wp=(t,e,n)=>Math.max(1e-4,2*It(n)*Math.sin(Math.PI/t)*t/(e*Hg)),lP=(t,e)=>2*It(e)*Math.sin(Math.PI/t.n);function cP(t){let e=Math.cos(Math.PI/t.n),n=0;for(let i=0;i<$o.length-1;i++){let r=t.top+(t.bot-t.top)*$o[i],s=t.top+(t.bot-t.top)*$o[i+1];n+=Math.hypot(r-s,(It(r)-It(s))*e)}return n}var _p=Object.freeze(Zt.map(t=>{let e=t.i===0?.8333333333333334:t.i===6?.16666666666666666:.5,n=lP(t,t.top+(t.bot-t.top)*e),i=Math.min(.14,.5*(.8*n/8)/cP(t));return Object.freeze({vc:e,vh:i,u0:.1,u1:.9})}));var Ap=class{constructor(){this.p=[],this.n=[],this.uv=[],this.eng=[],this.face=[],this.kind=[],this.strut=[]}tri(e,n,i,r,s,o){let a=n[0]-e[0],l=n[1]-e[1],c=n[2]-e[2],u=i[0]-e[0],f=i[1]-e[1],h=i[2]-e[2],d=l*h-c*f,g=c*u-a*h,x=a*f-l*u,m=Math.hypot(d,g,x);if(m<1e-12)return;d/=m,g/=m,x/=m;let p=e,_=n,M=i;d*o[0]+g*o[1]+x*o[2]<0&&(_=i,M=n,d=-d,g=-g,x=-x);for(let v of[p,_,M])this.p.push(v[0],v[1],v[2]),this.n.push(d,g,x),this.uv.push(v[3],v[4]),this.eng.push(v[5],v[6],v[7],v[8]),this.face.push(r),this.kind.push(s),this.strut.push(v[9])}geometry(){let e=new Fn;return e.setAttribute("position",new rn(this.p,3)),e.setAttribute("normal",new rn(this.n,3)),e.setAttribute("aFaceUV",new rn(this.uv,2)),e.setAttribute("aEng",new rn(this.eng,4)),e.setAttribute("aFace",new rn(this.face,1)),e.setAttribute("aKind",new rn(this.kind,1)),e.setAttribute("aStrut",new rn(this.strut,1)),e.computeBoundingSphere(),e}},ei=new Float32Array(3);function jb(t,e){let{i:n,n:i,k:r,top:s,bot:o,hollow:a}=e,l=s-o,c=(s+o)/2,u=aP*l,f=$o.map(d=>s+(o-s)*d),h=f.map(d=>It(d));for(let d=0;d<i;d++){let g=Gg*d/i,x=Math.cos(g),m=-Math.sin(g),p=[Math.sin(g),0,Math.cos(g)],_=n*16+d,M=(v,S)=>{yr(i,h[v],f[v],d+S,ei,0);let w=ei[0]*x+ei[2]*m;return[ei[0],ei[1],ei[2],S,(s-f[v])/l,w/u+.5,.5-(f[v]-c)/u,s-f[v],f[v]-o,wp(i,r,f[v])]};for(let v=0;v<3;v++){let S=M(v,0),w=M(v,1),E=M(v+1,0),y=M(v+1,1);t.tri(S,E,y,_,0,p),t.tri(S,y,w,_,0,p)}for(let[v,S,w,E]of[[s,h[0],1,1],[o,h[3],2,-1]]){if(S<=1e-6)continue;let y=wp(i,r,v),T=(R,F)=>(yr(i,R,v,F,ei,0),[ei[0],ei[1],ei[2],.5,w===1?0:1,-1,-1,Ol,Ol,y]);if(a>0){let R=T(S,d),F=T(S,d+1),O=T(a,d),z=T(a,d+1);t.tri(R,F,z,_,w,[0,E,0]),t.tri(R,z,O,_,w,[0,E,0])}else t.tri([0,v,0,.5,w===1?0:1,-1,-1,Ol,Ol,y],T(S,d),T(S,d+1),_,w,[0,E,0])}if(a>0){let v=2*a*Math.sin(Math.PI/i)*i/(r*Hg),S=(F,O)=>(yr(i,a,F,O,ei,0),[ei[0],ei[1],ei[2],O-d,(s-F)/l,-1,-1,Ol,Ol,v]),w=S(s,d),E=S(s,d+1),y=S(o,d),T=S(o,d+1),R=[-Math.sin(g),0,-Math.cos(g)];t.tri(w,y,T,_,3,R),t.tri(w,T,E,_,3,R)}}}function Zb(t){let e=[],n=[],i=[],r=[],s=new Float32Array(3),o=new Float32Array(3),a=(u,f,h,d,g,x)=>{let m=d[0]-h[0],p=d[1]-h[1],_=d[2]-h[2],M=Math.hypot(m,p,_)||1,v=u.i*16+(Math.floor(f)%u.n+u.n)%u.n;e.push(h[0],h[1],h[2],d[0],d[1],d[2]),n.push(v,v),i.push(g,x),r.push(m/M,p/M,_/M,m/M,p/M,_/M)},l=$t.lattice.segmentsPerGenerator;for(let u of Zt){let f=Math.max(1,Math.round(u.k*t)),h=u.hollow>0?[!1,!0]:[!1];for(let d of h)for(let g of[1,-1])for(let x=0;x<f;x++)for(let m=0;m<l;m++){let p=m/l,_=(m+1)/l,M=u.top+(u.bot-u.top)*p,v=u.top+(u.bot-u.top)*_,S=d?u.hollow:It(M),w=d?u.hollow:It(v),E=Sp(u,g,x,p,f),y=Sp(u,g,x,_,f),T=O=>(O%u.n+u.n)%u.n;yr(u.n,S,M,T(E),s,0),yr(u.n,w,v,T(y),o,0);let R=d?2*u.hollow*Math.sin(Math.PI/u.n)*u.n/(u.k*Hg):wp(u.n,u.k,M),F=d?R:wp(u.n,u.k,v);a(u,T((E+y)/2),s,o,R,F)}}let c=new Fn;return c.setAttribute("position",new rn(e,3)),c.setAttribute("aFace",new rn(n,1)),c.setAttribute("aStrut",new rn(i,1)),c.setAttribute("aDir",new rn(r,3)),c.computeBoundingSphere(),c}function uP(){let t=[],e=[],n=[],i=new Float32Array(3),r=new Float32Array(3),s=(o,a,l)=>{t.push(i[0],i[1],i[2],r[0],r[1],r[2]),e.push(l),n.push(o*16+a)};for(let o of Zt){let{i:a,n:l,top:c,bot:u,hollow:f}=o,h=$o.map(m=>c+(u-c)*m),d=[...Array(l).keys()].sort((m,p)=>Math.min(m,l-m)-Math.min(p,l-p)),g=0,x=new Set;for(let m of d)for(let p of[0,3])g<pn.r3.primaryEdges&&It(h[p])>1e-6&&(x.add(`${p}:${m}`),g++);for(let m=0;m<l;m++){for(let p=0;p<3;p++)yr(l,It(h[p]),h[p],m,i,0),yr(l,It(h[p+1]),h[p+1],m,r,0),s(a,m,pn.r3.widthPx);for(let p of[0,3]){let _=It(h[p]);_<=1e-6||(yr(l,_,h[p],m,i,0),yr(l,_,h[p],m+.999999,r,0),s(a,m,x.has(`${p}:${m}`)?pn.r3.primaryPx:pn.r3.widthPx))}if(f>0)for(let p of[c,u])yr(l,f,p,m,i,0),yr(l,f,p,m+.999999,r,0),s(a,m,pn.r3.widthPx)}}return{seg:new Float32Array(t),width:new Float32Array(e),face:new Float32Array(n)}}function hP(){let t=[],e=[];for(let n of Zt)for(let i of $o){let r=n.top+(n.bot-n.top)*i,s=It(r);for(let o=0;o<n.n&&(yr(n.n,s,r,o,ei,0),t.push(ei[0],ei[1],ei[2]),e.push(n.i*16+o),!(s<=1e-6));o++);}return{pos:new Float32Array(t),face:new Float32Array(e)}}var Tu=[],Kb=-1,Fl=new Ot,Jb=new Ot,Qb=new P,eM=new P,fP=new P;function dP(){let t=Pe.camera;if(t)for(let e=0;e<Tu.length;e++)Tu[e](t)}function pP(t){Tu.push(t),Kb<0&&(Kb=pe.add(dP,zt.CAMERA+5))}function mP(t){let e=Tu.indexOf(t);e>=0&&Tu.splice(e,1)}function gP(t){let e=0,n=t.array;for(let i=0;i<n.length;i+=3){let r=n[i]*n[i]+n[i+1]*n[i+1]+n[i+2]*n[i+2];r>e&&(e=r)}return Math.sqrt(e)}function tM(t){let e=0;for(let n=0;n<t.length;n++)t[n]>e&&(e=t[n]);return e}function bu(t={}){let e=!!t.perStratum,n=new un;n.name=e?"structure:key":"structure";let i=t.scale!=null?t.scale:1;n.scale.setScalar(i);let r=t.far!=null?t.far:700,s={value:Array.from({length:7},()=>new Ot)},o={value:[1,1,1,1,1,1,1]},a=[];if(e)for(let N=0;N<7;N++){let D=new un;D.name=`stratum:${N}`,n.add(D),a.push(D)}else a.push(n);let l=()=>{if(e)for(let N=0;N<7;N++)s.value[N].copy(a[N].matrix)},c=[],u=null;if(t.solid!==!1)if(e){u=Vg({engrave:"key",strataAlpha:o});for(let N of Zt){let D=new Ap;jb(D,N);let H=new Xt(D.geometry(),u);H.name=`solid:${N.i}`,H.userData.stratum=N.i,a[N.i].add(H),c.push(H)}}else{u=Vg({engrave:"key",strata:s,strataAlpha:o});let N=new Ap;for(let H of Zt)jb(N,H);let D=new Xt(N.geometry(),u);D.name="solid",D.frustumCulled=!1,n.add(D),c.push(D)}let f=null,h=null,d=t.latticeDensity!=null?t.latticeDensity:1;t.lattice!==!1&&(h=qb({strata:s,strataAlpha:o,far:r,dir:!0}),f=new Xc(Zb(d),h),f.name="lattice",f.frustumCulled=!1,f.onBeforeRender=l,n.add(f));let g=[],x=pn.r3.alpha;if(t.edges!==!1){let N=uP(),D=nr({segments:N.seg,width:N.width,faces:N.face,strata:s,strataAlpha:o,far:r,alpha:x});D.mesh.name="edges",D.mesh.onBeforeRender=l,n.add(D.mesh),g.push(D)}let m=null,p=null,_=.4;if(t.vertices){let N=hP();p=So({positions:N.pos,faces:N.face,strata:s,strataAlpha:o,sizePx:2,color:"white",alpha:_}),m=p.object,m.name="vertices",m.onBeforeRender=l,n.add(m)}let M=1,v={solid:1,lattice:1,edges:1,vertices:1},S=!0,w=!1,E=!0,y=null,T=()=>{n.visible=M>0,u&&(u.uniforms.uAlpha.value=M*v.solid),E=M*v.solid>0;for(let N=0;N<c.length;N++)c[N].visible=E&&!(y&&y[N]&&y[N].empty);h&&(h.uniforms.uFade.value=M*v.lattice,S=M*v.lattice>0,f.visible=S&&!w);for(let N of g)N.setAlpha(x*M*v.edges);p&&p.setAlpha(_*M*v.vertices)},R=f?gP(f.geometry.attributes.position):0,F=f?tM(f.geometry.attributes.aStrut.array):0,O=N=>{if(!f||!S)return;n.updateWorldMatrix(!0,!1);let D=n.matrixWorld.elements,H=Math.hypot(D[0],D[1],D[2]),G=0,$=1;for(let rt=0;rt<7;rt++){let ze=e?a[rt].matrix.elements:s.value[rt].elements,nt=Math.hypot(ze[12],ze[13],ze[14]);nt>G&&(G=nt);let Z=Math.hypot(ze[0],ze[1],ze[2]);Z>$&&($=Z)}let J=(R*$+G)*H;Qb.set(D[12],D[13],D[14]),N.getWorldDirection(eM);let ve=fP.copy(Qb).sub(N.position).dot(eM)-J,ye=ve>0&&F*$*H*he.uPxPerUnit.value/ve<=3;ye!==w&&(w=ye,f.visible=S&&!w)};y=c.map(N=>{let D=N.geometry,H=D.attributes.position.array,G=D.attributes.aStrut.array,$=D.attributes.aFace.array,J=H.length/3,ve=J/3,ye=new hn(J>65535?new Uint32Array(J):new Uint16Array(J),1);for(let te=0;te<J;te++)ye.array[te]=te;D.setIndex(ye);let rt=new Uint8Array(ve).fill(1),ze=new Float32Array(28),nt=new Float32Array(7),Z={mesh:N,empty:!1};return Z.run=te=>{if(e){N.updateWorldMatrix(!0,!1),Fl.multiplyMatrices(te.matrixWorldInverse,N.matrixWorld);let le=Fl.elements,ge=N.matrixWorld.elements;ze[0]=le[2],ze[1]=le[6],ze[2]=le[10],ze[3]=le[14],nt[0]=Math.hypot(ge[0],ge[1],ge[2])}else{n.updateWorldMatrix(!0,!1),Jb.multiplyMatrices(te.matrixWorldInverse,n.matrixWorld);for(let le=0;le<7;le++){Fl.multiplyMatrices(Jb,s.value[le]);let ge=Fl.elements;ze[le*4]=ge[2],ze[le*4+1]=ge[6],ze[le*4+2]=ge[10],ze[le*4+3]=ge[14],Fl.multiplyMatrices(n.matrixWorld,s.value[le]);let Oe=Fl.elements;nt[le]=Math.hypot(Oe[0],Oe[1],Oe[2])}}let Te=he.uPxPerUnit.value,je=!1;for(let le=0;le<ve;le++){let ge=0;for(let Oe=0;Oe<3&&!ge;Oe++){let Ze=le*3+Oe,St=Ze*3,Ce=e?0:Math.min(6,Math.max(0,Math.floor($[Ze]/16+.001))),Le=Ce*4,at=-(ze[Le]*H[St]+ze[Le+1]*H[St+1]+ze[Le+2]*H[St+2]+ze[Le+3]);G[Ze]*nt[Ce]*Te/Math.max(at,1e-6)<6.001&&(ge=1)}rt[le]!==ge&&(rt[le]=ge,je=!0)}if(!je)return;let Re=0;for(let le=0;le<ve;le++)rt[le]&&(ye.array[Re++]=le*3,ye.array[Re++]=le*3+1,ye.array[Re++]=le*3+2);ye.clearUpdateRanges(),ye.addUpdateRange(0,Math.max(1,Re)),ye.needsUpdate=!0,D.setDrawRange(0,Re),Z.empty=Re===0,N.visible=E&&!Z.empty},Z});let z=y.length?N=>{if(!(!E||!n.visible))for(let D=0;D<y.length;D++)y[D].run(N)}:null,L=N=>{O(N),z&&z(N)};pP(L);let V={group:n,strata:a,solids:c,lattice:f,edges:g,vertices:m,strataMatrices:s,strataAlpha:o,solidMaterial:u,latticeMaterial:h,perStratum:e,setGap(N){for(let D=0;D<7;D++){let H=(3-D)*(N-Bt.rest);e?a[D].position.y=H:s.value[D].makeTranslation(0,H,0)}},setFade(N){M=Math.max(0,Math.min(1,N)),T()},get fade(){return M},setStratumFade(N,D){N>=0&&N<7&&(o.value[N]=Math.max(0,Math.min(1,D)))},setParts(N){for(let D in N)D in v&&(v[D]=N[D]);T()},setFar(N){h&&(h.uniforms.uFar.value=N);for(let D of g)D.uniforms.uFar.value=N},setHideCaps(N){u&&(u.uniforms.uHideCapsOf.value=N)},setLatticeDensity(N){if(!f||N===d)return;d=N;let D=f.geometry;f.geometry=Zb(N),F=tM(f.geometry.attributes.aStrut.array),D.dispose()},dispose(){mP(L);for(let N of c)N.geometry.dispose();u&&u.dispose(),f&&(f.geometry.dispose(),h.dispose());for(let N of g)N.dispose();p&&p.dispose(),n.parent&&n.parent.remove(n)}};return V.setGap(Bt.rest),t.hallLod&&V.setHideCaps(-1),V}var xa=Zt[Xo.stratum],Eu=xa.n/xa.k,xP=Math.floor(1.5/Eu-.5)+1,nM=.003;function vP(t,e){let n=Math.round(e*1.5/Eu-.5);n=Math.max(0,Math.min(xP-1,n));let i=(n+.5)*Eu/1.5,r=Sp(xa,1,0,i),s=Math.round((t-r)/Eu);return{s:r+s*Eu,t:i,key:`${n}:${s}`}}function yP(t,e,n){let i=xa.top+(xa.bot-xa.top)*e,r=It(i),s=xa.n,o=(t%s+s)%s,a=Math.floor(o),l=o-a,c=Math.PI*2*a/s-Math.PI/s,u=c+Math.PI*2/s;return n.set(Math.sin(c)*r+(Math.sin(u)-Math.sin(c))*r*l,i,Math.cos(c)*r+(Math.cos(u)-Math.cos(c))*r*l)}function Ru(t){let e=qo(t||[]),n=[],i=new Set,r=o=>-1+3*(.1+.8*o),s=o=>.1+.8*o;for(let[o,a]of e){let l=$m(o),c=$m(a),u=Math.hypot((c.x-l.x)*6,(c.y-l.y)*6),f=Math.max(1,Math.round(u));for(let h=0;h<=f;h++){let d=h/f,g=vP(r(l.x+(c.x-l.x)*d),s(l.y+(c.y-l.y)*d));if(i.has(g.key))continue;i.add(g.key);let x=yP(g.s,g.t,new P);Math.hypot(x.x,x.y)<Xo.apertureSkip||n.push(x)}}return n}function pp(t={}){let e=t.scale||1,n=t.nodes||Ru(xt.clan.sigil),i=new Float32Array(Math.max(1,n.length)*3);n.forEach((l,c)=>{let u=Math.hypot(l.x,l.z)||1;i[c*3]=l.x+l.x/u*nM,i[c*3+1]=l.y,i[c*3+2]=l.z+l.z/u*nM});let r=0,s=!1,o=_s&&_s.litAlpha!=null?_s.litAlpha:.7;if(e<1e3){let l=So({positions:i,count:0,sizePx:t.dotPx||Xo.dotPx,color:"ember",alpha:1});return l.object.name="litNodes",l.object.renderOrder=3,{object:l.object,nodes:n,get count(){return r},setCount(c){r=Math.max(0,Math.min(n.length,c|0)),l.setCount(r),l.object.visible=r>0},setNight(c){s=!!c,l.setAlpha(s?o:1)},dispose(){l.dispose()}}}let a=up({positions:i,count:0,color:"ember",radius:(t.emitterM||Xo.emitterM)/e,intensity:1,night:!1});return a.object.name="litNodes",{object:a.object,nodes:n,get count(){return r},setCount(l){r=Math.max(0,Math.min(n.length,l|0)),a.setCount(r)},setNight(l){s=!!l,a.setIntensity(s?o:1)},dispose(){a.dispose()}}}var oM="samvin.v1",iM="samvin.session",_P=400,aM=/^S(0[1-9]|1[0-4])$/,Li=t=>t!==null&&typeof t=="object"&&!Array.isArray(t),Wg=t=>Array.isArray(t)&&t.every(e=>typeof e=="string");function bP(){return{v:1,firstVisit:null,lastVisit:null,days:[],found:{},shards:0,nadirOpen:!1,owner:!1,glyph:null,drawings:[],jokesFound:[],drones:{day:null,count:0,arrivals:0},resonanceNext:0,maxNest:0,transmissions:{delivered:0,read:[],lastDay:null},probes:{},decoded:[],capsuleOpened:!1,companionArrived:!1,whaleSeen:!1,inverted:!1,sound:"on",tier:null,lastRoom:"#/core",firstDive:!1,firstUnfold:!1,whaleDay:null,birthdayLeadDay:null,foundVars:{},deeds:{},code:{},codeShown:[],sbor:{count:0,last:null,here:[]},lost:{saved:0,pairs:0,kind:null,day:null,rescued:!1,hid:!1},replies:{},proposals:[],shows:{count:0,lastDay:null}}}var MP=["wait","finish","call","host","rope","gentle","notice","word"],rM=["S","A","M","•","V","I","N"],sM=t=>typeof t=="string"&&Number.isFinite(Date.parse(t)),Tp=t=>Number.isInteger(t)&&t>=0,$g=t=>t===null||typeof t=="string",SP={v:t=>t===1,firstVisit:t=>t===null||typeof t=="string"&&Number.isFinite(Date.parse(t)),lastVisit:t=>t===null||typeof t=="string"&&Number.isFinite(Date.parse(t)),days:t=>Wg(t),found:t=>Li(t),shards:t=>Number.isInteger(t)&&t>=0&&t<=5,nadirOpen:t=>typeof t=="boolean",owner:t=>typeof t=="boolean",glyph:t=>t===null||Array.isArray(t),drawings:t=>Array.isArray(t),jokesFound:t=>Wg(t),drones:t=>Li(t),resonanceNext:t=>Number.isInteger(t)&&t>=0,maxNest:t=>typeof t=="number"&&Number.isFinite(t),transmissions:t=>Li(t),probes:t=>Li(t),decoded:t=>Wg(t),capsuleOpened:t=>typeof t=="boolean",companionArrived:t=>typeof t=="boolean",whaleSeen:t=>typeof t=="boolean",inverted:t=>typeof t=="boolean",sound:t=>t==="on"||t==="off",tier:t=>t===null||t==="T1"||t==="T2"||t==="T3",lastRoom:t=>typeof t=="string"&&t.startsWith("#"),firstDive:t=>typeof t=="boolean",firstUnfold:t=>typeof t=="boolean",whaleDay:t=>t===null||typeof t=="string",birthdayLeadDay:t=>t===null||typeof t=="string",foundVars:t=>Li(t),deeds:t=>Li(t),code:t=>Li(t),codeShown:t=>Array.isArray(t),sbor:t=>Li(t),lost:t=>Li(t),replies:t=>Li(t),proposals:t=>Array.isArray(t),shows:t=>Li(t)};function wP(t){for(let r of Object.keys(t.deeds))(!MP.includes(r)||!sM(t.deeds[r]))&&delete t.deeds[r];for(let r of Object.keys(t.code))(!rM.includes(r)||!sM(t.code[r]))&&delete t.code[r];t.codeShown=[...new Set(t.codeShown.filter(r=>rM.includes(r)))];let e=t.sbor;Tp(e.count)||(e.count=0),$g(e.last)||(e.last=null),Array.isArray(e.here)||(e.here=[]),e.here=e.here.filter(r=>Li(r)&&typeof r.day=="string"&&Array.isArray(r.ids)).map(r=>({...r,ids:r.ids.filter(s=>typeof s=="string")})).slice(-30);let n=t.lost;Tp(n.saved)||(n.saved=0),Tp(n.pairs)||(n.pairs=0),n.kind===null||n.kind==="one"||n.kind==="pair"||(n.kind=null),$g(n.day)||(n.day=null),typeof n.rescued!="boolean"&&(n.rescued=!1),typeof n.hid!="boolean"&&(n.hid=!1);for(let r of Object.keys(t.replies)){let s=t.replies[r];if(!/^\d+$/.test(r)||!Array.isArray(s)){delete t.replies[r];continue}t.replies[r]=s.filter(o=>Array.isArray(o)&&o.length===2&&o.every(a=>typeof a=="number"&&a>=-1&&a<=1)).slice(0,64)}t.proposals=t.proposals.filter(r=>Li(r)&&typeof r.id=="string"&&typeof r.title=="string").slice(0,3).map(r=>({...r,title:r.title.slice(0,32),text:typeof r.text=="string"?r.text.slice(0,80):"",where:r.where==="игра"||r.where==="жизнь"?r.where:"игра"}));let i=t.shows;Tp(i.count)||(i.count=0),$g(i.lastDay)||(i.lastDay=null);for(let r of Object.keys(t.probes)){let s=t.probes[r];Li(s)&&"read"in s&&typeof s.read!="boolean"&&delete s.read}}function AP(t){let e=Li(t)?t:{},n=bP();for(let s of Object.keys(n))(!(s in e)||!SP[s](e[s]))&&(e[s]=n[s]);let i=e.drones;i.day===null||typeof i.day=="string"||(i.day=null),Number.isInteger(i.count)||(i.count=0),Number.isInteger(i.arrivals)||(i.arrivals=0);let r=e.transmissions;(!Number.isInteger(r.delivered)||r.delivered<0)&&(r.delivered=0),Array.isArray(r.read)||(r.read=[]),r.read=r.read.filter(s=>Number.isInteger(s)&&s>=0),r.lastDay===null||typeof r.lastDay=="string"||(r.lastDay=null);for(let s of Object.keys(e.found))(!aM.test(s)||typeof e.found[s]!="string")&&delete e.found[s];e.days=[...new Set(e.days.filter(s=>/^\d{4}-\d{2}-\d{2}$/.test(s)))].sort();try{wP(e)}catch(s){lt("state:migrate",s)}return e}function TP(){try{let t=localStorage.getItem(oM);if(t==null)return{};try{return JSON.parse(t)}catch{return{}}}catch{return Y.storageOk=!1,{}}}var Cu=0,Rp=!1;function Ul(){if(Cu&&(clearTimeout(Cu),Cu=0),!(!Rp||!Y.data)&&(Rp=!1,!!Y.storageOk))try{localStorage.setItem(oM,JSON.stringify(Y.data))}catch{Y.storageOk=!1}}function Mc(){if(Rp=!0,!Cu)try{Cu=setTimeout(Ul,500)}catch{Ul()}}var Ep=-1,Y={data:null,storageOk:!0,today:"",distinctDays:1,isNewDay:!1,returning:!1,sameDaySession:!1,daysAway:0,bond:0,shrp:28,get litNodes(){if(Ep<0)try{Ep=Ru(xt.clan.sigil).length}catch(t){Ep=0,lt("state:lit",t)}return Math.min(Y.distinctDays,Ep)},set(t,e){Y.data[t]=e,Mc()},patch(t){t(Y.data),Mc()},deliverTransmissions(){let t=Y.data.transmissions;if(t.lastDay===Y.today)return 0;let e=xt.transmissions.length,n=Math.min(e,Math.max(t.delivered,Y.distinctDays)),i=Math.max(0,n-t.delivered);return t.delivered=Math.max(t.delivered,n),t.lastDay=Y.today,Mc(),i},markRead(t){let e=Y.data.transmissions;!Number.isInteger(t)||t<0||e.read.includes(t)||(e.read.push(t),Mc())},rank(){let t=Object.keys(Y.data.found).filter(n=>aM.test(n)).length,e=Y.distinctDays;return t>=12&&e>=14?{name:"АРХИТЕКТОР",index:3}:t>=7&&e>=5?{name:"СМОТРИТЕЛЬ",index:2}:t>=3||e>=3?{name:"ИССЛЕДОВАТЕЛЬ",index:1}:{name:"НАБЛЮДАТЕЛЬ",index:0}}};function lM(t){let e=Number.isFinite(t)?t:Date.now(),n=AP(TP());Y.data=n,Y.today=Yh(e);let i=!0;try{i=sessionStorage.getItem(iM)==null,sessionStorage.setItem(iM,"1")}catch{i=!0}let r=n.firstVisit,s=n.lastVisit?Yh(Date.parse(n.lastVisit)):null;if(Y.returning=r!=null&&i,Y.sameDaySession=Y.returning&&s===Y.today,Y.daysAway=s?Math.max(0,Zo(s,Y.today)):0,Y.isNewDay=!n.days.includes(Y.today),Y.isNewDay)for(n.days.push(Y.today),n.days.sort();n.days.length>_P;)n.days.shift();Y.distinctDays=Math.max(1,n.days.length);let o=new Date(e).toISOString();n.firstVisit==null&&(n.firstVisit=o),n.lastVisit=o;let a=Object.keys(n.found).length;return Y.bond=zm(Y.distinctDays,a),Y.shrp=ay(Y.distinctDays,a),Rp=!0,Ul(),Y}typeof window<"u"&&window.addEventListener("pagehide",Ul);var cM=Object.freeze({clan:"members",crew:"members",missions:"voyages",vault:"insignia",legends:"archive"}),hM=new Set(["MEMBERS","VOYAGES","ARCHIVE","INSIGNIA"]);function EP(t){try{return decodeURIComponent(t)}catch{return t}}function wo(t,e){let n={hash:"",room:t,sub:e==null||e===""?null:e};return n.hash=RP(n),n}function us(t){if(t&&typeof t=="object"&&t.room)return wo(ce[t.room]?t.room:"CORE",t.sub||null);let n=String(t??"").trim().replace(/^#?\/?/,"").split(/[/?]/).filter(Boolean),i=(n[0]||"core").toLowerCase();cM[i]&&(i=cM[i]);let r=zb(i);if(!r||r.id==="WORKSHOP")return wo("CORE",null);let s=n[1]?EP(n[1]):null;return r.id==="MEMBERS"&&s&&s.toLowerCase()==="workshop"?wo("WORKSHOP",null):r.id==="CORE"?wo("CORE",s&&s.toLowerCase()==="open"?"open":null):wo(r.id,hM.has(r.id)?s:null)}function RP(t){let e=t&&ce[t.room]?t.room:"CORE";if(e==="WORKSHOP")return"#/members/workshop";let n=t.sub,i=n!=null&&n!==""&&(hM.has(e)||e==="CORE"&&n==="open");return`#/${ce[e].slug}${i?"/"+encodeURIComponent(String(n)):""}`}var uM=t=>!!(Y.data&&Y.data.found&&Y.data.found[t]);function Xg(t,e){let n=t&&t.room?t:us(t),i=Y.data||{};return n.room==="NADIR"&&!i.nadirOpen?{route:wo("CORE",null),status:"sealed",vars:{k:i.shards|0},shudder:"N"}:n.room==="ZENITH"&&!uM("S13")&&e!=="overpull"?{route:wo("CORE",null),status:"route.missing",vars:{}}:n.room==="WORKSHOP"&&!uM("S06")&&e!=="hall"?{route:wo("MEMBERS",xt.operator.id||null)}:{route:n}}function Pu(t){let e=xt.clan.name,n=t&&ce[t.room]?t.room:"CORE";if(n==="CORE")return ee.owner?`${e} · ${Cr(xt.operator.name)}`:e;let i=ce[n],r=n==="NADIR"&&Y.data&&Y.data.nadirOpen&&i.nameOpen?i.nameOpen:i.name;return`${e} · ${r}`}var zt=Object.freeze({INPUT:0,CLOCK:10,DIRECTOR:20,WORLD:30,FX:40,LAMP:50,CAMERA:60,OVERLAY:70,RENDER:80,UI:90}),PP=.05,Yg=250,va=[],IP=1,kl=0,Bl=-1;function LP(t){let e=va.slice(),n=e.length;for(;n>0&&e[n-1].order>t.order;)n--;e.splice(n,0,t),va=e}function pM(t){if(kl=0,!pe.running)return;kl=requestAnimationFrame(pM);let e=Bl<0?16.7:t-Bl;Bl=t,e>0||(e=0),e>Yg&&(e=Yg),pe.now+=e,pe.frame++;let n=Math.min(1,Math.max(0,+pe.timeScale||0));pe.worldNow+=e*n;let i=Math.min(PP,e/1e3),r=i*n,s=pe.now,o=va;for(let a=0;a<o.length;a++){let l=o[a];if(!l.dead)try{l.fn(l.order>=30&&l.order<50?r:i,s)}catch(c){lt(`loop:${l.id}`,"frame callback threw and was removed",c),pe.remove(l.id)}}}var pe={running:!1,frame:0,now:0,timeScale:1,worldNow:0,at(){if(!pe.running||Bl<0||typeof performance>"u")return pe.now;let t=performance.now()-Bl;return pe.now+(t>0?Math.min(t,Yg):0)},add(t,e=zt.UI){let n=IP++;return LP({id:n,fn:t,order:e,dead:!1}),n},remove(t){let e=va.findIndex(i=>i.id===t);if(e<0)return;va[e].dead=!0;let n=va.slice();n.splice(e,1),va=n},start(){pe.running||(pe.running=!0,Bl=-1,typeof requestAnimationFrame=="function"&&(kl=requestAnimationFrame(pM)))},stop(){pe.running=!1,kl&&typeof cancelAnimationFrame=="function"&&cancelAnimationFrame(kl),kl=0}},fM=!1,dM=!1;function DP(){let t=document.visibilityState==="hidden"||document.hidden===!0;if(t!==dM)if(dM=t,t){fM=pe.running,pe.stop();try{document.title=ee.night?"…сплю":"…ты где?"}catch{}try{Ul()}catch(e){lt("loop:flush",e)}_e.emit("visibility",{hidden:!0})}else{try{document.title=Pu(ee.route)}catch{document.title="SAM.VIN"}fM&&pe.start();try{ii.say("tab.back",{},{force:!0})}catch(e){lt("loop:status",e)}_e.emit("visibility",{hidden:!1})}}typeof document<"u"&&document.addEventListener("visibilitychange",DP);var mM=ly,NP=1/120,_r=class t{constructor(e,n=1,i=0){this.omega=e,this.zeta=n,this.x=i,this.v=0,this.target=i}step(e){if(!(e>0))return this.x;let n=Math.min(16,Math.ceil(e/NP)),i=e/n,r=this.omega,s=r*r,o=2*this.zeta*r;for(let a=0;a<n;a++)this.v+=(s*(this.target-this.x)-o*this.v)*i,this.x+=this.v*i;return this.x}snap(e){this.x=e,this.target=e,this.v=0}settled(e=.001){return Math.abs(this.target-this.x)<e&&Math.abs(this.v)<e*10}static from(e,n=0){return new t(e.omega,e.zeta==null?1:e.zeta,n)}};var OP=typeof window<"u"&&typeof window.DeviceOrientationEvent<"u",ya=[],Cp=!1,Iu={alpha:0,beta:0,gamma:0,t:0};function gM(t){Iu.alpha=t.alpha||0,Iu.beta=t.beta||0,Iu.gamma=t.gamma||0,Iu.t=typeof performance<"u"?performance.now():Date.now();for(let e=0;e<ya.length;e++)try{ya[e](Iu)}catch{}}var FP={available:OP&&typeof window.DeviceOrientationEvent.requestPermission!="function",on(t){!FP.available||ya.includes(t)||(ya.push(t),Cp||(window.addEventListener("deviceorientation",gM),Cp=!0))},off(t){let e=ya.indexOf(t);e>=0&&ya.splice(e,1),Cp&&ya.length===0&&(window.removeEventListener("deviceorientation",gM),Cp=!1)}};var Pp=null;function zl(){return Pp||(Pp=new Promise(t=>{let e=!1,n=()=>{e||(e=!0,t())};setTimeout(n,2500);try{let i=typeof document<"u"?document.fonts:null;if(!i||typeof i.load!="function"){n();return}Promise.allSettled([i.load("700 64px Geologica","SAMVINСЭМ"),i.load("500 32px Martian","SAMVIN 0123")]).then(n,n)}catch{n()}}),Pp)}var UP=Object.freeze({G2:98,A2:110,B2:123.47,D3:146.83,E3:164.81,G3:196,A3:220,B3:246.94,D4:293.66,E4:329.63,G4:392,A4:440,B4:493.88,D5:587.33,E5:659.25,G5:783.99,A5:880,B5:987.77,D6:1174.66,E6:1318.51,G6:1567.98,A6:1760,B6:1975.53,D7:2349.32}),Ip=Object.freeze([392,440,493.88,587.33,659.25,783.99,880]),a4=Object.freeze(Object.fromEntries(Object.keys(ce).map(t=>[t,ce[t].root]))),qg=Object.freeze({S01:"G4",S02:"A4",S03:"B4",S04:"D5",S05:"E5",S06:"G5",S07:"A5",S08:"B5",S09:"D6",S10:"E6",S11:"G6",S12:"A6",S13:"B6",S14:"D7"});function Lp(t){let e=UP[t];return e??440}function He(t){return Math.pow(10,t/20)}function Ie(t,e=1){let n=t.createGain();return n.gain.value=e,n}function vt(t,e=440,n="sine"){let i=t.createOscillator();return i.type=n,i.frequency.value=e,i}var xM=new WeakMap;function ti(t,e="white"){let n=xM.get(t);if(n||xM.set(t,n={}),!n[e]){let r=t.sampleRate*2,s=t.createBuffer(1,r,t.sampleRate),o=s.getChannelData(0),a=0,l=0,c=0,u=0,f=0;for(let d=0;d<r;d++){let g=Math.random()*2-1;e==="pink"?(a=.997*a+.029591*g,l=.985*l+.032534*g,c=.95*c+.048056*g,o[d]=a+l+c+g*.1848):e==="brown"?(u=(u+.02*g)/1.02,o[d]=u):o[d]=g,f+=o[d]*o[d]}let h=.577/Math.sqrt(f/r);for(let d=0;d<r;d++)o[d]*=h;n[e]=s}let i=t.createBufferSource();return i.buffer=n[e],i.loop=!0,i}function hs(t,e,n,i,r){return t.setValueAtTime(0,e),t.linearRampToValueAtTime(n,e+i),t.setTargetAtTime(0,e+i,r),t}function wn(t,e,n,i,r,s){return t.setValueAtTime(0,e),t.linearRampToValueAtTime(n,e+i),t.setValueAtTime(n,r),t.linearRampToValueAtTime(0,s),t}function sn(t,e,n,i,r){return t.setValueAtTime(e,i),t.exponentialRampToValueAtTime(n,i+r),t}function An(t,e,n,i,r){return t.setValueAtTime(e,i),t.linearRampToValueAtTime(n,i+r),t}function Nn(t,e,n,i,r,s,o,a,l){let c=vt(t,e,l),u=Ie(t);return hs(u.gain,n,r,s,o),c.connect(u).connect(i),c.start(n),a&&c.stop(n+a),c}function Ao(t,e,n,i,r){let s=mt(t,e,n);return Si(t.ctx,s.t,i,s),ct(t,s,s.t+r)}function ir(t,e,n,i,r=t.out,s){let o=vt(e,n,s),a=Ie(e);return o.connect(a).connect(r),o.start(i),t.srcs.push(o),[o,a]}function Vl(t,e,n=1){let i=ti(t,"pink"),r=vt(t,.07),s=Ie(t,.7*n);return r.connect(Ie(t,.3*n)).connect(s.gain),i.connect(Rt(t,"bandpass",600,.5)).connect(s).connect(e),i.start(),r.start(),[i,r]}function Lu(t,e,n,i,r,s,o,a,l){let c=mt(t,e,n),u=c.t,[f,h]=ir(c,t.ctx,i,u);return sn(f.frequency,i,r,u,s),wn(h.gain,u,1,o,u+a,u+l),ct(t,c,u+l+.005)}function Gl(t,e,n,i,r,s,o,a,l,c,u,f){let h=Ie(e);h.connect(a),ir(t,e,n,o,h),sn(ir(t,e,i+r,o,h)[0].frequency,i+r,i,o,s),wn(h.gain,o,l,c,o+u,o+f)}function kr(t,e,n,i,r=1,s=6,o){for(let a=1;a<=s;a++){let l=i*(1-(a-1)/Math.max(1,s-1)*.8333333333333334);Nn(t,e*a,n,o,r/a,.002,l/6.91,l+.05)}return n+i+.05}function Hl(t,e,n,i,r,s=.003){return r.map(([o,a,l])=>Nn(t,e*o,n,i,l,s,a/6.91,a+.05))}function Rt(t,e="lowpass",n=1e3,i=.707){let r=t.createBiquadFilter();return r.type=e,r.frequency.value=n,r.Q.value=i,r}function Wl(t,e=0){if(!t.createStereoPanner)return Ie(t);let n=t.createStereoPanner();return n.pan.value=Math.max(-1,Math.min(1,+e||0)),n}function Mi(t,e,n=1.4,i=2,r=t.currentTime,s=1.2,o=s,a=.003){let l=vt(t,e),c=vt(t,e*n),u=Ie(t),f=Ie(t);An(u.gain,e*n*i,0,r,o),c.connect(u).connect(l.frequency),hs(f.gain,r,1,a,s/6.91),l.connect(f);let h=r+a+s+.05;return l.start(r),c.start(r),l.stop(h),c.stop(h),{out:f,end:h,stop(d=t.currentTime){try{l.stop(d),c.stop(d)}catch{}}}}function jg(t,e){let n=t.ctx.currentTime;return e&&e.when!=null&&e.when>n?+e.when:n}function Vi(t){return Math.pow(2,(t.transpose||0)/12)}function _M(t,e,n,i,r,s=.01){if(!t.alive)return;t.alive=!1;let o=e.currentTime,a=Math.max(.008,r/1e3);n.gain.cancelScheduledValues(o),n.gain.setValueAtTime(n.gain.value,o),n.gain.linearRampToValueAtTime(0,o+a);for(let l of t.srcs)try{l.stop(o+a+s)}catch{}setTimeout(()=>{try{i.disconnect()}catch{}},(a+.2)*1e3)}function mt(t,e,{bus:n="ui",db:i=0,pan:r=0,wet:s=0,panNode:o=!1}={}){let a=t.ctx,l=Ie(a),c=l;(r||o)&&l.connect(c=Wl(a,r)),l.gain.value=He(i)*(c===l?1:Math.SQRT2),c.connect(t.bus[n]||t.bus.ui),s>0&&t.send&&c.connect(t.send(s));let u={alive:!0,t:jg(t,e),out:l,head:c,srcs:[],end:0,stop(f=30){_M(u,a,l,c,f)}};return u}function Mt(t,...e){for(let n of e)t.srcs.push(n.src||n);return t}function ct(t,e,n){let i=t.ctx;e.end=n;let r=null;for(let o of e.srcs){try{o.stop(n)}catch{}"onended"in o&&(r=o)}let s=()=>{if(e.alive){e.alive=!1;try{e.head.disconnect()}catch{}}};return r?r.onended=s:setTimeout(s,(n-i.currentTime+.1)*1e3),t.track?t.track(e,Math.max(.05,n-i.currentTime)):e}var vM=new WeakMap;function Du(t,e=1){let n=vM.get(t);if(n||vM.set(t,n={}),!n[e]){let r=t.createBuffer(1,2,t.sampleRate);r.getChannelData(0)[0]=e,n[e]=r}let i=t.createBufferSource();return i.buffer=n[e],i}function Si(t,e,{type:n="bandpass",f:i=3200,Q:r=1,a:s=5e-4,d:o=.002,peak:a=1,color:l="white"}={},c,u=c&&c.out){let f=ti(t,l),h=Ie(t);return c&&(h.connect(u),c.srcs.push(f)),wn(h.gain,e,a,s,e+s,e+s+o),f.connect(Rt(t,n,i,r)).connect(h),f.start(e,Math.random()*1.5),f.stop(e+s+o+.02),{src:f,out:h,end:e+s+o+.02}}function Zg(t,e,{decaySec:n=e,tau:i=0,hp:r=120,lp:s=0}={}){let o=t.sampleRate,a=Math.floor(o*e),l=t.createBuffer(2,a,o),c=Math.exp(i?-1/(i*o):-6.91/(n*o)),u=Math.exp(-2*Math.PI*r/o),f=s?Math.exp(-2*Math.PI*s/o):0;for(let h=0;h<2;h++){let d=l.getChannelData(h),g=0,x=0,m=1;for(let p=0;p<a;p++){let _=(Math.random()*2-1)*m;m*=c,x=s?(1-f)*_+f*x:u*(x+_-g),g=_,d[p]=x}}return l}var yM=new WeakMap;function Kg(t){let e=yM.get(t);if(e==null){let n=0;for(let i of t.getChannelData(0))n+=i*i;yM.set(t,e=n>0?1/Math.sqrt(n):1)}return e}function Nu(t,e){let n=t.createConvolver();return n.normalize=!1,n.buffer=e,{input:n,output:n.connect(Ie(t,Kg(e)))}}function Jg(t){return typeof OfflineAudioContext<"u"&&t instanceof OfflineAudioContext}function Gi(t,e="fx",n=!1,i=200){let r=t.ctx,s=Ie(r,0),o=n?Wl(r,0):null,a=o?(s.connect(o),o):s;a.connect(t.bus[e]||t.bus.fx);let l={alive:!0,srcs:[],out:s,pn:o,k:o?Math.SQRT2:1,set(){},stop(c=i){_M(l,r,s,a,c,.02)}};return l}function Hi(t,e){return t.track?t.track(e,3600):e}var mn=(t,e)=>t==null||!isFinite(+t)?e:+t,Qg=t=>Math.max(-1,Math.min(1,mn(t,0)));function bM(t,e={}){let n=t.ctx,i=e.gen===2?2:1,r=Math.pow(1.03,mn(e.n,0)),s=mt(t,e,{bus:"ui",db:i===1?-22:-20,pan:mn(e.pan,0),panNode:!0,wet:i===2?.12:0}),o=s.t;if(i===1){let h=Rt(n,"highpass",1500,.707),d=Du(n,.9),g=vt(n,4200*r),x=Ie(n);return x.gain.setValueAtTime(.75,o),x.gain.setTargetAtTime(0,o,.0012),d.connect(h),g.connect(x).connect(h),h.connect(s.out),d.start(o),g.start(o),Mt(s,d,g),ct(t,s,o+.012)}let a=Ie(n),l=vt(n,1180*r),c=vt(n,2950*r),u=Ie(n),f=Ie(n);if(u.gain.setValueAtTime(.62,o),u.gain.setTargetAtTime(0,o,.006),u.gain.setValueAtTime(0,o+.022),f.gain.setValueAtTime(.62*He(-9),o),f.gain.setTargetAtTime(0,o,.003),l.connect(u).connect(a),c.connect(f).connect(a),Si(n,o,{type:"lowpass",f:3e3,Q:.707,d:.002,peak:.3},s,a),l.start(o),c.start(o),Mt(s,l,c),a.connect(s.out),t.buf&&t.buf.irTight){let h=Nu(n,t.buf.irTight),d=Ie(n,.45);a.connect(h.input),h.output.connect(d).connect(s.out)}return ct(t,s,o+.4)}function ex(t,e={}){let n=t.ctx,i=t.buf&&t.buf["rev."+e.src];if(!i||e.endAt==null||!isFinite(+e.endAt))return null;let r=Math.max(.25,mn(e.rate,1)),s=Math.max(.01,mn(e.ms,300)/1e3),o=n.currentTime,a=Math.min(i.duration,s*r),l=+e.endAt-a/r,c=i.duration-a,u=l,f=c,h=a;if(u<o){let w=(o-u)*r;f+=w,h-=w,u=o}if(h<=.003)return null;let d=i.sampleRate,g=Math.floor(c*d),x=a*d,m=1e-9;for(let w=0;w<i.numberOfChannels;w++){let E=i.getChannelData(w);for(let y=g;y<E.length;y++){let T=(y-g)/x,R=Math.abs(E[y])*T*T;R>m&&(m=R)}}let p=mt(t,{when:u},{bus:"fx",db:mn(e.gainDb,-22)-20*Math.log10(m),pan:mn(e.pan,0)}),_=n.createBufferSource(),M=Ie(n),v=new Float32Array(16),S=h/r;for(let w=0;w<16;w++){let E=(u-l+w/15*S)/(a/r);v[w]=E*E}return M.gain.setValueCurveAtTime(v,u,S),_.buffer=i,_.playbackRate.value=r,_.connect(M).connect(p.out),_.start(u,f,h),Mt(p,_),ct(t,p,u+S+.005)}function Dp(t,e={}){let n=t.ctx,i=mt(t,e,{bus:"fx",db:0}),r=i.t,s=Du(n,1),o=Rt(n,"lowpass",1e3,.707),a=Ie(n,He(-32)*n.sampleRate/(.456*2*Math.PI*1e3));s.connect(o).connect(a).connect(i.out);let l=vt(n,80),c=Ie(n);return wn(c.gain,r,He(-30),.003,r+.022,r+.03),l.connect(c).connect(i.out),s.start(r),l.start(r),Mt(i,s,l),ct(t,i,r+.04)}function MM(t,e={}){let n=t.ctx,i=mt(t,e,{bus:"fx",db:0}),r=i.t,s=ti(n,"white"),o=Ie(n);return An(o.gain,He(-50)*1.03,He(-28)*1.03,r,.4),An(o.gain,He(-28)*1.03,0,r+1.3,.03),s.connect(Rt(n,"lowpass",2500,.5)).connect(o).connect(i.out),s.start(r),Mt(i,s),ct(t,i,r+1.34)}function SM(t,e={}){let n=t.ctx,i=t.buf&&t.buf.digiTail;if(!i)return null;let r=Array.isArray(e.pans)&&e.pans.length?e.pans:[0,-.2,.4,-.6,.8,0],s=mt(t,e,{bus:"fx",db:-23,panNode:!0}),o=s.t,a=n.createBufferSource();if(s.head.pan)for(let l=0;l<6;l++)s.head.pan.setValueAtTime(l===5?0:Qg(r[l]),o+.04*l);return a.buffer=i,a.connect(s.out),a.start(o),Mt(s,a),ct(t,s,o+i.duration+.005)}function wM(t,e={}){let n=t.ctx,i=mt(t,e,{bus:"fx",db:-14}),r=i.t,s=vt(n,30),o=Ie(n);return sn(s.frequency,30,120,r+.24,.76),wn(o.gain,r+.24,1,.06,r+1,r+1.12),s.connect(o).connect(i.out),s.start(r+.24),Mt(i,s),ct(t,i,r+1.13)}function tx(t,e,n,i=1){let r=Nn(t,96,e,n,i,.004,.13024602026049203,1);return sn(r.frequency,96,48,e,.12),r}function nx(t,e,n,i,r=0){let s=t.ctx;r&&e.connect(Ie(s,r)).connect(n);let o=t.irLong;if(!o)return;let a=Nu(s,o),l=Ie(s,i);e.connect(a.input),a.output.connect(l).connect(n)}function AM(t,e={}){let n=t.ctx,i=mt(t,e,{bus:"fx",db:mn(e.gainDb,-22)+9}),r=i.t,s=Rt(n,"lowpass",300,.707);return Mt(i,tx(n,r,s,1)),nx(t,s,i.out,1,0),ct(t,i,r+6.2)}function TM(t,e={}){let n=t.ctx,i=Math.max(1,mn(e.dist,300)),r=mt(t,e,{bus:"fx",db:-18+10*Math.log10(300/i)}),s=r.t,o=Ie(n),a=Nn(n,60,s,o,.75,.006,.4/4.6,0);return sn(a.frequency,60,32,s,.4),Si(n,s,{type:"lowpass",f:mn(e.lpHz,180),Q:.707,a:.004,d:.196,peak:.6},r,o),Mt(r,a),nx(t,o,r.out,.6,1),ct(t,r,s+6.2)}function EM(t,e={}){let n=t.ctx,i=Math.max(1,Math.min(12,mn(e.n,5)|0)),r=mt(t,e,{bus:"fx",db:-23.5}),s=r.t,o=Rt(n,"lowpass",400,.707);for(let a=0;a<i;a++){let l=s+a*.06,c=Nn(n,90,l,o,.7,.003,.08/4.6,.1);Si(n,l,{type:"lowpass",f:2e3,d:.003,peak:.5},r,o),Mt(r,c)}return nx(t,o,r.out,.4,1),ct(t,r,s+i*.06+6.1)}function RM(t,e={}){let n=t.ctx,i=Math.max(.05,mn(e.ms,480)/1e3),r=mt(t,e,{bus:"ui",db:-30,pan:mn(e.panFrom,0),panNode:!0}),s=r.t,o=vt(n,1320),a=Ie(n);return sn(o.frequency,1320,880,s,i),wn(a.gain,s,1,.012,s+i-.04,s+i),r.head.pan&&An(r.head.pan,Qg(e.panFrom),Qg(e.panTo),s,i),o.connect(a).connect(r.out),o.start(s),Mt(r,o),ct(t,r,s+i+.01)}function CM(t,e={}){let n=t.ctx,i=mn(e.hz,392),r=mt(t,e,{bus:"room",db:-17.5,pan:mn(e.pan,0),panNode:!0,wet:.3}),s=r.t,o=Mi(n,i,1.4,3,s,1.6,.8),a=Mi(n,i*1.5,1.4,3,s+.18,1.6,.8);return o.out.connect(r.out),a.out.connect(r.out),Mt(r,o,a),ct(t,r,a.end)}function PM(t,e={}){let n=t.ctx,i=mn(e.hz,392),r=e.kind==="way"||e.kind==="rest"?e.kind:"on",s=mt(t,e,{bus:"room",db:0,pan:mn(e.pan,0),panNode:!0,wet:.2}),o=s.t,a=Ie(n);a.connect(s.out);let l;if(r==="rest"){let c=vt(n,1800),u=Ie(n);wn(u.gain,o,He(-32),.001,o+.005,o+.006),c.connect(u).connect(s.out),c.start(o),Mt(s,c),a.gain.value=He(-30)/1.75,l=kr(n,i/2,o+.02,2,1,6,a)}else r==="way"?(An(a.gain,0,He(-20)/1.75,o,.4),l=kr(n,i,o,2.4,1,6,a)):(a.gain.value=He(-18)/1.75,l=kr(n,i,o,2,1,6,a));return ct(t,s,l)}function IM(t,e={}){let n=t.ctx,i=mt(t,e,{bus:"room",db:-16,pan:mn(e.pan,0),panNode:!0,wet:.25}),r=i.t,s=Mi(n,mn(e.hz,392),1.4,2,r,2,.9);return s.out.connect(i.out),Mt(i,s),ct(t,i,s.end)}function LM(t,e={}){let n=t.ctx,i=e.night?.75:1,r=mt(t,e,{bus:"ui",db:-30,pan:mn(e.pan,0),panNode:!0}),s=r.t;return[1567.98,1975.53].forEach((o,a)=>{let l=s+a*.07,c=vt(n,o*i),u=Ie(n);wn(u.gain,l,1,.004,l+.032,l+.04),c.connect(u).connect(r.out),c.start(l),c.stop(l+.045),Mt(r,c)}),ct(t,r,s+.12)}function DM(t,e={}){return Ao(t,e,{bus:"ui",db:-30,pan:mn(e.pan,0),panNode:!0},{type:"lowpass",f:400,Q:.707,a:.02,d:.1,peak:3.5},.14)}function NM(t,e={}){let n=t.ctx,i=mt(t,e,{bus:"room",db:0,wet:.18}),r=i.t,s=Ie(n,He(-24.5));s.connect(i.out);let o=e.pair?n.createPeriodicWave(new Float32Array([0,1]),new Float32Array([0,0]),{disableNormalization:!0}):null;for(let u=0;u<7;u++){let f=r+.06*u,h=Ip[u],d=Ie(n);if(u<6?An(d.gain,1,.08,f+.04,.02):An(d.gain,1,.16,r+.4,.02),d.connect(s),Hl(n,h,f,d,[[1,.4,1],[2,.24,.1],[3,.12,.03]],.002),o){let g=n.createOscillator(),x=Ie(n);g.setPeriodicWave(o),g.frequency.value=h*1.5,hs(x.gain,f,He(-3),.002,.4/6.91),g.connect(x).connect(d),g.start(f),g.stop(f+.45)}}let a=r+.48,l=Ie(n,He(-20)*.9),c=Mi(n,1174.66,1.4,2,a,1.6,.9);return c.out.connect(l).connect(i.out),Mt(i,c),ex(t,{src:"vin",endAt:a,ms:120,rate:2,gainDb:-24}),ct(t,i,c.end)}var kP=["A","B"];function ix(t,e={},n=!0,i=t.bus.bed){let r=t.ctx,s=Ie(r),o=Rt(r,"highpass",3e3,.5),a=Wl(r,mn(e.pan,0)),l=vt(r,Math.max(.001,mn(e.drift,.03))),c=Ie(r,.6);l.connect(c),a.pan&&c.connect(a.pan),l.start(),o.connect(a).connect(s).connect(i);let u=d=>He(-58+18*Math.max(0,Math.min(1,d))+6),f={A:null,B:null},h={alive:!0,level01:mn(e.level01,1/9),drift:mn(e.drift,.03),poll(){if(!(!h.alive||!t.buf))for(let d of kP){let g=t.buf["dust"+d];if(f[d]||!g||d==="B"&&t.tier==="T1")continue;let x=r.createBufferSource(),m=Ie(r,.71);x.buffer=g,x.loop=!0,x.connect(m).connect(o),x.start(r.currentTime+.01,Math.random()*g.duration),f[d]=x}},set(d){if(!h.alive||!d)return;let g=r.currentTime;d.level01!=null&&(h.level01=+d.level01,s.gain.setTargetAtTime(u(h.level01),g,.08)),d.drift!=null&&(h.drift=+d.drift,l.frequency.setTargetAtTime(Math.max(.001,Math.min(.12,h.drift)),g,.3)),d.pan!=null&&a.pan&&a.pan.setTargetAtTime(Math.max(-1,Math.min(1,+d.pan)),g,.05),h.poll()},stop(d=200){if(!h.alive)return;h.alive=!1;let g=r.currentTime,x=Math.max(.008,d/1e3);s.gain.cancelScheduledValues(g),An(s.gain,s.gain.value,0,g,x);for(let m of[f.A,f.B,l])if(m)try{m.stop(g+x+.02)}catch{}}};return s.gain.value=u(h.level01),h.poll(),n&&t.track?t.track(h,3600):h}function OM(t,e){return ix(t,e,!0)}function FM(t,e={}){let n=t.ctx,i=Ie(n);i.connect(t.bus.fx);let r=Math.max(.1,mn(e.periodMs,900)/1e3),s=Array.isArray(e.steps)?e.steps.map(g=>+g/1e3):null,o=e.t0Perf!=null&&isFinite(+e.t0Perf)&&!Jg(n)?$e.fx.ctxTimeFor(+e.t0Perf):jg(t,e),a=g=>He(-52+24*Math.max(0,Math.min(1,g)));i.gain.value=a(mn(e.level01,.5));let l=0,c=0,u=g=>{if(t.chain&&t.chain.closed&&t.chain.closed(g,.03))return;let x=Nn(n,49,g,i,.88,.006,.11,.8),m=Nn(n,98,g,i,.88*He(-8),.006,.11,.8);Si(n,g,{type:"lowpass",f:600,d:.002,peak:.7*He(-30)*4}).out.connect(i),t.track&&t.track({alive:!0,stop(p=8){try{let _=n.currentTime+p/1e3;x.stop(_),m.stop(_)}catch{}}},g+.8-n.currentTime)},f=()=>s?l<s.length?o+s[l]:1/0:o+l*r,h=g=>{for(let x=f();x<=g;x=f())x>=n.currentTime-.005&&u(Math.max(x,n.currentTime)),l++;f()===1/0&&clearInterval(c)},d={alive:!0,set(g){d.alive&&g&&g.level01!=null&&i.gain.setTargetAtTime(a(+g.level01),n.currentTime,.05)},stop(g=60){if(!d.alive)return;d.alive=!1,clearInterval(c);let x=n.currentTime;i.gain.cancelScheduledValues(x),An(i.gain,i.gain.value,0,x,Math.max(.006,g/1e3))}};return Jg(n)?h(o+(s?30:8)):(h(n.currentTime+.1),c=setInterval(()=>{d.alive&&h(n.currentTime+.1)},25)),d}var UM=-5;function kM(t,e,n,i){let r=t.ctx,s=(e.gainDb===-3?-3:0)+n,o=mt(t,e,{bus:"fx",db:s}),a=o.t;Mt(o,tx(r,a,o.out,He(-6))),Si(r,a,{type:"bandpass",f:3200,Q:1.2,a:3e-4,d:.0027,peak:He(-18)*2.2},o);let l=Ie(r);l.gain.setValueAtTime(He(UM-10),a),l.gain.setTargetAtTime(He(UM),a+.004,.12),l.connect(o.out);let c=t.send?t.send(.3):null,u=(M,v,S,w)=>{let E=Mi(r,M,1.4,3,v,S,1.2,.008),y=Ie(r,He(-10)),T=Nn(r,M*3,v,l,He(-24),.008,S/3/6.91,S/3+.05);E.out.connect(y).connect(l),w&&c&&y.connect(c),Mt(o,E,T)};u(392,a+.06,2.4,!1),u(587.33,a+.34,2.8,!0),Gl(o,r,196,293.66,14,.6,a+.34,l,He(-16)/2,.03,.9,1.7);let f=a+.42,h=Rt(r,"lowpass",180,4),d=Ie(r);sn(h.frequency,180,1800,f,1.6),hs(d.gain,f,He(-16)/3.2,.6,2/6.91);for(let M of[98,146.83,220])for(let v of[-6,6]){let S=vt(r,M,"sawtooth");S.detune.value=v,S.connect(h),S.start(f),Mt(o,S)}h.connect(d).connect(l);let g=ti(r,"white"),x=Rt(r,"bandpass",300,1.4),m=Ie(r),p=Wl(r,-1);if(sn(x.frequency,300,6e3,f,2.38),wn(m.gain,f,He(-26)*2.4,.9,f+.9,a+2.8),p.pan&&An(p.pan,-1,1,f,2.38),g.connect(x).connect(m).connect(p).connect(l),g.start(f),Mt(o,g),(Array.isArray(e.found)?e.found:[]).forEach((M,v)=>{let S=Lp(qg[M]||""),w=a+.34+.06*(v+1);if(!qg[M])return;let E=Ie(r),y=Nn(r,S,w,E,He(-30),.005,1.2/6.91,1.3),T=Nn(r,S*2.76,w,l,He(-42),.004,.3/6.91,.4);E.connect(l),c&&E.connect(c),Mt(o,y,T)}),i){let M=a+.62,v=Mi(r,493.88,1.4,2.4,M,2.6,1,.008),S=Ie(r,He(-12));v.out.connect(S).connect(l),c&&S.connect(c),Mt(o,v)}return ct(t,o,a+3.3)}function BM(t,e={}){return kM(t,e,0,!1)}function zM(t,e={}){return Ao(t,e,{bus:"ui",db:-24},{type:"bandpass",f:3200*Math.pow(1.04,Math.max(0,Math.min(12,+e.i||0))),Q:8,a:2e-4,d:.0018,peak:20},.03)}function VM(t,e={}){let n=Y.data&&Y.data.found?Object.keys(Y.data.found):[];return kM(t,{when:e.when,found:Array.isArray(e.found)?e.found:n},-6,!0)}var rx=1.75;function Op(t,e,n,i,r,s=1){wn(ir(e,t,n,i)[1].gain,i,s,5e-4,i+Math.max(.001,r*.4),i+r)}function HM(t,e={}){let n=typeof window<"u"&&window.innerWidth||1440,i=e.x!=null&&isFinite(+e.x)?+e.x:n/2,r=mt(t,e,{bus:"ui",db:-30,pan:Math.max(-.6,Math.min(.6,(i/n*2-1)*.6)),panNode:!0});return Op(t.ctx,r,1800*Vi(t),r.t,.006),ct(t,r,r.t+.012)}function WM(t,e={}){let n=t.ctx,i=mt(t,e,{bus:"ui",db:-24}),r=i.t;return Si(n,r,{type:"highpass",f:4e3,Q:.707,a:2e-4,d:.0018,peak:.55},i),Op(n,i,900*Vi(t),r,.02,.55),ct(t,i,r+.03)}var Np=0,GM=-1;function $M(t,e={}){let n=t.ctx,i=n.currentTime;e.n!=null&&isFinite(+e.n)?Np=Math.max(0,+e.n|0):Np=i-GM<.25?Math.min(12,Np+1):0,GM=i;let r=mt(t,e,{bus:"ui",db:-28});return Op(n,r,2200*Math.pow(1.02,Np)*Vi(t),r.t,.003),ct(t,r,r.t+.008)}function XM(t,e={}){let n=t.ctx,i=mt(t,e,{bus:"ui",db:-24}),r=Ie(n,1/rx);return r.connect(i.out),ct(t,i,kr(n,(+e.root||146.83)*4*Vi(t),i.t,.9,1,6,r))}function YM(t,e={}){let n=t.ctx,i=mt(t,e,{bus:"ui",db:-18}),r=i.t,s=Rt(n,"lowpass",600);return s.connect(i.out),hs(ir(i,n,120*Vi(t),r,s)[1].gain,r,1,.004,.14/5),ct(t,i,r+.16)}function qM(t,e={}){return Ao(t,e,{bus:"ui",db:-26},{type:"bandpass",f:5e3*(.92+Math.random()*.16)*Vi(t),Q:4,a:5e-4,d:.0055,peak:2.8},.012)}function jM(t,e={}){let n=t.ctx,i=Math.max(0,Math.min(6,+e.i|0)),r=mt(t,e,{bus:"ui",db:e.quiet?-30:-18}),s=Ie(n,1/rx);return s.connect(r.out),ct(t,r,kr(n,Ip[i]*Vi(t),r.t,1.2,1,6,s))}function ZM(t,e={}){let n=t.ctx,i=mt(t,e,{bus:"room",db:-16,wet:.08}),r=Ie(n,1/rx);return r.connect(i.out),ct(t,i,kr(n,(+e.hz||392)*Vi(t),i.t,2,1,6,r))}function KM(t,e={}){let n=t.ctx,i=mt(t,e,{bus:"ui",db:-22}),r=Ie(n,1/1.3);return r.connect(i.out),ct(t,i,kr(n,(+e.hz||392)*Vi(t),i.t,.4,1,3,r))}function JM(t,e={}){let n=t.ctx,i=(+e.root||146.83)*4*Vi(t),r=mt(t,e,{bus:"ui",db:-23,wet:.15}),s=r.t,o=Mi(n,i,1.4,2,s,1.6,.8),a=Mi(n,i*1.5,1.4,2,s+.012,1.6,.8);return o.out.connect(r.out),a.out.connect(r.out),Mt(r,o,a),ct(t,r,a.end)}function QM(t,e={}){let n=t.ctx,i=Vi(t),r=(+e.root||146.83)*i,s=mt(t,e,{bus:"ui",db:0,wet:.1}),o=s.t;return Gl(s,n,r*2,r*3,5,.24,o,s.out,He(-22)/2,.008,.36,.48),Mt(s,Nn(n,48,o,s.out,He(-14),.004,.16/5,0)),ct(t,s,o+.49)}function e1(t,e={}){let n=t.ctx,i=mt(t,e,{bus:"ui",db:-26}),r=i.t;return Op(n,i,2400*Vi(t),r,.004,1),Si(n,r+.004,{type:"lowpass",f:400*Vi(t),Q:.707,a:.025,d:.095,peak:2.6},i),ct(t,i,r+.13)}var t1=t=>Math.max(0,Math.min(1,+t||0));function n1(t,e={}){let n=t.ctx,i=Gi(t,"fx",!0),{out:r,pn:s}=i,o=ti(n,"pink"),a=Rt(n,"bandpass",300,1);o.connect(a).connect(r),o.start(n.currentTime,Math.random()*1.5),i.srcs.push(o);let l=0,c=!1,u=!!e.reverse;return i.set=f=>{if(!i.alive||!f)return;let h=t1(f.speed01),d=n.currentTime;h>l?l=h:h<l*.85&&(c=!0);let g=u&&!c?1:h;a.frequency.setTargetAtTime(300+2100*g,d,.025),r.gain.setTargetAtTime(He(-18)*1.9*i.k*h,d,.025),s&&s.pan&&f.pan!=null&&s.pan.setTargetAtTime(Math.max(-1,Math.min(1,+f.pan||0)),d,.04)},i.set(e),Hi(t,i)}function i1(t,e={}){let n=Math.max(.1,(+e.ms||1300)/1e3);return Lu(t,e,{bus:"fx",db:e.gainDb!=null?+e.gainDb:-10},+e.from||120,+e.to||30,n,.03,n*.7,n)}function r1(t,e={}){return Ao(t,e,{bus:"fx",db:-32},{type:"highpass",f:3e3,Q:.707,a:1e-4,d:9e-4,peak:1.1},.006)}function s1(t,e={}){let n=mt(t,e,{bus:"fx",db:-8}),i=n.t;return Mt(n,Nn(t.ctx,42,i,n.out,1,.004,.3/6.91,0)),ct(t,n,i+.31)}function o1(t,e={}){let n=t.ctx,i=Gi(t,"fx",!1),{out:r}=i,s=ti(n,"brown"),o=Rt(n,"lowpass",120,.707),a=vt(n,36),l=Ie(n,.45);return s.connect(o).connect(r),a.connect(l).connect(r),s.start(n.currentTime,Math.random()*1.5),a.start(),i.srcs.push(s,a),i.set=c=>{i.alive&&c&&r.gain.setTargetAtTime(He(-20)*.45*t1(c.speed01),n.currentTime,.04)},i.set(e),Hi(t,i)}function a1(t,e={}){let n=t.ctx,i=mt(t,e,{bus:"fx",db:-24}),r=i.t,s=ti(n,"white"),o=Rt(n,"bandpass",800,2.2),a=Ie(n);return sn(o.frequency,800,200,r,.4),An(a.gain,0,5,r,.12),a.gain.linearRampToValueAtTime(0,r+.4),s.connect(o).connect(a).connect(i.out),s.start(r,Math.random()*1.5),Mt(i,s),ct(t,i,r+.41)}function l1(t,e={}){let n=t.ctx,i=mt(t,e,{bus:"fx",db:-13.6}),r=i.t,s=r+2.34,o=vt(n,36),a=vt(n,36.3),l=Ie(n),c=ti(n,"brown"),u=Rt(n,"lowpass",120,1.2),f=Ie(n);return sn(o.frequency,36,49,r,2.34),sn(a.frequency,36.3,49.3,r,2.34),sn(l.gain,1e-4,.42,r,.8),l.gain.linearRampToValueAtTime(.5,s-.06),l.gain.linearRampToValueAtTime(0,s),sn(u.frequency,120,900,r,2.34),sn(f.gain,1e-4,.35,r,.8),f.gain.linearRampToValueAtTime(.5,s-.06),f.gain.linearRampToValueAtTime(0,s),o.connect(l),a.connect(l),l.connect(i.out),c.connect(u).connect(f).connect(i.out),o.start(r),a.start(r),c.start(r,Math.random()*1.5),Mt(i,o,a,c),ct(t,i,s+.01)}function c1(t,e={}){let n=t.ctx,i=mt(t,e,{bus:"fx",db:-16,wet:.2}),r=i.t,s=Du(n,1),o=Rt(n,"bandpass",2200,1.5),a=Ie(n,2.2);s.connect(o).connect(a).connect(i.out),Si(n,r,{type:"bandpass",f:2e3,Q:1.2,a:3e-4,d:.003,peak:1.2},i);let l=ti(n,"pink"),c=Rt(n,"bandpass",500,2),u=Ie(n),f=vt(n,660),h=Ie(n),d=r+.02;return sn(c.frequency,500,3200,d,.58),wn(u.gain,d,1.6,.43,d+.43,r+.62),sn(f.frequency,660,1320,d,.58),wn(h.gain,d,.12,.43,d+.43,r+.62),l.connect(c).connect(u).connect(i.out),f.connect(h).connect(i.out),s.start(r),l.start(r,Math.random()*1.5),f.start(r),Mt(i,s,l,f),ct(t,i,r+.63)}var HP=(t,e,n)=>Math.max(e,Math.min(n,t));function u1(t,e={}){let n=t.ctx,i=mt(t,e,{bus:"fx",db:-16,wet:.25}),r=i.t;return Mt(i,...Hl(n,1567.98,r,i.out,[[1,4,1/1.7],[2.76,1.6,.5/1.7],[5.4,.6,.28/1.7]])),ct(t,i,r+4.06)}function h1(t,e={}){let n=t.ctx,i=Gi(t),r=o=>110*Math.pow(2,HP(+o,0,6)/2),s=vt(n,e.k!=null?r(e.k):110);return s.connect(i.out),s.start(),i.srcs.push(s),i.out.gain.setTargetAtTime(He(-18),n.currentTime,.08),i.set=o=>{if(!i.alive||!o||o.k==null)return;let a=n.currentTime;s.frequency.cancelScheduledValues(a),sn(s.frequency,s.frequency.value,r(o.k),a,.2)},Hi(t,i)}function f1(t,e={}){let n=t.ctx,i=Gi(t),r=vt(n,55),s=n.currentTime;return r.connect(i.out),r.start(),i.srcs.push(r),An(i.out.gain,0,He(-16),s,6),i.set=()=>{},Hi(t,i)}function d1(t,e={}){let n=t.ctx,i=mt(t,e,{bus:"fx",db:-12}),r=i.t,[,s]=ir(i,n,70,r);return Si(n,r,{type:"lowpass",f:900,Q:.707,a:.002,d:.028,peak:.9},i),wn(s.gain,r,.62,.003,r+.04,r+.06),ct(t,i,r+.07)}function p1(t,e,n,i){let r=t.ctx,s=(Array.isArray(e.hz)?e.hz:[]).map(Number).filter(u=>u>20&&u<8e3);s.length||s.push(392);let o=mt(t,e,{bus:"room",db:n,wet:.2}),a=o.t,l=Ie(r,1/Math.pow(s.length,.75)/(i?1:1.75));l.connect(o.out);let c=a;return s.forEach((u,f)=>{let h=a+f*.004;if(i){let d=Mi(r,u,1.4,2.4,h,2.6,1,.006);d.out.connect(l),Mt(o,d),c=Math.max(c,d.end)}else c=Math.max(c,kr(r,u,h,2.4,1,6,l))}),ct(t,o,c)}function m1(t,e={}){return p1(t,e,-15.5,!0)}function g1(t,e={}){return p1(t,e,-12,!1)}function x1(t,e={}){let n=t.ctx,i=mt(t,e,{bus:"fx",db:-24}),r=i.t,s=ti(n,"white"),o=Ie(n);return hs(o.gain,r,.68,.01,.9/6.91),s.connect(Rt(n,"highpass",2e3,.707)).connect(o).connect(i.out),s.start(r,Math.random()),Mt(i,s),ct(t,i,r+.92)}function v1(t,e={}){let n=t.ctx,i=Gi(t,"fx",!1,800),r=[],s=[],o=Math.log2(440);for(let u=0;u<8;u++){let f=vt(n,440),h=Ie(n);h.gain.value=0,f.connect(h).connect(i.out),f.start(),r.push(f),s.push(h),i.srcs.push(f)}let a=new Float32Array(8).fill(-1),l=0,c=null;return i.set=u=>{if(!i.alive||!u||u.d==null)return;let f=-3*Math.log10(Math.max(1e-6,+u.d)/12),h=n.currentTime;c!==null&&(l+=Math.round(f-l-c)),c=f-l;for(let d=0;d<8;d++){let g=((d+c)%8+8)%8,x=Math.log2(27.5)+g,m=Math.pow(2,x),p=Math.exp(-((x-o)*(x-o))/(2*1.21));a[d]<0||Math.abs(g-a[d])>4?(r[d].frequency.setValueAtTime(m,h),s[d].gain.setValueAtTime(p*.59,h)):(r[d].frequency.setTargetAtTime(m,h,.012),s[d].gain.setTargetAtTime(p*.59,h,.012)),a[d]=g}},i.set({d:e.d!=null?e.d:12}),i.out.gain.setTargetAtTime(He(-20),n.currentTime,.12),Hi(t,i)}function y1(t,e={}){let n=t.ctx,i=mt(t,e,{bus:"fx",db:-20.5}),r=i.t,s=r+5,o=Ie(n),a=vt(n,.2),l=Ie(n,60);a.connect(l);let c=[Rt(n,"bandpass",400,6),Rt(n,"bandpass",800,6)];for(let f of c)l.connect(f.frequency),f.connect(o);let u=Ie(n);wn(u.gain,r,1,.9,r+3.6,s),o.connect(u);for(let f of[0,.7]){let h=vt(n,90+f),d=vt(n,90+f,"sawtooth"),g=Ie(n,.18),x=Ie(n);for(let m of[h,d])An(m.frequency,90+f,140+f,r,2),m.frequency.linearRampToValueAtTime(70+f,s);x.gain.value=.9,h.connect(g).connect(o),d.connect(x);for(let m of c)x.connect(m);h.start(r),d.start(r),Mt(i,h,d)}if(a.start(r),Mt(i,a),u.connect(i.out),t.irLong){let f=Nu(n,t.irLong),h=Ie(n);h.gain.value=.6,u.connect(f.input),f.output.connect(h).connect(i.out)}return ct(t,i,s+6.1)}function _1(t,e={}){let n=t.ctx,i=mt(t,e,{bus:"fx",db:-24}),r=i.t,[s,o]=ir(i,n,880,r);return ir(i,n,6,r,s.detune)[1].gain.value=40,sn(s.frequency,880,440,r,1.2),wn(o.gain,r,1,.02,r+1,r+1.2),ct(t,i,r+1.21)}function b1(t,e={}){let n=t.ctx,i=mt(t,e,{bus:"fx",db:-14,wet:.25}),r=i.t;for(let l=0;l<5;l++)Si(n,r+.16*l,{type:"bandpass",f:6e3,Q:1.5,a:2e-4,d:.0018,peak:2},i);let s=r+.8,o=Ie(n,.26);o.connect(i.out);let a=s;return[392,493.88,587.33].forEach((l,c)=>{let u=Mi(n,l,1.4,2.4,s+c*.012,3,1,.006);u.out.connect(o),Mt(i,u),a=u.end}),ct(t,i,a)}function M1(t,e={}){let n=t.ctx,i=mt(t,e,{bus:"fx",db:-16,wet:.2}),r=i.t,s=vt(n,392),o=vt(n,392*1.4),a=Ie(n),l=Ie(n);sn(s.frequency,392,784,r,2.4),sn(o.frequency,392*1.4,784*1.4,r,2.4),An(a.gain,392*1.4*1.6,784*1.4*.3,r,2.4),o.connect(a).connect(s.frequency),An(l.gain,0,.8,r,.01),l.gain.linearRampToValueAtTime(.55,r+2.3),l.gain.linearRampToValueAtTime(0,r+2.42),s.connect(l).connect(i.out);let c=r+2.4,u=Nn(n,2400,c,i.out,.45,.004,.012,0);return sn(u.frequency,2400,3e3,c,.05),s.start(r),o.start(r),Mt(i,s,o,u),ct(t,i,c+.12)}function S1(t,e={}){let n=t.ctx,i=Gi(t,"room",!1,300),r=vt(n,.07),s=Ie(n,.3),o=Ie(n,.7);r.connect(s).connect(o.gain);for(let a of[196,246.94,293.66,440]){let l=vt(n,a),c=Ie(n);c.gain.value=.25,l.connect(c).connect(o),l.start(),i.srcs.push(l)}return o.connect(i.out),r.start(),i.srcs.push(r,...Vl(n,i.out)),i.out.gain.setTargetAtTime(He(-40)*.66,n.currentTime,.6),i.set=()=>{},Hi(t,i)}function w1(t,e={}){return Lu(t,e,{bus:"fx",db:-14},60,30,1.4,.08,1.1,1.4)}function A1(t,e={}){return Lu(t,e,{bus:"ui",db:-30},2400,3200,.04,.003,.03,.04)}var Ou=(t,e,n)=>Math.max(e,Math.min(n,t));function T1(t,e={}){let n=t.ctx,i=Gi(t,"ui",!1),r=vt(n,220),s=n.currentTime;return An(r.frequency,220,440,s,1.2),r.connect(i.out),r.start(s),i.srcs.push(r),An(i.out.gain,0,He(-22),s,.02),i.set=()=>{},Hi(t,i)}function E1(t,e={}){let n=t.ctx,i=mt(t,e,{bus:"room",db:-28,wet:.15}),r=i.t,[s,o]=ir(i,n,660,r);return sn(s.frequency,660,440,r,2.5),wn(o.gain,r,.65,.05,r+2.2,r+2.5),ir(i,n,9,r,o.gain)[1].gain.value=.35,ct(t,i,r+2.51)}function R1(t,e={}){let n=t.ctx,i=mt(t,e,{bus:"room",db:-24,wet:.2}),r=i.t;for(let s=0;s<3;s++)Mt(i,Nn(n,1318.51,r+.09*s,i.out,1,.002,.012,.09));return ct(t,i,r+.27)}function C1(t,e={}){let n=t.ctx,i=Gi(t,"room",!0),r=vt(n,440),s=vt(n,880),o=Ie(n,.16),a=vt(n,5.2),l=Ie(n,6);a.connect(l),l.connect(r.detune),l.connect(s.detune),r.connect(i.out),s.connect(o).connect(i.out),r.start(),s.start(),a.start(),i.srcs.push(r,s,a);let c=!0;return i.set=u=>{if(!i.alive||!u)return;let f=Ou(+u.hz||440,40,4e3),h=n.currentTime;c?(r.frequency.setValueAtTime(f,h),s.frequency.setValueAtTime(2*f,h),c=!1):(r.frequency.setTargetAtTime(f,h,.02),s.frequency.setTargetAtTime(2*f,h,.02)),i.pn&&i.pn.pan&&u.pan!=null&&i.pn.pan.setTargetAtTime(Ou(+u.pan||0,-1,1),h,.03)},i.set(e),i.out.gain.setTargetAtTime(He(-24)/1.16*i.k,n.currentTime,.012),Hi(t,i)}function P1(t,e={}){let n=t.ctx,i=Gi(t,"room",!1),r=ti(n,"white"),s=Rt(n,"bandpass",3200,.6),o=Ie(n,1.05);return r.connect(s).connect(o).connect(i.out),r.start(),i.srcs.push(r),i.set=a=>{i.alive&&a&&a.amount!=null&&i.out.gain.setTargetAtTime(He(-30)*Ou(+a.amount,0,1),n.currentTime,.04)},i.set({amount:e.amount!=null?e.amount:0}),Hi(t,i)}function I1(t,e={}){let n=t.ctx,i=Gi(t,"room",!1),r=vt(n,1403);return r.connect(i.out),r.start(),i.srcs.push(r),i.set=s=>{if(!i.alive||!s||s.amount==null)return;let o=Ou(+s.amount,0,1),a=n.currentTime;i.out.gain.setTargetAtTime(He(-30)*o,a,.06),r.frequency.setTargetAtTime(1403*(.985+.015*o),a,.06)},i.set({amount:e.amount!=null?e.amount:0}),Hi(t,i)}function L1(t,e={}){let n=mt(t,e,{bus:"room",db:-16,wet:.2}),i=n.t;return Gl(n,t.ctx,+e.lo||196,+e.hi||293.66,14,.6,i,n.out,.5,.03,.9,1.7),ct(t,n,i+1.71)}function D1(t,e={}){let n=t.ctx,i=+e.hz||440,r=mt(t,e,{bus:"room",db:-18}),s=r.t;return Mt(r,...Hl(n,i,s,r.out,[[1,1.4,1/1.3],[2.76,.5,.3/1.3],[5.4,.2,.12/1.3]])),ct(t,r,s+1.46)}function N1(t,e={}){let n=t.ctx,i=Gi(t,"room",!1);return i.srcs.push(...Vl(n,i.out)),i.set=r=>{i.alive&&r&&r.amount!=null&&i.out.gain.setTargetAtTime(He(-40)*Ou(+r.amount,0,1),n.currentTime,.3)},i.set({amount:e.amount!=null?e.amount:1}),Hi(t,i)}var sx=Object.freeze({signature:BM,ratchet:zM,owner:VM,hoverTick:HM,select:WM,tick:$M,stringPluck:XM,lockedThud:YM,chisel:qM,stratumNote:jM,memberNote:ZM,workshopNode:KM,wordBell:JM,arrivalLock:QM,flinch:e1,whoosh:n1,subDrop:i1,strutTick:r1,recallThud:s1,liftRumble:o1,irisWhoosh:a1,bootSwell:l1,snapAir:c1,shard:u1,resRise:h1,resSub:f1,chunk:d1,resChord:m1,hiss:x1,shepard:v1,whale:y1,dizzy:_1,chord:g1,capsule:b1,companion:M1,zenithPad:S1,invertRoll:w1,droneDodge:A1,probeHold:T1,probeFlight:E1,probeReturn:R1,skyVoice:C1,dialStatic:P1,dialCarrier:I1,beatLock:L1,vaultNote:D1,wind:N1,latch:bM,reverseTail:ex,popClick:Dp,foldNoise:MM,digiTail:SM,subRise:wM,farEcho:AM,farBoom:TM,debrisKnock:EM,bondThread:RM,sborCall:CM,sborAnswer:PM,guestBurn:IM,lostChirp:LM,lostHide:DM,rescue:NM,dust:OM,subPulse:FM}),O1=new Set(["whoosh","liftRumble","resRise","resSub","shepard","zenithPad","probeHold","skyVoice","dialStatic","dialCarrier","wind","dust","subPulse"]);var F1=t=>140*Math.pow(900/140,(t+1090)/2180),U1=[98,147,196],k1={drift:.03};function ox(t){let e=t.ctx,n=null,i=0,r=0,s=0,o=-1,a=.03,l=-1,c=null,u=0;fn.observe&&fn.observe(_=>{_.speed>200&&(s=e.currentTime+.6)});let f=()=>e.currentTime,h=(_,M,v)=>_.setTargetAtTime(M,e.currentTime,v);function d(){let _=T=>Ie(e,T),M={out:_(0),duck:_(He(p.duckDb)),narrow:_(1-p.narrowU),srcs:[]};M.duck.connect(M.out),M.narrow.connect(M.duck),M.out.connect(t.bus.bed),M.beat=[vt(e,49),vt(e,49.3)];let v=_(He(-34));for(let T of M.beat)T.connect(v);v.connect(M.narrow);let S=ti(e,"brown");M.lp=Rt(e,"lowpass",p.lpHz,.707),S.connect(M.lp).connect(_(He(-42))).connect(M.narrow),M.wind=_(p.room==="SIGNAL"?1:0),M.wind.connect(M.narrow);let w=Vl(e,M.wind,He(-40));M.root=vt(e,p.root),M.fifth=vt(e,p.root*1.5);let E=Rt(e,"lowpass",400);M.drone=_(1),M.root.connect(_(He(-38))).connect(E),M.fifth.connect(_(He(-44))).connect(E),E.connect(M.drone).connect(M.narrow),M.rank=U1.map((T,R)=>{let F=vt(e,T),O=_(p.rank>=R+1?He(-42):0);return F.connect(O).connect(M.narrow),M.srcs.push(F),O}),M.rankOsc=M.srcs.slice(),M.tone=vt(e,220),M.toneG=_(p.narrowU*He(-38)),M.tone.connect(M.toneG).connect(M.duck),M.dustLp=Rt(e,"lowpass",p.night?7e3:2e4,.707),M.dustG=_(1-p.narrowU),M.dustLp.connect(M.dustG).connect(M.out),M.dust=ix(t,{level01:x(),drift:p.night?.02:.03},!1,M.dustLp),M.srcs.push(...M.beat,S,M.root,M.fifth,M.tone);let y=f();for(let T of M.srcs)T.loop?T.start(y,Math.random()*1.5):T.start(y);return M.srcs.push(...w),M}let g=()=>p.night?.75:1,x=()=>p.room==="INSIGNIA"?0:1/9;function m(_=.03){if(!n)return;let M=g();h(n.beat[0].frequency,49*M,_),h(n.beat[1].frequency,49.3*M,_),h(n.root.frequency,p.root*M,_),h(n.fifth.frequency,p.root*1.5*M,_);for(let v=0;v<3;v++)h(n.rankOsc[v].frequency,U1[v]*M,_)}let p={room:"CORE",root:146.83,night:!1,rank:0,duckDb:0,narrowU:0,lpHz:F1(0),on:!1,start(){n||(n=d(),p.on=!0,m(.001),h(n.out.gain,He(p.night?-3:0),.5))},stop(){if(!n)return;let _=n,M=f();n=null,p.on=!1,_.out.gain.cancelScheduledValues(M),h(_.out.gain,0,.08);for(let v of _.srcs)try{v.stop(M+.6)}catch{}try{_.dust.stop(400)}catch{}setTimeout(()=>{try{_.out.disconnect()}catch{}},800)},setRoom(_){let M=ce[_];M&&(p.room=_,p.root=M.root,p.lpHz=F1(M.alt),n&&(h(n.lp.frequency,p.lpHz,.3),h(n.wind.gain,_==="SIGNAL"?1:0,.5),(!c||c.level01==null)&&n.dust.set({level01:x()}),m(.25)))},setRootGlide(_,M,v){let S=+_||p.root,w=+M||S,E=Math.max(0,Math.min(1,+v||0));if(p.root=S*Math.pow(w/S,E),n){let y=g();h(n.root.frequency,p.root*y,.02),h(n.fifth.frequency,p.root*1.5*y,.02)}},setNight(_){p.night=!!_,n&&(m(.6),h(n.out.gain,He(p.night?-3:0),.4),h(n.dustLp.frequency,p.night?7e3:2e4,.4))},setRank(_){if(p.rank=Math.max(0,Math.min(3,_|0)),n)for(let M=0;M<3;M++)h(n.rank[M].gain,p.rank>=M+1?He(-42):0,.5)},duck(_,M){if(p.duckDb=Math.min(0,+_||0),!n)return;let v=n.duck.gain,S=f(),w=Math.max(0,+M||0)/1e3,E=He(p.duckDb);typeof v.cancelAndHoldAtTime=="function"?v.cancelAndHoldAtTime(S):(v.cancelScheduledValues(S),v.setValueAtTime(v.value,S)),w>0?v.exponentialRampToValueAtTime(Math.max(1e-6,E),S+w):v.setValueAtTime(E,S)},narrow(_){if(p.narrowU=Math.max(0,Math.min(1,+_||0)),!n)return;let M=f();h(n.narrow.gain,1-p.narrowU,.03),h(n.dustG.gain,1-p.narrowU,.03),h(n.toneG.gain,p.narrowU*He(-38),.03)},dust(_){c=_||null,u=_&&_.ms>0?f()+_.ms/1e3:1/0,l=-1,n&&n.dust.set({level01:_&&_.level01!=null?_.level01:x(),drift:_&&_.drift!=null?_.drift:a})},update(_){if(!n||(c&&f()>=u&&p.dust(null),i+=_,r+=_,i<1/30))return;i=0;let M=f();h(n.drone.gain,He(2*(2*Ln.value-1)),.06),h(n.dustG.gain,(1-p.narrowU)*(M<s?He(-3):1),.05);let v=p.night?.02:.03,S=o>=0?M-o:-1;a=S>=2.8&&S<=6.8?v+.03*Math.sin(Math.PI*(S-2.8)/4):v,(!c||c.drift==null)&&Math.abs(a-l)>.0015&&(l=k1.drift=a,n.dust.set(k1)),r>.5&&!(t.chain&&t.chain.closed&&t.chain.closed())&&(r=0,n.dust.poll())}};return _e.on("boot:ignite",()=>{o=f()}),p}var _a=["dustA","bellSam","bellVin","rev.sam","rev.vin","rev.lock","rev.thud","digiTail","irTight","dustB"];function V1(t,e,n,i){let r=new OfflineAudioContext(e,Math.ceil(n*t),t);return i(r),r.startRendering()}function lx(t,e){let n=0;for(let r=0;r<t.numberOfChannels;r++){let s=t.getChannelData(r);for(let o=0;o<s.length;o++){let a=Math.abs(s[o]);a>n&&(n=a)}}let i=n>0?Math.pow(10,e/20)/n:1;for(let r=0;r<t.numberOfChannels;r++){let s=t.getChannelData(r);for(let o=0;o<s.length;o++)s[o]*=i}return t}function B1(t,e){let n=t.sampleRate,i=Math.ceil(e*n),r=t.createBuffer(2,i,n),s=r.getChannelData(0),o=r.getChannelData(1),a=-Math.log(1-Math.random())/140;for(;a<e-.004;){let l=Math.max(4,Math.floor((4e-4+Math.random()*.001)*n)),c=Math.floor(a*n),u=2*Math.PI*(4500+Math.random()*6500)/n,f=Math.sin(u)/4,h=1+f,d=f/h,g=-2*Math.cos(u)/h,x=(1-f)/h,m=Math.pow(10,-24*Math.random()/20),p=((Math.random()*2-1)*.9+1)/2,_=m*Math.cos(p*Math.PI/2),M=m*Math.sin(p*Math.PI/2),v=0,S=0,w=0,E=0;for(let y=0,T=l+Math.floor(.004*n);y<T&&c+y<i;y++){let R=y<l?(Math.random()*2-1)*(.5-.5*Math.cos(2*Math.PI*y/(l-1))):0,F=d*R-d*S-g*w-x*E;S=v,v=R,E=w,w=F,s[c+y]+=F*_,o[c+y]+=F*M}a+=-Math.log(1-Math.random())/140}return lx(r,-6)}var ax=(t,e)=>Mi(t,e,1.4,3,0,2.4,1.2,.008).out;function z1(t,e){return V1(t,1,1.6,n=>ax(n,e).connect(n.destination)).then(n=>lx(n,-6))}var XP={sam:t=>ax(t,392),vin:t=>ax(t,587.33),lock:t=>{let e=Ie(t);wn(e.gain,0,.5,.006,.36,.48);for(let n of[293.66,440.49]){let i=vt(t,n);n>300&&sn(i.frequency,n+5,n,0,.24),i.connect(e),i.start(0),i.stop(.5)}return e},thud:t=>{let e=Ie(t);return Nn(t,42,0,e,1,.004,.3/6.91,.32),e}};function YP(t,e,n){return V1(e,2,.7,i=>{let r=i.createConvolver();r.normalize=!1;let s=t.wet&&t.wet.convA&&t.wet.convA.buffer&&t.wet.convA.buffer.sampleRate===e?t.wet.convA.buffer:null;r.buffer=s||Zg(i,3.4);let o=Ie(i,Kg(r.buffer));XP[n](i).connect(r).connect(o).connect(i.destination)}).then(i=>{let r=i.length,s=Math.floor(r*.4);for(let o=0;o<i.numberOfChannels;o++){let a=i.getChannelData(o);a.reverse();for(let l=0;l<s;l++){let c=l/s;a[l]*=c*c}}return lx(i,-12)})}function qP(t){let e=t.sampleRate,n=Math.round(.04*e),i=n*6,r=t.createBuffer(1,i,e),s=r.getChannelData(0),o=[1,2,4,8,16,32],a=[4096,64,16,8,4,3],l=Math.round(.002*e);for(let c=0;c<6;c++){let u=o[c],f=a[c]/2,h=0;for(let d=0;d<n;d++){let g=c*n+d;if(d%u===0){let x=g/e,m=Math.min(1,d/l,(n-1-d)/l);h=.45*(Math.sin(2*Math.PI*196*x)+Math.sin(2*Math.PI*293.66*x))*Math.max(0,m)}s[g]=Math.round(h*f)/f}}return r}function jP(t){return Zg(t,.35,{tau:.07,lp:5e3})}function ZP(t,e){let n=t.ctx,i=n.sampleRate;return e==="dustA"?B1(n,1.73):e==="dustB"?B1(n,2.31):e==="bellSam"?z1(i,392):e==="bellVin"?z1(i,587.33):e==="digiTail"?qP(n):e==="irTight"?jP(n):YP(t,i,e.slice(4))}function Fp(t,e){if(!t||!t.ctx)return Promise.resolve();t.buf||(t.buf={});let n=t._fl||(t._fl={});e+""=="dustA"&&_e.on("boot:done",()=>{let s=()=>Fp(t,_a);typeof requestIdleCallback=="function"?requestIdleCallback(s,{timeout:300}):setTimeout(s,200)});let i=s=>_a.indexOf(s)>=0&&!t.buf[s]&&(t.tier!=="T1"||s==="dustA"),r=(Array.isArray(e)?e:[]).filter(i);return r.some(s=>s!=="dustA")&&(r=_a.filter(s=>(s!=="dustA"||r.indexOf(s)>=0)&&i(s))),Promise.all(r.map(s=>n[s]||(n[s]=Promise.resolve().then(()=>t.buf[s]?null:ZP(t,s)).then(o=>{o&&(t.buf[s]=o)}).catch(()=>{})))).then(()=>{})}var KP=Math.log(2e4/260),G1=7.5;function H1(t,e,n){let i=t.ctx,r=D=>Ie(i,D),s=()=>i.currentTime,o={w:1,gateAt:-1,hitAt:-1,shadowDb:t.coarse?-12:-26,muffle:2e4},a=Rt(i,"lowpass",120,.707),l=Rt(i,"lowpass",120,.707),c=i.createWaveShaper(),u=new Float32Array(4097);for(let D=0;D<u.length;D++)u[D]=Math.abs(D/2048-1);c.curve=u,c.oversample="2x";let f=Rt(i,"highpass",90,.707),h=Rt(i,"bandpass",200,.9),d=r(He(o.shadowDb+G1));e.connect(a).connect(l).connect(c).connect(f).connect(h).connect(d);let g=Rt(i,"lowshelf",110),x=Rt(i,"lowpass",2e4,.707),m=r(1);e.connect(g),d.connect(g),g.connect(x).connect(m);let p=i.createDelay(2);p.delayTime.value=0,p.channelCount=2,p.channelCountMode="explicit",p.channelInterpretation="speakers",m.connect(p);let _=i.createChannelSplitter(2),M=i.createChannelMerger(2),v=r(1),S=r(0),w=r(0),E=r(1),y=i.createDelay(.05);p.connect(_),_.connect(v,0),_.connect(S,1),_.connect(w,0),_.connect(E,1),v.connect(M,0,0),S.connect(M,0,0),w.connect(y),E.connect(y),y.connect(M,0,1);let T=r(1);M.connect(T).connect(n);let R=[a,l,c,f,h,d,g,x,m,p,_,v,S,w,E,y,M,T];function F(D,H,G){typeof D.cancelAndHoldAtTime=="function"?D.cancelAndHoldAtTime(H):(D.cancelScheduledValues(H),D.setValueAtTime(G,H))}let O=D=>Math.max(s(),D&&isFinite(D.at)&&D.at!==null?+D.at:0),z=(D,H,G)=>{for(let[$,J]of D)F($,H,$.value),G>0?$.linearRampToValueAtTime(J,H+G):$.setValueAtTime(J,H)};function L(D,H=0,G={}){let $=O(G),J=Math.max(0,+H||0)/1e3,ve=Math.max(40,Math.min(2e4,+D||2e4)),ye=Math.max(0,Math.min(1,Math.log(2e4/ve)/KP)),rt=G&&G.shelfDb!=null?G.shelfDb:7,ze=.707+(1.1-.707)*ye,nt=rt*ye,Z=He(-3*ye);F(x.frequency,$,o.muffle),J>0?x.frequency.exponentialRampToValueAtTime(ve,$+J):x.frequency.setValueAtTime(ve,$),z([[x.Q,ze],[g.gain,nt],[m.gain,Z]],$,J),o.muffle=ve}function V(D,H=0,G={}){let $=O(G),J=Math.max(0,+H||0)/1e3,ve=Math.max(0,Math.min(2,+D)),ye=(1+ve)/2,rt=(1-ve)/2,ze=t.coarse?0:Math.max(0,Math.min(14,+(G&&G.haasMs)||0))/1e3;z([[v.gain,ye],[E.gain,ye],[w.gain,rt],[S.gain,rt],[y.delayTime,ze]],$,J),o.w=ve}return{fx:{gate(D=400,H={}){let G=O(H),$=G+Math.max(.004,(+D||400)/1e3),J=T.gain,ve=Math.max(s(),G-.006);J.cancelScheduledValues(ve),An(J,1,0,ve,G-ve),J.setValueAtTime(0,$-.002),J.linearRampToValueAtTime(1,$);let ye=t.wet;if(ye&&ye.inA){let rt=ye.live==="B"?"B":"A",ze=rt==="A"?"B":"A",nt=ye["in"+rt].gain,Z=ye["ret"+rt].gain,te=ye["in"+ze].gain,Te=ye["ret"+ze].gain;for(let je of[nt,Z])F(je,ve,1),je.linearRampToValueAtTime(0,G);for(let je of[te,Te])je.cancelScheduledValues(Math.max(s(),G-.007)),je.setValueAtTime(0,Math.max(s(),G-.007)),je.setValueAtTime(1,G);ye.live=ze}return o.gateAt=G,o.hitAt=$,{hitAt:$}},advanceHit(D){let H=s();if(!(o.hitAt>H))return null;let G=Math.min(o.hitAt,Math.max(+D||0,H+.03,o.gateAt+.004)),$=T.gain,J=Math.max(H,o.gateAt);return $.cancelScheduledValues(J+1e-4),H>=o.gateAt&&$.setValueAtTime(0,H),$.setValueAtTime(0,Math.max(J,G-.002)),$.linearRampToValueAtTime(1,G),o.hitAt=G,G},muffle:L,pop(D=700,H={}){let G=O(H),$=G+Math.max(0,+D||0)/1e3;L(2e4,D,{at:G});try{Dp(t,{when:$})}catch{}return $},width:V,tape(D=900,H={}){let G=O(H),$=Math.max(.05,(+D||900)/1e3),J=new Float32Array(128);for(let ve=0;ve<128;ve++){let ye=ve*$/127;J[ve]=ye*ye/(2*$)}p.delayTime.cancelScheduledValues(G),p.delayTime.setValueCurveAtTime(J,G,$)},tapeReset(D={}){let H=O(D);p.delayTime.cancelScheduledValues(H),p.delayTime.setValueAtTime(0,H)},shadow(D){o.shadowDb=+D,d.gain.setTargetAtTime(He(o.shadowDb+G1),s(),.02)},snapshot(){let D=t.tier==="T1"?["dustA"]:_a,H=!!t.buf;if(H){for(let G of D)if(!t.buf[G]){H=!1;break}}return{muffleHz:Math.round(x.frequency.value),width:o.w,buffersReady:H}}},postGate:T,closed(D=s(),H=0){return D>=o.gateAt-.006-H&&D<=o.hitAt},dispose(){try{e.disconnect(a),e.disconnect(g)}catch{}for(let D of R)try{D.disconnect()}catch{}}}}var JP=Math.pow(10,-6/20),cx=Object.freeze({set(){},stop(){},alive:!1}),ba=[],ux=null,it=null,Sa=null,Aa=null,Br=null,$l=null,Fu=null,Vs=!1,Uu=0,Y1=!1,W1=!1,wa=new Float32Array(512),Ma=[],Tn={ctx:null,bus:{ui:null,fx:null,room:null,bed:null},transpose:0,night:!1,hz:Lp,get irLong(){return!ux&&it&&(ux=q1(6)),ux},send(t){let e=it.createGain();return e.gain.value=t,e.connect($l),e},wet:null,buf:{},chain:null,coarse:!1,tier:"T2",track(t,e){if(!t)return t;let n=it?it.currentTime:0;for(let i=ba.length-1;i>=0;i--)(!ba[i].v.alive||ba[i].end<n)&&ba.splice(i,1);for(ba.push({v:t,end:n+(e||1)});ba.length>24;){let i=ba.shift();try{i.v.stop(8)}catch{}}return t}};function q1(t){let e=it.sampleRate,n=Math.floor(e*t),i=it.createBuffer(2,n,e),r=Math.exp(-2*Math.PI*120/e),s=Math.exp(-6.9/(t*e));for(let o=0;o<2;o++){let a=i.getChannelData(o),l=0,c=0,u=1;for(let f=0;f<n;f++){let h=(Math.random()*2-1)*u;u*=s,c=r*(c+h-l),l=h,a[f]=c}}return i}function kp(t,e,n){let i=it.currentTime;t.cancelScheduledValues(i),t.setValueAtTime(t.value,i),t.linearRampToValueAtTime(e,i+n/1e3)}function $1(){it&&(kp(Sa.gain,0,400),clearTimeout(Uu),Uu=setTimeout(()=>{Uu=0,it&&(Vs||!$e.on)&&it.suspend().catch(()=>{})},420))}function hx(){!it||!$e.on||Vs||(clearTimeout(Uu),Uu=0,it.resume().catch(()=>{}),kp(Sa.gain,JP,400))}function QP(){Tn.ctx=it,Br=it.createDynamicsCompressor(),Br.threshold.value=-18,Br.ratio.value=3,Br.attack.value=.003,Br.release.value=.25,Sa=it.createGain(),Sa.gain.value=0,Aa=it.createAnalyser(),Aa.fftSize=512,Sa.connect(Aa).connect(it.destination),$l=it.createGain();let t=q1(3.4),e=it.createGain(),n=it.createConvolver(),i=it.createGain(),r=it.createGain(),s=it.createConvolver(),o=it.createGain();e.gain.value=1,i.gain.value=1,r.gain.value=0,o.gain.value=0,n.buffer=t,s.buffer=t,$l.connect(e).connect(n).connect(i).connect(Br),$l.connect(r).connect(s).connect(o).connect(Br),Tn.wet={bus:$l,inA:e,retA:i,convA:n,inB:r,retB:o,convB:s,live:"A"},Tn.buf={},Tn.coarse=!!Gt.coarse,Tn.tier=ee.tier,Fu={};for(let a of["ui","fx","room"]){let l=it.createGain();l.connect(Br);let c=it.createGain();c.gain.value=a==="ui"?.11:.22,l.connect(c).connect($l),Tn.bus[a]=l,Fu[a]=c}try{Tn.chain=H1(Tn,Br,Sa)}catch(a){lt("audio:chain",a),Br.connect(Sa),Tn.chain=null}Tn.bus.bed=it.createGain(),Tn.bus.bed.connect(Br)}var $e={ctx:null,unlocked:!1,on:!0,bed:null,init(t){return $e.on=!(Y.data&&Y.data.sound==="off"),ee.soundOn=$e.on,_e.on("visibility",e=>{Vs=!!e.hidden,Vs?$1():hx()}),_e.on("room:arrive",e=>$e.setRoom(e.room)),_e.on("boot:done",()=>{Y1=!0,X1()}),$e},unlock(){if($e.unlocked)return;let t=window.AudioContext||window.webkitAudioContext;if(t)try{it=new t;try{navigator.audioSession&&(navigator.audioSession.type="playback")}catch{}QP(),$e.ctx=it,$e.unlocked=!0;try{$e.bed=ox(Tn)}catch(e){lt("audio:bed",e)}$e.setRoom(ee.room||"CORE"),$e.setNight(ee.night),$e.on?($e.bed&&$e.bed.start(),hx()):it.suspend().catch(()=>{}),pe.add(e=>{$e.bed&&$e.on&&$e.bed.update(e)},zt.FX);try{Fp(Tn,["dustA"]).catch(e=>lt("audio:prerender",e))}catch(e){lt("audio:prerender",e)}X1(),_e.emit("audio:unlocked",{})}catch(e){lt("audio:unlock","audio unavailable",e)}},resume(){it&&$e.on&&!Vs&&it.state!=="running"&&it.resume().catch(()=>{})},isOn(){return $e.on},setOn(t){let e=!!t;e!==$e.on&&($e.on=e,ee.soundOn=e,Y.set("sound",e?"on":"off"),it&&(e?($e.bed&&$e.bed.start(),hx()):($1(),$e.bed&&setTimeout(()=>{!$e.on&&$e.bed&&$e.bed.stop()},400))),_e.emit("sound:change",{on:e}))},toggle(){$e.setOn(!$e.on)},play(t,e={}){if(!it||!$e.on||Vs)return null;let n=sx[t];if(!n)return null;e&&e.when!=null&&(e.when=Math.max(e.when,it.currentTime));try{return n(Tn,e||{})||null}catch(i){return lt(`audio:${t}`,"recipe failed",t,i),null}},start(t,e={}){if(!it||!$e.on||Vs||!O1.has(t))return cx;e&&e.when!=null&&(e.when=Math.max(e.when,it.currentTime));try{return sx[t](Tn,e||{})||cx}catch(n){return lt(`audio:${t}`,"recipe failed",t,n),cx}},setRoom(t){let e=ce[t];!e||!it||(Fu&&(kp(Fu.room.gain,e.wet,300),kp(Fu.fx.gain,e.wet,300)),$e.bed&&($e.bed.setRoom(t),$e.bed.duck(t==="INSIGNIA"?-60:0,960)))},setRootU(t,e,n){if(!$e.bed)return;let i=ce[t],r=ce[e];i&&r&&$e.bed.setRootGlide(i.root,r.root,n)},setNight(t){Tn.night=!!t,$e.bed&&$e.bed.setNight(!!t)},setRank(t){$e.bed&&$e.bed.setRank(t|0)},setInverted(t){Tn.transpose=t?-5:0},levels(t){if(t){if(!Aa||!$e.on||Vs){t.fill(0);return}Aa.getFloatTimeDomainData(wa);for(let e=0,n=0;e<8;e++){let i=0;for(let r=n+64;n<r;n++){let s=Math.abs(wa[n]);s>i&&(i=s)}t[e]=i>1e-6?Math.max(0,Math.min(1,(20*Math.log10(i)+66)/60)):0}}},now(){return it?it.currentTime:0}};function X1(){if(!Y1||!it||W1)return;W1=!0;let t=_a.slice(1),e=i=>typeof requestIdleCallback=="function"?requestIdleCallback(i,{timeout:300}):setTimeout(i,200),n=()=>{let i=t.shift();if(i)try{Fp(Tn,[i]).catch(r=>lt("audio:prerender",r)).then(()=>e(n))}catch(r){lt("audio:prerender",r),e(n)}};e(n)}var j1=()=>!!(it&&$e.unlocked&&$e.on&&!Vs),Z1=t=>Tn.chain&&Tn.chain.fx&&typeof Tn.chain.fx[t]=="function"?Tn.chain.fx[t]:null;function fx(){if(!it)return 0;let t=it.outputLatency!=null?it.outputLatency:it.baseLatency!=null?it.baseLatency:0;return Math.min(.25,Math.max(0,+t||0))}function K1(){try{let t=it.getOutputTimestamp?it.getOutputTimestamp():null;return t&&t.performanceTime>0?t:null}catch{return null}}function Up(t){if(!it)return NaN;let e=K1();return e?e.performanceTime+(t-e.contextTime)*1e3:performance.now()+(t-it.currentTime)*1e3+1e3*fx()}function eI(t){if(!it)return NaN;let e=K1();return e?e.contextTime+(t-e.performanceTime)/1e3:it.currentTime+(t-performance.now())/1e3-fx()}function tI(){if(!Aa)return-120;try{Aa.getFloatTimeDomainData(wa);let t=0;for(let n=0;n<wa.length;n++)t+=wa[n]*wa[n];let e=Math.sqrt(t/wa.length);return e>1e-6?Math.max(-120,20*Math.log10(e)):-120}catch{return-120}}function To(t,e,n){if(!j1())return n;let i=Z1(t);if(!i)return n;try{let r=i.apply(Tn.chain.fx,e);return r===void 0?n:r}catch(r){return lt(`audio:fx:${t}`,r),n}}$e.fx={latency:fx,toPerf:Up,ctxTimeFor:eI,ready:j1,gate(t=400,e={}){let n=e&&e.at!=null?e.at:it?it.currentTime:0,i=To("gate",[t,{...e||{},at:n}],null);return!i||i.hitAt==null?{hitAt:null}:(Ma.push({at:Up(n),hitAt:Up(i.hitAt)}),Ma.length>16&&Ma.shift(),i)},advanceHit(t){let e=To("advanceHit",[t],null);return e!=null&&Ma.length&&(Ma[Ma.length-1].hitAt=Up(e)),e??null},muffle(t,e=0,n={}){To("muffle",[t,e,n||{}],void 0)},pop(t=700,e={}){let n=To("pop",[t,e||{}],null);return n??null},width(t,e,n={}){To("width",[t,e,n||{}],void 0)},tape(t=900,e={}){To("tape",[t,e||{}],void 0)},tapeReset(t={}){To("tapeReset",[t||{}],void 0)},shadow(t){To("shadow",[t],void 0)},snapshot(){let t=null,e=Z1("snapshot");if(e)try{t=e.call(Tn.chain.fx)}catch(n){lt("audio:fx:snapshot",n)}return t=t||{},{gateLog:Ma.map(n=>({at:n.at,hitAt:n.hitAt})),muffleHz:t.muffleHz!=null?t.muffleHz:2e4,width:t.width!=null?t.width:1,buffersReady:!!t.buffersReady,rmsDb:tI()}}};var zr=Object.freeze({tap:8,tick:6,stratum:7,lock:14,step:20,activation:[8,40,8,40,14,90,30],shard:[8,40,8,40,60],locked:[10,30,10]}),nI=6,dx=0;function J1(t,e){let n=document.getElementById("fx");if(!n||dx>=nI)return;let i=document.createElement("div");i.className="ripple",i.style.transform=`translate3d(${t}px, ${e}px, 0)`,Gt.reducedMotion&&i.classList.add("ripple--still"),dx++;let r=()=>{dx--,i.remove()};i.addEventListener("animationend",r,{once:!0}),setTimeout(()=>{i.isConnected&&r()},600),n.appendChild(i)}function Vr(t){try{if(typeof navigator>"u"||typeof navigator.vibrate!="function")return;let e=navigator.userActivation;if(e&&!e.hasBeenActive)return;navigator.vibrate(t)}catch{}}var Wi=Object.freeze({TAP_MS:350,HOLD_MS:350,LONG_MS:800,SLOP_PX:8,SWIPE_PX:40,SWIPE_V:.3}),iI=60,Gr=[],Ta=null,Yl=[],ku=[],ql=null,xe={type:"down",x:0,y:0,dx:0,dy:0,tx:0,ty:0,vx:0,vy:0,speed:0,t:0,id:0,pointerType:"mouse",button:0,scale:1,dScale:1,deltaY:0,dir:null,afterHold:!1,shift:!1,alt:!1},Gs={x:0,y:0,vx:0,vy:0,speed:0,type:"mouse",buttons:0,t:0},Ue={active:!1,id:-1,type:"mouse",x0:0,y0:0,t0:0,lastX:0,lastY:0,lastT:0,dragging:!1,holdFired:!1,longFired:!1,pinch:!1,moved:0,button:0},Bu=0,zu=0,br=new Map,iS=0,px=0,Gu=()=>typeof performance<"u"?performance.now():Date.now(),rS=t=>{let e=t&&t.timeStamp,n=Gu();return e>0&&e<=n+1&&e>n-5e3?e:n},Xl=null;function kn(t,e){if(xe.type=t,e&&(xe.shift=!!e.shiftKey,xe.alt=!!e.altKey),t!=="swipe"&&(xe.dir=null),Ta){try{Ta.onGesture(xe)}catch(i){lt(`input:${Ta.name}`,"captured consumer threw",i)}return}let n=t!=="down"&&t!=="hover"&&t!=="leave"&&t!=="wheel";if(t==="down")Xl=null;else if(n&&Xl){if(Gr.indexOf(Xl)<0)return;try{Xl.onGesture(xe)}catch(i){lt(`input:${Xl.name}`,"consumer threw",i)}return}for(let i=Gr.length-1;i>=0;i--){let r=Gr[i],s=!1;try{s=!!r.onGesture(xe)}catch(o){lt(`input:${r.name}`,"consumer threw",o)}if(s){t==="down"&&(Xl=r);return}}}function Hs(t,e,n){xe.x=e,xe.y=n,xe.id=t.pointerId,xe.pointerType=t.pointerType||"mouse",xe.button=t.button|0,xe.scale=1,xe.dScale=1,xe.deltaY=0}function Gp(){Bu&&(clearTimeout(Bu),Bu=0),zu&&(clearTimeout(zu),zu=0)}function rI(t){let e=fn.pointer,n=rS(t),i=Math.max(1,n-(e._t||n-16)),r=(t.clientX-e.x)/i,s=(t.clientY-e.y)/i,o=1-Math.exp(-i/iI);e.x>-9e3&&(e.vx+=(r-e.vx)*o,e.vy+=(s-e.vy)*o),e._t=n,e.x=t.clientX,e.y=t.clientY,e.speed=Math.hypot(e.vx,e.vy)*1e3,e.type=t.pointerType||"mouse",e.lastMove=pe.now,e.inside=!0}function sI(t){if(!Yl.length)return;let e=fn.pointer;Gs.x=e.x,Gs.y=e.y,Gs.vx=e.vx,Gs.vy=e.vy,Gs.speed=e.speed,Gs.type=e.type,Gs.buttons=t.buttons|0,Gs.t=pe.now;for(let n=0;n<Yl.length;n++)try{Yl[n](Gs)}catch(i){lt("input:observer","observer threw",i)}}function oI(t){if(t.pointerType==="touch"){if(br.set(t.pointerId,{x:t.clientX,y:t.clientY}),J1(t.clientX,t.clientY),Vr(zr.tap),br.size===2&&Ue.active){aI(t);return}if(br.size>2)return}if(Ue.active)return;try{t.currentTarget.setPointerCapture(t.pointerId)}catch{}let e=rS(t),n=fn.pointer;n.x=t.clientX,n.y=t.clientY,n.vx=0,n.vy=0,n.speed=0,n._t=e,n.type=t.pointerType||"mouse",n.lastMove=pe.now,n.inside=!0,Ue.active=!0,Ue.id=t.pointerId,Ue.type=t.pointerType||"mouse",Ue.x0=Ue.lastX=t.clientX,Ue.y0=Ue.lastY=t.clientY,Ue.t0=Ue.lastT=e,Ue.dragging=!1,Ue.holdFired=!1,Ue.longFired=!1,Ue.pinch=!1,Ue.moved=0,Ue.button=t.button|0,fn.pointer.down=!0,Hs(t,t.clientX,t.clientY),xe.dx=0,xe.dy=0,xe.tx=0,xe.ty=0,xe.vx=0,xe.vy=0,xe.speed=0,xe.t=0,xe.afterHold=!1,kn("down",t),Gp(),Bu=setTimeout(()=>{Bu=0,!(!Ue.active||Ue.dragging||Ue.pinch)&&(Ue.holdFired=!0,Q1(),kn("hold",null),zu=setTimeout(()=>{zu=0,!(!Ue.active||Ue.dragging||Ue.pinch)&&(Ue.longFired=!0,Q1(),kn("longpress",null))},Wi.LONG_MS-Wi.HOLD_MS))},Wi.HOLD_MS)}function Q1(){xe.x=Ue.lastX,xe.y=Ue.lastY,xe.dx=0,xe.dy=0,xe.tx=Ue.lastX-Ue.x0,xe.ty=Ue.lastY-Ue.y0,xe.vx=0,xe.vy=0,xe.speed=0,xe.t=Gu()-Ue.t0,xe.id=Ue.id,xe.pointerType=Ue.type,xe.button=Ue.button,xe.scale=1,xe.dScale=1,xe.deltaY=0,xe.afterHold=!0}function aI(t){Gp(),Ue.dragging&&(xe.t=Gu()-Ue.t0,kn("dragend",t)),Ue.pinch=!0,Ue.dragging=!1,sS(),iS=px=Math.max(1,Math.hypot(En.ax-En.bx,En.ay-En.by)),Hs(t,(En.ax+En.bx)/2,(En.ay+En.by)/2),xe.scale=1,xe.dScale=1,kn("pinchstart",t)}var En={ax:0,ay:0,bx:0,by:0,i:0};function lI(t){En.i===0?(En.ax=t.x,En.ay=t.y):En.i===1&&(En.bx=t.x,En.by=t.y),En.i++}function sS(){En.i=0,br.forEach(lI)}var mx=null,Vp=null,Bp=!1;function cI(t){return!!t&&(t===mx||Vp!==null&&Vp.contains(t))}function uI(t){if(rI(t),sI(t),t.pointerType==="touch"&&br.has(t.pointerId)){let n=br.get(t.pointerId);n.x=t.clientX,n.y=t.clientY}if(Ue.pinch){if(br.size<2)return;sS();let n=Math.max(1,Math.hypot(En.ax-En.bx,En.ay-En.by));Hs(t,(En.ax+En.bx)/2,(En.ay+En.by)/2),xe.scale=n/iS,xe.dScale=n/px,px=n,kn("pinch",t);return}if(!Ue.active||t.pointerId!==Ue.id){if(!Ue.active&&(t.pointerType||"mouse")==="mouse"&&(t.buttons|0)===0){if(!cI(t.target)){Bp&&(Bp=!1,Hs(t,t.clientX,t.clientY),kn("leave",t));return}Bp=!0,Hs(t,t.clientX,t.clientY),xe.dx=t.movementX||0,xe.dy=t.movementY||0,xe.tx=0,xe.ty=0,xe.vx=fn.pointer.vx,xe.vy=fn.pointer.vy,xe.speed=fn.pointer.speed,xe.t=0,xe.afterHold=!1,kn("hover",t)}return}let e=Gu();Hs(t,t.clientX,t.clientY),xe.dx=t.clientX-Ue.lastX,xe.dy=t.clientY-Ue.lastY,xe.tx=t.clientX-Ue.x0,xe.ty=t.clientY-Ue.y0,xe.vx=fn.pointer.vx,xe.vy=fn.pointer.vy,xe.speed=fn.pointer.speed,xe.t=e-Ue.t0,xe.afterHold=Ue.holdFired,Ue.lastX=t.clientX,Ue.lastY=t.clientY,Ue.lastT=e,Ue.moved=Math.max(Ue.moved,Math.hypot(xe.tx,xe.ty)),Ue.dragging?kn("drag",t):Ue.moved>=Wi.SLOP_PX?(Ue.dragging=!0,Gp(),kn("dragstart",t),kn("drag",t)):kn("move",t)}function gx(t,e){let n=Gu();Gp(),fn.pointer.down=!1;try{t.currentTarget&&t.currentTarget.hasPointerCapture&&t.currentTarget.hasPointerCapture(t.pointerId)&&t.currentTarget.releasePointerCapture(t.pointerId)}catch{}Hs(t,t.clientX,t.clientY),xe.dx=t.clientX-Ue.lastX,xe.dy=t.clientY-Ue.lastY,xe.tx=t.clientX-Ue.x0,xe.ty=t.clientY-Ue.y0,xe.vx=fn.pointer.vx,xe.vy=fn.pointer.vy,xe.speed=fn.pointer.speed,xe.t=n-Ue.t0,xe.afterHold=Ue.holdFired;let i=Ue.dragging,r=Ue.pinch;if(Ue.active=!1,Ue.dragging=!1,Ue.pinch=!1,e){kn("cancel",t),zp();return}if(r){kn("pinchend",t),zp();return}if(kn("up",t),i){kn("dragend",t);let s=Math.hypot(xe.tx,xe.ty),o=Math.hypot(xe.vx,xe.vy);s>=Wi.SWIPE_PX&&o>=Wi.SWIPE_V&&(xe.dir=Math.abs(xe.tx)>=Math.abs(xe.ty)?xe.tx>0?"right":"left":xe.ty>0?"down":"up",kn("swipe",t))}else!Ue.holdFired&&xe.t<Wi.TAP_MS&&Ue.moved<Wi.SLOP_PX&&kn("tap",t);zp()}function zp(){Ta=null}function hI(t){if(t.pointerType==="touch"){br.delete(t.pointerId);try{$e.resume()}catch{}if(Ue.pinch){br.size<2&&Ue.active&&(br.size===0||t.pointerId===Ue.id?gx(t,!1):(Hs(t,t.clientX,t.clientY),kn("pinchend",t),Ue.pinch=!1,Ue.active=!1,fn.pointer.down=!1,zp()));return}}!Ue.active||t.pointerId!==Ue.id||gx(t,!1)}function fI(t){t.pointerType==="touch"&&br.delete(t.pointerId),Ue.active&&(t.pointerId!==Ue.id&&!Ue.pinch||(br.clear(),gx(t,!0)))}function dI(t){t.preventDefault();let e=t.deltaY;t.deltaMode===1?e*=16:t.deltaMode===2&&(e*=be.h||800),xe.x=t.clientX,xe.y=t.clientY,xe.dx=0,xe.dy=0,xe.tx=0,xe.ty=0,xe.vx=0,xe.vy=0,xe.speed=0,xe.t=0,xe.id=0,xe.pointerType="mouse",xe.button=0,xe.scale=1,xe.dScale=1,xe.deltaY=e,xe.afterHold=!1,kn("wheel",t)}function pI(t){t.relatedTarget||(fn.pointer.inside=!1,Bp=!1,Hs(t,t.clientX,t.clientY),kn("leave",t))}function eS(t){!t||t.__samvinInput||(t.__samvinInput=!0,t.addEventListener("pointerdown",oI),t.addEventListener("pointerup",hI),t.addEventListener("pointercancel",fI),t.addEventListener("wheel",dI,{passive:!1}),t.addEventListener("contextmenu",e=>e.preventDefault()))}var tS={name:"hall",onGesture(t){let e=ql&&ql.halls;if(!e||typeof e.current!="function")return!1;let n=e.current();return n?!!e.call(n.id,"onGesture",t):!1}},mI={name:"director",onGesture(t){let e=ql&&ql.director;if(!e||typeof e.busy!="function"||!e.busy())return!1;let n=e.state,i=ql.halls;return n&&n.u>=.7&&n.to&&i&&typeof i.call=="function"&&i.call(n.to.room,"onGesture",t)||t.type==="tap"&&typeof e.speedUp=="function"&&e.speedUp(),!0}},Vu=[];function nS(t,e,n,i){if(!Vu.length)return;let r={x:t,y:e,type:n,target:i||null,t:performance.now()},s=Vu.slice();for(let o=0;o<s.length;o++)try{s[o](r)}catch(a){lt("input:downobserver","down observer threw",a)}}var fn={pointer:{x:-9999,y:-9999,vx:0,vy:0,speed:0,type:"mouse",down:!1,lastMove:0,inside:!1},init(t){ql=t,mx=document.getElementById("gl"),Vp=document.getElementById("t0"),eS(mx),eS(Vp),window.addEventListener("pointermove",uI,{passive:!0}),document.addEventListener("pointerout",pI);let e=()=>{try{$e.unlock()}catch(n){lt("input:unlock",n)}};window.addEventListener("pointerdown",e,{capture:!0,passive:!0}),window.addEventListener("touchend",()=>{try{$e.resume()}catch{}},{passive:!0}),document.addEventListener("pointerdown",n=>{nS(n.clientX,n.clientY,n.pointerType==="touch"||n.pointerType==="pen"?n.pointerType:"mouse",n.target instanceof Element?n.target:null)},{capture:!0,passive:!0}),window.addEventListener("keydown",n=>{e();let i=n.target;if(!(i&&(i.isContentEditable||/^(INPUT|TEXTAREA|SELECT)$/.test(i.tagName||"")))){nS(fn.pointer.x,fn.pointer.y,"key",i instanceof Element?i:null);for(let r=0;r<ku.length;r++)try{ku[r](n)}catch(s){lt("input:keyobserver","key observer threw",s)}}},{capture:!0}),Gr.includes(tS)||(Gr.unshift(mI),Gr.unshift(tS))},push(t){return Gr.push(t),()=>{let e=Gr.indexOf(t);e>=0&&Gr.splice(e,1)}},offerKey(t){for(let e=Gr.length-1;e>=0;e--){let n=Gr[e];if(typeof n.onKey=="function")try{if(n.onKey(t))return!0}catch(i){lt(`input:${n.name}:key`,"key consumer threw",i)}}return!1},capture(t){Ta=t},release(t){(!t||Ta===t)&&(Ta=null)},observe(t){return Yl.push(t),()=>{let e=Yl.indexOf(t);e>=0&&Yl.splice(e,1)}},observeDown(t){return typeof t!="function"?()=>{}:(Vu.push(t),()=>{let e=Vu.indexOf(t);e>=0&&Vu.splice(e,1)})},observeKeys(t){return ku.push(t),()=>{let e=ku.indexOf(t);e>=0&&ku.splice(e,1)}}};function oS(t,e,n){Et.enabled=!1;let i=_i[n]||_i.T2,r=new Kd({canvas:t,context:e||void 0,antialias:!!i.msaa,alpha:!0,premultipliedAlpha:!0,depth:!0,stencil:!1,powerPreference:"high-performance",preserveDrawingBuffer:!1});r.outputColorSpace=ia,r.toneMapping=Qi,r.setClearColor(0,0),r.info.autoReset=!1,r.autoClear=!0,r.debug.checkShaderErrors=!1;let s=new Ps;s.background=null,s.matrixWorldAutoUpdate=!0;let o=new pi(st.fov,Math.max(1,be.w)/Math.max(1,be.h),.01,1e3);o.position.set(0,.75,7.2);let a=i.dprCap,l=0,c=new WeakSet,u=0,f={three:r,scene:s,camera:o,tier:n,dpr:1,stats:{calls:0,triangles:0,points:0,geometries:0,textures:0,frameMs:0,fps:0},setDprDrop(d){u=Math.max(0,d|0),f.resize()},setTier(d){f.tier=d,a=(_i[d]||i).dprCap,f.resize()},resize(){let d=typeof devicePixelRatio=="number"&&devicePixelRatio>0?devicePixelRatio:1;f.dpr=Math.max(1,Math.min(d,a)-pn.dprStep*u);let g=Math.max(1,be.w),x=Math.max(1,be.h);r.setPixelRatio(f.dpr),r.setSize(g,x,!1),o.aspect=g/x,o.updateProjectionMatrix(),he.uPixelRatio.value=f.dpr,he.uResolution.value.set(Math.round(g*f.dpr),Math.round(x*f.dpr));for(let m of h)m(f)},pinPrograms(){let d=r.info.programs;if(!(!d||d.length===l)){for(let g=l;g<d.length;g++)d[g].usedTimes++;l=d.length}},warm(d,g,x){r.compile(d,g,x||d),d.traverse(S=>{let w=S.material?Array.isArray(S.material)?S.material:[S.material]:null;if(w)for(let E of w){let y=r.properties.get(E).currentProgram;y&&!c.has(y)&&(c.add(y),y.getUniforms(),y.getAttributes())}}),f.pinPrograms();let m=r.getContext(),p=r.getRenderTarget(),_=r.autoClear,M=g.layers.mask,v=d.parent;try{r.setRenderTarget(f.sceneTarget||null),r.autoClear=!1,r.setScissorTest(!0),r.setScissor(0,0,1,1),g.layers.enableAll(),r.render(d,g)}finally{r.setScissorTest(!1),r.autoClear=_,r.setRenderTarget(p),g.layers.mask=M,v&&d!==x&&d.updateWorldMatrix(!0,!0)}m.finish()},sceneTarget:null,onResize(d){return h.add(d),()=>h.delete(d)},lost:!1},h=new Set;return t.addEventListener("webglcontextlost",d=>{d.preventDefault(),f.lost=!0,pe.stop(),_e.emit("gl:lost",{})},!1),t.addEventListener("webglcontextrestored",()=>{f.lost=!1,f.resize(),_e.emit("gl:restored",{}),pe.start()},!1),_e.on("layout:change",()=>f.resize()),f.resize(),f}var gI=`
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
}`;function xx(){let t=new Fn;return t.setAttribute("position",new hn(new Float32Array([-1,-1,0,3,-1,0,-1,3,0]),3)),t}function cS(t,e=pn.r6.levels){let n=t.three||t,i=xx(),r=new Ps,s=new Ds(-1,1,1,-1,0,1),o=(v,S,w)=>new Ft({uniforms:{tSrc:{value:null},uHalf:{value:new pt},uThreshold:{value:pn.r6.threshold},tAdd:{value:null},uAddGain:{value:1}},defines:Object.assign(S?{USE_THRESHOLD:""}:{},w?{USE_ADD:""}:{}),vertexShader:gI,fragmentShader:v,depthTest:!1,depthWrite:!1,blending:Bi}),a=o(aS,!0),l=o(aS,!1),c=o(lS,!1,!0),u=o(lS,!1,!1),f=new Xt(i,l);f.frustumCulled=!1,r.add(f);let h={type:gi,format:ri,minFilter:Lt,magFilter:Lt,depthBuffer:!1},d=[],g=[],x=0,m=0;function p(v,S){_(),x=v,m=S;let w=v,E=S;for(let y=0;y<e;y++){w=Math.max(1,w>>1),E=Math.max(1,E>>1);let T=new Hn(w,E,h);d.push(T)}for(let y=0;y<e;y++){let T=y===0?{width:v,height:S}:d[y-1],R=new Hn(T.width,T.height,h);g.push(R)}}function _(){for(let v of d.concat(g))v.dispose();d.length=0,g.length=0}function M(v,S,w,E,y){f.material=v,v.uniforms.tSrc.value=S,v.uniforms.uHalf.value.set(.5/w,.5/E),n.setRenderTarget(y),n.render(r,s)}return{render(v){if(!d.length)return null;let S=v,w=x,E=m;for(let y=0;y<e;y++)M(y===0?a:l,S,w,E,d[y]),S=d[y].texture,w=d[y].width,E=d[y].height;for(let y=e-1;y>=0;y--){let T=y>0?c:u;y>0&&(T.uniforms.tAdd.value=d[y-1].texture),M(T,S,w,E,g[y]),S=g[y].texture,w=g[y].width,E=g[y].height}return g[0].texture},resize(v,S){(v!==x||S!==m)&&p(Math.max(2,v|0),Math.max(2,S|0))},dispose(){_(),i.dispose(),a.dispose(),l.dispose(),c.dispose(),u.dispose()}}}var jl=pn.r7,uS="void main() { gl_Position = vec4(position.xy, 0.0, 1.0); }",hS=`
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
  g *= smoothstep(${jl.clearInPx.toFixed(1)}, ${jl.clearOutPx.toFixed(1)}, distance(css, uPointer));
  float aspect = uRes.x / uRes.y;
  vec2 c = (uv * 2.0 - 1.0) * vec2(aspect, 1.0);
  float v = uVig * smoothstep(${jl.vignetteFrom.toFixed(2)}, 1.0, length(c) / length(vec2(aspect, 1.0)));
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
}`,Hp=120;function fS(t){let e=t.three,n=t.scene,i=t.camera,r=new Ps,s=new Ds(-1,1,1,-1,0,1),o={uRes:{value:new pt(1,1)},uPR:{value:1},uGrain:{value:jl.grainBoot},uSeed:{value:0},uVig:{value:jl.vignette},uPointer:{value:new pt(-9999,-9999)},tScene:{value:null},tBloom:{value:null},uBloom:{value:1}},a=new Ft({uniforms:o,vertexShader:uS,fragmentShader:hS,depthTest:!1,depthWrite:!1,transparent:!0,blending:rd,blendEquation:Ns,blendSrc:nu,blendDst:Ml,blendSrcAlpha:nu,blendDstAlpha:Ml}),l=new Ft({uniforms:o,defines:{USE_SCENE:""},vertexShader:uS,fragmentShader:hS,depthTest:!1,depthWrite:!1,blending:Bi}),c=new Xt(xx(),a);c.frustumCulled=!1,r.add(c);let u=t.tier,f=null,h=null,d=null,g=[],x=!0;function m(){t.sceneTarget=null,f&&(f.dispose(),f=null),h&&(h.dispose(),h=null),d&&(d.dispose(),d=null)}function p(){if(u!=="T3"){m();return}let O=o.uRes.value.x,z=o.uRes.value.y;f?(f.setSize(O,z),h.setSize(Math.max(2,O>>1),Math.max(2,z>>1))):(f=new Hn(O,z,{type:gi,format:ri,samples:4,depthBuffer:!0,minFilter:Lt,magFilter:Lt}),h=new Hn(Math.max(2,O>>1),Math.max(2,z>>1),{type:gi,format:ri,depthBuffer:!0,minFilter:Lt,magFilter:Lt}),d=cS(t,pn.r6.levels)),t.sceneTarget=f,d.resize(h.width,h.height)}function _(){let O=e.getDrawingBufferSize(new pt);o.uRes.value.copy(O),o.uPR.value=t.dpr,p()}t.onResize(_),_();let M=new Float32Array(Hp),v=new Float32Array(Hp),S=0,w=0,E=-1,y=1<<vi.DEFAULT|1<<vi.NOFOG,T=1<<vi.EMISSIVE,R=!1,F={render(O){if(t.lost)return;R||(o.uSeed.value=Gt.reducedMotion?7:Math.floor(pe.now/(1e3/jl.grainFps))%997);let z=fn.pointer,L=z.x<-9e3||z.inside===!1||z.type==="touch"&&!z.down;o.uPointer.value.set(L?-9999:z.x,L?-9999:z.y),e.info.reset(),e.autoClear=!1,u==="T3"&&f?(i.layers.mask=y,e.setRenderTarget(f),e.setClearColor(0,0),e.clear(!0,!0,!1),e.render(n,i),t.stats.points=e.info.render.points,i.layers.mask=T,e.setRenderTarget(h),e.clear(!0,!0,!1),he.uEmissivePass.value=1,e.render(n,i),he.uEmissivePass.value=0,i.layers.mask=y,o.tBloom.value=d.render(h.texture),o.tScene.value=f.texture,c.material=l,e.setRenderTarget(null),e.render(r,s)):(i.layers.mask=y,e.setRenderTarget(null),e.setClearColor(0,0),e.clear(!0,!0,!1),e.render(n,i),t.stats.points=e.info.render.points,c.material=a,e.render(r,s)),t.pinPrograms();let V=t.stats,N=e.info;V.calls=N.render.calls,V.triangles=N.render.triangles,V.geometries=N.memory.geometries,V.textures=N.memory.textures;let D=pe.now;if(E>=0&&(M[w]=D-E,w=(w+1)%Hp,S<Hp&&S++,(pe.frame&15)===0&&S>0)){for(let G=0;G<S;G++)v[G]=M[G];let H=v.subarray(0,S);H.sort(),V.frameMs=H[S>>1],V.fps=V.frameMs>0?1e3/V.frameMs:0}if(E=D,x){x=!1;let H=document.getElementById("ff-grain");H&&H.parentNode&&H.parentNode.removeChild(H);for(let G of g)try{G()}catch{}g.length=0}},setGrain(O){o.uGrain.value=Math.max(0,+O||0)},freezeGrain(O){R=!!O},setTier(O){u=O,p()},onFirstFrame(O){if(x)g.push(O);else try{O()}catch{}},get tier(){return u},uniforms:o};return _e.on("tier:change",({tier:O})=>F.setTier(O)),F}var fs=[0,0,0],Zl=null;function vx(t){for(let e=0;e<xc.length;e++){let n=xc[e];Uh(n,t,fs),he[ep(n)].value.setRGB(fs[0],fs[1],fs[2])}}function dS(t){let e="#";for(let n=0;n<3;n++)e+=Math.round(t[n]*255).toString(16).padStart(2,"0").toUpperCase();return e}function xI(t){if(typeof document>"u")return;let e=document.documentElement.style;for(let n=0;n<xc.length;n++){let i=xc[n];if(t<=0){e.removeProperty(vc[i]),e.removeProperty(vc[i]+"-rgb");continue}Uh(i,t,fs),e.setProperty(vc[i],dS(fs)),e.setProperty(vc[i]+"-rgb",`${Math.round(fs[0]*255)},${Math.round(fs[1]*255)},${Math.round(fs[2]*255)}`)}}var Eo={mode:{night:!1,inverted:0},init(){vx(Eo.mode.inverted)},setNight(t){let e=!!t;if(typeof document<"u"&&(e?document.documentElement.setAttribute("data-night",""):document.documentElement.removeAttribute("data-night")),e===Eo.mode.night&&!Zl){he.uNight.value=e?1:0;return}Eo.mode.night=e,Zl&&Zl.cancel();let n=he.uNight.value,i=e?1:0;Zl=qn(_s.mixMs,r=>{he.uNight.value=n+(i-n)*r}),Zl.done.then(()=>{Zl=null})},setInverted(t){let e=Math.max(0,Math.min(1,+t||0));Eo.mode.inverted=e,he.uInvert.value=e,vx(e),xI(e),typeof document<"u"&&(e>=.5?document.documentElement.setAttribute("data-inverted",""):document.documentElement.removeAttribute("data-inverted"))},color(t){return(he[ep(t)]||he.cSilver).value},hex(t){return Ha[t]?dS(Uh(t,Eo.mode.inverted,fs)):Ha.silver}};vx(0);var $u=pn.r5,vS=$u.elevationDeg*Math.PI/180,vI=Math.cos(vS),yI=Math.sin(vS),yx=Math.PI*2,Wp=new P(0,0,0),_x=$t.radius,pS=new P,Hu=!1,Kl=Math.PI*.75,bx=-.7,Mx=.7,Sx=0,wx=0,$p=new P,Xp=new P,Ea=1,Ax="",mS=new P,gS=new P,Wu=new P,xS=new P,rr={position:he.uLamp.value,mode:"sweep",ctx:null,init(t){return rr.ctx=t,rr.setFocus(Wp.set(0,0,0),$t.radius),rr},setFocus(t,e){Wp.copy(t),_x=e??_x},hold(t){t?(pS.copy(t),Hu||($p.copy(rr.position),Ea=0),Hu=!0):Hu&&(Hu=!1,$p.copy(rr.position),Ea=0)},sweepOnce(t){wx=Math.max(200,t||1200),Sx=pe.now+wx},update(t){let e=Pe.camera;if(!e)return;let n=fn.pointer,i=n.type==="touch"||be.isPhone,r;pe.now<Sx?r="sweep":i?r=n.down?"finger":"sweep":r=n.inside!==!1&&n.x>-9e3&&pe.now-n.lastMove<$u.idleMs?"pointer":"sweep",r!==Ax&&(Ax&&($p.copy(rr.position),Ea=0),r==="sweep"&&(Kl=Math.atan2(Mx,bx)),Ax=r),rr.mode=r,mS.setFromMatrixColumn(e.matrixWorld,0),gS.setFromMatrixColumn(e.matrixWorld,1),Wu.copy(e.position).sub(Wp),Wu.lengthSq()<1e-12?Wu.setFromMatrixColumn(e.matrixWorld,2):Wu.normalize();let s,o;if(r==="sweep"){let l=pe.now<Sx?wx:$u.sweepMs;Kl+=yx*t*1e3/l,Kl>yx&&(Kl-=yx),s=Math.cos(Kl),o=Math.sin(Kl)}else{let l=n.x/Math.max(1,be.w)*2-1,c=-(n.y/Math.max(1,be.h))*2+1,u=Math.hypot(l,c);u>1e-4&&(bx=l/u,Mx=c/u),s=bx,o=Mx}xS.copy(mS).multiplyScalar(s).addScaledVector(gS,o).normalize();let a=$u.radiusFactor*_x;Xp.copy(Wp).addScaledVector(xS,a*vI).addScaledVector(Wu,a*yI),Hu&&Xp.copy(pS),Ea<1?(Ea=Math.min(1,Ea+t*1e3/$u.blendMs),rr.position.copy($p).lerp(Xp,vn.reveal(Ea))):rr.position.copy(Xp)}};var Jl=Math.PI*2,_I=In.irisBladeDeg*Math.PI/180;function yS(t,e,n,i){for(let r=0;r<e;r++){let s=Jl*r/e-Math.PI/e,o=s+Jl/e;t.push(Math.sin(s)*n,i,Math.cos(s)*n,Math.sin(o)*n,i,Math.cos(o)*n)}}var bI=t=>It(t/1e3)*1e3;function _S(t,e){let n=In.irisBlades*2+28,i=new Float32Array(n*6),r=nr({segments:i,color:"silver",alpha:.42,far:e}),s=In.irisR,o=0;function a(l){let c=0,u=(f,h,d,g)=>{i[c++]=f,i[c++]=t,i[c++]=h,i[c++]=d,i[c++]=t,i[c++]=g};for(let f=0;f<In.irisBlades;f++){let h=Jl*f/In.irisBlades,d=Jl*(f+1)/In.irisBlades,g=s*(.06+.94*l),x=h+Math.PI/In.irisBlades+_I*(1-l),m=Math.sin(x)*g,p=Math.cos(x)*g;u(Math.sin(h)*s,Math.cos(h)*s,m,p),u(m,p,Math.sin(d)*s,Math.cos(d)*s)}for(let f=0;f<28;f++){let h=Jl*f/28,d=Jl*(f+1)/28;u(Math.sin(h)*s,Math.cos(h)*s,Math.sin(d)*s,Math.cos(d)*s)}r.setSegments(i)}return a(0),{object:r.mesh,lines:r,get open(){return o},set(l){let c=Math.max(0,Math.min(1,l));c!==o&&(o=c,a(c))}}}function bS(t){let e=ce[t]||ce.CORE,n=e.n,i=new un;i.name=`shell:${e.id}`;let r=e.floor-e.alt,s=e.ceil-e.alt,o=e.id==="CORE",a=e.far,l=[];for(let[p,_]of[[r,e.floor],[s,e.ceil]]){let M=o?300:bI(_);for(let v=In.ringStep;v<M-1;v+=In.ringStep)yS(l,n,v,p)}let c=nr({segments:new Float32Array(l.length?l:[0,0,0,0,0,0]),color:"steel",alpha:l.length?1:0,far:a,flatten:!0});c.mesh.name="rings",i.add(c.mesh);let u=null;if(!o){let p=[],_=[];for(let M=In.deckRingStep;M<=In.deckR+1e-6;M+=In.deckRingStep){yS(p,n,M,0);for(let v=0;v<n;v++)_.push(1-.75*(M/In.deckR))}u=nr({segments:new Float32Array(p),alpha:new Float32Array(_),color:"steel",far:a,flatten:!0}),u.mesh.name="deck",i.add(u.mesh)}let f=_S(s,a),h=_S(r,a);i.add(f.object,h.object);let d=1,g=!0,x={rings:l.length?1:0,deck:1,iris:.42};return{group:i,rings:c,deck:u,irisTop:f,irisBottom:h,setDeckVisible(p){g=!!p,u&&(u.mesh.visible=g&&d>0)},setIris(p,_){(p==="top"?f:h).set(_)},setFlatten(p,_){c.setFlatten(p,_),u&&u.setFlatten(p,_)},setAlpha(p){d=Math.max(0,Math.min(1,p)),c.setAlpha(x.rings*d),u&&(u.setAlpha(x.deck*d),u.mesh.visible=g&&d>0),f.lines.setAlpha(x.iris*d),h.lines.setAlpha(x.iris*d)},dispose(){c.dispose(),u&&u.dispose(),f.lines.dispose(),h.lines.dispose(),i.parent&&i.parent.remove(i)}}}var MI=`
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
}`,SI=`
${tr}
${Bs}
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
}`;function MS(){let t=new un;t.name="axisPillar";let e=12,n=[],i=1200,r=50;for(let d=-i;d<i;d+=r){let g=d,x=Math.min(i,d+r);x<=-e||g>=e?n.push(0,g,0,0,x,0):(g<-e&&n.push(0,g,0,0,-e,0),x>e&&n.push(0,e,0,0,x,0))}let s=nr({segments:new Float32Array(n),color:"ember",width:2,alpha:.5,glint:.4,far:4e3});s.mesh.name="pillarRibbon",t.add(s.mesh);let o=new Kc(In.beadR,0),a=new Ft({uniforms:{uColor:yi("silver"),uBase:yi("obsidian"),cWhite:he.cWhite,uLamp:he.uLamp,uAlpha:{value:1},uFlash:{value:0},cAbyss:he.cAbyss,uFogDensity:he.uFogDensity,...zs()},vertexShader:MI,fragmentShader:SI}),l=new Wc(o,a,In.beadCount);l.name="pillarBeads";let c=new Ot,u=new gr,f=new P,h=new P;for(let d=0;d<In.beadCount;d++){let g=-i+In.beadStep*d;f.set(0,g,0),h.setScalar(Math.abs(g)<e?0:1),l.setMatrixAt(d,c.compose(f,u,h))}return l.instanceMatrix.needsUpdate=!0,l.frustumCulled=!1,t.add(l),t.userData.ribbon=s,t.userData.beads=l,t.userData.uniforms={ribbon:s.uniforms,beads:a.uniforms},t}var Xu=new eu,Yu=[];var e5=new P;function SS(t,e,n,i){if(!Pe.camera||!n||!n.length)return null;Pe.ray(t,e,Xu.ray),Xu.near=Pe.camera.near,Xu.far=Pe.camera.far,Xu.layers.mask=4294967295,Yu.length=0,Xu.intersectObjects(n,!0,Yu);let r=null;for(let s=0;s<Yu.length;s++){let o=Yu[s];if(wI(o.object)){r=o;break}}return Yu.length=0,r?i?(Object.assign(i,r),i):r:null}function wI(t){for(let e=t;e;e=e.parent)if(!e.visible)return!1;return!0}var Ws=Math.PI/180,wi=Math.PI*2,AI=137.508*Ws;function TI(t){let e=Zt[t],n=$t.sign.heightFrac*e.height;Jt.draw(`sign:${t}`,{height:(i,r,s)=>wS(i,r,s,t,n,!1),inlay:(i,r,s)=>wS(i,r,s,t,n,!0)})}function wS(t,e,n,i,r,s){t.fillStyle="#fff",t.strokeStyle="#fff";let o=e/r;if(yc[i]==="•"){let g=($t.apertureD/2+.0045)*o,x=$t.ringEngraveW*o;t.beginPath(),s?(t.lineWidth=1,t.arc(e/2,n/2,g-x/2,0,wi),t.stroke(),t.beginPath(),t.arc(e/2,n/2,g+x/2,0,wi),t.stroke()):(t.lineWidth=Math.max(1.5,x),t.arc(e/2,n/2,g,0,wi),t.stroke());return}let l=(i===0||i===6?.5:.9)*n,c=n/2+(i===0?.17*n:i===6?.02*n:0);t.font=Yr.sign.replace("{px}",String(Math.round(l*1.38))),t.textAlign="center",t.textBaseline="alphabetic";let u=t.measureText(yc[i]),f=u.actualBoundingBoxAscent||l,h=u.actualBoundingBoxDescent||0,d=c+(f-h)/2;s?(t.lineWidth=1,t.strokeText(yc[i],e/2,d)):t.fillText(yc[i],e/2,d)}function EI(){Jt.draw("ticks",{height:(t,e,n)=>{t.fillStyle="#fff";for(let i=0;i<$t.ticksPerFace;i++)t.fillRect((i+.5)/$t.ticksPerFace*e-1,0,2,n*.9)},inlay:(t,e,n)=>{t.fillStyle="#fff";for(let i=0;i<$t.ticksPerFace;i++)t.fillRect(Math.round((i+.5)/$t.ticksPerFace*e),0,1,n*.9)}})}function AS(){Jt.texture||Jt.init(yt.tier);for(let t=0;t<7;t++)TI(t);EI();for(let t=0;t<7;t++)qu[t]&&Ex(t,qu[t])}var qu=["","","","","","",""];function TS(t,e,n,i,r){t.fillStyle="#fff",t.strokeStyle="#fff";let s=Math.round(n*.86);t.font=Yr.sign.replace("{px}",String(s));let o=t.measureText(i).width;o>e*.98&&(s=Math.max(6,Math.floor(s*(e*.98)/o)),t.font=Yr.sign.replace("{px}",String(s))),t.textAlign="center",t.textBaseline="middle",r?(t.lineWidth=1,t.strokeText(i,e/2,n/2)):t.fillText(i,e/2,n/2)}function Ex(t,e){Jt.draw(`code:${t}`,{height:(n,i,r)=>TS(n,i,r,e,!1),inlay:(n,i,r)=>TS(n,i,r,e,!0)})}var RI="void main() { gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }",CI=`
uniform vec3 uColor; uniform vec3 cElectrum; uniform vec3 cWhite; uniform float uNight, uI, uFlash, uEmissivePass, uGlowVis;
void main() {
  vec3 c = mix(uColor, cElectrum, uNight);
  float k = uI * mix(1.0, ${_s.nucleusIntensity.toFixed(2)}, uNight);
  k *= mix(1.0, uGlowVis, uEmissivePass);      // T3 bloom source obeys the SPEC visibility rule like the T1/T2 sprite
  gl_FragColor = vec4(mix(c * k, cWhite, uFlash), 1.0);
}`;function Tx(t,e){let n=Zt[t],i=n.top+(n.bot-n.top)/3,r=n.top+(n.bot-n.top)*2/3,s=(It(i)+It(r))/2;return e.set(0,n.mid,s*Math.cos(Math.PI/n.n))}var ES=()=>({dy:0,slide:0,yaw:0,pitch:0,scaleR:1,scaleY:1,alpha:1,edgeFlash:0});function RS(t){AS(),zl().then(AS);let e=new un;e.name="key";let n=bu({perStratum:!0,vertices:!0,far:700});e.add(n.group);let i=n.strata,r=new Ft({uniforms:{uColor:{value:he.cEmber.value},cElectrum:he.cElectrum,cWhite:he.cWhite,uNight:he.uNight,uI:{value:1},uFlash:{value:0},uEmissivePass:he.uEmissivePass,uGlowVis:{value:1}},vertexShader:RI,fragmentShader:CI}),s=new Xt(new ra(ni.r,ni.detail),r);s.name="nucleus",s.userData.stratum=3;let o=cp({color:"ember",radius:ni.glowR,intensity:1,core:s,depthTest:!1,night:!0,nightIntensity:_s.nucleusIntensity,fog:!1,renderOrder:6});e.add(o.object);let a=nr({segments:new Float32Array([0,-pr.half,0,0,pr.half,0]),color:"ember",width:pr.widthPx,alpha:pr.alphaInside,glint:.3}),l=8,c=new Float32Array(l*2*6),u=new Float32Array(l*2),f=nr({segments:c,alpha:u,color:"ember",width:pr.widthPx,glint:.3});for(let C of[a,f])C.mesh.layers.enable(vi.EMISSIVE),C.mesh.renderOrder=4,e.add(C.mesh);let h=-1;function d(C){if(C!==h){h=C;for(let X=0;X<2;X++){let ae=X?-1:1;for(let Se=0;Se<l;Se++){let We=pr.half+C*Se/l,U=pr.half+C*(Se+1)/l,Me=(X*l+Se)*6;c[Me]=0,c[Me+1]=ae*We,c[Me+2]=0,c[Me+3]=0,c[Me+4]=ae*U,c[Me+5]=0,u[X*l+Se]=pr.alphaInside*(1-(Se+.5)/l)}}f.setSegments(c),f.mesh.geometry.attributes.aAl.needsUpdate=!0,f.mesh.visible=C>0}}d(pr.extend);let g=48,x=new Float32Array(g*6),m=Tx(3,new P).z+.002;for(let C=0;C<g;C++){let X=C/g*wi,ae=(C+1)/g*wi,Se=C*6;x.set([Math.cos(X)*ni.breathRingR,Math.sin(X)*ni.breathRingR,m,Math.cos(ae)*ni.breathRingR,Math.sin(ae)*ni.breathRingR,m],Se)}let p=nr({segments:x,color:"ember",width:1,alpha:.8,glint:0});p.mesh.visible=!1,i[3].add(p.mesh);let _=pp({scale:1});_.setCount(Y.litNodes),i[3].add(_.object);let M=_i.T3.grains,v=new Float32Array(M*3),S=new Float32Array(M),w=[0];for(let C=1;C<7;C++)w.push((Zt[C-1].bot+Zt[C].top)/2);let E=2654435769,y=()=>{E=E+1831565813|0;let C=E;return C=Math.imul(C^C>>>15,C|1),C^=C+Math.imul(C^C>>>7,C|61),((C^C>>>14)>>>0)/4294967296};for(let C=0;C<M;C++){let X=w[C%7],Se=Math.max(.12,It(X))*Yt($a.annulus[0],$a.annulus[1],Math.sqrt(y())),We=y()*wi;v[C*3]=Math.sin(We)*Se,v[C*3+1]=X+(y()-.5)*2*$a.jitter,v[C*3+2]=Math.cos(We)*Se,S[C]=Yt($a.sizePx[0],$a.sizePx[1],y())}let T=So({positions:v,sizes:S,sizePx:1,color:"silver",alpha:.35,count:(yt.params||_i.T2).grains});T.object.name="grains",e.add(T.object);let R={count:(yt.params||_i.T2).grains,mode:"rings",setMode(C){R.mode=C},setPlate(){},writeTargets(){},commitTargets(){},flyToTargets(){},shiver(){},scatter(){}};_e.on("tier:change",({tier:C})=>{let X=_i[C];X&&(R.count=Math.min(M,X.grains),T.setCount(R.count))});let F=()=>{ee.satellites=Math.min(7,Y.data&&Y.data.drawings?Y.data.drawings.length:0)};F(),_e.on("drawing:saved",F);let O=C=>C<=0?1:-Math.log(C)/Math.sqrt(Math.PI*Math.PI+Math.log(C)**2),z=[];for(let C=0;C<7;C++)z.push(new _r(22,O(.04),0));let L=new Float32Array(7),V=new Int32Array(7),N=[],D=[];for(let C=0;C<7;C++)N.push(null),D.push(ES());let H=null,G=1,$={scale:1,nucleus:1,gap:-1},J=new _r(6,1,Bt.rest),ve=new _r(6,1,0),ye=new _r(6,.8,0),rt=!1,ze=!0,nt=1,Z={on:!0,base:1,pulse:1,flashUntil:0,flashToken:null,oneFrameFlash:0},te={t0:-1,amp:0},Te={t0:-1,amp:0,hz:0,decay:1,ms:0},je={t0:-1},Re=0,le=he.cEmber.value,ge=new P,Oe=new P,Ze=new P,St=new P,Ce={x:0,y:0,depth:0,visible:!1},Le={x:0,y:0,depth:0,visible:!1},at=new P,on=n.solids.concat([s]),tn=Math.cos(ni.apertureAlignDeg[0]*Ws),nn=Math.cos(ni.apertureAlignDeg[1]*Ws);function k(){for(let C=0;C<7;C++)Object.assign(D[C],ES());$.scale=1,$.nucleus=1,$.gap=-1}function Bn(C,X){Re=X;for(let ue=0;ue<7;ue++){let se=z[ue];if(L[ue]!==0){se.x+=L[ue]*C,se.v=0,se.target=se.x,L[ue]*=Math.pow(Oi.spinDecay,C*1e3/Oi.frameMs);let Ne=wi/Zt[ue].n,Ge=Math.floor(se.x/Ne);Ge!==V[ue]&&(V[ue]=Ge,$e.play("tick",{})),Math.abs(L[ue])<.35&&(L[ue]=0,se.omega=6,se.zeta=1,se.target=Math.round(se.x/wi)*wi)}se.step(C)}J.step(C),ve.step(C),ye.step(C);let ae=J.x;if(rt&&(ae+=Ln.mix(Bt.rest,Bt.breath)-Bt.rest),$.gap>=0&&(ae=$.gap),H&&H.gap!=null&&(ae=Yt(ae,H.gap,G)),Tt=ae,he.uGap.value=ae,b>=0&&!Fe()){let ue=b;b=-1;for(let se=0;se<7;se++)we[se]&&(we[se]=0,Ex(se,qu[se]))}{let ue=Math.atan2(Math.sin(ve.x),Math.cos(ve.x));Math.abs(Math.abs(ue)-Math.PI)<=35*Ws?W<0&&(W=X):W=-1}let Se=0;for(let ue=0;ue<7;ue++){let se=D[ue],Ne=N[ue],Ge=Ne?G:0,an=(3-ue)*(ae-Bt.rest)+se.dy+(Ne&&Ne.dy?Ne.dy*Ge:0),Ut=se.slide+(Ne&&Ne.slide?Ne.slide*Ge:0),ci=z[ue].x+se.yaw+(Ne&&Ne.yaw?Ne.yaw*Ge:0);if(Te.t0>=0){let gc=X-Te.t0;gc>Te.ms?Te.t0=-1:ci+=Te.amp*Math.sin(wi*Te.hz*gc/1e3+ue*.9)*Math.exp(-gc/Te.decay)}let fr=se.pitch+(Ne&&Ne.pitch?Ne.pitch*Ge:0),Ch=se.scaleR*(Ne&&Ne.scaleR!=null?Yt(1,Ne.scaleR,Ge):1),Nm=se.scaleY*(Ne&&Ne.scaleY!=null?Yt(1,Ne.scaleY,Ge):1),Ph=se.alpha*(Ne&&Ne.alpha!=null?Yt(1,Ne.alpha,Ge):1);Se=Math.max(Se,se.edgeFlash+(Ne&&Ne.edgeFlash?Ne.edgeFlash*Ge:0));let Go=i[ue];Go.position.set(Math.sin(ci)*Ut,an,Math.cos(ci)*Ut),Go.rotation.set(fr,ci,0,"YXZ"),Go.scale.set(Ch,Nm,Ch),n.setStratumFade(ue,Ph)}I>0&&(I--,Se=Math.max(Se,1/.6));for(let ue=0;ue<n.edges.length;ue++)n.edges[ue].uniforms.uFlash.value=Math.min(1,Se*.6);let We=$.scale*(H&&H.scale!=null?Yt(1,H.scale,G):1);e.scale.setScalar(We);let U=ye.x+(H&&H.pitch?H.pitch*G:0);if(je.t0>=0){let ue=X-je.t0;ue>600?je.t0=-1:U+=8*Ws*Math.sin(Math.PI*ue/600)}e.rotation.set(U,ve.x+(H&&H.yaw?H.yaw*G:0),H&&H.roll?H.roll*G:0,"YXZ");let Me=0;if(te.t0>=0){let ue=X-te.t0;ue>Ee.shudder?te.t0=-1:Me=Math.sin(wi*3*ue/Ee.shudder)*te.amp*(1-ue/Ee.shudder)}e.position.set(Me,0,H&&H.dz?H.dz*G:0),e.updateWorldMatrix(!0,!0),at.setFromMatrixPosition(e.matrixWorld);let ie=Z.on?(rt?Ln.mix(ni.intensity[0],ni.intensity[1]):1)*Z.pulse*$.nucleus:0;K!=null&&(ie=K),Z.flashUntil&&X>Z.flashUntil&&(Z.flashUntil=0,le=he.cEmber.value,o.setColor("ember")),r.uniforms.uColor.value=le,r.uniforms.uI.value=ie,r.uniforms.uFlash.value=Z.oneFrameFlash>0?1:0,o.setFlash(r.uniforms.uFlash.value),Z.oneFrameFlash>0&&Z.oneFrameFlash--;let Ae=ni.minVisibility;if(Pe.camera&&(Ze.set(0,0,1).transformDirection(i[3].matrixWorld),ge.copy(Pe.camera.position).sub(at).normalize(),Ae=Math.max(Ae,da(tn,nn,ge.dot(Ze)),da(ni.gapOpen[0],ni.gapOpen[1],ae))),o.setIntensity(ie*Ae*nt),r.uniforms.uGlowVis.value=Ae*nt,p.mesh.visible){let ue=Ln.mix(0,1);p.mesh.scale.setScalar(1+.04*ue),p.setAlpha(.55+.35*ue)}}let Tt=Bt.rest,I=0,b=-1,W=-1,K=null,ne=null,we=new Uint8Array(7),Fe=()=>{try{return!!(t&&t.fx&&t.fx.impact&&t.fx.impact.inPause())}catch{return!1}},re=new P,oe=new P,De={group:e,structure:n,radius:$t.radius,nucleusWorld:at,grains:R,nucleus:s,glow:o,litNodes:_,faceFrame(C,X){return Tx(C,St),X.F.copy(St).applyMatrix4(i[C].matrixWorld),X.n.set(0,0,1).transformDirection(i[C].matrixWorld),X},stratumMatrix(C,X){return X.copy(i[C].matrixWorld)},pick(C,X){let ae=SS(C,X,on);return ae&&ae.object&&ae.object.userData.stratum!=null?ae.object.userData.stratum:-1},screenInfo(C){let X=Pe.camera;if(Pe.project(at,Ce),C.x=Ce.x,C.y=Ce.y,!X)return C.r=C.rx=C.ry=0,C;let ae=e.scale.x;return ge.setFromMatrixColumn(X.matrixWorld,0),Oe.copy(at).addScaledVector(ge,$t.radius*ae),Pe.project(Oe,Le),C.r=Math.abs(Le.x-Ce.x),Oe.copy(at).addScaledVector(ge,.62*ae),Pe.project(Oe,Le),C.rx=Math.abs(Le.x-Ce.x),ge.setFromMatrixColumn(X.matrixWorld,1),Oe.copy(at).addScaledVector(ge,1.2*ae),Pe.project(Oe,Le),C.ry=Math.abs(Le.y-Ce.y),C},stratumScreenY(C){return ge.set(0,Zt[C].mid,0).applyMatrix4(i[C].matrixWorld),Pe.project(ge,Ce).y},update:Bn,onGesture(C){if(!ze||!C||C.type!=="tap")return!1;let X=De.pick(C.x,C.y);return X<0?!1:(_e.emit("key:click",{index:X,x:C.x,y:C.y}),!0)},setInteractive(C){ze=!!C},setIdle(C){rt=!!C},setReveal(C){if(!C)return;nt=C.fill!=null?Dt(C.fill):1,n.setParts({vertices:C.points!=null?Dt(C.points):1,solid:nt,edges:1,lattice:nt}),n.setFade(C.alpha!=null?Dt(C.alpha):1);for(let ae=0;ae<n.edges.length;ae++)n.edges[ae].uniforms.uFlash.value=C.scanY!=null?.35:0;let X=C.alpha==null||C.alpha>0;a.mesh.visible=X,f.mesh.visible=X&&h>0,p.mesh.visible=X&&Qe,_.object.visible=(C.alpha==null||C.alpha>0)&&_.count>0,T.setAlpha(.35*(C.alpha!=null?Dt(C.alpha):1))},setScramble(C){for(let X=0;X<7;X++){let ae=0;C==="golden"?ae=X*AI:C==="random"?ae=(y()-.5)*wi:Array.isArray(C)&&(ae=+C[X]||0),ae=Math.atan2(Math.sin(ae),Math.cos(ae)),L[X]=0,z[X].snap(ae)}},lockSequence(C={}){let X=C.order==="up"?[6,5,4,3,2,1,0]:[0,1,2,3,4,5,6],ae=C.stepMs!=null?C.stepMs:Ee.lockStep;if(C.spin)for(let Se of X)Math.abs(z[Se].x)>.01&&(L[Se]=3);return new Promise(Se=>{X.forEach((We,U)=>ot(U*ae,()=>{if(De.alignStratum(We,{spring:"light",overshoot:C.snap!=null?C.snap:Oi.snapOvershoot}),$e.play("ratchet",{i:We}),C.onLock)try{C.onLock(We)}catch{}U===X.length-1&&ot(320,Se)}))})},alignStratum(C,X={}){let ae=z[C];L[C]=0,ae.omega=X.spring==="heavy"?6:22,ae.zeta=O(X.overshoot!=null?X.overshoot:0),ae.target=Math.round(ae.x/wi)*wi},spinStratum(C,X){L[C]=X,V[C]=Math.floor(z[C].x/(wi/Zt[C].n))},ignite(C={}){Z.on=!0,Z.oneFrameFlash=C.flash===!1?0:1,le=C.color==="electrum"?he.cElectrum.value:he.cEmber.value,o.setColor(C.color==="electrum"?"electrum":"ember")},douse(){Z.on=!1},shootAxis(C=pr.extend,X=pr.shootMs){return qn(X,Se=>d(C*Se),vn.reveal).done},setBreathingRing(C){Qe=!!C,p.mesh.visible=Qe},setMorph(C,X,ae,Se){if(k(),C==="dive"){let We=Se>1600?1.375:1,U=ae/We,Me=Dt(U/120),ie=vn.camera(Dt((U-120)/360));$.scale=U<120?1-$t.contract*vn.camera(Me):1-$t.contract*(1-da(120,480,U)),$.nucleus=1+($t.nucleusAnticipation-1)*(U<120?Me:1-da(120,480,U)),$.gap=Yt(Bt.rest,Bt.dive,ie);for(let Ae=0;Ae<7;Ae++){let ue=D[Ae];Ae===X?(ue.slide=$t.diveSlide*ie,ue.yaw=-z[Ae].x*ie,ue.edgeFlash=U<120?Me:1-da(480,900,U)):(ue.yaw=(Ae<X?-1:1)*$t.diveTurnAwayDeg*Ws*ie,ue.alpha=1-da(480*We,1e3*We,ae))}}else if(C==="recall"){let We=Ee.recallSwapAt*Se/Ee.recall,U=ae-We;if(U<0){$.gap=Bt.recallStart;return}let Me=Dt(U/(Se-We||200));$.gap=Bt.rest+(Bt.recallStart-Bt.rest)*(1-vn.camera(Me))-(Bt.recallStart-Bt.rest)*Oi.settleOvershoot*Math.sin(Math.PI*Me);for(let ie=0;ie<7;ie++)U<Ee.recallRatchetMs*(ie+1)&&(D[ie].yaw=(ie%2?-1:1)*6*Ws)}else $.gap<0&&Tt!==J.x&&(J.snap(Tt),J.target=Bt.rest)},override(C,X){C>=0&&C<7&&(N[C]=X||null)},overrideGroup(C){H=C||null},setOverrideWeight(C){G=Dt(C)},onRebase(C){k();for(let X=0;X<7;X++)L[X]=0,z[X].snap(0);J.snap(C==="shrink"?Bt.recallStart:Bt.rest),J.omega=4,J.target=Bt.rest},shudder(C=6){Gt.reducedMotion&&(C=Math.min(C,2));let X=Pe.camera?Pe.camera.position.distanceTo(at):7.2;te.amp=C*X/Math.max(1,he.uPxPerUnit.value),te.t0=Re},addYaw(C){ve.x+=C},wobble(C,X,ae,Se){Gt.reducedMotion||Object.assign(Te,{t0:Re,amp:C,hz:X,decay:Math.max(1,ae),ms:Se})},bow(){return je.t0=Re,ve.target=0,new Promise(C=>ot(600,C))},nudgePitch(C){ye.x+=C*Ws},flashNucleus(C,X){le=C==="white"?he.cWhite.value:he.cElectrum.value,o.setColor(C==="white"?"white":"electrum"),Z.flashUntil=Re+Math.max(16,X||0)},setNucleusPulse(C){Z.pulse=C>0?C:1},flashEdges(C,X="white",ae=1){I=Math.max(I,Math.max(1,ae|0))},setLaw(C,X,ae){if(!(C>=0&&C<7))return;let Se=String(X??"");Se!==qu[C]&&(qu[C]=Se,Fe()?(we[C]=1,b=C):Ex(C,Se)),he.uCut.value[C]=Dt(+ae||0)},yawTo(C,X){ne&&ne.cancel();let ae=ve.x,Se=(C||0)*Ws,We=Math.max(0,X||0);return We<=0?(ve.snap(Se),ve.target=Se,Promise.resolve()):(ne=qn(We,U=>{ve.x=ae+(Se-ae)*U,ve.v=0,ve.target=ve.x},vn.camera),ne.done)},backFaceFrame(C,X){let ae=Zt[C];if(!ae)return X;let Se=Math.floor(ae.n/2),We=wi*Se/ae.n;Tx(C,re);let U=re.z;return re.set(Math.sin(We)*U,re.y,Math.cos(We)*U).applyMatrix4(i[C].matrixWorld),oe.set(Math.sin(We),0,Math.cos(We)).transformDirection(i[C].matrixWorld),X.F.copy(re),X.n.copy(oe),X},isShowingBack(){return W>=0&&Re-W>=240},setScrambleQuant(C,X){},setNucleus(C){K=C==null?null:Dt(+C||0)},strike(C){},bowTo(C,X){return De.bow()}};R.markSaved=(C,X)=>{},R.spiral=C=>{};let Qe=!1;return De.setReveal({points:0,scanY:null,fill:0,alpha:0}),De.douse(),d(0),_e.on("night:change",({night:C})=>_.setNight(C)),ee.night&&_.setNight(!0),De}var PI=["S01","S02","S03","S04","S05","S06","S07","S08","S09","S10","S11","S12","S13","S14"],CS=new Map;function Wt(t,e){typeof t=="string"&&t&&typeof e=="function"&&CS.set(t,e)}Wt("fx",()=>({stage:null,queue:[],impacts:[],prosvet:[],waveArrivalMs:null,timeScale:pe.timeScale,dust:{pool:0,live:0}}));Wt("scaleBar",()=>null);Wt("figure",()=>null);Wt("deeds",()=>[]);Wt("code",()=>[]);Wt("show",()=>null);Wt("guests",()=>0);Wt("sbor",()=>null);Wt("proposals",()=>0);Wt("lost",()=>null);Wt("rim",()=>[]);Wt("boot",()=>null);Wt("resonance",()=>null);function PS(t){Wt("audio",()=>{let i=[];try{i=t.fx&&t.fx.cue&&typeof t.fx.cue.log=="function"?t.fx.cue.log():[]}catch{i=[]}return{...$e.fx.snapshot(),cueLog:i}});let e=()=>{if(t.secrets&&typeof t.secrets.found=="function")return t.secrets.found();let i=Y.data&&Y.data.found||{};return PI.filter(r=>!!i[r])},n=Object.freeze({version:1,state(){let i=t.renderer,r=Y.data||{},s=i?i.stats:null,o={route:ee.route.hash,room:ee.room,phase:ee.phase,tier:ee.tier,u:ee.u,soundOn:ee.soundOn,night:ee.night,owner:ee.owner,inverted:ee.inverted,secrets:e(),shards:r.shards|0,nadirOpen:!!r.nadirOpen,pullNest:ee.pullNest,resonancePct:ee.resonancePct,status:ee.status,columns:ee.columns.slice(),satellites:ee.satellites,companion:ee.companion,whaleSeen:!!r.whaleSeen,_stats:s?{calls:s.calls,triangles:s.triangles,dpr:i.dpr,texMB:Rb(),geometries:s.geometries,points:s.points,frameMs:s.frameMs,fps:s.fps,tier:ee.tier,labels:t.overlay?t.overlay.visibleCount|0:0}:null,_travel:t.director&&t.director.lastTravel?{...t.director.lastTravel}:null,_world:{source:Ly,issues:Dy.length}};return CS.forEach((a,l)=>{try{o[l]=a()}catch(c){o[l]=null,lt(`hook:${l}`,"test-hook field threw",c)}}),o},go(i){let r=String(i);location.hash===r?t.director&&t.director.go(r,{source:"go"}):location.hash=r}});try{Object.defineProperty(window,"__SAMVIN__",{value:n,writable:!1,configurable:!1,enumerable:!1})}catch{}return n}var Yp=38,Rx=-100,oi=1024,sr=256,IS=`
varying vec2 vUv; varying float vDist;
void main() { vUv = uv; vec4 v = modelViewMatrix * vec4(position, 1.0); vDist = length(v.xyz); gl_Position = projectionMatrix * v; }`,LS=`
${tr}
uniform sampler2D uTex; uniform vec3 cSilver; uniform float uAlpha;
varying vec2 vUv; varying float vDist;
void main() {
  float a = texture2D(uTex, vUv).a * uAlpha;
  if (a <= 0.003) discard;
  gl_FragColor = vec4(applyFog(cSilver, vDist), a);
}`;function DS(t){let e=new un;e.name="rim";let n=Cr(xt.operator.name||""),i=-In.coreRimR*Math.cos(Math.PI/12)+.5,r=document.createElement("canvas");r.width=oi,r.height=sr;let s=new ts(r);s.minFilter=Lt,s.magFilter=Lt,s.generateMipmaps=!1,s.wrapS=s.wrapT=mi,fa(s,oi*sr*4);let o=.5,a=[],l=1,c=[.5],u="   ";function f(){let L=r.getContext("2d");if(L.clearRect(0,0,oi,sr),L.fillStyle="#fff",L.textAlign="center",L.textBaseline="middle",!a.length)l=1,L.font=Yr.burn.replace("{px}",String(Math.round(sr*.78))),L.fillText(n,oi/2,sr/2+sr*.04),o=Math.min(1,L.measureText(n).width/oi),c.length=1,c[0]=.5;else{let V=[n].concat(a),N=V.join(u);L.font=Yr.burn.replace("{px}",String(Math.round(sr*.78)));let D=L.measureText(N).width;l=Math.min(1,oi*.98/Math.max(1,D)),L.font=Yr.burn.replace("{px}",String(Math.max(8,Math.round(sr*.78*l))));let H=L.measureText(N).width,G=L.measureText(u).width,$=oi/2-H/2;L.textAlign="left",c.length=0;for(let J of V){let ve=L.measureText(J).width;L.fillText(J,$,sr/2+sr*.04),c.push(($+ve/2)/oi),$+=ve+G}o=Math.min(1,H/oi)}s.needsUpdate=!0,M()}let h=new Ft({uniforms:{uTex:{value:s},cSilver:he.cSilver,uAlpha:{value:1},cAbyss:he.cAbyss,uFogDensity:he.uFogDensity},vertexShader:IS,fragmentShader:LS,transparent:!0,depthWrite:!1}),d=Yp/.6,g=new Xt(new ns(d*(oi/sr),d),h);g.position.set(0,Rx,i),g.visible=!1,g.name="rimName",e.add(g);let x=Math.max(1,Ru(xt.clan.sigil).length),m=new Float32Array(x*3),p=up({positions:m,count:0,color:"ember",radius:Xo.emitterM,intensity:1});e.add(p.object);let _=0;function M(){let L=d*(oi/sr)*o/2+12;for(let V=0;V<x;V++){let N=Math.floor(V/3),D=V%3;m[V*3]=L+N*6,m[V*3+1]=Rx+(1-D)*7,m[V*3+2]=i+.5}p.setPositions(m,x),p.setCount(_)}f(),zl().then(f);let v=null;try{v=document.createElement("span"),v.className="sr-only",v.textContent=n,(document.getElementById("overlay")||document.body).appendChild(v)}catch{v=null}let S=null,w=null,E=null,y=null;function T(){if(!E){E=document.createElement("canvas"),E.width=oi,E.height=64,y=new ts(E),y.minFilter=Lt,y.magFilter=Lt,y.generateMipmaps=!1,fa(y,oi*64*4);let V=new Ft({uniforms:{uTex:{value:y},cSilver:he.cSilver,uAlpha:{value:.7*O},cAbyss:he.cAbyss,uFogDensity:he.uFogDensity},vertexShader:IS,fragmentShader:LS,transparent:!0,depthWrite:!1}),N=Yp*.22/.6;w=new Xt(new ns(N*(oi/64),N),V),w.position.set(0,Rx-d*.5-N*.2,i),w.name="rimRole",e.add(w)}let L=E.getContext("2d");L.clearRect(0,0,oi,64),L.fillStyle="#fff",L.font=Yr.burn.replace("{px}",String(Math.round(64*.78))),L.textAlign="center",L.textBaseline="middle",S&&L.fillText(S,oi/2,34),y.needsUpdate=!0,w.visible=!!S&&g.visible}let R=new P,F={x:0,y:0,depth:0,visible:!1},O=1,z={group:e,burn(L){let V=L&&Number.isFinite(L.at)?L.at:null,N=V!=null?Math.max(0,V-performance.now()):0;return N<=0?(z.showName(),Promise.resolve()):new Promise(D=>ot(N,()=>{z.showName(),D()}))},showName(){g.visible=O>0,w&&(w.visible=!!S&&g.visible)},burnGuests(L,V){return a=(Array.isArray(L)?L:[]).map(N=>Cr(String(N||""))).filter(Boolean),f(),z.showName(),Promise.resolve()},clearGuests(){a.length&&(a=[],f())},rows(){let L=Yp*l;return[n].concat(a).map(V=>({text:V,heightM:L,row:0}))},setRole(L){S=L?Cr(String(L)):null,(S||w)&&T()},namePoint(L,V){let N=V||{x:0,y:0},D=c[Math.max(0,Math.min(c.length-1,L|0))]!=null?c[Math.max(0,Math.min(c.length-1,L|0))]:.5;return R.set((D-.5)*d*(oi/sr),0,0),g.updateWorldMatrix(!0,!1),g.localToWorld(R),Pe.camera?(Pe.project(R,F),N.x=F.x,N.y=F.y):(N.x=0,N.y=0),N},letterHeightM(){return Yp},setLitNodes(L){_=Math.max(0,Math.min(x,L|0)),p.setCount(_)},setAlpha(L){O=Math.max(0,Math.min(1,L)),h.uniforms.uAlpha.value=O,w&&(w.material.uniforms.uAlpha.value=.7*O),e.visible=O>0,p.setIntensity(O)}};return z.setLitNodes(Y.litNodes),Wt("rim",()=>z.rows()),z}function NS(t){let e=t.app,n=Rr.rest,i=!1,r=null,s=!1,o=st.core,a=new P(...o.pos),l=new P(...o.target),c={pos:new P,target:new P,fov:o.fov,offsetY:0,roll:0};function u(){return c.pos.copy(a),c.target.copy(l),c.fov=o.fov,c.offsetY=t.layout.kind==="desktop"?0:o.phoneOffsetY,c.roll=0,c}function f({index:g}){if(!i||t.director.busy()||e.phase!=="idle"&&e.phase!=="unfolded")return;if(g===3){t.director.go(s?"#/core":"#/core/open",{source:"key"});return}let x=hp(g);x&&t.director.go(`#/${x.slug}`,{source:"key"})}function h(g){s=g,e.unfolded=g,t.key&&(t.key.overrideGroup(g?{gap:Bt.unfold}:null),t.key.setOverrideWeight(1))}return{id:"CORE",build(){r=t.bus.on("key:click",f)},pose(){return u()},livePose(g){return Math.abs(n-Rr.rest)<1e-4?!1:(g.target.copy(l),g.pos.copy(a).sub(l).multiplyScalar(n/Rr.rest).add(l),g.fov=o.fov,g.offsetY=t.layout.kind==="desktop"?0:o.phoneOffsetY,g.roll=0,!0)},enter(){},exit(){},arrive(){i=!0,n=Rr.rest},depart(){i=!1,s&&h(!1)},setSub(g){return g==="open"?(s||(h(!0),e.phase==="idle"&&Fi("unfolded")),0):g==null?(s&&(h(!1),e.phase==="unfolded"&&Fi("idle")),0):!1},update(){},onGesture(g){return t.key&&t.key.onGesture(g)?!0:g.type==="wheel"?(n=Math.max(Rr.min,Math.min(Rr.max,n*Math.pow(Rr.wheelFactor,g.deltaY/Rr.wheelStepPx))),!0):g.type==="pinch"?(n=Math.max(Rr.min,Math.min(Rr.max,n/Math.max(.2,g.dScale||1))),!0):!1},onKey(g){return g.key==="Escape"&&s?(t.director.go("#/core",{source:"kbd"}),!0):!1},resize(){},dispose(){r&&(r(),r=null),s&&h(!1),i=!1}}}function Ro(t,e){if(t==="ZENITH")return e>0?"SIGNAL":null;let n=t==="WORKSHOP"?"MEMBERS":t,i=Un.indexOf(n);if(i<0)return null;let r=i+(e>0?1:-1);return r>=0&&r<Un.length?Un[r]:null}function OS(t){let e=bt.elevator,n=0,i=-1e9,r=0;function s(o){let a=Ro(t.id,o);return n=0,r=0,a?(t.director.go(`#/${ce[a].slug}`,{source:"hall"}),!0):!1}return{onWheel(o){let a=t.loop.now;a-i>600&&(n=0,r=0),i=a;let l=o.deltaY||0;if(!l||(n!==0&&Math.sign(l)!==Math.sign(n)&&(n=0,r=0),!Ro(t.id,Math.sign(l))))return!0;let c=Math.abs(n)<e.resistance*e.pxPerHall?.5:1;n+=l*c;let u=Math.floor(Math.abs(n)/e.tickPx);return u>r&&(r=u,t.audio&&t.audio.play("tick",{})),Math.abs(n)>=e.pxPerHall&&s(Math.sign(n)),!0},onSwipe(o){if(o.dir!=="up"&&o.dir!=="down")return!1;let a=o.dir==="up"?1:-1;return Ro(t.id,a)?(Vr(zr.lock),s(a)):!1},reset(){n=0,r=0,i=-1e9}}}var jp=Math.PI/180,$s=Math.PI*2,II=new Set(["SIGNAL","MEMBERS","INSIGNIA","NADIR","ZENITH","ARCHIVE"]),LI="Зал строится.",qp=[0,0,0];function ds(t,e,n,i,r,s=st.fov,o=0){return t.pos.set(e[0],e[1],e[2]),t.target.set(n,i,r),t.fov=s,t.offsetY=o,t.roll=0,t}function FS(t,e,n,i,r){return ds(t,e,e[0],i,e[2]+(i-e[1])/Math.tan(n*jp),r)}function ju(t,e,n){return qp[0]=t,qp[1]=e,qp[2]=n,qp}function US(t,e,n,i){let r=e==="phone",s;switch(t){case"MEMBERS":return s=st.members.target,ds(i,r?st.members.phonePos:st.members.pos,s[0],s[1],s[2]);case"VOYAGES":return r?FS(i,st.voyages.phonePos,-st.voyages.phonePitchDeg,0):ds(i,ju(0,n,n*(44/70)),0,0,-6*(n/70));case"ARCHIVE":return ds(i,ju(0,1.6,0),0,1.6,st.archive.tubeR);case"SIGNAL":return r?ds(i,st.signal.phonePos,0,2+30*Math.tan(st.signal.phonePitchDeg*jp),0,st.fovWide):(s=st.signal.target,ds(i,st.signal.pos,s[0],s[1],s[2],st.signal.fov));case"INSIGNIA":return ds(i,st.insignia.pos,0,1.7,-10,st.insignia.fov);case"NADIR":return ds(i,ju(0,20,40),0,0,0);case"ZENITH":return FS(i,ju(0,50,30),r?st.zenith.phonePitchDeg:st.zenith.pitchDeg,-110);case"WORKSHOP":return ds(i,ju(0,0,3.2),0,0,0);default:return s=st.core.target,ds(i,st.core.pos,s[0],s[1],s[2],st.core.fov,e==="desktop"?0:st.core.phoneOffsetY)}}function Ra(t,e,n,i=48,r=0,s=0){for(let o=0;o<i;o++){let a=$s*o/i,l=$s*(o+1)/i;t.push(r+Math.sin(a)*e,n,s+Math.cos(a)*e,r+Math.sin(l)*e,n,s+Math.cos(l)*e)}}function DI(t,e,n){let o=.75*Math.PI;for(let a of[1,-1])for(let l=0;l<10;l++){let c=$s*l/10;t.push(e+Math.sin(c)*1.2,0,n+Math.cos(c)*1.2,e+Math.sin(c+a*o)*1.2,24,n+Math.cos(c+a*o)*1.2)}Ra(t,1.2,0,14,e,n),Ra(t,1.2,24,14,e,n),Ra(t,1.2*1.6,24,14,e,n)}function kS(t,e,n,i){let r=_c(e),s=new Float32Array(t*3);for(let o=0;o<t;o++){let a=r()*$s,l=Math.asin(.15+.85*r());s[3*o]=Math.cos(l)*Math.sin(a)*i,s[3*o+1]=n+Math.sin(l)*i,s[3*o+2]=Math.cos(l)*Math.cos(a)*i}return s}function NI(t,e){let n=[],i=null,r=[];switch(t){case"columns":{let s=e.world.members,o=s.length,a=s.filter(c=>c.id!==e.world.operator.id),l=s.find(c=>c.id===e.world.operator.id);l&&a.splice(Math.floor(a.length/2),0,l),a.forEach((c,u)=>{let f=o>1?(-25+50*u/(o-1))*jp:0,h=48*Math.sin(f),d=48-48*Math.cos(f);DI(n,h,d),r.push({id:c.id,label:c.name,pos:new P(h,24,d)})});break}case"hatches":for(let s=0;s<9;s++){let o=14*Math.sqrt(s),a=s*137.508*jp;Ra(n,2.25,.05,24,Math.sin(a)*o,Math.cos(a)*o)}break;case"bands":for(let s=0;s<12;s++)Ra(n,st.archive.tubeR,2-1.6*s,56);break;case"sky":{let s=st.signal.apexH,o=st.signal.apexR;Ra(n,o,s,36);for(let a=1;a<6;a++)Ra(n,60+(o-60)*(a/6),s*a/6,48);for(let a of[1,-1])for(let l=0;l<24;l++){let c=$s*l/24,u=c+a*($s/6);n.push(Math.sin(c)*60,0,Math.cos(c)*60,Math.sin(u)*o,s,Math.cos(u)*o)}i=kS(300,20833,st.signal.apexH,900);break}case"dome":{let s=new ra(st.insignia.sphereR,1),o=s.attributes.position.array,a=new Set,l=c=>`${o[c].toFixed(3)},${o[c+1].toFixed(3)},${o[c+2].toFixed(3)}`;for(let c=0;c<o.length;c+=9)for(let[u,f]of[[0,3],[3,6],[6,0]]){let h=l(c+u),d=l(c+f),g=h<d?h+"|"+d:d+"|"+h;a.has(g)||(a.add(g),n.push(o[c+u],o[c+u+1]+1.7,o[c+u+2],o[c+f],o[c+f+1]+1.7,o[c+f+2]))}s.dispose();break}case"chamber":{let s=st.nadir.depth,o=40;for(let a=0;a<3;a++){let l=$s*a/3,c=$s*(a+1)/3;n.push(Math.sin(l)*o,0,Math.cos(l)*o,Math.sin(c)*o,0,Math.cos(c)*o),n.push(Math.sin(l)*o,0,Math.cos(l)*o,0,-s,0)}break}case"zenith":i=kS(400,11799,-40,1200);break;default:{i=new Float32Array(147);for(let s=0;s<49;s++)i[3*s]=(s%7-3)*.4,i[3*s+1]=(3-Math.floor(s/7))*.4,i[3*s+2]=0;break}}return{seg:n,pts:i,anchors:r}}function Kn(t,e={}){let n=t.id,i=t.meta,r=e.props||"grid",s=null,o=null,a=null,l=null,c=[],u=0,f=0,h=null,d=!1,g=st.voyages.pos[1],x=new P,m={pos:new P,target:new P,fov:st.fov,offsetY:0,roll:0};function p(){let v=Dt(u)*(1-Dt(f));s&&s.setAlpha(.55*v),o&&o.setAlpha((r==="grid"?.9:.4)*v),a&&(a.style.opacity=String(Dt(u)*(1-Dt(f*2))));let S=u>=.7&&f===0;for(let w of c)w.setVisible(S)}function _(){let v=document.createElement("div");v.className="ph-block scrim";let S=document.createElement("p");return S.className="t-body",S.textContent=LI,v.appendChild(S),v}return{id:n,build(){let{seg:v,pts:S,anchors:w}=NI(r,t);if(t.group&&(v.length&&(s=nr({segments:new Float32Array(v),color:"silver",alpha:.55,width:1,far:Math.max(i.far,200)}),s.mesh.name=`ph:${r}`,t.group.add(s.mesh)),S)){let E=r==="sky"||r==="zenith";o=So({positions:S,sizePx:E?2:4,color:E?"white":"silver",alpha:.4,fog:!E,layer:E?vi.NOFOG:vi.DEFAULT}),t.group.add(o.object)}if(t.overlay&&w.length&&t.scale)for(let E of w){let y=E.pos.clone();c.push(t.overlay.add({owner:"placeholder",id:E.id,get:T=>{t.toCanonical(y,x),t.scale.toRender(x,T)},leader:{side:"right",len:40,rise:-24},button:{label:E.label,onActivate:()=>t.director.go(`#/members/${E.id}`,{source:"hall"})}}))}t.layout.isPhone||(a=_(),t.section.appendChild(a)),II.has(n)&&(l=OS(t)),p()},pose(v){return US(n,t.layout.kind,g,m)},lostSpots(){let v=US(n,t.layout.kind,g,{pos:new P,target:new P,fov:0,offsetY:0,roll:0}),S=[];for(let w=0;w<6;w++){let E=$s*w/6;S.push(new P(v.target.x+Math.sin(E)*11,0,v.target.z+Math.cos(E)*11))}return S},livePose(v){return n!=="VOYAGES"||g===st.voyages.pos[1]||t.layout.kind==="phone"?!1:(v.pos.set(0,g,g*(44/70)),v.target.set(0,0,-6*(g/70)),v.fov=st.fov,v.offsetY=0,v.roll=0,!0)},enter(v){u=v,v>0&&(f=0),p()},exit(v){f=v,p()},arrive(){d=!0,u=1,f=0,p(),t.layout.isPhone&&t.sheet&&t.sheet.set(_(),{peek:null,state:"peek"})},depart(){d=!1,l&&l.reset(),t.layout.isPhone&&t.sheet&&t.sheet.set(null)},setSub(v){return h=v==null?null:String(v),0},update(){},onGesture(v){if(!d)return!1;if(n==="VOYAGES"&&v.type==="wheel"){let S=st.voyages.altRange;return g=Math.max(S[0],Math.min(S[1],g+v.deltaY*.08)),!0}return l?v.type==="wheel"?l.onWheel(v):v.type==="swipe"?l.onSwipe(v):!1:!1},onKey(){return!1},resize(){!d||!t.sheet||t.layout.isPhone&&!a&&t.sheet.set(_(),{peek:null,state:"peek"})},dispose(){s&&(s.dispose(),s.mesh.parent&&s.mesh.parent.remove(s.mesh),s=null),o&&(o.dispose&&o.dispose(),o.object.parent&&o.object.parent.remove(o.object),o=null);for(let v of c)v.remove();c.length=0,a&&a.parentNode&&a.parentNode.removeChild(a),a=null,d&&t.layout.isPhone&&t.sheet&&t.sheet.set(null),d=!1},get sub(){return h}}}function BS(t){return Kn(t,{props:"columns"})}function zS(t){return Kn(t,{props:"grid"})}function VS(t){return Kn(t,{props:"hatches"})}function GS(t){return Kn(t,{props:"bands"})}function HS(t){return Kn(t,{props:"sky"})}function WS(t){return Kn(t,{props:"dome"})}function $S(t){return Kn(t,{props:"chamber"})}function XS(t){return Kn(t,{props:"zenith"})}var YS=Object.freeze({CORE:NS,MEMBERS:BS,WORKSHOP:zS,VOYAGES:VS,ARCHIVE:GS,SIGNAL:HS,INSIGNIA:WS,NADIR:$S,ZENITH:XS});var or=new Map,ps=[],Ys=null,OI=null,Xs=()=>{},Co=[];function qS(t,e,n){if(!Co.length||!t||t.dead)return;let i=Co;for(let r=0;r<i.length;r++){let s=i[r],o=s[e];if(typeof o=="function")try{o.call(s,t.hctx,n)}catch(a){lt(`ext:${s.name}`,`hall extension ${s.name} failed — removed`,a),Co=Co.filter(l=>l!==s)}}}function FI(t){let e={pos:new P(0,.75,7.2),target:new P,fov:st.fov,offsetY:0,roll:0};return{id:t,build:Xs,pose:()=>e,enter:Xs,exit:Xs,arrive:Xs,depart:Xs,setSub:()=>0,update:Xs,onGesture:()=>!1,onKey:()=>!1,resize:Xs,dispose:Xs,stub:!0}}function UI(t){let e=document.createElement("section");e.className="hall",e.dataset.room=t,e.hidden=!0;let n=document.getElementById("halls");return n&&n.appendChild(e),e}function kI(t,e,n,i){let r=ce[t],s=Object.create(Ys);return s.id=t,s.meta=r,s.group=i,s.section=e,s.shell=n,s.toCanonical=(o,a)=>a.copy(o).add(r.anchor),s}function jS(t,e){let n=UI(t),i=null,r=null;ee.tier!=="T0"&&ut.root&&(i=new un,i.name=`hall:${t}`,i.position.copy(ce[t].anchor),i.visible=!1,ut.root.add(i),r=bS(t),i.add(r.group));let s=kI(t,n,r,i),o={id:t,hall:null,hctx:s,section:n,shell:r,group:i,shown:!1,dead:!1,throwArmed:OI===t};or.set(t,o),ps.push(o);try{o.hall=ee.tier==="T0"?FI(t):e(s);let a=o.hall.build();a&&typeof a.then=="function"&&a.then(null,l=>Cx(t,l))}catch(a){return Cx(t,a),or.get(t)||null}return i&&(i.visible=!0),o}function ZS(t){qS(t,"dispose"),t.dead=!0;try{t.hall&&t.hall.dispose()}catch(n){lt(`hall:${t.id}`,`hall ${t.id} dispose failed`,n)}t.shell&&t.shell.dispose(),t.group&&t.group.parent&&t.group.parent.remove(t.group),t.section&&t.section.parentNode&&t.section.parentNode.removeChild(t.section),or.delete(t.id);let e=ps.indexOf(t);e>=0&&ps.splice(e,1)}function Cx(t,e){lt(`hall:${t}`,`hall ${t} failed — recalled to CORE`,e);let n=or.get(t);n&&ZS(n);let i=Ys&&Ys.director;if(t==="CORE"){jS("CORE",s=>Kn(s,{props:"grid"}));let r=or.get("CORE");r&&ee.room==="CORE"&&(ut.show("CORE",!0),r.hall&&Zu(r,"enter",1));return}i&&Promise.resolve().then(()=>i.go("#/core",{source:"error"}))}function Zu(t,e,n,i,r){if(!t||t.dead||!t.hall||typeof t.hall[e]!="function")return;let s;try{s=t.hall[e](n,i,r)}catch(o){Cx(t.id,o);return}return(e==="arrive"||e==="depart"||e==="update")&&qS(t,e,n),s}function BI(t,e){for(let n=0;n<ps.length;n++){let i=ps[n];i.dead||!i.hall||Zu(i,"update",t,e)}}var ut={root:null,init(t){return Ys=t,t.scale&&t.scale.root&&!ut.root&&(ut.root=new un,ut.root.name="halls",t.scale.root.add(ut.root)),pe.add(BI,zt.WORLD),t.bus.on("layout:change",()=>{for(let e=0;e<ps.length;e++)Zu(ps[e],"resize")}),ut},ensure(t){ce[t]||(t="CORE");let e=or.get(t)||jS(t,YS[t]||(n=>Kn(n,{props:"grid"})));return e&&e.hall?e.hall:null},get(t){let e=or.get(t);return e&&!e.dead?e.hall:null},current(){return ut.get(ee.room)},release(t){let e=or.get(t);if(!e||t===ee.room&&ee.phase!=="transition")return;let n=Ys&&Ys.director;n&&n.busy()&&n.state.to&&(n.state.to.room===t||n.logicalSource()===t)||ZS(e)},call(t,e,n,i,r){let s=Zu(or.get(t),e,n,i,r);return e==="lostSpots"?Array.isArray(s)?s:[]:s},addExtension(t){return!t||typeof t!="object"?Xs:(Co=Co.concat([t]),()=>{Co=Co.filter(e=>e!==t)})},shell(t){let e=or.get(t);return e?e.shell:null},group(t){let e=or.get(t);return e?e.group:null},residents(){return ps.map(t=>t.id)},restPose(t,e,n){let i=ce[t]||ce.CORE,r=or.get(i.id),s=r?Zu(r,"pose",e||null):void 0;return s&&s.pos&&s.target?(n.pos.copy(s.pos).add(i.anchor),n.target.copy(s.target).add(i.anchor),n.fov=s.fov||st.fov,n.offsetY=s.offsetY||0,n.roll=s.roll||0):i.id==="CORE"?(n.pos.fromArray(st.core.pos),n.target.fromArray(st.core.target),n.fov=st.core.fov,n.offsetY=Ys&&Ys.layout&&Ys.layout.kind!=="desktop"?st.core.phoneOffsetY:0,n.roll=0):(n.pos.set(0,i.alt+10,48),n.target.set(0,i.alt+12.5,0),n.fov=st.fov,n.offsetY=0,n.roll=0),n},show(t,e=!1){for(let n=0;n<ps.length;n++){let i=ps[n];i.id===t?(i.shown=!0,i.section.hidden=!1):e&&(i.shown=!1,i.section.hidden=!0)}},hide(t){let e=or.get(t);e&&(e.shown=!1,e.section.hidden=!0)}};function Ql(){return{cam:{pos:new P,target:new P,fov:35,offsetY:0,roll:0},s:1,pivot:new P,Q:new P,fog:.00485,fade:{mini:0,key:1,vin:1,parent:0},alt:0,exitU:0,enterU:0,speed01:0,pan:0,counter:0,flashCode:null,morph:{kind:"none",i:3,tMs:0,D:1},vinStrata:new Float32Array([1,1,1,1,1,1,1]),vinGap:.02,rim:1,pillar:1,shellFrom:1,shellTo:1,iris:{fromTop:0,fromBottom:0,toTop:0,toBottom:0},vel:new P}}function Po(t,e){return e.cam.pos.copy(t.cam.pos),e.cam.target.copy(t.cam.target),e.cam.fov=t.cam.fov,e.cam.offsetY=t.cam.offsetY,e.cam.roll=t.cam.roll,e.s=t.s,e.pivot.copy(t.pivot),e.Q.copy(t.Q),e.fog=t.fog,e.fade.mini=t.fade.mini,e.fade.key=t.fade.key,e.fade.vin=t.fade.vin,e.fade.parent=t.fade.parent,e.alt=t.alt,e.exitU=t.exitU,e.enterU=t.enterU,e.speed01=t.speed01,e.pan=t.pan,e.counter=t.counter,e.flashCode=t.flashCode,e.morph.kind=t.morph.kind,e.morph.i=t.morph.i,e.morph.tMs=t.morph.tMs,e.morph.D=t.morph.D,e.vinStrata.set(t.vinStrata),e.vinGap=t.vinGap,e.rim=t.rim,e.pillar=t.pillar,e.shellFrom=t.shellFrom,e.shellTo=t.shellTo,e.iris.fromTop=t.iris.fromTop,e.iris.fromBottom=t.iris.fromBottom,e.iris.toTop=t.iris.toTop,e.iris.toBottom=t.iris.toBottom,e.vel.copy(t.vel),e}function Ju(t,e){t.fade.mini=0,t.fade.key=1,t.fade.vin=1,t.fade.parent=0,t.morph.kind="none",t.vinStrata.fill(1),t.vinGap=.02,t.rim=e?1:0,t.pillar=1,t.shellFrom=1,t.shellTo=1,t.iris.fromTop=0,t.iris.fromBottom=0,t.iris.toTop=0,t.iris.toBottom=0,t.speed01=0,t.pan=0,t.counter=0,t.flashCode=null}var Ku=1024,Zp=new Float32Array(Ku+1);for(let t=0;t<=Ku;t++)Zp[t]=vn.camera(t/Ku);function zI(t){if(t<=0)return 0;if(t>=1)return 1;let e=0,n=Ku;for(;n-e>1;){let s=e+n>>1;Zp[s]<t?e=s:n=s}let i=Zp[e],r=Zp[n];return(e+(r>i?(t-i)/(r-i):0))/Ku}var Io=(t,e)=>zI(t)*e,Hr=(t,e)=>vn.camera(Dt(t/e));function Di(t,e,n,i){let r=Hr(e,i),s=Hr(n,i);return s<=r?t>=s?1:0:Dt((t-r)/(s-r))}var Ca=(t,e,n)=>Math.exp(Math.log(t)+(Math.log(e)-Math.log(t))*n),Lo=t=>{let e=Dt(t);return e*e*(3-2*e)};function Px(t,e=7){let n=Dt(t)*e,i=Math.floor(n);return i>=e?1:(i+Lo((n-i)*3))/e}function VI(t){let e=new P,n=new P,i=new Float64Array(12),r=(o,a,l,c,u,f,h,d)=>{let g=(l-a)/f-(c-a)/(f+h)+(c-l)/h,x=(c-l)/h-(u-l)/(h+d)+(u-c)/d;g*=h,x*=h,i[o]=l,i[o+1]=g,i[o+2]=-3*l+3*c-2*g-x,i[o+3]=2*l-2*c+g+x},s=(o,a)=>i[o]+i[o+1]*a+i[o+2]*a*a+i[o+3]*a*a*a;return{points:t,getPoint(o,a=new P){let l=t.length,c=(l-1)*o,u=Math.floor(c),f=c-u;f===0&&u===l-1&&(u=l-2,f=1);let h=u>0?t[u-1]:n.subVectors(t[0],t[1]).add(t[0]),d=t[u%l],g=t[(u+1)%l],x=u+2<l?t[u+2]:e.subVectors(t[l-1],t[l-2]).add(t[l-1]),m=Math.pow(h.distanceToSquared(d),.25),p=Math.pow(d.distanceToSquared(g),.25),_=Math.pow(g.distanceToSquared(x),.25);return p<1e-4&&(p=1),m<1e-4&&(m=p),_<1e-4&&(_=p),r(0,h.x,d.x,g.x,x.x,m,p,_),r(4,h.y,d.y,g.y,x.y,m,p,_),r(8,h.z,d.z,g.z,x.z,m,p,_),a.set(s(0,f),s(4,f),s(8,f))}}}function Kp(t,e){let n=[],i=[];for(let o=0;o<t.length;o++){if(n.length&&n[n.length-1].distanceToSquared(t[o])<1e-12){i[i.length-1]=e[o];continue}n.push(t[o].clone()),i.push(e[o])}n.length===1&&(n.push(n[0].clone()),i.push(i[0]+1e-6));let r=VI(n),s=n.length-1;return{curve:r,points:n,knots:i,sample(o,a){if(o<=i[0])return a.copy(n[0]);if(o>=i[s])return a.copy(n[s]);let l=0;for(;l<s-1&&o>i[l+1];)l++;let c=i[l+1]-i[l],u=c>0?(o-i[l])/c:1;return r.getPoint((l+u)/s,a)}}}function Qu(t,e,n,i,r,s){return s.set(i.x+r.x*(n-e)+e*t.x,i.y+r.y*(n-e)+e*t.y,i.z+r.z*(n-e)+e*t.z)}function Ix(t,e,n){let i=1-t;return Math.abs(i)<1e-9?n.set(0,0,0):n.copy(e).multiplyScalar(1/i)}var eh={restPose:null,faceFrame:null};function QS(t){Object.assign(eh,t||{})}function Jp(t,e){let n={pos:new P,target:new P,fov:st.fov,offsetY:0,roll:0};if(eh.restPose)eh.restPose(t,e||null,n);else{let i=ce[t]||ce.CORE;i.id==="CORE"?(n.pos.fromArray(st.core.pos),n.target.fromArray(st.core.target)):(n.pos.set(0,i.alt+10,48),n.target.set(0,i.alt+12.5,0))}return n}var Lx=t=>t==="WORKSHOP"?"MEMBERS":t==="ZENITH"?"SIGNAL":t;function Dx(t,e){let n=Lx(t),i=Lx(e);return n==="CORE"&&i!=="CORE"?"DIVE":i==="CORE"&&n!=="CORE"?"RECALL":"LIFT"}function ew(t,e){let n=ce[t]||ce.CORE,i=ce[e]||ce.CORE;return Math.abs(n.stratum-i.stratum)}function tw(t,e){let n=ew(t,e);return n<=1?Ee.liftBase:Math.min(Ee.liftMax,Ee.liftBase+Ee.liftPerBoundary*(n-1))}function GI(t,e,n){return t==="DIVE"?Ee.dive:t==="RECALL"?Ee.recall:t==="SLICE"?Ee.slice:tw(e,n)}function nw(t,e,n,i,r=900,s=-1){i.set(0,0,0);let o=n.x-e.x,a=n.y-e.y,l=n.z-e.z,c=Math.sqrt(o*o+a*a+l*l),u=s>0?s:c;if(c<1e-9||c<Oi.anticipationMinDisp*u)return i;let f=Dt(t)*r,h=Oi.anticipationMs,d=f<h?vn.reveal(f/h):f<3*h?1-Lo((f-h)/(2*h)):0,g=-(Oi.anticipationFrac*u*d)/c;return i.set(o*g,a*g,l*g)}function Nx(t,e,n,i){t.exitU=Dt(e/Ee.depart),t.enterU=i>=0?e<i?0:Dt((e-i)/Math.max(1,n-i)):Dt((e-(n-Ee.arrive))/Ee.arrive)}var Ox=t=>Math.sin(Math.PI*Dt(t));function KS(t,e,n,i){let r=Dt(t/120),s=vn.camera(Dt((t-120)/360)),o=t<120?1-$t.contract*vn.camera(r):1-$t.contract*(1-HI(120,480,t)),a=Yt(Bt.rest,Bt.dive,s);return i.copy(n).multiplyScalar($t.diveSlide*s),i.y+=(3-e)*(a-Bt.rest),o}function HI(t,e,n){let i=Dt((n-t)/(e-t));return i*i*(3-2*i)}function WI(t,e){let n=Zt[t],i=n.top+(n.bot-n.top)/3,r=n.top+(n.bot-n.top)*2/3,s=(It(i)+It(r))/2;return e.F.set(0,n.mid,s*Math.cos(Math.PI/n.n)),e.n.set(0,0,1),e}function Fx(t,e,n={}){let i=Math.max(0,Math.min(6,e|0)),r=n.to||hp(i).id,s=!!n.first&&!n.D,o=Math.max(0,Math.min(1100,n.tb0||0)),a=n.D||(s?Ee.diveFirst:Ee.dive-o),l=Ee.diveFirstScale,c=Ee.diveFirstHold,u=1e3*l,f=s?Ce=>Ce<u?Ce/l:Ce<u+c?1e3:(Ce-c)/l:Ce=>o+Ce*(Ee.dive-o)/a,h=s?Ce=>Ce<1e3?Ce*l:Ce*l+c:Ce=>(Ce-o)*a/(Ee.dive-o),d=h(Ee.diveSwapAt),g=Hr(d,a),x=t.s,m=t.Q.clone(),p={F:new P,n:new P};eh.faceFrame&&Math.abs(x-1)<1e-6&&m.lengthSq()<1e-12&&!n.D?eh.faceFrame(i,p):WI(i,p);let _=p.F,M=p.n.normalize(),v=Math.hypot(_.x,_.z),S=Math.min(.3,.5*v),w=new P,E=KS(o,i,M,w),y=M.clone().multiplyScalar($t.diveSlide).add(_);y.y+=(3-i)*(Bt.dive-Bt.rest);let T=Jp(r,n.sub),R=(ce[r]||ce.CORE).fog,F=t.cam.pos.clone().sub(m).multiplyScalar(1/(x*E)).sub(w),O=t.cam.target.clone().sub(m).multiplyScalar(1/(x*E)).sub(w),z=[F],L=[0],V=[O],N=[0];F.distanceTo(_)>2.2&&o<480&&(z.push(_.clone().addScaledVector(M,2)),L.push(Hr(h(480),a))),o<700&&(z.push(_.clone().addScaledVector(M,.4)),L.push(Hr(h(700),a))),z.push(_.clone().addScaledVector(M,-S)),L.push(g),z.push(T.pos.clone().multiplyScalar(1/1e3)),L.push(1),o<480&&(V.push(_.clone()),N.push(Hr(h(480),a))),V.push(_.clone().addScaledVector(M,-S-.6)),N.push(g),V.push(T.target.clone().multiplyScalar(1/1e3)),N.push(1);let H=Kp(z,L),G=Kp(V,N),$=Math.max(0,h(Math.max(480,o))),J=t.cam.fov,ve=t.cam.offsetY,ye=t.cam.roll,rt=t.fog,ze=t.alt,nt=t.rim,Z=t.pillar,te=t.fade.vin,Te=t.cam.pos.distanceTo(t.cam.target),je=z[1].clone(),Re=o<480?Hr(h(480),a):-1,le=[];for(let Ce=Math.max(o,860);Ce<=1120;Ce+=1e3/my)le.push(Hr(h(Ce),a));let ge=new P,Oe=new P,Ze=new P,St=new P;return{kind:"DIVE",from:"CORE",to:r,duration:a,swapAt:g,swapKind:"grow",stratum:i,first:s,pose(Ce,Le){let at=Io(Ce,a),on=f(at);if(Ju(Le,!1),Ce<g){let nn=KS(on,i,M,St),k=Ca(x,1e3,Di(Ce,$,d,a));Le.s=k,Le.pivot.copy(y),Le.Q.copy(m).addScaledVector(y,x-k),H.sample(Ce,ge).add(St).multiplyScalar(nn),Qu(ge,k,x,m,y,Le.cam.pos),o===0&&at<3*Oi.anticipationMs&&(nw(at/a,Oe.copy(F),je,Ze,a,Te),Le.cam.pos.addScaledVector(Ze,k)),G.sample(Ce,ge).add(St).multiplyScalar(nn),Qu(ge,k,x,m,y,Le.cam.target);let Bn=Math.log(k/x)/Math.log(1e3/x);Le.fog=Ca(rt,R,Dt(Bn));let Tt=1-Di(Ce,$,d,a);Le.fade.vin=te*Tt,Le.rim=nt*Tt,Le.pillar=Z*Tt,Le.shellFrom=Tt,Le.shellTo=0,Le.morph.kind="dive",Le.morph.i=i,Le.morph.tMs=s?on*l:on,Le.morph.D=s?Ee.diveFirst:Ee.dive}else{Le.s=1,Le.pivot.set(0,0,0),Le.Q.set(0,0,0),H.sample(Ce,Le.cam.pos).multiplyScalar(1e3),G.sample(Ce,Le.cam.target).multiplyScalar(1e3),Le.fog=R;let nn=Di(Ce,d,Math.min(a,d+Ee.depart),a);for(let k=0;k<7;k++)Le.vinStrata[k]=k===i?1:nn;Le.rim=0,Le.pillar=nn,Le.shellFrom=0,Le.shellTo=nn}let tn=Di(Ce,d,a,a);return Le.cam.fov=Yt(J,T.fov,tn),Le.cam.offsetY=Yt(ve,T.offsetY,tn),Le.cam.roll=Yt(ye,T.roll,tn),Le.alt=Yt(ze,(ce[r]||ce.CORE).alt,Ce),Nx(Le,at,a,d),Le.speed01=Ox(Di(Ce,$*.5,d,a)),Le},cues(Ce,Le,at){if(!(Ce<=Le||!at||!at.audio)){Re>=0&&Le<Re&&Ce>=Re&&at.audio.play("subDrop",{});for(let on=0;on<le.length;on++)if(Le<le[on]&&Ce>=le[on]){at.audio.play("strutTick",{});break}}}}}function Ux(t,e,n={}){let i=n.D||Ee.recall,r=i/Ee.recall,s=Ee.recallSwapAt*r,o=Ee.depart*r,a=Hr(s,i),l=Jp("CORE",null),c=t.s,u=t.Q.clone(),f=t.cam.pos.clone(),h=t.cam.target.clone(),d=1/1e3,g=f.clone().sub(l.pos).sub(u).multiplyScalar(1/(c-d)),x=l.target.clone(),m=t.cam.fov,p=t.cam.offsetY,_=t.cam.roll,M=t.fog,v=t.alt,S=t.rim,w=t.pillar,E=ce.CORE.fog,y=new P;return{kind:"RECALL",from:e,to:"CORE",duration:i,swapAt:a,swapKind:"shrink",pose(T,R){let F=Io(T,i);if(Ju(R,!1),T<a){let O=Di(T,o,s,i),z=Ca(c,d,O);R.s=z,R.pivot.copy(g),R.Q.copy(u).addScaledVector(g,c-z),R.cam.pos.copy(f),y.copy(x).multiplyScalar(z).add(R.Q),R.cam.target.copy(h).lerp(y,Lo(Di(T,o,s*.92,i))),R.cam.fov=Yt(m,l.fov,O),R.cam.offsetY=Yt(p,l.offsetY,O),R.cam.roll=Yt(_,0,O),R.fog=Ca(M,E,Dt(Math.log(z/c)/Math.log(d/c))),R.fade.parent=Di(T,s*.55,s,i),R.vinGap=Yt(Bt.rest,Bt.recallStart,O),R.rim=S*(1-Di(T,0,o,i)),R.pillar=w,R.shellFrom=1,R.shellTo=0}else{R.s=1,R.pivot.set(0,0,0),R.Q.set(0,0,0),R.cam.pos.copy(l.pos),R.cam.target.copy(l.target),R.cam.fov=l.fov,R.cam.offsetY=l.offsetY,R.cam.roll=0,R.fog=E;let O=Di(T,s,i,i);R.rim=O,R.pillar=O,R.shellFrom=0,R.shellTo=O,R.morph.kind="recall",R.morph.i=3,R.morph.tMs=F/r,R.morph.D=Ee.recall}return R.alt=Yt(v,0,T),Nx(R,F,i,-1),R.speed01=Ox(Di(T,o,s,i)),R},cues(T,R,F){T<=R||!F||!F.audio||R<a&&T>=a&&F.audio.play("recallThud",{})}}}var JS=t=>t==="WORKSHOP"?"MEMBERS":t,Pa=["ZENITH","SIGNAL","ARCHIVE","MEMBERS","CORE","VOYAGES","INSIGNIA","NADIR"];function kx(t,e,n,i={}){let r=i.D||tw(e,n),s=t.s,o=t.Q.clone(),a=Ix(s,o,new P),l=t.cam.pos.clone().sub(o).multiplyScalar(1/s),c=t.cam.target.clone().sub(o).multiplyScalar(1/s),u=Jp(n,i.sub),f=ew(e,n),h=u.pos.y>l.y,d=h?1:-1,[g,,x]=In.liftOffset,m=[l];i.vel&&i.vel.length()/s>1&&m.push(l.clone().addScaledVector(i.vel,.12/s));let p=-1,_=-1;if(f>=1){let le=ce[JS(e)],ge=ce[JS(n)],Oe=h?le.ceil:le.floor,Ze=h?ge.floor:ge.ceil;!(Math.abs(l.x-g)<4&&Math.abs(l.z-x)<4)&&(Oe-l.y)*d>-5&&(m.push(new P(g,Oe,x)),p=m.length-1),p<0||Math.abs(Ze-Oe)>2?(m.push(new P(g,Ze,x)),_=m.length-1):_=p,p<0&&(p=_)}m.push(u.pos.clone());let M=[0],v=0;for(let le=1;le<m.length;le++)v+=m[le].distanceTo(m[le-1]),M.push(v);for(let le=0;le<M.length;le++)M[le]=v>0?M[le]/v:le/(M.length-1);let S=Kp(m,M),w=p>=0?M[p]:.3,E=_>=0?M[_]:.7,y=t.cam.fov,T=t.cam.offsetY,R=t.cam.roll,F=t.fog,O={...t.fade},z=Float32Array.from(t.vinStrata),L=t.vinGap,V=t.rim,N=i.shellFrom0!=null?i.shellFrom0:1,D=t.morph.kind==="dive"?{i:t.morph.i,tMs:t.morph.tMs,D:t.morph.D}:null,H=(ce[n]||ce.CORE).fog,G=t.cam.pos.distanceTo(t.cam.target),$=m[1].clone(),J=Math.min(Pa.indexOf(e==="WORKSHOP"?"MEMBERS":e),Pa.indexOf(n==="WORKSHOP"?"MEMBERS":n)),ve=Math.max(Pa.indexOf(e==="WORKSHOP"?"MEMBERS":e),Pa.indexOf(n==="WORKSHOP"?"MEMBERS":n)),ye=[],rt=[],ze=new P,nt=new P,Z=le=>{S.sample(0,ze);for(let ge=1;ge<=240;ge++){let Oe=ge/240;if(S.sample(Oe,nt),(ze.y-le)*(nt.y-le)<=0&&ze.y!==nt.y)return Oe-1/240*((nt.y-le)/(nt.y-ze.y));ze.copy(nt)}return-1};for(let le=J+1;le<ve;le++){let ge=ce[Pa[le]],Oe=Z(ge.alt);Oe>=0&&ye.push({room:ge.id,t0:Io(Oe,r)})}for(let le=J;le<ve;le++){let ge=ce[Pa[le]],Oe=ce[Pa[le+1]],Ze=Z((ge.floor+Oe.ceil)/2);Ze>=0&&rt.push(Ze)}let te=f>=1?[w,E]:[],Te=new P,je=new P,Re=new P;return{kind:"LIFT",from:e,to:n,duration:r,swapAt:-1,swapKind:null,boundaries:f,pose(le,ge){let Oe=Io(le,r);Ju(ge,!1);let Ze=Ca(s,1,Di(le,0,r*.5,r));ge.s=Ze,ge.pivot.copy(a),ge.Q.copy(o).addScaledVector(a,s-Ze),S.sample(le,Te);let St=Te.y;Oe<3*Oi.anticipationMs&&(nw(Oe/r,l,$,je,r,G),Te.add(je)),Qu(Te,Ze,s,o,a,ge.cam.pos),f>=1?(Re.set(0,St+d*30,0),Te.copy(c).lerp(Re,Lo(w>0?le/w:1)),Te.lerp(u.target,Lo(E<1?(le-E)/(1-E):0))):Te.copy(c).lerp(u.target,Lo(le)),Qu(Te,Ze,s,o,a,ge.cam.target);let Ce=Lo(le);ge.cam.fov=Yt(y,u.fov,Ce),ge.cam.offsetY=Yt(T,u.offsetY,Ce),ge.cam.roll=Yt(R,u.roll,Ce),ge.fog=Ca(F,H,Ce);let Le=Di(le,0,Ee.depart,r);ge.fade.mini=Yt(O.mini,0,Le),ge.fade.key=Yt(O.key,1,Le),ge.fade.vin=Yt(O.vin,1,Le),ge.fade.parent=Yt(O.parent,0,Le);for(let at=0;at<7;at++)ge.vinStrata[at]=Yt(z[at],1,Le);if(ge.vinGap=Yt(L,Bt.rest,Le),ge.rim=V*(1-Le),ge.shellFrom=Yt(N,1,Le),ge.shellTo=1,D&&(ge.morph.kind="dive",ge.morph.i=D.i,ge.morph.D=D.D,ge.morph.tMs=D.tMs*(1-Di(le,0,r*.6,r))),f>=1){let at=Px(Oe/Ee.depart),on=Oe<r-300?1:1-Px((Oe-(r-300))/300);h?(ge.iris.fromTop=at,ge.iris.toBottom=on):(ge.iris.fromBottom=at,ge.iris.toTop=on),ge.counter=Oe>120&&Oe<r-240?.12:0}ge.alt=(ge.cam.pos.y-ge.Q.y)/Ze,ge.flashCode=null;for(let at=0;at<ye.length;at++)Oe>=ye[at].t0&&Oe<ye[at].t0+180&&(ge.flashCode=ye[at].room);return Nx(ge,Oe,r,-1),ge.speed01=Ox(le),ge.pan=0,ge},cues(le,ge,Oe){if(!(le<=ge||!Oe||!Oe.audio)){for(let Ze=0;Ze<te.length;Ze++)ge<te[Ze]&&le>=te[Ze]&&Oe.audio.play("irisWhoosh",{});for(let Ze=0;Ze<rt.length;Ze++)ge<rt[Ze]&&le>=rt[Ze]&&Oe.audio.play("tick",{})}}}}function iw(t,e){let n=Ee.slice,i=Ee.sliceSwap,r=e.room,s=Po(t,Ql()),o=Jp(r,e.sub),a=Ix(t.s,t.Q,new P),l=(ce[r]||ce.CORE).fog,c=Hr(i,n);return{kind:"SLICE",from:null,to:r,duration:n,swapAt:-1,swapKind:null,cutAt:c,pose(u,f){return Io(u,n)<i?(Po(s,f),f.exitU=0,f.enterU=0,f.counter=0,f.flashCode=null,f):(Ju(f,r==="CORE"),f.s=1,f.pivot.copy(a),f.Q.set(0,0,0),f.cam.pos.copy(o.pos),f.cam.target.copy(o.target),f.cam.fov=o.fov,f.cam.offsetY=o.offsetY,f.cam.roll=o.roll,f.fog=l,f.alt=(ce[r]||ce.CORE).alt,f.shellFrom=0,f.shellTo=1,f.exitU=1,f.enterU=1,f)},cues(u,f,h){f<c&&u>=c&&h&&h.t0&&h.app&&h.app.tier==="T0"&&h.t0.show(e)}}}function rw(t,e,n,i={}){let r=n.room,s=Dx(e,r),o=Math.max(Ee.retargetMin,Ee.retargetFactor*GI(s,e,r)),a;if(s==="DIVE"){let l=ce[Lx(r)].stratum;a=Fx(t,l,{to:r,sub:n.sub,D:o,tb0:t.s>1.0001?480:0})}else s==="RECALL"?a=Ux(t,e,{D:o}):a=kx(t,e,r,{sub:n.sub,D:o,vel:t.vel,shellFrom0:i.shellFrom0});return a.retarget=!0,a.from=e,a}var $I=[];function sw(){return $I}var ai=Ql(),Rn=Ql(),Ia=Ql(),Yx={pos:new P,target:new P,fov:35,offsetY:0,roll:0},Qp={pos:new P,target:new P,fov:35,offsetY:0,roll:0},$i={strata:new Float32Array([1,1,1,1,1,1,1]),gap:.02,rim:1,pillar:1,morph:"none"},qe=null,Mr=null,th={},ec=null,zx=0,rh=0,im=0,ms="forward",em=0,sh=0,Vx=!1,Gx=!1,ar=null,tc=null,oh=-1,ah=null,lh="",Do=0,tm=new Set,fe={phase:"idle",path:null,from:null,to:null,u:0,t:0,speed:1,scrubbing:!1,swapped:!1},La={active:!1,kind:null},ow=new WeakSet,No=!1,Hx=600,Wx=null;function XI(t,e,n,i){if(!t||ow.has(t))return;ow.add(t);let r=sw();if(!r.length)return;let s={kind:t.kind,from:e?e.room:ee.room,to:n?n.room:ee.room,first:t.kind==="DIVE"?!(Y.data&&Y.data.firstDive):!tm.has(n?n.room:ee.room),reduced:!!(Gt.reducedMotion||ee.tier==="T0"),retarget:!!i};for(let o=0;o<r.length;o++)try{r[o](t,s)}catch{}}var qx=t=>!!(fe.path&&fe.path.planned&&typeof fe.path.planned.has=="function"&&fe.path.planned.has(t)),hw=(t,e)=>t&&typeof t[e]=="function",qt=(t,e,n,i,r)=>hw(t,e)?t[e](n,i,r):void 0;function YI(t){let e=qe.pillar;if(!e||$i.pillar===t)return;$i.pillar=t;let n=e.userData;if(n.ribbon&&n.ribbon.setAlpha(t),n.beads){n.beads.visible=t>.001;let i=n.beads.material;i.uniforms.uAlpha.value=t,i.transparent=t<.999}e.visible=t>.001}function qI(t){qe.rim&&$i.rim!==t&&($i.rim=t,qe.rim.setAlpha(t))}function jx(t){if(!qe.renderer)return;et.scaleAbout(t.s,t.pivot),Pe.setPose(t.cam),t.fog>=0&&vr.set(t.fog),Cn.setFade(-1,t.fade.mini),Cn.setFade(0,t.fade.key),Cn.setFade(1,t.fade.vin),Cn.setFade(2,t.fade.parent);let e=Cn.structure(1);if(e){for(let r=0;r<7;r++)$i.strata[r]!==t.vinStrata[r]&&($i.strata[r]=t.vinStrata[r],e.setStratumFade(r,t.vinStrata[r]));$i.gap!==t.vinGap&&($i.gap=t.vinGap,e.setGap(t.vinGap))}qe.key&&(t.morph.kind!=="none"?qe.key.setMorph(t.morph.kind,t.morph.i,t.morph.tMs,t.morph.D):$i.morph!=="none"&&qe.key.setMorph("none",3,0,1),$i.morph=t.morph.kind),qI(t.rim),YI(t.pillar);let n=fe.to?ut.shell(fe.to.room):null,i=ar?ut.shell(ar):null;i&&i!==n&&(i.setAlpha(t.shellFrom),i.setIris("top",t.iris.fromTop),i.setIris("bottom",t.iris.fromBottom)),n&&(n.setAlpha(t.shellTo),n.setIris("top",t.iris.toTop),n.setIris("bottom",t.iris.toBottom))}function fw(){jI(Rn),qe.renderer&&(Rn.cam.pos.copy(Pe.pose.pos),Rn.cam.target.copy(Pe.pose.target),Rn.cam.fov=Pe.pose.fov,Rn.cam.offsetY=Pe.pose.offsetY,Rn.cam.roll=Pe.pose.roll,Rn.s=et.s,Rn.Q.copy(et.Q),et.fixedPoint(Rn.pivot),Rn.fog=vr.density,Rn.fade.mini=Cn.fade(-1),Rn.fade.key=Cn.fade(0),Rn.fade.vin=Cn.fade(1),Rn.fade.parent=Cn.fade(2),Rn.vel.copy(Pe.velocity)),Rn.alt=yn.altitude()}function jI(t){t.vinStrata.set($i.strata),t.vinGap=$i.gap,t.rim=$i.rim,t.pillar=$i.pillar,t.morph.kind="none",t.exitU=0,t.enterU=0,t.counter=0,t.flashCode=null,t.shellFrom=1,t.shellTo=0,t.iris.fromTop=t.iris.fromBottom=t.iris.toTop=t.iris.toBottom=0}function Da(){let t=yn.current||{room:"CORE",sub:null};ut.restPose(t.room,t.sub,Yx)}function ZI(t){Zx();let e=t==="LIFT"?"liftRumble":t==="DIVE"||t==="RECALL"?"whoosh":null;e&&qe.audio&&(tc=qe.audio.start(e,{speed01:0}))}function Zx(){if(tc){try{tc.stop()}catch{}tc=null}}function KI(){let t=document.getElementById("fx");if(!t)return;let e=document.createElement("i");e.className="slice",t.appendChild(e),ot(Ee.slice+40,()=>{e.parentNode&&e.parentNode.removeChild(e)})}function dw(t,e,n,i){if(Gt.reducedMotion||ee.tier==="T0")return iw(t,n);if(i)return rw(t,i,n,{shellFrom0:t.shellTo});let s=ut.get(n.room);if(hw(s,"entryPath")){let a=ut.call(n.room,"entryPath",e.room,t);if(a)return a}let o=Dx(e.room,n.room);if(o==="DIVE"){let a=n.room==="WORKSHOP"?"MEMBERS":n.room==="ZENITH"?"SIGNAL":n.room;return Fx(t,ce[a].stratum,{first:!(Y.data&&Y.data.firstDive),fromUnfold:!!ee.unfolded,sub:n.sub,to:n.room})}return o==="RECALL"?Ux(t,e.room):kx(t,e.room,n.room,{sub:n.sub})}function Kx(t,e,n,i){XI(t,e,n,!!i.retargeted),No=!!i.play,No&&(Hx=i.skipMs!=null?i.skipMs:600),fe.path=t,fe.from=e,fe.to=n,fe.t=0,fe.u=0,fe.speed=1,fe.swapped=!1,fe.phase="transition",fe.scrubbing=!!i.scrub,sh=0,ms="forward",zx=0,rh=pe.at(),im=rh,Vx=!1,ec=null,Gx=!0,nm++,fe.scrubbing||ev(rh,!0),th=i,ee.u=0,t.kind==="SLICE"&&KI(),ZI(t.kind),_e.emit("travel:start",{from:e,to:n,kind:t.kind,duration:t.duration})}var aw=new WeakSet;function pw(t){let e=ut.group(t);if(!(!e||!qe.renderer||!Pe.camera||aw.has(e))){aw.add(e);try{qe.renderer.warm(e,Pe.camera,qe.scene)}catch{}}}function lw(t,e){let n=yn.current;fw(),ut.ensure(t.room),pw(t.room),ar=n.room;let i=dw(Rn,n,t,null);return Fi("transition"),ut.call(n.room,"depart"),qt(qe.datum,"depart"),qe.renderer&&Cn.setHallLod(null),_e.emit("room:depart",{room:n.room,to:t}),Kx(i,n,t,e),new Promise(r=>{Mr=r})}function mw(){let t=fe.path;if(!t)return ee.room;let e=ar||fe.from&&fe.from.room||ee.room,n=fe.to.room;if(t.swapAt>=0)return fe.swapped?n:e;if(t.kind==="SLICE")return fe.u>=(t.cutAt||.5)?n:e;if(t.kind!=="LIFT")return fe.u<.5?e:n;let i=Rn.alt;for(let o of[e,n]){let a=ce[o];if(a&&i>=a.floor&&i<=a.ceil)return o}let r=e,s=1/0;for(let o of Un.concat(["ZENITH"])){let a=ce[o],l=i<a.floor?a.floor-i:i>a.ceil?i-a.ceil:0;l<s&&(s=l,r=o)}return r}function JI(t,e){let n=mw(),i=fe.to.room,r=ar;if(Mr){let a=Mr;Mr=null,a(!1)}_e.emit("travel:end",{from:fe.from,to:fe.to,kind:fe.path.kind,completed:!1}),n===i&&i!==t.room&&(ut.call(i,"depart"),ut.call(i,"exit",1)),ar=n,ut.ensure(t.room),pw(t.room);for(let a of ut.residents())a!==t.room&&a!==n&&a!==r&&ut.release(a);r&&r!==n&&r!==t.room&&(ut.call(r,"exit",1),Jx(r)),Po(Rn,Ia),qe.renderer&&(Ia.vel.copy(Pe.velocity),Ia.Q.copy(et.Q),Ia.s=et.s);let s={room:n,sub:null,hash:`#/${ce[n].slug}`},o=dw(Ia,s,t,n);return ec=null,Kx(o,s,t,{...e,retargeted:!0,play:!1}),new Promise(a=>{Mr=a})}function Jx(t){ot(Ee.releaseSourceMs,()=>{t===ee.room&&fe.phase!=="transition"||fe.phase==="transition"&&(fe.to.room===t||ar===t)||ut.release(t)})}function Qx(t,e,n){let i=t.hash;try{let r=location.hash;e==="history"?r!==i&&!(r===""&&i==="#/core")&&window.history.replaceState(null,"",i):n||e==="hash"||e==="go"||e==="deeplink"||r===i?window.history.replaceState(null,"",i):window.history.pushState(null,"",i)}catch{}lh=location.hash}function gw(){let t=fe.path,e=fe.from,n=fe.to;if(t.pose(1,ai),jx(ai),Po(ai,Rn),Zx(),La.active=!1,No){QI(t,e,n);return}let i=!tm.has(n.room);tm.add(n.room),Do+=1,ee.room=n.room,ee.route=n,ee.u=0,yn.current=n,fe.phase="idle",fe.scrubbing=!1,fe.u=0;let r=t.kind;qe.renderer&&Cn.setHallLod(n.room),ut.show(n.room,!0),ut.call(n.room,"enter",1),Fi("idle"),ut.call(n.room,"arrive",{first:i,sub:n.sub,kind:r,arrivals:Do});let s=n;n.sub&&ut.call(n.room,"setSub",n.sub,{instant:!0})===!1&&(s=us(`#/${ce[n.room].slug}`),yn.current=s,ee.route=s,th={...th,replace:!0}),qt(qe.datum,"counter",ce[n.room].alt,0),qt(qe.datum,"flashCode",null),qt(qe.datum,"arrive",n.room),qt(qe.chrome,"setRoom",n.room),qt(qe.keyNav,"setNeedle",ce[n.room].alt),qt(qe.keyNav,"setCurrent",n.room),qt(qe.keyNav,"lockTwin"),qe.audio&&!qx("arrivalLock")&&qe.audio.play("arrivalLock",{root:ce[n.room].root}),qt(qe.edges,"twitch"),be.isPhone&&Vr(zr.lock),document.title=Pu(s),Qx(s,th.source,!!th.replace),Y.set("lastRoom",s.hash),r==="DIVE"&&Y.data&&!Y.data.firstDive&&Y.set("firstDive",!0),Da(),yn.lastTravel={kind:r,from:e.hash,to:s.hash,plannedMs:t.duration,ms:pe.at()-im,completed:!0},fe.path=null,_e.emit("room:arrive",{room:n.room,sub:s.sub,first:i,kind:r,arrivals:Do}),_e.emit("route:change",{route:s,prev:e}),_e.emit("travel:end",{from:e,to:s,kind:r,completed:!0}),ee.tier==="T0"&&qe.t0&&qt(qe.t0,"show",s);for(let a of ut.residents())a!==n.room&&Jx(a);let o=Mr;Mr=null,o&&o(!0)}function QI(t,e,n){No=!1;let i=n.room;ee.u=0,fe.phase="idle",fe.scrubbing=!1,fe.u=0,qe.renderer&&Cn.setHallLod(i),ut.show(i,!0),ut.call(i,"enter",1),Fi("idle"),Do+=1,ut.call(i,"arrive",{first:!1,sub:yn.current.sub,kind:t.kind,arrivals:Do}),qt(qe.datum,"counter",ce[i].alt,0),qt(qe.datum,"flashCode",null),qt(qe.datum,"arrive",i),qt(qe.keyNav,"setNeedle",ce[i].alt),qt(qe.keyNav,"setCurrent",i),qt(qe.keyNav,"lockTwin"),qe.audio&&!qx("arrivalLock")&&qe.audio.play("arrivalLock",{root:ce[i].root}),qt(qe.edges,"twitch"),be.isPhone&&Vr(zr.lock),Da(),yn.lastTravel={kind:t.kind,from:e.hash,to:yn.current.hash,plannedMs:t.duration,ms:pe.at()-im,completed:!0},fe.path=null,_e.emit("room:arrive",{room:i,sub:yn.current.sub,first:!1,kind:t.kind,arrivals:Do}),_e.emit("travel:end",{from:e,to:yn.current,kind:t.kind,completed:!0});let r=Mr;Mr=null,r&&r(!0)}function eL(){let t=fe.path,e=fe.from,n=fe.to;t.pose(0,ai),jx(ai),Po(ai,Rn),Zx(),La.active=!1,No=!1,fe.phase="idle",fe.scrubbing=!1,fe.u=0,ee.u=0;let i=ar||e.room;qe.renderer&&Cn.setHallLod(i),ut.call(i,"exit",0),ut.show(i,!0),Fi("idle"),ut.call(i,"arrive",{first:!1,sub:yn.current.sub,kind:"REVERT",arrivals:Do}),qt(qe.datum,"counter",ce[i].alt,0),qt(qe.datum,"arrive",i),qt(qe.keyNav,"setNeedle",ce[i].alt),qt(qe.keyNav,"setCurrent",i),yn.lastTravel={kind:t.kind,from:e.hash,to:n.hash,plannedMs:t.duration,ms:pe.now-im,completed:!1},fe.path=null,_e.emit("travel:end",{from:e,to:n,kind:t.kind,completed:!1}),n.room!==i&&Jx(n.room),Da();let r=Mr;Mr=null,r&&r(!1)}var Bx={speed01:0,pan:0};function $x(t){let e=fe.path;if(e.swapAt>=0&&(!fe.swapped&&t>=e.swapAt?(qe.renderer&&(e.pose(Math.max(0,e.swapAt-1e-6),Ia),et.scaleAbout(e.swapKind==="grow"?1e3:.001,Ia.pivot),ec=et.rebase(e.swapKind)),fe.swapped=!0):fe.swapped&&t<e.swapAt&&(ec&&qe.renderer&&et.unrebase(ec),ec=null,fe.swapped=!1)),e.pose(t,ai),La.active=!0,La.kind=e.kind,e.fx)try{e.fx(t,La)}catch{}jx(ai),No||(ar&&ar!==fe.to.room&&ut.call(ar,"exit",ai.exitU),ut.call(fe.to.room,"enter",ai.enterU)),qt(qe.keyNav,"setNeedle",ai.alt),qe.audio&&qe.audio.setRootU(fe.from.room,fe.to.room,t),qt(qe.datum,"counter",ai.alt,ai.counter),qt(qe.datum,"flashCode",ai.flashCode),tc&&(Bx.speed01=ai.speed01,Bx.pan=ai.pan,tc.set(Bx)),e.cues&&e.cues(t,zx,Wx||qe),!Vx&&t>=Ee.interactiveU&&(Vx=!0,ut.show(fe.to.room),_e.emit("travel:interactive",{to:fe.to})),ee.u=t,fe.u=t,zx=t,Po(ai,Rn)}function tL(t){if(!qe.renderer||ee.phase==="boot"||ee.phase==="start")return;let e=ee.room,n=ut.get(e);if(n&&typeof n.livePose=="function"&&ut.call(e,"livePose",Qp,t)===!0){let i=ce[e].anchor;Qp.pos.add(i),Qp.target.add(i),Pe.setPose(Qp);return}Pe.setPose(Yx)}function nL(t){let e=pe.now,n=e-rh;if(rh=e,Gx&&(Gx=!1,n<0&&(n=0)),fe.phase!=="transition"){La.active=!1,tL(t);return}let i=fe.path.duration,r;if(fe.scrubbing)r=sh;else if(ms==="inertia")r=Dt(fe.u+em*n/1e3),em*=Math.pow(Oi.inertiaDecay,n/Oi.frameMs),(Math.abs(em)<.05||r<=0||r>=1)&&(ms=r<.5?"reverse":"forward",fe.t=Io(r,i));else if(ms==="reverse"){if(fe.t=Math.max(0,fe.t-n*fe.speed),r=vn.camera(fe.t/i),fe.t<=0){$x(0),eL();return}}else fe.t=Math.min(i,fe.t+n*fe.speed),r=vn.camera(fe.t/i);$x(r),!fe.scrubbing&&ms==="forward"&&(fe.t>=i?gw():ev(e))}var nh=0,Xx=0,nm=0,cw=0;function iL(){nh=0,!(Xx!==nm||fe.phase!=="transition"||fe.scrubbing||ms!=="forward"||!fe.path||!pe.running)&&(fe.t=fe.path.duration,$x(1),gw())}function ev(t,e){let n=(fe.path.duration-fe.t)/Math.max(1e-6,fe.speed)-(pe.at()-t);if(n>400&&!e)return;let i=performance.now()+Math.max(0,n);nh&&Xx===nm&&!e&&i>=cw||(nh&&clearTimeout(nh),Xx=nm,cw=i,nh=setTimeout(iL,Math.max(0,n)))}function ih(){if(oh>=0&&(Vn(oh),oh=-1),ah){let t=ah;ah=null,t(!1)}}function uw(t,e,n){yn.current=t,ee.route=t,Qx(t,n.source,!!n.replace),document.title=Pu(t),Y.set("lastRoom",t.hash),Da(),_e.emit("route:change",{route:t,prev:e}),ee.tier==="T0"&&qe.t0&&qt(qe.t0,"show",t)}function rL(t,e){ih();let n=yn.current,i=ut.call(t.room,"setSub",t.sub,{instant:Gt.reducedMotion});if(i===!1||i===void 0){let r=us(`#/${ce[t.room].slug}`);return n.sub&&ut.call(t.room,"setSub",null,{instant:!0}),uw(r,n,{...e,replace:!0}),Promise.resolve(!0)}return new Promise(r=>{ah=r,oh=ot(Math.max(0,+i||0),()=>{oh=-1,ah=null,uw(t,n,e),r(!0)})})}function sL(){lh=location.hash,yn.go(location.hash,{source:"history"})}function oL(){location.hash!==lh&&(lh=location.hash,yn.go(location.hash,{source:"hash"}))}var yn={state:fe,current:null,lastTravel:null,init(t){if(qe=t,t.director=yn,t.halls=ut,t.audio){let e=Object.create(t.audio);e.play=(n,i)=>qx(n)?null:t.audio.play(n,i),Wx=Object.create(t),Wx.audio=e}return QS({restPose:(e,n,i)=>ut.restPose(e,n,i),faceFrame:t.key?(e,n)=>t.key.faceFrame(e,n):null}),yn.current=us("#/core"),ee.room="CORE",ee.route=yn.current,tm.add("CORE"),lh=location.hash,pe.add(nL,zt.DIRECTOR),window.addEventListener("popstate",sL),window.addEventListener("hashchange",oL),_e.on("layout:change",Da),ut.ensure("CORE"),ut.show("CORE",!0),Da(),t.renderer&&ee.phase!=="boot"&&ee.phase!=="start"&&Pe.setPose(Yx),yn},settle(){fe.phase==="transition"||ee.room!=="CORE"||(Da(),ut.call("CORE","enter",1),ut.call("CORE","arrive",{first:!0,sub:null,kind:"BOOT",arrivals:Do}),qt(qe.chrome,"setRoom","CORE"),qt(qe.keyNav,"setCurrent","CORE"),qt(qe.keyNav,"setNeedle",0))},go(t,e={}){try{let n=e.source||"go",i={...e,source:n},r=Xg(us(t),n);r.status&&qt(qe.status,"say",r.status,r.vars||{}),r.shudder&&(qt(qe.keyNav,"shudder",r.shudder),ee.room==="CORE"&&fe.phase!=="transition"&&qe.key&&qe.key.shudder(6));let s=r.route;if(fe.phase==="transition")return s.hash===fe.to.hash?new Promise(a=>{_e.once("travel:end",l=>a(!!l.completed))}):(ih(),JI(s,i));let o=yn.current;return s.hash===o.hash?(ih(),location.hash&&location.hash!==s.hash&&Qx(s,"history",!0),Promise.resolve(!0)):s.room===o.room?rL(s,i):(ih(),lw(s,i))}catch{return Promise.resolve(!1)}},speedUp(){if(!(fe.phase!=="transition"||fe.scrubbing||ms!=="forward")){if(No){let t=fe.path.duration-fe.t;t>Hx&&(fe.speed=Math.max(fe.speed,t/Math.max(1,Hx))),ev(pe.now,!0);return}fe.speed=Ee.skipSpeed}},get playing(){return No},fxOut(){return La},pose(){return Rn},predict(t){return fe.phase!=="transition"||fe.scrubbing||ms!=="forward"||!(t>=fe.t)?null:performance.now()+(t-fe.t)/Math.max(1e-6,fe.speed)},play(t,e={source:"show",skipMs:600}){try{if(!t||typeof t.pose!="function"||fe.phase==="transition")return Promise.resolve(!1);ih();let n=yn.current;t.from||(t.from=n.room),t.to||(t.to=n.room),fw(),ar=n.room,Fi("transition"),ut.call(n.room,"depart"),qt(qe.datum,"depart"),_e.emit("room:depart",{room:n.room,to:n});let i={source:"show",skipMs:600,...e||{},play:!0};return Kx(t,n,n,i),new Promise(r=>{Mr=r})}catch{return Promise.resolve(!1)}},scrub:{begin(t){if(Gt.reducedMotion||ee.tier==="T0"||!qe.renderer)return!1;if(fe.phase==="transition")return fe.scrubbing=!0,sh=fe.u,ms="forward",!0;let e=Xg(us(t),"nav").route;return e.room===yn.current.room?!1:(lw(e,{source:"nav",scrub:!0}),!0)},set(t){fe.phase==="transition"&&fe.scrubbing&&(sh=Dt(t))},end(t=0){fe.phase!=="transition"||!fe.scrubbing||(fe.scrubbing=!1,fe.u=sh,fe.speed=1,em=t||0,ms="inertia")}},altitude(){return fe.phase==="transition"?Rn.alt:(ce[ee.room]||ce.CORE).alt},busy(){return fe.phase==="transition"},logicalSource(){return fe.phase==="transition"?ar:null},logicalRoom(){return fe.phase==="transition"?mw():ee.room}};var tv=0;function aL(t,e){let n=e==null?t.textContent:String(e);t.textContent="";let i=[];for(let r of n){let s=document.createElement("span");s.className="lock-letter",s.textContent=r,t.appendChild(s),i.push(s)}return i}function nv(t,e){return t.style.opacity="0",qn(e,n=>{t.style.opacity=String(n)},vn.reveal).done.then(()=>{t.style.opacity=""})}function xw(t,e={}){if(!t)return Promise.resolve();let n=e.weight||220,i=e.ms||Ee.lockIn;if(Gt.reducedMotion)return nv(t,Ee.lockInReduced);if(tv>=2)return Promise.resolve();tv+=1;let r=t.textContent,s=aL(t,r),o=Y.shrp||28,a=-1,l=c=>{let u=vn.reveal(c),f=Math.round(u*5)/5,h=f!==a?`"SHRP" ${(o*f).toFixed(1)}, "wght" ${Math.round(120+(n-120)*f)}, "CRSV" 0, "slnt" 0`:null;a=f;let d=pe.now/1e3;for(let g=0;g<s.length;g++){let x=s[g].style;h&&(x.fontVariationSettings=h),x.transform=u<1?`translateX(${(Math.sin(17*d+g)*(1-u)*4).toFixed(2)}px)`:""}};return l(0),qn(i,l).done.then(()=>{tv-=1,t.textContent===r&&(t.textContent=r)})}function vw(t,e={}){if(!t)return Promise.resolve();let n=e.msPerChar||Ee.revealMsPerChar,i=e.maxMs||Ee.revealMax;if(Gt.reducedMotion)return nv(t,Ee.lockInReduced);let r=Math.min(i,Math.max(1,t.textContent.length*n));t.classList.add("reveal-mask");let s=o=>{t.style.setProperty("--reveal",`${(o*108).toFixed(1)}%`),t.style.opacity=String(Math.min(1,o*2))};return s(0),qn(r,s).done.then(()=>{t.classList.remove("reveal-mask"),t.style.removeProperty("--reveal"),t.style.opacity=""})}function yw(t,e,n={}){if(!t)return Promise.resolve();let i=n.cps||Ee.beamCps;if(Gt.reducedMotion)return t.textContent=String(e),nv(t,Ee.lockInReduced);t.textContent="";let r=[];for(let c of String(e)){let u=document.createElement("span");u.className="beam-letter",u.textContent=c,t.appendChild(u),r.push(u)}let s=document.getElementById("fx"),o=document.createElement("i");o.className="beam-head",s&&s.appendChild(o);let a=r.map(c=>c.getBoundingClientRect()),l=1e3/i;return new Promise(c=>{let u=0,f=()=>{if(u>=r.length){ot(160,()=>{o.parentNode&&o.parentNode.removeChild(o)}),c();return}let h=a[u];o.style.transform=`translate3d(${(h.right-1.5).toFixed(1)}px, ${(h.bottom-h.height*.2).toFixed(1)}px, 0)`,r[u].classList.add("is-lit"),u+=1,ot(l,f)};f()})}var ht={datum:null,line:null,label:null,title:null,level:null,flash:null,giant:null},ov=null,iv=!1,ch="CORE",uh=!1,_w=null,rm="",av=0,bw=new P,Mw=new P,Sw=new P,lv=!1;function nc(t,e,n,i){let r=document.createElement(t);return r.id=e,n&&(r.className=n),i.appendChild(r),r}function rv(){return ov??(ce[ch]||ce.CORE).giant}function sv(t){ht.giant&&ht.giant.textContent!==t&&(ht.giant.textContent=t)}function lL(){if(!ht.giant||!Pe.camera||uh)return;lv||(bw.copy(Pe.camera.position),lv=!0),Mw.setFromMatrixColumn(Pe.camera.matrixWorld,0);let t=Math.max(.001,Sw.copy(Pe.pose.target).sub(Pe.camera.position).length()),e=Sw.copy(Pe.camera.position).sub(bw).dot(Mw)*Pe.camera.zoom*(be.h/(2*Math.tan(Pe.camera.fov*Math.PI/360)))/t,n=Math.max(-200,Math.min(200,-.25*e));Math.abs(n-av)<.25||(av=n,ht.giant.style.transform=`translate3d(${n.toFixed(1)}px,-50%,0)`)}var hh={init(t){let e=document.getElementById("frame");return ht.giant=document.getElementById("giant"),e&&(ht.datum=document.getElementById("datum")||nc("div","datum","",e),ht.datum.classList.add("is-out"),ht.line=nc("i","datum-line","",ht.datum),ht.label=nc("p","datum-label","t-label",ht.datum),ht.title=nc("h1","datum-title","t-display",ht.datum),ht.level=nc("p","datum-level","t-micro",ht.datum),ht.flash=nc("p","datum-flash","t-label",e),ht.flash.setAttribute("aria-hidden","true"),pe.add(lL,zt.UI)),hh},arrive(t,e={}){ch=ce[t]?t:"CORE";let n=ce[ch];if(!ht.datum)return;let i=ch==="NADIR"&&Y.data&&Y.data.nadirOpen;ht.title.textContent=i&&n.titleOpen?n.titleOpen:n.title,ht.title.dataset.room=ch,ht.label.textContent=`${n.num} · ${n.code}`,ht.level.textContent=`▽ ${n.level}`,ht.datum.classList.remove("is-out"),ht.datum.classList.remove("is-drawn");let r=()=>{ht.datum.classList.add("is-drawn")};e.instant?r():requestAnimationFrame(r),e.instant||xw(ht.title,{weight:220,ms:480}),uh=!1,rm="",lv=!1,av=0,ht.giant&&(ht.giant.classList.remove("is-counter"),ht.giant.style.transform="",sv(rv()),ht.giant.classList.add("is-in"),iv?ht.giant.dataset.electrum="":delete ht.giant.dataset.electrum)},depart(){ht.datum&&ht.datum.classList.add("is-out"),ht.giant&&ht.giant.classList.remove("is-in")},setGiant(t,e={}){ov=t==null?null:String(t),iv=!!e.electrum,!(!ht.giant||uh)&&(sv(rv()),iv?ht.giant.dataset.electrum="":delete ht.giant.dataset.electrum)},counter(t,e){if(!ht.giant)return;let n=e>0;if(n!==uh&&(uh=n,ht.giant.classList.toggle("is-counter",n),n?ht.giant.style.transform="":(rm="",sv(rv()))),!n)return;let i=vy(Math.round(t),0);i!==rm&&(rm=i,ht.giant.textContent=i)},flashCode(t){if(!(!ht.flash||t===_w))if(_w=t,t&&ce[t]){let e=ce[t];ht.flash.textContent=`${e.num} · ${e.code}`,ht.flash.classList.add("is-on")}else ht.flash.classList.remove("is-on")},yPx(){return be.kind==="desktop"?be.h*bt.desktop.datumFrac:bt.phone.datumPx+be.safe.t},setVisible(t){ht.datum&&(ht.datum.hidden=!t),ht.giant&&(ht.giant.hidden=!t)}};var Rw="http://www.w3.org/2000/svg",Ai=[],Na=null,sm=null,fh=new P,cv=new P,gs={x:0,y:0,depth:0,visible:!1},ww=0,om=new Float64Array(64);function Aw(t,e,n){let i=document.createElementNS(Rw,t);return i.setAttribute("class",e),i.dataset.owner=n,i}var Tw=t=>`${t<0?"−":t>0?"+":""}${Math.abs(t).toFixed(2)}`;function cL(t){let e=t.leader||(t.focused?{side:"right",len:40,rise:-24}:null);if(!e||!t.path)return;let n=e.side==="left"?-1:1,i=e.rise||0,r=t.sx+n*Math.abs(i),s=t.sy+i,o=r+n*Math.max(bt.leader.elbowMin,Math.min(bt.leader.runMax,e.len||40));t.path.setAttribute("d",`M${t.sx.toFixed(1)} ${t.sy.toFixed(1)}L${r.toFixed(1)} ${s.toFixed(1)}L${o.toFixed(1)} ${s.toFixed(1)}`),t.endX=o+n*6,t.endY=s}function ic(t,e){if(t.shown===e)return;t.shown=e;let n=e&&(t.el||t.focused);t.el&&t.el.classList.toggle("is-hidden",!e),t.button&&t.button.classList.toggle("is-hidden",!e),t.path&&t.path.classList.toggle("is-hidden",!(n&&(t.leader||t.focused))),t.cross&&t.cross.classList.toggle("is-hidden",!(n&&(t.crossOn||t.focused))),t.coordEl&&t.coordEl.classList.toggle("is-hidden",!(e&&t.coordOn))}function Ew(t){let e=t.shown;t.shown=!e,ic(t,e)}function uL(t){if(!Pe.camera)return;let e=1-Math.exp(-(t*1e3)/120),n=pe.now-ww>=1e3/Ee.coordHz;n&&(ww=pe.now);let i=0;for(let s=0;s<Ai.length;s++){let o=Ai[s];o.get(fh),Pe.project(fh,gs);let a=gs.depth>0||!o.hideBehind;if(o.want=o.visible&&a,!!o.want){if(i++,!o.init||o.lowpass<=0)o.sx=gs.x,o.sy=gs.y,o.init=!0;else{let l=o.lowpass===120?e:1-Math.exp(-(t*1e3)/o.lowpass);o.sx+=(gs.x-o.sx)*l,o.sy+=(gs.y-o.sy)*l}o.screen.x=o.sx,o.screen.y=o.sy,n&&o.coordEl&&(et.toCanonical(fh,cv),o.coordEl.textContent=`x ${Tw(cv.x)} · y ${Tw(cv.y)}`)}}let r=-1/0;if(i>Wr.max){om.length<Ai.length&&(om=new Float64Array(Ai.length*2));let s=0;for(let a=0;a<Ai.length;a++)Ai[a].want&&(om[s++]=Ai[a].priority);r=om.subarray(0,s).sort()[s-Wr.max]}Wr.visibleCount=0;for(let s=0;s<Ai.length;s++){let o=Ai[s],a=o.want&&(o.priority>=r||o.focused);if(o.screen.visible=a,ic(o,a),!a||(Wr.visibleCount++,Math.abs(o.sx-o.wx)<.1&&Math.abs(o.sy-o.wy)<.1))continue;o.wx=o.sx,o.wy=o.sy;let l=o.sx.toFixed(1),c=o.sy.toFixed(1);if(o.button&&(o.button.style.transform=`translate3d(${l}px,${c}px,0)`),o.cross&&o.cross.setAttribute("transform",`translate(${l} ${c})`),o.coordEl&&(o.coordEl.style.transform=`translate3d(${(o.sx+8).toFixed(1)}px,${(o.sy+6).toFixed(1)}px,0)`),cL(o),o.el){let u=o.path&&(o.leader||o.focused)?o.endX:o.sx,f=o.path&&(o.leader||o.focused)?o.endY:o.sy,h=o.leader&&o.leader.side==="left";o.el.style.transform=`translate3d(${u.toFixed(1)}px,${f.toFixed(1)}px,0) translate(${h?"-100%":"0"},-50%)`}}}var Wr={max:24,visibleCount:0,init(t){Na=document.getElementById("overlay"),sm=document.getElementById("leaders");let e=()=>t.app.tier==="T1"||be.isPhone?bt.leader.maxAnchorsLow:bt.leader.maxAnchors;return Wr.max=e(),t.bus.on("tier:change",()=>{Wr.max=e()}),t.bus.on("layout:change",()=>{Wr.max=e();for(let n of Ai)n.wx=NaN}),pe.add(uL,zt.OVERLAY),Wr},add(t){let e=String(t.owner||"anon"),n={owner:e,id:t.id!=null?String(t.id):null,get:t.get,leader:t.leader||null,crossOn:t.cross!=null?!!t.cross:!!t.leader,coordOn:!!t.coord,priority:t.priority||0,lowpass:t.lowpass!=null?t.lowpass:Ee.labelLowpass,hideBehind:t.hideBehind!==!1,visible:!0,want:!1,shown:!0,focused:!1,init:!1,sx:0,sy:0,wx:NaN,wy:NaN,endX:0,endY:0,screen:{x:0,y:0,visible:!1},el:t.el||null,button:null,path:null,cross:null,coordEl:null};if(n.el&&(n.el.classList.add("anchor"),t.scrim!==!1&&n.el.classList.add("scrim"),n.el.dataset.owner=e,n.id&&(n.el.dataset.id=n.id),Na&&Na.appendChild(n.el)),sm){n.path=Aw("path","leader",e),n.path.setAttribute("pathLength","1"),n.cross=Aw("g","cross",e);for(let[s,o,a,l]of[[-3.5,0,3.5,0],[0,-3.5,0,3.5]]){let c=document.createElementNS(Rw,"line");c.setAttribute("x1",s),c.setAttribute("y1",o),c.setAttribute("x2",a),c.setAttribute("y2",l),n.cross.appendChild(c)}sm.appendChild(n.path),sm.appendChild(n.cross)}n.coordOn&&Na&&(n.coordEl=document.createElement("span"),n.coordEl.className="t-micro coord",Na.appendChild(n.coordEl));let i=s=>{n.focused=s,n.cross&&n.cross.classList.toggle("focus",s),n.path&&n.path.classList.toggle("focus",s),n.wx=NaN,Ew(n)};if(t.button&&Na){let s=document.createElement("button");s.type="button",s.className="proxy",s.dataset.owner=e,n.id&&(s.dataset.id=n.id),s.setAttribute("aria-label",t.button.label||""),t.button.size&&t.button.size>44&&(s.style.width=`${t.button.size}px`,s.style.height=`${t.button.size}px`,s.style.margin=`${-t.button.size/2}px 0 0 ${-t.button.size/2}px`);let o=t.button;s.addEventListener("click",()=>{typeof n.onActivate=="function"&&n.onActivate()}),s.addEventListener("focus",()=>{i(!0),n.onFocus&&n.onFocus()}),s.addEventListener("blur",()=>{i(!1),n.onBlur&&n.onBlur()}),n.onActivate=o.onActivate,n.onFocus=o.onFocus||null,n.onBlur=o.onBlur||null,Na.appendChild(s),n.button=s}n.shown=!1,ic(n,!1),ic(n,!0),Ai.push(n);let r={el:n.el,button:n.button,screen:n.screen,setVisible(s){if(n.visible=!!s,!s){ic(n,!1);return}n.shown||!Pe.camera||(n.get(fh),Pe.project(fh,gs),(gs.depth>0||!n.hideBehind)&&(n.init||(n.sx=gs.x,n.sy=gs.y,n.init=!0),n.wx=NaN,ic(n,!0),n.button&&(n.button.style.transform=`translate3d(${n.sx.toFixed(1)}px,${n.sy.toFixed(1)}px,0)`)))},setAlpha(s){let o=String(Math.max(0,Math.min(1,s)));n.el&&(n.el.style.opacity=o),n.path&&(n.path.style.opacity=o)},drawIn(s=Ee.leaderDraw){return n.el&&n.el.classList.add("is-pending"),n.path&&(n.path.classList.remove("is-drawing"),n.path.style.strokeDasharray="1",n.path.style.strokeDashoffset="1"),new Promise(o=>{requestAnimationFrame(()=>{n.path&&(n.path.classList.add("is-drawing"),n.path.style.transitionDuration=`${s}ms`,n.path.style.strokeDashoffset="0"),ot(s,()=>{n.el&&n.el.classList.remove("is-pending"),o()})})})},update(s){"leader"in s&&(n.leader=s.leader||null),"cross"in s&&(n.crossOn=!!s.cross),"coord"in s&&(n.coordOn=!!s.coord),s.button&&n.button&&(s.button.label!=null&&n.button.setAttribute("aria-label",s.button.label),s.button.onActivate&&(n.onActivate=s.button.onActivate)),"priority"in s&&(n.priority=s.priority||0),n.wx=NaN,Ew(n)},remove(){let s=Ai.indexOf(n);s>=0&&Ai.splice(s,1);for(let o of[n.el,n.button,n.path,n.cross,n.coordEl])o&&o.parentNode&&o.parentNode.removeChild(o)}};return n.api=r,r},clear(t){for(let e=Ai.length-1;e>=0;e--)Ai[e].owner===t&&Ai[e].api.remove()}};var hv=new Set,Wn=null,uv=null,rc=null,xs=null,Mn={id:-1,y0:0,t0:0,y:0,t:0,h:0,base:0,moved:!1};function sc(t){if(Sr.state!==t){Sr.state=t,Wn&&(Wn.dataset.state=t);for(let e of hv)try{e(t)}catch{}}}function hL(t,e){return t==="full"?0:t==="peek"?Math.max(0,e-120):e}function fL(t){if(Sr.state==="closed"||Mn.id>=0||be.kind==="phone-land"||Sr.state==="full"&&xs&&xs.contains(t.target)&&xs.scrollTop>0)return;let e=Wn.getBoundingClientRect();Mn.id=t.pointerId,Mn.y0=Mn.y=t.clientY,Mn.t0=Mn.t=t.timeStamp,Mn.h=e.height,Mn.base=hL(Sr.state,e.height),Mn.moved=!1}function dL(t){if(t.pointerId!==Mn.id)return;let e=t.clientY-Mn.y0;if(!Mn.moved&&Math.abs(e)<Wi.SLOP_PX)return;if(!Mn.moved){Mn.moved=!0,Wn.classList.add("is-dragging");try{Wn.setPointerCapture(t.pointerId)}catch{}}Mn.y=t.clientY,Mn.t=t.timeStamp;let n=Math.max(0,Math.min(Mn.h,Mn.base+e));Wn.style.transform=`translateY(${n.toFixed(1)}px)`}function Cw(t){if(t.pointerId!==Mn.id||(Mn.id=-1,!Mn.moved))return;Wn.classList.remove("is-dragging"),Wn.style.transform="";let e=Mn.y-Mn.y0,n=e/Math.max(1,Mn.t-Mn.t0);(Math.abs(e)>=40||Math.abs(n)>=Wi.SWIPE_V)&&(e>0?sc(Sr.state==="full"?"peek":"closed"):Sr.state==="peek"&&sc("full"))}var Sr={state:"closed",init(t){let e=document.getElementById("sheets");return e&&(Wn=document.createElement("section"),Wn.id="sheet",Wn.className="sheet",Wn.dataset.state="closed",uv=document.createElement("div"),uv.className="sheet-handle",rc=document.createElement("div"),rc.className="sheet-peek",xs=document.createElement("div"),xs.className="sheet-body",Wn.append(uv,rc,xs),e.appendChild(Wn),Wn.addEventListener("pointerdown",fL),Wn.addEventListener("pointermove",dL),Wn.addEventListener("pointerup",Cw),Wn.addEventListener("pointercancel",Cw)),Sr},set(t,e={}){if(Wn){if(rc.textContent="",xs.textContent="",xs.scrollTop=0,e.peek&&rc.appendChild(e.peek),t&&xs.appendChild(t),!t&&!e.peek){sc("closed");return}sc(e.state==="full"?"full":e.state==="closed"?"closed":"peek")}},open(t="peek"){Wn&&(rc.firstChild||xs.firstChild)&&sc(t==="full"?"full":"peek")},close(){sc("closed")},onChange(t){return hv.add(t),()=>hv.delete(t)}};var fv="http://www.w3.org/2000/svg",dv=new Float32Array(8),vv=new Float32Array(8),ac=null,ph=[],am=0,Pw=-1e9,pv=!1,Lw=!0,lm=0,cm=null,mv=null,fm=null,li=null,oc=null,dh=0,um=null,gv="";function Oa(t,e,n,i,r){let s=document.createElement(t);return e&&(s.className=e),r&&(s.id=r),n!=null&&(s.textContent=n),i&&i.appendChild(s),s}var xv=t=>String(t).padStart(2,"0");function hm(t){let e=document.getElementById(t);return e?(e.classList.remove("ff-c"),e.classList.add("corner","corner--dim"),e.textContent="",e):null}function Iw(t){Lw=t,Sn.el.sound&&Sn.el.sound.setAttribute("aria-pressed",t?"true":"false"),fm&&(fm.textContent=t?"ЗВУК":"ТИХО")}function pL(){am&&Vn(am);let t=new Date(Ss());am=ot((60-t.getSeconds())*1e3-t.getMilliseconds()+20,()=>{am=0,Sn.refresh()})}function mL(){if(!ph.length||pe.now-Pw<1e3/bt.sound.fps)return;Pw=pe.now;let t=ac&&ac.audio;t&&Lw?t.levels(dv):dv.fill(0);let e=bt.sound.h;for(let n=0;n<8;n++){let i=Math.max(1,Math.round(dv[n]*e*2)/2);i!==vv[n]&&(vv[n]=i,ph[n].setAttribute("y",String(e-i)),ph[n].setAttribute("height",String(i)))}}var Sn={el:{tl:null,tlName:null,tlMicro:null,tr:null,sound:null,bl:null,br:null},init(t){ac=t;let e=Sn.el;if(e.tl=hm("c-tl"),e.tl&&(e.tlName=Oa("span","t-label","SAM.VIN",e.tl,"c-tl-name"),e.tlMicro=Oa("span","t-micro","",e.tl,"c-tl-micro")),e.tr=hm("c-tr"),e.tr){let n=Oa("button","",null,e.tr,"sound");n.type="button",n.setAttribute("aria-label","Звук"),fm=Oa("span","t-label","ЗВУК",n,"sound-label");let i=document.createElementNS(fv,"svg");i.setAttribute("class","sound-wave"),i.setAttribute("viewBox",`0 0 ${bt.sound.w} ${bt.sound.h}`),i.setAttribute("aria-hidden","true"),ph=[];for(let s=0;s<8;s++){let o=document.createElementNS(fv,"rect");o.setAttribute("class","bar"),o.setAttribute("x",String(s*4+.5)),o.setAttribute("width","2"),o.setAttribute("y",String(bt.sound.h-1)),o.setAttribute("height","1"),vv[s]=1,i.appendChild(o),ph.push(o)}let r=document.createElementNS(fv,"line");r.setAttribute("class","flat"),r.setAttribute("x1","0"),r.setAttribute("x2",String(bt.sound.w)),r.setAttribute("y1",String(bt.sound.h-.5)),r.setAttribute("y2",String(bt.sound.h-.5)),i.appendChild(r),n.appendChild(i),n.addEventListener("click",()=>{t.audio&&t.audio.toggle()}),e.sound=n}return e.bl=hm("c-bl"),e.bl&&e.bl.classList.add("t-micro"),e.br=hm("c-br"),e.br&&(e.br.classList.add("t-micro"),cm=Oa("span","found-count","",e.br),mv=Oa("span","rank","",e.br)),Iw(!(Y.data&&Y.data.sound==="off")),_e.on("sound:change",n=>Iw(!!n.on)),_e.on("rank:change",()=>Sn.refresh()),_e.on("visibility",n=>{n.hidden||Sn.refresh()}),Sn.setRoom("CORE"),Sn.refresh(),pe.add(mL,zt.UI),Sn},setRoom(t){let e=ce[t]||ce.CORE;gv=`${e.code} · ▽ ${e.level}`,Sn.el.tlMicro&&um==null&&(Sn.el.tlMicro.textContent=gv)},setTLVerb(t,e={fadeMs:240}){let n=Sn.el.tl;if(!n)return;let i=e&&e.fadeMs!=null?e.fadeMs:240;if(dh&&(Vn(dh),dh=0),t&&typeof t=="object")oc=t,li||(li=Oa("button","verb t-label",null,n,"c-tl-verb"),li.type="button",li.style.pointerEvents="auto",li.addEventListener("click",()=>{oc&&typeof oc.onActivate=="function"&&oc.onActivate()}),li.style.opacity="0"),li.textContent=String(t.label||""),t.qa?li.setAttribute("data-qa",String(t.qa)):li.removeAttribute("data-qa"),li.hidden=!1,li.style.transition=`opacity ${i}ms linear`,li.offsetWidth,li.style.opacity="1";else if(li){oc=null,li.style.transition=`opacity ${i}ms linear`,li.style.opacity="0";let r=li;dh=ot(i,()=>{dh=0,oc||(r.hidden=!0)})}},setTLMicro(t){um=t==null?null:String(t),Sn.el.tlMicro&&(Sn.el.tlMicro.textContent=um??gv)},refresh(){let t=Sn.el;if(t.bl){if(pv)t.bl.textContent="РЕЖИМ ЧЕРТЕЖА";else{let e=new Date(Ss());t.bl.textContent=`ДЕНЬ ${Y.distinctDays|0} · УЗЛОВ ${Y.litNodes|0} · ${xv(e.getHours())}:${xv(e.getMinutes())}`}pL()}if(cm){let e=ac&&ac.secrets?ac.secrets.count():Object.keys(Y.data&&Y.data.found||{}).length;cm.textContent=`НАЙДЕНО ${xv(Math.min(99,e))} / ??`,mv.textContent=Y.data?Y.rank().name:""}},typeIn(t=Ee.typeMsPerChar){let e=Sn.el,n=[e.tlName,e.tlMicro,fm,e.bl&&!pv?e.bl:null,cm,mv].filter(Boolean),i=n.map(s=>s.textContent),r=Math.max(1,...i.map(s=>s.length));for(let s of n)s.textContent="";return qn(r*t,s=>{let o=Math.round(s*r);for(let a=0;a<n.length;a++){let l=i[a].slice(0,o);n[a].textContent!==l&&(n[a].textContent=l)}}).done.then(()=>{for(let s=0;s<n.length;s++)n[s].textContent=i[s]})},assemble(t=Ee.assemble){let e=Sn.el;for(let n of[e.tl,e.tr,e.bl,e.br])n&&(n.style.transitionDuration=`${t}ms`,n.classList.remove("corner--dim"));return new Promise(n=>ot(t,n))},relockFound(){Sn.refresh();let t=Sn.el.br;t&&(t.classList.add("is-relock"),lm&&Vn(lm),lm=ot(Ee.statusIn,()=>{lm=0,t.classList.remove("is-relock")}))},setT0Marker(t){pv=!!t,Sn.refresh()}};var lr=null,Fa=null,lc=null,qs=0,yv=0,cc=null;function _v(){qs=0,lr&&lr.classList.remove("is-in");let t=cc;cc=null,t&&ot(240,t)}var mh={init(t){let e=document.getElementById("frame");return lr=document.getElementById("lead"),!lr&&e&&(lr=document.createElement("div"),lr.id="lead",lr.className="scrim",e.appendChild(lr)),lr&&(Fa=document.getElementById("lead-text")||lr.appendChild(document.createElement("p")),Fa.id="lead-text",Fa.className="t-lead",lc=document.getElementById("lead-micro")||lr.appendChild(document.createElement("p")),lc.id="lead-micro",lc.className="t-micro",lc.hidden=!0),mh},show(t,e={}){if(!lr)return Promise.resolve();let n=e.ms!=null?e.ms:Ee.leadDefault;if(qs&&(Vn(qs),qs=0),cc){let s=cc;cc=null,s()}let i=++yv;Fa.className=e.cls||"t-lead",lc.textContent=e.micro?String(e.micro):"",lc.hidden=!e.micro,lr.classList.add("is-in");let r=new Promise(s=>{cc=s});return e.beam?yw(Fa,String(t),{}).then(()=>{i===yv&&(qs=ot(n,_v))}):(Fa.textContent=String(t),vw(Fa),qs=ot(n,_v)),r},hide(){qs&&(Vn(qs),qs=0),yv++,_v()}};var Dw="http://www.w3.org/2000/svg",Uo=[],bv=null,Mv=null,Nw=new P,Ow=new P,Oo={x:0,y:0,depth:0,visible:!1},Fo={x:0,y:0,depth:0,visible:!1},dm=bt.dims,Qt=t=>t.toFixed(1);function gL(t){if(t.a(Nw),t.b(Ow),Pe.project(Nw,Oo),Pe.project(Ow,Fo),Oo.depth<=0||Fo.depth<=0)return!1;let e=Fo.x-Oo.x,n=Fo.y-Oo.y,i=Math.hypot(e,n);if(i<8)return!1;e/=i,n/=i;let r=-n,s=e,o=t.side;(o==="left"&&r>0||o==="right"&&r<0||o==="above"&&s>0||o==="below"&&s<0)&&(r=-r,s=-s);let a=t.offset,l=Oo.x+r*a,c=Oo.y+s*a,u=Fo.x+r*a,f=Fo.y+s*a,h=(l+u)/2,d=(c+f)/2,g=Math.min(i/2-2,t.gapHalf),x=dm.arrowPx,m=dm.extPx,p=`M${Qt(Oo.x+r*4)} ${Qt(Oo.y+s*4)}L${Qt(l+r*m)} ${Qt(c+s*m)}M${Qt(Fo.x+r*4)} ${Qt(Fo.y+s*4)}L${Qt(u+r*m)} ${Qt(f+s*m)}M${Qt(l)} ${Qt(c)}L${Qt(h-e*g)} ${Qt(d-n*g)}M${Qt(h+e*g)} ${Qt(d+n*g)}L${Qt(u)} ${Qt(f)}M${Qt(l+(e*.866-n*.5)*x)} ${Qt(c+(n*.866+e*.5)*x)}L${Qt(l)} ${Qt(c)}L${Qt(l+(e*.866+n*.5)*x)} ${Qt(c+(n*.866-e*.5)*x)}M${Qt(u-(e*.866-n*.5)*x)} ${Qt(f-(n*.866+e*.5)*x)}L${Qt(u)} ${Qt(f)}L${Qt(u-(e*.866+n*.5)*x)} ${Qt(f-(n*.866-e*.5)*x)}`;return p!==t.lastD&&(t.lastD=p,t.path.setAttribute("d",p)),t.label.style.transform=`translate3d(${Qt(h)}px,${Qt(d)}px,0) translate(-50%,-50%)`,!0}function xL(){if(Pe.camera)for(let t=0;t<Uo.length;t++){let e=Uo[t],n=e.visible&&gL(e);n!==e.shown&&(e.shown=n,e.g.classList.toggle("is-hidden",!n),e.label.classList.toggle("is-hidden",!n))}}var pm={init(t){return bv=document.getElementById("leaders"),Mv=document.getElementById("overlay"),pe.add(xL,zt.OVERLAY),pm},add(t){let e=String(t.owner||"anon"),n=document.createElementNS(Dw,"g");n.setAttribute("class","dim is-hidden"),n.dataset.owner=e;let i=document.createElementNS(Dw,"path");i.setAttribute("pathLength","1"),n.appendChild(i);let r=document.createElement("span");r.className="t-micro dim-label is-hidden",r.dataset.owner=e,bv&&bv.appendChild(n),Mv&&Mv.appendChild(r);let s={owner:e,a:t.a,b:t.b,side:t.side||"right",offset:t.offset!=null?t.offset:dm.offsetPx,g:n,path:i,label:r,visible:!0,shown:!1,lastD:"",gapHalf:0},o=l=>{r.textContent=String(l||""),s.gapHalf=(r.textContent.length*6.2+2*dm.gapPx)/2};o(t.label),Uo.push(s);let a={setVisible(l){s.visible=!!l},drawIn(l=Ee.dimsDraw){return i.classList.remove("is-drawing"),i.style.strokeDasharray="1",i.style.strokeDashoffset="1",r.style.opacity="0",new Promise(c=>{requestAnimationFrame(()=>{i.classList.add("is-drawing"),i.style.transitionDuration=`${l}ms`,i.style.strokeDashoffset="0",ot(l,()=>{r.style.opacity="",c()})})})},setLabel:o,remove(){let l=Uo.indexOf(s);l>=0&&Uo.splice(l,1),n.parentNode&&n.parentNode.removeChild(n),r.parentNode&&r.parentNode.removeChild(r)}};return s.api=a,a},clear(t){for(let e=Uo.length-1;e>=0;e--)Uo[e].owner===t&&Uo[e].api.remove()}};var Sv="http://www.w3.org/2000/svg",cr=[0,1,2,3].map(t=>({i:t,el:null,svg:null,sp:_r.from(mM.struck,0),at:0,flash:0,lastD:""})),js=null,wv=null,gm=14,uc=NaN,gh=NaN,xh=!0,ko=t=>t.toFixed(1);function Uw(){return gm+12}function vL(t,e){let n=be.w,i=be.h,r=gm,s=Uw(),o=2*(t.sp.x+e);switch(t.i){case 0:return`M${r} ${r}Q${ko(t.at)} ${ko(r+o)} ${n-r} ${r}`;case 2:return`M${r} ${s-r}Q${ko(t.at)} ${ko(s-r-o)} ${n-r} ${s-r}`;case 1:return`M${s-r} ${r}Q${ko(s-r-o)} ${ko(t.at)} ${s-r} ${i-r}`;default:return`M${r} ${r}Q${ko(r+o)} ${ko(t.at)} ${r} ${i-r}`}}function yL(){let t=be.w,e=be.h,n=Uw();for(let i of cr){if(!i.svg)continue;let r=i.i%2===0,s=r?t:n,o=r?n:e;i.svg.setAttribute("viewBox",`0 0 ${s} ${o}`),i.svg.setAttribute("width",String(s)),i.svg.setAttribute("height",String(o)),i.svg.style.transform=`translate3d(${i.i===1?t-n:0}px,${i.i===2?e-n:0}px,0)`}}function mm(t,e,n,i){t.flash&&Vn(t.flash),t.at=e,t.sp.x=n*Math.min(bt.edge.bendPx,3+i*4),t.sp.v=0,t.sp.target=0,t.el.classList.add("is-flash"),t.flash=ot(Ee.stringFlash,()=>{t.flash=0,t.el.classList.remove("is-flash")});let r=wv&&wv.audio;r&&r.play("stringPluck",{root:(ce[ee.room]||ce.CORE).root})}function _L(t){let e=t.x,n=t.y;if(Number.isFinite(uc)&&xh){let i=Math.hypot(t.vx,t.vy);if(i>bt.edge.pluckPxMs){let r=be.w,s=be.h,o=gm,a=be.isPhone;(gh-o)*(n-o)<0&&mm(cr[0],e,n>gh?1:-1,i),(gh-(s-o))*(n-(s-o))<0&&mm(cr[2],e,n<gh?1:-1,i),!a&&(uc-(r-o))*(e-(r-o))<0&&mm(cr[1],n,e<uc?1:-1,i),!a&&(uc-o)*(e-o)<0&&mm(cr[3],n,e>uc?1:-1,i)}}uc=e,gh=n}function bL(t){if(!js||!xh)return;let e=.2*(Ln.value-.5)*2*Ln.amp;for(let n=0;n<4;n++){let i=cr[n];(i.sp.x!==0||i.sp.v!==0)&&(i.sp.step(t),Math.abs(i.sp.x)<.01&&Math.abs(i.sp.v)<.05&&i.sp.snap(0));let r=vL(i,e);r!==i.lastD&&(i.lastD=r,i.el.setAttribute("d",r))}}function Fw(){gm=be.isPhone?bt.phone.edgeInset:bt.desktop.edgeInset;for(let t of cr)t.at=(t.i%2===0?be.w:be.h)/2,t.lastD="";yL()}var vh={init(t){wv=t;let e=document.getElementById("frame");if(!e)return vh;js=document.createElementNS(Sv,"svg"),js.id="edges",js.setAttribute("aria-hidden","true");for(let n of cr)n.svg=document.createElementNS(Sv,"svg"),n.svg.setAttribute("class","edge-strip"),n.el=document.createElementNS(Sv,"path"),n.el.setAttribute("class","edge"),n.el.setAttribute("pathLength","1"),n.svg.appendChild(n.el),js.appendChild(n.svg);return e.insertBefore(js,e.firstChild),Fw(),t.bus.on("layout:change",Fw),t.input.observe(_L),pe.add(bL,zt.UI),vh},drawIn(t=Ee.drawIn){if(!js)return Promise.resolve();for(let e of cr)e.el.style.transition="none",e.el.style.strokeDasharray="1",e.el.style.strokeDashoffset="1";return new Promise(e=>{requestAnimationFrame(()=>{for(let n of cr)n.el.style.transition=`stroke-dashoffset ${t}ms cubic-bezier(.16,1,.3,1)`,n.el.style.strokeDashoffset="0";ot(t,()=>{for(let n of cr)n.el.style.transition="",n.el.style.strokeDasharray="",n.el.style.strokeDashoffset="";e()})})})},twitch(t=bt.edge.twitchPx){for(let e of cr)e.sp.x=t,e.sp.v=0,e.sp.target=0},setVisible(t){xh=!!t,js&&js.classList.toggle("is-off",!xh);for(let e of cr)e.el&&e.el.classList.toggle("is-off",!xh)}};var Bo=null,vm=!1,kw=!1,Bw=!0,Av=null;function xm(){let t=Bw&&vm&&!be.isPhone;t===kw||!Bo||(kw=t,Bo.classList.toggle("is-on",t))}var yh={init(t){let e=document.getElementById("fx"),n=document.getElementById("gl");return e&&(Bo=document.createElement("i"),Bo.id="cursor",e.appendChild(Bo),n&&(n.addEventListener("pointerover",i=>{(i.pointerType==="mouse"||i.pointerType==="pen")&&(vm=!0,xm())}),n.addEventListener("pointerout",()=>{vm=!1,xm()}),n.addEventListener("pointerdown",i=>{i.pointerType==="touch"&&(vm=!1,xm())})),t.input.observe(i=>{i.type!=="touch"&&(Bo.style.transform=`translate3d(${i.x}px,${i.y}px,0)`)})),yh},setVisible(t){Bw=!!t,xm()},setColor(t){Av=t&&t!=="ember"?t:null,Bo&&(Bo.style.boxShadow=Av?`inset 0 0 0 1px var(--${Av})`:"")}};var ML="http://www.w3.org/2000/svg",Vo=["S","A","M","•","V","I","N"],gn=new Float64Array(7),wr=Un.map(t=>ce[t].alt),Xn=null,Pn="desktop",Er=56,$n=300,en=null,fc=null,Xi=null,$w=null,_m=null,Js=null,Xw=null,Ks=null,bh=null,pc=null,ur=null,Ev=null,Tr=[],dc=[],_h="CORE",Mh=0,Rv=NaN,ym=-1,zw=!1,hc=0,Vw=-1e9,zo=new _r(8,.25,0),Mm=!1,Yw=0,$r=new _r(12,1,0),Cv=0;function SL(){if(Pn=be.kind==="desktop"?"desktop":be.kind==="phone"?"phone":"land",Pn==="desktop"){Er=bt.nav.w,$n=bt.nav.h;for(let t=0;t<7;t++)gn[t]=$n/2-wr[t]/1e3*($n/2.4)}else if(Pn==="phone"){Er=Math.max(100,be.w-32),$n=bt.band.h;for(let t=0;t<7;t++)gn[t]=16+(t+.5)*Er/7}else{Er=bt.band.sideW,$n=Math.max(100,be.h-32);for(let t=0;t<7;t++)gn[t]=16+(t+.5)*$n/7}}function wm(t){if(t>=wr[0])return gn[0]+(t-wr[0])*(gn[1]-gn[0])/(wr[1]-wr[0]);for(let e=1;e<7;e++)if(t>=wr[e])return gn[e]+(t-wr[e])*(gn[e-1]-gn[e])/(wr[e-1]-wr[e]);return gn[6]+(t-wr[6])*(gn[6]-gn[5])/(wr[6]-wr[5])}var Sh=t=>t==="WORKSHOP"?2:Un.indexOf(t);function wh(t){let e=0;for(let n=1;n<7;n++)Math.abs(t-gn[n])<Math.abs(t-gn[e])&&(e=n);return e}function wL(t){let e=[];for(let i=0;i<2;i++)for(let r=0;r<=4;r++){let s=i===0?r/4:1-r/4,o=t.top+(t.bot-t.top)*s,a=t.top>0&&t.bot<0&&r===4/2?.62:It(o),l,c;if(Pn==="desktop")l=$n/2-o*($n/2.4),c=a*($n/2.4)*bt.nav.widthScale;else{let h=(Pn==="phone"?Er:$n)/7;l=t.i*h+h*s,c=a/.62*((Pn==="phone"?$n:Er)*.36)}let u=i===0?1:-1,f=Pn==="phone"?$n/2:Er/2;e.push(Pn==="phone"?`${l.toFixed(1)} ${(f-u*c).toFixed(1)}`:`${(f+u*c).toFixed(1)} ${l.toFixed(1)}`)}return`M${e.join("L")}Z`}function AL(){let t=Zt[6],e=_c(7),n=[];for(let i=0;i<5;i++){let r=.1+.2*i,s="";for(let o=0;o<=4;o++){let a=t.top+(t.bot-t.top)*(o/4),l=It(a),c=(r-.5+(e()-.5)*.15)*2*l,u,f;if(Pn==="desktop")f=$n/2-a*($n/2.4),u=Er/2+c*($n/2.4)*bt.nav.widthScale;else if(Pn==="phone"){let h=Er/7;u=6*h+h*(o/4),f=$n/2+c/.62*$n*.36}else{let h=$n/7;f=6*h+h*(o/4),u=Er/2+c/.62*Er*.36}s+=`${o?"L":"M"}${u.toFixed(1)} ${f.toFixed(1)}`}n.push(s)}return n.join("")}function Gw(){SL(),fc.setAttribute("viewBox",`0 0 ${Er.toFixed(1)} ${$n.toFixed(1)}`);for(let e=0;e<7;e++)dc[e].setAttribute("d",wL(Zt[e]));Xi.setAttribute("d",AL());let t=Pn==="desktop";for(let e=0;e<7;e++)Tr[e].style.top=t?`${gn[e].toFixed(1)}px`:"";Ks.style.top=t?`${(gn[6]+12).toFixed(1)}px`:"",pc.style.top=t?`${gn[3].toFixed(1)}px`:"",Rv=NaN}function qw(){let t=Mm?zo.x:wm(Mh);return t+=$r.x+Cv,t}function Hw(t,e){t.style.transform=Pn==="phone"?`translate3d(${(e-.5).toFixed(1)}px,0,0)`:`translate3d(0,${(e-.5).toFixed(1)}px,0)`}function TL(t){if(!en)return;Mm&&(zo.step(t),pe.now>Yw&&(zo.target=wm(Mh),Math.abs(zo.x-zo.target)<.3&&Math.abs(zo.v)<2&&(Mm=!1))),($r.x!==0||$r.v!==0)&&($r.step(t),$r.target===0&&Math.abs($r.x)<.05&&Math.abs($r.v)<.5&&$r.snap(0));let e=qw();Math.abs(e-Rv)<.05||(Rv=e,Hw($w,e),Js&&Hw(Js,e))}function Ua(t,e,n,i){let r=Tr[t];r&&(r["_"+e]&&Vn(r["_"+e]),r.setAttribute(e,e==="data-glint"?i||"electrum":""),r["_"+e]=ot(n,()=>{r["_"+e]=0,r.removeAttribute(e)}))}function Tv(){let t=!!(Y.data&&Y.data.nadirOpen),e=Tr[6],n=ce.NADIR;e.setAttribute("aria-label",t?n.nameOpen:n.name),e.querySelector(".kn-name").textContent=t?n.nameOpen:n.name;let i=Y.data?Y.data.shards|0:0;e.querySelector(".kn-level").textContent=t?`▽ ${n.giant}`:"●".repeat(i)+"○".repeat(5-i)}function Iv(t){if(t!==ym){if(ym>=0&&Tr[ym].classList.remove("is-hot"),ym=t,t<0){_m.classList.remove("is-on");return}Tr[t].classList.add("is-hot"),_m.style.transform=`translate3d(0,${(gn[t]-.5).toFixed(1)}px,0)`,_m.classList.add("is-on"),Xn.audio&&Xn.audio.play("hoverTick",{x:be.w-52})}}function Sm(t){Pn!=="desktop"&&(t=!1),t!==zw&&(zw=t,t?en.setAttribute("data-expanded",""):(en.removeAttribute("data-expanded"),Iv(-1)))}var Lv=t=>`#/${ce[t].slug}`;function Pv(t,e="nav"){Xn.director&&Xn.director.go(Lv(Un[t]),{source:e})}function EL(){let t=Xn.director;return t&&t.busy()&&t.state.to?t.state.to.room:ee.room}function RL(t){if(t.preventDefault(),Pn!=="desktop")return;let e=t.deltaY;if(t.deltaMode===1?e*=16:t.deltaMode===2&&(e*=be.h),(pe.now-Vw>600||Math.sign(e)!==Math.sign(hc))&&(hc=0),Vw=pe.now,hc+=e,Math.abs(hc)<bt.nav.wheelPxPerDetent)return;let n=Math.sign(hc);hc=0;let i=Ro(EL(),n);i&&(Xn.audio&&Xn.audio.play("tick",{}),Xn.director.go(Lv(i),{source:"nav"}))}var me={id:-1,row:-1,x0:0,y0:0,p0:0,left:0,top:0,moved:!1,mode:null,done:!1,timers:[],v:0,lastP:0,lastT:0,target:-1,from:0,u0:0,pull:0,pullTimer:0,mapDy:0};function Dv(t){return Pn==="phone"?t.clientX-me.left:t.clientY-me.top}var bm=(t,e)=>setTimeout(e,t);function Nv(){for(let t of me.timers)clearTimeout(t);me.timers.length=0,me.pullTimer&&(clearTimeout(me.pullTimer),me.pullTimer=0)}function Am(){pc.classList.remove("is-on"),ur.style.transition="none",ur.style.strokeDashoffset="1"}function CL(t){if(me.id>=0||t.pointerType==="mouse"&&t.button!==0)return;let e=en.getBoundingClientRect();me.id=t.pointerId,me.left=e.left,me.top=e.top,me.x0=t.clientX,me.y0=t.clientY,me.moved=!1,me.mode=null,me.done=!1,me.v=0,me.target=-1,me.p0=me.lastP=Dv(t),me.lastT=t.timeStamp,me.row=wh(me.p0),Math.abs(me.p0-gn[me.row])>30&&(me.row=-1);try{en.setPointerCapture(t.pointerId)}catch{}me.row===3?(me.timers.push(bm(Ee.relaunchRingDelay,()=>{pc.classList.add("is-on"),ur.style.transition="none",ur.style.strokeDashoffset="1",requestAnimationFrame(()=>{ur.style.transition=`stroke-dashoffset ${Ee.relaunch-Ee.relaunchRingDelay}ms linear`,ur.style.strokeDashoffset="0"})})),me.timers.push(bm(Ee.relaunch,()=>{me.done=!0,Am(),Vr(zr.lock),ee.room!=="CORE"&&Xn.director&&Xn.director.go("#/core",{source:"nav"}),_e.emit("relaunch",{})}))):me.row>=0&&me.timers.push(bm(Ee.longPress,()=>{me.done=!0,Xn.hint&&Xn.hint.swing()}))}function PL(t,e,n){Nv(),Am();let i=Pn==="phone"?e:n,r=Pn==="phone"?n:e;if(me.row===0&&i<0&&Math.abs(i)>=Math.abs(r)*.5){me.mode="pull";return}if(Pn==="phone"&&n<0&&Math.abs(n)>Math.abs(e)){me.mode="map";return}let s=Xn.director;if(!s){me.mode="none";return}let o=Dv(t);if(s.busy()){if(!s.scrub.begin(s.state.to.hash)){me.mode="detent";return}me.target=Sh(s.state.to.room),me.from=o,me.u0=s.state.u,me.mode="scrub";return}let a=wm(ce[ee.room].alt),l=Math.sign(o-a)||Math.sign(i)||1,c=wh(o);if((c===Sh(ee.room)||Math.abs(o-a)<12)&&(c=Sh(ee.room)+l),c<0||c>6){me.mode="none";return}if(me.target=c,me.from=a,me.u0=0,!s.scrub.begin(Lv(Un[c]))){me.mode="detent";return}me.mode="scrub"}function IL(t){let e=gn[me.target]-me.from;return Math.abs(e)<1?1:Math.max(0,Math.min(1,me.u0+(t-me.from)/e*(1-me.u0)))}function LL(t){if(t.pointerId!==me.id){Pn==="desktop"&&t.pointerType==="mouse"&&me.id<0&&DL(t);return}let e=t.clientX-me.x0,n=t.clientY-me.y0;if(!me.moved){let s=Math.hypot(e,n);if(s>=Wi.SLOP_PX/2&&me.timers.length&&!me.done&&(Nv(),Am()),s<Wi.SLOP_PX)return;if(me.moved=!0,me.done){me.mode="none";return}PL(t,e,n)}let i=Dv(t),r=Math.max(1,t.timeStamp-me.lastT);if(me.v+=((i-me.lastP)/r-me.v)*Math.min(1,r/60),me.lastP=i,me.lastT=t.timeStamp,me.mode==="scrub")Xn.director.scrub.set(IL(i));else if(me.mode==="pull"){let s=gn[0]-i;Pn==="phone"?s+=Math.max(0,me.top-t.clientY):Pn==="land"&&(s+=Math.max(0,me.left-t.clientX)),me.pull=Math.max(0,s),$r.snap(-Math.min(bt.nav.rubberMax,me.pull*bt.nav.rubber)),me.pull>=bt.nav.overpullPx&&!me.pullTimer?me.pullTimer=bm(Ee.overpullHold,()=>{me.pullTimer=0,me.done=!0,me.mode="none",$r.target=0,Xn.director&&Xn.director.go("#/zenith",{source:"overpull"})}):me.pull<bt.nav.overpullPx&&me.pullTimer&&(clearTimeout(me.pullTimer),me.pullTimer=0)}else me.mode==="map"&&(me.mapDy=t.clientY-me.y0);Pn==="desktop"&&(me.mode==="scrub"||me.mode==="detent")&&Iv(wh(i))}function Ww(t,e){if(t.pointerId!==me.id)return;me.id=-1,Nv(),Am();let n=Xn.director,i=me.lastP;if(me.mode==="scrub"&&n)if(e)n.scrub.end(-4);else{let r=me.v*1e3/(gn[me.target]-me.from||1),s=bt.nav.magnetPx;Math.abs(i-gn[me.target])<=s?r=Math.max(r,2):Math.abs(i-me.from)<=s&&(r=Math.min(r,-2)),n.scrub.end(r)}else if(me.mode==="pull")$r.target=0;else if(me.mode==="detent"&&!e){let r=wh(i);r!==Sh(ee.room)&&Pv(r)}else me.mode==="map"&&!e?me.mapDy<=-40&&Xn.navMap&&Xn.navMap.open():!me.moved&&!me.done&&!e&&me.row>=0&&Pv(me.row);me.mode=null}function DL(t){Sm(!0);let e=be.h/2-$n/2,n=t.clientY-e,i=wh(n);Iv(Math.abs(n-gn[i])<=22?i:-1)}function Ni(t,e,n,i){let r=document.createElement(t);return e&&(r.className=e),i&&(r.id=i),n.appendChild(r),r}function Zs(t,e,n){let i=document.createElementNS(ML,t);return e&&i.setAttribute("class",e),n.appendChild(i),i}function NL(){en=document.createElement("nav"),en.id="keynav",en.setAttribute("aria-label","КЛЮЧ"),fc=Zs("svg","kn-draw",en),fc.setAttribute("aria-hidden","true"),fc.setAttribute("preserveAspectRatio","none");for(let n=0;n<7;n++){let i=Zs("path","kn-stratum",fc);i.setAttribute("data-stratum",Vo[n]),i.setAttribute("pathLength","1"),dc.push(i)}Xi=Zs("path","kn-crack",fc),Xi.setAttribute("pathLength","1"),Xi.style.strokeDasharray="1",Xi.style.strokeDashoffset="1";for(let n=0;n<7;n++){let i=Un[n],r=ce[i],s=Ni("button","kn-row",en);s.type="button",s.dataset.sign=Vo[n],s.dataset.room=i,s.style.setProperty("--i",String(n)),s.setAttribute("aria-label",r.name);let o=Ni("span","kn-letter t-label",s);o.textContent=Vo[n];let a=Ni("span","kn-text",s),l=Ni("span","kn-head",a);Ni("span","kn-code t-label",l).textContent=`${Vo[n]} · ${r.code}`,Ni("span","kn-name t-body t-body--15 t-body--em",l).textContent=r.name,Ni("span","kn-level t-micro",a).textContent=`▽ ${r.giant}`,s.addEventListener("click",c=>{c.detail===0&&Pv(n)}),Tr.push(s)}_m=Ni("i","kn-tick",en),$w=Ni("i","",en,"keynav-needle"),Js=Zs("svg","kn-twin",en),Js.setAttribute("viewBox","0 0 40 12"),Xw=[Zs("path","",Js),Zs("path","",Js)],Ks=Ni("div","",en,"keynav-slots");for(let n=0;n<5;n++)Ni("i","slot",Ks);bh=Ni("i","",en,"keynav-zenith"),pc=Ni("div","",en,"keynav-ring");let t=Zs("svg","",pc);t.setAttribute("viewBox","0 0 44 44");let e=Zs("circle","track",t);e.setAttribute("cx","22"),e.setAttribute("cy","22"),e.setAttribute("r","18"),ur=Zs("circle","fill",t),ur.setAttribute("cx","22"),ur.setAttribute("cy","22"),ur.setAttribute("r","18"),ur.setAttribute("pathLength","1"),ur.style.strokeDasharray="1",ur.style.strokeDashoffset="1",Ni("span","t-label",pc).textContent="ПЕРЕЗАПУСК",Ev=Ni("p","t-body t-body--15 t-body--em",en,"keynav-name"),en.addEventListener("pointerdown",CL),en.addEventListener("pointermove",LL),en.addEventListener("pointerup",n=>Ww(n,!1)),en.addEventListener("pointercancel",n=>Ww(n,!0)),en.addEventListener("pointerleave",n=>{me.id<0&&n.pointerType==="mouse"&&Sm(!1)}),en.addEventListener("wheel",RL,{passive:!1}),en.addEventListener("contextmenu",n=>n.preventDefault())}var Ar={el:null,init(t){Xn=t;let e=document.getElementById("chrome");return e&&(NL(),e.appendChild(en),Ar.el=en,Gw(),Tv(),Ar.refreshSlots(),Y.data&&Y.data.nadirOpen&&(Xi.style.strokeDashoffset="0",Xi.classList.add("is-cool")),Ar.showZenith(!!(Y.data&&Y.data.found&&Y.data.found.S13)),Ar.setCurrent(ee.room||"CORE"),_e.on("layout:change",()=>{Gw(),Sm(!1)}),_e.on("secret:found",n=>{n.id==="S13"&&Ar.showZenith(!0)}),_e.on("room:arrive",()=>{try{Ny().unread>0&&Ar.blink("S")}catch{}}),pe.add(TL,zt.UI)),Ar},show(t={}){if(!en)return Promise.resolve();let e=t.ms!=null?t.ms:Ee.drawIn;en.classList.add("is-shown");for(let n of dc)n.style.transition="none",n.style.strokeDasharray="1",n.style.strokeDashoffset="1";return requestAnimationFrame(()=>{for(let n of dc)n.style.transition=`stroke-dashoffset ${e}ms cubic-bezier(.16,1,.3,1),stroke .24s`,n.style.strokeDashoffset="0"}),new Promise(n=>ot(e,()=>{for(let i of dc)i.style.strokeDasharray="",i.style.strokeDashoffset="",i.style.transition="";n()}))},hide(){en&&(en.classList.remove("is-shown"),Sm(!1))},setCurrent(t){_h=ce[t]?t:"CORE";let e=Sh(_h);for(let i=0;i<7;i++)i===e?Tr[i].setAttribute("aria-current","true"):Tr[i].removeAttribute("aria-current"),dc[i].classList.toggle("is-current",i===e);let n=ce[_h];Ev&&(Ev.textContent=_h==="NADIR"&&Y.data&&Y.data.nadirOpen?n.nameOpen:n.name),Mh=n.alt},setNeedle(t){Mh=Number.isFinite(t)?t:0},lockTwin(){if(!Js||Pn!=="desktop")return;Js.classList.add("is-on");let[t,e]=Xw;qn(Ee.navTwin,n=>{let i=5*(1-n),r=3,s=3+2*(1-n),o="M0 6",a="M0 6";for(let l=2;l<=40;l+=2)o+=`L${l} ${(6+i*Math.sin(l/40*r*6.283)).toFixed(2)}`,a+=`L${l} ${(6+i*Math.sin(l/40*s*6.283+1)).toFixed(2)}`;t.setAttribute("d",o),e.setAttribute("d",a)}).done.then(()=>ot(120,()=>Js.classList.remove("is-on")))},flashLetter(t,e,n){let i=Vo.indexOf(t);i>=0&&Ua(i,e==="electrum"||e==="white"?"data-glint":"data-flash",n||Ee.hintGlint,e)},flashAll(t,e="ember"){for(let n=0;n<7;n++)e==="electrum"||e==="white"?Ua(n,"data-glint",t||4200,e):Ua(n,"data-flash",t||4200)},blink(t){let e=Vo.indexOf(t);e>=0&&Ua(e,"data-blink",480)},shudder(t){let e=Vo.indexOf(t);if(e<0)return;let n=Tr[e];n.hasAttribute("data-shudder")?(n.removeAttribute("data-shudder"),requestAnimationFrame(()=>Ua(e,"data-shudder",1e3))):Ua(e,"data-shudder",1e3),t==="N"&&(Ks.classList.add("is-flash"),ot(Ee.shudder,()=>Ks.classList.remove("is-flash")))},refreshSlots(){let t=Y.data?Math.min(5,Y.data.shards|0):0;if(Ks)for(let e=0;e<5;e++)Ks.children[e].classList.toggle("filled",e<t);Tr.length&&Tv()},slotPoint(t){let e=Ks&&Ks.children[Math.max(0,Math.min(4,t|0))];if(!e)return{x:be.w/2,y:be.h/2};let n=e.getBoundingClientRect();return{x:n.left+n.width/2,y:n.top+n.height/2}},letterPoint(t){let e=Math.max(0,Vo.indexOf(t)),n=Tr[e]&&Tr[e].firstChild;if(!n)return{x:be.w/2,y:be.h/2};let i=n.getBoundingClientRect();return{x:i.left+i.width/2,y:i.top+i.height/2}},crack(){return Xi?(Xi.classList.remove("is-cool"),Xi.style.transition="none",Xi.style.strokeDashoffset="1",requestAnimationFrame(()=>{Xi.style.transition="stroke-dashoffset 2.8s cubic-bezier(.2,0,0,1),stroke .6s",Xi.style.strokeDashoffset="0"}),ot(1400,()=>{Tv(),Ar.setCurrent(_h)}),new Promise(t=>ot(2800,()=>{Xi.classList.add("is-cool"),t()}))):Promise.resolve()},showZenith(t){bh&&bh.classList.toggle("is-on",!!t)},pullAboveS(t=20,e=600){let n=wm(Mh),i=gn[0]-t-n;qn(e,r=>{Cv=i*Math.sin(Math.PI*r)}).done.then(()=>{Cv=0})},swingTo(t,e=Ee.hintGlint){zo.snap(qw()),zo.target=t<0?gn[0]-bt.nav.zenithDotAbove*2:gn[t],Mm=!0,Yw=pe.now+900+e,t<0?(bh.classList.add("is-ghost"),ot(900+e,()=>bh.classList.remove("is-ghost"))):ot(450,()=>Ua(t,"data-glint",e))}};var jw="http://www.w3.org/2000/svg",Ov=null,Ti=null,Zw=[],Kw=[],Tm=0,Ah={id:-1,y0:0};function Fv(){let t=!!(Y.data&&Y.data.nadirOpen),e=ee.room==="WORKSHOP"?"MEMBERS":ee.room;for(let n=0;n<7;n++){let i=Un[n],r=ce[i],s=Zw[n],o=i==="NADIR"&&!t;s.querySelector(".t-body").textContent=i==="NADIR"&&t?r.nameOpen:r.name,o?s.setAttribute("data-sealed",""):s.removeAttribute("data-sealed"),i===e?s.setAttribute("aria-current","true"):s.removeAttribute("aria-current"),Kw[n].classList.toggle("is-current",i===e)}}function OL(t){let e=[];for(let n=0;n<2;n++)for(let i=0;i<=4;i++){let r=n===0?i/4:1-i/4,s=t.top+(t.bot-t.top)*r,o=t.top>0&&t.bot<0&&i===2?.62:It(s),a=36+(n===0?1:-1)*o*125*.45;e.push(`${a.toFixed(1)} ${(150-s*125).toFixed(1)}`)}return`M${e.join("L")}Z`}var hr={isOpen:!1,init(t){Ov=t;let e=document.getElementById("sheets");if(!e)return hr;Ti=document.createElement("div"),Ti.id="map",Ti.hidden=!0,Ti.setAttribute("role","dialog"),Ti.setAttribute("aria-label","КАРТА");let n=document.createElement("div");n.className="map-head";let i=document.createElement("p");i.className="t-label",i.textContent="КАРТА · VIN";let r=document.createElement("button");r.type="button",r.className="verb",r.textContent="ЗАКРЫТЬ",r.addEventListener("click",()=>hr.close()),n.append(i,r);let s=document.createElement("div");s.className="map-body";let o=document.createElementNS(jw,"svg");o.setAttribute("class","map-draw"),o.setAttribute("viewBox","0 0 72 300"),o.setAttribute("preserveAspectRatio","xMidYMin meet"),o.setAttribute("aria-hidden","true");for(let l of Zt){let c=document.createElementNS(jw,"path");c.setAttribute("d",OL(l)),o.appendChild(c),Kw.push(c)}let a=document.createElement("div");return a.className="map-rows",Zw=Un.map(l=>{let c=ce[l],u=document.createElement("button");u.type="button",u.className="map-row",u.dataset.room=l;let f=document.createElement("span");f.className="t-micro",f.textContent=`▽ ${c.level}`;let h=document.createElement("span");h.className="t-label",h.textContent=`${c.num} · ${c.code}`;let d=document.createElement("span");return d.className="t-body",d.textContent=c.name,u.append(f,h,d),u.addEventListener("click",()=>{hr.close(),Ov.director&&Ov.director.go(`#/${c.slug}`,{source:"nav"})}),a.appendChild(u),u}),s.append(o,a),Ti.append(n,s),Ti.addEventListener("pointerdown",l=>{Ah.id=l.pointerId,Ah.y0=l.clientY}),Ti.addEventListener("pointerup",l=>{l.pointerId===Ah.id&&l.clientY-Ah.y0>60&&hr.close(),Ah.id=-1}),e.appendChild(Ti),_e.on("room:arrive",Fv),_e.on("nadir:open",Fv),hr},open(){!Ti||hr.isOpen||(Tm&&(Tm=0),Fv(),hr.isOpen=!0,Ti.hidden=!1,Ti.classList.add("is-closing"),requestAnimationFrame(()=>requestAnimationFrame(()=>Ti.classList.remove("is-closing"))))},close(){if(!Ti||!hr.isOpen)return;hr.isOpen=!1,Ti.classList.add("is-closing");let t=++Tm;ot(480,()=>{t===Tm&&!hr.isOpen&&(Ti.hidden=!0)})}};var Yi=(t,e,n,i,r,s,o=!1)=>Object.freeze({id:t,name:e,where:n,note:i,line:r,hintRoom:s,timeGated:o}),Uv=Object.freeze([Yi("S01","РЕЗОНАНС","CORE","G4","Песок написал имя.","CORE"),Yi("S02","БЕСКОНЕЧНОСТЬ","CORE","A4","Ты всё ещё внутри SAM.VIN.","CORE"),Yi("S03","ГОЛОВОКРУЖЕНИЕ","CORE","B4","Ключ закружился на {p}%.","CORE"),Yi("S04","ВСЕ ВМЕСТЕ","MEMBERS","D5","Весь клан откликнулся вместе.","MEMBERS"),Yi("S05","ПОЗЫВНОЙ","anywhere","E5","Система узнала тебя.","CORE"),Yi("S06","МАСТЕРСКАЯ","MEMBERS","G5","Твой знак вырезан.","MEMBERS"),Yi("S07","КИТ","any hall","A5","Ты видел кита.",null,!0),Yi("S08","ИЗНАНКА","CORE","B5","Ты видел изнанку.","CORE"),Yi("S09","ДРОН","any hall","D6","Ты поймал дрона.","CURRENT"),Yi("S10","НОЧЬ","any","E6","Ты видел, как VIN спит.",null,!0),Yi("S11","ЧАСТОТА","SIGNAL","G6","Тайная частота: {freq}.","SIGNAL"),Yi("S12","КАПСУЛА","INSIGNIA","A6","Капсула открылась.",null,!0),Yi("S13","ЗЕНИТ","navigator","B6","Ты был над всем.","ZENITH"),Yi("S14","СПУТНИК","CORE","D7","{name} прилетела и осталась.",null,!0)]),Jw=Object.freeze(["S01","S03","S04","S02","S06","S09","S08","S11","S13","S05"]),Qw=Object.freeze(["S07","S10","S12","S14"]),FL=new Map(Uv.map(t=>[t.id,t]));function Em(t){return FL.get(t)||null}var ka=null,mc=null,eA=t=>!!(Y.data&&Y.data.found&&Y.data.found[t]);function tA(t){let e=mc;if(!e||pe.now-e.at>Ee.hintArriveWindow){mc=null;return}e.room===t&&(mc=null,_e.emit("hint:arrive",{secret:e.secret,room:t,source:"hint"}))}var Th={playMotion(t,e={source:"show"}){_e.emit("hint:arrive",{secret:t,room:ee.room,source:e&&e.source||"show"})},init(t){return ka=t,t.hint=Th,_e.on("room:arrive",e=>tA(e.room)),Th},target(){for(let t of Jw){if(eA(t))continue;let n=Em(t).hintRoom;return n==="CURRENT"&&(n=ee.room),{secret:t,room:n,kind:"secret"}}return Qw.some(t=>!eA(t))?{secret:null,room:null,kind:"time"}:{secret:null,room:null,kind:"done"}},swing(){let t=Th.target(),e=ka&&ka.keyNav,n=3;return t.kind==="secret"&&(n=t.room==="ZENITH"?-1:Math.max(0,Un.indexOf(t.room==="WORKSHOP"?"MEMBERS":t.room))),e&&e.swingTo&&e.swingTo(n),t.kind!=="secret"&&ka.status&&ka.status.say(t.kind==="time"?"hint.time":"hint.done"),ee.hintTarget={secret:t.secret,room:t.room,at:pe.now},_e.emit("hint:swing",{secret:t.secret,room:t.room}),mc=t.kind==="secret"&&ce[t.room]?{secret:t.secret,room:t.room,at:pe.now}:null,mc&&mc.room===ee.room&&!(ka.director&&ka.director.busy())&&setTimeout(()=>tA(ee.room),0),t}};var UL=new Set(["ArrowUp","ArrowDown","PageUp","PageDown","Home","Escape"]),kL=t=>!!t&&(t.isContentEditable||/^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName||"")),iA=t=>{let e=/^(?:Digit|Numpad)([1-7])$/.exec(t);return e?Number(e[1])-1:-1};function nA(t,e){let n=iA(t.code);if(n>=0)return`#/${ce[Un[n]].slug}`;switch(t.key){case"ArrowUp":case"PageUp":{let i=Ro(e,-1);return i?`#/${ce[i].slug}`:""}case"ArrowDown":case"PageDown":{let i=Ro(e,1);return i?`#/${ce[i].slug}`:""}case"Home":case"Escape":return"#/core";default:return null}}var rA=[];function BL(t){let e=rA;for(let n=e.length-1;n>=0;n--)try{if(e[n].fn(t)===!0)return!0}catch{}return!1}function sA(t){window.addEventListener("keydown",e=>{if(e.defaultPrevented||e.ctrlKey||e.metaKey||e.altKey)return;let n=e.key==="Escape";if(kL(e.target)){n&&t.sheet&&t.sheet.state!=="closed"&&t.sheet.close();return}if(n&&t.navMap&&t.navMap.isOpen){t.navMap.close(),e.preventDefault();return}if(rA.length&&BL(e)){e.preventDefault();return}if(ee.booting&&t.input.offerKey&&t.input.offerKey(e)){e.preventDefault();return}let i=t.director;if(i&&i.busy()){if(n&&i.playing){i.speedUp(),e.preventDefault();return}let r=i.state.to?i.state.to.room:ee.room,s=nA(e,r);if(s!=null){s&&i.go(s,{source:"kbd"}),e.preventDefault();return}e.key!=="Tab"&&e.key!=="Shift"&&e.key.length&&i.speedUp();return}if(t.halls&&t.halls.call(ee.room,"onKey",e)===!0){e.preventDefault();return}if(e.code==="KeyM"){t.audio&&t.audio.toggle();return}if(i&&(UL.has(e.key)||iA(e.code)>=0)){let r=nA(e,ee.room);r&&i.go(r,{source:"kbd"}),e.preventDefault()}})}var vs={t0:null,nLockAt:null,ignitionAt:null,idleAt:null};Wt("boot",()=>({...vs}));var Rm=()=>typeof performance<"u"?performance.now():Date.now(),oA=!1,Bv=!1;function kv(t){Bv||(Bv=!0,t.status&&t.status.say(t.input.pointer.lastMove?"boot.pointer":"boot.nopointer"))}function aA(t,e){t.wake=m=>lA(t,m),vs.t0=Rm(),vs.nLockAt=null,vs.ignitionAt=null,vs.idleAt=null,oA||(oA=!0,t.bus.on("relaunch",()=>zL(t)));let n=t.key,i=Gt.reducedMotion,r=[],s=[],o=!1,a,l=new Promise(m=>{a=m}),c=(m,p)=>r.push(ot(m,p)),u=(m,p,_)=>{let M=qn(m,p,_);return s.push(M),M};ee.booting=!0,Bv=!1,ee.phase!=="boot"&&Fi("boot");let f=()=>{vs.ignitionAt==null&&(vs.ignitionAt=Rm()),n&&(n.ignite({color:ee.night?"electrum":"ember",flash:!0}),t.bus.emit("boot:ignite",{returning:Y.returning}))},h=m=>{t.chrome&&(m?Promise.resolve():t.chrome.typeIn()).then(()=>t.chrome.assemble(m?0:void 0)),t.keyNav&&t.keyNav.show(m?{ms:0}:{}),t.edges&&t.edges.drawIn(m?0:void 0)},d=m=>{if(!o){o=!0;for(let p of r)Vn(p);for(let p of s)p.cancel();x(),m&&(n&&(n.setScramble([0,0,0,0,0,0,0]),n.setReveal({points:1,scanY:null,fill:1,alpha:1}),f(),n.shootAxis(3.2,0)),t.nest&&t.nest.setFade(1,1),h(!0)),t.composite&&t.composite.setGrain(.02),t.datum&&t.datum.arrive("CORE",{instant:!!m}),t.rim&&t.rim.showName(),n&&(n.setBreathingRing(!0),n.setIdle(!0),n.setInteractive(!0)),kv(t),Fi("idle"),ee.booting=!1,vs.idleAt=Rm(),t.bus.emit("boot:done",{returning:Y.returning,sameDay:Y.sameDaySession,phone:be.isPhone}),a()}},g={name:"boot",onGesture(m){return(m.type==="down"||m.type==="tap"||m.type==="wheel"||m.type==="dragstart")&&d(!0),!0},onKey(){return d(!0),!0}},x=t.input.push(g);if(!n){let m=t.t0&&t.t0.boot?t.t0.boot({phone:be.isPhone,returning:Y.returning,sameDay:Y.sameDaySession,reduced:i}):Promise.resolve();return h(!1),m.then(()=>d(!1),()=>d(!1)),l}return t.nest&&t.nest.setFade(1,0),t.audio&&t.audio.play("bootSwell",{}),i?(c(200,()=>{t.nest&&u(400,m=>t.nest.setFade(1,m))}),c(300,()=>u(400,m=>n.setReveal({points:m,scanY:null,fill:m,alpha:m}))),c(700,()=>{f(),kv(t),n.shootAxis(3.2,0),h(!1)}),c(1e3,()=>d(!1)),l):(n.setScramble("golden"),c(600,()=>{t.nest&&u(1e3,m=>t.nest.setFade(1,m),vn.reveal)}),c(1300,()=>h(!1)),c(900,()=>u(400,m=>n.setReveal({points:m,scanY:null,fill:m,alpha:m}),vn.reveal)),c(1e3,()=>{n.lockSequence({order:"down",stepMs:220,spin:!1,snap:.04}).then(()=>{o||(vs.nLockAt==null&&(vs.nLockAt=Rm()),f(),kv(t),n.shootAxis(3.2,240).then(()=>{o||d(!1)}))})}),l)}function lA(t,e={show:!1}){let n=t.key;if(t.fx&&t.fx.pieces&&typeof t.fx.pieces.wakeReset=="function")try{t.fx.pieces.wakeReset()}catch{}return n?n.lockSequence({order:"down",stepMs:220,spin:!1,snap:.04}).then(()=>{n.ignite({color:ee.night?"electrum":"ember",flash:!0}),t.bus.emit("boot:ignite",{returning:!0,wake:!0}),t.audio&&t.audio.play("signature",{found:t.secrets?t.secrets.found():[]})}):Promise.resolve()}async function zL(t){let e=t.key,n=t.fx&&t.fx.pieces;if(n&&typeof n.fold=="function")try{await n.fold({context:"relaunch"})}catch{}if(t.status&&t.status.say("relaunch"),!e)return;e.setScramble("golden"),e.douse();let i=null;i=t.input.push({name:"relaunch",onGesture(r){return r.type!=="tap"||ee.room!=="CORE"||e.pick(r.x,r.y)<0?!1:(i(),lA(t,{show:!1}),!0)}})}function VL(t,e){let n=Cr(xt.operator.name||""),i=38,r=[],s=null,o=1,a=!1,l=0,c=document.createElement("div");Object.assign(c.style,{position:"absolute",left:"50%",top:`calc(50% + ${(zv*50).toFixed(1)}vh + 24px)`,transform:"translateX(-50%)",textAlign:"center",whiteSpace:"nowrap",color:"var(--silver)"}),c.hidden=!0;let u=document.createElement("p");u.className="t-label",u.setAttribute("aria-hidden","true"),u.style.margin="0";let f=document.createElement("p");f.className="t-micro",f.setAttribute("aria-hidden","true"),f.style.margin="4px 0 0",f.style.opacity="0.7",c.appendChild(u),c.appendChild(f);let h=document.createElement("span");h.className="sr-only",h.textContent=n,t&&(t.appendChild(c),t.appendChild(h));let d=[];function g(){u.textContent="",d.length=0,[n].concat(r).forEach((m,p)=>{p&&u.appendChild(document.createTextNode("   "));let _=document.createElement("span");_.textContent=m,u.appendChild(_),d.push(_)}),f.textContent=s||"",f.hidden=!s,c.style.opacity=String(o)}g();let x={group:null,burn(m){let p=m&&Number.isFinite(m.at)?m.at:null,_=p!=null?Math.max(0,p-performance.now()):0;return _<=0?(x.showName(),Promise.resolve()):new Promise(M=>ot(_,()=>{x.showName(),M()}))},showName(){a=!0,c.hidden=!(o>0)},burnGuests(m){return r=(Array.isArray(m)?m:[]).map(p=>Cr(String(p||""))).filter(Boolean),g(),x.showName(),Promise.resolve()},clearGuests(){r=[],g()},rows(){return[n].concat(r).map(m=>({text:m,heightM:i,row:0}))},setRole(m){s=m?Cr(String(m)):null,g()},namePoint(m,p){let _=p||{x:0,y:0},M=d[Math.max(0,Math.min(d.length-1,m|0))],v=M&&!c.hidden?M.getBoundingClientRect():null;return v&&v.width?(_.x=v.left+v.width/2,_.y=v.top+v.height/2):(_.x=be.w/2,_.y=be.h*.85),_},letterHeightM(){return i},setLitNodes(m){l=Math.max(0,m|0)},setAlpha(m){o=Math.max(0,Math.min(1,+m||0)),c.style.opacity=String(o),c.hidden=!a||!(o>0)}};return e&&Wt("rim",()=>x.rows()),x}var GL="http://www.w3.org/2000/svg",zv=.56;function Cm(t,e,n){let i=document.createElementNS(GL,t);for(let r in e)i.setAttribute(r,e[r]);return n&&n.appendChild(i),i}function HL(){let t=Cm("svg",{viewBox:"-0.8 -1.3 1.6 2.6","aria-hidden":"true"});Object.assign(t.style,{position:"absolute",left:"50%",top:"50%",height:`${zv*100}vh`,transform:"translate(-50%,-50%)",overflow:"visible"});for(let e of Zt){let n=[],i=e.top>0&&e.bot<0?[e.top,0,e.bot]:[e.top,e.bot];for(let r of i)n.push(`${It(r).toFixed(3)},${(-r).toFixed(3)}`);for(let r=i.length-1;r>=0;r--)n.push(`${(-It(i[r])).toFixed(3)},${(-i[r]).toFixed(3)}`);if(Cm("polygon",{points:n.join(" "),fill:"none",stroke:"var(--silver)","stroke-width":"1","vector-effect":"non-scaling-stroke"},t),e.sign!=="•"){let r=Cm("text",{x:"0",y:(-e.mid).toFixed(3),"text-anchor":"middle","dominant-baseline":"central",fill:"var(--pewter)"},t);r.style.font='500 0.07px "Martian", ui-monospace, monospace',r.style.letterSpacing="0.008px",r.textContent=e.sign}}return Cm("circle",{cx:"0",cy:"0",r:"0.022",fill:"var(--ember)"},t),t}function Pm(t){let e=document.getElementById("t0"),n={},i=!1,r="CORE",s=HL();if(e){e.textContent="",Object.assign(e.style,{background:"var(--void)"}),e.appendChild(s);for(let l of Object.keys(ce)){let c=document.createElement("section");c.dataset.room=l,c.hidden=l!=="CORE",Object.assign(c.style,{position:"absolute",left:"var(--title-x)",top:"calc(var(--datum-y) + 36px)"});let u=document.createElement("p");u.className="t-micro",u.textContent=`${ce[l].num} · ${ce[l].code} · ▽ ${ce[l].level}`,c.appendChild(u),e.appendChild(c),n[l]=c}e.hidden=t.app.tier!=="T0"}let o=VL(e,t.app.tier==="T0"),a={root:e,rim:o,twin(l,c){},boot(l){return new Promise(c=>ot(600,c))},show(l){let c=l&&ce[l.room]?l.room:"CORE";r=c;for(let u in n)n[u].hidden=u!==c;s.style.display=c==="CORE"?"":"none"},keyScreen(){return{x:be.w/2,y:be.h/2,r:be.h*zv/2}},showLost(){let l=r;i=!0,e&&(e.hidden=!1),a.show({room:"CORE"}),r=l},hideLost(){i&&(i=!1,e&&t.app.tier!=="T0"&&(e.hidden=!0),a.show({room:r}))}};return a}function cA(t,e,n){return new Promise(i=>{requestAnimationFrame(()=>i())})}var qi=null,Vv={x:0,y:0,depth:0,visible:!1},Qs=(t,e)=>t&&typeof t[e]=="function";function WL(t){return t&&t.isVector3&&Pe.camera?(Pe.project(t,Vv),{x:Vv.x,y:Vv.y}):t&&Number.isFinite(t.x)&&Number.isFinite(t.y)?{x:t.x,y:t.y}:{x:be.w/2,y:be.h/2}}function Eh(t,e){let n=qi&&qi.status;Qs(n,"say")&&n.say(t,e||{})}async function $L(t,e){let n=Y.data,i=qi&&qi.keyNav,r=n.shards<5&&!n.nadirOpen,s=r&&Qs(i,"slotPoint")?i.slotPoint(n.shards):Qs(i,"letterPoint")?i.letterPoint("I"):{x:be.w/2,y:be.h/2},o=Y.rank().index;try{await cA(t,e,s)}catch{}r&&Y.patch(l=>{l.shards=Math.min(5,(l.shards|0)+1)}),Qs(i,"refreshSlots")&&i.refreshSlots(),$e.play("shard",{}),Vr(zr.shard),qi&&Qs(qi.chrome,"relockFound")&&qi.chrome.relockFound(),Eh("found"),r&&n.shards<5&&Eh("shard",{k:n.shards}),_e.emit("shard:landed",{id:t,k:n.shards,count:ys.count()});let a=Y.rank();if(a.index>o&&(_e.emit("rank:change",{rank:a.name,index:a.index}),Eh("rank",{rank:a.name.toLocaleLowerCase("ru")}),Qs($e,"setRank")&&$e.setRank(a.index)),r&&n.shards>=5&&!n.nadirOpen){Eh("shard",{k:5});let l=qi&&qi.fx&&qi.fx.pieces;if(Qs(l,"nadirUnseal"))try{await l.nadirUnseal()}catch{}if(Y.data.nadirOpen)return;Y.set("nadirOpen",!0),qi&&Qs(qi.lead,"show")&&qi.lead.show("Внизу что-то открылось.",{ms:3e3}),Qs(i,"crack")&&i.crack(),Eh("nadir.open"),_e.emit("nadir:open",{})}}var ys={init(t){return qi=t,t.secrets=ys,ys},discover(t,e={}){if(!Em(t)||!Y.data||ys.isFound(t))return!1;let n=e&&e.vars?{...e.vars}:{};Y.patch(r=>{r.found[t]=new Date(Date.now()).toISOString(),(!r.foundVars||typeof r.foundVars!="object")&&(r.foundVars={}),r.foundVars[t]=n});let i=WL(e&&e.anchor);return _e.emit("secret:found",{id:t,anchor:i}),$L(t,i),!0},isFound(t){return!!(Y.data&&Y.data.found&&Y.data.found[t])},found(){return Uv.filter(t=>ys.isFound(t.id)).map(t=>t.id)},count(){return ys.found().length},rank(){return Y.rank()},get shards(){return Y.data?Y.data.shards|0:0}};var $H=Object.freeze([[1,2],[2,3],[1,4],[3,5],[2,7],[4,7]].map(t=>Object.freeze(t)));var rW=48;var lW=Object.freeze({legend:3,achievement:1.6,moment:1.2,joke:.8,before:3});var vW=Object.freeze(["stellated","twisted","nested","bipyramid","knot"]);var XL=343,Ba=()=>performance.now(),YL=()=>({set(){},release(){},alive:!1});function uA(t,e){let n=Promise.resolve(),i={current:null,queue:[],run(x,m,p={maxWaitMs:1200}){let _=n.then(async()=>{i.current=x,ee.fx.stage=x;try{await(typeof m=="function"?m({reduced:!1,signal:{aborted:!1}}):null)}catch{}return i.current=null,ee.fx.stage=null,"ran"});return n=_.catch(()=>"ran"),_},busy(){return i.current!=null},deferToIdleCore(x,m){return i.run(x,m)}},r={at(x,m){let p=m||{},_=ot(Math.max(0,x-Ba()),()=>{try{p.visual&&p.visual()}catch{}try{p.audio&&$e.fx.ready()&&p.audio($e.fx.ctxTimeFor(x))}catch{}});return{cancel(){Vn(_)}}},now(x){let m=x||{};try{m.visual&&m.visual()}catch{}try{m.audio&&$e.fx.ready()&&m.audio()}catch{}},cancelAfter(x){},presentAt(x){return x+16.7},log(){return[]},nowPerf(){return Ba()}},s={lastPauseAt:-1/0,lastProsvetAt:-1/0,pause(x={}){let m=x&&Number.isFinite(x.at)?x.at:Ba();return s.lastPauseAt=m,new Promise(p=>ot(Math.max(0,m+400-Ba()),()=>{let _=m+400;try{x&&x.onHit&&x.onHit(_)}catch{}p({hitAt:_,advanced:!1,skipped:!1})}))},inPause(){return!1},prosvet(x){return!1}},o={fire(x){let m=Ba();return{startAt:m,arrival:p=>m+1e3*(+p||0)/XL,stop(){}}}},a={rack(x){return Promise.resolve()},set(){},clear(){}},l={run(x){return{stop(){}}},stopAll(){}},c={show(){},hide(){},set(){},rmLabel(){}},u={show(){},hide(){},state:()=>({visible:!1,heightPx:0})},f={enabled:!1,emitter(){return YL()},splat(){},impulse(){},sheet(){},stats:()=>({pool:0,live:0})},h=(x,m)=>{try{t.t0&&typeof t.t0.twin=="function"&&t.t0.twin(x,m)}catch{}},g={stage:i,cue:r,impact:s,wave:o,focus:a,pulse:l,scalebar:c,scaleFigure:u,dust:f,pieces:{titleFx(x){return{stop(){}}},swarf(){},fold(x){let m=t.key;return m?(m.setScramble("golden"),m.douse()):e&&h("close",{phase:"asleep",t01:1}),new Promise(p=>ot(600,p))},wakeReset(){},owner(x){return Promise.resolve({hitAt:Ba(),rimAt:null,echoAt:null})},nadirUnseal(){return Promise.resolve({hitAt:Ba()})}},setLineAlpha(x,m){he.uFxLineA.value=Math.max(0,+x||0)},fogFactor(x,m,p){vr.factor(x,m)},ears:{tabReturn(){},descent(){},popAt(){}},provalFor(x){return new Promise(m=>ot(Math.max(0,x||0),m))},setTier(x){},snapshot(){return{stage:i.current,queue:i.queue.slice(),impacts:[],prosvet:[],waveArrivalMs:null,timeScale:pe.timeScale,dust:f.stats()}}};return Wt("fx",()=>g.snapshot()),Wt("scaleBar",()=>null),Wt("figure",()=>null),g}function hA(t){return uA(t,!1)}function Im(t){return uA(t,!0)}var fA=["wait","finish","call","host","rope","gentle","notice","word"],Dm={wait:0,finish:1,call:2,host:3,rope:4,word:5,notice:6},qL={wait:"КАПСУЛА",finish:"ЗОНД",call:"СБОР",host:"ГОСТИ",rope:"ВСЕ ВМЕСТЕ",word:"ДОГОВОРИЛИСЬ",notice:"ПОТЕРЯШКА"},Rh=["S","A","M","•","V","I","N"],jL=1,ZL={SIGNAL:"Связь",ARCHIVE:"Летопись",MEMBERS:"Клан",VOYAGES:"Вылазки",INSIGNIA:"Хранилище",NADIR:"Исток"},Lm=()=>Y.data||{},KL=t=>{for(let e of Object.keys(Dm))if(Dm[e]===t)return e;return null};function Wv(t){let e=Rh[t];if(!e)return null;let n=xt.clan&&xt.clan.code||[],i=typeof n[t]=="string"?n[t]:"",r=Lm().code&&typeof Lm().code[e]=="string"?Lm().code[e]:null;if(!r||!i)return null;let s=KL(t);return{text:i,at:r,deedId:s,deedName:s?qL[s]:""}}function dA(){let t=[];for(let e=0;e<7;e++)Wv(e)&&t.push(e);return t}function JL(t){let e=/^(\d{4})-(\d{2})-(\d{2})/.exec(String(t||""));if(!e)return"";let n=new Date(Date.UTC(+e[1],+e[2]-1,+e[3])),i=n.getUTCDay()||7;n.setUTCDate(n.getUTCDate()+4-i);let r=new Date(Date.UTC(n.getUTCFullYear(),0,1)),s=Math.ceil(((n-r)/864e5+1)/7);return`${n.getUTCFullYear()}-W${String(s).padStart(2,"0")}`}var za=t=>typeof t=="string"?t.slice(0,10):null,Hv=t=>{let e=xt.members.find(n=>n.id===t);return e?e.name:null};function pA(){let t=Lm(),e=[],n=(m,p,_,M,v,S,w,E)=>{let y={kind:m,id:p,date:_,label:M,title:v,text:S,who:w||[],height:jL};E&&Object.assign(y,E),e.push(y)},i=t.sbor||{},r=i.count|0,s=za(i.last);r>=1&&s&&n("sbor","sbor-all",s,`СБОРЫ · ${r}`,"Сборы клана",`Сборов: ${r}. Последний — ${io(s,"dd.mm.yyyy")}.`,[]);let o=new Map;for(let m of Array.isArray(i.here)?i.here:[]){let p=za(m&&m.day);!p||!Array.isArray(m.ids)||!m.ids.length||o.set(JL(p),{day:p,ids:m.ids.slice()})}let a=[...o.values()].sort((m,p)=>m.day<p.day?-1:m.day>p.day?1:0).slice(-30);for(let m of a){let p=m.ids.filter(_=>Hv(_));n("sbor",`sbor-${m.day}`,m.day,`СБОР · ${io(m.day,"dd.mm.yyyy")}`,"Сбор клана",`Здесь были: ${p.map(Hv).join(", ")}.`,p)}let l=t.lost||{},c=Array.isArray(l.log)?l.log.filter(m=>m&&za(m.day)&&(m.kind==="one"||m.kind==="pair")):[];c.sort((m,p)=>m.day<p.day?-1:m.day>p.day?1:0);let u=0,f=0,h=0;for(let m of c){h+=1;let p=m.kind==="pair"?++f:++u;if(p!==1&&p%10!==0)continue;let _=ZL[m.room]||"Ядро",M=za(m.day);m.kind==="pair"?n("deed",`deed-${h}`,M,`ДЕЛО · ${io(M,"dd.mm.yyyy")}`,"Договорились",`Двое не слышали друг друга. Зал: ${_}. Ты помог им договориться.`,[],{sub:"pair"}):n("deed",`deed-${h}`,M,`ДЕЛО · ${io(M,"dd.mm.yyyy")}`,"Не прошёл мимо",`Маленький ключ потерялся. Зал: ${_}. Ты привёл его домой.`,[],{sub:"one"})}let d=t.shows||{},g=new Map;if(Array.isArray(d.log))for(let m of d.log){let p=za(m&&m.day);p&&g.set(p,m)}else za(d.lastDay)&&(d.count|0)>0&&g.set(za(d.lastDay),{day:d.lastDay,guests:0,who:[]});let x=xt.operator.name;for(let[m,p]of g){let _=Array.isArray(p.who)?p.who.filter(v=>Hv(v)):[],M=Math.max(p.guests|0,_.length);n("show",`show-${m}`,m,`ПОКАЗ · ${io(m,"dd.mm.yyyy")}`,"Показ для гостей",`Гостей: ${M}. Вёл ${x}.`,_)}return e.sort((m,p)=>m.date<p.date?1:m.date>p.date?-1:0),e}function mA(t){let e={done(n,i={}){if(!fA.includes(n)||!Y.data)return!1;let r=Y.data;if((!r.deeds||typeof r.deeds!="object")&&(r.deeds={}),typeof r.deeds[n]=="string")return!1;let s=i&&typeof i.at=="string"?i.at:new Date().toISOString();Y.patch(c=>{c.deeds[n]=s}),_e.emit("deed:done",{id:n});let o=Dm[n];if(o==null||!(xt.clan.code||[])[o])return!0;let l=Rh[o];return(!r.code||typeof r.code!="object")&&(r.code={}),typeof r.code[l]!="string"&&(Y.patch(c=>{c.code[l]=s}),_e.emit("code:earned",{stratum:o})),!0},derive(){let n=Y.data;if(!n)return;n.found&&typeof n.found.S04=="string"&&e.done("rope"),n.capsuleOpened===!0&&e.done("wait");let i=n.probes||{};for(let r of Object.keys(i)){let s=i[r];if(s&&s.back&&s.read===!0){e.done("finish");break}}},law:n=>Wv(n),earned:()=>dA(),bands:()=>pA(),setView(n){}};return _e.on("secret:found",n=>{n&&n.id==="S04"&&e.done("rope")}),_e.on("capsule:open",()=>e.done("wait")),_e.on("probe:read",n=>{let i=n&&Y.data&&Y.data.probes?Y.data.probes[n.code]:null;i&&i.back&&typeof i.sent=="string"&&Zo(i.sent,Y.today)>0&&e.done("finish")}),e}function gA(t){t.deeds=mA(t),t.host={guests:{active:!1,list:()=>[],isHere:()=>!1,open(){},clear(){},letterHeightM:()=>38},show:{active:!1,scene:-1,start(){},next(){},prev(){},exit(){}},sbor:{attach(){},holdProgress(){},holdCancel(){},holdComplete:()=>Promise.resolve(),toggleHere(){},info:()=>({count:0,last:null,hint:!0})},lost:{today:()=>null,blocksDrone:()=>!1,snapshot:()=>null,setView(){}},proposals:{list:()=>[],openSheet(){},add:(n,i,r)=>null,remove(){},promoteFromWorld(){},proposedByName:()=>null}};try{t.deeds.derive()}catch{}t.host.proposals.promoteFromWorld();let e=()=>Y.data||{};Wt("deeds",()=>Object.keys(e().deeds||{}).filter(n=>typeof e().deeds[n]=="string")),Wt("code",()=>Rh.filter(n=>e().code&&typeof e().code[n]=="string")),Wt("show",()=>({active:!!ee.show.active,scene:ee.show.scene})),Wt("guests",()=>ee.guests|0),Wt("sbor",()=>({count:(e().sbor&&e().sbor.count)|0})),Wt("proposals",()=>Array.isArray(e().proposals)?e().proposals.length:0),Wt("lost",()=>t.host.lost.snapshot())}var de={world:xt,state:Y,app:ee,bus:_e,loop:pe,quality:yt,layout:be,input:fn,audio:$e,secrets:null,status:null,sheet:null,edges:null,hint:null,fog:null,palette:null,atlas:null,lead:null,overlay:null,dims:null,datum:null,chrome:null,keyNav:null,director:null,halls:null,renderer:null,scene:null,camera:null,rig:null,scale:null,nest:null,key:null,rim:null,lamp:null,U:null,worldFx:null,t0:null,composite:null,navMap:null,cursor:null,pillar:null,fx:null,host:null,deeds:null,wake:null};function Yn(t,e){try{return e(),!0}catch(n){return lt(`main:${t}`,`boot step "${t}" failed`,n),!1}}function xA(){Yn("env",()=>{Gt.reducedMotion,kh()}),Yn("state",()=>{lM(Ss());let a=Ss();ee.night=t0(a),ee.drowsy=ky(a),ee.birthday=n0(a),ee.owner=!!Y.data.owner,ee.inverted=!!Y.data.inverted,document.documentElement.style.setProperty("--shrp",String(Y.shrp)),Y.deliverTransmissions()}),Yn("fonts",()=>{zl()});let t=null;Yn("quality",()=>{t=yt.detect().gl}),ee.tier!=="T0"&&(Yn("webgl",()=>{de.composite=QL(t)})||_A()),ee.tier==="T0"&&!de.t0&&Yn("t0",()=>{de.t0=Pm(de),ee.tier="T0"}),ee.tier==="T0"&&(de.rim=de.t0&&de.t0.rim?de.t0.rim:de.rim);let e=Yn("dom",()=>{de.chrome=Sn,Sn.init(de),de.status=ii,ii.init(de),de.lead=mh,mh.init(de),de.overlay=Wr,Wr.init(de),de.dims=pm,pm.init(de),de.datum=hh,hh.init(de),de.edges=vh,vh.init(de),de.sheet=Sr,Sr.init(de),de.navMap=hr,hr.init(de),de.keyNav=Ar,Ar.init(de),de.cursor=yh,yh.init(de),ee.tier==="T0"&&Sn.setT0Marker(!0)}),n=Yn("audio",()=>{$e.init(de)});Yn("fx",()=>{de.fx=ee.tier==="T0"?Im(de):hA(de)})||Yn("fx:t0",()=>{de.fx=Im(de)});let i=Yn("input",()=>{fn.init(de),sA(de)}),r=us("#/core"),s=Yn("navigation",()=>{r=us(location.hash),ut.init(de),yn.init(de)}),o=Yn("secrets",()=>{ys.init(de)});Yn("host",()=>gA(de)),o=Yn("hint",()=>{Th.init(de)})&&o,Yn("hook",()=>{PS(de)}),ee.tier!=="T0"&&!(e&&n&&i&&s&&o)&&(_A(),Yn("t0",()=>{de.t0=Pm(de),de.chrome&&Sn.setT0Marker(!0)}),de.t0&&de.t0.rim&&(de.rim=de.t0.rim),Yn("fx:t0",()=>{de.fx=Im(de)})),Yn("loop",()=>{yt.init(de);let a=ee.tier!=="T0"?de.composite:null;a?(eD(),pe.add(a.render,zt.RENDER),a.onFirstFrame(()=>document.body.classList.remove("is-ff"))):document.body.classList.remove("is-ff"),pe.start(),ee.tier!=="T0"&&yt.benchmark(),_e.emit("app:ready",{})}),Yn("boot",()=>{let a=()=>aA(de,r).then(()=>yA(r),l=>{lt("main:boot",l),yA(r)});de.composite&&ee.tier!=="T0"?de.composite.onFirstFrame(a):a()})}function vA(){let t=st.core;return{pos:new P(...t.pos),target:new P(...t.target),fov:t.fov,offsetY:be.kind==="desktop"?0:t.phoneOffsetY,roll:0}}function QL(t){let e=oS(document.getElementById("gl"),t,ee.tier);return de.renderer=e,de.scene=e.scene,de.camera=e.camera,de.palette=Eo,de.U=he,de.fog=vr,Eo.init(),Jt.init(ee.tier),de.atlas=Jt,vr.set(ce.CORE.fog),et.init(e.scene,de),de.scale=et,de.worldFx=new un,de.worldFx.name="worldFx",et.root.add(de.worldFx),Cn.init(de),de.nest=Cn,de.pillar=MS(),et.root.add(de.pillar),de.key=RS(de),Cn.level(0).add(de.key.group),pe.add(de.key.update,zt.WORLD),de.rim=DS(de),et.root.add(de.rim.group),rr.init(de),de.lamp=rr,Pe.init(e.camera),de.rig=Pe,Pe.setPose(vA()),_e.on("layout:change",()=>{de.director||Pe.setPose(vA())}),pe.add((n,i)=>{he.uTime.value=i/1e3,he.uWorldTime.value=pe.worldNow/1e3,he.uBreath.value=Ln.mix(0,1)},zt.CLOCK),pe.add(n=>rr.update(n),zt.LAMP),pe.add(n=>Pe.apply(n),zt.CAMERA),_e.on("gl:lost",()=>{try{de.t0||(de.t0=Pm(de)),de.t0.showLost()}catch(n){lt("main:t0",n)}}),_e.on("gl:restored",()=>{de.t0&&de.t0.hideLost&&de.t0.hideLost()}),fS(e)}function eD(){if(!(de.renderer&&de.renderer.three)||!de.scene||!de.camera)return;let e=[];de.scene.traverse(n=>{n.visible||(e.push(n),n.visible=!0)});try{de.renderer.warm(de.scene,de.camera,de.scene)}catch(n){lt("main:warm",n)}for(let n of e)n.visible=!1}function yA(t){(ee.phase==="boot"||ee.phase==="start")&&Fi("idle"),ee.booting=!1,de.director&&(de.director.settle(),t&&(t.room!=="CORE"||t.sub)&&de.director.go(t.hash,{source:"deeplink"}))}function _A(){de.renderer=de.scene=de.camera=de.key=de.rim=de.rig=de.scale=de.nest=de.lamp=null,de.composite=null,yt.tier="T0",ee.tier="T0";let t=document.getElementById("gl");t&&(t.hidden=!0)}document.readyState==="loading"?document.addEventListener("DOMContentLoaded",xA,{once:!0}):xA();})();
