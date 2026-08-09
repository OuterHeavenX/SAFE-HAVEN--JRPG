'use strict';
(()=>{
  const makeSet=(level,paths)=>{
    const walk=new Image(),idle=new Image(),attack=new Image();
    const set={level,walk,idle,attack,ready:false,idleReady:false,attackReady:false,frameW:64,frameH:64,walkCols:6,idleCols:12,attackCols:8,rows:4,directions:{left:1,right:2,down:0,up:3}};
    const sync=()=>{set.ready=!!(walk.complete&&walk.naturalWidth);set.idleReady=!!(idle.complete&&idle.naturalWidth);set.attackReady=!!(attack.complete&&attack.naturalWidth)};
    walk.onload=idle.onload=attack.onload=sync;
    walk.onerror=()=>console.warn(`Kael Level ${level} walk sprite failed to load; using previous available major level.`);
    idle.onerror=()=>console.warn(`Kael Level ${level} idle sprite failed to load; battle will use the previous available major level.`);
    attack.onerror=()=>console.warn(`Kael Level ${level} attack sprite failed to load; battle will use the previous available major level.`);
    walk.src=paths.walk;idle.src=paths.idle;attack.src=paths.attack;
    return set;
  };
  const sets={1:window.KaelLevel01};
  sets[2]=makeSet(2,{
    walk:'assets/kael/sprites/Swordsman_lvl2_Walk_with_shadow.png?v=20260808-levelbreak1',
    idle:'assets/kael/sprites/Swordsman_lvl2_Idle_with_shadow.png?v=20260808-levelbreak1',
    attack:'assets/kael/sprites/Swordsman_lvl2_attack_with_shadow.png?v=20260808-levelbreak1'
  });
  const majorFromRank=rank=>Math.max(1,Math.floor((Math.max(1,Number(rank)||1)-1)/9)+1);
  const latestAvailable=major=>{for(let m=major;m>=1;m--){const s=sets[m];if(s&&(m===1||s.ready||s.idleReady||s.attackReady))return s}return sets[1]};
  const current=()=>{const p=window.__safehavenGame?.s?.player;return latestAvailable(majorFromRank(p?.rank||p?.level||1))};
  window.SafeHavenKaelSprites={sets,current,majorFromRank,latestAvailable};
})();