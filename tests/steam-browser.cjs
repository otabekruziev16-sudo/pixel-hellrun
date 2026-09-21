'use strict';
const {chromium}=require('playwright'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),{pathToFileURL}=require('node:url');
(async()=>{
 const browser=await chromium.launch({headless:true,args:['--no-sandbox']});try{
  const page=await browser.newPage({viewport:{width:1280,height:800}}),errors=[],requests=[];page.on('pageerror',e=>errors.push(e.message));page.on('request',r=>{if(/^https?:/.test(r.url()))requests.push(r.url());});
  await page.goto(pathToFileURL(path.resolve('build/game.html')).href);
  assert.deepEqual(await page.evaluate(()=>[Build.channel,Build.coinPreview,!!$('coinStoreBtn'),showCoinStore()]),['steam-offline',false,false,false]);
  await page.locator('#startBtn').click();await page.waitForFunction(()=>game.state==='playing');await page.locator('#pauseBtn').click();assert.equal(await page.locator('#pauseCoinStoreBtn').count(),0);
  await page.locator('#pauseShopBtn').click();assert.equal(await page.locator('[data-skin]').count(),41);await page.locator('[data-pose="dash"]').click();assert.equal(await page.evaluate(()=>previewPose),'dash');
  await page.evaluate(()=>{game.progress.wallet=100000;showSkins(true);});await page.locator('#skinActionBtn').click();await page.locator('#confirmSkinBtn').click();assert.equal(await page.evaluate(()=>game.progress.equippedSkin),'sunforged');
  await page.reload();assert.equal(await page.evaluate(()=>game.progress.equippedSkin),'sunforged');assert.deepEqual(errors,[]);assert.deepEqual(requests,[]);
  fs.mkdirSync('verification',{recursive:true});await page.screenshot({path:'verification/steam-offline-menu.png'});fs.writeFileSync('verification/steam-browser.json',JSON.stringify({passed:true,channel:'steam-offline',noUnfinishedCheckout:true,originalCollection:true,earnedWalletWorks:true,persistence:true,requests,errors},null,2));
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
