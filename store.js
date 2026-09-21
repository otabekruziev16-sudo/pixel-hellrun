'use strict';
(function(root){
 // This personal build is offline. Never mint currency from a button, URL,
 // local receipt, or a client "success" callback. Live sales require verified
 // platform billing and an authoritative account wallet (see BILLING.md).
 const pack=Object.freeze({id:'hellrun_coins_10000',coins:10000,usdCents:100});
 const api=Object.freeze({pack,available:false,status:'not_connected'});
 if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.HellRunStore=api;
})(typeof globalThis!=='undefined'?globalThis:this);
