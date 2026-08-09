'use strict';
(()=>{
  const base='assets/characters/kael/hd/';
  const defs={};
  for(const direction of ['down','down-right','right','up-right','up','up-left','left','down-left']){
    defs[`idle_${direction}`]=[`overworld/user/idle_${direction}.png`,256,256,1,1,true];
    defs[`walk_${direction}`]=[`overworld/user/walk_${direction}.png`,256,256,8,10,true];
  }
  Object.assign(defs,{
    battle_idle:['battle/idle/battle_idle.png',128,160,6,6,true],battle_ready:['battle/ready/battle_ready.png',128,160,6,8,true],attack:['battle/attack/attack.png',128,160,10,14,false],heavy_attack:['battle/heavy_attack/heavy_attack.png',128,160,12,12,false],magic:['battle/magic/magic.png',128,160,10,12,false],defend:['battle/defend/defend.png',128,160,6,8,false],battle_hurt:['battle/hurt/battle_hurt.png',128,160,6,12,false],critical:['battle/critical/critical.png',128,160,6,6,true],ko:['battle/ko/ko.png',128,160,10,10,false],victory:['battle/victory/victory.png',128,160,12,10,false],levelup:['battle/levelup/levelup.png',128,160,16,12,false]
  });
  const animations={},set={id:'kael-user-authored',family:'hd',majorLevel:1,authoritative:true,animations,ready:false,failed:false};
  let pending=Object.keys(defs).length;
  const settle=()=>{pending--;set.ready=pending===0&&Object.values(animations).some(a=>a.ready)};
  for(const [name,[path,frameW,frameH,frames,fps,loop]] of Object.entries(defs)){
    const image=new Image(),animation=animations[name]={name,image,frameW,frameH,frames,fps,loop,ready:false};
    image.onload=()=>{animation.ready=true;settle()};
    image.onerror=()=>{animation.failed=true;set.failed=true;console.warn(`Kael animation failed to load: ${name}`);settle()};
    image.src=`${base}${path}?v=20260809-kaeluser1`;
  }
  set.animation=name=>animations[name]?.ready?animations[name]:null;
  window.SafeHavenKaelHDBase=set;
})();
