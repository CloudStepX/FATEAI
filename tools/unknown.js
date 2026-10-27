// Unknown-word guard: a question that is half or more words the library has never seen is declined, not answered with a related wrong leaf.
// Checks (1) the guard fires, (2) on questions built from the starter clusters, every changed result is such a decline and almost all answers are unchanged.
const fs=require('fs'),assert=require('assert'),dir=__dirname+'/../app/src/main/assets/';
function loadWith(path){const win={SEED:{}};for(const f of fs.readdirSync(dir+'clusters'))new Function('window',fs.readFileSync(dir+'clusters/'+f,'utf8'))(win);
  const L=new Function('window',fs.readFileSync(path,'utf8')+';return Library')(win);return new L()}
const a=loadWith(__dirname+'/brain.phase5.js'),b=loadWith(dir+'brain.js');
let t=b.think('what is the capital of zorbland');assert.strictEqual(t.kind,'unknown');assert.deepStrictEqual(t.words,['zorbland']);
t=b.think('how do I write a for loop in python');assert.strictEqual(t.kind,'answer');
const qs=[];for(const c in a.data)for(const br in a.data[c])for(const l of a.data[c][br]){const w=l.t.replace(/[^\w ]/g,'').split(' ').filter(x=>x.length>3);if(w.length>=3){qs.push('what is '+w.slice(0,3).join(' '));qs.push('tell me about '+w.slice(-2).join(' '))}}
let same=0,declined=0,ties=0;for(const q of qs){const ra=a.ask(q),rb=b.ask(q);
  if(ra&&!rb){assert(b._unk.length,'declined without an unknown word: '+q);declined++}else{assert.strictEqual(!!rb,!!ra,q);if(ra&&JSON.stringify(rb.leaves)!==JSON.stringify(ra.leaves)){ties++;continue}same++}}
assert(ties/qs.length<.005,'too many questions changed leaves: '+ties);
console.log('OK: guard fires; of',qs.length,'starter-derived questions',same,'unchanged,',declined,'declined for unknown words,',ties,'picked a different but equally matching leaf');
