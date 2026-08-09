'use strict';
(()=>{
  const xhr=new XMLHttpRequest();
  xhr.open('GET','src/game.js?v=20260808-chapter2',false);
  xhr.send(null);
  if(xhr.status<200||xhr.status>=300)throw new Error('Unable to load game core: '+xhr.status);
  let source=xhr.responseText;
  source=source.replaceAll("this.s.map==='town'","(this.s.map==='town'||this.s.map==='ashwatch')");
  source=source.replaceAll("this.s.map==='world'","(this.s.map==='world'||this.s.map==='eastRoad')");
  source=source.replaceAll("this.s.map==='cave'","(this.s.map==='cave'||this.s.map==='starfallRuins')");

  source=source.replace("function person(x,y,kind='kael',frame=0,scale=1.2){",`function person(x,y,kind='kael',frame=0,scale=1.2){
    if(kind==='kael'&&window.KaelLevel01){
      const a=window.KaelLevel01, facing=window.KaelFacing||'down', moving=!!window.KaelIsMoving;
      const hd=a.family==='hd'&&a.animation;
      const animKey=(moving?'walk':'idle')+'_'+facing;
      const clip=hd?a.animation(animKey):null;
      const image=clip?.image||a.walk;
      const imageReady=!!image&&(hd?!!clip?.ready:a.ready)&&image.complete&&image.naturalWidth>0&&image.naturalHeight>0;
      if(imageReady){
        const fw=clip?.frameW||a.frameW||64, fh=clip?.frameHeight||clip?.frameH||a.frameH||64, cols=clip?.frames||a.cols||6;
        const row=(a.directions&&a.directions[facing]!=null)?a.directions[facing]:0;
        const now=performance.now();
        if(hd&&window.KaelAnimKey!==animKey){window.KaelAnimKey=animKey;window.KaelAnimStartedAt=now;}
        const elapsed=hd?Math.max(0,now-(window.KaelAnimStartedAt||now)):0;
        const f=hd?(Math.floor(elapsed/(1000/(clip?.fps||10)))%cols):(moving?(Math.floor(now/95)%cols):0);
        const dw=hd?64*scale:82*scale, dh=hd?80*scale:82*scale;
        try{
          ctx.save();ctx.imageSmoothingEnabled=false;
          ctx.drawImage(image,f*fw,hd?0:row*fh,fw,fh,Math.round(x-dw/2),Math.round(y-dh*.72),Math.round(dw),Math.round(dh));
          ctx.restore();return;
        }catch(spriteError){
          try{ctx.restore();}catch(_restoreError){}
          if(!a.drawFailedLogged){a.drawFailedLogged=true;console.warn('Kael sprite unavailable; using safe fallback.',spriteError);}
        }
      }
    }`);

  source=source.replace(
    "if(['up','down','left','right'].includes(a))this.move(a);",
    "if(['up','down','left','right','up-left','up-right','down-left','down-right'].includes(a))this.move(a);"
  );

  source=source.replace(
    "move(a){const d={up:[0,-1],down:[0,1],left:[-1,0],right:[1,0]}[a],m=SH.MAPS[this.s.map];",
    "move(a){const d={up:[0,-1],down:[0,1],left:[-1,0],right:[1,0],'up-left':[-1,-1],'up-right':[1,-1],'down-left':[-1,1],'down-right':[1,1]}[a],m=SH.MAPS[this.s.map];"
  );

  source=source.replace(
    "camera(m,tw){const mw=m.w*tw,mh=m.h*tw;let ox=480-this.s.x*tw,oy=270-this.s.y*tw;",
    "camera(m,tw){const mw=m.w*tw,mh=m.h*tw;const vx=Number.isFinite(window.KaelVisualX)?window.KaelVisualX:this.s.x,vy=Number.isFinite(window.KaelVisualY)?window.KaelVisualY:this.s.y;let ox=480-vx*tw,oy=270-vy*tw;"
  );
  source=source.replace("return{ox,oy};}","return{ox:Math.round(ox),oy:Math.round(oy)};}");

  source=source.replace(
    "const playerX=ox+this.s.x*tw,playerY=oy+this.s.y*tw;person(playerX,playerY,'kael',Math.floor(this.anim*4),this.s.map==='home'?1.4:1.25);",
    "const pvx=Number.isFinite(window.KaelVisualX)?window.KaelVisualX:this.s.x,pvy=Number.isFinite(window.KaelVisualY)?window.KaelVisualY:this.s.y;const playerX=ox+pvx*tw,playerY=oy+pvy*tw;person(playerX,playerY,'kael',Math.floor(this.anim*4),this.s.map==='home'?1.4:1.25);"
  );

  source=source.replace("person(745,240,'kael',Math.floor(this.anim*4),1.7);","");
  source=source.replace(/this\.battle\.enemies\.forEach\(\(e,i\)=>\{if\(e\.hp<=0\)return;const ex=175\+i\*125;enemy\(e,ex,245\);txt\(e\.name,ex,320,14,'#fff6de','center'\);SH\.UI\.bar\(ctx,ex-50,332,100,8,e\.hp,e\.maxHp,'#c85e62'\)\}\);/g,`this.battle.enemies.forEach((e,i)=>{if(e.hp<=0)return;const ex=245+i*118;txt(e.name,ex,320,14,'#fff6de','center');SH.UI.bar(ctx,ex-50,332,100,8,e.hp,e.maxHp,'#c85e62')});`);
  source=source.replace(/panel\(525,340,410,176,'COMMAND'\);\['Attack','Magic','Item','Defend','Flee'\]\.forEach\(\(x,i\)=>\{[^}]*\}\);/g,'');
  source=source.replace("panel(20,440,470,76);txt(`KAEL   HP ${this.s.player.hp}/${this.s.player.maxHp}   MP ${this.s.player.mp}/${this.s.player.maxMp}`,38,477,16);","panel(20,414,455,64);txt(`KAEL   HP ${this.s.player.hp}/${this.s.player.maxHp}   MP ${this.s.player.mp}/${this.s.player.maxMp}`,38,451,16);");
  source=source.replace('LV ${this.s.player.level}  ${SH.DATA.jobs[this.s.player.job].name.toUpperCase()}','${SH.Classic.formatLevel(this.s.player.rank||this.s.player.level)}  KAEL');
  source=source.replace('`Level ${this.s.player.level}`','SH.Classic.formatLevel(this.s.player.rank||this.s.player.level)');
  if(source.includes("enemy(e,ex,245)"))console.warn('SafeHaven: legacy battle enemy art was not removed.');
  if(source.includes("panel(525,340,410,176,'COMMAND')"))console.warn('SafeHaven: legacy battle command panel was not removed.');

  source=source.replace(/new Game\(\);\s*\}\)\(\);?\s*$/,'window.__safehavenGame=new Game();\n})();');
  (0,eval)(source+'\n//# sourceURL=src/game.js');
  if(!window.__safehavenGame)throw new Error('SafeHaven game instance was not exposed.');

  window.KaelFacing=window.KaelFacing||'down';
  window.KaelVisualX=NaN;window.KaelVisualY=NaN;window.KaelVisualMap=null;window.KaelIsMoving=false;window.KaelTouchHeldDir=null;
  window.KaelAnimKey='';window.KaelAnimStartedAt=performance.now();
  const game=window.__safehavenGame;
  const DIRECTIONS=['up','down','left','right','up-left','up-right','down-left','down-right'];
  const originalInput=game.input.bind(game);
  game.input=function(action){
    if(DIRECTIONS.includes(action)&&this.mode==='world'&&!this.dialog&&!this.menu&&!this.shop){const parts=action.split('-');if(parts.length===1)window.KaelFacing=action;else if(!parts.includes(window.KaelFacing))window.KaelFacing=parts[1]||parts[0];if(window.KaelIsMoving)return;}
    return originalInput(action);
  };
  const held=new Set();
  const keyToDir={ArrowUp:'up',KeyW:'up',ArrowDown:'down',KeyS:'down',ArrowLeft:'left',KeyA:'left',ArrowRight:'right',KeyD:'right'};
  const resolveHeld=()=>{const up=held.has('up'),down=held.has('down'),left=held.has('left'),right=held.has('right');const v=up&&!down?'up':down&&!up?'down':null,h=left&&!right?'left':right&&!left?'right':null;return v&&h?`${v}-${h}`:(h||v)};
  addEventListener('keydown',e=>{const d=keyToDir[e.code];if(!d)return;e.preventDefault();e.stopImmediatePropagation();held.add(d)},true);
  addEventListener('keyup',e=>{const d=keyToDir[e.code];if(!d)return;e.preventDefault();e.stopImmediatePropagation();held.delete(d)},true);
  addEventListener('blur',()=>{held.clear();window.KaelTouchHeldDir=null});
  const originalLoop=game.loop.bind(game);let lastVisualTime=performance.now(),nextHeldStep=0;
  game.loop=function(t){const now=Number.isFinite(t)?t:performance.now(),dt=Math.max(0,Math.min(40,now-lastVisualTime));lastVisualTime=now;if(this.s&&this.mode==='world'){const map=this.s.map;if(window.KaelVisualMap!==map||!Number.isFinite(window.KaelVisualX)||!Number.isFinite(window.KaelVisualY)){window.KaelVisualMap=map;window.KaelVisualX=this.s.x;window.KaelVisualY=this.s.y;window.KaelIsMoving=false}else{const dx=this.s.x-window.KaelVisualX,dy=this.s.y-window.KaelVisualY,dist=Math.hypot(dx,dy);if(dist>0.001){const maxStep=dt/82;if(dist<=maxStep){window.KaelVisualX=this.s.x;window.KaelVisualY=this.s.y;window.KaelIsMoving=false}else{window.KaelVisualX+=dx/dist*maxStep;window.KaelVisualY+=dy/dist*maxStep;window.KaelIsMoving=true}}else{window.KaelVisualX=this.s.x;window.KaelVisualY=this.s.y;window.KaelIsMoving=false}}const heldDir=window.KaelTouchHeldDir||resolveHeld();if(heldDir&&!window.KaelIsMoving&&now>=nextHeldStep&&!this.dialog&&!this.menu&&!this.shop){const beforeX=this.s.x,beforeY=this.s.y;this.input(heldDir);if(this.s.x!==beforeX||this.s.y!==beforeY)window.KaelIsMoving=true;nextHeldStep=now+16}}else window.KaelIsMoving=false;return originalLoop(now)};
})();
