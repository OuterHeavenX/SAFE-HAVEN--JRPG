'use strict';
(()=>{
 const g=window.__safehavenGame,shell=document.getElementById('game-shell');if(!g||!shell)return;
 const layer=document.createElement('div');layer.id='jrpg-transition-fx';layer.setAttribute('aria-hidden','true');shell.appendChild(layer);
 const style=document.createElement('style');style.textContent=`
 #jrpg-transition-fx{position:absolute;inset:0;z-index:70;pointer-events:none;opacity:0;background:#fff;mix-blend-mode:screen}
 #jrpg-transition-fx.battle-in{animation:jrpgBattleIn .34s ease-out}
 #jrpg-transition-fx.world-in{background:#0a0c1e;mix-blend-mode:normal;animation:jrpgWorldIn .38s ease-out}
 @keyframes jrpgBattleIn{0%{opacity:0}22%{opacity:.9;transform:scale(1)}48%{opacity:.2;transform:scale(1.03)}72%{opacity:.7}100%{opacity:0;transform:scale(1)}}
 @keyframes jrpgWorldIn{0%{opacity:.72}100%{opacity:0}}
 `;document.head.appendChild(style);
 let lastMode=g.mode,lastMap=g.s?.map||null;
 function play(cls){layer.className='';void layer.offsetWidth;layer.className=cls;setTimeout(()=>{if(layer.className===cls)layer.className='';},520)}
 setInterval(()=>{const mode=g.mode,map=g.s?.map||null;if(mode!==lastMode){if(mode==='battle')play('battle-in');else if(lastMode==='battle'&&mode==='world')play('world-in');lastMode=mode;}if(mode==='world'&&map&&map!==lastMap){play('world-in');lastMap=map;}},50);
})();