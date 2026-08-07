'use strict';
(()=>{
  const xhr=new XMLHttpRequest();
  xhr.open('GET','src/game.js?v=20260807-0050',false);
  xhr.send(null);
  if(xhr.status<200||xhr.status>=300)throw new Error('Unable to load game core: '+xhr.status);
  const source=xhr.responseText.replace(/new Game\(\);\s*\}\)\(\);?\s*$/,'window.__safehavenGame=new Game();\n})();');
  (0,eval)(source+'\n//# sourceURL=src/game.js');
  if(!window.__safehavenGame)throw new Error('SafeHaven game instance was not exposed.');
})();