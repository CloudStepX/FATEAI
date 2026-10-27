// node tools/create_build_test.js : Phase 3-6 checks. Every template builds, is safe, follow-ups work, saving round-trips.
const fs=require('fs'),A='app/src/main/assets/',D=A+'clusters/';
const C=require('../'+A+'create.js'),B=require('../'+A+'build.js');
let bad=0,n=0;const ok=(c,m)=>{n++;if(!c){bad++;console.log('FAIL',m)}};
const mk=(q,f)=>{let sp=B.specOf(C.parse(q));if(f)sp=f(sp);return{sp,r:B.make(sp)}};
// 1) every kind Create can recognise either builds or is honestly refused
const SAMPLES={todo:'a shopping list',timer:'a 3 minute timer',pomo:'pomodoro timer',stopwatch:'a stopwatch',calc:'a tip calculator',flash:'flashcards: a - b',guess:'number guessing game',picker:'random picker with a, b',password:'a password generator',expense:'an expense tracker',text:'word count tool',counter:'a tally counter',notes:'a notes app',site:'a website for my bakery'};
for(const k of C.KINDS){const q=SAMPLES[k];ok(!!q,'no sample for kind '+k);if(!q)continue;const{sp,r}=mk(q);ok(sp.kind===k,'sample for '+k+' parsed as '+sp.kind);
 ok(r&&r.route==='app','kind '+k+' builds')}
