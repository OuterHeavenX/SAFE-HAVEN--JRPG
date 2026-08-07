'use strict';
(()=>{
  const shell=document.getElementById('game-shell');
  const canvas=document.getElementById('game');
  const ui=document.getElementById('direct-touch-ui');
  if(!shell||!canvas||!ui)return;

  function sync(){
    const sr=shell.getBoundingClientRect();
    const cr=canvas.getBoundingClientRect();
    ui.style.inset='auto';
    ui.style.left=(cr.left-sr.left)+'px';
    ui.style.top=(cr.top-sr.top)+'px';
    ui.style.width=cr.width+'px';
    ui.style.height=cr.height+'px';
  }

  sync();
  addEventListener('resize',sync,{passive:true});
  addEventListener('orientationchange',()=>setTimeout(sync,120),{passive:true});
  if(window.visualViewport){
    visualViewport.addEventListener('resize',sync,{passive:true});
    visualViewport.addEventListener('scroll',sync,{passive:true});
  }
  if(window.ResizeObserver){
    new ResizeObserver(sync).observe(canvas);
  }
})();