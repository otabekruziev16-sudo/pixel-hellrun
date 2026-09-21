'use strict';
(function(root){
 // A quote calculator, not a checkout or wallet API. Real purchases require
 // server verification and platform billing; see BILLING.md.
 const pack=Object.freeze({id:'hellrun_coins_10000',coins:10000,usdCents:100});
 const MAX_COINS=1000000000,COINS_PER_CENT=100;
 function quote(raw){
  if(typeof raw!=='string'&&typeof raw!=='number')return Object.freeze({ok:false});
  const text=String(raw).trim().replace(/[٠-٩۰-۹०-९０-９]/g,c=>String(c.charCodeAt(0)-(c>='０'?0xff10:c>='०'?0x966:c>='۰'?0x6f0:0x660)));
  if(!/^\d{1,10}$/.test(text))return Object.freeze({ok:false});
  const requested=Number(text);
  if(!Number.isSafeInteger(requested)||requested<1||requested>MAX_COINS)return Object.freeze({ok:false});
  // USD has cents: round the delivered quantity UP to preserve the full rate.
  const usdCents=Math.ceil(requested/COINS_PER_CENT),coins=usdCents*COINS_PER_CENT;
  return Object.freeze({ok:true,requested,coins,usdCents,rounded:coins!==requested,currency:'USD'});
 }
 const api=Object.freeze({pack,quote,MAX_COINS,COINS_PER_CENT,available:false,status:'not_connected'});
 if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.HellRunStore=api;
})(typeof globalThis!=='undefined'?globalThis:this);
