'use strict';
(()=>{
  const xhr=new XMLHttpRequest();
  xhr.open('GET','src/game.js?v=20260807-1450',false);
  xhr.send(null);
  if(xhr.status<200||xhr.status>=300)throw new Error('Unable to load game core: '+xhr.status);
  let source=xhr.responseText;
  source=source.replace("function person(x,y,kind='kael',frame=0,scale=1.2){",`function person(x,y,kind='kael',frame=0,scale=1.2){
    if(kind==='kael'&&window.KaelLevel01&&window.KaelLevel01.walk){
      const a=window.KaelLevel01, image=a.walk;
      const imageReady=a.ready&&image.complete&&image.naturalWidth>0&&image.naturalHeight>0;
      if(imageReady){
        const fw=a.frameW||64, fh=a.frameH||64, cols=a.cols||6;
        const facing=window.KaelFacing||'down';
        const row=(a.directions&&a.directions[facing]!=null)?a.directions[facing]:2;
        const moving=performance.now()<(window.KaelMovingUntil||0);
        const f=moving?(Math.floor(performance.now()/105)%cols):0;
        const dw=82*scale, dh=82*scale;
        try{
          ctx.save();ctx.imageSmoothingEnabled=false;
          ctx.drawImage(image,f*fw,row*fh,fw,fh,Math.round(x-dw/2),Math.round(y-dh*.55),Math.round(dw),Math.round(dh));
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
  window.KaelFacing=window.KaelFacing||'down';
  window.KaelMovingUntil=0;
  const game=window.__safehavenGame;
  const originalInput=game.input.bind(game);
  game.input=function(action){
    if(['up','down','left','right'].includes(action)&&this.mode==='world'&&!this.dialog&&!this.menu&&!this.shop){
      window.KaelFacing=action;
      window.KaelMovingUntil=performance.now()+190;
    }
    return originalInput(action);
  };
})();