'use strict';
(()=>{
const g=window.__safehavenGame;
const shell=document.getElementById('game-shell');
const modal=document.getElementById('modal-touch');
if(!g||!shell)return;

const style=document.createElement('style');
style.textContent=`
#direct-touch-ui{position:absolute;inset:0;z-index:18;pointer-events:none;font-family:Georgia,serif;color:#fff2d3}
#direct-touch-ui button{font-family:Georgia,serif;-webkit-tap-highlight-color:transparent;touch-action:manipulation}
.dt-menu-root,.dt-equip-list,.dt-job-list,.dt-simple-list,.dt-battle,.dt-confirm,.dt-back{position:absolute;pointer-events:auto}
.dt-menu-root{left:12.2%;top:14%;width:28%;height:71%;display:grid;grid-template-rows:repeat(8,1fr);gap:4px}
.dt-menu-root button{border:1px solid rgba(226,198,110,.20);background:rgba(13,15,48,.18);color:#fff0d2;font-size:17px;text-align:left;padding:0 18px;border-radius:5px}
.dt-menu-root button:active{background:rgba(226,198,110,.20);border-color:#e2c66e}
.dt-menu-root .selected{background:rgba(226,198,110,.10);color:#ffe99b}
.dt-equip-list{left:10.1%;top:38.7%;width:36.6%;height:48%;display:flex;flex-direction:column;gap:4px;padding:32px 18px 16px}
.dt-equip-list button{min-height:34px;border:1px solid rgba(226,198,110,.22);background:rgba(8,10,36,.42);color:#fff0d2;font-size:15px;text-align:left;padding:5px 12px;border-radius:4px}
.dt-equip-list button:active,.dt-equip-list .selected{background:rgba(226,198,110,.17);border-color:#e2c66e;color:#ffe99b}
.dt-job-list{left:10.1%;top:16%;width:35%;height:69%;display:flex;flex-direction:column;gap:9px;padding:36px 18px 12px}
.dt-job-list button{min-height:58px;border:1px solid rgba(226,198,110,.18);background:rgba(8,10,36,.28);color:#fff0d2;font-size:17px;text-align:left;padding:7px 13px;border-radius:5px}
.dt-job-list button small{display:block;font-size:11px;margin-top:5px;color:#78d989}
.dt-job-list button.locked{color:#777889;border-color:rgba(125,125,145,.15);background:rgba(20,20,34,.18)}
.dt-job-list button.locked small{color:#777889}
.dt-simple-list{left:10.5%;top:23%;width:76%;height:59%;display:flex;flex-direction:column;gap:5px;padding:8px}
.dt-simple-list button{min-height:38px;border:1px solid rgba(226,198,110,.2);background:rgba(9,11,39,.35);color:#fff0d2;font-size:15px;text-align:left;padding:7px 13px;border-radius:4px}
.dt-simple-list button:active{background:rgba(226,198,110,.17);border-color:#e2c66e}
.dt-back{right:10.5%;bottom:8.5%;padding:9px 18px;border:1px solid #e2c66e;background:rgba(10,12,39,.9);color:#fff0d2;border-radius:6px;font-weight:700;font-size:14px}
.dt-confirm{left:50%;top:50%;transform:translate(-50%,-50%);width:min(620px,72vw);background:linear-gradient(#1b1e52,#090a20);border:5px solid #101129;box-shadow:0 0 0 2px #e2c66e inset,0 18px 50px rgba(0,0,0,.72);padding:22px 28px;border-radius:4px}
.dt-confirm h3{margin:0 0 8px;color:#f0d77d;font-size:24px}.dt-confirm .sub{color:#aaa8bd;font-size:13px;margin-bottom:15px}.dt-deltas{display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;margin:12px 0 18px}.dt-stat{padding:9px;border:1px solid rgba(226,198,110,.18);background:rgba(255,255,255,.035);text-align:center}.dt-stat strong{display:block;font-size:18px}.dt-stat.up strong{color:#7fdb8c}.dt-stat.down strong{color:#ef777d}.dt-stat.same strong{color:#a8a4b8}.dt-confirm-actions{display:grid;grid-template-columns:1fr 1fr;gap:12px}.dt-confirm-actions button{padding:13px;border:2px solid #e2c66e;background:#12143b;color:#fff0d2;font-size:17px;border-radius:6px}.dt-confirm-actions button.yes{background:#203d32;border-color:#7fdb8c}.dt-confirm-actions button.no{background:#3d242a;border-color:#ef777d}
.dt-battle{left:53%;bottom:3.8%;width:37%;display:grid;grid-template-columns:1fr 1fr;gap:8px}
.dt-battle button{min-height:54px;border:2px solid #d8c36c;background:linear-gradient(#203e79,#132753);color:#fff;font-weight:700;font-size:17px;border-radius:8px;box-shadow:inset 0 0 0 2px rgba(255,255,255,.08),0 4px 10px rgba(0,0,0,.35)}
.dt-battle button:active{transform:translateY(1px);background:linear-gradient(#315493,#1b376b)}
.dt-battle button:nth-child(5){grid-column:1/-1;background:linear-gradient(#503244,#301f2b)}
.dt-battle[aria-disabled=true] button{opacity:.45;pointer-events:none}
@media(max-width:700px){.dt-menu-root button{font-size:13px;padding-left:12px}.dt-equip-list{padding-top:24px}.dt-equip-list button{min-height:29px;font-size:12px}.dt-job-list{gap:5px;padding-top:27px}.dt-job-list button{min-height:45px;font-size:13px}.dt-confirm{width:72vw;padding:16px 19px}.dt-confirm h3{font-size:20px}.dt-battle{left:51%;width:40%;bottom:2.5%;gap:5px}.dt-battle button{min-height:46px;font-size:14px}}
`;
document.head.appendChild(style);

const root=document.createElement('div');root.id='direct-touch-ui';shell.appendChild(root);
let confirmBox=null;
const ROOT=['Items','Equipment','Status','Jobs','Quests','Bestiary','Save','Close'];
const JOBS=[
 {id:'wanderer',name:'Wanderer',unlock:()=>true,cond:'Starting vocation'},
 {id:'warrior',name:'Warrior',unlock:()=>g.s?.player?.level>=4,cond:'Reach Level 4'},
 {id:'whiteMage',name:'White Mage',unlock:()=>!!g.s?.flags?.necklaceDone,cond:'Complete Lost Necklace'},
 {id:'blackMage',name:'Black Mage',unlock:()=>g.s?.player?.level>=5&&!!g.s?.flags?.enteredCave,cond:'Lv 5 + enter Whisperwood Cave'}
];
const gear=id=>SH.DATA.weapons[id]||SH.DATA.armor[id]||null;
const ownedGear=()=>Object.keys(g.s?.equipment||{}).filter(id=>(g.s.equipment[id]||0)>0&&gear(id));
function clear(){root.querySelectorAll(':scope > *').forEach(n=>n.remove());confirmBox=null;}
function btn(txt,fn,cls=''){const b=document.createElement('button');b.type='button';b.textContent=txt;if(cls)b.className=cls;b.addEventListener('pointerdown',e=>{e.preventDefault();e.stopPropagation();fn();});return b;}
function back(){const b=btn('B  BACK',()=>{g.menuInput('cancel');render();},'dt-back');root.appendChild(b);}
function rootMenu(){const box=document.createElement('div');box.className='dt-menu-root';ROOT.forEach((name,i)=>{const b=btn(name,()=>{g.menu.index=i;g.menuInput('confirm');render();},i===g.menu.index?'selected':'');box.appendChild(b)});root.appendChild(box);}
function simpleList(){const page=g.menu.page,box=document.createElement('div');box.className='dt-simple-list';let rows=[];
 if(page==='items')rows=Object.entries(g.s.inventory).filter(([,n])=>n>0).map(([id,n])=>({label:`${SH.DATA.items[id]?.name||id} ×${n}`,action:()=>{if(id==='potion'&&n>0&&g.s.player.hp<g.s.player.maxHp){g.s.inventory.potion--;g.s.player.hp=Math.min(g.s.player.maxHp,g.s.player.hp+60);g.notice='Potion restores 60 HP.';g.noticeT=1.2;render();}}}));
 if(page==='quests')rows=Object.entries(g.s.quests).map(([id,state])=>({label:`${SH.DATA.quests[id]?.name||id}  —  ${state}`,action:()=>{}}));
 if(page==='bestiary')rows=Object.keys(g.s.bestiary).map(id=>({label:`${SH.DATA.enemies[id]?.name||id} ×${g.s.bestiary[id]}`,action:()=>{}}));
 rows.forEach(r=>box.appendChild(btn(r.label,r.action)));root.appendChild(box);back();}
function currentStats(){return g.stats();}
function projected(o){const p=g.s.player;let attack=p.str,defense=p.vit,agi=p.agi;for(const [slot,id] of Object.entries(p.equipment||{})){if(slot===o.slot||!id)continue;const x=gear(id)||{};attack+=x.atk||0;defense+=x.def||0;agi+=x.agi||0;}return{attack:attack+(o.atk||0),defense:defense+(o.def||0),agi:agi+(o.agi||0)};}
function openEquipConfirm(id){const o=gear(id);if(!o)return;const cur=g.s.player.equipment[o.slot];const curObj=gear(cur)||{};const now=currentStats(),next=projected(o);if(confirmBox)confirmBox.remove();const box=document.createElement('div');box.className='dt-confirm';confirmBox=box;
 const delta=(lab,a,b)=>{const d=b-a,cl=d>0?'up':d<0?'down':'same',sign=d>0?`+${d}`:`${d}`;return `<div class="dt-stat ${cl}"><span>${lab}</span><strong>${a} → ${b}</strong><small>${d===0?'No change':sign}</small></div>`};
 box.innerHTML=`<h3>Equip ${o.name}?</h3><div class="sub">${o.slot.toUpperCase()} · currently ${curObj.name||'Empty'}</div><div class="dt-deltas">${delta('ATK',now.attack,next.attack)}${delta('DEF',now.defense,next.defense)}${delta('AGI',now.agi,next.agi)}</div><div class="dt-confirm-actions"></div>`;
 const act=box.querySelector('.dt-confirm-actions');act.appendChild(btn('YES — EQUIP',()=>{g.s.player.equipment[o.slot]=id;g.notice=`Equipped ${o.name}`;g.noticeT=1.4;SH.Save.autosave(g.s);box.remove();confirmBox=null;render();},'yes'));act.appendChild(btn('NO — KEEP CURRENT',()=>{box.remove();confirmBox=null;},'no'));root.appendChild(box);}
function equipment(){const box=document.createElement('div');box.className='dt-equip-list';const list=ownedGear();if(list.length){list.forEach((id,i)=>{const o=gear(id),equipped=g.s.player.equipment[o.slot]===id;const b=btn(`${equipped?'✓ ':''}${o.name}`,()=>{g.menu.index=i;openEquipConfirm(id);},equipped?'selected':'');box.appendChild(b);});}root.appendChild(box);back();}
function jobs(){const box=document.createElement('div');box.className='dt-job-list';JOBS.forEach((j,i)=>{const unlocked=j.unlock(),active=g.s.player.job===j.id;const b=document.createElement('button');b.type='button';b.className=unlocked?'':'locked';b.innerHTML=`${active?'◆ ':''}${j.name}<small>${active?'CURRENT JOB':unlocked?'Tap to select':`LOCKED — ${j.cond}`}</small>`;b.addEventListener('pointerdown',e=>{e.preventDefault();e.stopPropagation();g.menu.index=i;if(!unlocked){g.notice=`Locked: ${j.cond}`;g.noticeT=1.6;render();return;}if(!active){g.s.player.job=j.id;g.notice=`Job changed to ${j.name}!`;g.noticeT=1.6;SH.Save.autosave(g.s);}render();});box.appendChild(b)});root.appendChild(box);back();}
function battle(){const box=document.createElement('div');box.className='dt-battle';box.setAttribute('aria-disabled',g.battle?.turn!=='player'?'true':'false');['Attack','Magic','Item','Defend','Flee'].forEach(cmd=>box.appendChild(btn(cmd,()=>{if(g.mode==='battle'&&g.battle?.turn==='player')g.battle.command(cmd);})));root.appendChild(box);}
function render(){clear();if(!g)return;if(g.mode==='battle'){battle();if(modal)modal.style.display='none';return;}if(g.menu){if(modal)modal.style.display='none';if(g.menu.page==='root')rootMenu();else if(g.menu.page==='equipment')equipment();else if(g.menu.page==='jobs')jobs();else if(g.menu.page==='status')back();else if(['items','quests','bestiary'].includes(g.menu.page))simpleList();else back();return;}if(modal)modal.style.display=(g.dialog||g.shop)?'block':'none';}
let sig='';setInterval(()=>{const s=[g.mode,g.menu?.page||'',g.menu?.index||0,g.shop?'shop':'',g.dialog?'dialog':'',g.battle?.turn||'',g.s?.player?.job||'',JSON.stringify(g.s?.player?.equipment||{}),JSON.stringify(g.s?.equipment||{}),JSON.stringify(g.s?.inventory||{})].join('|');if(s!==sig){sig=s;render();}},90);
const origInput=g.input.bind(g);g.input=function(a){origInput(a);setTimeout(render,0);};
render();
})();