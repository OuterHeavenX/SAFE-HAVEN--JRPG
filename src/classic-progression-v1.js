'use strict';
(()=>{
  window.SH=window.SH||{};
  const C=SH.Classic=SH.Classic||{};
  C.version=1;
  C.formatLevel=rank=>{rank=Math.max(1,Math.floor(Number(rank)||1));const major=Math.floor((rank-1)/9)+1,sub=((rank-1)%9)+1;return sub===1?`Lv ${major}`:`Lv ${major}-${sub}`};
  C.majorLevel=rank=>Math.floor((Math.max(1,rank)-1)/9)+1;
  C.nextRankXp=rank=>Math.round(45+Math.pow(Math.max(1,rank),1.28)*22);
  C.elements={physical:{name:'Physical'},fire:{name:'Fire'},ice:{name:'Ice'},lightning:{name:'Lightning'},holy:{name:'Holy'},dark:{name:'Dark'}};
  C.statuses={poison:{name:'Poison',duration:5},blind:{name:'Blind',duration:4},silence:{name:'Silence',duration:4},sleep:{name:'Sleep',duration:3},slow:{name:'Slow',duration:4},haste:{name:'Haste',duration:4},regen:{name:'Regen',duration:5},berserk:{name:'Berserk',duration:4},ko:{name:'KO',duration:0}};
  C.abilities={
    focus:{id:'focus',name:'Focus',discipline:'wanderer',jpCost:40,type:'skill',targetType:'self',description:'Center yourself; raises the force of the next physical attack.',prerequisites:[],requiredRank:1},
    trailSense:{id:'trailSense',name:'Trail Sense',discipline:'wanderer',jpCost:90,type:'passive',targetType:'self',description:'An explorer’s instinct for hidden finds.',prerequisites:['focus'],requiredRank:3},
    secondWind:{id:'secondWind',name:'Second Wind',discipline:'wanderer',jpCost:180,type:'skill',targetType:'self',description:'Restore a modest amount of HP once per battle.',prerequisites:['trailSense'],requiredRank:6},
    powerStrike:{id:'powerStrike',name:'Power Strike',discipline:'warrior',jpCost:45,type:'skill',power:1.45,element:'physical',targetType:'enemy',description:'A committed heavy strike.',prerequisites:[],requiredRank:2},
    guardBreak:{id:'guardBreak',name:'Guard Break',discipline:'warrior',jpCost:110,type:'skill',power:1.15,element:'physical',targetType:'enemy',statusEffect:'defDown',description:'Strike through an enemy’s guard.',prerequisites:['powerStrike'],requiredRank:4},
    counter:{id:'counter',name:'Counter',discipline:'warrior',jpCost:160,type:'passive',targetType:'self',description:'Chance to retaliate after a physical hit.',prerequisites:['powerStrike'],requiredRank:6},
    fire:{id:'fire',name:'Fire',discipline:'blackMage',jpCost:40,mpCost:5,type:'magic',power:42,element:'fire',targetType:'enemy',description:'Deal Fire damage to one enemy.',prerequisites:[],requiredRank:1,animationKey:'fire'},
    fira:{id:'fira',name:'Fira',discipline:'blackMage',jpCost:140,mpCost:10,type:'magic',power:80,element:'fire',targetType:'enemy',description:'Deal stronger Fire damage.',prerequisites:['fire'],requiredRank:5,animationKey:'fire'},
    firaga:{id:'firaga',name:'Firaga',discipline:'blackMage',jpCost:360,mpCost:18,type:'magic',power:145,element:'fire',targetType:'enemy',description:'Deal major Fire damage.',prerequisites:['fira'],requiredRank:12,animationKey:'fire'},
    blizzard:{id:'blizzard',name:'Blizzard',discipline:'blackMage',jpCost:40,mpCost:5,type:'magic',power:42,element:'ice',targetType:'enemy',description:'Deal Ice damage to one enemy.',prerequisites:[],requiredRank:1,animationKey:'ice'},
    thunder:{id:'thunder',name:'Thunder',discipline:'blackMage',jpCost:50,mpCost:6,type:'magic',power:46,element:'lightning',targetType:'enemy',description:'Deal Lightning damage to one enemy.',prerequisites:[],requiredRank:2,animationKey:'lightning'},
    cure:{id:'cure',name:'Cure',discipline:'whiteMage',jpCost:45,mpCost:4,type:'magic',power:60,element:'holy',targetType:'ally',description:'Restore HP to one ally.',prerequisites:[],requiredRank:1,animationKey:'cure'},
    cura:{id:'cura',name:'Cura',discipline:'whiteMage',jpCost:150,mpCost:9,type:'magic',power:130,element:'holy',targetType:'ally',description:'Restore substantial HP.',prerequisites:['cure'],requiredRank:6,animationKey:'cure'},
    poisona:{id:'poisona',name:'Poisona',discipline:'whiteMage',jpCost:70,mpCost:3,type:'magic',targetType:'ally',description:'Remove Poison.',prerequisites:['cure'],requiredRank:3}
  };
  C.disciplines={
    wanderer:{name:'Wanderer',description:'Adaptable fieldcraft and survival techniques.',pros:'Flexible exploration and recovery.',cons:'Few specialized damage tools.'},
    warrior:{name:'Warrior',description:'Physical combat discipline focused on force and endurance.',pros:'High physical pressure and defense.',cons:'Limited magical utility.'},
    whiteMage:{name:'White Mage',description:'Restorative and protective sacred arts.',pros:'Healing and support.',cons:'Low direct physical power.'},
    blackMage:{name:'Black Mage',description:'Offensive elemental spellcraft.',pros:'Powerful elemental damage.',cons:'Consumes MP and is physically fragile.'}
  };
  C.ensureState=s=>{if(!s)return s;const p=s.player=s.player||{};p.rank=Math.max(1,Number(p.rank||p.level||1));p.level=p.rank;p.jp=Math.max(0,Number(p.jp||0));p.learnedAbilities=p.learnedAbilities||{};p.abilityLoadout=Array.isArray(p.abilityLoadout)?p.abilityLoadout.slice(0,4):[];p.statuses=p.statuses||{};s.elementDiscovery=s.elementDiscovery||{};s.statusDiscovery=s.statusDiscovery||{};s.treasures=s.treasures||{};s.hiddenItems=s.hiddenItems||{};s.bestiaryDetail=s.bestiaryDetail||{};s.party=s.party||{active:['kael'],members:{kael:{id:'kael',name:p.name||'Kael'}}};return s};
  C.canLearn=(s,id)=>{C.ensureState(s);const a=C.abilities[id],p=s.player;if(!a)return {ok:false,reason:'Unknown ability'};if(p.learnedAbilities[id])return {ok:false,reason:'Already learned'};if(p.jp<a.jpCost)return {ok:false,reason:`Need ${a.jpCost} JP`};if(p.rank<(a.requiredRank||1))return {ok:false,reason:`Requires ${C.formatLevel(a.requiredRank)}`};for(const req of a.prerequisites||[])if(!p.learnedAbilities[req])return {ok:false,reason:`Requires ${C.abilities[req]?.name||req}`};return {ok:true}};
  C.learn=(s,id)=>{const check=C.canLearn(s,id);if(!check.ok)return check;const a=C.abilities[id],p=s.player;p.jp-=a.jpCost;p.learnedAbilities[id]=true;if(p.abilityLoadout.length<4&&!p.abilityLoadout.includes(id))p.abilityLoadout.push(id);return {ok:true,ability:a}};
  C.toggleLoadout=(s,id)=>{C.ensureState(s);const p=s.player;if(!p.learnedAbilities[id])return false;const i=p.abilityLoadout.indexOf(id);if(i>=0){p.abilityLoadout.splice(i,1);return true}if(p.abilityLoadout.length>=4)return false;p.abilityLoadout.push(id);return true};
  C.elementMultiplier=(enemy,element)=>{const e=element||'physical';const absorb=enemy.absorb||enemy.absorptions||[];const immune=enemy.immunities||enemy.immune||[];if(absorb.includes(e))return -1;if(immune.includes(e))return 0;if((enemy.weaknesses||[enemy.weak]).includes(e))return 1.5;if((enemy.resistances||[]).includes(e))return .55;return 1};
  const oldRead=SH.Save.read.bind(SH.Save),oldWrite=SH.Save.write.bind(SH.Save),oldSummaries=SH.Save.summaries.bind(SH.Save);
  SH.Save.version=2;
  SH.Save.read=function(slot){return C.ensureState(oldRead(slot))};
  SH.Save.write=function(slot,state){return oldWrite(slot,C.ensureState(state))};
  SH.Save.autosave=function(state){return this.write('auto',state)};
  SH.Save.summaries=function(){return oldSummaries().map(x=>x.empty?x:{...x,levelLabel:C.formatLevel(x.level)})};
  Object.assign(SH.DATA.weapons,{flameTongue:{name:'Flame Tongue',slot:'weapon',price:620,atk:26,element:'fire',desc:'A sword whose edge burns with contained flame.'},mageMasher:{name:'Mage Masher',slot:'weapon',price:540,atk:19,agi:3,statusOnHit:'silence',desc:'A quick blade made to disrupt spellcasting.'},runeBlade:{name:'Rune Blade',slot:'weapon',price:780,atk:23,magic:6,desc:'Runes along the fuller amplify spellcraft.'}});
  Object.assign(SH.DATA.armor,{silverRing:{name:'Silver Ring',slot:'accessory',price:420,def:2,resistances:['dark'],desc:'A pale ring that wards shadow.'}});
  for(const [id,e] of Object.entries(SH.DATA.enemies)){e.weaknesses=e.weaknesses|| (e.weak?[e.weak]:[]);e.resistances=e.resistances||[];e.immunities=e.immunities||[];e.lore=e.lore||`${e.name} recorded in Kael's field notes.`;e.locations=e.locations||['Eldenbrook Region'];}
  window.SHClassicAudio={play(key){try{const ev=new CustomEvent('safehaven-audio',{detail:{key}});dispatchEvent(ev)}catch{}}};
})();