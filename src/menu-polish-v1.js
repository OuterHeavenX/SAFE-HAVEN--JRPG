'use strict';
(()=>{
const g=window.__safehavenGame,canvas=document.getElementById('game');
if(!g||!canvas)return;
const ctx=canvas.getContext('2d'),TAU=Math.PI*2;
const C={gold:'#ecd27a',cream:'#fff0ce',muted:'#a8a4b8',green:'#7fdb8c',red:'#ef777d',blue:'#80b9ea',gray:'#777889',dark:'#0b0d25'};
function text(t,x,y,s=16,c=C.cream,a='left'){ctx.save();ctx.font=`${s}px Georgia,serif`;ctx.textAlign=a;ctx.textBaseline='middle';ctx.fillStyle='rgba(0,0,0,.55)';ctx.fillText(String(t),x+1,y+2);ctx.fillStyle=c;ctx.fillText(String(t),x,y);ctx.restore();}
function panel(x,y,w,h,title){const q=ctx.createLinearGradient(x,y,x,y+h);q.addColorStop(0,'rgba(25,28,70,.98)');q.addColorStop(1,'rgba(7,9,29,.98)');ctx.fillStyle=q;ctx.fillRect(x,y,w,h);ctx.strokeStyle='#111229';ctx.lineWidth=6;ctx.strokeRect(x+3,y+3,w-6,h-6);ctx.strokeStyle=C.gold;ctx.lineWidth=2;ctx.strokeRect(x+8,y+8,w-16,h-16);if(title)text(title,x+20,y+27,17,C.gold);}
function bar(x,y,w,h,v,max,color){ctx.fillStyle='#28283c';ctx.fillRect(x,y,w,h);ctx.fillStyle=color;ctx.fillRect(x,y,w*Math.max(0,Math.min(1,v/Math.max(1,max))),h);ctx.strokeStyle='#b9a66a';ctx.lineWidth=1;ctx.strokeRect(x-.5,y-.5,w+1,h+1);}
function diamond(x,y,c=C.gold){ctx.fillStyle=c;ctx.beginPath();ctx.moveTo(x,y-7);ctx.lineTo(x+7,y);ctx.lineTo(x,y+7);ctx.lineTo(x-7,y);ctx.closePath();ctx.fill();}
function item(id){return SH.DATA.weapons[id]||SH.DATA.armor[id]||null;}
function eqName(id){return id?(item(id)?.name||id):'— Empty —';}
function ownedEquipment(){const ids=new Set(Object.keys(g.s?.equipment||{}).filter(id=>(g.s.equipment[id]||0)>0&&item(id)));for(const id of Object.values(g.s?.player?.equipment||{}))if(id&&item(id))ids.add(id);return [...ids];}
function baseStatsWithout(slot){const p=g.s.player;let atk=p.str,def=p.vit,agi=p.agi;for(const [sl,id] of Object.entries(p.equipment||{})){if(sl===slot||!id)continue;const o=item(id)||{};atk+=o.atk||0;def+=o.def||0;agi+=o.agi||0;}return{attack:atk,defense:def,agi};}
function projected(candidate){const base=baseStatsWithout(candidate.slot);return{attack:base.attack+(candidate.atk||0),defense:base.defense+(candidate.def||0),agi:base.agi+(candidate.agi||0)};}
function diffText(label,current,next,x,y){const d=next-current,c=d>0?C.green:d<0?C.red:C.muted,s=d>0?`+${d}`:`${d}`;text(label,x,y,15,C.muted);text(`${current}  →  ${next}`,x+94,y,16,c);text(d===0?'—':s,x+225,y,15,c,'right');}
const JOBS=[
 {id:'wanderer',name:'Wanderer',unlock:()=>true,cond:'Starting vocation',pros:['Balanced growth','Reliable exploration'],cons:['No major specialization']},
 {id:'warrior',name:'Warrior',unlock:()=>g.s.player.level>=4,cond:'Reach character Level 4',pros:['High physical pressure','Durable front-line style'],cons:['Low magical flexibility','Slower tactical options']},
 {id:'whiteMage',name:'White Mage',unlock:()=>!!g.s.flags.necklaceDone,cond:'Complete Lysa’s Lost Necklace quest',pros:['Healing & sustain','Excellent recovery'],cons:['Lower direct damage','MP dependent']},
 {id:'blackMage',name:'Black Mage',unlock:()=>g.s.player.level>=5&&!!g.s.flags.enteredCave,cond:'Reach Level 5 + enter Whisperwood Cave',pros:['Powerful elemental magic','Exploits weaknesses'],cons:['Fragile specialization','Heavy MP use']}
];
function drawEquipment(){
 panel(70,30,820,480,'EQUIPMENT');
 panel(96,66,768,112,'CURRENTLY EQUIPPED');
 const slots=[['Weapon','weapon'],['Shield','shield'],['Head','head'],['Body','body'],['Accessory','accessory']];
 slots.forEach(([lab,sl],i)=>{const col=i<3?0:1,row=i<3?i:i-3,x=120+col*370,y=122+row*22;text(lab+':',x,y,13,C.muted);text(eqName(g.s.player.equipment[sl]),x+76,y,14,C.cream)});
 panel(96,190,355,284,'OWNED GEAR'); panel(465,190,399,284,'STAT PREVIEW');
 const list=ownedEquipment(); if(!list.length){text('No equipment owned yet.',126,245,16,C.muted);return;}
 g.menu.index=Math.max(0,Math.min(g.menu.index,list.length-1));
 list.slice(0,8).forEach((id,i)=>{const o=item(id),y=238+i*28;if(i===g.menu.index)diamond(121,y);const equipped=g.s.player.equipment[o.slot]===id;text(o.name,140,y,15,equipped?C.gold:C.cream);if(equipped)text('EQUIPPED',421,y,10,C.gold,'right')});
 const id=list[g.menu.index],o=item(id),curId=g.s.player.equipment[o.slot],cur=item(curId)||{};const now=g.stats(),next=projected(o);
 text(o.name,490,234,20,C.gold);text(`${o.slot.toUpperCase()}  •  comparing with ${eqName(curId)}`,490,260,12,C.muted);
 diffText('Attack',now.attack,next.attack,490,305);diffText('Defense',now.defense,next.defense,490,340);diffText('Agility',now.agi,next.agi,490,375);
 const deltas=[(o.atk||0)-(cur.atk||0),(o.def||0)-(cur.def||0),(o.agi||0)-(cur.agi||0)];
 const better=deltas.some(v=>v>0),worse=deltas.some(v=>v<0);text(better&&!worse?'▲ UPGRADE':worse&&!better?'▼ DOWNGRADE':better&&worse?'◆ TRADE-OFF':'◆ SIDEGRADE',490,421,16,better&&!worse?C.green:worse&&!better?C.red:C.gold);
 text('Tap gear to compare/equip',816,449,12,C.muted,'right');
}
function drawStatus(){
 const p=g.s.player,st=g.stats(),need=Math.max(0,p.nextXp-p.xp);panel(90,34,780,472,'STATUS');
 panel(116,76,290,388);panel(425,76,419,388,'PROGRESSION');
 text('KAEL',260,116,26,C.gold,'center');text(`Level ${p.level}  •  ${SH.DATA.jobs[p.job]?.name||p.job}`,260,148,15,C.muted,'center');
 ctx.fillStyle='#d9a66b';ctx.fillRect(244,176,32,26);ctx.fillStyle='#39273b';ctx.fillRect(241,173,38,9);ctx.fillStyle='#44658c';ctx.fillRect(238,201,44,42);ctx.fillStyle='#6d3d2f';ctx.fillRect(242,243,14,22);ctx.fillRect(264,243,14,22);
 text('CORE STATS',140,303,15,C.gold);text(`Attack   ${st.attack}`,140,333,17);text(`Defense  ${st.defense}`,140,363,17);text(`Agility  ${st.agi}`,140,393,17);text(`Magic    ${p.magic}`,140,423,17);
 text(`XP ${p.xp} / ${p.nextXp}`,453,132,17,C.cream);bar(453,150,350,13,p.xp,p.nextXp,C.green);text(`${need} XP until Level ${p.level+1}`,453,180,15,C.gold);
 text(`JP ${p.jp} / ${p.nextJp}`,453,224,17,C.cream);bar(453,242,350,13,p.jp,p.nextJp,C.blue);text(`${Math.max(0,p.nextJp-p.jp)} JP until Job Lv ${p.jobLevel+1}`,453,272,14,C.muted);
 text(`HP ${p.hp} / ${p.maxHp}`,453,318,16);bar(453,336,350,11,p.hp,p.maxHp,'#6fc37c');text(`MP ${p.mp} / ${p.maxMp}`,453,374,16,C.blue);bar(453,392,350,11,p.mp,p.maxMp,'#6597d0');
 text(`Luck ${p.luck}   •   Vitality ${p.vit}`,453,432,14,C.muted);
}
function drawJobs(){
 const p=g.s.player;panel(70,30,820,480,'JOBS');panel(96,68,330,410,'VOCATIONS');panel(440,68,424,410,'JOB DETAILS');
 g.menu.index=Math.max(0,Math.min(g.menu.index,JOBS.length-1));
 JOBS.forEach((j,i)=>{const unlocked=j.unlock(),active=p.job===j.id,y=126+i*68;if(i===g.menu.index)diamond(121,y,unlocked?C.gold:'#777889');text(j.name,142,y,18,unlocked?(active?C.gold:C.cream):C.gray);text(unlocked?(active?'CURRENT JOB':'Unlocked'):'LOCKED',142,y+24,12,unlocked?C.green:C.gray)});
 const j=JOBS[g.menu.index],unlocked=j.unlock();text(j.name.toUpperCase(),468,116,22,unlocked?C.gold:C.gray);text(unlocked?(p.job===j.id?'Currently equipped vocation':'Ready to change job'):'Unlock condition:',468,146,13,unlocked?C.muted:C.gray);if(!unlocked)text(j.cond,468,170,14,'#aaa8b5');
 text('PROS',468,216,14,C.green);j.pros.forEach((x,i)=>text('＋ '+x,468,244+i*27,15,unlocked?C.green:C.gray));text('CONS',468,316,14,C.red);j.cons.forEach((x,i)=>text('− '+x,468,344+i*27,15,unlocked?C.red:C.gray));
 const dat=SH.DATA.jobs[j.id];if(dat?.abilities?.length){text('ABILITIES',660,216,14,C.gold);dat.abilities.slice(0,3).forEach((a,i)=>text(`${a[0]}  (${a[1]} JP)`,660,244+i*27,13,unlocked?C.cream:C.gray));}
}
const originalDrawMenu=g.drawMenu.bind(g);
g.drawMenu=function(){if(this.menu?.page==='equipment')return drawEquipment();if(this.menu?.page==='status')return drawStatus();if(this.menu?.page==='jobs')return drawJobs();originalDrawMenu();};
const originalMenuInput=g.menuInput.bind(g);
g.menuInput=function(a){
 if(this.menu?.page==='jobs'){
  if(a==='cancel'){this.menu.page='root';this.menu.index=0;return;}
  if(a==='up')this.menu.index=(this.menu.index+JOBS.length-1)%JOBS.length;
  if(a==='down')this.menu.index=(this.menu.index+1)%JOBS.length;
  if(a==='confirm'){const j=JOBS[this.menu.index];if(!j.unlock()){this.notice=`Locked: ${j.cond}`;this.noticeT=1.8;return;}if(this.s.player.job!==j.id){this.s.player.job=j.id;this.notice=`Job changed to ${j.name}!`;this.noticeT=1.8;SH.Save.autosave(this.s);}else{this.notice=`${j.name} is already active.`;this.noticeT=1.2;}return;}return;
 }
 const before=this.menu?.page==='equipment'?this.s.player.equipment&&JSON.stringify(this.s.player.equipment):null;originalMenuInput(a);if(before&&a==='confirm'&&before!==JSON.stringify(this.s.player.equipment)){this.notice='Equipment changed — stats updated!';this.noticeT=1.5;}
};
})();