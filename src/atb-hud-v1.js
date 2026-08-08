'use strict';
(()=>{
 const g=window.__safehavenGame,shell=document.getElementById('game-shell');if(!g||!shell)return;
 const root=document.createElement('div');root.id='atb-hud';root.setAttribute('aria-hidden','true');shell.appendChild(root);
 const style=document.createElement('style');style.textContent=`
 #atb-hud{position:absolute;inset:0;z-index:16;pointer-events:none;font-family:Georgia,serif;color:#fff5d8;display:none}
 #atb-hud.active{display:block}
 .atb-player{position:absolute;left:max(2%,env(safe-area-inset-left));bottom:max(3%,env(safe-area-inset-bottom));width:min(430px,43%);padding:7px 10px;background:rgba(8,9,31,.88);border:2px solid #d9c36b;box-shadow:inset 0 0 0 3px #11132d,0 4px 14px rgba(0,0,0,.4)}
 .atb-row{display:grid;grid-template-columns:68px 1fr 48px;align-items:center;gap:8px;font-size:13px;font-weight:700}.atb-track{height:12px;background:#11152e;border:1px solid #87723e;overflow:hidden}.atb-fill{height:100%;width:0;background:linear-gradient(90deg,#4c75b8,#86c7f1,#f0d978);transition:width .08s linear}.atb-player.ready .atb-track{box-shadow:0 0 10px rgba(255,224,112,.55)}.atb-player.ready .atb-fill{background:linear-gradient(90deg,#9fcf72,#f0dd79,#fff3a8)}
 .atb-enemies{position:absolute;left:10%;top:46%;width:42%;display:flex;gap:10px;justify-content:center}.atb-enemy{width:118px;padding:4px 6px;background:rgba(8,9,28,.72);border:1px solid rgba(218,195,107,.75);font-size:10px;text-align:center}.atb-enemy .atb-track{height:7px;margin-top:3px}.atb-enemy .atb-fill{background:linear-gradient(90deg,#8e4c53,#d27867,#edc873)}
 @media(max-height:500px) and (orientation:landscape){.atb-player{bottom:max(2%,env(safe-area-inset-bottom));width:40%;padding:5px 8px}.atb-row{font-size:11px;grid-template-columns:55px 1fr 38px}.atb-track{height:9px}.atb-enemies{top:49%}.atb-enemy{width:100px}}
 `;document.head.appendChild(style);
 function render(){const b=g.battle,show=g.mode==='battle'&&b&&!b.done;if(!show){root.className='';root.innerHTML='';return;}root.className='active';const p=Math.max(0,Math.min(1,b.playerATB||0));const ready=!!b.atbReady;const enemies=(b.enemies||[]).filter(e=>e.hp>0);root.innerHTML=`<div class="atb-player ${ready?'ready':''}"><div class="atb-row"><span>KAEL ATB</span><div class="atb-track"><div class="atb-fill" style="width:${(p*100).toFixed(1)}%"></div></div><span>${ready?'READY':Math.floor(p*100)+'%'}</span></div></div><div class="atb-enemies">${enemies.map(e=>`<div class="atb-enemy"><span>${e.name}</span><div class="atb-track"><div class="atb-fill" style="width:${(Math.max(0,Math.min(1,e.atb||0))*100).toFixed(1)}%"></div></div></div>`).join('')}</div>`;}
 setInterval(render,70);render();
})();