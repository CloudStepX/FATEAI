// node tools/commit_test.js : Phase 8 checks. Sections commit to the four parts of a build, the commits are checked against the file, and nothing else is disturbed.
const fs=require('fs'),A='app/src/main/assets/',D=A+'clusters/';
const win={SEED:{},MEGA:true};for(const f of fs.readdirSync(D))new Function('window',fs.readFileSync(D+f,'utf8'))(win);
const Lib=new Function('window',fs.readFileSync(A+'brain.js','utf8')+';return Library')(win);
const C=require('../'+A+'create.js'),B=require('../'+A+'build.js'),K=require('../'+A+'commit.js');
const lib=new Lib();let bad=0,n=0;const ok=(c,m)=>{n++;if(!c){bad++;console.log('FAIL',m)}};const v=process.argv[2]==='-v';
const before={last:lib.last,use:JSON.stringify(lib.use),links:JSON.stringify(lib.links),mem:JSON.stringify(lib.data.Memory||null),data:JSON.stringify(lib.data).length};
const Q=['a blue to-do list with milk, eggs and bread','a 10 minute countdown timer','a tip calculator','convert km to miles','flashcards: hola - hello; adios - goodbye','random name picker with Ann, Bob, Cy','a password generator','an expense tracker','a habit tracker','a notes app','a stopwatch','a pomodoro timer','a number guessing game','a one-page website for a bakery','a text tool',
 'write a cover letter to Sam about the barista job','write an email to my landlord','make a meeting agenda','make a workout plan','write a speech','write an invitation','draft meeting minutes','make a schedule','write an outline for an essay',
 'a yellow to-do list','a white counter','a pink notes app','a yellow tip calculator'];
let lib4=0,total=0,repairs=0;
for(const q of Q){const sp=B.specOf(C.parse(q)),r=K.settle(lib,sp,B);
 ok(r&&r.built&&r.commits.length===4,'no settle for '+q);if(!r)continue;
 ok(r.commits.map(c=>c.axis).join()==='shape,logic,look,words','axes order '+q);
 ok(r.addr.length===4&&r.addr.every(x=>x===0||x===1),'addr '+q);
 r.commits.forEach(c=>{total++;
  ok(!c.owner||(c.evidence&&c.cell&&c.cell.length===4&&c.cell.every(x=>Number.isInteger(x)&&x>=0&&x<c.side)),'bad owner data '+q+' '+c.axis);
  ok(!c.owner||c.conf>=50,'owner under 50% '+q);
  if(c.owner&&c.ok)lib4++;
  ok(c.ok,'part not kept: '+q+' / '+c.axis+' / '+(c.problems||[]).join('; '))});
 if(r.repaired)repairs++;
 if(v)console.log(q.padEnd(48),r.addr.join(''),r.commits.map(c=>(c.owner||'rules')+(c.repaired?'*':'')).join(' | '))}
ok(repairs>=1,'no repair happened for the low-contrast colours');
// the repaired yellow list really is readable; the user-chosen mode is never overridden
{const sp=B.specOf(C.parse('a yellow to-do list')),r=K.settle(lib,sp,B);ok(r.repaired&&r.spec.theme==='dark'&&r.spec.autoTheme,'yellow todo should flip to dark');ok(r.commits.find(c=>c.axis==='look').ok,'repaired yellow todo must pass Look');
 const r2=K.settle(lib,r.spec,B);ok(r2.spec.theme==='dark'&&r2.repaired,'settling a repaired spec again is stable');
 const sp3=Object.assign(B.specOf(C.parse('a yellow to-do list')),{theme:'light'}),r3=K.settle(lib,sp3,B);ok(r3.spec.theme==='light'&&!r3.spec.autoTheme,'explicit light mode must not be overridden');ok(r3.commits.find(c=>c.axis==='look').ok&&r3.spec.autoAccent&&/^#[0-9a-f]{6}$/.test(r3.spec.accent),'with the mode fixed, the accent is adjusted until it passes');
 const sp4=Object.assign({},r.spec,{color:'blue'}),r4=K.settle(lib,sp4,B);ok(r4.repaired===!!(r4.spec.autoTheme||r4.spec.autoAccent),'repair flags stay consistent after recolouring');const r5=K.settle(lib,Object.assign({},r.spec,{color:null}),B);ok(r5.commits.find(c=>c.axis==='look').ok,'recolouring back still passes')}
// a broken file fails the checks
{const sp=B.specOf(C.parse('a 10 minute countdown timer')),b=B.make(sp),bro=Object.assign({},b,{content:b.content.replace(/<script>[\s\S]*?<\/script>/,'<script>fetch("http://x")</script>').replace('<h1','<h2')}),r=K.verify(bro,sp);
 ok(r.logic.bad.length>0&&r.shape.bad.length>0,'checks must catch a network call and a missing heading')}
// 4D decode matches the engine
{const G=lib.reg.Library;let okc=0;for(const L of lib.leaves.slice(0,400)){const c=K.decode(L.cell,Math.log2(G.side));if(c.every(x=>x>=0&&x<G.side))okc++}ok(okc===400,'decode out of range')}
// the mind view's model is the library's real 4D grid
{const Mi=require('../'+A+'mind.js'),m=Mi.model(lib),G=lib.reg.Library;
 ok(m.side===G.side&&m.cellsTotal===G.side**4,'mind side');
 let filled=0;for(const x of G.occ)if(x)filled++;ok(m.filled===filled&&m.nodes.length===filled,'mind nodes equal filled cells '+m.filled+' vs '+filled);
 ok(m.leaves===lib.live,'mind leaves equal live leaves');
 ok(m.hubs.length===lib.sections().size+(lib.data.Memory?1:0)||m.hubs.length===lib.sections().size,'one hub per section');
 ok(m.hubs.every(h=>h.fill.length===16&&h.fill.reduce((a,b)=>a+b,0)===h.n),'each hub fill sums to its leaves over 16 corners');
 ok(m.nodes.every(n=>n.co.length===4&&n.co.every(c=>c>=0&&c<m.side)&&n.hub),'node coordinates are 4D and inside the grid');
 ok(m.edges.length<=2300&&m.edges.every(([i,j])=>{const a=m.nodes[i].co,b=m.nodes[j].co;let d=0;for(let k=0;k<4;k++)d+=Math.abs(a[k]-b[k]);return d===1}),'edges join cells one step apart on one axis');
 const m2=Mi.model(lib);ok(JSON.stringify(m.edges)===JSON.stringify(m2.edges)&&m.hubs.map(h=>h.name).join()===m2.hubs.map(h=>h.name).join(),'same library, same picture');
 ok(m.nodes.reduce((a,n)=>a+n.n,0)===m.hubs.filter(h=>!h.mem).reduce((a,h)=>a+h.n,0),'every Library leaf sits in exactly one filled cell')}
// no disturbance
ok(lib.last===before.last&&JSON.stringify(lib.use)===before.use&&JSON.stringify(lib.links)===before.links,'ask state changed');
ok(JSON.stringify(lib.data.Memory||null)===before.mem&&JSON.stringify(lib.data).length===before.data,'library or memory changed');
console.log(bad?bad+' FAILED':'all '+n+' checks passed','('+lib4+' of '+total+' parts committed by a section and kept; '+repairs+' repairs)');process.exit(bad?1:0)
