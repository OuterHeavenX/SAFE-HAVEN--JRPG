'use strict';
(()=>{
  const style=document.createElement('style');
  style.textContent=`
  /* SafeHaven landscape JRPG UI guard — presentation only */
  .cj-targets{
    left:5%!important;
    top:auto!important;
    bottom:11%!important;
    width:34%!important;
    max-height:42%!important;
    padding:11px!important;
    overflow:auto!important;
  }
  .cj-targets .cj-title{font-size:18px!important;margin-bottom:6px!important}
  .cj-targets button{min-height:42px!important;margin:5px 0!important;padding:8px 10px!important;font-size:14px!important}

  .cj-victory{
    left:20%!important;
    top:6%!important;
    width:60%!important;
    min-height:0!important;
    max-height:88%!important;
    padding:18px 22px!important;
    overflow:auto!important;
  }
  .cj-victory .cj-title{font-size:25px!important}
  .cj-victory .cj-muted{font-size:12px!important}
  .cj-victory .cj-rewards{gap:8px!important;margin:12px 0!important}
  .cj-victory .cj-reward{padding:9px!important}
  .cj-victory .cj-reward strong{font-size:22px!important}
  .cj-victory .cj-drops{min-height:0!important;padding:8px!important}
  .cj-victory .cj-level{margin-top:9px!important;padding:8px!important}
  .cj-victory .cj-actions{margin-top:10px!important}
  .cj-victory .cj-actions button{min-height:42px!important;padding:8px 18px!important}

  body.cj-victory-open #direct-touch-ui .dt-battle,
  body.cj-victory-open #modal-touch{display:none!important}

  @media (max-height:520px){
    .cj-targets{bottom:9%!important;width:36%!important;max-height:39%!important;padding:9px!important}
    .cj-targets .cj-title{font-size:16px!important}
    .cj-targets button{min-height:38px!important;font-size:13px!important;margin:4px 0!important}

    .cj-victory{left:17%!important;top:3%!important;width:66%!important;max-height:92%!important;padding:13px 18px!important}
    .cj-victory .cj-title{font-size:22px!important}
    .cj-victory .cj-rewards{margin:9px 0!important}
    .cj-victory .cj-reward{padding:7px!important}
    .cj-victory .cj-reward strong{font-size:20px!important}
    .cj-victory .cj-drops{padding:6px 8px!important}
    .cj-victory .cj-level{margin-top:7px!important;padding:7px!important}
    .cj-victory .cj-actions{margin-top:7px!important}
  }
  `;
  document.head.appendChild(style);

  const sync=()=>document.body.classList.toggle('cj-victory-open',!!window.SHClassicVictory);
  sync();
  setInterval(sync,80);

  if(!document.getElementById('jrpg-ui-touch-gesture-v1')){
    const script=document.createElement('script');
    script.id='jrpg-ui-touch-gesture-v1';
    script.src='src/jrpg-ui-touch-gesture-v1.js?v=20260808-touch1';
    document.body.appendChild(script);
  }
})();
