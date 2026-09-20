'use strict';
const $=id=>document.getElementById(id),cv=$('c'),ctx=cv.getContext('2d');
const SAVE_KEY='hellrun-hardcore-v2',Core=HellRunCore,T=(key,params)=>I18n.t(key,params);
const escapeHTML=value=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const E=(key,params)=>escapeHTML(T(key,params)),economy={lives:Core.MAX_LIVES,cost:Core.LIFE_COST};
let saved=null,hadSave=false,saveFailed=false;
try{saved=JSON.parse(localStorage.getItem(SAVE_KEY));hadSave=[2,3].includes(saved?.version);Sound.muted=localStorage.getItem('hellrun-muted')==='true';}catch{}
let W=800,H=450,zoom=1,dpr=1,camX=-70,camY=-250,lt=null,accumulator=0,view='home',mapReturn='home',helpReturn='home',languageReturn='home',toastUntil=0,shake=0;
const keys=new Set(),pointers=new Map();let particles=[],lastHud='';
const game=new Core.Engine(saved,onGameEvent);
function persist(progress){try{localStorage.setItem(SAVE_KEY,JSON.stringify(progress));hadSave=true;saveFailed=false;}catch{saveFailed=true;toast(T('saveError'));}}
function onGameEvent(name,data){
 if(name==='save'){persist(data);return;}
 Sound.play(name);const p=game.player;
 if(name==='jump'||name==='land')burst(p.x+p.w/2,p.y+p.h,'#c3a6bb',6);
 if(name==='coin')burst(data.x,data.y,'#ffce63',14);
 if(name==='checkpoint'){toast(T('checkpointSaved'));burst(p.x+12,p.y,'#77efd2',25);}
 if(name==='door')toast(T('doorOpen'));
 if(name==='death'){shake=9;burst(p.x+12,p.y+16,'#ff3f63',24);clearInput();toast(T(data==='vaqt'?'timeUp':'died')+' · ♥ '+game.progress.lives+'/'+Core.MAX_LIVES);}
 if(name==='respawn'){snapCamera();clearInput();}
 if(name==='revive')toast(T('livesAdded'));
 if(name==='gameover'){clearInput();showGameOver();}
 if(name==='complete'||name==='win'){clearInput();showComplete();}
 hud();
}
function text(id,value){if($(id).textContent!==String(value))$(id).textContent=value;}
function applyLocale(){
 document.querySelectorAll('[data-i18n]').forEach(el=>el.textContent=T(el.dataset.i18n));
 document.querySelectorAll('[data-i18n-aria]').forEach(el=>el.setAttribute('aria-label',T(el.dataset.i18nAria)));
 text('langBtn',I18n.lang.toUpperCase());Sound.updateButton();lastHud='';hud();
}
function hearts(){return Array.from({length:Core.MAX_LIVES},(_,i)=>'<i aria-hidden="true" class="'+(i<game.progress.lives?'alive':'')+'">♥</i>').join('');}
function resources(){return '<div class="resources"><span class="hearts" aria-label="'+escapeHTML(T('lives')+' '+game.progress.lives+'/'+Core.MAX_LIVES)+'">'+hearts()+'</span><span class="gold">◈ '+game.progress.wallet+' <small>'+E('wallet')+'</small></span></div>';}
function hud(){
 const g=game,w=g.world,n=w.coins.filter(c=>c.got).length;
 const signature=[I18n.lang,g.level,n,g.progress.lives,g.progress.wallet,Math.ceil(g.timer),g.run.checkpoint].join('|');
 if(signature!==lastHud){lastHud=signature;$('levelValue').innerHTML=String(g.level).padStart(2,'0')+'<span>/100</span>';text('coinValue',n+'/'+w.coins.length);$('lifeValue').innerHTML=hearts();$('lifeValue').setAttribute('aria-label',T('lives')+' '+g.progress.lives+'/'+Core.MAX_LIVES);text('walletValue',g.progress.wallet);text('timeValue',Math.ceil(g.timer));$('timeValue').classList.toggle('urgent',g.timer<=15);text('checkpointText',g.run.checkpoint?T('checkpointNo',{n:Math.floor(g.run.checkpoint/4)}):T('entry'));}
 const percent=Math.round(Core.clamp(g.player.x/(w.exit.x||1),0,1)*100);$('routeFill').style.width=percent+'%';
}
function toast(message){text('toast',message);$('toast').classList.add('visible');toastUntil=performance.now()+2200;}
function clearInput(){keys.clear();pointers.clear();game.clearInput();document.querySelectorAll('.cb').forEach(el=>el.classList.remove('held'));}
function syncInput(){game.input.left=keys.has('left')||[...pointers.values()].includes('left');game.input.right=keys.has('right')||[...pointers.values()].includes('right');}
function panel(markup,type=''){$('panel').className='panel '+type;$('panel').innerHTML=markup;$('ov').hidden=false;$('mapScreen').hidden=true;$('ctrl').inert=true;$('panel').scrollTop=0;}
function button(parent,label,fn,secondary=false,id=''){const b=document.createElement('button');b.className='obtn'+(secondary?' secondary':'');b.textContent=label;b.onclick=fn;if(id)b.id=id;parent.append(b);return b;}
function showHome(){
 clearInput();if(game.state!=='menu')game.save();game.state='menu';view='home';$('pauseBtn').disabled=true;
 panel('<div class="hero"><span class="eyebrow">'+E('journey')+'</span><h1 dir="ltr">HELL<span>RUN</span></h1><p class="subline" dir="ltr">HARDCORE</p><p class="description">'+E('intro')+'</p>'+resources()+'</div><div class="save-card"><div><small>'+E(hadSave&&!saveFailed?'savedRoute':'firstStep')+'</small><strong>'+E('levelNo',{n:String(game.progress.currentLevel).padStart(2,'0')})+'</strong></div><em>'+game.progress.completed.length+' / 100<br>'+E('completed')+'</em></div><div class="actions" id="homeActions"></div><p class="hint"><b>'+E('livesHint',economy)+'</b><br>'+E('saveHint')+'</p>','home');
 button($('homeActions'),'▶ '+T(hadSave?'continue':'start'),()=>startGame(),false,'startBtn');
 const row=document.createElement('div');row.className='two-actions';$('homeActions').append(row);button(row,T('levels'),showMap,true,'homeMapBtn');button(row,T('rules'),showHelp,true,'rulesBtn');
 button($('homeActions'),'◎ '+T('language'),showLanguages,true,'languageMenuBtn');
}
function showPlaying(){view='game';$('ov').hidden=true;$('mapScreen').hidden=true;$('ctrl').inert=false;$('pauseBtn').disabled=false;clearInput();particles=[];lt=null;accumulator=0;snapCamera();hud();}
async function startGame(n=game.progress.currentLevel){
 await Sound.unlock();if(!game.start(n))return false;if(game.state==='gameover'){showGameOver();return true;}
 showPlaying();toast(String(n).padStart(2,'0')+' · '+I18n.route(game.world.layout));return true;
}
function pauseGame(){if(!game.pause())return false;clearInput();showPause();if(Sound.context)Sound.context.suspend().catch(()=>{});return true;}
function showPause(){
 view='pause';panel('<span class="eyebrow">'+E('levelNo',{n:String(game.level).padStart(2,'0')})+' · '+E('progressSaved')+'</span><h2>'+E('pause')+'</h2>'+resources()+'<p class="description">'+E('stats',{coins:game.world.coins.filter(c=>c.got).length,deaths:game.run.deaths})+'<br>'+E('nextTip')+'</p><div class="actions" id="pauseActions"></div>');
 button($('pauseActions'),'▶ '+T('continue'),resumeGame,false,'resumeBtn');button($('pauseActions'),T('levels'),showMap,true);button($('pauseActions'),T('language'),showLanguages,true);button($('pauseActions'),T('home'),showHome,true);
}
async function resumeGame(){await Sound.unlock();if(game.resume())showPlaying();}
function showHelp(preserve=false){
 if(preserve!==true)helpReturn=view==='pause'?'pause':'home';view='help';panel('<span class="eyebrow">'+E('rules')+'</span><h2>'+E('rules')+'</h2><ul class="rules">'+I18n.rules().map(rule=>'<li>'+escapeHTML(rule)+'</li>').join('')+'</ul><div class="actions" id="helpActions"></div>');button($('helpActions'),T('understood'),()=>restoreView(helpReturn));
}
function showComplete(){
 view='complete';const won=game.level===100;panel('<span class="eyebrow">'+E('levelNo',{n:String(game.level).padStart(2,'0')})+' · '+E('completed')+'</span><h2>'+E(won?'victory':'exitFound')+'</h2><p class="description">'+E('stats',{coins:game.world.coins.length,deaths:game.run.deaths})+'<br>'+E(won?'allComplete':'nextTip')+'</p><div class="actions" id="completeActions"></div>');
 if(!won)button($('completeActions'),'↑ '+T('nextLevel'),()=>startGame(game.progress.currentLevel),false,'nextLevelBtn');button($('completeActions'),T('levels'),showMap,!won);button($('completeActions'),T('home'),showHome,true);
}
function showGameOver(){
 view='gameover';$('pauseBtn').disabled=true;
 panel('<span class="eyebrow">'+E('levelNo',{n:game.level})+' · '+E('progressSaved')+'</span><h2>'+E('noLives')+'</h2>'+resources()+'<p class="description">'+E('reviveText')+'</p><div class="actions" id="lifeActions"></div><p class="hint">'+E('retryNotice',economy)+'</p>','gameover');
 const buy=button($('lifeActions'),T('buyLife',economy),async()=>{buy.disabled=true;await Sound.unlock();if(game.state!=='gameover')return;if(game.buyLife())showPlaying();else showGameOver();},false,'buyLifeBtn');buy.disabled=game.progress.wallet<Core.LIFE_COST;
 if(buy.disabled){const note=document.createElement('p');note.className='purchase-note';note.textContent=T('notEnough',{n:Core.LIFE_COST-game.progress.wallet});$('lifeActions').append(note);}
 button($('lifeActions'),'↻ '+T('retryLevel',economy),async()=>{await Sound.unlock();if(game.retryLevel()){showPlaying();toast(T('levelNo',{n:game.level}));}},true,'retryLevelBtn');
 button($('lifeActions'),T('home'),showHome,true,'lifeHomeBtn');
}
function restoreView(previous){if(previous==='pause')showPause();else if(previous==='complete')showComplete();else if(previous==='gameover')showGameOver();else if(previous==='help')showHelp(true);else if(previous==='map')showMap(true);else showHome();}
function showLanguages(){
 if(game.state==='playing')pauseGame();languageReturn=view;view='language';clearInput();
 panel('<span class="eyebrow">18 · '+E('language')+'</span><h2>'+E('chooseLanguage')+'</h2><div id="languageGrid" class="language-grid"></div><div class="actions" id="languageActions"></div>','languages');
 for(const language of I18n.locales){const b=button($('languageGrid'),language.name,()=>{I18n.set(language.code);applyLocale();restoreView(languageReturn);},true);b.dataset.locale=language.code;b.dir='auto';b.lang=language.code;b.setAttribute('aria-pressed',String(language.code===I18n.lang));}
 button($('languageActions'),T('back'),()=>restoreView(languageReturn),false,'languageBackBtn');
}
function showMap(preserve=false){
 if(game.state==='playing')pauseGame();if(preserve!==true)mapReturn=view;view='map';clearInput();$('ov').hidden=true;$('mapScreen').hidden=false;$('ctrl').inert=true;
 const route=$('mapRoute');route.replaceChildren();text('mapSummary',T('mapSummary',{done:game.progress.completed.length,open:game.progress.unlocked}));
 const points=[];for(let n=1;n<=100;n++){const i=n-1,row=Math.floor(i/5),col=i%5;points.push({x:(row%2?4-col:col)*20+10,y:3210-row*160-col*26});}
 const ns='http://www.w3.org/2000/svg',svg=document.createElementNS(ns,'svg');svg.setAttribute('viewBox','0 0 500 3290');svg.setAttribute('preserveAspectRatio','none');svg.setAttribute('aria-hidden','true');
 const path=document.createElementNS(ns,'path');let d='M '+points[0].x*5+' '+points[0].y;for(const p of points.slice(1))d+=' H '+p.x*5+' V '+p.y;path.setAttribute('d',d);path.setAttribute('stroke','#38283e');path.setAttribute('stroke-width','3');path.setAttribute('fill','none');svg.append(path);route.append(svg);
 points.forEach((p,i)=>{const n=i+1,b=document.createElement('button'),done=game.progress.completed.includes(n);b.className='level-node'+(done?' done':'')+(n===game.progress.currentLevel?' current':'');b.dataset.level=n;b.style.left=p.x+'%';b.style.top=p.y+'px';b.disabled=n>game.progress.unlocked;b.textContent=n;b.setAttribute('aria-label',T('levelNo',{n})+', '+T(b.disabled?'locked':done?'completed':'open'));if(done){const mark=document.createElement('b');mark.textContent='✓';b.append(mark);}b.onclick=()=>{if(done&&game.progress.lives>0)delete game.progress.runs[n];startGame(n);};route.append(b);});
 requestAnimationFrame(()=>{$('mapScroll').scrollTop=points[game.progress.currentLevel-1].y-$('mapScroll').clientHeight*.6;});
}
function closeMap(){restoreView(mapReturn);}
function nativeBack(){if(view==='language'){restoreView(languageReturn);return true;}if(view==='map'){closeMap();return true;}if(view==='help'){restoreView(helpReturn);return true;}if(game.state==='playing'){pauseGame();return true;}return false;}

