'use strict';
(()=>{
  if(!window.SH||!SH.Battle)return;
  const Base=SH.Battle;
  const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
  SH.Battle=class extends Base{
    constructor(game,enemyIds){
      super(game,enemyIds);
      this.atbReady=false;this.playerATB=0;this.turn='wait';this.phase='charging';this.message='ATB gauges are charging...';this._atbLast=performance.now();this._atbEnemyLock=false;this._visualResetToken=0;
      this.enemies.forEach(e=>{e.atb=0;});requestAnimationFrame(t=>this._atbTick(t));
    }
    _playerRate(){const p=this.g.s.player||{};let seconds=6.35-clamp((p.agi||8)*.03,0,.6);if(p.statuses?.haste)seconds*=.72;if(p.statuses?.slow)seconds*=1.45;return 1/Math.max(4.5,seconds);}
    _enemyRate(e){let seconds=7.0-clamp((e.agi||6)*.035,0,.9);if(e.statuses?.haste)seconds*=.72;if(e.statuses?.slow)seconds*=1.45;return 1/Math.max(4.8,seconds);}
    _deepSelection(){return ['magic','item','target'].includes(this.phase);}
    _atbTick(t){if(this.done||this.g.mode!=='battle'||this.g.battle!==this)return;const dt=Math.min(.05,Math.max(0,(t-this._atbLast)/1000));this._atbLast=t;const p=this.g.s.player;if(p?.hp>0&&!this.atbReady){this.playerATB=clamp(this.playerATB+dt*this._playerRate(),0,1);if(this.playerATB>=1){this.playerATB=1;this.atbReady=true;this.turn='player';this.phase='command';this.message='Kael is ready — choose a command.';}}const pauseEnemies=this._deepSelection();if(!pauseEnemies&&!this._atbEnemyLock){for(const e of this.alive()){if(e.statuses?.sleep)continue;e.atb=clamp((e.atb||0)+dt*this._enemyRate(e),0,1);if(e.atb>=1){this._actATBEnemy(e);break;}}}requestAnimationFrame(n=>this._atbTick(n));}
    command(cmd){if(!this.atbReady||this.turn!=='player'||this.done)return;const result=super.command(cmd);if(cmd==='Attack'&&this.phase==='target')this.message='ATTACK — choose a target.';else if(cmd==='Magic'&&this.phase==='magic')this.message='MAGIC — choose a spell.';else if(cmd==='Item'&&this.phase==='item')this.message='ITEM — choose an item.';else if(cmd==='Defend')this.message='Kael DEFENDS.';else if(cmd==='Flee'&&!this.done)this.message=this.message||'Kael attempts to FLEE...';return result;}
    afterPlayer(){
      this.playerATB=0;this.atbReady=false;this.turn='wait';this.phase='charging';
      const state=this.visualState||'idle';
      const hold=state==='attack'?760:state==='cast'?720:state==='defend'?520:0;
      const token=++this._visualResetToken;
      if(!hold){if(!this.done)this.message='ATB gauges are charging...';this.visualState='idle';return;}
      setTimeout(()=>{if(this.done||token!==this._visualResetToken)return;if(this.visualState===state)this.visualState='idle';if(!this.done)this.message='ATB gauges are charging...';},hold);
    }
    enemyTurn(){}
    _actATBEnemy(e){if(this.done||!e||e.hp<=0)return;this._atbEnemyLock=true;e.atb=0;const p=this.g.s.player;if(e.statuses?.sleep){this._atbEnemyLock=false;return;}let dmg=Math.max(1,Math.floor((e.str*1.4-this.g.stats().defense*.55)*(0.9+Math.random()*.2)));if(this.guard)dmg=Math.max(1,Math.floor(dmg*.5));p.hp=Math.max(0,p.hp-dmg);this.message=`${e.name} attacks for ${dmg}!`;this.visualState='hurt';this._visualResetToken++;window.SHClassicFX={type:'physical',target:null,amount:dmg,at:performance.now()};if(p.statuses?.poison){const tick=Math.max(1,Math.floor(p.maxHp*.04));p.hp=Math.max(0,p.hp-tick);this.message+=` Poison deals ${tick}.`;}if(this.guard)this.guard=false;if(p.hp<=0){p.statuses=p.statuses||{};p.statuses.ko={};this.done=true;this.g.gameOver();return;}setTimeout(()=>{if(!this.done){this.visualState='idle';this._atbEnemyLock=false;}},420);}
  };
})();