'use strict';
(()=>{
 const C=SH.Classic,g=window.__safehavenGame;if(!C||!g)return;
 C.ensureState=function(s){if(!s)return s;const p=s.player=s.player||{};const legacy=Math.max(Number(p.level)||1,Number(p.rank)||1);p.rank=Math.max(1,legacy);p.level=p.rank;p.jp=Math.max(0,Number(p.jp||0));p.learnedAbilities=p.learnedAbilities||{};p.abilityLoadout=Array.isArray(p.abilityLoadout)?p.abilityLoadout.filter(id=>p.learnedAbilities[id]).slice(0,4):[];p.statuses=p.statuses||{};s.elementDiscovery=s.elementDiscovery||{};s.statusDiscovery=s.statusDiscovery||{};s.treasures=s.treasures||{};s.hiddenItems=s.hiddenItems||{};s.bestiaryDetail=s.bestiaryDetail||{};s.party=s.party||{active:['kael'],members:{kael:{id:'kael',name:p.name||'Kael'}}};s.party.members=s.party.members||{};s.party.members.kael={...(s.party.members.kael||{}),id:'kael',name:p.name||'Kael'};return s};
 C.elementMultiplier=(enemy,element)=>{const e=element||'physical';if((enemy.absorptions||enemy.absorb||[]).includes(e))return -1;if((enemy.immunities||enemy.immune||[]).includes(e))return 0;if((enemy.weaknesses||[]).includes(e)||enemy.weak===e)return 1.5;if((enemy.resistances||[]).includes(e))return .55;return 1};
 C.visualTier=rank=>Math.max(1,C.majorLevel(rank));
 C.resolveKaelTier=state=>`level-${String(C.visualTier(state?.player?.rank||state?.player?.level||1)).padStart(2,'0')}`;
 g.gainJP=function(amount){C.ensureState(this.s);this.s.player.jp=Math.max(0,this.s.player.jp+(Number(amount)||0));this.notice=`+${amount} JP available for abilities`;this.noticeT=1.4};
 const originalGainXP=g.gainXP.bind(g);g.gainXP=function(amount){C.ensureState(this.s);const before=this.s.player.rank;originalGainXP(amount);this.s.player.rank=this.s.player.level;const after=this.s.player.rank;if(after>before){this.notice=`LEVEL UP! ${C.formatLevel(before)} → ${C.formatLevel(after)}`;this.noticeT=2}return after};
 C.ensureState(g.s);
})();