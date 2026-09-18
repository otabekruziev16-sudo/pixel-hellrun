'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict'),vm=require('node:vm'),fs=require('node:fs'),path=require('node:path');
const source=fs.readFileSync(path.join(__dirname,'../game.js'),'utf8');
function game(){
 const elements=new Map(),hearts=Array.from({length:3},()=>({style:{}}));
 function element(id){return {id,style:{},textContent:'',disabled:false,classList:{add(){},remove(){}},setAttribute(){},addEventListener(){},setPointerCapture(){},replaceChildren(){},append(){},getContext(){return new Proxy({},{get:()=>()=>{},set:()=>true});}};}
 const document={hidden:false,getElementById(id){if(!elements.has(id))elements.set(id,element(id));return elements.get(id);},createElement:element,querySelectorAll(s){return s==='.heart'?hearts:[];},addEventListener(){}};
 const sandbox={document,console,HTMLButtonElement:class{},localStorage:{getItem(){return null;},setItem(){}},requestAnimationFrame(){},window:{addEventListener(){}}};
 vm.createContext(sandbox);vm.runInContext(source,sandbox);
 const run=code=>vm.runInContext(code,sandbox);
 run('startGame(); Sound.play=(event)=>{(globalThis.sounds??=[]).push(event)}');
 return run;
}
function safe(run){run('enemies=[];spikes=[];lasers=[];fallingBlocks=[];plats=[];coins=[{x:1500,y:20,r:8,got:false,bt:0}];P.inv=0');}
test('laser collision matches visible world position after camera scroll',()=>{
 const run=game();safe(run);
 run('P.x=1000;camX=840;lasers=[{x:1006,timer:239,period:240,onDur:50}];update()');
 assert.equal(run('P.dead'),true);assert.equal(run('lives'),2);
 const other=game();safe(other);
 other('P.x=1000;camX=160;lasers=[{x:1160,timer:239,period:240,onDur:50}];update()');
 assert.equal(other('P.dead'),false);
});
test('timeout costs one life, then respawns with a usable timer',()=>{
 const run=game();safe(run);run('timer=0;update();for(let i=0;i<51;i++)update()');
 assert.equal(run('lives'),2);assert.equal(run('P.dead'),false);assert.ok(run('timer')>50);
 assert.equal(run('sounds.filter(s=>s==="death").length'),1);
});
test('last life ends game without late respawn or stale game-over callbacks',()=>{
 const run=game();safe(run);run('lives=1;die();for(let i=0;i<150;i++)update()');
 assert.equal(run('over'),true);assert.equal(run('active'),false);assert.equal(run('lives'),0);
 run('startGame();for(let i=0;i<120;i++)update()');assert.equal(run('lives'),3);assert.equal(run('over'),false);
});
test('pause freezes movement and timer, and clears held controls',()=>{
 const run=game();safe(run);run('keys.add("right");update();pauseGame()');
 const before=run('JSON.stringify([P.x,timer])');run('for(let i=0;i<120;i++)update()');
 assert.equal(run('JSON.stringify([P.x,timer])'),before);assert.equal(run('keys.size'),0);
 run('resumeGame();update()');assert.equal(run('paused'),false);assert.ok(run('timer')<60);
});
test('winning level 100 never displays level 101',()=>{
 const run=game();safe(run);run('level=100;coins=[{x:P.x+13,y:P.y+15,r:8,got:false,bt:0}];update()');
 assert.equal(run('level'),100);assert.equal(run('over'),true);assert.ok(run('sounds.includes("win")'));
});
test('all generated platforms and coins are within reachable bounds',()=>{
 const run=game();
 for(let lvl=1;lvl<=100;lvl++)for(let sample=0;sample<4;sample++){
  run('level='+lvl+';generateLevel(level)');
  assert.equal(run('coins.length'),run('difficulty(level).coinCount'));
  assert.equal(run('plats.every(pl=>GY-pl.y < difficulty(level).jump**2/(2*difficulty(level).gravity)*.8)'),true);
  assert.equal(run('coins.every(c=>c.x>=0&&c.x<worldLen-8)'),true);
  assert.equal(run('spikes.every(s=>coins.filter(c=>c.y===GY-22).every(c=>Math.abs(c.x-s.x-12)>=44))'),true);
 }
});
test('60, 120 and 240 Hz renderers advance movement and time consistently',()=>{
 const results=[];
 for(const hz of [60,120,240]){
  const run=game();safe(run);
  run('keys.add("right");lt=null;accumulator=0');
  for(let i=0;i<=hz;i++)run('loop('+i*1000/hz+')');
  results.push([run('P.x'),run('timer')]);
 }
 for(const row of results){assert.ok(Math.abs(row[0]-results[0][0])<3);assert.ok(Math.abs(row[1]-results[0][1])<.018);}
});
test('falling blocks reset and can fall again after impact',()=>{
 const run=game();safe(run);
 run('P.x=290;P.inv=9999;fallingBlocks=[{x:350,y:-40,w:40,h:14,vy:0,reset:true,rest:0,cooldown:0}]');
 let cooldownSeen=false,secondFall=false;
 for(let i=0;i<360;i++){run('update()');if(run('fallingBlocks[0].cooldown')>0)cooldownSeen=true;if(cooldownSeen&&run('!fallingBlocks[0].reset&&fallingBlocks[0].vy>0'))secondFall=true;}
 assert.ok(cooldownSeen);assert.ok(secondFall);
});
test('start, walk, jump and death dispatch their sound effects',()=>{
 const run=game();safe(run);run('startGame();enemies=[];spikes=[];lasers=[];fallingBlocks=[];P.inv=999;keys.add("right");for(let i=0;i<14;i++)update();jumpBuffer=8;update();die()');
 assert.ok(run('sounds.includes("step")'));assert.ok(run('sounds.includes("jump")'));assert.ok(run('sounds.includes("death")'));
});
