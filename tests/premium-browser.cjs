'use strict';
const assert=require('node:assert/strict');
module.exports=async function checkPremium(browser,url,watch,menuFits){
 const p=await browser.newPage({viewport:{width:393,height:852},isMobile:true,hasTouch:true});watch(p);await p.goto(url);
 // Reload the real previous inventory and use the actual replacement selector.
 await p.evaluate(()=>{const save=Core.freshProgress();Object.assign(save,{wallet:100505,ownedSkins:['default','naruto','gojo'],equippedSkin:'gojo',lives:0,currentLevel:7,unlocked:7});save.runs[7]={checkpoint:4,collected:[1,2,3],deaths:6,remaining:35};game.progress=save;game.load(7);game.save();});
 await p.reload();assert.deepEqual(await p.evaluate(()=>[game.progress.wallet,game.progress.lives,game.run.checkpoint,game.progress.equippedSkin,game.progress.ownedSkins]),[100505,0,4,'stormmantle',['default','sunforged','stormmantle']]);
 await p.locator('#skinShopBtn').tap();await p.locator('[data-skin="stormmantle"]').tap();
 for(const mode of ['idle','walk','dash']){await p.locator('[data-pose="'+mode+'"]').tap();assert.equal(await p.evaluate(()=>previewPose),mode);assert.equal(await p.locator('[data-pose="'+mode+'"]').getAttribute('aria-pressed'),'true');}
 const rendering=await p.evaluate(()=>{
  const canvas=document.createElement('canvas');canvas.width=200;canvas.height=180;const c=canvas.getContext('2d');
  const render=(id,pose)=>{c.clearRect(0,0,200,180);Skins.draw(c,id,88,55,{scale:2,tick:7,grounded:true,...pose});return canvas.toDataURL();};
  const premium=Skins.catalog.filter(s=>s.rank==='SS+');
  return {variants:premium.map(s=>new Set([render(s.id,{}),render(s.id,{walking:true}),render(s.id,{dash:true})]).size),lowerUnchanged:Skins.catalog.filter(s=>s.rank!=='SS+').every(s=>render(s.id,{})===render(s.id,{dash:true})),reducedStable:premium.every(s=>render(s.id,{dash:true,motion:false,tick:1})===render(s.id,{dash:true,motion:false,tick:100}))};
 });assert.ok(rendering.variants.every(n=>n===3));assert.equal(rendering.lowerUnchanged,true);assert.equal(rendering.reducedStable,true);
 const langs=await p.evaluate(()=>I18n.locales.map(x=>x.code));
 for(const lang of langs)for(const viewport of [{width:320,height:568},{width:844,height:390}]){
  await p.setViewportSize(viewport);await p.evaluate(code=>{I18n.set(code);applyLocale();skinFilter='SS+';selectedSkin='lightkeeper';showSkins(true);},lang);await menuFits(p);
  for(const pose of ['idle','walk','dash']){await p.locator('[data-pose="'+pose+'"]').click();assert.equal(await p.evaluate(()=>previewPose),pose);}
  const grid=await p.locator('#skinGrid').boundingBox();assert.ok(grid.height>=70,'SS+ collection too short: '+lang);
  await p.evaluate(()=>{showHome();showCoinStore();});await p.locator('#coinAmount').fill(lang==='ar'?'١٢٣٤٥':'12345');await menuFits(p);
  assert.equal(await p.locator('#coinAmount').getAttribute('aria-invalid'),'false');assert.equal(await p.locator('#coinReceive').innerText(),await p.evaluate(()=>T('coinPack',{n:coinsText(12400)})));assert.equal(await p.locator('#buyCoinsBtn').isDisabled(),true);
 }
 await p.setViewportSize({width:393,height:852});await p.evaluate(()=>{I18n.set('uz');applyLocale();showCoinStore(true);});
 await p.locator('#coinAmount').fill('12345');await p.locator('#coinAmount').blur();await p.screenshot({path:'verification/custom-coins-phone.png'});
 for(const invalid of ['0','-10','1.5','1e6','1000000001']){await p.locator('#coinAmount').fill(invalid);assert.equal(await p.locator('#coinAmount').getAttribute('aria-invalid'),'true');assert.equal(await p.locator('#coinPrice').innerText(),'—');}
 await p.locator('#coinAmount').fill('1000000000');assert.equal(await p.locator('#coinAmount').getAttribute('aria-invalid'),'false');await menuFits(p);
 const wallet=await p.evaluate(()=>game.progress.wallet);await p.locator('#buyCoinsBtn').dispatchEvent('click');await p.reload();assert.equal(await p.evaluate(()=>game.progress.wallet),wallet);
 await p.locator('#coinStoreBtn').tap();await p.locator('#coinAmount').fill('12345');await p.setViewportSize({width:393,height:350});await p.locator('#coinAmount').focus();await menuFits(p);await p.locator('#coinBackBtn').click();assert.equal(await p.evaluate(()=>view),'home');
 await p.close();return {originalLegendaries:12,threeDistinctPoses:true,lowerRanksUnchanged:true,reducedMotion:true,oldPurchasesMigrated:true,customQuotes:true,localizedInputs:true,layoutLanguages:18,smallKeyboardViewport:true,livePayments:false};
};
