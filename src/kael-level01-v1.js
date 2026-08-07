'use strict';
(()=>{
  const img=new Image();
  const asset={walk:img,idle:img,ready:false,failed:false,frameW:64,frameH:64,cols:6,rows:4,directions:{left:1,right:2,down:0,up:3}};
  img.onload=()=>{asset.ready=true;asset.failed=false;};
  img.onerror=()=>{asset.failed=true;console.warn('Kael Level 01 walk sprite failed to load.');};
  try{
    const xhr=new XMLHttpRequest();
    xhr.open('GET','assets/sprites/kael/level-01/walk-base64.txt?v=20260807-1450',false);
    xhr.send(null);
    if(xhr.status>=200&&xhr.status<300){
      img.src='data:image/png;base64,'+xhr.responseText.trim();
    }else{
      asset.failed=true;
      console.warn('Kael Level 01 sprite payload unavailable:',xhr.status);
    }
  }catch(error){asset.failed=true;console.warn('Kael Level 01 sprite payload error.',error);}
  window.KaelLevel01=asset;
})();