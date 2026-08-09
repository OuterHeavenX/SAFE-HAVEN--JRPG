'use strict';
(()=>{
  const g=window.__safehavenGame,checks=[];
  const test=(name,fn)=>{try{checks.push({name,ok:!!fn()})}catch(error){checks.push({name,ok:false,error:String(error)})}};
  test('premium presentation loaded',()=>!!window.SafeHavenPremium&&!!document.getElementById('safehaven-premium-polish'));
  test('single polished root owner',()=>document.querySelectorAll('#jrpg-polish').length===1&&document.querySelectorAll('#direct-touch-ui').length===1&&document.querySelectorAll('#classic-ui').length===1);
  test('root navigation contract',()=>['Items','Equipment','Status','Jobs','Quests','Bestiary','Save','Settings','Close'].length===9&&typeof g.menuInput==='function');
  test('menu close handler present',()=>typeof g.menuInput==='function'&&typeof g.input==='function');
  test('submenu back handler present',()=>typeof g.menuInput==='function');
  test('touch gesture guard loaded',()=>!!document.getElementById('jrpg-ui-touch-gesture-v1'));
  test('battle hud mounts',()=>!!document.getElementById('jp-battlehud')&&!!document.getElementById('direct-touch-ui'));
  test('save schema unchanged',()=>SH.Save?.key==='safehaven.jrpg.v1'&&SH.Save?.version===2);
  window.SafeHavenPremiumDiagnostics={checks,passed:checks.filter(x=>x.ok).length,failed:checks.filter(x=>!x.ok).length,runAt:Date.now()};
  if(checks.some(x=>!x.ok))console.warn('SafeHaven premium UI diagnostics',window.SafeHavenPremiumDiagnostics);else console.info(`SafeHaven premium UI diagnostics: ${checks.length}/${checks.length} passed`);
})();
