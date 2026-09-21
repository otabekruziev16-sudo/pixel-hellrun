'use strict';
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const root=path.resolve(__dirname,'..'),out=path.join(root,'release-steam/win-unpacked');
if(!fs.readFileSync(path.join(root,'build/game.html'),'utf8').includes("channel:'steam-offline',coinPreview:false"))throw Error('Build the Steam profile first');
const hash=crypto.createHash('sha256').update(fs.readFileSync(path.join(out,'resources/app.asar'))).digest('hex');
fs.writeFileSync(path.join(out,'hellrun-steam-build.json'),JSON.stringify({version:require('../package.json').version,channel:'steam-offline',executable:'HellRun Hardcore.exe',asarSha256:hash,livePayments:false},null,2));
console.log('Steam depot manifest written. No upload or publication was performed.');
