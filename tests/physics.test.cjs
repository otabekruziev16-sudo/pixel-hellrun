'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict');
const {Engine,generateLevel,difficulty,freshProgress,normalizeProgress,STEP,MAX_LIVES,LIFE_COST}=require('../core.js');
function game(n=1){const p=freshProgress();p.unlocked=n;p.currentLevel=n;const g=new Engine(p);g.start(n);return g;}
function clearHazards(g){g.world.spikes=[];g.world.saws=[];g.world.lasers=[];}
function place(g,pl){Object.assign(g.player,{x:pl.x+pl.w/2-12,y:pl.y-32,vx:0,vy:0,grounded:true,platform:pl.id,dead:false,inv:0});g.clearInput();}
test('all 100 deterministic staircases have distinct entrances, gated exits and harder hazards',()=>{
 for(let n=1;n<=100;n++){
  const w=generateLevel(n);assert.deepEqual(w,generateLevel(n));assert.ok(w.exit.x>w.entry.x+1500);assert.ok(w.exit.y<w.entry.y-400);
  assert.ok(w.saws.length>=1&&w.lasers.length>=1&&w.spikes.length>=1);
  assert.equal(w.saws.length+w.lasers.length+w.spikes.length,w.coins.length);
  assert.ok(w.coins.every(c=>c.y<w.platforms[c.platformId].y-65));
  assert.ok(w.platforms.every((p,i)=>!i||p.y<w.platforms[i-1].y));
 }
 assert.ok(difficulty(100).width<difficulty(1).width);assert.ok(difficulty(100).laserOff<difficulty(1).laserOff);
});
test('adjacent levels change the actual opening geometry, not only their number or small random offsets',()=>{
 const opening=w=>w.platforms.slice(1,7).map((p,i)=>[p.x-w.platforms[i].x-w.platforms[i].w,w.platforms[i].y-p.y,p.w]);
 const signatures=new Set();
 for(let n=1;n<=100;n++){
  const w=generateLevel(n);signatures.add(JSON.stringify(w.platforms.map(p=>[p.x,p.y,p.w,p.crumble])));
  if(n>1){const previous=opening(generateLevel(n-1)),current=opening(w);const changed=current.filter((jump,i)=>jump.reduce((sum,v,j)=>sum+Math.abs(v-previous[i][j]),0)>=35).length;assert.ok(changed>=3,`similar opening ${n-1} → ${n}`);}
 }
 assert.equal(signatures.size,100);
 const a=generateLevel(1),b=generateLevel(2);
 assert.ok(b.platforms[1].x-a.platforms[1].x<-35);
 assert.ok(a.platforms[1].y-b.platforms[1].y>30);
 assert.notEqual(a.title,b.title);
});
test('2.0 campaign saves keep their unlocked level, checkpoint and coins in the new layouts',()=>{
 for(let n=1;n<=100;n++){
  const checkpoint=Math.floor((12+Math.floor((n-1)/10))/4)*4;
  const collected=Array.from({length:checkpoint-1},(_,i)=>i+1).filter(i=>i%4!==0);
  const p={version:2,currentLevel:n,unlocked:n,completed:[],totalDeaths:11,runs:{[n]:{checkpoint,collected,deaths:11,remaining:50}}};
  const g=new Engine(p);g.start();
  assert.equal(g.level,n);assert.equal(g.progress.unlocked,n);assert.equal(g.run.checkpoint,checkpoint);assert.equal(g.player.platform,checkpoint);assert.equal(g.run.deaths,11);
  assert.deepEqual(g.world.coins.filter(c=>c.got).map(c=>c.id),collected);
 }
});
test('every stair-to-stair jump is physically reachable across all 100 levels',()=>{
 for(let n=1;n<=100;n++){
  const g=game(n);clearHazards(g);
  for(let i=1;i<g.world.platforms.length;i++){
   const a=g.world.platforms[i-1],b=g.world.platforms[i];place(g,a);g.player.x=a.x+a.w-g.player.w-2;g.jump();let landed=false;
   for(let t=0;t<62;t++){g.input.right=g.player.x+12<b.x+b.w*.5-5;g.step();if(g.player.grounded&&g.player.platform===b.id){landed=true;break;}if(g.player.dead)break;}
   assert.ok(landed,`unreachable jump ${n}:${i}`);g.timer=g.world.timeLimit;
  }
 }
});
test('every elevated coin can be collected by jumping from its own platform',()=>{
 for(let n=1;n<=100;n++){
  const g=game(n);clearHazards(g);
  for(const c of g.world.coins){const pl=g.world.platforms[c.platformId];place(g,pl);g.player.x=c.x-12;g.jump();for(let i=0;i<43&&!c.got;i++)g.step();assert.ok(c.got,`coin ${n}:${c.id}`);g.timer=g.world.timeLimit;}
 }
});
test('many deaths and full process reload retain level, checkpoint and collected coins',()=>{
 const g=game(37),cp=g.world.platforms[4];for(const c of g.world.coins)if(c.id<4)c.got=true;place(g,cp);g.step();assert.equal(g.run.checkpoint,4);
 const collected=g.world.coins.filter(c=>c.got).map(c=>c.id);
 g.progress.wallet=40;
 for(let i=0;i<8;i++){g.die();for(let t=0;t<39;t++)g.step();if(g.state==='gameover')assert.equal(g.buyLife(),true);assert.equal(g.player.dead,false);assert.equal(g.level,37);assert.equal(g.player.platform,4);}
 const restored=new Engine(JSON.parse(JSON.stringify(g.progress)));restored.start();assert.equal(restored.level,37);assert.equal(restored.run.deaths,8);assert.equal(restored.player.platform,4);assert.deepEqual(restored.world.coins.filter(c=>c.got).map(c=>c.id),collected);
});
test('checkpoint never strands uncollected coins behind rising lava',()=>{
 const g=game();place(g,g.world.platforms[4]);g.step();assert.equal(g.run.checkpoint,0);
 for(const c of g.world.coins)if(c.id<4)c.got=true;g.step();assert.equal(g.run.checkpoint,4);
});
test('coins alone do not advance a level, and the exit refuses missing coins',()=>{
 const g=game();clearHazards(g);place(g,g.world.platforms.at(-1));g.player.x=g.world.exit.x;g.step();assert.equal(g.state,'playing');
 for(const c of g.world.coins)c.got=true;place(g,g.world.platforms[0]);g.step();assert.equal(g.state,'playing');
 place(g,g.world.platforms.at(-1));g.player.x=g.world.exit.x;g.step();assert.equal(g.state,'complete');assert.equal(g.progress.unlocked,2);assert.equal(g.progress.currentLevel,2);
});
test('final exit completes level 100 without ever creating level 101',()=>{
 const g=game(100);clearHazards(g);for(const c of g.world.coins)c.got=true;place(g,g.world.platforms.at(-1));g.player.x=g.world.exit.x;g.step();assert.equal(g.state,'complete');assert.equal(g.level,100);assert.equal(g.progress.currentLevel,100);assert.equal(g.progress.unlocked,100);assert.ok(g.progress.completed.includes(100));assert.equal(g.start(101),false);
});
test('pause freezes hazards, physics and countdown; timeout causes only one death',()=>{
 const g=game();g.input.right=true;g.pause();const snapshot=JSON.stringify([g.player,g.ticks,g.timer]);for(let i=0;i<120;i++)g.step();assert.equal(JSON.stringify([g.player,g.ticks,g.timer]),snapshot);assert.equal(g.input.right,false);g.resume();g.timer=0;g.step();for(let t=0;t<40;t++)g.step();assert.equal(g.run.deaths,1);assert.ok(g.timer>10);assert.equal(g.player.dead,false);
});
test('crumbling stairs collapse then reset, while checkpoint stones remain solid',()=>{
 const g=game();clearHazards(g);const pl=g.world.platforms[3];place(g,pl);for(let t=0;t<g.world.d.crumble+1;t++)g.step();assert.ok(pl.broken>0);g.respawn();assert.equal(pl.broken,0);assert.equal(g.world.platforms[4].crumble,false);
});
test('laser hit detection uses world coordinates and warning phase remains harmless',()=>{
 const g=game();clearHazards(g);const pl=g.world.platforms[8];place(g,pl);g.world.lasers=[{x:g.player.x+12,y:g.player.y-20,h:100,off:100,on:70,phase:99}];g.step();assert.equal(g.player.dead,true);
 const other=game();clearHazards(other);other.world.lasers=[{x:other.player.x+12,y:-80,h:100,off:100,on:70,phase:75}];other.player.inv=0;other.step();assert.equal(other.player.dead,false);
});
test('save parser repairs invalid data without unlocking inaccessible levels',()=>{
 assert.deepEqual(normalizeProgress(null),freshProgress());const p=normalizeProgress({version:2,currentLevel:500,unlocked:2,totalDeaths:-5,runs:{2:{checkpoint:999,collected:['x',500,-1],deaths:NaN}}});assert.equal(p.currentLevel,2);assert.equal(p.totalDeaths,0);const g=new Engine(p);g.start();assert.equal(g.run.checkpoint,0);assert.deepEqual(g.run.collected,[]);assert.equal(g.start(3),false);
});
test('60, 120 and 240 Hz render scheduling yields the same physics',()=>{
 const results=[];for(const hz of [60,120,240]){const g=game();clearHazards(g);g.world.platforms=[{id:0,x:-100,y:0,w:1200,h:20,checkpoint:true}];g.input.right=true;let accumulator=0,last=0;for(let i=1;i<=hz;i++){const t=i*1000/hz;accumulator+=t-last;last=t;while(accumulator>=STEP){g.step();accumulator-=STEP;}}results.push([g.player.x,g.timer]);}
 for(const [x,t] of results){assert.ok(Math.abs(x-results[0][0])<4.2);assert.ok(Math.abs(t-results[0][1])<.018);}
});
test('three deaths exhaust exactly three lives and reloading or selecting a level cannot refill them',()=>{
 const g=game(7);assert.equal(g.progress.lives,MAX_LIVES);
 for(let life=2;life>=0;life--){g.die();g.die();assert.equal(g.progress.lives,life);for(let t=0;t<39;t++)g.step();}
 assert.equal(g.run.deaths,3);assert.equal(g.state,'gameover');
 const before=[g.player.x,g.player.y,g.timer,g.ticks];for(let t=0;t<120;t++)g.step();assert.deepEqual([g.player.x,g.player.y,g.timer,g.ticks],before);
 const restored=new Engine(JSON.parse(JSON.stringify(g.progress)));restored.start();assert.equal(restored.state,'gameover');assert.equal(restored.progress.lives,0);restored.start(1);assert.equal(restored.state,'gameover');
});
test('each pickup funds the wallet once and a reload does not award it again',()=>{
 const g=game();clearHazards(g);const c=g.world.coins[0];Object.assign(g.player,{x:c.x-12,y:c.y-16,vy:0,grounded:false});g.step();assert.equal(c.got,true);assert.equal(g.progress.wallet,1);
 for(let t=0;t<5;t++)g.step();assert.equal(g.progress.wallet,1);
 const restored=new Engine(JSON.parse(JSON.stringify(g.progress)));restored.start();assert.equal(restored.progress.wallet,1);assert.equal(restored.world.coins[0].got,true);
});
test('buying a life debits once, restores the checkpoint and preserves all collected exit coins',()=>{
 const g=game(17);for(const c of g.world.coins)if(c.id<4)c.got=true;place(g,g.world.platforms[4]);g.step();g.progress.wallet=7;
 const coins=g.world.coins.filter(c=>c.got).map(c=>c.id);
 for(let i=0;i<3;i++){g.die();for(let t=0;t<39;t++)g.step();}
 assert.equal(g.buyLife(),true);assert.equal(g.buyLife(),false);assert.equal(g.progress.wallet,7-LIFE_COST);assert.equal(g.progress.lives,1);assert.equal(g.player.platform,4);assert.equal(g.level,17);assert.equal(g.state,'playing');
 assert.deepEqual(g.world.coins.filter(c=>c.got).map(c=>c.id),coins);
 const restored=new Engine(JSON.parse(JSON.stringify(g.progress)));restored.start();assert.equal(restored.progress.wallet,2);assert.equal(restored.progress.lives,1);assert.equal(restored.player.platform,4);
});
test('insufficient funds cannot buy life; free retry resets only this level and permits earning again',()=>{
 const g=game(17);clearHazards(g);g.progress.completed=[1,2];g.progress.wallet=4;for(const c of g.world.coins)if(c.id<4)c.got=true;place(g,g.world.platforms[4]);g.step();
 for(let i=0;i<3;i++){g.die();for(let t=0;t<39;t++)g.step();}
 const before=JSON.stringify(g.progress);assert.equal(g.buyLife(),false);assert.equal(JSON.stringify(g.progress),before);
 assert.equal(g.retryLevel(),true);assert.equal(g.level,17);assert.equal(g.progress.unlocked,17);assert.deepEqual(g.progress.completed,[1,2]);assert.equal(g.progress.wallet,4);assert.equal(g.progress.lives,3);assert.equal(g.run.checkpoint,0);assert.equal(g.world.coins.filter(c=>c.got).length,0);assert.equal(g.run.deaths,3);
 clearHazards(g);const c=g.world.coins[0];Object.assign(g.player,{x:c.x-12,y:c.y-16,vy:0,grounded:false});g.step();assert.equal(g.progress.wallet,5);
});
test('old saves receive their collected coins once and spent wallets stay empty after upgrade',()=>{
 const old={version:2,currentLevel:7,unlocked:7,totalDeaths:9,completed:[1],runs:{1:{checkpoint:4,collected:[1,2,3],deaths:3,remaining:50},7:{checkpoint:4,collected:[1,2,3,5,6],deaths:6,remaining:40}}};
 const g=new Engine(old);assert.equal(g.progress.version,4);assert.equal(g.progress.wallet,8);assert.equal(g.progress.lives,3);assert.equal(g.progress.currentLevel,7);assert.deepEqual(g.progress.completed,[1]);
 g.progress.wallet=0;g.progress.lives=0;const restored=new Engine(JSON.parse(JSON.stringify(g.progress)));assert.equal(restored.progress.wallet,0);assert.equal(restored.progress.lives,0);assert.equal(restored.run.checkpoint,4);
});
test('completing a level refills three lives without charging the wallet or changing collected coins',()=>{
 const g=game();clearHazards(g);g.progress.wallet=2;g.progress.lives=1;for(const c of g.world.coins)c.got=true;place(g,g.world.platforms.at(-1));g.player.x=g.world.exit.x;g.step();assert.equal(g.state,'complete');assert.equal(g.progress.lives,3);assert.equal(g.progress.wallet,2);g.start(2);assert.equal(g.progress.lives,3);
});
