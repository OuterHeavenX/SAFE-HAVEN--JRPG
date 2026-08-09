'use strict';
(()=>{
  const g=window.__safehavenGame;if(!g)return;
  const oldMove=g.move.bind(g);
  g.move=function(action){
    const map=SH.MAPS?.[this.s?.map];
    if(!map||map.safe||!map.encounters)return oldMove(action);
    const startMap=this.s.map;
    const wasSafe=map.safe;
    let result;
    try{map.safe=true;result=oldMove(action)}finally{map.safe=wasSafe}
    if(this.mode!=='world'||!this.s||this.s.map!==startMap)return result;
    const current=SH.MAPS[this.s.map];if(!current||current.safe||!current.encounters)return result;
    if(!Number.isFinite(this.s.encounterMeter))this.s.encounterMeter=0;
    this.s.encounterMeter+=0.30+Math.random()*0.35;
    if(this.s.encounterMeter>100){
      this.s.encounterMeter=-(15+Math.random()*20);
      const table=SH.ENCOUNTERS[current.encounters]||[];
      if(table.length)this.startBattle(table[Math.floor(Math.random()*table.length)]);
    }
    return result;
  };
})();