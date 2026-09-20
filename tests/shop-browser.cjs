'use strict';
const assert=require('node:assert/strict');
module.exports=async function checkShop(browser,url,watch,menuFits){
 const page=await browser.newPage({viewport:{width:393,height:852},isMobile:true,hasTouch:true});watch(page);await page.goto(url);await page.locator('#skinShopBtn').tap();
 assert.equal(await page.locator('[data-skin]').count(),41);assert.equal(await page.locator('#skinActionBtn').isDisabled(),true);
 const rankCounts={'SS+':12,SS:4,S:4,A:4,B:4,C:4,D:4,E:5};
 for(const [rank,count] of Object.entries(rankCounts)){await page.locator('[data-rank="'+rank+'"]').tap();assert.equal(await page.locator('[data-skin]').count(),count);await menuFits(page);}
 await page.locator('[data-rank="all"]').tap();
 const fingerprints=await page.locator('.skin-card canvas').evaluateAll(cs=>cs.map(c=>c.toDataURL()));assert.equal(new Set(fingerprints).size,41,'every skin should have different visible pixels');
 await page.evaluate(()=>{game.progress.wallet=100505;game.save();showSkins(true);});await page.locator('[data-skin="naruto"]').tap();await page.locator('#skinActionBtn').tap();
 await page.locator('#cancelSkinBtn').tap();assert.equal(await page.evaluate(()=>game.progress.wallet),100505);assert.equal(await page.evaluate(()=>game.progress.ownedSkins.length),1);
 await page.locator('#skinActionBtn').tap();await page.locator('#confirmSkinBtn').tap();
 assert.deepEqual(await page.evaluate(()=>[game.progress.wallet,game.progress.equippedSkin,game.progress.ownedSkins]),[505,'naruto',['default','naruto']]);assert.equal(await page.locator('#skinActionBtn').isDisabled(),true);
 await page.screenshot({path:'verification/skin-shop-phone.png'});
 await page.reload();await page.locator('#skinShopBtn').tap();assert.equal(await page.evaluate(()=>game.progress.equippedSkin),'naruto');await page.locator('[data-rank="owned"]').tap();assert.equal(await page.locator('[data-skin]').count(),2);
 await page.locator('[data-skin="default"]').tap();await page.locator('#skinActionBtn').tap();assert.equal(await page.evaluate(()=>game.progress.equippedSkin),'default');await page.locator('[data-skin="naruto"]').tap();await page.locator('#skinActionBtn').tap();assert.equal(await page.evaluate(()=>game.progress.wallet),505);
 await page.locator('#shopBackBtn').tap();await page.locator('#startBtn').tap();await page.waitForFunction(()=>game.state==='playing');
 assert.equal(await page.evaluate(()=>game.player.w),24);assert.equal(await page.evaluate(()=>game.player.h),32);await page.screenshot({path:'verification/naruto-in-game.png'});
 await page.locator('#pauseBtn').tap();await page.locator('#pauseShopBtn').tap();const frozen=await page.evaluate(()=>game.timer);await page.waitForTimeout(100);assert.equal(await page.evaluate(()=>game.timer),frozen);
 await page.locator('[data-rank="E"]').tap();await page.locator('[data-skin="rookie"]').tap();await page.locator('#skinActionBtn').tap();await page.locator('#confirmSkinBtn').tap();
 assert.deepEqual(await page.evaluate(()=>[game.progress.wallet,game.progress.equippedSkin,game.progress.ownedSkins.length,game.buySkin('rookie')]),[5,'rookie',3,false]);await page.locator('[data-skin="moss"]').tap();assert.equal(await page.locator('#skinActionBtn').isDisabled(),true);
 await page.locator('#shopBackBtn').tap();assert.equal(await page.evaluate(()=>view),'pause');await page.locator('#resumeBtn').tap();await page.waitForFunction(()=>game.state==='playing');
 await page.evaluate(()=>{for(let n=0;n<3;n++){game.die();for(let i=0;i<39;i++)game.step();}});await page.locator('#buyLifeBtn').tap();await page.waitForFunction(()=>game.state==='playing');assert.deepEqual(await page.evaluate(()=>[game.progress.wallet,game.progress.lives,game.progress.equippedSkin]),[0,1,'rookie']);
 await page.evaluate(()=>showHome());await page.locator('#skinShopBtn').tap();
 const langs=await page.evaluate(()=>I18n.locales.map(l=>l.code));
 for(const lang of langs){
  await page.evaluate(lang=>{I18n.set(lang);applyLocale();showSkins(true);},lang);
  for(const viewport of [{width:320,height:568},{width:844,height:390}]){await page.setViewportSize(viewport);await menuFits(page);const grid=await page.locator('#skinGrid').boundingBox();assert.ok(grid.height>=70&&grid.width>=100,'usable shop collection '+lang+JSON.stringify(grid));const a=await page.locator('#skinActionBtn').boundingBox();assert.ok(a.width>=90&&a.height>=30,'usable buy action '+lang);}
  if(lang==='ar'){await page.setViewportSize({width:393,height:852});await page.screenshot({path:'verification/skin-shop-arabic.png'});}
 }
 await page.evaluate(()=>{I18n.set('uz');applyLocale();skinFilter='SS+';selectedSkin='gojo';showSkins(true);});await page.setViewportSize({width:844,height:390});await page.screenshot({path:'verification/skin-shop-landscape.png'});
 // A single contact sheet uses the exact in-game renderer for visual review.
 await page.setViewportSize({width:1200,height:900});
 await page.evaluate(()=>{panel('<h2>SS+ · 100 000 ◈</h2><div id="legendarySheet"></div>','');const el=document.querySelector('#panel');el.style.cssText='width:1120px;max-height:850px';const sheet=document.querySelector('#legendarySheet');sheet.style.cssText='display:grid;grid-template-columns:repeat(6,minmax(0,1fr));gap:14px;margin-top:24px';for(const s of Skins.catalog.filter(s=>s.rank==='SS+')){const card=document.createElement('div');card.style.cssText='text-align:center;border:1px solid #8b623f;border-radius:10px;padding:10px;background:#1b1325';card.innerHTML=skinCanvas(s.id)+'<strong>'+s.name+'</strong>';sheet.append(card);}document.querySelectorAll('[data-preview]').forEach(c=>renderSkinPreview(c));});
 await page.screenshot({path:'verification/legendary-skins.png'});await page.close();
 return{paidSkins:40,ranks:8,shopLanguages:18,exactPrices:true,purchaseCancelAndReload:true,inventoryAndEquip:true,distinctSprites:true,cosmeticOnly:true,sharedWalletWithLives:true};
};
