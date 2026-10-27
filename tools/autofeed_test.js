const {load}=require('./harness.js');
const L=load('../app/src/main/assets/brain.js');
const l=new L();
l.data={Mathematics:{Algebra:[{t:'A variable is a symbol that stands for a number we do not know yet.'}]},Memory:{x:[{t:'my name is Sam'}]}};l.build();
let ok=0,bad=0;const T=(n,c)=>{c?ok++:(bad++,console.log('FAIL',n))};
// 1 header + dedupe (reordered/punctuation variant) + case-insens section & branch
let r=l.feed('SECTION: mathematics\n\n# algebra\nA variable is a symbol that stands for a number we do not know yet. An equation says two expressions are equal. An equation says two expressions are equal.\n\nPART 1 OF 2',' ignored box');
T('n',r.n===1);T('skipped',r.skipped===2);T('section canon',Object.keys(l.data).filter(k=>k.toLowerCase()==='mathematics').length===1&&l.data.Mathematics.Algebra.length===2);
T('no PART leaf',!JSON.stringify(l.data).includes('PART 1'));
// 2 feeding same again adds nothing
r=l.feed('SECTION: Mathematics\n# Algebra\nAn equation says two expressions are equal.');T('again',r.n===0&&r.skipped===1);
// 3 multi-section
r=l.feed('SECTION: Cooking\n# Heat\nBoiling cooks food in water at one hundred degrees.\n\nSECTION: Music\n# Notes\nA chord is three or more notes played together.');
T('multi',r.n===2&&l.data.Cooking&&l.data.Music);T('names',r.c==='Cooking, Music');
// 4 no header, box name, dup across sections (library-wide)
r=l.feed('Boiling cooks food in water at one hundred degrees.','Other');T('cross-section dup',r.n===0&&!l.data.Other);
// 5 memory untouched / not used for dedupe
r=l.feed('Sam is my name and it is my name.','Notes');T('memory ignored',r.n>=0&&l.data.Memory.x.length===1);
// 6 code dedupe
const code='Example:\n```\nfunction add(a,b){return a+b;}\nconsole.log(add(1,2));\n```';
r=l.feed(code,'Coding');const r2=l.feed(code,'Coding');T('code dup',r.n===1&&r2.n===0&&r2.skipped===1);
// 7 delete then re-feed works
l.remove('Cooking');r=l.feed('SECTION: Cooking\n# Heat\nBoiling cooks food in water at one hundred degrees.');T('after delete',r.n===1);
// 8 no-SECTION plain feed still works and answers
r=l.feed('# Space\n\nMars is the fourth planet from the Sun and has two moons.','Science');T('plain',r.n===1);
console.log(bad?'FAILED':'OK: auto-feed',ok,'checks passed');process.exit(bad?1:0)
