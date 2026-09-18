'use strict';
const cv=document.getElementById('c'),ctx=cv.getContext('2d');
const W=680,H=340,GY=H-52,STEP=1000/60;
let score=0,lives=3,level=1,timer=60,active=false,over=false,paused=false;
let camX=0,worldLen=2000,checkpointX=80,levelTime=60;
let particles=[],coins=[],plats=[],enemies=[],spikes=[],fallingBlocks=[],lasers=[];
let jumpBuffer=0,coyote=0,stepClock=0,flashTicks=0,simTicks=0;
let lt=null,accumulator=0;
const keys=new Set(),pointers=new Map();
const P={x:80,y:GY-34,w:26,h:34,vx:0,vy:0,og:true,dir:1,fr:0,ft:0,dead:false,dt:0,inv:0};
const $=id=>document.getElementById(id);
const Sound={
  context:null,master:null,noiseBuffer:null,muted:false,supported:true,
  async unlock(){
    try{
      if(!this.context){
        const AC=window.AudioContext||window.webkitAudioContext;
        if(!AC){this.supported=false;this.updateButton();return;}
        this.context=new AC();this.master=this.context.createGain();
        this.master.gain.value=this.muted?0:0.42;this.master.connect(this.context.destination);
        this.noiseBuffer=this.context.createBuffer(1,this.context.sampleRate*.18,this.context.sampleRate);
        const data=this.noiseBuffer.getChannelData(0);
        for(let i=0;i<data.length;i++)data[i]=(Math.random()*2-1)*(1-i/data.length);
      }
      if(this.context.state==='suspended')await this.context.resume();
    }catch{this.supported=false;this.updateButton();}
  },
  updateButton(){
    $('soundBtn').textContent=this.supported?'OVOZ: '+(this.muted?'OFF':'ON'):'OVOZ: —';
    $('soundBtn').setAttribute('aria-pressed',String(this.muted));
    $('soundBtn').setAttribute('aria-label',this.muted?'Ovozni yoqish':'Ovozni o‘chirish');
  },
  toggle(){
    this.muted=!this.muted;
    try{localStorage.setItem('hellrun-muted',String(this.muted));}catch{}
    if(this.master)this.master.gain.setTargetAtTime(this.muted?0:.42,this.context.currentTime,.02);
    this.updateButton();this.unlock();
  },
  tone(freq,end,duration,volume=.16,type='triangle',delay=0){
    const ac=this.context;if(!ac||ac.state!=='running'||this.muted)return;
    const start=ac.currentTime+delay,o=ac.createOscillator(),g=ac.createGain();
    o.type=type;o.frequency.setValueAtTime(freq,start);
    o.frequency.exponentialRampToValueAtTime(Math.max(20,end),start+duration);
    g.gain.setValueAtTime(.0001,start);g.gain.exponentialRampToValueAtTime(volume,start+.008);
    g.gain.exponentialRampToValueAtTime(.0001,start+duration);
    o.connect(g);g.connect(this.master);o.start(start);o.stop(start+duration+.01);
    o.onended=()=>{o.disconnect();g.disconnect();};
  },
  noise(volume=.09,duration=.08){
    const ac=this.context;if(!ac||ac.state!=='running'||this.muted)return;
    const source=ac.createBufferSource(),filter=ac.createBiquadFilter(),gain=ac.createGain();
    source.buffer=this.noiseBuffer;filter.type='lowpass';filter.frequency.value=620;
    gain.gain.setValueAtTime(volume,ac.currentTime);
    gain.gain.exponentialRampToValueAtTime(.0001,ac.currentTime+duration);
    source.connect(filter);filter.connect(gain);gain.connect(this.master);
    source.start();source.stop(ac.currentTime+duration);
    source.onended=()=>{source.disconnect();filter.disconnect();gain.disconnect();};
  },
  play(event){
    switch(event){
      case 'start':[196,261.63,329.63,392].forEach((f,i)=>this.tone(f,f,.16,.14,'square',i*.11));break;
      case 'step':this.noise(.09,.055);this.tone(100,65,.055,.09);break;
      case 'jump':this.tone(190,560,.16,.13,'square');break;
      case 'land':this.noise(.11,.075);break;
      case 'coin':this.tone(880,1320,.12,.13,'square');this.tone(1320,1760,.12,.1,'triangle',.08);break;
      case 'death':this.tone(330,45,.5,.22,'sawtooth');this.noise(.22,.16);break;
      case 'stomp':this.tone(130,60,.13,.18,'square');break;
      case 'level':[392,494,587,784].forEach((f,i)=>this.tone(f,f,.18,.15,'square',i*.1));break;
      case 'win':[523,659,784,1047,784,1047].forEach((f,i)=>this.tone(f,f,.25,.15,'square',i*.15));break;
      case 'pause':this.tone(300,200,.08,.09);break;
    }
  }
};
try{Sound.muted=localStorage.getItem('hellrun-muted')==='true';}catch{}
Sound.updateButton();
function rnd(a,b){return a+Math.random()*(b-a);}
function ri(a,b){return Math.floor(rnd(a,b));}
function difficulty(lvl){
  return{spd:Math.min(4.5,2.8+lvl*.04),jump:Math.min(13,10+lvl*.04),
    gravity:Math.min(.72,.52+lvl*.003),enemySpd:Math.min(4,1+lvl*.035),
    laserFreq:Math.max(60,240-lvl*2),fallFreq:Math.max(40,200-lvl*2),
    timeLimit:Math.max(20,60-Math.floor(lvl/3)),coinCount:Math.max(4,10-Math.floor(lvl/10))};
}
function hud(){
  $('sV').textContent=score;$('lV').textContent=level+' / 100';
  $('cV').textContent=coins.filter(c=>c.got).length+' / '+coins.length;
  $('tV').textContent=Math.max(0,Math.ceil(timer));
  document.querySelectorAll('.heart').forEach((h,i)=>h.style.opacity=i<lives?'1':'.16');
}
function clearInput(){
  keys.clear();pointers.clear();jumpBuffer=0;
  document.querySelectorAll('.cb').forEach(el=>el.classList.remove('held'));
}
function pressed(action){return keys.has(action)||Array.from(pointers.values()).includes(action);}
function resetPlayer(x){
  Object.assign(P,{x,y:GY-P.h,vx:0,vy:0,og:true,dir:1,fr:0,ft:0,dead:false,dt:0,inv:90});
  coyote=6;jumpBuffer=0;stepClock=0;
}
function generateLevel(lvl){
  const D=difficulty(lvl);
  coins=[];plats=[];enemies=[];spikes=[];fallingBlocks=[];lasers=[];particles=[];
  worldLen=1800+lvl*200;camX=0;checkpointX=80;resetPlayer(80);
  let placed=0,lastX=300;
  // Every platform is reachable from the continuous floor.
  const maxRise=Math.floor((D.jump*D.jump/(2*D.gravity))*.76);
  while(lastX<worldLen-100){
    const gap=lvl<5?120:lvl<20?ri(100,200):ri(120,280);
    const pw=Math.min(lvl<10?ri(80,130):ri(60,110),worldLen-lastX-20),py=GY-ri(50,maxRise+1);
    plats.push({x:lastX,y:py,w:pw,h:12});
    if(placed<D.coinCount&&Math.random()<.7){
      coins.push({x:lastX+ri(12,pw-12),y:py-20,r:8,got:false,bt:rnd(0,6)});placed++;
    }
    lastX+=gap+pw;
  }
  for(let x=200;placed<D.coinCount;x+=ri(90,150)){
    coins.push({x,y:GY-22,r:8,got:false,bt:rnd(0,6)});placed++;
  }
  for(let i=0;i<4+Math.floor(lvl*1.2);i++){
    const x=250+Math.random()*(worldLen-350);
    if(coins.some(c=>c.y===GY-22&&Math.abs(c.x-(x+12))<44))continue;
    spikes.push({x,y:GY-18,w:24,h:18});
  }
  for(let i=0;i<3+Math.floor(lvl*.8);i++){
    const x=350+Math.random()*(worldLen-450);
    enemies.push({x,y:GY-28,w:26,h:28,vx:-D.enemySpd*rnd(.7,1.3),alive:true,fr:0,ft:0,
      minX:Math.max(220,x-120),maxX:Math.min(worldLen-40,x+120)});
  }
  if(lvl>=5)for(let i=0;i<Math.floor(lvl/5);i++)
    lasers.push({x:400+i*300+Math.random()*200,active:false,timer:ri(0,45),period:D.laserFreq,onDur:50});
  if(lvl>=10)for(let i=0;i<Math.floor(lvl/8);i++)
    fallingBlocks.push({x:300+i*250+Math.random()*200,y:-40,w:40,h:14,vy:0,reset:true,rest:0,cooldown:0});
  const farthest=Math.max(...coins.map(c=>c.x));
  // Never place the final coin beyond the level's time budget.
  levelTime=Math.max(D.timeLimit,Math.ceil((farthest-80)/(D.spd*60)*1.8+8));
  timer=levelTime;hud();
}
function flashLevel(text){$('lvlflash').textContent=text;flashTicks=65;$('lvlflash').style.opacity='1';}
async function startGame(){
  clearInput();score=0;lives=3;level=1;active=true;over=false;paused=false;simTicks=0;flashTicks=0;
  $('lvlflash').style.opacity='0';generateLevel(1);$('ov').style.display='none';
  $('pauseBtn').disabled=false;$('pauseBtn').textContent='Ⅱ PAUZA';lt=null;accumulator=0;
  await Sound.unlock();if(active&&!paused)Sound.play('start');
}
function nextLevel(){
  if(level>=100){winGame();return;}
  level++;generateLevel(level);flashLevel('DARAJA '+level+'!');Sound.play('level');
}
function die(){
  if(P.dead||!active||over)return;
  P.dead=true;P.dt=50;P.vx=0;lives=Math.max(0,lives-1);clearInput();
  spawn(P.x+13,P.y+17,'#ff2244',18);Sound.play('death');hud();
}
function overlay(title,description,label,action){
  const ov=$('ov');ov.replaceChildren();
  const h=document.createElement('h1');h.textContent=title;
  const p=document.createElement('p');p.textContent=description;
  const b=document.createElement('button');b.className='obtn';b.textContent=label;b.onclick=action;
  ov.append(h,p,b);ov.style.display='flex';
}
function endGame(){
  active=false;over=true;paused=false;clearInput();$('pauseBtn').disabled=true;
  overlay('HALOK BO‘LDINGIZ','Ball: '+score+' · Daraja: '+level,'↻ QAYTA URINISH',startGame);
}
function winGame(){
  active=false;over=true;paused=false;clearInput();$('pauseBtn').disabled=true;Sound.play('win');hud();
  overlay('G‘ALABA!','100 daraja yakunlandi · Ball: '+score,'↻ QAYTA O‘YNASH',startGame);
}
function respawn(){
  if(lives<=0){endGame();return;}
  resetPlayer(Math.max(80,Math.min(checkpointX,worldLen-P.w)));
  P.y=GY-185;P.og=false;P.inv=150;coyote=0;
  if(timer<=0)timer=levelTime;
  camX=Math.max(0,Math.min(P.x-160,worldLen-W));hud();
}
function pauseGame(){
  if(!active||over||paused)return;
  paused=true;clearInput();Sound.play('pause');$('pauseBtn').textContent='▶ DAVOM';
  overlay('PAUZA','O‘yin va vaqt to‘xtatildi.','▶ DAVOM ETISH',resumeGame);
  if(Sound.context)Sound.context.suspend().catch(()=>{});
}
async function resumeGame(){
  if(!active||over)return;
  clearInput();paused=false;lt=null;accumulator=0;$('ov').style.display='none';$('pauseBtn').textContent='Ⅱ PAUZA';
  await Sound.unlock();
}
function nativeBack(){if(active&&!paused&&!over){pauseGame();return true;}return false;}
function spawn(x,y,col,n){
  for(let i=0;i<n;i++)particles.push({x,y,vx:rnd(-3,3),vy:-rnd(1,6),life:1,col,sz:rnd(2,6)});
}
function rectHit(ax,ay,aw,ah,bx,by,bw,bh){return ax<bx+bw&&ax+aw>bx&&ay<by+bh&&ay+ah>by;}
function updateParticles(){
  for(const p of particles){p.x+=p.vx;p.y+=p.vy;p.vy+=.18;p.life-=.045;}
  particles=particles.filter(p=>p.life>0);
}
function update(){
  if(!active||over||paused)return;
  simTicks++;updateParticles();
  if(flashTicks>0&&--flashTicks===0)$('lvlflash').style.opacity='0';
  if(P.dead){if(--P.dt<=0){if(lives<=0)endGame();else respawn();}return;}
  const D=difficulty(level);
  timer=Math.max(0,timer-1/60);
  const timeText=String(Math.ceil(timer));if($('tV').textContent!==timeText)$('tV').textContent=timeText;
  if(timer<=0){die();return;}
  if(P.inv>0)P.inv--;
  if(pressed('left')&&!pressed('right')){P.vx=-D.spd;P.dir=-1;}
  else if(pressed('right')&&!pressed('left')){P.vx=D.spd;P.dir=1;}
  else{P.vx*=.7;if(Math.abs(P.vx)<.04)P.vx=0;}
  if(P.og)coyote=6;else if(coyote>0)coyote--;
  if(jumpBuffer>0&&coyote>0){
    P.vy=-D.jump;P.og=false;coyote=0;jumpBuffer=0;Sound.play('jump');spawn(P.x+13,P.y+P.h,'#ff6600',6);
  }else if(jumpBuffer>0)jumpBuffer--;
  const oldBottom=P.y+P.h,wasGrounded=P.og;
  P.vy=Math.min(15,P.vy+D.gravity);
  P.x=Math.max(0,Math.min(worldLen-P.w,P.x+P.vx));P.y+=P.vy;P.og=false;
  if(P.y+P.h>=GY){P.y=GY-P.h;P.vy=0;P.og=true;}
  if(P.y<0){P.y=0;P.vy=0;}
  for(const pl of plats){
    if(P.vy>=0&&oldBottom<=pl.y+1&&P.y+P.h>=pl.y&&P.x+P.w>pl.x&&P.x<pl.x+pl.w){
      P.y=pl.y-P.h;P.vy=0;P.og=true;
    }
  }
  if(P.og&&!wasGrounded)Sound.play('land');
  if(P.og&&Math.abs(P.vx)>.5){if(++stepClock>=13){Sound.play('step');stepClock=0;}}else stepClock=0;
  const target=Math.max(0,Math.min(P.x-160,worldLen-W));camX+=(target-camX)*.13;
  for(const c of coins){
    if(!c.got&&rectHit(P.x,P.y,P.w,P.h,c.x-c.r,c.y-c.r,c.r*2,c.r*2)){
      c.got=true;score+=10*level;checkpointX=P.x;spawn(c.x,c.y,'#ffd700',10);Sound.play('coin');hud();
    }
    c.bt+=.07;
  }
  if(coins.length&&coins.every(c=>c.got)){nextLevel();return;}
  for(const e of enemies){
    if(!e.alive)continue;
    e.x+=e.vx;if(e.x<=e.minX){e.x=e.minX;e.vx=Math.abs(e.vx);}if(e.x>=e.maxX){e.x=e.maxX;e.vx=-Math.abs(e.vx);}
    if(++e.ft>10){e.ft=0;e.fr=1-e.fr;}
    if(rectHit(P.x,P.y,P.w,P.h,e.x,e.y,e.w,e.h)){
      if(P.vy>0&&oldBottom<=e.y+6){
        e.alive=false;score+=50*level;P.vy=-8;P.og=false;Sound.play('stomp');spawn(e.x+13,e.y,'#ff2244',14);hud();
      }else if(P.inv<=0){die();return;}
    }
  }
  if(P.inv<=0)for(const s of spikes){
    if(rectHit(P.x+4,P.y+4,P.w-8,P.h-4,s.x,s.y,s.w,s.h)){die();return;}
  }
  for(const l of lasers){
    l.timer=(l.timer+1)%(l.period+l.onDur);l.active=l.timer>=l.period;
    // Player and laser hitboxes must both use world coordinates.
    if(l.active&&P.inv<=0&&rectHit(P.x,P.y,P.w,P.h,l.x-3,0,6,GY)){die();return;}
  }
  for(const fb of fallingBlocks){
    if(fb.reset){
      if(fb.cooldown>0)fb.cooldown--;
      if(fb.cooldown<=0&&P.x>fb.x-100&&P.x<fb.x+fb.w+80){fb.reset=false;fb.vy=0;fb.y=-40;fb.rest=0;}
      continue;
    }
    if(fb.rest>0){
      if(--fb.rest===0){fb.reset=true;fb.y=-40;fb.vy=0;fb.cooldown=D.fallFreq;}
      continue;
    }
    const oldY=fb.y;fb.vy=Math.min(18,fb.vy+.6);fb.y+=fb.vy;
    if(P.inv<=0&&rectHit(P.x,P.y,P.w,P.h,fb.x,oldY,fb.w,fb.y-oldY+fb.h)){die();return;}
    let surface=GY;
    for(const pl of plats){
      if(oldY+fb.h<=pl.y&&fb.y+fb.h>=pl.y&&fb.x+fb.w>pl.x&&fb.x<pl.x+pl.w)surface=Math.min(surface,pl.y);
    }
    if(fb.y+fb.h>=surface){fb.y=surface-fb.h;fb.vy=0;fb.rest=45;spawn(fb.x+20,fb.y+fb.h,'#992244',5);}
  }
  if(++P.ft>7){P.ft=0;P.fr=P.og&&Math.abs(P.vx)>.5?1-P.fr:0;}
}
function drawP(){
  const px=Math.round(P.x-camX),py=Math.round(P.y);
  if(P.inv>0&&Math.floor(P.inv/4)%2===0)return;
  if(P.dead){
    ctx.fillStyle='#ff2244';ctx.fillRect(px+2,py+22,22,8);
    ctx.fillStyle='#882244';ctx.fillRect(px+6,py+14,14,10);
    return;
  }
  ctx.fillStyle='#cc2200';ctx.fillRect(px+4,py,18,16);
  ctx.fillStyle='#ffcc88';ctx.fillRect(px+6,py+2,14,10);
  ctx.fillStyle='#cc2200';
  if(P.dir>0){ctx.fillRect(px+16,py+4,6,5);}else{ctx.fillRect(px+4,py+4,6,5);}
  ctx.fillRect(px+4,py+16,18,14);
  ctx.fillStyle='#881100';
  if(P.fr===0){ctx.fillRect(px+5,py+30,8,6);ctx.fillRect(px+13,py+30,8,6);}
  else{ctx.fillRect(px+3,py+30,10,6);ctx.fillRect(px+13,py+28,10,6);}
}

