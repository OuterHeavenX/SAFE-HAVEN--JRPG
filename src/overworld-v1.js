'use strict';
(()=>{
const canvas=document.getElementById('game');
if(!canvas)return;
const ctx=canvas.getContext('2d');
const Native=CanvasRenderingContext2D.prototype.fillRect;
let inVale=false,riverRows=new Map(),frame=0;
const rgb=s=>{const m=String(s).match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);if(m)return `${m[1]},${m[2]},${m[3]}`;if(/^#[0-9a-f]{6}$/i.test(String(s))){const h=String(s).slice(1);return `${parseInt(h.slice(0,2),16)},${parseInt(h.slice(2,4),16)},${parseInt(h.slice(4,6),16)}`;}return String(s);};
const hash=(x,y)=>Math.abs(((x|0)*73856093)^((y|0)*19349663));
function rect(x,y,w,h,c){ctx.fillStyle=c;Native.call(ctx,Math.round(x),Math.round(y),Math.round(w),Math.round(h));}
function grassTile(x,y,w,h,key){
 const palettes=key==='76,134,73'?['#4d864a','#568d4d','#467d45','#5a9251']:['#56904d','#609b53','#4f8748','#66a057'];
 const q=w/2,r=h/2,n=hash(x,y)+frame;
 rect(x,y,q,r,palettes[n%4]);rect(x+q,y,q,r,palettes[(n+1)%4]);rect(x,y+r,q,r,palettes[(n+2)%4]);rect(x+q,y+r,q,r,palettes[(n+3)%4]);
 const blade='#7ca862';for(let i=0;i<3;i++){const bx=x+4+((n+i*11)%Math.max(6,w-8)),by=y+5+(((n>>2)+i*7)%Math.max(6,h-9));rect(bx,by,2,5,blade);rect(bx+2,by+2,1,3,'rgba(42,103,52,.45)');}
 if(n%5===0){rect(x+15,y+7,4,3,'#9fc06b');rect(x+17,y+5,1,6,'#6b9b55');}
}
function waterTile(x,y,w,h){
 const row=riverRows.get(y)||0;riverRows.set(y,row+1);const idx=row+1;
 rect(x,y,w,h,idx%2?'#3e83a8':'#4389ad');
 rect(x+3,y+6,8,2,'rgba(205,238,244,.34)');rect(x+13,y+16,7,2,'rgba(186,227,240,.25)');
 if(idx===1){rect(x,y,5,h,'#8a7c55');rect(x+5,y,3,h,'#6b7548');rect(x+7,y+4,2,7,'#99a56a');}
 if(idx===5){rect(x+w-8,y,3,h,'#6b7548');rect(x+w-5,y,5,h,'#8a7c55');rect(x+w-9,y+12,2,7,'#99a56a');}
}
CanvasRenderingContext2D.prototype.fillRect=function(x,y,w,h){
 if(this!==ctx)return Native.call(this,x,y,w,h);
 const c=rgb(this.fillStyle);
 if(x===0&&y===0&&w===960&&h===540){inVale=c==='63,119,70';riverRows=new Map();frame=(frame+1)%997;return Native.call(this,x,y,w,h);}
 if(inVale&&w===24&&h===24){
   if(c==='76,134,73'||c==='87,147,78'){grassTile(x,y,w,h,c);return;}
   if(c==='63,127,163'){waterTile(x,y,w,h);return;}
 }
 return Native.call(this,x,y,w,h);
};
})();