function resize(){const r=$('wrap').getBoundingClientRect();zoom=Core.clamp(Math.min(r.width/840,r.height/470),1,1.65);dpr=Math.min(2,window.devicePixelRatio||1);W=r.width/zoom;H=r.height/zoom;cv.width=Math.round(r.width*dpr);cv.height=Math.round(r.height*dpr);snapCamera();}
function cameraTarget(){return{x:Core.clamp(game.player.x-W*.33,-70,Math.max(-70,game.world.right-W+35)),y:game.player.y-H*.53};}
function snapCamera(){const c=cameraTarget();camX=c.x;camY=c.y;}
function burst(x,y,color,n){for(let i=0;i<n;i++)particles.push({x,y,vx:(Math.random()-.5)*5,vy:-Math.random()*4-1,life:1,size:2+Math.random()*3,color});if(particles.length>180)particles.splice(0,particles.length-180);}
function simulate(){game.step();if(game.state==='playing'){for(const p of particles){p.x+=p.vx;p.y+=p.vy;p.vy+=.13;p.life-=.035;}particles=particles.filter(p=>p.life>0);}if(shake>0)shake*=.8;}
function label(s,x,y,color='#b093a7',size=8){ctx.font='bold '+size+'px '+(['ar','hi','ko','zh','ja'].includes(I18n.lang)?'Arial,sans-serif':'monospace');ctx.direction=I18n.lang==='ar'?'rtl':'ltr';ctx.textAlign='center';ctx.fillStyle=color;ctx.fillText(s,Math.round(x),Math.round(y),120);}
function platform(pl){
 if(pl.x+pl.w<camX-30||pl.x>camX+W+30||pl.y<camY-45||pl.y>camY+H+100)return;
 const x=Math.round(pl.x),y=pl.y;
 if(pl.broken){ctx.globalAlpha=.18;ctx.strokeStyle='#ffbf73';ctx.setLineDash([3,4]);ctx.strokeRect(x,y,pl.w,pl.h);ctx.setLineDash([]);ctx.globalAlpha=1;return;}
 const c=pl.checkpoint?'#375e56':pl.crumble?'#784331':'#514059';
 ctx.fillStyle='#03030999';ctx.fillRect(x+6,y+9,pl.w,pl.h+8);ctx.fillStyle='#211724';ctx.fillRect(x,y,pl.w,pl.h);ctx.fillStyle=c;ctx.fillRect(x,y,pl.w,4);ctx.fillStyle='#ffffff13';ctx.fillRect(x+2,y+4,pl.w-4,2);
 ctx.strokeStyle='#09070ea0';for(let a=14;a<pl.w;a+=21){ctx.beginPath();ctx.moveTo(x+a,y+6);ctx.lineTo(x+a,y+pl.h);ctx.stroke();}
 if(pl.crumble){ctx.strokeStyle=pl.load?'#ffae71':'#b37655';ctx.beginPath();ctx.moveTo(x+pl.w*.35,y+3);ctx.lineTo(x+pl.w*.45,y+9);ctx.lineTo(x+pl.w*.32,y+13);ctx.moveTo(x+pl.w*.7,y+1);ctx.lineTo(x+pl.w*.6,y+pl.h);ctx.stroke();}
 if(pl.checkpoint&&pl.id){const active=pl.id<=game.run.checkpoint;ctx.fillStyle='#68556f';ctx.fillRect(x+pl.w-18,y-39,2,39);ctx.fillStyle=active?'#77efd2':'#73677f';ctx.beginPath();ctx.moveTo(x+pl.w-16,y-39);ctx.lineTo(x+pl.w+5,y-32);ctx.lineTo(x+pl.w-16,y-24);ctx.fill();label(T(active?'saved':'checkpoint'),x+pl.w/2,y+pl.h+16,active?'#77efd2':'#8f7f9c',7);}
}
function door(d,exit){
 const open=exit&&game.world.coins.every(c=>c.got),c=exit?(open?'#77efd2':'#e9587a'):'#927488';
 ctx.fillStyle='#1c1424';ctx.fillRect(d.x-6,d.y-5,d.w+12,d.h+5);ctx.fillStyle=c;ctx.fillRect(d.x-3,d.y-3,d.w+6,3);ctx.fillRect(d.x-3,d.y,3,d.h);ctx.fillRect(d.x+d.w,d.y,3,d.h);
 const glow=ctx.createLinearGradient(d.x,d.y,d.x+d.w,d.y);glow.addColorStop(0,open?'#77efd255':'#9e27452a');glow.addColorStop(.5,open?'#77efd210':'#090710');glow.addColorStop(1,open?'#77efd255':'#9e27452a');ctx.fillStyle=glow;ctx.fillRect(d.x,d.y,d.w,d.h);
 if(!open&&exit){ctx.fillStyle='#cc8291';ctx.fillRect(d.x+14,d.y+24,9,11);ctx.strokeStyle='#cc8291';ctx.strokeRect(d.x+16,d.y+18,5,8);}else{ctx.fillStyle=c;for(let i=0;i<7;i++)ctx.fillRect(d.x+5+(i*7)%25,d.y+((i*13+game.ticks*.4)%d.h),1,3);}
 label(T(exit?'exit':'entry'),d.x+d.w/2,d.y-12,c,8);
}
function drawPlayer(){
 const p=game.player;if(p.dead)return;const x=Math.round(p.x),y=Math.round(p.y);ctx.globalAlpha=p.inv>0&&Math.floor(game.ticks/4)%2?.6:1;
 ctx.fillStyle='#0007';ctx.beginPath();ctx.ellipse(x+12,y+34,14,3,0,0,Math.PI*2);ctx.fill();
 ctx.fillStyle='#80233d';ctx.fillRect(x+3,y+11,18,17);ctx.fillStyle='#f04661';ctx.fillRect(x+4,y,17,12);ctx.fillRect(x+1,y+7,22,5);ctx.fillStyle='#ffd6b6';ctx.fillRect(x+5,y+10,15,9);ctx.fillStyle='#2a1126';ctx.fillRect(x+(p.dir>0?16:6),y+12,3,4);ctx.fillStyle='#ff6577';ctx.fillRect(x+5,y+20,14,6);
 const stride=p.grounded&&Math.abs(p.vx)>.4?Math.sin(game.ticks*.55)*3:0;ctx.fillStyle='#382f43';ctx.fillRect(x+4+stride,y+26,7,6);ctx.fillRect(x+13-stride,y+26,7,6);ctx.fillStyle='#ffd6b6';ctx.fillRect(x+(p.dir>0?20:0),y+20,4,6);ctx.globalAlpha=1;
}
function draw(){
 ctx.setTransform(dpr*zoom,0,0,dpr*zoom,0,0);ctx.imageSmoothingEnabled=false;
 const bg=ctx.createLinearGradient(0,0,0,H);bg.addColorStop(0,'#090813');bg.addColorStop(.6,'#171020');bg.addColorStop(1,'#28101f');ctx.fillStyle=bg;ctx.fillRect(0,0,W,H);
 // Layered ruins and drifting embers are drawn locally, without image downloads.
 for(let i=0;i<12;i++){let x=((i*127-camX*.2)%(W+200)+(W+200))%(W+200)-90;const top=H*.17+(i%3)*40-camY*.035;ctx.fillStyle=i%2?'#100d1b':'#1b1124';ctx.fillRect(x,top,51,H);ctx.fillRect(x-5,top,61,8);ctx.fillStyle='#74254018';ctx.fillRect(x+18,top+35,15,42);}
 ctx.fillStyle='#db624d';for(let i=0;i<45;i++){const x=((i*83.17-camX*.35)%(W+10)+W+10)%(W+10);const y=((i*61.3-game.ticks*.22-camY*.07)%(H+10)+H+10)%(H+10);ctx.globalAlpha=.15+(i%5)*.1;ctx.fillRect(x,y,i%4===0?2:1,2);}ctx.globalAlpha=1;
 const c=cameraTarget();camX+=(c.x-camX)*.16;camY+=(c.y-camY)*.12;
 ctx.save();ctx.translate(-Math.round(camX)+(shake>.2?(Math.random()-.5)*shake:0),-Math.round(camY));
 const lava=game.world.platforms[game.run.checkpoint].y+210;
 if(lava<camY+H){ctx.fillStyle='#591129';ctx.fillRect(camX,lava,W,Math.max(0,camY+H-lava));ctx.fillStyle='#fc6442';ctx.fillRect(camX,lava,W,3);ctx.fillStyle='#ffbd6266';for(let i=0;i<W/16;i++)ctx.fillRect(camX+i*16,lava+6+Math.sin(i+game.ticks*.05)*4,10,2);}
 game.world.platforms.forEach(platform);door(game.world.entry,false);door(game.world.exit,true);
 for(const s of game.world.spikes){ctx.fillStyle='#e05b7a';ctx.beginPath();ctx.moveTo(s.x,s.y+s.h);ctx.lineTo(s.x+s.w/2,s.y);ctx.lineTo(s.x+s.w,s.y+s.h);ctx.fill();ctx.fillStyle='#ffd1d9';ctx.fillRect(s.x+s.w/2,s.y+2,2,4);}
 for(const l of game.world.lasers){const state=game.laserState(l);ctx.fillStyle='#48283d';ctx.fillRect(l.x-10,l.y-7,20,8);ctx.fillRect(l.x-10,l.y+l.h,20,8);ctx.fillStyle=state.active?'#ff4778':state.warning?'#ffca76':'#59243d';ctx.fillRect(l.x-4,l.y-4,8,4);if(state.active){ctx.fillStyle='#ff3b6c33';ctx.fillRect(l.x-9,l.y,18,l.h);ctx.fillStyle='#ff4674';ctx.fillRect(l.x-3,l.y,6,l.h);ctx.fillStyle='#ffe8ef';ctx.fillRect(l.x-1,l.y,2,l.h);}else{ctx.globalAlpha=state.warning?.75:.15;ctx.strokeStyle=state.warning?'#ffca76':'#e9537e';ctx.setLineDash([3,5]);ctx.beginPath();ctx.moveTo(l.x,l.y);ctx.lineTo(l.x,l.y+l.h);ctx.stroke();ctx.setLineDash([]);ctx.globalAlpha=1;}}
 for(const s of game.world.saws){const p=game.sawPosition(s);ctx.strokeStyle='#5e3d53';ctx.beginPath();ctx.moveTo(s.x-s.range,s.y);ctx.lineTo(s.x+s.range,s.y);ctx.stroke();ctx.save();ctx.translate(p.x,p.y);ctx.rotate(game.ticks*.13);ctx.fillStyle='#f77a97';ctx.beginPath();for(let i=0;i<24;i++){const a=i/24*Math.PI*2,r=i%2?p.r*.7:p.r;const x=Math.cos(a)*r,y=Math.sin(a)*r;i?ctx.lineTo(x,y):ctx.moveTo(x,y);}ctx.closePath();ctx.fill();ctx.fillStyle='#5e1937';ctx.beginPath();ctx.arc(0,0,p.r*.47,0,Math.PI*2);ctx.fill();ctx.fillStyle='#ffe8df';ctx.fillRect(-2,-2,4,4);ctx.restore();}
 for(const c of game.world.coins){if(c.got)continue;const y=c.y+Math.sin(game.ticks*.06+c.id)*2;ctx.fillStyle='#ffce6318';ctx.beginPath();ctx.arc(c.x,y,14,0,Math.PI*2);ctx.fill();ctx.fillStyle='#ffce63';ctx.beginPath();ctx.arc(c.x,y,c.r,0,Math.PI*2);ctx.fill();ctx.fillStyle='#fff6b1';ctx.fillRect(c.x-3,y-4,2,6);ctx.fillStyle='#a76525';ctx.fillRect(c.x+2,y-3,1,6);}
 for(const p of particles){ctx.globalAlpha=p.life;ctx.fillStyle=p.color;ctx.fillRect(p.x,p.y,p.size,p.size);}ctx.globalAlpha=1;drawPlayer();ctx.restore();hud();
 if(game.player.dead){ctx.fillStyle='#ff18441a';ctx.fillRect(0,0,W,H);}
}
function loop(ts){if(lt===null)lt=ts;accumulator+=Math.min(100,Math.max(0,ts-lt));lt=ts;while(accumulator>=Core.STEP){simulate();accumulator-=Core.STEP;}if(ts>toastUntil)$('toast').classList.remove('visible');draw();requestAnimationFrame(loop);}
const keyActions={ArrowLeft:'left',KeyA:'left',ArrowRight:'right',KeyD:'right',Space:'jump',ArrowUp:'jump',KeyW:'jump'};
document.addEventListener('keydown',e=>{const action=keyActions[e.code];if(action&&game.state==='playing'){e.preventDefault();if(action==='jump'){if(!e.repeat)game.jump();}else{keys.add(action);syncInput();}}else if(!e.repeat&&(e.code==='Escape'||e.code==='KeyP')){e.preventDefault();if(view==='map')closeMap();else if(game.state==='playing')pauseGame();else if(view==='pause')resumeGame();}else if(!e.repeat&&e.code==='KeyM')showMap();});
document.addEventListener('keyup',e=>{const action=keyActions[e.code];if(action){keys.delete(action);syncInput();}});
['bL','bR','bJ'].forEach((id,i)=>{const el=$(id),action=['left','right','jump'][i];el.addEventListener('pointerdown',e=>{e.preventDefault();if(game.state!=='playing'||game.player.dead)return;pointers.set(e.pointerId,action);el.setPointerCapture(e.pointerId);el.classList.add('held');if(action==='jump')game.jump();syncInput();Sound.unlock();});const release=e=>{pointers.delete(e.pointerId);if(![...pointers.values()].includes(action))el.classList.remove('held');syncInput();};['pointerup','pointercancel','lostpointercapture'].forEach(name=>el.addEventListener(name,release));el.addEventListener('contextmenu',e=>e.preventDefault());});
$('soundBtn').onclick=()=>Sound.toggle();$('pauseBtn').onclick=()=>pauseGame();$('mapBtn').onclick=showMap;$('closeMap').onclick=closeMap;$('langBtn').onclick=showLanguages;
window.addEventListener('blur',()=>{clearInput();pauseGame();});document.addEventListener('visibilitychange',()=>{if(document.hidden){clearInput();pauseGame();game.save();}});window.addEventListener('pagehide',()=>game.save());
window.addEventListener('resize',resize);if(window.visualViewport)window.visualViewport.addEventListener('resize',resize);new ResizeObserver(resize).observe($('wrap'));
resize();
applyLocale();
showHome();
requestAnimationFrame(loop);
