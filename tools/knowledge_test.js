// node tools/knowledge_test.js [-v] : the three Phase 10 sections (AI and Machine Learning, Life and Work Skills, Science Basics) are found by plain questions.
const fs=require('fs'),A='app/src/main/assets/',D=A+'clusters/';
const win={SEED:{},MEGA:true};for(const f of fs.readdirSync(D))new Function('window',fs.readFileSync(D+f,'utf8'))(win);
const Lib=new Function('window',fs.readFileSync(A+'brain.js','utf8')+';return Library')(win);
const lib=new Lib();let bad=0,n=0;const v=process.argv[2]==='-v';
// [question, phrase that must appear in one of the top 3 leaves]
const Q=[['what is machine learning','learns patterns from examples'],['what is overfitting','memorizes the training data'],['what is a neural network','layers of simple units'],['what is backpropagation','how much each weight contributed'],
 ['what is a transformer','uses attention'],['what is a hallucination in a language model','confident tone'],['what is retrieval augmented generation','searches a collection of documents'],['what is precision and recall','how many of the items the model flagged'],
 ['what is supervised learning','already have the right answer'],['what is gradient descent','lowers the loss'],['what is a token','chunk of text a model reads'],['how do I write a good prompt','states the task'],
 ['what makes a strong password','long'],['what is two factor authentication','second proof'],['how do I spot phishing','urgency'],['what is the pomodoro technique','25 minutes'],
 ['what is the eisenhower matrix','urgent and important'],['what goes in meeting minutes','decisions made'],['what is an action item','who is responsible'],['what is the 50/30/20 budget rule','30 percent for wants'],
 ['how big should an emergency fund be','three to six months'],['what is the rule of 72','divide 72'],['how much exercise do adults need','150 minutes'],['what is progressive overload','harder over time'],
 ['how do I write a resignation letter','last working day'],['what are SMART goals','Time-bound'],['what is a premortem','already failed'],['how fast does light travel','299,792'],
 ['what is newtons second law','mass times acceleration'],['what is the ph scale','0 to 14'],['what is dna','double helix'],['what is photosynthesis','light, water and carbon dioxide'],
 ['why do we have seasons','tilted'],['what is a light year','9.46 trillion'],['how do I convert celsius to fahrenheit','9 / 5'],['what is a hypothesis','testable explanation'],['what is the difference between weather and climate','over many years']];
let hit=0;for(const[q,p]of Q){n++;lib.wm=[];const r=lib.ask(q),top=(r&&r.leaves||[]).slice(0,3).map(l=>l.t);const ok=top.some(t=>t.includes(p));if(ok)hit++;else{bad++;console.log('MISS',q,'->',(top[0]||'(declined)').slice(0,90))}if(v&&ok)console.log('ok  ',q)}
const need=Math.ceil(Q.length*.9);console.log(hit+' of '+Q.length+' questions found the right leaf in the top 3 (need '+need+')');process.exit(hit>=need?0:1)
