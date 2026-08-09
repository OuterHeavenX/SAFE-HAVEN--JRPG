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

  function drawMirrored(image,sx,sy,sw,sh,dx,dy,dw,dh){
    const cx=dx+dw/2;
    ctx.save();
    ctx.translate(Math.round(cx*2),0);
    ctx.scale(-1,1);
    const result=original.call(ctx,image,sx,sy,sw,sh,dx,dy,dw,dh);
    ctx.restore();
    return result;
  }

  CanvasRenderingContext2D.prototype.drawImage=function(image,...args){
    if(this!==ctx||args.length!==8)return original.call(this,image,...args);

    const mode=game()?.mode;
    const [sx,sy,sw,sh,dx,dy,dw,dh]=args;

    // Generated left/right overworld sheets drifted in apparent character scale.
    // Use the right-facing authoritative silhouette for left movement and mirror it,
    // guaranteeing identical proportions, anchor, and rendered size in both directions.
    if(mode==='world'){
      const leftWalk=hd.animations?.walk_left,rightWalk=hd.animations?.walk_right;
      const leftIdle=hd.animations?.idle_left,rightIdle=hd.animations?.idle_right;
      if(leftWalk?.image===image&&rightWalk?.ready&&rightWalk.image?.complete){
        return drawMirrored(rightWalk.image,sx,0,rightWalk.frameW||64,rightWalk.frameH||80,dx,dy,dw,dh);
      }
      if(leftIdle?.image===image&&rightIdle?.ready&&rightIdle.image?.complete){
        return drawMirrored(rightIdle.image,sx,0,rightIdle.frameW||64,rightIdle.frameH||80,dx,dy,dw,dh);
      }
      return original.call(this,image,...args);
    }

    if(mode!=='battle')return original.call(this,image,...args);

    const battleIdle=hd.animations?.battle_idle;
    const battleReady=hd.animations?.battle_ready;
    const centerX=dx+dw/2;
    const anchorY=dy+dh*.68;
    const outW=128,outH=160;
    const outX=Math.round(centerX-outW/2);
    const outY=Math.round(anchorY-outH*.68);

    // The runtime asks for battle_idle during Kael's waiting state. Render the
    // dedicated 6-frame battle-ready stance instead, preserving a real combat pose.
    if(battleIdle?.image===image&&battleReady?.ready&&battleReady.image?.complete){
      const frame=Math.max(0,Math.floor(sx/(battleIdle.frameW||128)))%(battleReady.frames||6);
      return drawMirrored(
        battleReady.image,
        frame*(battleReady.frameW||128),0,
        battleReady.frameW||128,battleReady.frameH||160,
        outX,outY,outW,outH
      );
    }

    // Dedicated battle actions remain native 128x160 and face toward enemies.
    if(actionImages().has(image)){
      return drawMirrored(image,sx,sy,sw,sh,outX,outY,outW,outH);
    }

    return original.call(this,image,...args);
  };
})();
