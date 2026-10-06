(()=>{var px=n=>{try{return typeof matchMedia=="function"?matchMedia(n):null}catch{return null}},Mp=px("(prefers-reduced-motion: reduce)"),bp=px("(pointer: coarse)"),_p=typeof navigator<"u"&&navigator.userAgent||"",hx=typeof navigator<"u"&&navigator.maxTouchPoints||0,Jt={reducedMotion:!!(Mp&&Mp.matches),coarse:!!(bp&&bp.matches),touch:hx>0,ios:/iPad|iPhone|iPod/.test(_p)||/Macintosh/.test(_p)&&hx>1,android:/Android/i.test(_p)},dx=[];function mx(n,e){n&&(n.addEventListener?n.addEventListener("change",e):n.addListener&&n.addListener(e))}mx(Mp,n=>{Jt.reducedMotion=!!n.matches;for(let e=0;e<dx.length;e++)try{dx[e](Jt.reducedMotion)}catch(t){xt("env:rm","reduced-motion listener failed",t)}});mx(bp,n=>{Jt.coarse=!!n.matches});var fx=new Set;function xt(n,...e){if(!fx.has(n)){fx.add(n);try{console.warn(`[sam.vin] ${n}:`,...e)}catch{}}}var Cu=new Map,Se={on(n,e){let t=Cu.get(n);return t||(t=[],Cu.set(n,t)),t.push(e),()=>Se.off(n,e)},off(n,e){let t=Cu.get(n);if(!t)return;let i=t.indexOf(e);i<0&&(i=t.findIndex(r=>r.orig===e)),i>=0&&t.splice(i,1)},once(n,e){let t=i=>{Se.off(n,t),e(i)};return t.orig=e,Se.on(n,t),()=>Se.off(n,t)},emit(n,e){let t=Cu.get(n);if(!t||t.length===0)return;let i=t.slice();for(let r=0;r<i.length;r++)try{i[r](e)}catch(s){xt(`bus:${n}`,`listener for '${n}' threw`,s)}}};var xl=Object.freeze(["void","abyss","deep","steel","slate","pewter","silver","white","obsidian","ember","emberDeep","electrum","paper","ink"]),vl=Object.freeze({void:"--void",abyss:"--abyss",deep:"--deep",steel:"--steel",slate:"--slate",pewter:"--pewter",silver:"--silver",white:"--white",obsidian:"--obsidian",ember:"--ember",emberDeep:"--ember-deep",electrum:"--electrum",paper:"--paper",ink:"--ink"}),Yo=Object.freeze({void:"#04060A",abyss:"#070B12",deep:"#0C1420",steel:"#13202F",slate:"#233446",pewter:"#5E6E80",silver:"#B8C4D0",white:"#EEF2F6",obsidian:"#0B1119",ember:"#FF6A2B",emberDeep:"#B23A12",electrum:"#E8C872",paper:"#E6EAEE",ink:"#0C1420"}),gx=Object.freeze({void:"#E6EAEE",abyss:"#E6EAEE",deep:"#E6EAEE",steel:"#9AA6B4",slate:"#9AA6B4",silver:"#0C1420",white:"#0C1420",obsidian:"#D3D9DF"});function Sp(n){return parseInt(n.slice(1),16)}function xx(n,e=[0,0,0]){let t=Sp(n);return e[0]=(t>>16&255)/255,e[1]=(t>>8&255)/255,e[2]=(t&255)/255,e}function Lu(n,e){let t={};for(let i of Object.keys(n))t[i]=e(n[i]);return Object.freeze(t)}var OI=Lu(Yo,Sp),DS=Lu(Yo,n=>Object.freeze(xx(n))),FI=Lu(gx,Sp),NS=Lu(gx,n=>Object.freeze(xx(n)));function Du(n,e,t=[0,0,0]){let i=DS[n],r=NS[n]||i;return t[0]=i[0]+(r[0]-i[0])*e,t[1]=i[1]+(r[1]-i[1])*e,t[2]=i[2]+(r[2]-i[2])*e,t}var UI=Object.freeze({giant:.07,counter:.12,status:.85,scrim:.6,scrimBreath:[.58,.62],leader:.7,line:.55,vertex:.4,inlay:.45,fresnel:.55,grains:.35,grainsBreath:[.32,.38],axisInside:.35,marginalia:.8,legendBand:.4,column:.7,dimmed:.4,hoverOthers:.55,dome:.45,contours:.4,doneLight:.12,ghost:.6,ghostStroke:.3,whale:.3,spark:.3,rimBoot:[.06,.12],bandHover:1.25}),BI=Object.freeze({maxFrac:.03,peakFrac:.06,peakMs:1500,maxLinePx:2,maxDotPx:6,maxTextPx:11,burnCoolMs:1200}),kI=Object.freeze({maxMs:2500,coolMs:600,nightNucleus:.55}),kr=Object.freeze({nucleusIntensity:.55,litAlpha:.7,breathMs:7e3,drowsyBreathMs:5600,mixMs:1200,yawnMs:1200}),zI=Object.freeze({sans:'"Geologica", system-ui, sans-serif',mono:'"Martian", ui-monospace, monospace'}),VI=Object.freeze({giant:{family:"sans",wght:100,tracking:-.04,lh:.8,desktop:"38vw",phone:"62vmin",alpha:.07},display:{family:"sans",wght:220,tracking:-.035,lh:.9,desktop:"clamp(56px, 8.4vw, 148px)",phone:"13vmin"},heading:{family:"sans",wght:560,desktop:[28,34],phone:[26,31]},lead:{family:"sans",wght:300,desktop:[22,30],phone:[19,26]},brief:{family:"sans",wght:380,desktop:[19,28],phone:[17,25]},body:{family:"sans",wght:380,desktop:[17,25],phone:[16,24],measureCh:36},status:{family:"sans",wght:400,desktop:[16,22],phone:[16,22],maxChars:34,measureCh:44},label:{family:"mono",wght:500,wdth:87.5,tracking:.08,upper:!0,desktop:[11,14],phone:[11,14]},data:{family:"mono",wght:250,wdth:100,tabular:!0,desktop:[72,72],phone:[48,48]},micro:{family:"mono",wght:450,wdth:75,tracking:.1,upper:!0,desktop:[9.5,12],phone:[10,13]}}),yl=Object.freeze({sign:'700 {px}px "Geologica"',burn:'700 {px}px "Geologica"',sand:'700 {px}px "Geologica"',ring:'500 {px}px "Martian"'});var Pu=Object.freeze({base:20,range:80,perDay:.08,perSecret:.06});function wp(n,e){return Math.min(1,Pu.perDay*n+Pu.perSecret*e)}function vx(n,e){return Math.round(Pu.base+Pu.range*wp(n,e))}var GI=Object.freeze([120,240,480,960,1920]),HI=Object.freeze({o1:120,o2:240,o3:480,o4:960,o5:1920}),yx=Object.freeze({heavy:Object.freeze({omega:6,zeta:1}),medium:Object.freeze({omega:12,zeta:1}),light:Object.freeze({omega:22,zeta:1}),struck:Object.freeze({omega:18,zeta:.18}),notice:Object.freeze({omega:6.3,zeta:.95}),reindex:Object.freeze({omega:9,zeta:1}),hot:Object.freeze({omega:14,zeta:1}),hint:Object.freeze({omega:8,zeta:.25})}),fi=Object.freeze({inertiaDecay:.92,frameMs:16.7,spinDecay:.96,overshootMax:.04,snapOvershoot:.04,settleOvershoot:.02,anticipationFrac:.03,anticipationMs:120,anticipationMinDisp:.1,responseMs:80,pressScale:.96,pressMs:90,rippleMs:260,ripplePx:48}),qo=Object.freeze({periodMs:4200,inhaleMs:1800,exhaleMs:2400,drowsyMs:5600,nightMs:7e3,reducedAmp:.25,nucleus:[.8,1],gap:[.02,.026],grainAlpha:[.32,.38],scrim:[.58,.62],edgeSwayPx:.2,droneDb:2});function Iu(n,e,t,i){let r=3*n,s=3*(t-n)-r,o=1-r-s,a=3*e,l=3*(i-e)-a,c=1-a-l,u=f=>((o*f+s)*f+r)*f,d=f=>((c*f+l)*f+a)*f,h=f=>(3*o*f+2*s)*f+r;return function(g){if(g<=0)return 0;if(g>=1)return 1;let y=g;for(let b=0;b<8;b++){let S=u(y)-g;if(Math.abs(S)<1e-6)return d(y);let _=h(y);if(Math.abs(_)<1e-6)break;y-=S/_}let m=0,p=1;y=g;for(let b=0;b<24;b++){let S=u(y);if(Math.abs(S-g)<1e-6)break;S<g?m=y:p=y,y=(m+p)/2}return d(y)}}var WI=Object.freeze({camera:Object.freeze([.7,0,.15,1]),reveal:Object.freeze([.16,1,.3,1]),phosphor:Object.freeze([.2,0,0,1])}),_x=Object.freeze({camera:Iu(.7,0,.15,1),reveal:Iu(.16,1,.3,1),phosphor:Iu(.2,0,0,1),linear:n=>n<=0?0:n>=1?1:n,sine:n=>.5-.5*Math.cos(Math.PI*(n<=0?0:n>=1?1:n))}),_e=Object.freeze({dive:1600,diveFirst:2400,diveFirstScale:1.375,diveFirstHold:200,diveSwapAt:1200,diveSwapAtFirst:1850,recall:1200,recallSwapAt:1e3,recallRatchetMs:40,liftBase:900,liftPerBoundary:280,liftMax:1800,slice:280,sliceSwap:140,depart:240,arrive:600,readableOut:120,retargetMin:600,retargetFactor:.8,skipSpeed:3,interactiveU:.7,releaseSourceMs:300,tierFreezeMs:300,unfold:1600,unfoldFirst:2200,refold:900,memberFocus:900,memberBack:600,shluz:1400,shluzBack:900,extract:600,workshop:1200,zenith:2400,nadirFirst:2800,focusReduced:160,bootDesktop:7200,bootReturning:3500,bootSameDay:2e3,bootReduced:2e3,lockStep:220,lockStepSameDay:110,firstLock:3400,ignite:4940,ignitionReturning:2640,typeMsPerChar:28,scanMs:800,burnMsPerLetter:70,burnCoolMs:1200,assemble:480,drawIn:600,phoneActivateWindow:1500,phonePartialHold:2500,phonePartialDrift:900,phoneHintDelay:2200,phoneHintReturning:4e3,lockIn:480,lockInReduced:160,revealMsPerChar:12,revealMax:240,beamCps:22,phosphor:900,statusIn:240,statusHold:4e3,idleRotate:2e4,leadDefault:4e3,leaderDraw:240,leaderStagger:40,labelLowpass:120,coordHz:10,keyHoverTrigger:120,keyHoverIn:480,keyHoverOut:520,dimsDraw:240,navHover:240,navTwin:240,longPress:800,relaunch:2e3,relaunchRingDelay:300,hintGlint:1200,overpullHold:600,stringRing:900,stringFlash:120,shudder:240,hintArriveWindow:3e4,idleLampMs:3e3,lampSweepMs:9e3,lampBlendMs:600,shardFlight:900,electrum:2500,electrumCool:600});var Mx=Math.log(1e3),XI=Object.freeze([-1,0,1,2]),bx=1.5,Ep=Object.freeze({near:.002,far:400}),tr=Object.freeze({min:3.2,max:12,rest:7.2,wheelFactor:1.1,wheelStepPx:100}),$I=Object.freeze({d0:12,k:Mx,wheelDiv:2400,pinchGain:1.5,pauseMs:400,decay:.92,elevationDeg:8,settleIdleMs:600,settleMs:1600,settleTo:7.2,leadMs:4e3,strutTickMax:30,stages:Object.freeze([["КЛЮЧ",60],["ЗАЛ ЯДРА",600],["VIN",3600],["VIN ЦЕЛИКОМ",12e3]]),passLatticeD:[300,620]}),Sx=Object.freeze({d0:.06,k:Mx,miniKeyBelow:.05}),YI=Object.freeze({height:2400,diameter:1240,radius:620}),oo=Object.freeze({H:2.4,R:.62,k:1.35,halfH:1.2});function Ct(n){let e=Math.min(1,Math.abs(n)/oo.halfH);return oo.R*(1-Math.pow(e,oo.k))}var an=Object.freeze([{i:0,sign:"S",code:"SIGNAL",top:1.2,bot:.98,n:3,hollow:0,k:72},{i:1,sign:"A",code:"ARCHIVE",top:.96,bot:.66,n:5,hollow:0,k:120},{i:2,sign:"M",code:"MEMBERS",top:.64,bot:.28,n:7,hollow:0,k:168},{i:3,sign:"•",code:"CORE",top:.26,bot:-.26,n:12,hollow:.3,k:288},{i:4,sign:"V",code:"VOYAGES",top:-.28,bot:-.64,n:7,hollow:0,k:168},{i:5,sign:"I",code:"INSIGNIA",top:-.66,bot:-.96,n:5,hollow:0,k:120},{i:6,sign:"N",code:"NADIR",top:-.98,bot:-1.2,n:3,hollow:0,k:72}].map(n=>Object.freeze({...n,height:Math.round((n.top-n.bot)*1e3)/1e3,mid:(n.top+n.bot)/2,rTop:Ct(n.top),rBot:Ct(n.bot),rMax:n.top>0&&n.bot<0?oo.R:Math.max(Ct(n.top),Ct(n.bot))}))),_l=Object.freeze(["S","A","M","•","V","I","N"]),Nu=Object.freeze([0,1/3,2/3,1]),It=Object.freeze({rest:.02,breath:.026,leanAdd:.01,hover:.09,hoverNeighbourPush:.012,dive:.3,unfold:.42,recallStart:.3}),Dt=Object.freeze({radius:1.25,apertureD:.09,ringEngraveW:.004,hollowR:.3,sign:Object.freeze({depth:.004,heightFrac:.7,strokeFrac:.12,face:0}),friezeH:.018,ticksPerFace:12,tickLen:.025,backFace:6,hoverSlide:.06,diveSlide:.25,diveTurnAwayDeg:20,contract:.03,nucleusAnticipation:1.6,lattice:Object.freeze({faceShift:.75,segmentsPerGenerator:8,generators:2016,segments:16128,solidBelowCamDist:2.4}),r1:Object.freeze({spLo:3,spHi:6}),unfold:Object.freeze({camFrom:7.2,camTo:Object.freeze([0,.04,.95]),ringScale:2.4,ringR:1.3,ringArcDeg:300,ringCap:.06,coreRingCap:.12,platesR:.16,plateSize:.05,platesPeriodS:24,orbitYawDeg:35}),pitchFlipDeg:110,pitchResist:.35,pitchResistMaxDeg:30,yawMaxDeg:180,yawReturnMs:2e3}),zn=Object.freeze({r:.035,detail:1,glowR:.0528,breathRingR:.09,apertureAlignDeg:Object.freeze([35,10]),gapOpen:Object.freeze([.03,.09]),minVisibility:.25,hotGain:.4,intensity:Object.freeze([.8,1]),birthdayPulse:1.3}),ki=Object.freeze({half:1.2,extend:3.2,widthPx:2,alphaInside:.35,shootMs:240}),qI=Object.freeze({driftYawDeg:14,driftPeriodS:40,swayDeg:1.5,swayPeriodsS:Object.freeze([11,13,17,19,23,29,31]),faceViewerDeg:16,reindexMs:Object.freeze([23e3,41e3]),reindexBackMs:1600,reindexTurnMs:620,noticeMaxDeg:7,noticeBootDeg:6,tauBaseMs:40,tauStepMs:40,hotDelayMs:220,hotDelayLateMs:90,hotTrackMs:3e3,hotRampMs:1e3,leanSpeedPx:300,leanRadius:1.2,leanDz:.08,flinchSpeedPx:2500,flinchRadius:1.5,flinchInMs:120,flinchRelaxMs:700,flinchScatter:.05,repelR:.35,repelCap:.06,repelBackMs:900}),jo=Object.freeze({T3:24576,T2:16384,T1:8192,annulus:Object.freeze([1.15,1.9]),kepler:.06,jitter:.002,sizePx:Object.freeze([1.2,2]),chunk:4096}),ao=Object.freeze({faces:Object.freeze([11,0,1]),stratum:3,apertureSkip:.06,dotPx:1.5,emitterM:1.2}),jI=Object.freeze({max:7,size:.1,r:1.05,tiltDeg:12,periodS:90}),ZI=Object.freeze({size:.24,r:1.6,periodS:60,bpm:71,arriveDay:10,flyMs:2400});var wx=Object.freeze({SIGNAL:1090,ARCHIVE:810,MEMBERS:460,CORE:0,VOYAGES:-460,INSIGNIA:-810,NADIR:-1090,ZENITH:1260,WORKSHOP:484}),Ex=Object.freeze({SIGNAL:[980,1200],ARCHIVE:[660,960],MEMBERS:[280,640],CORE:[-260,260],VOYAGES:[-640,-280],INSIGNIA:[-960,-660],NADIR:[-1200,-980],ZENITH:[1200,1400],WORKSHOP:[482,487]}),gn=Object.freeze({wallsNear:300,wallsFar:620,wallVis:Object.freeze([.08,.14]),strutSpacing:Object.freeze([13,60]),ringStep:20,irisR:18,irisBlades:7,irisBladeDeg:51.4,irisPassR:12,deckR:60,deckRingStep:4,beadR:1.8,beadStep:25,beadCount:97,coreRimR:300,coreIrisY:260,liftOffset:Object.freeze([12,0,6]),drawCalls:40,triangles:12e4,labels:24,labelsLow:16}),Ze=Object.freeze({fov:35,fovWide:40,core:Object.freeze({pos:[0,.75,7.2],target:[0,0,0],fov:35,phoneOffsetY:-.06}),boot:Object.freeze({start:[0,.4,16],dolly:9.5,rest:7.2,driftM:.08,driftHz:[.13,.11],tiltDeg:3}),phoneStart:Object.freeze({dist:5.2,keyFrac:.78,centreFrac:.47}),members:Object.freeze({pos:[0,10,48],target:[0,12.5,0],fov:35,phonePos:[0,11,40]}),voyages:Object.freeze({pos:[0,70,44],target:[0,0,-6],fov:35,altRange:[60,140],phonePos:[0,96,30],phonePitchDeg:-70}),archive:Object.freeze({tubeR:9,eyeBelowBand:.4}),signal:Object.freeze({pos:[0,2,26],target:[0,30,0],fov:40,phonePos:[0,2,30],phonePitchDeg:40,apexH:110,apexR:12}),insignia:Object.freeze({pos:[0,1.7,0],fov:40,sphereR:30}),nadir:Object.freeze({depth:110}),zenith:Object.freeze({aboveApex:60,pitchDeg:-62,phonePitchDeg:-70}),workshop:Object.freeze({chamber:4.4,grid:2.4,nodeStep:.4})}),dt=Object.freeze({phoneMaxShort:600,landMaxH:500,desktop:Object.freeze({cols:12,margin:48,gutter:24,chrome:24,edgeInset:14,statusBottom:40,datumFrac:.62}),phone:Object.freeze({cols:4,margin:16,gutter:12,chrome:16,edgeInset:10,statusAboveBand:12,datumPx:120,titleTopPx:72}),measureCh:36,statusMeasureCh:44,hit:44,hitRow:56,crossPx:7,leader:Object.freeze({widthPx:.5,alpha:.7,elbowMin:24,elbowMax:64,runMax:120,maxAnchors:24,maxAnchorsLow:16}),dims:Object.freeze({widthPx:.5,arrowPx:6,extPx:4,gapPx:4,offsetPx:24}),scrim:Object.freeze({scale:1.4,featherPx:40}),nav:Object.freeze({w:56,h:300,hoverW:260,right:24,widthScale:.36,needlePx:12,slotPx:3,zenithDotPx:2,zenithDotAbove:10,twinPx:40,magnetPx:12,wheelPxPerDetent:120,rubber:.35,rubberMax:48,overpullPx:140,letterPx:11}),band:Object.freeze({h:88,sideW:72,letterPx:13,minCell:44}),sheet:Object.freeze({maxFrac:.62,peek:120,handle:24,sideFrac:.44}),elevator:Object.freeze({pxPerHall:360,resistance:.22,tickPx:60}),edge:Object.freeze({pluckPxMs:.4,bendPx:8,twitchPx:2}),sound:Object.freeze({w:32,h:12,bars:8,fps:30}),cursorPx:6,rippleMaxPx:48,beamHeadPx:3,statusDotPx:6}),Qt=Object.freeze({r1:Object.freeze({lo:3,hi:6,bayer:8}),r2:Object.freeze({fresnelPow:3,fresnelGain:.55,spec:Object.freeze([[24,.35],[160,.6]])}),r3:Object.freeze({widthPx:1,primaryPx:1.5,axisPx:2,alpha:.55,glintPow:24,glintGain:.9,farFadeStart:.55,primaryEdges:12}),r4:Object.freeze({atlas:1024,atlasLow:512,rakeLo:.55,rakeHi:.9,inlay:.45,heightTaps:4}),r5:Object.freeze({radiusFactor:2.2,elevationDeg:12,idleMs:3e3,sweepMs:9e3,blendMs:600}),r6:Object.freeze({threshold:.82,levels:4,spritePx:64}),r7:Object.freeze({grain:.02,grainBoot:.025,grainBootUntilMs:1800,grainFps:24,clearInPx:120,clearOutPx:180,vignette:.18,vignetteFrom:.35}),r8:Object.freeze({fogVis:Object.freeze([.08,.14])}),dprCap:Object.freeze({T3:2,T2:1.5,T1:1.25}),dprStep:.25,governor:Object.freeze({windowFrames:90,lowFps:52,dropAfterMs:3e3,highFps:58,upgradeAfterMs:1e4}),budget:Object.freeze({drawCalls:40,triangles:12e4,textureMB:12})}),Ax=30;var fe={kind:"desktop",isPhone:!1,w:0,h:0,dpr:1,safe:{t:0,r:0,b:0,l:0}},Zo=null;function OS(){if(typeof document>"u"||!document.body)return;Zo||(Zo=document.createElement("div"),Zo.setAttribute("aria-hidden","true"),Zo.style.cssText="position:fixed;left:0;top:0;width:0;height:0;visibility:hidden;pointer-events:none;padding:env(safe-area-inset-top,0px) env(safe-area-inset-right,0px) env(safe-area-inset-bottom,0px) env(safe-area-inset-left,0px)",document.body.appendChild(Zo));let n=getComputedStyle(Zo);fe.safe.t=parseFloat(n.paddingTop)||0,fe.safe.r=parseFloat(n.paddingRight)||0,fe.safe.b=parseFloat(n.paddingBottom)||0,fe.safe.l=parseFloat(n.paddingLeft)||0}var Ap=null;function FS(){try{return Ap||(Ap=matchMedia("(pointer: coarse)")),Ap.matches}catch{return!1}}function Ou(){if(typeof window>"u")return!1;let n=Math.max(1,Math.round(window.innerWidth||document.documentElement.clientWidth||1)),e=Math.max(1,Math.round(window.innerHeight||document.documentElement.clientHeight||1)),t=FS()&&Math.min(n,e)<=dt.phoneMaxShort,i=t?e<dt.landMaxH?"phone-land":"phone":"desktop",r=window.devicePixelRatio||1,s=fe.safe.t,o=fe.safe.r,a=fe.safe.b,l=fe.safe.l;OS();let c=n!==fe.w||e!==fe.h||i!==fe.kind||r!==fe.dpr||s!==fe.safe.t||o!==fe.safe.r||a!==fe.safe.b||l!==fe.safe.l;return fe.w=n,fe.h=e,fe.kind=i,fe.isPhone=t,fe.dpr=r,c}var Tp=0;function Rp(){if(Tp)return;let n=()=>{Tp=0,Ou()&&Se.emit("layout:change",{kind:fe.kind,w:fe.w,h:fe.h})};Tp=typeof requestAnimationFrame=="function"?requestAnimationFrame(n):setTimeout(n,16)}if(typeof window<"u"){Ou(),window.addEventListener("resize",Rp),window.addEventListener("orientationchange",Rp);try{matchMedia("(pointer: coarse)").addEventListener("change",Rp)}catch{}}var ee={phase:"boot",room:"CORE",route:{room:"CORE",sub:null,hash:"#/core"},u:0,tier:"T2",soundOn:!0,night:!1,drowsy:!1,birthday:!1,owner:!1,inverted:!1,unfolded:!1,pullNest:0,resonancePct:0,status:"",columns:[],satellites:0,companion:!1,booting:!0,hintTarget:null};function zi(n){let e=ee.phase;n!==e&&(ee.phase=n,Se.emit("phase:change",{phase:n,prev:e}))}var Ko={operator:{id:"sam",name:"Сэм",aliases:["сэм","sam","сэмми","семён","semyon"],callsign:"ВЕДУЩИЙ",birthday:"2018-04-12"},clan:{name:"SAM.VIN",motto:"Своих не бросаем. Даже в лаве.",founded:"2025-03-14",frequency:14.03,sigil:[[3,21],[21,45],[45,27],[27,3],[21,27],[3,45]]},members:[{id:"sam",name:"Сэм",callsign:"ВЕДУЩИЙ",role:"основатель",status:"на связи",level:12,missions:21,seed:7,note:"D4",glyph:null,trait:"Придумал клан на перемене. Всегда идёт первым.",joke:"Говорит «я рядом», когда он на другом конце карты.",achievements:["start","bridge","onehp"]},{id:"lev",name:"Лёва",callsign:"ЯКОРЬ",role:"защита",status:"на связи",level:11,missions:17,seed:23,note:"G3",glyph:[[3,38],[9,11],[38,29],[38,33]],trait:"Если Лёва держит точку — точка держится.",joke:"Знает все карты наизусть. Даже те, которых нет.",achievements:["start","bridge"]},{id:"tim",name:"Тимур",callsign:"ЭХО",role:"разведка",status:"в пути",level:9,missions:14,seed:41,note:"A3",glyph:[[21,9],[9,39],[39,27]],trait:"Слышит соперника раньше, чем тот появится.",joke:"Всегда приходит последним — и спасает всех.",achievements:["three"]},{id:"kira",name:"Кира",callsign:"ЛИСА",role:"наблюдение",status:"на связи",level:10,missions:15,seed:5,note:"B3",glyph:[[8,38],[38,12],[12,8],[8,2],[12,4]],trait:"Видит то, что пропустили все.",joke:"Однажды спряталась так, что её не нашли до конца матча.",achievements:["silent","three"]},{id:"danya",name:"Даня",callsign:"ГРОМ",role:"прорыв",status:"отдыхает",level:8,missions:11,seed:17,note:"E4",glyph:[[4,23],[23,25],[25,44]],trait:"Громкий только в голосовом чате.",joke:"Прыгнул с крыши. Долетел. До сих пор этим гордится.",achievements:["roof"]},{id:"misha",name:"Миша",callsign:"КОМЕТА",role:"связь",status:"в пути",level:7,missions:9,seed:31,note:"G4",glyph:[[36,12],[36,26],[36,18]],trait:"Самый быстрый. Иногда слишком.",joke:"Первым добежал до финиша. В другую сторону.",achievements:["pizza"]},{id:"ars",name:"Арсений",callsign:"ТИШИНА",role:"новичок",status:"на связи",level:3,missions:2,seed:13,note:"A4",glyph:[[21,27],[24,17]],trait:"Новичок. Уже удивил всех.",joke:"Спросил, где кнопка «победить». Мы ищем до сих пор.",achievements:[]}],missions:[{code:"001",title:"Первая высадка",status:"done",brief:"Первый матч клана в полном составе.",conditions:["4 игрока","одна попытка"],crew:["sam","lev","tim","kira"],result:"Проиграли 0:12. Но вместе.",reward:"start",log:"Зонд нашёл на месте высадки старый флаг клана. Он всё ещё там."},{code:"002",title:"Мост над пропастью",status:"done",brief:"Перебраться всем отрядом. Никто не должен упасть.",conditions:["весь отряд","без возрождений"],crew:["sam","lev","danya","misha"],result:"Упали двое. Вернулись.",reward:"bridge",log:"Зонд проверил мост. Мост держится. Лёва, видимо, тоже."},{code:"003",title:"Тихая гавань",status:"done",brief:"Удержать маяк до заката и ни разу не потерять связь.",conditions:["отряд из 3","без потерь","до заката"],crew:["sam","kira","tim"],result:"Маяк наш. Связь — сто процентов.",reward:"silent",log:"Зонд вернулся. На маяке кто-то оставил пиццу."},{code:"004",title:"Северная башня",status:"active",brief:"Добраться до вершины втроём.",conditions:["3 игрока","без возрождений"],crew:["sam","lev","ars"],result:"",reward:"tower",log:"Зонд долетел до середины башни. Вершина видна. Она высокая."},{code:"005",title:"Ночная смена",status:"new",brief:"Продержаться до рассвета. Говорить только шёпотом.",conditions:["4 игрока","шёпотом","до рассвета"],crew:[],result:"",reward:"night",log:"Зонд слушал всю ночь. Кто-то храпел. Не будем говорить кто."},{code:"006",title:"Тёмная вода",status:"locked",decodeDays:5,brief:"Найти, откуда идёт сигнал под водой.",conditions:["5 игроков","с фонарями"],crew:[],result:"",reward:null,log:"Зонд нырнул. Сигнал идёт снизу. Там что-то светится."},{code:"007",title:"Город без карты",status:"locked",unlockAtDays:7,brief:"Пройти город, где никто не был, и нарисовать его карту.",conditions:["весь клан","без подсказок"],crew:[],result:"",reward:null,log:"Зонд нарисовал карту. Город похож на ключ. Совпадение?"},{code:"008",title:"Сто ступеней",status:"locked",unlockAtDays:14,brief:"Подняться по самой длинной лестнице, не упав ни разу.",conditions:["2 игрока","ни одного падения"],crew:[],result:"",reward:null,log:"Зонд насчитал 101 ступень. Одна была лишняя."},{code:"000",title:"Исток",status:"sealed",brief:"Вернуться туда, где всё началось, и оставить там свой знак.",conditions:["весь клан","знак лидера"],crew:[],result:"",reward:"origin",log:"Зонд вернулся с фото первого матча. Все улыбаются. Даже проигравшие."}],achievements:[{id:"start",title:"Начало",shape:"nested",rarity:"обычная",earned:!0,date:"2025-03-15",who:["sam","lev","tim","kira"],text:"Мы сыграли первый матч вместе."},{id:"roof",title:"Прыжок с крыши",shape:"knot",rarity:"легендарная",earned:!0,date:"2025-05-30",who:["danya"],text:"Никто не верил. Гром прыгнул. Гром долетел."},{id:"bridge",title:"Мост выстоял",shape:"twisted",rarity:"редкая",earned:!0,date:"2025-06-02",who:["sam","lev","danya","misha"],text:"Трое против пяти. Мост остался наш."},{id:"three",title:"Трое против всех",shape:"stellated",rarity:"легендарная",earned:!0,date:"2025-08-19",who:["tim","kira","sam"],text:"Нас было трое. Их — все остальные. Победили мы."},{id:"silent",title:"Тишина в эфире",shape:"bipyramid",rarity:"редкая",earned:!0,date:"2025-09-27",who:["kira","tim","sam"],text:"Целый раунд без единого слова. И победили."},{id:"onehp",title:"Победа с 1 HP",shape:"stellated",rarity:"редкая",earned:!0,date:"2025-12-20",who:["sam"],text:"Одна жизнь. Одна попытка. Этого хватило."},{id:"pizza",title:"Пицца-протокол",shape:"nested",rarity:"обычная",earned:!0,date:"2026-01-04",who:["misha","danya"],text:"Перерыв на пиццу посреди решающего матча. Всё равно выиграли."},{id:"tower",title:"Северная башня",shape:"bipyramid",rarity:"редкая",earned:!1,text:"Подняться на вершину втроём."},{id:"night",title:"Ночная смена",shape:"knot",rarity:"обычная",earned:!1,text:"Продержаться до рассвета шёпотом."},{id:"hundred",title:"Сотня",shape:"twisted",rarity:"легендарная",earned:!1,text:"Сыграть сто матчей вместе."},{id:"origin",title:"Исток",shape:"stellated",rarity:"легендарная",earned:!1,text:"Пройти вылазку 000."}],legends:[{id:"found",date:"2025-03-14",kind:"эпичное",title:"Основание",text:"Три человека, один ноутбук, ноль побед. Так всё началось."},{id:"jump",date:"2025-05-30",kind:"победа",title:"Прыжок с крыши",text:"Никто не верил. Гром прыгнул. Гром долетел."},{id:"nights",date:"2025-11-14",kind:"эпичное",title:"Ночь трёх возрождений",text:"Остался один. Поднял всех. Никто до сих пор не понимает как."},{id:"wifi",date:"2026-03-12",kind:"смешное",title:"Великое падение Wi-Fi",text:"Мы почти выиграли. Почти. Роутер помнит всё."}],moments:[{id:"hide",date:"2025-04-20",title:"Лучшее укрытие",who:["kira"],text:"Кира спряталась так хорошо, что её не нашли до конца матча. Даже свои."},{id:"bug",date:"2025-07-08",title:"Великий баг на мосту",who:["danya"],text:"Мост исчез у всех, кроме Дани. Даня стоял в воздухе и не понимал, почему все кричат."},{id:"room",date:"2025-10-02",title:"Секретная комната",who:["lev"],text:"Лёва нашёл секретную комнату и двадцать минут не мог из неё выйти."},{id:"wrong",date:"2026-02-15",title:"Не туда",who:["misha"],text:"Миша первым добежал до финиша. В другую сторону."},{id:"button",date:"2026-06-01",title:"Кнопка «победить»",who:["ars"],text:"Арсений спросил, где кнопка «победить». Мы ищем до сих пор."},{id:"mic",date:"2026-08-23",title:"Тихий план",who:["tim"],text:"Тимур полчаса рассказывал план. Микрофон был выключен. План сработал всё равно."}],jokes:[{id:"key",date:"2025-03-20",hidden:!1,trigger:"ключ",text:"Кто взял ключ? — Никто не брал ключ."},{id:"cover",date:"2025-06-10",hidden:!1,trigger:"прикрывал",text:"Я не отстал. Я прикрывал."},{id:"maps",date:"2025-09-01",hidden:!0,trigger:"карты",text:"Правило №1: не спорить с Лёвой про карты."},{id:"micro",date:"2025-10-15",hidden:!0,trigger:"микрофон",text:"Кто опять забыл включить микрофон?"},{id:"pizza",date:"2026-01-04",hidden:!0,trigger:"пицца",text:"ПИЦЦА-ПРОТОКОЛ АКТИВИРОВАН."},{id:"tactic",date:"2026-04-01",hidden:!0,trigger:"манёвр",text:"Это был тактический манёвр."}],transmissions:[{from:"ШТАБ",text:"Добро пожаловать в VIN. Здесь всё ваше."},{from:"ШТАБ",text:"Новая вылазка откроется в субботу. Готовьтесь."},{from:"ПАПА",text:"Горжусь вашим кланом. Конец связи."},{from:"ШТАБ",text:"Напоминание: вода — тоже снаряжение."},{from:"ШТАБ",text:"На маяке нашли пиццу. Расследование продолжается."},{from:"МАМА",text:"Уроки — это тоже миссия. Секретная."},{from:"ШТАБ",text:"Сегодня отличный день, чтобы найти что-нибудь новое."},{from:"ШТАБ",text:"Если увидишь кита — передай привет."},{from:"ПАПА",text:"Тот, кто читает эту передачу, — молодец. Да, ты."},{from:"ШТАБ",text:"Ключ светится ярче, когда вы вместе."}],signal:{secret:"Частота 14.03 — день, когда всё началось. Ты её нашёл. Об этом знают только свои."},capsule:{openAfterDays:7,text:"Если ты это читаешь — ты вернулся. Настоящий исследователь всегда возвращается. — Папа"},zenith:{message:"Отсюда видно всё, что вы построили. Это только начало."},nadir:{origin:"Всё началось 14 марта 2025 года. Сэм придумал название на перемене: SAM.VIN. Первый матч мы проиграли 0:12. Никто не ушёл. С тех пор ключ светится."},night:{from:21,to:7,drowsyFrom:20,story:"Ночью в VIN тихо. Узлы светятся вполсилы, как окна в доме, где все уже спят."},companion:{name:"Искра"}};function Cp(n){let e=Math.max(0,Math.min(48,n|0));return{x:e%7/6,y:Math.floor(e/7)/6}}function Tx(n){if(typeof n=="number")return Number.isFinite(n)?Math.round(n):NaN;if(typeof n=="string"&&n.trim()!==""){let e=Number(n.trim());return Number.isFinite(e)?Math.round(e):NaN}return NaN}function lo(n){let e=[];if(!Array.isArray(n))return e;let t=new Set;for(let i=0;i<n.length&&e.length<24;i++){let r=n[i];if(!Array.isArray(r)||r.length!==2)continue;let s=Tx(r[0]),o=Tx(r[1]);if(!(s>=0&&s<=48&&o>=0&&o<=48)||s===o)continue;let a=Math.min(s,o),l=Math.max(s,o),c=a*64+l;t.has(c)||(t.add(c),e.push([a,l]))}return e}function Ml(n){let e=n>>>0;return function(){e=e+1831565813>>>0;let i=e;return i=Math.imul(i^i>>>15,i|1),i^=i+Math.imul(i^i>>>7,i|61),((i^i>>>14)>>>0)/4294967296}}function bl(n){let e=2166136261,t=String(n);for(let i=0;i<t.length;i++)e^=t.charCodeAt(i),e=Math.imul(e,16777619);return e>>>0}var sP=.5*(Math.sqrt(3)-1),oP=(3-Math.sqrt(3))/6,aP=new Float32Array([1,1,-1,1,1,-1,-1,-1,1,0,-1,0,0,1,0,-1]);function Fu(n,e,t,i){let r=Math.floor(Math.abs(Number(n)||0)),s=r%10,o=r%100;return o>=11&&o<=14?i:s===1?e:s>=2&&s<=4?t:i}function US(n){let e="";for(let t=0;t<n.length;t++)t>0&&(n.length-t)%3===0&&(e+=" "),e+=n[t];return e}function Cx(n,e=2){let t=Number(n)||0,i=Math.abs(t).toFixed(e),r=i.indexOf("."),s=r>=0?i.slice(0,r):i,o=r>=0?i.slice(r):"";return(Number(i)===0?"±":t>0?"+":"−")+US(s)+o}var Rx=n=>(n<10?"0":"")+n;function Ix(n,e="dd.mm.yyyy"){if(n==null)return"";let t=String(n),i,r,s,o=/^(\d{4})-(\d{2})-(\d{2})$/.exec(t);if(o)i=+o[1],r=+o[2],s=+o[3];else{let l=Date.parse(t);if(!Number.isFinite(l))return"";let c=new Date(l);i=c.getFullYear(),r=c.getMonth()+1,s=c.getDate()}let a=`${Rx(s)}.${Rx(r)}`;return e==="dd.mm"?a:`${a}.${i}`}function Sl(n){return String(n??"").toLocaleUpperCase("ru")}var Px=Object.freeze({"boot.pointer":{text:"вижу тебя.",p:3},"boot.nopointer":{text:"система проснулась.",p:3},"return.sameDay":{text:"снова ты.",p:3},"return.days":{text:"ты вернулся. тебя не было {N} {N:день|дня|дней}.",p:3},"return.days.owner":{text:"привет, {name}. тебя не было {N} {N:день|дня|дней}.",p:3},"return.node":{text:"пока тебя не было: +1 узел.",p:2},night:{text:"спокойной ночи, {name}.",p:3},drowsy:{text:"скоро ночь.",p:3},"night.flinch":{text:"ещё не сплю.",p:1},"tab.back":{text:"вот ты где.",p:3},"drawing.boot":{text:"помню твой рисунок.",p:3},"drawing.saved":{text:"запомнил.",p:1},"glyph.saved":{text:"запомнил.",p:1},"probe.sent":{text:"зонд {code} в пути. вернётся завтра.",p:1},"probe.back":{text:"зонд {code} вернулся. есть запись.",p:2},"transmission.new":{text:"пришла передача.",p:2},"mission.decoded":{text:"вылазка {code} расшифрована.",p:2},"companion.far":{text:"кто-то летит к нам.",p:2},"companion.near":{text:"он ближе. осталось {n} {n:день|дня|дней}.",p:2},"companion.arrived":{text:"он прилетел. его зовут {name}.",p:1},"capsule.open":{text:"капсула открыта.",p:1},birthday:{text:"с днём рождения, {name}!",p:2},anniversary:{text:"сегодня {title}. {years} {years:год|года|лет} назад.",p:2},found:{text:"найдено.",p:1},shard:{text:"осколок {k} из 5 на месте.",p:1},"nadir.open":{text:"внизу что-то открылось.",p:1},rank:{text:"новый ранг: {rank}.",p:1},dizzy:{text:"всё кружится.",p:1},"dizzy.after":{text:"уже лучше.",p:1},whale:{text:"смотри. кит.",p:1},drone:{text:"дрон принёс шутку.",p:1},pull:{text:"ты всё ещё внутри sam.vin.",p:1},relaunch:{text:"сплю. разбуди меня.",p:1},"member.typed":{text:"{callsign} на связи.",p:1},"hint.done":{text:"пока всё найдено.",p:1},"hint.time":{text:"остальное придёт само. возвращайся.",p:1},sealed:{text:"запечатано. осколков {k} из 5.",p:1},"route.missing":{text:"здесь ничего нет. пока.",p:1},"idle.nodes":{text:"{n} {n:узел|узла|узлов} горит.",p:5},"idle.mission":{text:"вылазка {code} ждёт.",p:5}});var Uu=qo.inhaleMs/qo.periodMs,On={value:0,phase:0,periodMs:qo.periodMs,amp:Jt.reducedMotion?qo.reducedAmp:1,setPeriod(n){n>0&&(On.periodMs=n)},mix(n,e){return n+(e-n)*(.5+(On.value-.5)*On.amp)}};function BS(n){return n<Uu?.5-.5*Math.cos(Math.PI*(n/Uu)):.5+.5*Math.cos(Math.PI*((n-Uu)/(1-Uu)))}var Jo=new Map,kS=1;function ct(n,e){let t=kS++;return Jo.set(t,{at:de.now+Math.max(0,n||0),fn:e}),t}function Vn(n){Jo.delete(n)}var Qo=new Set;function Fn(n,e,t){let i,r=new Promise(o=>{i=o}),s={start:de.now,ms:Math.max(0,n||0),fn:e,ease:t||null,resolve:i,live:!0};if(s.ms===0){try{e(1)}finally{i()}return{done:r,cancel(){}}}return Qo.add(s),{done:r,cancel(){s.live&&(s.live=!1,Qo.delete(s),i())}}}var wl=[],Ip=-1,Pp=0;function zS(n,e){n.at<=Pp&&wl.push(e)}function VS(n){let e=(Pp-n.start)/n.ms;if(e>=1){n.live=!1,Qo.delete(n);try{n.fn(1)}catch(t){xt("clock:tween","tween callback threw",t)}n.resolve()}else{let t=e<=0?0:e;try{n.fn(n.ease?n.ease(t):t)}catch(i){xt("clock:tween","tween callback threw",i),n.live=!1,Qo.delete(n),n.resolve()}}}function GS(n,e){Pp=e,On.amp=Jt.reducedMotion?qo.reducedAmp:1;let t=Ip<0?0:Math.max(0,e-Ip);if(Ip=e,On.phase=(On.phase+t/On.periodMs)%1,On.value=BS(On.phase),Jo.size){wl.length=0,Jo.forEach(zS);for(let i=0;i<wl.length;i++){let r=Jo.get(wl[i]);if(r){Jo.delete(wl[i]);try{r.fn()}catch(s){xt("clock:after","timer callback threw",s)}}}}Qo.size&&Qo.forEach(VS)}function Lx(){de.add(GS,Nt.CLOCK)}try{Lx()}catch{Promise.resolve().then(Lx)}var gr=[],pi=null,Ms=null,co=0,Lp=0,HS=0,Bu=0;function WS(n,e){return n.replace(/\{(\w+)(?::([^|}]*)\|([^|}]*)\|([^}]*))?\}/g,(t,i,r,s,o)=>{let a=e?e[i]:void 0;return a==null?t:r!=null?Fu(a,r,s,o):String(a)})}function XS(n){Gn.current=n,ee.status=n.text,Ms&&(Ms.textContent=n.text),pi&&(pi.classList.remove("is-in"),pi.textContent=n.text,Bu&&cancelAnimationFrame(Bu),Bu=requestAnimationFrame(()=>{Bu=0,pi.classList.add("is-in")})),co&&Vn(co),co=ct(_e.statusHold,$S),Se.emit("status:show",{key:n.key,text:n.text,p:n.p})}function Dp(){return!Gn.current||de.now-Gn.current.at>=_e.statusHold}function $S(){co=0,gr.length&&ku(gr.shift())}function ku(n){n.at=de.now,XS(n)}function YS(n){if(gr.some(t=>t.text===n.text))return;let e=gr.length;for(;e>0&&gr[e-1].p>n.p;)e--;gr.splice(e,0,n),gr.length>4&&gr.pop()}function qS(){for(let n=0;n<2;n++){if(HS++%2===0)return{key:"idle.nodes",vars:{n:W.litNodes|0}};let t=vt.missions||[];for(let i=0;i<t.length;i++){let r=null;try{r=zu(t[i])}catch{r=null}if(r&&(r.state==="active"||r.state==="new"))return{key:"idle.mission",vars:{code:r.numberShown||t[i].code}}}}return{key:"idle.nodes",vars:{n:W.litNodes|0}}}function Dx(){if(Lp=ct(_e.idleRotate,Dx),ee.booting||gr.length||!Dp())return;let n=Gn.current;if(n&&n.p<5&&de.now-n.at<_e.idleRotate)return;let e=qS();Gn.say(e.key,e.vars)}var Gn={current:null,init(n){let e=document.getElementById("chrome");return pi=document.getElementById("status"),!pi&&e&&(pi=document.createElement("p"),pi.id="status",pi.className="t-status",pi.setAttribute("aria-hidden","true"),e.appendChild(pi)),Ms=document.getElementById("status-live"),Ms&&Ms.getAttribute("aria-live")!=="polite"&&Ms.setAttribute("aria-live","polite"),Lp||(Lp=ct(_e.idleRotate,Dx)),Gn},say(n,e={},t={}){let i=Px[n];if(!i)return!1;let r={key:n,text:WS(i.text,e),p:i.p,at:0},s=Gn.current;return s&&s.text===r.text&&!Dp()?!0:t&&t.force||!s||Dp()||r.p===1&&s.p>1?(ku(r),!0):(YS(r),!0)},clear(){gr.length=0,Gn.current=null,ee.status="",co&&(Vn(co),co=0),pi&&(pi.classList.remove("is-in"),pi.textContent=""),Ms&&(Ms.textContent="")}};var jS={done:"ЗАВЕРШЕНА",active:"В ПУТИ",new:"НОВАЯ",sealed:"ЗАПЕЧАТАНА"};function ZS(n){let e=n.decodeDays!=null?n.decodeDays:n.unlockAtDays;return n.status!=="locked"||!e?null:Math.min(100,Math.round(100*W.distinctDays/e))}function zu(n){let e=n,t=W.data||{},i=e.status,r=ZS(e);i==="sealed"&&t.nadirOpen&&(i="new"),i==="locked"&&r===100&&(i="new");let s=null;if(i==="locked")if(e.decodeDays!=null)s="Расшифровка идёт. Возвращайся завтра — будет больше.";else{let l=Math.max(1,e.unlockAtDays-W.distinctDays);s=`Откроется через ${l} ${Fu(l,"день","дня","дней")}.`}else i==="sealed"&&(s="Ключ к ней — в самом низу.");let o=Array.isArray(t.decoded)?t.decoded:[],a=Np(e.code);return{code:e.code,title:e.title,state:i,label:i==="locked"?`СИГНАЛ ЗАШИФРОВАН ${r}%`:jS[i],p:e.status==="locked"?r:null,numberShown:i==="locked"?"0??":e.code,lockedText:s,decodeReady:e.status==="locked"&&r===100&&!o.includes(e.code),probe:a,canProbe:(i==="done"||i==="active"||i==="new")&&a==="none",mission:e}}function Np(n){let e=W.data&&W.data.probes?W.data.probes[n]:null;return e?e.back?"back":"out":"none"}var Op=["operator","clan","members","missions","achievements","legends","moments","jokes","transmissions","signal","capsule","zenith","nadir","night","companion"],Ux={members:12,missions:24,achievements:24,legends:32,moments:64,jokes:64,transmissions:400},KS=["G2","A2","B2","D3","E3","G3","A3","B3","D4","E4","G4","A4","B4","D5","E5","G5","A5","B5","D6","E6","G6","A6","B6","D7"],JS=["D4","G3","A3","B3","E4","G4","A4","B4","D5","E5","G5","A5"],Nx=["stellated","twisted","nested","bipyramid","knot"],ea=n=>n!==null&&typeof n=="object"&&!Array.isArray(n),Mn=(n,e)=>n[e]!==void 0&&n[e]!==null,Tl=n=>typeof structuredClone=="function"?structuredClone(n):JSON.parse(JSON.stringify(n)),Si=n=>{try{return JSON.stringify(n).slice(0,40)}catch{return String(n)}};function Bt(n,e,t,i,r){if(typeof n!="string"&&!(typeof n=="number"&&Number.isFinite(n)))return r(`${i}: ${Si(n)} invalid`),{ok:!1};let s=String(n).normalize("NFC").trim().replace(/\s+/g," ");return s===""&&t?(r(`${i}: empty`),{ok:!1}):(s.length>e&&(s=s.slice(0,e-1)+"…",r(`${i}: longer than ${e}, cut`)),{ok:!0,v:s})}function bs(n,e,t){if(typeof n!="string"&&typeof n!="number")return t(`${e}: ${Si(n)} invalid`),{ok:!1};let i=String(n).trim().toLowerCase().replace(/[^a-z0-9_-]/g,"");return i?(i.length>24&&(i=i.slice(0,24),t(`${e}: longer than 24, cut`)),i!==String(n)&&t(`${e}: ${Si(n)} → "${i}"`),{ok:!0,v:i}):(t(`${e}: ${Si(n)} invalid`),{ok:!1})}function Ox(n,e,t){return typeof n=="number"&&Number.isInteger(n)&&n>=0&&n<=999?{ok:!0,v:String(n).padStart(3,"0")}:typeof n=="string"&&/^\d{3}$/.test(n.trim())?{ok:!0,v:n.trim()}:(t(`${e}: ${Si(n)} invalid`),{ok:!1})}function Fx(n,e,t){if(n<2e3||n>2100||e<1||e>12||t<1)return!1;let i=new Date(Date.UTC(n,e,0)).getUTCDate();return t<=i}function ta(n,e,t){if(typeof n=="string"){let i=n.trim(),r=/^(\d{4})-(\d{2})-(\d{2})$/.exec(i);if(r&&Fx(+r[1],+r[2],+r[3]))return{ok:!0,v:i};if(r=/^(\d{2})\.(\d{2})\.(\d{4})$/.exec(i),r&&Fx(+r[3],+r[2],+r[1]))return{ok:!0,v:`${r[3]}-${r[2]}-${r[1]}`}}return t(`${e}: ${Si(n)} invalid date`),{ok:!1}}function Bx(n,e){return typeof n=="number"?n:typeof n=="string"&&n.trim()!==""?Number(e?n.trim().replace(",","."):n.trim()):NaN}function zr(n,e,t,i,r){let s=Bx(n,!1);if(!Number.isFinite(s))return r(`${i}: ${Si(n)} invalid`),{ok:!1};let o=Math.round(s);return(o<e||o>t)&&(o=Math.min(t,Math.max(e,o)),r(`${i}: ${Si(n)} clamped → ${o}`)),{ok:!0,v:o}}function QS(n,e,t,i,r,s){let o=Bx(n,!0);if(!Number.isFinite(o))return s(`${r}: ${Si(n)} invalid`),{ok:!1};let a=Math.pow(10,i),l=Math.round(o*a)/a;return(l<e||l>t)&&(l=Math.min(t,Math.max(e,l)),s(`${r}: ${Si(n)} clamped → ${l}`)),{ok:!0,v:l}}function kx(n,e,t){return n===!0||n===1||n==="true"||n==="да"?{ok:!0,v:!0}:n===!1||n===0||n==="false"||n==="нет"?{ok:!0,v:!1}:(t(`${e}: ${Si(n)} invalid`),{ok:!1})}function Cl(n,e,t,i){if(typeof n=="string"){let r=n.trim().toLowerCase();if(e.includes(r))return{ok:!0,v:r}}return i(`${t}: ${Si(n)} invalid`),{ok:!1}}function zx(n,e,t){if(!Array.isArray(n))return t(`${e}: not a list`),{ok:!1};let i=lo(n);return i.length!==n.length&&t(`${e}: ${n.length-i.length} edge(s) dropped`),i.length?{ok:!0,v:i}:{ok:!1}}function at(n,e,t,i){if(!Mn(n,e))return i;let r=t(n[e]);return r.ok?r.v:i}function Vx(n,e,t,i,r,s){if(!Mn(n,e))return[];let o=n[e];if(!Array.isArray(o))return s(`${r}: not a list`),[];let a=[];for(let l=0;l<o.length;l++){if(a.length>=t){s(`${r}: more than ${t}, rest dropped`);break}let c=Bt(o[l],i,!0,`${r}[${l}]`,s);c.ok&&a.push(c.v)}return a}function Vu(n,e,t,i,r){if(!Mn(n,e))return[];let s=n[e];if(!Array.isArray(s))return r(`${i}: not a list`),[];let o=[];for(let a=0;a<s.length&&o.length<t;a++){let l=bs(s[a],`${i}[${a}]`,r);l.ok&&o.push(l.v)}return s.length>t&&r(`${i}: more than ${t}, rest dropped`),o}function Pl(n,e){let t=n,i=2;for(;e.has(t);)t=`${n}-${i++}`;return e.add(t),t}function Fp(n){return String(n).toLocaleLowerCase("ru").replace(/[^a-zа-яё0-9]/g,"")}function uo(n,e,t,i){let r=[],s=Ux[e];for(let o=0;o<n.length;o++){let a=`${e}[${o}]`;if(r.length>=s){i(`${e}: more than ${s}, rest dropped`);break}if(!ea(n[o])){i(`${a}: not an object, dropped`);continue}let l=t(n[o],o,a);l&&r.push(l)}return r}function e1(n,e){let t=new Set;return uo(n,"achievements",(i,r,s)=>{let o=Mn(i,"title")?Bt(i.title,40,!0,`${s}.title`,e):{ok:!1};if(!o.ok)return e(`${s}: no title, dropped`),null;let a=Mn(i,"id")?bs(i.id,`${s}.id`,e):{ok:!1},l=Pl(a.ok?a.v:`a${r+1}`,t),c=at(i,"earned",u=>kx(u,`${s}.earned`,e),!1);return{id:l,title:o.v,shape:at(i,"shape",u=>Cl(u,Nx,`${s}.shape`,e),Nx[r%5]),rarity:at(i,"rarity",u=>Cl(u,["обычная","редкая","легендарная"],`${s}.rarity`,e),"обычная"),earned:c,date:c?at(i,"date",u=>ta(u,`${s}.date`,e),null):null,who:Vu(i,"who",12,`${s}.who`,e),text:at(i,"text",u=>Bt(u,200,!1,`${s}.text`,e),"")}},e)}function t1(n,e){let t=new Set(["workshop"]);return uo(n,"members",(i,r,s)=>{let o=Mn(i,"name")?Bt(i.name,24,!0,`${s}.name`,e):{ok:!1};if(!o.ok)return e(`${s}: no name, dropped`),null;let a=Mn(i,"id")?bs(i.id,`${s}.id`,e):{ok:!1},l=Pl(a.ok?a.v:`m${r+1}`,t),c=JS[r%12];if(Mn(i,"note")){let u=typeof i.note=="string"?i.note.trim().toUpperCase():"";KS.includes(u)?c=u:e(`${s}.note: ${Si(i.note)} invalid → "${c}"`)}return{id:l,name:o.v,callsign:at(i,"callsign",u=>Bt(u,16,!1,`${s}.callsign`,e),""),role:at(i,"role",u=>Bt(u,32,!1,`${s}.role`,e),""),status:at(i,"status",u=>Cl(u,["на связи","в пути","отдыхает"],`${s}.status`,e),"на связи"),level:at(i,"level",u=>zr(u,0,99,`${s}.level`,e),1),missions:at(i,"missions",u=>zr(u,0,999,`${s}.missions`,e),0),seed:at(i,"seed",u=>zr(u,0,9999,`${s}.seed`,e),bl(l)%100),note:c,glyph:at(i,"glyph",u=>zx(u,`${s}.glyph`,e),null),trait:at(i,"trait",u=>Bt(u,120,!1,`${s}.trait`,e),""),joke:at(i,"joke",u=>Bt(u,160,!1,`${s}.joke`,e),""),achievements:Vu(i,"achievements",16,`${s}.achievements`,e)}},e)}function n1(n,e){let t=new Set;for(let r of n)if(ea(r)&&Mn(r,"code")){let s=Ox(r.code,"",()=>{});s.ok&&t.add(s.v)}let i=new Set;return uo(n,"missions",(r,s,o)=>{let a=null;if(Mn(r,"code")){let d=Ox(r.code,`${o}.code`,e);if(d.ok&&(a=d.v,i.has(a)))return e(`${o}: duplicate code ${a}, dropped`),null}if(a===null&&(a=String(s+1).padStart(3,"0"),i.has(a)||t.has(a)))return e(`${o}: no code (${a} taken), dropped`),null;i.add(a);let l=at(r,"status",d=>Cl(d,["done","active","new","locked","sealed"],`${o}.status`,e),"new"),c=at(r,"decodeDays",d=>zr(d,1,365,`${o}.decodeDays`,e),null),u=at(r,"unlockAtDays",d=>zr(d,1,365,`${o}.unlockAtDays`,e),null);return l!=="locked"?(c=null,u=null):c!=null&&u!=null?(u=null,e(`${o}: locked with both day fields → decodeDays kept`)):c==null&&u==null&&(c=7,e(`${o}: locked without days → decodeDays 7`)),{code:a,title:at(r,"title",d=>Bt(d,48,!0,`${o}.title`,e),`Вылазка ${a}`),status:l,brief:at(r,"brief",d=>Bt(d,240,!1,`${o}.brief`,e),""),conditions:Vx(r,"conditions",6,40,`${o}.conditions`,e),crew:Vu(r,"crew",12,`${o}.crew`,e),result:at(r,"result",d=>Bt(d,160,!1,`${o}.result`,e),""),reward:at(r,"reward",d=>bs(d,`${o}.reward`,e),null),log:at(r,"log",d=>Bt(d,200,!1,`${o}.log`,e),""),decodeDays:c,unlockAtDays:u}},e)}function i1(n,e){let t=new Set;return uo(n,"legends",(i,r,s)=>{let o=Mn(i,"date")?ta(i.date,`${s}.date`,e):{ok:!1},a=Mn(i,"title")?Bt(i.title,48,!0,`${s}.title`,e):{ok:!1};if(!o.ok||!a.ok)return e(`${s}: needs date and title, dropped`),null;let l=Mn(i,"id")?bs(i.id,`${s}.id`,e):{ok:!1};return{id:Pl(l.ok?l.v:`l${r+1}`,t),date:o.v,kind:at(i,"kind",c=>Cl(c,["победа","смешное","эпичное"],`${s}.kind`,e),"эпичное"),title:a.v,text:at(i,"text",c=>Bt(c,300,!1,`${s}.text`,e),"")}},e)}function r1(n,e){let t=new Set;return uo(n,"moments",(i,r,s)=>{let o=Mn(i,"date")?ta(i.date,`${s}.date`,e):{ok:!1},a=Mn(i,"title")?Bt(i.title,48,!0,`${s}.title`,e):{ok:!1};if(!o.ok||!a.ok)return e(`${s}: needs date and title, dropped`),null;let l=Mn(i,"id")?bs(i.id,`${s}.id`,e):{ok:!1};return{id:Pl(l.ok?l.v:`mo${r+1}`,t),date:o.v,title:a.v,who:Vu(i,"who",12,`${s}.who`,e),text:at(i,"text",c=>Bt(c,300,!0,`${s}.text`,e),a.v)}},e)}function s1(n,e){let t=new Set;return uo(n,"jokes",(i,r,s)=>{let o=Mn(i,"text")?Bt(i.text,160,!0,`${s}.text`,e):{ok:!1};if(!o.ok)return e(`${s}: no text, dropped`),null;let a=Mn(i,"id")?bs(i.id,`${s}.id`,e):{ok:!1},l=at(i,"trigger",c=>Bt(c,24,!1,`${s}.trigger`,e),"");return{id:Pl(a.ok?a.v:`j${r+1}`,t),date:at(i,"date",c=>ta(c,`${s}.date`,e),null),hidden:at(i,"hidden",c=>kx(c,`${s}.hidden`,e),!1),trigger:Fp(l),text:o.v}},e)}function o1(n,e){return uo(n,"transmissions",(t,i,r)=>{let s=Mn(t,"text")?Bt(t.text,240,!0,`${r}.text`,e):{ok:!1};return s.ok?{from:at(t,"from",o=>Bt(o,16,!0,`${r}.from`,e),"ШТАБ"),text:s.v}:(e(`${r}: no text, dropped`),null)},e)}function a1(n,e){let t=Ko.clan;return{name:at(n,"name",i=>Bt(i,24,!0,"clan.name",e),t.name),motto:at(n,"motto",i=>Bt(i,80,!0,"clan.motto",e),t.motto),founded:at(n,"founded",i=>ta(i,"clan.founded",e),t.founded),frequency:at(n,"frequency",i=>QS(i,0,99.99,2,"clan.frequency",e),t.frequency),sigil:at(n,"sigil",i=>zx(i,"clan.sigil",e),lo(t.sigil))}}function l1(n,e,t){let i=Ko.operator,r=Mn(n,"name")?Bt(n.name,24,!0,"operator.name",t):{ok:!1},s,o=Mn(n,"id")?bs(n.id,"operator.id",t):{ok:!1};if(o.ok)s=o.v,e.some(c=>c.id===s)||t(`operator.id: "${s}" matches no member (kept)`);else{let c=r.ok?e.find(u=>u.name.toLocaleLowerCase("ru")===r.v.toLocaleLowerCase("ru")):null;s=c?c.id:e.length?e[0].id:"sam"}let a=e.find(c=>c.id===s)||null,l=r.ok?r.v:a?a.name:i.name;return{id:s,name:l,aliases:Vx(n,"aliases",8,24,"operator.aliases",t),callsign:at(n,"callsign",c=>Bt(c,16,!1,"operator.callsign",t),a?a.callsign:""),birthday:at(n,"birthday",c=>ta(c,"operator.birthday",t),null)}}function c1(n,e,t){let i=Ko,r=(s,o)=>{try{n[s]=o(ea(e[s])?e[s]:i[s])}catch{t(`${s}: crashed, default used`),n[s]=Tl(i[s])}};r("signal",s=>({secret:at(s,"secret",o=>Bt(o,240,!0,"signal.secret",t),i.signal.secret)})),r("capsule",s=>({openAfterDays:at(s,"openAfterDays",o=>zr(o,0,365,"capsule.openAfterDays",t),i.capsule.openAfterDays),text:at(s,"text",o=>Bt(o,300,!0,"capsule.text",t),i.capsule.text)})),r("zenith",s=>({message:at(s,"message",o=>Bt(o,160,!0,"zenith.message",t),i.zenith.message)})),r("nadir",s=>({origin:at(s,"origin",o=>Bt(o,400,!0,"nadir.origin",t),i.nadir.origin)})),r("night",s=>({from:at(s,"from",o=>zr(o,0,23,"night.from",t),i.night.from),to:at(s,"to",o=>zr(o,0,23,"night.to",t),i.night.to),drowsyFrom:at(s,"drowsyFrom",o=>zr(o,0,23,"night.drowsyFrom",t),i.night.drowsyFrom),story:at(s,"story",o=>Bt(o,240,!0,"night.story",t),i.night.story)})),r("companion",s=>({name:at(s,"name",o=>Bt(o,16,!0,"companion.name",t),i.companion.name)}))}function u1(n){let e=[],t=u=>{e.push(u)},i=Ko,r=n;ea(r)||(r={});let s={},o=[];try{o=Object.keys(r)}catch{o=[]}for(let u of o)Op.includes(u)||t(`unknown key ${u}`);let a={};for(let u of Op){let d;try{d=r[u]}catch{d=void 0}let f=u in Ux?Array.isArray(d):ea(d);!f&&d!==void 0&&t(`${u}: default used`),a[u]=f?d:Tl(i[u])}let l=[["achievements",e1],["members",t1],["missions",n1],["legends",i1],["moments",r1],["jokes",s1],["transmissions",o1]];for(let[u,d]of l)try{s[u]=d(a[u],t)}catch{t(`${u}: crashed, default used`);try{s[u]=d(Tl(i[u]),()=>{})}catch{s[u]=[]}}try{s.clan=a1(a.clan,t)}catch{t("clan: crashed, default used"),s.clan=Tl(i.clan)}try{s.operator=l1(a.operator,s.members,t)}catch{t("operator: crashed, default used"),s.operator={...Tl(i.operator),aliases:[]}}c1(s,a,t);try{let u=new Set(s.members.map(f=>f.id)),d=new Set(s.achievements.map(f=>f.id)),h=(f,g,y)=>{let m=[];for(let p of f){if(!g.has(p)){t(`${y}: unknown "${p}" removed`);continue}m.includes(p)||m.push(p)}return m};s.members.forEach((f,g)=>{f.achievements=h(f.achievements,d,`members[${g}].achievements`)}),s.missions.forEach((f,g)=>{f.crew=h(f.crew,u,`missions[${g}].crew`),f.reward!=null&&!d.has(f.reward)&&(t(`missions[${g}].reward: unknown "${f.reward}" removed`),f.reward=null)}),s.achievements.forEach((f,g)=>{f.who=h(f.who,u,`achievements[${g}].who`)}),s.moments.forEach((f,g)=>{f.who=h(f.who,u,`moments[${g}].who`)})}catch{t("refs: crashed")}for(let u of s.jokes)u.date==null&&(u.date=s.clan.founded);try{let u=[];for(let h of s.operator.aliases){let f=Fp(h);f.length>=2&&f.length<=24&&!u.includes(f)&&u.push(f)}let d=Fp(s.operator.name);d.length>=2&&!u.includes(d)&&u.push(d),s.operator.aliases=u}catch{s.operator.aliases=[]}let c={};for(let u of Op)c[u]=s[u];return{world:c,issues:e}}function Gx(n){if(n&&typeof n=="object"&&!Object.isFrozen(n)){Object.freeze(n);for(let e of Object.keys(n))Gx(n[e])}return n}var Il,Hx="file";try{Il=typeof window<"u"?window.SAMVIN_WORLD:void 0}catch{Il=void 0}ea(Il)||(Hx="default",Il=Ko,xt("world","world.js missing or broken — using built-in defaults"));var Rl=u1(Il);Rl.issues.length&&xt("world-issues",`world.js: ${Rl.issues.length} issue(s)`,Rl.issues);var Wx=Hx,Xx=Object.freeze(Rl.issues.slice()),vt=Gx(Rl.world);var VP=Object.freeze({members:"Здесь пока никого нет.",missions:"Вылазок пока нет.",achievements:"Трофеев пока нет.",transmissions:"Передач пока нет.",probeLog:"Зонд вернулся. Записи нет."}),h1=/^S(0[1-9]|1[0-4])$/;function $x(){let n=W.data||{},e=n.transmissions||{delivered:0,read:[]},t=Math.max(0,Math.min(e.delivered|0,vt.transmissions.length)),i=Array.isArray(e.read)?e.read:[],r=0;for(let u=0;u<t;u++)i.includes(u)||r++;let s=new Set(vt.jokes.map(u=>u.id)),o=new Set((Array.isArray(n.jokesFound)?n.jokesFound:[]).filter(u=>s.has(u))).size,a=0,l=0;for(let u of vt.missions)zu(u).state==="done"&&a++,Np(u.code)==="out"&&l++;let c=n.found&&typeof n.found=="object"?Object.keys(n.found).filter(u=>h1.test(u)).length:0;return{delivered:t,unread:r,legends:vt.legends.length,moments:vt.moments.length,jokesFound:o,members:vt.members.length,online:vt.members.filter(u=>u.status==="на связи").length,founded:Ix(vt.clan.founded,"dd.mm.yyyy"),daysSinceFounded:Math.max(0,El(vt.clan.founded,W.today||vt.clan.founded)),missions:vt.missions.length,done:a,probesOut:l,earned:vt.achievements.filter(u=>u.earned).length,achievements:vt.achievements.length,secrets:c,shards:n.shards|0,nadirOpen:!!n.nadirOpen}}var d1=864e5,Yx=n=>(n<10?"0":"")+n,Gu=n=>n instanceof Date?n:new Date(n??Vr());function Vr(){return Date.now()}function Hu(n){let e=Gu(n);return`${e.getFullYear()}-${Yx(e.getMonth()+1)}-${Yx(e.getDate())}`}function qx(n){let e=/^(\d{4})-(\d{2})-(\d{2})/.exec(String(n||""));return e?Math.round(Date.UTC(+e[1],+e[2]-1,+e[3])/d1):NaN}function El(n,e){let t=qx(n),i=qx(e);return Number.isFinite(t)&&Number.isFinite(i)?i-t:0}function jx(n,e,t){return e>t?n>=e||n<t:e<t?n>=e&&n<t:!1}function Up(n){let e=vt.night;return jx(Gu(n).getHours(),e.from,e.to)}function Zx(n){let e=vt.night;return Up(n)||e.drowsyFrom===e.from?!1:jx(Gu(n).getHours(),e.drowsyFrom,e.from)}function f1(n){let e=/^(\d{4})-(\d{2})-(\d{2})$/.exec(String(n||""));return e?{y:+e[1],m:+e[2],d:+e[3]}:null}function Bp(n){let e=f1(vt.operator.birthday);if(!e)return!1;let t=Gu(n),i=t.getFullYear(),r=t.getMonth()+1,s=t.getDate();return e.m===2&&e.d===29&&!(i%4===0&&i%100!==0||i%400===0)?r===2&&s===28:r===e.m&&s===e.d}var Rv=0,ym=1,Cv=2;var lc=1,Iv=2,Ea=3,Sr=0,li=1,wr=2,gi=0,ar=1,_o=2,_m=3,Mm=4,rd=5;var ts=100,Pv=101,Lv=102,Dv=103,Nv=104,Ov=200,cc=201,Fv=202,Uv=203,bm=204,Aa=205,Bv=206,kv=207,zv=208,Vv=209,Gv=210,Hv=211,Wv=212,Xv=213,$v=214,_h=0,Mh=1,bh=2,xa=3,Sh=4,wh=5,Eh=6,Ah=7,Sm=0,Yv=1,qv=2,Ri=0,wm=1,Em=2,Am=3,Tm=4,Rm=5,Cm=6,Im=7;var Pm=300,Ns=301,Mo=302,sd=303,od=304,uc=306,Th=1e3,Zn=1001,Rh=1002,Bn=1003,jv=1004;var hc=1005;var At=1006,ad=1007;var Os=1008;var Ci=1009,Lm=1010,Dm=1011,Ta=1012,ld=1013,lr=1014,Hi=1015,Kn=1016,cd=1017,ud=1018,Ra=1020,Nm=35902,Om=35899,Fm=1021,Um=1022,Hn=1023,yr=1026,Fs=1027,hd=1028,dd=1029,Us=1030,fd=1031;var pd=1033,dc=33776,fc=33777,pc=33778,mc=33779,md=35840,gd=35841,xd=35842,vd=35843,yd=36196,_d=37492,Md=37496,bd=37488,Sd=37489,gc=37490,wd=37491,Ed=37808,Ad=37809,Td=37810,Rd=37811,Cd=37812,Id=37813,Pd=37814,Ld=37815,Dd=37816,Nd=37817,Od=37818,Fd=37819,Ud=37820,Bd=37821,kd=36492,zd=36494,Vd=36495,Gd=36283,Hd=36284,xc=36285,Wd=36286;var kl=2300,Ch=2301,xh=2302,hm=2303,dm=2400,fm=2401,pm=2402;var Zv=3200;var Bm=0,Kv=1,ns="",Ai="srgb",xo="srgb-linear",zl="linear",kt="srgb";var vh=7680;var Jv=519,Qv=512,ey=513,ty=514,Xd=515,ny=516,iy=517,$d=518,ry=519,km=35044;var zm="300 es",or=2e3,Vl=2001;function m1(n){for(let e=n.length-1;e>=0;--e)if(n[e]>=65535)return!0;return!1}function g1(n){return ArrayBuffer.isView(n)&&!(n instanceof DataView)}function Gl(n){return document.createElementNS("http://www.w3.org/1999/xhtml",n)}function sy(){let n=Gl("canvas");return n.style.display="block",n}var Kx={},va=null;function Hl(...n){let e="THREE."+n.shift();va?va("log",e,...n):console.log(e,...n)}function oy(n){let e=n[0];if(typeof e=="string"&&e.startsWith("TSL:")){let t=n[1];t&&t.isStackTrace?n[0]+=" "+t.getLocation():n[1]='Stack trace not available. Enable "THREE.Node.captureStackTrace" to capture stack traces.'}return n}function Qe(...n){n=oy(n);let e="THREE."+n.shift();if(va)va("warn",e,...n);else{let t=n[0];t&&t.isStackTrace?console.warn(t.getError(e)):console.warn(e,...n)}}function nt(...n){n=oy(n);let e="THREE."+n.shift();if(va)va("error",e,...n);else{let t=n[0];t&&t.isStackTrace?console.error(t.getError(e)):console.error(e,...n)}}function go(...n){let e=n.join(" ");e in Kx||(Kx[e]=!0,Qe(...n))}function ay(n,e,t){return new Promise(function(i,r){function s(){switch(n.clientWaitSync(e,n.SYNC_FLUSH_COMMANDS_BIT,0)){case n.WAIT_FAILED:r();break;case n.TIMEOUT_EXPIRED:setTimeout(s,t);break;default:i()}}setTimeout(s,t)})}var ly={[_h]:Mh,[bh]:Eh,[Sh]:Ah,[xa]:wh,[Mh]:_h,[Eh]:bh,[Ah]:Sh,[wh]:xa},_r=class{addEventListener(e,t){this._listeners===void 0&&(this._listeners={});let i=this._listeners;i[e]===void 0&&(i[e]=[]),i[e].indexOf(t)===-1&&i[e].push(t)}hasEventListener(e,t){let i=this._listeners;return i===void 0?!1:i[e]!==void 0&&i[e].indexOf(t)!==-1}removeEventListener(e,t){let i=this._listeners;if(i===void 0)return;let r=i[e];if(r!==void 0){let s=r.indexOf(t);s!==-1&&r.splice(s,1)}}dispatchEvent(e){let t=this._listeners;if(t===void 0)return;let i=t[e.type];if(i!==void 0){e.target=this;let r=i.slice(0);for(let s=0,o=r.length;s<o;s++)r[s].call(this,e);e.target=null}}},Yn=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"];var yh=Math.PI/180,Ih=180/Math.PI;function Rs(){let n=Math.random()*4294967295|0,e=Math.random()*4294967295|0,t=Math.random()*4294967295|0,i=Math.random()*4294967295|0;return(Yn[n&255]+Yn[n>>8&255]+Yn[n>>16&255]+Yn[n>>24&255]+"-"+Yn[e&255]+Yn[e>>8&255]+"-"+Yn[e>>16&15|64]+Yn[e>>24&255]+"-"+Yn[t&63|128]+Yn[t>>8&255]+"-"+Yn[t>>16&255]+Yn[t>>24&255]+Yn[i&255]+Yn[i>>8&255]+Yn[i>>16&255]+Yn[i>>24&255]).toLowerCase()}function bt(n,e,t){return Math.max(e,Math.min(t,n))}function x1(n,e){return(n%e+e)%e}function kp(n,e,t){return(1-t)*n+t*e}function vr(n,e){switch(e.constructor){case Float32Array:return n;case Uint32Array:return n/4294967295;case Uint16Array:return n/65535;case Uint8Array:case Uint8ClampedArray:return n/255;case Int32Array:return Math.max(n/2147483647,-1);case Int16Array:return Math.max(n/32767,-1);case Int8Array:return Math.max(n/127,-1);default:throw new Error("THREE.MathUtils: Invalid component type.")}}function qt(n,e){switch(e.constructor){case Float32Array:return n;case Uint32Array:return Math.round(n*4294967295);case Uint16Array:return Math.round(n*65535);case Uint8Array:case Uint8ClampedArray:return Math.round(n*255);case Int32Array:return Math.round(n*2147483647);case Int16Array:return Math.round(n*32767);case Int8Array:return Math.round(n*127);default:throw new Error("THREE.MathUtils: Invalid component type.")}}var $m=class $m{constructor(e=0,t=0){this.x=e,this.y=t}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,t){return this.x=e,this.y=t,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;default:throw new Error("THREE.Vector2: index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw new Error("THREE.Vector2: index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){let t=this.x,i=this.y,r=e.elements;return this.x=r[0]*t+r[3]*i+r[6],this.y=r[1]*t+r[4]*i+r[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,t){return this.x=bt(this.x,e.x,t.x),this.y=bt(this.y,e.y,t.y),this}clampScalar(e,t){return this.x=bt(this.x,e,t),this.y=bt(this.y,e,t),this}clampLength(e,t){let i=this.length();return this.divideScalar(i||1).multiplyScalar(bt(i,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){let t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;let i=this.dot(e)/t;return Math.acos(bt(i,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){let t=this.x-e.x,i=this.y-e.y;return t*t+i*i}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this}lerpVectors(e,t,i){return this.x=e.x+(t.x-e.x)*i,this.y=e.y+(t.y-e.y)*i,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this}rotateAround(e,t){let i=Math.cos(t),r=Math.sin(t),s=this.x-e.x,o=this.y-e.y;return this.x=s*i-o*r+e.x,this.y=s*r+o*i+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}};$m.prototype.isVector2=!0;var it=$m,Gi=class{constructor(e=0,t=0,i=0,r=1){this.isQuaternion=!0,this._x=e,this._y=t,this._z=i,this._w=r}static slerpFlat(e,t,i,r,s,o,a){let l=i[r+0],c=i[r+1],u=i[r+2],d=i[r+3],h=s[o+0],f=s[o+1],g=s[o+2],y=s[o+3];if(d!==y||l!==h||c!==f||u!==g){let m=l*h+c*f+u*g+d*y;m<0&&(h=-h,f=-f,g=-g,y=-y,m=-m);let p=1-a;if(m<.9995){let b=Math.acos(m),S=Math.sin(b);p=Math.sin(p*b)/S,a=Math.sin(a*b)/S,l=l*p+h*a,c=c*p+f*a,u=u*p+g*a,d=d*p+y*a}else{l=l*p+h*a,c=c*p+f*a,u=u*p+g*a,d=d*p+y*a;let b=1/Math.sqrt(l*l+c*c+u*u+d*d);l*=b,c*=b,u*=b,d*=b}}e[t]=l,e[t+1]=c,e[t+2]=u,e[t+3]=d}static multiplyQuaternionsFlat(e,t,i,r,s,o){let a=i[r],l=i[r+1],c=i[r+2],u=i[r+3],d=s[o],h=s[o+1],f=s[o+2],g=s[o+3];return e[t]=a*g+u*d+l*f-c*h,e[t+1]=l*g+u*h+c*d-a*f,e[t+2]=c*g+u*f+a*h-l*d,e[t+3]=u*g-a*d-l*h-c*f,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,t,i,r){return this._x=e,this._y=t,this._z=i,this._w=r,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,t=!0){let i=e._x,r=e._y,s=e._z,o=e._order,a=Math.cos,l=Math.sin,c=a(i/2),u=a(r/2),d=a(s/2),h=l(i/2),f=l(r/2),g=l(s/2);switch(o){case"XYZ":this._x=h*u*d+c*f*g,this._y=c*f*d-h*u*g,this._z=c*u*g+h*f*d,this._w=c*u*d-h*f*g;break;case"YXZ":this._x=h*u*d+c*f*g,this._y=c*f*d-h*u*g,this._z=c*u*g-h*f*d,this._w=c*u*d+h*f*g;break;case"ZXY":this._x=h*u*d-c*f*g,this._y=c*f*d+h*u*g,this._z=c*u*g+h*f*d,this._w=c*u*d-h*f*g;break;case"ZYX":this._x=h*u*d-c*f*g,this._y=c*f*d+h*u*g,this._z=c*u*g-h*f*d,this._w=c*u*d+h*f*g;break;case"YZX":this._x=h*u*d+c*f*g,this._y=c*f*d+h*u*g,this._z=c*u*g-h*f*d,this._w=c*u*d-h*f*g;break;case"XZY":this._x=h*u*d-c*f*g,this._y=c*f*d-h*u*g,this._z=c*u*g+h*f*d,this._w=c*u*d+h*f*g;break;default:Qe("Quaternion: .setFromEuler() encountered an unknown order: "+o)}return t===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,t){let i=t/2,r=Math.sin(i);return this._x=e.x*r,this._y=e.y*r,this._z=e.z*r,this._w=Math.cos(i),this._onChangeCallback(),this}setFromRotationMatrix(e){let t=e.elements,i=t[0],r=t[4],s=t[8],o=t[1],a=t[5],l=t[9],c=t[2],u=t[6],d=t[10],h=i+a+d;if(h>0){let f=.5/Math.sqrt(h+1);this._w=.25/f,this._x=(u-l)*f,this._y=(s-c)*f,this._z=(o-r)*f}else if(i>a&&i>d){let f=2*Math.sqrt(1+i-a-d);this._w=(u-l)/f,this._x=.25*f,this._y=(r+o)/f,this._z=(s+c)/f}else if(a>d){let f=2*Math.sqrt(1+a-i-d);this._w=(s-c)/f,this._x=(r+o)/f,this._y=.25*f,this._z=(l+u)/f}else{let f=2*Math.sqrt(1+d-i-a);this._w=(o-r)/f,this._x=(s+c)/f,this._y=(l+u)/f,this._z=.25*f}return this._onChangeCallback(),this}setFromUnitVectors(e,t){let i=e.dot(t)+1;return i<1e-8?(i=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=i):(this._x=0,this._y=-e.z,this._z=e.y,this._w=i)):(this._x=e.y*t.z-e.z*t.y,this._y=e.z*t.x-e.x*t.z,this._z=e.x*t.y-e.y*t.x,this._w=i),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(bt(this.dot(e),-1,1)))}rotateTowards(e,t){let i=this.angleTo(e);if(i===0)return this;let r=Math.min(1,t/i);return this.slerp(e,r),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x=this._x*e,this._y=this._y*e,this._z=this._z*e,this._w=this._w*e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,t){let i=e._x,r=e._y,s=e._z,o=e._w,a=t._x,l=t._y,c=t._z,u=t._w;return this._x=i*u+o*a+r*c-s*l,this._y=r*u+o*l+s*a-i*c,this._z=s*u+o*c+i*l-r*a,this._w=o*u-i*a-r*l-s*c,this._onChangeCallback(),this}slerp(e,t){let i=e._x,r=e._y,s=e._z,o=e._w,a=this.dot(e);a<0&&(i=-i,r=-r,s=-s,o=-o,a=-a);let l=1-t;if(a<.9995){let c=Math.acos(a),u=Math.sin(c);l=Math.sin(l*c)/u,t=Math.sin(t*c)/u,this._x=this._x*l+i*t,this._y=this._y*l+r*t,this._z=this._z*l+s*t,this._w=this._w*l+o*t,this._onChangeCallback()}else this._x=this._x*l+i*t,this._y=this._y*l+r*t,this._z=this._z*l+s*t,this._w=this._w*l+o*t,this.normalize();return this}slerpQuaternions(e,t,i){return this.copy(e).slerp(t,i)}random(){let e=2*Math.PI*Math.random(),t=2*Math.PI*Math.random(),i=Math.random(),r=Math.sqrt(1-i),s=Math.sqrt(i);return this.set(r*Math.sin(e),r*Math.cos(e),s*Math.sin(t),s*Math.cos(t))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,t=0){return this._x=e[t],this._y=e[t+1],this._z=e[t+2],this._w=e[t+3],this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._w,e}fromBufferAttribute(e,t){return this._x=e.getX(t),this._y=e.getY(t),this._z=e.getZ(t),this._w=e.getW(t),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}},Ym=class Ym{constructor(e=0,t=0,i=0){this.x=e,this.y=t,this.z=i}set(e,t,i){return i===void 0&&(i=this.z),this.x=e,this.y=t,this.z=i,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;default:throw new Error("THREE.Vector3: index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("THREE.Vector3: index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,t){return this.x=e.x*t.x,this.y=e.y*t.y,this.z=e.z*t.z,this}applyEuler(e){return this.applyQuaternion(Jx.setFromEuler(e))}applyAxisAngle(e,t){return this.applyQuaternion(Jx.setFromAxisAngle(e,t))}applyMatrix3(e){let t=this.x,i=this.y,r=this.z,s=e.elements;return this.x=s[0]*t+s[3]*i+s[6]*r,this.y=s[1]*t+s[4]*i+s[7]*r,this.z=s[2]*t+s[5]*i+s[8]*r,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){let t=this.x,i=this.y,r=this.z,s=e.elements,o=1/(s[3]*t+s[7]*i+s[11]*r+s[15]);return this.x=(s[0]*t+s[4]*i+s[8]*r+s[12])*o,this.y=(s[1]*t+s[5]*i+s[9]*r+s[13])*o,this.z=(s[2]*t+s[6]*i+s[10]*r+s[14])*o,this}applyQuaternion(e){let t=this.x,i=this.y,r=this.z,s=e.x,o=e.y,a=e.z,l=e.w,c=2*(o*r-a*i),u=2*(a*t-s*r),d=2*(s*i-o*t);return this.x=t+l*c+o*d-a*u,this.y=i+l*u+a*c-s*d,this.z=r+l*d+s*u-o*c,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){let t=this.x,i=this.y,r=this.z,s=e.elements;return this.x=s[0]*t+s[4]*i+s[8]*r,this.y=s[1]*t+s[5]*i+s[9]*r,this.z=s[2]*t+s[6]*i+s[10]*r,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,t){return this.x=bt(this.x,e.x,t.x),this.y=bt(this.y,e.y,t.y),this.z=bt(this.z,e.z,t.z),this}clampScalar(e,t){return this.x=bt(this.x,e,t),this.y=bt(this.y,e,t),this.z=bt(this.z,e,t),this}clampLength(e,t){let i=this.length();return this.divideScalar(i||1).multiplyScalar(bt(i,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this}lerpVectors(e,t,i){return this.x=e.x+(t.x-e.x)*i,this.y=e.y+(t.y-e.y)*i,this.z=e.z+(t.z-e.z)*i,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,t){let i=e.x,r=e.y,s=e.z,o=t.x,a=t.y,l=t.z;return this.x=r*l-s*a,this.y=s*o-i*l,this.z=i*a-r*o,this}projectOnVector(e){let t=e.lengthSq();if(t===0)return this.set(0,0,0);let i=e.dot(this)/t;return this.copy(e).multiplyScalar(i)}projectOnPlane(e){return zp.copy(this).projectOnVector(e),this.sub(zp)}reflect(e){return this.sub(zp.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){let t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;let i=this.dot(e)/t;return Math.acos(bt(i,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){let t=this.x-e.x,i=this.y-e.y,r=this.z-e.z;return t*t+i*i+r*r}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,t,i){let r=Math.sin(t)*e;return this.x=r*Math.sin(i),this.y=Math.cos(t)*e,this.z=r*Math.cos(i),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,t,i){return this.x=e*Math.sin(t),this.y=i,this.z=e*Math.cos(t),this}setFromMatrixPosition(e){let t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this}setFromMatrixScale(e){let t=this.setFromMatrixColumn(e,0).length(),i=this.setFromMatrixColumn(e,1).length(),r=this.setFromMatrixColumn(e,2).length();return this.x=t,this.y=i,this.z=r,this}setFromMatrixColumn(e,t){return this.fromArray(e.elements,t*4)}setFromMatrix3Column(e,t){return this.fromArray(e.elements,t*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){let e=Math.random()*Math.PI*2,t=Math.random()*2-1,i=Math.sqrt(1-t*t);return this.x=i*Math.cos(e),this.y=t,this.z=i*Math.sin(e),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}};Ym.prototype.isVector3=!0;var C=Ym,zp=new C,Jx=new Gi,qm=class qm{constructor(e,t,i,r,s,o,a,l,c){this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,t,i,r,s,o,a,l,c)}set(e,t,i,r,s,o,a,l,c){let u=this.elements;return u[0]=e,u[1]=r,u[2]=a,u[3]=t,u[4]=s,u[5]=l,u[6]=i,u[7]=o,u[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){let t=this.elements,i=e.elements;return t[0]=i[0],t[1]=i[1],t[2]=i[2],t[3]=i[3],t[4]=i[4],t[5]=i[5],t[6]=i[6],t[7]=i[7],t[8]=i[8],this}extractBasis(e,t,i){return e.setFromMatrix3Column(this,0),t.setFromMatrix3Column(this,1),i.setFromMatrix3Column(this,2),this}setFromMatrix4(e){let t=e.elements;return this.set(t[0],t[4],t[8],t[1],t[5],t[9],t[2],t[6],t[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){let i=e.elements,r=t.elements,s=this.elements,o=i[0],a=i[3],l=i[6],c=i[1],u=i[4],d=i[7],h=i[2],f=i[5],g=i[8],y=r[0],m=r[3],p=r[6],b=r[1],S=r[4],_=r[7],A=r[2],T=r[5],R=r[8];return s[0]=o*y+a*b+l*A,s[3]=o*m+a*S+l*T,s[6]=o*p+a*_+l*R,s[1]=c*y+u*b+d*A,s[4]=c*m+u*S+d*T,s[7]=c*p+u*_+d*R,s[2]=h*y+f*b+g*A,s[5]=h*m+f*S+g*T,s[8]=h*p+f*_+g*R,this}multiplyScalar(e){let t=this.elements;return t[0]*=e,t[3]*=e,t[6]*=e,t[1]*=e,t[4]*=e,t[7]*=e,t[2]*=e,t[5]*=e,t[8]*=e,this}determinant(){let e=this.elements,t=e[0],i=e[1],r=e[2],s=e[3],o=e[4],a=e[5],l=e[6],c=e[7],u=e[8];return t*o*u-t*a*c-i*s*u+i*a*l+r*s*c-r*o*l}invert(){let e=this.elements,t=e[0],i=e[1],r=e[2],s=e[3],o=e[4],a=e[5],l=e[6],c=e[7],u=e[8],d=u*o-a*c,h=a*l-u*s,f=c*s-o*l,g=t*d+i*h+r*f;if(g===0)return this.set(0,0,0,0,0,0,0,0,0);let y=1/g;return e[0]=d*y,e[1]=(r*c-u*i)*y,e[2]=(a*i-r*o)*y,e[3]=h*y,e[4]=(u*t-r*l)*y,e[5]=(r*s-a*t)*y,e[6]=f*y,e[7]=(i*l-c*t)*y,e[8]=(o*t-i*s)*y,this}transpose(){let e,t=this.elements;return e=t[1],t[1]=t[3],t[3]=e,e=t[2],t[2]=t[6],t[6]=e,e=t[5],t[5]=t[7],t[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){let t=this.elements;return e[0]=t[0],e[1]=t[3],e[2]=t[6],e[3]=t[1],e[4]=t[4],e[5]=t[7],e[6]=t[2],e[7]=t[5],e[8]=t[8],this}setUvTransform(e,t,i,r,s,o,a){let l=Math.cos(s),c=Math.sin(s);return this.set(i*l,i*c,-i*(l*o+c*a)+o+e,-r*c,r*l,-r*(-c*o+l*a)+a+t,0,0,1),this}scale(e,t){return go("Matrix3: .scale() is deprecated. Use .makeScale() instead."),this.premultiply(Vp.makeScale(e,t)),this}rotate(e){return go("Matrix3: .rotate() is deprecated. Use .makeRotation() instead."),this.premultiply(Vp.makeRotation(-e)),this}translate(e,t){return go("Matrix3: .translate() is deprecated. Use .makeTranslation() instead."),this.premultiply(Vp.makeTranslation(e,t)),this}makeTranslation(e,t){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,t,0,0,1),this}makeRotation(e){let t=Math.cos(e),i=Math.sin(e);return this.set(t,-i,0,i,t,0,0,0,1),this}makeScale(e,t){return this.set(e,0,0,0,t,0,0,0,1),this}equals(e){let t=this.elements,i=e.elements;for(let r=0;r<9;r++)if(t[r]!==i[r])return!1;return!0}fromArray(e,t=0){for(let i=0;i<9;i++)this.elements[i]=e[i+t];return this}toArray(e=[],t=0){let i=this.elements;return e[t]=i[0],e[t+1]=i[1],e[t+2]=i[2],e[t+3]=i[3],e[t+4]=i[4],e[t+5]=i[5],e[t+6]=i[6],e[t+7]=i[7],e[t+8]=i[8],e}clone(){return new this.constructor().fromArray(this.elements)}};qm.prototype.isMatrix3=!0;var ut=qm,Vp=new ut,Qx=new ut().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),ev=new ut().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function v1(){let n={enabled:!0,workingColorSpace:xo,spaces:{},convert:function(r,s,o){return this.enabled===!1||s===o||!s||!o||(this.spaces[s].transfer===kt&&(r.r=qr(r.r),r.g=qr(r.g),r.b=qr(r.b)),this.spaces[s].primaries!==this.spaces[o].primaries&&(r.applyMatrix3(this.spaces[s].toXYZ),r.applyMatrix3(this.spaces[o].fromXYZ)),this.spaces[o].transfer===kt&&(r.r=ga(r.r),r.g=ga(r.g),r.b=ga(r.b))),r},workingToColorSpace:function(r,s){return this.convert(r,this.workingColorSpace,s)},colorSpaceToWorking:function(r,s){return this.convert(r,s,this.workingColorSpace)},getPrimaries:function(r){return this.spaces[r].primaries},getTransfer:function(r){return r===ns?zl:this.spaces[r].transfer},getToneMappingMode:function(r){return this.spaces[r].outputColorSpaceConfig.toneMappingMode||"standard"},getLuminanceCoefficients:function(r,s=this.workingColorSpace){return r.fromArray(this.spaces[s].luminanceCoefficients)},define:function(r){Object.assign(this.spaces,r)},_getMatrix:function(r,s,o){return r.copy(this.spaces[s].toXYZ).multiply(this.spaces[o].fromXYZ)},_getDrawingBufferColorSpace:function(r){return this.spaces[r].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(r=this.workingColorSpace){return this.spaces[r].workingColorSpaceConfig.unpackColorSpace},fromWorkingColorSpace:function(r,s){return go("ColorManagement: .fromWorkingColorSpace() has been renamed to .workingToColorSpace()."),n.workingToColorSpace(r,s)},toWorkingColorSpace:function(r,s){return go("ColorManagement: .toWorkingColorSpace() has been renamed to .colorSpaceToWorking()."),n.colorSpaceToWorking(r,s)}},e=[.64,.33,.3,.6,.15,.06],t=[.2126,.7152,.0722],i=[.3127,.329];return n.define({[xo]:{primaries:e,whitePoint:i,transfer:zl,toXYZ:Qx,fromXYZ:ev,luminanceCoefficients:t,workingColorSpaceConfig:{unpackColorSpace:Ai},outputColorSpaceConfig:{drawingBufferColorSpace:Ai}},[Ai]:{primaries:e,whitePoint:i,transfer:kt,toXYZ:Qx,fromXYZ:ev,luminanceCoefficients:t,outputColorSpaceConfig:{drawingBufferColorSpace:Ai}}}),n}var yt=v1();function qr(n){return n<.04045?n*.0773993808:Math.pow(n*.9478672986+.0521327014,2.4)}function ga(n){return n<.0031308?n*12.92:1.055*Math.pow(n,.41666)-.055}var na,Ph=class{static getDataURL(e,t="image/png"){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>"u")return e.src;let i;if(e instanceof HTMLCanvasElement)i=e;else{na===void 0&&(na=Gl("canvas")),na.width=e.width,na.height=e.height;let r=na.getContext("2d");e instanceof ImageData?r.putImageData(e,0,0):r.drawImage(e,0,0,e.width,e.height),i=na}return i.toDataURL(t)}static sRGBToLinear(e){if(typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&e instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&e instanceof ImageBitmap){let t=Gl("canvas");t.width=e.width,t.height=e.height;let i=t.getContext("2d");i.drawImage(e,0,0,e.width,e.height);let r=i.getImageData(0,0,e.width,e.height),s=r.data;for(let o=0;o<s.length;o++)s[o]=qr(s[o]/255)*255;return i.putImageData(r,0,0),t}else if(e.data){let t=e.data.slice(0);for(let i=0;i<t.length;i++)t instanceof Uint8Array||t instanceof Uint8ClampedArray?t[i]=Math.floor(qr(t[i]/255)*255):t[i]=qr(t[i]);return{data:t,width:e.width,height:e.height}}else return Qe("ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),e}},y1=0,ya=class{constructor(e=null){this.isTextureSource=!0,Object.defineProperty(this,"id",{value:y1++}),this.uuid=Rs(),this.data=e,this.dataReady=!0,this.version=0}getSize(e){let t=this.data;return typeof HTMLVideoElement<"u"&&t instanceof HTMLVideoElement?e.set(t.videoWidth,t.videoHeight,0):typeof VideoFrame<"u"&&t instanceof VideoFrame?e.set(t.displayWidth,t.displayHeight,0):t!==null?e.set(t.width,t.height,t.depth||0):e.set(0,0,0),e}set needsUpdate(e){e===!0&&this.version++}toJSON(e){let t=e===void 0||typeof e=="string";if(!t&&e.images[this.uuid]!==void 0)return e.images[this.uuid];let i={uuid:this.uuid,url:""},r=this.data;if(r!==null){let s;if(Array.isArray(r)){s=[];for(let o=0,a=r.length;o<a;o++)r[o].isDataTexture?s.push(Gp(r[o].image)):s.push(Gp(r[o]))}else s=Gp(r);i.url=s}return t||(e.images[this.uuid]=i),i}};function Gp(n){return typeof HTMLImageElement<"u"&&n instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&n instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&n instanceof ImageBitmap?Ph.getDataURL(n):n.data?{data:Array.from(n.data),width:n.width,height:n.height,type:n.data.constructor.name}:(Qe("Texture: Unable to serialize Texture."),{})}var _1=0,Hp=new C,oi=class n extends _r{constructor(e=n.DEFAULT_IMAGE,t=n.DEFAULT_MAPPING,i=Zn,r=Zn,s=At,o=Os,a=Hn,l=Ci,c=n.DEFAULT_ANISOTROPY,u=ns){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:_1++}),this.uuid=Rs(),this.name="",this.source=new ya(e),this.mipmaps=[],this.mapping=t,this.channel=0,this.wrapS=i,this.wrapT=r,this.magFilter=s,this.minFilter=o,this.anisotropy=c,this.format=a,this.internalFormat=null,this.type=l,this.offset=new it(0,0),this.repeat=new it(1,1),this.center=new it(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new ut,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=u,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(e&&e.depth&&e.depth>1),this.pmremVersion=0,this.normalized=!1}get width(){return this.source.getSize(Hp).x}get height(){return this.source.getSize(Hp).y}get depth(){return this.source.getSize(Hp).z}get image(){return this.source.data}set image(e){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.normalized=e.normalized,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.renderTarget=e.renderTarget,this.isRenderTargetTexture=e.isRenderTargetTexture,this.isArrayTexture=e.isArrayTexture,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}setValues(e){for(let t in e){let i=e[t];if(i===void 0){Qe(`Texture.setValues(): parameter '${t}' has value of undefined.`);continue}let r=this[t];if(r===void 0){Qe(`Texture.setValues(): property '${t}' does not exist.`);continue}r&&i&&r.isVector2&&i.isVector2||r&&i&&r.isVector3&&i.isVector3||r&&i&&r.isMatrix3&&i.isMatrix3?r.copy(i):this[t]=i}}toJSON(e){let t=e===void 0||typeof e=="string";if(!t&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];let i={metadata:{version:4.7,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,normalized:this.normalized,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(i.userData=this.userData),t||(e.textures[this.uuid]=i),i}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(e){if(this.mapping!==Pm)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case Th:e.x=e.x-Math.floor(e.x);break;case Zn:e.x=e.x<0?0:1;break;case Rh:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x=e.x-Math.floor(e.x);break}if(e.y<0||e.y>1)switch(this.wrapT){case Th:e.y=e.y-Math.floor(e.y);break;case Zn:e.y=e.y<0?0:1;break;case Rh:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y=e.y-Math.floor(e.y);break}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(e){e===!0&&this.pmremVersion++}};oi.DEFAULT_IMAGE=null;oi.DEFAULT_MAPPING=Pm;oi.DEFAULT_ANISOTROPY=1;var jm=class jm{constructor(e=0,t=0,i=0,r=1){this.x=e,this.y=t,this.z=i,this.w=r}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,t,i,r){return this.x=e,this.y=t,this.z=i,this.w=r,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;case 3:this.w=t;break;default:throw new Error("THREE.Vector4: index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("THREE.Vector4: index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w!==void 0?e.w:1,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this.w=e.w+t.w,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this.w+=e.w*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this.w=e.w-t.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){let t=this.x,i=this.y,r=this.z,s=this.w,o=e.elements;return this.x=o[0]*t+o[4]*i+o[8]*r+o[12]*s,this.y=o[1]*t+o[5]*i+o[9]*r+o[13]*s,this.z=o[2]*t+o[6]*i+o[10]*r+o[14]*s,this.w=o[3]*t+o[7]*i+o[11]*r+o[15]*s,this}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this.w/=e.w,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);let t=Math.sqrt(1-e.w*e.w);return t<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/t,this.y=e.y/t,this.z=e.z/t),this}setAxisAngleFromRotationMatrix(e){let t,i,r,s,l=e.elements,c=l[0],u=l[4],d=l[8],h=l[1],f=l[5],g=l[9],y=l[2],m=l[6],p=l[10];if(Math.abs(u-h)<.01&&Math.abs(d-y)<.01&&Math.abs(g-m)<.01){if(Math.abs(u+h)<.1&&Math.abs(d+y)<.1&&Math.abs(g+m)<.1&&Math.abs(c+f+p-3)<.1)return this.set(1,0,0,0),this;t=Math.PI;let S=(c+1)/2,_=(f+1)/2,A=(p+1)/2,T=(u+h)/4,R=(d+y)/4,x=(g+m)/4;return S>_&&S>A?S<.01?(i=0,r=.707106781,s=.707106781):(i=Math.sqrt(S),r=T/i,s=R/i):_>A?_<.01?(i=.707106781,r=0,s=.707106781):(r=Math.sqrt(_),i=T/r,s=x/r):A<.01?(i=.707106781,r=.707106781,s=0):(s=Math.sqrt(A),i=R/s,r=x/s),this.set(i,r,s,t),this}let b=Math.sqrt((m-g)*(m-g)+(d-y)*(d-y)+(h-u)*(h-u));return Math.abs(b)<.001&&(b=1),this.x=(m-g)/b,this.y=(d-y)/b,this.z=(h-u)/b,this.w=Math.acos((c+f+p-1)/2),this}setFromMatrixPosition(e){let t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this.w=t[15],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,t){return this.x=bt(this.x,e.x,t.x),this.y=bt(this.y,e.y,t.y),this.z=bt(this.z,e.z,t.z),this.w=bt(this.w,e.w,t.w),this}clampScalar(e,t){return this.x=bt(this.x,e,t),this.y=bt(this.y,e,t),this.z=bt(this.z,e,t),this.w=bt(this.w,e,t),this}clampLength(e,t){let i=this.length();return this.divideScalar(i||1).multiplyScalar(bt(i,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this.w+=(e.w-this.w)*t,this}lerpVectors(e,t,i){return this.x=e.x+(t.x-e.x)*i,this.y=e.y+(t.y-e.y)*i,this.z=e.z+(t.z-e.z)*i,this.w=e.w+(t.w-e.w)*i,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this.w=e[t+3],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e[t+3]=this.w,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this.w=e.getW(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}};jm.prototype.isVector4=!0;var en=jm,Lh=class extends _r{constructor(e=1,t=1,i={}){super(),i=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:At,depthBuffer:!0,stencilBuffer:!1,resolveColorBuffer:!0,resolveDepthBuffer:!0,resolveStencilBuffer:!0,storeMultisampledColorBuffer:!0,storeMultisampledDepthBuffer:!0,storeMultisampledStencilBuffer:!0,depthTexture:null,samples:0,count:1,depth:1,multiview:!1,useArrayDepthTexture:!1},i),this.isRenderTarget=!0,this.width=e,this.height=t,this.depth=i.depth,this.scissor=new en(0,0,e,t),this.scissorTest=!1,this.viewport=new en(0,0,e,t),this.textures=[];let r={width:e,height:t,depth:i.depth},s=new oi(r),o=i.count;for(let a=0;a<o;a++)this.textures[a]=s.clone(),this.textures[a].isRenderTargetTexture=!0,this.textures[a].renderTarget=this;this._setTextureOptions(i),this.depthBuffer=i.depthBuffer,this.stencilBuffer=i.stencilBuffer,this.resolveColorBuffer=i.resolveColorBuffer,this.resolveDepthBuffer=i.resolveDepthBuffer,this.resolveStencilBuffer=i.resolveStencilBuffer,this.storeMultisampledColorBuffer=i.storeMultisampledColorBuffer,this.storeMultisampledDepthBuffer=i.storeMultisampledDepthBuffer,this.storeMultisampledStencilBuffer=i.storeMultisampledStencilBuffer,this._depthTexture=null,this.depthTexture=i.depthTexture,this.samples=i.samples,this.multiview=i.multiview,this.useArrayDepthTexture=i.useArrayDepthTexture}_setTextureOptions(e={}){let t={minFilter:At,generateMipmaps:!1,flipY:!1,internalFormat:null};e.mapping!==void 0&&(t.mapping=e.mapping),e.wrapS!==void 0&&(t.wrapS=e.wrapS),e.wrapT!==void 0&&(t.wrapT=e.wrapT),e.wrapR!==void 0&&(t.wrapR=e.wrapR),e.magFilter!==void 0&&(t.magFilter=e.magFilter),e.minFilter!==void 0&&(t.minFilter=e.minFilter),e.format!==void 0&&(t.format=e.format),e.type!==void 0&&(t.type=e.type),e.anisotropy!==void 0&&(t.anisotropy=e.anisotropy),e.colorSpace!==void 0&&(t.colorSpace=e.colorSpace),e.flipY!==void 0&&(t.flipY=e.flipY),e.generateMipmaps!==void 0&&(t.generateMipmaps=e.generateMipmaps),e.internalFormat!==void 0&&(t.internalFormat=e.internalFormat);for(let i=0;i<this.textures.length;i++)this.textures[i].setValues(t)}get texture(){return this.textures[0]}set texture(e){this.textures[0]=e}set depthTexture(e){this._depthTexture!==null&&this._depthTexture.renderTarget===this&&(this._depthTexture.renderTarget=null),e!==null&&e.renderTarget===null&&(e.renderTarget=this),this._depthTexture=e}get depthTexture(){return this._depthTexture}setSize(e,t,i=1){if(this.width!==e||this.height!==t||this.depth!==i){this.width=e,this.height=t,this.depth=i;for(let r=0,s=this.textures.length;r<s;r++)this.textures[r].image.width=e,this.textures[r].image.height=t,this.textures[r].image.depth=i,this.textures[r].isData3DTexture!==!0&&(this.textures[r].isArrayTexture=this.textures[r].image.depth>1);this.dispose()}this.viewport.set(0,0,e,t),this.scissor.set(0,0,e,t)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.textures.length=0;for(let t=0,i=e.textures.length;t<i;t++){this.textures[t]=e.textures[t].clone(),this.textures[t].isRenderTargetTexture=!0,this.textures[t].renderTarget=this;let r=Object.assign({},e.textures[t].image);this.textures[t].source=new ya(r)}if(this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,this.resolveColorBuffer=e.resolveColorBuffer,this.resolveDepthBuffer=e.resolveDepthBuffer,this.resolveStencilBuffer=e.resolveStencilBuffer,this.storeMultisampledColorBuffer=e.storeMultisampledColorBuffer,this.storeMultisampledDepthBuffer=e.storeMultisampledDepthBuffer,this.storeMultisampledStencilBuffer=e.storeMultisampledStencilBuffer,e.depthTexture!==null)if(e.depthTexture.renderTarget===e){let t=e.depthTexture.clone();t.renderTarget=null,this.depthTexture=t}else this.depthTexture=e.depthTexture;return this.samples=e.samples,this.multiview=e.multiview,this.useArrayDepthTexture=e.useArrayDepthTexture,this}dispose(){this.dispatchEvent({type:"dispose"})}},Tn=class extends Lh{constructor(e=1,t=1,i={}){super(e,t,i),this.isWebGLRenderTarget=!0}},Wl=class extends oi{constructor(e=null,t=1,i=1,r=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:t,height:i,depth:r},this.magFilter=Bn,this.minFilter=Bn,this.wrapR=Zn,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}copy(e){return super.copy(e),this.wrapR=e.wrapR,this}addLayerUpdate(e){this.layerUpdates.add(e)}clearLayerUpdates(){this.layerUpdates.clear()}};var Dh=class extends oi{constructor(e=null,t=1,i=1,r=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:t,height:i,depth:r},this.magFilter=Bn,this.minFilter=Bn,this.wrapR=Zn,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}copy(e){return super.copy(e),this.wrapR=e.wrapR,this}};var id=class id{constructor(e,t,i,r,s,o,a,l,c,u,d,h,f,g,y,m){this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,t,i,r,s,o,a,l,c,u,d,h,f,g,y,m)}set(e,t,i,r,s,o,a,l,c,u,d,h,f,g,y,m){let p=this.elements;return p[0]=e,p[4]=t,p[8]=i,p[12]=r,p[1]=s,p[5]=o,p[9]=a,p[13]=l,p[2]=c,p[6]=u,p[10]=d,p[14]=h,p[3]=f,p[7]=g,p[11]=y,p[15]=m,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new id().fromArray(this.elements)}copy(e){let t=this.elements,i=e.elements;return t[0]=i[0],t[1]=i[1],t[2]=i[2],t[3]=i[3],t[4]=i[4],t[5]=i[5],t[6]=i[6],t[7]=i[7],t[8]=i[8],t[9]=i[9],t[10]=i[10],t[11]=i[11],t[12]=i[12],t[13]=i[13],t[14]=i[14],t[15]=i[15],this}copyPosition(e){let t=this.elements,i=e.elements;return t[12]=i[12],t[13]=i[13],t[14]=i[14],this}setFromMatrix3(e){let t=e.elements;return this.set(t[0],t[3],t[6],0,t[1],t[4],t[7],0,t[2],t[5],t[8],0,0,0,0,1),this}extractBasis(e,t,i){return this.determinantAffine()===0?(e.set(1,0,0),t.set(0,1,0),i.set(0,0,1),this):(e.setFromMatrixColumn(this,0),t.setFromMatrixColumn(this,1),i.setFromMatrixColumn(this,2),this)}makeBasis(e,t,i){return this.set(e.x,t.x,i.x,0,e.y,t.y,i.y,0,e.z,t.z,i.z,0,0,0,0,1),this}extractRotation(e){if(e.determinantAffine()===0)return this.identity();let t=this.elements,i=e.elements,r=1/ia.setFromMatrixColumn(e,0).length(),s=1/ia.setFromMatrixColumn(e,1).length(),o=1/ia.setFromMatrixColumn(e,2).length();return t[0]=i[0]*r,t[1]=i[1]*r,t[2]=i[2]*r,t[3]=0,t[4]=i[4]*s,t[5]=i[5]*s,t[6]=i[6]*s,t[7]=0,t[8]=i[8]*o,t[9]=i[9]*o,t[10]=i[10]*o,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromEuler(e){let t=this.elements,i=e.x,r=e.y,s=e.z,o=Math.cos(i),a=Math.sin(i),l=Math.cos(r),c=Math.sin(r),u=Math.cos(s),d=Math.sin(s);if(e.order==="XYZ"){let h=o*u,f=o*d,g=a*u,y=a*d;t[0]=l*u,t[4]=-l*d,t[8]=c,t[1]=f+g*c,t[5]=h-y*c,t[9]=-a*l,t[2]=y-h*c,t[6]=g+f*c,t[10]=o*l}else if(e.order==="YXZ"){let h=l*u,f=l*d,g=c*u,y=c*d;t[0]=h+y*a,t[4]=g*a-f,t[8]=o*c,t[1]=o*d,t[5]=o*u,t[9]=-a,t[2]=f*a-g,t[6]=y+h*a,t[10]=o*l}else if(e.order==="ZXY"){let h=l*u,f=l*d,g=c*u,y=c*d;t[0]=h-y*a,t[4]=-o*d,t[8]=g+f*a,t[1]=f+g*a,t[5]=o*u,t[9]=y-h*a,t[2]=-o*c,t[6]=a,t[10]=o*l}else if(e.order==="ZYX"){let h=o*u,f=o*d,g=a*u,y=a*d;t[0]=l*u,t[4]=g*c-f,t[8]=h*c+y,t[1]=l*d,t[5]=y*c+h,t[9]=f*c-g,t[2]=-c,t[6]=a*l,t[10]=o*l}else if(e.order==="YZX"){let h=o*l,f=o*c,g=a*l,y=a*c;t[0]=l*u,t[4]=y-h*d,t[8]=g*d+f,t[1]=d,t[5]=o*u,t[9]=-a*u,t[2]=-c*u,t[6]=f*d+g,t[10]=h-y*d}else if(e.order==="XZY"){let h=o*l,f=o*c,g=a*l,y=a*c;t[0]=l*u,t[4]=-d,t[8]=c*u,t[1]=h*d+y,t[5]=o*u,t[9]=f*d-g,t[2]=g*d-f,t[6]=a*u,t[10]=y*d+h}return t[3]=0,t[7]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromQuaternion(e){return this.compose(M1,e,b1)}lookAt(e,t,i){let r=this.elements;return wi.subVectors(e,t),wi.lengthSq()===0&&(wi.z=1),wi.normalize(),Ss.crossVectors(i,wi),Ss.lengthSq()===0&&(Math.abs(i.z)===1?wi.x+=1e-4:wi.z+=1e-4,wi.normalize(),Ss.crossVectors(i,wi)),Ss.normalize(),Wu.crossVectors(wi,Ss),r[0]=Ss.x,r[4]=Wu.x,r[8]=wi.x,r[1]=Ss.y,r[5]=Wu.y,r[9]=wi.y,r[2]=Ss.z,r[6]=Wu.z,r[10]=wi.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){let i=e.elements,r=t.elements,s=this.elements,o=i[0],a=i[4],l=i[8],c=i[12],u=i[1],d=i[5],h=i[9],f=i[13],g=i[2],y=i[6],m=i[10],p=i[14],b=i[3],S=i[7],_=i[11],A=i[15],T=r[0],R=r[4],x=r[8],w=r[12],I=r[1],D=r[5],F=r[9],z=r[13],N=r[2],V=r[6],K=r[10],$=r[14],J=r[3],j=r[7],Q=r[11],ie=r[15];return s[0]=o*T+a*I+l*N+c*J,s[4]=o*R+a*D+l*V+c*j,s[8]=o*x+a*F+l*K+c*Q,s[12]=o*w+a*z+l*$+c*ie,s[1]=u*T+d*I+h*N+f*J,s[5]=u*R+d*D+h*V+f*j,s[9]=u*x+d*F+h*K+f*Q,s[13]=u*w+d*z+h*$+f*ie,s[2]=g*T+y*I+m*N+p*J,s[6]=g*R+y*D+m*V+p*j,s[10]=g*x+y*F+m*K+p*Q,s[14]=g*w+y*z+m*$+p*ie,s[3]=b*T+S*I+_*N+A*J,s[7]=b*R+S*D+_*V+A*j,s[11]=b*x+S*F+_*K+A*Q,s[15]=b*w+S*z+_*$+A*ie,this}multiplyScalar(e){let t=this.elements;return t[0]*=e,t[4]*=e,t[8]*=e,t[12]*=e,t[1]*=e,t[5]*=e,t[9]*=e,t[13]*=e,t[2]*=e,t[6]*=e,t[10]*=e,t[14]*=e,t[3]*=e,t[7]*=e,t[11]*=e,t[15]*=e,this}determinant(){let e=this.elements,t=e[0],i=e[4],r=e[8],s=e[12],o=e[1],a=e[5],l=e[9],c=e[13],u=e[2],d=e[6],h=e[10],f=e[14],g=e[3],y=e[7],m=e[11],p=e[15],b=l*f-c*h,S=a*f-c*d,_=a*h-l*d,A=o*f-c*u,T=o*h-l*u,R=o*d-a*u;return t*(y*b-m*S+p*_)-i*(g*b-m*A+p*T)+r*(g*S-y*A+p*R)-s*(g*_-y*T+m*R)}determinantAffine(){let e=this.elements,t=e[0],i=e[4],r=e[8],s=e[1],o=e[5],a=e[9],l=e[2],c=e[6],u=e[10];return t*(o*u-a*c)-i*(s*u-a*l)+r*(s*c-o*l)}transpose(){let e=this.elements,t;return t=e[1],e[1]=e[4],e[4]=t,t=e[2],e[2]=e[8],e[8]=t,t=e[6],e[6]=e[9],e[9]=t,t=e[3],e[3]=e[12],e[12]=t,t=e[7],e[7]=e[13],e[13]=t,t=e[11],e[11]=e[14],e[14]=t,this}setPosition(e,t,i){let r=this.elements;return e.isVector3?(r[12]=e.x,r[13]=e.y,r[14]=e.z):(r[12]=e,r[13]=t,r[14]=i),this}invert(){let e=this.elements,t=e[0],i=e[1],r=e[2],s=e[3],o=e[4],a=e[5],l=e[6],c=e[7],u=e[8],d=e[9],h=e[10],f=e[11],g=e[12],y=e[13],m=e[14],p=e[15],b=t*a-i*o,S=t*l-r*o,_=t*c-s*o,A=i*l-r*a,T=i*c-s*a,R=r*c-s*l,x=u*y-d*g,w=u*m-h*g,I=u*p-f*g,D=d*m-h*y,F=d*p-f*y,z=h*p-f*m,N=b*z-S*F+_*D+A*I-T*w+R*x;if(N===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);let V=1/N;return e[0]=(a*z-l*F+c*D)*V,e[1]=(r*F-i*z-s*D)*V,e[2]=(y*R-m*T+p*A)*V,e[3]=(h*T-d*R-f*A)*V,e[4]=(l*I-o*z-c*w)*V,e[5]=(t*z-r*I+s*w)*V,e[6]=(m*_-g*R-p*S)*V,e[7]=(u*R-h*_+f*S)*V,e[8]=(o*F-a*I+c*x)*V,e[9]=(i*I-t*F-s*x)*V,e[10]=(g*T-y*_+p*b)*V,e[11]=(d*_-u*T-f*b)*V,e[12]=(a*w-o*D-l*x)*V,e[13]=(t*D-i*w+r*x)*V,e[14]=(y*S-g*A-m*b)*V,e[15]=(u*A-d*S+h*b)*V,this}scale(e){let t=this.elements,i=e.x,r=e.y,s=e.z;return t[0]*=i,t[4]*=r,t[8]*=s,t[1]*=i,t[5]*=r,t[9]*=s,t[2]*=i,t[6]*=r,t[10]*=s,t[3]*=i,t[7]*=r,t[11]*=s,this}getMaxScaleOnAxis(){let e=this.elements,t=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],i=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],r=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(t,i,r))}makeTranslation(e,t,i){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,t,0,0,1,i,0,0,0,1),this}makeRotationX(e){let t=Math.cos(e),i=Math.sin(e);return this.set(1,0,0,0,0,t,-i,0,0,i,t,0,0,0,0,1),this}makeRotationY(e){let t=Math.cos(e),i=Math.sin(e);return this.set(t,0,i,0,0,1,0,0,-i,0,t,0,0,0,0,1),this}makeRotationZ(e){let t=Math.cos(e),i=Math.sin(e);return this.set(t,-i,0,0,i,t,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,t){let i=Math.cos(t),r=Math.sin(t),s=1-i,o=e.x,a=e.y,l=e.z,c=s*o,u=s*a;return this.set(c*o+i,c*a-r*l,c*l+r*a,0,c*a+r*l,u*a+i,u*l-r*o,0,c*l-r*a,u*l+r*o,s*l*l+i,0,0,0,0,1),this}makeScale(e,t,i){return this.set(e,0,0,0,0,t,0,0,0,0,i,0,0,0,0,1),this}makeShear(e,t,i,r,s,o){return this.set(1,i,s,0,e,1,o,0,t,r,1,0,0,0,0,1),this}compose(e,t,i){let r=this.elements,s=t._x,o=t._y,a=t._z,l=t._w,c=s+s,u=o+o,d=a+a,h=s*c,f=s*u,g=s*d,y=o*u,m=o*d,p=a*d,b=l*c,S=l*u,_=l*d,A=i.x,T=i.y,R=i.z;return r[0]=(1-(y+p))*A,r[1]=(f+_)*A,r[2]=(g-S)*A,r[3]=0,r[4]=(f-_)*T,r[5]=(1-(h+p))*T,r[6]=(m+b)*T,r[7]=0,r[8]=(g+S)*R,r[9]=(m-b)*R,r[10]=(1-(h+y))*R,r[11]=0,r[12]=e.x,r[13]=e.y,r[14]=e.z,r[15]=1,this}decompose(e,t,i){let r=this.elements;e.x=r[12],e.y=r[13],e.z=r[14];let s=this.determinantAffine();if(s===0)return i.set(1,1,1),t.identity(),this;let o=ia.set(r[0],r[1],r[2]).length(),a=ia.set(r[4],r[5],r[6]).length(),l=ia.set(r[8],r[9],r[10]).length();s<0&&(o=-o),nr.copy(this);let c=1/o,u=1/a,d=1/l;return nr.elements[0]*=c,nr.elements[1]*=c,nr.elements[2]*=c,nr.elements[4]*=u,nr.elements[5]*=u,nr.elements[6]*=u,nr.elements[8]*=d,nr.elements[9]*=d,nr.elements[10]*=d,t.setFromRotationMatrix(nr),i.x=o,i.y=a,i.z=l,this}makePerspective(e,t,i,r,s,o,a=or,l=!1){let c=this.elements,u=2*s/(t-e),d=2*s/(i-r),h=(t+e)/(t-e),f=(i+r)/(i-r),g,y;if(l)g=s/(o-s),y=o*s/(o-s);else if(a===or)g=-(o+s)/(o-s),y=-2*o*s/(o-s);else if(a===Vl)g=-o/(o-s),y=-o*s/(o-s);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+a);return c[0]=u,c[4]=0,c[8]=h,c[12]=0,c[1]=0,c[5]=d,c[9]=f,c[13]=0,c[2]=0,c[6]=0,c[10]=g,c[14]=y,c[3]=0,c[7]=0,c[11]=-1,c[15]=0,this}makeOrthographic(e,t,i,r,s,o,a=or,l=!1){let c=this.elements,u=2/(t-e),d=2/(i-r),h=-(t+e)/(t-e),f=-(i+r)/(i-r),g,y;if(l)g=1/(o-s),y=o/(o-s);else if(a===or)g=-2/(o-s),y=-(o+s)/(o-s);else if(a===Vl)g=-1/(o-s),y=-s/(o-s);else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+a);return c[0]=u,c[4]=0,c[8]=0,c[12]=h,c[1]=0,c[5]=d,c[9]=0,c[13]=f,c[2]=0,c[6]=0,c[10]=g,c[14]=y,c[3]=0,c[7]=0,c[11]=0,c[15]=1,this}equals(e){let t=this.elements,i=e.elements;for(let r=0;r<16;r++)if(t[r]!==i[r])return!1;return!0}fromArray(e,t=0){for(let i=0;i<16;i++)this.elements[i]=e[i+t];return this}toArray(e=[],t=0){let i=this.elements;return e[t]=i[0],e[t+1]=i[1],e[t+2]=i[2],e[t+3]=i[3],e[t+4]=i[4],e[t+5]=i[5],e[t+6]=i[6],e[t+7]=i[7],e[t+8]=i[8],e[t+9]=i[9],e[t+10]=i[10],e[t+11]=i[11],e[t+12]=i[12],e[t+13]=i[13],e[t+14]=i[14],e[t+15]=i[15],e}};id.prototype.isMatrix4=!0;var Et=id,ia=new C,nr=new Et,M1=new C(0,0,0),b1=new C(1,1,1),Ss=new C,Wu=new C,wi=new C,tv=new Et,nv=new Gi,Cs=class n{constructor(e=0,t=0,i=0,r=n.DEFAULT_ORDER){this.isEuler=!0,this._x=e,this._y=t,this._z=i,this._order=r}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,t,i,r=this._order){return this._x=e,this._y=t,this._z=i,this._order=r,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,t=this._order,i=!0){let r=e.elements,s=r[0],o=r[4],a=r[8],l=r[1],c=r[5],u=r[9],d=r[2],h=r[6],f=r[10];switch(t){case"XYZ":this._y=Math.asin(bt(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(-u,f),this._z=Math.atan2(-o,s)):(this._x=Math.atan2(h,c),this._z=0);break;case"YXZ":this._x=Math.asin(-bt(u,-1,1)),Math.abs(u)<.9999999?(this._y=Math.atan2(a,f),this._z=Math.atan2(l,c)):(this._y=Math.atan2(-d,s),this._z=0);break;case"ZXY":this._x=Math.asin(bt(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(-d,f),this._z=Math.atan2(-o,c)):(this._y=0,this._z=Math.atan2(l,s));break;case"ZYX":this._y=Math.asin(-bt(d,-1,1)),Math.abs(d)<.9999999?(this._x=Math.atan2(h,f),this._z=Math.atan2(l,s)):(this._x=0,this._z=Math.atan2(-o,c));break;case"YZX":this._z=Math.asin(bt(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-u,c),this._y=Math.atan2(-d,s)):(this._x=0,this._y=Math.atan2(a,f));break;case"XZY":this._z=Math.asin(-bt(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(h,c),this._y=Math.atan2(a,s)):(this._x=Math.atan2(-u,f),this._y=0);break;default:Qe("Euler: .setFromRotationMatrix() encountered an unknown order: "+t)}return this._order=t,i===!0&&this._onChangeCallback(),this}setFromQuaternion(e,t,i){return tv.makeRotationFromQuaternion(e),this.setFromRotationMatrix(tv,t,i)}setFromVector3(e,t=this._order){return this.set(e.x,e.y,e.z,t)}reorder(e){return nv.setFromEuler(this),this.setFromQuaternion(nv,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}};Cs.DEFAULT_ORDER="XYZ";var _a=class{constructor(){this.mask=1}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return(this.mask&(1<<e|0))!==0}},S1=0,iv=new C,ra=new Gi,Gr=new Et,Xu=new C,Ll=new C,w1=new C,E1=new Gi,rv=new C(1,0,0),sv=new C(0,1,0),ov=new C(0,0,1),av={type:"added"},A1={type:"removed"},sa={type:"childadded",child:null},Wp={type:"childremoved",child:null},mi=class n extends _r{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:S1++}),this.uuid=Rs(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=n.DEFAULT_UP.clone();let e=new C,t=new Cs,i=new Gi,r=new C(1,1,1);function s(){i.setFromEuler(t,!1)}function o(){t.setFromQuaternion(i,void 0,!1)}t._onChange(s),i._onChange(o),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:e},rotation:{configurable:!0,enumerable:!0,value:t},quaternion:{configurable:!0,enumerable:!0,value:i},scale:{configurable:!0,enumerable:!0,value:r},modelViewMatrix:{value:new Et},normalMatrix:{value:new ut}}),this.matrix=new Et,this.matrixWorld=new Et,this.matrixAutoUpdate=n.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=n.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new _a,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.static=!1,this.userData={},this.pivot=null}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,t){this.quaternion.setFromAxisAngle(e,t)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,t){return ra.setFromAxisAngle(e,t),this.quaternion.multiply(ra),this}rotateOnWorldAxis(e,t){return ra.setFromAxisAngle(e,t),this.quaternion.premultiply(ra),this}rotateX(e){return this.rotateOnAxis(rv,e)}rotateY(e){return this.rotateOnAxis(sv,e)}rotateZ(e){return this.rotateOnAxis(ov,e)}translateOnAxis(e,t){return iv.copy(e).applyQuaternion(this.quaternion),this.position.add(iv.multiplyScalar(t)),this}translateX(e){return this.translateOnAxis(rv,e)}translateY(e){return this.translateOnAxis(sv,e)}translateZ(e){return this.translateOnAxis(ov,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(Gr.copy(this.matrixWorld).invert())}lookAt(e,t,i){e.isVector3?Xu.copy(e):Xu.set(e,t,i);let r=this.parent;this.updateWorldMatrix(!0,!1),Ll.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?Gr.lookAt(Ll,Xu,this.up):Gr.lookAt(Xu,Ll,this.up),this.quaternion.setFromRotationMatrix(Gr),r&&(Gr.extractRotation(r.matrixWorld),ra.setFromRotationMatrix(Gr),this.quaternion.premultiply(ra.invert()))}add(e){if(arguments.length>1){for(let t=0;t<arguments.length;t++)this.add(arguments[t]);return this}return e===this?(nt("Object3D.add: object can't be added as a child of itself.",e),this):(e&&e.isObject3D?(e.removeFromParent(),e.parent=this,this.children.push(e),e.dispatchEvent(av),sa.child=e,this.dispatchEvent(sa),sa.child=null):nt("Object3D.add: object not an instance of THREE.Object3D.",e),this)}remove(e){if(arguments.length>1){for(let i=0;i<arguments.length;i++)this.remove(arguments[i]);return this}let t=this.children.indexOf(e);return t!==-1&&(e.parent=null,this.children.splice(t,1),e.dispatchEvent(A1),Wp.child=e,this.dispatchEvent(Wp),Wp.child=null),this}removeFromParent(){let e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),Gr.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),Gr.multiply(e.parent.matrixWorld)),e.applyMatrix4(Gr),e.removeFromParent(),e.parent=this,this.children.push(e),e.updateWorldMatrix(!1,!0),e.dispatchEvent(av),sa.child=e,this.dispatchEvent(sa),sa.child=null,this}getObjectById(e){return this.getObjectByProperty("id",e)}getObjectByName(e){return this.getObjectByProperty("name",e)}getObjectByProperty(e,t){if(this[e]===t)return this;for(let i=0,r=this.children.length;i<r;i++){let o=this.children[i].getObjectByProperty(e,t);if(o!==void 0)return o}}getObjectsByProperty(e,t,i=[]){this[e]===t&&i.push(this);let r=this.children;for(let s=0,o=r.length;s<o;s++)r[s].getObjectsByProperty(e,t,i);return i}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Ll,e,w1),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Ll,E1,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);let t=this.matrixWorld.elements;return e.set(t[8],t[9],t[10]).normalize()}raycast(){}intersectsFrustum(){}traverse(e){e(this);let t=this.children;for(let i=0,r=t.length;i<r;i++)t[i].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);let t=this.children;for(let i=0,r=t.length;i<r;i++)t[i].traverseVisible(e)}traverseAncestors(e){let t=this.parent;t!==null&&(e(t),t.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale);let e=this.pivot;if(e!==null){let t=e.x,i=e.y,r=e.z,s=this.matrix.elements;s[12]+=t-s[0]*t-s[4]*i-s[8]*r,s[13]+=i-s[1]*t-s[5]*i-s[9]*r,s[14]+=r-s[2]*t-s[6]*i-s[10]*r}this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,e=!0);let t=this.children;for(let i=0,r=t.length;i<r;i++)t[i].updateMatrixWorld(e)}updateWorldMatrix(e,t,i=!1){let r=this.parent;if(e===!0&&r!==null&&r.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||i)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,i=!0),t===!0){let s=this.children;for(let o=0,a=s.length;o<a;o++)s[o].updateWorldMatrix(!1,!0,i)}}toJSON(e){let t=e===void 0||typeof e=="string",i={};t&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},i.metadata={version:4.7,type:"Object",generator:"Object3D.toJSON"});let r={};r.uuid=this.uuid,r.type=this.type,r.name=this.name,r.castShadow=this.castShadow,r.receiveShadow=this.receiveShadow,r.visible=this.visible,r.frustumCulled=this.frustumCulled,r.renderOrder=this.renderOrder,r.static=this.static,r.matrixAutoUpdate=this.matrixAutoUpdate,Object.keys(this.userData).length>0&&(r.userData=this.userData),r.layers=this.layers.mask,r.matrix=this.matrix.toArray(),r.up=this.up.toArray(),this.pivot!==null&&(r.pivot=this.pivot.toArray()),this.morphTargetDictionary!==void 0&&(r.morphTargetDictionary=Object.assign({},this.morphTargetDictionary)),this.morphTargetInfluences!==void 0&&(r.morphTargetInfluences=this.morphTargetInfluences.slice()),this.isInstancedMesh&&(r.type="InstancedMesh",r.count=this.count,r.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(r.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(r.type="BatchedMesh",r.perObjectFrustumCulled=this.perObjectFrustumCulled,r.sortObjects=this.sortObjects,r.drawRanges=this._drawRanges,r.reservedRanges=this._reservedRanges,r.geometryInfo=this._geometryInfo.map(a=>({...a,boundingBox:a.boundingBox?a.boundingBox.toJSON():void 0,boundingSphere:a.boundingSphere?a.boundingSphere.toJSON():void 0})),r.instanceInfo=this._instanceInfo.map(a=>({...a})),r.availableInstanceIds=this._availableInstanceIds.slice(),r.availableGeometryIds=this._availableGeometryIds.slice(),r.nextIndexStart=this._nextIndexStart,r.nextVertexStart=this._nextVertexStart,r.geometryCount=this._geometryCount,r.maxInstanceCount=this._maxInstanceCount,r.maxVertexCount=this._maxVertexCount,r.maxIndexCount=this._maxIndexCount,r.geometryInitialized=this._geometryInitialized,r.matricesTexture=this._matricesTexture.toJSON(e),r.indirectTexture=this._indirectTexture.toJSON(e),this._colorsTexture!==null&&(r.colorsTexture=this._colorsTexture.toJSON(e)),this.boundingSphere!==null&&(r.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(r.boundingBox=this.boundingBox.toJSON()));function s(a,l){return a[l.uuid]===void 0&&(a[l.uuid]=l.toJSON(e)),l.uuid}if(this.isScene)this.background&&(this.background.isColor?r.background=this.background.toJSON():this.background.isTexture&&(r.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(r.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){r.geometry=s(e.geometries,this.geometry);let a=this.geometry.parameters;if(a!==void 0&&a.shapes!==void 0){let l=a.shapes;if(Array.isArray(l))for(let c=0,u=l.length;c<u;c++){let d=l[c];s(e.shapes,d)}else s(e.shapes,l)}}if(this.isSkinnedMesh&&(r.bindMode=this.bindMode,r.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(s(e.skeletons,this.skeleton),r.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){let a=[];for(let l=0,c=this.material.length;l<c;l++)a.push(s(e.materials,this.material[l]));r.material=a}else r.material=s(e.materials,this.material);if(this.children.length>0){r.children=[];for(let a=0;a<this.children.length;a++)r.children.push(this.children[a].toJSON(e).object)}if(this.animations.length>0){r.animations=[];for(let a=0;a<this.animations.length;a++){let l=this.animations[a];r.animations.push(s(e.animations,l))}}if(t){let a=o(e.geometries),l=o(e.materials),c=o(e.textures),u=o(e.images),d=o(e.shapes),h=o(e.skeletons),f=o(e.animations),g=o(e.nodes);a.length>0&&(i.geometries=a),l.length>0&&(i.materials=l),c.length>0&&(i.textures=c),u.length>0&&(i.images=u),d.length>0&&(i.shapes=d),h.length>0&&(i.skeletons=h),f.length>0&&(i.animations=f),g.length>0&&(i.nodes=g)}return i.object=r,i;function o(a){let l=[];for(let c in a){let u=a[c];delete u.metadata,l.push(u)}return l}}clone(e){return new this.constructor().copy(this,e)}copy(e,t=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.pivot=e.pivot!==null?e.pivot.clone():null,this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.static=e.static,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),t===!0)for(let i=0;i<e.children.length;i++){let r=e.children[i];this.add(r.clone())}return this}dispose(){this.dispatchEvent({type:"dispose"})}};mi.DEFAULT_UP=new C(0,1,0);mi.DEFAULT_MATRIX_AUTO_UPDATE=!0;mi.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;var jt=class extends mi{constructor(){super(),this.isGroup=!0,this.type="Group"}},T1={type:"move"},Ma=class{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new jt,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new jt,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new C,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new C),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new jt,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new C,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new C,this._grip.eventsEnabled=!1),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){let t=this._hand;if(t)for(let i of e.hand.values())this._getHandJoint(t,i)}return this.dispatchEvent({type:"connected",data:e}),this}disconnect(e){return this.dispatchEvent({type:"disconnected",data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,t,i){let r=null,s=null,o=null,a=this._targetRay,l=this._grip,c=this._hand;if(e&&t.session.visibilityState!=="visible-blurred"){if(c&&e.hand){o=!0;for(let y of e.hand.values()){let m=t.getJointPose(y,i),p=this._getHandJoint(c,y);m!==null&&(p.matrix.fromArray(m.transform.matrix),p.matrix.decompose(p.position,p.rotation,p.scale),p.matrixWorldNeedsUpdate=!0,p.jointRadius=m.radius),p.visible=m!==null}let u=c.joints["index-finger-tip"],d=c.joints["thumb-tip"],h=u.position.distanceTo(d.position),f=.02,g=.005;c.inputState.pinching&&h>f+g?(c.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:e.handedness,target:this})):!c.inputState.pinching&&h<=f-g&&(c.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:e.handedness,target:this}))}else l!==null&&e.gripSpace&&(s=t.getPose(e.gripSpace,i),s!==null&&(l.matrix.fromArray(s.transform.matrix),l.matrix.decompose(l.position,l.rotation,l.scale),l.matrixWorldNeedsUpdate=!0,s.linearVelocity?(l.hasLinearVelocity=!0,l.linearVelocity.copy(s.linearVelocity)):l.hasLinearVelocity=!1,s.angularVelocity?(l.hasAngularVelocity=!0,l.angularVelocity.copy(s.angularVelocity)):l.hasAngularVelocity=!1,l.eventsEnabled&&l.dispatchEvent({type:"gripUpdated",data:e,target:this})));a!==null&&(r=t.getPose(e.targetRaySpace,i),r===null&&s!==null&&(r=s),r!==null&&(a.matrix.fromArray(r.transform.matrix),a.matrix.decompose(a.position,a.rotation,a.scale),a.matrixWorldNeedsUpdate=!0,r.linearVelocity?(a.hasLinearVelocity=!0,a.linearVelocity.copy(r.linearVelocity)):a.hasLinearVelocity=!1,r.angularVelocity?(a.hasAngularVelocity=!0,a.angularVelocity.copy(r.angularVelocity)):a.hasAngularVelocity=!1,this.dispatchEvent(T1)))}return a!==null&&(a.visible=r!==null),l!==null&&(l.visible=s!==null),c!==null&&(c.visible=o!==null),this}_getHandJoint(e,t){if(e.joints[t.jointName]===void 0){let i=new jt;i.matrixAutoUpdate=!1,i.visible=!1,e.joints[t.jointName]=i,e.add(i)}return e.joints[t.jointName]}},cy={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},ws={h:0,s:0,l:0},$u={h:0,s:0,l:0};function Xp(n,e,t){return t<0&&(t+=1),t>1&&(t-=1),t<1/6?n+(e-n)*6*t:t<1/2?e:t<2/3?n+(e-n)*6*(2/3-t):n}var St=class{constructor(e,t,i){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,t,i)}set(e,t,i){if(t===void 0&&i===void 0){let r=e;r&&r.isColor?this.copy(r):typeof r=="number"?this.setHex(r):typeof r=="string"&&this.setStyle(r)}else this.setRGB(e,t,i);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,t=Ai){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,yt.colorSpaceToWorking(this,t),this}setRGB(e,t,i,r=yt.workingColorSpace){return this.r=e,this.g=t,this.b=i,yt.colorSpaceToWorking(this,r),this}setHSL(e,t,i,r=yt.workingColorSpace){if(e=x1(e,1),t=bt(t,0,1),i=bt(i,0,1),t===0)this.r=this.g=this.b=i;else{let s=i<=.5?i*(1+t):i+t-i*t,o=2*i-s;this.r=Xp(o,s,e+1/3),this.g=Xp(o,s,e),this.b=Xp(o,s,e-1/3)}return yt.colorSpaceToWorking(this,r),this}setStyle(e,t=Ai){function i(s){s!==void 0&&parseFloat(s)<1&&Qe("Color: Alpha component of "+e+" will be ignored.")}let r;if(r=/^(\w+)\(([^\)]*)\)/.exec(e)){let s,o=r[1],a=r[2];switch(o){case"rgb":case"rgba":if(s=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return i(s[4]),this.setRGB(Math.min(255,parseInt(s[1],10))/255,Math.min(255,parseInt(s[2],10))/255,Math.min(255,parseInt(s[3],10))/255,t);if(s=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return i(s[4]),this.setRGB(Math.min(100,parseInt(s[1],10))/100,Math.min(100,parseInt(s[2],10))/100,Math.min(100,parseInt(s[3],10))/100,t);break;case"hsl":case"hsla":if(s=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return i(s[4]),this.setHSL(parseFloat(s[1])/360,parseFloat(s[2])/100,parseFloat(s[3])/100,t);break;default:Qe("Color: Unknown color model "+e)}}else if(r=/^\#([A-Fa-f\d]+)$/.exec(e)){let s=r[1],o=s.length;if(o===3)return this.setRGB(parseInt(s.charAt(0),16)/15,parseInt(s.charAt(1),16)/15,parseInt(s.charAt(2),16)/15,t);if(o===6)return this.setHex(parseInt(s,16),t);Qe("Color: Invalid hex color "+e)}else if(e&&e.length>0)return this.setColorName(e,t);return this}setColorName(e,t=Ai){let i=cy[e.toLowerCase()];return i!==void 0?this.setHex(i,t):Qe("Color: Unknown color "+e),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=qr(e.r),this.g=qr(e.g),this.b=qr(e.b),this}copyLinearToSRGB(e){return this.r=ga(e.r),this.g=ga(e.g),this.b=ga(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=Ai){return yt.workingToColorSpace(qn.copy(this),e),Math.round(bt(qn.r*255,0,255))*65536+Math.round(bt(qn.g*255,0,255))*256+Math.round(bt(qn.b*255,0,255))}getHexString(e=Ai){return("000000"+this.getHex(e).toString(16)).slice(-6)}getHSL(e,t=yt.workingColorSpace){yt.workingToColorSpace(qn.copy(this),t);let i=qn.r,r=qn.g,s=qn.b,o=Math.max(i,r,s),a=Math.min(i,r,s),l,c,u=(a+o)/2;if(a===o)l=0,c=0;else{let d=o-a;switch(c=u<=.5?d/(o+a):d/(2-o-a),o){case i:l=(r-s)/d+(r<s?6:0);break;case r:l=(s-i)/d+2;break;case s:l=(i-r)/d+4;break}l/=6}return e.h=l,e.s=c,e.l=u,e}getRGB(e,t=yt.workingColorSpace){return yt.workingToColorSpace(qn.copy(this),t),e.r=qn.r,e.g=qn.g,e.b=qn.b,e}getStyle(e=Ai){yt.workingToColorSpace(qn.copy(this),e);let t=qn.r,i=qn.g,r=qn.b;return e!==Ai?`color(${e} ${t.toFixed(3)} ${i.toFixed(3)} ${r.toFixed(3)})`:`rgb(${Math.round(t*255)},${Math.round(i*255)},${Math.round(r*255)})`}offsetHSL(e,t,i){return this.getHSL(ws),this.setHSL(ws.h+e,ws.s+t,ws.l+i)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,t){return this.r=e.r+t.r,this.g=e.g+t.g,this.b=e.b+t.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,t){return this.r+=(e.r-this.r)*t,this.g+=(e.g-this.g)*t,this.b+=(e.b-this.b)*t,this}lerpColors(e,t,i){return this.r=e.r+(t.r-e.r)*i,this.g=e.g+(t.g-e.g)*i,this.b=e.b+(t.b-e.b)*i,this}lerpHSL(e,t){this.getHSL(ws),e.getHSL($u);let i=kp(ws.h,$u.h,t),r=kp(ws.s,$u.s,t),s=kp(ws.l,$u.l,t);return this.setHSL(i,r,s),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){let t=this.r,i=this.g,r=this.b,s=e.elements;return this.r=s[0]*t+s[3]*i+s[6]*r,this.g=s[1]*t+s[4]*i+s[7]*r,this.b=s[2]*t+s[5]*i+s[8]*r,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,t=0){return this.r=e[t],this.g=e[t+1],this.b=e[t+2],this}toArray(e=[],t=0){return e[t]=this.r,e[t+1]=this.g,e[t+2]=this.b,e}fromBufferAttribute(e,t){return this.r=e.getX(t),this.g=e.getY(t),this.b=e.getZ(t),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}},qn=new St;St.NAMES=cy;var jr=class extends mi{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new Cs,this.environmentIntensity=1,this.environmentRotation=new Cs,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(e,t){return super.copy(e,t),e.background!==null&&(this.background=e.background.clone()),e.environment!==null&&(this.environment=e.environment.clone()),e.fog!==null&&(this.fog=e.fog.clone()),this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,this.backgroundRotation.copy(e.backgroundRotation),this.environmentIntensity=e.environmentIntensity,this.environmentRotation.copy(e.environmentRotation),e.overrideMaterial!==null&&(this.overrideMaterial=e.overrideMaterial.clone()),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){let t=super.toJSON(e);return this.fog!==null&&(t.object.fog=this.fog.toJSON()),t.object.backgroundBlurriness=this.backgroundBlurriness,t.object.backgroundIntensity=this.backgroundIntensity,t.object.backgroundRotation=this.backgroundRotation.toArray(),t.object.environmentIntensity=this.environmentIntensity,t.object.environmentRotation=this.environmentRotation.toArray(),t}},ir=new C,Hr=new C,$p=new C,Wr=new C,oa=new C,aa=new C,lv=new C,Yp=new C,qp=new C,jp=new C,Zp=new en,Kp=new en,Jp=new en,Yr=class n{constructor(e=new C,t=new C,i=new C){this.a=e,this.b=t,this.c=i}static getNormal(e,t,i,r){r.subVectors(i,t),ir.subVectors(e,t),r.cross(ir);let s=r.lengthSq();return s>0?r.multiplyScalar(1/Math.sqrt(s)):r.set(0,0,0)}static getBarycoord(e,t,i,r,s){ir.subVectors(r,t),Hr.subVectors(i,t),$p.subVectors(e,t);let o=ir.dot(ir),a=ir.dot(Hr),l=ir.dot($p),c=Hr.dot(Hr),u=Hr.dot($p),d=o*c-a*a;if(d===0)return s.set(0,0,0),null;let h=1/d,f=(c*l-a*u)*h,g=(o*u-a*l)*h;return s.set(1-f-g,g,f)}static containsPoint(e,t,i,r){return this.getBarycoord(e,t,i,r,Wr)===null?!1:Wr.x>=0&&Wr.y>=0&&Wr.x+Wr.y<=1}static getInterpolation(e,t,i,r,s,o,a,l){return this.getBarycoord(e,t,i,r,Wr)===null?(l.x=0,l.y=0,"z"in l&&(l.z=0),"w"in l&&(l.w=0),null):(l.setScalar(0),l.addScaledVector(s,Wr.x),l.addScaledVector(o,Wr.y),l.addScaledVector(a,Wr.z),l)}static getInterpolatedAttribute(e,t,i,r,s,o){return Zp.setScalar(0),Kp.setScalar(0),Jp.setScalar(0),Zp.fromBufferAttribute(e,t),Kp.fromBufferAttribute(e,i),Jp.fromBufferAttribute(e,r),o.setScalar(0),o.addScaledVector(Zp,s.x),o.addScaledVector(Kp,s.y),o.addScaledVector(Jp,s.z),o}static isFrontFacing(e,t,i,r){return ir.subVectors(i,t),Hr.subVectors(e,t),ir.cross(Hr).dot(r)<0}set(e,t,i){return this.a.copy(e),this.b.copy(t),this.c.copy(i),this}setFromPointsAndIndices(e,t,i,r){return this.a.copy(e[t]),this.b.copy(e[i]),this.c.copy(e[r]),this}setFromAttributeAndIndices(e,t,i,r){return this.a.fromBufferAttribute(e,t),this.b.fromBufferAttribute(e,i),this.c.fromBufferAttribute(e,r),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return ir.subVectors(this.c,this.b),Hr.subVectors(this.a,this.b),ir.cross(Hr).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(e){return n.getNormal(this.a,this.b,this.c,e)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(e,t){return n.getBarycoord(e,this.a,this.b,this.c,t)}getInterpolation(e,t,i,r,s){return n.getInterpolation(e,this.a,this.b,this.c,t,i,r,s)}containsPoint(e){return n.containsPoint(e,this.a,this.b,this.c)}isFrontFacing(e){return n.isFrontFacing(this.a,this.b,this.c,e)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,t){let i=this.a,r=this.b,s=this.c,o,a;oa.subVectors(r,i),aa.subVectors(s,i),Yp.subVectors(e,i);let l=oa.dot(Yp),c=aa.dot(Yp);if(l<=0&&c<=0)return t.copy(i);qp.subVectors(e,r);let u=oa.dot(qp),d=aa.dot(qp);if(u>=0&&d<=u)return t.copy(r);let h=l*d-u*c;if(h<=0&&l>=0&&u<=0)return o=l/(l-u),t.copy(i).addScaledVector(oa,o);jp.subVectors(e,s);let f=oa.dot(jp),g=aa.dot(jp);if(g>=0&&f<=g)return t.copy(s);let y=f*c-l*g;if(y<=0&&c>=0&&g<=0)return a=c/(c-g),t.copy(i).addScaledVector(aa,a);let m=u*g-f*d;if(m<=0&&d-u>=0&&f-g>=0)return lv.subVectors(s,r),a=(d-u)/(d-u+(f-g)),t.copy(r).addScaledVector(lv,a);let p=1/(m+y+h);return o=y*p,a=h*p,t.copy(i).addScaledVector(oa,o).addScaledVector(aa,a)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}},Mr=class{constructor(e=new C(1/0,1/0,1/0),t=new C(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromArray(e){this.makeEmpty();for(let t=0,i=e.length;t<i;t+=3)this.expandByPoint(rr.fromArray(e,t));return this}setFromBufferAttribute(e){this.makeEmpty();for(let t=0,i=e.count;t<i;t++)this.expandByPoint(rr.fromBufferAttribute(e,t));return this}setFromPoints(e){this.makeEmpty();for(let t=0,i=e.length;t<i;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){let i=rr.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(i),this.max.copy(e).add(i),this}setFromObject(e,t=!1){return this.makeEmpty(),this.expandByObject(e,t)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,t=!1){e.updateWorldMatrix(!1,!1);let i=e.geometry;if(i!==void 0){let s=i.getAttribute("position");if(t===!0&&s!==void 0&&e.isInstancedMesh!==!0)for(let o=0,a=s.count;o<a;o++)e.isMesh===!0?e.getVertexPosition(o,rr):rr.fromBufferAttribute(s,o),rr.applyMatrix4(e.matrixWorld),this.expandByPoint(rr);else e.boundingBox!==void 0?(e.boundingBox===null&&e.computeBoundingBox(),Yu.copy(e.boundingBox)):(i.boundingBox===null&&i.computeBoundingBox(),Yu.copy(i.boundingBox)),Yu.applyMatrix4(e.matrixWorld),this.union(Yu)}let r=e.children;for(let s=0,o=r.length;s<o;s++)this.expandByObject(r[s],t);return this}containsPoint(e){return e.x>=this.min.x&&e.x<=this.max.x&&e.y>=this.min.y&&e.y<=this.max.y&&e.z>=this.min.z&&e.z<=this.max.z}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return e.max.x>=this.min.x&&e.min.x<=this.max.x&&e.max.y>=this.min.y&&e.min.y<=this.max.y&&e.max.z>=this.min.z&&e.min.z<=this.max.z}intersectsSphere(e){return this.clampPoint(e.center,rr),rr.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let t,i;return e.normal.x>0?(t=e.normal.x*this.min.x,i=e.normal.x*this.max.x):(t=e.normal.x*this.max.x,i=e.normal.x*this.min.x),e.normal.y>0?(t+=e.normal.y*this.min.y,i+=e.normal.y*this.max.y):(t+=e.normal.y*this.max.y,i+=e.normal.y*this.min.y),e.normal.z>0?(t+=e.normal.z*this.min.z,i+=e.normal.z*this.max.z):(t+=e.normal.z*this.max.z,i+=e.normal.z*this.min.z),t<=-e.constant&&i>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(Dl),qu.subVectors(this.max,Dl),la.subVectors(e.a,Dl),ca.subVectors(e.b,Dl),ua.subVectors(e.c,Dl),Es.subVectors(ca,la),As.subVectors(ua,ca),ho.subVectors(la,ua);let t=[0,-Es.z,Es.y,0,-As.z,As.y,0,-ho.z,ho.y,Es.z,0,-Es.x,As.z,0,-As.x,ho.z,0,-ho.x,-Es.y,Es.x,0,-As.y,As.x,0,-ho.y,ho.x,0];return!Qp(t,la,ca,ua,qu)||(t=[1,0,0,0,1,0,0,0,1],!Qp(t,la,ca,ua,qu))?!1:(ju.crossVectors(Es,As),t=[ju.x,ju.y,ju.z],Qp(t,la,ca,ua,qu))}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,rr).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(rr).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()?this:(Xr[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),Xr[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),Xr[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),Xr[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),Xr[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),Xr[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),Xr[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),Xr[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(Xr),this)}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(e){return this.min.fromArray(e.min),this.max.fromArray(e.max),this}},Xr=[new C,new C,new C,new C,new C,new C,new C,new C],rr=new C,Yu=new Mr,la=new C,ca=new C,ua=new C,Es=new C,As=new C,ho=new C,Dl=new C,qu=new C,ju=new C,fo=new C;function Qp(n,e,t,i,r){for(let s=0,o=n.length-3;s<=o;s+=3){fo.fromArray(n,s);let a=r.x*Math.abs(fo.x)+r.y*Math.abs(fo.y)+r.z*Math.abs(fo.z),l=e.dot(fo),c=t.dot(fo),u=i.dot(fo);if(Math.max(-Math.max(l,c,u),Math.min(l,c,u))>a)return!1}return!0}var An=new C,Zu=new it,R1=0,sn=class extends _r{constructor(e,t,i=!1){if(super(),Array.isArray(e))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:R1++}),this.name="",this.array=e,this.itemSize=t,this.count=e!==void 0?e.length/t:0,this.normalized=i,this.usage=km,this.updateRanges=[],this.gpuType=Hi,this.version=0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this}copyAt(e,t,i){e*=this.itemSize,i*=t.itemSize;for(let r=0,s=this.itemSize;r<s;r++)this.array[e+r]=t.array[i+r];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let t=0,i=this.count;t<i;t++)Zu.fromBufferAttribute(this,t),Zu.applyMatrix3(e),this.setXY(t,Zu.x,Zu.y);else if(this.itemSize===3)for(let t=0,i=this.count;t<i;t++)An.fromBufferAttribute(this,t),An.applyMatrix3(e),this.setXYZ(t,An.x,An.y,An.z);return this}applyMatrix4(e){for(let t=0,i=this.count;t<i;t++)An.fromBufferAttribute(this,t),An.applyMatrix4(e),this.setXYZ(t,An.x,An.y,An.z);return this}applyNormalMatrix(e){for(let t=0,i=this.count;t<i;t++)An.fromBufferAttribute(this,t),An.applyNormalMatrix(e),this.setXYZ(t,An.x,An.y,An.z);return this}transformDirection(e){for(let t=0,i=this.count;t<i;t++)An.fromBufferAttribute(this,t),An.transformDirection(e),this.setXYZ(t,An.x,An.y,An.z);return this}set(e,t=0){return this.array.set(e,t),this}getComponent(e,t){let i=this.array[e*this.itemSize+t];return this.normalized&&(i=vr(i,this.array)),i}setComponent(e,t,i){return this.normalized&&(i=qt(i,this.array)),this.array[e*this.itemSize+t]=i,this}getX(e){let t=this.array[e*this.itemSize];return this.normalized&&(t=vr(t,this.array)),t}setX(e,t){return this.normalized&&(t=qt(t,this.array)),this.array[e*this.itemSize]=t,this}getY(e){let t=this.array[e*this.itemSize+1];return this.normalized&&(t=vr(t,this.array)),t}setY(e,t){return this.normalized&&(t=qt(t,this.array)),this.array[e*this.itemSize+1]=t,this}getZ(e){let t=this.array[e*this.itemSize+2];return this.normalized&&(t=vr(t,this.array)),t}setZ(e,t){return this.normalized&&(t=qt(t,this.array)),this.array[e*this.itemSize+2]=t,this}getW(e){let t=this.array[e*this.itemSize+3];return this.normalized&&(t=vr(t,this.array)),t}setW(e,t){return this.normalized&&(t=qt(t,this.array)),this.array[e*this.itemSize+3]=t,this}setXY(e,t,i){return e*=this.itemSize,this.normalized&&(t=qt(t,this.array),i=qt(i,this.array)),this.array[e+0]=t,this.array[e+1]=i,this}setXYZ(e,t,i,r){return e*=this.itemSize,this.normalized&&(t=qt(t,this.array),i=qt(i,this.array),r=qt(r,this.array)),this.array[e+0]=t,this.array[e+1]=i,this.array[e+2]=r,this}setXYZW(e,t,i,r,s){return e*=this.itemSize,this.normalized&&(t=qt(t,this.array),i=qt(i,this.array),r=qt(r,this.array),s=qt(s,this.array)),this.array[e+0]=t,this.array[e+1]=i,this.array[e+2]=r,this.array[e+3]=s,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){let e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return e.name=this.name,e.usage=this.usage,e.gpuType=this.gpuType,e}dispose(){this.dispatchEvent({type:"dispose"})}};var Xl=class extends sn{constructor(e,t,i){super(new Uint16Array(e),t,i)}};var $l=class extends sn{constructor(e,t,i){super(new Uint32Array(e),t,i)}};var zt=class extends sn{constructor(e,t,i){super(new Float32Array(e),t,i)}},C1=new Mr,Nl=new C,em=new C,br=class{constructor(e=new C,t=-1){this.isSphere=!0,this.center=e,this.radius=t}set(e,t){return this.center.copy(e),this.radius=t,this}setFromPoints(e,t){let i=this.center;t!==void 0?i.copy(t):C1.setFromPoints(e).getCenter(i);let r=0;for(let s=0,o=e.length;s<o;s++)r=Math.max(r,i.distanceToSquared(e[s]));return this.radius=Math.sqrt(r),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){let t=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=t*t}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,t){let i=this.center.distanceToSquared(e);return t.copy(e),i>this.radius*this.radius&&(t.sub(this.center).normalize(),t.multiplyScalar(this.radius).add(this.center)),t}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius=this.radius*e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;Nl.subVectors(e,this.center);let t=Nl.lengthSq();if(t>this.radius*this.radius){let i=Math.sqrt(t),r=(i-this.radius)*.5;this.center.addScaledVector(Nl,r/i),this.radius+=r}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(em.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(Nl.copy(e.center).add(em)),this.expandByPoint(Nl.copy(e.center).sub(em))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(e){return this.radius=e.radius,this.center.fromArray(e.center),this}},I1=0,Vi=new Et,tm=new mi,ha=new C,Ei=new Mr,Ol=new Mr,Un=new C,xn=class n extends _r{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:I1++}),this.uuid=Rs(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.indirectOffset=0,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={},this._transformed=!1}getIndex(){return this.index}setIndex(e){return Array.isArray(e)?this.index=new(m1(e)?$l:Xl)(e,1):this.index=e,this}setIndirect(e,t=0){return this.indirect=e,this.indirectOffset=t,this}getIndirect(){return this.indirect}getAttribute(e){return this.attributes[e]}setAttribute(e,t){return this.attributes[e]=t,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,t,i=0){this.groups.push({start:e,count:t,materialIndex:i})}clearGroups(){this.groups=[]}setDrawRange(e,t){this.drawRange.start=e,this.drawRange.count=t}applyMatrix4(e){let t=this.attributes.position;t!==void 0&&(t.applyMatrix4(e),t.needsUpdate=!0);let i=this.attributes.normal;if(i!==void 0){let s=new ut().getNormalMatrix(e);i.applyNormalMatrix(s),i.needsUpdate=!0}let r=this.attributes.tangent;return r!==void 0&&(r.transformDirection(e),r.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this._transformed=!0,this}applyQuaternion(e){return Vi.makeRotationFromQuaternion(e),this.applyMatrix4(Vi),this}rotateX(e){return Vi.makeRotationX(e),this.applyMatrix4(Vi),this}rotateY(e){return Vi.makeRotationY(e),this.applyMatrix4(Vi),this}rotateZ(e){return Vi.makeRotationZ(e),this.applyMatrix4(Vi),this}translate(e,t,i){return Vi.makeTranslation(e,t,i),this.applyMatrix4(Vi),this}scale(e,t,i){return Vi.makeScale(e,t,i),this.applyMatrix4(Vi),this}lookAt(e){return tm.lookAt(e),tm.updateMatrix(),this.applyMatrix4(tm.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(ha).negate(),this.translate(ha.x,ha.y,ha.z),this}setFromPoints(e){let t=this.getAttribute("position");if(t===void 0){let i=[];for(let r=0,s=e.length;r<s;r++){let o=e[r];i.push(o.x,o.y,o.z||0)}this.setAttribute("position",new zt(i,3))}else{let i=Math.min(e.length,t.count);for(let r=0;r<i;r++){let s=e[r];t.setXYZ(r,s.x,s.y,s.z||0)}e.length>t.count&&Qe("BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),t.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new Mr);let e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){nt("BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new C(-1/0,-1/0,-1/0),new C(1/0,1/0,1/0));return}if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),t)for(let i=0,r=t.length;i<r;i++){let s=t[i];Ei.setFromBufferAttribute(s),this.morphTargetsRelative?(Un.addVectors(this.boundingBox.min,Ei.min),this.boundingBox.expandByPoint(Un),Un.addVectors(this.boundingBox.max,Ei.max),this.boundingBox.expandByPoint(Un)):(this.boundingBox.expandByPoint(Ei.min),this.boundingBox.expandByPoint(Ei.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&nt('BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new br);let e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){nt("BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new C,1/0);return}if(e){let i=this.boundingSphere.center;if(Ei.setFromBufferAttribute(e),t)for(let s=0,o=t.length;s<o;s++){let a=t[s];Ol.setFromBufferAttribute(a),this.morphTargetsRelative?(Un.addVectors(Ei.min,Ol.min),Ei.expandByPoint(Un),Un.addVectors(Ei.max,Ol.max),Ei.expandByPoint(Un)):(Ei.expandByPoint(Ol.min),Ei.expandByPoint(Ol.max))}Ei.getCenter(i);let r=0;for(let s=0,o=e.count;s<o;s++)Un.fromBufferAttribute(e,s),r=Math.max(r,i.distanceToSquared(Un));if(t)for(let s=0,o=t.length;s<o;s++){let a=t[s],l=this.morphTargetsRelative;for(let c=0,u=a.count;c<u;c++)Un.fromBufferAttribute(a,c),l&&(ha.fromBufferAttribute(e,c),Un.add(ha)),r=Math.max(r,i.distanceToSquared(Un))}this.boundingSphere.radius=Math.sqrt(r),isNaN(this.boundingSphere.radius)&&nt('BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){let e=this.index,t=this.attributes;if(e===null||t.position===void 0||t.normal===void 0||t.uv===void 0){nt("BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}let i=t.position,r=t.normal,s=t.uv,o=this.getAttribute("tangent");(o===void 0||o.count!==i.count)&&(o=new sn(new Float32Array(4*i.count),4),this.setAttribute("tangent",o));let a=[],l=[];for(let x=0;x<i.count;x++)a[x]=new C,l[x]=new C;let c=new C,u=new C,d=new C,h=new it,f=new it,g=new it,y=new C,m=new C;function p(x,w,I){c.fromBufferAttribute(i,x),u.fromBufferAttribute(i,w),d.fromBufferAttribute(i,I),h.fromBufferAttribute(s,x),f.fromBufferAttribute(s,w),g.fromBufferAttribute(s,I),u.sub(c),d.sub(c),f.sub(h),g.sub(h);let D=1/(f.x*g.y-g.x*f.y);isFinite(D)&&(y.copy(u).multiplyScalar(g.y).addScaledVector(d,-f.y).multiplyScalar(D),m.copy(d).multiplyScalar(f.x).addScaledVector(u,-g.x).multiplyScalar(D),a[x].add(y),a[w].add(y),a[I].add(y),l[x].add(m),l[w].add(m),l[I].add(m))}let b=this.groups;b.length===0&&(b=[{start:0,count:e.count}]);for(let x=0,w=b.length;x<w;++x){let I=b[x],D=I.start,F=I.count;for(let z=D,N=D+F;z<N;z+=3)p(e.getX(z+0),e.getX(z+1),e.getX(z+2))}let S=new C,_=new C,A=new C,T=new C;function R(x){A.fromBufferAttribute(r,x),T.copy(A);let w=a[x];S.copy(w),S.sub(A.multiplyScalar(A.dot(w))).normalize(),_.crossVectors(T,w);let D=_.dot(l[x])<0?-1:1;o.setXYZW(x,S.x,S.y,S.z,D)}for(let x=0,w=b.length;x<w;++x){let I=b[x],D=I.start,F=I.count;for(let z=D,N=D+F;z<N;z+=3)R(e.getX(z+0)),R(e.getX(z+1)),R(e.getX(z+2))}this._transformed=!0}computeVertexNormals(){let e=this.index,t=this.getAttribute("position");if(t!==void 0){let i=this.getAttribute("normal");if(i===void 0||i.count!==t.count)i=new sn(new Float32Array(t.count*3),3),this.setAttribute("normal",i);else for(let h=0,f=i.count;h<f;h++)i.setXYZ(h,0,0,0);let r=new C,s=new C,o=new C,a=new C,l=new C,c=new C,u=new C,d=new C;if(e)for(let h=0,f=e.count;h<f;h+=3){let g=e.getX(h+0),y=e.getX(h+1),m=e.getX(h+2);r.fromBufferAttribute(t,g),s.fromBufferAttribute(t,y),o.fromBufferAttribute(t,m),u.subVectors(o,s),d.subVectors(r,s),u.cross(d),a.fromBufferAttribute(i,g),l.fromBufferAttribute(i,y),c.fromBufferAttribute(i,m),a.add(u),l.add(u),c.add(u),i.setXYZ(g,a.x,a.y,a.z),i.setXYZ(y,l.x,l.y,l.z),i.setXYZ(m,c.x,c.y,c.z)}else for(let h=0,f=t.count;h<f;h+=3)r.fromBufferAttribute(t,h+0),s.fromBufferAttribute(t,h+1),o.fromBufferAttribute(t,h+2),u.subVectors(o,s),d.subVectors(r,s),u.cross(d),i.setXYZ(h+0,u.x,u.y,u.z),i.setXYZ(h+1,u.x,u.y,u.z),i.setXYZ(h+2,u.x,u.y,u.z);this.normalizeNormals(),i.needsUpdate=!0}}normalizeNormals(){let e=this.attributes.normal;for(let t=0,i=e.count;t<i;t++)Un.fromBufferAttribute(e,t),Un.normalize(),e.setXYZ(t,Un.x,Un.y,Un.z)}toNonIndexed(){function e(a,l){let c=a.array,u=a.itemSize,d=a.normalized,h=new c.constructor(l.length*u),f=0,g=0;for(let y=0,m=l.length;y<m;y++){a.isInterleavedBufferAttribute?f=l[y]*a.data.stride+a.offset:f=l[y]*u;for(let p=0;p<u;p++)h[g++]=c[f++]}return new sn(h,u,d)}if(this.index===null)return Qe("BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;let t=new n,i=this.index.array,r=this.attributes;for(let a in r){let l=r[a],c=e(l,i);t.setAttribute(a,c)}let s=this.morphAttributes;for(let a in s){let l=[],c=s[a];for(let u=0,d=c.length;u<d;u++){let h=c[u],f=e(h,i);l.push(f)}t.morphAttributes[a]=l}t.morphTargetsRelative=this.morphTargetsRelative;let o=this.groups;for(let a=0,l=o.length;a<l;a++){let c=o[a];t.addGroup(c.start,c.count,c.materialIndex)}return t}toJSON(){let e={metadata:{version:4.7,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(e.uuid=this.uuid,e.type=this.parameters!==void 0&&this._transformed===!0?"BufferGeometry":this.type,e.name=this.name,Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0&&this._transformed!==!0){let l=this.parameters;for(let c in l)l[c]!==void 0&&(e[c]=l[c]);return e}e.data={attributes:{}};let t=this.index;t!==null&&(e.data.index={type:t.array.constructor.name,array:Array.prototype.slice.call(t.array)});let i=this.attributes;for(let l in i){let c=i[l];e.data.attributes[l]=c.toJSON(e.data)}let r={},s=!1;for(let l in this.morphAttributes){let c=this.morphAttributes[l],u=[];for(let d=0,h=c.length;d<h;d++){let f=c[d];u.push(f.toJSON(e.data))}u.length>0&&(r[l]=u,s=!0)}s&&(e.data.morphAttributes=r,e.data.morphTargetsRelative=this.morphTargetsRelative);let o=this.groups;o.length>0&&(e.data.groups=JSON.parse(JSON.stringify(o)));let a=this.boundingSphere;return a!==null&&(e.data.boundingSphere=a.toJSON()),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;let t={};this.name=e.name;let i=e.index;i!==null&&this.setIndex(i.clone());let r=e.attributes;for(let c in r){let u=r[c];this.setAttribute(c,u.clone(t))}let s=e.morphAttributes;for(let c in s){let u=[],d=s[c];for(let h=0,f=d.length;h<f;h++)u.push(d[h].clone(t));this.morphAttributes[c]=u}this.morphTargetsRelative=e.morphTargetsRelative;let o=e.groups;for(let c=0,u=o.length;c<u;c++){let d=o[c];this.addGroup(d.start,d.count,d.materialIndex)}let a=e.boundingBox;a!==null&&(this.boundingBox=a.clone());let l=e.boundingSphere;return l!==null&&(this.boundingSphere=l.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this._transformed=e._transformed,this}dispose(){this.dispatchEvent({type:"dispose"})}},Nh=class{constructor(e,t){this.isInterleavedBuffer=!0,this.array=e,this.stride=t,this.count=e!==void 0?e.length/t:0,this.usage=km,this.updateRanges=[],this.version=0,this.uuid=Rs()}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.array=new e.array.constructor(e.array),this.count=e.count,this.stride=e.stride,this.usage=e.usage,this}copyAt(e,t,i){e*=this.stride,i*=t.stride;for(let r=0,s=this.stride;r<s;r++)this.array[e+r]=t.array[i+r];return this}set(e,t=0){return this.array.set(e,t),this}clone(e){e.arrayBuffers===void 0&&(e.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=Rs()),e.arrayBuffers[this.array.buffer._uuid]===void 0&&(e.arrayBuffers[this.array.buffer._uuid]=this.array.slice(0).buffer);let t=new this.array.constructor(e.arrayBuffers[this.array.buffer._uuid]),i=new this.constructor(t,this.stride);return i.setUsage(this.usage),i}onUpload(e){return this.onUploadCallback=e,this}toJSON(e){e.arrayBuffers===void 0&&(e.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=Rs()),e.arrayBuffers[this.array.buffer._uuid]===void 0&&(e.arrayBuffers[this.array.buffer._uuid]=Array.from(new Uint32Array(this.array.buffer)));let t={uuid:this.uuid,buffer:this.array.buffer._uuid,type:this.array.constructor.name,stride:this.stride};return t.usage=this.usage,t}},si=new C,ba=class n{constructor(e,t,i,r=!1){this.isInterleavedBufferAttribute=!0,this.name="",this.data=e,this.itemSize=t,this.offset=i,this.normalized=r}get count(){return this.data.count}get array(){return this.data.array}set needsUpdate(e){this.data.needsUpdate=e}applyMatrix4(e){for(let t=0,i=this.data.count;t<i;t++)si.fromBufferAttribute(this,t),si.applyMatrix4(e),this.setXYZ(t,si.x,si.y,si.z);return this}applyNormalMatrix(e){for(let t=0,i=this.count;t<i;t++)si.fromBufferAttribute(this,t),si.applyNormalMatrix(e),this.setXYZ(t,si.x,si.y,si.z);return this}transformDirection(e){for(let t=0,i=this.count;t<i;t++)si.fromBufferAttribute(this,t),si.transformDirection(e),this.setXYZ(t,si.x,si.y,si.z);return this}getComponent(e,t){let i=this.array[e*this.data.stride+this.offset+t];return this.normalized&&(i=vr(i,this.array)),i}setComponent(e,t,i){return this.normalized&&(i=qt(i,this.array)),this.data.array[e*this.data.stride+this.offset+t]=i,this}setX(e,t){return this.normalized&&(t=qt(t,this.array)),this.data.array[e*this.data.stride+this.offset]=t,this}setY(e,t){return this.normalized&&(t=qt(t,this.array)),this.data.array[e*this.data.stride+this.offset+1]=t,this}setZ(e,t){return this.normalized&&(t=qt(t,this.array)),this.data.array[e*this.data.stride+this.offset+2]=t,this}setW(e,t){return this.normalized&&(t=qt(t,this.array)),this.data.array[e*this.data.stride+this.offset+3]=t,this}getX(e){let t=this.data.array[e*this.data.stride+this.offset];return this.normalized&&(t=vr(t,this.array)),t}getY(e){let t=this.data.array[e*this.data.stride+this.offset+1];return this.normalized&&(t=vr(t,this.array)),t}getZ(e){let t=this.data.array[e*this.data.stride+this.offset+2];return this.normalized&&(t=vr(t,this.array)),t}getW(e){let t=this.data.array[e*this.data.stride+this.offset+3];return this.normalized&&(t=vr(t,this.array)),t}setXY(e,t,i){return e=e*this.data.stride+this.offset,this.normalized&&(t=qt(t,this.array),i=qt(i,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=i,this}setXYZ(e,t,i,r){return e=e*this.data.stride+this.offset,this.normalized&&(t=qt(t,this.array),i=qt(i,this.array),r=qt(r,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=i,this.data.array[e+2]=r,this}setXYZW(e,t,i,r,s){return e=e*this.data.stride+this.offset,this.normalized&&(t=qt(t,this.array),i=qt(i,this.array),r=qt(r,this.array),s=qt(s,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=i,this.data.array[e+2]=r,this.data.array[e+3]=s,this}clone(e){if(e===void 0){Hl("InterleavedBufferAttribute.clone(): Cloning an interleaved buffer attribute will de-interleave buffer data.");let t=[];for(let i=0;i<this.count;i++){let r=i*this.data.stride+this.offset;for(let s=0;s<this.itemSize;s++)t.push(this.data.array[r+s])}return new sn(new this.array.constructor(t),this.itemSize,this.normalized)}else return e.interleavedBuffers===void 0&&(e.interleavedBuffers={}),e.interleavedBuffers[this.data.uuid]===void 0&&(e.interleavedBuffers[this.data.uuid]=this.data.clone(e)),new n(e.interleavedBuffers[this.data.uuid],this.itemSize,this.offset,this.normalized)}toJSON(e){if(e===void 0){Hl("InterleavedBufferAttribute.toJSON(): Serializing an interleaved buffer attribute will de-interleave buffer data.");let t=[];for(let i=0;i<this.count;i++){let r=i*this.data.stride+this.offset;for(let s=0;s<this.itemSize;s++)t.push(this.data.array[r+s])}return{itemSize:this.itemSize,type:this.array.constructor.name,array:t,normalized:this.normalized}}else return e.interleavedBuffers===void 0&&(e.interleavedBuffers={}),e.interleavedBuffers[this.data.uuid]===void 0&&(e.interleavedBuffers[this.data.uuid]=this.data.toJSON(e)),{isInterleavedBufferAttribute:!0,itemSize:this.itemSize,data:this.data.uuid,offset:this.offset,normalized:this.normalized}}},nm=new C,P1=new C,L1=new ut,sr=class{constructor(e=new C(1,0,0),t=0){this.isPlane=!0,this.normal=e,this.constant=t}set(e,t){return this.normal.copy(e),this.constant=t,this}setComponents(e,t,i,r){return this.normal.set(e,t,i),this.constant=r,this}setFromNormalAndCoplanarPoint(e,t){return this.normal.copy(e),this.constant=-t.dot(this.normal),this}setFromCoplanarPoints(e,t,i){let r=nm.subVectors(i,t).cross(P1.subVectors(e,t)).normalize();return this.setFromNormalAndCoplanarPoint(r,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){let e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,t){return t.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,t,i=!0){let r=e.delta(nm),s=this.normal.dot(r);if(s===0)return this.distanceToPoint(e.start)===0?t.copy(e.start):null;let o=-(e.start.dot(this.normal)+this.constant)/s;return i===!0&&(o<0||o>1)?null:t.copy(e.start).addScaledVector(r,o)}intersectsLine(e){let t=this.distanceToPoint(e.start),i=this.distanceToPoint(e.end);return t<0&&i>0||i<0&&t>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,t){let i=t||L1.getNormalMatrix(e),r=this.coplanarPoint(nm).applyMatrix4(e),s=this.normal.applyMatrix3(i).normalize();return this.constant=-r.dot(s),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}toJSON(){return{normal:this.normal.toArray(),constant:this.constant}}fromJSON(e){return this.normal.fromArray(e.normal),this.constant=e.constant,this}},D1=0,Zr=class extends _r{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:D1++}),this.uuid=Rs(),this.name="",this.type="Material",this.blending=ar,this.side=Sr,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=bm,this.blendDst=Aa,this.blendEquation=ts,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new St(0,0,0),this.blendAlpha=0,this.depthFunc=xa,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=Jv,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=vh,this.stencilZFail=vh,this.stencilZPass=vh,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(let t in e){let i=e[t];if(i===void 0){Qe(`Material: parameter '${t}' has value of undefined.`);continue}let r=this[t];if(r===void 0){Qe(`Material: '${t}' is not a property of THREE.${this.type}.`);continue}r&&r.isColor?r.set(i):r&&r.isVector2&&i&&i.isVector2||r&&r.isEuler&&i&&i.isEuler||r&&r.isVector3&&i&&i.isVector3?r.copy(i):this[t]=i}}toJSON(e){let t=e===void 0||typeof e=="string";t&&(e={textures:{},images:{}});let i={metadata:{version:4.7,type:"Material",generator:"Material.toJSON"}};i.uuid=this.uuid,i.type=this.type,i.blending=this.blending,i.side=this.side,i.shadowSide=this.shadowSide,i.vertexColors=this.vertexColors,i.opacity=this.opacity,i.transparent=this.transparent,i.blendSrc=this.blendSrc,i.blendDst=this.blendDst,i.blendEquation=this.blendEquation,i.blendSrcAlpha=this.blendSrcAlpha,i.blendDstAlpha=this.blendDstAlpha,i.blendEquationAlpha=this.blendEquationAlpha,i.blendColor=this.blendColor.getHex(),i.blendAlpha=this.blendAlpha,i.depthFunc=this.depthFunc,i.depthTest=this.depthTest,i.depthWrite=this.depthWrite,i.colorWrite=this.colorWrite,i.clipIntersection=this.clipIntersection,i.clipShadows=this.clipShadows,i.stencilWriteMask=this.stencilWriteMask,i.stencilFunc=this.stencilFunc,i.stencilRef=this.stencilRef,i.stencilFuncMask=this.stencilFuncMask,i.stencilFail=this.stencilFail,i.stencilZFail=this.stencilZFail,i.stencilZPass=this.stencilZPass,i.stencilWrite=this.stencilWrite,i.polygonOffset=this.polygonOffset,i.polygonOffsetFactor=this.polygonOffsetFactor,i.polygonOffsetUnits=this.polygonOffsetUnits,i.dithering=this.dithering,i.alphaTest=this.alphaTest,i.alphaHash=this.alphaHash,i.alphaToCoverage=this.alphaToCoverage,i.premultipliedAlpha=this.premultipliedAlpha,i.forceSinglePass=this.forceSinglePass,i.allowOverride=this.allowOverride,i.visible=this.visible,i.toneMapped=this.toneMapped,i.name=this.name,this.color&&this.color.isColor&&(i.color=this.color.getHex()),this.roughness!==void 0&&(i.roughness=this.roughness),this.metalness!==void 0&&(i.metalness=this.metalness),this.sheen!==void 0&&(i.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(i.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(i.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(i.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&(i.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(i.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(i.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(i.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(i.shininess=this.shininess),this.clearcoat!==void 0&&(i.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(i.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(i.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(i.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(i.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,i.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.sheenColorMap&&this.sheenColorMap.isTexture&&(i.sheenColorMap=this.sheenColorMap.toJSON(e).uuid),this.sheenRoughnessMap&&this.sheenRoughnessMap.isTexture&&(i.sheenRoughnessMap=this.sheenRoughnessMap.toJSON(e).uuid),this.dispersion!==void 0&&(i.dispersion=this.dispersion),this.retroreflectivity!==void 0&&(i.retroreflectivity=this.retroreflectivity),this.iridescence!==void 0&&(i.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(i.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(i.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(i.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(i.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(i.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(i.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(i.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(i.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(i.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(i.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(i.lightMap=this.lightMap.toJSON(e).uuid,i.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(i.aoMap=this.aoMap.toJSON(e).uuid,i.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(i.bumpMap=this.bumpMap.toJSON(e).uuid,i.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(i.normalMap=this.normalMap.toJSON(e).uuid,i.normalMapType=this.normalMapType,i.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(i.displacementMap=this.displacementMap.toJSON(e).uuid,i.displacementScale=this.displacementScale,i.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(i.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(i.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(i.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(i.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(i.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(i.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(i.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(i.combine=this.combine)),this.envMapRotation!==void 0&&(i.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(i.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(i.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(i.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(i.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(i.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(i.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(i.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(i.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&(i.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(i.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(i.size=this.size),this.sizeAttenuation!==void 0&&(i.sizeAttenuation=this.sizeAttenuation),Array.isArray(this.clippingPlanes)&&this.clippingPlanes.length>0&&(i.clippingPlanes=this.clippingPlanes.map(s=>s.toJSON())),this.rotation!==void 0&&(i.rotation=this.rotation),this.depthPacking!==void 0&&(i.depthPacking=this.depthPacking),this.linewidth!==void 0&&(i.linewidth=this.linewidth),this.linecap!==void 0&&(i.linecap=this.linecap),this.linejoin!==void 0&&(i.linejoin=this.linejoin),this.dashSize!==void 0&&(i.dashSize=this.dashSize),this.gapSize!==void 0&&(i.gapSize=this.gapSize),this.scale!==void 0&&(i.scale=this.scale),this.wireframe!==void 0&&(i.wireframe=this.wireframe),this.wireframeLinewidth!==void 0&&(i.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!==void 0&&(i.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!==void 0&&(i.wireframeLinejoin=this.wireframeLinejoin),this.flatShading!==void 0&&(i.flatShading=this.flatShading),this.fog!==void 0&&(i.fog=this.fog),Object.keys(this.userData).length>0&&(i.userData=this.userData);function r(s){let o=[];for(let a in s){let l=s[a];delete l.metadata,o.push(l)}return o}if(t){let s=r(e.textures),o=r(e.images);s.length>0&&(i.textures=s),o.length>0&&(i.images=o)}return i}fromJSON(e,t){if(e.uuid!==void 0&&(this.uuid=e.uuid),e.name!==void 0&&(this.name=e.name),e.color!==void 0&&this.color!==void 0&&this.color.setHex(e.color),e.roughness!==void 0&&(this.roughness=e.roughness),e.metalness!==void 0&&(this.metalness=e.metalness),e.sheen!==void 0&&(this.sheen=e.sheen),e.sheenColor!==void 0&&(this.sheenColor=new St().setHex(e.sheenColor)),e.sheenRoughness!==void 0&&(this.sheenRoughness=e.sheenRoughness),e.emissive!==void 0&&this.emissive!==void 0&&this.emissive.setHex(e.emissive),e.specular!==void 0&&this.specular!==void 0&&this.specular.setHex(e.specular),e.specularIntensity!==void 0&&(this.specularIntensity=e.specularIntensity),e.specularColor!==void 0&&this.specularColor!==void 0&&this.specularColor.setHex(e.specularColor),e.shininess!==void 0&&(this.shininess=e.shininess),e.clearcoat!==void 0&&(this.clearcoat=e.clearcoat),e.clearcoatRoughness!==void 0&&(this.clearcoatRoughness=e.clearcoatRoughness),e.dispersion!==void 0&&(this.dispersion=e.dispersion),e.retroreflectivity!==void 0&&(this.retroreflectivity=e.retroreflectivity),e.iridescence!==void 0&&(this.iridescence=e.iridescence),e.iridescenceIOR!==void 0&&(this.iridescenceIOR=e.iridescenceIOR),e.iridescenceThicknessRange!==void 0&&(this.iridescenceThicknessRange=e.iridescenceThicknessRange),e.transmission!==void 0&&(this.transmission=e.transmission),e.thickness!==void 0&&(this.thickness=e.thickness),e.attenuationDistance!==void 0&&(this.attenuationDistance=e.attenuationDistance),e.attenuationColor!==void 0&&this.attenuationColor!==void 0&&this.attenuationColor.setHex(e.attenuationColor),e.anisotropy!==void 0&&(this.anisotropy=e.anisotropy),e.anisotropyRotation!==void 0&&(this.anisotropyRotation=e.anisotropyRotation),e.fog!==void 0&&(this.fog=e.fog),e.flatShading!==void 0&&(this.flatShading=e.flatShading),e.blending!==void 0&&(this.blending=e.blending),e.combine!==void 0&&(this.combine=e.combine),e.side!==void 0&&(this.side=e.side),e.shadowSide!==void 0&&(this.shadowSide=e.shadowSide),e.opacity!==void 0&&(this.opacity=e.opacity),e.transparent!==void 0&&(this.transparent=e.transparent),e.alphaTest!==void 0&&(this.alphaTest=e.alphaTest),e.alphaHash!==void 0&&(this.alphaHash=e.alphaHash),e.depthFunc!==void 0&&(this.depthFunc=e.depthFunc),e.depthTest!==void 0&&(this.depthTest=e.depthTest),e.depthWrite!==void 0&&(this.depthWrite=e.depthWrite),e.colorWrite!==void 0&&(this.colorWrite=e.colorWrite),e.clippingPlanes!==void 0&&(this.clippingPlanes=e.clippingPlanes.map(i=>new sr().fromJSON(i))),e.clipIntersection!==void 0&&(this.clipIntersection=e.clipIntersection),e.clipShadows!==void 0&&(this.clipShadows=e.clipShadows),e.depthPacking!==void 0&&(this.depthPacking=e.depthPacking),e.blendSrc!==void 0&&(this.blendSrc=e.blendSrc),e.blendDst!==void 0&&(this.blendDst=e.blendDst),e.blendEquation!==void 0&&(this.blendEquation=e.blendEquation),e.blendSrcAlpha!==void 0&&(this.blendSrcAlpha=e.blendSrcAlpha),e.blendDstAlpha!==void 0&&(this.blendDstAlpha=e.blendDstAlpha),e.blendEquationAlpha!==void 0&&(this.blendEquationAlpha=e.blendEquationAlpha),e.blendColor!==void 0&&this.blendColor!==void 0&&this.blendColor.setHex(e.blendColor),e.blendAlpha!==void 0&&(this.blendAlpha=e.blendAlpha),e.stencilWriteMask!==void 0&&(this.stencilWriteMask=e.stencilWriteMask),e.stencilFunc!==void 0&&(this.stencilFunc=e.stencilFunc),e.stencilRef!==void 0&&(this.stencilRef=e.stencilRef),e.stencilFuncMask!==void 0&&(this.stencilFuncMask=e.stencilFuncMask),e.stencilFail!==void 0&&(this.stencilFail=e.stencilFail),e.stencilZFail!==void 0&&(this.stencilZFail=e.stencilZFail),e.stencilZPass!==void 0&&(this.stencilZPass=e.stencilZPass),e.stencilWrite!==void 0&&(this.stencilWrite=e.stencilWrite),e.wireframe!==void 0&&(this.wireframe=e.wireframe),e.wireframeLinewidth!==void 0&&(this.wireframeLinewidth=e.wireframeLinewidth),e.wireframeLinecap!==void 0&&(this.wireframeLinecap=e.wireframeLinecap),e.wireframeLinejoin!==void 0&&(this.wireframeLinejoin=e.wireframeLinejoin),e.rotation!==void 0&&(this.rotation=e.rotation),e.linewidth!==void 0&&(this.linewidth=e.linewidth),e.linecap!==void 0&&(this.linecap=e.linecap),e.linejoin!==void 0&&(this.linejoin=e.linejoin),e.dashSize!==void 0&&(this.dashSize=e.dashSize),e.gapSize!==void 0&&(this.gapSize=e.gapSize),e.scale!==void 0&&(this.scale=e.scale),e.polygonOffset!==void 0&&(this.polygonOffset=e.polygonOffset),e.polygonOffsetFactor!==void 0&&(this.polygonOffsetFactor=e.polygonOffsetFactor),e.polygonOffsetUnits!==void 0&&(this.polygonOffsetUnits=e.polygonOffsetUnits),e.dithering!==void 0&&(this.dithering=e.dithering),e.alphaToCoverage!==void 0&&(this.alphaToCoverage=e.alphaToCoverage),e.premultipliedAlpha!==void 0&&(this.premultipliedAlpha=e.premultipliedAlpha),e.forceSinglePass!==void 0&&(this.forceSinglePass=e.forceSinglePass),e.allowOverride!==void 0&&(this.allowOverride=e.allowOverride),e.visible!==void 0&&(this.visible=e.visible),e.toneMapped!==void 0&&(this.toneMapped=e.toneMapped),e.userData!==void 0&&(this.userData=e.userData),e.vertexColors!==void 0&&(typeof e.vertexColors=="number"?this.vertexColors=e.vertexColors>0:this.vertexColors=e.vertexColors),e.size!==void 0&&(this.size=e.size),e.sizeAttenuation!==void 0&&(this.sizeAttenuation=e.sizeAttenuation),e.map!==void 0&&(this.map=t[e.map]||null),e.matcap!==void 0&&(this.matcap=t[e.matcap]||null),e.alphaMap!==void 0&&(this.alphaMap=t[e.alphaMap]||null),e.bumpMap!==void 0&&(this.bumpMap=t[e.bumpMap]||null),e.bumpScale!==void 0&&(this.bumpScale=e.bumpScale),e.normalMap!==void 0&&(this.normalMap=t[e.normalMap]||null),e.normalMapType!==void 0&&(this.normalMapType=e.normalMapType),e.normalScale!==void 0){let i=e.normalScale;Array.isArray(i)===!1&&(i=[i,i]),this.normalScale=new it().fromArray(i)}return e.displacementMap!==void 0&&(this.displacementMap=t[e.displacementMap]||null),e.displacementScale!==void 0&&(this.displacementScale=e.displacementScale),e.displacementBias!==void 0&&(this.displacementBias=e.displacementBias),e.roughnessMap!==void 0&&(this.roughnessMap=t[e.roughnessMap]||null),e.metalnessMap!==void 0&&(this.metalnessMap=t[e.metalnessMap]||null),e.emissiveMap!==void 0&&(this.emissiveMap=t[e.emissiveMap]||null),e.emissiveIntensity!==void 0&&(this.emissiveIntensity=e.emissiveIntensity),e.specularMap!==void 0&&(this.specularMap=t[e.specularMap]||null),e.specularIntensityMap!==void 0&&(this.specularIntensityMap=t[e.specularIntensityMap]||null),e.specularColorMap!==void 0&&(this.specularColorMap=t[e.specularColorMap]||null),e.envMap!==void 0&&(this.envMap=t[e.envMap]||null),e.envMapRotation!==void 0&&this.envMapRotation.fromArray(e.envMapRotation),e.envMapIntensity!==void 0&&(this.envMapIntensity=e.envMapIntensity),e.reflectivity!==void 0&&(this.reflectivity=e.reflectivity),e.refractionRatio!==void 0&&(this.refractionRatio=e.refractionRatio),e.lightMap!==void 0&&(this.lightMap=t[e.lightMap]||null),e.lightMapIntensity!==void 0&&(this.lightMapIntensity=e.lightMapIntensity),e.aoMap!==void 0&&(this.aoMap=t[e.aoMap]||null),e.aoMapIntensity!==void 0&&(this.aoMapIntensity=e.aoMapIntensity),e.gradientMap!==void 0&&(this.gradientMap=t[e.gradientMap]||null),e.clearcoatMap!==void 0&&(this.clearcoatMap=t[e.clearcoatMap]||null),e.clearcoatRoughnessMap!==void 0&&(this.clearcoatRoughnessMap=t[e.clearcoatRoughnessMap]||null),e.clearcoatNormalMap!==void 0&&(this.clearcoatNormalMap=t[e.clearcoatNormalMap]||null),e.clearcoatNormalScale!==void 0&&(this.clearcoatNormalScale=new it().fromArray(e.clearcoatNormalScale)),e.iridescenceMap!==void 0&&(this.iridescenceMap=t[e.iridescenceMap]||null),e.iridescenceThicknessMap!==void 0&&(this.iridescenceThicknessMap=t[e.iridescenceThicknessMap]||null),e.transmissionMap!==void 0&&(this.transmissionMap=t[e.transmissionMap]||null),e.thicknessMap!==void 0&&(this.thicknessMap=t[e.thicknessMap]||null),e.anisotropyMap!==void 0&&(this.anisotropyMap=t[e.anisotropyMap]||null),e.sheenColorMap!==void 0&&(this.sheenColorMap=t[e.sheenColorMap]||null),e.sheenRoughnessMap!==void 0&&(this.sheenRoughnessMap=t[e.sheenRoughnessMap]||null),this}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;let t=e.clippingPlanes,i=null;if(t!==null){let r=t.length;i=new Array(r);for(let s=0;s!==r;++s)i[s]=t[s].clone()}return this.clippingPlanes=i,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.allowOverride=e.allowOverride,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(e){e===!0&&this.version++}};var $r=new C,im=new C,Ku=new C,Ju=new C,Kr=class{constructor(e=new C,t=new C(0,0,-1)){this.origin=e,this.direction=t}set(e,t){return this.origin.copy(e),this.direction.copy(t),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,t){return t.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,$r)),this}closestPointToPoint(e,t){t.subVectors(e,this.origin);let i=t.dot(this.direction);return i<0?t.copy(this.origin):t.copy(this.origin).addScaledVector(this.direction,i)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){let t=$r.subVectors(e,this.origin).dot(this.direction);return t<0?this.origin.distanceToSquared(e):($r.copy(this.origin).addScaledVector(this.direction,t),$r.distanceToSquared(e))}distanceSqToSegment(e,t,i,r){im.copy(e).add(t).multiplyScalar(.5),Ku.copy(t).sub(e).normalize(),Ju.copy(this.origin).sub(im);let s=e.distanceTo(t)*.5,o=-this.direction.dot(Ku),a=Ju.dot(this.direction),l=-Ju.dot(Ku),c=Ju.lengthSq(),u=Math.abs(1-o*o),d,h,f,g;if(u>0)if(d=o*l-a,h=o*a-l,g=s*u,d>=0)if(h>=-g)if(h<=g){let y=1/u;d*=y,h*=y,f=d*(d+o*h+2*a)+h*(o*d+h+2*l)+c}else h=s,d=Math.max(0,-(o*h+a)),f=-d*d+h*(h+2*l)+c;else h=-s,d=Math.max(0,-(o*h+a)),f=-d*d+h*(h+2*l)+c;else h<=-g?(d=Math.max(0,-(-o*s+a)),h=d>0?-s:Math.min(Math.max(-s,-l),s),f=-d*d+h*(h+2*l)+c):h<=g?(d=0,h=Math.min(Math.max(-s,-l),s),f=h*(h+2*l)+c):(d=Math.max(0,-(o*s+a)),h=d>0?s:Math.min(Math.max(-s,-l),s),f=-d*d+h*(h+2*l)+c);else h=o>0?-s:s,d=Math.max(0,-(o*h+a)),f=-d*d+h*(h+2*l)+c;return i&&i.copy(this.origin).addScaledVector(this.direction,d),r&&r.copy(im).addScaledVector(Ku,h),f}intersectSphere(e,t){if(e.radius<0)return null;$r.subVectors(e.center,this.origin);let i=$r.dot(this.direction),r=$r.dot($r)-i*i,s=e.radius*e.radius;if(r>s)return null;let o=Math.sqrt(s-r),a=i-o,l=i+o;return l<0?null:a<0?this.at(l,t):this.at(a,t)}intersectsSphere(e){return e.radius<0?!1:this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){let t=e.normal.dot(this.direction);if(t===0)return e.distanceToPoint(this.origin)===0?0:null;let i=-(this.origin.dot(e.normal)+e.constant)/t;return i>=0?i:null}intersectPlane(e,t){let i=this.distanceToPlane(e);return i===null?null:this.at(i,t)}intersectsPlane(e){let t=e.distanceToPoint(this.origin);return t===0||e.normal.dot(this.direction)*t<0}intersectBox(e,t){let i,r,s,o,a,l,c=1/this.direction.x,u=1/this.direction.y,d=1/this.direction.z,h=this.origin;return c>=0?(i=(e.min.x-h.x)*c,r=(e.max.x-h.x)*c):(i=(e.max.x-h.x)*c,r=(e.min.x-h.x)*c),u>=0?(s=(e.min.y-h.y)*u,o=(e.max.y-h.y)*u):(s=(e.max.y-h.y)*u,o=(e.min.y-h.y)*u),i>o||s>r||((s>i||isNaN(i))&&(i=s),(o<r||isNaN(r))&&(r=o),d>=0?(a=(e.min.z-h.z)*d,l=(e.max.z-h.z)*d):(a=(e.max.z-h.z)*d,l=(e.min.z-h.z)*d),i>l||a>r)||((a>i||i!==i)&&(i=a),(l<r||r!==r)&&(r=l),r<0)?null:this.at(i>=0?i:r,t)}intersectsBox(e){return this.intersectBox(e,$r)!==null}intersectTriangle(e,t,i,r,s){let o=this.origin,a=this.direction,l=a.x,c=a.y,u=a.z,d=e.x-o.x,h=e.y-o.y,f=e.z-o.z,g=t.x-o.x,y=t.y-o.y,m=t.z-o.z,p=i.x-o.x,b=i.y-o.y,S=i.z-o.z,_=Math.abs(l),A=Math.abs(c),T=Math.abs(u),R,x,w,I,D,F,z,N,V,K,$,J;if(_>=A&&_>=T?(w=l,F=d,V=g,J=p,l>=0?(R=c,x=u,I=h,D=f,z=y,N=m,K=b,$=S):(R=u,x=c,I=f,D=h,z=m,N=y,K=S,$=b)):A>=T?(w=c,F=h,V=y,J=b,c>=0?(R=u,x=l,I=f,D=d,z=m,N=g,K=S,$=p):(R=l,x=u,I=d,D=f,z=g,N=m,K=p,$=S)):(w=u,F=f,V=m,J=S,u>=0?(R=l,x=c,I=d,D=h,z=g,N=y,K=p,$=b):(R=c,x=l,I=h,D=d,z=y,N=g,K=b,$=p)),w===0)return null;let j=R/w,Q=x/w,ie=1/w,Ve=I-j*F,Ue=D-Q*F,_t=z-j*V,lt=N-Q*V,ot=K-j*J,Y=$-Q*J,te=ot*lt-Y*_t,be=Ve*Y-Ue*ot,Ke=_t*Ue-lt*Ve;if(r){if(te<0||be<0||Ke<0)return null}else if((te<0||be<0||Ke<0)&&(te>0||be>0||Ke>0))return null;let Ce=te+be+Ke;if(Ce===0)return null;let ge=ie*(te*F+be*V+Ke*J);return(Ce>0?ge<0:ge>0)?null:this.at(ge/Ce,s)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}},Yl=class extends Zr{constructor(e){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new St(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Cs,this.combine=Sm,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}},cv=new Et,po=new Kr,Qu=new br,uv=new C,eh=new C,th=new C,nh=new C,rm=new C,ih=new C,hv=new C,rh=new C,Vt=class extends mi{constructor(e=new xn,t=new Yl){super(),this.isMesh=!0,this.type="Mesh",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){let t=this.geometry.morphAttributes,i=Object.keys(t);if(i.length>0){let r=t[i[0]];if(r!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let s=0,o=r.length;s<o;s++){let a=r[s].name||String(s);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=s}}}}getVertexPosition(e,t){let i=this.geometry,r=i.attributes.position,s=i.morphAttributes.position,o=i.morphTargetsRelative;t.fromBufferAttribute(r,e);let a=this.morphTargetInfluences;if(s&&a){ih.set(0,0,0);for(let l=0,c=s.length;l<c;l++){let u=a[l],d=s[l];u!==0&&(rm.fromBufferAttribute(d,e),o?ih.addScaledVector(rm,u):ih.addScaledVector(rm.sub(t),u))}t.add(ih)}return t}intersectsFrustum(e){return e.intersectsObject(this)}raycast(e,t){let i=this.geometry,r=this.material,s=this.matrixWorld;r!==void 0&&(i.boundingSphere===null&&i.computeBoundingSphere(),Qu.copy(i.boundingSphere),Qu.applyMatrix4(s),po.copy(e.ray).recast(e.near),!(Qu.containsPoint(po.origin)===!1&&(po.intersectSphere(Qu,uv)===null||po.origin.distanceToSquared(uv)>(e.far-e.near)**2))&&(cv.copy(s).invert(),po.copy(e.ray).applyMatrix4(cv),!(i.boundingBox!==null&&po.intersectsBox(i.boundingBox)===!1)&&this._computeIntersections(e,t,po)))}_computeIntersections(e,t,i){let r,s=this.geometry,o=this.material,a=s.index,l=s.attributes.position,c=s.attributes.uv,u=s.attributes.uv1,d=s.attributes.normal,h=s.groups,f=s.drawRange;if(a!==null)if(Array.isArray(o))for(let g=0,y=h.length;g<y;g++){let m=h[g],p=o[m.materialIndex],b=Math.max(m.start,f.start),S=Math.min(a.count,Math.min(m.start+m.count,f.start+f.count));for(let _=b,A=S;_<A;_+=3){let T=a.getX(_),R=a.getX(_+1),x=a.getX(_+2);r=sh(this,p,e,i,c,u,d,T,R,x),r&&(r.faceIndex=Math.floor(_/3),r.face.materialIndex=m.materialIndex,t.push(r))}}else{let g=Math.max(0,f.start),y=Math.min(a.count,f.start+f.count);for(let m=g,p=y;m<p;m+=3){let b=a.getX(m),S=a.getX(m+1),_=a.getX(m+2);r=sh(this,o,e,i,c,u,d,b,S,_),r&&(r.faceIndex=Math.floor(m/3),t.push(r))}}else if(l!==void 0)if(Array.isArray(o))for(let g=0,y=h.length;g<y;g++){let m=h[g],p=o[m.materialIndex],b=Math.max(m.start,f.start),S=Math.min(l.count,Math.min(m.start+m.count,f.start+f.count));for(let _=b,A=S;_<A;_+=3){let T=_,R=_+1,x=_+2;r=sh(this,p,e,i,c,u,d,T,R,x),r&&(r.faceIndex=Math.floor(_/3),r.face.materialIndex=m.materialIndex,t.push(r))}}else{let g=Math.max(0,f.start),y=Math.min(l.count,f.start+f.count);for(let m=g,p=y;m<p;m+=3){let b=m,S=m+1,_=m+2;r=sh(this,o,e,i,c,u,d,b,S,_),r&&(r.faceIndex=Math.floor(m/3),t.push(r))}}}};function N1(n,e,t,i,r,s,o,a){let l;if(e.side===li?l=i.intersectTriangle(o,s,r,!0,a):l=i.intersectTriangle(r,s,o,e.side===Sr,a),l===null)return null;rh.copy(a),rh.applyMatrix4(n.matrixWorld);let c=t.ray.origin.distanceTo(rh);return c<t.near||c>t.far?null:{distance:c,point:rh.clone(),object:n}}function sh(n,e,t,i,r,s,o,a,l,c){n.getVertexPosition(a,eh),n.getVertexPosition(l,th),n.getVertexPosition(c,nh);let u=N1(n,e,t,i,eh,th,nh,hv);if(u){let d=new C;Yr.getBarycoord(hv,eh,th,nh,d),r&&(u.uv=Yr.getInterpolatedAttribute(r,a,l,c,d,new it)),s&&(u.uv1=Yr.getInterpolatedAttribute(s,a,l,c,d,new it)),o&&(u.normal=Yr.getInterpolatedAttribute(o,a,l,c,d,new C),u.normal.dot(i.direction)>0&&u.normal.multiplyScalar(-1));let h={a,b:l,c,normal:new C,materialIndex:0};Yr.getNormal(eh,th,nh,h.normal),u.face=h,u.barycoord=d}return u}var ql=class extends oi{constructor(e=null,t=1,i=1,r,s,o,a,l,c=Bn,u=Bn,d,h){super(null,o,a,l,c,u,r,s,d,h),this.isDataTexture=!0,this.image={data:e,width:t,height:i},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}};var ai=class extends sn{constructor(e,t,i,r=1){super(e,t,i),this.isInstancedBufferAttribute=!0,this.meshPerAttribute=r}copy(e){return super.copy(e),this.meshPerAttribute=e.meshPerAttribute,this}toJSON(){let e=super.toJSON();return e.meshPerAttribute=this.meshPerAttribute,e.isInstancedBufferAttribute=!0,e}},da=new Et,dv=new Et,oh=[],fv=new Mr,O1=new Et,Fl=new Vt,Ul=new br,jl=class extends Vt{constructor(e,t,i){super(e,t),this.isInstancedMesh=!0,this.instanceMatrix=new ai(new Float32Array(i*16),16),this.instanceColor=null,this.morphTexture=null,this.count=i,this.boundingBox=null,this.boundingSphere=null;for(let r=0;r<i;r++)this.setMatrixAt(r,O1)}computeBoundingBox(){let e=this.geometry,t=this.count;this.boundingBox===null&&(this.boundingBox=new Mr),e.boundingBox===null&&e.computeBoundingBox(),this.boundingBox.makeEmpty();for(let i=0;i<t;i++)this.getMatrixAt(i,da),fv.copy(e.boundingBox).applyMatrix4(da),this.boundingBox.union(fv)}computeBoundingSphere(){let e=this.geometry,t=this.count;this.boundingSphere===null&&(this.boundingSphere=new br),e.boundingSphere===null&&e.computeBoundingSphere(),this.boundingSphere.makeEmpty();for(let i=0;i<t;i++)this.getMatrixAt(i,da),Ul.copy(e.boundingSphere).applyMatrix4(da),this.boundingSphere.union(Ul)}copy(e,t){return super.copy(e,t),this.instanceMatrix.copy(e.instanceMatrix),e.morphTexture!==null&&(this.morphTexture=e.morphTexture.clone()),e.instanceColor!==null&&(this.instanceColor=e.instanceColor.clone()),this.count=e.count,e.boundingBox!==null&&(this.boundingBox=e.boundingBox.clone()),e.boundingSphere!==null&&(this.boundingSphere=e.boundingSphere.clone()),this}getColorAt(e,t){return this.instanceColor===null?t.setRGB(1,1,1):t.fromArray(this.instanceColor.array,e*3)}getMatrixAt(e,t){return t.fromArray(this.instanceMatrix.array,e*16)}getMorphAt(e,t){let i=t.morphTargetInfluences,r=this.morphTexture.source.data.data,s=i.length+1,o=e*s+1;for(let a=0;a<i.length;a++)i[a]=r[o+a]}raycast(e,t){let i=this.matrixWorld,r=this.count;if(Fl.geometry=this.geometry,Fl.material=this.material,Fl.material!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),Ul.copy(this.boundingSphere),Ul.applyMatrix4(i),e.ray.intersectsSphere(Ul)!==!1))for(let s=0;s<r;s++){this.getMatrixAt(s,da),dv.multiplyMatrices(i,da),Fl.matrixWorld=dv,Fl.raycast(e,oh);for(let o=0,a=oh.length;o<a;o++){let l=oh[o];l.instanceId=s,l.object=this,t.push(l)}oh.length=0}}setColorAt(e,t){return this.instanceColor===null&&(this.instanceColor=new ai(new Float32Array(this.instanceMatrix.count*3).fill(1),3)),t.toArray(this.instanceColor.array,e*3),this}setMatrixAt(e,t){return t.toArray(this.instanceMatrix.array,e*16),this}setMorphAt(e,t){let i=t.morphTargetInfluences,r=i.length+1;this.morphTexture===null&&(this.morphTexture=new ql(new Float32Array(r*this.count),r,this.count,hd,Hi));let s=this.morphTexture.source.data.data,o=0;for(let c=0;c<i.length;c++)o+=i[c];let a=this.geometry.morphTargetsRelative?1:1-o,l=r*e;return s[l]=a,s.set(i,l+1),this}updateMorphTargets(){}dispose(){super.dispose(),this.morphTexture!==null&&(this.morphTexture.dispose(),this.morphTexture=null)}},mo=new br,F1=new it(.5,.5),ah=new C,Zl=class{constructor(e=new sr,t=new sr,i=new sr,r=new sr,s=new sr,o=new sr){this.planes=[e,t,i,r,s,o]}set(e,t,i,r,s,o){let a=this.planes;return a[0].copy(e),a[1].copy(t),a[2].copy(i),a[3].copy(r),a[4].copy(s),a[5].copy(o),this}copy(e){let t=this.planes;for(let i=0;i<6;i++)t[i].copy(e.planes[i]);return this}setFromProjectionMatrix(e,t=or,i=!1){let r=this.planes,s=e.elements,o=s[0],a=s[1],l=s[2],c=s[3],u=s[4],d=s[5],h=s[6],f=s[7],g=s[8],y=s[9],m=s[10],p=s[11],b=s[12],S=s[13],_=s[14],A=s[15];if(r[0].setComponents(c-o,f-u,p-g,A-b).normalize(),r[1].setComponents(c+o,f+u,p+g,A+b).normalize(),r[2].setComponents(c+a,f+d,p+y,A+S).normalize(),r[3].setComponents(c-a,f-d,p-y,A-S).normalize(),i)r[4].setComponents(l,h,m,_).normalize(),r[5].setComponents(c-l,f-h,p-m,A-_).normalize();else if(r[4].setComponents(c-l,f-h,p-m,A-_).normalize(),t===or)r[5].setComponents(c+l,f+h,p+m,A+_).normalize();else if(t===Vl)r[5].setComponents(l,h,m,_).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+t);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),mo.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{let t=e.geometry;t.boundingSphere===null&&t.computeBoundingSphere(),mo.copy(t.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(mo)}intersectsSprite(e){mo.center.set(0,0,0);let t=F1.distanceTo(e.center);return mo.radius=.7071067811865476+t,mo.applyMatrix4(e.matrixWorld),this.intersectsSphere(mo)}intersectsSphere(e){let t=this.planes,i=e.center,r=-e.radius;for(let s=0;s<6;s++)if(t[s].distanceToPoint(i)<r)return!1;return!0}intersectsBox(e){let t=this.planes;for(let i=0;i<6;i++){let r=t[i];if(ah.x=r.normal.x>0?e.max.x:e.min.x,ah.y=r.normal.y>0?e.max.y:e.min.y,ah.z=r.normal.z>0?e.max.z:e.min.z,r.distanceToPoint(ah)<0)return!1}return!0}containsPoint(e){let t=this.planes;for(let i=0;i<6;i++)if(t[i].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}};var Oh=class extends Zr{constructor(e){super(),this.isLineBasicMaterial=!0,this.type="LineBasicMaterial",this.color=new St(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.linewidth=e.linewidth,this.linecap=e.linecap,this.linejoin=e.linejoin,this.fog=e.fog,this}},Fh=new C,Uh=new C,pv=new Et,Bl=new Kr,lh=new br,sm=new C,mv=new C,Bh=class extends mi{constructor(e=new xn,t=new Oh){super(),this.isLine=!0,this.type="Line",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}computeLineDistances(){let e=this.geometry;if(e.index===null){let t=e.attributes.position,i=[0];for(let r=1,s=t.count;r<s;r++)Fh.fromBufferAttribute(t,r-1),Uh.fromBufferAttribute(t,r),i[r]=i[r-1],i[r]+=Fh.distanceTo(Uh);e.setAttribute("lineDistance",new zt(i,1))}else Qe("Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}intersectsFrustum(e){return e.intersectsObject(this)}raycast(e,t){let i=this.geometry,r=this.matrixWorld,s=e.params.Line.threshold,o=i.drawRange;if(i.boundingSphere===null&&i.computeBoundingSphere(),lh.copy(i.boundingSphere),lh.applyMatrix4(r),lh.radius+=s,e.ray.intersectsSphere(lh)===!1)return;pv.copy(r).invert(),Bl.copy(e.ray).applyMatrix4(pv);let a=s/((this.scale.x+this.scale.y+this.scale.z)/3),l=a*a,c=this.isLineSegments?2:1,u=i.index,h=i.attributes.position;if(u!==null){let f=Math.max(0,o.start),g=Math.min(u.count,o.start+o.count);for(let y=f,m=g-1;y<m;y+=c){let p=u.getX(y),b=u.getX(y+1),S=ch(this,e,Bl,l,p,b,y);S&&t.push(S)}if(this.isLineLoop){let y=u.getX(g-1),m=u.getX(f),p=ch(this,e,Bl,l,y,m,g-1);p&&t.push(p)}}else{let f=Math.max(0,o.start),g=Math.min(h.count,o.start+o.count);for(let y=f,m=g-1;y<m;y+=c){let p=ch(this,e,Bl,l,y,y+1,y);p&&t.push(p)}if(this.isLineLoop){let y=ch(this,e,Bl,l,g-1,f,g-1);y&&t.push(y)}}}updateMorphTargets(){let t=this.geometry.morphAttributes,i=Object.keys(t);if(i.length>0){let r=t[i[0]];if(r!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let s=0,o=r.length;s<o;s++){let a=r[s].name||String(s);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=s}}}}};function ch(n,e,t,i,r,s,o){let a=n.geometry.attributes.position;if(Fh.fromBufferAttribute(a,r),Uh.fromBufferAttribute(a,s),t.distanceSqToSegment(Fh,Uh,sm,mv)>i)return;sm.applyMatrix4(n.matrixWorld);let c=e.ray.origin.distanceTo(sm);if(!(c<e.near||c>e.far))return{distance:c,point:mv.clone().applyMatrix4(n.matrixWorld),index:o,face:null,faceIndex:null,barycoord:null,object:n}}var gv=new C,xv=new C,Kl=class extends Bh{constructor(e,t){super(e,t),this.isLineSegments=!0,this.type="LineSegments"}computeLineDistances(){let e=this.geometry;if(e.index===null){let t=e.attributes.position,i=[];for(let r=0,s=t.count;r<s;r+=2)gv.fromBufferAttribute(t,r),xv.fromBufferAttribute(t,r+1),i[r]=r===0?0:i[r-1],i[r+1]=i[r]+gv.distanceTo(xv);e.setAttribute("lineDistance",new zt(i,1))}else Qe("LineSegments.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}};var kh=class extends Zr{constructor(e){super(),this.isPointsMaterial=!0,this.type="PointsMaterial",this.color=new St(16777215),this.map=null,this.alphaMap=null,this.size=1,this.sizeAttenuation=!0,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.alphaMap=e.alphaMap,this.size=e.size,this.sizeAttenuation=e.sizeAttenuation,this.fog=e.fog,this}},vv=new Et,mm=new Kr,uh=new br,hh=new C,Jl=class extends mi{constructor(e=new xn,t=new kh){super(),this.isPoints=!0,this.type="Points",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}intersectsFrustum(e){return e.intersectsObject(this)}raycast(e,t){let i=this.geometry,r=this.matrixWorld,s=e.params.Points.threshold,o=i.drawRange;if(i.boundingSphere===null&&i.computeBoundingSphere(),uh.copy(i.boundingSphere),uh.applyMatrix4(r),uh.radius+=s,e.ray.intersectsSphere(uh)===!1)return;vv.copy(r).invert(),mm.copy(e.ray).applyMatrix4(vv);let a=s/((this.scale.x+this.scale.y+this.scale.z)/3),l=a*a,c=i.index,d=i.attributes.position;if(c!==null){let h=Math.max(0,o.start),f=Math.min(c.count,o.start+o.count);for(let g=h,y=f;g<y;g++){let m=c.getX(g);hh.fromBufferAttribute(d,m),yv(hh,m,l,r,e,t,this)}}else{let h=Math.max(0,o.start),f=Math.min(d.count,o.start+o.count);for(let g=h,y=f;g<y;g++)hh.fromBufferAttribute(d,g),yv(hh,g,l,r,e,t,this)}}updateMorphTargets(){let t=this.geometry.morphAttributes,i=Object.keys(t);if(i.length>0){let r=t[i[0]];if(r!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let s=0,o=r.length;s<o;s++){let a=r[s].name||String(s);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=s}}}}};function yv(n,e,t,i,r,s,o){let a=mm.distanceSqToPoint(n);if(a<t){let l=new C;mm.closestPointToPoint(n,l),l.applyMatrix4(i);let c=r.ray.origin.distanceTo(l);if(c<r.near||c>r.far)return;s.push({distance:c,distanceToRay:Math.sqrt(a),point:l,index:e,face:null,faceIndex:null,barycoord:null,object:o})}}var Ql=class extends oi{constructor(e=[],t=Ns,i,r,s,o,a,l,c,u){super(e,t,i,r,s,o,a,l,c,u),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}},Jr=class extends oi{constructor(e,t,i,r,s,o,a,l,c){super(e,t,i,r,s,o,a,l,c),this.isCanvasTexture=!0,this.needsUpdate=!0}};var Is=class extends oi{constructor(e,t,i=lr,r,s,o,a=Bn,l=Bn,c,u=yr,d=1){if(u!==yr&&u!==Fs)throw new Error("THREE.DepthTexture: format must be either THREE.DepthFormat or THREE.DepthStencilFormat");let h={width:e,height:t,depth:d};super(h,r,s,o,a,l,u,i,c),this.isDepthTexture=!0,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.source=new ya(Object.assign({},e.image)),this.compareFunction=e.compareFunction,this}toJSON(e){let t=super.toJSON(e);return t.compareFunction=this.compareFunction,t}},zh=class extends Is{constructor(e,t=lr,i=Ns,r,s,o=Bn,a=Bn,l,c=yr){let u={width:e,height:e,depth:1},d=[u,u,u,u,u,u];super(e,e,t,i,r,s,o,a,l,c),this.image=d,this.isCubeDepthTexture=!0,this.isCubeTexture=!0}get images(){return this.image}set images(e){this.image=e}},ec=class extends oi{constructor(e=null){super(),this.sourceTexture=e,this.isExternalTexture=!0}copy(e){return super.copy(e),this.sourceTexture=e.sourceTexture,this}},Sa=class n extends xn{constructor(e=1,t=1,i=1,r=1,s=1,o=1){super(),this.type="BoxGeometry",this.parameters={width:e,height:t,depth:i,widthSegments:r,heightSegments:s,depthSegments:o};let a=this;r=Math.floor(r),s=Math.floor(s),o=Math.floor(o);let l=[],c=[],u=[],d=[],h=0,f=0;g("z","y","x",-1,-1,i,t,e,o,s,0),g("z","y","x",1,-1,i,t,-e,o,s,1),g("x","z","y",1,1,e,i,t,r,o,2),g("x","z","y",1,-1,e,i,-t,r,o,3),g("x","y","z",1,-1,e,t,i,r,s,4),g("x","y","z",-1,-1,e,t,-i,r,s,5),this.setIndex(l),this.setAttribute("position",new zt(c,3)),this.setAttribute("normal",new zt(u,3)),this.setAttribute("uv",new zt(d,2));function g(y,m,p,b,S,_,A,T,R,x,w){let I=_/R,D=A/x,F=_/2,z=A/2,N=T/2,V=R+1,K=x+1,$=0,J=0,j=new C;for(let Q=0;Q<K;Q++){let ie=Q*D-z;for(let Ve=0;Ve<V;Ve++){let Ue=Ve*I-F;j[y]=Ue*b,j[m]=ie*S,j[p]=N,c.push(j.x,j.y,j.z),j[y]=0,j[m]=0,j[p]=T>0?1:-1,u.push(j.x,j.y,j.z),d.push(Ve/R),d.push(1-Q/x),$+=1}}for(let Q=0;Q<x;Q++)for(let ie=0;ie<R;ie++){let Ve=h+ie+V*Q,Ue=h+ie+V*(Q+1),_t=h+(ie+1)+V*(Q+1),lt=h+(ie+1)+V*Q;l.push(Ve,Ue,lt),l.push(Ue,_t,lt),J+=6}a.addGroup(f,J,w),f+=J,h+=$}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new n(e.width,e.height,e.depth,e.widthSegments,e.heightSegments,e.depthSegments)}};var tc=class n extends xn{constructor(e=[],t=[],i=1,r=0){super(),this.type="PolyhedronGeometry",this.parameters={vertices:e,indices:t,radius:i,detail:r};let s=[],o=[];a(r),c(i),u(),this.setAttribute("position",new zt(s,3)),this.setAttribute("normal",new zt(s.slice(),3)),this.setAttribute("uv",new zt(o,2)),r===0?this.computeVertexNormals():this.normalizeNormals();function a(b){let S=new C,_=new C,A=new C;for(let T=0;T<t.length;T+=3)f(t[T+0],S),f(t[T+1],_),f(t[T+2],A),l(S,_,A,b)}function l(b,S,_,A){let T=A+1,R=[];for(let x=0;x<=T;x++){R[x]=[];let w=b.clone().lerp(_,x/T),I=S.clone().lerp(_,x/T),D=T-x;for(let F=0;F<=D;F++)F===0&&x===T?R[x][F]=w:R[x][F]=w.clone().lerp(I,F/D)}for(let x=0;x<T;x++)for(let w=0;w<2*(T-x)-1;w++){let I=Math.floor(w/2);w%2===0?(h(R[x][I+1]),h(R[x+1][I]),h(R[x][I])):(h(R[x][I+1]),h(R[x+1][I+1]),h(R[x+1][I]))}}function c(b){let S=new C;for(let _=0;_<s.length;_+=3)S.x=s[_+0],S.y=s[_+1],S.z=s[_+2],S.normalize().multiplyScalar(b),s[_+0]=S.x,s[_+1]=S.y,s[_+2]=S.z}function u(){let b=new C;for(let S=0;S<s.length;S+=3){b.x=s[S+0],b.y=s[S+1],b.z=s[S+2];let _=m(b)/2/Math.PI+.5,A=p(b)/Math.PI+.5;o.push(_,1-A)}g(),d()}function d(){for(let b=0;b<o.length;b+=6){let S=o[b+0],_=o[b+2],A=o[b+4],T=Math.max(S,_,A),R=Math.min(S,_,A);T>.9&&R<.1&&(S<.2&&(o[b+0]+=1),_<.2&&(o[b+2]+=1),A<.2&&(o[b+4]+=1))}}function h(b){s.push(b.x,b.y,b.z)}function f(b,S){let _=b*3;S.x=e[_+0],S.y=e[_+1],S.z=e[_+2]}function g(){let b=new C,S=new C,_=new C,A=new C,T=new it,R=new it,x=new it;for(let w=0,I=0;w<s.length;w+=9,I+=6){b.set(s[w+0],s[w+1],s[w+2]),S.set(s[w+3],s[w+4],s[w+5]),_.set(s[w+6],s[w+7],s[w+8]),T.set(o[I+0],o[I+1]),R.set(o[I+2],o[I+3]),x.set(o[I+4],o[I+5]),A.copy(b).add(S).add(_).divideScalar(3);let D=m(A);y(T,I+0,b,D),y(R,I+2,S,D),y(x,I+4,_,D)}}function y(b,S,_,A){A<0&&b.x===1&&(o[S]=b.x-1),_.x===0&&_.z===0&&(o[S]=A/2/Math.PI+.5)}function m(b){return Math.atan2(b.z,-b.x)}function p(b){return Math.atan2(-b.y,Math.sqrt(b.x*b.x+b.z*b.z))}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new n(e.vertices,e.indices,e.radius,e.detail)}};var dh=new C,fh=new C,om=new C,ph=new Yr,nc=class extends xn{constructor(e=null,t=1){if(super(),this.type="EdgesGeometry",this.parameters={geometry:e,thresholdAngle:t},e!==null){let r=Math.pow(10,4),s=Math.cos(yh*t),o=e.getIndex(),a=e.getAttribute("position"),l=o?o.count:a.count,c=[0,0,0],u=["a","b","c"],d=new Array(3),h={},f=[];for(let g=0;g<l;g+=3){o?(c[0]=o.getX(g),c[1]=o.getX(g+1),c[2]=o.getX(g+2)):(c[0]=g,c[1]=g+1,c[2]=g+2);let{a:y,b:m,c:p}=ph;if(y.fromBufferAttribute(a,c[0]),m.fromBufferAttribute(a,c[1]),p.fromBufferAttribute(a,c[2]),ph.getNormal(om),d[0]=`${Math.round(y.x*r)},${Math.round(y.y*r)},${Math.round(y.z*r)}`,d[1]=`${Math.round(m.x*r)},${Math.round(m.y*r)},${Math.round(m.z*r)}`,d[2]=`${Math.round(p.x*r)},${Math.round(p.y*r)},${Math.round(p.z*r)}`,!(d[0]===d[1]||d[1]===d[2]||d[2]===d[0]))for(let b=0;b<3;b++){let S=(b+1)%3,_=d[b],A=d[S],T=ph[u[b]],R=ph[u[S]],x=`${_}_${A}`,w=`${A}_${_}`;w in h&&h[w]?(om.dot(h[w].normal)<=s&&(f.push(T.x,T.y,T.z),f.push(R.x,R.y,R.z)),h[w]=null):x in h||(h[x]={index0:c[b],index1:c[S],normal:om.clone()})}}for(let g in h)if(h[g]){let{index0:y,index1:m}=h[g];dh.fromBufferAttribute(a,y),fh.fromBufferAttribute(a,m),f.push(dh.x,dh.y,dh.z),f.push(fh.x,fh.y,fh.z)}this.setAttribute("position",new zt(f,3))}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}},Vh=class{constructor(){this.type="Curve",this.arcLengthDivisions=200,this.needsUpdate=!1,this.cacheArcLengths=null}getPoint(){Qe("Curve: .getPoint() not implemented.")}getPointAt(e,t){let i=this.getUtoTmapping(e);return this.getPoint(i,t)}getPoints(e=5){let t=[];for(let i=0;i<=e;i++)t.push(this.getPoint(i/e));return t}getSpacedPoints(e=5){let t=[];for(let i=0;i<=e;i++)t.push(this.getPointAt(i/e));return t}getLength(){let e=this.getLengths();return e[e.length-1]}getLengths(e=this.arcLengthDivisions){if(this.cacheArcLengths&&this.cacheArcLengths.length===e+1&&!this.needsUpdate)return this.cacheArcLengths;this.needsUpdate=!1;let t=[],i,r=this.getPoint(0),s=0;t.push(0);for(let o=1;o<=e;o++)i=this.getPoint(o/e),s+=i.distanceTo(r),t.push(s),r=i;return this.cacheArcLengths=t,t}updateArcLengths(){this.needsUpdate=!0,this.getLengths()}getUtoTmapping(e,t=null){let i=this.getLengths(),r=0,s=i.length,o;t?o=t:o=e*i[s-1];let a=0,l=s-1,c;for(;a<=l;)if(r=Math.floor(a+(l-a)/2),c=i[r]-o,c<0)a=r+1;else if(c>0)l=r-1;else{l=r;break}if(r=l,i[r]===o)return r/(s-1);let u=i[r],h=i[r+1]-u,f=(o-u)/h;return(r+f)/(s-1)}getTangent(e,t){let r=e-1e-4,s=e+1e-4;r<0&&(r=0),s>1&&(s=1);let o=this.getPoint(r),a=this.getPoint(s),l=t||(o.isVector2?new it:new C);return l.copy(a).sub(o).normalize(),l}getTangentAt(e,t){let i=this.getUtoTmapping(e);return this.getTangent(i,t)}computeFrenetFrames(e,t=!1){let i=new C,r=[],s=[],o=[],a=new C,l=new Et;for(let f=0;f<=e;f++){let g=f/e;r[f]=this.getTangentAt(g,new C)}s[0]=new C,o[0]=new C;let c=Number.MAX_VALUE,u=Math.abs(r[0].x),d=Math.abs(r[0].y),h=Math.abs(r[0].z);u<=c&&(c=u,i.set(1,0,0)),d<=c&&(c=d,i.set(0,1,0)),h<=c&&i.set(0,0,1),a.crossVectors(r[0],i).normalize(),s[0].crossVectors(r[0],a),o[0].crossVectors(r[0],s[0]);for(let f=1;f<=e;f++){if(s[f]=s[f-1].clone(),o[f]=o[f-1].clone(),a.crossVectors(r[f-1],r[f]),a.length()>Number.EPSILON){a.normalize();let g=Math.acos(bt(r[f-1].dot(r[f]),-1,1));s[f].applyMatrix4(l.makeRotationAxis(a,g))}o[f].crossVectors(r[f],s[f])}if(t===!0){let f=Math.acos(bt(s[0].dot(s[e]),-1,1));f/=e,r[0].dot(a.crossVectors(s[0],s[e]))>0&&(f=-f);for(let g=1;g<=e;g++)s[g].applyMatrix4(l.makeRotationAxis(r[g],f*g)),o[g].crossVectors(r[g],s[g])}return{tangents:r,normals:s,binormals:o}}clone(){return new this.constructor().copy(this)}copy(e){return this.arcLengthDivisions=e.arcLengthDivisions,this}toJSON(){let e={metadata:{version:4.7,type:"Curve",generator:"Curve.toJSON"}};return e.arcLengthDivisions=this.arcLengthDivisions,e.type=this.type,e}fromJSON(e){return this.arcLengthDivisions=e.arcLengthDivisions,this}};function Vm(){let n=0,e=0,t=0,i=0;function r(s,o,a,l){n=s,e=a,t=-3*s+3*o-2*a-l,i=2*s-2*o+a+l}return{initCatmullRom:function(s,o,a,l,c){r(o,a,c*(a-s),c*(l-o))},initNonuniformCatmullRom:function(s,o,a,l,c,u,d){let h=(o-s)/c-(a-s)/(c+u)+(a-o)/u,f=(a-o)/u-(l-o)/(u+d)+(l-a)/d;h*=u,f*=u,r(o,a,h,f)},calc:function(s){let o=s*s,a=o*s;return n+e*s+t*o+i*a}}}var _v=new C,Mv=new C,am=new Vm,lm=new Vm,cm=new Vm,ic=class extends Vh{constructor(e=[],t=!1,i="centripetal",r=.5){super(),this.isCatmullRomCurve3=!0,this.type="CatmullRomCurve3",this.points=e,this.closed=t,this.curveType=i,this.tension=r}getPoint(e,t=new C){let i=t,r=this.points,s=r.length,o=(s-(this.closed?0:1))*e,a=Math.floor(o),l=o-a;this.closed?a+=a>0?0:(Math.floor(Math.abs(a)/s)+1)*s:l===0&&a===s-1&&(a=s-2,l=1);let c,u;this.closed||a>0?c=r[(a-1)%s]:(Mv.subVectors(r[0],r[1]).add(r[0]),c=Mv);let d=r[a%s],h=r[(a+1)%s];if(this.closed||a+2<s?u=r[(a+2)%s]:(_v.subVectors(r[s-1],r[s-2]).add(r[s-1]),u=_v),this.curveType==="centripetal"||this.curveType==="chordal"){let f=this.curveType==="chordal"?.5:.25,g=Math.pow(c.distanceToSquared(d),f),y=Math.pow(d.distanceToSquared(h),f),m=Math.pow(h.distanceToSquared(u),f);y<1e-4&&(y=1),g<1e-4&&(g=y),m<1e-4&&(m=y),am.initNonuniformCatmullRom(c.x,d.x,h.x,u.x,g,y,m),lm.initNonuniformCatmullRom(c.y,d.y,h.y,u.y,g,y,m),cm.initNonuniformCatmullRom(c.z,d.z,h.z,u.z,g,y,m)}else this.curveType==="catmullrom"&&(am.initCatmullRom(c.x,d.x,h.x,u.x,this.tension),lm.initCatmullRom(c.y,d.y,h.y,u.y,this.tension),cm.initCatmullRom(c.z,d.z,h.z,u.z,this.tension));return i.set(am.calc(l),lm.calc(l),cm.calc(l)),i}copy(e){super.copy(e),this.points=[];for(let t=0,i=e.points.length;t<i;t++){let r=e.points[t];this.points.push(r.clone())}return this.closed=e.closed,this.curveType=e.curveType,this.tension=e.tension,this}toJSON(){let e=super.toJSON();e.points=[];for(let t=0,i=this.points.length;t<i;t++){let r=this.points[t];e.points.push(r.toArray())}return e.closed=this.closed,e.curveType=this.curveType,e.tension=this.tension,e}fromJSON(e){super.fromJSON(e),this.points=[];for(let t=0,i=e.points.length;t<i;t++){let r=e.points[t];this.points.push(new C().fromArray(r))}return this.closed=e.closed,this.curveType=e.curveType,this.tension=e.tension,this}};var vo=class n extends tc{constructor(e=1,t=0){let i=(1+Math.sqrt(5))/2,r=[-1,i,0,1,i,0,-1,-i,0,1,-i,0,0,-1,i,0,1,i,0,-1,-i,0,1,-i,i,0,-1,i,0,1,-i,0,-1,-i,0,1],s=[0,11,5,0,5,1,0,1,7,0,7,10,0,10,11,1,5,9,5,11,4,11,10,2,10,7,6,7,1,8,3,9,4,3,4,2,3,2,6,3,6,8,3,8,9,4,9,5,2,4,11,6,2,10,8,6,7,9,8,1];super(r,s,e,t),this.type="IcosahedronGeometry",this.parameters={radius:e,detail:t}}static fromJSON(e){return new n(e.radius,e.detail)}};var rc=class n extends tc{constructor(e=1,t=0){let i=[1,0,0,-1,0,0,0,1,0,0,-1,0,0,0,1,0,0,-1],r=[0,2,4,0,4,3,0,3,5,0,5,2,1,2,5,1,5,3,1,3,4,1,4,2];super(i,r,e,t),this.type="OctahedronGeometry",this.parameters={radius:e,detail:t}}static fromJSON(e){return new n(e.radius,e.detail)}},Qr=class n extends xn{constructor(e=1,t=1,i=1,r=1){super(),this.type="PlaneGeometry",this.parameters={width:e,height:t,widthSegments:i,heightSegments:r};let s=e/2,o=t/2,a=Math.floor(i),l=Math.floor(r),c=a+1,u=l+1,d=e/a,h=t/l,f=[],g=[],y=[],m=[];for(let p=0;p<u;p++){let b=p*h-o;for(let S=0;S<c;S++){let _=S*d-s;g.push(_,-b,0),y.push(0,0,1),m.push(S/a),m.push(1-p/l)}}for(let p=0;p<l;p++)for(let b=0;b<a;b++){let S=b+c*p,_=b+c*(p+1),A=b+1+c*(p+1),T=b+1+c*p;f.push(S,_,T),f.push(_,A,T)}this.setIndex(f),this.setAttribute("position",new zt(g,3)),this.setAttribute("normal",new zt(y,3)),this.setAttribute("uv",new zt(m,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new n(e.width,e.height,e.widthSegments,e.heightSegments)}};function bo(n){let e={};for(let t in n){e[t]={};for(let i in n[t]){let r=n[t][i];if(bv(r))r.isRenderTargetTexture?(Qe("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),e[t][i]=null):e[t][i]=r.clone();else if(Array.isArray(r))if(bv(r[0])){let s=[];for(let o=0,a=r.length;o<a;o++)s[o]=r[o].clone();e[t][i]=s}else e[t][i]=r.slice();else e[t][i]=r}}return e}function Jn(n){let e={};for(let t=0;t<n.length;t++){let i=bo(n[t]);for(let r in i)e[r]=i[r]}return e}function bv(n){return n&&(n.isColor||n.isMatrix3||n.isMatrix4||n.isVector2||n.isVector3||n.isVector4||n.isTexture||n.isQuaternion)}function U1(n){let e=[];for(let t=0;t<n.length;t++)e.push(n[t].clone());return e}function Gm(n){let e=n.getRenderTarget();return e===null?n.outputColorSpace:e.isXRRenderTarget===!0?e.texture.colorSpace:yt.workingColorSpace}var uy={clone:bo,merge:Jn},B1=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,k1=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`,Pt=class extends Zr{constructor(e){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=B1,this.fragmentShader=k1,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=bo(e.uniforms),this.uniformsGroups=U1(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this.defaultAttributeValues=Object.assign({},e.defaultAttributeValues),this.index0AttributeName=e.index0AttributeName,this.uniformsNeedUpdate=e.uniformsNeedUpdate,this}toJSON(e){let t=super.toJSON(e);t.glslVersion=this.glslVersion,t.uniforms={};for(let r in this.uniforms){let o=this.uniforms[r].value;o&&o.isTexture?t.uniforms[r]={type:"t",value:o.toJSON(e).uuid}:o&&o.isColor?t.uniforms[r]={type:"c",value:o.getHex()}:o&&o.isVector2?t.uniforms[r]={type:"v2",value:o.toArray()}:o&&o.isVector3?t.uniforms[r]={type:"v3",value:o.toArray()}:o&&o.isVector4?t.uniforms[r]={type:"v4",value:o.toArray()}:o&&o.isMatrix3?t.uniforms[r]={type:"m3",value:o.toArray()}:o&&o.isMatrix4?t.uniforms[r]={type:"m4",value:o.toArray()}:t.uniforms[r]={value:o}}Object.keys(this.defines).length>0&&(t.defines=this.defines),t.vertexShader=this.vertexShader,t.fragmentShader=this.fragmentShader,t.lights=this.lights,t.clipping=this.clipping;let i={};for(let r in this.extensions)this.extensions[r]===!0&&(i[r]=!0);return Object.keys(i).length>0&&(t.extensions=i),t}fromJSON(e,t){if(super.fromJSON(e,t),e.uniforms!==void 0)for(let i in e.uniforms){let r=e.uniforms[i];switch(this.uniforms[i]={},r.type){case"t":this.uniforms[i].value=t[r.value]||null;break;case"c":this.uniforms[i].value=new St().setHex(r.value);break;case"v2":this.uniforms[i].value=new it().fromArray(r.value);break;case"v3":this.uniforms[i].value=new C().fromArray(r.value);break;case"v4":this.uniforms[i].value=new en().fromArray(r.value);break;case"m3":this.uniforms[i].value=new ut().fromArray(r.value);break;case"m4":this.uniforms[i].value=new Et().fromArray(r.value);break;default:this.uniforms[i].value=r.value}}if(e.defines!==void 0&&(this.defines=e.defines),e.vertexShader!==void 0&&(this.vertexShader=e.vertexShader),e.fragmentShader!==void 0&&(this.fragmentShader=e.fragmentShader),e.glslVersion!==void 0&&(this.glslVersion=e.glslVersion),e.extensions!==void 0)for(let i in e.extensions)this.extensions[i]=e.extensions[i];return e.lights!==void 0&&(this.lights=e.lights),e.clipping!==void 0&&(this.clipping=e.clipping),this}},Gh=class extends Pt{constructor(e){super(e),this.isRawShaderMaterial=!0,this.type="RawShaderMaterial"}};var Hh=class extends Zr{constructor(e){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=Zv,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}},Wh=class extends Zr{constructor(e){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}};function fa(n,e){return!n||n.constructor===e?n:typeof e.BYTES_PER_ELEMENT=="number"?new e(n):Array.prototype.slice.call(n)}function um(n){return n!==void 0&&n.inTangents!==void 0&&n.outTangents!==void 0}var Ps=class{constructor(e,t,i,r){this.parameterPositions=e,this._cachedIndex=0,this.resultBuffer=r!==void 0?r:new t.constructor(i),this.sampleValues=t,this.valueSize=i,this.settings=null,this.DefaultSettings_={}}evaluate(e){let t=this.parameterPositions,i=this._cachedIndex,r=t[i],s=t[i-1];n:{e:{let o;t:{i:if(!(e<r)){for(let a=i+2;;){if(r===void 0){if(e<s)break i;return i=t.length,this._cachedIndex=i,this.copySampleValue_(i-1)}if(i===a)break;if(s=r,r=t[++i],e<r)break e}o=t.length;break t}if(!(e>=s)){let a=t[1];e<a&&(i=2,s=a);for(let l=i-2;;){if(s===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(i===l)break;if(r=s,s=t[--i-1],e>=s)break e}o=i,i=0;break t}break n}for(;i<o;){let a=i+o>>>1;e<t[a]?o=a:i=a+1}if(r=t[i],s=t[i-1],s===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(r===void 0)return i=t.length,this._cachedIndex=i,this.copySampleValue_(i-1)}this._cachedIndex=i,this.intervalChanged_(i,s,r)}return this.interpolate_(i,s,e,r)}getSettings_(){return this.settings||this.DefaultSettings_}copySampleValue_(e){let t=this.resultBuffer,i=this.sampleValues,r=this.valueSize,s=e*r;for(let o=0;o!==r;++o)t[o]=i[s+o];return t}interpolate_(){throw new Error("THREE.Interpolant: Call to abstract method.")}intervalChanged_(){}},Xh=class extends Ps{constructor(e,t,i,r){super(e,t,i,r),this._weightPrev=-0,this._offsetPrev=-0,this._weightNext=-0,this._offsetNext=-0,this.DefaultSettings_={endingStart:dm,endingEnd:dm}}intervalChanged_(e,t,i){let r=this.parameterPositions,s=e-2,o=e+1,a=r[s],l=r[o];if(a===void 0)switch(this.getSettings_().endingStart){case fm:s=e,a=2*t-i;break;case pm:s=r.length-2,a=t+r[s]-r[s+1];break;default:s=e,a=i}if(l===void 0)switch(this.getSettings_().endingEnd){case fm:o=e,l=2*i-t;break;case pm:o=1,l=i+r[1]-r[0];break;default:o=e-1,l=t}let c=(i-t)*.5,u=this.valueSize;this._weightPrev=c/(t-a),this._weightNext=c/(l-i),this._offsetPrev=s*u,this._offsetNext=o*u}interpolate_(e,t,i,r){let s=this.resultBuffer,o=this.sampleValues,a=this.valueSize,l=e*a,c=l-a,u=this._offsetPrev,d=this._offsetNext,h=this._weightPrev,f=this._weightNext,g=(i-t)/(r-t),y=g*g,m=y*g,p=-h*m+2*h*y-h*g,b=(1+h)*m+(-1.5-2*h)*y+(-.5+h)*g+1,S=(-1-f)*m+(1.5+f)*y+.5*g,_=f*m-f*y;for(let A=0;A!==a;++A)s[A]=p*o[u+A]+b*o[c+A]+S*o[l+A]+_*o[d+A];return s}},$h=class extends Ps{constructor(e,t,i,r){super(e,t,i,r)}interpolate_(e,t,i,r){let s=this.resultBuffer,o=this.sampleValues,a=this.valueSize,l=e*a,c=l-a,u=(i-t)/(r-t),d=1-u;for(let h=0;h!==a;++h)s[h]=o[c+h]*d+o[l+h]*u;return s}},Yh=class extends Ps{constructor(e,t,i,r){super(e,t,i,r)}interpolate_(e){return this.copySampleValue_(e-1)}},qh=class extends Ps{interpolate_(e,t,i,r){let s=this.resultBuffer,o=this.sampleValues,a=this.valueSize,l=e*a,c=l-a,u=this.inTangents,d=this.outTangents;if(!u||!d){let g=(i-t)/(r-t),y=1-g;for(let m=0;m!==a;++m)s[m]=o[c+m]*y+o[l+m]*g;return s}let h=a*2,f=e-1;for(let g=0;g!==a;++g){let y=o[c+g],m=o[l+g],p=f*h+g*2,b=d[p],S=d[p+1],_=e*h+g*2,A=u[_],T=u[_+1],R=V1(i,t,b,A,r);s[g]=hy(R,y,S,T,m)}return s}};function hy(n,e,t,i,r){let s=1-n;return s*s*s*e+3*s*s*n*t+3*s*n*n*i+n*n*n*r}function z1(n,e,t,i,r){let s=1-n;return 3*s*s*(t-e)+6*s*n*(i-t)+3*n*n*(r-i)}function V1(n,e,t,i,r){let s=(n-e)/(r-e);for(let o=0;o<8;o++){let a=hy(s,e,t,i,r)-n;if(Math.abs(a)<1e-10)break;let l=z1(s,e,t,i,r);if(Math.abs(l)<1e-10)break;s=Math.max(0,Math.min(1,s-a/l))}return s}var Ti=class{constructor(e,t,i,r){if(e===void 0)throw new Error("THREE.KeyframeTrack: track name is undefined");if(t===void 0||t.length===0)throw new Error("THREE.KeyframeTrack: no keyframes in track named "+e);this.name=e,this.times=fa(t,this.TimeBufferType),this.values=fa(i,this.ValueBufferType),this.setInterpolation(r||this.DefaultInterpolation)}static toJSON(e){let t=e.constructor,i;if(t.toJSON!==this.toJSON)i=t.toJSON(e);else{i={name:e.name,times:fa(e.times,Array),values:fa(e.values,Array)};let r=e.getInterpolation();r!==e.DefaultInterpolation&&(i.interpolation=r),um(e.settings)&&(i.settings={inTangents:fa(e.settings.inTangents,Array),outTangents:fa(e.settings.outTangents,Array)})}return i.type=e.ValueTypeName,i}InterpolantFactoryMethodDiscrete(e){return new Yh(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodLinear(e){return new $h(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodSmooth(e){return new Xh(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodBezier(e){let t=new qh(this.times,this.values,this.getValueSize(),e);return this.settings&&(t.inTangents=this.settings.inTangents,t.outTangents=this.settings.outTangents),t}setInterpolation(e){let t;switch(e){case kl:t=this.InterpolantFactoryMethodDiscrete;break;case Ch:t=this.InterpolantFactoryMethodLinear;break;case xh:t=this.InterpolantFactoryMethodSmooth;break;case hm:t=this.InterpolantFactoryMethodBezier;break}if(t===void 0){let i="unsupported interpolation for "+this.ValueTypeName+" keyframe track named "+this.name;if(this.createInterpolant===void 0)if(e!==this.DefaultInterpolation)this.setInterpolation(this.DefaultInterpolation);else throw new Error(i);return Qe("KeyframeTrack:",i),this}return this.createInterpolant=t,this}getInterpolation(){switch(this.createInterpolant){case this.InterpolantFactoryMethodDiscrete:return kl;case this.InterpolantFactoryMethodLinear:return Ch;case this.InterpolantFactoryMethodSmooth:return xh;case this.InterpolantFactoryMethodBezier:return hm}}getValueSize(){return this.values.length/this.times.length}shift(e){if(e!==0){let t=this.times;for(let i=0,r=t.length;i!==r;++i)t[i]+=e}return this}scale(e){if(e!==1){let t=this.times;for(let i=0,r=t.length;i!==r;++i)t[i]*=e;um(this.settings)&&(Sv(this.settings.inTangents,e),Sv(this.settings.outTangents,e))}return this}trim(e,t){let i=this.times,r=i.length,s=0,o=r-1;for(;s!==r&&i[s]<e;)++s;for(;o!==-1&&i[o]>t;)--o;if(++o,s!==0||o!==r){s>=o&&(o=Math.max(o,1),s=o-1);let a=this.getValueSize();this.times=i.slice(s,o),this.values=this.values.slice(s*a,o*a)}return this}validate(){let e=!0,t=this.getValueSize();t-Math.floor(t)!==0&&(nt("KeyframeTrack: Invalid value size in track.",this),e=!1);let i=this.times,r=this.values,s=i.length;s===0&&(nt("KeyframeTrack: Track is empty.",this),e=!1);let o=null;for(let a=0;a!==s;a++){let l=i[a];if(typeof l=="number"&&isNaN(l)){nt("KeyframeTrack: Time is not a valid number.",this,a,l),e=!1;break}if(o!==null&&o>l){nt("KeyframeTrack: Out of order keys.",this,a,l,o),e=!1;break}o=l}if(r!==void 0&&g1(r))for(let a=0,l=r.length;a!==l;++a){let c=r[a];if(isNaN(c)){nt("KeyframeTrack: Value is not a valid number.",this,a,c),e=!1;break}}return e}optimize(){let e=this.times.slice(),t=this.values.slice(),i=this.getValueSize(),r=this.getInterpolation()===xh,s=e.length-1,o=1;for(let a=1;a<s;++a){let l=!1,c=e[a],u=e[a+1];if(c!==u&&(a!==1||c!==e[0]))if(r)l=!0;else{let d=a*i,h=d-i,f=d+i;for(let g=0;g!==i;++g){let y=t[d+g];if(y!==t[h+g]||y!==t[f+g]){l=!0;break}}}if(l){if(a!==o){e[o]=e[a];let d=a*i,h=o*i;for(let f=0;f!==i;++f)t[h+f]=t[d+f]}++o}}if(s>0){e[o]=e[s];for(let a=s*i,l=o*i,c=0;c!==i;++c)t[l+c]=t[a+c];++o}return o!==e.length?(this.times=e.slice(0,o),this.values=t.slice(0,o*i)):(this.times=e,this.values=t),this}clone(){let e=this.times.slice(),t=this.values.slice(),i=this.constructor,r=new i(this.name,e,t);return r.createInterpolant=this.createInterpolant,um(this.settings)&&(r.settings={inTangents:this.settings.inTangents.slice(),outTangents:this.settings.outTangents.slice()}),r}};function Sv(n,e){for(let t=0,i=n.length;t!==i;t+=2)n[t]*=e}Ti.prototype.ValueTypeName="";Ti.prototype.TimeBufferType=Float32Array;Ti.prototype.ValueBufferType=Float32Array;Ti.prototype.DefaultInterpolation=Ch;var Ls=class extends Ti{constructor(e,t,i){super(e,t,i)}};Ls.prototype.ValueTypeName="bool";Ls.prototype.ValueBufferType=Array;Ls.prototype.DefaultInterpolation=kl;Ls.prototype.InterpolantFactoryMethodLinear=void 0;Ls.prototype.InterpolantFactoryMethodSmooth=void 0;var jh=class extends Ti{constructor(e,t,i,r){super(e,t,i,r)}};jh.prototype.ValueTypeName="color";var Zh=class extends Ti{constructor(e,t,i,r){super(e,t,i,r)}};Zh.prototype.ValueTypeName="number";var Kh=class extends Ps{constructor(e,t,i,r){super(e,t,i,r)}interpolate_(e,t,i,r){let s=this.resultBuffer,o=this.sampleValues,a=this.valueSize,l=(i-t)/(r-t),c=e*a;for(let u=c+a;c!==u;c+=4)Gi.slerpFlat(s,0,o,c-a,o,c,l);return s}},sc=class extends Ti{constructor(e,t,i,r){super(e,t,i,r)}InterpolantFactoryMethodLinear(e){return new Kh(this.times,this.values,this.getValueSize(),e)}};sc.prototype.ValueTypeName="quaternion";sc.prototype.InterpolantFactoryMethodSmooth=void 0;var Ds=class extends Ti{constructor(e,t,i){super(e,t,i)}};Ds.prototype.ValueTypeName="string";Ds.prototype.ValueBufferType=Array;Ds.prototype.DefaultInterpolation=kl;Ds.prototype.InterpolantFactoryMethodLinear=void 0;Ds.prototype.InterpolantFactoryMethodSmooth=void 0;var Jh=class extends Ti{constructor(e,t,i,r){super(e,t,i,r)}};Jh.prototype.ValueTypeName="vector";var Qh=class{constructor(e,t,i){let r=this,s=!1,o=0,a=0,l,c=[];this.onStart=void 0,this.onLoad=e,this.onProgress=t,this.onError=i,this._abortController=null,this.itemStart=function(u){a++,s===!1&&r.onStart!==void 0&&r.onStart(u,o,a),s=!0},this.itemEnd=function(u){o++,r.onProgress!==void 0&&r.onProgress(u,o,a),o===a&&(s=!1,r.onLoad!==void 0&&r.onLoad())},this.itemError=function(u){r.onError!==void 0&&r.onError(u)},this.resolveURL=function(u){return u=u.normalize("NFC"),l?l(u):u},this.setURLModifier=function(u){return l=u,this},this.addHandler=function(u,d){return c.push(u,d),this},this.removeHandler=function(u){let d=c.indexOf(u);return d!==-1&&c.splice(d,2),this},this.getHandler=function(u){for(let d=0,h=c.length;d<h;d+=2){let f=c[d],g=c[d+1];if(f.global&&(f.lastIndex=0),f.test(u))return g}return null},this.abort=function(){return this.abortController.abort(),this._abortController=null,this}}get abortController(){return this._abortController||(this._abortController=new AbortController),this._abortController}},dy=new Qh,ed=class{constructor(e){this.manager=e!==void 0?e:dy,this.crossOrigin="anonymous",this.withCredentials=!1,this.path="",this.resourcePath="",this.requestHeader={},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}load(){}loadAsync(e,t){let i=this;return new Promise(function(r,s){i.load(e,r,t,s)})}parse(){}setCrossOrigin(e){return this.crossOrigin=e,this}setWithCredentials(e){return this.withCredentials=e,this}setPath(e){return this.path=e,this}setResourcePath(e){return this.resourcePath=e,this}setRequestHeader(e){return this.requestHeader=e,this}abort(){return this}};ed.DEFAULT_MATERIAL_NAME="__DEFAULT";var mh=new C,gh=new Gi,xr=new C,oc=class extends mi{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new Et,this.projectionMatrix=new Et,this.projectionMatrixInverse=new Et,this.coordinateSystem=or,this._reversedDepth=!1}get reversedDepth(){return this._reversedDepth}copy(e,t){return super.copy(e,t),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorld.decompose(mh,gh,xr),xr.x===1&&xr.y===1&&xr.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(mh,gh,xr.set(1,1,1)).invert()}updateWorldMatrix(e,t,i=!1){super.updateWorldMatrix(e,t,i),this.matrixWorld.decompose(mh,gh,xr),xr.x===1&&xr.y===1&&xr.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(mh,gh,xr.set(1,1,1)).invert()}clone(){return new this.constructor().copy(this)}},Ts=new C,wv=new it,Ev=new it,jn=class extends oc{constructor(e=50,t=1,i=.1,r=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=e,this.zoom=1,this.near=i,this.far=r,this.focus=10,this.aspect=t,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){let t=.5*this.getFilmHeight()/e;this.fov=Ih*2*Math.atan(t),this.updateProjectionMatrix()}getFocalLength(){let e=Math.tan(yh*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return Ih*2*Math.atan(Math.tan(yh*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(e,t,i){Ts.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),t.set(Ts.x,Ts.y).multiplyScalar(-e/Ts.z),Ts.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),i.set(Ts.x,Ts.y).multiplyScalar(-e/Ts.z)}getViewSize(e,t){return this.getViewBounds(e,wv,Ev),t.subVectors(Ev,wv)}setViewOffset(e,t,i,r,s,o){this.aspect=e/t,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=i,this.view.offsetY=r,this.view.width=s,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let e=this.near,t=e*Math.tan(yh*.5*this.fov)/this.zoom,i=2*t,r=this.aspect*i,s=-.5*r,o=this.view;if(this.view!==null&&this.view.enabled){let l=o.fullWidth,c=o.fullHeight;s+=o.offsetX*r/l,t-=o.offsetY*i/c,r*=o.width/l,i*=o.height/c}let a=this.filmOffset;a!==0&&(s+=e*a/this.getFilmWidth()),this.projectionMatrix.makePerspective(s,s+r,t,t-i,e,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){let t=super.toJSON(e);return t.object.fov=this.fov,t.object.zoom=this.zoom,t.object.near=this.near,t.object.far=this.far,t.object.focus=this.focus,t.object.aspect=this.aspect,this.view!==null&&(t.object.view=Object.assign({},this.view)),t.object.filmGauge=this.filmGauge,t.object.filmOffset=this.filmOffset,t}};var es=class extends oc{constructor(e=-1,t=1,i=1,r=-1,s=.1,o=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=e,this.right=t,this.top=i,this.bottom=r,this.near=s,this.far=o,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,t,i,r,s,o){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=i,this.view.offsetY=r,this.view.width=s,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let e=(this.right-this.left)/(2*this.zoom),t=(this.top-this.bottom)/(2*this.zoom),i=(this.right+this.left)/2,r=(this.top+this.bottom)/2,s=i-e,o=i+e,a=r+t,l=r-t;if(this.view!==null&&this.view.enabled){let c=(this.right-this.left)/this.view.fullWidth/this.zoom,u=(this.top-this.bottom)/this.view.fullHeight/this.zoom;s+=c*this.view.offsetX,o=s+c*this.view.width,a-=u*this.view.offsetY,l=a-u*this.view.height}this.projectionMatrix.makeOrthographic(s,o,a,l,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){let t=super.toJSON(e);return t.object.zoom=this.zoom,t.object.left=this.left,t.object.right=this.right,t.object.top=this.top,t.object.bottom=this.bottom,t.object.near=this.near,t.object.far=this.far,this.view!==null&&(t.object.view=Object.assign({},this.view)),t}};var yo=class extends xn{constructor(){super(),this.isInstancedBufferGeometry=!0,this.type="InstancedBufferGeometry",this.instanceCount=1/0}copy(e){return super.copy(e),this.instanceCount=e.instanceCount,this}toJSON(){let e=super.toJSON();return e.instanceCount=this.instanceCount,e.isInstancedBufferGeometry=!0,e}};var pa=-90,ma=1,td=class extends mi{constructor(e,t,i){super(),this.type="CubeCamera",this.renderTarget=i,this.coordinateSystem=null,this.activeMipmapLevel=0;let r=new jn(pa,ma,e,t);r.layers=this.layers,this.add(r);let s=new jn(pa,ma,e,t);s.layers=this.layers,this.add(s);let o=new jn(pa,ma,e,t);o.layers=this.layers,this.add(o);let a=new jn(pa,ma,e,t);a.layers=this.layers,this.add(a);let l=new jn(pa,ma,e,t);l.layers=this.layers,this.add(l);let c=new jn(pa,ma,e,t);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){let e=this.coordinateSystem,t=this.children.concat(),[i,r,s,o,a,l]=t;for(let c of t)this.remove(c);if(e===or)i.up.set(0,1,0),i.lookAt(1,0,0),r.up.set(0,1,0),r.lookAt(-1,0,0),s.up.set(0,0,-1),s.lookAt(0,1,0),o.up.set(0,0,1),o.lookAt(0,-1,0),a.up.set(0,1,0),a.lookAt(0,0,1),l.up.set(0,1,0),l.lookAt(0,0,-1);else if(e===Vl)i.up.set(0,-1,0),i.lookAt(-1,0,0),r.up.set(0,-1,0),r.lookAt(1,0,0),s.up.set(0,0,1),s.lookAt(0,1,0),o.up.set(0,0,-1),o.lookAt(0,-1,0),a.up.set(0,-1,0),a.lookAt(0,0,1),l.up.set(0,-1,0),l.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+e);for(let c of t)this.add(c),c.updateMatrixWorld()}update(e,t){this.parent===null&&this.updateMatrixWorld();let{renderTarget:i,activeMipmapLevel:r}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());let[s,o,a,l,c,u]=this.children,d=e.getRenderTarget(),h=e.getActiveCubeFace(),f=e.getActiveMipmapLevel(),g=e.xr.enabled;e.xr.enabled=!1;let y=i.texture.generateMipmaps;i.texture.generateMipmaps=!1;let m=!1;e.isWebGLRenderer===!0?m=e.state.buffers.depth.getReversed():m=e.reversedDepthBuffer,e.setRenderTarget(i,0,r),m&&e.autoClear===!1&&e.clearDepth(),e.render(t,s),e.setRenderTarget(i,1,r),m&&e.autoClear===!1&&e.clearDepth(),e.render(t,o),e.setRenderTarget(i,2,r),m&&e.autoClear===!1&&e.clearDepth(),e.render(t,a),e.setRenderTarget(i,3,r),m&&e.autoClear===!1&&e.clearDepth(),e.render(t,l),e.setRenderTarget(i,4,r),m&&e.autoClear===!1&&e.clearDepth(),e.render(t,c),i.texture.generateMipmaps=y,e.setRenderTarget(i,5,r),m&&e.autoClear===!1&&e.clearDepth(),e.render(t,u),e.setRenderTarget(d,h,f),e.xr.enabled=g,i.texture.needsPMREMUpdate=!0}},nd=class extends jn{constructor(e=[]){super(),this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=e}};var Hm="\\[\\]\\.:\\/",G1=new RegExp("["+Hm+"]","g"),Wm="[^"+Hm+"]",H1="[^"+Hm.replace("\\.","")+"]",W1=/((?:WC+[\/:])*)/.source.replace("WC",Wm),X1=/(WCOD+)?/.source.replace("WCOD",H1),$1=/(?:\.(WC+)(?:\[(.+)\])?)?/.source.replace("WC",Wm),Y1=/\.(WC+)(?:\[(.+)\])?/.source.replace("WC",Wm),q1=new RegExp("^"+W1+X1+$1+Y1+"$"),j1=["material","materials","bones","map"],gm=class{constructor(e,t,i){let r=i||ln.parseTrackName(t);this._targetGroup=e,this._bindings=e.subscribe_(t,r)}getValue(e,t){this.bind();let i=this._targetGroup.nCachedObjects_,r=this._bindings[i];r!==void 0&&r.getValue(e,t)}setValue(e,t){let i=this._bindings;for(let r=this._targetGroup.nCachedObjects_,s=i.length;r!==s;++r)i[r].setValue(e,t)}bind(){let e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,i=e.length;t!==i;++t)e[t].bind()}unbind(){let e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,i=e.length;t!==i;++t)e[t].unbind()}},ln=class n{constructor(e,t,i){this.path=t,this.parsedPath=i||n.parseTrackName(t),this.node=n.findNode(e,this.parsedPath.nodeName),this.rootNode=e,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}static create(e,t,i){return e&&e.isAnimationObjectGroup?new n.Composite(e,t,i):new n(e,t,i)}static sanitizeNodeName(e){return e.replace(/\s/g,"_").replace(G1,"")}static parseTrackName(e){let t=q1.exec(e);if(t===null)throw new Error("THREE.PropertyBinding: Cannot parse trackName: "+e);let i={nodeName:t[2],objectName:t[3],objectIndex:t[4],propertyName:t[5],propertyIndex:t[6]},r=i.nodeName&&i.nodeName.lastIndexOf(".");if(r!==void 0&&r!==-1){let s=i.nodeName.substring(r+1);j1.indexOf(s)!==-1&&(i.nodeName=i.nodeName.substring(0,r),i.objectName=s)}if(i.propertyName===null||i.propertyName.length===0)throw new Error("THREE.PropertyBinding: can not parse propertyName from trackName: "+e);return i}static findNode(e,t){if(t===void 0||t===""||t==="."||t===-1||t===e.name||t===e.uuid)return e;if(e.skeleton){let i=e.skeleton.getBoneByName(t);if(i!==void 0)return i}if(e.children){let i=function(s){for(let o=0;o<s.length;o++){let a=s[o];if(a.name===t||a.uuid===t)return a;let l=i(a.children);if(l)return l}return null},r=i(e.children);if(r)return r}return null}_getValue_unavailable(){}_setValue_unavailable(){}_getValue_direct(e,t){e[t]=this.targetObject[this.propertyName]}_getValue_array(e,t){let i=this.resolvedProperty;for(let r=0,s=i.length;r!==s;++r)e[t++]=i[r]}_getValue_arrayElement(e,t){e[t]=this.resolvedProperty[this.propertyIndex]}_getValue_toArray(e,t){this.resolvedProperty.toArray(e,t)}_setValue_direct(e,t){this.targetObject[this.propertyName]=e[t]}_setValue_direct_setNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.needsUpdate=!0}_setValue_direct_setMatrixWorldNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_array(e,t){let i=this.resolvedProperty;for(let r=0,s=i.length;r!==s;++r)i[r]=e[t++]}_setValue_array_setNeedsUpdate(e,t){let i=this.resolvedProperty;for(let r=0,s=i.length;r!==s;++r)i[r]=e[t++];this.targetObject.needsUpdate=!0}_setValue_array_setMatrixWorldNeedsUpdate(e,t){let i=this.resolvedProperty;for(let r=0,s=i.length;r!==s;++r)i[r]=e[t++];this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_arrayElement(e,t){this.resolvedProperty[this.propertyIndex]=e[t]}_setValue_arrayElement_setNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.needsUpdate=!0}_setValue_arrayElement_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_fromArray(e,t){this.resolvedProperty.fromArray(e,t)}_setValue_fromArray_setNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.needsUpdate=!0}_setValue_fromArray_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.matrixWorldNeedsUpdate=!0}_getValue_unbound(e,t){this.bind(),this.getValue(e,t)}_setValue_unbound(e,t){this.bind(),this.setValue(e,t)}bind(){let e=this.node,t=this.parsedPath,i=t.objectName,r=t.propertyName,s=t.propertyIndex;if(e||(e=n.findNode(this.rootNode,t.nodeName),this.node=e),this.getValue=this._getValue_unavailable,this.setValue=this._setValue_unavailable,!e){Qe("PropertyBinding: No target node found for track: "+this.path+".");return}if(i){let c=t.objectIndex;switch(i){case"materials":if(!e.material){nt("PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!e.material.materials){nt("PropertyBinding: Can not bind to material.materials as node.material does not have a materials array.",this);return}e=e.material.materials;break;case"bones":if(!e.skeleton){nt("PropertyBinding: Can not bind to bones as node does not have a skeleton.",this);return}e=e.skeleton.bones;for(let u=0;u<e.length;u++)if(e[u].name===c){c=u;break}break;case"map":if("map"in e){e=e.map;break}if(!e.material){nt("PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!e.material.map){nt("PropertyBinding: Can not bind to material.map as node.material does not have a map.",this);return}e=e.material.map;break;default:if(e[i]===void 0){nt("PropertyBinding: Can not bind to objectName of node undefined.",this);return}e=e[i]}if(c!==void 0){if(e[c]===void 0){nt("PropertyBinding: Trying to bind to objectIndex of objectName, but is undefined.",this,e);return}e=e[c]}}let o=e[r];if(o===void 0){let c=t.nodeName;nt("PropertyBinding: Trying to update property for track: "+c+"."+r+" but it wasn't found.",e);return}let a=this.Versioning.None;this.targetObject=e,e.isMaterial===!0?a=this.Versioning.NeedsUpdate:e.isObject3D===!0&&(a=this.Versioning.MatrixWorldNeedsUpdate);let l=this.BindingType.Direct;if(s!==void 0){if(r==="morphTargetInfluences"){if(!e.geometry){nt("PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.",this);return}if(!e.geometry.morphAttributes){nt("PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.morphAttributes.",this);return}e.morphTargetDictionary[s]!==void 0&&(s=e.morphTargetDictionary[s])}l=this.BindingType.ArrayElement,this.resolvedProperty=o,this.propertyIndex=s}else o.fromArray!==void 0&&o.toArray!==void 0?(l=this.BindingType.HasFromToArray,this.resolvedProperty=o):Array.isArray(o)?(l=this.BindingType.EntireArray,this.resolvedProperty=o):this.propertyName=r;this.getValue=this.GetterByBindingType[l],this.setValue=this.SetterByBindingTypeAndVersioning[l][a]}unbind(){this.node=null,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}};ln.Composite=gm;ln.prototype.BindingType={Direct:0,EntireArray:1,ArrayElement:2,HasFromToArray:3};ln.prototype.Versioning={None:0,NeedsUpdate:1,MatrixWorldNeedsUpdate:2};ln.prototype.GetterByBindingType=[ln.prototype._getValue_direct,ln.prototype._getValue_array,ln.prototype._getValue_arrayElement,ln.prototype._getValue_toArray];ln.prototype.SetterByBindingTypeAndVersioning=[[ln.prototype._setValue_direct,ln.prototype._setValue_direct_setNeedsUpdate,ln.prototype._setValue_direct_setMatrixWorldNeedsUpdate],[ln.prototype._setValue_array,ln.prototype._setValue_array_setNeedsUpdate,ln.prototype._setValue_array_setMatrixWorldNeedsUpdate],[ln.prototype._setValue_arrayElement,ln.prototype._setValue_arrayElement_setNeedsUpdate,ln.prototype._setValue_arrayElement_setMatrixWorldNeedsUpdate],[ln.prototype._setValue_fromArray,ln.prototype._setValue_fromArray_setNeedsUpdate,ln.prototype._setValue_fromArray_setMatrixWorldNeedsUpdate]];var WP=new Float32Array(1);var wa=class extends Nh{constructor(e,t,i=1){super(e,t),this.isInstancedInterleavedBuffer=!0,this.meshPerAttribute=i}copy(e){return super.copy(e),this.meshPerAttribute=e.meshPerAttribute,this}clone(e){let t=super.clone(e);return t.meshPerAttribute=this.meshPerAttribute,t}toJSON(e){let t=super.toJSON(e);return t.isInstancedInterleavedBuffer=!0,t.meshPerAttribute=this.meshPerAttribute,t}};var Av=new Et,ac=class{constructor(e,t,i=0,r=1/0){this.ray=new Kr(e,t),this.near=i,this.far=r,this.camera=null,this.layers=new _a,this.params={Mesh:{},Line:{threshold:1},LOD:{},Points:{threshold:1},Sprite:{}}}set(e,t){this.ray.set(e,t)}setFromCamera(e,t){t.isPerspectiveCamera?(this.ray.origin.setFromMatrixPosition(t.matrixWorld),this.ray.direction.set(e.x,e.y,.5).unproject(t).sub(this.ray.origin).normalize(),this.camera=t):t.isOrthographicCamera?(this.ray.origin.set(e.x,e.y,t.projectionMatrix.elements[14]).unproject(t),this.ray.direction.set(0,0,-1).transformDirection(t.matrixWorld),this.camera=t):nt("Raycaster: Unsupported camera type: "+t.type)}setFromXRController(e){return Av.identity().extractRotation(e.matrixWorld),this.ray.origin.setFromMatrixPosition(e.matrixWorld),this.ray.direction.set(0,0,-1).applyMatrix4(Av),this}intersectObject(e,t=!0,i=[]){return xm(e,this,i,t),i.sort(Tv),i}intersectObjects(e,t=!0,i=[]){for(let r=0,s=e.length;r<s;r++)xm(e[r],this,i,t);return i.sort(Tv),i}};function Tv(n,e){return n.distance-e.distance}function xm(n,e,t,i){let r=!0;if(n.layers.test(e.layers)&&n.raycast(e,t)===!1&&(r=!1),r===!0&&i===!0){let s=n.children;for(let o=0,a=s.length;o<a;o++)xm(s[o],e,t,!0)}}var Zm=class Zm{constructor(e,t,i,r){this.elements=[1,0,0,1],e!==void 0&&this.set(e,t,i,r)}identity(){return this.set(1,0,0,1),this}fromArray(e,t=0){for(let i=0;i<4;i++)this.elements[i]=e[i+t];return this}set(e,t,i,r){let s=this.elements;return s[0]=e,s[2]=t,s[1]=i,s[3]=r,this}};Zm.prototype.isMatrix2=!0;var vm=Zm;function Xm(n,e,t,i){let r=Z1(i);switch(t){case Fm:return n*e;case hd:return n*e/r.components*r.byteLength;case dd:return n*e/r.components*r.byteLength;case Us:return n*e*2/r.components*r.byteLength;case fd:return n*e*2/r.components*r.byteLength;case Um:return n*e*3/r.components*r.byteLength;case Hn:return n*e*4/r.components*r.byteLength;case pd:return n*e*4/r.components*r.byteLength;case dc:case fc:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*8;case pc:case mc:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*16;case gd:case vd:return Math.max(n,16)*Math.max(e,8)/4;case md:case xd:return Math.max(n,8)*Math.max(e,8)/2;case yd:case _d:case bd:case Sd:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*8;case Md:case gc:case wd:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*16;case Ed:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*16;case Ad:return Math.floor((n+4)/5)*Math.floor((e+3)/4)*16;case Td:return Math.floor((n+4)/5)*Math.floor((e+4)/5)*16;case Rd:return Math.floor((n+5)/6)*Math.floor((e+4)/5)*16;case Cd:return Math.floor((n+5)/6)*Math.floor((e+5)/6)*16;case Id:return Math.floor((n+7)/8)*Math.floor((e+4)/5)*16;case Pd:return Math.floor((n+7)/8)*Math.floor((e+5)/6)*16;case Ld:return Math.floor((n+7)/8)*Math.floor((e+7)/8)*16;case Dd:return Math.floor((n+9)/10)*Math.floor((e+4)/5)*16;case Nd:return Math.floor((n+9)/10)*Math.floor((e+5)/6)*16;case Od:return Math.floor((n+9)/10)*Math.floor((e+7)/8)*16;case Fd:return Math.floor((n+9)/10)*Math.floor((e+9)/10)*16;case Ud:return Math.floor((n+11)/12)*Math.floor((e+9)/10)*16;case Bd:return Math.floor((n+11)/12)*Math.floor((e+11)/12)*16;case kd:case zd:case Vd:return Math.ceil(n/4)*Math.ceil(e/4)*16;case Gd:case Hd:return Math.ceil(n/4)*Math.ceil(e/4)*8;case xc:case Wd:return Math.ceil(n/4)*Math.ceil(e/4)*16}throw new Error(`Unable to determine texture byte length for ${t} format.`)}function Z1(n){switch(n){case Ci:case Lm:return{byteLength:1,components:1};case Ta:case Dm:case Kn:return{byteLength:2,components:1};case cd:case ud:return{byteLength:2,components:4};case lr:case ld:case Hi:return{byteLength:4,components:1};case Nm:case Om:return{byteLength:4,components:3}}throw new Error(`THREE.TextureUtils: Unknown texture type ${n}.`)}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:"186"}}));typeof window<"u"&&(window.__THREE__?Qe("WARNING: Multiple instances of Three.js being imported."):window.__THREE__="186");function Ny(){let n=null,e=!1,t=null,i=null;function r(s,o){i=n.requestAnimationFrame(r),t(s,o)}return{start:function(){e!==!0&&t!==null&&n!==null&&(i=n.requestAnimationFrame(r),e=!0)},stop:function(){n!==null&&n.cancelAnimationFrame(i),e=!1},setAnimationLoop:function(s){t=s},setContext:function(s){n=s}}}function J1(n){let e=new WeakMap;function t(a,l){let c=a.array,u=a.usage,d=c.byteLength,h=n.createBuffer();n.bindBuffer(l,h),n.bufferData(l,c,u),a.onUploadCallback();let f;if(c instanceof Float32Array)f=n.FLOAT;else if(typeof Float16Array<"u"&&c instanceof Float16Array)f=n.HALF_FLOAT;else if(c instanceof Uint16Array)a.isFloat16BufferAttribute?f=n.HALF_FLOAT:f=n.UNSIGNED_SHORT;else if(c instanceof Int16Array)f=n.SHORT;else if(c instanceof Uint32Array)f=n.UNSIGNED_INT;else if(c instanceof Int32Array)f=n.INT;else if(c instanceof Int8Array)f=n.BYTE;else if(c instanceof Uint8Array)f=n.UNSIGNED_BYTE;else if(c instanceof Uint8ClampedArray)f=n.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+c);return{buffer:h,type:f,bytesPerElement:c.BYTES_PER_ELEMENT,version:a.version,size:d}}function i(a,l,c){let u=l.array,d=l.updateRanges;if(n.bindBuffer(c,a),d.length===0)n.bufferSubData(c,0,u);else{d.sort((f,g)=>f.start-g.start);let h=0;for(let f=1;f<d.length;f++){let g=d[h],y=d[f];y.start<=g.start+g.count+1?g.count=Math.max(g.count,y.start+y.count-g.start):(++h,d[h]=y)}d.length=h+1;for(let f=0,g=d.length;f<g;f++){let y=d[f];n.bufferSubData(c,y.start*u.BYTES_PER_ELEMENT,u,y.start,y.count)}l.clearUpdateRanges()}l.onUploadCallback()}function r(a){return a.isInterleavedBufferAttribute&&(a=a.data),e.get(a)}function s(a){a.isInterleavedBufferAttribute&&(a=a.data);let l=e.get(a);l&&(n.deleteBuffer(l.buffer),e.delete(a))}function o(a,l){if(a.isInterleavedBufferAttribute&&(a=a.data),a.isGLBufferAttribute){let u=e.get(a);(!u||u.version<a.version)&&e.set(a,{buffer:a.buffer,type:a.type,bytesPerElement:a.elementSize,version:a.version});return}let c=e.get(a);if(c===void 0)e.set(a,t(a,l));else if(c.version<a.version){if(c.size!==a.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");i(c.buffer,a,l),c.version=a.version}}return{get:r,remove:s,update:o}}var Q1=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,ew=`#ifdef USE_ALPHAHASH
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
#endif`,tw=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,nw=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,iw=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,rw=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,sw=`#ifdef USE_AOMAP
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
#endif`,ow=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,aw=`#ifdef USE_BATCHING
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
#endif`,lw=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,cw=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,uw=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,hw=`float G_BlinnPhong_Implicit( ) {
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
} // validated`,dw=`#ifdef USE_IRIDESCENCE
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
#endif`,fw=`#ifdef USE_BUMPMAP
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
#endif`,pw=`#if NUM_CLIPPING_PLANES > 0
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
#endif`,mw=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,gw=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,xw=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,vw=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#endif`,yw=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#endif`,_w=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec4 vColor;
#endif`,Mw=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
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
#endif`,bw=`#define PI 3.141592653589793
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
} // validated`,Sw=`#ifdef ENVMAP_TYPE_CUBE_UV
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
#endif`,ww=`vec3 transformedNormal = objectNormal;
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
#endif`,Ew=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,Aw=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,Tw=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,Rw=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,Cw="gl_FragColor = linearToOutputTexel( gl_FragColor );",Iw=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,Pw=`#ifdef USE_ENVMAP
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
#endif`,Lw=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
#endif`,Dw=`#ifdef USE_ENVMAP
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
#endif`,Nw=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,Ow=`#ifdef USE_ENVMAP
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
#endif`,Fw=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,Uw=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,Bw=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,kw=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,zw=`#ifdef USE_GRADIENTMAP
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
}`,Vw=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,Gw=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,Hw=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,Ww=`uniform bool receiveShadow;
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
#include <lightprobes_pars_fragment>`,Xw=`#ifdef USE_ENVMAP
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
#endif`,$w=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,Yw=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,qw=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,jw=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,Zw=`PhysicalMaterial material;
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
#endif`,Kw=`uniform sampler2D dfgLUT;
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
}`,Jw=`
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
#endif`,Qw=`#if defined( RE_IndirectDiffuse )
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
#endif`,eE=`#if defined( RE_IndirectDiffuse )
	#if defined( LAMBERT ) || defined( PHONG )
		irradiance += iblIrradiance;
	#endif
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,tE=`#ifdef USE_LIGHT_PROBES_GRID
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
#endif`,nE=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,iE=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,rE=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,sE=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,oE=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,aE=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,lE=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
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
#endif`,cE=`#if defined( USE_POINTS_UV )
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
#endif`,uE=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,hE=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,dE=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,fE=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,pE=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,mE=`#ifdef USE_MORPHTARGETS
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
#endif`,gE=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,xE=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
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
vec3 nonPerturbedNormal = normal;`,vE=`#ifdef USE_NORMALMAP_OBJECTSPACE
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
#endif`,yE=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,_E=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,ME=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
		#ifdef FLIP_SIDED
			vBitangent = - vBitangent;
		#endif
	#endif
#endif`,bE=`#ifdef USE_NORMALMAP
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
#endif`,SE=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,wE=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,EE=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,AE=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,TE=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,RE=`vec3 packNormalToRGB( const in vec3 normal ) {
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
}`,CE=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,IE=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,PE=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,LE=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,DE=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,NE=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,OE=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,FE=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,UE=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_SUN_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
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
#endif`,BE=`float getShadowMask() {
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
}`,kE=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,zE=`#ifdef USE_SKINNING
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
#endif`,VE=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,GE=`#ifdef USE_SKINNING
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
#endif`,HE=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,WE=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,XE=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,$E=`#ifndef saturate
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
vec3 CustomToneMapping( vec3 color ) { return color; }`,YE=`#ifdef USE_TRANSMISSION
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
#endif`,qE=`#ifdef USE_TRANSMISSION
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
#endif`,jE=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,ZE=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,KE=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,JE=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`,QE=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,eA=`uniform sampler2D t2D;
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
}`,tA=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,nA=`#ifdef ENVMAP_TYPE_CUBE
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
}`,iA=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,rA=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,sA=`#include <common>
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
}`,oA=`#if DEPTH_PACKING == 3200
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
}`,aA=`#define DISTANCE
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
}`,lA=`#define DISTANCE
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
}`,cA=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,uA=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,hA=`uniform float scale;
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
}`,dA=`uniform vec3 diffuse;
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
}`,fA=`#include <common>
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
}`,pA=`uniform vec3 diffuse;
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
}`,mA=`#define LAMBERT
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
}`,gA=`#define LAMBERT
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
}`,xA=`#define MATCAP
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
}`,vA=`#define MATCAP
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
}`,yA=`#define NORMAL
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
}`,_A=`#define NORMAL
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
}`,MA=`#define PHONG
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
}`,bA=`#define PHONG
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
}`,SA=`#define STANDARD
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
}`,wA=`#define STANDARD
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
}`,EA=`#define TOON
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
}`,AA=`#define TOON
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
}`,TA=`uniform float size;
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
}`,RA=`uniform vec3 diffuse;
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
}`,CA=`#include <common>
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
}`,IA=`uniform vec3 color;
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
}`,PA=`uniform float rotation;
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
}`,LA=`uniform vec3 diffuse;
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
}`,mt={alphahash_fragment:Q1,alphahash_pars_fragment:ew,alphamap_fragment:tw,alphamap_pars_fragment:nw,alphatest_fragment:iw,alphatest_pars_fragment:rw,aomap_fragment:sw,aomap_pars_fragment:ow,batching_pars_vertex:aw,batching_vertex:lw,begin_vertex:cw,beginnormal_vertex:uw,bsdfs:hw,iridescence_fragment:dw,bumpmap_pars_fragment:fw,clipping_planes_fragment:pw,clipping_planes_pars_fragment:mw,clipping_planes_pars_vertex:gw,clipping_planes_vertex:xw,color_fragment:vw,color_pars_fragment:yw,color_pars_vertex:_w,color_vertex:Mw,common:bw,cube_uv_reflection_fragment:Sw,defaultnormal_vertex:ww,displacementmap_pars_vertex:Ew,displacementmap_vertex:Aw,emissivemap_fragment:Tw,emissivemap_pars_fragment:Rw,colorspace_fragment:Cw,colorspace_pars_fragment:Iw,envmap_fragment:Pw,envmap_common_pars_fragment:Lw,envmap_pars_fragment:Dw,envmap_pars_vertex:Nw,envmap_physical_pars_fragment:Xw,envmap_vertex:Ow,fog_vertex:Fw,fog_pars_vertex:Uw,fog_fragment:Bw,fog_pars_fragment:kw,gradientmap_pars_fragment:zw,lightmap_pars_fragment:Vw,lights_lambert_fragment:Gw,lights_lambert_pars_fragment:Hw,lights_pars_begin:Ww,lights_toon_fragment:$w,lights_toon_pars_fragment:Yw,lights_phong_fragment:qw,lights_phong_pars_fragment:jw,lights_physical_fragment:Zw,lights_physical_pars_fragment:Kw,lights_fragment_begin:Jw,lights_fragment_maps:Qw,lights_fragment_end:eE,lightprobes_pars_fragment:tE,logdepthbuf_fragment:nE,logdepthbuf_pars_fragment:iE,logdepthbuf_pars_vertex:rE,logdepthbuf_vertex:sE,map_fragment:oE,map_pars_fragment:aE,map_particle_fragment:lE,map_particle_pars_fragment:cE,metalnessmap_fragment:uE,metalnessmap_pars_fragment:hE,morphinstance_vertex:dE,morphcolor_vertex:fE,morphnormal_vertex:pE,morphtarget_pars_vertex:mE,morphtarget_vertex:gE,normal_fragment_begin:xE,normal_fragment_maps:vE,normal_pars_fragment:yE,normal_pars_vertex:_E,normal_vertex:ME,normalmap_pars_fragment:bE,clearcoat_normal_fragment_begin:SE,clearcoat_normal_fragment_maps:wE,clearcoat_pars_fragment:EE,iridescence_pars_fragment:AE,opaque_fragment:TE,packing:RE,premultiplied_alpha_fragment:CE,project_vertex:IE,dithering_fragment:PE,dithering_pars_fragment:LE,roughnessmap_fragment:DE,roughnessmap_pars_fragment:NE,shadowmap_pars_fragment:OE,shadowmap_pars_vertex:FE,shadowmap_vertex:UE,shadowmask_pars_fragment:BE,skinbase_vertex:kE,skinning_pars_vertex:zE,skinning_vertex:VE,skinnormal_vertex:GE,specularmap_fragment:HE,specularmap_pars_fragment:WE,tonemapping_fragment:XE,tonemapping_pars_fragment:$E,transmission_fragment:YE,transmission_pars_fragment:qE,uv_pars_fragment:jE,uv_pars_vertex:ZE,uv_vertex:KE,worldpos_vertex:JE,background_vert:QE,background_frag:eA,backgroundCube_vert:tA,backgroundCube_frag:nA,cube_vert:iA,cube_frag:rA,depth_vert:sA,depth_frag:oA,distance_vert:aA,distance_frag:lA,equirect_vert:cA,equirect_frag:uA,linedashed_vert:hA,linedashed_frag:dA,meshbasic_vert:fA,meshbasic_frag:pA,meshlambert_vert:mA,meshlambert_frag:gA,meshmatcap_vert:xA,meshmatcap_frag:vA,meshnormal_vert:yA,meshnormal_frag:_A,meshphong_vert:MA,meshphong_frag:bA,meshphysical_vert:SA,meshphysical_frag:wA,meshtoon_vert:EA,meshtoon_frag:AA,points_vert:TA,points_frag:RA,shadow_vert:CA,shadow_frag:IA,sprite_vert:PA,sprite_frag:LA},Pe={common:{diffuse:{value:new St(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new ut},alphaMap:{value:null},alphaMapTransform:{value:new ut},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new ut}},envmap:{envMap:{value:null},envMapRotation:{value:new ut},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98},dfgLUT:{value:null}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new ut}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new ut}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new ut},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new ut},normalScale:{value:new it(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new ut},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new ut}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new ut}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new ut}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new St(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},sunLights:{value:[],properties:{direction:{},color:{}}},sunLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},sunShadowMatrix:{value:[]},sunShadowCascade:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null},probesSH:{value:null},probesMin:{value:new C},probesMax:{value:new C},probesResolution:{value:new C}},points:{diffuse:{value:new St(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new ut},alphaTest:{value:0},uvTransform:{value:new ut}},sprite:{diffuse:{value:new St(16777215)},opacity:{value:1},center:{value:new it(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new ut},alphaMap:{value:null},alphaMapTransform:{value:new ut},alphaTest:{value:0}}},Ar={basic:{uniforms:Jn([Pe.common,Pe.specularmap,Pe.envmap,Pe.aomap,Pe.lightmap,Pe.fog]),vertexShader:mt.meshbasic_vert,fragmentShader:mt.meshbasic_frag},lambert:{uniforms:Jn([Pe.common,Pe.specularmap,Pe.envmap,Pe.aomap,Pe.lightmap,Pe.emissivemap,Pe.bumpmap,Pe.normalmap,Pe.displacementmap,Pe.fog,Pe.lights,{emissive:{value:new St(0)},envMapIntensity:{value:1}}]),vertexShader:mt.meshlambert_vert,fragmentShader:mt.meshlambert_frag},phong:{uniforms:Jn([Pe.common,Pe.specularmap,Pe.envmap,Pe.aomap,Pe.lightmap,Pe.emissivemap,Pe.bumpmap,Pe.normalmap,Pe.displacementmap,Pe.fog,Pe.lights,{emissive:{value:new St(0)},specular:{value:new St(1118481)},shininess:{value:30},envMapIntensity:{value:1}}]),vertexShader:mt.meshphong_vert,fragmentShader:mt.meshphong_frag},standard:{uniforms:Jn([Pe.common,Pe.envmap,Pe.aomap,Pe.lightmap,Pe.emissivemap,Pe.bumpmap,Pe.normalmap,Pe.displacementmap,Pe.roughnessmap,Pe.metalnessmap,Pe.fog,Pe.lights,{emissive:{value:new St(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:mt.meshphysical_vert,fragmentShader:mt.meshphysical_frag},toon:{uniforms:Jn([Pe.common,Pe.aomap,Pe.lightmap,Pe.emissivemap,Pe.bumpmap,Pe.normalmap,Pe.displacementmap,Pe.gradientmap,Pe.fog,Pe.lights,{emissive:{value:new St(0)}}]),vertexShader:mt.meshtoon_vert,fragmentShader:mt.meshtoon_frag},matcap:{uniforms:Jn([Pe.common,Pe.bumpmap,Pe.normalmap,Pe.displacementmap,Pe.fog,{matcap:{value:null}}]),vertexShader:mt.meshmatcap_vert,fragmentShader:mt.meshmatcap_frag},points:{uniforms:Jn([Pe.points,Pe.fog]),vertexShader:mt.points_vert,fragmentShader:mt.points_frag},dashed:{uniforms:Jn([Pe.common,Pe.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:mt.linedashed_vert,fragmentShader:mt.linedashed_frag},depth:{uniforms:Jn([Pe.common,Pe.displacementmap]),vertexShader:mt.depth_vert,fragmentShader:mt.depth_frag},normal:{uniforms:Jn([Pe.common,Pe.bumpmap,Pe.normalmap,Pe.displacementmap,{opacity:{value:1}}]),vertexShader:mt.meshnormal_vert,fragmentShader:mt.meshnormal_frag},sprite:{uniforms:Jn([Pe.sprite,Pe.fog]),vertexShader:mt.sprite_vert,fragmentShader:mt.sprite_frag},background:{uniforms:{uvTransform:{value:new ut},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:mt.background_vert,fragmentShader:mt.background_frag},backgroundCube:{uniforms:{envMap:{value:null},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new ut}},vertexShader:mt.backgroundCube_vert,fragmentShader:mt.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:mt.cube_vert,fragmentShader:mt.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:mt.equirect_vert,fragmentShader:mt.equirect_frag},distance:{uniforms:Jn([Pe.common,Pe.displacementmap,{referencePosition:{value:new C},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:mt.distance_vert,fragmentShader:mt.distance_frag},shadow:{uniforms:Jn([Pe.lights,Pe.fog,{color:{value:new St(0)},opacity:{value:1}}]),vertexShader:mt.shadow_vert,fragmentShader:mt.shadow_frag}};Ar.physical={uniforms:Jn([Ar.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new ut},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new ut},clearcoatNormalScale:{value:new it(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new ut},dispersion:{value:0},retroreflectivity:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new ut},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new ut},sheen:{value:0},sheenColor:{value:new St(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new ut},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new ut},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new ut},transmissionSamplerSize:{value:new it},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new ut},attenuationDistance:{value:0},attenuationColor:{value:new St(0)},specularColor:{value:new St(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new ut},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new ut},anisotropyVector:{value:new it},anisotropyMap:{value:null},anisotropyMapTransform:{value:new ut}}]),vertexShader:mt.meshphysical_vert,fragmentShader:mt.meshphysical_frag};var Yd={r:0,b:0,g:0},DA=new Et,Oy=new ut;Oy.set(-1,0,0,0,1,0,0,0,1);function NA(n,e,t,i,r,s){let o=new St(0),a=r===!0?0:1,l,c,u=null,d=0,h=null;function f(b){let S=b.isScene===!0?b.background:null;if(S&&S.isTexture){let _=b.backgroundBlurriness>0;S=e.get(S,_)}return S}function g(b){let S=!1,_=f(b);_===null?m(o,a):_&&_.isColor&&(m(_,1),S=!0);let A=n.xr.getEnvironmentBlendMode();A==="additive"?t.buffers.color.setClear(0,0,0,1,s):A==="alpha-blend"&&t.buffers.color.setClear(0,0,0,0,s),(n.autoClear||S)&&(t.buffers.depth.setTest(!0),t.buffers.depth.setMask(!0),t.buffers.color.setMask(!0),n.clear(n.autoClearColor,n.autoClearDepth,n.autoClearStencil))}function y(b,S){let _=f(S);_&&(_.isCubeTexture||_.mapping===uc)?(c===void 0&&(c=new Vt(new Sa(1,1,1),new Pt({name:"BackgroundCubeMaterial",uniforms:bo(Ar.backgroundCube.uniforms),vertexShader:Ar.backgroundCube.vertexShader,fragmentShader:Ar.backgroundCube.fragmentShader,side:li,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),c.geometry.deleteAttribute("normal"),c.geometry.deleteAttribute("uv"),c.onBeforeRender=function(A,T,R){this.matrixWorld.copyPosition(R.matrixWorld)},Object.defineProperty(c.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),i.update(c)),c.material.uniforms.envMap.value=_,c.material.uniforms.backgroundBlurriness.value=S.backgroundBlurriness,c.material.uniforms.backgroundIntensity.value=S.backgroundIntensity,c.material.uniforms.backgroundRotation.value.setFromMatrix4(DA.makeRotationFromEuler(S.backgroundRotation)).transpose(),_.isCubeTexture&&_.isRenderTargetTexture===!1&&c.material.uniforms.backgroundRotation.value.premultiply(Oy),c.material.toneMapped=yt.getTransfer(_.colorSpace)!==kt,(u!==_||d!==_.version||h!==n.toneMapping)&&(c.material.needsUpdate=!0,u=_,d=_.version,h=n.toneMapping),c.layers.enableAll(),b.unshift(c,c.geometry,c.material,0,0,null)):_&&_.isTexture&&(l===void 0&&(l=new Vt(new Qr(2,2),new Pt({name:"BackgroundMaterial",uniforms:bo(Ar.background.uniforms),vertexShader:Ar.background.vertexShader,fragmentShader:Ar.background.fragmentShader,side:Sr,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),l.geometry.deleteAttribute("normal"),Object.defineProperty(l.material,"map",{get:function(){return this.uniforms.t2D.value}}),i.update(l)),l.material.uniforms.t2D.value=_,l.material.uniforms.backgroundIntensity.value=S.backgroundIntensity,l.material.toneMapped=yt.getTransfer(_.colorSpace)!==kt,_.matrixAutoUpdate===!0&&_.updateMatrix(),l.material.uniforms.uvTransform.value.copy(_.matrix),(u!==_||d!==_.version||h!==n.toneMapping)&&(l.material.needsUpdate=!0,u=_,d=_.version,h=n.toneMapping),l.layers.enableAll(),b.unshift(l,l.geometry,l.material,0,0,null))}function m(b,S){b.getRGB(Yd,Gm(n)),t.buffers.color.setClear(Yd.r,Yd.g,Yd.b,S,s)}function p(){c!==void 0&&(c.geometry.dispose(),c.material.dispose(),c=void 0),l!==void 0&&(l.geometry.dispose(),l.material.dispose(),l=void 0)}return{getClearColor:function(){return o},setClearColor:function(b,S=1){o.set(b),a=S,m(o,a)},getClearAlpha:function(){return a},setClearAlpha:function(b){a=b,m(o,a)},render:g,addToRenderList:y,dispose:p}}function OA(n,e){let t=n.getParameter(n.MAX_VERTEX_ATTRIBS),i={},r=h(null),s=r,o=!1;function a(D,F,z,N,V){let K=!1,$=d(D,N,z,F);s!==$&&(s=$,c(s.object)),K=f(D,N,z,V),K&&g(D,N,z,V),V!==null&&e.update(V,n.ELEMENT_ARRAY_BUFFER),(K||o)&&(o=!1,_(D,F,z,N),V!==null&&n.bindBuffer(n.ELEMENT_ARRAY_BUFFER,e.get(V).buffer))}function l(){return n.createVertexArray()}function c(D){return n.bindVertexArray(D)}function u(D){return n.deleteVertexArray(D)}function d(D,F,z,N){let V=N.wireframe===!0,K=i[F.id];K===void 0&&(K={},i[F.id]=K);let $=D.isInstancedMesh===!0?D.id:0,J=K[$];J===void 0&&(J={},K[$]=J);let j=J[z.id];j===void 0&&(j={},J[z.id]=j);let Q=j[V];return Q===void 0&&(Q=h(l()),j[V]=Q),Q}function h(D){let F=[],z=[],N=[];for(let V=0;V<t;V++)F[V]=0,z[V]=0,N[V]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:F,enabledAttributes:z,attributeDivisors:N,object:D,attributes:{},index:null}}function f(D,F,z,N){let V=s.attributes,K=F.attributes,$=0,J=z.getAttributes();for(let j in J)if(J[j].location>=0){let ie=V[j],Ve=K[j];if(Ve===void 0&&(j==="instanceMatrix"&&D.instanceMatrix&&(Ve=D.instanceMatrix),j==="instanceColor"&&D.instanceColor&&(Ve=D.instanceColor)),ie===void 0||ie.attribute!==Ve||Ve&&ie.data!==Ve.data)return!0;$++}return s.attributesNum!==$||s.index!==N}function g(D,F,z,N){let V={},K=F.attributes,$=0,J=z.getAttributes();for(let j in J)if(J[j].location>=0){let ie=K[j];ie===void 0&&(j==="instanceMatrix"&&D.instanceMatrix&&(ie=D.instanceMatrix),j==="instanceColor"&&D.instanceColor&&(ie=D.instanceColor));let Ve={};Ve.attribute=ie,ie&&ie.data&&(Ve.data=ie.data),V[j]=Ve,$++}s.attributes=V,s.attributesNum=$,s.index=N}function y(){let D=s.newAttributes;for(let F=0,z=D.length;F<z;F++)D[F]=0}function m(D){p(D,0)}function p(D,F){let z=s.newAttributes,N=s.enabledAttributes,V=s.attributeDivisors;z[D]=1,N[D]===0&&(n.enableVertexAttribArray(D),N[D]=1),V[D]!==F&&(n.vertexAttribDivisor(D,F),V[D]=F)}function b(){let D=s.newAttributes,F=s.enabledAttributes;for(let z=0,N=F.length;z<N;z++)F[z]!==D[z]&&(n.disableVertexAttribArray(z),F[z]=0)}function S(D,F,z,N,V,K,$){$===!0?n.vertexAttribIPointer(D,F,z,V,K):n.vertexAttribPointer(D,F,z,N,V,K)}function _(D,F,z,N){y();let V=N.attributes,K=z.getAttributes(),$=F.defaultAttributeValues;for(let J in K){let j=K[J];if(j.location>=0){let Q=V[J];if(Q===void 0&&(J==="instanceMatrix"&&D.instanceMatrix&&(Q=D.instanceMatrix),J==="instanceColor"&&D.instanceColor&&(Q=D.instanceColor)),Q!==void 0){let ie=Q.normalized,Ve=Q.itemSize,Ue=e.get(Q);if(Ue===void 0)continue;let _t=Ue.buffer,lt=Ue.type,ot=Ue.bytesPerElement,Y=lt===n.INT||lt===n.UNSIGNED_INT||Q.gpuType===ld;if(Q.isInterleavedBufferAttribute){let te=Q.data,be=te.stride,Ke=Q.offset;if(te.isInstancedInterleavedBuffer){for(let Ce=0;Ce<j.locationSize;Ce++)p(j.location+Ce,te.meshPerAttribute);D.isInstancedMesh!==!0&&N._maxInstanceCount===void 0&&(N._maxInstanceCount=te.meshPerAttribute*te.count)}else for(let Ce=0;Ce<j.locationSize;Ce++)m(j.location+Ce);n.bindBuffer(n.ARRAY_BUFFER,_t);for(let Ce=0;Ce<j.locationSize;Ce++)S(j.location+Ce,Ve/j.locationSize,lt,ie,be*ot,(Ke+Ve/j.locationSize*Ce)*ot,Y)}else{if(Q.isInstancedBufferAttribute){for(let te=0;te<j.locationSize;te++)p(j.location+te,Q.meshPerAttribute);D.isInstancedMesh!==!0&&N._maxInstanceCount===void 0&&(N._maxInstanceCount=Q.meshPerAttribute*Q.count)}else for(let te=0;te<j.locationSize;te++)m(j.location+te);n.bindBuffer(n.ARRAY_BUFFER,_t);for(let te=0;te<j.locationSize;te++)S(j.location+te,Ve/j.locationSize,lt,ie,Ve*ot,Ve/j.locationSize*te*ot,Y)}}else if($!==void 0){let ie=$[J];if(ie!==void 0)switch(ie.length){case 2:n.vertexAttrib2fv(j.location,ie);break;case 3:n.vertexAttrib3fv(j.location,ie);break;case 4:n.vertexAttrib4fv(j.location,ie);break;default:n.vertexAttrib1fv(j.location,ie)}}}}b()}function A(){w();for(let D in i){let F=i[D];for(let z in F){let N=F[z];for(let V in N){let K=N[V];for(let $ in K)u(K[$].object),delete K[$];delete N[V]}}delete i[D]}}function T(D){if(i[D.id]===void 0)return;let F=i[D.id];for(let z in F){let N=F[z];for(let V in N){let K=N[V];for(let $ in K)u(K[$].object),delete K[$];delete N[V]}}delete i[D.id]}function R(D){for(let F in i){let z=i[F];for(let N in z){let V=z[N];if(V[D.id]===void 0)continue;let K=V[D.id];for(let $ in K)u(K[$].object),delete K[$];delete V[D.id]}}}function x(D){for(let F in i){let z=i[F],N=D.isInstancedMesh===!0?D.id:0,V=z[N];if(V!==void 0){for(let K in V){let $=V[K];for(let J in $)u($[J].object),delete $[J];delete V[K]}delete z[N],Object.keys(z).length===0&&delete i[F]}}}function w(){I(),o=!0,s!==r&&(s=r,c(s.object))}function I(){r.geometry=null,r.program=null,r.wireframe=!1}return{setup:a,reset:w,resetDefaultState:I,dispose:A,releaseStatesOfGeometry:T,releaseStatesOfObject:x,releaseStatesOfProgram:R,initAttributes:y,enableAttribute:m,disableUnusedAttributes:b}}function FA(n,e,t){let i;function r(l){i=l}function s(l,c){n.drawArrays(i,l,c),t.update(c,i,1)}function o(l,c,u){u!==0&&(n.drawArraysInstanced(i,l,c,u),t.update(c,i,u))}function a(l,c,u){if(u===0)return;e.get("WEBGL_multi_draw").multiDrawArraysWEBGL(i,l,0,c,0,u);let h=0;for(let f=0;f<u;f++)h+=c[f];t.update(h,i,1)}this.setMode=r,this.render=s,this.renderInstances=o,this.renderMultiDraw=a}function UA(n,e,t,i){let r;function s(){if(r!==void 0)return r;if(e.has("EXT_texture_filter_anisotropic")===!0){let R=e.get("EXT_texture_filter_anisotropic");r=n.getParameter(R.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else r=0;return r}function o(R){return!(R!==Hn&&i.convert(R)!==n.getParameter(n.IMPLEMENTATION_COLOR_READ_FORMAT))}function a(R){let x=R===Kn&&(e.has("EXT_color_buffer_half_float")||e.has("EXT_color_buffer_float"));return!(R!==Ci&&R!==Hi&&!x&&i.convert(R)!==n.getParameter(n.IMPLEMENTATION_COLOR_READ_TYPE))}function l(R){if(R==="highp"){if(n.getShaderPrecisionFormat(n.VERTEX_SHADER,n.HIGH_FLOAT).precision>0&&n.getShaderPrecisionFormat(n.FRAGMENT_SHADER,n.HIGH_FLOAT).precision>0)return"highp";R="mediump"}return R==="mediump"&&n.getShaderPrecisionFormat(n.VERTEX_SHADER,n.MEDIUM_FLOAT).precision>0&&n.getShaderPrecisionFormat(n.FRAGMENT_SHADER,n.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let c=t.precision!==void 0?t.precision:"highp",u=l(c);u!==c&&(Qe("WebGLRenderer:",c,"not supported, using",u,"instead."),c=u);let d=t.logarithmicDepthBuffer===!0,h=t.reversedDepthBuffer===!0&&e.has("EXT_clip_control");t.reversedDepthBuffer===!0&&h===!1&&Qe("WebGLRenderer: Unable to use reversed depth buffer due to missing EXT_clip_control extension. Fallback to default depth buffer.");let f=n.getParameter(n.MAX_TEXTURE_IMAGE_UNITS),g=n.getParameter(n.MAX_VERTEX_TEXTURE_IMAGE_UNITS),y=n.getParameter(n.MAX_TEXTURE_SIZE),m=n.getParameter(n.MAX_CUBE_MAP_TEXTURE_SIZE),p=n.getParameter(n.MAX_VERTEX_ATTRIBS),b=n.getParameter(n.MAX_VERTEX_UNIFORM_VECTORS),S=n.getParameter(n.MAX_VARYING_VECTORS),_=n.getParameter(n.MAX_FRAGMENT_UNIFORM_VECTORS),A=n.getParameter(n.MAX_SAMPLES),T=n.getParameter(n.SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:s,getMaxPrecision:l,textureFormatReadable:o,textureTypeReadable:a,precision:c,logarithmicDepthBuffer:d,reversedDepthBuffer:h,maxTextures:f,maxVertexTextures:g,maxTextureSize:y,maxCubemapSize:m,maxAttributes:p,maxVertexUniforms:b,maxVaryings:S,maxFragmentUniforms:_,maxSamples:A,samples:T}}function BA(n){let e=this,t=null,i=0,r=!1,s=!1,o=new sr,a=new ut,l={value:null,needsUpdate:!1};this.uniform=l,this.numPlanes=0,this.numIntersection=0,this.init=function(d,h){let f=d.length!==0||h||i!==0||r;return r=h,i=d.length,f},this.beginShadows=function(){s=!0,u(null)},this.endShadows=function(){s=!1},this.setGlobalState=function(d,h){t=u(d,h,0)},this.setState=function(d,h,f){let g=d.clippingPlanes,y=d.clipIntersection,m=d.clipShadows,p=n.get(d);if(!r||g===null||g.length===0||s&&!m)s?u(null):c();else{let b=s?0:i,S=b*4,_=p.clippingState||null;l.value=_,_=u(g,h,S,f);for(let A=0;A!==S;++A)_[A]=t[A];p.clippingState=_,this.numIntersection=y?this.numPlanes:0,this.numPlanes+=b}};function c(){l.value!==t&&(l.value=t,l.needsUpdate=i>0),e.numPlanes=i,e.numIntersection=0}function u(d,h,f,g){let y=d!==null?d.length:0,m=null;if(y!==0){if(m=l.value,g!==!0||m===null){let p=f+y*4,b=h.matrixWorldInverse;a.getNormalMatrix(b),(m===null||m.length<p)&&(m=new Float32Array(p));for(let S=0,_=f;S!==y;++S,_+=4)o.copy(d[S]).applyMatrix4(b,a),o.normal.toArray(m,_),m[_+3]=o.constant}l.value=m,l.needsUpdate=!0}return e.numPlanes=y,e.numIntersection=0,m}}var Ia=4,kA=6,zA=20,VA=256,vc=new es,fy=new St,Km=null,Jm=0,Qm=0,e0=!1,GA=new C,So=new C,jd=class{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._sizeLods=[],this._lodMeshes=[],this._backgroundBox=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._blurMaterial=null,this._ggxMaterial=null}fromScene(e,t=0,i=.1,r=100,s={}){let{size:o=256,position:a=GA}=s;Km=this._renderer.getRenderTarget(),Jm=this._renderer.getActiveCubeFace(),Qm=this._renderer.getActiveMipmapLevel(),e0=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(o);let l=this._allocateTargets();return l.depthBuffer=!0,this._sceneToCubeUV(e,i,r,l,a),t>0&&this._blur(l,0,0,t),this._applyPMREM(l),this._cleanup(l),l}fromEquirectangular(e,t=null){return this._fromTexture(e,t)}fromCubemap(e,t=null){return this._fromTexture(e,t)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=gy(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=my(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose(),this._backgroundBox!==null&&(this._backgroundBox.geometry.dispose(),this._backgroundBox.material.dispose())}_setSize(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._ggxMaterial!==null&&this._ggxMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let e=0;e<this._lodMeshes.length;e++)this._lodMeshes[e].geometry.dispose()}_cleanup(e){this._renderer.setRenderTarget(Km,Jm,Qm),this._renderer.xr.enabled=e0,e.scissorTest=!1,Ca(e,0,0,e.width,e.height)}_fromTexture(e,t){e.mapping===Ns||e.mapping===Mo?this._setSize(e.image.length===0?16:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4),Km=this._renderer.getRenderTarget(),Jm=this._renderer.getActiveCubeFace(),Qm=this._renderer.getActiveMipmapLevel(),e0=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;let i=t||this._allocateTargets();return this._textureToCubeUV(e,i),this._applyPMREM(i),this._cleanup(i),i}_allocateTargets(){let e=3*Math.max(this._cubeSize,112),t=4*this._cubeSize,i={magFilter:At,minFilter:At,generateMipmaps:!1,type:Kn,format:Hn,colorSpace:xo,depthBuffer:!1},r=py(e,t,i);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==e||this._pingPongRenderTarget.height!==t){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=py(e,t,i);let{_lodMax:s}=this;({lodMeshes:this._lodMeshes,sizeLods:this._sizeLods}=HA(s)),this._blurMaterial=XA(s,e,t),this._ggxMaterial=WA(s,e,t)}return r}_compileMaterial(e){let t=new Vt(new xn,e);this._renderer.compile(t,vc)}_sceneToCubeUV(e,t,i,r,s){let l=new jn(90,1,t,i),c=[1,-1,1,1,1,1],u=[1,1,1,-1,-1,-1],d=this._renderer,h=d.autoClear,f=d.toneMapping;d.getClearColor(fy),d.toneMapping=Ri,d.autoClear=!1,d.state.buffers.depth.getReversed()&&(d.setRenderTarget(r),d.clearDepth(),d.setRenderTarget(null)),this._backgroundBox===null&&(this._backgroundBox=new Vt(new Sa,new Yl({name:"PMREM.Background",side:li,depthWrite:!1,depthTest:!1})));let y=this._backgroundBox,m=y.material,p=!1,b=e.background;b?b.isColor&&(m.color.copy(b),e.background=null,p=!0):(m.color.copy(fy),p=!0);for(let S=0;S<6;S++){let _=S%3;_===0?(l.up.set(0,c[S],0),l.position.set(s.x,s.y,s.z),l.lookAt(s.x+u[S],s.y,s.z)):_===1?(l.up.set(0,0,c[S]),l.position.set(s.x,s.y,s.z),l.lookAt(s.x,s.y+u[S],s.z)):(l.up.set(0,c[S],0),l.position.set(s.x,s.y,s.z),l.lookAt(s.x,s.y,s.z+u[S]));let A=this._cubeSize;Ca(r,_*A,S>2?A:0,A,A),d.setRenderTarget(r),p&&d.render(y,l),d.render(e,l)}d.toneMapping=f,d.autoClear=h,e.background=b}_textureToCubeUV(e,t){let i=this._renderer,r=e.mapping===Ns||e.mapping===Mo;r?(this._cubemapMaterial===null&&(this._cubemapMaterial=gy()),this._cubemapMaterial.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=my());let s=r?this._cubemapMaterial:this._equirectMaterial,o=this._lodMeshes[0];o.material=s;let a=s.uniforms;a.envMap.value=e;let l=this._cubeSize;Ca(t,0,0,3*l,2*l),i.setRenderTarget(t),i.render(o,vc)}_applyPMREM(e){let t=this._renderer,i=t.autoClear;t.autoClear=!1;let r=this._lodMeshes.length;for(let s=1;s<r;s++)this._applyGGXFilter(e,s-1,s);t.autoClear=i}_applyGGXFilter(e,t,i){let r=this._renderer,s=this._pingPongRenderTarget,o=this._ggxMaterial,a=this._lodMeshes[i];a.material=o;let l=o.uniforms,c=i/(this._lodMeshes.length-1),u=t/(this._lodMeshes.length-1),d=Math.sqrt(c*c-u*u),h=c*1.25,f=d*h,{_lodMax:g}=this,y=this._sizeLods[i],m=3*y*(i>g-Ia?i-g+Ia:0),p=4*(this._cubeSize-y);l.envMap.value=e.texture,l.roughness.value=f,l.mipInt.value=g-t,Ca(s,m,p,3*y,2*y),r.setRenderTarget(s),r.render(a,vc),l.envMap.value=s.texture,l.roughness.value=0,l.mipInt.value=g-i,Ca(e,m,p,3*y,2*y),r.setRenderTarget(e),r.render(a,vc)}_blur(e,t,i,r){let s=this._pingPongRenderTarget,o=Math.min(r,Math.PI)/Math.SQRT2;this._blurPass(e,s,t,i,o),this._blurPass(s,e,i,i,o)}_blurPass(e,t,i,r,s){let o=this._renderer,a=this._blurMaterial,l=this._lodMeshes[r];l.material=a;let c=a.uniforms;c.envMap.value=e.texture,c.sigma.value=s,c.mipInt.value=this._lodMax-i;let u=this._sizeLods[r],d=3*u*(r>this._lodMax-Ia?r-this._lodMax+Ia:0),h=4*(this._cubeSize-u);Ca(t,d,h,3*u,2*u),o.setRenderTarget(t),o.render(l,vc)}};function HA(n){let e=[],t=[],i=n,r=n-Ia+1+kA;for(let s=0;s<r;s++){let o=Math.pow(2,i);e.push(o);let a=1/(o-2),l=-a,c=1+a,u=[l,l,c,l,c,c,l,l,c,c,l,c],d=6,h=6,f=3,g=new Float32Array(f*h*d),y=new Float32Array(f*h*d);for(let p=0;p<d;p++){let b=p%3*2/3-1,S=p>2?0:-1,_=[b,S,0,b+2/3,S,0,b+2/3,S+1,0,b,S,0,b+2/3,S+1,0,b,S+1,0];g.set(_,f*h*p);for(let A=0;A<h;A++){let T=u[A*2]*2-1,R=u[A*2+1]*2-1;p===0?So.set(1,R,T):p===1?So.set(-T,1,-R):p===2?So.set(-T,R,1):p===3?So.set(-1,R,-T):p===4?So.set(-T,-1,R):So.set(T,R,-1),So.toArray(y,(p*h+A)*f)}}let m=new xn;m.setAttribute("position",new sn(g,f)),m.setAttribute("outputDirection",new sn(y,f)),t.push(new Vt(m,null)),i>Ia&&i--}return{lodMeshes:t,sizeLods:e}}function py(n,e,t){let i=new Tn(n,e,t);return i.texture.mapping=uc,i.texture.name="PMREM.cubeUv",i.scissorTest=!0,i}function Ca(n,e,t,i,r){n.viewport.set(e,t,i,r),n.scissor.set(e,t,i,r)}function WA(n,e,t){return new Pt({name:"PMREMGGXConvolution",defines:{GGX_SAMPLES:VA,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${n}.0`},uniforms:{envMap:{value:null},roughness:{value:0},mipInt:{value:0}},vertexShader:Jd(),fragmentShader:`

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
		`,blending:gi,depthTest:!1,depthWrite:!1})}function XA(n,e,t){return new Pt({name:"SphericalGaussianBlur",defines:{SAMPLES:zA,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${n}.0`},uniforms:{envMap:{value:null},sigma:{value:0},mipInt:{value:0}},vertexShader:Jd(),fragmentShader:`

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
		`,blending:gi,depthTest:!1,depthWrite:!1})}function my(){return new Pt({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:Jd(),fragmentShader:`

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
		`,blending:gi,depthTest:!1,depthWrite:!1})}function gy(){return new Pt({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:Jd(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:gi,depthTest:!1,depthWrite:!1})}function Jd(){return`

		precision mediump float;
		precision mediump int;

		attribute vec3 outputDirection;

		varying vec3 vOutputDirection;

		void main() {

			vOutputDirection = outputDirection;
			gl_Position = vec4( position, 1.0 );

		}
	`}var Zd=class extends Tn{constructor(e=1,t={}){super(e,e,t),this.isWebGLCubeRenderTarget=!0;let i={width:e,height:e,depth:1},r=[i,i,i,i,i,i];this.texture=new Ql(r),this._setTextureOptions(t),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(e,t){this.texture.type=t.type,this.texture.colorSpace=t.colorSpace,this.texture.generateMipmaps=t.generateMipmaps,this.texture.minFilter=t.minFilter,this.texture.magFilter=t.magFilter;let i={uniforms:{tEquirect:{value:null}},vertexShader:`

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
			`},r=new Sa(5,5,5),s=new Pt({name:"CubemapFromEquirect",uniforms:bo(i.uniforms),vertexShader:i.vertexShader,fragmentShader:i.fragmentShader,side:li,blending:gi});s.uniforms.tEquirect.value=t;let o=new Vt(r,s),a=t.minFilter;return t.minFilter===Os&&(t.minFilter=At),new td(1,10,this).update(e,o),t.minFilter=a,o.geometry.dispose(),o.material.dispose(),this}clear(e,t=!0,i=!0,r=!0){let s=e.getRenderTarget();for(let o=0;o<6;o++)e.setRenderTarget(this,o),e.clear(t,i,r);e.setRenderTarget(s)}};function $A(n){let e=new WeakMap,t=new WeakMap,i=null;function r(h,f=!1){return h==null?null:f?o(h):s(h)}function s(h){if(h&&h.isTexture){let f=h.mapping;if(f===sd||f===od)if(e.has(h)){let g=e.get(h).texture;return a(g,h.mapping)}else{let g=h.image;if(g&&g.height>0){let y=new Zd(g.height);return y.fromEquirectangularTexture(n,h),e.set(h,y),h.addEventListener("dispose",c),a(y.texture,h.mapping)}else return null}}return h}function o(h){if(h&&h.isTexture){let f=h.mapping,g=f===sd||f===od,y=f===Ns||f===Mo;if(g||y){let m=t.get(h),p=m!==void 0?m.texture.pmremVersion:0;if(h.isRenderTargetTexture&&h.pmremVersion!==p)return i===null&&(i=new jd(n)),m=g?i.fromEquirectangular(h,m):i.fromCubemap(h,m),m.texture.pmremVersion=h.pmremVersion,t.set(h,m),m.texture;if(m!==void 0)return m.texture;{let b=h.image;return g&&b&&b.height>0||y&&b&&l(b)?(i===null&&(i=new jd(n)),m=g?i.fromEquirectangular(h):i.fromCubemap(h),m.texture.pmremVersion=h.pmremVersion,t.set(h,m),h.addEventListener("dispose",u),m.texture):null}}}return h}function a(h,f){return f===sd?h.mapping=Ns:f===od&&(h.mapping=Mo),h}function l(h){let f=0,g=6;for(let y=0;y<g;y++)h[y]!==void 0&&f++;return f===g}function c(h){let f=h.target;f.removeEventListener("dispose",c);let g=e.get(f);g!==void 0&&(e.delete(f),g.dispose())}function u(h){let f=h.target;f.removeEventListener("dispose",u);let g=t.get(f);g!==void 0&&(t.delete(f),g.dispose())}function d(){e=new WeakMap,t=new WeakMap,i!==null&&(i.dispose(),i=null)}return{get:r,dispose:d}}function YA(n){let e={};function t(i){if(e[i]!==void 0)return e[i];let r=n.getExtension(i);return e[i]=r,r}return{has:function(i){return t(i)!==null},init:function(){t("EXT_color_buffer_float"),t("WEBGL_clip_cull_distance"),t("OES_texture_float_linear"),t("EXT_color_buffer_half_float"),t("WEBGL_multisampled_render_to_texture"),t("WEBGL_render_shared_exponent")},get:function(i){let r=t(i);return r===null&&go("WebGLRenderer: "+i+" extension not supported."),r}}}function qA(n,e,t,i){let r={},s=new WeakMap;function o(d){let h=d.target;h.index!==null&&e.remove(h.index);for(let g in h.attributes)e.remove(h.attributes[g]);h.removeEventListener("dispose",o),delete r[h.id];let f=s.get(h);f&&(e.remove(f),s.delete(h)),i.releaseStatesOfGeometry(h),h.isInstancedBufferGeometry===!0&&delete h._maxInstanceCount,t.memory.geometries--}function a(d,h){return r[h.id]===!0||(h.addEventListener("dispose",o),r[h.id]=!0,t.memory.geometries++),h}function l(d){let h=d.attributes;for(let f in h)e.update(h[f],n.ARRAY_BUFFER)}function c(d){let h=[],f=d.index,g=d.attributes.position,y=0;if(g===void 0)return;if(f!==null){let b=f.array;y=f.version;for(let S=0,_=b.length;S<_;S+=3){let A=b[S+0],T=b[S+1],R=b[S+2];h.push(A,T,T,R,R,A)}}else{let b=g.array;y=g.version;for(let S=0,_=b.length/3-1;S<_;S+=3){let A=S+0,T=S+1,R=S+2;h.push(A,T,T,R,R,A)}}let m=new(g.count>=65535?$l:Xl)(h,1);m.version=y;let p=s.get(d);p&&e.remove(p),s.set(d,m)}function u(d){let h=s.get(d);if(h){let f=d.index;f!==null&&h.version<f.version&&c(d)}else c(d);return s.get(d)}return{get:a,update:l,getWireframeAttribute:u}}function jA(n,e,t){let i;function r(d){i=d}let s,o;function a(d){s=d.type,o=d.bytesPerElement}function l(d,h){n.drawElements(i,h,s,d*o),t.update(h,i,1)}function c(d,h,f){f!==0&&(n.drawElementsInstanced(i,h,s,d*o,f),t.update(h,i,f))}function u(d,h,f){if(f===0)return;e.get("WEBGL_multi_draw").multiDrawElementsWEBGL(i,h,0,s,d,0,f);let y=0;for(let m=0;m<f;m++)y+=h[m];t.update(y,i,1)}this.setMode=r,this.setIndex=a,this.render=l,this.renderInstances=c,this.renderMultiDraw=u}function ZA(n){let e={geometries:0,textures:0},t={frame:0,calls:0,triangles:0,points:0,lines:0};function i(s,o,a){switch(t.calls++,o){case n.TRIANGLES:t.triangles+=a*(s/3);break;case n.LINES:t.lines+=a*(s/2);break;case n.LINE_STRIP:t.lines+=a*(s-1);break;case n.LINE_LOOP:t.lines+=a*s;break;case n.POINTS:t.points+=a*s;break;default:nt("WebGLInfo: Unknown draw mode:",o);break}}function r(){t.calls=0,t.triangles=0,t.points=0,t.lines=0}return{memory:e,render:t,programs:null,autoReset:!0,reset:r,update:i}}function KA(n,e,t){let i=new WeakMap,r=new en;function s(o,a,l){let c=o.morphTargetInfluences,u=a.morphAttributes.position||a.morphAttributes.normal||a.morphAttributes.color,d=u!==void 0?u.length:0,h=i.get(a);if(h===void 0||h.count!==d){let w=function(){R.dispose(),i.delete(a),a.removeEventListener("dispose",w)};h!==void 0&&h.texture.dispose();let f=a.morphAttributes.position!==void 0,g=a.morphAttributes.normal!==void 0,y=a.morphAttributes.color!==void 0,m=a.morphAttributes.position||[],p=a.morphAttributes.normal||[],b=a.morphAttributes.color||[],S=0;f===!0&&(S=1),g===!0&&(S=2),y===!0&&(S=3);let _=a.attributes.position.count*S,A=1;_>e.maxTextureSize&&(A=Math.ceil(_/e.maxTextureSize),_=e.maxTextureSize);let T=new Float32Array(_*A*4*d),R=new Wl(T,_,A,d);R.type=Hi,R.needsUpdate=!0;let x=S*4;for(let I=0;I<d;I++){let D=m[I],F=p[I],z=b[I],N=_*A*4*I;for(let V=0;V<D.count;V++){let K=V*x;f===!0&&(r.fromBufferAttribute(D,V),T[N+K+0]=r.x,T[N+K+1]=r.y,T[N+K+2]=r.z,T[N+K+3]=0),g===!0&&(r.fromBufferAttribute(F,V),T[N+K+4]=r.x,T[N+K+5]=r.y,T[N+K+6]=r.z,T[N+K+7]=0),y===!0&&(r.fromBufferAttribute(z,V),T[N+K+8]=r.x,T[N+K+9]=r.y,T[N+K+10]=r.z,T[N+K+11]=z.itemSize===4?r.w:1)}}h={count:d,texture:R,size:new it(_,A)},i.set(a,h),a.addEventListener("dispose",w)}if(o.isInstancedMesh===!0&&o.morphTexture!==null)l.getUniforms().setValue(n,"morphTexture",o.morphTexture,t);else{let f=0;for(let y=0;y<c.length;y++)f+=c[y];let g=a.morphTargetsRelative?1:1-f;l.getUniforms().setValue(n,"morphTargetBaseInfluence",g),l.getUniforms().setValue(n,"morphTargetInfluences",c)}l.getUniforms().setValue(n,"morphTargetsTexture",h.texture,t),l.getUniforms().setValue(n,"morphTargetsTextureSize",h.size)}return{update:s}}function JA(n,e,t,i,r){let s=new WeakMap;function o(c){let u=r.render.frame,d=c.geometry,h=e.get(c,d);if(s.get(h)!==u&&(e.update(h),s.set(h,u)),c.isInstancedMesh&&(c.hasEventListener("dispose",l)===!1&&c.addEventListener("dispose",l),s.get(c)!==u&&(t.update(c.instanceMatrix,n.ARRAY_BUFFER),c.instanceColor!==null&&t.update(c.instanceColor,n.ARRAY_BUFFER),s.set(c,u))),c.isSkinnedMesh){let f=c.skeleton;s.get(f)!==u&&(f.update(),s.set(f,u))}return h}function a(){s=new WeakMap}function l(c){let u=c.target;u.removeEventListener("dispose",l),i.releaseStatesOfObject(u),t.remove(u.instanceMatrix),u.instanceColor!==null&&t.remove(u.instanceColor)}return{update:o,dispose:a}}var QA={[wm]:"LINEAR_TONE_MAPPING",[Em]:"REINHARD_TONE_MAPPING",[Am]:"CINEON_TONE_MAPPING",[Tm]:"ACES_FILMIC_TONE_MAPPING",[Cm]:"AGX_TONE_MAPPING",[Im]:"NEUTRAL_TONE_MAPPING",[Rm]:"CUSTOM_TONE_MAPPING"};function eT(n,e,t,i,r,s){let o=new Tn(e,t,{type:n,depthBuffer:r,stencilBuffer:s,samples:i?4:0,storeMultisampledDepthBuffer:!1,storeMultisampledStencilBuffer:!1,resolveDepthBuffer:!1,resolveStencilBuffer:!1}),a=null,l=null,c=new xn;c.setAttribute("position",new zt([-1,3,0,-1,-1,0,3,-1,0],3)),c.setAttribute("uv",new zt([0,2,0,0,2,0],2));let u=new Gh({uniforms:{tDiffuse:{value:null}},vertexShader:`
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
			}`,depthTest:!1,depthWrite:!1}),d=new Vt(c,u),h=new es(-1,1,1,-1,0,1),f=null,g=null,y=!1,m,p=null,b=[],S=!1;this.setSize=function(_,A){o.setSize(_,A),a!==null&&a.setSize(_,A),l!==null&&l.setSize(_,A);for(let T=0;T<b.length;T++){let R=b[T];R.setSize&&R.setSize(_,A)}},this.setEffects=function(_){b=_,S=b.length>0&&b[0].isRenderPass===!0;let A=o.width,T=o.height;b.length>0&&a===null&&(a=new Tn(A,T,{type:Kn,depthBuffer:!1,stencilBuffer:!1}),l=new Tn(A,T,{type:Kn,depthBuffer:!1,stencilBuffer:!1}));for(let R=0;R<b.length;R++){let x=b[R];x.setSize&&x.setSize(A,T)}},this.begin=function(_,A){if(y||_.toneMapping===Ri&&b.length===0)return!1;if(p=A,A!==null){let T=A.width,R=A.height;(o.width!==T||o.height!==R)&&this.setSize(T,R)}return S===!1&&_.setRenderTarget(o),m=_.toneMapping,_.toneMapping=Ri,!0},this.hasRenderPass=function(){return S},this.end=function(_,A){_.toneMapping=m,y=!0;let T=o,R=a;for(let x=0;x<b.length;x++){let w=b[x];w.enabled!==!1&&(w.render(_,R,T,A),w.needsSwap!==!1&&(T=R,R=R===a?l:a))}if(f!==_.outputColorSpace||g!==_.toneMapping){f=_.outputColorSpace,g=_.toneMapping,u.defines={},yt.getTransfer(f)===kt&&(u.defines.SRGB_TRANSFER="");let x=QA[g];x&&(u.defines[x]=""),u.needsUpdate=!0}u.uniforms.tDiffuse.value=T.texture,_.setRenderTarget(p),_.render(d,h),p=null,y=!1},this.isCompositing=function(){return y},this.dispose=function(){o.dispose(),a!==null&&a.dispose(),l!==null&&l.dispose(),c.dispose(),u.dispose()}}var Fy=new oi,i0=new Is(1,1),Uy=new Wl,By=new Dh,ky=new Ql,xy=[],vy=[],yy=new Float32Array(16),_y=new Float32Array(9),My=new Float32Array(4);function La(n,e,t){let i=n[0];if(i<=0||i>0)return n;let r=e*t,s=xy[r];if(s===void 0&&(s=new Float32Array(r),xy[r]=s),e!==0){i.toArray(s,0);for(let o=1,a=0;o!==e;++o)a+=t,n[o].toArray(s,a)}return s}function Ln(n,e){if(n.length!==e.length)return!1;for(let t=0,i=n.length;t<i;t++)if(n[t]!==e[t])return!1;return!0}function Dn(n,e){for(let t=0,i=e.length;t<i;t++)n[t]=e[t]}function Qd(n,e){let t=vy[e];t===void 0&&(t=new Int32Array(e),vy[e]=t);for(let i=0;i!==e;++i)t[i]=n.allocateTextureUnit();return t}function tT(n,e){let t=this.cache;t[0]!==e&&(n.uniform1f(this.addr,e),t[0]=e)}function nT(n,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(n.uniform2f(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Ln(t,e))return;n.uniform2fv(this.addr,e),Dn(t,e)}}function iT(n,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(n.uniform3f(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else if(e.r!==void 0)(t[0]!==e.r||t[1]!==e.g||t[2]!==e.b)&&(n.uniform3f(this.addr,e.r,e.g,e.b),t[0]=e.r,t[1]=e.g,t[2]=e.b);else{if(Ln(t,e))return;n.uniform3fv(this.addr,e),Dn(t,e)}}function rT(n,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(n.uniform4f(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Ln(t,e))return;n.uniform4fv(this.addr,e),Dn(t,e)}}function sT(n,e){let t=this.cache,i=e.elements;if(i===void 0){if(Ln(t,e))return;n.uniformMatrix2fv(this.addr,!1,e),Dn(t,e)}else{if(Ln(t,i))return;My.set(i),n.uniformMatrix2fv(this.addr,!1,My),Dn(t,i)}}function oT(n,e){let t=this.cache,i=e.elements;if(i===void 0){if(Ln(t,e))return;n.uniformMatrix3fv(this.addr,!1,e),Dn(t,e)}else{if(Ln(t,i))return;_y.set(i),n.uniformMatrix3fv(this.addr,!1,_y),Dn(t,i)}}function aT(n,e){let t=this.cache,i=e.elements;if(i===void 0){if(Ln(t,e))return;n.uniformMatrix4fv(this.addr,!1,e),Dn(t,e)}else{if(Ln(t,i))return;yy.set(i),n.uniformMatrix4fv(this.addr,!1,yy),Dn(t,i)}}function lT(n,e){let t=this.cache;t[0]!==e&&(n.uniform1i(this.addr,e),t[0]=e)}function cT(n,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(n.uniform2i(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Ln(t,e))return;n.uniform2iv(this.addr,e),Dn(t,e)}}function uT(n,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(n.uniform3i(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(Ln(t,e))return;n.uniform3iv(this.addr,e),Dn(t,e)}}function hT(n,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(n.uniform4i(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Ln(t,e))return;n.uniform4iv(this.addr,e),Dn(t,e)}}function dT(n,e){let t=this.cache;t[0]!==e&&(n.uniform1ui(this.addr,e),t[0]=e)}function fT(n,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(n.uniform2ui(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Ln(t,e))return;n.uniform2uiv(this.addr,e),Dn(t,e)}}function pT(n,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(n.uniform3ui(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(Ln(t,e))return;n.uniform3uiv(this.addr,e),Dn(t,e)}}function mT(n,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(n.uniform4ui(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Ln(t,e))return;n.uniform4uiv(this.addr,e),Dn(t,e)}}function gT(n,e,t){let i=this.cache,r=t.allocateTextureUnit();i[0]!==r&&(n.uniform1i(this.addr,r),i[0]=r);let s;this.type===n.SAMPLER_2D_SHADOW?(i0.compareFunction=t.isReversedDepthBuffer()?$d:Xd,s=i0):s=Fy,t.setTexture2D(e||s,r)}function xT(n,e,t){let i=this.cache,r=t.allocateTextureUnit();i[0]!==r&&(n.uniform1i(this.addr,r),i[0]=r),t.setTexture3D(e||By,r)}function vT(n,e,t){let i=this.cache,r=t.allocateTextureUnit();i[0]!==r&&(n.uniform1i(this.addr,r),i[0]=r),t.setTextureCube(e||ky,r)}function yT(n,e,t){let i=this.cache,r=t.allocateTextureUnit();i[0]!==r&&(n.uniform1i(this.addr,r),i[0]=r),t.setTexture2DArray(e||Uy,r)}function _T(n){switch(n){case 5126:return tT;case 35664:return nT;case 35665:return iT;case 35666:return rT;case 35674:return sT;case 35675:return oT;case 35676:return aT;case 5124:case 35670:return lT;case 35667:case 35671:return cT;case 35668:case 35672:return uT;case 35669:case 35673:return hT;case 5125:return dT;case 36294:return fT;case 36295:return pT;case 36296:return mT;case 35678:case 36198:case 36298:case 36306:case 35682:return gT;case 35679:case 36299:case 36307:return xT;case 35680:case 36300:case 36308:case 36293:return vT;case 36289:case 36303:case 36311:case 36292:return yT}}function MT(n,e){n.uniform1fv(this.addr,e)}function bT(n,e){let t=La(e,this.size,2);n.uniform2fv(this.addr,t)}function ST(n,e){let t=La(e,this.size,3);n.uniform3fv(this.addr,t)}function wT(n,e){let t=La(e,this.size,4);n.uniform4fv(this.addr,t)}function ET(n,e){let t=La(e,this.size,4);n.uniformMatrix2fv(this.addr,!1,t)}function AT(n,e){let t=La(e,this.size,9);n.uniformMatrix3fv(this.addr,!1,t)}function TT(n,e){let t=La(e,this.size,16);n.uniformMatrix4fv(this.addr,!1,t)}function RT(n,e){n.uniform1iv(this.addr,e)}function CT(n,e){n.uniform2iv(this.addr,e)}function IT(n,e){n.uniform3iv(this.addr,e)}function PT(n,e){n.uniform4iv(this.addr,e)}function LT(n,e){n.uniform1uiv(this.addr,e)}function DT(n,e){n.uniform2uiv(this.addr,e)}function NT(n,e){n.uniform3uiv(this.addr,e)}function OT(n,e){n.uniform4uiv(this.addr,e)}function FT(n,e,t){let i=this.cache,r=e.length,s=Qd(t,r);Ln(i,s)||(n.uniform1iv(this.addr,s),Dn(i,s));let o;this.type===n.SAMPLER_2D_SHADOW?o=i0:o=Fy;for(let a=0;a!==r;++a)t.setTexture2D(e[a]||o,s[a])}function UT(n,e,t){let i=this.cache,r=e.length,s=Qd(t,r);Ln(i,s)||(n.uniform1iv(this.addr,s),Dn(i,s));for(let o=0;o!==r;++o)t.setTexture3D(e[o]||By,s[o])}function BT(n,e,t){let i=this.cache,r=e.length,s=Qd(t,r);Ln(i,s)||(n.uniform1iv(this.addr,s),Dn(i,s));for(let o=0;o!==r;++o)t.setTextureCube(e[o]||ky,s[o])}function kT(n,e,t){let i=this.cache,r=e.length,s=Qd(t,r);Ln(i,s)||(n.uniform1iv(this.addr,s),Dn(i,s));for(let o=0;o!==r;++o)t.setTexture2DArray(e[o]||Uy,s[o])}function zT(n){switch(n){case 5126:return MT;case 35664:return bT;case 35665:return ST;case 35666:return wT;case 35674:return ET;case 35675:return AT;case 35676:return TT;case 5124:case 35670:return RT;case 35667:case 35671:return CT;case 35668:case 35672:return IT;case 35669:case 35673:return PT;case 5125:return LT;case 36294:return DT;case 36295:return NT;case 36296:return OT;case 35678:case 36198:case 36298:case 36306:case 35682:return FT;case 35679:case 36299:case 36307:return UT;case 35680:case 36300:case 36308:case 36293:return BT;case 36289:case 36303:case 36311:case 36292:return kT}}var r0=class{constructor(e,t,i){this.id=e,this.addr=i,this.cache=[],this.type=t.type,this.setValue=_T(t.type)}},s0=class{constructor(e,t,i){this.id=e,this.addr=i,this.cache=[],this.type=t.type,this.size=t.size,this.setValue=zT(t.type)}},o0=class{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,t,i){let r=this.seq;for(let s=0,o=r.length;s!==o;++s){let a=r[s];a.setValue(e,t[a.id],i)}}},t0=/(\w+)(\])?(\[|\.)?/g;function by(n,e){n.seq.push(e),n.map[e.id]=e}function VT(n,e,t){let i=n.name,r=i.length;for(t0.lastIndex=0;;){let s=t0.exec(i),o=t0.lastIndex,a=s[1],l=s[2]==="]",c=s[3];if(l&&(a=a|0),c===void 0||c==="["&&o+2===r){by(t,c===void 0?new r0(a,n,e):new s0(a,n,e));break}else{let d=t.map[a];d===void 0&&(d=new o0(a),by(t,d)),t=d}}}var Pa=class{constructor(e,t){this.seq=[],this.map={};let i=e.getProgramParameter(t,e.ACTIVE_UNIFORMS);for(let o=0;o<i;++o){let a=e.getActiveUniform(t,o),l=e.getUniformLocation(t,a.name);VT(a,l,this)}let r=[],s=[];for(let o of this.seq)o.type===e.SAMPLER_2D_SHADOW||o.type===e.SAMPLER_CUBE_SHADOW||o.type===e.SAMPLER_2D_ARRAY_SHADOW?r.push(o):s.push(o);r.length>0&&(this.seq=r.concat(s))}setValue(e,t,i,r){let s=this.map[t];s!==void 0&&s.setValue(e,i,r)}setOptional(e,t,i){let r=t[i];r!==void 0&&this.setValue(e,i,r)}static upload(e,t,i,r){for(let s=0,o=t.length;s!==o;++s){let a=t[s],l=i[a.id];l.needsUpdate!==!1&&a.setValue(e,l.value,r)}}static seqWithValue(e,t){let i=[];for(let r=0,s=e.length;r!==s;++r){let o=e[r];o.id in t&&i.push(o)}return i}};function Sy(n,e,t){let i=n.createShader(e);return n.shaderSource(i,t),n.compileShader(i),i}var GT=37297,HT=0;function WT(n,e){let t=n.split(`
`),i=[],r=Math.max(e-6,0),s=Math.min(e+6,t.length);for(let o=r;o<s;o++){let a=o+1;i.push(`${a===e?">":" "} ${a}: ${t[o]}`)}return i.join(`
`)}var wy=new ut;function XT(n){yt._getMatrix(wy,yt.workingColorSpace,n);let e=`mat3( ${wy.elements.map(t=>t.toFixed(4))} )`;switch(yt.getTransfer(n)){case zl:return[e,"LinearTransferOETF"];case kt:return[e,"sRGBTransferOETF"];default:return Qe("WebGLProgram: Unsupported color space: ",n),[e,"LinearTransferOETF"]}}function Ey(n,e,t){let i=n.getShaderParameter(e,n.COMPILE_STATUS),s=(n.getShaderInfoLog(e)||"").trim();if(i&&s==="")return"";let o=/ERROR: 0:(\d+)/.exec(s);if(o){let a=parseInt(o[1]);return t.toUpperCase()+`

`+s+`

`+WT(n.getShaderSource(e),a)}else return s}function $T(n,e){let t=XT(e);return[`vec4 ${n}( vec4 value ) {`,`	return ${t[1]}( vec4( value.rgb * ${t[0]}, value.a ) );`,"}"].join(`
`)}var YT={[wm]:"Linear",[Em]:"Reinhard",[Am]:"Cineon",[Tm]:"ACESFilmic",[Cm]:"AgX",[Im]:"Neutral",[Rm]:"Custom"};function qT(n,e){let t=YT[e];return t===void 0?(Qe("WebGLProgram: Unsupported toneMapping:",e),"vec3 "+n+"( vec3 color ) { return LinearToneMapping( color ); }"):"vec3 "+n+"( vec3 color ) { return "+t+"ToneMapping( color ); }"}var qd=new C;function jT(){yt.getLuminanceCoefficients(qd);let n=qd.x.toFixed(4),e=qd.y.toFixed(4),t=qd.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${n}, ${e}, ${t} );`,"	return dot( weights, rgb );","}"].join(`
`)}function ZT(n){return[n.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",n.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(_c).join(`
`)}function KT(n){let e=[];for(let t in n){let i=n[t];i!==!1&&e.push("#define "+t+" "+i)}return e.join(`
`)}function JT(n,e){let t={},i=n.getProgramParameter(e,n.ACTIVE_ATTRIBUTES);for(let r=0;r<i;r++){let s=n.getActiveAttrib(e,r),o=s.name,a=1;s.type===n.FLOAT_MAT2&&(a=2),s.type===n.FLOAT_MAT3&&(a=3),s.type===n.FLOAT_MAT4&&(a=4),t[o]={type:s.type,location:n.getAttribLocation(e,o),locationSize:a}}return t}function _c(n){return n!==""}function Ay(n,e){let t=e.numSpotLightShadows+e.numSpotLightMaps-e.numSpotLightShadowsWithMaps;return n.replace(/NUM_SUN_LIGHTS/g,e.numSunLights).replace(/NUM_DIR_LIGHTS/g,e.numDirLights).replace(/NUM_SPOT_LIGHTS/g,e.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,e.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,t).replace(/NUM_RECT_AREA_LIGHTS/g,e.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,e.numPointLights).replace(/NUM_HEMI_LIGHTS/g,e.numHemiLights).replace(/NUM_SUN_LIGHT_SHADOWS/g,e.numSunLightShadows).replace(/NUM_DIR_LIGHT_SHADOWS/g,e.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,e.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,e.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,e.numPointLightShadows)}function Ty(n,e){return n.replace(/NUM_CLIPPING_PLANES/g,e.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,e.numClippingPlanes-e.numClipIntersection)}var QT=/^[ \t]*#include +<([\w\d./]+)>/gm;function a0(n){return n.replace(QT,tR)}var eR=new Map;function tR(n,e){let t=mt[e];if(t===void 0){let i=eR.get(e);if(i!==void 0)t=mt[i],Qe('WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',e,i);else throw new Error("THREE.WebGLProgram: Can not resolve #include <"+e+">")}return a0(t)}var nR=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function Ry(n){return n.replace(nR,iR)}function iR(n,e,t,i){let r="";for(let s=parseInt(e);s<parseInt(t);s++)r+=i.replace(/\[\s*i\s*\]/g,"[ "+s+" ]").replace(/UNROLLED_LOOP_INDEX/g,s);return r}function Cy(n){let e=`precision ${n.precision} float;
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
#define LOW_PRECISION`),e}var rR={[lc]:"SHADOWMAP_TYPE_PCF",[Ea]:"SHADOWMAP_TYPE_VSM"};function sR(n){return rR[n.shadowMapType]||"SHADOWMAP_TYPE_BASIC"}var oR={[Ns]:"ENVMAP_TYPE_CUBE",[Mo]:"ENVMAP_TYPE_CUBE",[uc]:"ENVMAP_TYPE_CUBE_UV"};function aR(n){return n.envMap===!1?"ENVMAP_TYPE_CUBE":oR[n.envMapMode]||"ENVMAP_TYPE_CUBE"}var lR={[Mo]:"ENVMAP_MODE_REFRACTION"};function cR(n){return n.envMap===!1?"ENVMAP_MODE_REFLECTION":lR[n.envMapMode]||"ENVMAP_MODE_REFLECTION"}var uR={[Sm]:"ENVMAP_BLENDING_MULTIPLY",[Yv]:"ENVMAP_BLENDING_MIX",[qv]:"ENVMAP_BLENDING_ADD"};function hR(n){return n.envMap===!1?"ENVMAP_BLENDING_NONE":uR[n.combine]||"ENVMAP_BLENDING_NONE"}function dR(n){let e=n.envMapCubeUVHeight;if(e===null)return null;let t=Math.log2(e)-2,i=1/e;return{texelWidth:1/(3*Math.max(Math.pow(2,t),112)),texelHeight:i,maxMip:t}}function fR(n,e,t,i){let r=n.getContext(),s=t.defines,o=t.vertexShader,a=t.fragmentShader,l=sR(t),c=aR(t),u=cR(t),d=hR(t),h=dR(t),f=ZT(t),g=KT(s),y=r.createProgram(),m,p,b=t.glslVersion?"#version "+t.glslVersion+`
`:"";t.isRawShaderMaterial?(m=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g].filter(_c).join(`
`),m.length>0&&(m+=`
`),p=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g].filter(_c).join(`
`),p.length>0&&(p+=`
`)):(m=[Cy(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g,t.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",t.batching?"#define USE_BATCHING":"",t.batchingColor?"#define USE_BATCHING_COLOR":"",t.instancing?"#define USE_INSTANCING":"",t.instancingColor?"#define USE_INSTANCING_COLOR":"",t.instancingMorph?"#define USE_INSTANCING_MORPH":"",t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.map?"#define USE_MAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+u:"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.displacementMap?"#define USE_DISPLACEMENTMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.mapUv?"#define MAP_UV "+t.mapUv:"",t.alphaMapUv?"#define ALPHAMAP_UV "+t.alphaMapUv:"",t.lightMapUv?"#define LIGHTMAP_UV "+t.lightMapUv:"",t.aoMapUv?"#define AOMAP_UV "+t.aoMapUv:"",t.emissiveMapUv?"#define EMISSIVEMAP_UV "+t.emissiveMapUv:"",t.bumpMapUv?"#define BUMPMAP_UV "+t.bumpMapUv:"",t.normalMapUv?"#define NORMALMAP_UV "+t.normalMapUv:"",t.displacementMapUv?"#define DISPLACEMENTMAP_UV "+t.displacementMapUv:"",t.metalnessMapUv?"#define METALNESSMAP_UV "+t.metalnessMapUv:"",t.roughnessMapUv?"#define ROUGHNESSMAP_UV "+t.roughnessMapUv:"",t.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+t.anisotropyMapUv:"",t.clearcoatMapUv?"#define CLEARCOATMAP_UV "+t.clearcoatMapUv:"",t.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+t.clearcoatNormalMapUv:"",t.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+t.clearcoatRoughnessMapUv:"",t.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+t.iridescenceMapUv:"",t.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+t.iridescenceThicknessMapUv:"",t.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+t.sheenColorMapUv:"",t.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+t.sheenRoughnessMapUv:"",t.specularMapUv?"#define SPECULARMAP_UV "+t.specularMapUv:"",t.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+t.specularColorMapUv:"",t.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+t.specularIntensityMapUv:"",t.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+t.transmissionMapUv:"",t.thicknessMapUv?"#define THICKNESSMAP_UV "+t.thicknessMapUv:"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexNormals?"#define HAS_NORMAL":"",t.vertexColors?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.flatShading?"#define FLAT_SHADED":"",t.skinning?"#define USE_SKINNING":"",t.morphTargets?"#define USE_MORPHTARGETS":"",t.morphNormals&&t.flatShading===!1?"#define USE_MORPHNORMALS":"",t.morphColors?"#define USE_MORPHCOLORS":"",t.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+t.morphTextureStride:"",t.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+t.morphTargetsCount:"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.sizeAttenuation?"#define USE_SIZEATTENUATION":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(_c).join(`
`),p=[Cy(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g,t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",t.map?"#define USE_MAP":"",t.matcap?"#define USE_MATCAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+c:"",t.envMap?"#define "+u:"",t.envMap?"#define "+d:"",h?"#define CUBEUV_TEXEL_WIDTH "+h.texelWidth:"",h?"#define CUBEUV_TEXEL_HEIGHT "+h.texelHeight:"",h?"#define CUBEUV_MAX_MIP "+h.maxMip+".0":"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.packedNormalMap?"#define USE_PACKED_NORMALMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoat?"#define USE_CLEARCOAT":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.dispersion?"#define USE_DISPERSION":"",t.retroreflection?"#define USE_RETROREFLECTION":"",t.iridescence?"#define USE_IRIDESCENCE":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaTest?"#define USE_ALPHATEST":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.sheen?"#define USE_SHEEN":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors||t.instancingColor?"#define USE_COLOR":"",t.vertexAlphas||t.batchingColor?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.gradientMap?"#define USE_GRADIENTMAP":"",t.flatShading?"#define FLAT_SHADED":"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.numLightProbeGrids>0?"#define USE_LIGHT_PROBES_GRID":"",t.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",t.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",t.toneMapping!==Ri?"#define TONE_MAPPING":"",t.toneMapping!==Ri?mt.tonemapping_pars_fragment:"",t.toneMapping!==Ri?qT("toneMapping",t.toneMapping):"",t.dithering?"#define DITHERING":"",t.opaque?"#define OPAQUE":"",mt.colorspace_pars_fragment,$T("linearToOutputTexel",t.outputColorSpace),jT(),t.useDepthPacking?"#define DEPTH_PACKING "+t.depthPacking:"",`
`].filter(_c).join(`
`)),o=a0(o),o=Ay(o,t),o=Ty(o,t),a=a0(a),a=Ay(a,t),a=Ty(a,t),o=Ry(o),a=Ry(a),t.isRawShaderMaterial!==!0&&(b=`#version 300 es
`,m=[f,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+m,p=["#define varying in",t.glslVersion===zm?"":"layout(location = 0) out highp vec4 pc_fragColor;",t.glslVersion===zm?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+p);let S=b+m+o,_=b+p+a,A=Sy(r,r.VERTEX_SHADER,S),T=Sy(r,r.FRAGMENT_SHADER,_);r.attachShader(y,A),r.attachShader(y,T),t.index0AttributeName!==void 0?r.bindAttribLocation(y,0,t.index0AttributeName):t.hasPositionAttribute===!0&&r.bindAttribLocation(y,0,"position"),r.linkProgram(y);function R(D){if(n.debug.checkShaderErrors){let F=r.getProgramInfoLog(y)||"",z=r.getShaderInfoLog(A)||"",N=r.getShaderInfoLog(T)||"",V=F.trim(),K=z.trim(),$=N.trim(),J=!0,j=!0;if(r.getProgramParameter(y,r.LINK_STATUS)===!1)if(J=!1,typeof n.debug.onShaderError=="function")n.debug.onShaderError(r,y,A,T);else{let Q=Ey(r,A,"vertex"),ie=Ey(r,T,"fragment");nt("WebGLProgram: Shader Error "+r.getError()+" - VALIDATE_STATUS "+r.getProgramParameter(y,r.VALIDATE_STATUS)+`

Material Name: `+D.name+`
Material Type: `+D.type+`

Program Info Log: `+V+`
`+Q+`
`+ie)}else V!==""?Qe("WebGLProgram: Program Info Log:",V):(K===""||$==="")&&(j=!1);j&&(D.diagnostics={runnable:J,programLog:V,vertexShader:{log:K,prefix:m},fragmentShader:{log:$,prefix:p}})}r.deleteShader(A),r.deleteShader(T),x=new Pa(r,y),w=JT(r,y)}let x;this.getUniforms=function(){return x===void 0&&R(this),x};let w;this.getAttributes=function(){return w===void 0&&R(this),w};let I=t.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return I===!1&&(I=r.getProgramParameter(y,GT)),I},this.destroy=function(){i.releaseStatesOfProgram(this),r.deleteProgram(y),this.program=void 0},this.type=t.shaderType,this.name=t.shaderName,this.id=HT++,this.cacheKey=e,this.usedTimes=1,this.program=y,this.vertexShader=A,this.fragmentShader=T,this}var pR=0,l0=class{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e,t,i){let r=this._getShaderCacheForMaterial(e);return r.has(t)===!1&&(r.add(t),t.usedTimes++),r.has(i)===!1&&(r.add(i),i.usedTimes++),this}remove(e){let t=this.materialCache.get(e);for(let i of t)i.usedTimes--,i.usedTimes===0&&this.shaderCache.delete(i.code);return this.materialCache.delete(e),this}getVertexShaderStage(e){return this._getShaderStage(e.vertexShader)}getFragmentShaderStage(e){return this._getShaderStage(e.fragmentShader)}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){let t=this.materialCache,i=t.get(e);return i===void 0&&(i=new Set,t.set(e,i)),i}_getShaderStage(e){let t=this.shaderCache,i=t.get(e);return i===void 0&&(i=new c0(e),t.set(e,i)),i}},c0=class{constructor(e){this.id=pR++,this.code=e,this.usedTimes=0}};function mR(n){return n===Us||n===gc||n===xc}function gR(n,e,t,i,r,s){let o=new _a,a=new l0,l=new Set,c=[],u=new Map,d=i.logarithmicDepthBuffer,h=i.precision,f={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distance",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function g(x){return l.add(x),x===0?"uv":`uv${x}`}function y(x,w,I,D,F,z){let N=D.fog,V=F.geometry,K=x.isMeshStandardMaterial||x.isMeshLambertMaterial||x.isMeshPhongMaterial?D.environment:null,$=x.isMeshStandardMaterial||x.isMeshLambertMaterial&&!x.envMap||x.isMeshPhongMaterial&&!x.envMap,J=e.get(x.envMap||K,$),j=J&&J.mapping===uc?J.image.height:null,Q=f[x.type];x.precision!==null&&(h=i.getMaxPrecision(x.precision),h!==x.precision&&Qe("WebGLProgram.getParameters:",x.precision,"not supported, using",h,"instead."));let ie=V.morphAttributes.position||V.morphAttributes.normal||V.morphAttributes.color,Ve=ie!==void 0?ie.length:0,Ue=0;V.morphAttributes.position!==void 0&&(Ue=1),V.morphAttributes.normal!==void 0&&(Ue=2),V.morphAttributes.color!==void 0&&(Ue=3);let _t,lt,ot,Y;if(Q){let nn=Ar[Q];_t=nn.vertexShader,lt=nn.fragmentShader}else{_t=x.vertexShader,lt=x.fragmentShader;let nn=a.getVertexShaderStage(x),Ft=a.getFragmentShaderStage(x);a.update(x,nn,Ft),ot=nn.id,Y=Ft.id}let te=n.getRenderTarget(),be=n.state.buffers.depth.getReversed(),Ke=F.isInstancedMesh===!0,Ce=F.isBatchedMesh===!0,ge=!!x.map,ye=!!x.matcap,Le=!!J,$e=!!x.aoMap,wt=!!x.lightMap,we=!!x.bumpMap&&x.wireframe===!1,Ae=!!x.normalMap,tt=!!x.displacementMap,$t=!!x.emissiveMap,Wt=!!x.metalnessMap,Xt=!!x.roughnessMap,O=x.anisotropy>0,wn=x.clearcoat>0,gt=x.dispersion>0,P=x.retroreflectivity>0,v=x.iridescence>0,E=x.sheen>0,L=x.transmission>0,k=O&&!!x.anisotropyMap,se=wn&&!!x.clearcoatMap,he=wn&&!!x.clearcoatNormalMap,X=wn&&!!x.clearcoatRoughnessMap,Z=v&&!!x.iridescenceMap,me=v&&!!x.iridescenceThicknessMap,Fe=E&&!!x.sheenColorMap,re=E&&!!x.sheenRoughnessMap,ue=!!x.specularMap,Me=!!x.specularColorMap,Ge=!!x.specularIntensityMap,ht=L&&!!x.transmissionMap,B=L&&!!x.thicknessMap,Ee=!!x.gradientMap,ne=!!x.alphaMap,Te=x.alphaTest>0,Ne=!!x.alphaHash,le=!!x.extensions,Ye=Ri;x.toneMapped&&(te===null||te.isXRRenderTarget===!0)&&(Ye=n.toneMapping);let ze={shaderID:Q,shaderType:x.type,shaderName:x.name,vertexShader:_t,fragmentShader:lt,defines:x.defines,customVertexShaderID:ot,customFragmentShaderID:Y,isRawShaderMaterial:x.isRawShaderMaterial===!0,glslVersion:x.glslVersion,precision:h,batching:Ce,batchingColor:Ce&&F._colorsTexture!==null,instancing:Ke,instancingColor:Ke&&F.instanceColor!==null,instancingMorph:Ke&&F.morphTexture!==null,outputColorSpace:te===null?n.outputColorSpace:te.isXRRenderTarget===!0?te.texture.colorSpace:yt.workingColorSpace,alphaToCoverage:!!x.alphaToCoverage,map:ge,matcap:ye,envMap:Le,envMapMode:Le&&J.mapping,envMapCubeUVHeight:j,aoMap:$e,lightMap:wt,bumpMap:we,normalMap:Ae,displacementMap:tt,emissiveMap:$t,normalMapObjectSpace:Ae&&x.normalMapType===Kv,normalMapTangentSpace:Ae&&x.normalMapType===Bm,packedNormalMap:Ae&&x.normalMapType===Bm&&mR(x.normalMap.format),metalnessMap:Wt,roughnessMap:Xt,anisotropy:O,anisotropyMap:k,clearcoat:wn,clearcoatMap:se,clearcoatNormalMap:he,clearcoatRoughnessMap:X,dispersion:gt,retroreflection:P,iridescence:v,iridescenceMap:Z,iridescenceThicknessMap:me,sheen:E,sheenColorMap:Fe,sheenRoughnessMap:re,specularMap:ue,specularColorMap:Me,specularIntensityMap:Ge,transmission:L,transmissionMap:ht,thicknessMap:B,gradientMap:Ee,opaque:x.transparent===!1&&x.blending===ar&&x.alphaToCoverage===!1,alphaMap:ne,alphaTest:Te,alphaHash:Ne,combine:x.combine,mapUv:ge&&g(x.map.channel),aoMapUv:$e&&g(x.aoMap.channel),lightMapUv:wt&&g(x.lightMap.channel),bumpMapUv:we&&g(x.bumpMap.channel),normalMapUv:Ae&&g(x.normalMap.channel),displacementMapUv:tt&&g(x.displacementMap.channel),emissiveMapUv:$t&&g(x.emissiveMap.channel),metalnessMapUv:Wt&&g(x.metalnessMap.channel),roughnessMapUv:Xt&&g(x.roughnessMap.channel),anisotropyMapUv:k&&g(x.anisotropyMap.channel),clearcoatMapUv:se&&g(x.clearcoatMap.channel),clearcoatNormalMapUv:he&&g(x.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:X&&g(x.clearcoatRoughnessMap.channel),iridescenceMapUv:Z&&g(x.iridescenceMap.channel),iridescenceThicknessMapUv:me&&g(x.iridescenceThicknessMap.channel),sheenColorMapUv:Fe&&g(x.sheenColorMap.channel),sheenRoughnessMapUv:re&&g(x.sheenRoughnessMap.channel),specularMapUv:ue&&g(x.specularMap.channel),specularColorMapUv:Me&&g(x.specularColorMap.channel),specularIntensityMapUv:Ge&&g(x.specularIntensityMap.channel),transmissionMapUv:ht&&g(x.transmissionMap.channel),thicknessMapUv:B&&g(x.thicknessMap.channel),alphaMapUv:ne&&g(x.alphaMap.channel),vertexTangents:!!V.attributes.tangent&&(Ae||O),vertexNormals:!!V.attributes.normal,vertexColors:x.vertexColors,vertexAlphas:x.vertexColors===!0&&!!V.attributes.color&&V.attributes.color.itemSize===4,pointsUvs:F.isPoints===!0&&!!V.attributes.uv&&(ge||ne),fog:!!N,useFog:x.fog===!0,fogExp2:!!N&&N.isFogExp2,flatShading:x.wireframe===!1&&(x.flatShading===!0||V.attributes.normal===void 0&&Ae===!1&&(x.isMeshLambertMaterial||x.isMeshPhongMaterial||x.isMeshStandardMaterial||x.isMeshPhysicalMaterial)),sizeAttenuation:x.sizeAttenuation===!0,logarithmicDepthBuffer:d,reversedDepthBuffer:be,skinning:F.isSkinnedMesh===!0,hasPositionAttribute:V.attributes.position!==void 0,morphTargets:V.morphAttributes.position!==void 0,morphNormals:V.morphAttributes.normal!==void 0,morphColors:V.morphAttributes.color!==void 0,morphTargetsCount:Ve,morphTextureStride:Ue,numSunLights:w.sun.length,numDirLights:w.directional.length,numPointLights:w.point.length,numSpotLights:w.spot.length,numSpotLightMaps:w.spotLightMap.length,numRectAreaLights:w.rectArea.length,numHemiLights:w.hemi.length,numSunLightShadows:w.sunShadowMap.length,numDirLightShadows:w.directionalShadowMap.length,numPointLightShadows:w.pointShadowMap.length,numSpotLightShadows:w.spotShadowMap.length,numSpotLightShadowsWithMaps:w.numSpotLightShadowsWithMaps,numLightProbes:w.numLightProbes,numLightProbeGrids:z.length,numClippingPlanes:s.numPlanes,numClipIntersection:s.numIntersection,dithering:x.dithering,shadowMapEnabled:n.shadowMap.enabled&&I.length>0,shadowMapType:n.shadowMap.type,toneMapping:Ye,decodeVideoTexture:ge&&x.map.isVideoTexture===!0&&yt.getTransfer(x.map.colorSpace)===kt,decodeVideoTextureEmissive:$t&&x.emissiveMap.isVideoTexture===!0&&yt.getTransfer(x.emissiveMap.colorSpace)===kt,premultipliedAlpha:x.premultipliedAlpha,doubleSided:x.side===wr,flipSided:x.side===li,useDepthPacking:x.depthPacking>=0,depthPacking:x.depthPacking||0,index0AttributeName:x.index0AttributeName,extensionClipCullDistance:le&&x.extensions.clipCullDistance===!0&&t.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(le&&x.extensions.multiDraw===!0||Ce)&&t.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:t.has("KHR_parallel_shader_compile"),customProgramCacheKey:x.customProgramCacheKey()};return ze.vertexUv1s=l.has(1),ze.vertexUv2s=l.has(2),ze.vertexUv3s=l.has(3),l.clear(),ze}function m(x){let w=[];if(x.shaderID?w.push(x.shaderID):(w.push(x.customVertexShaderID),w.push(x.customFragmentShaderID)),x.defines!==void 0)for(let I in x.defines)w.push(I),w.push(x.defines[I]);return x.isRawShaderMaterial===!1&&(p(w,x),b(w,x),w.push(n.outputColorSpace)),w.push(x.customProgramCacheKey),w.join()}function p(x,w){x.push(w.precision),x.push(w.outputColorSpace),x.push(w.envMapMode),x.push(w.envMapCubeUVHeight),x.push(w.mapUv),x.push(w.alphaMapUv),x.push(w.lightMapUv),x.push(w.aoMapUv),x.push(w.bumpMapUv),x.push(w.normalMapUv),x.push(w.displacementMapUv),x.push(w.emissiveMapUv),x.push(w.metalnessMapUv),x.push(w.roughnessMapUv),x.push(w.anisotropyMapUv),x.push(w.clearcoatMapUv),x.push(w.clearcoatNormalMapUv),x.push(w.clearcoatRoughnessMapUv),x.push(w.iridescenceMapUv),x.push(w.iridescenceThicknessMapUv),x.push(w.sheenColorMapUv),x.push(w.sheenRoughnessMapUv),x.push(w.specularMapUv),x.push(w.specularColorMapUv),x.push(w.specularIntensityMapUv),x.push(w.transmissionMapUv),x.push(w.thicknessMapUv),x.push(w.combine),x.push(w.fogExp2),x.push(w.sizeAttenuation),x.push(w.morphTargetsCount),x.push(w.morphAttributeCount),x.push(w.numSunLights),x.push(w.numDirLights),x.push(w.numPointLights),x.push(w.numSpotLights),x.push(w.numSpotLightMaps),x.push(w.numHemiLights),x.push(w.numRectAreaLights),x.push(w.numSunLightShadows),x.push(w.numDirLightShadows),x.push(w.numPointLightShadows),x.push(w.numSpotLightShadows),x.push(w.numSpotLightShadowsWithMaps),x.push(w.numLightProbes),x.push(w.shadowMapType),x.push(w.toneMapping),x.push(w.numClippingPlanes),x.push(w.numClipIntersection),x.push(w.depthPacking)}function b(x,w){o.disableAll(),w.instancing&&o.enable(0),w.instancingColor&&o.enable(1),w.instancingMorph&&o.enable(2),w.matcap&&o.enable(3),w.envMap&&o.enable(4),w.normalMapObjectSpace&&o.enable(5),w.normalMapTangentSpace&&o.enable(6),w.clearcoat&&o.enable(7),w.iridescence&&o.enable(8),w.alphaTest&&o.enable(9),w.vertexColors&&o.enable(10),w.vertexAlphas&&o.enable(11),w.vertexUv1s&&o.enable(12),w.vertexUv2s&&o.enable(13),w.vertexUv3s&&o.enable(14),w.vertexTangents&&o.enable(15),w.anisotropy&&o.enable(16),w.alphaHash&&o.enable(17),w.batching&&o.enable(18),w.dispersion&&o.enable(19),w.retroreflection&&o.enable(24),w.batchingColor&&o.enable(20),w.gradientMap&&o.enable(21),w.packedNormalMap&&o.enable(22),w.vertexNormals&&o.enable(23),x.push(o.mask),o.disableAll(),w.fog&&o.enable(0),w.useFog&&o.enable(1),w.flatShading&&o.enable(2),w.logarithmicDepthBuffer&&o.enable(3),w.reversedDepthBuffer&&o.enable(4),w.skinning&&o.enable(5),w.morphTargets&&o.enable(6),w.morphNormals&&o.enable(7),w.morphColors&&o.enable(8),w.premultipliedAlpha&&o.enable(9),w.shadowMapEnabled&&o.enable(10),w.doubleSided&&o.enable(11),w.flipSided&&o.enable(12),w.useDepthPacking&&o.enable(13),w.dithering&&o.enable(14),w.transmission&&o.enable(15),w.sheen&&o.enable(16),w.opaque&&o.enable(17),w.pointsUvs&&o.enable(18),w.decodeVideoTexture&&o.enable(19),w.decodeVideoTextureEmissive&&o.enable(20),w.alphaToCoverage&&o.enable(21),w.numLightProbeGrids>0&&o.enable(22),w.hasPositionAttribute&&o.enable(23),x.push(o.mask)}function S(x){let w=f[x.type],I;if(w){let D=Ar[w];I=uy.clone(D.uniforms)}else I=x.uniforms;return I}function _(x,w){let I=u.get(w);return I!==void 0?++I.usedTimes:(I=new fR(n,w,x,r),c.push(I),u.set(w,I)),I}function A(x){if(--x.usedTimes===0){let w=c.indexOf(x);c[w]=c[c.length-1],c.pop(),u.delete(x.cacheKey),x.destroy()}}function T(x){a.remove(x)}function R(){a.dispose()}return{getParameters:y,getProgramCacheKey:m,getUniforms:S,acquireProgram:_,releaseProgram:A,releaseShaderCache:T,programs:c,dispose:R}}function xR(){let n=new WeakMap;function e(o){return n.has(o)}function t(o){let a=n.get(o);return a===void 0&&(a={},n.set(o,a)),a}function i(o){n.delete(o)}function r(o,a,l){n.get(o)[a]=l}function s(){n=new WeakMap}return{has:e,get:t,remove:i,update:r,dispose:s}}function vR(n,e){return n.groupOrder!==e.groupOrder?n.groupOrder-e.groupOrder:n.renderOrder!==e.renderOrder?n.renderOrder-e.renderOrder:n.material.id!==e.material.id?n.material.id-e.material.id:n.materialVariant!==e.materialVariant?n.materialVariant-e.materialVariant:n.z!==e.z?n.z-e.z:n.id-e.id}function Iy(n,e){return n.groupOrder!==e.groupOrder?n.groupOrder-e.groupOrder:n.renderOrder!==e.renderOrder?n.renderOrder-e.renderOrder:n.z!==e.z?e.z-n.z:n.id-e.id}function Py(){let n=[],e=0,t=[],i=[],r=[];function s(){e=0,t.length=0,i.length=0,r.length=0}function o(h){let f=0;return h.isInstancedMesh&&(f+=2),h.isSkinnedMesh&&(f+=1),f}function a(h,f,g,y,m,p){let b=n[e];return b===void 0?(b={id:h.id,object:h,geometry:f,material:g,materialVariant:o(h),groupOrder:y,renderOrder:h.renderOrder,z:m,group:p},n[e]=b):(b.id=h.id,b.object=h,b.geometry=f,b.material=g,b.materialVariant=o(h),b.groupOrder=y,b.renderOrder=h.renderOrder,b.z=m,b.group=p),e++,b}function l(h,f,g,y,m,p,b){b.reversedDepth===!0&&(m=-m);let S=a(h,f,g,y,m,p);g.transmission>0?i.push(S):g.transparent===!0?r.push(S):t.push(S)}function c(h,f,g,y,m,p){let b=a(h,f,g,y,m,p);g.transmission>0?i.unshift(b):g.transparent===!0?r.unshift(b):t.unshift(b)}function u(h,f){t.length>1&&t.sort(h||vR),i.length>1&&i.sort(f||Iy),r.length>1&&r.sort(f||Iy)}function d(){for(let h=e,f=n.length;h<f;h++){let g=n[h];if(g.id===null)break;g.id=null,g.object=null,g.geometry=null,g.material=null,g.group=null}}return{opaque:t,transmissive:i,transparent:r,init:s,push:l,unshift:c,finish:d,sort:u}}function yR(){let n=new WeakMap;function e(i,r){let s=n.get(i),o;return s===void 0?(o=new Py,n.set(i,[o])):r>=s.length?(o=new Py,s.push(o)):o=s[r],o}function t(){n=new WeakMap}return{get:e,dispose:t}}function _R(){let n={};return{get:function(e){if(n[e.id]!==void 0)return n[e.id];let t;switch(e.type){case"SunLight":case"DirectionalLight":t={direction:new C,color:new St};break;case"SpotLight":t={position:new C,direction:new C,color:new St,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":t={position:new C,color:new St,distance:0,decay:0};break;case"HemisphereLight":t={direction:new C,skyColor:new St,groundColor:new St};break;case"RectAreaLight":t={color:new St,position:new C,halfWidth:new C,halfHeight:new C};break}return n[e.id]=t,t}}}function MR(){let n={};return{get:function(e){if(n[e.id]!==void 0)return n[e.id];let t;switch(e.type){case"SunLight":case"DirectionalLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new it};break;case"SpotLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new it};break;case"PointLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new it,shadowCameraNear:1,shadowCameraFar:1e3};break}return n[e.id]=t,t}}}var bR=0;function SR(n,e){return(e.castShadow?2:0)-(n.castShadow?2:0)+(e.map?1:0)-(n.map?1:0)}function wR(n){let e=new _R,t=MR(),i={version:0,hash:{sunLength:-1,directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numSunShadows:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],sun:[],sunShadow:[],sunShadowMap:[],sunShadowMatrix:[],sunShadowCascade:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let c=0;c<9;c++)i.probe.push(new C);let r=new C,s=new Et,o=new Et;function a(c){let u=0,d=0,h=0;for(let F=0;F<9;F++)i.probe[F].set(0,0,0);let f=0,g=0,y=0,m=0,p=0,b=0,S=0,_=0,A=0,T=0,R=0,x=0,w=0,I=0;c.sort(SR);for(let F=0,z=c.length;F<z;F++){let N=c[F],V=N.color,K=N.intensity,$=N.distance,J=null;if(N.shadow&&N.shadow.map&&(N.shadow.map.texture.format===Us?J=N.shadow.map.texture:J=N.shadow.map.depthTexture||N.shadow.map.texture),N.isAmbientLight)u+=V.r*K,d+=V.g*K,h+=V.b*K;else if(N.isLightProbe){for(let j=0;j<9;j++)i.probe[j].addScaledVector(N.sh.coefficients[j],K);I++}else if(N.isSunLight){let j=e.get(N);if(j.color.copy(N.color).multiplyScalar(N.intensity),N.castShadow){let Q=N.shadow,ie=t.get(N);ie.shadowIntensity=Q.intensity,ie.shadowBias=Q.bias,ie.shadowNormalBias=Q.normalBias,ie.shadowRadius=Q.radius,ie.shadowMapSize.copy(Q.mapSize).multiply(Q.getFrameExtents()),i.sunShadow[g]=ie,i.sunShadowMap[g]=J;let Ve=Q.getViewportCount();for(let Ue=0;Ue<Ve;Ue++)i.sunShadowMatrix[y+Ue]=Q.getMatrix(Ue),i.sunShadowCascade[y+Ue]=Q._cascadeData[Ue];y+=Ve,g++}i.sun[f]=j,f++}else if(N.isDirectionalLight){let j=e.get(N);if(j.color.copy(N.color).multiplyScalar(N.intensity),N.castShadow){let Q=N.shadow,ie=t.get(N);ie.shadowIntensity=Q.intensity,ie.shadowBias=Q.bias,ie.shadowNormalBias=Q.normalBias,ie.shadowRadius=Q.radius,ie.shadowMapSize=Q.mapSize,i.directionalShadow[m]=ie,i.directionalShadowMap[m]=J,i.directionalShadowMatrix[m]=N.shadow.matrix,A++}i.directional[m]=j,m++}else if(N.isSpotLight){let j=e.get(N);j.position.setFromMatrixPosition(N.matrixWorld),j.color.copy(V).multiplyScalar(K),j.distance=$,j.coneCos=Math.cos(N.angle),j.penumbraCos=Math.cos(N.angle*(1-N.penumbra)),j.decay=N.decay,i.spot[b]=j;let Q=N.shadow;if(N.map&&(i.spotLightMap[x]=N.map,x++,Q.updateMatrices(N),N.castShadow&&w++),i.spotLightMatrix[b]=Q.matrix,N.castShadow){let ie=t.get(N);ie.shadowIntensity=Q.intensity,ie.shadowBias=Q.bias,ie.shadowNormalBias=Q.normalBias,ie.shadowRadius=Q.radius,ie.shadowMapSize=Q.mapSize,i.spotShadow[b]=ie,i.spotShadowMap[b]=J,R++}b++}else if(N.isRectAreaLight){let j=e.get(N);j.color.copy(V).multiplyScalar(K),j.halfWidth.set(N.width*.5,0,0),j.halfHeight.set(0,N.height*.5,0),i.rectArea[S]=j,S++}else if(N.isPointLight){let j=e.get(N);if(j.color.copy(N.color).multiplyScalar(N.intensity),j.distance=N.distance,j.decay=N.decay,N.castShadow){let Q=N.shadow,ie=t.get(N);ie.shadowIntensity=Q.intensity,ie.shadowBias=Q.bias,ie.shadowNormalBias=Q.normalBias,ie.shadowRadius=Q.radius,ie.shadowMapSize=Q.mapSize,ie.shadowCameraNear=Q.camera.near,ie.shadowCameraFar=Q.camera.far,i.pointShadow[p]=ie,i.pointShadowMap[p]=J,i.pointShadowMatrix[p]=N.shadow.matrix,T++}i.point[p]=j,p++}else if(N.isHemisphereLight){let j=e.get(N);j.skyColor.copy(N.color).multiplyScalar(K),j.groundColor.copy(N.groundColor).multiplyScalar(K),i.hemi[_]=j,_++}}S>0&&(n.has("OES_texture_float_linear")===!0?(i.rectAreaLTC1=Pe.LTC_FLOAT_1,i.rectAreaLTC2=Pe.LTC_FLOAT_2):(i.rectAreaLTC1=Pe.LTC_HALF_1,i.rectAreaLTC2=Pe.LTC_HALF_2)),i.ambient[0]=u,i.ambient[1]=d,i.ambient[2]=h;let D=i.hash;(D.sunLength!==f||D.directionalLength!==m||D.pointLength!==p||D.spotLength!==b||D.rectAreaLength!==S||D.hemiLength!==_||D.numSunShadows!==g||D.numDirectionalShadows!==A||D.numPointShadows!==T||D.numSpotShadows!==R||D.numSpotMaps!==x||D.numLightProbes!==I)&&(i.sun.length=f,i.directional.length=m,i.spot.length=b,i.rectArea.length=S,i.point.length=p,i.hemi.length=_,i.sunShadow.length=g,i.sunShadowMap.length=g,i.sunShadowMatrix.length=y,i.sunShadowCascade.length=y,i.directionalShadow.length=A,i.directionalShadowMap.length=A,i.directionalShadowMatrix.length=A,i.pointShadow.length=T,i.pointShadowMap.length=T,i.pointShadowMatrix.length=T,i.spotShadow.length=R,i.spotShadowMap.length=R,i.spotLightMatrix.length=R+x-w,i.spotLightMap.length=x,i.numSpotLightShadowsWithMaps=w,i.numLightProbes=I,D.sunLength=f,D.directionalLength=m,D.pointLength=p,D.spotLength=b,D.rectAreaLength=S,D.hemiLength=_,D.numSunShadows=g,D.numDirectionalShadows=A,D.numPointShadows=T,D.numSpotShadows=R,D.numSpotMaps=x,D.numLightProbes=I,i.version=bR++)}function l(c,u){let d=0,h=0,f=0,g=0,y=0,m=0,p=u.matrixWorldInverse;for(let b=0,S=c.length;b<S;b++){let _=c[b];if(_.isSunLight){let A=i.sun[d];A.direction.setFromMatrixPosition(_.matrixWorld),A.direction.transformDirection(p),d++}else if(_.isDirectionalLight){let A=i.directional[h];A.direction.setFromMatrixPosition(_.matrixWorld),r.setFromMatrixPosition(_.target.matrixWorld),A.direction.sub(r),A.direction.transformDirection(p),h++}else if(_.isSpotLight){let A=i.spot[g];A.position.setFromMatrixPosition(_.matrixWorld),A.position.applyMatrix4(p),A.direction.setFromMatrixPosition(_.matrixWorld),r.setFromMatrixPosition(_.target.matrixWorld),A.direction.sub(r),A.direction.transformDirection(p),g++}else if(_.isRectAreaLight){let A=i.rectArea[y];A.position.setFromMatrixPosition(_.matrixWorld),A.position.applyMatrix4(p),o.identity(),s.copy(_.matrixWorld),s.premultiply(p),o.extractRotation(s),A.halfWidth.set(_.width*.5,0,0),A.halfHeight.set(0,_.height*.5,0),A.halfWidth.applyMatrix4(o),A.halfHeight.applyMatrix4(o),y++}else if(_.isPointLight){let A=i.point[f];A.position.setFromMatrixPosition(_.matrixWorld),A.position.applyMatrix4(p),f++}else if(_.isHemisphereLight){let A=i.hemi[m];A.direction.setFromMatrixPosition(_.matrixWorld),A.direction.transformDirection(p),m++}}}return{setup:a,setupView:l,state:i}}function Ly(n){let e=new wR(n),t=[],i=[],r=[];function s(h){d.camera=h,t.length=0,i.length=0,r.length=0}function o(h){t.push(h)}function a(h){i.push(h)}function l(h){r.push(h)}function c(){e.setup(t)}function u(h){e.setupView(t,h)}let d={lightsArray:t,shadowsArray:i,lightProbeGridArray:r,camera:null,lights:e,transmissionRenderTarget:{},textureUnits:0};return{init:s,state:d,setupLights:c,setupLightsView:u,pushLight:o,pushShadow:a,pushLightProbeGrid:l}}function ER(n){let e=new WeakMap;function t(r,s=0){let o=e.get(r),a;return o===void 0?(a=new Ly(n),e.set(r,[a])):s>=o.length?(a=new Ly(n),o.push(a)):a=o[s],a}function i(){e=new WeakMap}return{get:t,dispose:i}}var AR=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,TR=`uniform sampler2D shadow_pass;
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
}`,RR=[new C(1,0,0),new C(-1,0,0),new C(0,1,0),new C(0,-1,0),new C(0,0,1),new C(0,0,-1)],CR=[new C(0,-1,0),new C(0,-1,0),new C(0,0,1),new C(0,0,-1),new C(0,-1,0),new C(0,-1,0)],Dy=new Et,yc=new C,n0=new C;function IR(n,e,t){let i=new Zl,r=new it,s=new it,o=new en,a=new Hh,l=new Wh,c={},u=t.maxTextureSize,d={[Sr]:li,[li]:Sr,[wr]:wr},h=new Pt({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new it},radius:{value:4}},vertexShader:AR,fragmentShader:TR}),f=h.clone();f.defines.HORIZONTAL_PASS=1;let g=new xn;g.setAttribute("position",new sn(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));let y=new Vt(g,h),m=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=lc;let p=this.type;this.render=function(T,R,x){if(m.enabled===!1||m.autoUpdate===!1&&m.needsUpdate===!1||T.length===0)return;this.type===Iv&&(Qe("WebGLShadowMap: PCFSoftShadowMap has been removed. Using PCFShadowMap instead."),this.type=lc);let w=n.getRenderTarget(),I=n.getActiveCubeFace(),D=n.getActiveMipmapLevel(),F=n.state;F.setBlending(gi),F.buffers.depth.getReversed()===!0?F.buffers.color.setClear(0,0,0,0):F.buffers.color.setClear(1,1,1,1),F.buffers.depth.setTest(!0),F.setScissorTest(!1);let z=p!==this.type;z&&R.traverse(function(N){N.material&&(Array.isArray(N.material)?N.material.forEach(V=>V.needsUpdate=!0):N.material.needsUpdate=!0)});for(let N=0,V=T.length;N<V;N++){let K=T[N],$=K.shadow;if($===void 0){Qe("WebGLShadowMap:",K,"has no shadow.");continue}if($.autoUpdate===!1&&$.needsUpdate===!1)continue;r.copy($.mapSize);let J=$.getFrameExtents();r.multiply(J),s.copy($.mapSize),(r.x>u||r.y>u)&&(r.x>u&&(s.x=Math.floor(u/J.x),r.x=s.x*J.x,$.mapSize.x=s.x),r.y>u&&(s.y=Math.floor(u/J.y),r.y=s.y*J.y,$.mapSize.y=s.y));let j=n.state.buffers.depth.getReversed();if($.camera._reversedDepth=j,$.map===null||z===!0){if($.map!==null&&($.map.depthTexture!==null&&($.map.depthTexture.dispose(),$.map.depthTexture=null),$.map.dispose()),this.type===Ea){if(K.isPointLight){Qe("WebGLShadowMap: VSM shadow maps are not supported for PointLights. Use PCF or BasicShadowMap instead.");continue}$.map=new Tn(r.x,r.y,{format:Us,type:Kn,minFilter:At,magFilter:At,generateMipmaps:!1}),$.map.texture.name=K.name+".shadowMap",$.map.depthTexture=new Is(r.x,r.y,Hi),$.map.depthTexture.name=K.name+".shadowMapDepth",$.map.depthTexture.format=yr,$.map.depthTexture.compareFunction=null,$.map.depthTexture.minFilter=Bn,$.map.depthTexture.magFilter=Bn}else K.isPointLight?($.map=new Zd(r.x),$.map.depthTexture=new zh(r.x,lr)):($.map=new Tn(r.x,r.y),$.map.depthTexture=new Is(r.x,r.y,lr)),$.map.depthTexture.name=K.name+".shadowMap",$.map.depthTexture.format=yr,this.type===lc?($.map.depthTexture.compareFunction=j?$d:Xd,$.map.depthTexture.minFilter=At,$.map.depthTexture.magFilter=At):($.map.depthTexture.compareFunction=null,$.map.depthTexture.minFilter=Bn,$.map.depthTexture.magFilter=Bn);$.camera.updateProjectionMatrix()}$.map.isWebGLCubeRenderTarget!==!0&&($.map.width!==r.x||$.map.height!==r.y)&&$.map.setSize(r.x,r.y);let Q=$.map.isWebGLCubeRenderTarget?6:$.getViewportCount();K.isPointLight!==!0&&$.updateMatrices(K,x);for(let ie=0;ie<Q;ie++){let Ve=$.getCamera(ie);if(K.isPointLight){let Ue=$.camera,_t=$.matrix,lt=K.distance||Ue.far;lt!==Ue.far&&(Ue.far=lt,Ue.updateProjectionMatrix()),yc.setFromMatrixPosition(K.matrixWorld),Ue.position.copy(yc),n0.copy(Ue.position),n0.add(RR[ie]),Ue.up.copy(CR[ie]),Ue.lookAt(n0),Ue.updateMatrixWorld(),_t.makeTranslation(-yc.x,-yc.y,-yc.z),Dy.multiplyMatrices(Ue.projectionMatrix,Ue.matrixWorldInverse),$._frustum.setFromProjectionMatrix(Dy,Ue.coordinateSystem,Ue.reversedDepth)}if($.map.isWebGLCubeRenderTarget)n.setRenderTarget($.map,ie),n.clear();else{ie===0&&(n.setRenderTarget($.map),n.clear());let Ue=$.getViewport(ie);o.set(s.x*Ue.x,s.y*Ue.y,s.x*Ue.z,s.y*Ue.w),F.viewport(o)}i=$.getFrustum(ie),_(R,x,Ve,K,this.type)}$.isPointLightShadow!==!0&&this.type===Ea&&b($,x),$.needsUpdate=!1}p=this.type,m.needsUpdate=!1,n.setRenderTarget(w,I,D)};function b(T,R){let x=e.update(y);h.defines.VSM_SAMPLES!==T.blurSamples&&(h.defines.VSM_SAMPLES=T.blurSamples,f.defines.VSM_SAMPLES=T.blurSamples,h.needsUpdate=!0,f.needsUpdate=!0),T.mapPass===null?T.mapPass=new Tn(r.x,r.y,{format:Us,type:Kn}):(T.mapPass.width!==T.map.width||T.mapPass.height!==T.map.height)&&T.mapPass.setSize(T.map.width,T.map.height),h.uniforms.shadow_pass.value=T.map.depthTexture,h.uniforms.resolution.value.set(T.map.width,T.map.height),h.uniforms.radius.value=T.radius,n.setRenderTarget(T.mapPass),n.clear(),n.renderBufferDirect(R,null,x,h,y,null),f.uniforms.shadow_pass.value=T.mapPass.texture,f.uniforms.resolution.value.set(T.map.width,T.map.height),f.uniforms.radius.value=T.radius,n.setRenderTarget(T.map),n.clear(),n.renderBufferDirect(R,null,x,f,y,null)}function S(T,R,x,w){let I=null,D=x.isPointLight===!0?T.customDistanceMaterial:T.customDepthMaterial;if(D!==void 0)I=D;else if(I=x.isPointLight===!0?l:a,n.localClippingEnabled&&R.clipShadows===!0&&Array.isArray(R.clippingPlanes)&&R.clippingPlanes.length!==0||R.displacementMap&&R.displacementScale!==0||R.alphaMap&&R.alphaTest>0||R.map&&R.alphaTest>0||R.alphaToCoverage===!0){let F=I.uuid,z=R.uuid,N=c[F];N===void 0&&(N={},c[F]=N);let V=N[z];V===void 0&&(V=I.clone(),N[z]=V,R.addEventListener("dispose",A)),I=V}if(I.visible=R.visible,I.wireframe=R.wireframe,w===Ea?I.side=R.shadowSide!==null?R.shadowSide:R.side:I.side=R.shadowSide!==null?R.shadowSide:d[R.side],I.alphaMap=R.alphaMap,I.alphaTest=R.alphaToCoverage===!0?.5:R.alphaTest,I.map=R.map,I.clipShadows=R.clipShadows,I.clippingPlanes=R.clippingPlanes,I.clipIntersection=R.clipIntersection,I.displacementMap=R.displacementMap,I.displacementScale=R.displacementScale,I.displacementBias=R.displacementBias,I.wireframeLinewidth=R.wireframeLinewidth,I.linewidth=R.linewidth,x.isPointLight===!0&&I.isMeshDistanceMaterial===!0){let F=n.properties.get(I);F.light=x}return I}function _(T,R,x,w,I){if(T.visible===!1)return;if(T.layers.test(R.layers)&&(T.isMesh||T.isLine||T.isPoints)&&(T.castShadow||T.receiveShadow&&I===Ea)&&(!T.frustumCulled||T.intersectsFrustum(i))){T.modelViewMatrix.multiplyMatrices(x.matrixWorldInverse,T.matrixWorld);let z=e.update(T),N=T.material;if(Array.isArray(N)){let V=z.groups;for(let K=0,$=V.length;K<$;K++){let J=V[K],j=N[J.materialIndex];if(j&&j.visible){let Q=S(T,j,w,I);T.onBeforeShadow(n,T,R,x,z,Q,J),n.renderBufferDirect(x,null,z,Q,T,J),T.onAfterShadow(n,T,R,x,z,Q,J)}}}else if(N.visible){let V=S(T,N,w,I);T.onBeforeShadow(n,T,R,x,z,V,null),n.renderBufferDirect(x,null,z,V,T,null),T.onAfterShadow(n,T,R,x,z,V,null)}}let F=T.children;for(let z=0,N=F.length;z<N;z++)_(F[z],R,x,w,I)}function A(T){T.target.removeEventListener("dispose",A);for(let x in c){let w=c[x],I=T.target.uuid;I in w&&(w[I].dispose(),delete w[I])}}}function PR(n,e){function t(){let B=!1,Ee=new en,ne=null,Te=new en(0,0,0,0);return{setMask:function(Ne){ne!==Ne&&!B&&(n.colorMask(Ne,Ne,Ne,Ne),ne=Ne)},setLocked:function(Ne){B=Ne},setClear:function(Ne,le,Ye,ze,nn){nn===!0&&(Ne*=ze,le*=ze,Ye*=ze),Ee.set(Ne,le,Ye,ze),Te.equals(Ee)===!1&&(n.clearColor(Ne,le,Ye,ze),Te.copy(Ee))},reset:function(){B=!1,ne=null,Te.set(-1,0,0,0)}}}function i(){let B=!1,Ee=!1,ne=null,Te=null,Ne=null;return{setReversed:function(le){if(Ee!==le){let Ye=e.get("EXT_clip_control");le?Ye.clipControlEXT(Ye.LOWER_LEFT_EXT,Ye.ZERO_TO_ONE_EXT):Ye.clipControlEXT(Ye.LOWER_LEFT_EXT,Ye.NEGATIVE_ONE_TO_ONE_EXT),Ee=le;let ze=Ne;Ne=null,this.setClear(ze)}},getReversed:function(){return Ee},setTest:function(le){le?te(n.DEPTH_TEST):be(n.DEPTH_TEST)},setMask:function(le){ne!==le&&!B&&(n.depthMask(le),ne=le)},setFunc:function(le){if(Ee&&(le=ly[le]),Te!==le){switch(le){case _h:n.depthFunc(n.NEVER);break;case Mh:n.depthFunc(n.ALWAYS);break;case bh:n.depthFunc(n.LESS);break;case xa:n.depthFunc(n.LEQUAL);break;case Sh:n.depthFunc(n.EQUAL);break;case wh:n.depthFunc(n.GEQUAL);break;case Eh:n.depthFunc(n.GREATER);break;case Ah:n.depthFunc(n.NOTEQUAL);break;default:n.depthFunc(n.LEQUAL)}Te=le}},setLocked:function(le){B=le},setClear:function(le){Ne!==le&&(Ne=le,Ee&&(le=1-le),n.clearDepth(le))},reset:function(){B=!1,ne=null,Te=null,Ne=null,Ee=!1}}}function r(){let B=!1,Ee=null,ne=null,Te=null,Ne=null,le=null,Ye=null,ze=null,nn=null;return{setTest:function(Ft){B||(Ft?te(n.STENCIL_TEST):be(n.STENCIL_TEST))},setMask:function(Ft){Ee!==Ft&&!B&&(n.stencilMask(Ft),Ee=Ft)},setFunc:function(Ft,er,pr){(ne!==Ft||Te!==er||Ne!==pr)&&(n.stencilFunc(Ft,er,pr),ne=Ft,Te=er,Ne=pr)},setOp:function(Ft,er,pr){(le!==Ft||Ye!==er||ze!==pr)&&(n.stencilOp(Ft,er,pr),le=Ft,Ye=er,ze=pr)},setLocked:function(Ft){B=Ft},setClear:function(Ft){nn!==Ft&&(n.clearStencil(Ft),nn=Ft)},reset:function(){B=!1,Ee=null,ne=null,Te=null,Ne=null,le=null,Ye=null,ze=null,nn=null}}}let s=new t,o=new i,a=new r,l=new WeakMap,c=new WeakMap,u={},d={},h={},f=new WeakMap,g=[],y=null,m=!1,p=null,b=null,S=null,_=null,A=null,T=null,R=null,x=new St(0,0,0),w=0,I=!1,D=null,F=null,z=null,N=null,V=null,K=n.getParameter(n.MAX_COMBINED_TEXTURE_IMAGE_UNITS),$=!1,J=0,j=n.getParameter(n.VERSION);j.indexOf("WebGL")!==-1?(J=parseFloat(/^WebGL (\d)/.exec(j)[1]),$=J>=1):j.indexOf("OpenGL ES")!==-1&&(J=parseFloat(/^OpenGL ES (\d)/.exec(j)[1]),$=J>=2);let Q=null,ie={},Ve=n.getParameter(n.SCISSOR_BOX),Ue=n.getParameter(n.VIEWPORT),_t=new en().fromArray(Ve),lt=new en().fromArray(Ue);function ot(B,Ee,ne,Te){let Ne=new Uint8Array(4),le=n.createTexture();n.bindTexture(B,le),n.texParameteri(B,n.TEXTURE_MIN_FILTER,n.NEAREST),n.texParameteri(B,n.TEXTURE_MAG_FILTER,n.NEAREST);for(let Ye=0;Ye<ne;Ye++)B===n.TEXTURE_3D||B===n.TEXTURE_2D_ARRAY?n.texImage3D(Ee,0,n.RGBA,1,1,Te,0,n.RGBA,n.UNSIGNED_BYTE,Ne):n.texImage2D(Ee+Ye,0,n.RGBA,1,1,0,n.RGBA,n.UNSIGNED_BYTE,Ne);return le}let Y={};Y[n.TEXTURE_2D]=ot(n.TEXTURE_2D,n.TEXTURE_2D,1),Y[n.TEXTURE_CUBE_MAP]=ot(n.TEXTURE_CUBE_MAP,n.TEXTURE_CUBE_MAP_POSITIVE_X,6),Y[n.TEXTURE_2D_ARRAY]=ot(n.TEXTURE_2D_ARRAY,n.TEXTURE_2D_ARRAY,1,1),Y[n.TEXTURE_3D]=ot(n.TEXTURE_3D,n.TEXTURE_3D,1,1),s.setClear(0,0,0,1),o.setClear(1),a.setClear(0),te(n.DEPTH_TEST),o.setFunc(xa),we(!1),Ae(ym),te(n.CULL_FACE),$e(gi);function te(B){u[B]!==!0&&(n.enable(B),u[B]=!0)}function be(B){u[B]!==!1&&(n.disable(B),u[B]=!1)}function Ke(B,Ee){return h[B]!==Ee?(n.bindFramebuffer(B,Ee),h[B]=Ee,B===n.DRAW_FRAMEBUFFER&&(h[n.FRAMEBUFFER]=Ee),B===n.FRAMEBUFFER&&(h[n.DRAW_FRAMEBUFFER]=Ee),!0):!1}function Ce(B,Ee){let ne=g,Te=!1;if(B){ne=f.get(Ee),ne===void 0&&(ne=[],f.set(Ee,ne));let Ne=B.textures;if(ne.length!==Ne.length||ne[0]!==n.COLOR_ATTACHMENT0){for(let le=0,Ye=Ne.length;le<Ye;le++)ne[le]=n.COLOR_ATTACHMENT0+le;ne.length=Ne.length,Te=!0}}else ne[0]!==n.BACK&&(ne[0]=n.BACK,Te=!0);Te&&n.drawBuffers(ne)}function ge(B){return y!==B?(n.useProgram(B),y=B,!0):!1}let ye={[ts]:n.FUNC_ADD,[Pv]:n.FUNC_SUBTRACT,[Lv]:n.FUNC_REVERSE_SUBTRACT};ye[Dv]=n.MIN,ye[Nv]=n.MAX;let Le={[Ov]:n.ZERO,[cc]:n.ONE,[Fv]:n.SRC_COLOR,[bm]:n.SRC_ALPHA,[Gv]:n.SRC_ALPHA_SATURATE,[zv]:n.DST_COLOR,[Bv]:n.DST_ALPHA,[Uv]:n.ONE_MINUS_SRC_COLOR,[Aa]:n.ONE_MINUS_SRC_ALPHA,[Vv]:n.ONE_MINUS_DST_COLOR,[kv]:n.ONE_MINUS_DST_ALPHA,[Hv]:n.CONSTANT_COLOR,[Wv]:n.ONE_MINUS_CONSTANT_COLOR,[Xv]:n.CONSTANT_ALPHA,[$v]:n.ONE_MINUS_CONSTANT_ALPHA};function $e(B,Ee,ne,Te,Ne,le,Ye,ze,nn,Ft){if(B===gi){m===!0&&(be(n.BLEND),m=!1);return}if(m===!1&&(te(n.BLEND),m=!0),B!==rd){if(B!==p||Ft!==I){if((b!==ts||A!==ts)&&(n.blendEquation(n.FUNC_ADD),b=ts,A=ts),Ft)switch(B){case ar:n.blendFuncSeparate(n.ONE,n.ONE_MINUS_SRC_ALPHA,n.ONE,n.ONE_MINUS_SRC_ALPHA);break;case _o:n.blendFunc(n.ONE,n.ONE);break;case _m:n.blendFuncSeparate(n.ZERO,n.ONE_MINUS_SRC_COLOR,n.ZERO,n.ONE);break;case Mm:n.blendFuncSeparate(n.DST_COLOR,n.ONE_MINUS_SRC_ALPHA,n.ZERO,n.ONE);break;default:nt("WebGLState: Invalid blending: ",B);break}else switch(B){case ar:n.blendFuncSeparate(n.SRC_ALPHA,n.ONE_MINUS_SRC_ALPHA,n.ONE,n.ONE_MINUS_SRC_ALPHA);break;case _o:n.blendFuncSeparate(n.SRC_ALPHA,n.ONE,n.ONE,n.ONE);break;case _m:nt("WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true");break;case Mm:nt("WebGLState: MultiplyBlending requires material.premultipliedAlpha = true");break;default:nt("WebGLState: Invalid blending: ",B);break}S=null,_=null,T=null,R=null,x.set(0,0,0),w=0,p=B,I=Ft}return}Ne=Ne||Ee,le=le||ne,Ye=Ye||Te,(Ee!==b||Ne!==A)&&(n.blendEquationSeparate(ye[Ee],ye[Ne]),b=Ee,A=Ne),(ne!==S||Te!==_||le!==T||Ye!==R)&&(n.blendFuncSeparate(Le[ne],Le[Te],Le[le],Le[Ye]),S=ne,_=Te,T=le,R=Ye),(ze.equals(x)===!1||nn!==w)&&(n.blendColor(ze.r,ze.g,ze.b,nn),x.copy(ze),w=nn),p=B,I=!1}function wt(B,Ee){B.side===wr?be(n.CULL_FACE):te(n.CULL_FACE);let ne=B.side===li;Ee&&(ne=!ne),we(ne),B.blending===ar&&B.transparent===!1?$e(gi):$e(B.blending,B.blendEquation,B.blendSrc,B.blendDst,B.blendEquationAlpha,B.blendSrcAlpha,B.blendDstAlpha,B.blendColor,B.blendAlpha,B.premultipliedAlpha),o.setFunc(B.depthFunc),o.setTest(B.depthTest),o.setMask(B.depthWrite),s.setMask(B.colorWrite);let Te=B.stencilWrite;a.setTest(Te),Te&&(a.setMask(B.stencilWriteMask),a.setFunc(B.stencilFunc,B.stencilRef,B.stencilFuncMask),a.setOp(B.stencilFail,B.stencilZFail,B.stencilZPass)),$t(B.polygonOffset,B.polygonOffsetFactor,B.polygonOffsetUnits),B.alphaToCoverage===!0?te(n.SAMPLE_ALPHA_TO_COVERAGE):be(n.SAMPLE_ALPHA_TO_COVERAGE)}function we(B){D!==B&&(B?n.frontFace(n.CW):n.frontFace(n.CCW),D=B)}function Ae(B){B!==Rv?(te(n.CULL_FACE),B!==F&&(B===ym?n.cullFace(n.BACK):B===Cv?n.cullFace(n.FRONT):n.cullFace(n.FRONT_AND_BACK))):be(n.CULL_FACE),F=B}function tt(B){B!==z&&($&&n.lineWidth(B),z=B)}function $t(B,Ee,ne){B?(te(n.POLYGON_OFFSET_FILL),(N!==Ee||V!==ne)&&(N=Ee,V=ne,o.getReversed()&&(Ee=-Ee),n.polygonOffset(Ee,ne))):be(n.POLYGON_OFFSET_FILL)}function Wt(B){B?te(n.SCISSOR_TEST):be(n.SCISSOR_TEST)}function Xt(B){B===void 0&&(B=n.TEXTURE0+K-1),Q!==B&&(n.activeTexture(B),Q=B)}function O(B,Ee,ne){ne===void 0&&(Q===null?ne=n.TEXTURE0+K-1:ne=Q);let Te=ie[ne];Te===void 0&&(Te={type:void 0,texture:void 0},ie[ne]=Te),(Te.type!==B||Te.texture!==Ee)&&(Q!==ne&&(n.activeTexture(ne),Q=ne),n.bindTexture(B,Ee||Y[B]),Te.type=B,Te.texture=Ee)}function wn(){let B=ie[Q];B!==void 0&&B.type!==void 0&&(n.bindTexture(B.type,null),B.type=void 0,B.texture=void 0)}function gt(){try{n.compressedTexImage2D(...arguments)}catch(B){nt("WebGLState:",B)}}function P(){try{n.compressedTexImage3D(...arguments)}catch(B){nt("WebGLState:",B)}}function v(){try{n.texSubImage2D(...arguments)}catch(B){nt("WebGLState:",B)}}function E(){try{n.texSubImage3D(...arguments)}catch(B){nt("WebGLState:",B)}}function L(){try{n.compressedTexSubImage2D(...arguments)}catch(B){nt("WebGLState:",B)}}function k(){try{n.compressedTexSubImage3D(...arguments)}catch(B){nt("WebGLState:",B)}}function se(){try{n.texStorage2D(...arguments)}catch(B){nt("WebGLState:",B)}}function he(){try{n.texStorage3D(...arguments)}catch(B){nt("WebGLState:",B)}}function X(){try{n.texImage2D(...arguments)}catch(B){nt("WebGLState:",B)}}function Z(){try{n.texImage3D(...arguments)}catch(B){nt("WebGLState:",B)}}function me(B){return d[B]!==void 0?d[B]:n.getParameter(B)}function Fe(B,Ee){d[B]!==Ee&&(n.pixelStorei(B,Ee),d[B]=Ee)}function re(B){_t.equals(B)===!1&&(n.scissor(B.x,B.y,B.z,B.w),_t.copy(B))}function ue(B){lt.equals(B)===!1&&(n.viewport(B.x,B.y,B.z,B.w),lt.copy(B))}function Me(B,Ee){let ne=c.get(Ee);ne===void 0&&(ne=new WeakMap,c.set(Ee,ne));let Te=ne.get(B);Te===void 0&&(Te=n.getUniformBlockIndex(Ee,B.name),ne.set(B,Te))}function Ge(B,Ee){let Te=c.get(Ee).get(B);l.get(Ee)!==Te&&(n.uniformBlockBinding(Ee,Te,B.__bindingPointIndex),l.set(Ee,Te))}function ht(){n.disable(n.BLEND),n.disable(n.CULL_FACE),n.disable(n.DEPTH_TEST),n.disable(n.POLYGON_OFFSET_FILL),n.disable(n.SCISSOR_TEST),n.disable(n.STENCIL_TEST),n.disable(n.SAMPLE_ALPHA_TO_COVERAGE),n.blendEquation(n.FUNC_ADD),n.blendFunc(n.ONE,n.ZERO),n.blendFuncSeparate(n.ONE,n.ZERO,n.ONE,n.ZERO),n.blendColor(0,0,0,0),n.colorMask(!0,!0,!0,!0),n.clearColor(0,0,0,0),n.depthMask(!0),n.depthFunc(n.LESS),o.setReversed(!1),n.clearDepth(1),n.stencilMask(4294967295),n.stencilFunc(n.ALWAYS,0,4294967295),n.stencilOp(n.KEEP,n.KEEP,n.KEEP),n.clearStencil(0),n.cullFace(n.BACK),n.frontFace(n.CCW),n.polygonOffset(0,0),n.activeTexture(n.TEXTURE0),n.bindFramebuffer(n.FRAMEBUFFER,null),n.bindFramebuffer(n.DRAW_FRAMEBUFFER,null),n.bindFramebuffer(n.READ_FRAMEBUFFER,null),n.useProgram(null),n.lineWidth(1),n.scissor(0,0,n.canvas.width,n.canvas.height),n.viewport(0,0,n.canvas.width,n.canvas.height),n.pixelStorei(n.PACK_ALIGNMENT,4),n.pixelStorei(n.UNPACK_ALIGNMENT,4),n.pixelStorei(n.UNPACK_FLIP_Y_WEBGL,!1),n.pixelStorei(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL,!1),n.pixelStorei(n.UNPACK_COLORSPACE_CONVERSION_WEBGL,n.BROWSER_DEFAULT_WEBGL),n.pixelStorei(n.PACK_ROW_LENGTH,0),n.pixelStorei(n.PACK_SKIP_PIXELS,0),n.pixelStorei(n.PACK_SKIP_ROWS,0),n.pixelStorei(n.UNPACK_ROW_LENGTH,0),n.pixelStorei(n.UNPACK_IMAGE_HEIGHT,0),n.pixelStorei(n.UNPACK_SKIP_PIXELS,0),n.pixelStorei(n.UNPACK_SKIP_ROWS,0),n.pixelStorei(n.UNPACK_SKIP_IMAGES,0),u={},d={},Q=null,ie={},h={},f=new WeakMap,g=[],y=null,m=!1,p=null,b=null,S=null,_=null,A=null,T=null,R=null,x=new St(0,0,0),w=0,I=!1,D=null,F=null,z=null,N=null,V=null,_t.set(0,0,n.canvas.width,n.canvas.height),lt.set(0,0,n.canvas.width,n.canvas.height),s.reset(),o.reset(),a.reset()}return{buffers:{color:s,depth:o,stencil:a},enable:te,disable:be,bindFramebuffer:Ke,drawBuffers:Ce,useProgram:ge,setBlending:$e,setMaterial:wt,setFlipSided:we,setCullFace:Ae,setLineWidth:tt,setPolygonOffset:$t,setScissorTest:Wt,activeTexture:Xt,bindTexture:O,unbindTexture:wn,compressedTexImage2D:gt,compressedTexImage3D:P,texImage2D:X,texImage3D:Z,pixelStorei:Fe,getParameter:me,updateUBOMapping:Me,uniformBlockBinding:Ge,texStorage2D:se,texStorage3D:he,texSubImage2D:v,texSubImage3D:E,compressedTexSubImage2D:L,compressedTexSubImage3D:k,scissor:re,viewport:ue,reset:ht}}function LR(n,e,t,i,r,s,o){let a=e.has("WEBGL_multisampled_render_to_texture")?e.get("WEBGL_multisampled_render_to_texture"):null,l=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),c=new it,u=new WeakMap,d=new Set,h,f=new WeakMap,g=!1;try{g=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function y(P,v){return g?new OffscreenCanvas(P,v):Gl("canvas")}function m(P,v,E){let L=1,k=gt(P);if((k.width>E||k.height>E)&&(L=E/Math.max(k.width,k.height)),L<1)if(typeof HTMLImageElement<"u"&&P instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&P instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&P instanceof ImageBitmap||typeof VideoFrame<"u"&&P instanceof VideoFrame){let se=Math.floor(L*k.width),he=Math.floor(L*k.height);h===void 0&&(h=y(se,he));let X=v?y(se,he):h;return X.width=se,X.height=he,X.getContext("2d").drawImage(P,0,0,se,he),Qe("WebGLRenderer: Texture has been resized from ("+k.width+"x"+k.height+") to ("+se+"x"+he+")."),X}else return"data"in P&&Qe("WebGLRenderer: Image in DataTexture is too big ("+k.width+"x"+k.height+")."),P;return P}function p(P){return P.generateMipmaps}function b(P){n.generateMipmap(P)}function S(P){return P.isWebGLCubeRenderTarget?n.TEXTURE_CUBE_MAP:P.isWebGL3DRenderTarget?n.TEXTURE_3D:P.isWebGLArrayRenderTarget||P.isCompressedArrayTexture?n.TEXTURE_2D_ARRAY:n.TEXTURE_2D}function _(P,v,E,L,k,se=!1){if(P!==null){if(n[P]!==void 0)return n[P];Qe("WebGLRenderer: Attempt to use non-existing WebGL internal format '"+P+"'")}let he;L&&(he=e.get("EXT_texture_norm16"),he||Qe("WebGLRenderer: Unable to use normalized textures without EXT_texture_norm16 extension"));let X=v;if(v===n.RED&&(E===n.FLOAT&&(X=n.R32F),E===n.HALF_FLOAT&&(X=n.R16F),E===n.UNSIGNED_BYTE&&(X=n.R8),E===n.UNSIGNED_SHORT&&he&&(X=he.R16_EXT),E===n.SHORT&&he&&(X=he.R16_SNORM_EXT)),v===n.RED_INTEGER&&(E===n.UNSIGNED_BYTE&&(X=n.R8UI),E===n.UNSIGNED_SHORT&&(X=n.R16UI),E===n.UNSIGNED_INT&&(X=n.R32UI),E===n.BYTE&&(X=n.R8I),E===n.SHORT&&(X=n.R16I),E===n.INT&&(X=n.R32I)),v===n.RG&&(E===n.FLOAT&&(X=n.RG32F),E===n.HALF_FLOAT&&(X=n.RG16F),E===n.UNSIGNED_BYTE&&(X=n.RG8),E===n.UNSIGNED_SHORT&&he&&(X=he.RG16_EXT),E===n.SHORT&&he&&(X=he.RG16_SNORM_EXT)),v===n.RG_INTEGER&&(E===n.UNSIGNED_BYTE&&(X=n.RG8UI),E===n.UNSIGNED_SHORT&&(X=n.RG16UI),E===n.UNSIGNED_INT&&(X=n.RG32UI),E===n.BYTE&&(X=n.RG8I),E===n.SHORT&&(X=n.RG16I),E===n.INT&&(X=n.RG32I)),v===n.RGB_INTEGER&&(E===n.UNSIGNED_BYTE&&(X=n.RGB8UI),E===n.UNSIGNED_SHORT&&(X=n.RGB16UI),E===n.UNSIGNED_INT&&(X=n.RGB32UI),E===n.BYTE&&(X=n.RGB8I),E===n.SHORT&&(X=n.RGB16I),E===n.INT&&(X=n.RGB32I)),v===n.RGBA_INTEGER&&(E===n.UNSIGNED_BYTE&&(X=n.RGBA8UI),E===n.UNSIGNED_SHORT&&(X=n.RGBA16UI),E===n.UNSIGNED_INT&&(X=n.RGBA32UI),E===n.BYTE&&(X=n.RGBA8I),E===n.SHORT&&(X=n.RGBA16I),E===n.INT&&(X=n.RGBA32I)),v===n.RGB&&(E===n.UNSIGNED_SHORT&&he&&(X=he.RGB16_EXT),E===n.SHORT&&he&&(X=he.RGB16_SNORM_EXT),E===n.UNSIGNED_INT_5_9_9_9_REV&&(X=n.RGB9_E5),E===n.UNSIGNED_INT_10F_11F_11F_REV&&(X=n.R11F_G11F_B10F)),v===n.RGBA){let Z=se?zl:yt.getTransfer(k);E===n.FLOAT&&(X=n.RGBA32F),E===n.HALF_FLOAT&&(X=n.RGBA16F),E===n.UNSIGNED_BYTE&&(X=Z===kt?n.SRGB8_ALPHA8:n.RGBA8),E===n.UNSIGNED_SHORT&&he&&(X=he.RGBA16_EXT),E===n.SHORT&&he&&(X=he.RGBA16_SNORM_EXT),E===n.UNSIGNED_SHORT_4_4_4_4&&(X=n.RGBA4),E===n.UNSIGNED_SHORT_5_5_5_1&&(X=n.RGB5_A1)}return(X===n.R16F||X===n.R32F||X===n.RG16F||X===n.RG32F||X===n.RGBA16F||X===n.RGBA32F)&&e.get("EXT_color_buffer_float"),X}function A(P,v){let E;return P?v===null||v===lr||v===Ra?E=n.DEPTH24_STENCIL8:v===Hi?E=n.DEPTH32F_STENCIL8:v===Ta&&(E=n.DEPTH24_STENCIL8,Qe("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):v===null||v===lr||v===Ra?E=n.DEPTH_COMPONENT24:v===Hi?E=n.DEPTH_COMPONENT32F:v===Ta&&(E=n.DEPTH_COMPONENT16),E}function T(P,v){return p(P)===!0||P.isFramebufferTexture&&P.minFilter!==Bn&&P.minFilter!==At?Math.log2(Math.max(v.width,v.height))+1:P.mipmaps!==void 0&&P.mipmaps.length>0?P.mipmaps.length:P.isCompressedTexture&&Array.isArray(P.image)?v.mipmaps.length:1}function R(P){let v=P.target;v.removeEventListener("dispose",R),w(v),v.isVideoTexture&&u.delete(v),v.isHTMLTexture&&d.delete(v)}function x(P){let v=P.target;v.removeEventListener("dispose",x),D(v)}function w(P){let v=i.get(P);if(v.__webglInit===void 0)return;let E=P.source,L=f.get(E);if(L){let k=L[v.__cacheKey];k.usedTimes--,k.usedTimes===0&&I(P),Object.keys(L).length===0&&f.delete(E)}i.remove(P)}function I(P){let v=i.get(P);n.deleteTexture(v.__webglTexture);let E=P.source,L=f.get(E);delete L[v.__cacheKey],o.memory.textures--}function D(P){let v=i.get(P);if(P.depthTexture&&(P.depthTexture.dispose(),i.remove(P.depthTexture)),P.isWebGLCubeRenderTarget)for(let L=0;L<6;L++){if(Array.isArray(v.__webglFramebuffer[L]))for(let k=0;k<v.__webglFramebuffer[L].length;k++)n.deleteFramebuffer(v.__webglFramebuffer[L][k]);else n.deleteFramebuffer(v.__webglFramebuffer[L]);v.__webglDepthbuffer&&n.deleteRenderbuffer(v.__webglDepthbuffer[L])}else{if(Array.isArray(v.__webglFramebuffer))for(let L=0;L<v.__webglFramebuffer.length;L++)n.deleteFramebuffer(v.__webglFramebuffer[L]);else n.deleteFramebuffer(v.__webglFramebuffer);if(v.__webglDepthbuffer&&n.deleteRenderbuffer(v.__webglDepthbuffer),v.__webglMultisampledFramebuffer&&n.deleteFramebuffer(v.__webglMultisampledFramebuffer),v.__webglColorRenderbuffer)for(let L=0;L<v.__webglColorRenderbuffer.length;L++)v.__webglColorRenderbuffer[L]&&n.deleteRenderbuffer(v.__webglColorRenderbuffer[L]);v.__webglDepthRenderbuffer&&n.deleteRenderbuffer(v.__webglDepthRenderbuffer)}let E=P.textures;for(let L=0,k=E.length;L<k;L++){let se=i.get(E[L]);se.__webglTexture&&(n.deleteTexture(se.__webglTexture),o.memory.textures--),i.remove(E[L])}i.remove(P)}let F=0;function z(){F=0}function N(){return F}function V(P){F=P}function K(){let P=F;return P>=r.maxTextures&&Qe("WebGLTextures: Trying to use "+(P+1)+" texture units while this GPU supports only "+r.maxTextures),F+=1,P}function $(P){let v=[];return v.push(P.wrapS),v.push(P.wrapT),v.push(P.wrapR||0),v.push(P.magFilter),v.push(P.minFilter),v.push(P.anisotropy),v.push(P.internalFormat),v.push(P.format),v.push(P.type),v.push(P.generateMipmaps),v.push(P.premultiplyAlpha),v.push(P.flipY),v.push(P.unpackAlignment),v.push(P.colorSpace),v.join()}function J(P,v){let E=i.get(P);if(P.isVideoTexture&&O(P),P.isRenderTargetTexture===!1&&P.isExternalTexture!==!0&&P.version>0&&E.__version!==P.version){let L=P.image;if(L===null)Qe("WebGLRenderer: Texture marked for update but no image data found.");else if(L.complete===!1)Qe("WebGLRenderer: Texture marked for update but image is incomplete");else{be(E,P,v);return}}else P.isExternalTexture&&(E.__webglTexture=P.sourceTexture?P.sourceTexture:null);t.bindTexture(n.TEXTURE_2D,E.__webglTexture,n.TEXTURE0+v)}function j(P,v){let E=i.get(P);if(P.isRenderTargetTexture===!1&&P.version>0&&E.__version!==P.version){be(E,P,v);return}else P.isExternalTexture&&(E.__webglTexture=P.sourceTexture?P.sourceTexture:null);t.bindTexture(n.TEXTURE_2D_ARRAY,E.__webglTexture,n.TEXTURE0+v)}function Q(P,v){let E=i.get(P);if(P.isRenderTargetTexture===!1&&P.version>0&&E.__version!==P.version){be(E,P,v);return}t.bindTexture(n.TEXTURE_3D,E.__webglTexture,n.TEXTURE0+v)}function ie(P,v){let E=i.get(P);if(P.isCubeDepthTexture!==!0&&P.version>0&&E.__version!==P.version){Ke(E,P,v);return}t.bindTexture(n.TEXTURE_CUBE_MAP,E.__webglTexture,n.TEXTURE0+v)}let Ve={[Th]:n.REPEAT,[Zn]:n.CLAMP_TO_EDGE,[Rh]:n.MIRRORED_REPEAT},Ue={[Bn]:n.NEAREST,[jv]:n.NEAREST_MIPMAP_NEAREST,[hc]:n.NEAREST_MIPMAP_LINEAR,[At]:n.LINEAR,[ad]:n.LINEAR_MIPMAP_NEAREST,[Os]:n.LINEAR_MIPMAP_LINEAR},_t={[Qv]:n.NEVER,[ry]:n.ALWAYS,[ey]:n.LESS,[Xd]:n.LEQUAL,[ty]:n.EQUAL,[$d]:n.GEQUAL,[ny]:n.GREATER,[iy]:n.NOTEQUAL};function lt(P,v){if(v.type===Hi&&e.has("OES_texture_float_linear")===!1&&(v.magFilter===At||v.magFilter===ad||v.magFilter===hc||v.magFilter===Os||v.minFilter===At||v.minFilter===ad||v.minFilter===hc||v.minFilter===Os)&&Qe("WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),n.texParameteri(P,n.TEXTURE_WRAP_S,Ve[v.wrapS]),n.texParameteri(P,n.TEXTURE_WRAP_T,Ve[v.wrapT]),(P===n.TEXTURE_3D||P===n.TEXTURE_2D_ARRAY)&&n.texParameteri(P,n.TEXTURE_WRAP_R,Ve[v.wrapR]),n.texParameteri(P,n.TEXTURE_MAG_FILTER,Ue[v.magFilter]),n.texParameteri(P,n.TEXTURE_MIN_FILTER,Ue[v.minFilter]),v.compareFunction&&(n.texParameteri(P,n.TEXTURE_COMPARE_MODE,n.COMPARE_REF_TO_TEXTURE),n.texParameteri(P,n.TEXTURE_COMPARE_FUNC,_t[v.compareFunction])),e.has("EXT_texture_filter_anisotropic")===!0){if(v.magFilter===Bn||v.minFilter!==hc&&v.minFilter!==Os||v.type===Hi&&e.has("OES_texture_float_linear")===!1)return;if(v.anisotropy>1||i.get(v).__currentAnisotropy){let E=e.get("EXT_texture_filter_anisotropic");n.texParameterf(P,E.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(v.anisotropy,r.getMaxAnisotropy())),i.get(v).__currentAnisotropy=v.anisotropy}}}function ot(P,v){let E=!1;P.__webglInit===void 0&&(P.__webglInit=!0,v.addEventListener("dispose",R));let L=v.source,k=f.get(L);k===void 0&&(k={},f.set(L,k));let se=$(v);if(se!==P.__cacheKey){k[se]===void 0&&(k[se]={texture:n.createTexture(),usedTimes:0},o.memory.textures++,E=!0),k[se].usedTimes++;let he=k[P.__cacheKey];he!==void 0&&(k[P.__cacheKey].usedTimes--,he.usedTimes===0&&I(v)),P.__cacheKey=se,P.__webglTexture=k[se].texture}return E}function Y(P,v,E){return Math.floor(Math.floor(P/E)/v)}function te(P,v,E,L){let se=P.updateRanges;if(se.length===0)t.texSubImage2D(n.TEXTURE_2D,0,0,0,v.width,v.height,E,L,v.data);else{se.sort((Fe,re)=>Fe.start-re.start);let he=0;for(let Fe=1;Fe<se.length;Fe++){let re=se[he],ue=se[Fe],Me=re.start+re.count,Ge=Y(ue.start,v.width,4),ht=Y(re.start,v.width,4);ue.start<=Me+1&&Ge===ht&&Y(ue.start+ue.count-1,v.width,4)===Ge?re.count=Math.max(re.count,ue.start+ue.count-re.start):(++he,se[he]=ue)}se.length=he+1;let X=t.getParameter(n.UNPACK_ROW_LENGTH),Z=t.getParameter(n.UNPACK_SKIP_PIXELS),me=t.getParameter(n.UNPACK_SKIP_ROWS);t.pixelStorei(n.UNPACK_ROW_LENGTH,v.width);for(let Fe=0,re=se.length;Fe<re;Fe++){let ue=se[Fe],Me=Math.floor(ue.start/4),Ge=Math.ceil(ue.count/4),ht=Me%v.width,B=Math.floor(Me/v.width),Ee=Ge,ne=1;t.pixelStorei(n.UNPACK_SKIP_PIXELS,ht),t.pixelStorei(n.UNPACK_SKIP_ROWS,B),t.texSubImage2D(n.TEXTURE_2D,0,ht,B,Ee,ne,E,L,v.data)}P.clearUpdateRanges(),t.pixelStorei(n.UNPACK_ROW_LENGTH,X),t.pixelStorei(n.UNPACK_SKIP_PIXELS,Z),t.pixelStorei(n.UNPACK_SKIP_ROWS,me)}}function be(P,v,E){let L=n.TEXTURE_2D;(v.isDataArrayTexture||v.isCompressedArrayTexture)&&(L=n.TEXTURE_2D_ARRAY),v.isData3DTexture&&(L=n.TEXTURE_3D);let k=ot(P,v),se=v.source;t.bindTexture(L,P.__webglTexture,n.TEXTURE0+E);let he=i.get(se);if(se.version!==he.__version||k===!0){if(t.activeTexture(n.TEXTURE0+E),(typeof ImageBitmap<"u"&&v.image instanceof ImageBitmap)===!1){let ne=yt.getPrimaries(yt.workingColorSpace),Te=v.colorSpace===ns?null:yt.getPrimaries(v.colorSpace),Ne=v.colorSpace===ns||ne===Te?n.NONE:n.BROWSER_DEFAULT_WEBGL;t.pixelStorei(n.UNPACK_FLIP_Y_WEBGL,v.flipY),t.pixelStorei(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL,v.premultiplyAlpha),t.pixelStorei(n.UNPACK_COLORSPACE_CONVERSION_WEBGL,Ne)}t.pixelStorei(n.UNPACK_ALIGNMENT,v.unpackAlignment);let Z=m(v.image,!1,r.maxTextureSize);Z=wn(v,Z);let me=s.convert(v.format,v.colorSpace),Fe=s.convert(v.type),re=_(v.internalFormat,me,Fe,v.normalized,v.colorSpace,v.isVideoTexture);lt(L,v);let ue,Me=v.mipmaps,Ge=v.isVideoTexture!==!0,ht=he.__version===void 0||k===!0,B=se.dataReady,Ee=T(v,Z);if(v.isDepthTexture)re=A(v.format===Fs,v.type),ht&&(Ge?t.texStorage2D(n.TEXTURE_2D,1,re,Z.width,Z.height):t.texImage2D(n.TEXTURE_2D,0,re,Z.width,Z.height,0,me,Fe,null));else if(v.isDataTexture)if(Me.length>0){Ge&&ht&&t.texStorage2D(n.TEXTURE_2D,Ee,re,Me[0].width,Me[0].height);for(let ne=0,Te=Me.length;ne<Te;ne++)ue=Me[ne],Ge?B&&t.texSubImage2D(n.TEXTURE_2D,ne,0,0,ue.width,ue.height,me,Fe,ue.data):t.texImage2D(n.TEXTURE_2D,ne,re,ue.width,ue.height,0,me,Fe,ue.data);v.generateMipmaps=!1}else Ge?(ht&&t.texStorage2D(n.TEXTURE_2D,Ee,re,Z.width,Z.height),B&&te(v,Z,me,Fe)):t.texImage2D(n.TEXTURE_2D,0,re,Z.width,Z.height,0,me,Fe,Z.data);else if(v.isCompressedTexture)if(v.isCompressedArrayTexture){Ge&&ht&&t.texStorage3D(n.TEXTURE_2D_ARRAY,Ee,re,Me[0].width,Me[0].height,Z.depth);for(let ne=0,Te=Me.length;ne<Te;ne++)if(ue=Me[ne],v.format!==Hn)if(me!==null)if(Ge){if(B)if(v.layerUpdates.size>0){let Ne=Xm(ue.width,ue.height,v.format,v.type);for(let le of v.layerUpdates){let Ye=ue.data.subarray(le*Ne/ue.data.BYTES_PER_ELEMENT,(le+1)*Ne/ue.data.BYTES_PER_ELEMENT);t.compressedTexSubImage3D(n.TEXTURE_2D_ARRAY,ne,0,0,le,ue.width,ue.height,1,me,Ye)}}else t.compressedTexSubImage3D(n.TEXTURE_2D_ARRAY,ne,0,0,0,ue.width,ue.height,Z.depth,me,ue.data)}else t.compressedTexImage3D(n.TEXTURE_2D_ARRAY,ne,re,ue.width,ue.height,Z.depth,0,ue.data,0,0);else Qe("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else Ge?B&&t.texSubImage3D(n.TEXTURE_2D_ARRAY,ne,0,0,0,ue.width,ue.height,Z.depth,me,Fe,ue.data):t.texImage3D(n.TEXTURE_2D_ARRAY,ne,re,ue.width,ue.height,Z.depth,0,me,Fe,ue.data);v.layerUpdates.size>0&&v.clearLayerUpdates()}else{Ge&&ht&&t.texStorage2D(n.TEXTURE_2D,Ee,re,Me[0].width,Me[0].height);for(let ne=0,Te=Me.length;ne<Te;ne++)ue=Me[ne],v.format!==Hn?me!==null?Ge?B&&t.compressedTexSubImage2D(n.TEXTURE_2D,ne,0,0,ue.width,ue.height,me,ue.data):t.compressedTexImage2D(n.TEXTURE_2D,ne,re,ue.width,ue.height,0,ue.data):Qe("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):Ge?B&&t.texSubImage2D(n.TEXTURE_2D,ne,0,0,ue.width,ue.height,me,Fe,ue.data):t.texImage2D(n.TEXTURE_2D,ne,re,ue.width,ue.height,0,me,Fe,ue.data)}else if(v.isDataArrayTexture)if(Ge){if(ht&&t.texStorage3D(n.TEXTURE_2D_ARRAY,Ee,re,Z.width,Z.height,Z.depth),B)if(v.layerUpdates.size>0){let ne=Xm(Z.width,Z.height,v.format,v.type);for(let Te of v.layerUpdates){let Ne=Z.data.subarray(Te*ne/Z.data.BYTES_PER_ELEMENT,(Te+1)*ne/Z.data.BYTES_PER_ELEMENT);t.texSubImage3D(n.TEXTURE_2D_ARRAY,0,0,0,Te,Z.width,Z.height,1,me,Fe,Ne)}v.clearLayerUpdates()}else t.texSubImage3D(n.TEXTURE_2D_ARRAY,0,0,0,0,Z.width,Z.height,Z.depth,me,Fe,Z.data)}else t.texImage3D(n.TEXTURE_2D_ARRAY,0,re,Z.width,Z.height,Z.depth,0,me,Fe,Z.data);else if(v.isData3DTexture)Ge?(ht&&t.texStorage3D(n.TEXTURE_3D,Ee,re,Z.width,Z.height,Z.depth),B&&t.texSubImage3D(n.TEXTURE_3D,0,0,0,0,Z.width,Z.height,Z.depth,me,Fe,Z.data)):t.texImage3D(n.TEXTURE_3D,0,re,Z.width,Z.height,Z.depth,0,me,Fe,Z.data);else if(v.isFramebufferTexture){if(ht)if(Ge)t.texStorage2D(n.TEXTURE_2D,Ee,re,Z.width,Z.height);else{let ne=Z.width,Te=Z.height;for(let Ne=0;Ne<Ee;Ne++)t.texImage2D(n.TEXTURE_2D,Ne,re,ne,Te,0,me,Fe,null),ne>>=1,Te>>=1}}else if(v.isHTMLTexture){if("texElementImage2D"in n){let ne=n.canvas;if(ne.hasAttribute("layoutsubtree")||ne.setAttribute("layoutsubtree","true"),Z.parentNode!==ne){ne.appendChild(Z),d.add(v),ne.onpaint=Te=>{let Ne=Te.changedElements;for(let le of d)Ne.includes(le.image)&&(le.needsUpdate=!0)},ne.requestPaint();return}if(n.texElementImage2D.length===3)n.texElementImage2D(n.TEXTURE_2D,n.RGBA8,Z);else{let Ne=n.RGBA,le=n.RGBA,Ye=n.UNSIGNED_BYTE;n.texElementImage2D(n.TEXTURE_2D,0,Ne,le,Ye,Z)}n.texParameteri(n.TEXTURE_2D,n.TEXTURE_MIN_FILTER,n.LINEAR),n.texParameteri(n.TEXTURE_2D,n.TEXTURE_WRAP_S,n.CLAMP_TO_EDGE),n.texParameteri(n.TEXTURE_2D,n.TEXTURE_WRAP_T,n.CLAMP_TO_EDGE)}}else if(Me.length>0){if(Ge&&ht){let ne=gt(Me[0]);t.texStorage2D(n.TEXTURE_2D,Ee,re,ne.width,ne.height)}for(let ne=0,Te=Me.length;ne<Te;ne++)ue=Me[ne],Ge?B&&t.texSubImage2D(n.TEXTURE_2D,ne,0,0,me,Fe,ue):t.texImage2D(n.TEXTURE_2D,ne,re,me,Fe,ue);v.generateMipmaps=!1}else if(Ge){if(ht){let ne=gt(Z);t.texStorage2D(n.TEXTURE_2D,Ee,re,ne.width,ne.height)}B&&t.texSubImage2D(n.TEXTURE_2D,0,0,0,me,Fe,Z)}else t.texImage2D(n.TEXTURE_2D,0,re,me,Fe,Z);p(v)&&b(L),he.__version=se.version,v.onUpdate&&v.onUpdate(v)}P.__version=v.version}function Ke(P,v,E){if(v.image.length!==6)return;let L=ot(P,v),k=v.source;t.bindTexture(n.TEXTURE_CUBE_MAP,P.__webglTexture,n.TEXTURE0+E);let se=i.get(k);if(k.version!==se.__version||L===!0){t.activeTexture(n.TEXTURE0+E);let he=yt.getPrimaries(yt.workingColorSpace),X=v.colorSpace===ns?null:yt.getPrimaries(v.colorSpace),Z=v.colorSpace===ns||he===X?n.NONE:n.BROWSER_DEFAULT_WEBGL;t.pixelStorei(n.UNPACK_FLIP_Y_WEBGL,v.flipY),t.pixelStorei(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL,v.premultiplyAlpha),t.pixelStorei(n.UNPACK_ALIGNMENT,v.unpackAlignment),t.pixelStorei(n.UNPACK_COLORSPACE_CONVERSION_WEBGL,Z);let me=v.isCompressedTexture||v.image[0].isCompressedTexture,Fe=v.image[0]&&v.image[0].isDataTexture,re=[];for(let le=0;le<6;le++)!me&&!Fe?re[le]=m(v.image[le],!0,r.maxCubemapSize):re[le]=Fe?v.image[le].image:v.image[le],re[le]=wn(v,re[le]);let ue=re[0],Me=s.convert(v.format,v.colorSpace),Ge=s.convert(v.type),ht=_(v.internalFormat,Me,Ge,v.normalized,v.colorSpace),B=v.isVideoTexture!==!0,Ee=se.__version===void 0||L===!0,ne=k.dataReady,Te=T(v,ue);lt(n.TEXTURE_CUBE_MAP,v);let Ne;if(me){B&&Ee&&t.texStorage2D(n.TEXTURE_CUBE_MAP,Te,ht,ue.width,ue.height);for(let le=0;le<6;le++){Ne=re[le].mipmaps;for(let Ye=0;Ye<Ne.length;Ye++){let ze=Ne[Ye];v.format!==Hn?Me!==null?B?ne&&t.compressedTexSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+le,Ye,0,0,ze.width,ze.height,Me,ze.data):t.compressedTexImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+le,Ye,ht,ze.width,ze.height,0,ze.data):Qe("WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):B?ne&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+le,Ye,0,0,ze.width,ze.height,Me,Ge,ze.data):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+le,Ye,ht,ze.width,ze.height,0,Me,Ge,ze.data)}}}else{if(Ne=v.mipmaps,B&&Ee){Ne.length>0&&Te++;let le=gt(re[0]);t.texStorage2D(n.TEXTURE_CUBE_MAP,Te,ht,le.width,le.height)}for(let le=0;le<6;le++)if(Fe){B?ne&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+le,0,0,0,re[le].width,re[le].height,Me,Ge,re[le].data):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+le,0,ht,re[le].width,re[le].height,0,Me,Ge,re[le].data);for(let Ye=0;Ye<Ne.length;Ye++){let nn=Ne[Ye].image[le].image;B?ne&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+le,Ye+1,0,0,nn.width,nn.height,Me,Ge,nn.data):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+le,Ye+1,ht,nn.width,nn.height,0,Me,Ge,nn.data)}}else{B?ne&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+le,0,0,0,Me,Ge,re[le]):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+le,0,ht,Me,Ge,re[le]);for(let Ye=0;Ye<Ne.length;Ye++){let ze=Ne[Ye];B?ne&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+le,Ye+1,0,0,Me,Ge,ze.image[le]):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+le,Ye+1,ht,Me,Ge,ze.image[le])}}}p(v)&&b(n.TEXTURE_CUBE_MAP),se.__version=k.version,v.onUpdate&&v.onUpdate(v)}P.__version=v.version}function Ce(P,v,E,L,k,se){let he=s.convert(E.format,E.colorSpace),X=s.convert(E.type),Z=_(E.internalFormat,he,X,E.normalized,E.colorSpace),me=i.get(v),Fe=i.get(E);if(Fe.__renderTarget=v,!me.__hasExternalTextures){let re=Math.max(1,v.width>>se),ue=Math.max(1,v.height>>se);k===n.TEXTURE_3D||k===n.TEXTURE_2D_ARRAY?t.texImage3D(k,se,Z,re,ue,v.depth,0,he,X,null):t.texImage2D(k,se,Z,re,ue,0,he,X,null)}t.bindFramebuffer(n.FRAMEBUFFER,P),Xt(v)?a.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,L,k,Fe.__webglTexture,0,Wt(v)):(k===n.TEXTURE_2D||k>=n.TEXTURE_CUBE_MAP_POSITIVE_X&&k<=n.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&n.framebufferTexture2D(n.FRAMEBUFFER,L,k,Fe.__webglTexture,se),t.bindFramebuffer(n.FRAMEBUFFER,null)}function ge(P,v,E){if(n.bindRenderbuffer(n.RENDERBUFFER,P),v.depthBuffer){let L=v.depthTexture,k=L&&L.isDepthTexture?L.type:null,se=A(v.stencilBuffer,k),he=v.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT;Xt(v)?a.renderbufferStorageMultisampleEXT(n.RENDERBUFFER,Wt(v),se,v.width,v.height):E?n.renderbufferStorageMultisample(n.RENDERBUFFER,Wt(v),se,v.width,v.height):n.renderbufferStorage(n.RENDERBUFFER,se,v.width,v.height),n.framebufferRenderbuffer(n.FRAMEBUFFER,he,n.RENDERBUFFER,P)}else{let L=v.textures;for(let k=0;k<L.length;k++){let se=L[k],he=s.convert(se.format,se.colorSpace),X=s.convert(se.type),Z=_(se.internalFormat,he,X,se.normalized,se.colorSpace);Xt(v)?a.renderbufferStorageMultisampleEXT(n.RENDERBUFFER,Wt(v),Z,v.width,v.height):E?n.renderbufferStorageMultisample(n.RENDERBUFFER,Wt(v),Z,v.width,v.height):n.renderbufferStorage(n.RENDERBUFFER,Z,v.width,v.height)}}n.bindRenderbuffer(n.RENDERBUFFER,null)}function ye(P,v,E){let L=v.isWebGLCubeRenderTarget===!0;if(t.bindFramebuffer(n.FRAMEBUFFER,P),!(v.depthTexture&&v.depthTexture.isDepthTexture))throw new Error("THREE.WebGLTextures: renderTarget.depthTexture must be an instance of THREE.DepthTexture.");let k=i.get(v.depthTexture);if(k.__renderTarget=v,(!k.__webglTexture||v.depthTexture.image.width!==v.width||v.depthTexture.image.height!==v.height)&&(v.depthTexture.image.width=v.width,v.depthTexture.image.height=v.height,v.depthTexture.needsUpdate=!0),L){if(k.__webglInit===void 0&&(k.__webglInit=!0,v.depthTexture.addEventListener("dispose",R)),k.__webglTexture===void 0){k.__webglTexture=n.createTexture(),t.bindTexture(n.TEXTURE_CUBE_MAP,k.__webglTexture),lt(n.TEXTURE_CUBE_MAP,v.depthTexture);let me=s.convert(v.depthTexture.format),Fe=s.convert(v.depthTexture.type),re;v.depthTexture.format===yr?re=n.DEPTH_COMPONENT24:v.depthTexture.format===Fs&&(re=n.DEPTH24_STENCIL8);for(let ue=0;ue<6;ue++)n.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ue,0,re,v.width,v.height,0,me,Fe,null)}}else J(v.depthTexture,0);let se=k.__webglTexture,he=Wt(v),X=L?n.TEXTURE_CUBE_MAP_POSITIVE_X+E:n.TEXTURE_2D,Z=v.depthTexture.format===Fs?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT;if(v.depthTexture.format===yr)Xt(v)?a.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,Z,X,se,0,he):n.framebufferTexture2D(n.FRAMEBUFFER,Z,X,se,0);else if(v.depthTexture.format===Fs)Xt(v)?a.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,Z,X,se,0,he):n.framebufferTexture2D(n.FRAMEBUFFER,Z,X,se,0);else throw new Error("THREE.WebGLTextures: Unknown depthTexture format.")}function Le(P){let v=i.get(P),E=P.isWebGLCubeRenderTarget===!0;if(v.__boundDepthTexture!==P.depthTexture){let L=P.depthTexture;if(v.__depthDisposeCallback&&v.__depthDisposeCallback(),L){let k=()=>{delete v.__boundDepthTexture,delete v.__depthDisposeCallback,L.removeEventListener("dispose",k)};L.addEventListener("dispose",k),v.__depthDisposeCallback=k}v.__boundDepthTexture=L}if(P.depthTexture&&!v.__autoAllocateDepthBuffer)if(E)for(let L=0;L<6;L++)ye(v.__webglFramebuffer[L],P,L);else{let L=P.texture.mipmaps;L&&L.length>0?ye(v.__webglFramebuffer[0],P,0):ye(v.__webglFramebuffer,P,0)}else if(E){v.__webglDepthbuffer=[];for(let L=0;L<6;L++)if(t.bindFramebuffer(n.FRAMEBUFFER,v.__webglFramebuffer[L]),v.__webglDepthbuffer[L]===void 0)v.__webglDepthbuffer[L]=n.createRenderbuffer(),ge(v.__webglDepthbuffer[L],P,!1);else{let k=P.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,se=v.__webglDepthbuffer[L];n.bindRenderbuffer(n.RENDERBUFFER,se),n.framebufferRenderbuffer(n.FRAMEBUFFER,k,n.RENDERBUFFER,se)}}else{let L=P.texture.mipmaps;if(L&&L.length>0?t.bindFramebuffer(n.FRAMEBUFFER,v.__webglFramebuffer[0]):t.bindFramebuffer(n.FRAMEBUFFER,v.__webglFramebuffer),v.__webglDepthbuffer===void 0)v.__webglDepthbuffer=n.createRenderbuffer(),ge(v.__webglDepthbuffer,P,!1);else{let k=P.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,se=v.__webglDepthbuffer;n.bindRenderbuffer(n.RENDERBUFFER,se),n.framebufferRenderbuffer(n.FRAMEBUFFER,k,n.RENDERBUFFER,se)}}t.bindFramebuffer(n.FRAMEBUFFER,null)}function $e(P,v,E){let L=i.get(P);v!==void 0&&Ce(L.__webglFramebuffer,P,P.texture,n.COLOR_ATTACHMENT0,n.TEXTURE_2D,0),E!==void 0&&Le(P)}function wt(P){let v=P.texture,E=i.get(P),L=i.get(v);P.addEventListener("dispose",x);let k=P.textures,se=P.isWebGLCubeRenderTarget===!0,he=k.length>1;if(he||(L.__webglTexture===void 0&&(L.__webglTexture=n.createTexture()),L.__version=v.version,o.memory.textures++),se){E.__webglFramebuffer=[];for(let X=0;X<6;X++)if(v.mipmaps&&v.mipmaps.length>0){E.__webglFramebuffer[X]=[];for(let Z=0;Z<v.mipmaps.length;Z++)E.__webglFramebuffer[X][Z]=n.createFramebuffer()}else E.__webglFramebuffer[X]=n.createFramebuffer()}else{if(v.mipmaps&&v.mipmaps.length>0){E.__webglFramebuffer=[];for(let X=0;X<v.mipmaps.length;X++)E.__webglFramebuffer[X]=n.createFramebuffer()}else E.__webglFramebuffer=n.createFramebuffer();if(he)for(let X=0,Z=k.length;X<Z;X++){let me=i.get(k[X]);me.__webglTexture===void 0&&(me.__webglTexture=n.createTexture(),o.memory.textures++)}if(P.samples>0&&Xt(P)===!1){E.__webglMultisampledFramebuffer=n.createFramebuffer(),E.__webglColorRenderbuffer=[],t.bindFramebuffer(n.FRAMEBUFFER,E.__webglMultisampledFramebuffer);for(let X=0;X<k.length;X++){let Z=k[X];E.__webglColorRenderbuffer[X]=n.createRenderbuffer(),n.bindRenderbuffer(n.RENDERBUFFER,E.__webglColorRenderbuffer[X]);let me=s.convert(Z.format,Z.colorSpace),Fe=s.convert(Z.type),re=_(Z.internalFormat,me,Fe,Z.normalized,Z.colorSpace,P.isXRRenderTarget===!0),ue=Wt(P);n.renderbufferStorageMultisample(n.RENDERBUFFER,ue,re,P.width,P.height),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+X,n.RENDERBUFFER,E.__webglColorRenderbuffer[X])}n.bindRenderbuffer(n.RENDERBUFFER,null),P.depthBuffer&&(E.__webglDepthRenderbuffer=n.createRenderbuffer(),ge(E.__webglDepthRenderbuffer,P,!0)),t.bindFramebuffer(n.FRAMEBUFFER,null)}}if(se){t.bindTexture(n.TEXTURE_CUBE_MAP,L.__webglTexture),lt(n.TEXTURE_CUBE_MAP,v);for(let X=0;X<6;X++)if(v.mipmaps&&v.mipmaps.length>0)for(let Z=0;Z<v.mipmaps.length;Z++)Ce(E.__webglFramebuffer[X][Z],P,v,n.COLOR_ATTACHMENT0,n.TEXTURE_CUBE_MAP_POSITIVE_X+X,Z);else Ce(E.__webglFramebuffer[X],P,v,n.COLOR_ATTACHMENT0,n.TEXTURE_CUBE_MAP_POSITIVE_X+X,0);p(v)&&b(n.TEXTURE_CUBE_MAP),t.unbindTexture()}else if(he){for(let X=0,Z=k.length;X<Z;X++){let me=k[X],Fe=i.get(me),re=n.TEXTURE_2D;(P.isWebGL3DRenderTarget||P.isWebGLArrayRenderTarget)&&(re=P.isWebGL3DRenderTarget?n.TEXTURE_3D:n.TEXTURE_2D_ARRAY),t.bindTexture(re,Fe.__webglTexture),lt(re,me),Ce(E.__webglFramebuffer,P,me,n.COLOR_ATTACHMENT0+X,re,0),p(me)&&b(re)}t.unbindTexture()}else{let X=n.TEXTURE_2D;if((P.isWebGL3DRenderTarget||P.isWebGLArrayRenderTarget)&&(X=P.isWebGL3DRenderTarget?n.TEXTURE_3D:n.TEXTURE_2D_ARRAY),t.bindTexture(X,L.__webglTexture),lt(X,v),v.mipmaps&&v.mipmaps.length>0)for(let Z=0;Z<v.mipmaps.length;Z++)Ce(E.__webglFramebuffer[Z],P,v,n.COLOR_ATTACHMENT0,X,Z);else Ce(E.__webglFramebuffer,P,v,n.COLOR_ATTACHMENT0,X,0);p(v)&&b(X),t.unbindTexture()}P.depthBuffer&&Le(P)}function we(P){let v=P.textures;for(let E=0,L=v.length;E<L;E++){let k=v[E];if(p(k)){let se=S(P),he=i.get(k).__webglTexture;t.bindTexture(se,he),b(se),t.unbindTexture()}}}let Ae=[],tt=[];function $t(P){if(P.samples>0){if(Xt(P)===!1){let v=P.textures,E=P.width,L=P.height,k=n.COLOR_BUFFER_BIT,se=P.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,he=i.get(P),X=v.length>1;if(X)for(let me=0;me<v.length;me++)t.bindFramebuffer(n.FRAMEBUFFER,he.__webglMultisampledFramebuffer),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+me,n.RENDERBUFFER,null),t.bindFramebuffer(n.FRAMEBUFFER,he.__webglFramebuffer),n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0+me,n.TEXTURE_2D,null,0);t.bindFramebuffer(n.READ_FRAMEBUFFER,he.__webglMultisampledFramebuffer);let Z=P.texture.mipmaps;Z&&Z.length>0?t.bindFramebuffer(n.DRAW_FRAMEBUFFER,he.__webglFramebuffer[0]):t.bindFramebuffer(n.DRAW_FRAMEBUFFER,he.__webglFramebuffer);for(let me=0;me<v.length;me++){if(P.resolveDepthBuffer&&(P.depthBuffer&&(k|=n.DEPTH_BUFFER_BIT),P.stencilBuffer&&P.resolveStencilBuffer&&(k|=n.STENCIL_BUFFER_BIT)),X){n.framebufferRenderbuffer(n.READ_FRAMEBUFFER,n.COLOR_ATTACHMENT0,n.RENDERBUFFER,he.__webglColorRenderbuffer[me]);let Fe=i.get(v[me]).__webglTexture;n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0,n.TEXTURE_2D,Fe,0)}n.blitFramebuffer(0,0,E,L,0,0,E,L,k,n.NEAREST),l===!0&&(Ae.length=0,tt.length=0,Ae.push(n.COLOR_ATTACHMENT0+me),P.depthBuffer&&P.storeMultisampledDepthBuffer===!1&&(Ae.push(se),tt.push(se),n.invalidateFramebuffer(n.DRAW_FRAMEBUFFER,tt)),n.invalidateFramebuffer(n.READ_FRAMEBUFFER,Ae))}if(t.bindFramebuffer(n.READ_FRAMEBUFFER,null),t.bindFramebuffer(n.DRAW_FRAMEBUFFER,null),X)for(let me=0;me<v.length;me++){t.bindFramebuffer(n.FRAMEBUFFER,he.__webglMultisampledFramebuffer),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+me,n.RENDERBUFFER,he.__webglColorRenderbuffer[me]);let Fe=i.get(v[me]).__webglTexture;t.bindFramebuffer(n.FRAMEBUFFER,he.__webglFramebuffer),n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0+me,n.TEXTURE_2D,Fe,0)}t.bindFramebuffer(n.DRAW_FRAMEBUFFER,he.__webglMultisampledFramebuffer)}else if(P.depthBuffer&&P.storeMultisampledDepthBuffer===!1&&l){let v=P.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT;n.invalidateFramebuffer(n.DRAW_FRAMEBUFFER,[v])}}}function Wt(P){return Math.min(r.maxSamples,P.samples)}function Xt(P){let v=i.get(P);return P.samples>0&&e.has("WEBGL_multisampled_render_to_texture")===!0&&v.__useRenderToTexture!==!1}function O(P){let v=o.render.frame;u.get(P)!==v&&(u.set(P,v),P.update())}function wn(P,v){let E=P.colorSpace,L=P.format,k=P.type;return P.isCompressedTexture===!0||P.isVideoTexture===!0||E!==xo&&E!==ns&&(yt.getTransfer(E)===kt?(L!==Hn||k!==Ci)&&Qe("WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):nt("WebGLTextures: Unsupported texture color space:",E)),v}function gt(P){return typeof HTMLImageElement<"u"&&P instanceof HTMLImageElement?(c.width=P.naturalWidth||P.width,c.height=P.naturalHeight||P.height):typeof VideoFrame<"u"&&P instanceof VideoFrame?(c.width=P.displayWidth,c.height=P.displayHeight):(c.width=P.width,c.height=P.height),c}this.allocateTextureUnit=K,this.resetTextureUnits=z,this.getTextureUnits=N,this.setTextureUnits=V,this.setTexture2D=J,this.setTexture2DArray=j,this.setTexture3D=Q,this.setTextureCube=ie,this.rebindTextures=$e,this.setupRenderTarget=wt,this.updateRenderTargetMipmap=we,this.updateMultisampleRenderTarget=$t,this.setupDepthRenderbuffer=Le,this.setupFrameBufferTexture=Ce,this.useMultisampledRTT=Xt,this.isReversedDepthBuffer=function(){return t.buffers.depth.getReversed()}}function DR(n,e){function t(i,r=ns){let s,o=yt.getTransfer(r);if(i===Ci)return n.UNSIGNED_BYTE;if(i===cd)return n.UNSIGNED_SHORT_4_4_4_4;if(i===ud)return n.UNSIGNED_SHORT_5_5_5_1;if(i===Nm)return n.UNSIGNED_INT_5_9_9_9_REV;if(i===Om)return n.UNSIGNED_INT_10F_11F_11F_REV;if(i===Lm)return n.BYTE;if(i===Dm)return n.SHORT;if(i===Ta)return n.UNSIGNED_SHORT;if(i===ld)return n.INT;if(i===lr)return n.UNSIGNED_INT;if(i===Hi)return n.FLOAT;if(i===Kn)return n.HALF_FLOAT;if(i===Fm)return n.ALPHA;if(i===Um)return n.RGB;if(i===Hn)return n.RGBA;if(i===yr)return n.DEPTH_COMPONENT;if(i===Fs)return n.DEPTH_STENCIL;if(i===hd)return n.RED;if(i===dd)return n.RED_INTEGER;if(i===Us)return n.RG;if(i===fd)return n.RG_INTEGER;if(i===pd)return n.RGBA_INTEGER;if(i===dc||i===fc||i===pc||i===mc)if(o===kt)if(s=e.get("WEBGL_compressed_texture_s3tc_srgb"),s!==null){if(i===dc)return s.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(i===fc)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(i===pc)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(i===mc)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(s=e.get("WEBGL_compressed_texture_s3tc"),s!==null){if(i===dc)return s.COMPRESSED_RGB_S3TC_DXT1_EXT;if(i===fc)return s.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(i===pc)return s.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(i===mc)return s.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(i===md||i===gd||i===xd||i===vd)if(s=e.get("WEBGL_compressed_texture_pvrtc"),s!==null){if(i===md)return s.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(i===gd)return s.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(i===xd)return s.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(i===vd)return s.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(i===yd||i===_d||i===Md||i===bd||i===Sd||i===gc||i===wd)if(s=e.get("WEBGL_compressed_texture_etc"),s!==null){if(i===yd||i===_d)return o===kt?s.COMPRESSED_SRGB8_ETC2:s.COMPRESSED_RGB8_ETC2;if(i===Md)return o===kt?s.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:s.COMPRESSED_RGBA8_ETC2_EAC;if(i===bd)return s.COMPRESSED_R11_EAC;if(i===Sd)return s.COMPRESSED_SIGNED_R11_EAC;if(i===gc)return s.COMPRESSED_RG11_EAC;if(i===wd)return s.COMPRESSED_SIGNED_RG11_EAC}else return null;if(i===Ed||i===Ad||i===Td||i===Rd||i===Cd||i===Id||i===Pd||i===Ld||i===Dd||i===Nd||i===Od||i===Fd||i===Ud||i===Bd)if(s=e.get("WEBGL_compressed_texture_astc"),s!==null){if(i===Ed)return o===kt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:s.COMPRESSED_RGBA_ASTC_4x4_KHR;if(i===Ad)return o===kt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:s.COMPRESSED_RGBA_ASTC_5x4_KHR;if(i===Td)return o===kt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:s.COMPRESSED_RGBA_ASTC_5x5_KHR;if(i===Rd)return o===kt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:s.COMPRESSED_RGBA_ASTC_6x5_KHR;if(i===Cd)return o===kt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:s.COMPRESSED_RGBA_ASTC_6x6_KHR;if(i===Id)return o===kt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:s.COMPRESSED_RGBA_ASTC_8x5_KHR;if(i===Pd)return o===kt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:s.COMPRESSED_RGBA_ASTC_8x6_KHR;if(i===Ld)return o===kt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:s.COMPRESSED_RGBA_ASTC_8x8_KHR;if(i===Dd)return o===kt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:s.COMPRESSED_RGBA_ASTC_10x5_KHR;if(i===Nd)return o===kt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:s.COMPRESSED_RGBA_ASTC_10x6_KHR;if(i===Od)return o===kt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:s.COMPRESSED_RGBA_ASTC_10x8_KHR;if(i===Fd)return o===kt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:s.COMPRESSED_RGBA_ASTC_10x10_KHR;if(i===Ud)return o===kt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:s.COMPRESSED_RGBA_ASTC_12x10_KHR;if(i===Bd)return o===kt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:s.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(i===kd||i===zd||i===Vd)if(s=e.get("EXT_texture_compression_bptc"),s!==null){if(i===kd)return o===kt?s.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:s.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(i===zd)return s.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(i===Vd)return s.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(i===Gd||i===Hd||i===xc||i===Wd)if(s=e.get("EXT_texture_compression_rgtc"),s!==null){if(i===Gd)return s.COMPRESSED_RED_RGTC1_EXT;if(i===Hd)return s.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(i===xc)return s.COMPRESSED_RED_GREEN_RGTC2_EXT;if(i===Wd)return s.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return i===Ra?n.UNSIGNED_INT_24_8:n[i]!==void 0?n[i]:null}return{convert:t}}var NR=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,OR=`
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

}`,u0=class{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,t){if(this.texture===null){let i=new ec(e.texture);(e.depthNear!==t.depthNear||e.depthFar!==t.depthFar)&&(this.depthNear=e.depthNear,this.depthFar=e.depthFar),this.texture=i}}getMesh(e){if(this.texture!==null&&this.mesh===null){let t=e.cameras[0].viewport,i=new Pt({vertexShader:NR,fragmentShader:OR,uniforms:{depthColor:{value:this.texture},depthWidth:{value:t.z},depthHeight:{value:t.w}}});this.mesh=new Vt(new Qr(20,20),i)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}},h0=class extends _r{constructor(e,t){super();let i=this,r=null,s=1,o=null,a="local-floor",l=1,c=null,u=null,d=null,h=null,f=null,g=null,y=typeof XRWebGLBinding<"u",m=new u0,p={},b=t.getContextAttributes(),S=null,_=null,A=[],T=[],R=new it,x=null,w=null,I=new jn;I.viewport=new en;let D=new jn;D.viewport=new en;let F=[I,D],z=new nd,N=null,V=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(Y){let te=A[Y];return te===void 0&&(te=new Ma,A[Y]=te),te.getTargetRaySpace()},this.getControllerGrip=function(Y){let te=A[Y];return te===void 0&&(te=new Ma,A[Y]=te),te.getGripSpace()},this.getHand=function(Y){let te=A[Y];return te===void 0&&(te=new Ma,A[Y]=te),te.getHandSpace()};function K(Y){let te=T.indexOf(Y.inputSource);if(te===-1)return;let be=A[te];be!==void 0&&(be.update(Y.inputSource,Y.frame,c||o),be.dispatchEvent({type:Y.type,data:Y.inputSource}))}function $(){r.removeEventListener("select",K),r.removeEventListener("selectstart",K),r.removeEventListener("selectend",K),r.removeEventListener("squeeze",K),r.removeEventListener("squeezestart",K),r.removeEventListener("squeezeend",K),r.removeEventListener("end",$),r.removeEventListener("inputsourceschange",J);for(let Y=0;Y<A.length;Y++){let te=T[Y];te!==null&&(T[Y]=null,A[Y].disconnect(te))}N=null,V=null,m.reset();for(let Y in p)delete p[Y];if(e.setRenderTarget(S),f=null,h=null,d=null,r=null,_=null,ot.stop(),i.isPresenting=!1,e.setPixelRatio(x),e.setSize(R.width,R.height,!1),w!==null){let Y=w.camera;Y.fov=w.fov,Y.zoom=w.zoom,Y.updateProjectionMatrix(),w=null}i.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(Y){s=Y,i.isPresenting===!0&&Qe("WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(Y){a=Y,i.isPresenting===!0&&Qe("WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return c||o},this.setReferenceSpace=function(Y){c=Y},this.getBaseLayer=function(){return h!==null?h:f},this.getBinding=function(){return d===null&&y&&(d=new XRWebGLBinding(r,t)),d},this.getFrame=function(){return g},this.getSession=function(){return r},this.setSession=async function(Y){if(r=Y,r!==null){if(S=e.getRenderTarget(),r.addEventListener("select",K),r.addEventListener("selectstart",K),r.addEventListener("selectend",K),r.addEventListener("squeeze",K),r.addEventListener("squeezestart",K),r.addEventListener("squeezeend",K),r.addEventListener("end",$),r.addEventListener("inputsourceschange",J),b.xrCompatible!==!0&&await t.makeXRCompatible(),x=e.getPixelRatio(),e.getSize(R),y&&"createProjectionLayer"in XRWebGLBinding.prototype){let be=null,Ke=null,Ce=null;b.depth&&(Ce=b.stencil?t.DEPTH24_STENCIL8:t.DEPTH_COMPONENT24,be=b.stencil?Fs:yr,Ke=b.stencil?Ra:lr);let ge={colorFormat:t.RGBA8,depthFormat:Ce,scaleFactor:s};d=this.getBinding(),h=d.createProjectionLayer(ge),r.updateRenderState({layers:[h]}),e.setPixelRatio(1),e.setSize(h.textureWidth,h.textureHeight,!1),_=new Tn(h.textureWidth,h.textureHeight,{format:Hn,type:Ci,depthTexture:new Is(h.textureWidth,h.textureHeight,Ke,void 0,void 0,void 0,void 0,void 0,void 0,be),stencilBuffer:b.stencil,colorSpace:e.outputColorSpace,samples:b.antialias?4:0,resolveDepthBuffer:h.ignoreDepthValues===!1,resolveStencilBuffer:h.ignoreDepthValues===!1,storeMultisampledDepthBuffer:h.ignoreDepthValues===!1,storeMultisampledStencilBuffer:h.ignoreDepthValues===!1})}else{let be={antialias:b.antialias,alpha:!0,depth:b.depth,stencil:b.stencil,framebufferScaleFactor:s};f=new XRWebGLLayer(r,t,be),r.updateRenderState({baseLayer:f}),e.setPixelRatio(1),e.setSize(f.framebufferWidth,f.framebufferHeight,!1),_=new Tn(f.framebufferWidth,f.framebufferHeight,{format:Hn,type:Ci,colorSpace:e.outputColorSpace,stencilBuffer:b.stencil,resolveDepthBuffer:f.ignoreDepthValues===!1,resolveStencilBuffer:f.ignoreDepthValues===!1,storeMultisampledDepthBuffer:f.ignoreDepthValues===!1,storeMultisampledStencilBuffer:f.ignoreDepthValues===!1})}_.isXRRenderTarget=!0,this.setFoveation(l),c=null,o=await r.requestReferenceSpace(a),ot.setContext(r),ot.start(),i.isPresenting=!0,i.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(r!==null)return r.environmentBlendMode},this.getDepthTexture=function(){return m.getDepthTexture()};function J(Y){for(let te=0;te<Y.removed.length;te++){let be=Y.removed[te],Ke=T.indexOf(be);Ke>=0&&(T[Ke]=null,A[Ke].disconnect(be))}for(let te=0;te<Y.added.length;te++){let be=Y.added[te],Ke=T.indexOf(be);if(Ke===-1){for(let ge=0;ge<A.length;ge++)if(ge>=T.length){T.push(be),Ke=ge;break}else if(T[ge]===null){T[ge]=be,Ke=ge;break}if(Ke===-1)break}let Ce=A[Ke];Ce&&Ce.connect(be)}}let j=new C,Q=new C;function ie(Y,te,be){j.setFromMatrixPosition(te.matrixWorld),Q.setFromMatrixPosition(be.matrixWorld);let Ke=j.distanceTo(Q),Ce=te.projectionMatrix.elements,ge=be.projectionMatrix.elements,ye=Ce[14]/(Ce[10]-1),Le=Ce[14]/(Ce[10]+1),$e=(Ce[9]+1)/Ce[5],wt=(Ce[9]-1)/Ce[5],we=(Ce[8]-1)/Ce[0],Ae=(ge[8]+1)/ge[0],tt=ye*we,$t=ye*Ae,Wt=Ke/(-we+Ae),Xt=Wt*-we;if(te.matrixWorld.decompose(Y.position,Y.quaternion,Y.scale),Y.translateX(Xt),Y.translateZ(Wt),Y.matrixWorld.compose(Y.position,Y.quaternion,Y.scale),Y.matrixWorldInverse.copy(Y.matrixWorld).invert(),Ce[10]===-1)Y.projectionMatrix.copy(te.projectionMatrix),Y.projectionMatrixInverse.copy(te.projectionMatrixInverse);else{let O=ye+Wt,wn=Le+Wt,gt=tt-Xt,P=$t+(Ke-Xt),v=$e*Le/wn*O,E=wt*Le/wn*O;Y.projectionMatrix.makePerspective(gt,P,v,E,O,wn),Y.projectionMatrixInverse.copy(Y.projectionMatrix).invert()}}function Ve(Y,te){te===null?Y.matrixWorld.copy(Y.matrix):Y.matrixWorld.multiplyMatrices(te.matrixWorld,Y.matrix),Y.matrixWorldInverse.copy(Y.matrixWorld).invert()}this.updateCamera=function(Y){if(r===null)return;let te=Y.near,be=Y.far;m.texture!==null&&(m.depthNear>0&&(te=m.depthNear),m.depthFar>0&&(be=m.depthFar)),z.near=D.near=I.near=te,z.far=D.far=I.far=be,(N!==z.near||V!==z.far)&&(r.updateRenderState({depthNear:z.near,depthFar:z.far}),N=z.near,V=z.far),z.layers.mask=Y.layers.mask|6,I.layers.mask=z.layers.mask&-5,D.layers.mask=z.layers.mask&-3;let Ke=Y.parent,Ce=z.cameras;Ve(z,Ke);for(let ge=0;ge<Ce.length;ge++)Ve(Ce[ge],Ke);Ce.length===2?ie(z,I,D):z.projectionMatrix.copy(I.projectionMatrix),w===null&&Y.isPerspectiveCamera&&(w={camera:Y,fov:Y.fov,zoom:Y.zoom}),Ue(Y,z,Ke)};function Ue(Y,te,be){be===null?Y.matrix.copy(te.matrixWorld):(Y.matrix.copy(be.matrixWorld),Y.matrix.invert(),Y.matrix.multiply(te.matrixWorld)),Y.matrix.decompose(Y.position,Y.quaternion,Y.scale),Y.updateMatrixWorld(!0),Y.projectionMatrix.copy(te.projectionMatrix),Y.projectionMatrixInverse.copy(te.projectionMatrixInverse),Y.isPerspectiveCamera&&(Y.fov=Ih*2*Math.atan(1/Y.projectionMatrix.elements[5]),Y.zoom=1)}this.getCamera=function(){return z},this.getFoveation=function(){if(!(h===null&&f===null))return l},this.setFoveation=function(Y){l=Y,h!==null&&(h.fixedFoveation=Y),f!==null&&f.fixedFoveation!==void 0&&(f.fixedFoveation=Y)},this.hasDepthSensing=function(){return m.texture!==null},this.getDepthSensingMesh=function(){return m.getMesh(z)},this.getCameraTexture=function(Y){return p[Y]};let _t=null;function lt(Y,te){if(u=te.getViewerPose(c||o),g=te,u!==null){let be=u.views;f!==null&&(e.setRenderTargetFramebuffer(_,f.framebuffer),e.setRenderTarget(_));let Ke=!1;be.length!==z.cameras.length&&(z.cameras.length=0,Ke=!0);for(let Le=0;Le<be.length;Le++){let $e=be[Le],wt=null;if(f!==null)wt=f.getViewport($e);else{let Ae=d.getViewSubImage(h,$e);wt=Ae.viewport,Le===0&&(e.setRenderTargetTextures(_,Ae.colorTexture,Ae.depthStencilTexture),e.setRenderTarget(_))}let we=F[Le];we===void 0&&(we=new jn,we.layers.enable(Le),we.viewport=new en,F[Le]=we),we.matrix.fromArray($e.transform.matrix),we.matrix.decompose(we.position,we.quaternion,we.scale),we.projectionMatrix.fromArray($e.projectionMatrix),we.projectionMatrixInverse.copy(we.projectionMatrix).invert(),we.viewport.set(wt.x,wt.y,wt.width,wt.height),Le===0&&(z.matrix.copy(we.matrix),z.matrix.decompose(z.position,z.quaternion,z.scale)),Ke===!0&&z.cameras.push(we)}let Ce=r.enabledFeatures;if(Ce&&Ce.includes("depth-sensing")&&r.depthUsage=="gpu-optimized"&&y){d=i.getBinding();let Le=d.getDepthInformation(be[0]);Le&&Le.isValid&&Le.texture&&m.init(Le,r.renderState)}if(Ce&&Ce.includes("camera-access")&&y){e.state.unbindTexture(),d=i.getBinding();for(let Le=0;Le<be.length;Le++){let $e=be[Le].camera;if($e){let wt=p[$e];wt||(wt=new ec,p[$e]=wt);let we=d.getCameraImage($e);wt.sourceTexture=we}}}}for(let be=0;be<A.length;be++){let Ke=T[be],Ce=A[be];Ke!==null&&Ce!==void 0&&Ce.update(Ke,te,c||o)}_t&&_t(Y,te),te.detectedPlanes&&i.dispatchEvent({type:"planesdetected",data:te}),g=null}let ot=new Ny;ot.setAnimationLoop(lt),this.setAnimationLoop=function(Y){_t=Y},this.dispose=function(){}}},FR=new Et,zy=new ut;zy.set(-1,0,0,0,1,0,0,0,1);function UR(n,e){function t(m,p){m.matrixAutoUpdate===!0&&m.updateMatrix(),p.value.copy(m.matrix)}function i(m,p){p.color.getRGB(m.fogColor.value,Gm(n)),p.isFog?(m.fogNear.value=p.near,m.fogFar.value=p.far):p.isFogExp2&&(m.fogDensity.value=p.density)}function r(m,p,b,S,_){p.isNodeMaterial?p.uniformsNeedUpdate=!1:p.isMeshBasicMaterial?s(m,p):p.isMeshLambertMaterial?(s(m,p),p.envMap&&(m.envMapIntensity.value=p.envMapIntensity)):p.isMeshToonMaterial?(s(m,p),d(m,p)):p.isMeshPhongMaterial?(s(m,p),u(m,p),p.envMap&&(m.envMapIntensity.value=p.envMapIntensity)):p.isMeshStandardMaterial?(s(m,p),h(m,p),p.isMeshPhysicalMaterial&&f(m,p,_)):p.isMeshMatcapMaterial?(s(m,p),g(m,p)):p.isMeshDepthMaterial?s(m,p):p.isMeshDistanceMaterial?(s(m,p),y(m,p)):p.isMeshNormalMaterial?s(m,p):p.isLineBasicMaterial?(o(m,p),p.isLineDashedMaterial&&a(m,p)):p.isPointsMaterial?l(m,p,b,S):p.isSpriteMaterial?c(m,p):p.isShadowMaterial?(m.color.value.copy(p.color),m.opacity.value=p.opacity):p.isShaderMaterial&&(p.uniformsNeedUpdate=!1)}function s(m,p){m.opacity.value=p.opacity,p.color&&m.diffuse.value.copy(p.color),p.emissive&&m.emissive.value.copy(p.emissive).multiplyScalar(p.emissiveIntensity),p.map&&(m.map.value=p.map,t(p.map,m.mapTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,t(p.alphaMap,m.alphaMapTransform)),p.bumpMap&&(m.bumpMap.value=p.bumpMap,t(p.bumpMap,m.bumpMapTransform),m.bumpScale.value=p.bumpScale,p.side===li&&(m.bumpScale.value*=-1)),p.normalMap&&(m.normalMap.value=p.normalMap,t(p.normalMap,m.normalMapTransform),m.normalScale.value.copy(p.normalScale),p.side===li&&m.normalScale.value.negate()),p.displacementMap&&(m.displacementMap.value=p.displacementMap,t(p.displacementMap,m.displacementMapTransform),m.displacementScale.value=p.displacementScale,m.displacementBias.value=p.displacementBias),p.emissiveMap&&(m.emissiveMap.value=p.emissiveMap,t(p.emissiveMap,m.emissiveMapTransform)),p.specularMap&&(m.specularMap.value=p.specularMap,t(p.specularMap,m.specularMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest);let b=e.get(p),S=b.envMap,_=b.envMapRotation;S&&(m.envMap.value=S,m.envMapRotation.value.setFromMatrix4(FR.makeRotationFromEuler(_)).transpose(),S.isCubeTexture&&S.isRenderTargetTexture===!1&&m.envMapRotation.value.premultiply(zy),m.reflectivity.value=p.reflectivity,m.ior.value=p.ior,m.refractionRatio.value=p.refractionRatio),p.lightMap&&(m.lightMap.value=p.lightMap,m.lightMapIntensity.value=p.lightMapIntensity,t(p.lightMap,m.lightMapTransform)),p.aoMap&&(m.aoMap.value=p.aoMap,m.aoMapIntensity.value=p.aoMapIntensity,t(p.aoMap,m.aoMapTransform))}function o(m,p){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,p.map&&(m.map.value=p.map,t(p.map,m.mapTransform))}function a(m,p){m.dashSize.value=p.dashSize,m.totalSize.value=p.dashSize+p.gapSize,m.scale.value=p.scale}function l(m,p,b,S){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,m.size.value=p.size*b,m.scale.value=S*.5,p.map&&(m.map.value=p.map,t(p.map,m.uvTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,t(p.alphaMap,m.alphaMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest)}function c(m,p){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,m.rotation.value=p.rotation,p.map&&(m.map.value=p.map,t(p.map,m.mapTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,t(p.alphaMap,m.alphaMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest)}function u(m,p){m.specular.value.copy(p.specular),m.shininess.value=Math.max(p.shininess,1e-4)}function d(m,p){p.gradientMap&&(m.gradientMap.value=p.gradientMap)}function h(m,p){m.metalness.value=p.metalness,p.metalnessMap&&(m.metalnessMap.value=p.metalnessMap,t(p.metalnessMap,m.metalnessMapTransform)),m.roughness.value=p.roughness,p.roughnessMap&&(m.roughnessMap.value=p.roughnessMap,t(p.roughnessMap,m.roughnessMapTransform)),p.envMap&&(m.envMapIntensity.value=p.envMapIntensity)}function f(m,p,b){m.ior.value=p.ior,p.sheen>0&&(m.sheenColor.value.copy(p.sheenColor).multiplyScalar(p.sheen),m.sheenRoughness.value=p.sheenRoughness,p.sheenColorMap&&(m.sheenColorMap.value=p.sheenColorMap,t(p.sheenColorMap,m.sheenColorMapTransform)),p.sheenRoughnessMap&&(m.sheenRoughnessMap.value=p.sheenRoughnessMap,t(p.sheenRoughnessMap,m.sheenRoughnessMapTransform))),p.clearcoat>0&&(m.clearcoat.value=p.clearcoat,m.clearcoatRoughness.value=p.clearcoatRoughness,p.clearcoatMap&&(m.clearcoatMap.value=p.clearcoatMap,t(p.clearcoatMap,m.clearcoatMapTransform)),p.clearcoatRoughnessMap&&(m.clearcoatRoughnessMap.value=p.clearcoatRoughnessMap,t(p.clearcoatRoughnessMap,m.clearcoatRoughnessMapTransform)),p.clearcoatNormalMap&&(m.clearcoatNormalMap.value=p.clearcoatNormalMap,t(p.clearcoatNormalMap,m.clearcoatNormalMapTransform),m.clearcoatNormalScale.value.copy(p.clearcoatNormalScale),p.side===li&&m.clearcoatNormalScale.value.negate())),p.dispersion>0&&(m.dispersion.value=p.dispersion),p.retroreflectivity>0&&(m.retroreflectivity.value=p.retroreflectivity),p.iridescence>0&&(m.iridescence.value=p.iridescence,m.iridescenceIOR.value=p.iridescenceIOR,m.iridescenceThicknessMinimum.value=p.iridescenceThicknessRange[0],m.iridescenceThicknessMaximum.value=p.iridescenceThicknessRange[1],p.iridescenceMap&&(m.iridescenceMap.value=p.iridescenceMap,t(p.iridescenceMap,m.iridescenceMapTransform)),p.iridescenceThicknessMap&&(m.iridescenceThicknessMap.value=p.iridescenceThicknessMap,t(p.iridescenceThicknessMap,m.iridescenceThicknessMapTransform))),p.transmission>0&&(m.transmission.value=p.transmission,m.transmissionSamplerMap.value=b.texture,m.transmissionSamplerSize.value.set(b.width,b.height),p.transmissionMap&&(m.transmissionMap.value=p.transmissionMap,t(p.transmissionMap,m.transmissionMapTransform)),m.thickness.value=p.thickness,p.thicknessMap&&(m.thicknessMap.value=p.thicknessMap,t(p.thicknessMap,m.thicknessMapTransform)),m.attenuationDistance.value=p.attenuationDistance,m.attenuationColor.value.copy(p.attenuationColor)),p.anisotropy>0&&(m.anisotropyVector.value.set(p.anisotropy*Math.cos(p.anisotropyRotation),p.anisotropy*Math.sin(p.anisotropyRotation)),p.anisotropyMap&&(m.anisotropyMap.value=p.anisotropyMap,t(p.anisotropyMap,m.anisotropyMapTransform))),m.specularIntensity.value=p.specularIntensity,m.specularColor.value.copy(p.specularColor),p.specularColorMap&&(m.specularColorMap.value=p.specularColorMap,t(p.specularColorMap,m.specularColorMapTransform)),p.specularIntensityMap&&(m.specularIntensityMap.value=p.specularIntensityMap,t(p.specularIntensityMap,m.specularIntensityMapTransform))}function g(m,p){p.matcap&&(m.matcap.value=p.matcap)}function y(m,p){let b=e.get(p).light;m.referencePosition.value.setFromMatrixPosition(b.matrixWorld),m.nearDistance.value=b.shadow.camera.near,m.farDistance.value=b.shadow.camera.far}return{refreshFogUniforms:i,refreshMaterialUniforms:r}}function BR(n,e,t,i){let r={},s={},o=[],a=n.getParameter(n.MAX_UNIFORM_BUFFER_BINDINGS);function l(_,A){let T=A.program;i.uniformBlockBinding(_,T)}function c(_,A){let T=r[_.id];T===void 0&&(m(_),T=u(_),r[_.id]=T,_.addEventListener("dispose",b));let R=A.program;i.updateUBOMapping(_,R);let x=e.render.frame;s[_.id]!==x&&(h(_),s[_.id]=x)}function u(_){let A=d();_.__bindingPointIndex=A;let T=n.createBuffer(),R=_.__size,x=_.usage;return n.bindBuffer(n.UNIFORM_BUFFER,T),n.bufferData(n.UNIFORM_BUFFER,R,x),n.bindBuffer(n.UNIFORM_BUFFER,null),n.bindBufferBase(n.UNIFORM_BUFFER,A,T),T}function d(){for(let _=0;_<a;_++)if(o.indexOf(_)===-1)return o.push(_),_;return nt("WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function h(_){let A=r[_.id],T=_.uniforms,R=_.__cache;n.bindBuffer(n.UNIFORM_BUFFER,A);for(let x=0,w=T.length;x<w;x++){let I=T[x];if(Array.isArray(I))for(let D=0,F=I.length;D<F;D++)f(I[D],x,D,R);else f(I,x,0,R)}n.bindBuffer(n.UNIFORM_BUFFER,null)}function f(_,A,T,R){if(y(_,A,T,R)===!0){let x=_.__offset,w=_.value;if(Array.isArray(w)){let I=0;for(let D=0;D<w.length;D++){let F=w[D],z=p(F);g(F,_.__data,I),typeof F!="number"&&typeof F!="boolean"&&!F.isMatrix3&&!ArrayBuffer.isView(F)&&(I+=z.storage/Float32Array.BYTES_PER_ELEMENT)}}else g(w,_.__data,0);n.bufferSubData(n.UNIFORM_BUFFER,x,_.__data)}}function g(_,A,T){typeof _=="number"||typeof _=="boolean"?A[0]=_:_.isMatrix3?(A[0]=_.elements[0],A[1]=_.elements[1],A[2]=_.elements[2],A[3]=0,A[4]=_.elements[3],A[5]=_.elements[4],A[6]=_.elements[5],A[7]=0,A[8]=_.elements[6],A[9]=_.elements[7],A[10]=_.elements[8],A[11]=0):ArrayBuffer.isView(_)?A.set(new _.constructor(_.buffer,_.byteOffset,A.length)):_.toArray(A,T)}function y(_,A,T,R){let x=_.value,w=A+"_"+T;if(R[w]===void 0)return typeof x=="number"||typeof x=="boolean"?R[w]=x:ArrayBuffer.isView(x)?R[w]=x.slice():R[w]=x.clone(),!0;{let I=R[w];if(typeof x=="number"||typeof x=="boolean"){if(I!==x)return R[w]=x,!0}else{if(ArrayBuffer.isView(x))return!0;if(I.equals(x)===!1)return I.copy(x),!0}}return!1}function m(_){let A=_.uniforms,T=0,R=16;for(let w=0,I=A.length;w<I;w++){let D=Array.isArray(A[w])?A[w]:[A[w]];for(let F=0,z=D.length;F<z;F++){let N=D[F],V=Array.isArray(N.value)?N.value:[N.value];for(let K=0,$=V.length;K<$;K++){let J=V[K],j=p(J),Q=T%R,ie=Q%j.boundary,Ve=Q+ie;T+=ie,Ve!==0&&R-Ve<j.storage&&(T+=R-Ve),N.__data=new Float32Array(j.storage/Float32Array.BYTES_PER_ELEMENT),N.__offset=T,T+=j.storage}}}let x=T%R;return x>0&&(T+=R-x),_.__size=T,_.__cache={},this}function p(_){let A={boundary:0,storage:0};return typeof _=="number"||typeof _=="boolean"?(A.boundary=4,A.storage=4):_.isVector2?(A.boundary=8,A.storage=8):_.isVector3||_.isColor?(A.boundary=16,A.storage=12):_.isVector4?(A.boundary=16,A.storage=16):_.isMatrix3?(A.boundary=48,A.storage=48):_.isMatrix4?(A.boundary=64,A.storage=64):_.isTexture?Qe("WebGLRenderer: Texture samplers can not be part of an uniforms group."):ArrayBuffer.isView(_)?(A.boundary=16,A.storage=_.byteLength):Qe("WebGLRenderer: Unsupported uniform value type.",_),A}function b(_){let A=_.target;A.removeEventListener("dispose",b);let T=o.indexOf(A.__bindingPointIndex);o.splice(T,1),n.deleteBuffer(r[A.id]),delete r[A.id],delete s[A.id]}function S(){for(let _ in r)n.deleteBuffer(r[_]);o=[],r={},s={}}return{bind:l,update:c,dispose:S}}var kR=new Uint16Array([12469,15057,12620,14925,13266,14620,13807,14376,14323,13990,14545,13625,14713,13328,14840,12882,14931,12528,14996,12233,15039,11829,15066,11525,15080,11295,15085,10976,15082,10705,15073,10495,13880,14564,13898,14542,13977,14430,14158,14124,14393,13732,14556,13410,14702,12996,14814,12596,14891,12291,14937,11834,14957,11489,14958,11194,14943,10803,14921,10506,14893,10278,14858,9960,14484,14039,14487,14025,14499,13941,14524,13740,14574,13468,14654,13106,14743,12678,14818,12344,14867,11893,14889,11509,14893,11180,14881,10751,14852,10428,14812,10128,14765,9754,14712,9466,14764,13480,14764,13475,14766,13440,14766,13347,14769,13070,14786,12713,14816,12387,14844,11957,14860,11549,14868,11215,14855,10751,14825,10403,14782,10044,14729,9651,14666,9352,14599,9029,14967,12835,14966,12831,14963,12804,14954,12723,14936,12564,14917,12347,14900,11958,14886,11569,14878,11247,14859,10765,14828,10401,14784,10011,14727,9600,14660,9289,14586,8893,14508,8533,15111,12234,15110,12234,15104,12216,15092,12156,15067,12010,15028,11776,14981,11500,14942,11205,14902,10752,14861,10393,14812,9991,14752,9570,14682,9252,14603,8808,14519,8445,14431,8145,15209,11449,15208,11451,15202,11451,15190,11438,15163,11384,15117,11274,15055,10979,14994,10648,14932,10343,14871,9936,14803,9532,14729,9218,14645,8742,14556,8381,14461,8020,14365,7603,15273,10603,15272,10607,15267,10619,15256,10631,15231,10614,15182,10535,15118,10389,15042,10167,14963,9787,14883,9447,14800,9115,14710,8665,14615,8318,14514,7911,14411,7507,14279,7198,15314,9675,15313,9683,15309,9712,15298,9759,15277,9797,15229,9773,15166,9668,15084,9487,14995,9274,14898,8910,14800,8539,14697,8234,14590,7790,14479,7409,14367,7067,14178,6621,15337,8619,15337,8631,15333,8677,15325,8769,15305,8871,15264,8940,15202,8909,15119,8775,15022,8565,14916,8328,14804,8009,14688,7614,14569,7287,14448,6888,14321,6483,14088,6171,15350,7402,15350,7419,15347,7480,15340,7613,15322,7804,15287,7973,15229,8057,15148,8012,15046,7846,14933,7611,14810,7357,14682,7069,14552,6656,14421,6316,14251,5948,14007,5528,15356,5942,15356,5977,15353,6119,15348,6294,15332,6551,15302,6824,15249,7044,15171,7122,15070,7050,14949,6861,14818,6611,14679,6349,14538,6067,14398,5651,14189,5311,13935,4958,15359,4123,15359,4153,15356,4296,15353,4646,15338,5160,15311,5508,15263,5829,15188,6042,15088,6094,14966,6001,14826,5796,14678,5543,14527,5287,14377,4985,14133,4586,13869,4257,15360,1563,15360,1642,15358,2076,15354,2636,15341,3350,15317,4019,15273,4429,15203,4732,15105,4911,14981,4932,14836,4818,14679,4621,14517,4386,14359,4156,14083,3795,13808,3437,15360,122,15360,137,15358,285,15355,636,15344,1274,15322,2177,15281,2765,15215,3223,15120,3451,14995,3569,14846,3567,14681,3466,14511,3305,14344,3121,14037,2800,13753,2467,15360,0,15360,1,15359,21,15355,89,15346,253,15325,479,15287,796,15225,1148,15133,1492,15008,1749,14856,1882,14685,1886,14506,1783,14324,1608,13996,1398,13702,1183]),Er=null;function zR(){return Er===null&&(Er=new ql(kR,16,16,Us,Kn),Er.name="DFG_LUT",Er.minFilter=At,Er.magFilter=At,Er.wrapS=Zn,Er.wrapT=Zn,Er.generateMipmaps=!1,Er.needsUpdate=!0),Er}var Kd=class{constructor(e={}){let{canvas:t=sy(),context:i=null,depth:r=!0,stencil:s=!1,alpha:o=!1,antialias:a=!1,premultipliedAlpha:l=!0,preserveDrawingBuffer:c=!1,powerPreference:u="default",failIfMajorPerformanceCaveat:d=!1,reversedDepthBuffer:h=!1,outputBufferType:f=Ci}=e;this.isWebGLRenderer=!0;let g;if(i!==null){if(typeof WebGLRenderingContext<"u"&&i instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");g=i.getContextAttributes().alpha}else g=o;let y=f,m=new Set([pd,fd,dd]),p=new Set([Ci,lr,Ta,Ra,cd,ud]),b=new Uint32Array(4),S=new Int32Array(4),_=new C,A=null,T=null,R=[],x=[],w=null;this.domElement=t,this.debug={checkShaderErrors:!0,diagnostics:{keywords:!1},onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=Ri,this.toneMappingExposure=1,this.transmissionResolutionScale=1;let I=this,D=!1,F=null,z=null,N=null,V=null;this._outputColorSpace=Ai;let K=0,$=0,J=null,j=-1,Q=null,ie=new en,Ve=new en,Ue=null,_t=new St(0),lt=0,ot=t.width,Y=t.height,te=1,be=null,Ke=null,Ce=new en(0,0,ot,Y),ge=new en(0,0,ot,Y),ye=!1,Le=new Zl,$e=!1,wt=!1,we=new Et,Ae=new C,tt=new en,$t={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0},Wt=!1;function Xt(){return J===null?te:1}let O=i;function wn(M,U){return t.getContext(M,U)}let gt,P,v,E,L,k,se,he,X,Z,me,Fe,re,ue,Me,Ge,ht,B,Ee,ne,Te,Ne,le;try{let M={alpha:!0,depth:r,stencil:s,antialias:a,premultipliedAlpha:l,preserveDrawingBuffer:c,powerPreference:u,failIfMajorPerformanceCaveat:d};if("setAttribute"in t&&t.setAttribute("data-engine",`three.js r${"186"}`),t.addEventListener("webglcontextlost",nn,!1),t.addEventListener("webglcontextrestored",Ft,!1),t.addEventListener("webglcontextcreationerror",er,!1),O===null){let U="webgl2";if(O=wn(U,M),O===null)throw wn(U)?new Error("THREE.WebGLRenderer: Error creating WebGL context with your selected attributes."):new Error("THREE.WebGLRenderer: Error creating WebGL context.")}Ye()}catch(M){throw t.removeEventListener("webglcontextlost",nn,!1),t.removeEventListener("webglcontextrestored",Ft,!1),t.removeEventListener("webglcontextcreationerror",er,!1),nt("WebGLRenderer: "+M.message),M}function Ye(){gt=new YA(O),gt.init(),Te=new DR(O,gt),P=new UA(O,gt,e,Te),v=new PR(O,gt),P.reversedDepthBuffer&&h&&v.buffers.depth.setReversed(!0),z=O.createFramebuffer(),N=O.createFramebuffer(),V=O.createFramebuffer(),E=new ZA(O),L=new xR,k=new LR(O,gt,v,L,P,Te,E),se=new $A(I),he=new J1(O),Ne=new OA(O,he),X=new qA(O,he,E,Ne),Z=new JA(O,X,he,Ne,E),B=new KA(O,P,k),Me=new BA(L),me=new gR(I,se,gt,P,Ne,Me),Fe=new UR(I,L),re=new yR,ue=new ER(gt),ht=new NA(I,se,v,Z,g,l),Ge=new IR(I,Z,P),le=new BR(O,E,P,v),Ee=new FA(O,gt,E),ne=new jA(O,gt,E),E.programs=me.programs,I.capabilities=P,I.extensions=gt,I.properties=L,I.renderLists=re,I.shadowMap=Ge,I.state=v,I.info=E}y!==Ci&&(w=new eT(y,t.width,t.height,a,r,s));let ze=new h0(I,O);this.xr=ze,this.getContext=function(){return O},this.getContextAttributes=function(){return O.getContextAttributes()},this.forceContextLoss=function(){let M=gt.get("WEBGL_lose_context");M&&M.loseContext()},this.forceContextRestore=function(){let M=gt.get("WEBGL_lose_context");M&&M.restoreContext()},this.getPixelRatio=function(){return te},this.setPixelRatio=function(M){M!==void 0&&(te=M,this.setSize(ot,Y,!1))},this.getSize=function(M){return M.set(ot,Y)},this.setSize=function(M,U,q=!0){if(ze.isPresenting){Qe("WebGLRenderer: Can't change size while VR device is presenting.");return}ot=M,Y=U,t.width=Math.floor(M*te),t.height=Math.floor(U*te),q===!0&&(t.style.width=M+"px",t.style.height=U+"px"),w!==null&&w.setSize(t.width,t.height),this.setViewport(0,0,M,U)},this.getDrawingBufferSize=function(M){return M.set(ot*te,Y*te).floor()},this.setDrawingBufferSize=function(M,U,q){ot=M,Y=U,te=q,t.width=Math.floor(M*q),t.height=Math.floor(U*q),this.setViewport(0,0,M,U)},this.setEffects=function(M){if(y===Ci){nt("WebGLRenderer: setEffects() requires outputBufferType set to HalfFloatType or FloatType.");return}if(M){for(let U=0;U<M.length;U++)if(M[U].isOutputPass===!0){Qe("WebGLRenderer: OutputPass is not needed in setEffects(). Tone mapping and color space conversion are applied automatically.");break}}w.setEffects(M||[])},this.getCurrentViewport=function(M){return M.copy(ie)},this.getViewport=function(M){return M.copy(Ce)},this.setViewport=function(M,U,q,G){M.isVector4?Ce.set(M.x,M.y,M.z,M.w):Ce.set(M,U,q,G),v.viewport(ie.copy(Ce).multiplyScalar(te).round())},this.getScissor=function(M){return M.copy(ge)},this.setScissor=function(M,U,q,G){M.isVector4?ge.set(M.x,M.y,M.z,M.w):ge.set(M,U,q,G),v.scissor(Ve.copy(ge).multiplyScalar(te).round())},this.getScissorTest=function(){return ye},this.setScissorTest=function(M){v.setScissorTest(ye=M)},this.setOpaqueSort=function(M){be=M},this.setTransparentSort=function(M){Ke=M},this.getClearColor=function(M){return M.copy(ht.getClearColor())},this.setClearColor=function(){ht.setClearColor(...arguments)},this.getClearAlpha=function(){return ht.getClearAlpha()},this.setClearAlpha=function(){ht.setClearAlpha(...arguments)},this.clear=function(M=!0,U=!0,q=!0){let G=0;if(M){let H=!1;if(J!==null){let Oe=J.texture.format;H=m.has(Oe)}if(H){let Oe=J.texture.type,ke=p.has(Oe),De=ht.getClearColor(),He=ht.getClearAlpha(),qe=De.r,pt=De.g,Mt=De.b;ke?(b[0]=qe,b[1]=pt,b[2]=Mt,b[3]=He,O.clearBufferuiv(O.COLOR,0,b)):(S[0]=qe,S[1]=pt,S[2]=Mt,S[3]=He,O.clearBufferiv(O.COLOR,0,S))}else G|=O.COLOR_BUFFER_BIT}U&&(G|=O.DEPTH_BUFFER_BIT,this.state.buffers.depth.setMask(!0)),q&&(G|=O.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),G!==0&&O.clear(G)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.setNodesHandler=function(M){M.setRenderer(this),F=M},this.dispose=function(){t.removeEventListener("webglcontextlost",nn,!1),t.removeEventListener("webglcontextrestored",Ft,!1),t.removeEventListener("webglcontextcreationerror",er,!1),ht.dispose(),re.dispose(),ue.dispose(),L.dispose(),se.dispose(),Z.dispose(),Ne.dispose(),le.dispose(),me.dispose(),ze.dispose(),ze.removeEventListener("sessionstart",nx),ze.removeEventListener("sessionend",ix),so.stop()};function nn(M){M.preventDefault(),Hl("WebGLRenderer: Context Lost."),D=!0}function Ft(){Hl("WebGLRenderer: Context Restored."),D=!1;let M=E.autoReset,U=Ge.enabled,q=Ge.autoUpdate,G=Ge.needsUpdate,H=Ge.type;Ye(),E.autoReset=M,Ge.enabled=U,Ge.autoUpdate=q,Ge.needsUpdate=G,Ge.type=H}function er(M){nt("WebGLRenderer: A WebGL context could not be created. Reason: ",M.statusMessage)}function pr(M){let U=M.target;U.removeEventListener("dispose",pr),AS(U)}function AS(M){TS(M),L.remove(M)}function TS(M){let U=L.get(M).programs;U!==void 0&&(U.forEach(function(q){me.releaseProgram(q)}),M.isShaderMaterial&&me.releaseShaderCache(M))}this.renderBufferDirect=function(M,U,q,G,H,Oe){U===null&&(U=$t);let ke=H.isMesh&&H.matrixWorld.determinantAffine()<0,De=IS(M,U,q,G,H);v.setMaterial(G,ke);let He=q.index,qe=1;if(G.wireframe===!0){if(He=X.getWireframeAttribute(q),He===void 0)return;qe=2}let pt=q.drawRange,Mt=q.attributes.position,We=pt.start*qe,Ut=(pt.start+pt.count)*qe;Oe!==null&&(We=Math.max(We,Oe.start*qe),Ut=Math.min(Ut,(Oe.start+Oe.count)*qe)),He!==null?(We=Math.max(We,0),Ut=Math.min(Ut,He.count)):Mt!=null&&(We=Math.max(We,0),Ut=Math.min(Ut,Mt.count));let En=Ut-We;if(En<0||En===1/0)return;Ne.setup(H,G,De,q,He);let on,Kt=Ee;if(He!==null&&(on=he.get(He),Kt=ne,Kt.setIndex(on)),H.isMesh)G.wireframe===!0?(v.setLineWidth(G.wireframeLinewidth*Xt()),Kt.setMode(O.LINES)):Kt.setMode(O.TRIANGLES);else if(H.isLine){let $n=G.linewidth;$n===void 0&&($n=1),v.setLineWidth($n*Xt()),H.isLineSegments?Kt.setMode(O.LINES):H.isLineLoop?Kt.setMode(O.LINE_LOOP):Kt.setMode(O.LINE_STRIP)}else H.isPoints?Kt.setMode(O.POINTS):H.isSprite&&Kt.setMode(O.TRIANGLES);if(H.isBatchedMesh)if(gt.get("WEBGL_multi_draw"))Kt.renderMultiDraw(H._multiDrawStarts,H._multiDrawCounts,H._multiDrawCount);else{let $n=H._multiDrawStarts,Be=H._multiDrawCounts,ri=H._multiDrawCount,Rt=He?he.get(He).bytesPerElement:1,Bi=L.get(G).currentProgram.getUniforms();for(let mr=0;mr<ri;mr++)Bi.setValue(O,"_gl_DrawID",mr),Kt.render($n[mr]/Rt,Be[mr])}else if(H.isInstancedMesh)Kt.renderInstances(We,En,H.count);else if(q.isInstancedBufferGeometry){let $n=q._maxInstanceCount!==void 0?q._maxInstanceCount:1/0,Be=Math.min(q.instanceCount,$n);Kt.renderInstances(We,En,Be)}else Kt.render(We,En)};function tx(M,U,q,G){F!==null&&M.isNodeMaterial&&F.setObject(G,M),$e===!0&&Me.setState(M,q,!1),M.transparent===!0&&M.side===wr&&M.forceSinglePass===!1?(M.side=li,M.needsUpdate=!0,Ru(M,U,G),M.side=Sr,M.needsUpdate=!0,Ru(M,U,G),M.side=wr):Ru(M,U,G)}this.compile=function(M,U,q=null){q===null&&(q=M),F!==null&&F.renderStart(M,U,q),T=ue.get(q),T.init(U),x.push(T),q.traverseVisible(function(H){H.isLight&&H.layers.test(U.layers)&&(T.pushLight(H),H.castShadow&&T.pushShadow(H))}),M!==q&&M.traverseVisible(function(H){H.isLight&&H.layers.test(U.layers)&&(T.pushLight(H),H.castShadow&&T.pushShadow(H))}),T.setupLights(),F!==null&&F.updateLights(T.state.lightsArray),wt=this.localClippingEnabled,$e=Me.init(this.clippingPlanes,wt),$e===!0&&Me.setGlobalState(this.clippingPlanes,U),F!==null&&Ge.render(T.state.shadowsArray,q,U);let G=new Set;return M.traverse(function(H){if(!(H.isMesh||H.isPoints||H.isLine||H.isSprite))return;let Oe=H.material;if(Oe)if(Array.isArray(Oe))for(let ke=0;ke<Oe.length;ke++){let De=Oe[ke];tx(De,q,U,H),G.add(De)}else tx(Oe,q,U,H),G.add(Oe)}),T=x.pop(),F!==null&&F.renderEnd(),G},this.compileAsync=function(M,U,q=null){let G=this.compile(M,U,q);return new Promise(H=>{function Oe(){if(G.forEach(function(ke){let He=L.get(ke).currentProgram;(He===void 0||He.isReady())&&G.delete(ke)}),G.size===0){H(M);return}setTimeout(Oe,10)}gt.get("KHR_parallel_shader_compile")!==null?Oe():setTimeout(Oe,10)})};let vp=null;function RS(M){vp&&vp(M)}function nx(){so.stop()}function ix(){so.start()}let so=new Ny;so.setAnimationLoop(RS),typeof self<"u"&&so.setContext(self),this.setAnimationLoop=function(M){vp=M,ze.setAnimationLoop(M),M===null?so.stop():so.start()},ze.addEventListener("sessionstart",nx),ze.addEventListener("sessionend",ix),this.render=function(M,U){if(U!==void 0&&U.isCamera!==!0){nt("WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(D===!0)return;F!==null&&F.renderStart(M,U);let q=ze.enabled===!0&&ze.isPresenting===!0,G=w!==null&&(J===null||q)&&w.begin(I,J);if(M.matrixWorldAutoUpdate===!0&&M.updateMatrixWorld(),U.parent===null&&U.matrixWorldAutoUpdate===!0&&U.updateMatrixWorld(),ze.enabled===!0&&ze.isPresenting===!0&&(w===null||w.isCompositing()===!1)&&(ze.cameraAutoUpdate===!0&&ze.updateCamera(U),U=ze.getCamera()),M.isScene===!0&&M.onBeforeRender(I,M,U,J),T=ue.get(M,x.length),T.init(U),T.state.textureUnits=k.getTextureUnits(),x.push(T),we.multiplyMatrices(U.projectionMatrix,U.matrixWorldInverse),Le.setFromProjectionMatrix(we,or,U.reversedDepth),wt=this.localClippingEnabled,$e=Me.init(this.clippingPlanes,wt),A=re.get(M,R.length),A.init(),R.push(A),ze.enabled===!0&&ze.isPresenting===!0){let ke=I.xr.getDepthSensingMesh();ke!==null&&yp(ke,U,-1/0,I.sortObjects)}yp(M,U,0,I.sortObjects),A.finish(),F!==null&&F.updateLights(T.state.lightsArray),I.sortObjects===!0&&A.sort(be,Ke),Wt=ze.enabled===!1||ze.isPresenting===!1||ze.hasDepthSensing()===!1,Wt&&ht.addToRenderList(A,M),this.info.render.frame++,this.info.autoReset===!0&&this.info.reset(),$e===!0&&Me.beginShadows();let H=T.state.shadowsArray;if(Ge.render(H,M,U),$e===!0&&Me.endShadows(),(G&&w.hasRenderPass())===!1){let ke=A.opaque,De=A.transmissive;if(T.setupLights(),U.isArrayCamera){let He=U.cameras;if(De.length>0)for(let qe=0,pt=He.length;qe<pt;qe++){let Mt=He[qe];sx(ke,De,M,Mt)}Wt&&ht.render(M);for(let qe=0,pt=He.length;qe<pt;qe++){let Mt=He[qe];rx(A,M,Mt,Mt.viewport)}}else De.length>0&&sx(ke,De,M,U),Wt&&ht.render(M),rx(A,M,U)}J!==null&&$===0&&(k.updateMultisampleRenderTarget(J),k.updateRenderTargetMipmap(J)),G&&w.end(I),M.isScene===!0&&M.onAfterRender(I,M,U),Ne.resetDefaultState(),j=-1,Q=null,x.pop(),x.length>0?(T=x[x.length-1],k.setTextureUnits(T.state.textureUnits),$e===!0&&Me.setGlobalState(I.clippingPlanes,T.state.camera)):T=null,R.pop(),R.length>0?A=R[R.length-1]:A=null,F!==null&&F.renderEnd()};function yp(M,U,q,G){if(M.visible===!1)return;if(M.layers.test(U.layers)){if(M.isGroup)q=M.renderOrder;else if(M.isLOD)M.autoUpdate===!0&&M.update(U);else if(M.isLightProbeGrid)T.pushLightProbeGrid(M);else if(M.isLight)T.pushLight(M),M.castShadow&&T.pushShadow(M);else if(M.isSprite){if(!M.frustumCulled||M.intersectsFrustum(Le)){G&&tt.setFromMatrixPosition(M.matrixWorld).applyMatrix4(we);let ke=Z.update(M),De=M.material;De.visible&&A.push(M,ke,De,q,tt.z,null,U)}}else if((M.isMesh||M.isLine||M.isPoints)&&(!M.frustumCulled||M.intersectsFrustum(Le))){let ke=Z.update(M),De=M.material;if(G&&(M.boundingSphere!==void 0?(M.boundingSphere===null&&M.computeBoundingSphere(),tt.copy(M.boundingSphere.center)):(ke.boundingSphere===null&&ke.computeBoundingSphere(),tt.copy(ke.boundingSphere.center)),tt.applyMatrix4(M.matrixWorld).applyMatrix4(we)),Array.isArray(De)){let He=ke.groups;for(let qe=0,pt=He.length;qe<pt;qe++){let Mt=He[qe],We=De[Mt.materialIndex];We&&We.visible&&A.push(M,ke,We,q,tt.z,Mt,U)}}else De.visible&&A.push(M,ke,De,q,tt.z,null,U)}}let Oe=M.children;for(let ke=0,De=Oe.length;ke<De;ke++)yp(Oe[ke],U,q,G)}function rx(M,U,q,G){let{opaque:H,transmissive:Oe,transparent:ke}=M;T.setupLightsView(q),$e===!0&&Me.setGlobalState(I.clippingPlanes,q),G&&v.viewport(ie.copy(G)),H.length>0&&Tu(H,U,q),Oe.length>0&&Tu(Oe,U,q),ke.length>0&&Tu(ke,U,q),v.buffers.depth.setTest(!0),v.buffers.depth.setMask(!0),v.buffers.color.setMask(!0),v.setPolygonOffset(!1)}function sx(M,U,q,G){if((q.isScene===!0?q.overrideMaterial:null)!==null)return;if(T.state.transmissionRenderTarget[G.id]===void 0){let We=gt.has("EXT_color_buffer_half_float")||gt.has("EXT_color_buffer_float");T.state.transmissionRenderTarget[G.id]=new Tn(1,1,{generateMipmaps:!0,type:We?Kn:Ci,minFilter:Os,samples:Math.max(4,P.samples),stencilBuffer:s,resolveDepthBuffer:!1,resolveStencilBuffer:!1,storeMultisampledDepthBuffer:!1,storeMultisampledStencilBuffer:!1,colorSpace:yt.workingColorSpace})}let Oe=T.state.transmissionRenderTarget[G.id],ke=G.viewport||ie;Oe.setSize(ke.z*I.transmissionResolutionScale,ke.w*I.transmissionResolutionScale);let De=I.getRenderTarget(),He=I.getActiveCubeFace(),qe=I.getActiveMipmapLevel();I.setRenderTarget(Oe),I.getClearColor(_t),lt=I.getClearAlpha(),lt<1&&I.setClearColor(16777215,.5),I.clear(),Wt&&ht.render(q);let pt=I.toneMapping;I.toneMapping=Ri;let Mt=G.viewport;if(G.viewport!==void 0&&(G.viewport=void 0),T.setupLightsView(G),$e===!0&&Me.setGlobalState(I.clippingPlanes,G),Tu(M,q,G),k.updateMultisampleRenderTarget(Oe),k.updateRenderTargetMipmap(Oe),gt.has("WEBGL_multisampled_render_to_texture")===!1){let We=!1;for(let Ut=0,En=U.length;Ut<En;Ut++){let on=U[Ut],{object:Kt,geometry:$n,material:Be,group:ri}=on;if(Be.side===wr&&Kt.layers.test(G.layers)){let Rt=Be.side;Be.side=li,Be.needsUpdate=!0,ox(Kt,q,G,$n,Be,ri),Be.side=Rt,Be.needsUpdate=!0,We=!0}}We===!0&&(k.updateMultisampleRenderTarget(Oe),k.updateRenderTargetMipmap(Oe))}I.setRenderTarget(De,He,qe),I.setClearColor(_t,lt),Mt!==void 0&&(G.viewport=Mt),I.toneMapping=pt}function Tu(M,U,q){let G=U.isScene===!0?U.overrideMaterial:null;for(let H=0,Oe=M.length;H<Oe;H++){let ke=M[H],{object:De,geometry:He,group:qe}=ke,pt=ke.material;pt.allowOverride===!0&&G!==null&&(pt=G),De.layers.test(q.layers)&&ox(De,U,q,He,pt,qe)}}function ox(M,U,q,G,H,Oe){F!==null&&H.isNodeMaterial&&F.setObject(M,H),M.onBeforeRender(I,U,q,G,H,Oe),M.modelViewMatrix.multiplyMatrices(q.matrixWorldInverse,M.matrixWorld),M.normalMatrix.getNormalMatrix(M.modelViewMatrix),H.onBeforeRender(I,U,q,G,M,Oe),H.transparent===!0&&H.side===wr&&H.forceSinglePass===!1?(H.side=li,H.needsUpdate=!0,I.renderBufferDirect(q,U,G,H,M,Oe),H.side=Sr,H.needsUpdate=!0,I.renderBufferDirect(q,U,G,H,M,Oe),H.side=wr):I.renderBufferDirect(q,U,G,H,M,Oe),M.onAfterRender(I,U,q,G,H,Oe)}function Ru(M,U,q){U.isScene!==!0&&(U=$t);let G=L.get(M),H=T.state.lights,Oe=T.state.shadowsArray,ke=H.state.version,De=me.getParameters(M,H.state,Oe,U,q,T.state.lightProbeGridArray),He=me.getProgramCacheKey(De),qe=G.programs;G.environment=M.isMeshStandardMaterial||M.isMeshLambertMaterial||M.isMeshPhongMaterial?U.environment:null,G.fog=U.fog;let pt=M.isMeshStandardMaterial||M.isMeshLambertMaterial&&!M.envMap||M.isMeshPhongMaterial&&!M.envMap;G.envMap=se.get(M.envMap||G.environment,pt),G.envMapRotation=G.environment!==null&&M.envMap===null?U.environmentRotation:M.envMapRotation,qe===void 0&&(M.addEventListener("dispose",pr),qe=new Map,G.programs=qe);let Mt=qe.get(He);if(Mt!==void 0){if(G.currentProgram===Mt&&G.lightsStateVersion===ke)return lx(M,De),Mt}else De.uniforms=me.getUniforms(M),F!==null&&M.isNodeMaterial&&F.build(M,q,De),M.onBeforeCompile(De,I),Mt=me.acquireProgram(De,He),qe.set(He,Mt),G.uniforms=De.uniforms;let We=G.uniforms;return(!M.isShaderMaterial&&!M.isRawShaderMaterial||M.clipping===!0)&&(We.clippingPlanes=Me.uniform),lx(M,De),G.needsLights=LS(M),G.lightsStateVersion=ke,G.needsLights&&(We.ambientLightColor.value=H.state.ambient,We.lightProbe.value=H.state.probe,We.sunLights.value=H.state.sun,We.sunLightShadows.value=H.state.sunShadow,We.directionalLights.value=H.state.directional,We.directionalLightShadows.value=H.state.directionalShadow,We.spotLights.value=H.state.spot,We.spotLightShadows.value=H.state.spotShadow,We.rectAreaLights.value=H.state.rectArea,We.ltc_1.value=H.state.rectAreaLTC1,We.ltc_2.value=H.state.rectAreaLTC2,We.pointLights.value=H.state.point,We.pointLightShadows.value=H.state.pointShadow,We.hemisphereLights.value=H.state.hemi,We.sunShadowMatrix.value=H.state.sunShadowMatrix,We.sunShadowCascade.value=H.state.sunShadowCascade,We.directionalShadowMatrix.value=H.state.directionalShadowMatrix,We.spotLightMatrix.value=H.state.spotLightMatrix,We.spotLightMap.value=H.state.spotLightMap,We.pointShadowMatrix.value=H.state.pointShadowMatrix),G.lightProbeGrid=T.state.lightProbeGridArray.length>0,G.currentProgram=Mt,G.uniformsList=null,Mt}function ax(M){if(M.uniformsList===null){let U=M.currentProgram.getUniforms();M.uniformsList=Pa.seqWithValue(U.seq,M.uniforms)}return M.uniformsList}function lx(M,U){let q=L.get(M);q.outputColorSpace=U.outputColorSpace,q.batching=U.batching,q.batchingColor=U.batchingColor,q.instancing=U.instancing,q.instancingColor=U.instancingColor,q.instancingMorph=U.instancingMorph,q.skinning=U.skinning,q.morphTargets=U.morphTargets,q.morphNormals=U.morphNormals,q.morphColors=U.morphColors,q.morphTargetsCount=U.morphTargetsCount,q.numClippingPlanes=U.numClippingPlanes,q.numIntersection=U.numClipIntersection,q.vertexAlphas=U.vertexAlphas,q.vertexTangents=U.vertexTangents,q.toneMapping=U.toneMapping}function CS(M,U){if(M.length===0)return null;if(M.length===1)return M[0].texture!==null?M[0]:null;_.setFromMatrixPosition(U.matrixWorld);for(let q=0,G=M.length;q<G;q++){let H=M[q];if(H.texture!==null&&H.boundingBox.containsPoint(_))return H}return null}function IS(M,U,q,G,H){U.isScene!==!0&&(U=$t),k.resetTextureUnits();let Oe=U.fog,ke=G.isMeshStandardMaterial||G.isMeshLambertMaterial||G.isMeshPhongMaterial?U.environment:null,De=J===null?I.outputColorSpace:J.isXRRenderTarget===!0?J.texture.colorSpace:yt.workingColorSpace,He=G.isMeshStandardMaterial||G.isMeshLambertMaterial&&!G.envMap||G.isMeshPhongMaterial&&!G.envMap,qe=se.get(G.envMap||ke,He),pt=G.vertexColors===!0&&!!q.attributes.color&&q.attributes.color.itemSize===4,Mt=!!q.attributes.tangent&&(!!G.normalMap||G.anisotropy>0),We=!!q.morphAttributes.position,Ut=!!q.morphAttributes.normal,En=!!q.morphAttributes.color,on=Ri;G.toneMapped&&(J===null||J.isXRRenderTarget===!0)&&(on=I.toneMapping);let Kt=q.morphAttributes.position||q.morphAttributes.normal||q.morphAttributes.color,$n=Kt!==void 0?Kt.length:0,Be=L.get(G),ri=T.state.lights;if($e===!0&&(wt===!0||M!==Q)){let rn=M===Q&&G.id===j;Me.setState(G,M,rn)}let Rt=!1;G.version===Be.__version?(Be.needsLights&&Be.lightsStateVersion!==ri.state.version||Be.outputColorSpace!==De||H.isBatchedMesh&&Be.batching===!1||!H.isBatchedMesh&&Be.batching===!0||H.isBatchedMesh&&Be.batchingColor===!0&&H._colorsTexture===null||H.isBatchedMesh&&Be.batchingColor===!1&&H._colorsTexture!==null||H.isInstancedMesh&&Be.instancing===!1||!H.isInstancedMesh&&Be.instancing===!0||H.isSkinnedMesh&&Be.skinning===!1||!H.isSkinnedMesh&&Be.skinning===!0||H.isInstancedMesh&&Be.instancingColor===!0&&H.instanceColor===null||H.isInstancedMesh&&Be.instancingColor===!1&&H.instanceColor!==null||H.isInstancedMesh&&Be.instancingMorph===!0&&H.morphTexture===null||H.isInstancedMesh&&Be.instancingMorph===!1&&H.morphTexture!==null||Be.envMap!==qe||G.fog===!0&&Be.fog!==Oe||Be.numClippingPlanes!==void 0&&(Be.numClippingPlanes!==Me.numPlanes||Be.numIntersection!==Me.numIntersection)||Be.vertexAlphas!==pt||Be.vertexTangents!==Mt||Be.morphTargets!==We||Be.morphNormals!==Ut||Be.morphColors!==En||Be.toneMapping!==on||Be.morphTargetsCount!==$n||!!Be.lightProbeGrid!=T.state.lightProbeGridArray.length>0)&&(Rt=!0):(Rt=!0,Be.__version=G.version);let Bi=Be.currentProgram;Rt===!0&&(Bi=Ru(G,U,H),F&&G.isNodeMaterial&&F.onUpdateProgram(G,Bi,Be));let mr=!1,vs=!1,Xo=!1,Yt=Bi.getUniforms(),_n=Be.uniforms;if(v.useProgram(Bi.program)&&(mr=!0,vs=!0,Xo=!0),G.id!==j&&(j=G.id,vs=!0),Be.needsLights){let rn=CS(T.state.lightProbeGridArray,H);Be.lightProbeGrid!==rn&&(Be.lightProbeGrid=rn,vs=!0)}if(mr||Q!==M){v.buffers.depth.getReversed()&&M.reversedDepth!==!0&&(M._reversedDepth=!0,M.updateProjectionMatrix()),Yt.setValue(O,"projectionMatrix",M.projectionMatrix),Yt.setValue(O,"viewMatrix",M.matrixWorldInverse);let _s=Yt.map.cameraPosition;_s!==void 0&&_s.setValue(O,Ae.setFromMatrixPosition(M.matrixWorld)),P.logarithmicDepthBuffer&&Yt.setValue(O,"logDepthBufFC",2/(Math.log(M.far+1)/Math.LN2)),(G.isMeshPhongMaterial||G.isMeshToonMaterial||G.isMeshLambertMaterial||G.isMeshBasicMaterial||G.isMeshStandardMaterial||G.isShaderMaterial)&&Yt.setValue(O,"isOrthographic",M.isOrthographicCamera===!0),Q!==M&&(Q=M,vs=!0,Xo=!0)}if(Be.needsLights&&(ri.state.sunShadowMap.length>0&&Yt.setValue(O,"sunShadowMap",ri.state.sunShadowMap,k),ri.state.directionalShadowMap.length>0&&Yt.setValue(O,"directionalShadowMap",ri.state.directionalShadowMap,k),ri.state.spotShadowMap.length>0&&Yt.setValue(O,"spotShadowMap",ri.state.spotShadowMap,k),ri.state.pointShadowMap.length>0&&Yt.setValue(O,"pointShadowMap",ri.state.pointShadowMap,k)),H.isSkinnedMesh){Yt.setOptional(O,H,"bindMatrix"),Yt.setOptional(O,H,"bindMatrixInverse");let rn=H.skeleton;rn&&(rn.boneTexture===null&&rn.computeBoneTexture(),Yt.setValue(O,"boneTexture",rn.boneTexture,k))}H.isBatchedMesh&&(Yt.setOptional(O,H,"batchingTexture"),Yt.setValue(O,"batchingTexture",H._matricesTexture,k),Yt.setOptional(O,H,"batchingIdTexture"),Yt.setValue(O,"batchingIdTexture",H._indirectTexture,k),Yt.setOptional(O,H,"batchingColorTexture"),H._colorsTexture!==null&&Yt.setValue(O,"batchingColorTexture",H._colorsTexture,k));let ys=q.morphAttributes;if((ys.position!==void 0||ys.normal!==void 0||ys.color!==void 0)&&B.update(H,q,Bi),(vs||Be.receiveShadow!==H.receiveShadow)&&(Be.receiveShadow=H.receiveShadow,Yt.setValue(O,"receiveShadow",H.receiveShadow)),(G.isMeshStandardMaterial||G.isMeshLambertMaterial||G.isMeshPhongMaterial)&&G.envMap===null&&U.environment!==null&&(_n.envMapIntensity.value=U.environmentIntensity),_n.dfgLUT!==void 0&&(_n.dfgLUT.value=zR()),vs){if(Yt.setValue(O,"toneMappingExposure",I.toneMappingExposure),Be.needsLights&&PS(_n,Xo),Oe&&G.fog===!0&&Fe.refreshFogUniforms(_n,Oe),Fe.refreshMaterialUniforms(_n,G,te,Y,T.state.transmissionRenderTarget[M.id]),Be.needsLights&&Be.lightProbeGrid){let rn=Be.lightProbeGrid;_n.probesSH.value=rn.texture,_n.probesMin.value.copy(rn.boundingBox.min),_n.probesMax.value.copy(rn.boundingBox.max),_n.probesResolution.value.copy(rn.resolution)}Pa.upload(O,ax(Be),_n,k)}if(G.isShaderMaterial&&G.uniformsNeedUpdate===!0&&(Pa.upload(O,ax(Be),_n,k),G.uniformsNeedUpdate=!1),G.isSpriteMaterial&&Yt.setValue(O,"center",H.center),Yt.setValue(O,"modelViewMatrix",H.modelViewMatrix),Yt.setValue(O,"normalMatrix",H.normalMatrix),Yt.setValue(O,"modelMatrix",H.matrixWorld),G.uniformsGroups!==void 0){let rn=G.uniformsGroups;for(let _s=0,$o=rn.length;_s<$o;_s++){let ux=rn[_s];le.update(ux,Bi),le.bind(ux,Bi)}}return Bi}function PS(M,U){M.ambientLightColor.needsUpdate=U,M.lightProbe.needsUpdate=U,M.sunLights.needsUpdate=U,M.sunLightShadows.needsUpdate=U,M.directionalLights.needsUpdate=U,M.directionalLightShadows.needsUpdate=U,M.pointLights.needsUpdate=U,M.pointLightShadows.needsUpdate=U,M.spotLights.needsUpdate=U,M.spotLightShadows.needsUpdate=U,M.rectAreaLights.needsUpdate=U,M.hemisphereLights.needsUpdate=U}function LS(M){return M.isMeshLambertMaterial||M.isMeshToonMaterial||M.isMeshPhongMaterial||M.isMeshStandardMaterial||M.isShadowMaterial||M.isShaderMaterial&&M.lights===!0}this.getActiveCubeFace=function(){return K},this.getActiveMipmapLevel=function(){return $},this.getRenderTarget=function(){return J},this.setRenderTargetTextures=function(M,U,q){let G=L.get(M);G.__autoAllocateDepthBuffer=M.resolveDepthBuffer===!1,G.__autoAllocateDepthBuffer===!1&&(G.__useRenderToTexture=!1),L.get(M.texture).__webglTexture=U,L.get(M.depthTexture).__webglTexture=G.__autoAllocateDepthBuffer?void 0:q,G.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(M,U){let q=L.get(M);q.__webglFramebuffer=U,q.__useDefaultFramebuffer=U===void 0},this.setRenderTarget=function(M,U=0,q=0){J=M,K=U,$=q;let G=null,H=!1,Oe=!1;if(M){let De=L.get(M);if(De.__useDefaultFramebuffer!==void 0){v.bindFramebuffer(O.FRAMEBUFFER,De.__webglFramebuffer),ie.copy(M.viewport),Ve.copy(M.scissor),Ue=M.scissorTest,v.viewport(ie),v.scissor(Ve),v.setScissorTest(Ue),j=-1;return}else if(De.__webglFramebuffer===void 0)k.setupRenderTarget(M);else if(De.__hasExternalTextures)k.rebindTextures(M,L.get(M.texture).__webglTexture,L.get(M.depthTexture).__webglTexture);else if(M.depthBuffer){let pt=M.depthTexture;if(De.__boundDepthTexture!==pt){if(pt!==null&&L.has(pt)&&(M.width!==pt.image.width||M.height!==pt.image.height))throw new Error("THREE.WebGLRenderer: Attached DepthTexture is initialized to the incorrect size.");k.setupDepthRenderbuffer(M)}}let He=M.texture;(He.isData3DTexture||He.isDataArrayTexture||He.isCompressedArrayTexture)&&(Oe=!0);let qe=L.get(M).__webglFramebuffer;M.isWebGLCubeRenderTarget?(Array.isArray(qe[U])?G=qe[U][q]:G=qe[U],H=!0):M.samples>0&&k.useMultisampledRTT(M)===!1?G=L.get(M).__webglMultisampledFramebuffer:Array.isArray(qe)?G=qe[q]:G=qe,ie.copy(M.viewport),Ve.copy(M.scissor),Ue=M.scissorTest}else ie.copy(Ce).multiplyScalar(te).floor(),Ve.copy(ge).multiplyScalar(te).floor(),Ue=ye;if(q!==0&&(G=z),v.bindFramebuffer(O.FRAMEBUFFER,G)&&v.drawBuffers(M,G),v.viewport(ie),v.scissor(Ve),v.setScissorTest(Ue),H){let De=L.get(M.texture);O.framebufferTexture2D(O.FRAMEBUFFER,O.COLOR_ATTACHMENT0,O.TEXTURE_CUBE_MAP_POSITIVE_X+U,De.__webglTexture,q)}else if(Oe){let De=U;for(let He=0;He<M.textures.length;He++){let qe=L.get(M.textures[He]);O.framebufferTextureLayer(O.FRAMEBUFFER,O.COLOR_ATTACHMENT0+He,qe.__webglTexture,q,De)}}else if(M!==null&&q!==0){let De=L.get(M.texture);O.framebufferTexture2D(O.FRAMEBUFFER,O.COLOR_ATTACHMENT0,O.TEXTURE_2D,De.__webglTexture,q)}j=-1};function cx(M){let U=L.get(M);return(U.__readFormat!==M.format||U.__readType!==M.type)&&(U.__readFormat=M.format,U.__readType=M.type,U.__formatReadable=P.textureFormatReadable(M.format),U.__typeReadable=P.textureTypeReadable(M.type)),U}this.readRenderTargetPixels=function(M,U,q,G,H,Oe,ke,De=0){if(!(M&&M.isWebGLRenderTarget)){nt("WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let He=L.get(M).__webglFramebuffer;if(M.isWebGLCubeRenderTarget&&ke!==void 0&&(He=He[ke]),He){v.bindFramebuffer(O.FRAMEBUFFER,He);try{let qe=M.textures[De],pt=qe.format,Mt=qe.type;M.textures.length>1&&O.readBuffer(O.COLOR_ATTACHMENT0+De);let We=cx(qe);if(We.__formatReadable===!1){nt("WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(We.__typeReadable===!1){nt("WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}U>=0&&U<=M.width-G&&q>=0&&q<=M.height-H&&O.readPixels(U,q,G,H,Te.convert(pt),Te.convert(Mt),Oe)}finally{let qe=J!==null?L.get(J).__webglFramebuffer:null;v.bindFramebuffer(O.FRAMEBUFFER,qe)}}},this.readRenderTargetPixelsAsync=async function(M,U,q,G,H,Oe,ke,De=0){if(!(M&&M.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let He=L.get(M).__webglFramebuffer;if(M.isWebGLCubeRenderTarget&&ke!==void 0&&(He=He[ke]),He)if(U>=0&&U<=M.width-G&&q>=0&&q<=M.height-H){v.bindFramebuffer(O.FRAMEBUFFER,He);let qe=M.textures[De],pt=qe.format,Mt=qe.type;M.textures.length>1&&O.readBuffer(O.COLOR_ATTACHMENT0+De);let We=cx(qe);if(We.__formatReadable===!1)throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(We.__typeReadable===!1)throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");let Ut=O.createBuffer();O.bindBuffer(O.PIXEL_PACK_BUFFER,Ut),O.bufferData(O.PIXEL_PACK_BUFFER,Oe.byteLength,O.STREAM_READ),O.readPixels(U,q,G,H,Te.convert(pt),Te.convert(Mt),0),O.bindBuffer(O.PIXEL_PACK_BUFFER,null);let En=J!==null?L.get(J).__webglFramebuffer:null;v.bindFramebuffer(O.FRAMEBUFFER,En);let on=O.fenceSync(O.SYNC_GPU_COMMANDS_COMPLETE,0);return O.flush(),await ay(O,on,4),O.bindBuffer(O.PIXEL_PACK_BUFFER,Ut),O.getBufferSubData(O.PIXEL_PACK_BUFFER,0,Oe),O.bindBuffer(O.PIXEL_PACK_BUFFER,null),O.deleteBuffer(Ut),O.deleteSync(on),Oe}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")},this.copyFramebufferToTexture=function(M,U=null,q=0){let G=Math.pow(2,-q),H=Math.floor(M.image.width*G),Oe=Math.floor(M.image.height*G),ke=U!==null?U.x:0,De=U!==null?U.y:0;k.setTexture2D(M,0),O.copyTexSubImage2D(O.TEXTURE_2D,q,0,0,ke,De,H,Oe),v.unbindTexture()},this.copyTextureToTexture=function(M,U,q=null,G=null,H=0,Oe=0){let ke,De,He,qe,pt,Mt,We,Ut,En,on=M.isCompressedTexture?M.mipmaps[Oe]:M.image;if(q!==null)ke=q.max.x-q.min.x,De=q.max.y-q.min.y,He=q.isBox3?q.max.z-q.min.z:1,qe=q.min.x,pt=q.min.y,Mt=q.isBox3?q.min.z:0;else{let _n=Math.pow(2,-H);ke=Math.floor(on.width*_n),De=Math.floor(on.height*_n),M.isDataArrayTexture?He=on.depth:M.isData3DTexture?He=Math.floor(on.depth*_n):He=1,qe=0,pt=0,Mt=0}G!==null?(We=G.x,Ut=G.y,En=G.z):(We=0,Ut=0,En=0);let Kt=Te.convert(U.format),$n=Te.convert(U.type),Be;U.isData3DTexture?(k.setTexture3D(U,0),Be=O.TEXTURE_3D):U.isDataArrayTexture||U.isCompressedArrayTexture?(k.setTexture2DArray(U,0),Be=O.TEXTURE_2D_ARRAY):(k.setTexture2D(U,0),Be=O.TEXTURE_2D),v.activeTexture(O.TEXTURE0),v.pixelStorei(O.UNPACK_FLIP_Y_WEBGL,U.flipY),v.pixelStorei(O.UNPACK_PREMULTIPLY_ALPHA_WEBGL,U.premultiplyAlpha),v.pixelStorei(O.UNPACK_ALIGNMENT,U.unpackAlignment);let ri=v.getParameter(O.UNPACK_ROW_LENGTH),Rt=v.getParameter(O.UNPACK_IMAGE_HEIGHT),Bi=v.getParameter(O.UNPACK_SKIP_PIXELS),mr=v.getParameter(O.UNPACK_SKIP_ROWS),vs=v.getParameter(O.UNPACK_SKIP_IMAGES);v.pixelStorei(O.UNPACK_ROW_LENGTH,on.width),v.pixelStorei(O.UNPACK_IMAGE_HEIGHT,on.height),v.pixelStorei(O.UNPACK_SKIP_PIXELS,qe),v.pixelStorei(O.UNPACK_SKIP_ROWS,pt),v.pixelStorei(O.UNPACK_SKIP_IMAGES,Mt);let Xo=M.isDataArrayTexture||M.isData3DTexture,Yt=U.isDataArrayTexture||U.isData3DTexture;if(M.isDepthTexture){let _n=L.get(M),ys=L.get(U),rn=L.get(_n.__renderTarget),_s=L.get(ys.__renderTarget);v.bindFramebuffer(O.READ_FRAMEBUFFER,rn.__webglFramebuffer),v.bindFramebuffer(O.DRAW_FRAMEBUFFER,_s.__webglFramebuffer);for(let $o=0;$o<He;$o++)Xo&&(O.framebufferTextureLayer(O.READ_FRAMEBUFFER,O.COLOR_ATTACHMENT0,L.get(M).__webglTexture,H,Mt+$o),O.framebufferTextureLayer(O.DRAW_FRAMEBUFFER,O.COLOR_ATTACHMENT0,L.get(U).__webglTexture,Oe,En+$o)),O.blitFramebuffer(qe,pt,ke,De,We,Ut,ke,De,O.DEPTH_BUFFER_BIT,O.NEAREST);v.bindFramebuffer(O.READ_FRAMEBUFFER,null),v.bindFramebuffer(O.DRAW_FRAMEBUFFER,null)}else if(H!==0||M.isRenderTargetTexture||L.has(M)){let _n=L.get(M),ys=L.get(U);v.bindFramebuffer(O.READ_FRAMEBUFFER,N),v.bindFramebuffer(O.DRAW_FRAMEBUFFER,V);for(let rn=0;rn<He;rn++)Xo?O.framebufferTextureLayer(O.READ_FRAMEBUFFER,O.COLOR_ATTACHMENT0,_n.__webglTexture,H,Mt+rn):O.framebufferTexture2D(O.READ_FRAMEBUFFER,O.COLOR_ATTACHMENT0,O.TEXTURE_2D,_n.__webglTexture,H),Yt?O.framebufferTextureLayer(O.DRAW_FRAMEBUFFER,O.COLOR_ATTACHMENT0,ys.__webglTexture,Oe,En+rn):O.framebufferTexture2D(O.DRAW_FRAMEBUFFER,O.COLOR_ATTACHMENT0,O.TEXTURE_2D,ys.__webglTexture,Oe),H!==0?O.blitFramebuffer(qe,pt,ke,De,We,Ut,ke,De,O.COLOR_BUFFER_BIT,O.NEAREST):Yt?O.copyTexSubImage3D(Be,Oe,We,Ut,En+rn,qe,pt,ke,De):O.copyTexSubImage2D(Be,Oe,We,Ut,qe,pt,ke,De);v.bindFramebuffer(O.READ_FRAMEBUFFER,null),v.bindFramebuffer(O.DRAW_FRAMEBUFFER,null)}else Yt?M.isDataTexture||M.isData3DTexture?O.texSubImage3D(Be,Oe,We,Ut,En,ke,De,He,Kt,$n,on.data):U.isCompressedArrayTexture?O.compressedTexSubImage3D(Be,Oe,We,Ut,En,ke,De,He,Kt,on.data):O.texSubImage3D(Be,Oe,We,Ut,En,ke,De,He,Kt,$n,on):M.isDataTexture?O.texSubImage2D(O.TEXTURE_2D,Oe,We,Ut,ke,De,Kt,$n,on.data):M.isCompressedTexture?O.compressedTexSubImage2D(O.TEXTURE_2D,Oe,We,Ut,on.width,on.height,Kt,on.data):O.texSubImage2D(O.TEXTURE_2D,Oe,We,Ut,ke,De,Kt,$n,on);v.pixelStorei(O.UNPACK_ROW_LENGTH,ri),v.pixelStorei(O.UNPACK_IMAGE_HEIGHT,Rt),v.pixelStorei(O.UNPACK_SKIP_PIXELS,Bi),v.pixelStorei(O.UNPACK_SKIP_ROWS,mr),v.pixelStorei(O.UNPACK_SKIP_IMAGES,vs),Oe===0&&U.generateMipmaps&&O.generateMipmap(Be),v.unbindTexture()},this.initRenderTarget=function(M){L.get(M).__webglFramebuffer===void 0&&k.setupRenderTarget(M)},this.initTexture=function(M){M.isCubeTexture?k.setTextureCube(M,0):M.isData3DTexture?k.setTexture3D(M,0):M.isDataArrayTexture||M.isCompressedArrayTexture?k.setTexture2DArray(M,0):k.setTexture2D(M,0),v.unbindTexture()},this.resetState=function(){K=0,$=0,J=null,v.reset(),Ne.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return or}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;let t=this.getContext();t.drawingBufferColorSpace=yt._getDrawingBufferColorSpace(e),t.unpackColorSpace=yt._getUnpackColorSpace()}};var Qn=Object.freeze({DEFAULT:0,EMISSIVE:1,NOFOG:2}),xi=()=>({value:new St(0,0,0)}),pe={uTime:{value:0},uBreath:{value:.5},uLamp:{value:new C(0,0,3)},uLampOn:{value:1},uCamPos:{value:new C},uResolution:{value:new it(1,1)},uPixelRatio:{value:1},uPxPerUnit:{value:1},uWorldScale:{value:1},uFogDensity:{value:.00485},uInvert:{value:0},uNight:{value:0},uEmissivePass:{value:0},cVoid:xi(),cAbyss:xi(),cDeep:xi(),cSteel:xi(),cSlate:xi(),cPewter:xi(),cSilver:xi(),cWhite:xi(),cObsidian:xi(),cEmber:xi(),cEmberDeep:xi(),cElectrum:xi(),cPaper:xi(),cInk:xi()};function ef(n){return"c"+n.charAt(0).toUpperCase()+n.slice(1)}function ei(n){return pe[ef(n)]||pe.cSilver}function wo(){let n=new Array(7);for(let e=0;e<7;e++)n[e]=new Et;return{value:n}}function Eo(){return{value:[1,1,1,1,1,1,1]}}var d0=new Map;function Wi(n,e){n&&d0.set(n,Math.max(0,e||0))}function Mc(n){d0.delete(n)}function Vy(){let n=0;for(let e of d0.values())n+=e;return n/1048576}var cn=Object.freeze({..._x});function Tt(n){return n<=0?0:n>=1?1:n}function Ot(n,e,t){return n+(e-n)*t}function Ao(n,e,t){if(n===e)return t<n?0:1;let i=Tt((t-n)/(e-n));return i*i*(3-2*i)}var Ii=`
uniform float uFogDensity; uniform vec3 cAbyss;
float fogVis(float dist) { float f = uFogDensity * dist; return exp(-f * f); }
vec3 applyFog(vec3 col, float dist) { return mix(cAbyss, col, fogVis(dist)); }`,is=null,Tr={density:pe.uFogDensity.value,set(n){is&&(is.cancel(),is=null),Tr.density=n,pe.uFogDensity.value=n},to(n,e,t=cn.camera){is&&(is.cancel(),is=null);let i=Tr.density,r=Fn(e,s=>{Tr.density=i+(n-i)*s,pe.uFogDensity.value=Tr.density},t);return is=r,r.done.then(()=>{is===r&&(is=null)})}};var bc=`
uniform float uPxPerUnit;
float bayer2(vec2 a) { a = floor(a); return fract(dot(a, vec2(0.5, a.y * 0.75))); }
float bayer4(vec2 a) { return bayer2(0.5 * a) * 0.25 + bayer2(a); }
float bayer8(vec2 a) { return bayer4(0.5 * a) * 0.25 + bayer2(a); }
// strut: strut spacing in LOCAL units (aStrut); modelScale: length(modelMatrix[0].xyz); depth: view-space depth (render units)
float r1Lattice(float strut, float modelScale, float depth) {
  float sp = strut * modelScale * uPxPerUnit / max(depth, 1e-6);
  return smoothstep(3.0, 6.0, sp);
}`,To=`
uniform mat4 uStrataM[7];
uniform float uStrataA[7];
int strataIndex(float face) { return int(clamp(floor(face / 16.0 + 0.001), 0.0, 6.0)); }
mat4 strataMatrix(float face) { return uStrataM[strataIndex(face)]; }
float strataAlpha(float face) { return uStrataA[strataIndex(face)]; }`;var rs={};for(let n=0;n<7;n++)rs[`sign:${n}`]=[128*n,0,128,128];rs["glyph:back"]=[896,0,128,128];rs.frieze=[0,128,1024,32];rs.ticks=[0,160,1024,32];for(let n=0;n<16;n++)rs[`capital:${n}`]=[128*(n%8),192+128*Math.floor(n/8),128,128];rs.deck=[0,448,256,256];for(let n=0;n<7;n++)rs[`free:${n}`]=n<3?[256*(n+1),448,256,256]:[256*(n-3),704,256,256];var Sc=null,wc=null,Ro=null,tf=null;function VR(n,e){let t=()=>{let s=document.createElement("canvas");return s.width=n,s.height=e,s};(!Ro||Ro.width<n||Ro.height<e)&&(Ro=t(),tf=t());let i=Ro.getContext("2d",{willReadFrequently:!0}),r=tf.getContext("2d",{willReadFrequently:!0});return i.setTransform(1,0,0,1,0,0),r.setTransform(1,0,0,1,0,0),i.clearRect(0,0,Ro.width,Ro.height),r.clearRect(0,0,tf.width,tf.height),[i,r]}function GR(n,e,t,i){for(let r=0;r<t;r++)for(let s=0;s<e;s++){let o=0,a=0;for(let l=-1;l<=1;l++){let c=r+l;if(!(c<0||c>=t))for(let u=-1;u<=1;u++){let d=s+u;d<0||d>=e||(o+=n[(c*e+d)*4+3],a++)}}i[r*e+s]=o/a}}var Zt={texture:null,size:1024,REGIONS:rs,init(n){if(Zt.texture)return Zt;Zt.size=n==="T1"?512:1024,Sc=document.createElement("canvas"),Sc.width=Sc.height=Zt.size,wc=Sc.getContext("2d",{willReadFrequently:!0}),wc.fillStyle="rgb(255,0,0)",wc.fillRect(0,0,Zt.size,Zt.size);let e=new Jr(Sc);return e.flipY=!1,e.generateMipmaps=!1,e.minFilter=At,e.magFilter=At,e.wrapS=e.wrapT=Zn,e.premultiplyAlpha=!1,Zt.texture=e,Wi(e,Zt.size*Zt.size*4),Zt},region(n){let e=rs[n];if(!e)return null;let t=Zt.size/1024,i=e[0]*t,r=e[1]*t,s=e[2]*t,o=e[3]*t;return{x:i,y:r,w:s,h:o,rect:new en(e[0]/1024,e[1]/1024,(e[0]+e[2])/1024,(e[1]+e[3])/1024)}},draw(n,e={}){if(!Zt.texture)return!1;let t=Zt.region(n);if(!t)return!1;let i=Math.round(t.w),r=Math.round(t.h),[s,o]=VR(i,r);try{e.height&&e.height(s,i,r)}catch{}try{e.inlay&&e.inlay(o,i,r)}catch{}let a=s.getImageData(0,0,i,r).data,l=o.getImageData(0,0,i,r).data,c=new Float32Array(i*r);GR(a,i,r,c);let u=wc.createImageData(i,r),d=u.data;for(let h=0,f=0;f<i*r;f++,h+=4)d[h]=255-Math.round(c[f]),d[h+1]=l[h+3],d[h+2]=0,d[h+3]=255;return wc.putImageData(u,Math.round(t.x),Math.round(t.y)),Zt.texture.needsUpdate=!0,!0}};var ti=Object.freeze({T3:Object.freeze({dprCap:2,msaa:!0,grains:24576,stars:Object.freeze({signal:2e3,zenith:3e3}),bloom:"kawase",lattice:1,atlas:1024,contours:12,ringTex:Object.freeze([2048,128]),labels:24,sandText:!0}),T2:Object.freeze({dprCap:1.5,msaa:!0,grains:16384,stars:Object.freeze({signal:2e3,zenith:3e3}),bloom:"sprites",lattice:1,atlas:1024,contours:12,ringTex:Object.freeze([2048,128]),labels:24,sandText:!0}),T1:Object.freeze({dprCap:1.25,msaa:!1,grains:8192,stars:Object.freeze({signal:800,zenith:1200}),bloom:"sprites",lattice:.5,atlas:512,contours:8,ringTex:Object.freeze([1024,64]),labels:16,sandText:!1})}),Rc=["T1","T2","T3"],HR=/SwiftShader|llvmpipe|Software|Mali-4|Adreno \(TM\) 3/i,ss=Qt.governor;function $y(){try{return matchMedia("(pointer: coarse)").matches&&Math.min(window.innerWidth,window.innerHeight)<=600}catch{return!1}}function f0(n){let e=ti[n];return e?$y()?Object.freeze({...e,msaa:n==="T2"?!1:e.msaa,labels:16}):e:null}function Gy(n){return null}var Ec=null,af=!1,Yy=!0,p0=-1e9,nf=null,lf=0,Hy=!1,Wy=new Float32Array(ss.windowFrames),Da=0,Na=0,Ac=0,Tc=-1,Oa=-1,rf=-1;function m0(){Da=0,Na=0,Ac=0,Tc=-1,Oa=-1}var qy=30,Xy=new Float32Array(qy),sf=0,Fa="off",jy=0,of=null;function WR(n,e){let t=Array.prototype.slice.call(n,0,e).sort((i,r)=>i-r);return e?e%2?t[(e-1)/2]:(t[e/2-1]+t[e/2])/2:0}function Zy(n){let e=Rc.indexOf(n);return e>0?Rc[e-1]:n}function XR(n){let e=Rc.indexOf(n);return e>=0&&e<Rc.length-1?Rc[e+1]:n}function $R(){let n=de.now,e=rf<0?0:n-rf;if(rf=n,!(st.tier==="T0"||e<=0)){if(nf&&n-p0>=300){let t=nf;nf=null,st.setTier(t,"deferred")}if(Fa==="wait"&&n>=jy&&(Fa="run"),Fa==="run"){if(Xy[sf++]=e,sf>=qy){Fa="done";let t=WR(Xy,sf),i=st.tier;t>20?i="T1":t>=12&&(i=Zy(i)),i!==st.tier&&st.setTier(i,`benchmark ${t.toFixed(1)} ms`),of&&(of(st.tier),of=null),m0(),lf=n}return}if(!af&&n-lf>ss.upgradeAfterMs&&W.data&&W.data.tier!==st.tier)try{W.set("tier",st.tier)}catch{}af||!Yy||st.governor.update(e/1e3)}}var st={tier:"T2",params:ti.T2,detect(){let n="T0",e=null;try{let i=document.createElement("canvas").getContext("webgl2");if(!i)throw new Error("no WebGL2");let r="";try{let g=i.getExtension("WEBGL_debug_renderer_info");r=String(g?i.getParameter(g.UNMASKED_RENDERER_WEBGL):i.getParameter(i.RENDERER)||"")}catch{r=""}try{let g=i.getExtension("WEBGL_lose_context");g&&g.loseContext()}catch{}let s=HR.test(r),o=navigator.hardwareConcurrency||4,a=navigator.deviceMemory,l=(()=>{try{return matchMedia("(pointer: fine)").matches}catch{return!1}})(),c=$y(),u=W.data&&W.data.tier;u?n=u:s||o<=4||a!=null&&a<=3?n="T1":l&&o>=8?n="T3":(!c||a!=null&&a>=6,n="T2"),s&&(n="T1");let d=Gy("tier");if(d&&/^T[0-3]$/.test(d)&&(n=d,af=!0),Gy("gov")==="0"&&(Yy=!1),n==="T0")throw new Error("forced T0");let h=f0(n),f=document.getElementById("gl");if(e=f&&f.getContext("webgl2",{antialias:h.msaa,alpha:!0,premultipliedAlpha:!0,depth:!0,stencil:!1,powerPreference:"high-performance",preserveDrawingBuffer:!1}),!e)throw new Error("context creation failed")}catch{n="T0",e=null}return st.tier=n,st.params=f0(n),ee.tier=n,{tier:n,gl:e}},benchmark(){return af||st.tier==="T0"||Fa!=="off"?Promise.resolve(st.tier):(Fa="wait",sf=0,jy=de.now+600,new Promise(n=>{of=n}))},setTier(n,e=""){if(!ti[n]||n===st.tier||st.tier==="T0")return;if(ee.phase==="transition"&&de.now-p0<300){nf=n;return}let t=st.tier;st.tier=n,st.params=f0(n),ee.tier=n,st.governor.dropSteps=0,lf=de.now,m0();let i=Ec&&Ec.renderer;if(i)try{i.setTier(n),i.setDprDrop(0)}catch(r){xt("quality:renderer",r)}Se.emit("tier:change",{tier:n,prev:t})},governor:{fps:60,dropSteps:0,update(n){let e=n*1e3;if(!(e>0)||(Da===ss.windowFrames?Ac-=Wy[Na]:Da++,Wy[Na]=e,Ac+=e,Na=(Na+1)%ss.windowFrames,Da<ss.windowFrames))return;let t=1e3/(Ac/Da);st.governor.fps=t;let i=de.now;if(t<ss.lowFps){Oa=-1,Tc<0&&(Tc=i);let r=Ec&&Ec.renderer,s=Math.min(typeof devicePixelRatio=="number"?devicePixelRatio:1,ti[st.tier].dprCap);if(i-Tc>ss.dropAfterMs&&st.tier!=="T1"){st.setTier(Zy(st.tier),`governor ${t.toFixed(0)} fps`);return}if(r&&s-Qt.dprStep*(st.governor.dropSteps+1)>=1-1e-6){st.governor.dropSteps++;try{r.setDprDrop(st.governor.dropSteps)}catch(o){xt("quality:dpr",o)}Da=0,Na=0,Ac=0}}else Tc=-1,t>ss.highFps&&!Hy?(Oa<0&&(Oa=i),i-Oa>ss.upgradeAfterMs&&st.tier!=="T3"&&(Hy=!0,st.setTier(XR(st.tier),`governor ${t.toFixed(0)} fps`))):Oa=-1}},init(n){Ec=n,lf=de.now,de.add($R,Nt.UI)}};Se.on("travel:start",()=>{p0=de.now});Se.on("visibility",()=>{m0(),rf=-1});var YR=`
${bc}
${To}
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
}`,qR=`
${Ii}
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
}`;function g0(n={}){let e={},t=n.engrave!=null?n.engrave:null;t==="key"?e.USE_KEYGEO="":typeof t=="string"&&(e.USE_REGION=""),n.r1!==!1&&(e.USE_R1=""),n.strut==null&&(t==="key"||n.aStrut)&&(e.USE_ASTRUT=""),n.strata?e.USE_STRATA="":n.strataAlpha&&(e.USE_STRATA_A=""),n.fog!==!1&&(e.USE_FOG=""),Zt.texture||Zt.init(st.tier);let i=typeof t=="string"&&t!=="key"?Zt.region(t):null,r=Zt.size||1024;return new Pt({uniforms:{uBase:ei(n.tint||"obsidian"),uAlpha:{value:1},uFlash:{value:0},uEdgeEmber:{value:0},uRim:{value:n.rim!=null?n.rim:Qt.r2.fresnelGain},uStrut:{value:n.strut!=null?n.strut:.05},uHideCapsOf:{value:-1},uAtlas:{value:Zt.texture},uTexel:{value:1/r},uRegion:{value:i?i.rect:new en(0,0,0,0)},uFriezeH:{value:Dt.friezeH},uTickL:{value:Dt.tickLen},uApertureR:{value:Dt.apertureD/2},uStrataM:n.strata||wo(),uStrataA:n.strataAlpha||Eo(),cSilver:pe.cSilver,cWhite:pe.cWhite,cPaper:pe.cPaper,cInk:pe.cInk,cAbyss:pe.cAbyss,uLamp:pe.uLamp,uLampOn:pe.uLampOn,uInvert:pe.uInvert,uPixelRatio:pe.uPixelRatio,uPxPerUnit:pe.uPxPerUnit,uFogDensity:pe.uFogDensity},defines:e,vertexShader:YR,fragmentShader:qR,side:n.side!=null?n.side:Sr,transparent:!1,depthWrite:!0})}var Ua=" ",Ba="−";function os(n,e,t,i,r,s,o,a,l,c,u,d,h,f,g,y,m,p,b,S,_){let A=wx[n],[T,R]=Ex[n];return Object.freeze({id:n,slug:e,sign:t,stratum:i,num:r,code:s,title:o,titleOpen:a,name:l,nameOpen:c,line:u,alt:A,level:d,giant:h,floor:T,ceil:R,n:f,fog:g,far:y,wet:m,root:p,note:b,hidden:S,parent:_,anchor:Object.freeze(new C(0,A,0))})}var oe=Object.freeze({SIGNAL:os("SIGNAL","signal","S",0,"01","SIGNAL","СВЯЗЬ",null,"Связь",null,"передачи и сигналы",`+1${Ua}090.00`,`+1${Ua}090`,3,.014,400,.22,220,392,!1,null),ARCHIVE:os("ARCHIVE","archive","A",1,"02","ARCHIVE","ЛЕТОПИСЬ",null,"Летопись",null,"легенды, моменты, шутки","+810.00","+810",5,.006,500,.22,196,440,!1,null),MEMBERS:os("MEMBERS","members","M",2,"03","MEMBERS","КЛАН",null,"Клан",null,"кто с нами","+460.00","+460",7,.0034,800,.22,164.81,493.88,!1,null),CORE:os("CORE","core","•",3,"04","CORE","ЯДРО",null,"Ядро",null,"имя, девиз, всё о нас","±0.00","±0",12,.00485,700,.22,146.83,587.33,!1,null),VOYAGES:os("VOYAGES","voyages","V",4,"05","VOYAGES","ВЫЛАЗКИ",null,"Вылазки",null,"экспедиции и зонды",`${Ba}460.00`,`${Ba}460`,7,.0034,800,.3,123.47,659.25,!1,null),INSIGNIA:os("INSIGNIA","insignia","I",5,"06","INSIGNIA","ХРАНИЛИЩЕ",null,"Хранилище",null,"трофеи и находки",`${Ba}810.00`,`${Ba}810`,5,.006,500,0,110,783.99,!1,null),NADIR:os("NADIR","nadir","N",6,"07","NADIR","ЗАПЕЧАТАНО","ИСТОК","Запечатано","Исток","осколков {k} из 5",`${Ba}1${Ua}090.00`,`${Ba}1${Ua}090`,3,.014,400,.22,98,880,!1,null),ZENITH:os("ZENITH","zenith",null,-1,"00","ZENITH","НАД ВСЕМ",null,"Над всем",null,"—",`+1${Ua}260.00`,`+1${Ua}260`,3,35e-5,4e3,.35,220,392,!0,"SIGNAL"),WORKSHOP:os("WORKSHOP","workshop",null,2,"03","WORKSHOP","МАСТЕРСКАЯ",null,"Мастерская",null,"—","+484.00","+484",7,.06,30,.22,164.81,493.88,!0,"MEMBERS")});var bn=Object.freeze(["SIGNAL","ARCHIVE","MEMBERS","CORE","VOYAGES","INSIGNIA","NADIR"]);var $N=new Map(bn.map(n=>[oe[n].sign,oe[n]])),jR=new Map(Object.values(oe).map(n=>[n.slug,n]));function Ky(n){return jR.get(String(n||"").toLowerCase())||null}function cf(n){let e=bn[n];return e?oe[e]:null}var Jy=()=>(oe[ee.room]||oe.CORE).far,Qy=`
float lampReach(vec3 p) { float r = 2.0 * max(length(uCamPos - uLamp), 1e-4); float d = length(p - uLamp) / r; return 1.0 / (1.0 + d * d); }`,ZR=new Float32Array([0,-1,0,1,-1,0,0,1,0,1,1,0]),KR=[0,1,2,2,1,3],JR=`
${bc}
attribute vec3 aA; attribute vec3 aB; attribute float aW; attribute float aAl;
#ifdef USE_COL_ATTR
attribute vec3 aCol;
#endif
#ifdef USE_STRATA
attribute float aFace;
${To}
#endif
uniform vec3 uColor; uniform vec3 cWhite;
uniform float uWidth, uAlpha, uFar, uGlint, uFlatten, uFlattenY, uDrawA, uDrawB, uCount, uFlash, uStrut;
uniform vec2 uResolution; uniform float uPixelRatio; uniform vec3 uLamp; uniform float uWorldScale; uniform vec3 uCamPos;
${Qy}
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
}`,QR=`
${Ii}
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
}`;function uf(n,e){let t=new Float32Array(n);return t.fill(e),t}function Pi(n={}){let e=n.segments||new Float32Array(6),t=n.count!=null?n.count:Math.floor(e.length/6),i=Math.max(1,Math.floor(e.length/6)),r=new yo;r.setAttribute("position",new sn(ZR,3)),r.setIndex(KR);let s=new wa(e,6),o=()=>{r.setAttribute("aA",new ba(s,3,0)),r.setAttribute("aB",new ba(s,3,3))};o();let a=n.width instanceof Float32Array?n.width:uf(i,1),l=n.alpha instanceof Float32Array?n.alpha:uf(i,1);r.setAttribute("aW",new ai(a,1)),r.setAttribute("aAl",new ai(l,1));let c={},u=n.color instanceof Float32Array;u&&(r.setAttribute("aCol",new ai(n.color,3)),c.USE_COL_ATTR=""),n.faces&&n.strata&&(r.setAttribute("aFace",new ai(n.faces,1)),c.USE_STRATA=""),n.dash&&(c.USE_DASH=""),n.strut!=null&&(c.USE_STRUT=""),n.flatten&&(c.USE_FLATTEN=""),n.fog!==!1&&(c.USE_FOG=""),r.instanceCount=t;let d={uColor:ei(u?"silver":n.color||"silver"),uWidth:{value:typeof n.width=="number"?n.width:1},uAlpha:{value:typeof n.alpha=="number"?n.alpha:n.alpha instanceof Float32Array?1:Qt.r3.alpha},uFar:{value:n.far!=null?n.far:Jy()},uGlint:{value:n.glint!=null?n.glint:Qt.r3.glintGain},uFlatten:{value:0},uFlattenY:{value:0},uDrawA:{value:0},uDrawB:{value:1},uCount:{value:t},uFlash:{value:0},uStrut:{value:n.strut!=null?n.strut:0},uDash:{value:new it(n.dash?n.dash[0]:1,n.dash?n.dash[1]:0)},uStrataM:n.strata||wo(),uStrataA:n.strataAlpha||Eo(),cWhite:pe.cWhite,cAbyss:pe.cAbyss,uFogDensity:pe.uFogDensity,uLamp:pe.uLamp,uCamPos:pe.uCamPos,uResolution:pe.uResolution,uPixelRatio:pe.uPixelRatio,uPxPerUnit:pe.uPxPerUnit,uWorldScale:pe.uWorldScale},h=new Pt({uniforms:d,defines:c,vertexShader:JR,fragmentShader:QR,transparent:!0,depthWrite:!1,depthTest:n.depthTest!==!1,blending:n.additive?_o:ar}),f=new Vt(r,h);return f.frustumCulled=!1,n.layer!=null&&f.layers.set(n.layer),n.renderOrder!=null&&(f.renderOrder=n.renderOrder),{mesh:f,uniforms:d,get count(){return t},setSegments(y,m){let p=m??Math.floor(y.length/6);p<=i&&y!==s.array?(s.array.set(y.subarray(0,p*6)),s.needsUpdate=!0):y!==s.array?(i=Math.max(p,Math.floor(y.length/6)),s=new wa(y,6),o(),a.length<i&&!(n.width instanceof Float32Array)&&r.setAttribute("aW",new ai(uf(i,1),1)),l.length<i&&!(n.alpha instanceof Float32Array)&&r.setAttribute("aAl",new ai(uf(i,1),1))):s.needsUpdate=!0,t=p,r.instanceCount=p,d.uCount.value=p},setColor(y){y instanceof Float32Array?(r.setAttribute("aCol",new ai(y,3)),h.defines.USE_COL_ATTR===void 0&&(h.defines.USE_COL_ATTR="",h.needsUpdate=!0)):(d.uColor=ei(y||"silver"),h.defines.USE_COL_ATTR!==void 0&&(delete h.defines.USE_COL_ATTR,h.needsUpdate=!0))},setAlpha(y){d.uAlpha.value=y,f.visible=y>0},setWidth(y){d.uWidth.value=y},setDrawRange01(y,m){d.uDrawA.value=y,d.uDrawB.value=m},setFlatten(y,m){d.uFlatten.value=y,d.uFlattenY.value=m},dispose(){r.dispose(),h.dispose(),f.parent&&f.parent.remove(f)}}}var eC=`
${bc}
#ifdef USE_STRATA
attribute float aFace;
${To}
#endif
#ifdef USE_ASTRUT
attribute float aStrut;
#endif
#ifdef USE_DIR
attribute vec3 aDir;
#endif
uniform float uStrut, uAlpha, uFar, uGlint, uWorldScale, uFade; uniform vec3 uLamp; uniform vec3 uColor; uniform vec3 uCamPos;
${Qy}
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
}`,tC=`
${Ii}
varying vec3 vCol; varying float vAlpha; varying float vDist;
void main() {
  if (vAlpha <= 0.002) discard;
  vec3 col = vCol;
#ifdef USE_FOG
  col = applyFog(col, vDist);
#endif
  gl_FragColor = vec4(col, vAlpha);
}`;function e_(n={}){let e={};return n.strut==null&&(e.USE_ASTRUT=""),n.strata&&(e.USE_STRATA=""),n.dir!==!1&&(e.USE_DIR=""),n.fog!==!1&&(e.USE_FOG=""),new Pt({uniforms:{uStrut:{value:n.strut!=null?n.strut:0},uAlpha:{value:n.alpha!=null?n.alpha:Qt.r3.alpha},uFade:{value:1},uFar:{value:n.far!=null?n.far:Jy()},uGlint:{value:n.glint!=null?n.glint:Qt.r3.glintGain},uColor:ei(n.color||"silver"),uStrataM:n.strata||wo(),uStrataA:n.strataAlpha||Eo(),uLamp:pe.uLamp,uCamPos:pe.uCamPos,uWorldScale:pe.uWorldScale,uPxPerUnit:pe.uPxPerUnit,cAbyss:pe.cAbyss,uFogDensity:pe.uFogDensity},defines:e,vertexShader:eC,fragmentShader:tC,transparent:!0,depthWrite:!1,blending:ar})}var nC=`
attribute float aSize; attribute float aAlpha;
#ifdef USE_STRATA
attribute float aFace;
${To}
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
}`,iC=`
${Ii}
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
}`;function hf(n,e){let t=new Float32Array(Math.max(1,n));return t.fill(e),t}function Bs(n={}){let e=n.positions||new Float32Array(3),t=Math.floor(e.length/3),i=n.count!=null?Math.min(n.count,t):t,r=new xn;r.setAttribute("position",new sn(e,3)),r.setAttribute("aSize",new sn(n.sizes||hf(t,1),1)),r.setAttribute("aAlpha",new sn(n.alphas||hf(t,1),1));let s={};n.faces&&n.strata&&(r.setAttribute("aFace",new sn(n.faces,1)),s.USE_STRATA=""),n.fog!==!1&&(s.USE_FOG=""),r.setDrawRange(0,i);let o={uColor:ei(n.color||"white"),uAlpha:{value:n.alpha!=null?n.alpha:.4},uSize:{value:n.sizePx!=null?n.sizePx:2},uStrataM:n.strata||wo(),uStrataA:n.strataAlpha||Eo(),uPixelRatio:pe.uPixelRatio,cAbyss:pe.cAbyss,uFogDensity:pe.uFogDensity},a=new Pt({uniforms:o,defines:s,vertexShader:nC,fragmentShader:iC,transparent:!0,depthWrite:!1,depthTest:n.depthTest!==!1,blending:ar}),l=new Jl(r,a);return l.frustumCulled=n.frustumCulled===!0,l.layers.set(n.layer!=null?n.layer:Qn.DEFAULT),n.renderOrder!=null&&(l.renderOrder=n.renderOrder),{object:l,uniforms:o,get count(){return i},setCount(c){i=Math.max(0,Math.min(t,c|0)),r.setDrawRange(0,i)},setAlpha(c){o.uAlpha.value=c,l.visible=c>0},setSize(c){o.uSize.value=c},setColor(c){o.uColor=ei(c),a.uniforms.uColor=o.uColor},setPositions(c,u){let d=u??Math.floor(c.length/3);d<=t&&c!==e?e.set(c.subarray(0,d*3)):c!==e&&(e=c,t=Math.floor(c.length/3),r.setAttribute("position",new sn(e,3)),r.setAttribute("aSize",new sn(hf(t,1),1)),r.setAttribute("aAlpha",new sn(hf(t,1),1))),r.attributes.position.needsUpdate=!0,i=Math.min(d,t),r.setDrawRange(0,i)},dispose(){r.dispose(),a.dispose(),l.parent&&l.parent.remove(l)}}}var x0=Math.PI*2,ka=99,rC=Dt.sign.heightFrac;function Xi(n,e,t,i,r,s){let o=Math.floor(i),a=i-o,l=x0*o/n-Math.PI/n,c=l+x0/n,u=Math.sin(l)*e,d=Math.cos(l)*e,h=Math.sin(c)*e,f=Math.cos(c)*e;r[s]=u+(h-u)*a,r[s+1]=t,r[s+2]=d+(f-d)*a}function df(n,e,t,i,r=n.k){return t*n.n/r+(e<0?.5*n.n/r:0)+e*Dt.lattice.faceShift*i}var v0=2,ff=(n,e,t)=>Math.max(1e-4,2*Ct(t)*Math.sin(Math.PI/n)*n/(e*v0)),pf=class{constructor(){this.p=[],this.n=[],this.uv=[],this.eng=[],this.face=[],this.kind=[],this.strut=[]}tri(e,t,i,r,s,o){let a=t[0]-e[0],l=t[1]-e[1],c=t[2]-e[2],u=i[0]-e[0],d=i[1]-e[1],h=i[2]-e[2],f=l*h-c*d,g=c*u-a*h,y=a*d-l*u,m=Math.hypot(f,g,y);if(m<1e-12)return;f/=m,g/=m,y/=m;let p=e,b=t,S=i;f*o[0]+g*o[1]+y*o[2]<0&&(b=i,S=t,f=-f,g=-g,y=-y);for(let _ of[p,b,S])this.p.push(_[0],_[1],_[2]),this.n.push(f,g,y),this.uv.push(_[3],_[4]),this.eng.push(_[5],_[6],_[7],_[8]),this.face.push(r),this.kind.push(s),this.strut.push(_[9])}geometry(){let e=new xn;return e.setAttribute("position",new zt(this.p,3)),e.setAttribute("normal",new zt(this.n,3)),e.setAttribute("aFaceUV",new zt(this.uv,2)),e.setAttribute("aEng",new zt(this.eng,4)),e.setAttribute("aFace",new zt(this.face,1)),e.setAttribute("aKind",new zt(this.kind,1)),e.setAttribute("aStrut",new zt(this.strut,1)),e.computeBoundingSphere(),e}},kn=new Float32Array(3);function t_(n,e){let{i:t,n:i,k:r,top:s,bot:o,hollow:a}=e,l=s-o,c=(s+o)/2,u=rC*l,d=Nu.map(f=>s+(o-s)*f),h=d.map(f=>Ct(f));for(let f=0;f<i;f++){let g=x0*f/i,y=Math.cos(g),m=-Math.sin(g),p=[Math.sin(g),0,Math.cos(g)],b=t*16+f,S=(_,A)=>{Xi(i,h[_],d[_],f+A,kn,0);let T=kn[0]*y+kn[2]*m;return[kn[0],kn[1],kn[2],A,(s-d[_])/l,T/u+.5,.5-(d[_]-c)/u,s-d[_],d[_]-o,ff(i,r,d[_])]};for(let _=0;_<3;_++){let A=S(_,0),T=S(_,1),R=S(_+1,0),x=S(_+1,1);n.tri(A,R,x,b,0,p),n.tri(A,x,T,b,0,p)}for(let[_,A,T,R]of[[s,h[0],1,1],[o,h[3],2,-1]]){if(A<=1e-6)continue;let x=ff(i,r,_),w=(I,D)=>(Xi(i,I,_,D,kn,0),[kn[0],kn[1],kn[2],.5,T===1?0:1,-1,-1,ka,ka,x]);if(a>0){let I=w(A,f),D=w(A,f+1),F=w(a,f),z=w(a,f+1);n.tri(I,D,z,b,T,[0,R,0]),n.tri(I,z,F,b,T,[0,R,0])}else n.tri([0,_,0,.5,T===1?0:1,-1,-1,ka,ka,x],w(A,f),w(A,f+1),b,T,[0,R,0])}if(a>0){let _=2*a*Math.sin(Math.PI/i)*i/(r*v0),A=(D,F)=>(Xi(i,a,D,F,kn,0),[kn[0],kn[1],kn[2],F-f,(s-D)/l,-1,-1,ka,ka,_]),T=A(s,f),R=A(s,f+1),x=A(o,f),w=A(o,f+1),I=[-Math.sin(g),0,-Math.cos(g)];n.tri(T,x,w,b,3,I),n.tri(T,w,R,b,3,I)}}}function n_(n){let e=[],t=[],i=[],r=[],s=new Float32Array(3),o=new Float32Array(3),a=(u,d,h,f,g,y)=>{let m=f[0]-h[0],p=f[1]-h[1],b=f[2]-h[2],S=Math.hypot(m,p,b)||1,_=u.i*16+(Math.floor(d)%u.n+u.n)%u.n;e.push(h[0],h[1],h[2],f[0],f[1],f[2]),t.push(_,_),i.push(g,y),r.push(m/S,p/S,b/S,m/S,p/S,b/S)},l=Dt.lattice.segmentsPerGenerator;for(let u of an){let d=Math.max(1,Math.round(u.k*n)),h=u.hollow>0?[!1,!0]:[!1];for(let f of h)for(let g of[1,-1])for(let y=0;y<d;y++)for(let m=0;m<l;m++){let p=m/l,b=(m+1)/l,S=u.top+(u.bot-u.top)*p,_=u.top+(u.bot-u.top)*b,A=f?u.hollow:Ct(S),T=f?u.hollow:Ct(_),R=df(u,g,y,p,d),x=df(u,g,y,b,d),w=F=>(F%u.n+u.n)%u.n;Xi(u.n,A,S,w(R),s,0),Xi(u.n,T,_,w(x),o,0);let I=f?2*u.hollow*Math.sin(Math.PI/u.n)*u.n/(u.k*v0):ff(u.n,u.k,S),D=f?I:ff(u.n,u.k,_);a(u,w((R+x)/2),s,o,I,D)}}let c=new xn;return c.setAttribute("position",new zt(e,3)),c.setAttribute("aFace",new zt(t,1)),c.setAttribute("aStrut",new zt(i,1)),c.setAttribute("aDir",new zt(r,3)),c.computeBoundingSphere(),c}function sC(){let n=[],e=[],t=[],i=new Float32Array(3),r=new Float32Array(3),s=(o,a,l)=>{n.push(i[0],i[1],i[2],r[0],r[1],r[2]),e.push(l),t.push(o*16+a)};for(let o of an){let{i:a,n:l,top:c,bot:u,hollow:d}=o,h=Nu.map(m=>c+(u-c)*m),f=[...Array(l).keys()].sort((m,p)=>Math.min(m,l-m)-Math.min(p,l-p)),g=0,y=new Set;for(let m of f)for(let p of[0,3])g<Qt.r3.primaryEdges&&Ct(h[p])>1e-6&&(y.add(`${p}:${m}`),g++);for(let m=0;m<l;m++){for(let p=0;p<3;p++)Xi(l,Ct(h[p]),h[p],m,i,0),Xi(l,Ct(h[p+1]),h[p+1],m,r,0),s(a,m,Qt.r3.widthPx);for(let p of[0,3]){let b=Ct(h[p]);b<=1e-6||(Xi(l,b,h[p],m,i,0),Xi(l,b,h[p],m+.999999,r,0),s(a,m,y.has(`${p}:${m}`)?Qt.r3.primaryPx:Qt.r3.widthPx))}if(d>0)for(let p of[c,u])Xi(l,d,p,m,i,0),Xi(l,d,p,m+.999999,r,0),s(a,m,Qt.r3.widthPx)}}return{seg:new Float32Array(n),width:new Float32Array(e),face:new Float32Array(t)}}function oC(){let n=[],e=[];for(let t of an)for(let i of Nu){let r=t.top+(t.bot-t.top)*i,s=Ct(r);for(let o=0;o<t.n&&(Xi(t.n,s,r,o,kn,0),n.push(kn[0],kn[1],kn[2]),e.push(t.i*16+o),!(s<=1e-6));o++);}return{pos:new Float32Array(n),face:new Float32Array(e)}}function Cc(n={}){let e=!!n.perStratum,t=new jt;t.name=e?"structure:key":"structure";let i=n.scale!=null?n.scale:1;t.scale.setScalar(i);let r=n.far!=null?n.far:700,s={value:Array.from({length:7},()=>new Et)},o={value:[1,1,1,1,1,1,1]},a=[];if(e)for(let R=0;R<7;R++){let x=new jt;x.name=`stratum:${R}`,t.add(x),a.push(x)}else a.push(t);let l=()=>{if(e)for(let R=0;R<7;R++)s.value[R].copy(a[R].matrix)},c=[],u=null;if(n.solid!==!1)if(e){u=g0({engrave:"key",strataAlpha:o});for(let R of an){let x=new pf;t_(x,R);let w=new Vt(x.geometry(),u);w.name=`solid:${R.i}`,w.userData.stratum=R.i,a[R.i].add(w),c.push(w)}}else{u=g0({engrave:"key",strata:s,strataAlpha:o});let R=new pf;for(let w of an)t_(R,w);let x=new Vt(R.geometry(),u);x.name="solid",x.frustumCulled=!1,t.add(x),c.push(x)}let d=null,h=null,f=n.latticeDensity!=null?n.latticeDensity:1;n.lattice!==!1&&(h=e_({strata:s,strataAlpha:o,far:r,dir:!0}),d=new Kl(n_(f),h),d.name="lattice",d.frustumCulled=!1,d.onBeforeRender=l,t.add(d));let g=[],y=Qt.r3.alpha;if(n.edges!==!1){let R=sC(),x=Pi({segments:R.seg,width:R.width,faces:R.face,strata:s,strataAlpha:o,far:r,alpha:y});x.mesh.name="edges",x.mesh.onBeforeRender=l,t.add(x.mesh),g.push(x)}let m=null,p=null,b=.4;if(n.vertices){let R=oC();p=Bs({positions:R.pos,faces:R.face,strata:s,strataAlpha:o,sizePx:2,color:"white",alpha:b}),m=p.object,m.name="vertices",m.onBeforeRender=l,t.add(m)}let S=1,_={solid:1,lattice:1,edges:1,vertices:1},A=()=>{t.visible=S>0,u&&(u.uniforms.uAlpha.value=S*_.solid);for(let R of c)R.visible=S*_.solid>0;h&&(h.uniforms.uFade.value=S*_.lattice,d.visible=S*_.lattice>0);for(let R of g)R.setAlpha(y*S*_.edges);p&&p.setAlpha(b*S*_.vertices)},T={group:t,strata:a,solids:c,lattice:d,edges:g,vertices:m,strataMatrices:s,strataAlpha:o,solidMaterial:u,latticeMaterial:h,perStratum:e,setGap(R){for(let x=0;x<7;x++){let w=(3-x)*(R-It.rest);e?a[x].position.y=w:s.value[x].makeTranslation(0,w,0)}},setFade(R){S=Math.max(0,Math.min(1,R)),A()},get fade(){return S},setStratumFade(R,x){R>=0&&R<7&&(o.value[R]=Math.max(0,Math.min(1,x)))},setParts(R){for(let x in R)x in _&&(_[x]=R[x]);A()},setFar(R){h&&(h.uniforms.uFar.value=R);for(let x of g)x.uniforms.uFar.value=R},setHideCaps(R){u&&(u.uniforms.uHideCapsOf.value=R)},setLatticeDensity(R){if(!d||R===f)return;f=R;let x=d.geometry;d.geometry=n_(R),x.dispose()},dispose(){for(let R of c)R.geometry.dispose();u&&u.dispose(),d&&(d.geometry.dispose(),h.dispose());for(let R of g)R.dispose();p&&p.dispose(),t.parent&&t.parent.remove(t)}};return T.setGap(It.rest),n.hallLod&&T.setHideCaps(-1),T}var Rr=null;function aC(){if(Rr)return Rr;let n=document.createElement("canvas");n.width=n.height=64;let e=n.getContext("2d"),t=e.createImageData(64,64);for(let i=0;i<64;i++)for(let r=0;r<64;r++){let s=(r+.5)/32-1,o=(i+.5)/32-1,a=Math.min(1,Math.sqrt(s*s+o*o)),l=(.72*Math.exp(-a*a*18)+.28*Math.exp(-a*a*4.2))*(1-a*a)*(1-a),c=(i*64+r)*4;t.data[c]=t.data[c+1]=t.data[c+2]=255,t.data[c+3]=Math.round(255*Math.min(1,l))}return e.putImageData(t,0,0),Rr=new Jr(n),Rr.minFilter=At,Rr.magFilter=At,Rr.generateMipmaps=!1,Rr.wrapS=Rr.wrapT=Zn,Wi(Rr,4096*4),Rr}var lC=`
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
}`,cC=`
${Ii}
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
}`,Ic=new Set,y0=null;function i_(){return y0||(y0=new Qr(1,1)),y0}function r_(n,e){let t={};e&&(t.USE_BATCH=""),n.fog!==!1&&(t.USE_FOG="");let i={uTex:{value:aC()},uColor:ei(n.color||"ember"),uRadius:{value:n.radius!=null?n.radius:.05},uIntensity:{value:n.intensity!=null?n.intensity:1},uNightMix:{value:n.night?1:0},uNightI:{value:n.nightIntensity!=null?n.nightIntensity:.55},uFlash:{value:0},uNight:pe.uNight,cElectrum:pe.cElectrum,cWhite:pe.cWhite,cAbyss:pe.cAbyss,uFogDensity:pe.uFogDensity};return new Pt({uniforms:i,defines:t,vertexShader:lC,fragmentShader:cC,transparent:!0,depthWrite:!1,depthTest:n.depthTest!==!1,blending:_o,premultipliedAlpha:!0})}function _0(n,e){let t=e==="T3";n.core?(t?n.core.layers.enable(Qn.EMISSIVE):n.core.layers.disable(Qn.EMISSIVE),n._tierHidden=t):(t?n.sprite.layers.enable(Qn.EMISSIVE):n.sprite.layers.disable(Qn.EMISSIVE),n._tierHidden=!1),n._sync()}Se.on("tier:change",({tier:n})=>{for(let e of Ic)_0(e,n)});function mf(n={}){let e=new jt,t=r_(n,!1),i=new Vt(i_(),t);i.frustumCulled=!1,i.renderOrder=n.renderOrder!=null?n.renderOrder:5,e.add(i),n.core&&e.add(n.core);let r={object:e,sprite:i,core:n.core||null,uniforms:t.uniforms,_tierHidden:!1,_sync(){i.visible=!r._tierHidden&&t.uniforms.uIntensity.value>0},setIntensity(s){t.uniforms.uIntensity.value=s,r._sync()},setColor(s){t.uniforms.uColor=ei(s)},setRadius(s){t.uniforms.uRadius.value=s},setFlash(s){t.uniforms.uFlash.value=s},dispose(){Ic.delete(r),t.dispose(),e.parent&&e.parent.remove(e)}};return Ic.add(r),_0(r,st.tier),r}function gf(n={}){let e=n.positions||new Float32Array(3),t=Math.max(1,Math.floor(e.length/3)),i=i_(),r=new yo;r.setIndex(i.index.clone()),r.setAttribute("position",i.getAttribute("position").clone()),r.setAttribute("uv",i.getAttribute("uv").clone());let s=new ai(new Float32Array(t*3),3);s.array.set(e.subarray(0,t*3)),r.setAttribute("aOffset",s);let o=n.count!=null?Math.min(t,n.count):t;r.instanceCount=o;let a=r_(n,!0),l=new Vt(r,a);l.frustumCulled=!1,l.renderOrder=n.renderOrder!=null?n.renderOrder:5;let c={object:l,sprite:l,core:null,uniforms:a.uniforms,_tierHidden:!1,_sync(){l.visible=o>0&&a.uniforms.uIntensity.value>0},get count(){return o},setCount(u){o=Math.max(0,Math.min(t,u|0)),r.instanceCount=o,c._sync()},setIntensity(u){a.uniforms.uIntensity.value=u,c._sync()},setColor(u){a.uniforms.uColor=ei(u)},setRadius(u){a.uniforms.uRadius.value=u},setPositions(u,d){let h=Math.min(t,d??Math.floor(u.length/3));s.array.set(u.subarray(0,h*3)),s.needsUpdate=!0,c.setCount(h)},dispose(){Ic.delete(c),r.dispose(),a.dispose(),l.parent&&l.parent.remove(l)}};return Ic.add(c),_0(c,st.tier),c}var Co=an[ao.stratum],Pc=Co.n/Co.k,uC=Math.floor(1.5/Pc-.5)+1,s_=.003;function hC(n,e){let t=Math.round(e*1.5/Pc-.5);t=Math.max(0,Math.min(uC-1,t));let i=(t+.5)*Pc/1.5,r=df(Co,1,0,i),s=Math.round((n-r)/Pc);return{s:r+s*Pc,t:i,key:`${t}:${s}`}}function dC(n,e,t){let i=Co.top+(Co.bot-Co.top)*e,r=Ct(i),s=Co.n,o=(n%s+s)%s,a=Math.floor(o),l=o-a,c=Math.PI*2*a/s-Math.PI/s,u=c+Math.PI*2/s;return t.set(Math.sin(c)*r+(Math.sin(u)-Math.sin(c))*r*l,i,Math.cos(c)*r+(Math.cos(u)-Math.cos(c))*r*l)}function Lc(n){let e=lo(n||[]),t=[],i=new Set,r=o=>-1+3*(.1+.8*o),s=o=>.1+.8*o;for(let[o,a]of e){let l=Cp(o),c=Cp(a),u=Math.hypot((c.x-l.x)*6,(c.y-l.y)*6),d=Math.max(1,Math.round(u));for(let h=0;h<=d;h++){let f=h/d,g=hC(r(l.x+(c.x-l.x)*f),s(l.y+(c.y-l.y)*f));if(i.has(g.key))continue;i.add(g.key);let y=dC(g.s,g.t,new C);Math.hypot(y.x,y.y)<ao.apertureSkip||t.push(y)}}return t}function xf(n={}){let e=n.scale||1,t=n.nodes||Lc(vt.clan.sigil),i=new Float32Array(Math.max(1,t.length)*3);t.forEach((l,c)=>{let u=Math.hypot(l.x,l.z)||1;i[c*3]=l.x+l.x/u*s_,i[c*3+1]=l.y,i[c*3+2]=l.z+l.z/u*s_});let r=0,s=!1,o=kr&&kr.litAlpha!=null?kr.litAlpha:.7;if(e<1e3){let l=Bs({positions:i,count:0,sizePx:n.dotPx||ao.dotPx,color:"ember",alpha:1});return l.object.name="litNodes",l.object.renderOrder=3,{object:l.object,nodes:t,get count(){return r},setCount(c){r=Math.max(0,Math.min(t.length,c|0)),l.setCount(r),l.object.visible=r>0},setNight(c){s=!!c,l.setAlpha(s?o:1)},dispose(){l.dispose()}}}let a=gf({positions:i,count:0,color:"ember",radius:(n.emitterM||ao.emitterM)/e,intensity:1,night:!1});return a.object.name="litNodes",{object:a.object,nodes:t,get count(){return r},setCount(l){r=Math.max(0,Math.min(t.length,l|0)),a.setCount(r)},setNight(l){s=!!l,a.setIntensity(s?o:1)},dispose(){a.dispose()}}}var a_="samvin.v1",o_="samvin.session",fC=400,l_=/^S(0[1-9]|1[0-4])$/,za=n=>n!==null&&typeof n=="object"&&!Array.isArray(n),M0=n=>Array.isArray(n)&&n.every(e=>typeof e=="string");function pC(){return{v:1,firstVisit:null,lastVisit:null,days:[],found:{},shards:0,nadirOpen:!1,owner:!1,glyph:null,drawings:[],jokesFound:[],drones:{day:null,count:0,arrivals:0},resonanceNext:0,maxNest:0,transmissions:{delivered:0,read:[],lastDay:null},probes:{},decoded:[],capsuleOpened:!1,companionArrived:!1,whaleSeen:!1,inverted:!1,sound:"on",tier:null,lastRoom:"#/core",firstDive:!1,firstUnfold:!1,whaleDay:null,birthdayLeadDay:null,foundVars:{}}}var mC={v:n=>n===1,firstVisit:n=>n===null||typeof n=="string"&&Number.isFinite(Date.parse(n)),lastVisit:n=>n===null||typeof n=="string"&&Number.isFinite(Date.parse(n)),days:n=>M0(n),found:n=>za(n),shards:n=>Number.isInteger(n)&&n>=0&&n<=5,nadirOpen:n=>typeof n=="boolean",owner:n=>typeof n=="boolean",glyph:n=>n===null||Array.isArray(n),drawings:n=>Array.isArray(n),jokesFound:n=>M0(n),drones:n=>za(n),resonanceNext:n=>Number.isInteger(n)&&n>=0,maxNest:n=>typeof n=="number"&&Number.isFinite(n),transmissions:n=>za(n),probes:n=>za(n),decoded:n=>M0(n),capsuleOpened:n=>typeof n=="boolean",companionArrived:n=>typeof n=="boolean",whaleSeen:n=>typeof n=="boolean",inverted:n=>typeof n=="boolean",sound:n=>n==="on"||n==="off",tier:n=>n===null||n==="T1"||n==="T2"||n==="T3",lastRoom:n=>typeof n=="string"&&n.startsWith("#"),firstDive:n=>typeof n=="boolean",firstUnfold:n=>typeof n=="boolean",whaleDay:n=>n===null||typeof n=="string",birthdayLeadDay:n=>n===null||typeof n=="string",foundVars:n=>za(n)};function gC(n){let e=za(n)?n:{},t=pC();for(let s of Object.keys(t))(!(s in e)||!mC[s](e[s]))&&(e[s]=t[s]);let i=e.drones;i.day===null||typeof i.day=="string"||(i.day=null),Number.isInteger(i.count)||(i.count=0),Number.isInteger(i.arrivals)||(i.arrivals=0);let r=e.transmissions;(!Number.isInteger(r.delivered)||r.delivered<0)&&(r.delivered=0),Array.isArray(r.read)||(r.read=[]),r.read=r.read.filter(s=>Number.isInteger(s)&&s>=0),r.lastDay===null||typeof r.lastDay=="string"||(r.lastDay=null);for(let s of Object.keys(e.found))(!l_.test(s)||typeof e.found[s]!="string")&&delete e.found[s];return e.days=[...new Set(e.days.filter(s=>/^\d{4}-\d{2}-\d{2}$/.test(s)))].sort(),e}function xC(){try{let n=localStorage.getItem(a_);if(n==null)return{};try{return JSON.parse(n)}catch{return{}}}catch{return W.storageOk=!1,{}}}var Dc=0,yf=!1;function Va(){if(Dc&&(clearTimeout(Dc),Dc=0),!(!yf||!W.data)&&(yf=!1,!!W.storageOk))try{localStorage.setItem(a_,JSON.stringify(W.data))}catch{W.storageOk=!1}}function Al(){if(yf=!0,!Dc)try{Dc=setTimeout(Va,500)}catch{Va()}}var vf=-1,W={data:null,storageOk:!0,today:"",distinctDays:1,isNewDay:!1,returning:!1,sameDaySession:!1,daysAway:0,bond:0,shrp:28,get litNodes(){if(vf<0)try{vf=Lc(vt.clan.sigil).length}catch(n){vf=0,xt("state:lit",n)}return Math.min(W.distinctDays,vf)},set(n,e){W.data[n]=e,Al()},patch(n){n(W.data),Al()},deliverTransmissions(){let n=W.data.transmissions;if(n.lastDay===W.today)return 0;let e=vt.transmissions.length,t=Math.min(e,Math.max(n.delivered,W.distinctDays)),i=Math.max(0,t-n.delivered);return n.delivered=Math.max(n.delivered,t),n.lastDay=W.today,Al(),i},markRead(n){let e=W.data.transmissions;!Number.isInteger(n)||n<0||e.read.includes(n)||(e.read.push(n),Al())},rank(){let n=Object.keys(W.data.found).filter(t=>l_.test(t)).length,e=W.distinctDays;return n>=12&&e>=14?{name:"АРХИТЕКТОР",index:3}:n>=7&&e>=5?{name:"СМОТРИТЕЛЬ",index:2}:n>=3||e>=3?{name:"ИССЛЕДОВАТЕЛЬ",index:1}:{name:"НАБЛЮДАТЕЛЬ",index:0}}};function c_(n){let e=Number.isFinite(n)?n:Date.now(),t=gC(xC());W.data=t,W.today=Hu(e);let i=!0;try{i=sessionStorage.getItem(o_)==null,sessionStorage.setItem(o_,"1")}catch{i=!0}let r=t.firstVisit,s=t.lastVisit?Hu(Date.parse(t.lastVisit)):null;if(W.returning=r!=null&&i,W.sameDaySession=W.returning&&s===W.today,W.daysAway=s?Math.max(0,El(s,W.today)):0,W.isNewDay=!t.days.includes(W.today),W.isNewDay)for(t.days.push(W.today),t.days.sort();t.days.length>fC;)t.days.shift();W.distinctDays=Math.max(1,t.days.length);let o=new Date(e).toISOString();t.firstVisit==null&&(t.firstVisit=o),t.lastVisit=o;let a=Object.keys(t.found).length;return W.bond=wp(W.distinctDays,a),W.shrp=vx(W.distinctDays,a),yf=!0,Va(),W}typeof window<"u"&&window.addEventListener("pagehide",Va);var u_=Object.freeze({clan:"members",crew:"members",missions:"voyages",vault:"insignia",legends:"archive"}),d_=new Set(["MEMBERS","VOYAGES","ARCHIVE","INSIGNIA"]);function vC(n){try{return decodeURIComponent(n)}catch{return n}}function ks(n,e){let t={hash:"",room:n,sub:e==null||e===""?null:e};return t.hash=yC(t),t}function Cr(n){if(n&&typeof n=="object"&&n.room)return ks(oe[n.room]?n.room:"CORE",n.sub||null);let t=String(n??"").trim().replace(/^#?\/?/,"").split(/[/?]/).filter(Boolean),i=(t[0]||"core").toLowerCase();u_[i]&&(i=u_[i]);let r=Ky(i);if(!r||r.id==="WORKSHOP")return ks("CORE",null);let s=t[1]?vC(t[1]):null;return r.id==="MEMBERS"&&s&&s.toLowerCase()==="workshop"?ks("WORKSHOP",null):r.id==="CORE"?ks("CORE",s&&s.toLowerCase()==="open"?"open":null):ks(r.id,d_.has(r.id)?s:null)}function yC(n){let e=n&&oe[n.room]?n.room:"CORE";if(e==="WORKSHOP")return"#/members/workshop";let t=n.sub,i=t!=null&&t!==""&&(d_.has(e)||e==="CORE"&&t==="open");return`#/${oe[e].slug}${i?"/"+encodeURIComponent(String(t)):""}`}var h_=n=>!!(W.data&&W.data.found&&W.data.found[n]);function b0(n,e){let t=n&&n.room?n:Cr(n),i=W.data||{};return t.room==="NADIR"&&!i.nadirOpen?{route:ks("CORE",null),status:"sealed",vars:{k:i.shards|0},shudder:"N"}:t.room==="ZENITH"&&!h_("S13")&&e!=="overpull"?{route:ks("CORE",null),status:"route.missing",vars:{}}:t.room==="WORKSHOP"&&!h_("S06")&&e!=="hall"?{route:ks("MEMBERS",vt.operator.id||null)}:{route:t}}function Nc(n){let e=vt.clan.name,t=n&&oe[n.room]?n.room:"CORE";if(t==="CORE")return ee.owner?`${e} · ${Sl(vt.operator.name)}`:e;let i=oe[t],r=t==="NADIR"&&W.data&&W.data.nadirOpen&&i.nameOpen?i.nameOpen:i.name;return`${e} · ${r}`}var Nt=Object.freeze({INPUT:0,CLOCK:10,DIRECTOR:20,WORLD:30,FX:40,LAMP:50,CAMERA:60,OVERLAY:70,RENDER:80,UI:90}),MC=.05,f_=250,Io=[],bC=1,Ga=0,_f=-1;function SC(n){let e=Io.slice(),t=e.length;for(;t>0&&e[t-1].order>n.order;)t--;e.splice(t,0,n),Io=e}function g_(n){if(Ga=0,!de.running)return;Ga=requestAnimationFrame(g_);let e=_f<0?16.7:n-_f;_f=n,e>0||(e=0),e>f_&&(e=f_),de.now+=e,de.frame++;let t=Math.min(MC,e/1e3),i=de.now,r=Io;for(let s=0;s<r.length;s++){let o=r[s];if(!o.dead)try{o.fn(t,i)}catch(a){xt(`loop:${o.id}`,"frame callback threw and was removed",a),de.remove(o.id)}}}var de={running:!1,frame:0,now:0,add(n,e=Nt.UI){let t=bC++;return SC({id:t,fn:n,order:e,dead:!1}),t},remove(n){let e=Io.findIndex(i=>i.id===n);if(e<0)return;Io[e].dead=!0;let t=Io.slice();t.splice(e,1),Io=t},start(){de.running||(de.running=!0,_f=-1,typeof requestAnimationFrame=="function"&&(Ga=requestAnimationFrame(g_)))},stop(){de.running=!1,Ga&&typeof cancelAnimationFrame=="function"&&cancelAnimationFrame(Ga),Ga=0}},p_=!1,m_=!1;function wC(){let n=document.visibilityState==="hidden"||document.hidden===!0;if(n!==m_)if(m_=n,n){p_=de.running,de.stop();try{document.title=ee.night?"…сплю":"…ты где?"}catch{}try{Va()}catch(e){xt("loop:flush",e)}Se.emit("visibility",{hidden:!0})}else{try{document.title=Nc(ee.route)}catch{document.title="SAM.VIN"}p_&&de.start();try{Gn.say("tab.back",{},{force:!0})}catch(e){xt("loop:status",e)}Se.emit("visibility",{hidden:!1})}}typeof document<"u"&&document.addEventListener("visibilitychange",wC);var x_=yx,EC=1/120,$i=class n{constructor(e,t=1,i=0){this.omega=e,this.zeta=t,this.x=i,this.v=0,this.target=i}step(e){if(!(e>0))return this.x;let t=Math.min(16,Math.ceil(e/EC)),i=e/t,r=this.omega,s=r*r,o=2*this.zeta*r;for(let a=0;a<t;a++)this.v+=(s*(this.target-this.x)-o*this.v)*i,this.x+=this.v*i;return this.x}snap(e){this.x=e,this.target=e,this.v=0}settled(e=.001){return Math.abs(this.target-this.x)<e&&Math.abs(this.v)<e*10}static from(e,t=0){return new n(e.omega,e.zeta==null?1:e.zeta,t)}};var AC=typeof window<"u"&&typeof window.DeviceOrientationEvent<"u",Po=[],Mf=!1,Oc={alpha:0,beta:0,gamma:0,t:0};function v_(n){Oc.alpha=n.alpha||0,Oc.beta=n.beta||0,Oc.gamma=n.gamma||0,Oc.t=typeof performance<"u"?performance.now():Date.now();for(let e=0;e<Po.length;e++)try{Po[e](Oc)}catch{}}var TC={available:AC&&typeof window.DeviceOrientationEvent.requestPermission!="function",on(n){!TC.available||Po.includes(n)||(Po.push(n),Mf||(window.addEventListener("deviceorientation",v_),Mf=!0))},off(n){let e=Po.indexOf(n);e>=0&&Po.splice(e,1),Mf&&Po.length===0&&(window.removeEventListener("deviceorientation",v_),Mf=!1)}};var bf=null;function Ha(){return bf||(bf=new Promise(n=>{let e=!1,t=()=>{e||(e=!0,n())};setTimeout(t,2500);try{let i=typeof document<"u"?document.fonts:null;if(!i||typeof i.load!="function"){t();return}Promise.allSettled([i.load("700 64px Geologica","SAMVINСЭМ"),i.load("500 32px Martian","SAMVIN 0123")]).then(t,t)}catch{t()}}),bf)}function Sf(n){return Math.pow(10,n/20)}function Fc(n,e=440,t="sine"){let i=n.createOscillator();return i.type=t,i.frequency.value=e,i}function RC(n,{a:e=.005,d:t=.2,peak:i=1,t0:r=n.currentTime}={}){let s=n.createGain();return s.gain.setValueAtTime(0,r),s.gain.linearRampToValueAtTime(i,r+e),s.gain.exponentialRampToValueAtTime(Math.max(1e-5,i*1e-4),r+e+t),s}var y_=n=>bl(n)%600+300;function ft(n,e){let t=n.ctx,i=t.currentTime,r=Fc(t,y_(e)*Math.pow(2,(n.transpose||0)/12)),s=RC(t,{a:.004,d:.036,peak:Sf(-30),t0:i});r.connect(s).connect(n.bus.ui),r.start(i),r.stop(i+.06);let o={alive:!0,stop(){if(o.alive){o.alive=!1;try{r.stop()}catch{}}}};return r.onended=()=>{o.alive=!1},n.track(o,.06)}function vi(n,e,t){let i=n.ctx,r=y_(e),s=Fc(i,r),o=i.createGain();o.gain.value=0,s.connect(o).connect(n.bus.fx),s.start();let a={alive:!0,set(l){if(!a.alive||!l)return;let c=l.speed01!=null?l.speed01:l.amount!=null?l.amount:l.k!=null?l.k/5:l.d!=null?Math.min(1,l.d/12):1,u=Math.max(0,Math.min(1,c)),d=i.currentTime;o.gain.setTargetAtTime(Sf(-40)*(.25+.75*u),d,.03),s.frequency.setTargetAtTime(r*(1+.5*u),d,.03)},stop(l=200){if(!a.alive)return;a.alive=!1;let c=i.currentTime,u=Math.max(.008,l/1e3);o.gain.cancelScheduledValues(c),o.gain.setValueAtTime(o.gain.value,c),o.gain.linearRampToValueAtTime(0,c+u);try{s.stop(c+u+.02)}catch{}}};return a.set(t||{speed01:0}),n.track(a,3600)}var __=n=>ft(n,"signature"),M_=n=>ft(n,"ratchet"),b_=n=>ft(n,"owner");var S_=n=>ft(n,"hoverTick"),w_=n=>ft(n,"select"),E_=n=>ft(n,"tick"),A_=n=>ft(n,"stringPluck"),T_=n=>ft(n,"lockedThud"),R_=n=>ft(n,"chisel"),C_=n=>ft(n,"stratumNote"),I_=n=>ft(n,"memberNote"),P_=n=>ft(n,"workshopNode"),L_=n=>ft(n,"wordBell"),D_=n=>ft(n,"arrivalLock"),N_=n=>ft(n,"flinch");var O_=(n,e)=>vi(n,"whoosh",e),F_=n=>ft(n,"subDrop"),U_=n=>ft(n,"strutTick"),B_=n=>ft(n,"recallThud"),k_=(n,e)=>vi(n,"liftRumble",e),z_=n=>ft(n,"irisWhoosh"),V_=n=>ft(n,"bootSwell"),G_=n=>ft(n,"snapAir");var H_=n=>ft(n,"shard"),W_=(n,e)=>vi(n,"resRise",e),X_=(n,e)=>vi(n,"resSub",e),$_=n=>ft(n,"chunk"),Y_=n=>ft(n,"resChord"),q_=n=>ft(n,"hiss"),j_=(n,e)=>vi(n,"shepard",e),Z_=n=>ft(n,"whale"),K_=n=>ft(n,"dizzy"),J_=n=>ft(n,"chord"),Q_=n=>ft(n,"capsule"),eM=n=>ft(n,"companion"),tM=(n,e)=>vi(n,"zenithPad",e),nM=n=>ft(n,"invertRoll"),iM=n=>ft(n,"droneDodge");var rM=(n,e)=>vi(n,"probeHold",e),sM=n=>ft(n,"probeFlight"),oM=n=>ft(n,"probeReturn"),aM=(n,e)=>vi(n,"skyVoice",e),lM=(n,e)=>vi(n,"dialStatic",e),cM=(n,e)=>vi(n,"dialCarrier",e),uM=n=>ft(n,"beatLock"),hM=n=>ft(n,"vaultNote"),dM=(n,e)=>vi(n,"wind",e);var S0=Object.freeze({signature:__,ratchet:M_,owner:b_,hoverTick:S_,select:w_,tick:E_,stringPluck:A_,lockedThud:T_,chisel:R_,stratumNote:C_,memberNote:I_,workshopNode:P_,wordBell:L_,arrivalLock:D_,flinch:N_,whoosh:O_,subDrop:F_,strutTick:U_,recallThud:B_,liftRumble:k_,irisWhoosh:z_,bootSwell:V_,snapAir:G_,shard:H_,resRise:W_,resSub:X_,chunk:$_,resChord:Y_,hiss:q_,shepard:j_,whale:Z_,dizzy:K_,chord:J_,capsule:Q_,companion:eM,zenithPad:tM,invertRoll:nM,droneDodge:iM,probeHold:rM,probeFlight:sM,probeReturn:oM,skyVoice:aM,dialStatic:lM,dialCarrier:cM,beatLock:uM,vaultNote:hM,wind:dM}),fM=new Set(["whoosh","liftRumble","resRise","resSub","shepard","zenithPad","probeHold","skyVoice","dialStatic","dialCarrier","wind"]);function pM(n){let e=null,t=null,i={room:"CORE",root:146.83,night:!1,rank:0,duckDb:0,narrowU:0,start(){if(e)return;let r=n.ctx;t=r.createGain(),t.gain.value=0,t.gain.setTargetAtTime(Sf(-34),r.currentTime,.4),t.connect(n.bus.bed),e=[Fc(r,49),Fc(r,49.3)];for(let s of e)s.connect(t),s.start()},stop(){if(!e)return;let r=n.ctx,s=r.currentTime;t.gain.setTargetAtTime(0,s,.1);for(let o of e)try{o.stop(s+.6)}catch{}e=null},setRoom(r){i.room=r},setRootGlide(r,s,o){i.root=r*Math.pow(s/r,Math.max(0,Math.min(1,o)))},setNight(r){i.night=!!r},setRank(r){i.rank=r|0},duck(r,s){i.duckDb=r},narrow(r){i.narrowU=r},update(r){}};return i}var NC=Object.freeze({G2:98,A2:110,B2:123.47,D3:146.83,E3:164.81,G3:196,A3:220,B3:246.94,D4:293.66,E4:329.63,G4:392,A4:440,B4:493.88,D5:587.33,E5:659.25,G5:783.99,A5:880,B5:987.77,D6:1174.66,E6:1318.51,G6:1567.98,A6:1760,B6:1975.53,D7:2349.32}),oF=Object.freeze([392,440,493.88,587.33,659.25,783.99,880]),aF=Object.freeze(Object.fromEntries(Object.keys(oe).map(n=>[n,oe[n].root]))),lF=Object.freeze({S01:"G4",S02:"A4",S03:"B4",S04:"D5",S05:"E5",S06:"G5",S07:"A5",S08:"B5",S09:"D6",S10:"E6",S11:"G6",S12:"A6",S13:"B6",S14:"D7"});function mM(n){let e=NC[n];return e??440}var OC=Math.pow(10,-6/20),w0=Object.freeze({set(){},stop(){},alive:!1}),Lo=[],E0=new Uint8Array(32),A0=null,Lt=null,Bc=null,Wa=null,as=null,Uc=null,kc=null,zs=!1,zc=0,ls={ctx:null,bus:{ui:null,fx:null,room:null,bed:null},transpose:0,night:!1,hz:mM,get irLong(){return!A0&&Lt&&(A0=xM(6)),A0},send(n){let e=Lt.createGain();return e.gain.value=n,e.connect(Uc),e},track(n,e){if(!n)return n;let t=Lt?Lt.currentTime:0;for(let i=Lo.length-1;i>=0;i--)(!Lo[i].v.alive||Lo[i].end<t)&&Lo.splice(i,1);for(Lo.push({v:n,end:t+(e||1)});Lo.length>24;){let i=Lo.shift();try{i.v.stop(8)}catch{}}return n}};function xM(n){let e=Lt.sampleRate,t=Math.floor(e*n),i=Lt.createBuffer(2,t,e),r=Math.exp(-2*Math.PI*120/e),s=Math.exp(-6.9/(n*e));for(let o=0;o<2;o++){let a=i.getChannelData(o),l=0,c=0,u=1;for(let d=0;d<t;d++){let h=(Math.random()*2-1)*u;u*=s,c=r*(c+h-l),l=h,a[d]=c}}return i}function wf(n,e,t){let i=Lt.currentTime;n.cancelScheduledValues(i),n.setValueAtTime(n.value,i),n.linearRampToValueAtTime(e,i+t/1e3)}function gM(){Lt&&(wf(Bc.gain,0,400),clearTimeout(zc),zc=setTimeout(()=>{zc=0,Lt&&(zs||!je.on)&&Lt.suspend().catch(()=>{})},420))}function T0(){!Lt||!je.on||zs||(clearTimeout(zc),zc=0,Lt.resume().catch(()=>{}),wf(Bc.gain,OC,400))}function FC(){as=Lt.createDynamicsCompressor(),as.threshold.value=-18,as.ratio.value=3,as.attack.value=.003,as.release.value=.25,Bc=Lt.createGain(),Bc.gain.value=0,Wa=Lt.createAnalyser(),Wa.fftSize=64,Wa.smoothingTimeConstant=.6,as.connect(Bc).connect(Wa).connect(Lt.destination),Uc=Lt.createConvolver(),Uc.buffer=xM(3.4),Uc.connect(as),kc={};for(let n of["ui","fx","room"]){let e=Lt.createGain();e.connect(as);let t=Lt.createGain();t.gain.value=n==="ui"?.11:.22,e.connect(t).connect(Uc),ls.bus[n]=e,kc[n]=t}ls.bus.bed=Lt.createGain(),ls.bus.bed.connect(as),ls.ctx=Lt}var je={ctx:null,unlocked:!1,on:!0,bed:null,init(n){return je.on=!(W.data&&W.data.sound==="off"),ee.soundOn=je.on,Se.on("visibility",e=>{zs=!!e.hidden,zs?gM():T0()}),Se.on("room:arrive",e=>je.setRoom(e.room)),je},unlock(){if(je.unlocked)return;let n=window.AudioContext||window.webkitAudioContext;if(n)try{Lt=new n;try{navigator.audioSession&&(navigator.audioSession.type="playback")}catch{}FC(),je.ctx=Lt,je.unlocked=!0;try{je.bed=pM(ls)}catch(e){xt("audio:bed",e)}je.setRoom(ee.room||"CORE"),je.setNight(ee.night),je.on?(je.bed&&je.bed.start(),T0()):Lt.suspend().catch(()=>{}),de.add(e=>{je.bed&&je.on&&je.bed.update(e)},Nt.FX),Se.emit("audio:unlocked",{})}catch(e){xt("audio:unlock","audio unavailable",e)}},resume(){Lt&&je.on&&!zs&&Lt.state!=="running"&&Lt.resume().catch(()=>{})},isOn(){return je.on},setOn(n){let e=!!n;e!==je.on&&(je.on=e,ee.soundOn=e,W.set("sound",e?"on":"off"),Lt&&(e?(je.bed&&je.bed.start(),T0()):(gM(),je.bed&&setTimeout(()=>{!je.on&&je.bed&&je.bed.stop()},400))),Se.emit("sound:change",{on:e}))},toggle(){je.setOn(!je.on)},play(n,e={}){if(!Lt||!je.on||zs)return null;let t=S0[n];if(!t)return null;try{return t(ls,e||{})||null}catch(i){return xt(`audio:${n}`,"recipe failed",n,i),null}},start(n,e={}){if(!Lt||!je.on||zs||!fM.has(n))return w0;try{return S0[n](ls,e||{})||w0}catch(t){return xt(`audio:${n}`,"recipe failed",n,t),w0}},setRoom(n){let e=oe[n];!e||!Lt||(kc&&(wf(kc.room.gain,e.wet,300),wf(kc.fx.gain,e.wet,300)),je.bed&&(je.bed.setRoom(n),je.bed.duck(n==="INSIGNIA"?-60:0,960)))},setRootU(n,e,t){if(!je.bed)return;let i=oe[n],r=oe[e];i&&r&&je.bed.setRootGlide(i.root,r.root,t)},setNight(n){ls.night=!!n,je.bed&&je.bed.setNight(!!n)},setRank(n){je.bed&&je.bed.setRank(n|0)},setInverted(n){ls.transpose=n?-5:0},levels(n){if(n){if(!Wa||!je.on||zs){n.fill(0);return}Wa.getByteFrequencyData(E0);for(let e=0;e<8;e++){let t=E0[e*2]+E0[e*2+1];n[e]=Math.min(1,t/510*1.6)}}},now(){return Lt?Lt.currentTime:0}};var Ir=Object.freeze({tap:8,tick:6,stratum:7,lock:14,step:20,activation:[8,40,8,40,14,90,30],shard:[8,40,8,40,60],locked:[10,30,10]}),UC=6,R0=0;function vM(n,e){let t=document.getElementById("fx");if(!t||R0>=UC)return;let i=document.createElement("div");i.className="ripple",i.style.transform=`translate3d(${n}px, ${e}px, 0)`,Jt.reducedMotion&&i.classList.add("ripple--still"),R0++;let r=()=>{R0--,i.remove()};i.addEventListener("animationend",r,{once:!0}),setTimeout(()=>{i.isConnected&&r()},600),t.appendChild(i)}function Pr(n){try{if(typeof navigator>"u"||typeof navigator.vibrate!="function")return;let e=navigator.userActivation;if(e&&!e.hasBeenActive)return;navigator.vibrate(n)}catch{}}var yi=Object.freeze({TAP_MS:350,HOLD_MS:350,LONG_MS:800,SLOP_PX:8,SWIPE_PX:40,SWIPE_V:.3}),BC=60,Lr=[],Do=null,Xa=[],Vc=[],$a=null,ce={type:"down",x:0,y:0,dx:0,dy:0,tx:0,ty:0,vx:0,vy:0,speed:0,t:0,id:0,pointerType:"mouse",button:0,scale:1,dScale:1,deltaY:0,dir:null,afterHold:!1,shift:!1,alt:!1},cs={x:0,y:0,vx:0,vy:0,speed:0,type:"mouse",buttons:0,t:0},Re={active:!1,id:-1,type:"mouse",x0:0,y0:0,t0:0,lastX:0,lastY:0,lastT:0,dragging:!1,holdFired:!1,longFired:!1,pinch:!1,moved:0,button:0},Gc=0,Hc=0,Yi=new Map,bM=0,C0=0,Ya=()=>typeof performance<"u"?performance.now():Date.now();function Sn(n,e){if(ce.type=n,e&&(ce.shift=!!e.shiftKey,ce.alt=!!e.altKey),n!=="swipe"&&(ce.dir=null),Do){try{Do.onGesture(ce)}catch(t){xt(`input:${Do.name}`,"captured consumer threw",t)}return}for(let t=Lr.length-1;t>=0;t--){let i=Lr[t],r=!1;try{r=!!i.onGesture(ce)}catch(s){xt(`input:${i.name}`,"consumer threw",s)}if(r)return}}function us(n,e,t){ce.x=e,ce.y=t,ce.id=n.pointerId,ce.pointerType=n.pointerType||"mouse",ce.button=n.button|0,ce.scale=1,ce.dScale=1,ce.deltaY=0}function Rf(){Gc&&(clearTimeout(Gc),Gc=0),Hc&&(clearTimeout(Hc),Hc=0)}function kC(n){let e=dn.pointer,t=Ya(),i=Math.max(1,t-(e._t||t-16)),r=(n.clientX-e.x)/i,s=(n.clientY-e.y)/i,o=1-Math.exp(-i/BC);e.x>-9e3&&(e.vx+=(r-e.vx)*o,e.vy+=(s-e.vy)*o),e._t=t,e.x=n.clientX,e.y=n.clientY,e.speed=Math.hypot(e.vx,e.vy)*1e3,e.type=n.pointerType||"mouse",e.lastMove=de.now,e.inside=!0}function zC(n){if(!Xa.length)return;let e=dn.pointer;cs.x=e.x,cs.y=e.y,cs.vx=e.vx,cs.vy=e.vy,cs.speed=e.speed,cs.type=e.type,cs.buttons=n.buttons|0,cs.t=de.now;for(let t=0;t<Xa.length;t++)try{Xa[t](cs)}catch(i){xt("input:observer","observer threw",i)}}function VC(n){if(n.pointerType==="touch"){if(Yi.set(n.pointerId,{x:n.clientX,y:n.clientY}),vM(n.clientX,n.clientY),Pr(Ir.tap),Yi.size===2&&Re.active){GC(n);return}if(Yi.size>2)return}if(Re.active)return;try{n.currentTarget.setPointerCapture(n.pointerId)}catch{}let e=Ya(),t=dn.pointer;t.x=n.clientX,t.y=n.clientY,t.vx=0,t.vy=0,t.speed=0,t._t=e,t.type=n.pointerType||"mouse",t.lastMove=de.now,t.inside=!0,Re.active=!0,Re.id=n.pointerId,Re.type=n.pointerType||"mouse",Re.x0=Re.lastX=n.clientX,Re.y0=Re.lastY=n.clientY,Re.t0=Re.lastT=e,Re.dragging=!1,Re.holdFired=!1,Re.longFired=!1,Re.pinch=!1,Re.moved=0,Re.button=n.button|0,dn.pointer.down=!0,us(n,n.clientX,n.clientY),ce.dx=0,ce.dy=0,ce.tx=0,ce.ty=0,ce.vx=0,ce.vy=0,ce.speed=0,ce.t=0,ce.afterHold=!1,Sn("down",n),Rf(),Gc=setTimeout(()=>{Gc=0,!(!Re.active||Re.dragging||Re.pinch)&&(Re.holdFired=!0,yM(),Sn("hold",null),Hc=setTimeout(()=>{Hc=0,!(!Re.active||Re.dragging||Re.pinch)&&(Re.longFired=!0,yM(),Sn("longpress",null))},yi.LONG_MS-yi.HOLD_MS))},yi.HOLD_MS)}function yM(){ce.x=Re.lastX,ce.y=Re.lastY,ce.dx=0,ce.dy=0,ce.tx=Re.lastX-Re.x0,ce.ty=Re.lastY-Re.y0,ce.vx=0,ce.vy=0,ce.speed=0,ce.t=Ya()-Re.t0,ce.id=Re.id,ce.pointerType=Re.type,ce.button=Re.button,ce.scale=1,ce.dScale=1,ce.deltaY=0,ce.afterHold=!0}function GC(n){Rf(),Re.dragging&&(ce.t=Ya()-Re.t0,Sn("dragend",n)),Re.pinch=!0,Re.dragging=!1,SM(),bM=C0=Math.max(1,Math.hypot(hn.ax-hn.bx,hn.ay-hn.by)),us(n,(hn.ax+hn.bx)/2,(hn.ay+hn.by)/2),ce.scale=1,ce.dScale=1,Sn("pinchstart",n)}var hn={ax:0,ay:0,bx:0,by:0,i:0};function HC(n){hn.i===0?(hn.ax=n.x,hn.ay=n.y):hn.i===1&&(hn.bx=n.x,hn.by=n.y),hn.i++}function SM(){hn.i=0,Yi.forEach(HC)}var I0=null,Tf=null,Ef=!1;function WC(n){return!!n&&(n===I0||Tf!==null&&Tf.contains(n))}function XC(n){if(kC(n),zC(n),n.pointerType==="touch"&&Yi.has(n.pointerId)){let t=Yi.get(n.pointerId);t.x=n.clientX,t.y=n.clientY}if(Re.pinch){if(Yi.size<2)return;SM();let t=Math.max(1,Math.hypot(hn.ax-hn.bx,hn.ay-hn.by));us(n,(hn.ax+hn.bx)/2,(hn.ay+hn.by)/2),ce.scale=t/bM,ce.dScale=t/C0,C0=t,Sn("pinch",n);return}if(!Re.active||n.pointerId!==Re.id){if(!Re.active&&(n.pointerType||"mouse")==="mouse"&&(n.buttons|0)===0){if(!WC(n.target)){Ef&&(Ef=!1,us(n,n.clientX,n.clientY),Sn("leave",n));return}Ef=!0,us(n,n.clientX,n.clientY),ce.dx=n.movementX||0,ce.dy=n.movementY||0,ce.tx=0,ce.ty=0,ce.vx=dn.pointer.vx,ce.vy=dn.pointer.vy,ce.speed=dn.pointer.speed,ce.t=0,ce.afterHold=!1,Sn("hover",n)}return}let e=Ya();us(n,n.clientX,n.clientY),ce.dx=n.clientX-Re.lastX,ce.dy=n.clientY-Re.lastY,ce.tx=n.clientX-Re.x0,ce.ty=n.clientY-Re.y0,ce.vx=dn.pointer.vx,ce.vy=dn.pointer.vy,ce.speed=dn.pointer.speed,ce.t=e-Re.t0,ce.afterHold=Re.holdFired,Re.lastX=n.clientX,Re.lastY=n.clientY,Re.lastT=e,Re.moved=Math.max(Re.moved,Math.hypot(ce.tx,ce.ty)),Re.dragging?Sn("drag",n):Re.moved>=yi.SLOP_PX?(Re.dragging=!0,Rf(),Sn("dragstart",n),Sn("drag",n)):Sn("move",n)}function P0(n,e){let t=Ya();Rf(),dn.pointer.down=!1;try{n.currentTarget&&n.currentTarget.hasPointerCapture&&n.currentTarget.hasPointerCapture(n.pointerId)&&n.currentTarget.releasePointerCapture(n.pointerId)}catch{}us(n,n.clientX,n.clientY),ce.dx=n.clientX-Re.lastX,ce.dy=n.clientY-Re.lastY,ce.tx=n.clientX-Re.x0,ce.ty=n.clientY-Re.y0,ce.vx=dn.pointer.vx,ce.vy=dn.pointer.vy,ce.speed=dn.pointer.speed,ce.t=t-Re.t0,ce.afterHold=Re.holdFired;let i=Re.dragging,r=Re.pinch;if(Re.active=!1,Re.dragging=!1,Re.pinch=!1,e){Sn("cancel",n),Af();return}if(r){Sn("pinchend",n),Af();return}if(Sn("up",n),i){Sn("dragend",n);let s=Math.hypot(ce.tx,ce.ty),o=Math.hypot(ce.vx,ce.vy);s>=yi.SWIPE_PX&&o>=yi.SWIPE_V&&(ce.dir=Math.abs(ce.tx)>=Math.abs(ce.ty)?ce.tx>0?"right":"left":ce.ty>0?"down":"up",Sn("swipe",n))}else!Re.holdFired&&ce.t<yi.TAP_MS&&Re.moved<yi.SLOP_PX&&Sn("tap",n);Af()}function Af(){Do=null}function $C(n){if(n.pointerType==="touch"){Yi.delete(n.pointerId);try{je.resume()}catch{}if(Re.pinch){Yi.size<2&&Re.active&&(Yi.size===0||n.pointerId===Re.id?P0(n,!1):(us(n,n.clientX,n.clientY),Sn("pinchend",n),Re.pinch=!1,Re.active=!1,dn.pointer.down=!1,Af()));return}}!Re.active||n.pointerId!==Re.id||P0(n,!1)}function YC(n){n.pointerType==="touch"&&Yi.delete(n.pointerId),Re.active&&(n.pointerId!==Re.id&&!Re.pinch||(Yi.clear(),P0(n,!0)))}function qC(n){n.preventDefault();let e=n.deltaY;n.deltaMode===1?e*=16:n.deltaMode===2&&(e*=fe.h||800),ce.x=n.clientX,ce.y=n.clientY,ce.dx=0,ce.dy=0,ce.tx=0,ce.ty=0,ce.vx=0,ce.vy=0,ce.speed=0,ce.t=0,ce.id=0,ce.pointerType="mouse",ce.button=0,ce.scale=1,ce.dScale=1,ce.deltaY=e,ce.afterHold=!1,Sn("wheel",n)}function jC(n){n.relatedTarget||(dn.pointer.inside=!1,Ef=!1,us(n,n.clientX,n.clientY),Sn("leave",n))}function _M(n){!n||n.__samvinInput||(n.__samvinInput=!0,n.addEventListener("pointerdown",VC),n.addEventListener("pointerup",$C),n.addEventListener("pointercancel",YC),n.addEventListener("wheel",qC,{passive:!1}),n.addEventListener("contextmenu",e=>e.preventDefault()))}var MM={name:"hall",onGesture(n){let e=$a&&$a.halls;if(!e||typeof e.current!="function")return!1;let t=e.current();return t?!!e.call(t.id,"onGesture",n):!1}},ZC={name:"director",onGesture(n){let e=$a&&$a.director;if(!e||typeof e.busy!="function"||!e.busy())return!1;let t=e.state,i=$a.halls;return t&&t.u>=.7&&t.to&&i&&typeof i.call=="function"&&i.call(t.to.room,"onGesture",n)||n.type==="tap"&&typeof e.speedUp=="function"&&e.speedUp(),!0}},dn={pointer:{x:-9999,y:-9999,vx:0,vy:0,speed:0,type:"mouse",down:!1,lastMove:0,inside:!1},init(n){$a=n,I0=document.getElementById("gl"),Tf=document.getElementById("t0"),_M(I0),_M(Tf),window.addEventListener("pointermove",XC,{passive:!0}),document.addEventListener("pointerout",jC);let e=()=>{try{je.unlock()}catch(t){xt("input:unlock",t)}};window.addEventListener("pointerdown",e,{capture:!0,passive:!0}),window.addEventListener("touchend",()=>{try{je.resume()}catch{}},{passive:!0}),window.addEventListener("keydown",t=>{e();let i=t.target;if(!(i&&(i.isContentEditable||/^(INPUT|TEXTAREA|SELECT)$/.test(i.tagName||""))))for(let r=0;r<Vc.length;r++)try{Vc[r](t)}catch(s){xt("input:keyobserver","key observer threw",s)}},{capture:!0}),Lr.includes(MM)||(Lr.unshift(ZC),Lr.unshift(MM))},push(n){return Lr.push(n),()=>{let e=Lr.indexOf(n);e>=0&&Lr.splice(e,1)}},offerKey(n){for(let e=Lr.length-1;e>=0;e--){let t=Lr[e];if(typeof t.onKey=="function")try{if(t.onKey(n))return!0}catch(i){xt(`input:${t.name}:key`,"key consumer threw",i)}}return!1},capture(n){Do=n},release(n){(!n||Do===n)&&(Do=null)},observe(n){return Xa.push(n),()=>{let e=Xa.indexOf(n);e>=0&&Xa.splice(e,1)}},observeKeys(n){return Vc.push(n),()=>{let e=Vc.indexOf(n);e>=0&&Vc.splice(e,1)}}};function wM(n,e,t){yt.enabled=!1;let i=ti[t]||ti.T2,r=new Kd({canvas:n,context:e||void 0,antialias:!!i.msaa,alpha:!0,premultipliedAlpha:!0,depth:!0,stencil:!1,powerPreference:"high-performance",preserveDrawingBuffer:!1});r.outputColorSpace=xo,r.toneMapping=Ri,r.setClearColor(0,0),r.info.autoReset=!1,r.autoClear=!0;let s=new jr;s.background=null,s.matrixWorldAutoUpdate=!0;let o=new jn(Ze.fov,Math.max(1,fe.w)/Math.max(1,fe.h),.01,1e3);o.position.set(0,.75,7.2);let a=i.dprCap,l=0,c={three:r,scene:s,camera:o,tier:t,dpr:1,stats:{calls:0,triangles:0,points:0,geometries:0,textures:0,frameMs:0,fps:0},setDprDrop(d){l=Math.max(0,d|0),c.resize()},setTier(d){c.tier=d,a=(ti[d]||i).dprCap,c.resize()},resize(){let d=typeof devicePixelRatio=="number"&&devicePixelRatio>0?devicePixelRatio:1;c.dpr=Math.max(1,Math.min(d,a)-Qt.dprStep*l);let h=Math.max(1,fe.w),f=Math.max(1,fe.h);r.setPixelRatio(c.dpr),r.setSize(h,f,!1),o.aspect=h/f,o.updateProjectionMatrix(),pe.uPixelRatio.value=c.dpr,pe.uResolution.value.set(Math.round(h*c.dpr),Math.round(f*c.dpr));for(let g of u)g(c)},onResize(d){return u.add(d),()=>u.delete(d)},lost:!1},u=new Set;return n.addEventListener("webglcontextlost",d=>{d.preventDefault(),c.lost=!0,de.stop(),Se.emit("gl:lost",{})},!1),n.addEventListener("webglcontextrestored",()=>{c.lost=!1,c.resize(),Se.emit("gl:restored",{}),de.start()},!1),Se.on("layout:change",()=>c.resize()),c.resize(),c}var KC=`
varying vec2 vUv;
void main() { vUv = position.xy * 0.5 + 0.5; gl_Position = vec4(position.xy, 0.0, 1.0); }`,EM=`
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
}`,AM=`
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
}`;function L0(){let n=new xn;return n.setAttribute("position",new sn(new Float32Array([-1,-1,0,3,-1,0,-1,3,0]),3)),n}function TM(n,e=Qt.r6.levels){let t=n.three||n,i=L0(),r=new jr,s=new es(-1,1,1,-1,0,1),o=(A,T,R)=>new Pt({uniforms:{tSrc:{value:null},uHalf:{value:new it},uThreshold:{value:Qt.r6.threshold},tAdd:{value:null},uAddGain:{value:1}},defines:Object.assign(T?{USE_THRESHOLD:""}:{},R?{USE_ADD:""}:{}),vertexShader:KC,fragmentShader:A,depthTest:!1,depthWrite:!1,blending:gi}),a=o(EM,!0),l=o(EM,!1),c=o(AM,!1,!0),u=o(AM,!1,!1),d=new Vt(i,l);d.frustumCulled=!1,r.add(d);let h={type:Kn,format:Hn,minFilter:At,magFilter:At,depthBuffer:!1},f=[],g=[],y=0,m=0,p=A=>A.width*A.height*8;function b(A,T){S(),y=A,m=T;let R=A,x=T;for(let w=0;w<e;w++){R=Math.max(1,R>>1),x=Math.max(1,x>>1);let I=new Tn(R,x,h);Wi(I.texture,p(I)),f.push(I)}for(let w=0;w<e;w++){let I=w===0?{width:A,height:T}:f[w-1],D=new Tn(I.width,I.height,h);Wi(D.texture,p(D)),g.push(D)}}function S(){for(let A of f.concat(g))Mc(A.texture),A.dispose();f.length=0,g.length=0}function _(A,T,R,x,w){d.material=A,A.uniforms.tSrc.value=T,A.uniforms.uHalf.value.set(.5/R,.5/x),t.setRenderTarget(w),t.render(r,s)}return{render(A){if(!f.length)return null;let T=A,R=y,x=m;for(let w=0;w<e;w++)_(w===0?a:l,T,R,x,f[w]),T=f[w].texture,R=f[w].width,x=f[w].height;for(let w=e-1;w>=0;w--){let I=w>0?c:u;w>0&&(I.uniforms.tAdd.value=f[w-1].texture),_(I,T,R,x,g[w]),T=g[w].texture,R=g[w].width,x=g[w].height}return g[0].texture},resize(A,T){(A!==y||T!==m)&&b(Math.max(2,A|0),Math.max(2,T|0))},dispose(){S(),i.dispose(),a.dispose(),l.dispose(),c.dispose(),u.dispose()}}}var qa=Qt.r7,RM="void main() { gl_Position = vec4(position.xy, 0.0, 1.0); }",CM=`
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
  g *= smoothstep(${qa.clearInPx.toFixed(1)}, ${qa.clearOutPx.toFixed(1)}, distance(css, uPointer));
  float aspect = uRes.x / uRes.y;
  vec2 c = (uv * 2.0 - 1.0) * vec2(aspect, 1.0);
  float v = uVig * smoothstep(${qa.vignetteFrom.toFixed(2)}, 1.0, length(c) / length(vec2(aspect, 1.0)));
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
}`,Cf=120;function IM(n){let e=n.three,t=n.scene,i=n.camera,r=new jr,s=new es(-1,1,1,-1,0,1),o={uRes:{value:new it(1,1)},uPR:{value:1},uGrain:{value:qa.grainBoot},uSeed:{value:0},uVig:{value:qa.vignette},uPointer:{value:new it(-9999,-9999)},tScene:{value:null},tBloom:{value:null},uBloom:{value:1}},a=new Pt({uniforms:o,vertexShader:RM,fragmentShader:CM,depthTest:!1,depthWrite:!1,transparent:!0,blending:rd,blendEquation:ts,blendSrc:cc,blendDst:Aa,blendSrcAlpha:cc,blendDstAlpha:Aa}),l=new Pt({uniforms:o,defines:{USE_SCENE:""},vertexShader:RM,fragmentShader:CM,depthTest:!1,depthWrite:!1,blending:gi}),c=new Vt(L0(),a);c.frustumCulled=!1,r.add(c);let u=n.tier,d=null,h=null,f=null,g=[],y=!0;function m(){d&&(Mc(d.texture),d.dispose(),d=null),h&&(Mc(h.texture),h.dispose(),h=null),f&&(f.dispose(),f=null)}function p(){if(u!=="T3"){m();return}let D=o.uRes.value.x,F=o.uRes.value.y;d?(d.setSize(D,F),h.setSize(Math.max(2,D>>1),Math.max(2,F>>1))):(d=new Tn(D,F,{type:Kn,format:Hn,samples:4,depthBuffer:!0,minFilter:At,magFilter:At}),h=new Tn(Math.max(2,D>>1),Math.max(2,F>>1),{type:Kn,format:Hn,depthBuffer:!0,minFilter:At,magFilter:At}),f=TM(n,Qt.r6.levels)),Wi(d.texture,D*F*8*5),Wi(h.texture,h.width*h.height*8),f.resize(h.width,h.height)}function b(){let D=e.getDrawingBufferSize(new it);o.uRes.value.copy(D),o.uPR.value=n.dpr,p()}n.onResize(b),b();let S=new Float32Array(Cf),_=new Float32Array(Cf),A=0,T=0,R=-1,x=1<<Qn.DEFAULT|1<<Qn.NOFOG,w=1<<Qn.EMISSIVE,I={render(D){if(n.lost)return;o.uSeed.value=Jt.reducedMotion?7:Math.floor(de.now/(1e3/qa.grainFps))%997;let F=dn.pointer,z=F.x<-9e3||F.inside===!1||F.type==="touch"&&!F.down;o.uPointer.value.set(z?-9999:F.x,z?-9999:F.y),e.info.reset(),e.autoClear=!1,u==="T3"&&d?(i.layers.mask=x,e.setRenderTarget(d),e.setClearColor(0,0),e.clear(!0,!0,!1),e.render(t,i),n.stats.points=e.info.render.points,i.layers.mask=w,e.setRenderTarget(h),e.clear(!0,!0,!1),pe.uEmissivePass.value=1,e.render(t,i),pe.uEmissivePass.value=0,i.layers.mask=x,o.tBloom.value=f.render(h.texture),o.tScene.value=d.texture,c.material=l,e.setRenderTarget(null),e.render(r,s)):(i.layers.mask=x,e.setRenderTarget(null),e.setClearColor(0,0),e.clear(!0,!0,!1),e.render(t,i),n.stats.points=e.info.render.points,c.material=a,e.render(r,s));let N=n.stats,V=e.info;N.calls=V.render.calls,N.triangles=V.render.triangles,N.geometries=V.memory.geometries,N.textures=V.memory.textures;let K=de.now;if(R>=0&&(S[T]=K-R,T=(T+1)%Cf,A<Cf&&A++,(de.frame&15)===0&&A>0)){for(let J=0;J<A;J++)_[J]=S[J];let $=_.subarray(0,A);$.sort(),N.frameMs=$[A>>1],N.fps=N.frameMs>0?1e3/N.frameMs:0}if(R=K,y){y=!1;let $=document.getElementById("ff-grain");$&&$.parentNode&&$.parentNode.removeChild($);for(let J of g)try{J()}catch{}g.length=0}},setGrain(D){o.uGrain.value=Math.max(0,+D||0)},setTier(D){u=D,p()},onFirstFrame(D){if(y)g.push(D);else try{D()}catch{}},get tier(){return u},uniforms:o};return Se.on("tier:change",({tier:D})=>I.setTier(D)),I}var Dr=[0,0,0],ja=null;function D0(n){for(let e=0;e<xl.length;e++){let t=xl[e];Du(t,n,Dr),pe[ef(t)].value.setRGB(Dr[0],Dr[1],Dr[2])}}function PM(n){let e="#";for(let t=0;t<3;t++)e+=Math.round(n[t]*255).toString(16).padStart(2,"0").toUpperCase();return e}function JC(n){if(typeof document>"u")return;let e=document.documentElement.style;for(let t=0;t<xl.length;t++){let i=xl[t];if(n<=0){e.removeProperty(vl[i]),e.removeProperty(vl[i]+"-rgb");continue}Du(i,n,Dr),e.setProperty(vl[i],PM(Dr)),e.setProperty(vl[i]+"-rgb",`${Math.round(Dr[0]*255)},${Math.round(Dr[1]*255)},${Math.round(Dr[2]*255)}`)}}var Vs={mode:{night:!1,inverted:0},init(){D0(Vs.mode.inverted)},setNight(n){let e=!!n;if(typeof document<"u"&&(e?document.documentElement.setAttribute("data-night",""):document.documentElement.removeAttribute("data-night")),e===Vs.mode.night&&!ja){pe.uNight.value=e?1:0;return}Vs.mode.night=e,ja&&ja.cancel();let t=pe.uNight.value,i=e?1:0;ja=Fn(kr.mixMs,r=>{pe.uNight.value=t+(i-t)*r}),ja.done.then(()=>{ja=null})},setInverted(n){let e=Math.max(0,Math.min(1,+n||0));Vs.mode.inverted=e,pe.uInvert.value=e,D0(e),JC(e),typeof document<"u"&&(e>=.5?document.documentElement.setAttribute("data-inverted",""):document.documentElement.removeAttribute("data-inverted"))},color(n){return(pe[ef(n)]||pe.cSilver).value},hex(n){return Yo[n]?PM(Du(n,Vs.mode.inverted,Dr)):Yo.silver}};D0(0);var QC=Math.PI/180,e2=.08,If=new C,Pf=new C,cr=new C,N0=new C,LM=new C,O0=new it,Lf=!1,DM=new Map,F0=[],Nr={until:0,ms:0,amp:0,off:new C},Ie={camera:null,pose:{pos:new C(0,.75,7.2),target:new C(0,0,0),fov:Ze.fov,offsetY:0,roll:0},velocity:new C,init(n){return Ie.camera=n,Lf=!1,Ie},setPose(n){n&&(n.pos&&Ie.pose.pos.copy(n.pos),n.target&&Ie.pose.target.copy(n.target),Ie.pose.fov=n.fov!=null?n.fov:Ze.fov,Ie.pose.offsetY=n.offsetY||0,Ie.pose.roll=n.roll||0)},setOffset(n,e,t=0){let i=DM.get(n);if(!e&&!t){i&&(i.on=!1);return}i||(i={pos:new C,fov:0,on:!0},DM.set(n,i),F0.push(i)),e?i.pos.copy(e):i.pos.set(0,0,0),i.fov=t,i.on=!0},tremble(n=1,e=120){Jt.reducedMotion||(Nr.amp=n,Nr.ms=e,Nr.until=de.now+e)},apply(n=1/60){let e=Ie.camera;if(!e)return;let t=Ie.pose;If.set(0,0,0);let i=t.fov;for(let l=0;l<F0.length;l++){let c=F0[l];c.on&&(If.add(c.pos),i+=c.fov)}let r=Math.max(1e-6,Pf.copy(t.target).sub(t.pos).length());if(Nr.until>de.now&&Nr.ms>0){let l=(Nr.until-de.now)/Nr.ms,c=Nr.amp*l*r/Math.max(1e-6,pe.uPxPerUnit.value);Nr.off.set((Math.random()*2-1)*c,(Math.random()*2-1)*c,0).applyQuaternion(e.quaternion),If.add(Nr.off)}e.position.copy(t.pos).add(If),Pf.copy(t.target).sub(e.position);let s=Pf.length();s>1e-9&&Math.abs(Pf.y/s)>.999?e.up.set(0,0,-1):e.up.set(0,1,0),e.lookAt(t.target),t.roll&&e.rotateZ(t.roll),e.fov=i;let o=Math.max(1,fe.w),a=Math.max(1,fe.h);e.aspect=o/a,t.offsetY?e.setViewOffset(o,a,0,-t.offsetY*a,o,a):e.view&&e.view.enabled&&e.clearViewOffset(),Xe.focus.copy(t.target),Xe.fitClip(e),e.updateProjectionMatrix(),e.updateMatrixWorld(),pe.uCamPos.value.copy(e.position),pe.uPxPerUnit.value=a/(2*Math.tan(i*QC/2)),Lf&&n>0&&(LM.copy(e.position).sub(N0).multiplyScalar(1/n),Ie.velocity.lerp(LM,1-Math.exp(-n/e2))),N0.copy(e.position),Lf=!0},project(n,e){let t=Ie.camera;return t?(cr.copy(n).applyMatrix4(t.matrixWorldInverse),e.depth=-cr.z,cr.applyMatrix4(t.projectionMatrix),e.x=(cr.x+1)*.5*fe.w,e.y=(1-cr.y)*.5*fe.h,e.visible=e.depth>0&&cr.x>=-1&&cr.x<=1&&cr.y>=-1&&cr.y<=1,e):(e.x=-9999,e.y=-9999,e.depth=0,e.visible=!1,e)},unproject(n,e,t,i){let r=Ie.camera;if(!r)return i.set(0,0,0);Ie.ray(n,e,Df),cr.set(0,0,-1).transformDirection(r.matrixWorld);let s=Math.max(1e-6,Df.direction.dot(cr));return i.copy(Df.origin).addScaledVector(Df.direction,t/s)},ray(n,e,t){let i=Ie.camera;return O0.set(n/Math.max(1,fe.w)*2-1,-(e/Math.max(1,fe.h))*2+1),t.origin.setFromMatrixPosition(i.matrixWorld),t.direction.set(O0.x,O0.y,.5).unproject(i).sub(t.origin).normalize(),t},remapHistory(n){Lf&&n(N0)}},Df=new Kr;var Nf=[-1,0,1,2],Gs=new Map,No=new Map,t2=new Map,U0=[],B0=new Map,Wn=new Map([[-1,0],[0,1],[1,1],[2,0]]),Or={grow:[],shrink:[]},n2=new C,Wc=null,NM=-1;function Of(n){let e=Wn.get(n),t=No.get(n);t&&t.setFade(n===-1&&Xc?1:e);let i=Gs.get(n);i&&n!==0&&(i.visible=e>0||n===-1&&Xc),n===0&&Wc&&Wc.key&&Wc.key.group&&(Wc.key.group.visible=e>0)}var Xc=!1,vn={init(n){Wc=n;let e=Xe.root;for(let r of Nf){let s=new jt;s.name=`nest:${r}`,s.scale.setScalar(Math.pow(1e3,r)),e.add(s),Gs.set(r,s)}let t=(st.params||ti.T2).lattice;for(let r of[1,2]){let s=Cc({perStratum:!1,latticeDensity:r===1?t:.5,hallLod:r===1,far:oe.CORE.far});Gs.get(r).add(s.group),No.set(r,s);let o=xf({scale:Math.pow(1e3,r)});o.setCount(W.litNodes),Gs.get(r).add(o.object),B0.set(r,o)}let i=Cc({perStratum:!1,lattice:!1,far:1});Gs.get(-1).add(i.group),No.set(-1,i);for(let r of[-1,1,2]){let s=mf({color:"ember",radius:zn.glowR,intensity:1,depthTest:!1,night:!0,fog:!1});Gs.get(r).add(s.object),t2.set(r,s),U0.push({j:r,e:s,g:Gs.get(r),h:oo.H*Math.pow(1e3,r)})}for(let r of Nf)Of(r);return de.add(vn.update,Nt.WORLD),Se.on("room:arrive",({room:r})=>{let s=(oe[r]||oe.CORE).far;for(let o of[1,2])No.get(o).setFar(s)}),Se.on("tier:change",({tier:r})=>{let s=ti[r];s&&No.get(1).setLatticeDensity(s.lattice)}),Se.on("night:change",({night:r})=>{for(let s of B0.values())s.setNight(r)}),vn},level(n){return Gs.get(n)||null},structure(n){return No.get(n)||null},litNodes(n){return B0.get(n)||null},fade(n){return Wn.has(n)?Wn.get(n):0},setFade(n,e){if(!Wn.has(n))return;let t=Math.max(0,Math.min(1,e));t!==Wn.get(n)&&(Wn.set(n,t),Of(n))},setHallLod(n){let e=n?oe[n]:null;NM=e&&e.stratum>=0?e.stratum:-1;let t=No.get(1);t&&t.setHideCaps(NM)},shift(n){let e=Nf.map(t=>Wn.get(t));if(n==="grow"){Or.grow.push(e[3]);let t=Or.shrink.length?Or.shrink.pop():0;Wn.set(2,e[2]),Wn.set(1,e[1]),Wn.set(0,e[0]),Wn.set(-1,t)}else{Or.shrink.push(e[0]);let t=Or.grow.length?Or.grow.pop():0;Wn.set(-1,e[1]),Wn.set(0,e[2]),Wn.set(1,e[3]),Wn.set(2,t)}Or.grow.length>8&&Or.grow.shift(),Or.shrink.length>8&&Or.shrink.shift();for(let t of Nf)Of(t)},update(){let n=Ie.camera;if(!n)return;let e=Xe.s,t=n2.copy(n.position).sub(Xe.Q).length()/e,i=t<Sx.miniKeyBelow;i!==Xc&&(Xc=i,Of(-1));for(let r=0;r<U0.length;r++){let{j:s,e:o,g:a,h:l}=U0[r],c=(s===-1?Xc||Wn.get(-1)>0:Wn.get(s)>0)&&t>l*bx;o.object.visible=c&&a.visible!==!1}}};var i2=new C,k0=null;function $c(){let n=Xe.root;n&&(n.scale.setScalar(Xe.s),n.position.copy(Xe.Q),n.updateMatrix()),pe.uWorldScale.value=Xe.s}function OM(n){let e=Ie.camera;e&&n(e.position),Ie.pose&&(n(Ie.pose.pos),n(Ie.pose.target)),Ie.remapHistory(n),Xe.focus&&n(Xe.focus)}var Xe={root:null,s:1,Q:new C,n:0,focus:new C,init(n,e){return e&&(k0=e),Xe.root||(Xe.root=new jt,Xe.root.name="scaleRoot",Xe.root.matrixAutoUpdate=!1),n&&Xe.root.parent!==n&&n.add(Xe.root),$c(),Xe},set(n,e){Xe.s=n,e&&Xe.Q.copy(e),$c()},scaleAbout(n,e){let t=Xe.s;n!==t&&(Xe.Q.x+=e.x*(t-n),Xe.Q.y+=e.y*(t-n),Xe.Q.z+=e.z*(t-n),Xe.s=n,$c())},fixedPoint(n){let e=1-Xe.s;return Math.abs(e)<1e-9?n.set(0,0,0):n.copy(Xe.Q).multiplyScalar(1/e)},logLerp(n,e,t){return Math.exp(Math.log(n)+(Math.log(e)-Math.log(n))*t)},toRender(n,e){return e.copy(n).multiplyScalar(Xe.s).add(Xe.Q)},toCanonical(n,e){return e.copy(n).sub(Xe.Q).multiplyScalar(1/Xe.s)},rebase(n){let t={kind:n,k:(n==="grow"?1e3:.001)/Xe.s,T:Xe.Q.clone(),s:Xe.s,Q:Xe.Q.clone()};OM(r=>Xe.mapPoint(r,t,r)),Xe.s=1,Xe.Q.set(0,0,0),$c(),vn.shift(n);let i=k0&&k0.key;return i&&typeof i.onRebase=="function"&&i.onRebase(n),Se.emit("scale:rebase",{kind:n,k:t.k,T:t.T}),t},unrebase(n){OM(e=>e.multiplyScalar(1/n.k).add(n.T)),Xe.s=n.s,Xe.Q.copy(n.Q),$c(),vn.shift(n.kind==="grow"?"shrink":"grow")},mapPoint(n,e,t){return t.copy(n).sub(e.T).multiplyScalar(e.k)},fitClip(n){let e=Math.max(1e-5,i2.copy(n.position).sub(Xe.focus).length());n.near=Ep.near*e,n.far=Ep.far*e}};var jc=Qt.r5,zM=jc.elevationDeg*Math.PI/180,r2=Math.cos(zM),s2=Math.sin(zM),z0=Math.PI*2,Ff=new C(0,0,0),V0=Dt.radius,FM=new C,Yc=!1,Za=Math.PI*.75,G0=-.7,H0=.7,W0=0,X0=0,Uf=new C,Bf=new C,Oo=1,$0="",UM=new C,BM=new C,qc=new C,kM=new C,Li={position:pe.uLamp.value,mode:"sweep",ctx:null,init(n){return Li.ctx=n,Li.setFocus(Ff.set(0,0,0),Dt.radius),Li},setFocus(n,e){Ff.copy(n),V0=e??V0},hold(n){n?(FM.copy(n),Yc||(Uf.copy(Li.position),Oo=0),Yc=!0):Yc&&(Yc=!1,Uf.copy(Li.position),Oo=0)},sweepOnce(n){X0=Math.max(200,n||1200),W0=de.now+X0},update(n){let e=Ie.camera;if(!e)return;let t=dn.pointer,i=t.type==="touch"||fe.isPhone,r;de.now<W0?r="sweep":i?r=t.down?"finger":"sweep":r=t.inside!==!1&&t.x>-9e3&&de.now-t.lastMove<jc.idleMs?"pointer":"sweep",r!==$0&&($0&&(Uf.copy(Li.position),Oo=0),r==="sweep"&&(Za=Math.atan2(H0,G0)),$0=r),Li.mode=r,UM.setFromMatrixColumn(e.matrixWorld,0),BM.setFromMatrixColumn(e.matrixWorld,1),qc.copy(e.position).sub(Ff),qc.lengthSq()<1e-12?qc.setFromMatrixColumn(e.matrixWorld,2):qc.normalize();let s,o;if(r==="sweep"){let l=de.now<W0?X0:jc.sweepMs;Za+=z0*n*1e3/l,Za>z0&&(Za-=z0),s=Math.cos(Za),o=Math.sin(Za)}else{let l=t.x/Math.max(1,fe.w)*2-1,c=-(t.y/Math.max(1,fe.h))*2+1,u=Math.hypot(l,c);u>1e-4&&(G0=l/u,H0=c/u),s=G0,o=H0}kM.copy(UM).multiplyScalar(s).addScaledVector(BM,o).normalize();let a=jc.radiusFactor*V0;Bf.copy(Ff).addScaledVector(kM,a*r2).addScaledVector(qc,a*s2),Yc&&Bf.copy(FM),Oo<1?(Oo=Math.min(1,Oo+n*1e3/jc.blendMs),Li.position.copy(Uf).lerp(Bf,cn.reveal(Oo))):Li.position.copy(Bf)}};var Ka=Math.PI*2,o2=gn.irisBladeDeg*Math.PI/180;function VM(n,e,t,i){for(let r=0;r<e;r++){let s=Ka*r/e-Math.PI/e,o=s+Ka/e;n.push(Math.sin(s)*t,i,Math.cos(s)*t,Math.sin(o)*t,i,Math.cos(o)*t)}}var a2=n=>Ct(n/1e3)*1e3;function GM(n,e){let t=gn.irisBlades*2+28,i=new Float32Array(t*6),r=Pi({segments:i,color:"silver",alpha:.42,far:e}),s=gn.irisR,o=0;function a(l){let c=0,u=(d,h,f,g)=>{i[c++]=d,i[c++]=n,i[c++]=h,i[c++]=f,i[c++]=n,i[c++]=g};for(let d=0;d<gn.irisBlades;d++){let h=Ka*d/gn.irisBlades,f=Ka*(d+1)/gn.irisBlades,g=s*(.06+.94*l),y=h+Math.PI/gn.irisBlades+o2*(1-l),m=Math.sin(y)*g,p=Math.cos(y)*g;u(Math.sin(h)*s,Math.cos(h)*s,m,p),u(m,p,Math.sin(f)*s,Math.cos(f)*s)}for(let d=0;d<28;d++){let h=Ka*d/28,f=Ka*(d+1)/28;u(Math.sin(h)*s,Math.cos(h)*s,Math.sin(f)*s,Math.cos(f)*s)}r.setSegments(i)}return a(0),{object:r.mesh,lines:r,get open(){return o},set(l){let c=Math.max(0,Math.min(1,l));c!==o&&(o=c,a(c))}}}function HM(n){let e=oe[n]||oe.CORE,t=e.n,i=new jt;i.name=`shell:${e.id}`;let r=e.floor-e.alt,s=e.ceil-e.alt,o=e.id==="CORE",a=e.far,l=[];for(let[p,b]of[[r,e.floor],[s,e.ceil]]){let S=o?300:a2(b);for(let _=gn.ringStep;_<S-1;_+=gn.ringStep)VM(l,t,_,p)}let c=Pi({segments:new Float32Array(l.length?l:[0,0,0,0,0,0]),color:"steel",alpha:l.length?1:0,far:a,flatten:!0});c.mesh.name="rings",i.add(c.mesh);let u=null;if(!o){let p=[],b=[];for(let S=gn.deckRingStep;S<=gn.deckR+1e-6;S+=gn.deckRingStep){VM(p,t,S,0);for(let _=0;_<t;_++)b.push(1-.75*(S/gn.deckR))}u=Pi({segments:new Float32Array(p),alpha:new Float32Array(b),color:"steel",far:a,flatten:!0}),u.mesh.name="deck",i.add(u.mesh)}let d=GM(s,a),h=GM(r,a);i.add(d.object,h.object);let f=1,g=!0,y={rings:l.length?1:0,deck:1,iris:.42};return{group:i,rings:c,deck:u,irisTop:d,irisBottom:h,setDeckVisible(p){g=!!p,u&&(u.mesh.visible=g&&f>0)},setIris(p,b){(p==="top"?d:h).set(b)},setFlatten(p,b){c.setFlatten(p,b),u&&u.setFlatten(p,b)},setAlpha(p){f=Math.max(0,Math.min(1,p)),c.setAlpha(y.rings*f),u&&(u.setAlpha(y.deck*f),u.mesh.visible=g&&f>0),d.lines.setAlpha(y.iris*f),h.lines.setAlpha(y.iris*f)},dispose(){c.dispose(),u&&u.dispose(),d.lines.dispose(),h.lines.dispose(),i.parent&&i.parent.remove(i)}}}var l2=`
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
}`,c2=`
${Ii}
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
}`;function WM(){let n=new jt;n.name="axisPillar";let e=12,t=[],i=1200,r=50;for(let f=-i;f<i;f+=r){let g=f,y=Math.min(i,f+r);y<=-e||g>=e?t.push(0,g,0,0,y,0):(g<-e&&t.push(0,g,0,0,-e,0),y>e&&t.push(0,e,0,0,y,0))}let s=Pi({segments:new Float32Array(t),color:"ember",width:2,alpha:.5,glint:.4,far:4e3});s.mesh.name="pillarRibbon",n.add(s.mesh);let o=new rc(gn.beadR,0),a=new Pt({uniforms:{uColor:ei("silver"),uBase:ei("obsidian"),cWhite:pe.cWhite,uLamp:pe.uLamp,uAlpha:{value:1},uFlash:{value:0},cAbyss:pe.cAbyss,uFogDensity:pe.uFogDensity},vertexShader:l2,fragmentShader:c2}),l=new jl(o,a,gn.beadCount);l.name="pillarBeads";let c=new Et,u=new Gi,d=new C,h=new C;for(let f=0;f<gn.beadCount;f++){let g=-i+gn.beadStep*f;d.set(0,g,0),h.setScalar(Math.abs(g)<e?0:1),l.setMatrixAt(f,c.compose(d,u,h))}return l.instanceMatrix.needsUpdate=!0,l.frustumCulled=!1,n.add(l),n.userData.ribbon=s,n.userData.beads=l,n.userData.uniforms={ribbon:s.uniforms,beads:a.uniforms},n}var Zc=new ac,Kc=[];var YU=new C;function XM(n,e,t,i){if(!Ie.camera||!t||!t.length)return null;Ie.ray(n,e,Zc.ray),Zc.near=Ie.camera.near,Zc.far=Ie.camera.far,Zc.layers.mask=4294967295,Kc.length=0,Zc.intersectObjects(t,!0,Kc);let r=null;for(let s=0;s<Kc.length;s++){let o=Kc[s];if(u2(o.object)){r=o;break}}return Kc.length=0,r?i?(Object.assign(i,r),i):r:null}function u2(n){for(let e=n;e;e=e.parent)if(!e.visible)return!1;return!0}var Fo=Math.PI/180,ci=Math.PI*2,h2=137.508*Fo;function d2(n){let e=an[n],t=Dt.sign.heightFrac*e.height;Zt.draw(`sign:${n}`,{height:(i,r,s)=>$M(i,r,s,n,t,!1),inlay:(i,r,s)=>$M(i,r,s,n,t,!0)})}function $M(n,e,t,i,r,s){n.fillStyle="#fff",n.strokeStyle="#fff";let o=e/r;if(_l[i]==="•"){let g=(Dt.apertureD/2+.0045)*o,y=Dt.ringEngraveW*o;n.beginPath(),s?(n.lineWidth=1,n.arc(e/2,t/2,g-y/2,0,ci),n.stroke(),n.beginPath(),n.arc(e/2,t/2,g+y/2,0,ci),n.stroke()):(n.lineWidth=Math.max(1.5,y),n.arc(e/2,t/2,g,0,ci),n.stroke());return}let l=(i===0||i===6?.5:.9)*t,c=t/2+(i===0?.17*t:i===6?.02*t:0);n.font=yl.sign.replace("{px}",String(Math.round(l*1.38))),n.textAlign="center",n.textBaseline="alphabetic";let u=n.measureText(_l[i]),d=u.actualBoundingBoxAscent||l,h=u.actualBoundingBoxDescent||0,f=c+(d-h)/2;s?(n.lineWidth=1,n.strokeText(_l[i],e/2,f)):n.fillText(_l[i],e/2,f)}function f2(){Zt.draw("ticks",{height:(n,e,t)=>{n.fillStyle="#fff";for(let i=0;i<Dt.ticksPerFace;i++)n.fillRect((i+.5)/Dt.ticksPerFace*e-1,0,2,t*.9)},inlay:(n,e,t)=>{n.fillStyle="#fff";for(let i=0;i<Dt.ticksPerFace;i++)n.fillRect(Math.round((i+.5)/Dt.ticksPerFace*e),0,1,t*.9)}})}function YM(){Zt.texture||Zt.init(st.tier);for(let n=0;n<7;n++)d2(n);f2()}var p2="void main() { gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }",m2=`
uniform vec3 uColor; uniform vec3 cElectrum; uniform vec3 cWhite; uniform float uNight, uI, uFlash, uEmissivePass, uGlowVis;
void main() {
  vec3 c = mix(uColor, cElectrum, uNight);
  float k = uI * mix(1.0, ${kr.nucleusIntensity.toFixed(2)}, uNight);
  k *= mix(1.0, uGlowVis, uEmissivePass);      // T3 bloom source obeys the SPEC visibility rule like the T1/T2 sprite
  gl_FragColor = vec4(mix(c * k, cWhite, uFlash), 1.0);
}`;function qM(n,e){let t=an[n],i=t.top+(t.bot-t.top)/3,r=t.top+(t.bot-t.top)*2/3,s=(Ct(i)+Ct(r))/2;return e.set(0,t.mid,s*Math.cos(Math.PI/t.n))}var jM=()=>({dy:0,slide:0,yaw:0,pitch:0,scaleR:1,scaleY:1,alpha:1,edgeFlash:0});function ZM(n){YM(),Ha().then(YM);let e=new jt;e.name="key";let t=Cc({perStratum:!0,vertices:!0,far:700});e.add(t.group);let i=t.strata,r=new Pt({uniforms:{uColor:{value:pe.cEmber.value},cElectrum:pe.cElectrum,cWhite:pe.cWhite,uNight:pe.uNight,uI:{value:1},uFlash:{value:0},uEmissivePass:pe.uEmissivePass,uGlowVis:{value:1}},vertexShader:p2,fragmentShader:m2}),s=new Vt(new vo(zn.r,zn.detail),r);s.name="nucleus",s.userData.stratum=3;let o=mf({color:"ember",radius:zn.glowR,intensity:1,core:s,depthTest:!1,night:!0,nightIntensity:kr.nucleusIntensity,fog:!1,renderOrder:6});e.add(o.object);let a=Pi({segments:new Float32Array([0,-ki.half,0,0,ki.half,0]),color:"ember",width:ki.widthPx,alpha:ki.alphaInside,glint:.3}),l=8,c=new Float32Array(l*2*6),u=new Float32Array(l*2),d=Pi({segments:c,alpha:u,color:"ember",width:ki.widthPx,glint:.3});for(let E of[a,d])E.mesh.layers.enable(Qn.EMISSIVE),E.mesh.renderOrder=4,e.add(E.mesh);let h=-1;function f(E){if(E!==h){h=E;for(let L=0;L<2;L++){let k=L?-1:1;for(let se=0;se<l;se++){let he=ki.half+E*se/l,X=ki.half+E*(se+1)/l,Z=(L*l+se)*6;c[Z]=0,c[Z+1]=k*he,c[Z+2]=0,c[Z+3]=0,c[Z+4]=k*X,c[Z+5]=0,u[L*l+se]=ki.alphaInside*(1-(se+.5)/l)}}d.setSegments(c),d.mesh.geometry.attributes.aAl.needsUpdate=!0,d.mesh.visible=E>0}}f(ki.extend);let g=48,y=new Float32Array(g*6),m=qM(3,new C).z+.002;for(let E=0;E<g;E++){let L=E/g*ci,k=(E+1)/g*ci,se=E*6;y.set([Math.cos(L)*zn.breathRingR,Math.sin(L)*zn.breathRingR,m,Math.cos(k)*zn.breathRingR,Math.sin(k)*zn.breathRingR,m],se)}let p=Pi({segments:y,color:"ember",width:1,alpha:.8,glint:0});p.mesh.visible=!1,i[3].add(p.mesh);let b=xf({scale:1});b.setCount(W.litNodes),i[3].add(b.object);let S=ti.T3.grains,_=new Float32Array(S*3),A=new Float32Array(S),T=[0];for(let E=1;E<7;E++)T.push((an[E-1].bot+an[E].top)/2);let R=2654435769,x=()=>{R=R+1831565813|0;let E=R;return E=Math.imul(E^E>>>15,E|1),E^=E+Math.imul(E^E>>>7,E|61),((E^E>>>14)>>>0)/4294967296};for(let E=0;E<S;E++){let L=T[E%7],se=Math.max(.12,Ct(L))*Ot(jo.annulus[0],jo.annulus[1],Math.sqrt(x())),he=x()*ci;_[E*3]=Math.sin(he)*se,_[E*3+1]=L+(x()-.5)*2*jo.jitter,_[E*3+2]=Math.cos(he)*se,A[E]=Ot(jo.sizePx[0],jo.sizePx[1],x())}let w=Bs({positions:_,sizes:A,sizePx:1,color:"silver",alpha:.35,count:(st.params||ti.T2).grains});w.object.name="grains",e.add(w.object);let I={count:(st.params||ti.T2).grains,mode:"rings",setMode(E){I.mode=E},setPlate(){},writeTargets(){},commitTargets(){},flyToTargets(){},shiver(){},scatter(){}};Se.on("tier:change",({tier:E})=>{let L=ti[E];L&&(I.count=Math.min(S,L.grains),w.setCount(I.count))});let D=()=>{ee.satellites=Math.min(7,W.data&&W.data.drawings?W.data.drawings.length:0)};D(),Se.on("drawing:saved",D);let F=E=>E<=0?1:-Math.log(E)/Math.sqrt(Math.PI*Math.PI+Math.log(E)**2),z=[];for(let E=0;E<7;E++)z.push(new $i(22,F(.04),0));let N=new Float32Array(7),V=new Int32Array(7),K=[],$=[];for(let E=0;E<7;E++)K.push(null),$.push(jM());let J=null,j=1,Q={scale:1,nucleus:1,gap:-1},ie=new $i(6,1,It.rest),Ve=new $i(6,1,0),Ue=new $i(6,.8,0),_t=!1,lt=!0,ot=1,Y={on:!0,base:1,pulse:1,flashUntil:0,flashToken:null,oneFrameFlash:0},te={t0:-1,amp:0},be={t0:-1,amp:0,hz:0,decay:1,ms:0},Ke={t0:-1},Ce=0,ge=pe.cEmber.value,ye=new C,Le=new C,$e=new C,wt=new C,we={x:0,y:0,depth:0,visible:!1},Ae={x:0,y:0,depth:0,visible:!1},tt=new C,$t=t.solids.concat([s]),Wt=Math.cos(zn.apertureAlignDeg[0]*Fo),Xt=Math.cos(zn.apertureAlignDeg[1]*Fo);function O(){for(let E=0;E<7;E++)Object.assign($[E],jM());Q.scale=1,Q.nucleus=1,Q.gap=-1}function wn(E,L){Ce=L;for(let re=0;re<7;re++){let ue=z[re];if(N[re]!==0){ue.x+=N[re]*E,ue.v=0,ue.target=ue.x,N[re]*=Math.pow(fi.spinDecay,E*1e3/fi.frameMs);let Me=ci/an[re].n,Ge=Math.floor(ue.x/Me);Ge!==V[re]&&(V[re]=Ge,je.play("tick",{})),Math.abs(N[re])<.35&&(N[re]=0,ue.omega=6,ue.zeta=1,ue.target=Math.round(ue.x/ci)*ci)}ue.step(E)}ie.step(E),Ve.step(E),Ue.step(E);let k=ie.x;_t&&(k+=On.mix(It.rest,It.breath)-It.rest),Q.gap>=0&&(k=Q.gap),J&&J.gap!=null&&(k=Ot(k,J.gap,j)),gt=k;let se=0;for(let re=0;re<7;re++){let ue=$[re],Me=K[re],Ge=Me?j:0,ht=(3-re)*(k-It.rest)+ue.dy+(Me&&Me.dy?Me.dy*Ge:0),B=ue.slide+(Me&&Me.slide?Me.slide*Ge:0),Ee=z[re].x+ue.yaw+(Me&&Me.yaw?Me.yaw*Ge:0);if(be.t0>=0){let ze=L-be.t0;ze>be.ms?be.t0=-1:Ee+=be.amp*Math.sin(ci*be.hz*ze/1e3+re*.9)*Math.exp(-ze/be.decay)}let ne=ue.pitch+(Me&&Me.pitch?Me.pitch*Ge:0),Te=ue.scaleR*(Me&&Me.scaleR!=null?Ot(1,Me.scaleR,Ge):1),Ne=ue.scaleY*(Me&&Me.scaleY!=null?Ot(1,Me.scaleY,Ge):1),le=ue.alpha*(Me&&Me.alpha!=null?Ot(1,Me.alpha,Ge):1);se=Math.max(se,ue.edgeFlash+(Me&&Me.edgeFlash?Me.edgeFlash*Ge:0));let Ye=i[re];Ye.position.set(Math.sin(Ee)*B,ht,Math.cos(Ee)*B),Ye.rotation.set(ne,Ee,0,"YXZ"),Ye.scale.set(Te,Ne,Te),t.setStratumFade(re,le)}for(let re=0;re<t.edges.length;re++)t.edges[re].uniforms.uFlash.value=Math.min(1,se*.6);let he=Q.scale*(J&&J.scale!=null?Ot(1,J.scale,j):1);e.scale.setScalar(he);let X=Ue.x+(J&&J.pitch?J.pitch*j:0);if(Ke.t0>=0){let re=L-Ke.t0;re>600?Ke.t0=-1:X+=8*Fo*Math.sin(Math.PI*re/600)}e.rotation.set(X,Ve.x+(J&&J.yaw?J.yaw*j:0),J&&J.roll?J.roll*j:0,"YXZ");let Z=0;if(te.t0>=0){let re=L-te.t0;re>_e.shudder?te.t0=-1:Z=Math.sin(ci*3*re/_e.shudder)*te.amp*(1-re/_e.shudder)}e.position.set(Z,0,J&&J.dz?J.dz*j:0),e.updateWorldMatrix(!0,!0),tt.setFromMatrixPosition(e.matrixWorld);let me=Y.on?(_t?On.mix(zn.intensity[0],zn.intensity[1]):1)*Y.pulse*Q.nucleus:0;Y.flashUntil&&L>Y.flashUntil&&(Y.flashUntil=0,ge=pe.cEmber.value,o.setColor("ember")),r.uniforms.uColor.value=ge,r.uniforms.uI.value=me,r.uniforms.uFlash.value=Y.oneFrameFlash>0?1:0,o.setFlash(r.uniforms.uFlash.value),Y.oneFrameFlash>0&&Y.oneFrameFlash--;let Fe=zn.minVisibility;if(Ie.camera&&($e.set(0,0,1).transformDirection(i[3].matrixWorld),ye.copy(Ie.camera.position).sub(tt).normalize(),Fe=Math.max(Fe,Ao(Wt,Xt,ye.dot($e)),Ao(zn.gapOpen[0],zn.gapOpen[1],k))),o.setIntensity(me*Fe*ot),r.uniforms.uGlowVis.value=Fe*ot,p.mesh.visible){let re=On.mix(0,1);p.mesh.scale.setScalar(1+.04*re),p.setAlpha(.55+.35*re)}}let gt=It.rest,P={group:e,structure:t,radius:Dt.radius,nucleusWorld:tt,grains:I,nucleus:s,glow:o,litNodes:b,faceFrame(E,L){return qM(E,wt),L.F.copy(wt).applyMatrix4(i[E].matrixWorld),L.n.set(0,0,1).transformDirection(i[E].matrixWorld),L},stratumMatrix(E,L){return L.copy(i[E].matrixWorld)},pick(E,L){let k=XM(E,L,$t);return k&&k.object&&k.object.userData.stratum!=null?k.object.userData.stratum:-1},screenInfo(E){let L=Ie.camera;if(Ie.project(tt,we),E.x=we.x,E.y=we.y,!L)return E.r=E.rx=E.ry=0,E;let k=e.scale.x;return ye.setFromMatrixColumn(L.matrixWorld,0),Le.copy(tt).addScaledVector(ye,Dt.radius*k),Ie.project(Le,Ae),E.r=Math.abs(Ae.x-we.x),Le.copy(tt).addScaledVector(ye,.62*k),Ie.project(Le,Ae),E.rx=Math.abs(Ae.x-we.x),ye.setFromMatrixColumn(L.matrixWorld,1),Le.copy(tt).addScaledVector(ye,1.2*k),Ie.project(Le,Ae),E.ry=Math.abs(Ae.y-we.y),E},stratumScreenY(E){return ye.set(0,an[E].mid,0).applyMatrix4(i[E].matrixWorld),Ie.project(ye,we).y},update:wn,onGesture(E){if(!lt||!E||E.type!=="tap")return!1;let L=P.pick(E.x,E.y);return L<0?!1:(Se.emit("key:click",{index:L,x:E.x,y:E.y}),!0)},setInteractive(E){lt=!!E},setIdle(E){_t=!!E},setReveal(E){if(!E)return;ot=E.fill!=null?Tt(E.fill):1,t.setParts({vertices:E.points!=null?Tt(E.points):1,solid:ot,edges:1,lattice:ot}),t.setFade(E.alpha!=null?Tt(E.alpha):1);for(let k=0;k<t.edges.length;k++)t.edges[k].uniforms.uFlash.value=E.scanY!=null?.35:0;let L=E.alpha==null||E.alpha>0;a.mesh.visible=L,d.mesh.visible=L&&h>0,p.mesh.visible=L&&v,b.object.visible=(E.alpha==null||E.alpha>0)&&b.count>0,w.setAlpha(.35*(E.alpha!=null?Tt(E.alpha):1))},setScramble(E){for(let L=0;L<7;L++){let k=0;E==="golden"?k=L*h2:E==="random"?k=(x()-.5)*ci:Array.isArray(E)&&(k=+E[L]||0),k=Math.atan2(Math.sin(k),Math.cos(k)),N[L]=0,z[L].snap(k)}},lockSequence(E={}){let L=E.order==="up"?[6,5,4,3,2,1,0]:[0,1,2,3,4,5,6],k=E.stepMs!=null?E.stepMs:_e.lockStep;if(E.spin)for(let se of L)Math.abs(z[se].x)>.01&&(N[se]=3);return new Promise(se=>{L.forEach((he,X)=>ct(X*k,()=>{if(P.alignStratum(he,{spring:"light",overshoot:E.snap!=null?E.snap:fi.snapOvershoot}),je.play("ratchet",{i:he}),E.onLock)try{E.onLock(he)}catch{}X===L.length-1&&ct(320,se)}))})},alignStratum(E,L={}){let k=z[E];N[E]=0,k.omega=L.spring==="heavy"?6:22,k.zeta=F(L.overshoot!=null?L.overshoot:0),k.target=Math.round(k.x/ci)*ci},spinStratum(E,L){N[E]=L,V[E]=Math.floor(z[E].x/(ci/an[E].n))},ignite(E={}){Y.on=!0,Y.oneFrameFlash=E.flash===!1?0:1,ge=E.color==="electrum"?pe.cElectrum.value:pe.cEmber.value,o.setColor(E.color==="electrum"?"electrum":"ember")},douse(){Y.on=!1},shootAxis(E=ki.extend,L=ki.shootMs){return Fn(L,se=>f(E*se),cn.reveal).done},setBreathingRing(E){v=!!E,p.mesh.visible=v},setMorph(E,L,k,se){if(O(),E==="dive"){let he=se>1600?1.375:1,X=k/he,Z=Tt(X/120),me=cn.camera(Tt((X-120)/360));Q.scale=X<120?1-Dt.contract*cn.camera(Z):1-Dt.contract*(1-Ao(120,480,X)),Q.nucleus=1+(Dt.nucleusAnticipation-1)*(X<120?Z:1-Ao(120,480,X)),Q.gap=Ot(It.rest,It.dive,me);for(let Fe=0;Fe<7;Fe++){let re=$[Fe];Fe===L?(re.slide=Dt.diveSlide*me,re.yaw=-z[Fe].x*me,re.edgeFlash=X<120?Z:1-Ao(480,900,X)):(re.yaw=(Fe<L?-1:1)*Dt.diveTurnAwayDeg*Fo*me,re.alpha=1-Ao(480*he,1e3*he,k))}}else if(E==="recall"){let he=_e.recallSwapAt*se/_e.recall,X=k-he;if(X<0){Q.gap=It.recallStart;return}let Z=Tt(X/(se-he||200));Q.gap=It.rest+(It.recallStart-It.rest)*(1-cn.camera(Z))-(It.recallStart-It.rest)*fi.settleOvershoot*Math.sin(Math.PI*Z);for(let me=0;me<7;me++)X<_e.recallRatchetMs*(me+1)&&($[me].yaw=(me%2?-1:1)*6*Fo)}else Q.gap<0&&gt!==ie.x&&(ie.snap(gt),ie.target=It.rest)},override(E,L){E>=0&&E<7&&(K[E]=L||null)},overrideGroup(E){J=E||null},setOverrideWeight(E){j=Tt(E)},onRebase(E){O();for(let L=0;L<7;L++)N[L]=0,z[L].snap(0);ie.snap(E==="shrink"?It.recallStart:It.rest),ie.omega=4,ie.target=It.rest},shudder(E=6){Jt.reducedMotion&&(E=Math.min(E,2));let L=Ie.camera?Ie.camera.position.distanceTo(tt):7.2;te.amp=E*L/Math.max(1,pe.uPxPerUnit.value),te.t0=Ce},addYaw(E){Ve.x+=E},wobble(E,L,k,se){Jt.reducedMotion||Object.assign(be,{t0:Ce,amp:E,hz:L,decay:Math.max(1,k),ms:se})},bow(){return Ke.t0=Ce,Ve.target=0,new Promise(E=>ct(600,E))},nudgePitch(E){Ue.x+=E*Fo},flashNucleus(E,L){ge=E==="white"?pe.cWhite.value:pe.cElectrum.value,o.setColor(E==="white"?"white":"electrum"),Y.flashUntil=Ce+Math.max(16,L||0)},setNucleusPulse(E){Y.pulse=E>0?E:1}},v=!1;return P.setReveal({points:0,scanY:null,fill:0,alpha:0}),P.douse(),f(0),Se.on("night:change",({night:E})=>b.setNight(E)),ee.night&&b.setNight(!0),P}var g2=38,KM=-100,Uo=1024,Hs=256,x2=`
varying vec2 vUv; varying float vDist;
void main() { vUv = uv; vec4 v = modelViewMatrix * vec4(position, 1.0); vDist = length(v.xyz); gl_Position = projectionMatrix * v; }`,v2=`
${Ii}
uniform sampler2D uTex; uniform vec3 cSilver; uniform float uAlpha;
varying vec2 vUv; varying float vDist;
void main() {
  float a = texture2D(uTex, vUv).a * uAlpha;
  if (a <= 0.003) discard;
  gl_FragColor = vec4(applyFog(cSilver, vDist), a);
}`;function JM(n){let e=new jt;e.name="rim";let t=Sl(vt.operator.name||""),i=-gn.coreRimR*Math.cos(Math.PI/12)+.5,r=document.createElement("canvas");r.width=Uo,r.height=Hs;let s=new Jr(r);s.minFilter=At,s.magFilter=At,s.generateMipmaps=!1,s.wrapS=s.wrapT=Zn,Wi(s,Uo*Hs*4);let o=.5;function a(){let S=r.getContext("2d");S.clearRect(0,0,Uo,Hs),S.fillStyle="#fff",S.font=yl.burn.replace("{px}",String(Math.round(Hs*.78))),S.textAlign="center",S.textBaseline="middle",S.fillText(t,Uo/2,Hs/2+Hs*.04),o=Math.min(1,S.measureText(t).width/Uo),s.needsUpdate=!0,y()}let l=new Pt({uniforms:{uTex:{value:s},cSilver:pe.cSilver,uAlpha:{value:1},cAbyss:pe.cAbyss,uFogDensity:pe.uFogDensity},vertexShader:x2,fragmentShader:v2,transparent:!0,depthWrite:!1}),c=g2/.6,u=new Vt(new Qr(c*(Uo/Hs),c),l);u.position.set(0,KM,i),u.visible=!1,u.name="rimName",e.add(u);let d=Math.max(1,Lc(vt.clan.sigil).length),h=new Float32Array(d*3),f=gf({positions:h,count:0,color:"ember",radius:ao.emitterM,intensity:1});e.add(f.object);let g=0;function y(){let S=c*(Uo/Hs)*o/2+12;for(let _=0;_<d;_++){let A=Math.floor(_/3),T=_%3;h[_*3]=S+A*6,h[_*3+1]=KM+(1-T)*7,h[_*3+2]=i+.5}f.setPositions(h,d),f.setCount(g)}a(),Ha().then(a);let m=null;try{m=document.createElement("span"),m.className="sr-only",m.textContent=t,(document.getElementById("overlay")||document.body).appendChild(m)}catch{m=null}let p=1,b={group:e,burn(S){return b.showName(),Promise.resolve()},showName(){u.visible=p>0},setLitNodes(S){g=Math.max(0,Math.min(d,S|0)),f.setCount(g)},setAlpha(S){p=Math.max(0,Math.min(1,S)),l.uniforms.uAlpha.value=p,e.visible=p>0,f.setIntensity(p)}};return b.setLitNodes(W.litNodes),b}function QM(n){let e=n.app,t=tr.rest,i=!1,r=null,s=!1,o=Ze.core,a=new C(...o.pos),l=new C(...o.target);function c(){let f=Ze.core;return{pos:new C(...f.pos),target:new C(...f.target),fov:f.fov,offsetY:n.layout.kind==="desktop"?0:f.phoneOffsetY,roll:0}}function u({index:f}){if(!i||n.director.busy()||e.phase!=="idle"&&e.phase!=="unfolded")return;if(f===3){n.director.go(s?"#/core":"#/core/open",{source:"key"});return}let g=cf(f);g&&n.director.go(`#/${g.slug}`,{source:"key"})}function d(f){s=f,e.unfolded=f,n.key&&(n.key.overrideGroup(f?{gap:It.unfold}:null),n.key.setOverrideWeight(1))}return{id:"CORE",build(){r=n.bus.on("key:click",u)},pose(){return c()},livePose(f){return Math.abs(t-tr.rest)<1e-4?!1:(f.target.copy(l),f.pos.copy(a).sub(l).multiplyScalar(t/tr.rest).add(l),f.fov=o.fov,f.offsetY=n.layout.kind==="desktop"?0:o.phoneOffsetY,f.roll=0,!0)},enter(){},exit(){},arrive(){i=!0,t=tr.rest},depart(){i=!1,s&&d(!1)},setSub(f){return f==="open"?(s||(d(!0),e.phase==="idle"&&zi("unfolded")),0):f==null?(s&&(d(!1),e.phase==="unfolded"&&zi("idle")),0):!1},update(){},onGesture(f){return n.key&&n.key.onGesture(f)?!0:f.type==="wheel"?(t=Math.max(tr.min,Math.min(tr.max,t*Math.pow(tr.wheelFactor,f.deltaY/tr.wheelStepPx))),!0):f.type==="pinch"?(t=Math.max(tr.min,Math.min(tr.max,t/Math.max(.2,f.dScale||1))),!0):!1},onKey(f){return f.key==="Escape"&&s?(n.director.go("#/core",{source:"kbd"}),!0):!1},resize(){},dispose(){r&&(r(),r=null),s&&d(!1),i=!1}}}function Ws(n,e){if(n==="ZENITH")return e>0?"SIGNAL":null;let t=n==="WORKSHOP"?"MEMBERS":n,i=bn.indexOf(t);if(i<0)return null;let r=i+(e>0?1:-1);return r>=0&&r<bn.length?bn[r]:null}function eb(n){let e=dt.elevator,t=0,i=-1e9,r=0;function s(o){let a=Ws(n.id,o);return t=0,r=0,a?(n.director.go(`#/${oe[a].slug}`,{source:"hall"}),!0):!1}return{onWheel(o){let a=n.loop.now;a-i>600&&(t=0,r=0),i=a;let l=o.deltaY||0;if(!l||(t!==0&&Math.sign(l)!==Math.sign(t)&&(t=0,r=0),!Ws(n.id,Math.sign(l))))return!0;let c=Math.abs(t)<e.resistance*e.pxPerHall?.5:1;t+=l*c;let u=Math.floor(Math.abs(t)/e.tickPx);return u>r&&(r=u,n.audio&&n.audio.play("tick",{})),Math.abs(t)>=e.pxPerHall&&s(Math.sign(t)),!0},onSwipe(o){if(o.dir!=="up"&&o.dir!=="down")return!1;let a=o.dir==="up"?1:-1;return Ws(n.id,a)?(Pr(Ir.lock),s(a)):!1},reset(){t=0,r=0,i=-1e9}}}var kf=Math.PI/180,Xs=Math.PI*2,y2=new Set(["SIGNAL","MEMBERS","INSIGNIA","NADIR","ZENITH","ARCHIVE"]),_2="Зал строится.";function M2(n,e,t){let i=e==="phone",r=(o,a,l=Ze.fov,c=0)=>({pos:new C(...o),target:new C(...a),fov:l,offsetY:c,roll:0}),s=(o,a,l)=>{let c=l-o[1];return[o[0],l,o[2]+c/Math.tan(a*kf)]};switch(n){case"MEMBERS":return i?r(Ze.members.phonePos,Ze.members.target):r(Ze.members.pos,Ze.members.target);case"VOYAGES":{let o=i?Ze.voyages.phonePos:[0,t,t*.6285714285714286];return r(o,i?s(o,-Ze.voyages.phonePitchDeg,0):[0,0,-6*(t/70)])}case"ARCHIVE":return r([0,1.6,0],[0,1.6,Ze.archive.tubeR]);case"SIGNAL":return i?r(Ze.signal.phonePos,[0,2+30*Math.tan(Ze.signal.phonePitchDeg*kf),0],Ze.fovWide):r(Ze.signal.pos,Ze.signal.target,Ze.signal.fov);case"INSIGNIA":return r(Ze.insignia.pos,[0,1.7,-10],Ze.insignia.fov);case"NADIR":return r([0,20,40],[0,0,0]);case"ZENITH":{let o=[0,50,30];return r(o,s(o,i?Ze.zenith.phonePitchDeg:Ze.zenith.pitchDeg,-110))}case"WORKSHOP":return r([0,0,3.2],[0,0,0]);default:return r(Ze.core.pos,Ze.core.target,Ze.core.fov,e==="desktop"?0:Ze.core.phoneOffsetY)}}function Bo(n,e,t,i=48,r=0,s=0){for(let o=0;o<i;o++){let a=Xs*o/i,l=Xs*(o+1)/i;n.push(r+Math.sin(a)*e,t,s+Math.cos(a)*e,r+Math.sin(l)*e,t,s+Math.cos(l)*e)}}function b2(n,e,t){let o=.75*Math.PI;for(let a of[1,-1])for(let l=0;l<10;l++){let c=Xs*l/10;n.push(e+Math.sin(c)*1.2,0,t+Math.cos(c)*1.2,e+Math.sin(c+a*o)*1.2,24,t+Math.cos(c+a*o)*1.2)}Bo(n,1.2,0,14,e,t),Bo(n,1.2,24,14,e,t),Bo(n,1.2*1.6,24,14,e,t)}function tb(n,e,t,i){let r=Ml(e),s=new Float32Array(n*3);for(let o=0;o<n;o++){let a=r()*Xs,l=Math.asin(.15+.85*r());s[3*o]=Math.cos(l)*Math.sin(a)*i,s[3*o+1]=t+Math.sin(l)*i,s[3*o+2]=Math.cos(l)*Math.cos(a)*i}return s}function S2(n,e){let t=[],i=null,r=[];switch(n){case"columns":{let s=e.world.members,o=s.length,a=s.filter(c=>c.id!==e.world.operator.id),l=s.find(c=>c.id===e.world.operator.id);l&&a.splice(Math.floor(a.length/2),0,l),a.forEach((c,u)=>{let d=o>1?(-25+50*u/(o-1))*kf:0,h=48*Math.sin(d),f=48-48*Math.cos(d);b2(t,h,f),r.push({id:c.id,label:c.name,pos:new C(h,24,f)})});break}case"hatches":for(let s=0;s<9;s++){let o=14*Math.sqrt(s),a=s*137.508*kf;Bo(t,2.25,.05,24,Math.sin(a)*o,Math.cos(a)*o)}break;case"bands":for(let s=0;s<12;s++)Bo(t,Ze.archive.tubeR,2-1.6*s,56);break;case"sky":{let s=Ze.signal.apexH,o=Ze.signal.apexR;Bo(t,o,s,36);for(let a=1;a<6;a++)Bo(t,60+(o-60)*(a/6),s*a/6,48);for(let a of[1,-1])for(let l=0;l<24;l++){let c=Xs*l/24,u=c+a*(Xs/6);t.push(Math.sin(c)*60,0,Math.cos(c)*60,Math.sin(u)*o,s,Math.cos(u)*o)}i=tb(300,20833,Ze.signal.apexH,900);break}case"dome":{let s=new nc(new vo(Ze.insignia.sphereR,1),1),o=s.attributes.position.array;for(let a=0;a<o.length;a++)t.push(o[a]+(a%3===1?1.7:0));s.dispose();break}case"chamber":{let s=Ze.nadir.depth,o=40;for(let a=0;a<3;a++){let l=Xs*a/3,c=Xs*(a+1)/3;t.push(Math.sin(l)*o,0,Math.cos(l)*o,Math.sin(c)*o,0,Math.cos(c)*o),t.push(Math.sin(l)*o,0,Math.cos(l)*o,0,-s,0)}break}case"zenith":i=tb(400,11799,-40,1200);break;default:{i=new Float32Array(147);for(let s=0;s<49;s++)i[3*s]=(s%7-3)*.4,i[3*s+1]=(3-Math.floor(s/7))*.4,i[3*s+2]=0;break}}return{seg:t,pts:i,anchors:r}}function Nn(n,e={}){let t=n.id,i=n.meta,r=e.props||"grid",s=null,o=null,a=null,l=null,c=[],u=0,d=0,h=null,f=!1,g=Ze.voyages.pos[1],y=new C;function m(){let S=Tt(u)*(1-Tt(d));s&&s.setAlpha(.55*S),o&&o.setAlpha((r==="grid"?.9:.4)*S),a&&(a.style.opacity=String(Tt(u)*(1-Tt(d*2))));let _=u>=.7&&d===0;for(let A of c)A.setVisible(_)}function p(){let S=document.createElement("div");S.className="ph-block scrim";let _=document.createElement("p");return _.className="t-body",_.textContent=_2,S.appendChild(_),S}return{id:t,build(){let{seg:S,pts:_,anchors:A}=S2(r,n);if(n.group&&(S.length&&(s=Pi({segments:new Float32Array(S),color:"silver",alpha:.55,width:1,far:Math.max(i.far,200)}),s.mesh.name=`ph:${r}`,n.group.add(s.mesh)),_)){let T=r==="sky"||r==="zenith";o=Bs({positions:_,sizePx:T?2:4,color:T?"white":"silver",alpha:.4,fog:!T,layer:T?Qn.NOFOG:Qn.DEFAULT}),n.group.add(o.object)}if(n.overlay&&A.length&&n.scale)for(let T of A){let R=T.pos.clone();c.push(n.overlay.add({owner:"placeholder",id:T.id,get:x=>{n.toCanonical(R,y),n.scale.toRender(y,x)},leader:{side:"right",len:40,rise:-24},button:{label:T.label,onActivate:()=>n.director.go(`#/members/${T.id}`,{source:"hall"})}}))}n.layout.isPhone||(a=p(),n.section.appendChild(a)),y2.has(t)&&(l=eb(n)),m()},pose(S){return M2(t,n.layout.kind,g)},livePose(S){return t!=="VOYAGES"||g===Ze.voyages.pos[1]||n.layout.kind==="phone"?!1:(S.pos.set(0,g,g*(44/70)),S.target.set(0,0,-6*(g/70)),S.fov=Ze.fov,S.offsetY=0,S.roll=0,!0)},enter(S){u=S,S>0&&(d=0),m()},exit(S){d=S,m()},arrive(){f=!0,u=1,d=0,m(),n.layout.isPhone&&n.sheet&&n.sheet.set(p(),{peek:null,state:"peek"})},depart(){f=!1,l&&l.reset(),n.layout.isPhone&&n.sheet&&n.sheet.set(null)},setSub(S){return h=S==null?null:String(S),0},update(){},onGesture(S){if(!f)return!1;if(t==="VOYAGES"&&S.type==="wheel"){let _=Ze.voyages.altRange;return g=Math.max(_[0],Math.min(_[1],g+S.deltaY*.08)),!0}return l?S.type==="wheel"?l.onWheel(S):S.type==="swipe"?l.onSwipe(S):!1:!1},onKey(){return!1},resize(){!f||!n.sheet||n.layout.isPhone&&!a&&n.sheet.set(p(),{peek:null,state:"peek"})},dispose(){s&&(s.dispose(),s.mesh.parent&&s.mesh.parent.remove(s.mesh),s=null),o&&(o.dispose&&o.dispose(),o.object.parent&&o.object.parent.remove(o.object),o=null);for(let S of c)S.remove();c.length=0,a&&a.parentNode&&a.parentNode.removeChild(a),a=null,f&&n.layout.isPhone&&n.sheet&&n.sheet.set(null),f=!1},get sub(){return h}}}function nb(n){return Nn(n,{props:"columns"})}function ib(n){return Nn(n,{props:"grid"})}function rb(n){return Nn(n,{props:"hatches"})}function sb(n){return Nn(n,{props:"bands"})}function ob(n){return Nn(n,{props:"sky"})}function ab(n){return Nn(n,{props:"dome"})}function lb(n){return Nn(n,{props:"chamber"})}function cb(n){return Nn(n,{props:"zenith"})}var ub=Object.freeze({CORE:QM,MEMBERS:nb,WORKSHOP:ib,VOYAGES:rb,ARCHIVE:sb,SIGNAL:ob,INSIGNIA:ab,NADIR:lb,ZENITH:cb});var Di=new Map,Fr=[],hs=null,w2=null,$s=()=>{};function E2(n){let e={pos:new C(0,.75,7.2),target:new C,fov:Ze.fov,offsetY:0,roll:0};return{id:n,build:$s,pose:()=>e,enter:$s,exit:$s,arrive:$s,depart:$s,setSub:()=>0,update:$s,onGesture:()=>!1,onKey:()=>!1,resize:$s,dispose:$s,stub:!0}}function A2(n){let e=document.createElement("section");e.className="hall",e.dataset.room=n,e.hidden=!0;let t=document.getElementById("halls");return t&&t.appendChild(e),e}function T2(n,e,t,i){let r=oe[n],s=Object.create(hs);return s.id=n,s.meta=r,s.group=i,s.section=e,s.shell=t,s.toCanonical=(o,a)=>a.copy(o).add(r.anchor),s}function hb(n,e){let t=A2(n),i=null,r=null;ee.tier!=="T0"&&rt.root&&(i=new jt,i.name=`hall:${n}`,i.position.copy(oe[n].anchor),i.visible=!1,rt.root.add(i),r=HM(n),i.add(r.group));let s=T2(n,t,r,i),o={id:n,hall:null,hctx:s,section:t,shell:r,group:i,shown:!1,dead:!1,throwArmed:w2===n};Di.set(n,o),Fr.push(o);try{o.hall=ee.tier==="T0"?E2(n):e(s);let a=o.hall.build();a&&typeof a.then=="function"&&a.then(null,l=>Y0(n,l))}catch(a){return Y0(n,a),Di.get(n)||null}return i&&(i.visible=!0),o}function db(n){n.dead=!0;try{n.hall&&n.hall.dispose()}catch(t){xt(`hall:${n.id}`,`hall ${n.id} dispose failed`,t)}n.shell&&n.shell.dispose(),n.group&&n.group.parent&&n.group.parent.remove(n.group),n.section&&n.section.parentNode&&n.section.parentNode.removeChild(n.section),Di.delete(n.id);let e=Fr.indexOf(n);e>=0&&Fr.splice(e,1)}function Y0(n,e){xt(`hall:${n}`,`hall ${n} failed — recalled to CORE`,e);let t=Di.get(n);t&&db(t);let i=hs&&hs.director;if(n==="CORE"){hb("CORE",s=>Nn(s,{props:"grid"}));let r=Di.get("CORE");r&&ee.room==="CORE"&&(rt.show("CORE",!0),r.hall&&Jc(r,"enter",1));return}i&&Promise.resolve().then(()=>i.go("#/core",{source:"error"}))}function Jc(n,e,t,i,r){if(!(!n||n.dead||!n.hall||typeof n.hall[e]!="function"))try{return n.hall[e](t,i,r)}catch(s){Y0(n.id,s);return}}function R2(n,e){for(let t=0;t<Fr.length;t++){let i=Fr[t];i.dead||!i.hall||Jc(i,"update",n,e)}}var rt={root:null,init(n){return hs=n,n.scale&&n.scale.root&&!rt.root&&(rt.root=new jt,rt.root.name="halls",n.scale.root.add(rt.root)),de.add(R2,Nt.WORLD),n.bus.on("layout:change",()=>{for(let e=0;e<Fr.length;e++)Jc(Fr[e],"resize")}),rt},ensure(n){oe[n]||(n="CORE");let e=Di.get(n)||hb(n,ub[n]||(t=>Nn(t,{props:"grid"})));return e&&e.hall?e.hall:null},get(n){let e=Di.get(n);return e&&!e.dead?e.hall:null},current(){return rt.get(ee.room)},release(n){let e=Di.get(n);if(!e||n===ee.room&&ee.phase!=="transition")return;let t=hs&&hs.director;t&&t.busy()&&t.state.to&&(t.state.to.room===n||t.logicalSource()===n)||db(e)},call(n,e,t,i,r){return Jc(Di.get(n),e,t,i,r)},shell(n){let e=Di.get(n);return e?e.shell:null},group(n){let e=Di.get(n);return e?e.group:null},residents(){return Fr.map(n=>n.id)},restPose(n,e,t){let i=oe[n]||oe.CORE,r=Di.get(i.id),s=r?Jc(r,"pose",e||null):void 0;return s&&s.pos&&s.target?(t.pos.copy(s.pos).add(i.anchor),t.target.copy(s.target).add(i.anchor),t.fov=s.fov||Ze.fov,t.offsetY=s.offsetY||0,t.roll=s.roll||0):i.id==="CORE"?(t.pos.fromArray(Ze.core.pos),t.target.fromArray(Ze.core.target),t.fov=Ze.core.fov,t.offsetY=hs&&hs.layout&&hs.layout.kind!=="desktop"?Ze.core.phoneOffsetY:0,t.roll=0):(t.pos.set(0,i.alt+10,48),t.target.set(0,i.alt+12.5,0),t.fov=Ze.fov,t.offsetY=0,t.roll=0),t},show(n,e=!1){for(let t=0;t<Fr.length;t++){let i=Fr[t];i.id===n?(i.shown=!0,i.section.hidden=!1):e&&(i.shown=!1,i.section.hidden=!0)}},hide(n){let e=Di.get(n);e&&(e.shown=!1,e.section.hidden=!0)}};function Ja(){return{cam:{pos:new C,target:new C,fov:35,offsetY:0,roll:0},s:1,pivot:new C,Q:new C,fog:.00485,fade:{mini:0,key:1,vin:1,parent:0},alt:0,exitU:0,enterU:0,speed01:0,pan:0,counter:0,flashCode:null,morph:{kind:"none",i:3,tMs:0,D:1},vinStrata:new Float32Array([1,1,1,1,1,1,1]),vinGap:.02,rim:1,pillar:1,shellFrom:1,shellTo:1,iris:{fromTop:0,fromBottom:0,toTop:0,toBottom:0},vel:new C}}function Ys(n,e){return e.cam.pos.copy(n.cam.pos),e.cam.target.copy(n.cam.target),e.cam.fov=n.cam.fov,e.cam.offsetY=n.cam.offsetY,e.cam.roll=n.cam.roll,e.s=n.s,e.pivot.copy(n.pivot),e.Q.copy(n.Q),e.fog=n.fog,e.fade.mini=n.fade.mini,e.fade.key=n.fade.key,e.fade.vin=n.fade.vin,e.fade.parent=n.fade.parent,e.alt=n.alt,e.exitU=n.exitU,e.enterU=n.enterU,e.speed01=n.speed01,e.pan=n.pan,e.counter=n.counter,e.flashCode=n.flashCode,e.morph.kind=n.morph.kind,e.morph.i=n.morph.i,e.morph.tMs=n.morph.tMs,e.morph.D=n.morph.D,e.vinStrata.set(n.vinStrata),e.vinGap=n.vinGap,e.rim=n.rim,e.pillar=n.pillar,e.shellFrom=n.shellFrom,e.shellTo=n.shellTo,e.iris.fromTop=n.iris.fromTop,e.iris.fromBottom=n.iris.fromBottom,e.iris.toTop=n.iris.toTop,e.iris.toBottom=n.iris.toBottom,e.vel.copy(n.vel),e}function eu(n,e){n.fade.mini=0,n.fade.key=1,n.fade.vin=1,n.fade.parent=0,n.morph.kind="none",n.vinStrata.fill(1),n.vinGap=.02,n.rim=e?1:0,n.pillar=1,n.shellFrom=1,n.shellTo=1,n.iris.fromTop=0,n.iris.fromBottom=0,n.iris.toTop=0,n.iris.toBottom=0,n.speed01=0,n.pan=0,n.counter=0,n.flashCode=null}var Qc=1024,zf=new Float32Array(Qc+1);for(let n=0;n<=Qc;n++)zf[n]=cn.camera(n/Qc);function C2(n){if(n<=0)return 0;if(n>=1)return 1;let e=0,t=Qc;for(;t-e>1;){let s=e+t>>1;zf[s]<n?e=s:t=s}let i=zf[e],r=zf[t];return(e+(r>i?(n-i)/(r-i):0))/Qc}var qs=(n,e)=>C2(n)*e,ur=(n,e)=>cn.camera(Tt(n/e));function ui(n,e,t,i){let r=ur(e,i),s=ur(t,i);return s<=r?n>=s?1:0:Tt((n-r)/(s-r))}var ko=(n,e,t)=>Math.exp(Math.log(n)+(Math.log(e)-Math.log(n))*t),js=n=>{let e=Tt(n);return e*e*(3-2*e)};function q0(n,e=7){let t=Tt(n)*e,i=Math.floor(t);return i>=e?1:(i+js((t-i)*3))/e}function Vf(n,e){let t=[],i=[];for(let o=0;o<n.length;o++){if(t.length&&t[t.length-1].distanceToSquared(n[o])<1e-12){i[i.length-1]=e[o];continue}t.push(n[o].clone()),i.push(e[o])}t.length===1&&(t.push(t[0].clone()),i.push(i[0]+1e-6));let r=new ic(t,!1,"centripetal"),s=t.length-1;return{curve:r,points:t,knots:i,sample(o,a){if(o<=i[0])return a.copy(t[0]);if(o>=i[s])return a.copy(t[s]);let l=0;for(;l<s-1&&o>i[l+1];)l++;let c=i[l+1]-i[l],u=c>0?(o-i[l])/c:1;return r.getPoint((l+u)/s,a)}}}function tu(n,e,t,i,r,s){return s.set(i.x+r.x*(t-e)+e*n.x,i.y+r.y*(t-e)+e*n.y,i.z+r.z*(t-e)+e*n.z)}function j0(n,e,t){let i=1-n;return Math.abs(i)<1e-9?t.set(0,0,0):t.copy(e).multiplyScalar(1/i)}var nu={restPose:null,faceFrame:null};function mb(n){Object.assign(nu,n||{})}function Gf(n,e){let t={pos:new C,target:new C,fov:Ze.fov,offsetY:0,roll:0};if(nu.restPose)nu.restPose(n,e||null,t);else{let i=oe[n]||oe.CORE;i.id==="CORE"?(t.pos.fromArray(Ze.core.pos),t.target.fromArray(Ze.core.target)):(t.pos.set(0,i.alt+10,48),t.target.set(0,i.alt+12.5,0))}return t}var Z0=n=>n==="WORKSHOP"?"MEMBERS":n==="ZENITH"?"SIGNAL":n;function K0(n,e){let t=Z0(n),i=Z0(e);return t==="CORE"&&i!=="CORE"?"DIVE":i==="CORE"&&t!=="CORE"?"RECALL":"LIFT"}function gb(n,e){let t=oe[n]||oe.CORE,i=oe[e]||oe.CORE;return Math.abs(t.stratum-i.stratum)}function xb(n,e){let t=gb(n,e);return t<=1?_e.liftBase:Math.min(_e.liftMax,_e.liftBase+_e.liftPerBoundary*(t-1))}function I2(n,e,t){return n==="DIVE"?_e.dive:n==="RECALL"?_e.recall:n==="SLICE"?_e.slice:xb(e,t)}function vb(n,e,t,i,r=900,s=-1){i.set(0,0,0);let o=t.x-e.x,a=t.y-e.y,l=t.z-e.z,c=Math.sqrt(o*o+a*a+l*l),u=s>0?s:c;if(c<1e-9||c<fi.anticipationMinDisp*u)return i;let d=Tt(n)*r,h=fi.anticipationMs,f=d<h?cn.reveal(d/h):d<3*h?1-js((d-h)/(2*h)):0,g=-(fi.anticipationFrac*u*f)/c;return i.set(o*g,a*g,l*g)}function J0(n,e,t,i){n.exitU=Tt(e/_e.depart),n.enterU=i>=0?e<i?0:Tt((e-i)/Math.max(1,t-i)):Tt((e-(t-_e.arrive))/_e.arrive)}var Q0=n=>Math.sin(Math.PI*Tt(n));function fb(n,e,t,i){let r=Tt(n/120),s=cn.camera(Tt((n-120)/360)),o=n<120?1-Dt.contract*cn.camera(r):1-Dt.contract*(1-P2(120,480,n)),a=Ot(It.rest,It.dive,s);return i.copy(t).multiplyScalar(Dt.diveSlide*s),i.y+=(3-e)*(a-It.rest),o}function P2(n,e,t){let i=Tt((t-n)/(e-n));return i*i*(3-2*i)}function L2(n,e){let t=an[n],i=t.top+(t.bot-t.top)/3,r=t.top+(t.bot-t.top)*2/3,s=(Ct(i)+Ct(r))/2;return e.F.set(0,t.mid,s*Math.cos(Math.PI/t.n)),e.n.set(0,0,1),e}function eg(n,e,t={}){let i=Math.max(0,Math.min(6,e|0)),r=t.to||cf(i).id,s=!!t.first&&!t.D,o=Math.max(0,Math.min(1100,t.tb0||0)),a=t.D||(s?_e.diveFirst:_e.dive-o),l=_e.diveFirstScale,c=_e.diveFirstHold,u=1e3*l,d=s?we=>we<u?we/l:we<u+c?1e3:(we-c)/l:we=>o+we*(_e.dive-o)/a,h=s?we=>we<1e3?we*l:we*l+c:we=>(we-o)*a/(_e.dive-o),f=h(_e.diveSwapAt),g=ur(f,a),y=n.s,m=n.Q.clone(),p={F:new C,n:new C};nu.faceFrame&&Math.abs(y-1)<1e-6&&m.lengthSq()<1e-12&&!t.D?nu.faceFrame(i,p):L2(i,p);let b=p.F,S=p.n.normalize(),_=Math.hypot(b.x,b.z),A=Math.min(.3,.5*_),T=new C,R=fb(o,i,S,T),x=S.clone().multiplyScalar(Dt.diveSlide).add(b);x.y+=(3-i)*(It.dive-It.rest);let w=Gf(r,t.sub),I=(oe[r]||oe.CORE).fog,D=n.cam.pos.clone().sub(m).multiplyScalar(1/(y*R)).sub(T),F=n.cam.target.clone().sub(m).multiplyScalar(1/(y*R)).sub(T),z=[D],N=[0],V=[F],K=[0];D.distanceTo(b)>2.2&&o<480&&(z.push(b.clone().addScaledVector(S,2)),N.push(ur(h(480),a))),o<700&&(z.push(b.clone().addScaledVector(S,.4)),N.push(ur(h(700),a))),z.push(b.clone().addScaledVector(S,-A)),N.push(g),z.push(w.pos.clone().multiplyScalar(1/1e3)),N.push(1),o<480&&(V.push(b.clone()),K.push(ur(h(480),a))),V.push(b.clone().addScaledVector(S,-A-.6)),K.push(g),V.push(w.target.clone().multiplyScalar(1/1e3)),K.push(1);let J=Vf(z,N),j=Vf(V,K),Q=Math.max(0,h(Math.max(480,o))),ie=n.cam.fov,Ve=n.cam.offsetY,Ue=n.cam.roll,_t=n.fog,lt=n.alt,ot=n.rim,Y=n.pillar,te=n.fade.vin,be=n.cam.pos.distanceTo(n.cam.target),Ke=z[1].clone(),Ce=o<480?ur(h(480),a):-1,ge=[];for(let we=Math.max(o,860);we<=1120;we+=1e3/Ax)ge.push(ur(h(we),a));let ye=new C,Le=new C,$e=new C,wt=new C;return{kind:"DIVE",from:"CORE",to:r,duration:a,swapAt:g,swapKind:"grow",stratum:i,first:s,pose(we,Ae){let tt=qs(we,a),$t=d(tt);if(eu(Ae,!1),we<g){let Xt=fb($t,i,S,wt),O=ko(y,1e3,ui(we,Q,f,a));Ae.s=O,Ae.pivot.copy(x),Ae.Q.copy(m).addScaledVector(x,y-O),J.sample(we,ye).add(wt).multiplyScalar(Xt),tu(ye,O,y,m,x,Ae.cam.pos),o===0&&tt<3*fi.anticipationMs&&(vb(tt/a,Le.copy(D),Ke,$e,a,be),Ae.cam.pos.addScaledVector($e,O)),j.sample(we,ye).add(wt).multiplyScalar(Xt),tu(ye,O,y,m,x,Ae.cam.target);let wn=Math.log(O/y)/Math.log(1e3/y);Ae.fog=ko(_t,I,Tt(wn));let gt=1-ui(we,Q,f,a);Ae.fade.vin=te*gt,Ae.rim=ot*gt,Ae.pillar=Y*gt,Ae.shellFrom=gt,Ae.shellTo=0,Ae.morph.kind="dive",Ae.morph.i=i,Ae.morph.tMs=s?$t*l:$t,Ae.morph.D=s?_e.diveFirst:_e.dive}else{Ae.s=1,Ae.pivot.set(0,0,0),Ae.Q.set(0,0,0),J.sample(we,Ae.cam.pos).multiplyScalar(1e3),j.sample(we,Ae.cam.target).multiplyScalar(1e3),Ae.fog=I;let Xt=ui(we,f,a,a);for(let O=0;O<7;O++)Ae.vinStrata[O]=O===i?1:Xt;Ae.rim=0,Ae.pillar=Xt,Ae.shellFrom=0,Ae.shellTo=Xt}let Wt=ui(we,f,a,a);return Ae.cam.fov=Ot(ie,w.fov,Wt),Ae.cam.offsetY=Ot(Ve,w.offsetY,Wt),Ae.cam.roll=Ot(Ue,w.roll,Wt),Ae.alt=Ot(lt,(oe[r]||oe.CORE).alt,we),J0(Ae,tt,a,f),Ae.speed01=Q0(ui(we,Q*.5,f,a)),Ae},cues(we,Ae,tt){if(!(we<=Ae||!tt||!tt.audio)){Ce>=0&&Ae<Ce&&we>=Ce&&tt.audio.play("subDrop",{});for(let $t=0;$t<ge.length;$t++)if(Ae<ge[$t]&&we>=ge[$t]){tt.audio.play("strutTick",{});break}}}}}function tg(n,e,t={}){let i=t.D||_e.recall,r=i/_e.recall,s=_e.recallSwapAt*r,o=_e.depart*r,a=ur(s,i),l=Gf("CORE",null),c=n.s,u=n.Q.clone(),d=n.cam.pos.clone(),h=n.cam.target.clone(),f=1/1e3,g=d.clone().sub(l.pos).sub(u).multiplyScalar(1/(c-f)),y=l.target.clone(),m=n.cam.fov,p=n.cam.offsetY,b=n.cam.roll,S=n.fog,_=n.alt,A=n.rim,T=n.pillar,R=oe.CORE.fog,x=new C;return{kind:"RECALL",from:e,to:"CORE",duration:i,swapAt:a,swapKind:"shrink",pose(w,I){let D=qs(w,i);if(eu(I,!1),w<a){let F=ui(w,o,s,i),z=ko(c,f,F);I.s=z,I.pivot.copy(g),I.Q.copy(u).addScaledVector(g,c-z),I.cam.pos.copy(d),x.copy(y).multiplyScalar(z).add(I.Q),I.cam.target.copy(h).lerp(x,js(ui(w,o,s*.92,i))),I.cam.fov=Ot(m,l.fov,F),I.cam.offsetY=Ot(p,l.offsetY,F),I.cam.roll=Ot(b,0,F),I.fog=ko(S,R,Tt(Math.log(z/c)/Math.log(f/c))),I.fade.parent=ui(w,s*.55,s,i),I.vinGap=Ot(It.rest,It.recallStart,F),I.rim=A*(1-ui(w,0,o,i)),I.pillar=T,I.shellFrom=1,I.shellTo=0}else{I.s=1,I.pivot.set(0,0,0),I.Q.set(0,0,0),I.cam.pos.copy(l.pos),I.cam.target.copy(l.target),I.cam.fov=l.fov,I.cam.offsetY=l.offsetY,I.cam.roll=0,I.fog=R;let F=ui(w,s,i,i);I.rim=F,I.pillar=F,I.shellFrom=0,I.shellTo=F,I.morph.kind="recall",I.morph.i=3,I.morph.tMs=D/r,I.morph.D=_e.recall}return I.alt=Ot(_,0,w),J0(I,D,i,-1),I.speed01=Q0(ui(w,o,s,i)),I},cues(w,I,D){w<=I||!D||!D.audio||I<a&&w>=a&&D.audio.play("recallThud",{})}}}var pb=n=>n==="WORKSHOP"?"MEMBERS":n,zo=["ZENITH","SIGNAL","ARCHIVE","MEMBERS","CORE","VOYAGES","INSIGNIA","NADIR"];function ng(n,e,t,i={}){let r=i.D||xb(e,t),s=n.s,o=n.Q.clone(),a=j0(s,o,new C),l=n.cam.pos.clone().sub(o).multiplyScalar(1/s),c=n.cam.target.clone().sub(o).multiplyScalar(1/s),u=Gf(t,i.sub),d=gb(e,t),h=u.pos.y>l.y,f=h?1:-1,[g,,y]=gn.liftOffset,m=[l];i.vel&&i.vel.length()/s>1&&m.push(l.clone().addScaledVector(i.vel,.12/s));let p=-1,b=-1;if(d>=1){let ge=oe[pb(e)],ye=oe[pb(t)],Le=h?ge.ceil:ge.floor,$e=h?ye.floor:ye.ceil;!(Math.abs(l.x-g)<4&&Math.abs(l.z-y)<4)&&(Le-l.y)*f>-5&&(m.push(new C(g,Le,y)),p=m.length-1),p<0||Math.abs($e-Le)>2?(m.push(new C(g,$e,y)),b=m.length-1):b=p,p<0&&(p=b)}m.push(u.pos.clone());let S=[0],_=0;for(let ge=1;ge<m.length;ge++)_+=m[ge].distanceTo(m[ge-1]),S.push(_);for(let ge=0;ge<S.length;ge++)S[ge]=_>0?S[ge]/_:ge/(S.length-1);let A=Vf(m,S),T=p>=0?S[p]:.3,R=b>=0?S[b]:.7,x=n.cam.fov,w=n.cam.offsetY,I=n.cam.roll,D=n.fog,F={...n.fade},z=Float32Array.from(n.vinStrata),N=n.vinGap,V=n.rim,K=i.shellFrom0!=null?i.shellFrom0:1,$=n.morph.kind==="dive"?{i:n.morph.i,tMs:n.morph.tMs,D:n.morph.D}:null,J=(oe[t]||oe.CORE).fog,j=n.cam.pos.distanceTo(n.cam.target),Q=m[1].clone(),ie=Math.min(zo.indexOf(e==="WORKSHOP"?"MEMBERS":e),zo.indexOf(t==="WORKSHOP"?"MEMBERS":t)),Ve=Math.max(zo.indexOf(e==="WORKSHOP"?"MEMBERS":e),zo.indexOf(t==="WORKSHOP"?"MEMBERS":t)),Ue=[],_t=[],lt=new C,ot=new C,Y=ge=>{A.sample(0,lt);for(let ye=1;ye<=240;ye++){let Le=ye/240;if(A.sample(Le,ot),(lt.y-ge)*(ot.y-ge)<=0&&lt.y!==ot.y)return Le-1/240*((ot.y-ge)/(ot.y-lt.y));lt.copy(ot)}return-1};for(let ge=ie+1;ge<Ve;ge++){let ye=oe[zo[ge]],Le=Y(ye.alt);Le>=0&&Ue.push({room:ye.id,t0:qs(Le,r)})}for(let ge=ie;ge<Ve;ge++){let ye=oe[zo[ge]],Le=oe[zo[ge+1]],$e=Y((ye.floor+Le.ceil)/2);$e>=0&&_t.push($e)}let te=d>=1?[T,R]:[],be=new C,Ke=new C,Ce=new C;return{kind:"LIFT",from:e,to:t,duration:r,swapAt:-1,swapKind:null,boundaries:d,pose(ge,ye){let Le=qs(ge,r);eu(ye,!1);let $e=ko(s,1,ui(ge,0,r*.5,r));ye.s=$e,ye.pivot.copy(a),ye.Q.copy(o).addScaledVector(a,s-$e),A.sample(ge,be);let wt=be.y;Le<3*fi.anticipationMs&&(vb(Le/r,l,Q,Ke,r,j),be.add(Ke)),tu(be,$e,s,o,a,ye.cam.pos),d>=1?(Ce.set(0,wt+f*30,0),be.copy(c).lerp(Ce,js(T>0?ge/T:1)),be.lerp(u.target,js(R<1?(ge-R)/(1-R):0))):be.copy(c).lerp(u.target,js(ge)),tu(be,$e,s,o,a,ye.cam.target);let we=js(ge);ye.cam.fov=Ot(x,u.fov,we),ye.cam.offsetY=Ot(w,u.offsetY,we),ye.cam.roll=Ot(I,u.roll,we),ye.fog=ko(D,J,we);let Ae=ui(ge,0,_e.depart,r);ye.fade.mini=Ot(F.mini,0,Ae),ye.fade.key=Ot(F.key,1,Ae),ye.fade.vin=Ot(F.vin,1,Ae),ye.fade.parent=Ot(F.parent,0,Ae);for(let tt=0;tt<7;tt++)ye.vinStrata[tt]=Ot(z[tt],1,Ae);if(ye.vinGap=Ot(N,It.rest,Ae),ye.rim=V*(1-Ae),ye.shellFrom=Ot(K,1,Ae),ye.shellTo=1,$&&(ye.morph.kind="dive",ye.morph.i=$.i,ye.morph.D=$.D,ye.morph.tMs=$.tMs*(1-ui(ge,0,r*.6,r))),d>=1){let tt=q0(Le/_e.depart),$t=Le<r-300?1:1-q0((Le-(r-300))/300);h?(ye.iris.fromTop=tt,ye.iris.toBottom=$t):(ye.iris.fromBottom=tt,ye.iris.toTop=$t),ye.counter=Le>120&&Le<r-240?.12:0}ye.alt=(ye.cam.pos.y-ye.Q.y)/$e,ye.flashCode=null;for(let tt=0;tt<Ue.length;tt++)Le>=Ue[tt].t0&&Le<Ue[tt].t0+180&&(ye.flashCode=Ue[tt].room);return J0(ye,Le,r,-1),ye.speed01=Q0(ge),ye.pan=0,ye},cues(ge,ye,Le){if(!(ge<=ye||!Le||!Le.audio)){for(let $e=0;$e<te.length;$e++)ye<te[$e]&&ge>=te[$e]&&Le.audio.play("irisWhoosh",{});for(let $e=0;$e<_t.length;$e++)ye<_t[$e]&&ge>=_t[$e]&&Le.audio.play("tick",{})}}}}function yb(n,e){let t=_e.slice,i=_e.sliceSwap,r=e.room,s=Ys(n,Ja()),o=Gf(r,e.sub),a=j0(n.s,n.Q,new C),l=(oe[r]||oe.CORE).fog,c=ur(i,t);return{kind:"SLICE",from:null,to:r,duration:t,swapAt:-1,swapKind:null,cutAt:c,pose(u,d){return qs(u,t)<i?(Ys(s,d),d.exitU=0,d.enterU=0,d.counter=0,d.flashCode=null,d):(eu(d,r==="CORE"),d.s=1,d.pivot.copy(a),d.Q.set(0,0,0),d.cam.pos.copy(o.pos),d.cam.target.copy(o.target),d.cam.fov=o.fov,d.cam.offsetY=o.offsetY,d.cam.roll=o.roll,d.fog=l,d.alt=(oe[r]||oe.CORE).alt,d.shellFrom=0,d.shellTo=1,d.exitU=1,d.enterU=1,d)},cues(u,d,h){d<c&&u>=c&&h&&h.t0&&h.app&&h.app.tier==="T0"&&h.t0.show(e)}}}function _b(n,e,t,i={}){let r=t.room,s=K0(e,r),o=Math.max(_e.retargetMin,_e.retargetFactor*I2(s,e,r)),a;if(s==="DIVE"){let l=oe[Z0(r)].stratum;a=eg(n,l,{to:r,sub:t.sub,D:o,tb0:n.s>1.0001?480:0})}else s==="RECALL"?a=tg(n,e,{D:o}):a=ng(n,e,r,{sub:t.sub,D:o,vel:n.vel,shellFrom0:i.shellFrom0});return a.retarget=!0,a.from=e,a}var Xn=Ja(),fn=Ja(),Vo=Ja(),cg={pos:new C,target:new C,fov:35,offsetY:0,roll:0},Hf={pos:new C,target:new C,fov:35,offsetY:0,roll:0},_i={strata:new Float32Array([1,1,1,1,1,1,1]),gap:.02,rim:1,pillar:1,morph:"none"},Je=null,ds=null,iu={},Qa=null,rg=0,sg=0,$f=0,Zs="forward",Wf=0,ru=0,og=!1,ag=!1,qi=null,el=null,su=-1,ou=null,lu="",au=0,lg=new Set,ve={phase:"idle",path:null,from:null,to:null,u:0,t:0,speed:1,scrubbing:!1,swapped:!1},wb=(n,e)=>n&&typeof n[e]=="function",pn=(n,e,t,i,r)=>wb(n,e)?n[e](t,i,r):void 0;function D2(n){let e=Je.pillar;if(!e||_i.pillar===n)return;_i.pillar=n;let t=e.userData;if(t.ribbon&&t.ribbon.setAlpha(n),t.beads){t.beads.visible=n>.001;let i=t.beads.material;i.uniforms.uAlpha.value=n,i.transparent=n<.999}e.visible=n>.001}function N2(n){Je.rim&&_i.rim!==n&&(_i.rim=n,Je.rim.setAlpha(n))}function ug(n){if(!Je.renderer)return;Xe.scaleAbout(n.s,n.pivot),Ie.setPose(n.cam),n.fog>=0&&Tr.set(n.fog),vn.setFade(-1,n.fade.mini),vn.setFade(0,n.fade.key),vn.setFade(1,n.fade.vin),vn.setFade(2,n.fade.parent);let e=vn.structure(1);if(e){for(let r=0;r<7;r++)_i.strata[r]!==n.vinStrata[r]&&(_i.strata[r]=n.vinStrata[r],e.setStratumFade(r,n.vinStrata[r]));_i.gap!==n.vinGap&&(_i.gap=n.vinGap,e.setGap(n.vinGap))}Je.key&&(n.morph.kind!=="none"?Je.key.setMorph(n.morph.kind,n.morph.i,n.morph.tMs,n.morph.D):_i.morph!=="none"&&Je.key.setMorph("none",3,0,1),_i.morph=n.morph.kind),N2(n.rim),D2(n.pillar);let t=ve.to?rt.shell(ve.to.room):null,i=qi?rt.shell(qi):null;i&&i!==t&&(i.setAlpha(n.shellFrom),i.setIris("top",n.iris.fromTop),i.setIris("bottom",n.iris.fromBottom)),t&&(t.setAlpha(n.shellTo),t.setIris("top",n.iris.toTop),t.setIris("bottom",n.iris.toBottom))}function O2(){F2(fn),Je.renderer&&(fn.cam.pos.copy(Ie.pose.pos),fn.cam.target.copy(Ie.pose.target),fn.cam.fov=Ie.pose.fov,fn.cam.offsetY=Ie.pose.offsetY,fn.cam.roll=Ie.pose.roll,fn.s=Xe.s,fn.Q.copy(Xe.Q),Xe.fixedPoint(fn.pivot),fn.fog=Tr.density,fn.fade.mini=vn.fade(-1),fn.fade.key=vn.fade(0),fn.fade.vin=vn.fade(1),fn.fade.parent=vn.fade(2),fn.vel.copy(Ie.velocity)),fn.alt=Rn.altitude()}function F2(n){n.vinStrata.set(_i.strata),n.vinGap=_i.gap,n.rim=_i.rim,n.pillar=_i.pillar,n.morph.kind="none",n.exitU=0,n.enterU=0,n.counter=0,n.flashCode=null,n.shellFrom=1,n.shellTo=0,n.iris.fromTop=n.iris.fromBottom=n.iris.toTop=n.iris.toBottom=0}function tl(){let n=Rn.current||{room:"CORE",sub:null};rt.restPose(n.room,n.sub,cg)}function U2(n){hg();let e=n==="LIFT"?"liftRumble":n==="DIVE"||n==="RECALL"?"whoosh":null;e&&Je.audio&&(el=Je.audio.start(e,{speed01:0}))}function hg(){if(el){try{el.stop()}catch{}el=null}}function B2(){let n=document.getElementById("fx");if(!n)return;let e=document.createElement("i");e.className="slice",n.appendChild(e),ct(_e.slice+40,()=>{e.parentNode&&e.parentNode.removeChild(e)})}function Eb(n,e,t,i){if(Jt.reducedMotion||ee.tier==="T0")return yb(n,t);if(i)return _b(n,i,t,{shellFrom0:n.shellTo});let s=rt.get(t.room);if(wb(s,"entryPath")){let a=rt.call(t.room,"entryPath",e.room,n);if(a)return a}let o=K0(e.room,t.room);if(o==="DIVE"){let a=t.room==="WORKSHOP"?"MEMBERS":t.room==="ZENITH"?"SIGNAL":t.room;return eg(n,oe[a].stratum,{first:!(W.data&&W.data.firstDive),fromUnfold:!!ee.unfolded,sub:t.sub,to:t.room})}return o==="RECALL"?tg(n,e.room):ng(n,e.room,t.room,{sub:t.sub})}function Ab(n,e,t,i){ve.path=n,ve.from=e,ve.to=t,ve.t=0,ve.u=0,ve.speed=1,ve.swapped=!1,ve.phase="transition",ve.scrubbing=!!i.scrub,ru=0,Zs="forward",rg=0,sg=de.now,$f=de.now,og=!1,Qa=null,ag=!0,iu=i,ee.u=0,n.kind==="SLICE"&&B2(),U2(n.kind),Se.emit("travel:start",{from:e,to:t,kind:n.kind,duration:n.duration})}function Tb(n){let e=rt.group(n);if(!(!e||!Je.renderer||!Ie.camera))try{Je.renderer.three.compile(e,Ie.camera,Je.scene)}catch{}}function Mb(n,e){let t=Rn.current;O2(),rt.ensure(n.room),Tb(n.room),qi=t.room;let i=Eb(fn,t,n,null);return zi("transition"),rt.call(t.room,"depart"),pn(Je.datum,"depart"),Je.renderer&&vn.setHallLod(null),Se.emit("room:depart",{room:t.room,to:n}),Ab(i,t,n,e),new Promise(r=>{ds=r})}function Rb(){let n=ve.path;if(!n)return ee.room;let e=qi||ve.from&&ve.from.room||ee.room,t=ve.to.room;if(n.swapAt>=0)return ve.swapped?t:e;if(n.kind==="SLICE")return ve.u>=(n.cutAt||.5)?t:e;if(n.kind!=="LIFT")return ve.u<.5?e:t;let i=fn.alt;for(let o of[e,t]){let a=oe[o];if(a&&i>=a.floor&&i<=a.ceil)return o}let r=e,s=1/0;for(let o of bn.concat(["ZENITH"])){let a=oe[o],l=i<a.floor?a.floor-i:i>a.ceil?i-a.ceil:0;l<s&&(s=l,r=o)}return r}function k2(n,e){let t=Rb(),i=ve.to.room,r=qi;if(ds){let a=ds;ds=null,a(!1)}Se.emit("travel:end",{from:ve.from,to:ve.to,kind:ve.path.kind,completed:!1}),t===i&&i!==n.room&&(rt.call(i,"depart"),rt.call(i,"exit",1)),qi=t,rt.ensure(n.room),Tb(n.room);for(let a of rt.residents())a!==n.room&&a!==t&&a!==r&&rt.release(a);r&&r!==t&&r!==n.room&&(rt.call(r,"exit",1),dg(r)),Ys(fn,Vo),Je.renderer&&(Vo.vel.copy(Ie.velocity),Vo.Q.copy(Xe.Q),Vo.s=Xe.s);let s={room:t,sub:null,hash:`#/${oe[t].slug}`},o=Eb(Vo,s,n,t);return Qa=null,Ab(o,s,n,e),new Promise(a=>{ds=a})}function dg(n){ct(_e.releaseSourceMs,()=>{n===ee.room&&ve.phase!=="transition"||ve.phase==="transition"&&(ve.to.room===n||qi===n)||rt.release(n)})}function fg(n,e,t){let i=n.hash;try{let r=location.hash;e==="history"?r!==i&&!(r===""&&i==="#/core")&&window.history.replaceState(null,"",i):t||e==="hash"||e==="go"||e==="deeplink"||r===i?window.history.replaceState(null,"",i):window.history.pushState(null,"",i)}catch{}lu=location.hash}function z2(){let n=ve.path,e=ve.from,t=ve.to;n.pose(1,Xn),ug(Xn),Ys(Xn,fn),hg();let i=!lg.has(t.room);lg.add(t.room),au+=1,ee.room=t.room,ee.route=t,ee.u=0,Rn.current=t,ve.phase="idle",ve.scrubbing=!1,ve.u=0;let r=n.kind;Je.renderer&&vn.setHallLod(t.room),rt.show(t.room,!0),rt.call(t.room,"enter",1),zi("idle"),rt.call(t.room,"arrive",{first:i,sub:t.sub,kind:r,arrivals:au});let s=t;t.sub&&rt.call(t.room,"setSub",t.sub,{instant:!0})===!1&&(s=Cr(`#/${oe[t.room].slug}`),Rn.current=s,ee.route=s,iu={...iu,replace:!0}),pn(Je.datum,"counter",oe[t.room].alt,0),pn(Je.datum,"flashCode",null),pn(Je.datum,"arrive",t.room),pn(Je.chrome,"setRoom",t.room),pn(Je.keyNav,"setNeedle",oe[t.room].alt),pn(Je.keyNav,"setCurrent",t.room),pn(Je.keyNav,"lockTwin"),Je.audio&&Je.audio.play("arrivalLock",{root:oe[t.room].root}),pn(Je.edges,"twitch"),fe.isPhone&&Pr(Ir.lock),document.title=Nc(s),fg(s,iu.source,!!iu.replace),W.set("lastRoom",s.hash),r==="DIVE"&&W.data&&!W.data.firstDive&&W.set("firstDive",!0),tl(),Rn.lastTravel={kind:r,from:e.hash,to:s.hash,plannedMs:n.duration,ms:de.now-$f,completed:!0},ve.path=null,Se.emit("room:arrive",{room:t.room,sub:s.sub,first:i,kind:r,arrivals:au}),Se.emit("route:change",{route:s,prev:e}),Se.emit("travel:end",{from:e,to:s,kind:r,completed:!0}),ee.tier==="T0"&&Je.t0&&pn(Je.t0,"show",s);for(let a of rt.residents())a!==t.room&&dg(a);let o=ds;ds=null,o&&o(!0)}function V2(){let n=ve.path,e=ve.from,t=ve.to;n.pose(0,Xn),ug(Xn),Ys(Xn,fn),hg(),ve.phase="idle",ve.scrubbing=!1,ve.u=0,ee.u=0;let i=qi||e.room;Je.renderer&&vn.setHallLod(i),rt.call(i,"exit",0),rt.show(i,!0),zi("idle"),rt.call(i,"arrive",{first:!1,sub:Rn.current.sub,kind:"REVERT",arrivals:au}),pn(Je.datum,"counter",oe[i].alt,0),pn(Je.datum,"arrive",i),pn(Je.keyNav,"setNeedle",oe[i].alt),pn(Je.keyNav,"setCurrent",i),Rn.lastTravel={kind:n.kind,from:e.hash,to:t.hash,plannedMs:n.duration,ms:de.now-$f,completed:!1},ve.path=null,Se.emit("travel:end",{from:e,to:t,kind:n.kind,completed:!1}),t.room!==i&&dg(t.room),tl();let r=ds;ds=null,r&&r(!1)}var ig={speed01:0,pan:0};function bb(n){let e=ve.path;e.swapAt>=0&&(!ve.swapped&&n>=e.swapAt?(Je.renderer&&(e.pose(Math.max(0,e.swapAt-1e-6),Vo),Xe.scaleAbout(e.swapKind==="grow"?1e3:.001,Vo.pivot),Qa=Xe.rebase(e.swapKind)),ve.swapped=!0):ve.swapped&&n<e.swapAt&&(Qa&&Je.renderer&&Xe.unrebase(Qa),Qa=null,ve.swapped=!1)),e.pose(n,Xn),ug(Xn),qi&&qi!==ve.to.room&&rt.call(qi,"exit",Xn.exitU),rt.call(ve.to.room,"enter",Xn.enterU),pn(Je.keyNav,"setNeedle",Xn.alt),Je.audio&&Je.audio.setRootU(ve.from.room,ve.to.room,n),pn(Je.datum,"counter",Xn.alt,Xn.counter),pn(Je.datum,"flashCode",Xn.flashCode),el&&(ig.speed01=Xn.speed01,ig.pan=Xn.pan,el.set(ig)),e.cues&&e.cues(n,rg,Je),!og&&n>=_e.interactiveU&&(og=!0,rt.show(ve.to.room),Se.emit("travel:interactive",{to:ve.to})),ee.u=n,ve.u=n,rg=n,Ys(Xn,fn)}function G2(n){if(!Je.renderer||ee.phase==="boot"||ee.phase==="start")return;let e=ee.room,t=rt.get(e);if(t&&typeof t.livePose=="function"&&rt.call(e,"livePose",Hf,n)===!0){let i=oe[e].anchor;Hf.pos.add(i),Hf.target.add(i),Ie.setPose(Hf);return}Ie.setPose(cg)}function H2(n){let e=de.now,t=e-sg;if(sg=e,ag&&(t=0,ag=!1,$f=e),ve.phase!=="transition"){G2(n);return}let i=ve.path.duration,r;if(ve.scrubbing)r=ru;else if(Zs==="inertia")r=Tt(ve.u+Wf*t/1e3),Wf*=Math.pow(fi.inertiaDecay,t/fi.frameMs),(Math.abs(Wf)<.05||r<=0||r>=1)&&(Zs=r<.5?"reverse":"forward",ve.t=qs(r,i));else if(Zs==="reverse"){if(ve.t=Math.max(0,ve.t-t*ve.speed),r=cn.camera(ve.t/i),ve.t<=0){bb(0),V2();return}}else ve.t=Math.min(i,ve.t+t*ve.speed),r=cn.camera(ve.t/i);bb(r),!ve.scrubbing&&Zs==="forward"&&ve.t>=i&&z2()}function Xf(){if(su>=0&&(Vn(su),su=-1),ou){let n=ou;ou=null,n(!1)}}function Sb(n,e,t){Rn.current=n,ee.route=n,fg(n,t.source,!!t.replace),document.title=Nc(n),W.set("lastRoom",n.hash),tl(),Se.emit("route:change",{route:n,prev:e}),ee.tier==="T0"&&Je.t0&&pn(Je.t0,"show",n)}function W2(n,e){Xf();let t=Rn.current,i=rt.call(n.room,"setSub",n.sub,{instant:Jt.reducedMotion});if(i===!1||i===void 0){let r=Cr(`#/${oe[n.room].slug}`);return t.sub&&rt.call(n.room,"setSub",null,{instant:!0}),Sb(r,t,{...e,replace:!0}),Promise.resolve(!0)}return new Promise(r=>{ou=r,su=ct(Math.max(0,+i||0),()=>{su=-1,ou=null,Sb(n,t,e),r(!0)})})}function X2(){lu=location.hash,Rn.go(location.hash,{source:"history"})}function $2(){location.hash!==lu&&(lu=location.hash,Rn.go(location.hash,{source:"hash"}))}var Rn={state:ve,current:null,lastTravel:null,init(n){return Je=n,n.director=Rn,n.halls=rt,mb({restPose:(e,t,i)=>rt.restPose(e,t,i),faceFrame:n.key?(e,t)=>n.key.faceFrame(e,t):null}),Rn.current=Cr("#/core"),ee.room="CORE",ee.route=Rn.current,lg.add("CORE"),lu=location.hash,de.add(H2,Nt.DIRECTOR),window.addEventListener("popstate",X2),window.addEventListener("hashchange",$2),Se.on("layout:change",tl),rt.ensure("CORE"),rt.show("CORE",!0),tl(),n.renderer&&ee.phase!=="boot"&&ee.phase!=="start"&&Ie.setPose(cg),Rn},settle(){ve.phase==="transition"||ee.room!=="CORE"||(tl(),rt.call("CORE","enter",1),rt.call("CORE","arrive",{first:!0,sub:null,kind:"BOOT",arrivals:au}),pn(Je.chrome,"setRoom","CORE"),pn(Je.keyNav,"setCurrent","CORE"),pn(Je.keyNav,"setNeedle",0))},go(n,e={}){try{let t=e.source||"go",i={...e,source:t},r=b0(Cr(n),t);r.status&&pn(Je.status,"say",r.status,r.vars||{}),r.shudder&&(pn(Je.keyNav,"shudder",r.shudder),ee.room==="CORE"&&ve.phase!=="transition"&&Je.key&&Je.key.shudder(6));let s=r.route;if(ve.phase==="transition")return s.hash===ve.to.hash?new Promise(a=>{Se.once("travel:end",l=>a(!!l.completed))}):(Xf(),k2(s,i));let o=Rn.current;return s.hash===o.hash?(Xf(),location.hash&&location.hash!==s.hash&&fg(s,"history",!0),Promise.resolve(!0)):s.room===o.room?W2(s,i):(Xf(),Mb(s,i))}catch{return Promise.resolve(!1)}},speedUp(){ve.phase==="transition"&&!ve.scrubbing&&Zs==="forward"&&(ve.speed=_e.skipSpeed)},scrub:{begin(n){if(Jt.reducedMotion||ee.tier==="T0"||!Je.renderer)return!1;if(ve.phase==="transition")return ve.scrubbing=!0,ru=ve.u,Zs="forward",!0;let e=b0(Cr(n),"nav").route;return e.room===Rn.current.room?!1:(Mb(e,{source:"nav",scrub:!0}),!0)},set(n){ve.phase==="transition"&&ve.scrubbing&&(ru=Tt(n))},end(n=0){ve.phase!=="transition"||!ve.scrubbing||(ve.scrubbing=!1,ve.u=ru,ve.speed=1,Wf=n||0,Zs="inertia")}},altitude(){return ve.phase==="transition"?fn.alt:(oe[ee.room]||oe.CORE).alt},busy(){return ve.phase==="transition"},logicalSource(){return ve.phase==="transition"?qi:null},logicalRoom(){return ve.phase==="transition"?Rb():ee.room}};var pg=0;function Y2(n,e){let t=e==null?n.textContent:String(e);n.textContent="";let i=[];for(let r of t){let s=document.createElement("span");s.className="lock-letter",s.textContent=r,n.appendChild(s),i.push(s)}return i}function mg(n,e){return n.style.opacity="0",Fn(e,t=>{n.style.opacity=String(t)},cn.reveal).done.then(()=>{n.style.opacity=""})}function Cb(n,e={}){if(!n)return Promise.resolve();let t=e.weight||220,i=e.ms||_e.lockIn;if(Jt.reducedMotion)return mg(n,_e.lockInReduced);if(pg>=2)return Promise.resolve();pg+=1;let r=n.textContent,s=Y2(n,r),o=W.shrp||28,a=-1,l=c=>{let u=cn.reveal(c),d=Math.round(u*5)/5,h=d!==a?`"SHRP" ${(o*d).toFixed(1)}, "wght" ${Math.round(120+(t-120)*d)}, "CRSV" 0, "slnt" 0`:null;a=d;let f=de.now/1e3;for(let g=0;g<s.length;g++){let y=s[g].style;h&&(y.fontVariationSettings=h),y.transform=u<1?`translateX(${(Math.sin(17*f+g)*(1-u)*4).toFixed(2)}px)`:""}};return l(0),Fn(i,l).done.then(()=>{pg-=1,n.textContent===r&&(n.textContent=r)})}function Ib(n,e={}){if(!n)return Promise.resolve();let t=e.msPerChar||_e.revealMsPerChar,i=e.maxMs||_e.revealMax;if(Jt.reducedMotion)return mg(n,_e.lockInReduced);let r=Math.min(i,Math.max(1,n.textContent.length*t));n.classList.add("reveal-mask");let s=o=>{n.style.setProperty("--reveal",`${(o*108).toFixed(1)}%`),n.style.opacity=String(Math.min(1,o*2))};return s(0),Fn(r,s).done.then(()=>{n.classList.remove("reveal-mask"),n.style.removeProperty("--reveal"),n.style.opacity=""})}function Pb(n,e,t={}){if(!n)return Promise.resolve();let i=t.cps||_e.beamCps;if(Jt.reducedMotion)return n.textContent=String(e),mg(n,_e.lockInReduced);n.textContent="";let r=[];for(let c of String(e)){let u=document.createElement("span");u.className="beam-letter",u.textContent=c,n.appendChild(u),r.push(u)}let s=document.getElementById("fx"),o=document.createElement("i");o.className="beam-head",s&&s.appendChild(o);let a=r.map(c=>c.getBoundingClientRect()),l=1e3/i;return new Promise(c=>{let u=0,d=()=>{if(u>=r.length){ct(160,()=>{o.parentNode&&o.parentNode.removeChild(o)}),c();return}let h=a[u];o.style.transform=`translate3d(${(h.right-1.5).toFixed(1)}px, ${(h.bottom-h.height*.2).toFixed(1)}px, 0)`,r[u].classList.add("is-lit"),u+=1,ct(l,d)};d()})}var et={datum:null,line:null,label:null,title:null,level:null,flash:null,giant:null},yg=null,gg=!1,cu="CORE",uu=!1,Lb=null,Yf="",_g=0,Db=new C,Nb=new C,Ob=new C,Mg=!1;function nl(n,e,t,i){let r=document.createElement(n);return r.id=e,t&&(r.className=t),i.appendChild(r),r}function xg(){return yg??(oe[cu]||oe.CORE).giant}function vg(n){et.giant&&et.giant.textContent!==n&&(et.giant.textContent=n)}function q2(){if(!et.giant||!Ie.camera||uu)return;Mg||(Db.copy(Ie.camera.position),Mg=!0),Nb.setFromMatrixColumn(Ie.camera.matrixWorld,0);let n=Math.max(.001,Ob.copy(Ie.pose.target).sub(Ie.camera.position).length()),e=Ob.copy(Ie.camera.position).sub(Db).dot(Nb)*Ie.camera.zoom*(fe.h/(2*Math.tan(Ie.camera.fov*Math.PI/360)))/n,t=Math.max(-200,Math.min(200,-.25*e));Math.abs(t-_g)<.25||(_g=t,et.giant.style.transform=`translate3d(${t.toFixed(1)}px,-50%,0)`)}var hu={init(n){let e=document.getElementById("frame");return et.giant=document.getElementById("giant"),e&&(et.datum=document.getElementById("datum")||nl("div","datum","",e),et.datum.classList.add("is-out"),et.line=nl("i","datum-line","",et.datum),et.label=nl("p","datum-label","t-label",et.datum),et.title=nl("h1","datum-title","t-display",et.datum),et.level=nl("p","datum-level","t-micro",et.datum),et.flash=nl("p","datum-flash","t-label",e),et.flash.setAttribute("aria-hidden","true"),de.add(q2,Nt.UI)),hu},arrive(n,e={}){cu=oe[n]?n:"CORE";let t=oe[cu];if(!et.datum)return;let i=cu==="NADIR"&&W.data&&W.data.nadirOpen;et.title.textContent=i&&t.titleOpen?t.titleOpen:t.title,et.title.dataset.room=cu,et.label.textContent=`${t.num} · ${t.code}`,et.level.textContent=`▽ ${t.level}`,et.datum.classList.remove("is-out"),et.datum.classList.remove("is-drawn");let r=()=>{et.datum.classList.add("is-drawn")};e.instant?r():requestAnimationFrame(r),e.instant||Cb(et.title,{weight:220,ms:480}),uu=!1,Yf="",Mg=!1,_g=0,et.giant&&(et.giant.classList.remove("is-counter"),et.giant.style.transform="",vg(xg()),et.giant.classList.add("is-in"),gg?et.giant.dataset.electrum="":delete et.giant.dataset.electrum)},depart(){et.datum&&et.datum.classList.add("is-out"),et.giant&&et.giant.classList.remove("is-in")},setGiant(n,e={}){yg=n==null?null:String(n),gg=!!e.electrum,!(!et.giant||uu)&&(vg(xg()),gg?et.giant.dataset.electrum="":delete et.giant.dataset.electrum)},counter(n,e){if(!et.giant)return;let t=e>0;if(t!==uu&&(uu=t,et.giant.classList.toggle("is-counter",t),t?et.giant.style.transform="":(Yf="",vg(xg()))),!t)return;let i=Cx(Math.round(n),0);i!==Yf&&(Yf=i,et.giant.textContent=i)},flashCode(n){if(!(!et.flash||n===Lb))if(Lb=n,n&&oe[n]){let e=oe[n];et.flash.textContent=`${e.num} · ${e.code}`,et.flash.classList.add("is-on")}else et.flash.classList.remove("is-on")},yPx(){return fe.kind==="desktop"?fe.h*dt.desktop.datumFrac:dt.phone.datumPx+fe.safe.t},setVisible(n){et.datum&&(et.datum.hidden=!n),et.giant&&(et.giant.hidden=!n)}};var zb="http://www.w3.org/2000/svg",ni=[],Go=null,qf=null,bg=new C,Sg=new C,il={x:0,y:0,depth:0,visible:!1},Fb=0,jf=new Float64Array(64);function Ub(n,e,t){let i=document.createElementNS(zb,n);return i.setAttribute("class",e),i.dataset.owner=t,i}var Bb=n=>`${n<0?"−":n>0?"+":""}${Math.abs(n).toFixed(2)}`;function j2(n){let e=n.leader||(n.focused?{side:"right",len:40,rise:-24}:null);if(!e||!n.path)return;let t=e.side==="left"?-1:1,i=e.rise||0,r=n.sx+t*Math.abs(i),s=n.sy+i,o=r+t*Math.max(dt.leader.elbowMin,Math.min(dt.leader.runMax,e.len||40));n.path.setAttribute("d",`M${n.sx.toFixed(1)} ${n.sy.toFixed(1)}L${r.toFixed(1)} ${s.toFixed(1)}L${o.toFixed(1)} ${s.toFixed(1)}`),n.endX=o+t*6,n.endY=s}function du(n,e){if(n.shown===e)return;n.shown=e;let t=e&&(n.el||n.focused);n.el&&n.el.classList.toggle("is-hidden",!e),n.button&&n.button.classList.toggle("is-hidden",!e),n.path&&n.path.classList.toggle("is-hidden",!(t&&(n.leader||n.focused))),n.cross&&n.cross.classList.toggle("is-hidden",!(t&&(n.crossOn||n.focused))),n.coordEl&&n.coordEl.classList.toggle("is-hidden",!(e&&n.coordOn))}function kb(n){let e=n.shown;n.shown=!e,du(n,e)}function Z2(n){if(!Ie.camera)return;let e=1-Math.exp(-(n*1e3)/120),t=de.now-Fb>=1e3/_e.coordHz;t&&(Fb=de.now);let i=0;for(let s=0;s<ni.length;s++){let o=ni[s];o.get(bg),Ie.project(bg,il);let a=il.depth>0||!o.hideBehind;if(o.want=o.visible&&a,!!o.want){if(i++,!o.init||o.lowpass<=0)o.sx=il.x,o.sy=il.y,o.init=!0;else{let l=o.lowpass===120?e:1-Math.exp(-(n*1e3)/o.lowpass);o.sx+=(il.x-o.sx)*l,o.sy+=(il.y-o.sy)*l}o.screen.x=o.sx,o.screen.y=o.sy,t&&o.coordEl&&(Xe.toCanonical(bg,Sg),o.coordEl.textContent=`x ${Bb(Sg.x)} · y ${Bb(Sg.y)}`)}}let r=-1/0;if(i>hr.max){jf.length<ni.length&&(jf=new Float64Array(ni.length*2));let s=0;for(let a=0;a<ni.length;a++)ni[a].want&&(jf[s++]=ni[a].priority);r=jf.subarray(0,s).sort()[s-hr.max]}hr.visibleCount=0;for(let s=0;s<ni.length;s++){let o=ni[s],a=o.want&&(o.priority>=r||o.focused);if(o.screen.visible=a,du(o,a),!a||(hr.visibleCount++,Math.abs(o.sx-o.wx)<.1&&Math.abs(o.sy-o.wy)<.1))continue;o.wx=o.sx,o.wy=o.sy;let l=o.sx.toFixed(1),c=o.sy.toFixed(1);if(o.button&&(o.button.style.transform=`translate3d(${l}px,${c}px,0)`),o.cross&&o.cross.setAttribute("transform",`translate(${l} ${c})`),o.coordEl&&(o.coordEl.style.transform=`translate3d(${(o.sx+8).toFixed(1)}px,${(o.sy+6).toFixed(1)}px,0)`),j2(o),o.el){let u=o.path&&(o.leader||o.focused)?o.endX:o.sx,d=o.path&&(o.leader||o.focused)?o.endY:o.sy,h=o.leader&&o.leader.side==="left";o.el.style.transform=`translate3d(${u.toFixed(1)}px,${d.toFixed(1)}px,0) translate(${h?"-100%":"0"},-50%)`}}}var hr={max:24,visibleCount:0,init(n){Go=document.getElementById("overlay"),qf=document.getElementById("leaders");let e=()=>n.app.tier==="T1"||fe.isPhone?dt.leader.maxAnchorsLow:dt.leader.maxAnchors;return hr.max=e(),n.bus.on("tier:change",()=>{hr.max=e()}),n.bus.on("layout:change",()=>{hr.max=e();for(let t of ni)t.wx=NaN}),de.add(Z2,Nt.OVERLAY),hr},add(n){let e=String(n.owner||"anon"),t={owner:e,id:n.id!=null?String(n.id):null,get:n.get,leader:n.leader||null,crossOn:n.cross!=null?!!n.cross:!!n.leader,coordOn:!!n.coord,priority:n.priority||0,lowpass:n.lowpass!=null?n.lowpass:_e.labelLowpass,hideBehind:n.hideBehind!==!1,visible:!0,want:!1,shown:!0,focused:!1,init:!1,sx:0,sy:0,wx:NaN,wy:NaN,endX:0,endY:0,screen:{x:0,y:0,visible:!1},el:n.el||null,button:null,path:null,cross:null,coordEl:null};if(t.el&&(t.el.classList.add("anchor"),n.scrim!==!1&&t.el.classList.add("scrim"),t.el.dataset.owner=e,t.id&&(t.el.dataset.id=t.id),Go&&Go.appendChild(t.el)),qf){t.path=Ub("path","leader",e),t.path.setAttribute("pathLength","1"),t.cross=Ub("g","cross",e);for(let[s,o,a,l]of[[-3.5,0,3.5,0],[0,-3.5,0,3.5]]){let c=document.createElementNS(zb,"line");c.setAttribute("x1",s),c.setAttribute("y1",o),c.setAttribute("x2",a),c.setAttribute("y2",l),t.cross.appendChild(c)}qf.appendChild(t.path),qf.appendChild(t.cross)}t.coordOn&&Go&&(t.coordEl=document.createElement("span"),t.coordEl.className="t-micro coord",Go.appendChild(t.coordEl));let i=s=>{t.focused=s,t.cross&&t.cross.classList.toggle("focus",s),t.path&&t.path.classList.toggle("focus",s),t.wx=NaN,kb(t)};if(n.button&&Go){let s=document.createElement("button");s.type="button",s.className="proxy",s.dataset.owner=e,t.id&&(s.dataset.id=t.id),s.setAttribute("aria-label",n.button.label||""),n.button.size&&n.button.size>44&&(s.style.width=`${n.button.size}px`,s.style.height=`${n.button.size}px`,s.style.margin=`${-n.button.size/2}px 0 0 ${-n.button.size/2}px`);let o=n.button;s.addEventListener("click",()=>{typeof t.onActivate=="function"&&t.onActivate()}),s.addEventListener("focus",()=>{i(!0),t.onFocus&&t.onFocus()}),s.addEventListener("blur",()=>{i(!1),t.onBlur&&t.onBlur()}),t.onActivate=o.onActivate,t.onFocus=o.onFocus||null,t.onBlur=o.onBlur||null,Go.appendChild(s),t.button=s}t.shown=!1,du(t,!1),du(t,!0),ni.push(t);let r={el:t.el,button:t.button,screen:t.screen,setVisible(s){t.visible=!!s,s||du(t,!1)},setAlpha(s){let o=String(Math.max(0,Math.min(1,s)));t.el&&(t.el.style.opacity=o),t.path&&(t.path.style.opacity=o)},drawIn(s=_e.leaderDraw){return t.el&&t.el.classList.add("is-pending"),t.path&&(t.path.classList.remove("is-drawing"),t.path.style.strokeDasharray="1",t.path.style.strokeDashoffset="1"),new Promise(o=>{requestAnimationFrame(()=>{t.path&&(t.path.classList.add("is-drawing"),t.path.style.transitionDuration=`${s}ms`,t.path.style.strokeDashoffset="0"),ct(s,()=>{t.el&&t.el.classList.remove("is-pending"),o()})})})},update(s){"leader"in s&&(t.leader=s.leader||null),"cross"in s&&(t.crossOn=!!s.cross),"coord"in s&&(t.coordOn=!!s.coord),s.button&&t.button&&(s.button.label!=null&&t.button.setAttribute("aria-label",s.button.label),s.button.onActivate&&(t.onActivate=s.button.onActivate)),"priority"in s&&(t.priority=s.priority||0),t.wx=NaN,kb(t)},remove(){let s=ni.indexOf(t);s>=0&&ni.splice(s,1);for(let o of[t.el,t.button,t.path,t.cross,t.coordEl])o&&o.parentNode&&o.parentNode.removeChild(o)}};return t.api=r,r},clear(n){for(let e=ni.length-1;e>=0;e--)ni[e].owner===n&&ni[e].api.remove()}};var Eg=new Set,Cn=null,wg=null,rl=null,Ur=null,un={id:-1,y0:0,t0:0,y:0,t:0,h:0,base:0,moved:!1};function sl(n){if(ji.state!==n){ji.state=n,Cn&&(Cn.dataset.state=n);for(let e of Eg)try{e(n)}catch{}}}function K2(n,e){return n==="full"?0:n==="peek"?Math.max(0,e-120):e}function J2(n){if(ji.state==="closed"||un.id>=0||fe.kind==="phone-land"||ji.state==="full"&&Ur&&Ur.contains(n.target)&&Ur.scrollTop>0)return;let e=Cn.getBoundingClientRect();un.id=n.pointerId,un.y0=un.y=n.clientY,un.t0=un.t=n.timeStamp,un.h=e.height,un.base=K2(ji.state,e.height),un.moved=!1}function Q2(n){if(n.pointerId!==un.id)return;let e=n.clientY-un.y0;if(!un.moved&&Math.abs(e)<yi.SLOP_PX)return;if(!un.moved){un.moved=!0,Cn.classList.add("is-dragging");try{Cn.setPointerCapture(n.pointerId)}catch{}}un.y=n.clientY,un.t=n.timeStamp;let t=Math.max(0,Math.min(un.h,un.base+e));Cn.style.transform=`translateY(${t.toFixed(1)}px)`}function Vb(n){if(n.pointerId!==un.id||(un.id=-1,!un.moved))return;Cn.classList.remove("is-dragging"),Cn.style.transform="";let e=un.y-un.y0,t=e/Math.max(1,un.t-un.t0);(Math.abs(e)>=40||Math.abs(t)>=yi.SWIPE_V)&&(e>0?sl(ji.state==="full"?"peek":"closed"):ji.state==="peek"&&sl("full"))}var ji={state:"closed",init(n){let e=document.getElementById("sheets");return e&&(Cn=document.createElement("section"),Cn.id="sheet",Cn.className="sheet",Cn.dataset.state="closed",wg=document.createElement("div"),wg.className="sheet-handle",rl=document.createElement("div"),rl.className="sheet-peek",Ur=document.createElement("div"),Ur.className="sheet-body",Cn.append(wg,rl,Ur),e.appendChild(Cn),Cn.addEventListener("pointerdown",J2),Cn.addEventListener("pointermove",Q2),Cn.addEventListener("pointerup",Vb),Cn.addEventListener("pointercancel",Vb)),ji},set(n,e={}){if(Cn){if(rl.textContent="",Ur.textContent="",Ur.scrollTop=0,e.peek&&rl.appendChild(e.peek),n&&Ur.appendChild(n),!n&&!e.peek){sl("closed");return}sl(e.state==="full"?"full":e.state==="closed"?"closed":"peek")}},open(n="peek"){Cn&&(rl.firstChild||Ur.firstChild)&&sl(n==="full"?"full":"peek")},close(){sl("closed")},onChange(n){return Eg.add(n),()=>Eg.delete(n)}};var Ag="http://www.w3.org/2000/svg",Tg=new Float32Array(8),Pg=new Float32Array(8),al=null,fu=[],Zf=0,Gb=-1e9,Rg=!1,Wb=!0,Kf=0,Jf=null,Cg=null,ep=null;function ol(n,e,t,i,r){let s=document.createElement(n);return e&&(s.className=e),r&&(s.id=r),t!=null&&(s.textContent=t),i&&i.appendChild(s),s}var Ig=n=>String(n).padStart(2,"0");function Qf(n){let e=document.getElementById(n);return e?(e.classList.remove("ff-c"),e.classList.add("corner","corner--dim"),e.textContent="",e):null}function Hb(n){Wb=n,yn.el.sound&&yn.el.sound.setAttribute("aria-pressed",n?"true":"false"),ep&&(ep.textContent=n?"ЗВУК":"ТИХО")}function eI(){Zf&&Vn(Zf);let n=new Date(Vr());Zf=ct((60-n.getSeconds())*1e3-n.getMilliseconds()+20,()=>{Zf=0,yn.refresh()})}function tI(){if(!fu.length||de.now-Gb<1e3/dt.sound.fps)return;Gb=de.now;let n=al&&al.audio;n&&Wb?n.levels(Tg):Tg.fill(0);let e=dt.sound.h;for(let t=0;t<8;t++){let i=Math.max(1,Math.round(Tg[t]*e*2)/2);i!==Pg[t]&&(Pg[t]=i,fu[t].setAttribute("y",String(e-i)),fu[t].setAttribute("height",String(i)))}}var yn={el:{tl:null,tlName:null,tlMicro:null,tr:null,sound:null,bl:null,br:null},init(n){al=n;let e=yn.el;if(e.tl=Qf("c-tl"),e.tl&&(e.tlName=ol("span","t-label","SAM.VIN",e.tl,"c-tl-name"),e.tlMicro=ol("span","t-micro","",e.tl,"c-tl-micro")),e.tr=Qf("c-tr"),e.tr){let t=ol("button","",null,e.tr,"sound");t.type="button",t.setAttribute("aria-label","Звук"),ep=ol("span","t-label","ЗВУК",t,"sound-label");let i=document.createElementNS(Ag,"svg");i.setAttribute("class","sound-wave"),i.setAttribute("viewBox",`0 0 ${dt.sound.w} ${dt.sound.h}`),i.setAttribute("aria-hidden","true"),fu=[];for(let s=0;s<8;s++){let o=document.createElementNS(Ag,"rect");o.setAttribute("class","bar"),o.setAttribute("x",String(s*4+.5)),o.setAttribute("width","2"),o.setAttribute("y",String(dt.sound.h-1)),o.setAttribute("height","1"),Pg[s]=1,i.appendChild(o),fu.push(o)}let r=document.createElementNS(Ag,"line");r.setAttribute("class","flat"),r.setAttribute("x1","0"),r.setAttribute("x2",String(dt.sound.w)),r.setAttribute("y1",String(dt.sound.h-.5)),r.setAttribute("y2",String(dt.sound.h-.5)),i.appendChild(r),t.appendChild(i),t.addEventListener("click",()=>{n.audio&&n.audio.toggle()}),e.sound=t}return e.bl=Qf("c-bl"),e.bl&&e.bl.classList.add("t-micro"),e.br=Qf("c-br"),e.br&&(e.br.classList.add("t-micro"),Jf=ol("span","found-count","",e.br),Cg=ol("span","rank","",e.br)),Hb(!(W.data&&W.data.sound==="off")),Se.on("sound:change",t=>Hb(!!t.on)),Se.on("rank:change",()=>yn.refresh()),Se.on("visibility",t=>{t.hidden||yn.refresh()}),yn.setRoom("CORE"),yn.refresh(),de.add(tI,Nt.UI),yn},setRoom(n){let e=oe[n]||oe.CORE;yn.el.tlMicro&&(yn.el.tlMicro.textContent=`${e.code} · ▽ ${e.level}`)},refresh(){let n=yn.el;if(n.bl){if(Rg)n.bl.textContent="РЕЖИМ ЧЕРТЕЖА";else{let e=new Date(Vr());n.bl.textContent=`ДЕНЬ ${W.distinctDays|0} · УЗЛОВ ${W.litNodes|0} · ${Ig(e.getHours())}:${Ig(e.getMinutes())}`}eI()}if(Jf){let e=al&&al.secrets?al.secrets.count():Object.keys(W.data&&W.data.found||{}).length;Jf.textContent=`НАЙДЕНО ${Ig(Math.min(99,e))} / ??`,Cg.textContent=W.data?W.rank().name:""}},typeIn(n=_e.typeMsPerChar){let e=yn.el,t=[e.tlName,e.tlMicro,ep,e.bl&&!Rg?e.bl:null,Jf,Cg].filter(Boolean),i=t.map(s=>s.textContent),r=Math.max(1,...i.map(s=>s.length));for(let s of t)s.textContent="";return Fn(r*n,s=>{let o=Math.round(s*r);for(let a=0;a<t.length;a++){let l=i[a].slice(0,o);t[a].textContent!==l&&(t[a].textContent=l)}}).done.then(()=>{for(let s=0;s<t.length;s++)t[s].textContent=i[s]})},assemble(n=_e.assemble){let e=yn.el;for(let t of[e.tl,e.tr,e.bl,e.br])t&&(t.style.transitionDuration=`${n}ms`,t.classList.remove("corner--dim"));return new Promise(t=>ct(n,t))},relockFound(){yn.refresh();let n=yn.el.br;n&&(n.classList.add("is-relock"),Kf&&Vn(Kf),Kf=ct(_e.statusIn,()=>{Kf=0,n.classList.remove("is-relock")}))},setT0Marker(n){Rg=!!n,yn.refresh()}};var Ni=null,Ho=null,ll=null,fs=0,Lg=0,cl=null;function Dg(){fs=0,Ni&&Ni.classList.remove("is-in");let n=cl;cl=null,n&&ct(240,n)}var pu={init(n){let e=document.getElementById("frame");return Ni=document.getElementById("lead"),!Ni&&e&&(Ni=document.createElement("div"),Ni.id="lead",Ni.className="scrim",e.appendChild(Ni)),Ni&&(Ho=document.getElementById("lead-text")||Ni.appendChild(document.createElement("p")),Ho.id="lead-text",Ho.className="t-lead",ll=document.getElementById("lead-micro")||Ni.appendChild(document.createElement("p")),ll.id="lead-micro",ll.className="t-micro",ll.hidden=!0),pu},show(n,e={}){if(!Ni)return Promise.resolve();let t=e.ms!=null?e.ms:_e.leadDefault;if(fs&&(Vn(fs),fs=0),cl){let s=cl;cl=null,s()}let i=++Lg;Ho.className=e.cls||"t-lead",ll.textContent=e.micro?String(e.micro):"",ll.hidden=!e.micro,Ni.classList.add("is-in");let r=new Promise(s=>{cl=s});return e.beam?Pb(Ho,String(n),{}).then(()=>{i===Lg&&(fs=ct(t,Dg))}):(Ho.textContent=String(n),Ib(Ho),fs=ct(t,Dg)),r},hide(){fs&&(Vn(fs),fs=0),Lg++,Dg()}};var Xb="http://www.w3.org/2000/svg",Qs=[],Ng=null,Og=null,$b=new C,Yb=new C,Ks={x:0,y:0,depth:0,visible:!1},Js={x:0,y:0,depth:0,visible:!1},tp=dt.dims,Gt=n=>n.toFixed(1);function nI(n){if(n.a($b),n.b(Yb),Ie.project($b,Ks),Ie.project(Yb,Js),Ks.depth<=0||Js.depth<=0)return!1;let e=Js.x-Ks.x,t=Js.y-Ks.y,i=Math.hypot(e,t);if(i<8)return!1;e/=i,t/=i;let r=-t,s=e,o=n.side;(o==="left"&&r>0||o==="right"&&r<0||o==="above"&&s>0||o==="below"&&s<0)&&(r=-r,s=-s);let a=n.offset,l=Ks.x+r*a,c=Ks.y+s*a,u=Js.x+r*a,d=Js.y+s*a,h=(l+u)/2,f=(c+d)/2,g=Math.min(i/2-2,n.gapHalf),y=tp.arrowPx,m=tp.extPx,p=`M${Gt(Ks.x+r*4)} ${Gt(Ks.y+s*4)}L${Gt(l+r*m)} ${Gt(c+s*m)}M${Gt(Js.x+r*4)} ${Gt(Js.y+s*4)}L${Gt(u+r*m)} ${Gt(d+s*m)}M${Gt(l)} ${Gt(c)}L${Gt(h-e*g)} ${Gt(f-t*g)}M${Gt(h+e*g)} ${Gt(f+t*g)}L${Gt(u)} ${Gt(d)}M${Gt(l+(e*.866-t*.5)*y)} ${Gt(c+(t*.866+e*.5)*y)}L${Gt(l)} ${Gt(c)}L${Gt(l+(e*.866+t*.5)*y)} ${Gt(c+(t*.866-e*.5)*y)}M${Gt(u-(e*.866-t*.5)*y)} ${Gt(d-(t*.866+e*.5)*y)}L${Gt(u)} ${Gt(d)}L${Gt(u-(e*.866+t*.5)*y)} ${Gt(d-(t*.866-e*.5)*y)}`;return p!==n.lastD&&(n.lastD=p,n.path.setAttribute("d",p)),n.label.style.transform=`translate3d(${Gt(h)}px,${Gt(f)}px,0) translate(-50%,-50%)`,!0}function iI(){if(Ie.camera)for(let n=0;n<Qs.length;n++){let e=Qs[n],t=e.visible&&nI(e);t!==e.shown&&(e.shown=t,e.g.classList.toggle("is-hidden",!t),e.label.classList.toggle("is-hidden",!t))}}var np={init(n){return Ng=document.getElementById("leaders"),Og=document.getElementById("overlay"),de.add(iI,Nt.OVERLAY),np},add(n){let e=String(n.owner||"anon"),t=document.createElementNS(Xb,"g");t.setAttribute("class","dim is-hidden"),t.dataset.owner=e;let i=document.createElementNS(Xb,"path");i.setAttribute("pathLength","1"),t.appendChild(i);let r=document.createElement("span");r.className="t-micro dim-label is-hidden",r.dataset.owner=e,Ng&&Ng.appendChild(t),Og&&Og.appendChild(r);let s={owner:e,a:n.a,b:n.b,side:n.side||"right",offset:n.offset!=null?n.offset:tp.offsetPx,g:t,path:i,label:r,visible:!0,shown:!1,lastD:"",gapHalf:0},o=l=>{r.textContent=String(l||""),s.gapHalf=(r.textContent.length*6.2+2*tp.gapPx)/2};o(n.label),Qs.push(s);let a={setVisible(l){s.visible=!!l},drawIn(l=_e.dimsDraw){return i.classList.remove("is-drawing"),i.style.strokeDasharray="1",i.style.strokeDashoffset="1",r.style.opacity="0",new Promise(c=>{requestAnimationFrame(()=>{i.classList.add("is-drawing"),i.style.transitionDuration=`${l}ms`,i.style.strokeDashoffset="0",ct(l,()=>{r.style.opacity="",c()})})})},setLabel:o,remove(){let l=Qs.indexOf(s);l>=0&&Qs.splice(l,1),t.parentNode&&t.parentNode.removeChild(t),r.parentNode&&r.parentNode.removeChild(r)}};return s.api=a,a},clear(n){for(let e=Qs.length-1;e>=0;e--)Qs[e].owner===n&&Qs[e].api.remove()}};var Fg="http://www.w3.org/2000/svg",Oi=[0,1,2,3].map(n=>({i:n,el:null,svg:null,sp:$i.from(x_.struck,0),at:0,flash:0,lastD:""})),ps=null,Ug=null,rp=14,ul=NaN,mu=NaN,gu=!0,eo=n=>n.toFixed(1);function jb(){return rp+12}function rI(n,e){let t=fe.w,i=fe.h,r=rp,s=jb(),o=2*(n.sp.x+e);switch(n.i){case 0:return`M${r} ${r}Q${eo(n.at)} ${eo(r+o)} ${t-r} ${r}`;case 2:return`M${r} ${s-r}Q${eo(n.at)} ${eo(s-r-o)} ${t-r} ${s-r}`;case 1:return`M${s-r} ${r}Q${eo(s-r-o)} ${eo(n.at)} ${s-r} ${i-r}`;default:return`M${r} ${r}Q${eo(r+o)} ${eo(n.at)} ${r} ${i-r}`}}function sI(){let n=fe.w,e=fe.h,t=jb();for(let i of Oi){if(!i.svg)continue;let r=i.i%2===0,s=r?n:t,o=r?t:e;i.svg.setAttribute("viewBox",`0 0 ${s} ${o}`),i.svg.setAttribute("width",String(s)),i.svg.setAttribute("height",String(o)),i.svg.style.transform=`translate3d(${i.i===1?n-t:0}px,${i.i===2?e-t:0}px,0)`}}function ip(n,e,t,i){n.flash&&Vn(n.flash),n.at=e,n.sp.x=t*Math.min(dt.edge.bendPx,3+i*4),n.sp.v=0,n.sp.target=0,n.el.classList.add("is-flash"),n.flash=ct(_e.stringFlash,()=>{n.flash=0,n.el.classList.remove("is-flash")});let r=Ug&&Ug.audio;r&&r.play("stringPluck",{root:(oe[ee.room]||oe.CORE).root})}function oI(n){let e=n.x,t=n.y;if(Number.isFinite(ul)&&gu){let i=Math.hypot(n.vx,n.vy);if(i>dt.edge.pluckPxMs){let r=fe.w,s=fe.h,o=rp,a=fe.isPhone;(mu-o)*(t-o)<0&&ip(Oi[0],e,t>mu?1:-1,i),(mu-(s-o))*(t-(s-o))<0&&ip(Oi[2],e,t<mu?1:-1,i),!a&&(ul-(r-o))*(e-(r-o))<0&&ip(Oi[1],t,e<ul?1:-1,i),!a&&(ul-o)*(e-o)<0&&ip(Oi[3],t,e>ul?1:-1,i)}}ul=e,mu=t}function aI(n){if(!ps||!gu)return;let e=.2*(On.value-.5)*2*On.amp;for(let t=0;t<4;t++){let i=Oi[t];(i.sp.x!==0||i.sp.v!==0)&&(i.sp.step(n),Math.abs(i.sp.x)<.01&&Math.abs(i.sp.v)<.05&&i.sp.snap(0));let r=rI(i,e);r!==i.lastD&&(i.lastD=r,i.el.setAttribute("d",r))}}function qb(){rp=fe.isPhone?dt.phone.edgeInset:dt.desktop.edgeInset;for(let n of Oi)n.at=(n.i%2===0?fe.w:fe.h)/2,n.lastD="";sI()}var xu={init(n){Ug=n;let e=document.getElementById("frame");if(!e)return xu;ps=document.createElementNS(Fg,"svg"),ps.id="edges",ps.setAttribute("aria-hidden","true");for(let t of Oi)t.svg=document.createElementNS(Fg,"svg"),t.svg.setAttribute("class","edge-strip"),t.el=document.createElementNS(Fg,"path"),t.el.setAttribute("class","edge"),t.el.setAttribute("pathLength","1"),t.svg.appendChild(t.el),ps.appendChild(t.svg);return e.insertBefore(ps,e.firstChild),qb(),n.bus.on("layout:change",qb),n.input.observe(oI),de.add(aI,Nt.UI),xu},drawIn(n=_e.drawIn){if(!ps)return Promise.resolve();for(let e of Oi)e.el.style.transition="none",e.el.style.strokeDasharray="1",e.el.style.strokeDashoffset="1";return new Promise(e=>{requestAnimationFrame(()=>{for(let t of Oi)t.el.style.transition=`stroke-dashoffset ${n}ms cubic-bezier(.16,1,.3,1)`,t.el.style.strokeDashoffset="0";ct(n,()=>{for(let t of Oi)t.el.style.transition="",t.el.style.strokeDasharray="",t.el.style.strokeDashoffset="";e()})})})},twitch(n=dt.edge.twitchPx){for(let e of Oi)e.sp.x=n,e.sp.v=0,e.sp.target=0},setVisible(n){gu=!!n,ps&&ps.classList.toggle("is-off",!gu);for(let e of Oi)e.el&&e.el.classList.toggle("is-off",!gu)}};var to=null,op=!1,Zb=!1,Kb=!0,Bg=null;function sp(){let n=Kb&&op&&!fe.isPhone;n===Zb||!to||(Zb=n,to.classList.toggle("is-on",n))}var vu={init(n){let e=document.getElementById("fx"),t=document.getElementById("gl");return e&&(to=document.createElement("i"),to.id="cursor",e.appendChild(to),t&&(t.addEventListener("pointerover",i=>{(i.pointerType==="mouse"||i.pointerType==="pen")&&(op=!0,sp())}),t.addEventListener("pointerout",()=>{op=!1,sp()}),t.addEventListener("pointerdown",i=>{i.pointerType==="touch"&&(op=!1,sp())})),n.input.observe(i=>{i.type!=="touch"&&(to.style.transform=`translate3d(${i.x}px,${i.y}px,0)`)})),vu},setVisible(n){Kb=!!n,sp()},setColor(n){Bg=n&&n!=="ember"?n:null,to&&(to.style.boxShadow=Bg?`inset 0 0 0 1px var(--${Bg})`:"")}};var lI="http://www.w3.org/2000/svg",io=["S","A","M","•","V","I","N"],tn=new Float64Array(7),Zi=bn.map(n=>oe[n].alt),Pn=null,mn="desktop",Qi=56,In=300,Ht=null,fl=null,Mi=null,iS=null,lp=null,xs=null,rS=null,gs=null,_u=null,ml=null,Fi=null,zg=null,Ji=[],pl=[],yu="CORE",Mu=0,Vg=NaN,ap=-1,Jb=!1,hl=0,Qb=-1e9,no=new $i(8,.25,0),up=!1,sS=0,dr=new $i(12,1,0),Gg=0;function cI(){if(mn=fe.kind==="desktop"?"desktop":fe.kind==="phone"?"phone":"land",mn==="desktop"){Qi=dt.nav.w,In=dt.nav.h;for(let n=0;n<7;n++)tn[n]=In/2-Zi[n]/1e3*(In/2.4)}else if(mn==="phone"){Qi=Math.max(100,fe.w-32),In=dt.band.h;for(let n=0;n<7;n++)tn[n]=16+(n+.5)*Qi/7}else{Qi=dt.band.sideW,In=Math.max(100,fe.h-32);for(let n=0;n<7;n++)tn[n]=16+(n+.5)*In/7}}function dp(n){if(n>=Zi[0])return tn[0]+(n-Zi[0])*(tn[1]-tn[0])/(Zi[1]-Zi[0]);for(let e=1;e<7;e++)if(n>=Zi[e])return tn[e]+(n-Zi[e])*(tn[e-1]-tn[e])/(Zi[e-1]-Zi[e]);return tn[6]+(n-Zi[6])*(tn[6]-tn[5])/(Zi[6]-Zi[5])}var bu=n=>n==="WORKSHOP"?2:bn.indexOf(n);function Su(n){let e=0;for(let t=1;t<7;t++)Math.abs(n-tn[t])<Math.abs(n-tn[e])&&(e=t);return e}function uI(n){let e=[];for(let i=0;i<2;i++)for(let r=0;r<=4;r++){let s=i===0?r/4:1-r/4,o=n.top+(n.bot-n.top)*s,a=n.top>0&&n.bot<0&&r===4/2?.62:Ct(o),l,c;if(mn==="desktop")l=In/2-o*(In/2.4),c=a*(In/2.4)*dt.nav.widthScale;else{let h=(mn==="phone"?Qi:In)/7;l=n.i*h+h*s,c=a/.62*((mn==="phone"?In:Qi)*.36)}let u=i===0?1:-1,d=mn==="phone"?In/2:Qi/2;e.push(mn==="phone"?`${l.toFixed(1)} ${(d-u*c).toFixed(1)}`:`${(d+u*c).toFixed(1)} ${l.toFixed(1)}`)}return`M${e.join("L")}Z`}function hI(){let n=an[6],e=Ml(7),t=[];for(let i=0;i<5;i++){let r=.1+.2*i,s="";for(let o=0;o<=4;o++){let a=n.top+(n.bot-n.top)*(o/4),l=Ct(a),c=(r-.5+(e()-.5)*.15)*2*l,u,d;if(mn==="desktop")d=In/2-a*(In/2.4),u=Qi/2+c*(In/2.4)*dt.nav.widthScale;else if(mn==="phone"){let h=Qi/7;u=6*h+h*(o/4),d=In/2+c/.62*In*.36}else{let h=In/7;d=6*h+h*(o/4),u=Qi/2+c/.62*Qi*.36}s+=`${o?"L":"M"}${u.toFixed(1)} ${d.toFixed(1)}`}t.push(s)}return t.join("")}function eS(){cI(),fl.setAttribute("viewBox",`0 0 ${Qi.toFixed(1)} ${In.toFixed(1)}`);for(let e=0;e<7;e++)pl[e].setAttribute("d",uI(an[e]));Mi.setAttribute("d",hI());let n=mn==="desktop";for(let e=0;e<7;e++)Ji[e].style.top=n?`${tn[e].toFixed(1)}px`:"";gs.style.top=n?`${(tn[6]+12).toFixed(1)}px`:"",ml.style.top=n?`${tn[3].toFixed(1)}px`:"",Vg=NaN}function oS(){let n=up?no.x:dp(Mu);return n+=dr.x+Gg,n}function tS(n,e){n.style.transform=mn==="phone"?`translate3d(${(e-.5).toFixed(1)}px,0,0)`:`translate3d(0,${(e-.5).toFixed(1)}px,0)`}function dI(n){if(!Ht)return;up&&(no.step(n),de.now>sS&&(no.target=dp(Mu),Math.abs(no.x-no.target)<.3&&Math.abs(no.v)<2&&(up=!1))),(dr.x!==0||dr.v!==0)&&(dr.step(n),dr.target===0&&Math.abs(dr.x)<.05&&Math.abs(dr.v)<.5&&dr.snap(0));let e=oS();Math.abs(e-Vg)<.05||(Vg=e,tS(iS,e),xs&&tS(xs,e))}function dl(n,e,t){let i=Ji[n];i&&(i["_"+e]&&Vn(i["_"+e]),i.setAttribute(e,e==="data-glint"?"electrum":""),i["_"+e]=ct(t,()=>{i["_"+e]=0,i.removeAttribute(e)}))}function kg(){let n=!!(W.data&&W.data.nadirOpen),e=Ji[6],t=oe.NADIR;e.setAttribute("aria-label",n?t.nameOpen:t.name),e.querySelector(".kn-name").textContent=n?t.nameOpen:t.name;let i=W.data?W.data.shards|0:0;e.querySelector(".kn-level").textContent=n?`▽ ${t.giant}`:"●".repeat(i)+"○".repeat(5-i)}function Wg(n){if(n!==ap){if(ap>=0&&Ji[ap].classList.remove("is-hot"),ap=n,n<0){lp.classList.remove("is-on");return}Ji[n].classList.add("is-hot"),lp.style.transform=`translate3d(0,${(tn[n]-.5).toFixed(1)}px,0)`,lp.classList.add("is-on"),Pn.audio&&Pn.audio.play("hoverTick",{x:fe.w-52})}}function hp(n){mn!=="desktop"&&(n=!1),n!==Jb&&(Jb=n,n?Ht.setAttribute("data-expanded",""):(Ht.removeAttribute("data-expanded"),Wg(-1)))}var Xg=n=>`#/${oe[n].slug}`;function Hg(n,e="nav"){Pn.director&&Pn.director.go(Xg(bn[n]),{source:e})}function fI(){let n=Pn.director;return n&&n.busy()&&n.state.to?n.state.to.room:ee.room}function pI(n){if(n.preventDefault(),mn!=="desktop")return;let e=n.deltaY;if(n.deltaMode===1?e*=16:n.deltaMode===2&&(e*=fe.h),(de.now-Qb>600||Math.sign(e)!==Math.sign(hl))&&(hl=0),Qb=de.now,hl+=e,Math.abs(hl)<dt.nav.wheelPxPerDetent)return;let t=Math.sign(hl);hl=0;let i=Ws(fI(),t);i&&(Pn.audio&&Pn.audio.play("tick",{}),Pn.director.go(Xg(i),{source:"nav"}))}var ae={id:-1,row:-1,x0:0,y0:0,p0:0,left:0,top:0,moved:!1,mode:null,done:!1,timers:[],v:0,lastP:0,lastT:0,target:-1,from:0,u0:0,pull:0,pullTimer:0,mapDy:0};function $g(n){return mn==="phone"?n.clientX-ae.left:n.clientY-ae.top}var cp=(n,e)=>setTimeout(e,n);function Yg(){for(let n of ae.timers)clearTimeout(n);ae.timers.length=0,ae.pullTimer&&(clearTimeout(ae.pullTimer),ae.pullTimer=0)}function fp(){ml.classList.remove("is-on"),Fi.style.transition="none",Fi.style.strokeDashoffset="1"}function mI(n){if(ae.id>=0||n.pointerType==="mouse"&&n.button!==0)return;let e=Ht.getBoundingClientRect();ae.id=n.pointerId,ae.left=e.left,ae.top=e.top,ae.x0=n.clientX,ae.y0=n.clientY,ae.moved=!1,ae.mode=null,ae.done=!1,ae.v=0,ae.target=-1,ae.p0=ae.lastP=$g(n),ae.lastT=n.timeStamp,ae.row=Su(ae.p0),Math.abs(ae.p0-tn[ae.row])>30&&(ae.row=-1);try{Ht.setPointerCapture(n.pointerId)}catch{}ae.row===3?(ae.timers.push(cp(_e.relaunchRingDelay,()=>{ml.classList.add("is-on"),Fi.style.transition="none",Fi.style.strokeDashoffset="1",requestAnimationFrame(()=>{Fi.style.transition=`stroke-dashoffset ${_e.relaunch-_e.relaunchRingDelay}ms linear`,Fi.style.strokeDashoffset="0"})})),ae.timers.push(cp(_e.relaunch,()=>{ae.done=!0,fp(),Pr(Ir.lock),ee.room!=="CORE"&&Pn.director&&Pn.director.go("#/core",{source:"nav"}),Se.emit("relaunch",{})}))):ae.row>=0&&ae.timers.push(cp(_e.longPress,()=>{ae.done=!0,Pn.hint&&Pn.hint.swing()}))}function gI(n,e,t){Yg(),fp();let i=mn==="phone"?e:t,r=mn==="phone"?t:e;if(ae.row===0&&i<0&&Math.abs(i)>=Math.abs(r)*.5){ae.mode="pull";return}if(mn==="phone"&&t<0&&Math.abs(t)>Math.abs(e)){ae.mode="map";return}let s=Pn.director;if(!s){ae.mode="none";return}let o=$g(n);if(s.busy()){if(!s.scrub.begin(s.state.to.hash)){ae.mode="detent";return}ae.target=bu(s.state.to.room),ae.from=o,ae.u0=s.state.u,ae.mode="scrub";return}let a=dp(oe[ee.room].alt),l=Math.sign(o-a)||Math.sign(i)||1,c=Su(o);if((c===bu(ee.room)||Math.abs(o-a)<12)&&(c=bu(ee.room)+l),c<0||c>6){ae.mode="none";return}if(ae.target=c,ae.from=a,ae.u0=0,!s.scrub.begin(Xg(bn[c]))){ae.mode="detent";return}ae.mode="scrub"}function xI(n){let e=tn[ae.target]-ae.from;return Math.abs(e)<1?1:Math.max(0,Math.min(1,ae.u0+(n-ae.from)/e*(1-ae.u0)))}function vI(n){if(n.pointerId!==ae.id){mn==="desktop"&&n.pointerType==="mouse"&&ae.id<0&&yI(n);return}let e=n.clientX-ae.x0,t=n.clientY-ae.y0;if(!ae.moved){let s=Math.hypot(e,t);if(s>=yi.SLOP_PX/2&&ae.timers.length&&!ae.done&&(Yg(),fp()),s<yi.SLOP_PX)return;if(ae.moved=!0,ae.done){ae.mode="none";return}gI(n,e,t)}let i=$g(n),r=Math.max(1,n.timeStamp-ae.lastT);if(ae.v+=((i-ae.lastP)/r-ae.v)*Math.min(1,r/60),ae.lastP=i,ae.lastT=n.timeStamp,ae.mode==="scrub")Pn.director.scrub.set(xI(i));else if(ae.mode==="pull"){let s=tn[0]-i;mn==="phone"?s+=Math.max(0,ae.top-n.clientY):mn==="land"&&(s+=Math.max(0,ae.left-n.clientX)),ae.pull=Math.max(0,s),dr.snap(-Math.min(dt.nav.rubberMax,ae.pull*dt.nav.rubber)),ae.pull>=dt.nav.overpullPx&&!ae.pullTimer?ae.pullTimer=cp(_e.overpullHold,()=>{ae.pullTimer=0,ae.done=!0,ae.mode="none",dr.target=0,Pn.director&&Pn.director.go("#/zenith",{source:"overpull"})}):ae.pull<dt.nav.overpullPx&&ae.pullTimer&&(clearTimeout(ae.pullTimer),ae.pullTimer=0)}else ae.mode==="map"&&(ae.mapDy=n.clientY-ae.y0);mn==="desktop"&&(ae.mode==="scrub"||ae.mode==="detent")&&Wg(Su(i))}function nS(n,e){if(n.pointerId!==ae.id)return;ae.id=-1,Yg(),fp();let t=Pn.director,i=ae.lastP;if(ae.mode==="scrub"&&t)if(e)t.scrub.end(-4);else{let r=ae.v*1e3/(tn[ae.target]-ae.from||1),s=dt.nav.magnetPx;Math.abs(i-tn[ae.target])<=s?r=Math.max(r,2):Math.abs(i-ae.from)<=s&&(r=Math.min(r,-2)),t.scrub.end(r)}else if(ae.mode==="pull")dr.target=0;else if(ae.mode==="detent"&&!e){let r=Su(i);r!==bu(ee.room)&&Hg(r)}else ae.mode==="map"&&!e?ae.mapDy<=-40&&Pn.navMap&&Pn.navMap.open():!ae.moved&&!ae.done&&!e&&ae.row>=0&&Hg(ae.row);ae.mode=null}function yI(n){hp(!0);let e=fe.h/2-In/2,t=n.clientY-e,i=Su(t);Wg(Math.abs(t-tn[i])<=22?i:-1)}function hi(n,e,t,i){let r=document.createElement(n);return e&&(r.className=e),i&&(r.id=i),t.appendChild(r),r}function ms(n,e,t){let i=document.createElementNS(lI,n);return e&&i.setAttribute("class",e),t.appendChild(i),i}function _I(){Ht=document.createElement("nav"),Ht.id="keynav",Ht.setAttribute("aria-label","КЛЮЧ"),fl=ms("svg","kn-draw",Ht),fl.setAttribute("aria-hidden","true"),fl.setAttribute("preserveAspectRatio","none");for(let t=0;t<7;t++){let i=ms("path","kn-stratum",fl);i.setAttribute("data-stratum",io[t]),i.setAttribute("pathLength","1"),pl.push(i)}Mi=ms("path","kn-crack",fl),Mi.setAttribute("pathLength","1"),Mi.style.strokeDasharray="1",Mi.style.strokeDashoffset="1";for(let t=0;t<7;t++){let i=bn[t],r=oe[i],s=hi("button","kn-row",Ht);s.type="button",s.dataset.sign=io[t],s.dataset.room=i,s.style.setProperty("--i",String(t)),s.setAttribute("aria-label",r.name);let o=hi("span","kn-letter t-label",s);o.textContent=io[t];let a=hi("span","kn-text",s),l=hi("span","kn-head",a);hi("span","kn-code t-label",l).textContent=`${io[t]} · ${r.code}`,hi("span","kn-name t-body t-body--15 t-body--em",l).textContent=r.name,hi("span","kn-level t-micro",a).textContent=`▽ ${r.giant}`,s.addEventListener("click",c=>{c.detail===0&&Hg(t)}),Ji.push(s)}lp=hi("i","kn-tick",Ht),iS=hi("i","",Ht,"keynav-needle"),xs=ms("svg","kn-twin",Ht),xs.setAttribute("viewBox","0 0 40 12"),rS=[ms("path","",xs),ms("path","",xs)],gs=hi("div","",Ht,"keynav-slots");for(let t=0;t<5;t++)hi("i","slot",gs);_u=hi("i","",Ht,"keynav-zenith"),ml=hi("div","",Ht,"keynav-ring");let n=ms("svg","",ml);n.setAttribute("viewBox","0 0 44 44");let e=ms("circle","track",n);e.setAttribute("cx","22"),e.setAttribute("cy","22"),e.setAttribute("r","18"),Fi=ms("circle","fill",n),Fi.setAttribute("cx","22"),Fi.setAttribute("cy","22"),Fi.setAttribute("r","18"),Fi.setAttribute("pathLength","1"),Fi.style.strokeDasharray="1",Fi.style.strokeDashoffset="1",hi("span","t-label",ml).textContent="ПЕРЕЗАПУСК",zg=hi("p","t-body t-body--15 t-body--em",Ht,"keynav-name"),Ht.addEventListener("pointerdown",mI),Ht.addEventListener("pointermove",vI),Ht.addEventListener("pointerup",t=>nS(t,!1)),Ht.addEventListener("pointercancel",t=>nS(t,!0)),Ht.addEventListener("pointerleave",t=>{ae.id<0&&t.pointerType==="mouse"&&hp(!1)}),Ht.addEventListener("wheel",pI,{passive:!1}),Ht.addEventListener("contextmenu",t=>t.preventDefault())}var Ki={el:null,init(n){Pn=n;let e=document.getElementById("chrome");return e&&(_I(),e.appendChild(Ht),Ki.el=Ht,eS(),kg(),Ki.refreshSlots(),W.data&&W.data.nadirOpen&&(Mi.style.strokeDashoffset="0",Mi.classList.add("is-cool")),Ki.showZenith(!!(W.data&&W.data.found&&W.data.found.S13)),Ki.setCurrent(ee.room||"CORE"),Se.on("layout:change",()=>{eS(),hp(!1)}),Se.on("secret:found",t=>{t.id==="S13"&&Ki.showZenith(!0)}),Se.on("room:arrive",()=>{try{$x().unread>0&&Ki.blink("S")}catch{}}),de.add(dI,Nt.UI)),Ki},show(n={}){if(!Ht)return Promise.resolve();let e=n.ms!=null?n.ms:_e.drawIn;Ht.classList.add("is-shown");for(let t of pl)t.style.transition="none",t.style.strokeDasharray="1",t.style.strokeDashoffset="1";return requestAnimationFrame(()=>{for(let t of pl)t.style.transition=`stroke-dashoffset ${e}ms cubic-bezier(.16,1,.3,1),stroke .24s`,t.style.strokeDashoffset="0"}),new Promise(t=>ct(e,()=>{for(let i of pl)i.style.strokeDasharray="",i.style.strokeDashoffset="",i.style.transition="";t()}))},hide(){Ht&&(Ht.classList.remove("is-shown"),hp(!1))},setCurrent(n){yu=oe[n]?n:"CORE";let e=bu(yu);for(let i=0;i<7;i++)i===e?Ji[i].setAttribute("aria-current","true"):Ji[i].removeAttribute("aria-current"),pl[i].classList.toggle("is-current",i===e);let t=oe[yu];zg&&(zg.textContent=yu==="NADIR"&&W.data&&W.data.nadirOpen?t.nameOpen:t.name),Mu=t.alt},setNeedle(n){Mu=Number.isFinite(n)?n:0},lockTwin(){if(!xs||mn!=="desktop")return;xs.classList.add("is-on");let[n,e]=rS;Fn(_e.navTwin,t=>{let i=5*(1-t),r=3,s=3+2*(1-t),o="M0 6",a="M0 6";for(let l=2;l<=40;l+=2)o+=`L${l} ${(6+i*Math.sin(l/40*r*6.283)).toFixed(2)}`,a+=`L${l} ${(6+i*Math.sin(l/40*s*6.283+1)).toFixed(2)}`;n.setAttribute("d",o),e.setAttribute("d",a)}).done.then(()=>ct(120,()=>xs.classList.remove("is-on")))},flashLetter(n,e,t){let i=io.indexOf(n);i>=0&&dl(i,e==="electrum"?"data-glint":"data-flash",t||_e.hintGlint)},flashAll(n){for(let e=0;e<7;e++)dl(e,"data-flash",n||4200)},blink(n){let e=io.indexOf(n);e>=0&&dl(e,"data-blink",480)},shudder(n){let e=io.indexOf(n);if(e<0)return;let t=Ji[e];t.hasAttribute("data-shudder")?(t.removeAttribute("data-shudder"),requestAnimationFrame(()=>dl(e,"data-shudder",1e3))):dl(e,"data-shudder",1e3),n==="N"&&(gs.classList.add("is-flash"),ct(_e.shudder,()=>gs.classList.remove("is-flash")))},refreshSlots(){let n=W.data?Math.min(5,W.data.shards|0):0;if(gs)for(let e=0;e<5;e++)gs.children[e].classList.toggle("filled",e<n);Ji.length&&kg()},slotPoint(n){let e=gs&&gs.children[Math.max(0,Math.min(4,n|0))];if(!e)return{x:fe.w/2,y:fe.h/2};let t=e.getBoundingClientRect();return{x:t.left+t.width/2,y:t.top+t.height/2}},letterPoint(n){let e=Math.max(0,io.indexOf(n)),t=Ji[e]&&Ji[e].firstChild;if(!t)return{x:fe.w/2,y:fe.h/2};let i=t.getBoundingClientRect();return{x:i.left+i.width/2,y:i.top+i.height/2}},crack(){return Mi?(Mi.classList.remove("is-cool"),Mi.style.transition="none",Mi.style.strokeDashoffset="1",requestAnimationFrame(()=>{Mi.style.transition="stroke-dashoffset 2.8s cubic-bezier(.2,0,0,1),stroke .6s",Mi.style.strokeDashoffset="0"}),ct(1400,()=>{kg(),Ki.setCurrent(yu)}),new Promise(n=>ct(2800,()=>{Mi.classList.add("is-cool"),n()}))):Promise.resolve()},showZenith(n){_u&&_u.classList.toggle("is-on",!!n)},pullAboveS(n=20,e=600){let t=dp(Mu),i=tn[0]-n-t;Fn(e,r=>{Gg=i*Math.sin(Math.PI*r)}).done.then(()=>{Gg=0})},swingTo(n,e=_e.hintGlint){no.snap(oS()),no.target=n<0?tn[0]-dt.nav.zenithDotAbove*2:tn[n],up=!0,sS=de.now+900+e,n<0?(_u.classList.add("is-ghost"),ct(900+e,()=>_u.classList.remove("is-ghost"))):ct(450,()=>dl(n,"data-glint",e))}};var aS="http://www.w3.org/2000/svg",qg=null,ii=null,lS=[],cS=[],pp=0,wu={id:-1,y0:0};function jg(){let n=!!(W.data&&W.data.nadirOpen),e=ee.room==="WORKSHOP"?"MEMBERS":ee.room;for(let t=0;t<7;t++){let i=bn[t],r=oe[i],s=lS[t],o=i==="NADIR"&&!n;s.querySelector(".t-body").textContent=i==="NADIR"&&n?r.nameOpen:r.name,o?s.setAttribute("data-sealed",""):s.removeAttribute("data-sealed"),i===e?s.setAttribute("aria-current","true"):s.removeAttribute("aria-current"),cS[t].classList.toggle("is-current",i===e)}}function MI(n){let e=[];for(let t=0;t<2;t++)for(let i=0;i<=4;i++){let r=t===0?i/4:1-i/4,s=n.top+(n.bot-n.top)*r,o=n.top>0&&n.bot<0&&i===2?.62:Ct(s),a=36+(t===0?1:-1)*o*125*.45;e.push(`${a.toFixed(1)} ${(150-s*125).toFixed(1)}`)}return`M${e.join("L")}Z`}var Ui={isOpen:!1,init(n){qg=n;let e=document.getElementById("sheets");if(!e)return Ui;ii=document.createElement("div"),ii.id="map",ii.hidden=!0,ii.setAttribute("role","dialog"),ii.setAttribute("aria-label","КАРТА");let t=document.createElement("div");t.className="map-head";let i=document.createElement("p");i.className="t-label",i.textContent="КАРТА · VIN";let r=document.createElement("button");r.type="button",r.className="verb",r.textContent="ЗАКРЫТЬ",r.addEventListener("click",()=>Ui.close()),t.append(i,r);let s=document.createElement("div");s.className="map-body";let o=document.createElementNS(aS,"svg");o.setAttribute("class","map-draw"),o.setAttribute("viewBox","0 0 72 300"),o.setAttribute("preserveAspectRatio","xMidYMin meet"),o.setAttribute("aria-hidden","true");for(let l of an){let c=document.createElementNS(aS,"path");c.setAttribute("d",MI(l)),o.appendChild(c),cS.push(c)}let a=document.createElement("div");return a.className="map-rows",lS=bn.map(l=>{let c=oe[l],u=document.createElement("button");u.type="button",u.className="map-row",u.dataset.room=l;let d=document.createElement("span");d.className="t-micro",d.textContent=`▽ ${c.level}`;let h=document.createElement("span");h.className="t-label",h.textContent=`${c.num} · ${c.code}`;let f=document.createElement("span");return f.className="t-body",f.textContent=c.name,u.append(d,h,f),u.addEventListener("click",()=>{Ui.close(),qg.director&&qg.director.go(`#/${c.slug}`,{source:"nav"})}),a.appendChild(u),u}),s.append(o,a),ii.append(t,s),ii.addEventListener("pointerdown",l=>{wu.id=l.pointerId,wu.y0=l.clientY}),ii.addEventListener("pointerup",l=>{l.pointerId===wu.id&&l.clientY-wu.y0>60&&Ui.close(),wu.id=-1}),e.appendChild(ii),Se.on("room:arrive",jg),Se.on("nadir:open",jg),Ui},open(){!ii||Ui.isOpen||(pp&&(pp=0),jg(),Ui.isOpen=!0,ii.hidden=!1,ii.classList.add("is-closing"),requestAnimationFrame(()=>requestAnimationFrame(()=>ii.classList.remove("is-closing"))))},close(){if(!ii||!Ui.isOpen)return;Ui.isOpen=!1,ii.classList.add("is-closing");let n=++pp;ct(480,()=>{n===pp&&!Ui.isOpen&&(ii.hidden=!0)})}};var bi=(n,e,t,i,r,s,o=!1)=>Object.freeze({id:n,name:e,where:t,note:i,line:r,hintRoom:s,timeGated:o}),Zg=Object.freeze([bi("S01","РЕЗОНАНС","CORE","G4","Песок написал имя.","CORE"),bi("S02","БЕСКОНЕЧНОСТЬ","CORE","A4","Ты всё ещё внутри SAM.VIN.","CORE"),bi("S03","ГОЛОВОКРУЖЕНИЕ","CORE","B4","Ключ закружился на {p}%.","CORE"),bi("S04","АККОРД","MEMBERS","D5","Весь клан прозвучал вместе.","MEMBERS"),bi("S05","ПОЗЫВНОЙ","anywhere","E5","Система узнала тебя.","CORE"),bi("S06","МАСТЕРСКАЯ","MEMBERS","G5","Твой знак вырезан.","MEMBERS"),bi("S07","КИТ","any hall","A5","Ты видел кита.",null,!0),bi("S08","ИЗНАНКА","CORE","B5","Ты видел изнанку.","CORE"),bi("S09","ДРОН","any hall","D6","Ты поймал дрона.","CURRENT"),bi("S10","НОЧЬ","any","E6","Ты видел, как VIN спит.",null,!0),bi("S11","ЧАСТОТА","SIGNAL","G6","Тайная частота: {freq}.","SIGNAL"),bi("S12","КАПСУЛА","INSIGNIA","A6","Капсула открылась.",null,!0),bi("S13","ЗЕНИТ","navigator","B6","Ты был над всем.","ZENITH"),bi("S14","СПУТНИК","CORE","D7","{name} прилетела и осталась.",null,!0)]),uS=Object.freeze(["S01","S03","S04","S02","S06","S09","S08","S11","S13","S05"]),hS=Object.freeze(["S07","S10","S12","S14"]),bI=new Map(Zg.map(n=>[n.id,n]));function mp(n){return bI.get(n)||null}var Wo=null,gl=null,dS=n=>!!(W.data&&W.data.found&&W.data.found[n]);function fS(n){let e=gl;if(!e||de.now-e.at>_e.hintArriveWindow){gl=null;return}e.room===n&&(gl=null,Se.emit("hint:arrive",{secret:e.secret,room:n}))}var Eu={init(n){return Wo=n,n.hint=Eu,Se.on("room:arrive",e=>fS(e.room)),Eu},target(){for(let n of uS){if(dS(n))continue;let t=mp(n).hintRoom;return t==="CURRENT"&&(t=ee.room),{secret:n,room:t,kind:"secret"}}return hS.some(n=>!dS(n))?{secret:null,room:null,kind:"time"}:{secret:null,room:null,kind:"done"}},swing(){let n=Eu.target(),e=Wo&&Wo.keyNav,t=3;return n.kind==="secret"&&(t=n.room==="ZENITH"?-1:Math.max(0,bn.indexOf(n.room==="WORKSHOP"?"MEMBERS":n.room))),e&&e.swingTo&&e.swingTo(t),n.kind!=="secret"&&Wo.status&&Wo.status.say(n.kind==="time"?"hint.time":"hint.done"),ee.hintTarget={secret:n.secret,room:n.room,at:de.now},Se.emit("hint:swing",{secret:n.secret,room:n.room}),gl=n.kind==="secret"&&oe[n.room]?{secret:n.secret,room:n.room,at:de.now}:null,gl&&gl.room===ee.room&&!(Wo.director&&Wo.director.busy())&&setTimeout(()=>fS(ee.room),0),n}};var SI=new Set(["ArrowUp","ArrowDown","PageUp","PageDown","Home","Escape"]),wI=n=>!!n&&(n.isContentEditable||/^(INPUT|TEXTAREA|SELECT)$/.test(n.tagName||"")),mS=n=>{let e=/^(?:Digit|Numpad)([1-7])$/.exec(n);return e?Number(e[1])-1:-1};function pS(n,e){let t=mS(n.code);if(t>=0)return`#/${oe[bn[t]].slug}`;switch(n.key){case"ArrowUp":case"PageUp":{let i=Ws(e,-1);return i?`#/${oe[i].slug}`:""}case"ArrowDown":case"PageDown":{let i=Ws(e,1);return i?`#/${oe[i].slug}`:""}case"Home":case"Escape":return"#/core";default:return null}}function gS(n){window.addEventListener("keydown",e=>{if(e.defaultPrevented||e.ctrlKey||e.metaKey||e.altKey)return;let t=e.key==="Escape";if(wI(e.target)){t&&n.sheet&&n.sheet.state!=="closed"&&n.sheet.close();return}if(t&&n.navMap&&n.navMap.isOpen){n.navMap.close(),e.preventDefault();return}if(ee.booting&&n.input.offerKey&&n.input.offerKey(e)){e.preventDefault();return}let i=n.director;if(i&&i.busy()){let r=i.state.to?i.state.to.room:ee.room,s=pS(e,r);if(s!=null){s&&i.go(s,{source:"kbd"}),e.preventDefault();return}e.key!=="Tab"&&e.key!=="Shift"&&e.key.length&&i.speedUp();return}if(n.halls&&n.halls.call(ee.room,"onKey",e)===!0){e.preventDefault();return}if(e.code==="KeyM"){n.audio&&n.audio.toggle();return}if(i&&(SI.has(e.key)||mS(e.code)>=0)){let r=pS(e,ee.room);r&&i.go(r,{source:"kbd"}),e.preventDefault()}})}var xS=!1,Jg=!1;function Kg(n){Jg||(Jg=!0,n.status&&n.status.say(n.input.pointer.lastMove?"boot.pointer":"boot.nopointer"))}function vS(n,e){xS||(xS=!0,n.bus.on("relaunch",()=>EI(n)));let t=n.key,i=Jt.reducedMotion,r=[],s=[],o=!1,a,l=new Promise(m=>{a=m}),c=(m,p)=>r.push(ct(m,p)),u=(m,p,b)=>{let S=Fn(m,p,b);return s.push(S),S};ee.booting=!0,Jg=!1,ee.phase!=="boot"&&zi("boot");let d=()=>{t&&(t.ignite({color:ee.night?"electrum":"ember",flash:!0}),n.bus.emit("boot:ignite",{returning:W.returning}))},h=m=>{n.chrome&&(m?Promise.resolve():n.chrome.typeIn()).then(()=>n.chrome.assemble(m?0:void 0)),n.keyNav&&n.keyNav.show(m?{ms:0}:{}),n.edges&&n.edges.drawIn(m?0:void 0)},f=m=>{if(!o){o=!0;for(let p of r)Vn(p);for(let p of s)p.cancel();y(),m&&(t&&(t.setScramble([0,0,0,0,0,0,0]),t.setReveal({points:1,scanY:null,fill:1,alpha:1}),d(),t.shootAxis(3.2,0)),n.nest&&n.nest.setFade(1,1),h(!0)),n.composite&&n.composite.setGrain(.02),n.datum&&n.datum.arrive("CORE",{instant:!!m}),n.rim&&n.rim.showName(),t&&(t.setBreathingRing(!0),t.setIdle(!0),t.setInteractive(!0)),Kg(n),zi("idle"),ee.booting=!1,n.bus.emit("boot:done",{returning:W.returning,sameDay:W.sameDaySession,phone:fe.isPhone}),a()}},g={name:"boot",onGesture(m){return(m.type==="down"||m.type==="tap"||m.type==="wheel"||m.type==="dragstart")&&f(!0),!0},onKey(){return f(!0),!0}},y=n.input.push(g);if(!t){let m=n.t0&&n.t0.boot?n.t0.boot({phone:fe.isPhone,returning:W.returning,sameDay:W.sameDaySession,reduced:i}):Promise.resolve();return h(!1),m.then(()=>f(!1),()=>f(!1)),l}return n.nest&&n.nest.setFade(1,0),n.audio&&n.audio.play("bootSwell",{}),i?(c(200,()=>{n.nest&&u(400,m=>n.nest.setFade(1,m))}),c(300,()=>u(400,m=>t.setReveal({points:m,scanY:null,fill:m,alpha:m}))),c(700,()=>{d(),Kg(n),t.shootAxis(3.2,0),h(!1)}),c(1e3,()=>f(!1)),l):(t.setScramble("golden"),c(600,()=>{n.nest&&u(1e3,m=>n.nest.setFade(1,m),cn.reveal),h(!1)}),c(900,()=>u(400,m=>t.setReveal({points:m,scanY:null,fill:m,alpha:m}),cn.reveal)),c(1e3,()=>{t.lockSequence({order:"down",stepMs:220,spin:!1,snap:.04}).then(()=>{o||(d(),Kg(n),t.shootAxis(3.2,240).then(()=>{o||f(!1)}))})}),l)}function EI(n){let e=n.key;if(n.status&&n.status.say("relaunch"),!e)return;e.setScramble("golden"),e.douse();let t=null;t=n.input.push({name:"relaunch",onGesture(i){return i.type!=="tap"||ee.room!=="CORE"||e.pick(i.x,i.y)<0?!1:(t(),e.lockSequence({order:"down",stepMs:220,spin:!1,snap:.04}).then(()=>{e.ignite({color:ee.night?"electrum":"ember",flash:!0}),n.bus.emit("boot:ignite",{returning:!0}),n.audio&&n.audio.play("signature",{found:n.secrets?n.secrets.found():[]})}),!0)}})}var AI="http://www.w3.org/2000/svg",yS=.56;function gp(n,e,t){let i=document.createElementNS(AI,n);for(let r in e)i.setAttribute(r,e[r]);return t&&t.appendChild(i),i}function TI(){let n=gp("svg",{viewBox:"-0.8 -1.3 1.6 2.6","aria-hidden":"true"});Object.assign(n.style,{position:"absolute",left:"50%",top:"50%",height:`${yS*100}vh`,transform:"translate(-50%,-50%)",overflow:"visible"});for(let e of an){let t=[],i=e.top>0&&e.bot<0?[e.top,0,e.bot]:[e.top,e.bot];for(let r of i)t.push(`${Ct(r).toFixed(3)},${(-r).toFixed(3)}`);for(let r=i.length-1;r>=0;r--)t.push(`${(-Ct(i[r])).toFixed(3)},${(-i[r]).toFixed(3)}`);if(gp("polygon",{points:t.join(" "),fill:"none",stroke:"var(--silver)","stroke-width":"1","vector-effect":"non-scaling-stroke"},n),e.sign!=="•"){let r=gp("text",{x:"0",y:(-e.mid).toFixed(3),"text-anchor":"middle","dominant-baseline":"central",fill:"var(--pewter)"},n);r.style.font='500 0.07px "Martian", ui-monospace, monospace',r.style.letterSpacing="0.008px",r.textContent=e.sign}}return gp("circle",{cx:"0",cy:"0",r:"0.022",fill:"var(--ember)"},n),n}function xp(n){let e=document.getElementById("t0"),t={},i=!1,r="CORE",s=TI();if(e){e.textContent="",Object.assign(e.style,{background:"var(--void)"}),e.appendChild(s);for(let a of Object.keys(oe)){let l=document.createElement("section");l.dataset.room=a,l.hidden=a!=="CORE",Object.assign(l.style,{position:"absolute",left:"var(--title-x)",top:"calc(var(--datum-y) + 36px)"});let c=document.createElement("p");c.className="t-micro",c.textContent=`${oe[a].num} · ${oe[a].code} · ▽ ${oe[a].level}`,l.appendChild(c),e.appendChild(l),t[a]=l}e.hidden=n.app.tier!=="T0"}let o={root:e,boot(a){return new Promise(l=>ct(600,l))},show(a){let l=a&&oe[a.room]?a.room:"CORE";r=l;for(let c in t)t[c].hidden=c!==l;s.style.display=l==="CORE"?"":"none"},keyScreen(){return{x:fe.w/2,y:fe.h/2,r:fe.h*yS/2}},showLost(){let a=r;i=!0,e&&(e.hidden=!1),o.show({room:"CORE"}),r=a},hideLost(){i&&(i=!1,e&&n.app.tier!=="T0"&&(e.hidden=!0),o.show({room:r}))}};return o}var RI=["S01","S02","S03","S04","S05","S06","S07","S08","S09","S10","S11","S12","S13","S14"];function _S(n){let e=()=>{if(n.secrets&&typeof n.secrets.found=="function")return n.secrets.found();let i=W.data&&W.data.found||{};return RI.filter(r=>!!i[r])},t=Object.freeze({version:1,state(){let i=n.renderer,r=W.data||{},s=i?i.stats:null;return{route:ee.route.hash,room:ee.room,phase:ee.phase,tier:ee.tier,u:ee.u,soundOn:ee.soundOn,night:ee.night,owner:ee.owner,inverted:ee.inverted,secrets:e(),shards:r.shards|0,nadirOpen:!!r.nadirOpen,pullNest:ee.pullNest,resonancePct:ee.resonancePct,status:ee.status,columns:ee.columns.slice(),satellites:ee.satellites,companion:ee.companion,whaleSeen:!!r.whaleSeen,_stats:s?{calls:s.calls,triangles:s.triangles,dpr:i.dpr,texMB:Vy(),geometries:s.geometries,points:s.points,frameMs:s.frameMs,fps:s.fps,tier:ee.tier,labels:n.overlay?n.overlay.visibleCount|0:0}:null,_travel:n.director&&n.director.lastTravel?{...n.director.lastTravel}:null,_world:{source:Wx,issues:Xx.length}}},go(i){let r=String(i);location.hash===r?n.director&&n.director.go(r,{source:"go"}):location.hash=r}});try{Object.defineProperty(window,"__SAMVIN__",{value:t,writable:!1,configurable:!1,enumerable:!1})}catch{}return t}function MS(n,e,t){return new Promise(i=>{requestAnimationFrame(()=>i())})}var fr=null,Qg={x:0,y:0,depth:0,visible:!1},ro=(n,e)=>n&&typeof n[e]=="function";function CI(n){return n&&n.isVector3&&Ie.camera?(Ie.project(n,Qg),{x:Qg.x,y:Qg.y}):n&&Number.isFinite(n.x)&&Number.isFinite(n.y)?{x:n.x,y:n.y}:{x:fe.w/2,y:fe.h/2}}function Au(n,e){let t=fr&&fr.status;ro(t,"say")&&t.say(n,e||{})}async function II(n,e){let t=W.data,i=fr&&fr.keyNav,r=t.shards<5&&!t.nadirOpen,s=r&&ro(i,"slotPoint")?i.slotPoint(t.shards):ro(i,"letterPoint")?i.letterPoint("I"):{x:fe.w/2,y:fe.h/2},o=W.rank().index;try{await MS(n,e,s)}catch{}r&&W.patch(l=>{l.shards=Math.min(5,(l.shards|0)+1)}),ro(i,"refreshSlots")&&i.refreshSlots(),je.play("shard",{}),Pr(Ir.shard),fr&&ro(fr.chrome,"relockFound")&&fr.chrome.relockFound(),Au("found"),r&&t.shards<5&&Au("shard",{k:t.shards}),Se.emit("shard:landed",{id:n,k:t.shards,count:Br.count()});let a=W.rank();a.index>o&&(Se.emit("rank:change",{rank:a.name,index:a.index}),Au("rank",{rank:a.name}),ro(je,"setRank")&&je.setRank(a.index)),r&&t.shards>=5&&!t.nadirOpen&&(W.set("nadirOpen",!0),Au("shard",{k:5}),Au("nadir.open"),fr&&ro(fr.lead,"show")&&fr.lead.show("Внизу что-то открылось.",{ms:3e3}),ro(i,"crack")&&i.crack(),Se.emit("nadir:open",{}))}var Br={init(n){return fr=n,n.secrets=Br,Br},discover(n,e={}){if(!mp(n)||!W.data||Br.isFound(n))return!1;let t=e&&e.vars?{...e.vars}:{};W.patch(r=>{r.found[n]=new Date(Date.now()).toISOString(),(!r.foundVars||typeof r.foundVars!="object")&&(r.foundVars={}),r.foundVars[n]=t});let i=CI(e&&e.anchor);return Se.emit("secret:found",{id:n,anchor:i}),II(n,i),!0},isFound(n){return!!(W.data&&W.data.found&&W.data.found[n])},found(){return Zg.filter(n=>Br.isFound(n.id)).map(n=>n.id)},count(){return Br.found().length},rank(){return W.rank()},get shards(){return W.data?W.data.shards|0:0}};var RV=Object.freeze([[1,2],[2,3],[1,4],[3,5],[2,7],[4,7]].map(n=>Object.freeze(n)));var VV=48;var XV=Object.freeze({legend:3,achievement:1.6,moment:1.2,joke:.8,before:3});var tG=Object.freeze(["stellated","twisted","nested","bipyramid","knot"]);var xe={world:vt,state:W,app:ee,bus:Se,loop:de,quality:st,layout:fe,input:dn,audio:je,secrets:null,status:null,sheet:null,edges:null,hint:null,fog:null,palette:null,atlas:null,lead:null,overlay:null,dims:null,datum:null,chrome:null,keyNav:null,director:null,halls:null,renderer:null,scene:null,camera:null,rig:null,scale:null,nest:null,key:null,rim:null,lamp:null,U:null,worldFx:null,t0:null,composite:null,navMap:null,cursor:null,pillar:null};function di(n,e){try{return e(),!0}catch(t){return xt(`main:${n}`,`boot step "${n}" failed`,t),!1}}function bS(){di("env",()=>{Jt.reducedMotion,Ou()}),di("state",()=>{c_(Vr());let a=Vr();ee.night=Up(a),ee.drowsy=Zx(a),ee.birthday=Bp(a),ee.owner=!!W.data.owner,ee.inverted=!!W.data.inverted,document.documentElement.style.setProperty("--shrp",String(W.shrp)),W.deliverTransmissions()}),di("fonts",()=>{Ha()});let n=null;di("quality",()=>{n=st.detect().gl}),ee.tier!=="T0"&&(di("webgl",()=>{xe.composite=PI(n)})||ES()),ee.tier==="T0"&&!xe.t0&&di("t0",()=>{xe.t0=xp(xe),ee.tier="T0"});let e=di("dom",()=>{xe.chrome=yn,yn.init(xe),xe.status=Gn,Gn.init(xe),xe.lead=pu,pu.init(xe),xe.overlay=hr,hr.init(xe),xe.dims=np,np.init(xe),xe.datum=hu,hu.init(xe),xe.edges=xu,xu.init(xe),xe.sheet=ji,ji.init(xe),xe.navMap=Ui,Ui.init(xe),xe.keyNav=Ki,Ki.init(xe),xe.cursor=vu,vu.init(xe),ee.tier==="T0"&&yn.setT0Marker(!0)}),t=di("audio",()=>{je.init(xe)}),i=di("input",()=>{dn.init(xe),gS(xe)}),r=Cr("#/core"),s=di("navigation",()=>{r=Cr(location.hash),rt.init(xe),Rn.init(xe)}),o=di("secrets",()=>{Br.init(xe),Eu.init(xe)});di("hook",()=>{_S(xe)}),ee.tier!=="T0"&&!(e&&t&&i&&s&&o)&&(ES(),di("t0",()=>{xe.t0=xp(xe),xe.chrome&&yn.setT0Marker(!0)})),di("loop",()=>{st.init(xe);let a=ee.tier!=="T0"?xe.composite:null;a?(de.add(a.render,Nt.RENDER),a.onFirstFrame(()=>document.body.classList.remove("is-ff"))):document.body.classList.remove("is-ff"),de.start(),ee.tier!=="T0"&&st.benchmark(),Se.emit("app:ready",{})}),di("boot",()=>{let a=()=>vS(xe,r).then(()=>wS(r),l=>{xt("main:boot",l),wS(r)});xe.composite&&ee.tier!=="T0"?xe.composite.onFirstFrame(a):a()})}function SS(){let n=Ze.core;return{pos:new C(...n.pos),target:new C(...n.target),fov:n.fov,offsetY:fe.kind==="desktop"?0:n.phoneOffsetY,roll:0}}function PI(n){let e=wM(document.getElementById("gl"),n,ee.tier);return xe.renderer=e,xe.scene=e.scene,xe.camera=e.camera,xe.palette=Vs,xe.U=pe,xe.fog=Tr,Vs.init(),Zt.init(ee.tier),xe.atlas=Zt,Tr.set(oe.CORE.fog),Xe.init(e.scene,xe),xe.scale=Xe,xe.worldFx=new jt,xe.worldFx.name="worldFx",Xe.root.add(xe.worldFx),vn.init(xe),xe.nest=vn,xe.pillar=WM(),Xe.root.add(xe.pillar),xe.key=ZM(xe),vn.level(0).add(xe.key.group),de.add(xe.key.update,Nt.WORLD),xe.rim=JM(xe),Xe.root.add(xe.rim.group),Li.init(xe),xe.lamp=Li,Ie.init(e.camera),xe.rig=Ie,Ie.setPose(SS()),Se.on("layout:change",()=>{xe.director||Ie.setPose(SS())}),de.add((t,i)=>{pe.uTime.value=i/1e3,pe.uBreath.value=On.mix(0,1)},Nt.CLOCK),de.add(t=>Li.update(t),Nt.LAMP),de.add(t=>Ie.apply(t),Nt.CAMERA),Se.on("gl:lost",()=>{try{xe.t0||(xe.t0=xp(xe)),xe.t0.showLost()}catch(t){xt("main:t0",t)}}),Se.on("gl:restored",()=>{xe.t0&&xe.t0.hideLost&&xe.t0.hideLost()}),IM(e)}function wS(n){(ee.phase==="boot"||ee.phase==="start")&&zi("idle"),ee.booting=!1,xe.director&&(xe.director.settle(),n&&(n.room!=="CORE"||n.sub)&&xe.director.go(n.hash,{source:"deeplink"}))}function ES(){xe.renderer=xe.scene=xe.camera=xe.key=xe.rim=xe.rig=xe.scale=xe.nest=xe.lamp=null,xe.composite=null,st.tier="T0",ee.tier="T0";let n=document.getElementById("gl");n&&(n.hidden=!0)}document.readyState==="loading"?document.addEventListener("DOMContentLoaded",bS,{once:!0}):bS();})();
