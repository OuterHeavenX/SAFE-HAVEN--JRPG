'use strict';
(()=>{
  const canvas=document.getElementById('game');
  const ctx=canvas?.getContext('2d');
  const hd=window.SafeHavenKaelHDBase;
  const game=()=>window.__safehavenGame;
  if(!canvas||!ctx||!hd)return;

  const original=CanvasRenderingContext2D.prototype.drawImage;
  const actionNames=['battle_ready','attack','heavy_attack','magic','defend','battle_hurt','critical','ko','victory','levelup'];
  const actionImages=()=>new Set(actionNames.map(n=>hd.animations?.[n]?.image).filter(Boolean));

  CanvasRenderingContext2D.prototype.drawImage=function(image,...args){
    if(this!==ctx||game()?.mode!=='battle'||args.length!==8)return original.call(this,image,...args);

    const battleIdle=hd.animations?.battle_idle;
    const stableIdle=hd.animations?.idle_left;
    const [sx,sy,sw,sh,dx,dy,dw,dh]=args;
    const centerX=dx+dw/2;
    const anchorY=dy+dh*.68;
    const outW=128,outH=160;
    const outX=Math.round(centerX-outW/2);
    const outY=Math.round(anchorY-outH*.68);

    if(battleIdle?.image===image&&stableIdle?.ready&&stableIdle.image?.complete){
      const frame=Math.max(0,Math.floor(sx/(battleIdle.frameW||128)))%(stableIdle.frames||6);
      return original.call(this,stableIdle.image,frame*(stableIdle.frameW||64),0,stableIdle.frameW||64,stableIdle.frameH||80,outX,outY,outW,outH);
    }

    if(actionImages().has(image)){
      this.save();
      this.translate(Math.round(centerX*2),0);
      this.scale(-1,1);
      const result=original.call(this,image,sx,sy,sw,sh,outX,outY,outW,outH);
      this.restore();
      return result;
    }

    return original.call(this,image,...args);
  };
})();