function drawEnemy(e){
  if(!e.alive)return;
  const px=Math.round(e.x-camX),py=Math.round(e.y);
  ctx.fillStyle='#ff2244';ctx.fillRect(px+2,py,22,18);
  ctx.fillStyle='#ff6688';ctx.fillRect(px+4,py+2,7,7);ctx.fillRect(px+13,py+2,7,7);
  ctx.fillStyle='#050508';ctx.fillRect(px+6,py+4,3,3);ctx.fillRect(px+15,py+4,3,3);
  ctx.fillStyle='#ff2244';
  if(e.fr===0){ctx.fillRect(px,py+18,10,7);ctx.fillRect(px+14,py+18,10,7);}
  else{ctx.fillRect(px+2,py+18,10,9);ctx.fillRect(px+16,py+18,10,9);}
}

function drawSpike(s){
  const px=Math.round(s.x-camX),py=Math.round(s.y);
  ctx.fillStyle='#880022';
  ctx.beginPath();ctx.moveTo(px,py+s.h);ctx.lineTo(px+12,py);ctx.lineTo(px+s.w,py+s.h);ctx.fill();
  ctx.fillStyle='#ff2244';
  ctx.beginPath();ctx.moveTo(px+2,py+s.h);ctx.lineTo(px+12,py+4);ctx.lineTo(px+s.w-2,py+s.h);ctx.fill();
}

