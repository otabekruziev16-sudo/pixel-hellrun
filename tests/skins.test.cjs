'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict');
const Skins=require('../skins.js'),{Engine,freshProgress,normalizeProgress}=require('../core.js');
const clone=x=>JSON.parse(JSON.stringify(x));
test('catalog has 40 paid skins, renamed legendary displays with stable ownership IDs and eight price ranks',()=>{
 assert.equal(Skins.catalog.length,41);assert.equal(new Set(Skins.catalog.map(s=>s.id)).size,41);
 assert.deepEqual(Skins.catalog.filter(s=>s.rank==='SS+').map(s=>s.name),['Kael','Orox','Veyr','Solen','Vaelis','Kargen','Ruko','Verdak','Ignar','Aevon','Kairo','Joren']);
 assert.deepEqual(Skins.RANKS.map(r=>[r.id,r.min,r.max]),[['SS+',100000,100000],['SS',80000,95000],['S',60000,75000],['A',40000,55000],['B',20000,35000],['C',10000,15000],['D',3000,8000],['E',500,2000]]);
 for(const rank of Skins.RANKS){const items=Skins.catalog.filter(s=>s.rank===rank.id&&s.price>0);assert.ok(items.length>=4);for(const s of items)assert.ok(Number.isInteger(s.price)&&s.price>=rank.min&&s.price<=rank.max);}
 assert.equal(Skins.get('default').price,0);assert.equal(Skins.get('constructor'),null);assert.equal(Skins.get('__proto__'),null);
});
test('purchase debits once, equips immediately and survives reload with checkpoint and zero lives intact',()=>{
 const raw=freshProgress();raw.unlocked=7;raw.currentLevel=7;raw.wallet=100005;raw.lives=0;raw.completed=[1,2];raw.runs[7]={checkpoint:4,collected:[1,2,3],deaths:4,remaining:32};
 const writes=[],g=new Engine(raw,(event,data)=>{if(event==='save')writes.push(clone(data));});
 const before=clone(g.progress);assert.equal(g.buySkin('naruto'),true);assert.equal(g.buySkin('naruto'),false);assert.equal(g.progress.wallet,5);assert.equal(writes.length,1);
 const restored=new Engine(writes[0]);assert.equal(restored.progress.equippedSkin,'naruto');assert.deepEqual(restored.progress.ownedSkins,['default','naruto']);assert.equal(restored.progress.lives,0);assert.equal(restored.run.checkpoint,4);assert.deepEqual(restored.run.collected,[1,2,3]);assert.deepEqual(restored.progress.completed,before.completed);
 restored.start();assert.equal(restored.state,'gameover');assert.equal(restored.buyLife(),true);assert.equal(restored.progress.wallet,0);assert.equal(restored.progress.equippedSkin,'naruto');assert.equal(restored.run.checkpoint,4);
});
test('insufficient balance, unknown IDs and unowned equipment cannot change a save',()=>{
 const g=new Engine({...freshProgress(),wallet:499}),before=clone(g.progress);
 for(const id of ['rookie','naruto','missing','__proto__','constructor',null]){assert.equal(g.buySkin(id),false);assert.equal(g.equipSkin(id),false);}
 assert.deepEqual(g.progress,before);g.progress.wallet=500;assert.equal(g.buySkin('rookie'),true);assert.equal(g.progress.wallet,0);assert.equal(g.equipSkin('default'),true);assert.equal(g.equipSkin('rookie'),true);assert.equal(g.progress.wallet,0);
});
test('shop operations require frozen play and never alter level physics or refill lives',()=>{
 const g=new Engine({...freshProgress(),wallet:100000});g.start();assert.equal(g.buySkin('naruto'),false);assert.equal(g.equipSkin('default'),false);g.pause();assert.equal(g.buySkin('naruto'),true);assert.equal(g.state,'paused');assert.equal(g.progress.lives,3);
 const dressed=new Engine(g.progress),plain=new Engine(freshProgress());dressed.start();plain.start();
 for(let i=0;i<90;i++){if(i===6){dressed.jump();plain.jump();}dressed.input.right=plain.input.right=i<25;dressed.step();plain.step();assert.deepEqual(dressed.player,plain.player);assert.equal(dressed.timer,plain.timer);}
});
test('upgrading v2/v3 preserves progress and initializes only the free skin',()=>{
 const raw={...freshProgress(),version:3,wallet:73000,lives:1,unlocked:24,currentLevel:17,completed:[1,2,3],ownedSkins:['naruto'],equippedSkin:'naruto'};
 const p=normalizeProgress(raw);assert.equal(p.version,4);assert.equal(p.wallet,73000);assert.equal(p.lives,1);assert.equal(p.unlocked,24);assert.equal(p.currentLevel,17);assert.deepEqual(p.completed,[1,2,3]);assert.deepEqual(p.ownedSkins,['default']);assert.equal(p.equippedSkin,'default');assert.deepEqual(normalizeProgress(p),p);
 const v2=normalizeProgress({...raw,version:2,runs:{1:{checkpoint:0,collected:[1,2,3],deaths:0,remaining:30}}});assert.equal(v2.wallet,3);assert.deepEqual(v2.ownedSkins,['default']);assert.equal(normalizeProgress(v2).wallet,3);
});
test('invalid or duplicate inventory entries are removed and unavailable equipment falls back',()=>{
 const p=normalizeProgress({...freshProgress(),ownedSkins:['naruto','naruto','bogus','__proto__',{},null],equippedSkin:'gojo'});assert.deepEqual(p.ownedSkins,['default','naruto']);assert.equal(p.equippedSkin,'default');
});
