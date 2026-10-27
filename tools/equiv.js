// Old (phase 5) vs new engine must give identical neighbours and identical answers, through edits and learning.
const {load,makeData,makeQuestions,rng}=require('./harness');
const Old=load(''+__dirname+'/brain.phase5.js'),New=load(''+__dirname+'/../app/src/main/assets/brain.js');
const assert=require('assert');
const data=makeData(120,80,3),R=rng(99);
const a=new Old(),b=new New();for(const l of[a,b]){l.data=JSON.parse(JSON.stringify(data));l.build()}
const qs=makeQuestions(data,300,11);let checked=0,edits=0;
const cmpNeighbors=()=>{for(const c of Object.keys(a.reg)){assert.deepStrictEqual(b.neighbors(c),a.neighbors(c),'neighbors differ for '+c);checked++}};
const strip=r=>r&&JSON.parse(JSON.stringify(r,(k,v)=>k==='ms'||k==='time'||k==='unk'?undefined:v));
for(let i=0;i<qs.length;i++){
  // every 10 questions: an edit of a random kind, applied to both
  if(i%10===5){const names=Object.keys(a.data),c=names[Math.floor(R()*names.length)],kind=Math.floor(R()*4);edits++;
    for(const l of[a,b]){
      if(kind===0){const br=Object.keys(l.data[c])[0];l.data[c][br].push({t:'shared w3x w9x fresh'+i+'zz words '+c.toLowerCase()+' extra.',k:'',w:1})}
      else if(kind===1){l.teach('question '+i+' w5x',' answer w5x w7x '+i+'qq')}
      else if(kind===2&&names.length>100){delete l.data[c]}
      else{l.data['New'+i]={Only:[{t:'w1x w2x w3x brandnew'+i+' thing.',k:'',w:1}]}}
      l.commit(kind===1?'Taught':kind===2?c:kind===0?c:'New'+i)}
    cmpNeighbors()}
  const ra=a.ask(qs[i]),rb=b.ask(qs[i]);
  assert.deepStrictEqual(strip(rb),strip(ra),'answer differs on q'+i+': '+qs[i]);
  if(i%25===0)cmpNeighbors();
}
cmpNeighbors();
assert.deepStrictEqual(b.links,a.links,'synapses differ');
console.log('OK: identical answers for',qs.length,'questions,',edits,'edits,',checked,'neighbour lists compared, synapses',Object.keys(a.links).length);
process.exit(0)
