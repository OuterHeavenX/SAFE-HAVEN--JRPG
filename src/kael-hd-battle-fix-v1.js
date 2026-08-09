'use strict';
(()=>{
  const canvas=document.getElementById('game');
  const ctx=canvas?.getContext('2d');
  const hd=window.SafeHavenKaelHDBase;
  const game=()=>window.__safehavenGame;
  if(!canvas||!ctx||!hd)return;

  const original=CanvasRenderingContext2D.prototype.drawImage;
  const battleActionNames=['battle_ready','attack','heavy_attack','magic','defend','critical','ko','victory','levelup'];
  const battleActionImages=()=>new Set(battleActionNames.map(n=>hd.animations?.[n]?.image).filter(Boolean));

  function drawMirrored(image,sx,sy,sw,sh,dx,dy,dw,dh){
    const cx=dx+dw/2;
    ctx.save();
    ctx.translate(Math.round(cx*2),0);
    ctx.scale(-1,1);
    const result=original.call(ctx,image,sx,sy,sw,sh,dx,dy,dw,dh);
    ctx.restore();
    return result;
  }

  function stableStepSource(clip,sx){
    const fw=clip?.frameW||64;
    const requested=Math.max(0,Math.floor(sx/fw));
    const stableFrame=(requested%8)<4?0:4;
    return stableFrame*fw;
  }

  CanvasRenderingContext2D.prototype.drawImage=function(image,...args){
    if(this!==ctx||args.length!==8)return original.call(this,image,...args);

    const mode=game()?.mode;
    const [sx,sy,sw,sh,dx,dy,dw,dh]=args;

    if(mode==='world'){
      const walkDown=hd.animations?.walk_down;
      const walkLeft=hd.animations?.walk_left;
      const walkRight=hd.animations?.walk_right;
      const walkUp=hd.animations?.walk_up;
      const leftIdle=hd.animations?.idle_left;
      const rightIdle=hd.animations?.idle_right;

      if(walkLeft?.image===image&&walkRight?.ready&&walkRight.image?.complete){
        return drawMirrored(walkRight.image,stableStepSource(walkRight,sx),0,walkRight.frameW||64,walkRight.frameH||80,dx,dy,dw,dh);
      }
      if(walkRight?.image===image){
        return original.call(this,image,stableStepSource(walkRight,sx),0,walkRight.frameW||64,walkRight.frameH||80,dx,dy,dw,dh);
      }
      if(walkDown?.image===image){
        return original.call(this,image,stableStepSource(walkDown,sx),0,walkDown.frameW||64,walkDown.frameH||80,dx,dy,dw,dh);
      }
      if(walkUp?.image===image){
        return original.call(this,image,stableStepSource(walkUp,sx),0,walkUp.frameW||64,walkUp.frameH||80,dx,dy,dw,dh);
      }
      if(leftIdle?.image===image&&rightIdle?.ready&&rightIdle.image?.complete){
        return drawMirrored(rightIdle.image,sx,0,rightIdle.frameW||64,rightIdle.frameH||80,dx,dy,dw,dh);
      }
      return original.call(this,image,...args);
    }

    if(mode!=='battle')return original.call(this,image,...args);

    const battleIdle=hd.animations?.battle_idle;
    const battleReady=hd.animations?.battle_ready;
    const battleHurt=hd.animations?.battle_hurt;
    const centerX=dx+dw/2;
    const anchorY=dy+dh*.68;
    const outW=128,outH=160;
    const outX=Math.round(centerX-outW/2);
    const outY=Math.round(anchorY-outH*.68);

    // Generated ready frames change apparent body size. Keep one clean combat pose
    // and animate breathing with a tiny vertical motion instead of morphing Kael.
    if(battleIdle?.image===image&&battleReady?.ready&&battleReady.image?.complete){
      const breathe=Math.round(Math.sin(performance.now()/320)*1.5);
      return drawMirrored(battleReady.image,0,0,battleReady.frameW||128,battleReady.frameH||160,outX,outY+breathe,outW,outH);
    }

    // The generated hurt sheet clips Kael. Use the stable combat pose with a quick
    // recoil; the existing battle FX supplies the red impact flash and damage text.
    if(battleHurt?.image===image&&battleReady?.ready&&battleReady.image?.complete){
      const recoil=Math.round(5+Math.sin(performance.now()/45)*2);
      return drawMirrored(battleReady.image,0,0,battleReady.frameW||128,battleReady.frameH||160,outX+recoil,outY,outW,outH);
    }

    if(battleActionImages().has(image)){
      return drawMirrored(image,sx,sy,sw,sh,outX,outY,outW,outH);
    }

    return original.call(this,image,...args);
  };
})();
