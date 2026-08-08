'use strict';
(()=>{
 const canvas=document.getElementById('game'),g=window.__safehavenGame;if(!canvas||!g)return;const ctx=canvas.getContext('2d');let prevState='',stateAt=0;
 function ring(x,y,r,c,a=1){ctx.save();ctx.globalAlpha=a;ctx.strokeStyle=c;ctx.lineWidth=3;ctx.beginPath();ctx.arc(x,y,r,0,Math.PI*2);ctx.stroke();ctx.restore()}
 function frame(t){const b=g.battle;if(g.mode==='battle'&&b){const st=b.visualState||'idle';if(st!==prevState){prevState=st;stateAt=t}const age=(t-stateAt)/1000;ctx.save();
   if(st==='cast'&&age<.7){for(let i=0;i<4;i++)ring(745,235,20+i*10+age*12,['#8bd8ff','#ffd878','#c59cff','#8ef0aa'][i],.45)}
   else if(st==='defend'){ring(745,238,52,'#9fc8ff',.55);ring(745,238,58,'#e8f3ff',.22)}
   else if(st==='hurt'&&age<.25){ctx.fillStyle='rgba(255,90,90,.12)';ctx.fillRect(650,145,190,190)}
   else if(st==='victory'){for(let i=0;i<7;i++){const a=t/500+i,rr=38+(i%3)*12,x=745+Math.cos(a)*rr,y=220+Math.sin(a*1.3)*25;ctx.fillStyle=i%2?'#ffe07b':'#b9e7ff';ctx.fillRect(x,y,3,3)}}
   ctx.restore();}
 requestAnimationFrame(frame)}requestAnimationFrame(frame);
})();