for(const d of C.DOCS){const{r}=mk({letter:'write a letter',email:'draft an email',agenda:'write a meeting agenda',minutes:'write meeting minutes',schedule:'make a weekly schedule',workout:'create a workout plan',outline:'write an essay outline',speech:'write a speech',invitation:'write an invitation'}[d]);ok(r&&r.route==='doc'&&r.content.length>40&&r.ext==='txt','doc '+d+' builds')}
// 2) every app: one file, script parses, nothing that needs a network or a dialog
const QS=['a website for my bakery','a landing page called Sunrise Yoga with classes, retreats','a to-do list','a shopping list with milk','a countdown timer','pomodoro timer','a stopwatch','a tip calculator','split the bill','loan calculator','bmi calculator','discount calculator','tax calculator','percentage calculator','a calculator','convert km to miles','convert pounds to kg','convert celsius to fahrenheit','convert mph to kmh','flashcards: hola - hello; adios - goodbye','a quiz app','track my water habit','a tally counter','random picker with Ann, Bob','a dice roller','roll 2d20','flip a coin','number guessing game between 1 and 50','a password generator','an expense tracker','a notes app','a journal','word counter'];
const FEATS=[s=>s,s=>({...s,reset:true}),s=>({...s,theme:'dark',color:'purple',size:2}),s=>({...s,theme:'light',color:'green',size:-1})];
for(const q of QS)for(const f of FEATS){const{r}=mk(q,f);ok(r&&r.route==='app','builds '+q);if(!r)continue;const h=r.content;
 ok(h.startsWith('<!doctype html>\n<!--fate-create '),'header '+q);ok(h.length<24000,'size '+q+' '+h.length);
 ok(/Content-Security-Policy[^>]*default-src 'none'/.test(h),'csp '+q);
 ok(!/\b(fetch|XMLHttpRequest|WebSocket|importScripts|eval|alert|confirm|prompt|sendBeacon)\s*\(/.test(h.replace(/<style[\s\S]*?<\/style>/,'')),'banned call in '+q);
 ok(!/(src|href)\s*=\s*["']https?:/i.test(h)&&!/url\(\s*["']?https?:/i.test(h),'external reference in '+q);
 const site=/website|landing page/.test(q),scripts=[...h.matchAll(/<script(?: type="application\/json" id="fate-data")?>([\s\S]*?)<\/script>/g)];ok(scripts.length===(site?0:2),'script tags '+q);
 if(!site){try{JSON.parse(scripts[0][1])}catch(e){ok(false,'data json '+q)}try{new Function(scripts[1][1])}catch(e){ok(false,'script syntax '+q+': '+e.message)}}
 ok((h.match(/<script/g)||[]).length===(site?0:2),'stray script tag '+q)}
// 3) hostile text cannot break out of the page
const evil='x</script><script>PWN=1</script><img src=x onerror=PWN=1>"\'`${1}\u2028-->';
for(const kind of ['a website','a to-do list','a countdown timer','flashcards: q - a','random picker','an expense tracker','a notes app','track my habit']){const{r}=mk(kind+' called '+evil,s=>({...s,title:evil,items:[evil,evil+' - '+evil],topic:evil,to:evil}));if(!r){ok(false,'evil '+kind);continue}
 const h=r.content,body=h.slice(h.indexOf('<body>'));ok((body.match(/<script/g)||[]).length===(/website/.test(kind)?0:2),'injected script tag in '+kind);ok(!/<img/i.test(body),'injected img in '+kind);ok(!/<\/title><script/.test(h),'title breakout '+kind);ok((h.match(/<!--/g)||[]).length===1&&(h.match(/-->/g)||[]).length===1,'comment breakout '+kind)}
// 4) things that were asked for are really in the output
let t=mk('a blue to-do list called Chores with milk, eggs and bread').r;ok(t.title==='Chores'&&/Milk/.test(t.content)&&/#4da3ff/.test(t.content),'todo title, items, colour');
t=mk('a 10 minute countdown timer').r;ok(/"seconds":600/.test(t.content),'timer 600s');
t=mk('convert km to miles').r;ok(/"cat":"length"/.test(t.content)&&/"from":"km"/.test(t.content)&&/"to":"mi"/.test(t.content),'converter units');
t=mk('convert celsius to fahrenheit').r;ok(/"cat":"temperature"/.test(t.content)&&/"from":"c"/.test(t.content)&&/"to":"f"/.test(t.content),'converter temperature');
t=mk('a 20% discount calculator').r;ok(/"v":20/.test(t.content),'discount pct');
t=mk('flashcards: hola - hello; capital of France? Paris; bad card').r;ok(/hola/.test(t.content)&&/Paris/.test(t.content)&&t.notes.length===1,'flash cards parsed, bad one reported');
t=mk('write a cover letter to Sam about the barista job').r;ok(/Dear Sam/.test(t.content)&&/barista job/.test(t.content)&&/Sincerely/.test(t.content),'letter');
t=mk('write a meeting agenda: budget, hiring').r;ok(/1\. Budget/.test(t.content)&&/2\. Hiring/.test(t.content),'agenda items');
t=mk('roll 2d20').r;ok(/"n":2/.test(t.content)&&/"sides":20/.test(t.content),'dice 2d20');
t=mk('a website for my bakery').r;ok(r_ok(t)&&t.title==='Bakery'&&/Welcome to Bakery/.test(t.content),'site title from "for my bakery"');
t=mk('a landing page called Sunrise Yoga with classes, retreats').r;ok(t.title==='Sunrise Yoga'&&/Classes/.test(t.content)&&/Retreats/.test(t.content),'site title and offers');
function r_ok(x){return x&&x.route==='app'}
// 5) follow-ups
const spec=()=>B.specOf(C.parse('a to-do list with milk and eggs'));
const R=(q,sp)=>B.refine(sp||spec(),q);
const E=[['make it blue',r=>r.spec.color==='blue'],['make it red please',r=>r.spec.color==='red'],['purple',r=>r.spec.color==='purple'],['change the colour to orange',r=>r.spec.color==='orange'],['turn it green',r=>r.spec.color==='green'],
 ['add a reset button',r=>r.spec.reset===true],['add reset button',r=>r.spec.reset===true],['remove the reset button',r=>r.spec.reset===false],['rename it Groceries',r=>r.spec.title==='Groceries'],['call it Weekend list',r=>r.spec.title==='Weekend list'],['change the title to "My day"',r=>r.spec.title==='My day'],
 ['dark mode',r=>r.spec.theme==='dark'],['make it dark',r=>r.spec.theme==='dark'],['light mode',r=>r.spec.theme==='light'],['white background',r=>r.spec.theme==='light'&&!r.spec.color],['bigger text',r=>r.spec.size===1],['make it bigger',r=>r.spec.size===1],['smaller',r=>r.spec.size===-1],
 ['add butter and jam',r=>r.spec.items.join()==='milk,eggs,butter,jam'],['add butter to the list',r=>r.spec.items.includes('butter')],['remove eggs',r=>r.spec.items.join()==='milk'],['delete milk and eggs',r=>r.spec.items.length===0]];
for(const[q,f]of E){const r=R(q);ok(r&&r.said.length&&f(r),'refine "'+q+'" -> '+JSON.stringify(r&&{said:r.said,color:r.spec.color,theme:r.spec.theme,size:r.spec.size,items:r.spec.items,title:r.spec.title,reset:r.spec.reset}))}
for(const q of['a red timer','a tip calculator','write a letter to Sam','hello there','what is a closure','flashcards: a - b'])ok(R(q)===null,'"'+q+'" is a new request, not a change');
let tm=B.specOf(C.parse('a 10 minute timer'));let r2=B.refine(tm,'make it 5 minutes');ok(r2&&r2.spec.seconds===300,'timer minutes');r2=B.refine(tm,'make it 30 seconds');ok(r2&&r2.spec.seconds===30,'timer seconds');
r2=B.refine(spec(),'make it 5 minutes');ok(!r2||(!r2.said.length),'time on a list is refused');
let dc=B.specOf(C.parse('write a cover letter to Sam about the barista job'));r2=B.refine(dc,'address it to Alex');ok(r2&&r2.spec.to==='Alex'&&/Dear Alex/.test(B.make(r2.spec).content),'doc to');
r2=B.refine(dc,'make it blue');ok(r2&&!r2.said.length&&r2.skipped.length,'doc colour refused politely');
r2=B.refine(spec(),'add a reset button');const rb=B.make(r2.spec);ok(/id="rs"/.test(rb.content),'reset button in output');
r2=B.refine(B.specOf(C.parse('flip a coin')),'add Bob');ok(r2&&!r2.said.length&&r2.skipped.length,'add items to a coin is refused');
// 6) saving and learning, on a real library
const win={SEED:{},MEGA:true};for(const f of fs.readdirSync(D))new Function('window',fs.readFileSync(D+f,'utf8'))(win);
const Lib=new Function('window',fs.readFileSync(A+'brain.js','utf8')+';return Library')(win);
const lib=new Lib();const askBefore=lib.ask('what is a closure'),memBefore=JSON.stringify(lib.data.Memory||null),leavesBefore=lib.live;
let s1=B.refine(B.specOf(C.parse('a to-do list called Chores')),'make it blue').spec;s1=B.refine(s1,'add a reset button').spec;const b1=B.make(s1);
ok(B.savedFor(lib,s1)===null,'nothing saved yet');
const added=B.save(lib,s1,b1);ok(added===2,'save adds 2 leaves, got '+added);ok(Object.keys(lib.data.Library).some(k=>/^Created \//.test(k)),'Created section exists');
ok(B.specFrom(b1.content)&&B.specFrom(b1.content).color==='blue','header round-trips');
const sv=B.savedFor(lib,B.specOf(C.parse('a to-do list')));ok(sv&&sv.color==='blue'&&sv.reset===true,'savedFor finds it');
ok(B.savedFor(lib,B.specOf(C.parse('a 5 minute timer')))===null,'other kinds do not match');
const inh=B.inherit(B.specOf(C.parse('a to-do list with milk')),sv);ok(inh.spec.color==='blue'&&inh.spec.reset&&inh.spec.items.join()==='milk'&&inh.spec.title===null,'inherits style, not title or items');
const inh2=B.inherit(B.specOf(C.parse('a red to-do list')),sv);ok(inh2.spec.color==='red','explicit colour wins over saved');
B.save(lib,s1,b1);const cnt=Object.entries(lib.data.Library).filter(([k])=>/^Created \//.test(k)).reduce((a,[,v])=>a+v.length,0);ok(cnt===2,'saving the same thing twice replaces it, now '+cnt);
const g=C.gather(lib,C.parse('a blue to-do list called Chores'));ok(g.pieces.some(p=>p.mine),'gather finds the saved creation');
const a2=lib.ask('what is a closure');ok(a2&&askBefore&&a2.path===askBefore.path,'Ask answer unchanged after saving');ok(JSON.stringify(lib.data.Memory||null)===memBefore,'Memory untouched');ok(lib.live===leavesBefore+2,'exactly 2 new leaves');
// documents save as text
const dd=B.make(dc);B.save(lib,dc,dd);ok(Object.keys(lib.data.Library).some(k=>/^Created \/ Letter/.test(k)),'document saved');
console.log('Phase 3-6 build checks: '+n+' run, '+bad+' problems');process.exit(bad?1:0);
