'use strict';
(()=>{
  const xhr=new XMLHttpRequest();
  xhr.open('GET','src/game.js?v=20260807-1528',false);
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
        const row=(a.directions&&a.directions[facing]!=null)?a.directions[facing]:0;
        const moving=!!window.KaelIsMoving;
        const f=moving?(Math.floor(performance.now()/95)%cols):0;
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

  source=source.replace(
    "camera(m,tw){const mw=m.w*tw,mh=m.h*tw;let ox=480-this.s.x*tw,oy=270-this.s.y*tw;",
    "camera(m,tw){const mw=m.w*tw,mh=m.h*tw;const vx=Number.isFinite(window.KaelVisualX)?window.KaelVisualX:this.s.x,vy=Number.isFinite(window.KaelVisualY)?window.KaelVisualY:this.s.y;let ox=480-vx*tw,oy=270-vy*tw;"
  );

  source=source.replace(
    "const playerX=ox+this.s.x*tw,playerY=oy+this.s.y*tw;person(playerX,playerY,'kael',Math.floor(this.anim*4),this.s.map==='home'?1.4:1.25);",
    "const pvx=Number.isFinite(window.KaelVisualX)?window.KaelVisualX:this.s.x,pvy=Number.isFinite(window.KaelVisualY)?window.KaelVisualY:this.s.y;const playerX=ox+pvx*tw,playerY=oy+pvy*tw;person(playerX,playerY,'kael',Math.floor(this.anim*4),this.s.map==='home'?1.4:1.25);"
  );

  source=source.replace(/new Game\(\);\s*\}\)\(\);?\s*$/,'window.__safehavenGame=new Game();\n})();');
  (0,eval)(source+'\n//# sourceURL=src/game.js');
  if(!window.__safehavenGame)throw new Error('SafeHaven game instance was not exposed.');

  window.KaelFacing=window.KaelFacing||'down';
  window.KaelVisualX=NaN;
  window.KaelVisualY=NaN;
  window.KaelVisualMap=null;
  window.KaelIsMoving=false;

  const game=window.__safehavenGame;
  const originalInput=game.input.bind(game);
  game.input=function(action){
    if(['up','down','left','right'].includes(action)&&this.mode==='world'&&!this.dialog&&!this.menu&&!this.shop){
      window.KaelFacing=action;
      // Do not queue more grid moves while the current visual step is still resolving.
      // This prevents keyboard auto-repeat from building a movement backlog that
      // continues after the player releases the key.
      if(window.KaelIsMoving)return;
    }
    return originalInput(action);
  };

  const originalLoop=game.loop.bind(game);
  let lastVisualTime=performance.now();
  game.loop=function(t){
    const now=Number.isFinite(t)?t:performance.now();
    const dt=Math.max(0,Math.min(40,now-lastVisualTime));
    lastVisualTime=now;

    if(this.s&&this.mode==='world'){
      const map=this.s.map;
      if(window.KaelVisualMap!==map||!Number.isFinite(window.KaelVisualX)||!Number.isFinite(window.KaelVisualY)){
        window.KaelVisualMap=map;
        window.KaelVisualX=this.s.x;
        window.KaelVisualY=this.s.y;
        window.KaelIsMoving=false;
      }else{
        const dx=this.s.x-window.KaelVisualX;
        const dy=this.s.y-window.KaelVisualY;
        const dist=Math.hypot(dx,dy);
        if(dist>0.001){
          const maxStep=dt/90;
          if(dist<=maxStep){
            window.KaelVisualX=this.s.x;
            window.KaelVisualY=this.s.y;
            window.KaelIsMoving=false;
          }else{
            window.KaelVisualX+=dx/dist*maxStep;
            window.KaelVisualY+=dy/dist*maxStep;
            window.KaelIsMoving=true;
          }
        }else{
          window.KaelVisualX=this.s.x;
          window.KaelVisualY=this.s.y;
          window.KaelIsMoving=false;
        }
      }
    }else{
      window.KaelIsMoving=false;
    }

    return originalLoop(now);
  };
})();