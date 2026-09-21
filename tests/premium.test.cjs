'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict');
const Skins=require('../skins.js'),Store=require('../store.js'),Core=require('../core.js');
const old=['naruto','madara','sasuke','minato','gojo','sukuna','luffy','zoro','ichigo','aizen','kakashi','jiraya'];
const modern=['sunforged','voidregent','frostcrown','clockwarden','stormmantle','emberdrake','briarheart','tidemantle','prismarch','obsidian','starweaver','lightkeeper'];
test('every old SS+ purchase migrates once for free without losing equipped skin, progress, zero lives or wallet',()=>{
 for(let i=0;i<old.length;i++){
  const raw={...Core.freshProgress(),wallet:1234567,lives:0,unlocked:7,currentLevel:7,totalDeaths:12,completed:[1,2],ownedSkins:['default','rookie',...old,...modern,old[i]],equippedSkin:old[i],runs:{7:{checkpoint:4,collected:[1,2,3],deaths:4,remaining:32}}};
  const p=Core.normalizeProgress(raw);assert.deepEqual(p.ownedSkins,['default','rookie',...modern]);assert.equal(p.equippedSkin,modern[i]);assert.equal(p.wallet,raw.wallet);assert.equal(p.lives,0);assert.equal(p.currentLevel,7);assert.equal(p.unlocked,7);assert.deepEqual(p.runs,raw.runs);assert.deepEqual(p.completed,raw.completed);assert.equal(p.totalDeaths,12);assert.deepEqual(Core.normalizeProgress(p),p);
  const g=new Core.Engine(p);assert.equal(g.buySkin(old[i]),false);assert.equal(Skins.get(old[i]),null);assert.equal(Skins.migrateId(old[i]),modern[i]);
 }
 for(const id of [null,{},'constructor','__proto__','unknown'])assert.equal(Skins.migrateId(id),null);
 assert.equal(new Set(Skins.catalog.filter(s=>s.rank==='SS+').map(s=>s.theme)).size,12);
 assert.ok(Skins.catalog.filter(s=>s.rank!=='SS+').every(s=>!s.theme));
});
test('custom quotes use integer cents, give full value, and handle localized digits',()=>{
 for(const [input,coins,cents] of [['1',100,1],['99',100,1],['100',100,1],['101',200,2],['10000',10000,100],['12345',12400,124],['١٢٣٤٥',12400,124],['۱۲۳۴۵',12400,124],['१२३४५',12400,124],['１２３４５',12400,124],['1000000000',1000000000,10000000]]){
  const q=Store.quote(input);assert.equal(q.ok,true,input);assert.equal(q.coins,coins);assert.equal(q.usdCents,cents);assert.equal(q.coins/q.usdCents,100);assert.equal(q.rounded,q.requested!==coins);assert.ok(Object.isFrozen(q));
 }
 for(const v of ['',0,-1,'1.5','1e6','1,000','1 000','1<script>','Infinity',Infinity,NaN,'1000000001','99999999999999999',null,{},[],true])assert.equal(Store.quote(v).ok,false,String(v));
 const g=new Core.Engine({...Core.freshProgress(),wallet:5});for(const v of [1,10000,1e9])Store.quote(v);assert.equal(g.progress.wallet,5);assert.equal(Store.available,false);
});
test('SS+ movement and dash stay strictly cosmetic across all twelve replacements',()=>{
 for(const id of modern){
  const a=new Core.Engine({...Core.freshProgress(),ownedSkins:['default',id],equippedSkin:id}),b=new Core.Engine(Core.freshProgress());a.start();b.start();
  for(let t=0;t<70;t++){a.input.right=b.input.right=t<35;if(t===7){a.jump();b.jump();}if(t===12){a.dash();b.dash();}a.step();b.step();assert.deepEqual(a.player,b.player);assert.equal(a.progress.lives,b.progress.lives);assert.equal(a.timer,b.timer);}
 }
});
