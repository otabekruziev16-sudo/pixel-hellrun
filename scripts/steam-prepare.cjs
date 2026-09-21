'use strict';
// Generate a local SteamPipe PREVIEW configuration. Never uploads or sets live.
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const args=process.argv.slice(2),opts={};
for(let i=0;i<args.length;i+=2){if(!['--appid','--depot','--content','--output'].includes(args[i])||!args[i+1]||opts[args[i]])throw Error('Usage: npm run steam:prepare -- --appid YOUR_ID --depot YOUR_ID --content release-steam/win-unpacked [--output steam-upload]');opts[args[i]]=args[i+1];}
for(const k of ['--appid','--depot'])if(!/^[1-9]\d{0,9}$/.test(opts[k]||'')||Number(opts[k])>4294967295)throw Error('Provide the real numeric '+k+' from your Steamworks app');
if(!opts['--content'])throw Error('--content is required');
const content=path.resolve(opts['--content']),output=path.resolve(opts['--output']||'steam-upload');
for(const p of [content,output])if(/["\r\n]/.test(p))throw Error('Paths cannot contain quotes or newlines');
if(output===content||output.startsWith(content+path.sep))throw Error('Keep SteamPipe output outside the depot content');
const manifest=JSON.parse(fs.readFileSync(path.join(content,'hellrun-steam-build.json'),'utf8'));
if(manifest.channel!=='steam-offline'||manifest.livePayments!==false||!fs.existsSync(path.join(content,'HellRun Hardcore.exe')))throw Error('Expected the complete Steam Windows depot, not the personal portable EXE');
const hash=crypto.createHash('sha256').update(fs.readFileSync(path.join(content,'resources/app.asar'))).digest('hex');
if(hash!==manifest.asarSha256)throw Error('Depot content changed after packaging');
fs.mkdirSync(output,{recursive:true});
const quote=s=>'"'+String(s).replaceAll('\\','/')+'"';
const vdf=`"AppBuild"
{
 "AppID" ${quote(opts['--appid'])}
 "Desc" "HellRun ${manifest.version} Windows offline review candidate"
 "Preview" "1"
 "ContentRoot" ${quote(content)}
 "BuildOutput" ${quote(path.join(output,'cache'))}
 "Depots"
 {
  ${quote(opts['--depot'])}
  {
   "FileMapping"
   {
    "LocalPath" "*"
    "DepotPath" "."
    "recursive" "1"
   }
  }
 }
}
`;
fs.writeFileSync(path.join(output,'app_build.vdf'),vdf);
console.log('Created '+path.join(output,'app_build.vdf')+' in preview mode. Launch option: HellRun Hardcore.exe; Windows 64-bit. Nothing uploaded.');
