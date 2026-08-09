'use strict';
(()=>{
 const g=window.__safehavenGame;if(!g)return;
 let ac=null,master=null,unlocked=false,tick=0,lastScene='',lastBattleMessage='',lastVictory=false;
 const midi=n=>440*Math.pow(2,(n-69)/12);
 const themes={
  town:{tempo:88,lead:[64,67,71,67,62,67,71,74,64,67,72,71,62,66,69,67],bass:[48,null,48,null,45,null,45,null,41,null,41,null,43,null,43,null]},
  world:{tempo:104,lead:[57,60,64,62,57,60,65,64,55,59,62,60,53,57,60,59],bass:[41,null,41,null,38,null,38,null,36,null,36,null,40,null,40,null]},
  cave:{tempo:82,lead:[52,null,55,58,51,null,55,57,48,null,52,55,50,null,53,57],bass:[36,null,null,36,34,null,null,34,31,null,null,31,33,null,null,33]},
  battle:{tempo:148,lead:[64,67,71,76,74,71,67,69,64,69,72,76,74,72,69,67],bass:[40,40,43,43,36,36,38,38,40,40,43,43,45,45,38,38]}
 };
 function ensure(){if(ac)return true;const C=window.AudioContext||window.webkitAudioContext;if(!C)return false;ac=new C();master=ac.createGain();master.gain.value=.055;master.connect(ac.destination);return true;}
 function unlock(){if(!ensure())return;if(ac.state==='suspended')ac.resume();unlocked=true;}
 addEventListener('pointerdown',unlock,{once:false,capture:true});addEventListener('keydown',unlock,{once:false,capture:true});
 function tone(freq,dur=.12,type='triangle',vol=.3,when=0){if(!unlocked||!ac||ac.state!=='running')return;const o=ac.createOscillator(),v=ac.createGain(),t=ac.currentTime+when;o.type=type;o.frequency.setValueAtTime(freq,t);v.gain.setValueAtTime(0,t);v.gain.linearRampToValueAtTime(vol,t+.012);v.gain.exponentialRampToValueAtTime(.001,t+dur);o.connect(v);v.connect(master);o.start(t);o.stop(t+dur+.03);}
 function noise(dur=.08,vol=.12){if(!unlocked||!ac||ac.state!=='running')return;const len=Math.max(1,Math.floor(ac.sampleRate*dur)),buf=ac.createBuffer(1,len,ac.sampleRate),d=buf.getChannelData(0);for(let i=0;i<len;i++)d[i]=(Math.random()*2-1)*(1-i/len);const s=ac.createBufferSource(),v=ac.createGain();s.buffer=buf;v.gain.value=vol;s.connect(v);v.connect(master);s.start();}
 function scene(){if(g.mode==='battle')return'battle';if(g.mode!=='world')return'town';if(['town','home','ashwatch'].includes(g.s?.map))return'town';if(['cave','starfallRuins'].includes(g.s?.map))return'cave';return'world';}
 function step(){if(!unlocked)return;const sc=scene(),th=themes[sc];if(sc!==lastScene){lastScene=sc;tick=0;if(sc==='battle'){tone(midi(52),.22,'square',.42);tone(midi(59),.26,'square',.28,.06);}else tone(midi(th.lead[0]),.18,'triangle',.22);}
 const i=tick%th.lead.length,n=th.lead[i],b=th.bass[i];if(n!=null)tone(midi(n),sc==='battle'?.12:.2,sc==='battle'?'square':'triangle',sc==='battle'?.24:.17);if(b!=null)tone(midi(b),sc==='battle'?.15:.25,'sine',sc==='battle'?.22:.15);if(sc==='battle'&&i%2===0)noise(.035,.055);tick++;}
 let timer=null;function restartTimer(){if(timer)clearInterval(timer);const th=themes[scene()];timer=setInterval(step,60000/th.tempo/2);}
 setInterval(()=>{const sc=scene();if(sc!==lastScene)restartTimer();const m=g.battle?.message||'';if(m&&m!==lastBattleMessage){lastBattleMessage=m;if(/CRITICAL/i.test(m)){tone(midi(84),.16,'square',.42);noise(.06,.12);}else if(/hits|attacks for|strikes/i.test(m)){tone(midi(43),.09,'sawtooth',.22);noise(.045,.09);}else if(/restores|heal/i.test(m)){tone(midi(72),.14,'sine',.24);tone(midi(76),.18,'sine',.18,.05);}else if(/READY/i.test(m)){tone(midi(76),.08,'triangle',.18);}}
 const v=!!window.SHClassicVictory;if(v&&!lastVictory){tone(midi(60),.16,'square',.25);tone(midi(64),.2,'square',.25,.08);tone(midi(67),.28,'square',.28,.16);}lastVictory=v;
 },100);
 document.addEventListener('pointerdown',e=>{if(!unlocked)return;const b=e.target?.closest?.('button');if(!b)return;tone(midi(/BACK|CANCEL|NO|FLEE/i.test(b.textContent||'')?52:72),.055,'square',.12);},true);
 window.SafeHavenAudio={unlock,setVolume:v=>{if(master)master.gain.value=Math.max(0,Math.min(.15,Number(v)||0));}};
 restartTimer();
})();