'use strict';
(function(root){
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
 // Display names changed in 2.4; stable IDs preserve existing purchases.
 // Renaming does not grant rights to a character likeness.
 add('naruto','Kael','SS+',100000,'#ffd44e','#f98422','#202738','naruto',{pants:'#e87825',aura:'#ffb23b'});
 add('madara','Orox','SS+',100000,'#171624','#9b283d','#d5515c','madara',{cape:'#251b2b',aura:'#815ce6'});
 add('sasuke','Veyr','SS+',100000,'#1b2033','#d6dbea','#9674d5','sasuke',{weapon:'sword',aura:'#9682ff'});
 add('minato','Solen','SS+',100000,'#f6d451','#456678','#ff6153','minato',{cape:'#f0e6d6',aura:'#ffde6f'});
 add('gojo','Vaelis','SS+',100000,'#eef3ff','#26243f','#86ddff','gojo',{aura:'#91c8ff'});
 add('sukuna','Kargen','SS+',100000,'#ec8793','#eee8df','#b82945','sukuna',{aura:'#f45872'});
 add('luffy','Ruko','SS+',100000,'#252030','#d83c46','#f5cb66','luffy',{pants:'#347fa8',aura:'#edbc67'});
 add('zoro','Verdak','SS+',100000,'#70b96a','#287955','#b54850','zoro',{weapon:'triple',aura:'#7be7af'});
 add('ichigo','Ignar','SS+',100000,'#f59131','#242331','#e4e8ee','ichigo',{weapon:'greatsword',aura:'#e9a746'});
 add('aizen','Aevon','SS+',100000,'#79513d','#eee9e6','#292438','aizen',{cape:'#eee9e6',aura:'#c7b4ff'});
 add('kakashi','Kairo','SS+',100000,'#bfcbd8','#637b62','#293346','kakashi',{aura:'#9ed4ff'});
 add('jiraya','Joren','SS+',100000,'#eee9e7','#a73840','#68836a','jiraya',{cape:'#b44649',aura:'#f5a276'});
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
 const byId=Object.freeze(Object.fromEntries(catalog.map(s=>[s.id,s])));
 Object.freeze(catalog);
 const get=id=>Object.prototype.hasOwnProperty.call(byId,id)?byId[id]:null;
 function draw(ctx,id,x,y,pose={}){
  const s=get(id)||byId.default,t=pose.tick||0,stride=pose.walking&&pose.grounded!==false?Math.round(Math.sin(t*.55)*3):0;
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
  if(s.weapon==='triple')for(let i=0;i<3;i++){r(-4+i*3,20+i,2,15,'#252538');r(-5+i*3,19+i,4,2,s.accent);}
  r(4+stride,25,6,7,s.pants);r(14-stride,25,6,7,s.pants);r(3+stride,30,8,3,'#141524');r(13-stride,30,8,3,'#141524');
  r(4,15,17,12,s.coat);r(1,17,5,8,s.coat);r(20,17,4,8,s.coat);r(2,23,3,4,s.skin);r(21,23,3,4,s.skin);r(6,24,13,3,s.accent);
  r(5,4,15,13,s.skin);r(3,8,3,5,s.skin);r(19,8,3,5,s.skin);r(6,15,13,2,'#d7967f');r(9,10,2,2,'#242134');r(16,10,2,2,'#242134');
  const long=['madara','jiraya'].includes(s.feature);
  if(long){r(2,3,4,17,s.hair);r(20,3,4,18,s.hair);poly([[3,9],[-1,20],[5,18]],s.hair);poly([[21,10],[27,22],[20,20]],s.hair);}
  if(['cap','helmet','luffy','pirate'].includes(s.feature))r(5,2,16,5,s.hair);
  else{
   poly([[3,6],[5,0],[8,2],[10,-3],[13,1],[17,-2],[19,2],[23,0],[21,7],[17,5],[14,8],[10,5],[6,7]],s.hair);
   if(s.feature==='aizen'){r(5,0,15,4,s.hair);r(16,3,3,5,s.hair);}
  }
  switch(s.feature){
   case 'naruto':
    r(4,5,18,3,'#25374b');r(9,5,9,3,'#b9c6d3');r(12,6,3,1,'#566375');r(6,12,3,1,'#8e584b');r(17,13,3,1,'#8e584b');r(12,17,2,8,'#202738');r(7,18,4,3,'#202738');break;
   case 'madara':
    for(let a=0;a<3;a++){r(4,17+a*4,17,3,s.coat);r(5,17+a*4,15,1,s.accent);}r(0,16,5,6,s.coat);r(21,16,5,6,s.coat);r(9,10,2,2,'#ff586c');r(16,10,2,2,'#ff586c');break;
   case 'sasuke':
    r(7,15,3,9,'#c9d5e7');r(16,15,3,9,'#c9d5e7');r(11,17,4,6,s.skin);r(3,24,20,3,s.accent);r(16,26,3,5,s.accent);r(17,9,2,2,'#dd4d64');break;
   case 'minato':
    r(5,5,15,3,'#283e55');r(9,5,9,3,'#c1cddd');r(2,17,4,13,s.cape);r(20,17,3,13,s.cape);for(let i=0;i<4;i++)poly([[2+i*6,29],[4+i*6,24],[6+i*6,30]],s.accent);r(11,18,6,6,'#789381');break;
   case 'gojo':
    r(3,7,19,5,'#151626');r(5,8,15,1,'#454054');r(5,15,17,4,'#302b4b');r(19,18,2,7,'#63516f');break;
   case 'sukuna':
    r(6,9,2,1,'#302533');r(18,9,2,1,'#302533');r(7,12,2,2,'#302533');r(17,12,2,2,'#302533');r(12,13,2,2,'#302533');poly([[6,16],[13,24],[18,16],[16,16],[13,20],[9,16]],'#302533');r(4,23,18,2,s.accent);break;
   case 'luffy':
    r(4,0,17,5,'#dca94f');r(3,4,19,2,'#b63843');r(0,6,25,3,'#e8bd60');r(10,16,6,11,s.skin);r(7,25,12,2,'#edb857');r(4,29,7,2,s.skin);r(13,29,7,2,s.skin);r(17,12,2,1,'#8e514f');break;
   case 'zoro':
    r(5,14,15,2,'#243b31');r(11,17,5,7,s.skin);r(7,23,14,4,'#9b474d');r(6,10,1,4,'#764f48');r(21,11,1,4,'#e8ce6c');break;
   case 'ichigo':
    poly([[6,16],[13,22],[20,16],[17,16],[13,19],[9,16]],'#e9e4dc');r(4,24,17,2,'#e7e3dc');poly([[5,25],[2,31],[13,28],[22,31],[20,25]],s.coat);break;
   case 'aizen':
    r(2,16,5,13,'#f4eee8');r(19,16,5,13,'#f4eee8');poly([[8,16],[13,26],[17,16]],'#2a2331');r(11,24,5,3,'#6c5983');break;
   case 'kakashi':
    r(4,5,18,4,'#394557');r(8,5,12,3,'#b1bfcc');r(9,8,4,4,'#3b4356');r(4,12,18,5,'#2c3447');r(7,17,5,6,'#8e9c7d');r(14,17,5,6,'#8e9c7d');break;
   case 'jiraya':
    r(4,5,18,4,'#a9acb9');r(10,6,6,2,'#42414c');r(7,11,2,5,'#b43d46');r(17,11,2,5,'#b43d46');r(8,17,10,10,s.accent);r(2,16,5,13,s.cape);r(20,16,4,13,s.cape);break;
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
 const api=Object.freeze({catalog,RANKS,get,draw});
 if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.HellRunSkins=api;
})(typeof globalThis!=='undefined'?globalThis:this);
