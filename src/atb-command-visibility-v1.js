'use strict';
(()=>{
 const g=window.__safehavenGame;if(!g)return;
 setInterval(()=>{
   const box=document.querySelector('#direct-touch-ui .dt-battle');
   if(!box)return;
   const b=g.battle;
   const show=g.mode==='battle'&&b&&b.atbReady&&b.turn==='player'&&b.phase==='command'&&!b.done;
   box.style.display=show?'grid':'none';
 },50);
})();