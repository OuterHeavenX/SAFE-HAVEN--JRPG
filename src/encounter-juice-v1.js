'use strict';
(()=>{
 const g=window.__safehavenGame,shell=document.getElementById('game-shell');if(!g||!shell)return;
 const layer=document.createElement('div');layer.id='jrpg-transition-fx';layer.setAttribute('aria-hidden','true');
 const bands=document.createElement('div');bands.className='melt-bands';for(let i=0;i<12;i++){const b=document.createElement('i');b.style.setProperty('--i',i);bands.appendChild(b);}layer.appendChild(bands);shell.appendChild(layer);
 const style=document.createElement('style');style.textContent=`
 #jrpg-transition-fx{position:absolute;inset:0;z-index:70;pointer-events:none;display:none;overflow:hidden;background:transparent}
 #jrpg-transition-fx.active{display:block;animation:encounterDark 3.4s linear forwards}
 #jrpg-transition-fx .melt-bands{position:absolute;inset:0}
 #jrpg-transition-fx .melt-bands i{position:absolute;left:-8%;width:116%;height:8.5%;top:calc(var(--i)*8.35%);backdrop-filter:blur(1px) contrast(1.25) saturate(1.25);-webkit-backdrop-filter:blur(1px) contrast(1.25) saturate(1.25);background:linear-gradient(90deg,rgba(255,255,255,.02),rgba(87,115,174,.08),rgba(255,255,255,.02));transform-origin:center;animation:encounterSlice 3.4s cubic-bezier(.3,.05,.65,1) forwards;animation-delay:calc(var(--i)*-18ms)}
 #jrpg-transition-fx:after{content:'';position:absolute;inset:-15%;background:repeating-linear-gradient(0deg,rgba(255,255,255,.025) 0 2px,rgba(0,0,0,.025) 2px 5px);mix-blend-mode:overlay;animation:encounterWarp 3.4s ease-in forwards}
 #jrpg-transition-fx.world-in{display:block;background:#090b1d;animation:jrpgWorldIn .45s ease-out forwards}
 @keyframes encounterSlice{0%{transform:translateX(0) skewX(0deg) scaleY(1);filter:hue-rotate(0deg)}15%{transform:translateX(calc((var(--i) - 6)*1.5px)) skewX(1deg)}32%{transform:translateX(calc((6 - var(--i))*4px)) skewX(-2deg) scaleY(1.06)}52%{transform:translateX(calc((var(--i) - 5)*8px)) skewX(4deg);filter:hue-rotate(18deg)}70%{transform:translateX(calc((5 - var(--i))*13px)) skewX(-7deg) scaleY(1.18)}84%{transform:translateX(calc((var(--i) - 6)*19px)) skewX(10deg) scaleY(1.4)}100%{transform:translateY(calc((var(--i) - 5)*16px)) translateX(calc((var(--i) - 6)*25px)) skewX(14deg) scaleY(2.1);filter:hue-rotate(35deg) blur(3px)}}
 @keyframes encounterWarp{0%{opacity:0;transform:scale(1)}18%{opacity:.16;transform:scale(1.01)}45%{opacity:.35;transform:scale(1.04) rotate(.15deg)}68%{opacity:.58;transform:scale(1.08) rotate(-.25deg)}84%{opacity:.78;transform:scale(1.14)}100%{opacity:1;transform:scale(1.24)}}
 @keyframes encounterDark{0%,54%{background:rgba(5,7,20,0)}72%{background:rgba(5,7,20,.18)}88%{background:rgba(5,7,20,.78)}100%{background:#050714}}
 @keyframes jrpgWorldIn{0%{opacity:.82}100%{opacity:0}}
 `;document.head.appendChild(style);
 let transitioning=false,lastMap=g.s?.map||null;
 const originalStart=g.startBattle.bind(g);
 g.startBattle=function(ids){
   if(transitioning||this.mode==='battle')return;
   transitioning=true;
   this.notice='';this.noticeT=0;
   layer.className='active';void layer.offsetWidth;
   setTimeout(()=>{originalStart(ids);},3150);
   setTimeout(()=>{layer.className='';transitioning=false;},3400);
 };
 function worldFade(){if(transitioning)return;layer.className='world-in';setTimeout(()=>{if(layer.className==='world-in')layer.className='';},480);}
 let lastMode=g.mode;
 setInterval(()=>{const mode=g.mode,map=g.s?.map||null;if(lastMode==='battle'&&mode==='world')worldFade();if(mode==='world'&&map&&map!==lastMap){worldFade();lastMap=map;}lastMode=mode;},60);
})();