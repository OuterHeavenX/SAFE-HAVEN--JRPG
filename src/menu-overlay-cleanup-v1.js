'use strict';
(()=>{
  const g=window.__safehavenGame;
  if(!g)return;
  const style=document.createElement('style');
  style.textContent=`
    #direct-touch-ui.native-list-only .dt-simple-list,
    #direct-touch-ui.native-jobs-only .dt-job-list{
      display:none!important;
      pointer-events:none!important;
    }
    body.cj-jobs-open #classic-ui:before,
    body.cj-bestiary-open #classic-ui:before{
      content:'';position:absolute;inset:0;background:rgba(6,8,27,.96);pointer-events:none;z-index:0;
    }
    body.cj-jobs-open #classic-ui .cj-panel,
    body.cj-bestiary-open #classic-ui .cj-panel{z-index:1;}
  `;
  document.head.appendChild(style);
  function sync(){
    const root=document.getElementById('direct-touch-ui');
    if(!root)return;
    const page=g.menu?.page||'';
    root.classList.toggle('native-list-only',page==='items'||page==='quests'||page==='bestiary');
    root.classList.toggle('native-jobs-only',page==='jobs');
  }
  const originalMenuInput=g.menuInput?.bind(g);
  if(originalMenuInput){g.menuInput=function(action){const result=originalMenuInput(action);requestAnimationFrame(sync);return result;};}
  const originalInput=g.input.bind(g);
  g.input=function(action){const result=originalInput(action);requestAnimationFrame(sync);return result;};
  setInterval(sync,90);sync();
})();