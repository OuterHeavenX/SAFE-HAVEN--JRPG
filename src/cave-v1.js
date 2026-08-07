'use strict';
(()=>{
const canvas=document.getElementById('game');
if(!canvas)return;
const ctx=canvas.getContext('2d');
const BaseFill=CanvasRenderingContext2D.prototype.fillRect;
const BaseClear=CanvasRenderingContext2D.prototype.clearRect;
let caveFrame=false;
const TAU=Math.PI*2;
function rect(x,y,w,h,c){ctx.fillStyle=c;BaseFill.call(ctx,Math.round(x),Math.round(y),Math.round(w),Math.round(h));}
function glow(x,y,r,c){const g=ctx.createRadialGradient(x,y,0,x,y,r);g.addColorStop(0,c);g.addColorStop(1,'rgba(0,0,0,0)');ctx.fillStyle=g;ctx.beginPath();ctx.arc(x,y,r,0,TAU);ctx.fill();}
CanvasRenderingContext2D.prototype.clearRect=function(x,y,w,h){if(this===ctx&&x===0&&y===0&&w===960&&h===540)caveFrame=false;return BaseClear.call(this,x,y,w,h);};
CanvasRenderingContext2D.prototype.fillRect=function(x,y,w,h){
 if(this===ctx&&x===0&&y===0&&w===960&&h===540&&this.fillStyle==='#282b38'){
   caveFrame=true;
   const g=ctx.createLinearGradient(0,0,0,540);g.addColorStop(0,'#171a25');g.addColorStop(.52,'#252936');g.addColorStop(1,'#151820');ctx.fillStyle=g;BaseFill.call(ctx,0,0,960,540);return;
 }
 if(this===ctx&&caveFrame&&w===24&&h===24&&(this.fillStyle==='#343746'||this.fillStyle==='#2e3140')){
   const base=this.fillStyle;BaseFill.call(ctx,x,y,w,h);
   const ix=Math.round((x-24)/24),iy=Math.round((y-6)/24);const n=Math.abs((ix*17+iy*29)%7);
   if(n===0){rect(x+3,y+4,10,3,'rgba(120,130,148,.16)');rect(x+14,y+14,6,2,'rgba(16,18,25,.34)');}
   if(n===1){rect(x+5,y+17,14,2,'rgba(18,20,27,.35)');rect(x+8,y+6,3,3,'rgba(106,115,131,.14)');}
   if(n===2){rect(x+2,y+10,4,8,'rgba(75,82,98,.17)');rect(x+16,y+3,5,5,'rgba(16,17,23,.28)');}
   if(iy===0||iy===21||ix===0||ix===37){rect(x,y,w,h,'rgba(8,10,16,.22)');}
   return;
 }
 return BaseFill.call(this,x,y,w,h);
};
function stalagmite(x,y,s=1){ctx.save();ctx.globalAlpha=.9;ctx.fillStyle='#535968';ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x+9*s,y-29*s);ctx.lineTo(x+18*s,y);ctx.closePath();ctx.fill();ctx.fillStyle='rgba(156,166,184,.18)';ctx.beginPath();ctx.moveTo(x+8*s,y-5*s);ctx.lineTo(x+10*s,y-23*s);ctx.lineTo(x+13*s,y-5*s);ctx.closePath();ctx.fill();ctx.restore();}
function fungus(x,y,c='#70d9c2'){glow(x,y,18,'rgba(90,220,190,.12)');rect(x-1,y-2,2,8,'#60696c');ctx.fillStyle=c;ctx.beginPath();ctx.arc(x,y-4,5,Math.PI,TAU);ctx.fill();}
function crystal(x,y,c='#79d8ff'){glow(x,y,26,'rgba(90,200,255,.13)');ctx.fillStyle=c;ctx.beginPath();ctx.moveTo(x,y-16);ctx.lineTo(x+7,y-3);ctx.lineTo(x+3,y+12);ctx.lineTo(x-5,y+12);ctx.lineTo(x-8,y-3);ctx.closePath();ctx.fill();ctx.fillStyle='rgba(255,255,255,.35)';ctx.beginPath();ctx.moveTo(x,y-12);ctx.lineTo(x+2,y-2);ctx.lineTo(x-2,y+7);ctx.closePath();ctx.fill();}
function pool(x,y,rx,ry){glow(x,y,rx+12,'rgba(79,166,189,.08)');ctx.fillStyle='#314f62';ctx.beginPath();ctx.ellipse(x,y,rx,ry,0,0,TAU);ctx.fill();ctx.strokeStyle='rgba(137,218,230,.25)';ctx.lineWidth=2;ctx.beginPath();ctx.ellipse(x,y,rx-5,ry-4,0,0,TAU);ctx.stroke();}
function overlay(){if(caveFrame){ctx.save();ctx.globalAlpha=.92;
  pool(430,164,36,16);pool(606,362,28,12);
  [[95,112,1],[154,438,.85],[270,96,.9],[354,454,.8],[716,102,1],[876,416,.9],[790,306,.7]].forEach(p=>stalagmite(p[0],p[1],p[2]));
  [[122,190],[196,342],[388,270],[558,116],[676,432],[848,214]].forEach((p,i)=>fungus(p[0],p[1],i%2?'#8fd58d':'#72d9c5'));
  [[432,126],[650,385],[840,155]].forEach((p,i)=>crystal(p[0],p[1],i===2?'#d79cff':'#79d8ff'));
  // landmark glows: chest, spring, save crystal, boss chamber
  glow(240,390,42,'rgba(242,183,83,.10)');
  glow(432,126,58,'rgba(95,225,220,.12)');
  glow(648,390,58,'rgba(118,210,255,.14)');
  glow(816,150,82,'rgba(220,96,79,.10)');
  ctx.strokeStyle='rgba(173,88,74,.23)';ctx.lineWidth=5;ctx.beginPath();ctx.arc(816,150,62,0,TAU);ctx.stroke();
  ctx.restore();}
 requestAnimationFrame(overlay);
}
requestAnimationFrame(overlay);
})();