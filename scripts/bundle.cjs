'use strict';
const fs=require('node:fs'),path=require('node:path'),zlib=require('node:zlib');
if(process.argv.includes('--steam'))throw Error('This standalone MOD branch is not a Steam release.');
const root=path.join(__dirname,'..'),read=p=>fs.readFileSync(path.join(root,p),'utf8');
fs.mkdirSync(path.join(root,'build/android-assets'),{recursive:true});
let html=read('index.html').replace('<link rel="stylesheet" href="style.css">',()=>'<style>\n'+read('style.css')+'\n</style>');
for(const file of ['build-config.js','legendary.js','skins.js','core.js','i18n.js','audio.js','controls.js','store.js','scenery.js','game.js'])html=html.replace('<script src="'+file+'"></script>',()=>'<script>\n'+(file==='build-config.js'&&process.argv.includes('--steam')?"'use strict';globalThis.HellRunBuild=Object.freeze({channel:'steam-offline',coinPreview:false});":read(file))+'\n</script>');
fs.writeFileSync(path.join(root,'build/game.html'),html);
fs.writeFileSync(path.join(root,'build/android-assets/game.html'),html);
const side=256,raw=Buffer.alloc(side*(side*4+1));
for(let y=0;y<side;y++)for(let x=0;x<side;x++){
 let c=[10,6,13,255];
 if(x>=16&&x<240&&y>=16&&y<240)c=[43,12,25,255];
 if(x>=24&&x<232&&y>=24&&y<232)c=[13,7,16,255];
 const inside=x>=64&&x<192&&y>=52&&y<204;
 if(inside&&(x<96||x>=160||(y>=112&&y<144)))c=[255,49,85,255];
 if(inside&&y<60)c=[255,167,181,255];
 raw.set(c,y*(side*4+1)+1+x*4);
}
function crc32(data){let c=0xffffffff;for(const b of data){c^=b;for(let k=0;k<8;k++)c=(c>>>1)^((c&1)?0xedb88320:0);}return(c^0xffffffff)>>>0;}
function chunk(type,data){const name=Buffer.from(type),out=Buffer.alloc(data.length+12);out.writeUInt32BE(data.length,0);name.copy(out,4);data.copy(out,8);out.writeUInt32BE(crc32(Buffer.concat([name,data])),data.length+8);return out;}
const ihdr=Buffer.alloc(13);ihdr.writeUInt32BE(side,0);ihdr.writeUInt32BE(side,4);ihdr[8]=8;ihdr[9]=6;
const png=Buffer.concat([Buffer.from([137,80,78,71,13,10,26,10]),chunk('IHDR',ihdr),chunk('IDAT',zlib.deflateSync(raw)),chunk('IEND',Buffer.alloc(0))]);
fs.writeFileSync(path.join(root,'build/icon.png'),png);
const ico=Buffer.alloc(22);ico.writeUInt16LE(1,2);ico.writeUInt16LE(1,4);ico.writeUInt16LE(1,10);ico.writeUInt16LE(32,12);ico.writeUInt32LE(png.length,14);ico.writeUInt32LE(22,18);
fs.writeFileSync(path.join(root,'build/icon.ico'),Buffer.concat([ico,png]));
console.log('Bundled offline game and app icons.');
