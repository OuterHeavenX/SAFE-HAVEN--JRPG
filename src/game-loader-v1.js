'use strict';
(()=>{
  const xhr=new XMLHttpRequest();
  xhr.open('GET','src/game.js?v=20260807-1336',false);
  xhr.send(null);
  if(xhr.status<200||xhr.status>=300)throw new Error('Unable to load game core: '+xhr.status);
  let source=xhr.responseText;
  source=source.replace("function person(x,y,kind='kael',frame=0,scale=1.2){",`function person(x,y,kind='kael',frame=0,scale=1.2){
    if(kind==='kael'&&window.KaelLevel01&&window.KaelLevel01.idle){
      const a=window.KaelLevel01, image=a.idle;
      const imageReady=image.complete&&image.naturalWidth>0&&image.naturalHeight>0;
      if(imageReady){
        const fw=a.frameW||64, fh=a.frameH||64;
        const sheetCols=Math.max(1,Math.floor(image.naturalWidth/fw));
        const frames=Math.max(1,Math.min(a.frames||sheetCols,sheetCols));
        const f=Math.abs(frame||0)%frames, dw=42*scale, dh=42*scale;
        try{
          ctx.save();ctx.imageSmoothingEnabled=false;
          ctx.drawImage(image,f*fw,0,fw,fh,Math.round(x-dw/2),Math.round(y-dh*.72),Math.round(dw),Math.round(dh));
          ctx.restore();return;
        }catch(spriteError){
          try{ctx.restore();}catch(_restoreError){}
          if(!a.drawFailedLogged){a.drawFailedLogged=true;console.warn('Kael sprite unavailable; using safe fallback.',spriteError);}
        }
      }
    }`);
  source=source.replace(/new Game\(\);\s*\}\)\(\);?\s*$/,'window.__safehavenGame=new Game();\n})();');
  (0,eval)(source+'\n//# sourceURL=src/game.js');
  if(!window.__safehavenGame)throw new Error('SafeHaven game instance was not exposed.');
})();