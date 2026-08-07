'use strict';
SH.UI={
 panel(c,x,y,w,h,title){c.fillStyle='rgba(13,10,31,.94)';c.fillRect(x,y,w,h);c.strokeStyle='#e7c66b';c.lineWidth=3;c.strokeRect(x+1,y+1,w-2,h-2);if(title){c.fillStyle='#e7c66b';c.font='bold 18px Georgia';c.fillText(title,x+14,y+25)}},
 text(c,t,x,y,size=18,color='#fff3cc',align='left'){c.fillStyle=color;c.font=`${size}px Georgia`;c.textAlign=align;c.fillText(t,x,y);c.textAlign='left'},
 bar(c,x,y,w,h,val,max,color='#69c27e'){c.fillStyle='#241e38';c.fillRect(x,y,w,h);c.fillStyle=color;c.fillRect(x,y,w*Math.max(0,Math.min(1,val/max)),h);c.strokeStyle='#d9c377';c.strokeRect(x,y,w,h)}
};