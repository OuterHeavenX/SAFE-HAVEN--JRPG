'use strict';
(()=>{
  const walk=new Image(),idle=new Image(),attack=new Image();
  const asset={
    walk,idle,attack,ready:false,failed:false,
    frameW:64,frameH:64,
    walkCols:6,idleCols:12,attackCols:8,rows:4,
    directions:{left:1,right:2,down:0,up:3}
  };
  let walkReady=false,idleReady=false,attackReady=false;
  const sync=()=>{asset.ready=walkReady;asset.idleReady=idleReady;asset.attackReady=attackReady;asset.failed=!walkReady;};
  walk.onload=()=>{walkReady=true;sync();};
  walk.onerror=()=>{asset.failed=true;console.warn('Kael Level 01 walk sprite failed to load.');sync();};
  idle.onload=()=>{idleReady=true;sync();};
  idle.onerror=()=>{console.warn('Kael Level 01 idle sprite failed to load; battle will fall back safely.');sync();};
  attack.onload=()=>{attackReady=true;sync();};
  attack.onerror=()=>{console.warn('Kael Level 01 attack sprite failed to load; battle will fall back safely.');sync();};
  idle.src='assets/kael/sprites/Swordsman_lvl1_Idle_with_shadow.png?v=20260808-kaelb1';
  attack.src='assets/kael/sprites/Swordsman_lvl1_attack_with_shadow.png?v=20260808-kaelb1';
  try{
    const xhr=new XMLHttpRequest();
    xhr.open('GET','assets/sprites/kael/level-01/walk-base64.txt?v=20260807-1450',false);
    xhr.send(null);
    if(xhr.status>=200&&xhr.status<300)walk.src='data:image/png;base64,'+xhr.responseText.trim();
    else{asset.failed=true;console.warn('Kael Level 01 sprite payload unavailable:',xhr.status);sync();}
  }catch(error){asset.failed=true;console.warn('Kael Level 01 sprite payload error.',error);sync();}
  window.KaelLevel01=asset;
})();