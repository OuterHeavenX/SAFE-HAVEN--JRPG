'use strict';
(()=>{
  if(!window.SH||!SH.Battle)return;
  const Base=SH.Battle;
  const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
  SH.Battle=class extends Base{
    constructor(game,enemyIds){
      super(game,enemyIds);
      this.atbReady=false;
      this.playerATB=0;
      this.turn='wait';
      this.phase='charging';
      this.message='ATB gauges are charging...';
      this._atbLast=performance.now();
      this._atbEnemyLock=false;
      this.enemies.forEach((e,i)=>{e.atb=.08+(i*.07);});
      requestAnimationFrame(t=>this._atbTick(t));
    }
    _playerRate(){
      const p=this.g.s.player||{};
      let seconds=3.6-clamp((p.agi||8)*.035,0,.7);
      if(p.statuses?.haste)seconds*=.68;
      if(p.statuses?.slow)seconds*=1.4;
      return 1/Math.max(2.25,seconds);
    }
    _enemyRate(e){
      let seconds=4.15-clamp((e.agi||6)*.035,0,.85);
      if(e.statuses?.haste)seconds*=.7;
      if(e.statuses?.slow)seconds*=1.4;
      return 1/Math.max(2.35,seconds);
    }
    _deepSelection(){return ['magic','item','target'].includes(this.phase);}
    _atbTick(t){
      if(this.done||this.g.mode!=='battle'||this.g.battle!==this)return;
      const dt=Math.min(.05,Math.max(0,(t-this._atbLast)/1000));this._atbLast=t;
      const p=this.g.s.player;
      if(p?.hp>0&&!this.atbReady){
        this.playerATB=clamp(this.playerATB+dt*this._playerRate(),0,1);
        if(this.playerATB>=1){this.playerATB=1;this.atbReady=true;this.turn='player';this.phase='command';this.message='Kael is ready — choose a command.';}
      }
      const pauseEnemies=this._deepSelection();
      if(!pauseEnemies&&!this._atbEnemyLock){
        for(const e of this.alive()){
          if(e.statuses?.sleep)continue;
          e.atb=clamp((e.atb||0)+dt*this._enemyRate(e),0,1);
          if(e.atb>=1){this._actATBEnemy(e);break;}
        }
      }
      requestAnimationFrame(n=>this._atbTick(n));
    }
    command(cmd){
      if(!this.atbReady||this.turn!=='player'||this.done)return;
      return super.command(cmd);
    }
    afterPlayer(){
      this.playerATB=0;this.atbReady=false;this.turn='wait';this.phase='charging';
      if(!this.done)this.message='ATB gauges are charging...';
      this.visualState='idle';
    }
    enemyTurn(){/* Enemy actions are driven by independent ATB gauges. */}
    _actATBEnemy(e){
      if(this.done||!e||e.hp<=0)return;
      this._atbEnemyLock=true;e.atb=0;
      const p=this.g.s.player;
      if(e.statuses?.sleep){this._atbEnemyLock=false;return;}
      let dmg=Math.max(1,Math.floor((e.str*1.4-this.g.stats().defense*.55)*(0.9+Math.random()*.2)));
      if(this.guard)dmg=Math.max(1,Math.floor(dmg*.5));
      p.hp=Math.max(0,p.hp-dmg);
      this.message=`${e.name} attacks for ${dmg}!`;
      this.visualState='hurt';
      window.SHClassicFX={type:'physical',target:null,amount:dmg,at:performance.now()};
      if(p.statuses?.poison){const tick=Math.max(1,Math.floor(p.maxHp*.04));p.hp=Math.max(0,p.hp-tick);this.message+=` Poison deals ${tick}.`;}
      if(this.guard)this.guard=false;
      if(p.hp<=0){p.statuses=p.statuses||{};p.statuses.ko={};this.done=true;this.g.gameOver();return;}
      setTimeout(()=>{if(!this.done){this.visualState='idle';this._atbEnemyLock=false;}},420);
    }
  };
})();