'use strict';
(()=>{
 const checks=[];const test=(name,fn)=>{try{checks.push({name,ok:!!fn()})}catch(error){checks.push({name,ok:false,error:String(error)})}};
 test('chapter2 map eastRoad',()=>!!SH.MAPS?.eastRoad&&SH.MAPS.eastRoad.encounters==='east');
 test('chapter2 map ashwatch',()=>!!SH.MAPS?.ashwatch&&SH.MAPS.ashwatch.safe===true);
 test('chapter2 map starfallRuins',()=>!!SH.MAPS?.starfallRuins&&SH.MAPS.starfallRuins.encounters==='ruins');
 test('chapter2 enemy roster',()=>['duskHound','thornling','ruinWisp','starSentinel','voidMoth','riftStag','astralWarden'].every(id=>!!SH.DATA?.enemies?.[id]));
 test('astral warden isolated from Stoneback boss flag',()=>SH.DATA.enemies.astralWarden.chapterBoss===true&&!SH.DATA.enemies.astralWarden.boss);
 test('chapter2 encounters valid',()=>['east','ruins'].every(k=>(SH.ENCOUNTERS?.[k]||[]).flat().every(id=>!!SH.DATA.enemies[id])));
 test('chapter2 rewards valid',()=>!!SH.DATA.weapons?.starforgedEdge&&!!SH.DATA.armor?.wardCharm&&!!SH.DATA.items?.starSigil);
 test('chapter2 abilities registered',()=>['quickStep','bladeRush','blizzara','thundara','regen'].every(id=>!!SH.Classic?.abilities?.[id]));
 test('party architecture present',()=>!!SH.Classic&&typeof SH.Battle==='function');
 window.SafeHavenChapter2Diagnostics={checks,passed:checks.filter(x=>x.ok).length,failed:checks.filter(x=>!x.ok).length,runAt:Date.now()};
 if(checks.some(x=>!x.ok))console.warn('SafeHaven Chapter 2 diagnostics',window.SafeHavenChapter2Diagnostics);else console.info(`SafeHaven Chapter 2 diagnostics: ${checks.length}/${checks.length} passed`);
})();