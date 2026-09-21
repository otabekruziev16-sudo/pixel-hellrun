'use strict';
(function(root){
 const defaults=Object.freeze({left:'KeyA',right:'KeyD',jump:'Space',dash:'ShiftLeft',pause:'KeyP'});
 const valid=code=>typeof code==='string'&&/^(Key[A-Z]|Digit[0-9]|Space|ShiftLeft|ShiftRight|ControlLeft|ControlRight|ArrowLeft|ArrowRight|ArrowUp|ArrowDown)$/.test(code);
 function normalize(raw){
  const bindings={...defaults},used=new Set();
  // A corrupt or duplicate map is replaced as a whole to keep every action usable.
  if(raw?.bindings&&Object.keys(defaults).every(a=>valid(raw.bindings[a])&&!used.has(raw.bindings[a])&&used.add(raw.bindings[a])))Object.assign(bindings,raw.bindings);
  return{volume:Number.isFinite(raw?.volume)?Math.max(0,Math.min(1,raw.volume)):.8,motion:raw?.motion!==false,bindings};
 }
 function bind(settings,action,code){
  if(!Object.hasOwn(defaults,action)||!valid(code))return false;
  const other=Object.keys(defaults).find(a=>settings.bindings[a]===code);
  if(other&&other!==action)settings.bindings[other]=settings.bindings[action];
  settings.bindings[action]=code;return true;
 }
 function actionFor(settings,code){
  const action=Object.keys(defaults).find(a=>settings.bindings[a]===code);if(action)return action;
  // Arrow aliases are available only when that action still has its default key.
  const alias={ArrowLeft:'left',ArrowRight:'right',ArrowUp:'jump',KeyW:'jump',ShiftRight:'dash'}[code];
  return alias&&settings.bindings[alias]===defaults[alias]?alias:null;
 }
 class Pad {
  constructor(){this.previous=[];this.direction='';this.nextRepeat=0;this.connected=false;}
  poll(pad,now){
   const b=i=>Boolean(pad?.buttons?.[i]?.pressed),stick=pad?.axes||[];
   const pressed=Array.from({length:16},(_,i)=>b(i)),edge=i=>pressed[i]&&!this.previous[i];
   const left=b(14)||(stick[0]||0)<-.35,right=b(15)||(stick[0]||0)>.35;
   const direction=b(12)||(stick[1]||0)<-.5?'up':b(13)||(stick[1]||0)>.5?'down':left?'left':right?'right':'';
   const navigate=direction&&(direction!==this.direction||now>=this.nextRepeat)?direction:'';
   if(navigate)this.nextRepeat=now+(direction!==this.direction?350:130);
   const result={left,right,jump:edge(0),dash:edge(2),pause:edge(9),back:edge(1),navigate,disconnected:this.connected&&!pad};
   this.connected=Boolean(pad);this.previous=pressed;this.direction=direction;return result;
  }
 }
 const api={defaults,normalize,bind,actionFor,Pad};
 if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.HellRunControls=api;
})(typeof globalThis!=='undefined'?globalThis:this);
