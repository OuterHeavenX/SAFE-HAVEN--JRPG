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
  const asArray=v=>Array.isArray(v)?v:(v==null?[]:[v]);
  const asObject=v=>v&&typeof v==='object'&&!Array.isArray(v)?v:{};
  const mergeObject=(dst,src)=>Object.assign(asObject(dst),asObject(src));
  function normalizeEnemy(e0,id){
    const e=e0&&typeof e0==='object'?e0:{name:id};
    e.name=String(e.name||id||'Unknown Enemy');
    e.hp=Math.max(1,Number(e.hp)||1);e.xp=Math.max(0,Number(e.xp)||0);e.jp=Math.max(0,Number(e.jp)||0);
    e.gold=Array.isArray(e.gold)&&e.gold.length>=2?[Number(e.gold[0])||0,Number(e.gold[1])||0]:[0,0];
    e.weaknesses=asArray(e.weaknesses||e.weak).filter(Boolean);e.resistances=asArray(e.resistances).filter(Boolean);e.immunities=asArray(e.immunities||e.immune).filter(Boolean);
    e.locations=asArray(e.locations||'Unknown Region').filter(Boolean).map(String);e.lore=String(e.lore||`${e.name} remains only partially documented.`);
    return e;
  }
  function normalizeEnemyRegistry(){for(const [id,e] of Object.entries(SH.DATA.enemies||{}))SH.DATA.enemies[id]=normalizeEnemy(e,id)}
  function normalizeDetail(d0,e){
    const d=asObject(d0);d.seen=!!d.seen;d.hp=Math.max(0,Number(d.hp)||Number(e?.hp)||0);d.xp=Math.max(0,Number(d.xp)||Number(e?.xp)||0);d.jp=Math.max(0,Number(d.jp)||Number(e?.jp)||0);
    d.gold=Array.isArray(d.gold)&&d.gold.length>=2?[Number(d.gold[0])||0,Number(d.gold[1])||0]:(Array.isArray(e?.gold)?e.gold.slice(0,2):[0,0]);
    d.drops=asArray(d.drops).filter(Boolean).map(String);d.locations=asArray(d.locations||e?.locations||'Unknown Region').filter(Boolean).map(String);d.weaknesses=asArray(d.weaknesses).filter(Boolean);d.resistances=asArray(d.resistances).filter(Boolean);return d;
  }
  function normalize(state){
    if(!state||typeof state!=='object')return state;normalizeEnemyRegistry();state.bestiary=asObject(state.bestiary);state.bestiaryDetail=asObject(state.bestiaryDetail);state.elementDiscovery=asObject(state.elementDiscovery);state.bestiaryLegacy=asObject(state.bestiaryLegacy);
    for(const id of Object.keys(state.bestiary)){
      if(SH.DATA.enemies[id])continue;const mapped=aliases[id],count=Math.max(0,Number(state.bestiary[id])||0);
      if(mapped&&SH.DATA.enemies[mapped]){state.bestiary[mapped]=Math.max(Number(state.bestiary[mapped])||0,count);if(state.bestiaryDetail[id])state.bestiaryDetail[mapped]=mergeObject(state.bestiaryDetail[mapped],state.bestiaryDetail[id]);if(state.elementDiscovery[id])state.elementDiscovery[mapped]=mergeObject(state.elementDiscovery[mapped],state.elementDiscovery[id]);}
      else state.bestiaryLegacy[id]={count,detail:state.bestiaryDetail[id]||null,elements:state.elementDiscovery[id]||null};
      delete state.bestiary[id];delete state.bestiaryDetail[id];delete state.elementDiscovery[id];
    }
    for(const id of Object.keys(state.bestiary)){if(!SH.DATA.enemies[id]){delete state.bestiary[id];continue;}state.bestiary[id]=Math.max(0,Number(state.bestiary[id])||0);state.bestiaryDetail[id]=normalizeDetail(state.bestiaryDetail[id],SH.DATA.enemies[id]);state.elementDiscovery[id]=asObject(state.elementDiscovery[id]);}
    return state;
  }
  window.SHNormalizeBestiary=normalize;
  normalizeEnemyRegistry();
  const registry=SH.DATA.enemies;
  try{SH.DATA.enemies=new Proxy(registry,{get(target,prop,receiver){if(typeof prop==='string'&&!(prop in target))return normalizeEnemy(null,prop);return Reflect.get(target,prop,receiver)}})}catch(_proxyError){}
  const oldRead=SH.Save.read.bind(SH.Save),oldWrite=SH.Save.write.bind(SH.Save);SH.Save.read=function(slot){return normalize(oldRead(slot))};SH.Save.write=function(slot,state){return oldWrite(slot,normalize(state))};
  const g=window.__safehavenGame;if(g?.s)normalize(g.s);if(g?.menuInput){const oldMenuInput=g.menuInput.bind(g);g.menuInput=function(action){normalize(this.s);const r=oldMenuInput(action);normalize(this.s);return r}}
  setInterval(()=>{if(window.__safehavenGame?.s)normalize(window.__safehavenGame.s)},250);
})();
