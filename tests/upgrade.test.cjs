'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict');
const {Engine,freshProgress,generateLevel}=require('../core.js'),Controls=require('../controls.js'),Store=require('../store.js');
function game(n=1){const g=new Engine({...freshProgress(),currentLevel:n,unlocked:n});g.start();g.world.spikes=[];g.world.saws=[];g.world.lasers=[];return g;}
function place(g,p){Object.assign(g.player,{x:p.x+p.w/2-12,y:p.y-32,vx:0,vy:0,grounded:true,platform:p.id,dead:false,inv:0});g.clearInput();}
test('dash requires active play, travels farther, recharges only in play and never refills lives',()=>{
 const g=game(),start=g.player.x;assert.equal(g.dash(),true);assert.equal(g.dash(),false);
 for(let i=0;i<7;i++)g.step();assert.ok(g.player.x-start>60);assert.equal(g.player.dashFrames,0);assert.equal(g.progress.lives,3);
 g.pause();const cooldown=g.player.dashCooldown;for(let i=0;i<100;i++)g.step();assert.equal(g.player.dashCooldown,cooldown);assert.equal(g.dash(),false);
 g.resume();place(g,g.world.platforms[0]);for(let i=0;i<cooldown;i++)g.step();assert.equal(g.player.dashCooldown,0);assert.equal(g.dash(),true);g.die();assert.equal(g.dash(),false);
});
test('dash never grants invulnerability and hits a thin active laser',()=>{
 const g=game();g.player.inv=0;g.world.lasers=[{x:g.player.x+30,y:-80,h:100,off:1,on:100,phase:2}];g.dash();g.step();assert.equal(g.player.dead,true);assert.equal(g.progress.lives,2);
});
test('ice slides, conveyor pushes and checkpoint surfaces remain stable',()=>{
 const g=game(11),ice=g.world.platforms.find(p=>p.surface==='ice');assert.ok(ice);place(g,ice);g.player.vx=3;g.step();assert.ok(g.player.vx>2.7);
 const h=game(21),belt=h.world.platforms.find(p=>p.surface==='belt');assert.ok(belt);place(h,belt);const x=h.player.x;h.step();assert.ok(Math.abs(h.player.x-x-belt.belt)<1e-8);
 for(let n=1;n<=100;n++)for(const p of generateLevel(n).platforms.filter(p=>p.checkpoint))assert.equal(p.surface,'stone');
});
test('moving ledges carry a standing player, freeze on pause and do not become checkpoints',()=>{
 const g=game(31),lift=g.world.lifts[0];assert.ok(lift);g.step();place(g,lift);const offset=g.player.x-lift.x;
 for(let i=0;i<20;i++){g.step();assert.equal(g.player.platform,lift.id);assert.ok(Math.abs(g.player.x-lift.x-offset)<1e-8);assert.equal(g.run.checkpoint,0);}
 g.pause();const snapshot=JSON.stringify([g.player,g.world.lifts,g.ticks]);for(let i=0;i<40;i++)g.step();assert.equal(JSON.stringify([g.player,g.world.lifts,g.ticks]),snapshot);
 g.respawn();assert.equal(g.player.platform,0);assert.equal(g.player.dashCooldown,0);
});
test('rebinding swaps occupied keys, preserves all actions, and rejects browser-only keys',()=>{
 const s=Controls.normalize(null);assert.equal(Controls.bind(s,'jump','KeyD'),true);assert.equal(s.bindings.jump,'KeyD');assert.equal(s.bindings.right,'Space');assert.equal(Controls.actionFor(s,'KeyD'),'jump');assert.equal(Controls.actionFor(s,'ArrowRight'),null);
 assert.equal(Controls.bind(s,'jump','Escape'),false);assert.equal(Controls.bind(s,'dash','F11'),false);assert.equal(Controls.bind(s,'fake','KeyX'),false);assert.deepEqual(Controls.normalize(s),s);
 assert.deepEqual(Controls.normalize({bindings:{...s.bindings,left:'KeyD'}}).bindings,Controls.defaults);assert.equal(Controls.normalize({volume:100}).volume,1);assert.equal(Controls.normalize({volume:NaN}).volume,.8);
});
test('gamepad uses rising edges, deadzone, menu repeat and reports disconnection',()=>{
 const p=new Controls.Pad(),pad={axes:[.1,0],buttons:Array.from({length:16},()=>({pressed:false}))};assert.equal(p.poll(pad,0).right,false);
 pad.axes[0]=.8;pad.buttons[0].pressed=true;let state=p.poll(pad,20);assert.equal(state.right,true);assert.equal(state.jump,true);assert.equal(state.navigate,'right');state=p.poll(pad,40);assert.equal(state.jump,false);assert.equal(state.navigate,'');assert.equal(p.poll(pad,400).navigate,'right');assert.equal(p.poll(null,420).disconnected,true);assert.equal(p.poll(null,450).disconnected,false);
});
test('offline $1 pack advertises exactly 10,000 coins without any granting or purchasing API',()=>{
 assert.deepEqual(Store.pack,{id:'hellrun_coins_10000',coins:10000,usdCents:100});assert.equal(Store.available,false);assert.equal(Store.status,'not_connected');assert.deepEqual(Object.keys(Store).sort(),['available','pack','status']);assert.ok(Object.isFrozen(Store)&&Object.isFrozen(Store.pack));
});
