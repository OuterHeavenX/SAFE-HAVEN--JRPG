'use strict';
(()=>{
const canvas=document.getElementById('game');
if(!canvas||!window.SH||!SH.Battle)return;
const ctx=canvas.getContext('2d');
const TAU=Math.PI*2;
let game=null,battle=null,fx=[],shake=0,victory=null;
const OriginalBattle=SH.Battle;
const BaseFill=CanvasRenderingContext2D.prototype.fillRect;
const rand=(a,b)=>a+Math.random()*(b-a);
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
 ellipse(0,31,38,9,'rgba(0,0,0,.28)');
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
function kaelBattle(x, y, t) {
  const a = window.KaelLevel01;

  // Prefer the new shared draw helper
  if (a && typeof a.draw === 'function') {
    a.draw(ctx, x, y, {
      facing: 'left',          // Kael faces the enemies
      moving: false,           // idle in battle (can change later)
      scale: 1.7,
      bob: Math.sin(t * 4) * 1.5,
      time: t * 1000
    });
    return;
  }

  // Old fallback (kept for safety)
  const image = a?.walk;
  if (a && image && a.ready && image.complete && image.naturalWidth > 0) {
    const fw = a.frameW || 64, fh = a.frameH || 64;
    const row = (a.directions && a.directions.left != null) ? a.directions.left : 1;
    const frame = 0;
    const size = 132;
    ctx.save();
    ctx.translate(0, Math.sin(t * 4) * 1.5);
    ctx.imageSmoothingEnabled = false;
    ellipse(x, y + 39, 28, 7, 'rgba(0,0,0,.28)');
    ctx.drawImage(image, frame * fw, row * fh, fw, fh,
      Math.round(x - size / 2), Math.round(y - size * 0.58), size, size);
    ctx.restore();
    return;
  }

  // Final procedural fallback
  ctx.save();
  ctx.translate(x, y + Math.sin(t * 5) * 2);
  ellipse(0, 35, 24, 6, 'rgba(0,0,0,.28)');
  px(-9, -18, 18, 17, '#d9a66b');
  px(-11, -20, 22, 6, '#39273b');
  px(-13, 0, 26, 24, '#44658c');
  px(-11, 24, 8, 12, '#6d3d2f');
  px(3, 24, 8, 12, '#6d3d2f');
  ctx.restore();
}
 }
 requestAnimationFrame(overlay);
}
requestAnimationFrame(overlay);
})();
