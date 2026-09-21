'use strict';
const Scenery={
 themes:[
  ['#090813','#28101f','#241329','#da624b','#695066','#591129','#fc6442'],
  ['#061a28','#1b4559','#17354b','#b9f7ff','#87d9e5','#173c63','#80dcff'],
  ['#180d0b','#4a2214','#301b18','#ffa244','#977153','#632715','#ffb14a'],
  ['#101329','#424962','#292e4e','#cee5ff','#9b97b8','#252045','#9186ff'],
  ['#051b1c','#153933','#0b282a','#a1df91','#658779','#093d32','#7ce7ac'],
  ['#19120d','#362720','#291e1d','#d9b579','#a28960','#483315','#ffe29a'],
  ['#071221','#253958','#152340','#83e6d6','#7aa6cc','#142e59','#a2cbff'],
  ['#1a1128','#3e294c','#291d3d','#e8bdff','#ad91b8','#342044','#e0a9ff'],
  ['#080d23','#152739','#111c38','#59f4db','#496883','#172452','#df6eff'],
  ['#080610','#20102e','#180e24','#ba87ff','#745286','#301141','#df8dff']
 ],
 palette(index){const p=this.themes[index]||this.themes[0];return{top:p[0],bottom:p[1],structure:p[2],speck:p[3],stone:p[4],lava:p[5],edge:p[6]};},
 background(ctx,index,W,H,camX,camY,tick,motion){
  const p=this.palette(index),t=motion?tick:0,mod=(n,m)=>(n%m+m)%m;
  const bg=ctx.createLinearGradient(0,0,0,H);bg.addColorStop(0,p.top);bg.addColorStop(1,p.bottom);ctx.fillStyle=bg;ctx.fillRect(0,0,W,H);
  ctx.save();ctx.fillStyle=p.structure;ctx.strokeStyle=p.stone;ctx.lineWidth=2;
  for(let i=0;i<12;i++){
   const x=mod(i*137-camX*.18,W+220)-100,y=H*.18+(i%3)*42-camY*.025;
   if(index===1||index===6){
    ctx.beginPath();ctx.moveTo(x,-10);ctx.lineTo(x+28,y+35);ctx.lineTo(x+58,-10);ctx.fill();
    ctx.beginPath();ctx.moveTo(x-20,H);ctx.lineTo(x+20,H-65-i%3*45);ctx.lineTo(x+70,H);ctx.fill();
   }else if(index===4){
    ctx.fillRect(x,y,16,H);ctx.beginPath();ctx.moveTo(x-55,y+75);ctx.lineTo(x+8,y-35);ctx.lineTo(x+70,y+75);ctx.fill();ctx.beginPath();ctx.moveTo(x-75,y+120);ctx.lineTo(x+8,y);ctx.lineTo(x+85,y+120);ctx.fill();
   }else if(index===2||index===5){
    ctx.fillRect(x,y+40,14,H);ctx.save();ctx.translate(x+7,y+45);ctx.rotate(t*.003*(i%2?1:-1));ctx.beginPath();for(let j=0;j<32;j++){const a=j*Math.PI/16,r=j%2?33:42;j?ctx.lineTo(Math.cos(a)*r,Math.sin(a)*r):ctx.moveTo(r,0);}ctx.closePath();ctx.fill();ctx.fillStyle=p.bottom;ctx.beginPath();ctx.arc(0,0,20,0,Math.PI*2);ctx.fill();ctx.restore();
   }else if(index===3){
    ctx.globalAlpha=.35;ctx.beginPath();ctx.ellipse(x,y+85,70,13,0,0,Math.PI*2);ctx.fill();ctx.globalAlpha=1;ctx.fillRect(x,y+150,38,35);ctx.fillRect(x-8,y+147,54,6);
   }else if(index===8){
    ctx.fillRect(x,y,65,H);ctx.globalAlpha=.2;ctx.beginPath();ctx.moveTo(x+12,H);ctx.lineTo(x+12,y+30);ctx.lineTo(x+50,y+30);ctx.lineTo(x+50,y+100);ctx.stroke();ctx.globalAlpha=1;
   }else if(index===9){
    ctx.globalAlpha=.35;ctx.beginPath();ctx.ellipse(x+50,y+60,35,70,Math.sin(i+t*.002)*.6,0,Math.PI*2);ctx.stroke();ctx.globalAlpha=1;
   }else{
    ctx.fillRect(x,y,46,H);ctx.fillRect(x-6,y,58,8);ctx.fillStyle=p.bottom;ctx.fillRect(x+13,y+35,20,48);ctx.fillStyle=p.structure;
    if(index===7){ctx.beginPath();ctx.moveTo(x-26,y);ctx.lineTo(x+23,y-28);ctx.lineTo(x+72,y);ctx.fill();}
   }
  }
  if(index===6){ctx.globalAlpha=.12;ctx.fillStyle=p.speck;for(let i=0;i<6;i++){ctx.beginPath();ctx.ellipse(W*.55,H*.14+i*8,W*.7,8,.1+Math.sin(t*.001)*.06,0,Math.PI*2);ctx.fill();}}
  ctx.fillStyle=p.speck;for(let i=0;i<34;i++){const x=mod(i*83.17-camX*.35,W+10),y=mod(i*61.3+(index===1?1:-1)*t*.2-camY*.07,H+10);ctx.globalAlpha=.12+(i%4)*.08;ctx.fillRect(x,y,i%4===0?2:1,2);}
  ctx.restore();
 }
};
