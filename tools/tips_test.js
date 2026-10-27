// node tools/tips_test.js [-v] : Phase 9 checks. A build takes real, relevant sentences from the library, shows where they came from, stays safe, and disturbs nothing.
const fs=require('fs'),A='app/src/main/assets/',D=A+'clusters/';
const win={SEED:{},MEGA:true};for(const f of fs.readdirSync(D))new Function('window',fs.readFileSync(D+f,'utf8'))(win);
const Lib=new Function('window',fs.readFileSync(A+'brain.js','utf8')+';return Library')(win);
const C=require('../'+A+'create.js'),B=require('../'+A+'build.js'),K=require('../'+A+'commit.js');
const lib=new Lib();let bad=0,n=0;const ok=(c,m)=>{n++;if(!c){bad++;console.log('FAIL',m)}};const v=process.argv[2]==='-v';
const before={last:lib.last,use:JSON.stringify(lib.use),links:JSON.stringify(lib.links),mem:JSON.stringify(lib.data.Memory||null),data:JSON.stringify(lib.data).length};
// [request, section the first tip should come from]
const Q=[['a 10 minute countdown timer','Coding'],['a pomodoro timer','Life and Work Skills'],['a tip calculator','Mathematics'],['flashcards: hola - hello; adios - goodbye','Writing and Study Skills'],
 ['make a note taking app','Writing and Study Skills'],['write an outline for an essay','Writing and Study Skills'],['write a speech','Language'],['write an email to my landlord','Language'],
 ['a budget tracker','Dictionary'],['a to-do list','']];
let withTips=0;
for(const[q,sec]of Q){const p=C.parse(q),t=C.tips(lib,p);
 ok(Array.isArray(t)&&t.length<=2,'tips shape '+q);
 t.forEach(x=>{ok(typeof x.t==='string'&&x.t.length>0&&x.t.length<=240,'tip length '+q);ok(typeof x.s==='string'&&x.s.length>0,'tip source '+q);ok(!/\[|\]|\b(null|undefined|NaN)\b/.test(x.t),'tip placeholder '+q)});
 if(t.length)withTips++;
 if(sec&&t.length)ok(t.some(x=>x.s.startsWith(sec)),'wrong section for '+q+': '+t.map(x=>x.s).join(' | '));
 if(v)console.log(q.padEnd(44),t.map(x=>x.s+': '+x.t.slice(0,60)).join(' || ')||'(none)');
 const sp=B.specOf(p);sp.tips=t;const r=K.settle(lib,sp,B);
 ok(r&&r.built,'settles '+q);if(!r)continue;
 r.commits.forEach(c=>ok(c.ok,'part not kept with tips: '+q+' / '+c.axis+' / '+(c.problems||[]).join('; ')));
 if(t.length){const c=r.built.content;
  if(r.built.route==='app'){ok(/<details[^>]*>.*From the library/.test(c),'details block '+q);ok(c.includes(B.make&&t[0].t.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;')),'tip text in page '+q);ok(c.includes(t[0].s.replace(/&/g,'&amp;')),'source in page '+q);
   ok([...c.matchAll(/<script>([\s\S]*?)<\/script>/g)].every(m=>{try{new Function(m[1]);return true}catch(e){return false}}),'scripts parse '+q)}
  else{ok(c.includes('From the library:')&&c.includes(t[0].t),'doc has tip '+q)}}
 else ok(!/From the library/.test(r.built.content),'no tips, no block '+q)}
ok(withTips>=8,'only '+withTips+' of '+Q.length+' requests found tips');
// a build without tips is byte-identical to before this phase (no tips field)
{const sp=B.specOf(C.parse('a to-do list with milk'));const strip=h=>h.replace(/<!--fate-create[\s\S]*?-->/,''),a=strip(B.make(sp).content),b=strip(B.make({...sp,tips:[]}).content);ok(a===b,'empty tips change nothing')}
// hostile tip text cannot break out of the page
{const sp=B.specOf(C.parse('a 10 minute countdown timer'));sp.tips=[{t:'</details><script>alert(1)</script> "x" & <b>',s:'<img src=x onerror=alert(1)>'}];const c=B.make(sp).content;
 ok(!/<script>alert\(1\)/.test(c)&&!/<img src=x/.test(c)&&!/<b>/.test(c.split('From the library')[1]||''),'tip text escaped');ok((c.match(/<\/main>/g)||[]).length===1,'one main')}
// tips survive follow-ups and are saved into the spec header
{const sp=B.specOf(C.parse('a 10 minute countdown timer'));sp.tips=C.tips(lib,C.parse('a 10 minute countdown timer'));const out=B.refine(sp,'make it purple');ok(out&&out.spec.tips.length===sp.tips.length,'refine keeps tips');
 const html=B.make(out.spec).content;ok(B.specFrom(html)&&B.specFrom(html).tips.length===sp.tips.length,'tips in saved header')}
// reading: kind words are not reported as unknown, and unrelated study leaves no longer pad the timer look-up
{const g=C.gather(lib,C.parse('a 10 minute countdown timer'));ok(!g.unknown.includes('countdown'),'countdown is not unknown');
 const g2=C.gather(lib,C.parse('a tip calculator'));ok(!g2.unknown.length,'tip calculator has no unknown words')}
// nothing else disturbed
ok(lib.last===before.last&&JSON.stringify(lib.use)===before.use&&JSON.stringify(lib.links)===before.links,'Ask state untouched');
ok(JSON.stringify(lib.data.Memory||null)===before.mem&&JSON.stringify(lib.data).length===before.data,'library and Memory untouched');
console.log(bad?bad+' problems of '+n+' checks':'all '+n+' checks passed ('+withTips+' of '+Q.length+' requests took tips from the library)');process.exit(bad?1:0)
