'use strict';
(()=>{
  const g=window.__safehavenGame,root=document.getElementById('jrpg-polish'),classic=document.getElementById('classic-ui'),canvas=document.getElementById('game');
  if(!g||!root||!classic||!canvas)return;
  document.body.classList.add('sh-premium');
  const style=document.createElement('style');style.id='safehaven-premium-polish';style.textContent=`
  :root{--sh-gold:#e7cd73;--sh-ivory:#fff1d2;--sh-midnight:#080b27;--sh-blue:#151b4b}
  #jrpg-polish .jp-screen,#classic-ui .cj-panel{animation:shPanelIn .18s cubic-bezier(.2,.75,.25,1);background:linear-gradient(145deg,rgba(24,29,78,.992),rgba(7,9,31,.996) 62%,rgba(4,6,23,.998));box-shadow:inset 0 0 0 3px #10142f,inset 0 0 34px rgba(75,94,176,.08),0 16px 42px rgba(0,0,0,.58)}
  #jrpg-polish .jp-head{background:linear-gradient(90deg,rgba(231,205,115,.07),transparent 62%)}
  #jrpg-polish .jp-title,#classic-ui .cj-title{text-shadow:0 1px #050615,0 0 12px rgba(231,205,115,.14)}
  #jrpg-polish .jp-btn,#classic-ui button{position:relative;transition:transform .12s ease,background .12s ease,border-color .12s ease,box-shadow .12s ease;color:var(--sh-ivory)}
  #jrpg-polish .jp-btn:focus-visible,#classic-ui button:focus-visible{outline:2px solid #fff0a2;outline-offset:-3px}
  #jrpg-polish .jp-btn.sel{transform:translateX(3px);box-shadow:inset 3px 0 #f2d879,0 0 13px rgba(112,137,225,.16)}
  #jrpg-polish .jp-btn.sel:before{content:'◆';font-size:8px;color:#ffe482;margin-right:7px}
  #jrpg-polish .jp-btn[data-nav='close']{border-color:rgba(231,205,115,.62);background:linear-gradient(90deg,#252653,#171a43)}
  #jrpg-polish .jp-left,#jrpg-polish .jp-right,#classic-ui .cj-disc,#classic-ui .cj-abilities,#classic-ui .cj-best-list,#classic-ui .cj-best-detail{scrollbar-width:thin;scrollbar-color:#8f8048 #0a0d2a;overscroll-behavior:contain}
  #jrpg-polish .jp-stat{background:linear-gradient(145deg,#111743,#0c1133);border-color:rgba(231,205,115,.13)}
  #jrpg-polish .jp-stat b{font-variant-numeric:tabular-nums}.jp-fill{transition:width .22s ease}
  #jrpg-polish .jp-save{border-left:3px solid var(--sh-gold)}
  #jrpg-polish .jp-quest.main{box-shadow:inset 0 0 18px rgba(231,205,115,.035)}
  #classic-ui .cj-ability{transition:border-color .13s ease,transform .13s ease}.cj-ability:has(.cj-green){border-color:rgba(120,221,139,.34)}
  #classic-ui .cj-reward strong{font-variant-numeric:tabular-nums;text-shadow:0 0 10px rgba(255,227,127,.18)}
  #direct-touch-ui .dt-battle button:not(:disabled):active{transform:translateY(1px) scale(.975);box-shadow:inset 0 0 0 2px rgba(255,235,155,.2),0 0 15px rgba(229,201,105,.18)}
  #jrpg-polish button,#classic-ui button{touch-action:pan-y;-webkit-user-select:none;user-select:none}
  body.jp-menu-open #touch,body.jp-shop-open #touch{visibility:hidden!important;pointer-events:none!important}
  @keyframes shPanelIn{from{opacity:0;transform:translateY(5px) scale(.992)}to{opacity:1;transform:none}}
  @media(prefers-reduced-motion:reduce){#jrpg-polish .jp-screen,#classic-ui .cj-panel{animation:none}#jrpg-polish *,#classic-ui *{transition-duration:.01ms!important}}
  @media(max-height:430px) and (orientation:landscape){#jrpg-polish .jp-left,#jrpg-polish .jp-right{scrollbar-width:auto}.jp-btn{scroll-margin:4px}}
  `;document.head.appendChild(style);

  const esc=s=>String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
  function enrich(){const screen=root.querySelector('.jp-screen');if(!screen||screen.querySelector('.sh-extra'))return;const title=screen.querySelector('.jp-head .jp-title')?.textContent.trim(),right=screen.querySelector('.jp-right'),p=g.s?.player;if(!right||!p)return;
    if(title==='STATUS'){const lyra=g.s.party?.members?.lyra,party=lyra?`<div class="jp-card"><div class="jp-gold">PARTY · LYRA</div><div class="jp-desc">${esc(window.SH?.Classic?.formatLevel?.(lyra.rank)||`Lv ${lyra.rank||1}`)} · HP ${lyra.hp}/${lyra.maxHp} · MP ${lyra.mp}/${lyra.maxMp}</div></div>`:'';right.insertAdjacentHTML('beforeend',`<div class="jp-card sh-extra"><div class="jp-gold">ADVENTURE</div><div class="jp-desc">${esc(SH.MAPS[g.s.map]?.name||g.s.map)} · ${Math.floor((g.s.playtime||0)/60)} min · ${g.s.gold} Gold<br>STR ${p.str||0} · VIT ${p.vit||0} · MAGIC ${p.magic||0}</div></div>${party}`)}
    if(title==='ITEMS'){const ids=Object.keys(g.s.inventory||{}).filter(id=>(g.s.inventory[id]||0)>0),id=ids[g.menu?.index||0],o=SH.DATA.items?.[id];if(o)right.insertAdjacentHTML('beforeend',`<div class="jp-card sh-extra"><div class="jp-gold">EFFECT</div><div class="jp-desc">${o.heal?`Restore ${o.heal} HP`:o.mpHeal?`Restore ${o.mpHeal} MP`:o.revive?`Revive with ${o.revive} HP`:'No field effect'} · ${o.type==='consumable'?'ALLY TARGET':'NOT USABLE'}</div></div>`)}
    if(title==='EQUIPMENT'){const ids=Object.keys(g.s.equipment||{}).filter(id=>(g.s.equipment[id]||0)>0&&(SH.DATA.weapons?.[id]||SH.DATA.armor?.[id])),o=(SH.DATA.weapons?.[ids[g.menu?.index||0]]||SH.DATA.armor?.[ids[g.menu?.index||0]]);if(o){const traits=[o.element&&`Element: ${o.element}`,o.statusOnHit&&`Status: ${o.statusOnHit}`,o.resistances?.length&&`Resists: ${o.resistances.join(', ')}`].filter(Boolean);if(traits.length)right.insertAdjacentHTML('beforeend',`<div class="jp-card sh-extra"><div class="jp-gold">TRAITS</div><div class="jp-desc">${esc(traits.join(' · '))}</div></div>`)}}
    if(title==='QUESTS'){const ids=Object.keys(g.s.quests||{}),id=ids[g.menu?.index||0],state=g.s.quests?.[id],kind=id==='main'||id==='chapter2'?'MAIN QUEST':String(state)==='complete'?'COMPLETED':'SIDE QUEST';right.insertAdjacentHTML('beforeend',`<div class="jp-card sh-extra"><div class="jp-gold">${kind}</div><div class="jp-desc">Objective status: ${esc(String(state||'unknown').toUpperCase())}. Follow the journal text and current location guidance.</div></div>`)}
    if(title==='SAVE'){const slot=String((g.menu?.index||0)+1),raw=SH.Save.slots?.()[slot],members=(g.s.party?.active||['kael']).map(x=>x==='kael'?'Kael':g.s.party?.members?.[x]?.name||x).join(', ');right.insertAdjacentHTML('beforeend',`<div class="jp-card sh-extra"><div class="jp-gold">PARTY</div><div class="jp-desc">${esc(members)}${raw?.savedAt?` · Last saved ${new Date(raw.savedAt).toLocaleString()}`:''}</div></div>`)}
    if(title?.endsWith('SHOP')){const list=SH.DATA.shops?.[g.shop?.type]||[],o=SH.DATA.items?.[list[g.shop?.index||0]]||SH.DATA.weapons?.[list[g.shop?.index||0]]||SH.DATA.armor?.[list[g.shop?.index||0]];if(o)right.insertAdjacentHTML('beforeend',`<div class="jp-card sh-extra"><div class="jp-gold">AFTER PURCHASE</div><div class="jp-desc">${Math.max(0,g.s.gold-(o.price||0))} Gold remaining</div></div>`)}
  }
  function decorate(){
    root.querySelectorAll('button').forEach(b=>{b.type='button';const t=b.textContent.trim().toUpperCase();if(t==='CLOSE')b.dataset.nav='close';else if(t.includes('BACK')||t.includes('LEAVE'))b.dataset.nav='back';b.setAttribute('aria-label',b.textContent.trim())});
    classic.querySelectorAll('button').forEach(b=>{b.type='button';b.setAttribute('aria-label',b.textContent.trim())});
    const screen=root.querySelector('.jp-screen');if(screen)screen.setAttribute('role','dialog');enrich();
  }
  new MutationObserver(decorate).observe(root,{childList:true,subtree:true});
  new MutationObserver(decorate).observe(classic,{childList:true,subtree:true});decorate();

  const ctx=canvas.getContext('2d'),oldDrawWorld=g.drawWorld.bind(g),TAU=Math.PI*2;
  g.drawWorld=function(){oldDrawWorld();if(this.mode!=='world'||this.menu||this.shop||this.dialog)return;const map=this.s?.map,t=performance.now()/1000;ctx.save();
    if(map==='town'||map==='ashwatch'){for(let i=0;i<7;i++){const x=(i*157+83)%940,y=95+(i%4)*86,a=.08+.05*Math.sin(t*1.3+i);ctx.fillStyle=`rgba(255,211,118,${a})`;ctx.beginPath();ctx.arc(x,y,10+3*Math.sin(t+i),0,TAU);ctx.fill()}}
    if(map==='world'||map==='eastRoad'){ctx.fillStyle=`rgba(25,34,69,${.035+.018*Math.sin(t*.35)})`;ctx.beginPath();ctx.ellipse((t*13%1200)-120,170,170,46,-.12,0,TAU);ctx.fill()}
    if(map==='starfallRuins'){for(let i=0;i<14;i++){const x=(i*73+31)%960,y=(i*47+Math.sin(t+i)*9)%500;ctx.globalAlpha=.2+.18*Math.sin(t*1.6+i);ctx.fillStyle=i%3?'#a8c8ff':'#ffe7a0';ctx.fillRect(x,y,2,2)}ctx.globalAlpha=1}
    if(map==='cave'||map==='starfallRuins'){const v=ctx.createRadialGradient(480,270,165,480,270,570);v.addColorStop(0,'rgba(2,4,15,0)');v.addColorStop(1,map==='cave'?'rgba(2,3,12,.32)':'rgba(5,6,20,.2)');ctx.fillStyle=v;ctx.fillRect(0,0,960,540)}ctx.restore();
  };
  window.SafeHavenPremium={version:1,decorate};
})();
