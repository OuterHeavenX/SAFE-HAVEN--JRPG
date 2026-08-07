'use strict';
(()=>{
  if(!window.SH||!SH.DATA?.enemies||!SH.Save)return;
  const aliases={
    greyWolf:'wolf',grayWolf:'wolf',grey_wolf:'wolf',gray_wolf:'wolf',
    gloomHornet:'hornet',gloom_hornet:'hornet',
    poisonToad:'toad',poison_toad:'toad',
    caveBat:'bat',cave_bat:'bat',
    silver_slime:'silverSlime',silverslime:'silverSlime',
    stoneBack:'stoneback',stone_back:'stoneback'
  };
  const mergeObject=(dst,src)=>{if(!src||typeof src!=='object')return dst||{};return Object.assign(dst||{},src)};
  function normalize(state){
    if(!state||typeof state!=='object')return state;
    state.bestiary=state.bestiary&&typeof state.bestiary==='object'?state.bestiary:{};
    state.bestiaryDetail=state.bestiaryDetail&&typeof state.bestiaryDetail==='object'?state.bestiaryDetail:{};
    state.elementDiscovery=state.elementDiscovery&&typeof state.elementDiscovery==='object'?state.elementDiscovery:{};
    state.bestiaryLegacy=state.bestiaryLegacy&&typeof state.bestiaryLegacy==='object'?state.bestiaryLegacy:{};
    for(const id of Object.keys(state.bestiary)){
      if(SH.DATA.enemies[id])continue;
      const mapped=aliases[id];
      const count=Math.max(0,Number(state.bestiary[id])||0);
      if(mapped&&SH.DATA.enemies[mapped]){
        state.bestiary[mapped]=Math.max(Number(state.bestiary[mapped])||0,count);
        if(state.bestiaryDetail[id])state.bestiaryDetail[mapped]=mergeObject(state.bestiaryDetail[mapped],state.bestiaryDetail[id]);
        if(state.elementDiscovery[id])state.elementDiscovery[mapped]=mergeObject(state.elementDiscovery[mapped],state.elementDiscovery[id]);
      }else{
        state.bestiaryLegacy[id]={count,detail:state.bestiaryDetail[id]||null,elements:state.elementDiscovery[id]||null};
      }
      delete state.bestiary[id];
      delete state.bestiaryDetail[id];
      delete state.elementDiscovery[id];
    }
    return state;
  }
  window.SHNormalizeBestiary=normalize;
  const oldRead=SH.Save.read.bind(SH.Save),oldWrite=SH.Save.write.bind(SH.Save);
  SH.Save.read=function(slot){return normalize(oldRead(slot))};
  SH.Save.write=function(slot,state){return oldWrite(slot,normalize(state))};
  if(window.__safehavenGame?.s)normalize(window.__safehavenGame.s);
})();
