'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict');
const Core=require('../core'),Skins=require('../skins');
const mod=save=>new Core.Engine(save,()=>{},{testMod:true});
test('MOD starts with all 100 levels available and every level can be selected directly',()=>{
 const g=mod(null);assert.equal(g.progress.wallet,Core.TEST_WALLET);assert.equal(g.progress.unlocked,100);assert.equal(g.progress.lives,3);assert.deepEqual(g.progress.completed,[]);
 for(let n=1;n<=100;n++){assert.equal(g.start(n),true);assert.equal(g.level,n);assert.equal(g.progress.unlocked,100);}assert.equal(g.start(101),false);
});
test('all skin purchases remain affordable without spending coins; ownership and zero lives survive reload',()=>{
 const g=mod(null),balance=g.progress.wallet;
 for(const s of Skins.catalog.filter(s=>s.price)){assert.equal(g.buySkin(s.id),true);assert.equal(g.progress.wallet,balance);assert.equal(g.buySkin(s.id),false);}
 assert.equal(g.progress.ownedSkins.length,41);g.progress.lives=0;g.save();
 const next=mod(JSON.parse(JSON.stringify(g.progress)));assert.equal(next.progress.wallet,balance);assert.equal(next.progress.lives,0);assert.equal(next.progress.unlocked,100);assert.deepEqual(next.progress.ownedSkins,g.progress.ownedSkins);assert.equal(next.progress.equippedSkin,g.progress.equippedSkin);
});
test('MOD deaths still cost lives; repeated revives keep the wallet and checkpoint intact',()=>{
 const g=mod({...Core.freshProgress(),currentLevel:100,unlocked:100,lives:1,runs:{100:{checkpoint:4,collected:[1,2,3],deaths:0,remaining:35}}});g.start();
 for(let n=0;n<25;n++){g.die();for(let t=0;t<40;t++)g.step();assert.equal(g.state,'gameover');assert.equal(g.progress.lives,0);assert.equal(g.buyLife(),true);assert.equal(g.progress.wallet,Core.TEST_WALLET);assert.equal(g.progress.lives,1);assert.equal(g.run.checkpoint,4);}
 const restored=mod(g.progress);assert.equal(restored.level,100);assert.equal(restored.run.checkpoint,4);assert.equal(restored.progress.wallet,Core.TEST_WALLET);
});
test('normal games still start locked and charge real earned coins; a save cannot enable MOD',()=>{
 const normal=new Core.Engine({...Core.freshProgress(),wallet:500,testMod:true});assert.equal(normal.testMod,false);assert.equal(normal.progress.unlocked,1);assert.equal(normal.start(100),false);assert.equal(normal.buySkin('rookie'),true);assert.equal(normal.progress.wallet,0);
 const plain=Core.freshProgress();assert.equal(plain.wallet,0);assert.equal(plain.unlocked,1);
});
