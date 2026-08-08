'use strict';
(()=>{
 const canvas=document.getElementById('game'),g=window.__safehavenGame;if(!canvas||!g)return;const ctx=canvas.getContext('2d');
 const baseX=245,spacing=118,baseY=246;
 function frame(t){const b=g.battle;if(g.mode==='battle'&&b){ctx.save();for(const e of b.enemies||[]){if(e.hp<=0)continue;const x=baseX+(e.index||0)*spacing,y=baseY,age=t/1000+(e.index||0);ctx.save();ctx.globalAlpha=.25;
   if(e.id==='hornet'){ctx.strokeStyle='#dcecff';ctx.lineWidth=2;for(const s of [-1,1]){ctx.beginPath();ctx.moveTo(x+s*18,y-12);ctx.lineTo(x+s*(34+Math.sin(age*20)*7),y-22);ctx.stroke();}}
   else if(e.id==='bat'){ctx.strokeStyle='#a991bc';ctx.lineWidth=2;const flap=Math.sin(age*13)*7;ctx.beginPath();ctx.moveTo(x-18,y-5);ctx.lineTo(x-43,y-18-flap);ctx.moveTo(x+18,y-5);ctx.lineTo(x+43,y-18-flap);ctx.stroke();}
   else if(e.id==='wolf'||e.id==='moonfang'){const breath=(age*1.7)%1;ctx.fillStyle=e.id==='moonfang'?'rgba(205,228,255,.38)':'rgba(235,235,245,.22)';ctx.beginPath();ctx.arc(x+35+breath*15,y-7-breath*6,3+breath*3,0,Math.PI*2);ctx.fill();}
   else if(e.id==='slime'||e.id==='silverSlime'){ctx.fillStyle='rgba(255,255,255,.18)';ctx.beginPath();ctx.ellipse(x-10,y-12,7+Math.sin(age*6)*2,3,0,0,Math.PI*2);ctx.fill();}
   else if(e.id==='stoneback'){ctx.fillStyle='rgba(180,165,135,.2)';for(let i=0;i<3;i++){const p=(age*.35+i/3)%1;ctx.fillRect(x-35+i*28,y+25-p*20,3+p*4,3+p*4);}}
   ctx.restore();}ctx.restore();}requestAnimationFrame(frame)}requestAnimationFrame(frame);
})();