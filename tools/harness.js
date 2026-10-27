// Loads brain.js (a browser script) into Node and builds synthetic libraries.
const fs=require('fs');
function load(path){
  const src=fs.readFileSync(path,'utf8');
  const win={SEED:{}};
  return new Function('window',src+';return Library')(win);
}
// deterministic RNG
function rng(seed){let s=seed>>>0;return()=>{s=(s+0x6D2B79F5)>>>0;let t=s;t=Math.imul(t^t>>>15,t|1);t^=t+Math.imul(t^t>>>7,t|61);return((t^t>>>14)>>>0)/4294967296}}
// Synthetic library: nc clusters, each with a topic pool of words + shared common words (Zipf-ish), so clusters overlap like real ones.
function makeData(nc,leavesPer,seed=1){
  const R=rng(seed),V=4000,word=i=>'w'+i.toString(36)+'x';
  const data={};
  for(let c=0;c<nc;c++){
    const name='Cluster'+c,pool=[];for(let i=0;i<120;i++)pool.push(Math.floor(R()*V));
    const nb=4;data[name]={};
    for(let b=0;b<nb;b++){const arr=data[name]['Branch'+b]=[];
      for(let l=0;l<leavesPer/nb;l++){const ws=[];for(let i=0;i<9;i++){ws.push(R()<.6?word(pool[Math.floor(R()*pool.length)]):word(Math.floor(Math.pow(R(),3)*V)))}
        arr.push({t:ws.join(' ')+'.',k:'',w:1})}}
  }
  return data;
}
function makeQuestions(data,n,seed=7){
  const R=rng(seed),cl=Object.keys(data),qs=[];
  while(qs.length<n){const c=cl[Math.floor(R()*cl.length)],bs=Object.keys(data[c]),b=data[c][bs[Math.floor(R()*bs.length)]],l=b[Math.floor(R()*b.length)];
    const ws=l.t.replace('.','').split(' ');const k=3+Math.floor(R()*2),pick=[];while(pick.length<k)pick.push(ws[Math.floor(R()*ws.length)]);qs.push(pick.join(' '))}
  return qs;
}
module.exports={load,makeData,makeQuestions,rng};
