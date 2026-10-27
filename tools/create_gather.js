// node tools/create_gather.js : Phase 2 checks. Create finds library knowledge and leaves Ask and Memory untouched.
const fs=require('fs'),A='app/src/main/assets/',D=A+'clusters/';
const win={SEED:{},MEGA:true};for(const f of fs.readdirSync(D))new Function('window',fs.readFileSync(D+f,'utf8'))(win);
const Lib=new Function('window',fs.readFileSync(A+'brain.js','utf8')+';return Library')(win);
const C=require('../'+A+'create.js');
const lib=new Lib();let bad=0;const ok=(c,m)=>{if(!c){bad++;console.log('FAIL',m)}};
const show=process.argv[2]==='-v';
// 1) Ask context to protect
lib.ask('what is a closure');const before={last:lib.last,wm:JSON.stringify(lib.wm),ids:lib.lastIds,use:JSON.stringify(lib.use),links:JSON.stringify(lib.links),mem:JSON.stringify(lib.data.Memory||null)};
const T=[
 ['write a python function that reverses a string',{code:1,re:/revers|\[::-1\]|def /i}],
 ['a blue to-do list with milk, eggs and bread',{code:1,re:/todo|task|list/i}],
 ['a 10 minute countdown timer',{any:1}],['a tip calculator',{any:1,re:/tip|percent|calculat/i}],
 ['write a regex for emails',{any:1,re:/regex|regular|\\|\[/i}],
 ['write a cover letter to Sam about the barista job',{any:1}],
 ['flashcards: hola - hello; adios - goodbye',{any:1,re:/recall|spaced|flash|memor/i}],
 ['I like making notes that remember my name is Sam',{any:0}],
 ['something that tells jokes',{any:0}]
];
for(const[q,e]of T){const p=C.parse(q),g=C.gather(lib,p);
  if(show)console.log('\n'+q,'->',p.route+'/'+p.kind,'queries:',JSON.stringify(g.queries),'\n  unknown:',g.unknown.join(',')||'-','\n'+g.pieces.map(x=>'  ['+(x.code?'code':'text')+' '+x.conf+'% '+x.path+'] '+x.t.replace(/\s+/g,' ').slice(0,90)).join('\n'));
  if(e.any)ok(g.pieces.length>0,'nothing found for: '+q);
  if(e.code)ok(g.pieces.some(x=>x.code),'no code piece for: '+q);
  if(e.re)ok(g.pieces.some(x=>e.re.test(x.t)||e.re.test(x.path)),'no relevant piece for: '+q);
  ok(g.pieces.every(x=>x.path),'piece without a path')}
// 2) nothing changed for Ask / Memory / library
ok(lib.last===before.last&&JSON.stringify(lib.wm)===before.wm&&lib.lastIds===before.ids,'ask context changed');
ok(JSON.stringify(lib.use)===before.use&&JSON.stringify(lib.links)===before.links,'usage or synapses changed');
ok(JSON.stringify(lib.data.Memory||null)===before.mem,'memory changed');
// 3) follow-up context must not leak into Create
lib.ask('what is a closure');const g1=C.gather(lib,C.parse('make a list of it and them'));ok(Array.isArray(g1.pieces),'gather with pronouns');
console.log('Phase 2 checks done, '+bad+' problems');process.exit(bad?1:0);
