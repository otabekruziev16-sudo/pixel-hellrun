'use strict';
const {app,BrowserWindow,Menu}=require('electron');
const path=require('node:path'),fs=require('node:fs');
const smoke=process.argv.includes('--smoke-test');
if(smoke)app.setPath('userData',path.join(process.env.HELLRUN_VERIFY_DIR||path.resolve('verification'),'smoke-profile'));
let win;
app.whenReady().then(async()=>{
 Menu.setApplicationMenu(null);
 win=new BrowserWindow({title:'HellRun Hardcore',width:1280,height:800,minWidth:600,minHeight:380,backgroundColor:'#08070d',autoHideMenuBar:true,icon:path.join(__dirname,'../build/icon.png'),show:!smoke,webPreferences:{nodeIntegration:false,contextIsolation:true,sandbox:true,webSecurity:true}});
 win.webContents.setWindowOpenHandler(()=>({action:'deny'}));
 win.webContents.on('will-navigate',event=>event.preventDefault());
 win.webContents.session.setPermissionRequestHandler((contents,permission,callback)=>callback(false));
 win.webContents.on('before-input-event',(event,input)=>{if(input.type==='keyDown'&&input.key==='F11'){win.setFullScreen(!win.isFullScreen());event.preventDefault();}});
 win.on('blur',()=>win.webContents.executeJavaScript('typeof pauseGame==="function" && pauseGame()').catch(()=>{}));
 await win.loadFile(path.join(__dirname,'../build/game.html'));
 if(smoke){
  try{
   const result=await win.webContents.executeJavaScript(`(async()=>{
    await startGame();const before=game.player.x;game.input.right=true;for(let i=0;i<12;i++)game.step();game.clearInput();
    const moved=game.player.x>before,dashWorks=game.dash()&&game.player.dashCooldown===90;game.die();for(let i=0;i<40;i++)game.step();pauseGame();
    game.progress.wallet=500;showSkins();skinFilter="E";selectedSkin="rookie";showSkins(true);$('skinActionBtn').click();$('confirmSkinBtn').click();
    const shopWorks=game.progress.equippedSkin==="rookie"&&game.progress.wallet===0;
    game.progress.wallet=100000;const premiumWorks=game.buySkin('sunforged')&&Skins.get(game.progress.equippedSkin).theme==='sun';
    showSettings();const settingsWorks=!!$('volumeSlider');let storeBlocked=false,customQuote=false;
    if(Build.coinPreview){showCoinStore();$('coinAmount').value='12345';$('coinAmount').dispatchEvent(new Event('input'));storeBlocked=$('buyCoinsBtn').disabled;customQuote=HellRunStore.quote($('coinAmount').value).coins===12400&&$('coinReceive').textContent.includes('12');}
    else{showHome();storeBlocked=!$('coinStoreBtn')&&showCoinStore()===false;customQuote=true;}
    const save=JSON.parse(localStorage.getItem(SAVE_KEY));
    return {channel:Build.channel,title:document.title,premiumWorks,customQuote,dashWorks,settingsWorks,storeBlocked,shopWorks,moved,deaths:game.run.deaths,audio:!!Sound.context,fullscreen:Math.abs($('c').getBoundingClientRect().width-innerWidth)<2,level:save.currentLevel,dead:game.player.dead};
   })()`,true);
   if(!result.premiumWorks||!result.customQuote||!result.dashWorks||!result.settingsWorks||!result.storeBlocked||!result.shopWorks||!result.moved||result.deaths!==1||!result.audio||!result.fullscreen||result.dead||result.level!==1)throw Error(JSON.stringify(result));
   const capture=await win.webContents.capturePage();
   const output=process.env.HELLRUN_VERIFY_DIR||path.resolve('verification');
   fs.mkdirSync(output,{recursive:true});fs.writeFileSync(path.join(output,'windows-game.png'),capture.toPNG());fs.writeFileSync(path.join(output,'windows-smoke.json'),JSON.stringify(result,null,2));app.exit(0);
  }catch(error){console.error(error);app.exit(1);}
 }
});
app.on('window-all-closed',()=>app.quit());
setTimeout(()=>{if(smoke){console.error('Smoke test timed out');app.exit(1);}},30000).unref();
