'use strict';
const assert=require('node:assert/strict');
module.exports=async function checkUpgrade(browser,url,watch,menuFits){
 const p=await browser.newPage({viewport:{width:393,height:852},isMobile:true,hasTouch:true});watch(p);await p.goto(url);await p.bringToFront();
 await p.locator('#settingsBtn').tap();await p.locator('#volumeSlider').evaluate(el=>{el.value=37;el.dispatchEvent(new Event('input',{bubbles:true}));});await p.locator('#motionToggle').uncheck();await p.locator('[data-bind="jump"]').tap();await p.keyboard.press('e');assert.equal(await p.evaluate(()=>settings.bindings.jump),'KeyE');await p.locator('#settingsBackBtn').tap();
 await p.locator('#coinStoreBtn').tap();assert.equal(await p.locator('#buyCoinsBtn').isDisabled(),true);assert.ok((await p.locator('.coin-pack').innerText()).includes('10'));const wallet=await p.evaluate(()=>game.progress.wallet);await p.locator('#buyCoinsBtn').dispatchEvent('click');assert.equal(await p.evaluate(()=>game.progress.wallet),wallet);
 await p.screenshot({path:'verification/coin-store.png'});await p.reload();
 assert.deepEqual(await p.evaluate(()=>[settings.volume,Sound.volume,settings.motion,settings.bindings.jump,game.progress.wallet]),[.37,.37,false,'KeyE',wallet]);
 await p.locator('#startBtn').tap();await p.waitForFunction(()=>game.state==='playing');await p.keyboard.press('e');await p.waitForFunction(()=>game.player.y<-42);await p.locator('#bDash').tap();assert.ok(await p.evaluate(()=>game.player.dashCooldown>0));
 await p.locator('#pauseBtn').tap();await p.locator('#pauseSettingsBtn').tap();await p.locator('#resetKeysBtn').tap();assert.equal(await p.evaluate(()=>settings.bindings.jump),'Space');await p.locator('#motionToggle').check();await p.screenshot({path:'verification/settings-phone.png'});await p.locator('#settingsBackBtn').tap();
 assert.equal(await p.evaluate(()=>view),'pause');await p.locator('#resumeBtn').tap();await p.waitForFunction(()=>game.state==='playing');
 // A synthetic standard pad goes through the same browser polling as hardware.
 await p.evaluate(()=>{game.resetPlayer();window.testPad={connected:true,mapping:'standard',axes:[0,0],buttons:Array.from({length:16},()=>({pressed:false}))};Object.defineProperty(navigator,'getGamepads',{configurable:true,value:()=>window.testPad?[window.testPad]:[]});pollGamepad(performance.now());testPad.buttons[9].pressed=true;pollGamepad(performance.now()+1);});
 assert.equal(await p.evaluate(()=>view),'pause');
 await p.evaluate(()=>{testPad.buttons[9].pressed=false;pollGamepad(performance.now()+2);testPad.buttons[0].pressed=true;pollGamepad(performance.now()+3);});await p.waitForFunction(()=>game.state==='playing');
 const before=await p.evaluate(()=>{testPad.buttons[0].pressed=false;testPad.axes[0]=.8;pollGamepad(performance.now());return game.player.x;});await p.waitForFunction(x=>game.player.x>x+8,before);
 await p.evaluate(()=>{testPad.axes[0]=0;testPad.buttons[2].pressed=true;pollGamepad(performance.now());});assert.ok(await p.evaluate(()=>game.player.dashCooldown>0));await p.evaluate(()=>{window.testPad=null;pollGamepad(performance.now());});assert.equal(await p.evaluate(()=>game.state),'paused');assert.equal(await p.evaluate(()=>game.input.right),false);
 await p.evaluate(()=>showHome());const languages=await p.evaluate(()=>I18n.locales.map(x=>x.code));
 for(const language of languages){
  await p.evaluate(code=>{I18n.set(code);applyLocale();showHome();},language);
  for(const viewport of [{width:320,height:568},{width:844,height:390}]){
   await p.setViewportSize(viewport);await p.locator('#settingsBtn').click();await menuFits(p);await p.locator('#settingsBackBtn').click();await p.locator('#coinStoreBtn').click();await menuFits(p);assert.equal(await p.locator('#buyCoinsBtn').isDisabled(),true);await p.locator('#coinBackBtn').click();
  }
 }
 await p.setViewportSize({width:320,height:568});await p.evaluate(async()=>{I18n.set('uz');applyLocale();await startGame(1);});await p.waitForFunction(()=>game.state==='playing');
 const boxes=await Promise.all(['bL','bR','bDash','bJ'].map(id=>p.locator('#'+id).boundingBox()));for(const b of boxes)assert.ok(b.x>=0&&b.x+b.width<=320&&b.width>=56&&b.height>=56);for(let i=1;i<boxes.length;i++)assert.ok(boxes[i].x>=boxes[i-1].x+boxes[i-1].width,'touch buttons overlap');
 await p.screenshot({path:'verification/dash-controls-small-phone.png'});
 // Exact game rendering across all ten chapters, including actual geometry.
 await p.setViewportSize({width:960,height:540});await p.evaluate(()=>{I18n.set('en');applyLocale();game.progress.unlocked=100;});
 for(let i=0;i<10;i++){
  await p.evaluate(async n=>{await startGame(n);pauseGame();$('ov').hidden=true;const pl=game.world.platforms[3];Object.assign(game.player,{x:pl.x+pl.w/2-12,y:pl.y-32,platform:pl.id,inv:0});snapCamera();draw();},i*10+1);
  await p.screenshot({path:'verification/chapter-'+String(i).padStart(2,'0')+'.png'});
 }
 await p.close();return{settingsLanguages:18,settingsReload:true,remapping:true,touchDash:true,gamepadSynthetic:true,disconnectPauses:true,coinPack10000For1USD:true,livePayments:false,chapterScenes:10};
};
