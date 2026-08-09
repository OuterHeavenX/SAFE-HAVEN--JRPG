'use strict';
(()=>{
  const legacyLevel1=window.KaelLevel01,hdBase=window.SafeHavenKaelHDBase;
  const majorFromRank=rank=>Math.max(1,Math.floor((Math.max(1,Number(rank)||1)-1)/9)+1);
  const makeLegacySet=(level,paths)=>{const walk=new Image(),idle=new Image(),attack=new Image(),set={level,family:'legacy',walk,idle,attack,ready:false,idleReady:false,attackReady:false,frameW:64,frameH:64,walkCols:6,idleCols:12,attackCols:8,rows:4,directions:{left:1,right:2,down:0,up:3}};const sync=()=>{set.ready=!!(walk.complete&&walk.naturalWidth);set.idleReady=!!(idle.complete&&idle.naturalWidth);set.attackReady=!!(attack.complete&&attack.naturalWidth)};walk.onload=idle.onload=attack.onload=sync;walk.onerror=idle.onerror=attack.onerror=()=>console.warn(`Legacy Kael Level ${level} sprite unavailable; authoritative HD Kael remains active.`);walk.src=paths.walk;idle.src=paths.idle;attack.src=paths.attack;return set};
  const legacySets={1:legacyLevel1,2:makeLegacySet(2,{walk:'assets/kael/sprites/Swordsman_lvl2_Walk_with_shadow.png?v=20260808-levelbreak1',idle:'assets/kael/sprites/Swordsman_lvl2_Idle_with_shadow.png?v=20260808-levelbreak1',attack:'assets/kael/sprites/Swordsman_lvl2_attack_with_shadow.png?v=20260808-levelbreak1'})},hdSets={1:hdBase};
  const config={family:'hd',enableMajorFamilySwap:false};
  const latestLegacyAvailable=major=>{for(let m=major;m>=1;m--){const s=legacySets[m];if(s&&(m===1||s.ready||s.idleReady||s.attackReady))return s}return legacySets[1]};
  const latestHDAvailable=major=>{const target=config.enableMajorFamilySwap?major:1;for(let m=target;m>=1;m--){if(hdSets[m])return hdSets[m]}return hdBase};
  const latestAvailable=major=>config.family==='hd'?latestHDAvailable(major):latestLegacyAvailable(major),current=()=>{const p=window.__safehavenGame?.s?.player;return latestAvailable(majorFromRank(p?.rank||p?.level||1))},activate=major=>{const selected=latestAvailable(major);if(selected)window.KaelLevel01=selected;return selected};
  const registerHDMajorSet=(major,set)=>{hdSets[Math.max(1,Number(major)||1)]=set;return set},setMajorFamilySwapping=enabled=>{config.enableMajorFamilySwap=!!enabled;document.documentElement.dataset.kaelMajorSpriteSwap=String(config.enableMajorFamilySwap);return activate(majorFromRank(window.__safehavenGame?.s?.player?.rank||1))};
  window.KaelLevel01=hdBase;window.SafeHavenKaelSprites={sets:legacySets,legacySets,hdSets,config,current,activate,majorFromRank,latestAvailable,latestLegacyAvailable,registerHDMajorSet,setMajorFamilySwapping,level1:hdBase,legacyLevel1};
  document.documentElement.dataset.kaelSpriteFamily=config.family;document.documentElement.dataset.kaelMajorSpriteSwap=String(config.enableMajorFamilySwap);document.documentElement.dataset.kaelSpriteSet=hdBase.id;
})();
