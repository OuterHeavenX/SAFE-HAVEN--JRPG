'use strict';
(()=>{
  const g=window.__safehavenGame;
  if(!g)return;
  const style=document.createElement('style');
  style.id='jrpg-ui-polish-ownership';
  style.textContent=`
    body.jp-menu-open #direct-touch-ui,
    body.jp-menu-open #modal-touch,
    body.jp-shop-open #direct-touch-ui,
    body.jp-shop-open #modal-touch{visibility:hidden!important;pointer-events:none!important}
    body.jp-menu-open #classic-ui{pointer-events:none!important}
    body.jp-classic-owned #classic-ui{pointer-events:auto!important;visibility:visible!important}
    body.jp-classic-owned #direct-touch-ui{visibility:hidden!important;pointer-events:none!important}
    body.jp-battle-unified #atb-hud,
    body.jp-battle-unified #chapter2-party-ui{display:none!important}
    body.jp-battle-unified #jp-battlehud{min-height:0;background:transparent;border-radius:0;padding-top:0}
    #jrpg-polish .jp-screen{isolation:isolate}
    #jrpg-polish .jp-btn,#jrpg-polish button{-webkit-tap-highlight-color:transparent;user-select:none;-webkit-user-select:none}
  `;
  document.head.appendChild(style);

  const sync=()=>{
    const page=g.menu?.page||'';
    const classicOwned=page==='jobs'||page==='bestiary';
    document.body.classList.toggle('jp-classic-owned',classicOwned);
    const direct=document.getElementById('direct-touch-ui');
    if(direct){
      const hidden=!!g.menu||!!g.shop;
      direct.setAttribute('aria-hidden',hidden?'true':'false');
    }
  };
  setInterval(sync,80);
  sync();
})();