'use strict';
(()=>{
 const g=window.__safehavenGame,canvas=document.getElementById('game');if(!g||!canvas)return;const ctx=canvas.getContext('2d'),TAU=Math.PI*2;let toast=null;
 const oldChest=g.chest.bind(g);g.chest=function(o){const opened=!!this.s.opened[o.chest];oldChest(o);if(!opened&&this.s.opened[o.chest]){const item=SH.DATA.items[o.item],rare=o.item==='hiPotion'||o.item==='phoenix'||o.item==='tent';toast={title:rare?'RARE TREASURE!':'TREASURE!',name:item?.name||o.item,life:2.2,rare};}};
 function mapPoint(map,x,y){const tw=map==='home'?30:24,m=SH.MAPS[map],c=g.camera(m,tw);return{x:c.ox+x*tw,y:c.oy+y*tw};}
 let prev=performance.now();function frame(now){const dt=Math.min(.05,(now-prev)/1000);prev=now;if(g.mode==='world'){
   ctx.save();const t=now/1000;
   if(g.s.map==='cave'&&!g.s.opened?.caveChest1){const p=mapPoint('cave',9,16),gr=ctx.createRadialGradient(p.x,p.y,2,p.x,p.y,34);gr.addColorStop(0,'rgba(118,205,255,.18)');gr.addColorStop(1,'rgba(118,205,255,0)');ctx.fillStyle=gr;ctx.beginPath();ctx.arc(p.x,p.y,34,0,TAU);ctx.fill();}
   if(g.s.map==='cave'){const p=mapPoint('cave',26,16);for(let i=0;i<7;i++){const a=t*.7+i*TAU/7,r=13+(i%3)*5;ctx.globalAlpha=.35+.2*Math.sin(t*2+i);ctx.fillStyle=i%2?'#9eeaff':'#d5bcff';ctx.fillRect(Math.round(p.x+Math.cos(a)*r),Math.round(p.y-7+Math.sin(a)*r*.55),2,2);}ctx.globalAlpha=1;}
   if(toast&&toast.life>0){const a=Math.min(1,toast.life*2);ctx.globalAlpha=a;ctx.fillStyle='rgba(7,8,28,.9)';ctx.fillRect(325,205,310,116);ctx.strokeStyle=toast.rare?'#9ee5ff':'#e2c66e';ctx.lineWidth=2;ctx.strokeRect(332,212,296,102);ctx.font='bold 24px Georgia';ctx.textAlign='center';ctx.fillStyle=toast.rare?'#bcecff':'#ffe587';ctx.fillText(toast.title,480,250);ctx.font='bold 19px Georgia';ctx.fillStyle='#fff1d0';ctx.fillText(toast.name,480,287);toast.life-=dt;ctx.globalAlpha=1;}
   ctx.restore();
 }requestAnimationFrame(frame)}requestAnimationFrame(frame);
})();