// Create tab: describe it, see it built, change it with follow-ups, copy or save it, keep it in the library.
(function(){
const box=$('cmsgs'),inp=$('cq');
const say=(c,x)=>{const m=el('div','m '+c,x);box.append(m);box.scrollTop=1e9;return m};
function row(m,k,v){if(v==null||v===''||(Array.isArray(v)&&!v.length))return;const d=el('div','br');d.append(el('span',null,k+': '+(Array.isArray(v)?v.join(', '):v)));m.append(d)}
function understand(q){const r=Create.parse(q),m=say('a');
 if(r.route==='unknown'){m.textContent=r.notes[0]||'Describe what you want.';return r}
 m.append(el('div',null,'I understood this as '+r.what+'.'));
 const lab={app:'a small app',doc:'a document',code:'code'};row(m,'type',lab[r.route]);
 row(m,'title',r.title);row(m,'items',r.items);row(m,'colour',r.color);row(m,'time',r.seconds?(r.seconds>=60?Math.round(r.seconds/6)/10+' min':r.seconds+' s'):null);
 row(m,'language',r.lang);row(m,'to',r.to);row(m,'about',r.topic);
 r.notes.forEach(n=>m.append(el('div','meta',n)));return r}
function copy(b,t){const ok=()=>{b.textContent='Copied';setTimeout(()=>b.textContent='Copy',1500)};(navigator.clipboard?navigator.clipboard.writeText(t):Promise.reject()).then(ok,()=>{const x=el('textarea');x.value=t;document.body.append(x);x.select();try{document.execCommand('copy');ok()}catch{b.textContent='Copy failed';setTimeout(()=>b.textContent='Copy',1500)}x.remove()})}
// Library pieces for code requests and for anything that cannot be built yet.
function known(r,extra){const g=Create.gather(lib,r),m=say('a');
 if(extra)m.append(el('div',null,extra));
 if(!g.pieces.length){m.append(el('div',null,'Nothing in the library matches this yet. Teach me on the Feed tab (section name of your choice) and ask again.'));if(g.unknown.length)m.append(el('div','meta','Words I do not know: '+g.unknown.join(', ')));return}
 m.append(el('div',null,'From the library ('+g.sections.join(', ')+'):'));
 g.pieces.slice(0,4).forEach(x=>{if(x.code){m.append(el('pre',null,x.t.length>1500?x.t.slice(0,1500)+'\n…':x.t));const b=el('button','sm','Copy');b.onclick=()=>copy(b,x.t);m.append(b)}else m.append(el('div',null,x.t));m.append(el('div','meta',x.path+' · '+x.conf+'% match'))});
 if(g.unknown.length)m.append(el('div','meta','Not in my library: '+g.unknown.join(', ')))}
// ---- saving a file ----
function saveAs(name,mime,text,st){
 if(window.FateApp&&typeof FateApp.saveFile==='function'){FateApp.saveFile(name,mime,text);st.textContent='Choose where to save '+name+'…';return}
 if(window.FateApp){st.textContent='This version of the app cannot save files yet. Tap Copy and paste it into a file instead.';return}
 const a=el('a'),u=URL.createObjectURL(new Blob([text],{type:mime+';charset=utf-8'}));a.href=u;a.download=name;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(u),1e4);st.textContent='Downloaded '+name+'.'}
// ---- the clusters commit to the four parts of a build (Shape, Logic, Look, Words = the four axes of the build's 4D square) ----
const calm=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;
function commitBlock(m,res){if(!res||!window.Mind)return;Mind.commit(res);
 const d=el('div','cm'),n=res.addr.reduce((a,b)=>a+b,0);d.append(el('div','hd','Library sections committed to '+n+' of 4 parts of this build. Build address '+res.addr.join('·')+' on its 4D square.'));
 const rows=res.commits.map((c,i)=>{const r=el('div','cr'),h=el('div');r.style.borderLeftColor=Mind.AX[i];
  h.append(el('b',null,c.name+' '),el('span',null,c.owner?c.owner+' › '+c.branch:'built-in rules'),el('span',c.ok?'ok':'no',(c.ok?(c.repaired?' · kept after repair':' · kept'):' · not kept')));r.append(h);
  const why=[];if(c.owner)why.push(c.conf+'% match for "'+c.what+'". Evidence: '+c.evidence+(c.evidence.length>=140?'…':''));if(c.note)why.push(c.note.charAt(0).toUpperCase()+c.note.slice(1)+'.');if(!c.ok&&c.problems&&c.problems.length)why.push('Failed: '+c.problems.join('; ')+'.');
  if(why.length){const dt=el('details','ev'),sm=el('summary',null,'why');dt.append(sm,...why.map(w=>el('div',null,w)));r.append(dt)}return r});
 const bm=el('button','sm','Show in mind');bm.dataset.live=1;bm.onclick=()=>{tab('mind');Mind.commit(res);Mind.show()};
 rows.forEach((r,i)=>{if(calm)d.append(r);else setTimeout(()=>{if(bm.parentNode===d)d.insertBefore(r,bm);else d.append(r);box.scrollTop=box.scrollHeight},450*(i+1))});
 d.append(bm);m.append(d)}
// ---- one current creation, changed by follow-ups ----
let cur=null;
function retire(){if(!cur)return;const old=cur.msg.querySelector('.pv');if(old)old.replaceWith(el('div','meta','(earlier version, replaced below)'));cur.msg.querySelectorAll('button').forEach(b=>{if(b.dataset.live)b.remove()});const ch=cur.msg.querySelector('.chips.fu');if(ch)ch.remove()}
function show(spec,built,lead,notes,r,res){
 retire();const m=say('a');m.style.width='94%';m.append(el('div',null,lead));
 let get;
 if(built.route==='app'){const f=el('iframe','pv');f.setAttribute('sandbox','allow-scripts');f.setAttribute('referrerpolicy','no-referrer');f.title='Preview of '+built.title;
  f.style.cssText='width:100%;height:400px;border:1px solid var(--l);border-radius:10px;background:#fff;margin-top:8px;display:block';f.srcdoc=built.content;m.append(f);get=()=>built.content}
 else{const t=el('textarea','pv');t.value=built.content;t.rows=14;t.style.cssText='margin-top:8px;font-size:13px;line-height:1.4';t.setAttribute('aria-label',built.title+' text, you can edit it');m.append(t);get=()=>t.value}
 const st=el('div','meta'),bar=el('div','row');bar.style.flexWrap='wrap';
 const bc=el('button','sm','Copy');bc.dataset.live=1;bc.onclick=()=>copy(bc,get());
 const bs=el('button','sm','Save file');bs.dataset.live=1;bs.onclick=()=>saveAs(built.file,built.mime,get(),st);
 const bl=el('button','sm','Save to library');bl.dataset.live=1;bl.onclick=()=>{try{const sp=built.route==='doc'?{...spec}:spec;const b2={...built,content:get()};Build.save(lib,sp,b2);bl.textContent='Saved to library';bl.disabled=true;st.textContent='Kept under Created › '+built.label+'. A new '+built.label+' will start from this one'+(built.route==='app'?' (its colour, mode and buttons).':'.');head()}catch(e){st.textContent='Could not save to the library.'}};
 bar.append(bc,bs,bl);
 if(built.route==='app'){const bz=el('button','sm','Larger');bz.dataset.live=1;let big=false;bz.onclick=()=>{big=!big;m.querySelector('.pv').style.height=big?'72vh':'400px';bz.textContent=big?'Smaller':'Larger'};bar.append(bz)}
 m.append(bar,st);
 (notes||[]).forEach(n=>m.append(el('div','meta',n)));
 if(r){try{const g=Create.gather(lib,r),ps=g.pieces.filter(x=>!x.mine).slice(0,3);if(ps.length){const d=el('details','meta');d.append(el('summary',null,'Matched in the library ('+ps.length+')'));ps.forEach(x=>d.append(el('div',null,'• '+x.t.replace(/\s+/g,' ').slice(0,180)+'  ['+x.path+', '+x.conf+'%]')));m.append(d)}}catch(e){}}
 commitBlock(m,res);
 const c=el('div','chips fu');
 const sug=built.route==='app'?[['make it purple'],['add a reset button'],['dark mode'],['bigger text'],['rename it …',1],...(['todo','picker','flash','expense','site'].includes(spec.kind)?[['add …',1]]:[]),...(['timer','pomo'].includes(spec.kind)?[['make it 5 minutes']]:[]),['undo']]
  :[['address it to …',1],['change the topic to …',1],...(['agenda','minutes','schedule','workout'].includes(spec.kind)?[['add …',1]]:[]),['undo']];
 sug.forEach(([t,pre])=>{const b=el('button','chip',t);b.onclick=()=>{if(pre){inp.value=t.replace(/…$/,'');inp.focus();grow2()}else{inp.value=t;go()}};c.append(b)});m.append(c);
 cur={spec,built,msg:m,hist:cur?cur.hist:[]};box.scrollTop=box.scrollHeight}
function newBuild(r,q){
 let spec=Build.specOf(r);const{spec:s2,from}=Build.inherit(spec,Build.savedFor(lib,spec));spec=s2;try{const tp=Create.tips(lib,r);if(tp.length)spec.tips=tp}catch(e){}
 const res=Commit.settle(lib,spec,Build),built=res&&res.built;if(res)spec=res.spec;
 if(!built){known(r,r.route==='code'?null:'I cannot build '+r.what+' yet. The starter set is: to-do and shopping lists, trackers and counters, timers, calculators, converters, flashcards, notes, random pickers and text documents. Here is what the library has:');return}
 show(spec,built,(built.route==='doc'?'Here is your '+built.label+'. You can edit the text.':'Here is your '+built.label+', "'+built.title+'". Try it below.'),
  [...built.notes,...(spec.tips&&spec.tips.length?['Added '+spec.tips.length+' tip'+(spec.tips.length>1?'s':'')+' taken from the library ('+[...new Set(spec.tips.map(x=>x.s))].join('; ')+').']:[]),...(from.length?['Started from your saved version of this ('+from.join(', ')+').']:[]),...(built.route==='app'?['The preview has no network and does not keep data between sessions. A saved file does.']:[]),...(r.notes||[])],r,res);cur.hist=[]}
function follow(q){
 const low=q.toLowerCase().trim().replace(/[.!]+$/,'');
 if(/^(undo|go back|revert)$/.test(low)){if(!cur.hist.length){say('a','Nothing to undo.');return true}const sp0=cur.hist.pop(),res=Commit.settle(lib,sp0,Build),h=cur.hist;show(res.spec,res.built,'Undone. Back to the last version.',null,null,res);cur.hist=h;return true}
 if(/^(start over|new|clear|forget it)$/.test(low)){retire();cur=null;say('a','Okay. Describe the next thing.');return true}
 const rf=Build.refine(cur.spec,q);if(!rf)return false;
 if(!rf.said.length){say('a',rf.skipped.join(' ')||'I did not catch a change there.');return true}
 if(rf.spec.autoTheme&&rf.spec.theme!==cur.spec.theme){delete rf.spec.autoTheme}
 const res=Commit.settle(lib,rf.spec,Build),built=res&&res.built;if(!built){say('a','I could not rebuild that.');return true}
 const h=cur.hist.concat([cur.spec]);
 show(res.spec,built,'Done: '+rf.said.join(', ')+'.',[...rf.skipped,...(built.notes||[])],null,res);cur.hist=h.slice(-20);return true}
function go(){const q=inp.value.trim();if(!q)return;inp.value='';grow2();say('u',q);
 try{if(cur&&follow(q))return;newBuild(understand(q),q)}catch(e){say('a','Something went wrong building that.')}}
function grow2(){inp.style.height='auto';inp.style.height=Math.min(inp.scrollHeight,140)+'px'}
$('cgo').onclick=go;inp.onkeydown=e=>{if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();go()}};inp.addEventListener('input',grow2);
const w=say('a','Describe what is on your mind and I will build it here. Library sections commit to its four parts (shape, logic, look, words) and each commit is checked against the finished file. Then change it with follow-ups like "make it blue", "add a reset button" or "rename it". Tap an idea or write your own.'),c=el('div','chips');
['a blue to-do list with milk, eggs and bread','a 10 minute countdown timer','a tip calculator','convert km to miles','flashcards: hola - hello; adios - goodbye','random name picker with Ann, Bob, Cy','write a cover letter to Sam about the barista job','write a python function that reverses a string'].forEach(t=>{const b=el('button','chip',t);b.onclick=()=>{inp.value=t;go()};c.append(b)});w.append(c);
if(window.Mind)Mind.mount({canvas:$('mc'),info:$('mi'),legend:$('ml')},lib);
})();
