'use strict';
(()=>{
  const xhr=new XMLHttpRequest();
  xhr.open('GET','src/game.js?v=20260807-1324',false);
  xhr.send(null);
  if(xhr.status<200||xhr.status>=300)throw new Error('Unable to load game core: '+xhr.status);
  let source=xhr.responseText;
  source=source.replace("function person(x,y,kind='kael',frame=0,scale=1.2){",`function person(x,y,kind='kael',frame=0,scale=1.2){
    if(kind==='kael'&&window.KaelLevel01&&window.KaelLevel01.idle&&window.KaelLevel01.idle.complete){
      const a=window.KaelLevel01, fw=a.frameW||64, fh=a.frameH||64, cols=a.frames||12;
      const f=Math.abs(frame||0)%cols, dw=42*scale, dh=42*scale;
      ctx.save();ctx.imageSmoothingEnabled=false;
      ctx.drawImage(a.idle,f*fw,0,fw,fh,Math.round(x-dw/2),Math.round(y-dh*.72),Math.round(dw),Math.round(dh));
      ctx.restore();return;
    }`);
  source=source.replace(/new Game\(\);\s*\}\)\(\);?\s*$/,'window.__safehavenGame=new Game();\n})();');
  (0,eval)(source+'\n//# sourceURL=src/game.js');
  if(!window.__safehavenGame)throw new Error('SafeHaven game instance was not exposed.');
})();