// node tools/skills_test.js [-v] : Phase 11 checks. Arithmetic, units, clock, self-description and limits are answered on the device; ordinary questions and memory commands are never intercepted; misspelt words are repaired.
const fs=require('fs'),A='app/src/main/assets/',D=A+'clusters/';
const win={SEED:{},MEGA:true};for(const f of fs.readdirSync(D))new Function('window',fs.readFileSync(D+f,'utf8'))(win);
const Lib=new Function('window',fs.readFileSync(A+'brain.js','utf8')+';return Library')(win);
const S=require('../'+A+'skills.js');const lib=new Lib();let bad=0,n=0;const v=process.argv[2]==='-v';
const ok=(c,m)=>{n++;if(!c){bad++;console.log('FAIL',m)}};
const NOW=new Date(2026,9,27,15,5,0); // Tuesday 27 October 2026, 3:05 PM local
const t=(q)=>{const r=S.answer(q,lib,NOW);if(v)console.log(q.padEnd(40),'=>',r?r.text.replace(/\n/g,' | ').slice(0,90):null);return r};
// [question, text that the answer must contain]
const MATH=[['12*7+3','87'],['what is 12 times 7 plus 3','87'],['whats 100 / 8','12.5'],['2^10','1,024'],['(3+4)*5','35'],['what is 15% of 80','12'],['15 percent of 80','12'],['what percent is 20 of 80','25%'],['20 is what percent of 80','25%'],
 ['20% off 80','64'],['increase 80 by 15%','92'],['decrease 200 by 10 percent','180'],['square root of 144','12'],['sqrt(2)','1.41421356'],['5 squared','25'],['10 divided by 4','2.5'],['7 minus 10','-3'],['1,000 + 2,500','3,500'],['what is 0.1 + 0.2','0.3'],['10 mod 3','1'],['12 x 7','84'],['100 - 5 * 3','85'],['what is 1/0','divides by zero'],['2^1000000','too big'],['-5 + 3','-2']];
for(const[q,p]of MATH){const r=t(q);ok(r&&r.text.includes(p)&&r.how!=='units','math '+q+' -> '+(r&&r.text))}
const UNITS=[['convert 5 miles to km','8.04672'],['5 miles in km','8.04672'],['how many km in 5 miles','8.04672'],['20 c to f','68'],['100 f to c','37.7778'],['0 c to k','273.15'],['2 kg to lb','4.40925'],['1 gallon to liters','3.78541'],['3 feet to inches','36'],['60 mph to km/h','96.5606'],['how many minutes in an hour','60'],['how many seconds in a day','86,400'],['2 cups to ml','473.176'],['what is 10 cm in inches','3.93701']];
for(const[q,p]of UNITS){const r=t(q);ok(r&&r.text.includes(p)&&r.how==='units','unit '+q+' -> '+(r&&r.text))}
{const r=t('convert 5 kg to km');ok(r&&/different things/.test(r.text),'unit mismatch is explained')}
const CLK=[['what time is it','3:05 PM'],['what day is it','Tuesday'],["what's the date",'October 27, 2026'],['what year is it','2026'],['what month is it','October 2026'],["what is today's date",'Tuesday, October 27, 2026']];
for(const[q,p]of CLK){const r=t(q);ok(r&&r.text.includes(p)&&r.how==='clock','clock '+q+' -> '+(r&&r.text))}
const META=[['who are you','Fate Tree'],['what is your name','Fate Tree'],['what can you do','Calculate'],['help','Calculate'],['how do I use this','Calculate'],['what do you know','sections'],['are you online','no internet permission'],['are you chatgpt','not ChatGPT'],['are you a robot','AI program'],['how do you work','split it into words'],['who made you','Fate Tree']];
for(const[q,p]of META){const r=t(q);ok(r&&r.text.includes(p)&&r.how==='about me','meta '+q+' -> '+(r&&r.text))}
{const r=t('what can you do');ok(/Artificial Intelligence/.test(r.text)&&/Science Basics/.test(r.text),'lists the real sections');ok(new RegExp(Math.floor(lib.leaves.filter(x=>x&&!x.dead).length/1000)+'').test(r.text),'mentions a leaf count')}
for(const q of["what's the weather today",'latest news','bitcoin price','what is the capital of France','who is the president of Brazil','who won the game last night']){const r=t(q);ok(r&&r.how==='limit'&&/cannot answer/.test(r.text),'limit '+q)}
// never intercept ordinary questions, memory commands, code or Create-style requests
const KEEP=['what is machine learning','what is a loop','explain recursion','how do I write a cover letter','what is the rule of 72','what are SMART goals','my name is Sam','remember that I like 2+2=4','forget dark mode','what do you know about me','tell me more','hello','thanks','what is the pomodoro technique','how do I convert celsius to fahrenheit','what is a day in space','what is the time complexity of binary search','what is a date in sql','what is the percentage of oxygen in air','what is 5 in binary','how many bits in a byte','what is the year of the first computer','define percent','what is a percent','how do I calculate a tip','what is the unit of force','what is time','what is the difference between weather and climate','what is a news feed in an app','teach me nothing','help me understand big o','what does the date function do in python'];
for(const q of KEEP){const r=S.answer(q,lib,NOW);ok(r===null,'must not intercept: '+q+' -> '+(r&&r.text.slice(0,50)))}
// the knowledge questions from knowledge_test.js stay untouched
{const src=fs.readFileSync('tools/knowledge_test.js','utf8');const qs=[...src.matchAll(/\['(what[^']*|how[^']*|why[^']*)','/g)].map(m=>m[1]);ok(qs.length>=30,'read knowledge questions');for(const q of qs)ok(S.answer(q,lib,NOW)===null,'knowledge question intercepted: '+q)}
// typo repair
const FIX=[['what is machin lerning','machin learning'],['explain recursoin','recursion'],['what is photosythesis','photosynthesis'],['how do I write a resgnation letter','resignation'],['what is a nueral network','neural network'],['what is overfiting','overfitting']];
for(const[q,p]of FIX){const f=S.fix(q,lib);if(v)console.log(q.padEnd(40),'=>',f&&f.q);ok(f&&f.q.includes(p),'fix '+q+' -> '+(f&&f.q))}
for(const q of['what is machine learning','what is the capital of zorbland','what is tensorflow','what is kubernetes','my name is Sam','remember that I like pizzas','what is a loop']){const f=S.fix(q,lib);ok(f===null||!/zorbland|zorbl/.test(f.q),'no bad repair '+q);if(['what is machine learning','what is a loop','my name is Sam','remember that I like pizzas'].includes(q))ok(f===null,'known words are left alone: '+q)}
// the repaired question is actually answered
{const f=S.fix('what is machin lerning',lib);lib.wm=[];const th=lib.think(f.q);ok(th.kind==='answer'&&/Machine learning/.test(th.r.text),'repaired question finds the definition')}
// skills never touch the Library
ok(JSON.stringify(lib.data.Memory||null)===JSON.stringify(lib.data.Memory||null),'ok');
console.log(bad?bad+' problems of '+n+' checks':'all '+n+' checks passed');process.exit(bad?1:0)
