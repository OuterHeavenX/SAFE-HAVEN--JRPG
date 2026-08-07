'use strict';
(()=>{
const DEAD=.23,MAX=31,REPEAT=105;
let enteredGame=false;
const main=document.getElementById('touch');
const title=document.getElementById('title-touch');

function fire(layer,dir,facing){
  if(layer===main&&window.__safehavenGame){
    if(facing)window.KaelFacing=facing;
    window.__safehavenGame.input(dir);
    return;
  }
  // Title/menu joystick remains cardinal-only.
  const cardinal=dir.includes('-')?dir.split('-')[0]:dir;
  const b=layer?.querySelector(`.joy-proxy[data-action="${cardinal}"]`);
  if(!b)return;
  b.dispatchEvent(new PointerEvent('pointerdown',{bubbles:false,cancelable:true,pointerType:'touch',isPrimary:true}));
}

function mount(layer){
  const joy=layer?.querySelector('.joystick');
  if(!joy)return;
  const ring=joy.querySelector('.joystick-ring');
  const knob=joy.querySelector('.joystick-knob');
  const eightWay=layer===main;
  let active=false,lastDir=null,lastFacing=null,lastFire=0,raf=0;

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

    const ax=Math.abs(nx),ay=Math.abs(ny);
    const horizontal=nx>0?'right':'left';
    const vertical=ny>0?'down':'up';
    if(eightWay&&ax>.32&&ay>.32){
      // Preserve whichever cardinal facing is already natural for the diagonal;
      // otherwise use the dominant stick axis.
      let facing=window.KaelFacing;
      if(facing!==horizontal&&facing!==vertical)facing=ax>=ay?horizontal:vertical;
      return{dir:`${vertical}-${horizontal}`,facing};
    }
    const dir=ax>ay?horizontal:vertical;
    return{dir,facing:dir};
  };

  const step=t=>{
    if(!active){raf=0;return;}
    if(lastDir&&t-lastFire>=REPEAT){fire(layer,lastDir,lastFacing);lastFire=t;}
    raf=requestAnimationFrame(step);
  };

  const start=e=>{
    if(e.target?.classList?.contains('joy-proxy'))return;
    e.preventDefault();
    active=true;
    joy.classList.add('active');
    const v=calc(e);lastDir=v?.dir||null;lastFacing=v?.facing||null;
    if(lastDir){fire(layer,lastDir,lastFacing);lastFire=performance.now();}
    if(!raf)raf=requestAnimationFrame(step);
  };

  const move=e=>{
    if(!active)return;
    e.preventDefault();
    const v=calc(e),d=v?.dir||null,f=v?.facing||null;
    if(d&&d!==lastDir){lastDir=d;lastFacing=f;fire(layer,d,f);lastFire=performance.now();}
    else{lastDir=d;lastFacing=f;}
  };

  const end=e=>{
    if(!active)return;
    e.preventDefault?.();
    active=false;lastDir=null;lastFacing=null;
    joy.classList.remove('active');
    knob.style.transform='translate3d(0,0,0)';
  };

  joy.addEventListener('pointerdown',start,{passive:false});
  window.addEventListener('pointermove',move,{passive:false});
  window.addEventListener('pointerup',end,{passive:false});
  window.addEventListener('pointercancel',end,{passive:false});
  window.addEventListener('blur',()=>{if(active)end(new Event('blur'));});
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
