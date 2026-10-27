// Tests the mega Library mode (window.MEGA=true): every cluster becomes a section of one "Library" cluster.
// Run from the project folder:  node tools/mega.js
const fs=require('fs'),A='app/src/main/assets/',D=A+'clusters/';
function mk(mega){const win={SEED:{},MEGA:mega};for(const f of fs.readdirSync(D))new Function('window',fs.readFileSync(D+f,'utf8'))(win);
  const Lib=new Function('window',fs.readFileSync(A+'brain.js','utf8')+';return Library')(win);return{win,Lib}}
let bad=0;const ok=(c,m)=>{if(!c){bad++;console.log('FAIL',m)}};
const off=mk(false),on=mk(true),a=new off.Lib(),b=new on.Lib();
const leaves=d=>Object.values(d).reduce((n,c)=>n+Object.values(c).reduce((m,x)=>m+x.length,0),0);
ok(leaves(a.data)===leaves(b.data),'leaf counts differ after folding: '+leaves(a.data)+' vs '+leaves(b.data));
ok(Object.keys(b.data).join()==='Library','everything should be in Library: '+Object.keys(b.data));
ok(b.sections().size===Object.keys(a.data).length,'one section per old cluster');
// round trip: fold then unfold gives the old clusters back
const un=mk(false);const u=new un.Lib();u.data=u.arrange(JSON.parse(JSON.stringify(b.data)));
ok(JSON.stringify(Object.keys(u.data).sort())===JSON.stringify(Object.keys(a.data).sort()),'unfold keeps cluster names');
ok(leaves(u.data)===leaves(a.data),'unfold keeps leaves');
// idempotent
ok(b.arrange(b.data)===b.data,'arrange is idempotent');
// storing: teach / feed / merge / restore / memory
b.teach('what is zorp','Zorp is a test word.');
ok(b.data.Library['Taught / what is zorp'],'teach goes to Library > Taught');
const f=b.feed('# Space\n\nMars is the fourth planet from the Sun and has two moons.','Science');
ok(b.data.Library['Science / Space']&&f.c==='Science','feed with a name makes a section');
const f2=b.feed('The tesseract skip rules out cells that cannot reach half coverage of the question words in this library.');
ok(Object.keys(b.data).every(c=>c==='Library'||c==='Memory'),'no stray clusters after feed: '+Object.keys(b.data));
b.merge({Cooking:{Eggs:[{t:'Boil an egg for nine minutes for a hard yolk.'}]}});
ok(b.data.Library['Cooking / Eggs'],'merge goes to Library');
b.store('my name is Sam','Facts');ok(b.data.Memory&&b.data.Memory.Facts,'memory stays separate');
ok(b.restore()>=0&&Object.keys(b.data).every(c=>c==='Library'||c==='Memory'),'restore stays in Library');
// auto-section for text that matches an existing section
const f3=b.feed('A syllogism has two premises and a conclusion. Deduction guarantees the conclusion when the premises are true.');
console.log('auto section for logic-like text:',f3.c);
ok(/logic/i.test(f3.c),'auto section picks Logic');
// answers
const Q=[["what is modus tollens","Modus tollens"],["difference between affect and effect","Affect is usually"],["what is a straw man","straw man"],["when do I use who and whom","whom"],["what is De Morgan's law","De Morgan"],["explain the gambler's fallacy","gambler"],["what is a comma splice","comma splice"],["what is a metaphor","metaphor"],["what is a tautology","tautology"],["how does binary search work","halving"],["what is the pigeonhole principle","pigeonhole"],["what is confirmation bias","Confirmation"],["what is a dangling modifier","dangling"],["how do I write a polite email","email"],["what is a synonym","synonym"],["what does git commit do","commit"],["how do I center something in css","center"],["what is zorp","Zorp"],["how many moons does mars have","two moons"],["how long to boil an egg","nine minutes"]];
const score=L=>{let n=0;for(const[q,e]of Q){const t=L.think(q),x=t.r?(t.r.text||'')+t.r.leaves.map(l=>l.t).join(' '):'';if(x.toLowerCase().includes(e.toLowerCase()))n++;else if(L===b)console.log('  miss (mega):',q,'->',t.kind)}return n};
// plain library for the non-mega run gets the same extra facts
a.teach('what is zorp','Zorp is a test word.');a.feed('# Space\n\nMars is the fourth planet from the Sun and has two moons.','Science');a.merge({Cooking:{Eggs:[{t:'Boil an egg for nine minutes for a hard yolk.'}]}});
const sa=score(a),sb=score(b);console.log(`questions answered right: normal ${sa}/${Q.length}, mega ${sb}/${Q.length}`);
ok(sb>=sa-1,'mega should answer about as well as normal');
// delete a section
const before=b.stats().leaves,n=b.removeSection('Science');ok(n===1&&b.stats().leaves<before,'removeSection removes its branches');
console.log(bad?bad+' problem(s)':'OK: mega library works');process.exit(bad?1:0)
