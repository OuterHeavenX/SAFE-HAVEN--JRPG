'use strict';
(()=>{
const DEAD=.20,MAX=31;
let enteredGame=false;
const main=document.getElementById('touch');
const title=document.getElementById('title-touch');
const shell=document.getElementById('game-shell');

function fire(layer,dir,facing){
  if(layer===main&&window.__safehavenGame){
    if(facing)window.KaelFacing=facing;
    window.KaelTouchHeldDir=dir||null;
    return;
  }
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
  const dynamic=eightWay;
  let active=false,lastDir=null,lastFacing=null,pointerId=null;

  if(dynamic){joy.classList.add('dynamic');joy.style.opacity='0';joy.style.pointerEvents='none';}

  const positionDynamic=e=>{
    if(!dynamic||!shell)return;
    const sr=shell.getBoundingClientRect();
    const size=96,half=size/2,pad=half+10;
    const x=Math.max(pad,Math.min(sr.width*.48,e.clientX-sr.left));
    const y=Math.max(pad,Math.min(sr.height-pad,e.clientY-sr.top));
    joy.style.left=(x-half)+'px';joy.style.top=(y-half)+'px';
    joy.style.right='auto';joy.style.bottom='auto';
    joy.style.opacity='1';
  };

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
    const ax=Math.abs(nx),ay=Math.abs(ny),horizontal=nx>0?'right':'left',vertical=ny>0?'down':'up';
    if(eightWay&&ax>.30&&ay>.30){let facing=window.KaelFacing;if(facing!==horizontal&&facing!==vertical)facing=ax>=ay?horizontal:vertical;return{dir:`${vertical}-${horizontal}`,facing};}
    const dir=ax>ay?horizontal:vertical;return{dir,facing:dir};
  };

  const apply=e=>{
    const v=calc(e);lastDir=v?.dir||null;lastFacing=v?.facing||null;
    if(layer===main){if(lastFacing)window.KaelFacing=lastFacing;window.KaelTouchHeldDir=lastDir;}
    else if(lastDir)fire(layer,lastDir,lastFacing);
  };

  const start=e=>{
    if(active||e.target?.classList?.contains('joy-proxy'))return;
    e.preventDefault();active=true;pointerId=e.pointerId;positionDynamic(e);joy.classList.add('active');apply(e);
  };
  const move=e=>{if(!active||pointerId!==null&&e.pointerId!==pointerId)return;e.preventDefault();apply(e);};
  const end=e=>{
    if(!active||pointerId!==null&&e.pointerId!=null&&e.pointerId!==pointerId)return;
    e.preventDefault?.();active=false;pointerId=null;lastDir=null;lastFacing=null;window.KaelTouchHeldDir=null;joy.classList.remove('active');knob.style.transform='translate3d(0,0,0)';if(dynamic)joy.style.opacity='0';
  };

  if(dynamic&&shell){
    shell.addEventListener('pointerdown',e=>{
      const g=window.__safehavenGame,sr=shell.getBoundingClientRect();
      if(!g||g.mode!=='world'||g.dialog||g.menu||g.shop)return;
      if(e.clientX-sr.left>sr.width*.50)return;
      if(e.target?.closest?.('button,.actions,.modal-touch,#direct-touch-ui,#classic-ui'))return;
      start(e);
    },{passive:false,capture:true});
  }else joy.addEventListener('pointerdown',start,{passive:false});

  window.addEventListener('pointermove',move,{passive:false});
  window.addEventListener('pointerup',end,{passive:false});
  window.addEventListener('pointercancel',end,{passive:false});
  window.addEventListener('blur',()=>{if(active)end(new Event('blur'));});
}

mount(main);mount(title);
if(main&&title){const sync=()=>{if(main.style.opacity==='1')enteredGame=true;if(enteredGame)title.style.display='none';};new MutationObserver(sync).observe(main,{attributes:true,attributeFilter:['style']});sync();}
})();