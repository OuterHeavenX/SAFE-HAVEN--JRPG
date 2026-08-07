'use strict';
(()=>{
  const g=window.__safehavenGame;
  if(!g)return;

  const style=document.createElement('style');
  style.textContent=`
    #direct-touch-ui.native-list-only .dt-simple-list{
      display:none !important;
      pointer-events:none !important;
    }
  `;
  document.head.appendChild(style);

  function sync(){
    const root=document.getElementById('direct-touch-ui');
    if(!root)return;
    const page=g.menu?.page||'';
    root.classList.toggle('native-list-only',page==='quests'||page==='bestiary');
  }

  const originalMenuInput=g.menuInput?.bind(g);
  if(originalMenuInput){
    g.menuInput=function(action){
      const result=originalMenuInput(action);
      requestAnimationFrame(sync);
      return result;
    };
  }

  const originalInput=g.input.bind(g);
  g.input=function(action){
    const result=originalInput(action);
    requestAnimationFrame(sync);
    return result;
  };

  setInterval(sync,90);
  sync();
})();
