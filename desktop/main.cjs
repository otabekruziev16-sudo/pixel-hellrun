'use strict';
const {app,BrowserWindow,Menu}=require('electron');
const path=require('node:path'),fs=require('node:fs');
const smoke=process.argv.includes('--smoke-test');
let win;
app.whenReady().then(async()=>{
 Menu.setApplicationMenu(null);
 win=new BrowserWindow({title:'Pixel HellRun',width:1120,height:760,minWidth:700,minHeight:490,backgroundColor:'#050508',autoHideMenuBar:true,icon:path.join(__dirname,'../build/icon.png'),show:!smoke,webPreferences:{nodeIntegration:false,contextIsolation:true,sandbox:true,webSecurity:true}});
 win.webContents.setWindowOpenHandler(()=>({action:'deny'}));
 win.webContents.on('will-navigate',event=>event.preventDefault());
 win.webContents.session.setPermissionRequestHandler((contents,permission,callback)=>callback(false));
 win.webContents.on('before-input-event',(event,input)=>{if(input.type==='keyDown'&&input.key==='F11'){win.setFullScreen(!win.isFullScreen());event.preventDefault();}});
 win.on('blur',()=>win.webContents.executeJavaScript('typeof pauseGame==="function" && pauseGame()').catch(()=>{}));
 await win.loadFile(path.join(__dirname,'../build/game.html'));
 if(smoke){
  try{
   const result=await win.webContents.executeJavaScript('(async()=>{await startGame();const before=P.x;keys.add("right");for(let i=0;i<30;i++)update();keys.clear();const moved=P.x>before;die();for(let i=0;i<51;i++)update();return {title:document.title,moved,lives,audio:!!Sound.context,html:document.querySelector("#c").width,dead:P.dead};})()',true);
   if(!result.moved||result.lives!==2||!result.audio||result.html!==680||result.dead)throw Error(JSON.stringify(result));
   const capture=await win.webContents.capturePage();
   const output=process.env.HELLRUN_VERIFY_DIR||path.resolve('verification');
   fs.mkdirSync(output,{recursive:true});fs.writeFileSync(path.join(output,'windows-game.png'),capture.toPNG());fs.writeFileSync(path.join(output,'windows-smoke.json'),JSON.stringify(result,null,2));app.exit(0);
  }catch(error){console.error(error);app.exit(1);}
 }
});
app.on('window-all-closed',()=>app.quit());
setTimeout(()=>{if(smoke){console.error('Smoke test timed out');app.exit(1);}},30000).unref();
