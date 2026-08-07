'use strict';
SH.Save = {
 key:'safehaven.jrpg.v1', version:1,
 slots(){try{return JSON.parse(localStorage.getItem(this.key)||'{}')}catch{return {}}},
 write(slot,state){const all=this.slots();all[slot]={saveVersion:this.version,savedAt:Date.now(),state:JSON.parse(JSON.stringify(state))};localStorage.setItem(this.key,JSON.stringify(all));return true},
 read(slot){const s=this.slots()[slot];return s?JSON.parse(JSON.stringify(s.state)):null},
 autosave(state){return this.write('auto',state)},
 hasAny(){return Object.keys(this.slots()).length>0},
 summaries(){const all=this.slots();return ['auto','1','2','3'].map(k=>{const s=all[k];if(!s)return {slot:k,empty:true};const p=s.state.player;return {slot:k,empty:false,name:p.name,level:p.level,where:s.state.map,playtime:s.state.playtime||0}})}
};