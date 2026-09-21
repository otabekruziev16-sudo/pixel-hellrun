'use strict';
(function(root){
 const Legendary=typeof module!=='undefined'&&module.exports?require('./legendary.js'):root.HellRunLegendary;
 const RANKS=Object.freeze([
  {id:'SS+',min:100000,max:100000,color:'#ffcf68'},
  {id:'SS',min:80000,max:95000,color:'#ff8bb5'},
  {id:'S',min:60000,max:75000,color:'#b99aff'},
  {id:'A',min:40000,max:55000,color:'#7eaaff'},
  {id:'B',min:20000,max:35000,color:'#57dbce'},
  {id:'C',min:10000,max:15000,color:'#85cc8e'},
  {id:'D',min:3000,max:8000,color:'#c5bc9d'},
  {id:'E',min:500,max:2000,color:'#a3adbd'}
 ].map(Object.freeze));
 const catalog=[];
 function add(id,name,rank,price,hair,coat,accent,feature,extra={}){
  catalog.push(Object.freeze({id,name,rank,price,hair,coat,accent,feature,skin:'#f0ba94',pants:'#222332',...extra}));
 }
 add('default','HellRun','E',0,'#f04661','#80233d','#ff6577','original');
 // SS+ collection: original faceless armour, twelve distinct transformations.
 add('sunforged','Sunforged','SS+',100000,'#ffdb8d','#72582e','#edc577','legendary',{theme:'sun',aura:'#fff0bc',pants:'#2e2937'});
 add('voidregent','Void Regent','SS+',100000,'#dcbdff','#514168','#a18bd0','legendary',{theme:'void',aura:'#e3c4ff',pants:'#221b37'});
 add('frostcrown','Frostcrown','SS+',100000,'#d3ffff','#437888','#93d9dc','legendary',{theme:'frost',aura:'#daffff',pants:'#213c54'});
 add('clockwarden','Clockwarden','SS+',100000,'#ffdfa2','#6e5638','#c8a36c','legendary',{theme:'clock',aura:'#94f2d1',pants:'#302934'});
 add('stormmantle','Stormmantle','SS+',100000,'#b6d8ff','#344c7e','#8dabcd','legendary',{theme:'storm',aura:'#aef5ff',pants:'#20293f'});
 add('emberdrake','Emberdrake','SS+',100000,'#ffc597','#692e3b','#d77852','legendary',{theme:'drake',aura:'#ffdb8b',pants:'#29202e'});
 add('briarheart','Briarheart','SS+',100000,'#d6e6a1','#465440','#a2b16c','legendary',{theme:'briar',aura:'#b9ee8c',pants:'#293330'});
 add('tidemantle','Tidemantle','SS+',100000,'#c2fff3','#286677','#79c4c1','legendary',{theme:'tide',aura:'#c0ffee',pants:'#203648'});
 add('prismarch','Prismarch','SS+',100000,'#e0d4ff','#65528a','#b49be4','legendary',{theme:'prism',aura:'#a1e6e2',pants:'#322849'});
 add('obsidian','Obsidian','SS+',100000,'#fbc88a','#504450','#97838b','legendary',{theme:'obsidian',aura:'#ff9862',pants:'#251f31'});
 add('starweaver','Starweaver','SS+',100000,'#eff3ff','#494b81','#c1b4df','legendary',{theme:'star',aura:'#e5e5ff',pants:'#25233e'});
 add('lightkeeper','Lightkeeper','SS+',100000,'#fff2bf','#dadacb','#aea18c','legendary',{theme:'light',aura:'#fff2b8',pants:'#514852'});
 add('eclipse','Eclipse','SS',80000,'#e3d3ff','#312346','#b78ef4','mage',{cape:'#211730',aura:'#bd89ff'});
 add('phoenix','Phoenix','SS',85000,'#ffb854','#993340','#ffb548','phoenix',{cape:'#ce492e',aura:'#ff9662'});
 add('stormlord','Stormlord','SS',90000,'#c9efff','#334b76','#81d6f5','armor',{cape:'#253450',weapon:'spear',aura:'#90dfff'});
 add('voidwalker','Voidwalker','SS',95000,'#8280d3','#221d3a','#9d88ee','hood',{cape:'#312149',aura:'#8f78e0'});
 add('ronin','Ronin','S',60000,'#222131','#993c49','#eac697','ronin',{weapon:'sword'});
 add('frost','Frost','S',65000,'#c6eef1','#477487','#e2fcff','hood',{cape:'#304d67'});
 add('inferno','Inferno','S',70000,'#e59949','#6f2e30','#ff895c','armor',{weapon:'greatsword'});
 add('phantom','Phantom','S',75000,'#c7b9ce','#49365a','#b2e8d8','mask',{cape:'#272031'});
 add('sentinel','Sentinel','A',40000,'#584838','#53718f','#cfdae0','armor',{weapon:'spear'});
 add('raven','Raven','A',45000,'#202330','#403652','#a190c1','hood',{cape:'#272539'});
 add('ember','Ember','A',50000,'#dc7451','#803b47','#efc166','scarf');
 add('cyber','Cyber','A',55000,'#bed2d7','#283e59','#72e6ee','visor');
 add('ranger','Ranger','B',20000,'#725d35','#596e40','#c0ce82','hood');
 add('corsair','Corsair','B',25000,'#34232b','#8f4650','#e1bb76','pirate');
 add('vanguard','Vanguard','B',30000,'#796450','#47687b','#b5c9d1','armor');
 add('shinobi','Shinobi','B',35000,'#202536','#354155','#c48086','mask',{weapon:'sword'});
 add('scout','Scout','C',10000,'#945d36','#49684b','#d4b281','band');
 add('drifter','Drifter','C',12000,'#53453e','#846454','#debd88','scarf');
 add('cobalt','Cobalt','C',14000,'#4f6881','#354f87','#91bddd','visor');
 add('dusk','Dusk','C',15000,'#605776','#514662','#c5a3bf','hood');
 add('miner','Miner','D',3000,'#815737','#a97837','#efcf62','helmet');
 add('nomad','Nomad','D',5000,'#54433d','#8b674e','#b7c9ac','scarf');
 add('sailor','Sailor','D',6500,'#3e3540','#447489','#d2e5dc','cap');
 add('guard','Guard','D',8000,'#565456','#657274','#adb7b0','armor');
 add('rookie','Rookie','E',500,'#8e6247','#8e5549','#d6b393','band');
 add('moss','Moss','E',1000,'#443e35','#526e4d','#95b16e','cap');
 add('sand','Sand','E',1500,'#715039','#a48054','#e1c69c','scarf');
 add('night','Night','E',2000,'#2d293b','#494366','#aaa2cb','mask');
 // Migration aliases contain IDs only, never old artwork or display names.
 const legacy=Object.freeze({naruto:'sunforged',madara:'voidregent',sasuke:'frostcrown',minato:'clockwarden',gojo:'stormmantle',sukuna:'emberdrake',luffy:'briarheart',zoro:'tidemantle',ichigo:'prismarch',aizen:'obsidian',kakashi:'starweaver',jiraya:'lightkeeper'});
 const migrateId=id=>typeof id==='string'?(Object.prototype.hasOwnProperty.call(legacy,id)?legacy[id]:get(id)?id:null):null;
 const byId=Object.freeze(Object.fromEntries(catalog.map(s=>[s.id,s])));
 Object.freeze(catalog);
 const get=id=>Object.prototype.hasOwnProperty.call(byId,id)?byId[id]:null;
 function draw(ctx,id,x,y,pose={}){
  const s=get(id)||byId.default,t=pose.motion===false?0:pose.tick||0,stride=pose.walking&&pose.grounded!==false?Math.round(Math.sin(t*.55)*3):0;
  ctx.save();ctx.translate(Math.round(x),Math.round(y));ctx.scale(pose.scale||1,pose.scale||1);
  // Animate the sprite independently of its fixed 24×32 collision box.
  const squash=pose.landing?1-Math.min(pose.landing,7)*.012:pose.grounded===false?1.035:1;
  ctx.translate(12,32);ctx.scale(1/squash,squash);ctx.translate(-12,-32);
  if(pose.walking&&pose.grounded)ctx.translate(0,-Math.abs(stride)*.35);
  else if(pose.grounded!==false)ctx.translate(0,Math.sin(t*.055)*.4);
  if(pose.dir===-1){ctx.translate(24,0);ctx.scale(-1,1);}
  const r=(x,y,w,h,c)=>{ctx.fillStyle=c;ctx.fillRect(x,y,w,h);};
  const poly=(points,c)=>{ctx.fillStyle=c;ctx.beginPath();points.forEach(([a,b],i)=>i?ctx.lineTo(a,b):ctx.moveTo(a,b));ctx.closePath();ctx.fill();};
  ctx.fillStyle='#0006';ctx.beginPath();ctx.ellipse(12,34,14,3,0,0,Math.PI*2);ctx.fill();
  if(s.rank==='SS+'){Legendary.draw(ctx,s,pose);ctx.restore();return;}
  if(s.feature==='original'){
   r(3,11,18,17,s.coat);r(4,0,17,12,s.hair);r(1,7,22,5,s.hair);r(5,10,15,9,'#ffd6b6');r(16,12,3,4,'#2a1126');r(5,20,14,6,s.accent);r(4+stride,26,7,6,'#382f43');r(13-stride,26,7,6,'#382f43');r(20,20,4,6,'#ffd6b6');ctx.restore();return;
  }
  if(s.aura){
   ctx.globalAlpha*=.3;ctx.strokeStyle=s.aura;ctx.lineWidth=1;ctx.beginPath();ctx.ellipse(12,19,19+Math.sin(t*.05),22,0,0,Math.PI*2);ctx.stroke();
   for(let i=0;i<4;i++)r(-6+i*11,30-((t*.2+i*9)%34),2,2,s.aura);ctx.globalAlpha/= .3;
  }
  if(s.cape)poly([[3,13],[20,13],[24,30],[1-Math.round(Math.sin(t*.12)*2),29]],s.cape);
  if(s.weapon==='sword'||s.weapon==='greatsword'){
   ctx.save();ctx.translate(3,17);ctx.rotate(-.35);r(-2,-17,s.weapon==='greatsword'?5:2,27,s.weapon==='greatsword'?'#abb5c6':'#9ca8b9');r(-4,9,7,2,s.accent);r(-1,11,2,5,'#3c2b40');ctx.restore();
  }
  if(s.weapon==='spear'){r(-3,-5,2,37,'#9d7353');poly([[-5,-4],[-2,-12],[1,-4]],s.accent);}
  r(4+stride,25,6,7,s.pants);r(14-stride,25,6,7,s.pants);r(3+stride,30,8,3,'#141524');r(13-stride,30,8,3,'#141524');
  r(4,15,17,12,s.coat);r(1,17,5,8,s.coat);r(20,17,4,8,s.coat);r(2,23,3,4,s.skin);r(21,23,3,4,s.skin);r(6,24,13,3,s.accent);
  r(5,4,15,13,s.skin);r(3,8,3,5,s.skin);r(19,8,3,5,s.skin);r(6,15,13,2,'#d7967f');r(9,10,2,2,'#242134');r(16,10,2,2,'#242134');
  if(['cap','helmet','pirate'].includes(s.feature))r(5,2,16,5,s.hair);
  else{
   poly([[3,6],[5,0],[8,2],[10,-3],[13,1],[17,-2],[19,2],[23,0],[21,7],[17,5],[14,8],[10,5],[6,7]],s.hair);
  }
  switch(s.feature){
   case 'armor':
    r(0,15,6,6,s.accent);r(20,15,6,6,s.accent);r(7,17,12,5,s.accent);r(9,18,8,3,s.coat);r(10,22,4,5,s.accent);break;
   case 'hood':
    poly([[2,7],[5,0],[19,0],[23,8],[22,18],[18,17],[18,6],[7,6],[7,17],[2,18]],s.coat);r(6,13,14,4,s.accent);break;
   case 'mage':
    poly([[0,8],[8,5],[12,-6],[20,6],[26,9]],s.coat);r(5,7,17,2,s.accent);r(11,17,3,9,s.accent);break;
   case 'phoenix':
    poly([[3,15],[-7,9],[-4,19],[3,25]],'#da603b');poly([[21,15],[30,9],[28,19],[21,25]],'#da603b');r(10,17,5,6,s.accent);break;
   case 'ronin':r(4,5,18,3,s.accent);r(0,7,5,2,s.accent);r(-3,9,5,2,s.accent);poly([[7,17],[13,24],[19,17]],'#422a33');break;
   case 'mask':r(3,11,19,6,s.accent);r(7,13,12,1,s.coat);break;
   case 'visor':r(3,7,20,6,s.accent);r(5,8,16,3,'#27384b');r(5,8,8,1,'#d6ffff');r(7,18,3,5,s.accent);break;
   case 'scarf':r(3,15,20,4,s.accent);r(2,18,4,8,s.accent);poly([[3,16],[-5,19],[-8,15]],s.accent);break;
   case 'pirate':poly([[0,7],[4,1],[18,0],[25,7]],s.coat);r(0,6,25,2,s.accent);r(11,3,4,3,'#f4e9dc');r(8,10,5,3,'#252133');break;
   case 'helmet':r(3,0,19,7,s.accent);r(1,6,23,3,s.accent);r(12,2,6,5,'#fff1a9');break;
   case 'cap':r(3,0,18,7,s.accent);r(16,6,10,3,s.accent);break;
   case 'band':r(3,5,19,3,s.accent);r(1,7,3,6,s.accent);break;
  }
  ctx.restore();
 }
 const api=Object.freeze({catalog,RANKS,get,migrateId,draw});
 if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.HellRunSkins=api;
})(typeof globalThis!=='undefined'?globalThis:this);