function draw(){
  ctx.fillStyle='#050508';ctx.fillRect(0,0,W,H);

  // Yulduzlar
  for(let i=0;i<40;i++){
    const sx=((i*137+camX*0.08)%W+W)%W;
    const sy=((i*97)%120)+10;
    const tw=0.3+0.5*Math.abs(Math.sin(i+(simTicks*STEP)*0.0008));
    ctx.globalAlpha=tw;ctx.fillStyle='#ff4466';
    ctx.fillRect(sx,sy,1,1);
  }
  ctx.globalAlpha=1;

  // Yer
  ctx.fillStyle='#110005';ctx.fillRect(0,GY,W,H-GY);
  ctx.fillStyle='#440011';ctx.fillRect(0,GY,W,4);

  // Platformalar
  plats.forEach(pl=>{
    const px=Math.round(pl.x-camX);
    ctx.fillStyle='#330011';ctx.fillRect(px,pl.y,pl.w,pl.h);
    ctx.fillStyle='#880022';ctx.fillRect(px,pl.y,pl.w,3);
  });

  // Tangalar
  coins.forEach(c=>{
    if(c.got)return;
    const bob=Math.sin(c.bt)*5;
    const cx=Math.round(c.x-camX),cy=Math.round(c.y+bob);
    ctx.fillStyle='#ffd700';
    ctx.beginPath();ctx.arc(cx,cy,c.r,0,Math.PI*2);ctx.fill();
    ctx.fillStyle='#fff8';
    ctx.beginPath();ctx.arc(cx-2,cy-2,3,0,Math.PI*2);ctx.fill();
  });

  // Spike'lar
  spikes.forEach(s=>drawSpike(s));

  // Lazerlar
  lasers.forEach(l=>{
    const lx=Math.round(l.x-camX);
    if(l.active){
      const flash=Math.floor((simTicks*STEP)/80)%2;
      ctx.fillStyle=flash?'#ff0044':'#ff88aa';
      ctx.fillRect(lx-3,0,6,GY);
      ctx.fillStyle='#ffffff44';
      ctx.fillRect(lx-1,0,2,GY);
    } else {
      ctx.fillStyle=l.timer>l.period-35?'#aa3355':'#330011';
      ctx.fillRect(lx-1,0,2,GY);
    }
  });

  // Tushuvchi bloklar
  fallingBlocks.forEach(fb=>{
    if(fb.reset)return;
    const bx=Math.round(fb.x-camX),by=Math.round(fb.y);
    ctx.fillStyle='#660022';ctx.fillRect(bx,by,fb.w,fb.h);
    ctx.fillStyle='#cc0033';ctx.fillRect(bx,by,fb.w,3);
    ctx.fillStyle='#330011';ctx.fillRect(bx+2,by+4,fb.w-4,fb.h-6);
  });

  // Dushmanlar
  enemies.forEach(e=>drawEnemy(e));

  // Rendering must not advance the simulation while paused.
  for(const p of particles){
    ctx.globalAlpha=p.life;ctx.fillStyle=p.col;
    ctx.fillRect(Math.round(p.x-camX),Math.round(p.y),p.sz,p.sz);
  }
  ctx.globalAlpha=1;
  drawP();

  // Level & vaqt overlay
  const tv=Math.ceil(timer);
  if(tv<=10&&tv>0){
    ctx.fillStyle=`rgba(255,0,50,${0.04+0.03*Math.sin((simTicks*STEP)*0.01)})`;
    ctx.fillRect(0,0,W,H);
  }
}


