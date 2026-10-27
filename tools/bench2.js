const {load,makeData,makeQuestions}=require('./harness');
const [,,path,nc,lp,nq,every]=process.argv;
const Library=load(path),data=makeData(+nc,+lp);
const lib=new Library();lib.data=JSON.parse(JSON.stringify(data));lib.build();
let tn=0;const orig=lib.neighbors.bind(lib);lib.neighbors=function(c){const s=performance.now();const r=orig(c);tn+=performance.now()-s;return r};
const qs=makeQuestions(data,+nq),names=Object.keys(data);
// warm-up pass so JIT is comparable, then reset caches
for(const q of qs.slice(0,20))lib.ask(q);lib._rel=new Map();lib._ov=new Map();if(lib._cn)lib._cn=new Map();tn=0;
const t0=performance.now();let editMs=0;
for(let i=0;i<qs.length;i++){
  if(+every&&i%+every===0){const c=names[(i*7)%names.length],s=performance.now();lib.data[c].Branch0.push({t:'remember note '+i+' w3x w9x.',k:'',w:1});lib.commit(c);editMs+=performance.now()-s}
  lib.ask(qs[i])}
const tot=performance.now()-t0;
console.log(`${nc} clusters, edit every ${every||'never'}: per question ${((tot-editMs)/nq).toFixed(2)} ms (neighbours ${(100*tn/(tot-editMs)).toFixed(0)}%), edit cost ${(editMs/Math.max(1,nq/(+every||1e9))).toFixed(2)} ms each`);
process.exit(0)
