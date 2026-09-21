'use strict';
const {app,BrowserWindow,Menu}=require('electron');
const path=require('node:path'),fs=require('node:fs');
const smoke=process.argv.includes('--smoke-test');
if(smoke)app.setPath('userData',path.join(process.env.HELLRUN_VERIFY_DIR||path.resolve('verification'),'smoke-profile'));
else app.setPath('userData',path.join(app.getPath('appData'),'HellRun-Test-MOD'));
let win;
app.whenReady().then(async()=>{
 Menu.setApplicationMenu(null);
 win=new BrowserWindow({title:'HellRun MOD',width:1280,height:800,minWidth:600,minHeight:380,backgroundColor:'#08070d',autoHideMenuBar:true,icon:path.join(__dirname,'../build/icon.png'),show:!smoke,webPreferences:{nodeIntegration:false,contextIsolation:true,sandbox:true,webSecurity:true}});
 win.webContents.setWindowOpenHandler(()=>({action:'deny'}));
 win.webContents.on('will-navigate',event=>event.preventDefault());
 win.webContents.session.setPermissionRequestHandler((contents,permission,callback)=>callback(false));
 win.webContents.on('before-input-event',(event,input)=>{if(input.type==='keyDown'&&input.key==='F11'){win.setFullScreen(!win.isFullScreen());event.preventDefault();}});
 win.on('blur',()=>win.webContents.executeJavaScript('typeof pauseGame==="function" && pauseGame()').catch(()=>{}));
 await win.loadFile(path.join(__dirname,'../build/game.html'));
 if(smoke){
  try{
   const result=await win.webContents.executeJavaScript(`(async()=>{
    const balance=game.progress.wallet;await startGame(100);const before=game.player.x;game.input.right=true;for(let i=0;i<12;i++)game.step();game.clearInput();
    const moved=game.player.x>before,dashWorks=game.dash()&&game.player.dashCooldown===90;game.die();for(let i=0;i<40;i++)game.step();pauseGame();
    showSkins();$('skinActionBtn').click();$('confirmSkinBtn').click();
    const shopWorks=game.progress.equippedSkin==='sunforged'&&game.progress.wallet===balance;showMap();const openLevels=document.querySelectorAll('.level-node:not(:disabled)').length;
    showHome();const save=JSON.parse(localStorage.getItem(SAVE_KEY));
    return {channel:Build.channel,title:document.title,infiniteWallet:walletText()==='∞'&&game.progress.wallet===Core.TEST_WALLET,shopWorks,openLevels,moved,dashWorks,deaths:game.run.deaths,audio:!!Sound.context,level:save.currentLevel,dead:game.player.dead,separateSave:SAVE_KEY==='hellrun-test-mod-v1'};
   })()`,true);
   if(result.channel!=='test-mod'||!result.infiniteWallet||!result.shopWorks||result.openLevels!==100||!result.moved||!result.dashWorks||result.deaths!==1||!result.audio||result.level!==100||result.dead||!result.separateSave)throw Error(JSON.stringify(result));
   const capture=await win.webContents.capturePage();
   const output=process.env.HELLRUN_VERIFY_DIR||path.resolve('verification');
   fs.mkdirSync(output,{recursive:true});fs.writeFileSync(path.join(output,'windows-game.png'),capture.toPNG());fs.writeFileSync(path.join(output,'windows-smoke.json'),JSON.stringify(result,null,2));app.exit(0);
  }catch(error){console.error(error);app.exit(1);}
 }
});
app.on('window-all-closed',()=>app.quit());
setTimeout(()=>{if(smoke){console.error('Smoke test timed out');app.exit(1);}},30000).unref();
