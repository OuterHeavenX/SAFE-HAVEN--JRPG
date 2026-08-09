'use strict';
(()=>{
  const roots=[document.getElementById('jrpg-polish'),document.getElementById('classic-ui')].filter(Boolean);
  if(!roots.length)return;

  const style=document.createElement('style');
  style.textContent=`
    #jrpg-polish .jp-left,
    #jrpg-polish .jp-right,
    #jrpg-polish .jp-btn,
    #jrpg-polish button{touch-action:pan-y!important;-webkit-overflow-scrolling:touch}
    #jrpg-polish .jp-left,
    #jrpg-polish .jp-right{overscroll-behavior:contain}
  `;
  document.head.appendChild(style);

  let gesture=null;
  const threshold=12;

  for(const root of roots){root.addEventListener('pointerdown',e=>{
    if(e.__jpReplay)return;
    if(e.pointerType!=='touch'&&e.pointerType!=='pen')return;
    const button=e.target.closest('button');
    if(!button||!root.contains(button))return;
    gesture={id:e.pointerId,x:e.clientX,y:e.clientY,target:button,moved:false};
    e.stopImmediatePropagation();
  },true);

  root.addEventListener('pointermove',e=>{
    if(!gesture||e.pointerId!==gesture.id)return;
    if(Math.hypot(e.clientX-gesture.x,e.clientY-gesture.y)>threshold)gesture.moved=true;
  },true);

  root.addEventListener('pointerup',e=>{
    if(!gesture||e.pointerId!==gesture.id)return;
    const g=gesture;gesture=null;
    if(g.moved)return;
    e.stopImmediatePropagation();
    const replay=new PointerEvent('pointerdown',{
      bubbles:true,cancelable:true,pointerId:e.pointerId,
      pointerType:e.pointerType||'touch',clientX:e.clientX,clientY:e.clientY,
      button:0,buttons:1,isPrimary:true
    });
      Object.defineProperty(replay,'__jpReplay',{value:true});
      window.SHClassicAudio?.play(/BACK|CANCEL|CLOSE|NO|FLEE/i.test(g.target.textContent||'')?'cancel':'confirm');
      g.target.dispatchEvent(replay);
  },true);

  root.addEventListener('pointercancel',e=>{
    if(gesture&&e.pointerId===gesture.id)gesture=null;
  },true);
  }
})();
