const {load,makeData,rng}=require('./harness');const assert=require('assert');
const L=load(''+__dirname+'/../app/src/main/assets/brain.js'),R=rng(5);
const lib=new L();lib.data=makeData(60,40,2);lib.build();
const fresh=c=>{const m=new Map(),A=lib.kw[c];for(const x of A)for(const[k]of lib.fib.get(x))if(k!==c)m.set(k,(m.get(k)||0)+1);return m};
const eq=(x,y)=>{assert.strictEqual(x.size,y.size);for(const[k,v]of x)assert.strictEqual(y.get(k),v)};
let rounds=0,rows=0;
for(let r=0;r<400;r++){
  for(const c of Object.keys(lib.reg))if(R()<.3)lib.counts(c);            // warm random rows
  const burst=1+Math.floor(R()*4);                                          // several edits before the next read
  for(let e=0;e<burst;e++){const names=Object.keys(lib.data),c=names[Math.floor(R()*names.length)],k=R();
    if(k<.12&&Object.keys(lib.data).length>30){delete lib.data[c];lib.commit(c)}
    else if(k<.45){lib.data['N'+r+'_'+e]={B:[{t:'w'+Math.floor(R()*50).toString(36)+'x w3x extra'+r+' bits.',k:'',w:1}]};lib.commit('N'+r+'_'+e)}
    else{const br=Object.keys(lib.data[c]||{B:1})[0];if(lib.data[c]){lib.data[c][br].push({t:'w'+Math.floor(R()*70).toString(36)+'x w9x more'+r+'.',k:'',w:1});lib.commit(c)}}}
  for(const c of Object.keys(lib.reg)){if(R()<.5){eq(lib.counts(c),fresh(c));rows++}}
  rounds++}
console.log('OK: cached counts equal a full recount after',rounds,'rounds of edits;',rows,'rows checked; cluster',Object.keys(lib.reg).length);
process.exit(0)
