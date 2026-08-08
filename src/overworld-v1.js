'use strict';
(()=>{
const canvas=document.getElementById('game');
if(!canvas)return;
const ctx=canvas.getContext('2d');
const Native=CanvasRenderingContext2D.prototype.fillRect;
let inVale=false,riverRows=new Map();
const rgb=s=>{const m=String(s).match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);if(m)return `${m[1]},${m[2]},${m[3]}`;if(/^#[0-9a-f]{6}$/i.test(String(s))){const h=String(s).slice(1);return `${parseInt(h.slice(0,2),16)},${parseInt(h.slice(2,4),16)},${parseInt(h.slice(4,6),16)}`;}return String(s);};
const hash=(x,y)=>Math.abs(((x|0)*73856093)^((y|0)*19349663));
function rect(x,y,w,h,c){ctx.fillStyle=c;Native.call(ctx,Math.round(x),Math.round(y),Math.round(w),Math.round(h));}
function grassTile(x,y,w,h,key){
 const n=hash(x,y),tileX=Math.round(x/Math.max(1,w)),tileY=Math.round(y/Math.max(1,h));
 const base=key==='76,134,73'?'#4f884b':'#58914e';
 const alt=key==='76,134,73'?'#548d4e':'#5d9651';
 rect(x,y,w,h,((tileX>>1)+(tileY>>1))%3===0?alt:base);
 // Broad, quiet patches replace per-tile micro-noise.
 if(n%11===0)rect(x+2,y+2,w-4,h-4,'rgba(112,157,83,.12)');
 if(n%17===0)rect(x+3,y+h-5,w-6,3,'rgba(52,116,60,.10)');
 // Only a small fraction of tiles receive a tiny grass tuft.
 if(n%19===0){
   const bx=x+7+(n%9),by=y+10+((n>>3)%6);
   rect(bx,by,1,4,'#78a360');
   rect(bx+3,by+1,1,3,'#6f9b58');
 }
 // Rare little field accent; no repeated vertical carpet.
 if(n%43===0){rect(x+15,y+8,3,2,'#9dbd69');rect(x+16,y+6,1,5,'#6b9553');}
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
 if(x===0&&y===0&&w===960&&h===540){inVale=c==='63,119,70';riverRows=new Map();return Native.call(this,x,y,w,h);}
 if(inVale&&w===24&&h===24){
   if(c==='76,134,73'||c==='87,147,78'){grassTile(x,y,w,h,c);return;}
   if(c==='63,127,163'){waterTile(x,y,w,h);return;}
 }
 return Native.call(this,x,y,w,h);
};
})();