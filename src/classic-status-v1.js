'use strict';
(()=>{
 const C=SH.Classic;if(!C||!SH.Battle)return;
 const proto=SH.Battle.prototype,base=proto.enemyTurn;
 proto.enemyTurn=function(){const p=this.g?.s?.player;if(!p)return base.call(this);C.ensureState(this.g.s);const before=p.hp;base.call(this);if(this.done||p.hp<=0)return;
   const toad=this.alive().find(e=>e.id==='toad');if(toad&&!p.statuses.poison&&Math.random()<.22){p.statuses.poison={turns:C.statuses.poison.duration};this.g.s.statusDiscovery.poison=true;this.message+=' Kael is Poisoned!';window.SHClassicFX={type:'poison',at:performance.now()}}
   if(p.statuses.regen){const heal=Math.max(1,Math.floor(p.maxHp*.05));p.hp=Math.min(p.maxHp,p.hp+heal);p.statuses.regen.turns=(p.statuses.regen.turns||C.statuses.regen.duration)-1;if(p.statuses.regen.turns<=0)delete p.statuses.regen;this.message+=` Regen restores ${heal} HP.`}
   for(const id of ['poison','blind','silence','sleep','slow','haste','berserk'])if(p.statuses[id]?.turns!=null&&id!=='poison'){p.statuses[id].turns--;if(p.statuses[id].turns<=0)delete p.statuses[id]}
   if(before!==p.hp)SH.Save.autosave(this.g.s);
 };
})();