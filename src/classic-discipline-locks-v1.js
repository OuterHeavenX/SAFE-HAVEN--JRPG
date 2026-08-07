'use strict';
(()=>{
 const g=window.__safehavenGame,C=SH.Classic,root=document.getElementById('classic-ui');if(!g||!C||!root)return;
 C.disciplineUnlocked=(id,s=g.s)=>{C.ensureState(s);if(id==='wanderer')return {ok:true};if(id==='warrior')return s.player.rank>=4?{ok:true}:{ok:false,reason:`Reach ${C.formatLevel(4)}`};if(id==='whiteMage')return s.flags?.necklaceDone?{ok:true}:{ok:false,reason:'Complete Lost Necklace'};if(id==='blackMage')return s.flags?.enteredCave&&s.player.rank>=5?{ok:true}:{ok:false,reason:`Enter Whisperwood Cave + reach ${C.formatLevel(5)}`};return {ok:false,reason:'Undiscovered'} };
 const names=Object.fromEntries(Object.entries(C.disciplines).map(([id,d])=>[d.name,id]));
 const sync=()=>{if(!g.s)return;root.querySelectorAll('.cj-disc button').forEach(b=>{const id=names[b.textContent.trim()];if(!id)return;const u=C.disciplineUnlocked(id);b.disabled=!u.ok;b.title=u.ok?'':u.reason;if(!u.ok&&!b.textContent.includes('LOCKED'))b.textContent+=` — LOCKED`;});};
 new MutationObserver(sync).observe(root,{childList:true,subtree:true});setInterval(sync,300);
})();