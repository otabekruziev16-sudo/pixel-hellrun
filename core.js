'use strict';
(function(root){
 const MAX_LEVEL=100, STEP=1000/60;
 const clamp=(n,a,b)=>Math.min(b,Math.max(a,n));
 const int=(n,a,b,f=a)=>Number.isFinite(n)?clamp(Math.floor(n),a,b):f;
 function random(seed){let s=seed>>>0;return()=>{s+=0x6D2B79F5;let t=s;t=Math.imul(t^t>>>15,t|1);t^=t+Math.imul(t^t>>>7,t|61);return((t^t>>>14)>>>0)/4294967296;};}
 function difficulty(level){const tier=Math.floor((level-1)/10);return{tier,steps:12+tier,speed:4.15,jump:11.8,gravity:.55,width:72-tier*2,gap:86+tier*2.6,crumble:25-tier,laserOff:104-tier*4,laserOn:68+tier*4,sawSpeed:.029+tier*.003};}
 const CHAPTERS=['QIZIL DARVOZA','CHO‘G‘LI ZINALAR','SUKUT QAL’ASI','ARRALAR YO‘LI','KUL MINORASI','QONLI SOAT','QORA LABIRINT','ZULMAT QO‘RG‘ONI','DO‘ZAX TOMI','SO‘NGGI CHIQISH'];
 function generateLevel(level){
  level=int(level,1,100);const d=difficulty(level),rand=random(8171+level*9127);
  const platforms=[{id:0,x:0,y:0,w:176,h:22,checkpoint:true,crumble:false,load:0,broken:0}],coins=[],spikes=[],lasers=[],saws=[];
  for(let i=1;i<=d.steps+1;i++){
   const prev=platforms[i-1],last=i===d.steps+1,checkpoint=!last&&i%4===0;
   const pl={id:i,x:Math.round(prev.x+prev.w+d.gap+rand()*18),y:prev.y-(40+Math.floor(rand()*20)),w:last?164:checkpoint?122:d.width-Math.floor(rand()*7),h:last||checkpoint?22:16,checkpoint,crumble:!last&&!checkpoint&&i%4===3,load:0,broken:0};
   platforms.push(pl);
   if(!last&&!checkpoint){
    coins.push({id:i,platformId:i,x:pl.x+pl.w*.42,y:pl.y-(i%4===2?86:70+rand()*12),r:7,got:false});
    if(i%4===1)spikes.push({x:pl.x+pl.w-14,y:pl.y-13,w:14,h:13});
    if(i%4===2)saws.push({x:pl.x+pl.w*.5,y:pl.y-69,r:13+d.tier*.35,range:48,phase:rand()*6.28,speed:d.sawSpeed});
    if(i%4===3)lasers.push({x:(prev.x+prev.w+pl.x)/2,y:pl.y-140,h:prev.y-pl.y+158,off:d.laserOff,on:d.laserOn,phase:Math.floor(rand()*150)});
   }
  }
  const last=platforms[platforms.length-1];
  return{level,theme:d.tier,title:CHAPTERS[d.tier],d,platforms,coins,spikes,lasers,saws,entry:{x:12,y:-59,w:36,h:59},exit:{x:last.x+last.w-56,y:last.y-60,w:36,h:60},timeLimit:d.steps*3+24,right:last.x+last.w+110,top:last.y-180};
 }
 function freshProgress(){return{version:2,currentLevel:1,unlocked:1,completed:[],totalDeaths:0,runs:{}};}
 function normalizeProgress(raw){
  if(!raw||raw.version!==2)return freshProgress();
  const p=freshProgress();p.unlocked=int(raw.unlocked,1,100);p.currentLevel=int(raw.currentLevel,1,p.unlocked);p.totalDeaths=int(raw.totalDeaths,0,1000000);
  p.completed=Array.isArray(raw.completed)?[...new Set(raw.completed.filter(n=>Number.isInteger(n)&&n>=1&&n<=p.unlocked))]:[];
  if(raw.runs&&typeof raw.runs==='object')for(let n=1;n<=p.unlocked;n++){
   const r=raw.runs[n];if(!r||typeof r!=='object')continue;
   p.runs[n]={checkpoint:int(r.checkpoint,0,24),collected:Array.isArray(r.collected)?[...new Set(r.collected.filter(x=>Number.isInteger(x)&&x>=1&&x<=24))]:[],deaths:int(r.deaths,0,1000000),remaining:int(r.remaining,1,1000,80)};
  }
  return p;
 }
 function rect(a,b){return a.x<b.x+b.w&&a.x+a.w>b.x&&a.y<b.y+b.h&&a.y+a.h>b.y;}
 function circleRect(c,p){const x=clamp(c.x,p.x,p.x+p.w),y=clamp(c.y,p.y,p.y+p.h);return(x-c.x)**2+(y-c.y)**2<c.r*c.r;}
 class Engine{
  constructor(progress,onEvent=()=>{}){this.progress=normalizeProgress(progress);this.onEvent=onEvent;this.input={left:false,right:false};this.ticks=0;this.state='menu';this.jumpBuffer=0;this.coyote=0;this.load(this.progress.currentLevel);}
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
   this.player={x:pl.x+pl.w/2-12,y:pl.y-32,w:24,h:32,vx:0,vy:0,grounded:true,platform:pl.id,dead:false,inv:20,dir:1};
   this.jumpBuffer=0;this.coyote=5;this.stepClock=0;this.input.left=false;this.input.right=false;
   for(const p of this.world.platforms){p.load=0;p.broken=0;}
  }
  start(n=this.progress.currentLevel){if(!Number.isInteger(n)||n<1||n>this.progress.unlocked)return false;this.load(n);this.progress.currentLevel=n;this.state='playing';this.save();this.emit('start');return true;}
  save(){this.run.remaining=Math.ceil(this.timer);this.run.collected=this.world.coins.filter(c=>c.got).map(c=>c.id);this.progress.runs[this.level]=this.run;this.emit('save',this.progress);}
  jump(){if(this.state==='playing'&&!this.player.dead)this.jumpBuffer=7;}
  pause(){if(this.state!=='playing')return false;this.state='paused';this.clearInput();this.save();this.emit('pause');return true;}
  resume(){if(this.state!=='paused')return false;this.state='playing';this.clearInput();return true;}
  clearInput(){this.input.left=false;this.input.right=false;this.jumpBuffer=0;}
  die(reason='tuzoq'){
   if(this.state!=='playing'||this.player.dead)return;
   this.player.dead=true;this.player.vx=0;this.deathFrames=38;this.run.deaths++;this.progress.totalDeaths++;this.clearInput();this.save();this.emit('death',reason);
  }
  respawn(){this.resetPlayer();const left=this.world.d.steps-this.run.checkpoint;this.timer=Math.max(this.timer,Math.min(this.world.timeLimit,left*4+24));this.save();this.emit('respawn');}
  finish(){
   if(this.state!=='playing'||this.world.coins.some(c=>!c.got))return false;
   this.state='complete';this.clearInput();const p=this.progress;
   if(!p.completed.includes(this.level))p.completed.push(this.level);
   p.unlocked=Math.max(p.unlocked,Math.min(100,this.level+1));p.currentLevel=Math.min(100,this.level+1);this.save();this.emit(this.level===100?'win':'complete');return true;
  }
  laserState(l){const phase=(this.ticks+l.phase)%(l.off+l.on);return{active:phase>=l.off,warning:phase>=l.off-25&&phase<l.off,phase};}
  sawPosition(s){return{x:s.x+Math.sin(this.ticks*s.speed+s.phase)*s.range,y:s.y,r:s.r};}
  step(){
   if(this.state!=='playing')return;
   this.ticks++;const p=this.player,w=this.world,d=w.d;
   if(p.dead){if(--this.deathFrames<=0)this.respawn();return;}
   this.timer=Math.max(0,this.timer-1/60);if(this.timer<=0){this.die('vaqt');return;}
   if(p.inv>0)p.inv--;
   for(const pl of w.platforms)if(pl.broken>0&&--pl.broken===0)pl.load=0;
   const direction=Number(this.input.right)-Number(this.input.left);
   if(direction){p.vx=direction*d.speed;p.dir=direction;}else{p.vx*=.62;if(Math.abs(p.vx)<.03)p.vx=0;}
   if(p.grounded)this.coyote=5;else if(this.coyote>0)this.coyote--;
   if(this.jumpBuffer>0&&this.coyote>0){p.vy=-d.jump;p.grounded=false;this.coyote=0;this.jumpBuffer=0;this.emit('jump');}else if(this.jumpBuffer>0)this.jumpBuffer--;
   const oldBottom=p.y+p.h,wasGrounded=p.grounded;
   p.vy=Math.min(17,p.vy+d.gravity);p.x=clamp(p.x+p.vx,-35,w.right-p.w);p.y+=p.vy;p.grounded=false;p.platform=-1;
   for(const pl of w.platforms){
    if(!pl.broken&&p.vy>=0&&oldBottom<=pl.y+1&&p.y+p.h>=pl.y&&p.x+p.w>pl.x+1&&p.x<pl.x+pl.w-1){p.y=pl.y-p.h;p.vy=0;p.grounded=true;p.platform=pl.id;}
   }
   if(p.grounded){
    const pl=w.platforms[p.platform];
    if(!wasGrounded)this.emit('land');
    if(Math.abs(p.vx)>.5&&++this.stepClock>=11){this.stepClock=0;this.emit('step');}
    if(pl.crumble&&++pl.load>=d.crumble){pl.broken=110;pl.load=0;this.emit('crumble');}
    if(pl.checkpoint&&pl.id>this.run.checkpoint&&w.coins.filter(c=>c.id<pl.id).every(c=>c.got)){
     this.run.checkpoint=pl.id;this.timer=Math.max(this.timer,(d.steps-pl.id)*3+20);this.save();this.emit('checkpoint',pl.id);
    }
   }else this.stepClock=0;
   for(const c of w.coins)if(!c.got&&circleRect(c,p)){c.got=true;this.save();this.emit('coin',c);if(w.coins.every(c=>c.got))this.emit('door');}
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
 const api={MAX_LEVEL,STEP,Engine,generateLevel,difficulty,normalizeProgress,freshProgress,CHAPTERS,clamp,rect,circleRect};
 if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.HellRunCore=api;
})(typeof globalThis!=='undefined'?globalThis:this);
