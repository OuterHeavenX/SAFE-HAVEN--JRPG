'use strict';
(()=>{
  if(!window.SH||!SH.DATA||!SH.MAPS)return;
  Object.assign(SH.DATA.items,{
    starSigil:{name:'Star Sigil',type:'key',price:0,desc:'A cold metal seal engraved with the same star-mark as the Fragment.'},
    duskPetal:{name:'Dusk Petal',type:'material',price:22,desc:'A violet flower that only opens near old star-stone.'},
    ether:{name:'Ether',type:'consumable',price:140,desc:'Restores 30 MP.',mpHeal:30}
  });
  Object.assign(SH.DATA.weapons,{
    ashwatchBlade:{name:'Ashwatch Blade',slot:'weapon',price:460,atk:22,agi:1,desc:'A lean frontier sword balanced for quick counters.'},
    starforgedEdge:{name:'Starforged Edge',slot:'weapon',price:0,atk:30,magic:3,element:'holy',desc:'A recovered ruin-blade that hums near the Ancient Star Fragment.'}
  });
  Object.assign(SH.DATA.armor,{
    scoutMantle:{name:'Scout Mantle',slot:'body',price:390,def:11,agi:2,desc:'Light Ashwatch armor made for long patrols.'},
    wardCharm:{name:'Ward Charm',slot:'accessory',price:0,def:2,resistances:['dark'],desc:'A charm cut from blue ruin-stone.'}
  });
  Object.assign(SH.DATA.enemies,{
    duskHound:{name:'Dusk Hound',hp:96,str:16,def:6,agi:14,xp:34,jp:7,gold:[16,24],weaknesses:['ice'],resistances:['dark'],color:'#5d536f',locations:['Eastwind Road'],lore:'Lean predators altered by the strange light beyond Eldenbrook.'},
    thornling:{name:'Thornling',hp:112,str:15,def:9,agi:8,xp:38,jp:8,gold:[18,27],weaknesses:['fire'],resistances:['lightning'],color:'#557447',drop:['duskPetal',.22],locations:['Eastwind Road','Ashwatch Verge'],lore:'A walking knot of root and briar animated by seepage from the ruins.'},
    ruinWisp:{name:'Ruin Wisp',hp:78,str:13,def:5,agi:17,xp:42,jp:10,gold:[20,30],weaknesses:['dark'],resistances:['holy'],color:'#8bc8d2',locations:['Starfall Ruins'],lore:'A pale remnant of energy drifting through the buried halls.'},
    starSentinel:{name:'Star Sentinel',hp:148,str:21,def:14,agi:7,xp:58,jp:12,gold:[28,40],weaknesses:['lightning'],resistances:['physical'],color:'#8794a4',locations:['Starfall Ruins'],lore:'An ancient guardian whose stone shell still obeys a forgotten command.'},
    voidMoth:{name:'Void Moth',hp:88,str:17,def:5,agi:18,xp:46,jp:10,gold:[21,32],weaknesses:['fire'],resistances:['dark'],color:'#755f8d',locations:['Starfall Ruins'],lore:'A huge moth dusted with shadow-like pollen.'},
    riftStag:{name:'Rift Stag',hp:310,str:24,def:12,agi:13,xp:150,jp:35,gold:[90,120],weaknesses:['fire'],resistances:['ice'],color:'#6d8190',chapterMiniBoss:true,locations:['Eastwind Road'],lore:'A magnificent beast twisted by a tear in the old road.'},
    astralWarden:{name:'ASTRAL WARDEN',hp:720,str:27,def:17,agi:10,xp:420,jp:120,gold:[260,260],weaknesses:['dark'],resistances:['holy','physical'],color:'#70849a',chapterBoss:true,locations:['Starfall Ruins'],lore:'The final guardian of the Starfall seal, awakened by Kael’s Fragment.'}
  });
  SH.DATA.shops.ashwatch=['potion','hiPotion','antidote','ether','ashwatchBlade','scoutMantle'];
  Object.assign(SH.DATA.quests,{
    chapter2:{name:'Beyond Eldenbrook',text:'Follow the eastern road to Ashwatch and investigate the Starfall disturbances.'},
    duskPetals:{name:'Petals in the Gloom',text:'Bring three Dusk Petals to Sera at Ashwatch.'}
  });
  SH.ENCOUNTERS.east=[['duskHound'],['thornling'],['duskHound','thornling'],['duskHound','duskHound']];
  SH.ENCOUNTERS.ruins=[['ruinWisp','ruinWisp'],['starSentinel'],['voidMoth','ruinWisp'],['starSentinel','ruinWisp']];
  SH.MAPS.eastRoad={name:'Eastwind Road',w:58,h:32,bg:'#497046',safe:false,encounters:'east',warps:[{x:1,y:14,w:2,h:4,to:'town',tx:42,ty:14},{x:55,y:13,w:2,h:5,to:'ashwatch',tx:2,ty:13},{x:35,y:2,w:5,h:2,to:'starfallRuins',tx:4,ty:25}],objects:[{x:10,y:15,label:'SIGN',text:'ASHWATCH — EAST   ELDENBROOK — WEST'},{x:26,y:9,label:'SPARKLE',chapterSecret:'road-cache'},{x:41,y:19,label:'RIFT STAG',npc:'riftStag'}]};
  SH.MAPS.ashwatch={name:'Ashwatch Outpost',w:40,h:26,bg:'#52764c',safe:true,warps:[{x:1,y:12,w:2,h:4,to:'eastRoad',tx:54,ty:14},{x:18,y:1,w:4,h:2,to:'starfallRuins',tx:20,ty:25}],objects:[{x:20,y:7,label:'LYRA',npc:'lyra'},{x:11,y:12,label:'QUARTERMASTER',shop:'ashwatch'},{x:29,y:13,label:'INN',inn:true},{x:8,y:18,label:'SERA',npc:'sera'},{x:32,y:7,label:'WATCH CAPTAIN',npc:'ashCaptain'},{x:4,y:21,label:'CHEST',chest:'ashwatchChest',item:'ether'}]};
  SH.MAPS.starfallRuins={name:'Starfall Ruins',w:44,h:28,bg:'#313746',safe:false,encounters:'ruins',warps:[{x:2,y:24,w:3,h:3,to:'eastRoad',tx:37,ty:3},{x:18,y:26,w:5,h:2,to:'ashwatch',tx:20,ty:2}],objects:[{x:8,y:20,label:'CHEST',chest:'ruinChest1',item:'wardCharm'},{x:16,y:13,label:'SAVE CRYSTAL',npc:'savepoint'},{x:27,y:9,label:'CHEST',chest:'ruinChest2',item:'starforgedEdge'},{x:36,y:5,label:'ASTRAL WARDEN',npc:'astralWarden'}]};
})();