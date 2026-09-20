'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const L=require('../i18n.js');
const placeholders=s=>[...s.matchAll(/\{(\w+)\}/g)].map(m=>m[1]).sort();
test('all 18 languages include every menu, game message, route name and rule',()=>{
 assert.deepEqual(new Set(L.locales.map(l=>l.code)),new Set(['uz','ru','en','ar','ko','it','de','fr','es','pt','zh','ja','tr','hi','id','nl','pl','sv']));
 for(const [code,p] of Object.entries(L.packs)){
  assert.equal(p.routes.length,10,code);assert.equal(p.rules.length,6,code);assert.ok(p.routes.every(Boolean)&&p.rules.every(Boolean));
  for(const key of L.keys){assert.ok(p.strings[key],code+':'+key);assert.deepEqual(placeholders(p.strings[key]),placeholders(L.packs.en.strings[key]),code+':'+key);}
 }
});
test('actual UI translation keys exist and runtime prices are substituted',()=>{
 const used=new Set();for(const filename of ['game.js','audio.js','index.html']){const src=fs.readFileSync(path.join(__dirname,'..',filename),'utf8');for(const match of src.matchAll(/(?:\b[TE]\(|I18n\.t\()'([^']+)'/g))used.add(match[1]);for(const match of src.matchAll(/data-i18n(?:-aria)?="([^"]+)"/g))used.add(match[1]);}
 for(const key of used)assert.ok(L.packs.en.strings[key],key);
 for(const language of L.locales){L.set(language.code);const text=L.t('buyLife',{cost:5});assert.ok(text.includes('5'));assert.equal(text.includes('{'),false);}
});
test('language selection persists, switches RTL only for Arabic and rejects unknown codes',()=>{
 const writes=[];global.document={documentElement:{lang:'',dir:''}};global.localStorage={setItem:(key,value)=>writes.push([key,value])};
 try{assert.equal(L.set('ar'),true);assert.equal(document.documentElement.dir,'rtl');assert.equal(L.nativeDialog().title,L.packs.ar.strings.exitQuestion);assert.equal(L.set('ko'),true);assert.equal(document.documentElement.dir,'ltr');assert.equal(L.set('invalid'),false);assert.equal(L.lang,'ko');assert.deepEqual(writes.at(-1),['hellrun-language','ko']);}
 finally{delete global.document;delete global.localStorage;L.set('uz');}
});
