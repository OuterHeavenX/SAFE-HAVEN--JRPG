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

    @media (orientation:landscape) and (pointer:coarse),
           (orientation:landscape) and (max-width:1100px){
      #jrpg-polish .jp-screen{inset:max(1.2%,env(safe-area-inset-top)) max(1.8%,env(safe-area-inset-right)) max(1.2%,env(safe-area-inset-bottom)) max(1.8%,env(safe-area-inset-left))!important}
      #jrpg-polish .jp-head{height:38px!important;padding:0 12px!important}
      #jrpg-polish .jp-title{font-size:15px!important;line-height:1!important}
      #jrpg-polish .jp-sub{font-size:9px!important;line-height:1.1!important}
      #jrpg-polish .jp-body{height:calc(100% - 38px)!important;min-height:0!important}
      #jrpg-polish .jp-root .jp-body{grid-template-columns:34% 66%!important}
      #jrpg-polish .jp-left,#jrpg-polish .jp-right{padding:7px 9px!important;min-width:0!important}
      #jrpg-polish .jp-root .jp-left{display:flex!important;flex-direction:column!important;gap:4px!important;overflow:hidden!important}
      #jrpg-polish .jp-root .jp-btn{flex:0 0 34px!important;min-height:34px!important;height:34px!important;margin:0!important;padding:3px 9px!important;font-size:11px!important;line-height:1!important}
      #jrpg-polish .jp-root .jp-right{overflow:hidden!important;padding:8px 10px!important;min-width:0!important}
      #jrpg-polish .jp-profile{display:grid!important;grid-template-columns:92px minmax(0,1fr)!important;gap:10px!important;align-items:start!important;width:100%!important;min-width:0!important}
      #jrpg-polish .jp-profile>*{min-width:0!important}
      #jrpg-polish .jp-profile .jp-sprite{position:static!important;inset:auto!important;left:auto!important;right:auto!important;top:auto!important;bottom:auto!important;transform:none!important;float:none!important;display:block!important;width:88px!important;height:88px!important;max-width:88px!important;max-height:88px!important;margin:0!important;align-self:start!important;justify-self:center!important}
      #jrpg-polish .jp-name{font-size:17px!important;margin:0 0 1px!important;line-height:1!important}
      #jrpg-polish .jp-rank{font-size:12px!important;line-height:1.1!important}
      #jrpg-polish .jp-muted{font-size:9px!important;line-height:1.15!important;white-space:normal!important}
      #jrpg-polish .jp-profile>div>div[style]{margin-top:4px!important;font-size:10px!important;line-height:1.05!important}
      #jrpg-polish .jp-bar{height:6px!important;margin:2px 0 3px!important;max-width:230px!important}
      #jrpg-polish .jp-root .jp-grid{gap:4px!important;margin-top:5px!important}
      #jrpg-polish .jp-root .jp-stat{padding:4px 6px!important;font-size:8px!important;line-height:1!important;min-height:0!important}
      #jrpg-polish .jp-root .jp-stat b{font-size:12px!important;margin-top:2px!important}
      #jrpg-polish .jp-card{padding:6px!important;margin-bottom:5px!important}
      #jrpg-polish .jp-desc{font-size:10px!important;line-height:1.25!important}
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