'use strict';
(()=>{
  // Keep Kael's HD walk-cycle clock continuous while mobile thumb input
  // jitters between adjacent 8-way directions. The renderer is still free
  // to swap directional sheets immediately; only walk/idle state changes
  // restart the animation phase.
  let animStarted=Number(window.KaelAnimStartedAt)||performance.now();
  let lastMoving=!!window.KaelIsMoving;
  try{
    Object.defineProperty(window,'KaelAnimStartedAt',{
      configurable:true,
      enumerable:true,
      get(){return animStarted;},
      set(value){
        const next=Number(value);
        const moving=!!window.KaelIsMoving;
        if(!Number.isFinite(next))return;
        if(moving!==lastMoving||!moving){
          animStarted=next;
          lastMoving=moving;
        }
      }
    });
  }catch(error){
    console.warn('SafeHaven: mobile Kael animation clock guard unavailable.',error);
  }

  // Add light hysteresis to touch direction changes. Adjacent cardinal ↔
  // diagonal changes must remain stable briefly before they are accepted,
  // preventing tiny thumb tremors from constantly swapping sprite sheets.
  let heldDir=window.KaelTouchHeldDir||null;
  let candidate=null;
  let candidateSince=0;
  const parts=dir=>String(dir||'').split('-').filter(Boolean);
  const adjacent=(a,b)=>{
    if(!a||!b||a===b)return false;
    const aa=parts(a),bb=parts(b);
    return aa.some(x=>bb.includes(x));
  };
  try{
    Object.defineProperty(window,'KaelTouchHeldDir',{
      configurable:true,
      enumerable:true,
      get(){return heldDir;},
      set(value){
        const next=value||null;
        const now=performance.now();
        if(next===null){
          heldDir=null;candidate=null;candidateSince=0;
          return;
        }
        if(!heldDir||next===heldDir){
          heldDir=next;candidate=null;candidateSince=0;
          if(window.KaelLevel01?.family==='hd')window.KaelFacing=next;
          return;
        }
        if(!adjacent(heldDir,next)){
          heldDir=next;candidate=null;candidateSince=0;
          if(window.KaelLevel01?.family==='hd')window.KaelFacing=next;
          return;
        }
        if(candidate!==next){candidate=next;candidateSince=now;return;}
        if(now-candidateSince>=70){
          heldDir=next;candidate=null;candidateSince=0;
          if(window.KaelLevel01?.family==='hd')window.KaelFacing=next;
        }else if(window.KaelLevel01?.family==='hd'){
          window.KaelFacing=heldDir;
        }
      }
    });
  }catch(error){
    console.warn('SafeHaven: mobile Kael direction hysteresis unavailable.',error);
  }
})();