function loop(ts){
  if(lt===null)lt=ts;
  accumulator+=Math.min(100,Math.max(0,ts-lt));lt=ts;
  while(accumulator>=STEP){update();accumulator-=STEP;}
  draw();requestAnimationFrame(loop);
}
const keyActions={ArrowLeft:'left',KeyA:'left',ArrowRight:'right',KeyD:'right',Space:'jump',ArrowUp:'jump',KeyW:'jump'};
document.addEventListener('keydown',e=>{
  const action=keyActions[e.code];
  if(action){
    if(e.target instanceof HTMLButtonElement&&(!active||paused||over))return;
    e.preventDefault();if(!active||paused||over)return;
    if(action==='jump'&&!e.repeat)jumpBuffer=8;keys.add(action);
  }else if((e.code==='Escape'||e.code==='KeyP')&&!e.repeat&&active){
    e.preventDefault();paused?resumeGame():pauseGame();
  }
});
document.addEventListener('keyup',e=>{const action=keyActions[e.code];if(action){keys.delete(action);e.preventDefault();}});
['bL','bR','bJ'].forEach((id,i)=>{
  const el=$(id),action=['left','right','jump'][i];
  el.addEventListener('pointerdown',e=>{
    e.preventDefault();if(!active||paused||over)return;
    pointers.set(e.pointerId,action);el.setPointerCapture(e.pointerId);el.classList.add('held');
    if(action==='jump')jumpBuffer=8;Sound.unlock();
  });
  const release=e=>{
    pointers.delete(e.pointerId);
    if(!Array.from(pointers.values()).includes(action))el.classList.remove('held');
  };
  el.addEventListener('pointerup',release);el.addEventListener('pointercancel',release);el.addEventListener('lostpointercapture',release);
  el.addEventListener('contextmenu',e=>e.preventDefault());
});
$('startBtn').onclick=startGame;
$('soundBtn').onclick=()=>Sound.toggle();
$('pauseBtn').onclick=()=>paused?resumeGame():pauseGame();
window.addEventListener('blur',()=>{clearInput();pauseGame();});
document.addEventListener('visibilitychange',()=>{if(document.hidden){clearInput();pauseGame();}});
requestAnimationFrame(loop);
