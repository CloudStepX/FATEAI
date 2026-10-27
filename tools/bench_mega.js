// Speed of normal vs mega mode on a synthetic library.  node tools/bench_mega.js [clusters] [leavesPerCluster]
const fs=require('fs'),H=require('./harness.js'),A='app/src/main/assets/brain.js';
const nc=+process.argv[2]||300,lp=+process.argv[3]||160;
function lib(mega){const win={SEED:{},MEGA:mega};const L=new Function('window',fs.readFileSync(A,'utf8')+';return Library')(win);const l=new L();l.data=l.arrange(H.makeData(nc,lp));return l}
for(const mega of[false,true]){
  let t=performance.now();const l=lib(mega);l.build();const bt=performance.now()-t;
  const qs=H.makeQuestions(H.makeData(nc,lp),200);t=performance.now();for(const q of qs)l.think(q);const qt=(performance.now()-t)/qs.length;
  t=performance.now();for(let i=0;i<20;i++)l.teach('question number '+i+' alpha','answer '+i);const tt=(performance.now()-t)/20;
  t=performance.now();for(let i=0;i<10;i++)l.feed('Fresh note number '+i+' about quartz and basalt rocks in the valley.','Notes'+(i%3));const ft=(performance.now()-t)/10;
  console.log((mega?'mega  ':'normal')+`  ${nc*lp} leaves: build ${bt.toFixed(0)} ms, question ${qt.toFixed(2)} ms, teach ${tt.toFixed(1)} ms, feed ${ft.toFixed(1)} ms`)}
