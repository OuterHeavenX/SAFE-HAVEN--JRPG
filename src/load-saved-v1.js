'use strict';
(()=>{
const requested=sessionStorage.getItem('safehaven.loadSlot');
if(requested){
  sessionStorage.removeItem('safehaven.loadSlot');
  const original=SH.Save.summaries.bind(SH.Save);
  SH.Save.summaries=()=>{
    const rows=original();
    const chosen=rows.find(x=>x.slot===requested);
    return chosen?[chosen,...rows.filter(x=>x.slot!==requested)]:rows;
  };
  setTimeout(()=>{
    const down=document.querySelector('#title-touch .joy-proxy[data-action="down"]');
    const confirm=document.querySelector('#title-touch [data-action="confirm"]');
    down?.dispatchEvent(new PointerEvent('pointerdown',{bubbles:false,pointerType:'touch',pointerId:901}));
    setTimeout(()=>confirm?.dispatchEvent(new PointerEvent('pointerdown',{bubbles:true,pointerType:'touch',pointerId:902})),70);
    setTimeout(()=>{SH.Save.summaries=original;},250);
  },140);
}

const shell=document.getElementById('game-shell');
const title=document.getElementById('title-touch');
if(!shell||!title)return;

const style=document.createElement('style');
style.textContent=`
#load-saved-launch{position:absolute;z-index:8;left:50%;bottom:4.5%;transform:translateX(-50%);padding:10px 18px;border:2px solid #e2c66e;background:rgba(13,14,39,.94);color:#fff1cb;font:700 14px Georgia,serif;border-radius:8px;box-shadow:0 4px 14px rgba(0,0,0,.5)}
#load-saved-overlay{position:absolute;z-index:20;inset:8%;display:none;background:linear-gradient(#171a48,#08091d);border:5px solid #101128;box-shadow:0 0 0 2px #e2c66e inset,0 18px 45px rgba(0,0,0,.65);padding:26px 34px;color:#fff1cb;font-family:Georgia,serif}
#load-saved-overlay.open{display:block}#load-saved-overlay h2{margin:0 0 18px;color:#f1d77d;font-size:26px}#load-saved-list{display:grid;gap:10px}
.load-slot{display:grid;grid-template-columns:150px 1fr auto;align-items:center;text-align:left;padding:12px 14px;border:1px solid rgba(226,198,110,.55);background:rgba(255,255,255,.035);color:#fff1cb;font:600 15px Georgia,serif;border-radius:6px}.load-slot:not(:disabled):active{background:rgba(226,198,110,.15)}.load-slot:disabled{opacity:.35}.load-slot strong{color:#f0d77f}.load-meta{font-size:12px;color:#c8c4da}.load-play{color:#d8c877;font-size:13px}#load-saved-close{position:absolute;right:26px;bottom:22px;padding:9px 18px;border:1px solid #e2c66e;background:#11132d;color:#fff1cb;border-radius:6px;font-weight:700}
@media(max-width:700px){#load-saved-overlay{inset:5%;padding:18px 20px}.load-slot{grid-template-columns:105px 1fr auto;padding:9px 10px;font-size:12px}#load-saved-overlay h2{font-size:20px}}
`;
document.head.appendChild(style);

const launch=document.createElement('button');
launch.id='load-saved-launch';launch.textContent='LOAD SAVED';shell.appendChild(launch);
const overlay=document.createElement('div');overlay.id='load-saved-overlay';overlay.innerHTML='<h2>LOAD SAVED GAME</h2><div id="load-saved-list"></div><button id="load-saved-close">B  BACK</button>';shell.appendChild(overlay);
const list=overlay.querySelector('#load-saved-list');
const names={auto:'AUTO SAVE','1':'SLOT 1','2':'SLOT 2','3':'SLOT 3'};
const mapName=id=>SH.MAPS?.[id]?.name||id||'Unknown';
function playtime(s){const m=Math.floor((s||0)/60);return m<60?`${m}m`:`${Math.floor(m/60)}h ${m%60}m`;}
function render(){
  list.innerHTML='';
  for(const s of SH.Save.summaries()){
    const b=document.createElement('button');b.className='load-slot';b.disabled=!!s.empty;
    const levelLabel=s.levelLabel||(window.SH?.Classic?SH.Classic.formatLevel(s.level):`Lv ${s.level}`);
    b.innerHTML=s.empty?`<strong>${names[s.slot]}</strong><span class="load-meta">EMPTY</span><span></span>`:`<strong>${names[s.slot]}</strong><span class="load-meta">${s.name} · ${levelLabel} · ${mapName(s.where)}</span><span class="load-play">${playtime(s.playtime)}</span>`;
    if(!s.empty)b.addEventListener('click',()=>{sessionStorage.setItem('safehaven.loadSlot',s.slot);location.reload();});
    list.appendChild(b);
  }
}
launch.addEventListener('click',()=>{render();overlay.classList.add('open');title.style.visibility='hidden';});
overlay.querySelector('#load-saved-close').addEventListener('click',()=>{overlay.classList.remove('open');title.style.visibility='';});
const sync=()=>{const onTitle=title.style.display!=='none';launch.style.display=onTitle&&!overlay.classList.contains('open')?'block':'none';if(!onTitle){overlay.classList.remove('open');launch.style.display='none';}};
new MutationObserver(sync).observe(title,{attributes:true,attributeFilter:['style']});sync();
})();