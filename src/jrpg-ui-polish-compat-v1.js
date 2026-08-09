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
    #jrpg-polish .jp-screen{isolation:isolate;background:linear-gradient(180deg,rgba(17,21,61,.995),rgba(5,7,25,.997))}
    #jrpg-polish .jp-btn,#jrpg-polish button{-webkit-tap-highlight-color:transparent;user-select:none;-webkit-user-select:none}

    @media (orientation:landscape) and (max-height:560px){
      #jrpg-polish .jp-screen{inset:max(1.5%,env(safe-area-inset-top)) max(2%,env(safe-area-inset-right)) max(1.5%,env(safe-area-inset-bottom)) max(2%,env(safe-area-inset-left))}
      #jrpg-polish .jp-head{height:38px;padding:0 12px}
      #jrpg-polish .jp-title{font-size:15px;line-height:1}
      #jrpg-polish .jp-sub{font-size:9px;line-height:1.1}
      #jrpg-polish .jp-body{height:calc(100% - 38px)}
      #jrpg-polish .jp-root .jp-body{grid-template-columns:35% 65%}
      #jrpg-polish .jp-left,#jrpg-polish .jp-right{padding:7px 9px;overflow:auto}
      #jrpg-polish .jp-root .jp-left{display:flex;flex-direction:column;gap:3px;overflow:hidden}
      #jrpg-polish .jp-root .jp-btn{flex:1 1 0;min-height:0;height:auto;margin:0;padding:3px 9px;font-size:10px;line-height:1}
      #jrpg-polish .jp-root .jp-right{overflow:hidden;padding:8px 10px}
      #jrpg-polish .jp-profile{grid-template-columns:76px 1fr;gap:10px;align-items:start}
      #jrpg-polish .jp-profile .jp-sprite{width:76px;height:76px;align-self:start;justify-self:center;margin-top:2px}
      #jrpg-polish .jp-name{font-size:17px;margin:0 0 1px}
      #jrpg-polish .jp-rank{font-size:12px;line-height:1.1}
      #jrpg-polish .jp-muted{font-size:9px;line-height:1.15}
      #jrpg-polish .jp-profile>div>div[style]{margin-top:5px!important;font-size:10px;line-height:1.1}
      #jrpg-polish .jp-bar{height:6px;margin:2px 0 4px}
      #jrpg-polish .jp-root .jp-grid{gap:4px;margin-top:5px}
      #jrpg-polish .jp-root .jp-stat{padding:4px 6px;font-size:8px;line-height:1}
      #jrpg-polish .jp-root .jp-stat b{font-size:12px;margin-top:2px}
      #jrpg-polish .jp-card{padding:6px;margin-bottom:5px}
      #jrpg-polish .jp-desc{font-size:10px;line-height:1.25}
    }
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