'use strict';
(()=>{
const DEAD=.23,MAX=31,REPEAT=125;
let enteredGame=false;
const main=document.getElementById('touch');
const title=document.getElementById('title-touch');

function fire(layer,dir){
  const b=layer?.querySelector(`.joy-proxy[data-action="${dir}"]`);
  if(!b)return;
  const ev=new PointerEvent('pointerdown',{
    bubbles:false,
    cancelable:true,
    pointerId:777,
    pointerType:'touch',
    isPrimary:true
  });
  b.dispatchEvent(ev);
}

function mount(layer){
  const joy=layer?.querySelector('.joystick');
  if(!joy)return;
  const ring=joy.querySelector('.joystick-ring');
  const knob=joy.querySelector('.joystick-knob');
  let pid=null,lastDir=null,lastFire=0,raf=0;

  const calc=e=>{
    const r=ring.getBoundingClientRect();
    const cx=r.left+r.width/2,cy=r.top+r.height/2;
    let dx=e.clientX-cx,dy=e.clientY-cy;
    const rad=Math.max(1,Math.min(r.width,r.height)/2-10);
    const mag=Math.hypot(dx,dy);
    if(mag>rad){dx=dx/mag*rad;dy=dy/mag*rad;}
    const nx=dx/rad,ny=dy/rad;
    knob.style.transform=`translate3d(${nx*MAX}px,${ny*MAX}px,0)`;
    if(Math.hypot(nx,ny)<DEAD)return null;
    return Math.abs(nx)>Math.abs(ny)?(nx>0?'right':'left'):(ny>0?'down':'up');
  };

  const step=t=>{
    if(pid===null){raf=0;return;}
    if(lastDir&&t-lastFire>=REPEAT){fire(layer,lastDir);lastFire=t;}
    raf=requestAnimationFrame(step);
  };

  const start=e=>{
    if(e.target?.classList?.contains('joy-proxy'))return;
    e.preventDefault();
    pid=e.pointerId;
    try{if(joy.setPointerCapture&&Number.isFinite(pid))joy.setPointerCapture(pid);}catch(_){/* Safari may reject synthetic/stale pointer ids */}
    joy.classList.add('active');
    lastDir=calc(e);
    if(lastDir){fire(layer,lastDir);lastFire=performance.now();}
    if(!raf)raf=requestAnimationFrame(step);
  };

  const move=e=>{
    if(e.pointerId!==pid)return;
    e.preventDefault();
    const d=calc(e);
    if(d&&d!==lastDir){lastDir=d;fire(layer,d);lastFire=performance.now();}
    else lastDir=d;
  };

  const end=e=>{
    if(pid!==null&&e.pointerId!==pid)return;
    try{if(pid!==null&&joy.hasPointerCapture?.(pid))joy.releasePointerCapture(pid);}catch(_){}
    pid=null;
    lastDir=null;
    joy.classList.remove('active');
    knob.style.transform='translate3d(0,0,0)';
  };

  joy.addEventListener('pointerdown',start,{passive:false});
  joy.addEventListener('pointermove',move,{passive:false});
  joy.addEventListener('pointerup',end,{passive:false});
  joy.addEventListener('pointercancel',end,{passive:false});
}

mount(main);
mount(title);

if(main&&title){
  const sync=()=>{
    if(main.style.opacity==='1')enteredGame=true;
    if(enteredGame)title.style.display='none';
  };
  new MutationObserver(sync).observe(main,{attributes:true,attributeFilter:['style']});
  sync();
}
})();