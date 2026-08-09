'use strict';
(()=>{
const canvas=document.getElementById('game');
if(!canvas||!window.SH||!SH.Battle)return;
const ctx=canvas.getContext('2d');
const TAU=Math.PI*2;
let game=null,battle=null,fx=[],shake=0,victory=null,kaelPose='idle',kaelPoseAt=performance.now();
const OriginalBattle=SH.Battle;
const BaseFill=CanvasRenderingContext2D.prototype.fillRect;
const rand=(a,b)=>a+Math.random()*(b-a);
const ENEMY_BASE_X=245,ENEMY_SPACING=118,ENEMY_Y=246,KAEL_X=676,KAEL_Y=238;
const enemyX=i=>ENEMY_BASE_X+i*ENEMY_SPACING;
function px(x,y,w,h,c){ctx.fillStyle=c;BaseFill.call(ctx,Math.round(x),Math.round(y),Math.round(w),Math.round(h));}
function txt(t,x,y,s=18,c='#fff4d6',align='center'){ctx.save();ctx.font=`bold ${s}px Georgia,serif`;ctx.textAlign=align;ctx.textBaseline='middle';ctx.fillStyle='rgba(0,0,0,.65)';ctx.fillText(t,x+2,y+2);ctx.fillStyle=c;ctx.fillText(t,x,y);ctx.restore();}
function ellipse(x,y,rx,ry,c){ctx.fillStyle=c;ctx.beginPath();ctx.ellipse(x,y,rx,ry,0,0,TAU);ctx.fill();}
function battleBackground(cave=false){
 const g=ctx.createLinearGradient(0,0,0,540);
 if(cave){g.addColorStop(0,'#171927');g.addColorStop(.52,'#2b3040');g.addColorStop(1,'#161823');}
 else{g.addColorStop(0,'#456878');g.addColorStop(.46,'#688a67');g.addColorStop(1,'#364e3d');}
 ctx.fillStyle=g;BaseFill.call(ctx,0,0,960,540);
 if(cave){
  for(let i=0;i<14;i++){const x=(i*83+27)%960,y=80+(i%5)*52;ctx.fillStyle=i%2?'#3b4051':'#45495a';ctx.beginPath();ctx.moveTo(x-45,y+55);ctx.lineTo(x-25,y-20);ctx.lineTo(x+5,y-40);ctx.lineTo(x+42,y+55);ctx.closePath();ctx.fill();}
  px(0,345,960,195,'#232632');for(let i=0;i<24;i++)ellipse((i*97)%960,370+(i%5)*29,20+(i%3)*8,7,'rgba(12,13,19,.28)');
 }else{
  px(0,315,960,225,'#50714d');
  for(let i=0;i<18;i++){const x=(i*71+35)%960;ellipse(x,300-(i%3)*13,36,22,'#315c42');ellipse(x+20,292-(i%2)*12,27,20,'#3b6e4b');px(x-3,300,7,33,'#62472e');}
  for(let i=0;i<38;i++){const x=(i*43+13)%960,y=350+(i%5)*34;px(x,y,7+(i%3)*4,3,'rgba(191,211,134,.18)');}
  const h=ctx.createLinearGradient(0,300,0,355);h.addColorStop(0,'rgba(255,223,156,.13)');h.addColorStop(1,'rgba(255,223,156,0)');ctx.fillStyle=h;BaseFill.call(ctx,0,300,960,55);
 }
}
CanvasRenderingContext2D.prototype.fillRect=function(x,y,w,h){
 if(this===ctx&&battle&&game&&game.mode==='battle'&&x===0&&y===0&&w===960&&h===540){battleBackground(game.s?.map==='cave');return;}
 return BaseFill.call(this,x,y,w,h);
};
function enemyArt(e,x,y,t){
 const bob=Math.sin(t*4+e.index)*3;
 ctx.save();ctx.translate(x,y+bob);
 ellipse(0,31,42,9,'rgba(0,0,0,.28)');
 if(e.id==='hornet'){
  ctx.fillStyle='rgba(226,238,255,.72)';ctx.beginPath();ctx.ellipse(-24,-9,23,13,-.45,0,TAU);ctx.ellipse(24,-9,23,13,.45,0,TAU);ctx.fill();
  ellipse(0,0,30,22,'#d59d32');px(-26,-6,52,7,'#5a3d25');px(-20,8,40,6,'#5a3d25');ctx.fillStyle='#2b1f1c';ctx.beginPath();ctx.moveTo(28,0);ctx.lineTo(44,6);ctx.lineTo(28,11);ctx.fill();ellipse(-10,-6,4,4,'#fff1a0');ellipse(10,-6,4,4,'#fff1a0');
 }else if(e.id==='slime'||e.id==='silverSlime'){
  ctx.fillStyle=e.color||'#79a8bf';ctx.beginPath();ctx.moveTo(-34,22);ctx.quadraticCurveTo(-38,-15,0,-32);ctx.quadraticCurveTo(38,-15,34,22);ctx.quadraticCurveTo(0,35,-34,22);ctx.fill();ellipse(-11,-3,4,5,'#151821');ellipse(11,-3,4,5,'#151821');px(-8,12,16,3,'rgba(255,255,255,.25)');
 }else if(e.id==='wolf'){
  ctx.fillStyle=e.color||'#8792a0';ctx.beginPath();ctx.moveTo(-38,18);ctx.lineTo(-31,-13);ctx.lineTo(-17,-30);ctx.lineTo(-5,-18);ctx.lineTo(14,-23);ctx.lineTo(33,-4);ctx.lineTo(25,22);ctx.lineTo(-6,28);ctx.closePath();ctx.fill();ctx.fillStyle='#d5c18b';ctx.beginPath();ctx.moveTo(24,-3);ctx.lineTo(39,5);ctx.lineTo(23,9);ctx.fill();ellipse(13,-8,4,3,'#f3d56b');
 }else if(e.id==='goblin'){
  ellipse(0,-4,28,26,e.color||'#6f9653');ctx.fillStyle=e.color||'#6f9653';ctx.beginPath();ctx.moveTo(-27,-9);ctx.lineTo(-44,-20);ctx.lineTo(-30,3);ctx.moveTo(27,-9);ctx.lineTo(44,-20);ctx.lineTo(30,3);ctx.fill();ellipse(-10,-7,4,4,'#f6df71');ellipse(10,-7,4,4,'#f6df71');px(-22,20,44,18,'#6a4231');px(-4,12,8,11,'#c5a36b');
 }else if(e.id==='bat'){
  ctx.fillStyle=e.color||'#7b638c';ctx.beginPath();ctx.moveTo(0,3);ctx.lineTo(-48,-20);ctx.lineTo(-37,11);ctx.lineTo(-17,5);ctx.lineTo(-5,25);ctx.lineTo(0,10);ctx.lineTo(5,25);ctx.lineTo(17,5);ctx.lineTo(37,11);ctx.lineTo(48,-20);ctx.closePath();ctx.fill();ellipse(-6,0,3,3,'#f3c55f');ellipse(6,0,3,3,'#f3c55f');
 }else if(e.id==='toad'){
  ellipse(0,8,38,25,e.color||'#6a895d');ellipse(-22,-10,16,15,e.color||'#6a895d');ellipse(22,-10,16,15,e.color||'#6a895d');ellipse(-22,-12,5,5,'#eadb77');ellipse(22,-12,5,5,'#eadb77');px(-16,18,32,5,'#473b2d');
 }else if(e.id==='stoneback'){
  ctx.fillStyle='#7f745f';ctx.beginPath();ctx.moveTo(-46,25);ctx.lineTo(-38,-18);ctx.lineTo(-17,-42);ctx.lineTo(5,-32);ctx.lineTo(28,-45);ctx.lineTo(47,-12);ctx.lineTo(40,27);ctx.closePath();ctx.fill();px(-33,-18,18,12,'#a99b79');px(10,-24,20,14,'#9b8c6f');ellipse(-14,0,5,4,'#ffbe58');ellipse(14,0,5,4,'#ffbe58');
 }else{ellipse(0,4,34,28,e.color||'#899');}
 ctx.restore();
}
function kaelBattle(x,y,t){
  const a=window.KaelLevel01;
  if(a){
    const state=battle?.visualState||'idle';
    if(state!==kaelPose){kaelPose=state;kaelPoseAt=performance.now();}
    const age=(performance.now()-kaelPoseAt)/1000;
    if(a.family==='hd'&&a.animation){
      const hp=game?.s?.player,critical=hp&&hp.maxHp&&hp.hp/hp.maxHp<=.25;
      const name=state==='attack'?'attack':state==='cast'?'magic':state==='defend'?'defend':state==='hurt'?'battle_hurt':state==='victory'?'victory':critical?'critical':'battle_idle';
      const clip=a.animation(name);
      if(clip){const elapsed=state==='idle'||name==='critical'?t:age,raw=Math.floor(elapsed*clip.fps),frame=clip.loop?raw%clip.frames:Math.min(clip.frames-1,raw),dw=154,dh=192;ctx.save();ctx.imageSmoothingEnabled=false;ctx.drawImage(clip.image,frame*clip.frameW,0,clip.frameW,clip.frameH,Math.round(x-dw/2),Math.round(y-dh*.68),dw,dh);ctx.restore();return;}
    }
    const fw=a.frameW||64,fh=a.frameH||64,row=(a.directions&&a.directions.left!=null)?a.directions.left:1;
    let image=null,cols=1,frame=0;
    if(state==='attack'&&a.attackReady&&a.attack?.complete&&a.attack.naturalWidth>0){image=a.attack;cols=a.attackCols||8;frame=Math.min(cols-1,Math.floor(age*22));}
    else if(a.idleReady&&a.idle?.complete&&a.idle.naturalWidth>0){image=a.idle;cols=a.idleCols||12;frame=Math.floor(t*7)%cols;}
    else if(a.ready&&a.walk?.complete&&a.walk.naturalWidth>0){image=a.walk;cols=a.walkCols||6;frame=Math.floor(t*6)%cols;}
    if(image){
      const size=176;
      ctx.save();ctx.imageSmoothingEnabled=false;
      ctx.drawImage(image,frame*fw,row*fh,fw,fh,Math.round(x-size/2),Math.round(y-size*.58),size,size);
      ctx.restore();return;
    }
  }
  ctx.save();ctx.translate(x,y+Math.sin(t*5)*2);ellipse(0,38,28,7,'rgba(0,0,0,.28)');px(-11,-22,22,20,'#d9a66b');px(-13,-24,26,7,'#39273b');px(-16,1,32,29,'#44658c');px(-13,30,9,14,'#6d3d2f');px(4,30,9,14,'#6d3d2f');ctx.restore();
}
function burst(x,y,color='#ffe58a'){for(let i=0;i<10;i++){const a=TAU*i/10;fx.push({x,y,vx:Math.cos(a)*rand(50,120),vy:Math.sin(a)*rand(50,120),life:.45,color,size:rand(2,5)});}}
SH.Battle=class extends OriginalBattle{
 constructor(g,ids){super(g,ids);game=g;battle=this;victory=null;kaelPose='idle';kaelPoseAt=performance.now();const oldEnd=g.endBattle.bind(g);if(!g.__presentationWrapped){g.endBattle=(win,fled)=>{if(win&&!fled&&battle){victory={text:battle.message,t:performance.now()/1000,life:.85};}setTimeout(()=>{battle=null;},950);return oldEnd(win,fled)};g.__presentationWrapped=true;}}
 hit(e,magic){const before=e.hp;super.hit(e,magic);const dmg=Math.max(0,before-e.hp);const x=enemyX(e.index),y=211;shake=magic?7:4;burst(x,y,magic?'#ff9e58':'#ffe58a');fx.push({text:`-${dmg}`,x,y:y-38,life:.8,color:magic?'#ffb16d':'#fff2a6',vy:-35});if(magic){for(let i=0;i<9;i++)fx.push({x:x+rand(-25,25),y:y+rand(-5,25),vx:rand(-20,20),vy:rand(-120,-60),life:rand(.35,.65),color:'#ff7b43',size:rand(3,7)});}}
 enemyTurn(){const hp=game?.s?.player?.hp||0;super.enemyTurn();const dmg=Math.max(0,hp-(game?.s?.player?.hp||0));if(dmg){shake=6;burst(KAEL_X,KAEL_Y,'#ff7d7d');fx.push({text:`-${dmg}`,x:KAEL_X,y:KAEL_Y-54,life:.8,color:'#ff9b9b',vy:-30});}}
 victory(){super.victory();victory={text:this.message,t:performance.now()/1000,life:1.25};for(let i=0;i<28;i++)fx.push({x:480+rand(-170,170),y:260+rand(-35,35),vx:rand(-35,35),vy:rand(-100,-35),life:rand(.7,1.3),color:['#ffe88a','#9fe1ff','#f5b1ff'][i%3],size:rand(2,6)});}
};
let last=performance.now();
function overlay(now){const dt=Math.min(.04,(now-last)/1000);last=now;if(battle&&game&&game.mode==='battle'){
 ctx.save();if(shake>0){shake=Math.max(0,shake-dt*28);ctx.translate(rand(-shake,shake),rand(-shake,shake));}
 const t=now/1000;battle.enemies.forEach((e,i)=>{if(e.hp>0)enemyArt(e,enemyX(i),ENEMY_Y,t);});kaelBattle(KAEL_X,KAEL_Y,t);
 for(const f of fx){if(f.text){txt(f.text,f.x,f.y,24,f.color);f.y+=(f.vy||0)*dt;}else{ellipse(f.x,f.y,f.size||3,f.size||3,f.color);f.x+=(f.vx||0)*dt;f.y+=(f.vy||0)*dt;}f.life-=dt;}fx=fx.filter(f=>f.life>0);
 if(victory&&victory.life>0){const a=Math.min(1,victory.life*3);ctx.globalAlpha=a;ctx.fillStyle='rgba(7,8,24,.86)';BaseFill.call(ctx,285,205,390,126);ctx.strokeStyle='#e2c66e';ctx.lineWidth=3;ctx.strokeRect(292,212,376,112);txt('VICTORY!',480,244,32,'#ffe58a');txt(victory.text.replace('VICTORY! ',' '),480,292,17,'#fff2cf');victory.life-=dt;ctx.globalAlpha=1;}
 ctx.restore();
 }
 requestAnimationFrame(overlay);
}
requestAnimationFrame(overlay);
})();
