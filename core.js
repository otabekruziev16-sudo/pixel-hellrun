'use strict';
(function(root){
 const Skins=typeof module!=='undefined'&&module.exports?require('./skins.js'):root.HellRunSkins;
 const TEST_WALLET=1000000000;
 const MAX_LEVEL=100, MAX_LIVES=3, LIFE_COST=5, STEP=1000/60;
 const clamp=(n,a,b)=>Math.min(b,Math.max(a,n));
 const int=(n,a,b,f=a)=>Number.isFinite(n)?clamp(Math.floor(n),a,b):f;
 function random(seed){let s=seed>>>0;return()=>{s+=0x6D2B79F5;let t=s;t=Math.imul(t^t>>>15,t|1);t^=t+Math.imul(t^t>>>7,t|61);return((t^t>>>14)>>>0)/4294967296;};}
 function difficulty(level){const tier=Math.floor((level-1)/10);return{tier,steps:12+tier,speed:4.15,jump:11.8,gravity:.55,width:72-tier*2,gap:86+tier*2.6,crumble:25-tier,laserOff:104-tier*4,laserOn:68+tier*4,sawSpeed:.029+tier*.003};}
 const CHAPTERS=['QIZIL DARVOZA','CHO‘G‘LI ZINALAR','SUKUT QAL’ASI','ARRALAR YO‘LI','KUL MINORASI','QONLI SOAT','QORA LABIRINT','ZULMAT QO‘RG‘ONI','DO‘ZAX TOMI','SO‘NGGI CHIQISH'];
 // Each route has its own jump rhythm: gap, rise, landing width. Chapters
 // rearrange the rhythm and tighten the ledges, instead of copying one stair.
 const ROUTES=[
  {name:'QIZIL ZINALAR',extra:0,jumps:[[96,44,76],[108,32,90],[64,74,64],[78,38,100],[112,26,72],[50,82,76]],hazards:['spike','saw','laser','spike','laser','saw'],crumble:[2,4]},
  {name:'TIK MINORA',extra:2,jumps:[[44,84,62],[54,76,70],[68,68,58],[100,24,108],[52,82,64],[80,52,78]],hazards:['laser','spike','saw','laser','saw','spike'],crumble:[1,4]},
  {name:'UZUN SAKRASH',extra:1,jumps:[[120,20,90],[112,32,110],[116,24,70],[88,48,112],[118,28,86],[70,68,72]],hazards:['saw','laser','spike','laser','spike','saw'],crumble:[2,5]},
  {name:'ARRALAR GALEREYASI',extra:2,jumps:[[78,58,124],[108,24,68],[60,78,94],[106,36,116],[58,72,66],[104,30,94]],hazards:['saw','saw','spike','laser','saw','spike'],crumble:[2,4]},
  {name:'QULAYDIGAN YO‘L',extra:1,jumps:[[64,62,60],[86,48,64],[104,30,62],[60,80,98],[114,24,70],[74,66,60]],hazards:['spike','laser','saw','spike','saw','laser'],crumble:[0,1,2,4,5]},
  {name:'JUFT ZINALAR',extra:2,jumps:[[104,26,106],[38,86,62],[112,22,100],[46,80,72],[98,36,88],[42,84,64]],hazards:['laser','saw','spike','saw','laser','spike'],crumble:[1,3]},
  {name:'BALAND SUPALAR',extra:0,jumps:[[78,64,140],[52,76,118],[110,24,144],[72,58,124],[98,38,138],[46,86,110]],hazards:['spike','saw','laser','saw','spike','laser'],crumble:[2,4]},
  {name:'LAZER DARVOZALARI',extra:1,jumps:[[106,36,88],[72,64,98],[116,20,72],[56,84,92],[100,42,82],[84,56,106]],hazards:['laser','laser','saw','spike','laser','saw'],crumble:[2,5]},
  {name:'IGNADAY ZINALAR',extra:2,jumps:[[72,68,50],[102,34,54],[52,84,52],[106,28,60],[64,74,48],[94,44,56]],hazards:['saw','spike','laser','spike','saw','laser'],crumble:[1,4]},
  {name:'ARALASH SINOV',extra:2,jumps:[[116,22,112],[48,86,56],[90,54,132],[106,32,62],[56,78,96],[112,26,52],[68,70,118]],hazards:['laser','spike','saw','saw','laser','spike','laser'],crumble:[1,3,5]}
 ];
 function generateLevel(level){
  level=int(level,1,100);const d=difficulty(level),rand=random(8171+level*9127);
  const routeIndex=(level-1)%ROUTES.length,route=ROUTES[routeIndex];d.steps+=route.extra;
  const platforms=[{id:0,x:0,y:0,w:176,h:22,checkpoint:true,crumble:false,load:0,broken:0}],coins=[],spikes=[],lasers=[],saws=[];
  let activeIndex=0;
  for(let i=1;i<=d.steps+1;i++){
   const prev=platforms[i-1],last=i===d.steps+1,checkpoint=!last&&i%4===0;
   const block=Math.floor((i-1)/4),motif=route.jumps[(i-1+d.tier*2+block*(1+d.tier%3))%route.jumps.length];
   const rise=clamp(motif[1]+Math.floor(rand()*9)-4,18,88);
   // Higher jumps allow less horizontal travel. Keep every ledge reachable
   // with the existing movement physics, including in the last chapter.
   const gap=Math.round(clamp(motif[0]+d.tier*.8+rand()*10-5,36,Math.min(126,154-rise*.7)));
   const width=clamp(motif[2]-d.tier*1.5+Math.floor(rand()*9)-4,44,146);
   const hazardIndex=(activeIndex+d.tier)%route.hazards.length;
   const pl={id:i,x:prev.x+prev.w+gap,y:prev.y-rise,w:last?164:checkpoint?122:width,h:last||checkpoint?22:16,checkpoint,crumble:!last&&!checkpoint&&route.crumble.includes(hazardIndex),load:0,broken:0};
   platforms.push(pl);
   if(!last&&!checkpoint){
    const hazard=route.hazards[hazardIndex],coinSide=[.27,.5,.73][(i+routeIndex+block)%3];
    coins.push({id:i,platformId:i,x:pl.x+pl.w*(hazard==='spike'?.3:coinSide),y:pl.y-(70+Math.floor(rand()*29)),r:7,got:false});
    if(hazard==='spike')spikes.push({x:pl.x+pl.w-14,y:pl.y-13,w:14,h:13});
    if(hazard==='saw')saws.push({x:pl.x+pl.w*.5,y:pl.y-62-Math.floor(rand()*19),r:13+d.tier*.35,range:36+Math.floor(rand()*29),phase:rand()*6.28,speed:d.sawSpeed*(.9+rand()*.2)});
    if(hazard==='laser')lasers.push({x:prev.x+prev.w+gap*(.38+rand()*.24),y:pl.y-140,h:rise+158,off:d.laserOff,on:d.laserOn,phase:Math.floor(rand()*(d.laserOff+d.laserOn))});
    activeIndex++;
   }
  }
  const last=platforms[platforms.length-1],lifts=[];
  for(const p of platforms){
   p.surface='stone';p.belt=0;
   if(p.id&&p!==last&&!p.checkpoint&&!p.crumble){
    if([1,6,9].includes(d.tier)&&p.id%3!==0)p.surface='ice';
    if([2,5,8,9].includes(d.tier)&&p.id%3===0){p.surface='belt';p.belt=p.id%2?.55:-.55;}
   }
   // Optional ferries travel below the original route. Main ledge IDs and
   // required coins stay stable, preserving every earlier campaign save.
   if(d.tier>=3&&p.id>0&&p.id%4===2){
    const prev=platforms[p.id-1],gap=p.x-prev.x-prev.w;
    if(gap>=65)lifts.push({id:-2-lifts.length,x:prev.x+prev.w+8,y:prev.y+25,w:48,h:10,baseX:prev.x+prev.w+8,range:Math.max(8,gap-50),phase:p.id*.7,speed:.025+d.tier*.001,surface:'lift',checkpoint:false});
   }
  }
  return{level,theme:d.tier,layout:routeIndex,title:route.name,chapter:CHAPTERS[d.tier],d,platforms,lifts,coins,spikes,lasers,saws,entry:{x:12,y:-59,w:36,h:59},exit:{x:last.x+last.w-56,y:last.y-60,w:36,h:60},timeLimit:d.steps*3+24,right:last.x+last.w+110,top:last.y-180};
 }
 function freshProgress(){return{version:4,currentLevel:1,unlocked:1,completed:[],totalDeaths:0,lives:MAX_LIVES,wallet:0,ownedSkins:['default'],equippedSkin:'default',runs:{}};}
 function normalizeProgress(raw){
  if(!raw||![2,3,4].includes(raw.version))return freshProgress();
  const p=freshProgress();p.unlocked=int(raw.unlocked,1,100);p.currentLevel=int(raw.currentLevel,1,p.unlocked);p.totalDeaths=int(raw.totalDeaths,0,1000000);
  p.completed=Array.isArray(raw.completed)?[...new Set(raw.completed.filter(n=>Number.isInteger(n)&&n>=1&&n<=p.unlocked))]:[];
  if(raw.runs&&typeof raw.runs==='object')for(let n=1;n<=p.unlocked;n++){
   const r=raw.runs[n];if(!r||typeof r!=='object')continue;
   p.runs[n]={checkpoint:int(r.checkpoint,0,24),collected:Array.isArray(r.collected)?[...new Set(r.collected.filter(x=>Number.isInteger(x)&&x>=1&&x<=24))]:[],deaths:int(r.deaths,0,1000000),remaining:int(r.remaining,1,1000,80)};
  }
  if(raw.version===2){
   // Credit coins from the previous release once. Version 3 stores the spent
   // wallet explicitly; a reload must never refund a purchased life.
   for(const [n,run] of Object.entries(p.runs)){const coins=generateLevel(+n).coins;p.wallet+=run.collected.filter(id=>coins.some(c=>c.id===id)).length;}
  }else{p.lives=int(raw.lives,0,MAX_LIVES,MAX_LIVES);p.wallet=int(raw.wallet,0,2000000000);}
  if(raw.version===4){
   p.ownedSkins=[...new Set(['default',...(Array.isArray(raw.ownedSkins)?raw.ownedSkins.map(id=>Skins.migrateId(id)).filter(Boolean):[])])];
   const equipped=Skins.migrateId(raw.equippedSkin);p.equippedSkin=p.ownedSkins.includes(equipped)?equipped:'default';
  }
  return p;
 }
 function rect(a,b){return a.x<b.x+b.w&&a.x+a.w>b.x&&a.y<b.y+b.h&&a.y+a.h>b.y;}
 function circleRect(c,p){const x=clamp(c.x,p.x,p.x+p.w),y=clamp(c.y,p.y,p.y+p.h);return(x-c.x)**2+(y-c.y)**2<c.r*c.r;}
 class Engine{
  constructor(progress,onEvent=()=>{},options={}){this.testMod=options.testMod===true;this.progress=normalizeProgress(progress);this.applyTestMod();this.onEvent=onEvent;this.input={left:false,right:false};this.ticks=0;this.state='menu';this.jumpBuffer=0;this.coyote=0;this.load(this.progress.currentLevel);}
  applyTestMod(){if(this.testMod){this.progress.unlocked=MAX_LEVEL;this.progress.wallet=TEST_WALLET;}}
  emit(name,data){this.onEvent(name,data);}
  load(n){
   this.level=n;this.world=generateLevel(n);const old=this.progress.runs[n];
   this.run=old||{checkpoint:0,collected:[],deaths:0,remaining:this.world.timeLimit};
   if(!this.world.platforms.some(p=>p.id===this.run.checkpoint&&p.checkpoint))this.run.checkpoint=0;
   this.run.collected=this.run.collected.filter(id=>this.world.coins.some(c=>c.id===id));
   while(this.run.checkpoint>0&&this.world.coins.some(c=>c.id<this.run.checkpoint&&!this.run.collected.includes(c.id)))this.run.checkpoint-=4;
   for(const c of this.world.coins)c.got=this.run.collected.includes(c.id);
   this.progress.runs[n]=this.run;this.timer=clamp(this.run.remaining,1,this.world.timeLimit);this.deathFrames=0;this.resetPlayer();
  }
  resetPlayer(){
   const pl=this.world.platforms[this.run.checkpoint];
   this.player={x:pl.x+pl.w/2-12,y:pl.y-32,w:24,h:32,vx:0,vy:0,grounded:true,platform:pl.id,dead:false,inv:20,dir:1,dashFrames:0,dashCooldown:0,landing:0};
   this.jumpBuffer=0;this.coyote=5;this.stepClock=0;this.input.left=false;this.input.right=false;
   for(const p of this.world.platforms){p.load=0;p.broken=0;}
  }
  start(n=this.progress.currentLevel){if(!Number.isInteger(n)||n<1||n>this.progress.unlocked)return false;this.load(n);this.progress.currentLevel=n;this.state=this.progress.lives>0?'playing':'gameover';this.save();this.emit(this.state==='playing'?'start':'gameover');return true;}
  save(){this.applyTestMod();this.run.remaining=Math.ceil(this.timer);this.run.collected=this.world.coins.filter(c=>c.got).map(c=>c.id);this.progress.runs[this.level]=this.run;this.emit('save',this.progress);}
  jump(){if(this.state==='playing'&&!this.player.dead)this.jumpBuffer=7;}
  dash(){
   const p=this.player;if(this.state!=='playing'||p.dead||p.dashCooldown>0)return false;
   p.dir=this.input.left&&!this.input.right?-1:this.input.right&&!this.input.left?1:p.dir;
   p.dashDir=p.dir;p.dashFrames=7;p.dashCooldown=90;this.emit('dash');return true;
  }
  pause(){if(this.state!=='playing')return false;this.state='paused';this.clearInput();this.save();this.emit('pause');return true;}
  resume(){if(this.state!=='paused')return false;if(this.progress.lives===0){this.state='gameover';this.emit('gameover');return false;}this.state='playing';this.clearInput();return true;}
  clearInput(){this.input.left=false;this.input.right=false;this.jumpBuffer=0;}
  die(reason='tuzoq'){
   if(this.state!=='playing'||this.player.dead)return;
   this.player.dead=true;this.player.vx=0;this.player.dashFrames=0;this.deathFrames=38;this.run.deaths++;this.progress.totalDeaths++;this.progress.lives=Math.max(0,this.progress.lives-1);this.clearInput();this.save();this.emit('death',reason);
  }
  respawn(){this.resetPlayer();const left=this.world.d.steps-this.run.checkpoint;this.timer=Math.max(this.timer,Math.min(this.world.timeLimit,left*4+24));this.save();this.emit('respawn');}
  buyLife(){
   if(this.state!=='gameover'||this.progress.lives!==0||(!this.testMod&&this.progress.wallet<LIFE_COST))return false;
   if(!this.testMod)this.progress.wallet-=LIFE_COST;this.progress.lives=1;this.state='playing';this.respawn();this.emit('revive');return true;
  }
  retryLevel(){
   if(this.state!=='gameover')return false;
   this.progress.lives=MAX_LIVES;
   this.progress.runs[this.level]={checkpoint:0,collected:[],deaths:this.run.deaths,remaining:this.world.timeLimit};
   this.load(this.level);this.state='playing';this.save();this.emit('start');return true;
  }
  buySkin(id){
   const skin=Skins.get(id),p=this.progress;
   if(this.state==='playing'||!skin||p.ownedSkins.includes(id)||(!this.testMod&&p.wallet<skin.price))return false;
   // Price comes from the fixed catalog. Save ownership and debit together.
   if(!this.testMod)p.wallet-=skin.price;p.ownedSkins.push(id);p.equippedSkin=id;this.save();this.emit('skinBought',skin);return true;
  }
  equipSkin(id){
   if(this.state==='playing'||!Skins.get(id)||!this.progress.ownedSkins.includes(id))return false;
   this.progress.equippedSkin=id;this.save();this.emit('skinEquipped',Skins.get(id));return true;
  }
  finish(){
   if(this.state!=='playing'||this.world.coins.some(c=>!c.got))return false;
   this.state='complete';this.clearInput();const p=this.progress;
   if(!p.completed.includes(this.level))p.completed.push(this.level);
   p.unlocked=Math.max(p.unlocked,Math.min(100,this.level+1));p.currentLevel=Math.min(100,this.level+1);p.lives=MAX_LIVES;this.save();this.emit(this.level===100?'win':'complete');return true;
  }
  laserState(l){const phase=(this.ticks+l.phase)%(l.off+l.on);return{active:phase>=l.off,warning:phase>=l.off-25&&phase<l.off,phase};}
  sawPosition(s){return{x:s.x+Math.sin(this.ticks*s.speed+s.phase)*s.range,y:s.y,r:s.r};}
  step(){
   if(this.state!=='playing')return;
   this.ticks++;const p=this.player,w=this.world,d=w.d;
   if(p.dead){if(--this.deathFrames<=0){if(this.progress.lives>0)this.respawn();else{this.state='gameover';this.clearInput();this.save();this.emit('gameover');}}return;}
   this.timer=Math.max(0,this.timer-1/60);if(this.timer<=0){this.die('vaqt');return;}
   if(p.inv>0)p.inv--;
   if(p.dashCooldown>0)p.dashCooldown--;if(p.landing>0)p.landing--;
   const support=p.grounded?(p.platform>=0?w.platforms[p.platform]:w.lifts.find(l=>l.id===p.platform)):null;
   for(const lift of w.lifts){const oldX=lift.x;lift.x=lift.baseX+(1+Math.sin(this.ticks*lift.speed+lift.phase))*lift.range/2;if(p.grounded&&p.platform===lift.id)p.x+=lift.x-oldX;}
   for(const pl of w.platforms)if(pl.broken>0&&--pl.broken===0)pl.load=0;
   const direction=Number(this.input.right)-Number(this.input.left);
   if(p.dashFrames>0){p.dashFrames--;p.vx=p.dashDir*9.2;}
   else if(direction){p.vx=direction*d.speed;p.dir=direction;}else{p.vx*=support?.surface==='ice'?.93:.62;if(Math.abs(p.vx)<.03)p.vx=0;}
   if(support?.belt)p.x+=support.belt;
   if(p.grounded)this.coyote=5;else if(this.coyote>0)this.coyote--;
   if(this.jumpBuffer>0&&this.coyote>0){p.vy=-d.jump;p.grounded=false;this.coyote=0;this.jumpBuffer=0;this.emit('jump');}else if(this.jumpBuffer>0)this.jumpBuffer--;
   const oldBottom=p.y+p.h,wasGrounded=p.grounded;
   p.vy=Math.min(17,p.vy+d.gravity);p.x=clamp(p.x+p.vx,-35,w.right-p.w);p.y+=p.vy;p.grounded=false;p.platform=-1;
   for(const pl of [...w.platforms,...w.lifts]){
    if(!pl.broken&&p.vy>=0&&oldBottom<=pl.y+1&&p.y+p.h>=pl.y&&p.x+p.w>pl.x+1&&p.x<pl.x+pl.w-1){p.y=pl.y-p.h;p.vy=0;p.grounded=true;p.platform=pl.id;}
   }
   if(p.grounded){
    const pl=p.platform>=0?w.platforms[p.platform]:w.lifts.find(l=>l.id===p.platform);
    if(!wasGrounded){p.landing=7;this.emit('land');}
    if(Math.abs(p.vx)>.5&&++this.stepClock>=11){this.stepClock=0;this.emit('step');}
    if(pl.crumble&&++pl.load>=d.crumble){pl.broken=110;pl.load=0;this.emit('crumble');}
    if(pl.checkpoint&&pl.id>this.run.checkpoint&&w.coins.filter(c=>c.id<pl.id).every(c=>c.got)){
     this.run.checkpoint=pl.id;this.timer=Math.max(this.timer,(d.steps-pl.id)*3+20);this.save();this.emit('checkpoint',pl.id);
    }
   }else this.stepClock=0;
   for(const c of w.coins)if(!c.got&&circleRect(c,p)){c.got=true;if(!this.testMod)this.progress.wallet=Math.min(2000000000,this.progress.wallet+1);this.save();this.emit('coin',c);if(w.coins.every(c=>c.got))this.emit('door');}
   const hitbox={x:p.x+3,y:p.y+3,w:p.w-6,h:p.h-4};
   if(p.inv<=0){
    for(const s of w.spikes)if(rect(hitbox,{x:s.x+3,y:s.y+3,w:s.w-6,h:s.h-3})){this.die('tikan');return;}
    for(const s of w.saws)if(circleRect(this.sawPosition(s),hitbox)){this.die('arra');return;}
    for(const l of w.lasers)if(this.laserState(l).active&&rect(hitbox,{x:l.x-3,y:l.y,w:6,h:l.h})){this.die('lazer');return;}
   }
   if(p.y+p.h>w.platforms[this.run.checkpoint].y+210){this.die('lava');return;}
   if(w.coins.every(c=>c.got)&&rect(p,w.exit))this.finish();
  }
 }
 const api={TEST_WALLET,MAX_LEVEL,MAX_LIVES,LIFE_COST,STEP,Engine,generateLevel,difficulty,normalizeProgress,freshProgress,CHAPTERS,clamp,rect,circleRect};
 if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.HellRunCore=api;
})(typeof globalThis!=='undefined'?globalThis:this);
