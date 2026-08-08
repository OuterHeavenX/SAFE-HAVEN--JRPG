'use strict';
(()=>{
 const g=window.__safehavenGame;if(!g)return;
 const points=[['world',4,28,'Old Waystone'],['world',20,10,'Moon Herbs'],['world',42,26,'River Cache'],['cave',6,4,'Whisper Niche'],['cave',20,18,'Old Runes']];
 const original=g.nearObject.bind(g);
 g.nearObject=function(){const real=original();if(real)return real;const secrets=this.s?.exploration?.secrets||{};for(const [map,x,y,label] of points){if(this.s?.map!==map)continue;const key=label==='Old Waystone'?'valeStone':label==='Moon Herbs'?'valeHerbs':label==='River Cache'?'valeRiver':label==='Whisper Niche'?'caveNiche':'caveRunes';if(secrets[key])continue;if(Math.hypot(x-this.s.x,y-this.s.y)<=1.75)return{x,y,label,secret:true};}if(this.s?.map==='world'&&!this.s?.exploration?.miniBoss?.moonfang&&Math.hypot(46-this.s.x,8-this.s.y)<=1.85)return{x:46,y:8,label:'Pale Presence',secret:true};return null;};
})();