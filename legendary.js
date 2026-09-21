'use strict';
(function(root){
 // Original geometric armour designs. No character images or external assets.
 // All animation is cosmetic and stays independent of the physics engine.
 function draw(c,s,pose={}){
  const motion=pose.motion!==false,t=motion?(pose.tick||0):0;
  const mode=pose.dash?'dash':pose.walking&&pose.grounded!==false?'walk':'idle';
  const dash=mode==='dash',walk=mode==='walk',beat=Math.sin(t*.23),stride=walk?Math.round(Math.sin(t*.55)*3):0;
  const a=s.accent,b=s.coat,g=s.aura,d=s.pants,white='#f5f6e8';
  const r=(x,y,w,h,color)=>{c.fillStyle=color;c.fillRect(Math.round(x),Math.round(y),w,h);};
  const poly=(p,color)=>{c.fillStyle=color;c.beginPath();p.forEach(([x,y],i)=>i?c.lineTo(x,y):c.moveTo(x,y));c.closePath();c.fill();};
  const line=(p,color,width=1)=>{c.strokeStyle=color;c.lineWidth=width;c.beginPath();p.forEach(([x,y],i)=>i?c.lineTo(x,y):c.moveTo(x,y));c.stroke();};
  const gem=(x,y,size,color)=>poly([[x,y-size],[x+size*.65,y],[x,y+size],[x-size*.65,y]],color);
  const ring=(x,y,rx,ry,color)=>{c.strokeStyle=color;c.lineWidth=1;c.beginPath();c.ellipse(x,y,rx,ry,0,0,Math.PI*2);c.stroke();};
  const gear=(x,y,size,color,angle=0)=>{
   const p=[];for(let i=0;i<32;i++){const q=angle+i*Math.PI/16,v=i%4<2?size:size*.78;p.push([x+Math.cos(q)*v,y+Math.sin(q)*v]);}poly(p,color);ring(x,y,size*.56,size*.56,d);gem(x,y,size*.23,g);
  };
  // Back pieces unfold during walking and lock into a larger dash form.
  const spread=dash?14:walk?6+beat*2:0;
  switch(s.theme){
   case 'sun':
    ring(12,12,15+spread*.35,18,a);
    for(let side of [-1,1])for(let i=0;i<3;i++){const x=12+side*(14+spread*.65);poly([[x,5+i*6],[x+side*(5+spread*.5),i*5-4],[x+side*2,12+i*5],[12+side*8,20+i*2]],i%2?a:b);}
    break;
   case 'void':
    for(let side of [-1,1])for(let i=0;i<3;i++)poly([[12+side*8,13+i*3],[12+side*(19+spread)-i*side*3,4+i*10],[12+side*(13+spread*.7),18+i*6]],i%2?b:a);
    if(walk||dash)ring(12,17,19+spread*.4,8+beat,a);break;
   case 'frost':
    for(let side of [-1,1])for(let i=0;i<3;i++)poly([[12+side*8,16+i*3],[12+side*(18+spread*.6-i*3),-4+i*9],[12+side*(13+spread*.35),26+i*3]],i%2?g:b);
    break;
   case 'clock':
    gear(12,15,17+spread*.3,b,t*.018);gear(-1-spread*.4,17,7,a,-t*.05);gear(25+spread*.4,17,7,a,t*.05);break;
   case 'storm':
    for(let side of [-1,1])poly([[12+side*8,13],[12+side*(18+spread),1],[12+side*(15+spread),11],[12+side*(22+spread*.5),8],[12+side*13,30],[12+side*10,22]],b);
    for(let side of [-1,1])line([[12+side*12,16],[12+side*(17+spread*.7),9],[12+side*14,21]],g,2);break;
   case 'drake':
    for(let side of [-1,1]){poly([[12+side*9,12],[12+side*(18+spread),2],[12+side*(24+spread*.5),18],[12+side*18,16],[12+side*16,24],[12+side*9,26]],b);line([[12+side*9,12],[12+side*(18+spread),2],[12+side*16,24]],a);}
    poly([[6,24],[-7,31],[-15,25],[-9,27],[2,20]],a);break;
   case 'briar':
    for(let side of [-1,1]){line([[12+side*6,29],[12+side*15,16],[12+side*(18+spread*.7),-2]],b,3);for(let i=0;i<3;i++)poly([[12+side*14,20-i*6],[12+side*(23+spread*.6),15-i*7],[12+side*17,23-i*7]],i%2?g:a);}
    break;
   case 'tide':
    for(let side of [-1,1]){poly([[12+side*8,10],[12+side*(21+spread),12],[12+side*(16+spread*.3),21],[12+side*12,31],[12+side*6,25]],b);line([[12+side*10,13],[12+side*(18+spread*.6),16],[12+side*10,27]],g);}
    poly([[9,25],[2-beat*3,35],[12,31],[22+beat*3,35],[17,24]],a);break;
   case 'prism':
    for(let side of [-1,1])for(let i=0;i<3;i++){const x=12+side*(14+spread*.65-i*2),y=3+i*10;gem(x,y,8+i%2*2,[a,g,'#ffa8c9'][i]);gem(x-1,y-2,3,white);}break;
   case 'obsidian':
    for(let side of [-1,1]){poly([[12+side*6,11],[12+side*(14+spread*.5),1],[12+side*(21+spread*.4),13],[12+side*19,27],[12+side*8,25]],b);line([[12+side*12,7],[12+side*15,16],[12+side*10,21]],g,2);}
    break;
   case 'star':
    ring(12,14,18+spread*.7,11,a);ring(12,14,12,22+spread*.3,b);
    for(let i=0;i<3;i++){const q=t*.025+i*Math.PI*2/3;gem(12+Math.cos(q)*(18+spread*.7),14+Math.sin(q)*11,3,g);}break;
   case 'light':
    for(let side of [-1,1])for(let i=0;i<3;i++){const x=12+side*(12+i*3+spread*.55);poly([[x,6+i*4],[x+side*4,1+i*3],[x+side*5,20+i*2],[x,25+i*2]],i%2?a:b);r(x,10+i*3,2,8,g);}
    ring(12,-5,9+spread*.15,3,g);break;
  }
  // Armoured body: opaque chest and boots keep the player readable over traps.
  c.save();if(dash){c.translate(5,3);c.transform(1,0,-.18,.9,0,0);}
  const step=dash?4:stride;
  r(4+step,25,6,6,b);r(14-step,25,6,6,b);r(2+step,30,9,3,d);r(13-step,30,9,3,d);
  r(3+step,29,7,2,a);r(14-step,29,7,2,a);
  poly([[5,13],[19,13],[22,24],[18,28],[6,28],[2,24]],d);
  poly([[5,13],[19,13],[18,22],[12,27],[6,22]],b);
  line([[7,15],[12,18],[17,15]],a,2);gem(12,21,4,g);r(12,19,1,3,white);
  poly([[1,13],[6,12],[7,19],[1-stride*.3,24],[-2-stride*.3,22]],a);
  poly([[18,12],[23,13],[26+stride*.3,22],[22+stride*.3,25],[18,19]],a);
  r(-1-stride*.3,23,5,4,d);r(21+stride*.3,24,5,4,d);
  // Twelve separate helmet silhouettes; no human faces or franchise costume marks.
  switch(s.theme){
   case 'sun':
    poly([[4,0],[9,-4],[18,-4],[22,2],[20,11],[12,15],[4,10]],b);ring(12,3,8,8,a);r(9,-7,6,3,a);r(1,1,3,5,a);r(21,1,3,5,a);r(8,4,9,4,d);r(10,5,6,1,g);break;
   case 'void':
    poly([[5,-3],[12,-9],[20,-3],[22,7],[12,15],[2,7]],d);poly([[5,-3],[12,-9],[12,15],[2,7]],b);gem(14,3,5,g);r(13,1,2,3,white);break;
   case 'frost':
    poly([[4,1],[8,-3],[17,-3],[22,2],[19,12],[12,15],[5,11]],b);for(const side of [-1,1])poly([[12+side*6,3],[12+side*12,-9],[12+side*8,-6],[12+side*7,-12],[12+side*4,-2]],a);r(7,5,12,3,d);r(8,5,10,1,g);gem(12,11,3,g);break;
   case 'clock':
    gear(12,3,11,a,-t*.03);r(6,-3,13,14,b);ring(12,4,5,5,d);line([[12,0],[12,4],[16,6]],g,2);r(7,11,12,3,d);r(10,-7,6,3,a);break;
   case 'storm':
    poly([[2,3],[6,-5],[13,-8],[12,-3],[21,-1],[24,7],[18,13],[5,12]],b);poly([[13,3],[23,5],[28,9],[17,9]],a);line([[5,4],[11,6],[16,3]],g,2);poly([[5,0],[1,-7],[9,-3]],a);break;
   case 'drake':
    poly([[4,1],[18,-1],[23,5],[20,13],[6,13],[2,7]],b);poly([[5,3],[-1,-6],[4,-4],[9,1]],a);poly([[17,1],[23,-8],[23,-2],[20,6]],a);r(8,5,4,2,g);r(17,5,4,2,g);poly([[7,10],[13,15],[19,10]],a);break;
   case 'briar':
    poly([[4,-1],[18,-2],[22,4],[18,13],[6,14],[2,7]],b);line([[5,4],[2,-5],[-2,-7]],a,3);line([[17,3],[21,-6],[26,-9]],a,3);poly([[3,-4],[8,-9],[8,-2]],g);poly([[21,-5],[17,-10],[16,-4]],g);r(7,5,4,2,g);r(16,4,4,2,g);line([[9,9],[12,12],[15,8]],a);break;
   case 'tide':
    poly([[3,2],[10,-3],[20,0],[23,7],[18,13],[5,12]],b);poly([[6,3],[12,-10],[15,-1],[24,1],[18,5]],a);poly([[5,6],[19,4],[18,9],[8,10]],d);line([[7,6],[17,5]],g,2);r(8,12,10,2,a);break;
   case 'prism':
    poly([[3,1],[9,-5],[18,-4],[23,3],[17,13],[9,15],[3,9]],a);poly([[9,-5],[18,-4],[17,13],[9,15]],b);poly([[9,-5],[3,1],[9,15],[12,3]],g);gem(18,4,3,white);gem(3,-4,4,'#ffa8c9');break;
   case 'obsidian':
    poly([[1,0],[6,-5],[20,-4],[24,3],[23,13],[3,14]],d);poly([[1,0],[6,-5],[10,-1],[8,12],[3,14]],b);poly([[11,-2],[20,-4],[24,3],[20,11],[10,12]],b);line([[8,-1],[11,4],[9,8],[15,9],[14,13]],g,2);r(15,3,6,2,g);break;
   case 'star':
    poly([[4,0],[9,-5],[18,-5],[23,1],[21,11],[13,15],[4,10]],b);poly([[6,1],[10,-2],[18,-2],[20,2],[18,9],[12,12],[6,8]],d);gem(13,4,5,g);line([[8,4],[18,4]],white);ring(12,4,14,5,a);break;
   case 'light':
    poly([[4,-2],[20,-2],[22,9],[16,14],[8,14],[2,9]],b);r(5,-3,14,2,a);poly([[8,0],[16,0],[14,12],[10,12]],d);r(11,1,2,9,g);r(5,6,14,2,g);break;
  }
  c.restore();
  // Effects only for SS+: a bounded, local footprint avoids hiding nearby hazards.
  if(motion&&(walk||dash)){
   c.save();c.globalAlpha*=dash?.72:.5;
   for(let i=0;i<(dash?5:3);i++){
    const phase=(t*.15+i*.71)%1,x=dash?-7-i*6-phase*4:1+i*10,y=dash?12+Math.sin(i*2+t*.12)*5:33-phase*5;
    switch(s.theme){
     case 'sun':line([[x-3,y],[x+3,y]],a,2);line([[x,y-3],[x,y+3]],g);break;
     case 'void':ring(x,y,3+phase*2,2,g);gem(x,y,1,a);break;
     case 'frost':gem(x,y,3+phase,a);line([[x-3,y],[x+3,y]],g);break;
     case 'clock':gear(x,y,3,a,t*.1+i);break;
     case 'storm':line([[x-4,y-3],[x,y],[x-2,y+2],[x+4,y-1]],g,1.5);break;
     case 'drake':poly([[x-5,y+2],[x-2,y-4],[x,y-1],[x+4,y+3]],a);gem(x,y,2,g);break;
     case 'briar':poly([[x-4,y],[x,y-3],[x+4,y],[x,y+2]],g);line([[x-3,y],[x+2,y]],b);break;
     case 'tide':poly([[x,y-4],[x+3,y+1],[x,y+3],[x-2,y+1]],g);break;
     case 'prism':gem(x,y,3,[a,g,'#ffa8c9'][i%3]);break;
     case 'obsidian':poly([[x-3,y-1],[x,y-3],[x+3,y+1],[x-2,y+3]],b);r(x,y,2,2,g);break;
     case 'star':line([[x-3,y],[x+3,y]],g);line([[x,y-3],[x,y+3]],a);r(x,y,1,1,white);break;
     case 'light':r(x-2,y-2,4,4,a);r(x-1,y-1,2,2,g);break;
    }
   }c.restore();
  }
 }
 const api=Object.freeze({draw});
 if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.HellRunLegendary=api;
})(typeof globalThis!=='undefined'?globalThis:this);
