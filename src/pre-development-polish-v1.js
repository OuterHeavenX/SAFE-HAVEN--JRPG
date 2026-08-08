'use strict';
(()=>{
  const g=window.__safehavenGame;
  if(!g)return;

  // Eldenbrook should never expose empty canvas above the north edge.
  // Preserve the existing camera everywhere else.
  if(typeof g.camera==='function'&&!g.__eldCameraAligned){
    const camera=g.camera.bind(g);
    g.camera=function(map,tileSize){
      const out=camera(map,tileSize);
      if(this.s?.map==='town'&&out&&Number.isFinite(out.oy)&&out.oy>0)out.oy=0;
      return out;
    };
    g.__eldCameraAligned=true;
  }

  // Canvas-rendered menus (not world/battle) were visually oversized on landscape phones.
  if(window.SH?.UI&&typeof SH.UI.text==='function'&&!SH.UI.__compactMenus){
    const text=SH.UI.text.bind(SH.UI);
    SH.UI.text=function(ctx,value,x,y,size=18,color='#fff3cc',align='left'){
      let s=size;
      if(g.menu&&Number.isFinite(s)&&s>=13){
        const factor=g.menu.page==='status'?0.78:0.84;
        s=Math.max(10,Math.round(s*factor));
      }
      return text(ctx,value,x,y,s,color,align);
    };
    SH.UI.__compactMenus=true;
  }

  const style=document.createElement('style');
  style.id='pre-development-polish-style';
  style.textContent=`
    /* Compact JRPG menu scale. Presentation only. */
    #classic-ui button{font-size:13px!important;padding:7px 10px!important;}
    #classic-ui .cj-title{font-size:18px!important;letter-spacing:.35px!important;}
    #classic-ui .cj-muted{font-size:11px!important;}
    #classic-ui .cj-jobs{top:7%!important;height:84%!important;}
    #classic-ui .cj-disc{padding:14px!important;}
    #classic-ui .cj-disc button{margin:5px 0!important;min-height:42px!important;}
    #classic-ui .cj-abilities{padding:14px!important;font-size:14px!important;line-height:1.25!important;}
    #classic-ui .cj-abilities p{margin:8px 0 10px!important;}
    #classic-ui .cj-ability{padding:8px!important;margin:5px 0!important;gap:6px!important;}
    #classic-ui .cj-ability small{font-size:11px!important;line-height:1.25!important;}
    #classic-ui .cj-bestiary{top:8%!important;height:80%!important;}
    #classic-ui .cj-best-list{padding:13px!important;}
    #classic-ui .cj-best-list button{margin:4px 0!important;min-height:38px!important;}
    #classic-ui .cj-best-detail{padding:16px!important;font-size:14px!important;line-height:1.25!important;}
    #classic-ui .cj-best-detail p{margin:8px 0!important;}
    #classic-ui .cj-statgrid{gap:6px!important;margin-top:9px!important;}
    #classic-ui .cj-statgrid div{padding:7px!important;font-size:13px!important;}
    #direct-touch-ui .dt-menu-root button{font-size:14px!important;}
    #direct-touch-ui .dt-simple-list button{font-size:13px!important;}
    #direct-touch-ui .dt-equip-list button{font-size:13px!important;}
    #direct-touch-ui .dt-job-list button{font-size:14px!important;}
    #direct-touch-ui .dt-back{font-size:12px!important;padding:7px 13px!important;}
    @media (orientation:landscape) and (pointer:coarse){
      #classic-ui .cj-title{font-size:16px!important;}
      #classic-ui button{font-size:12px!important;padding:6px 9px!important;}
      #classic-ui .cj-jobs{left:6%!important;top:6%!important;width:88%!important;height:86%!important;grid-template-columns:31% 69%!important;}
      #classic-ui .cj-disc,#classic-ui .cj-abilities{padding:11px!important;}
      #classic-ui .cj-disc button{min-height:36px!important;margin:4px 0!important;}
      #classic-ui .cj-ability{padding:6px!important;margin:4px 0!important;}
      #classic-ui .cj-bestiary{left:7%!important;top:6%!important;width:86%!important;height:86%!important;}
      #classic-ui .cj-best-list{padding:10px!important;}
      #classic-ui .cj-best-detail{padding:12px!important;font-size:12px!important;}
      #classic-ui .cj-statgrid div{padding:6px!important;font-size:12px!important;}
    }
  `;
  document.head.appendChild(style);
})();