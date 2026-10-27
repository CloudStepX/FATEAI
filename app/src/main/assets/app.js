const lib=new Library(),$=i=>document.getElementById(i);
const el=(t,c,x)=>{const e=document.createElement(t);if(c)e.className=c;if(x!=null)e.textContent=x;return e};
const pause=()=>new Promise(r=>setTimeout(r));
const TABS=['ask','feed','tree','mind'];
function tab(n){TABS.forEach(k=>{$('p'+k).hidden=k!==n;$('t'+k).classList.toggle('on',k===n);$('t'+k).setAttribute('aria-selected',k===n)});if(n==='tree')drawTree();if(window.Mind){if(n==='mind'){Mind.setActive(lastSecs);Mind.show()}else Mind.hide()}head()}
TABS.forEach(k=>$('t'+k).onclick=()=>tab(k));
function head(){const s=lib.stats(),sc=lib.data.Library?lib.sections().size:0;$('stat').textContent=sc?`${sc} sections · ${s.branches} branches · ${s.leaves} leaves`:`${s.clusters} clusters · ${s.branches} branches · ${s.leaves} leaves`+(s.links?` · ${s.links} synapses`:'')}
const hhmm=()=>new Date().toLocaleTimeString([],{hour:'numeric',minute:'2-digit'});
function row(c,m,old){const r=el('div','r '+c);if(old)r.classList.add('old');if(c==='a')r.append(el('span','av','FT'));m.title=hhmm();r.append(m);$('msgs').append(r);$('msgs').scrollTop=1e9;return r}
const say=(c,x)=>{const m=el('div','m '+c,x);row(c,m);return m};
let lastSecs=new Set();
const secsIn=p=>new Set(String(p||'').split(' + ').map(x=>x.replace(/^Library\s*›\s*/,'').split(' › ')[0].split(' / ')[0].trim()).filter(Boolean));
function show(m,r){lastSecs=secsIn(r.path);
  if(r.text)m.append(el('div',null,r.text));r.leaves.forEach(l=>{if(l.code){const b=el('button','sm','Copy');b.onclick=()=>{const ok=()=>{b.textContent='Copied';setTimeout(()=>b.textContent='Copy',1500)};(navigator.clipboard?navigator.clipboard.writeText(l.t):Promise.reject()).then(ok,()=>{const t=el('textarea');t.value=l.t;document.body.append(t);t.select();try{document.execCommand('copy');ok()}catch{b.textContent='Copy failed';setTimeout(()=>b.textContent='Copy',1500)}t.remove()})};m.append(el('pre',null,l.t),b)}else if(!r.text)m.append(el('div',null,l.t))});
  if(r.memo)m.append(el('div','meta','from memory: '+r.memo.t));
  m.append(el('div','meta',`${r.path} · ${r.conf}% match`));r.also.forEach(a=>m.append(el('div','meta','see also: '+a)));
  if(r.unk&&r.unk.length)m.append(el('div','meta','Not in my library, so not answered: '+r.unk.join(', ')+'. Teach me on the Feed tab or ask again with different words.'));
  if(r.talk&&r.talk.length){const k=el('details','meta');k.open=r.talk.some(x=>x.to!=='everyone');k.append(el('summary',null,'how the clusters talked'));r.talk.forEach(x=>k.append(el('div',null,'• '+x.from+' → '+x.to+': '+x.text)));m.append(k)}
  const d=el('details','meta');d.append(el('summary',null,'how I reasoned'));r.trace.forEach(x=>d.append(el('div',null,'• '+x)));d.append(el('div',null,`• scanned ${r.scanned} leaves in ${r.ms} ms`));m.append(d);}
function showExplain(ex){const m=say('a',ex.lang?'This looks like '+ex.lang+'. In plain English, line by line:':'');
  if(!ex.rows.length){m.textContent=ex.note;return}
  ex.rows.slice(0,200).forEach(([c,e])=>{m.append(el('div','xc',c.length>160?c.slice(0,157)+'…':c),el('div','xe','→ '+e))});
  if(ex.rows.length>200)m.append(el('div','meta','Showing the first 200 lines.'));
  if(ex.summary)m.append(el('div',null,ex.summary));if(ex.note)m.append(el('div','meta',ex.note));
  m.append(el('div','meta','Explained by rules on this device. It does not run your code, and it can miss things. Read it with the symbol and keyword tables in the Library.'));$('msgs').scrollTop=1e9}
function ask(q){lastCreate=false;
  let ex=null;try{ex=window.Explain&&Explain.explain(q)}catch{}if(ex){showExplain(ex);return}
  let sk=null;try{sk=window.Skills&&Skills.answer(q,lib)}catch{}
  if(sk){const m=say('a',sk.text);if(sk.note)m.append(el('div','meta',sk.note));$('msgs').scrollTop=1e9;return}
  let fx=null;try{fx=window.Skills&&Skills.fix(q,lib)}catch{}
  const t=lib.think(fx?fx.q:q);
  if(t.kind==='store'){const m=say('a','Stored in '+t.path+': '+t.text+'\nI will read it automatically from now on.');if(t.r)show(m,t.r);head();$('msgs').scrollTop=1e9;return}
  if(t.kind==='chat'){say('a',t.text);head();return}
  if(t.kind==='forgot'){say('a',t.n?'Forgot: '+t.text:'I could not find that in my memory.');head();return}
  if(t.kind==='memory'){say('a',t.items.length?'This is what I remember:\n'+t.items.map(i=>'• '+i.t).join('\n'):'My Memory cluster is empty. Tell me things like "my name is …" or "remember that …".');return}
  if(t.kind==='unknown'){const m=say('a',(t.words&&t.words.length?'I don\'t know "'+t.words.join('", "')+'" yet. ':'I don\'t know that yet. ')+'Teach me the answer and I will keep it:'),x=el('textarea'),b=el('button','pri','Teach');x.rows=3;
    b.onclick=()=>{if(x.value.trim()){lib.teach(q,x.value.trim());m.replaceChildren('Learned'+(lib.data.Library?' and filed in the Library (section Taught)':'')+'. Ask me again.');head()}};m.append(x,b);x.focus();return}
  const am=say('a');show(am,t.r);if(fx)am.prepend(el('div','meta','I read '+fx.changes.map(c=>'"'+c[0]+'" as "'+c[1]+'"').join(', ')+'.'));$('msgs').scrollTop=1e9}
// ---- the chat: one thread, one box. Auto sends building requests to Create and everything else to the library. ----
let MODE='auto',lastCreate=false,busy=false;
const PH={auto:'Message Fate Tree…',ask:'Ask the library…',create:'Describe what to build…'};
document.querySelectorAll('.mode').forEach(b=>b.onclick=()=>{MODE=b.dataset.m;document.querySelectorAll('.mode').forEach(x=>{const on=x===b;x.classList.toggle('on',on);x.setAttribute('aria-pressed',on)});$('q').placeholder=PH[MODE];$('q').focus()});
function typing(){const m=el('div','m a typing');m.append(el('i'),el('i'),el('i'));m.setAttribute('aria-label','Fate Tree is thinking');return row('a',m)}
function route(q){const mk=MODE==='create'||(MODE==='auto'&&window.CreateUI&&CreateUI.wants(q,lastCreate));
  if(mk&&window.CreateUI){lastCreate=true;CreateUI.run(q)}else ask(q)}
function send(q){q=(q==null?$('q').value:q).trim();if(!q||busy)return;$('q').value='';grow();say('u',q);busy=true;const t=typing();
  setTimeout(()=>{t.remove();try{route(q)}catch(e){say('a','Something went wrong with that. Try again, or rephrase it.')}busy=false;$('msgs').scrollTop=1e9},320)}
$('go').onclick=()=>send();$('q').onkeydown=e=>{if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();send()}};
// ---- chat history kept on this device ----
const HK='fate-chat-v1';
function plain(m){const c=m.cloneNode(true);c.querySelectorAll('button,iframe,.chips,details,.meta,.cm,textarea').forEach(n=>n.remove());c.querySelectorAll('div,pre,details').forEach(n=>n.append('\n'));return c.textContent.replace(/\n\s*\n+/g,'\n').trim().slice(0,1500)}
function saveChat(){try{const rows=[...$('msgs').querySelectorAll('.r:not(.old)')].filter(r=>!r.querySelector('.typing')),all=[...(histOld||[]),...rows.map(r=>({c:r.classList.contains('u')?'u':'a',t:plain(r.querySelector('.m'))})).filter(x=>x.t)].slice(-40);localStorage.setItem(HK,JSON.stringify(all))}catch{}}
let histOld=[],saveT=0;
function loadChat(){try{const a=JSON.parse(localStorage.getItem(HK)||'[]');return Array.isArray(a)?a.filter(x=>x&&typeof x.t==='string'&&(x.c==='u'||x.c==='a')):[]}catch{return[]}}
new MutationObserver(()=>{clearTimeout(saveT);saveT=setTimeout(saveChat,700)}).observe($('msgs'),{childList:true,subtree:true,characterData:true});
addEventListener('pagehide',saveChat);addEventListener('visibilitychange',()=>{if(document.hidden)saveChat()});
function restore(a){histOld=a;a.forEach(x=>{const m=el('div','m '+x.c,x.t);row(x.c,m,true)});$('msgs').append(el('div','sep','— earlier chat —'));$('msgs').scrollTop=1e9}
const isLib=o=>o&&typeof o==='object'&&!Array.isArray(o)&&Object.values(o).every(v=>v&&typeof v==='object'&&!Array.isArray(v));
async function readFiles(fs){let n=0,skip=0,dup=0,i=0;const base=$('fc').value;
  for(const f of fs){$('fs').textContent=`reading ${++i}/${fs.length}…`;if(i%4===0)await pause();
    const p=f.webkitRelativePath||f.name;if(/(^|\/)(node_modules|\.git|build|dist)\//.test(p)||f.size>3e6){skip++;continue}
    let t;try{t=await f.text()}catch{skip++;continue}if(t.slice(0,2000).includes('\0')){skip++;continue}
    const ext=(f.name.match(/\.(\w+)$/)||[,''])[1].toLowerCase(),root=p.includes('/')?p.split('/')[0]:'';
    if(ext==='json'){try{const o=JSON.parse(t);if(isLib(o)){const m=lib.merge(o,true);if(m){n+=m;continue}}}catch{}}
    const code=CODE.test(f.name);const r=lib.feed(t,base||(code?(root||'Code · '+ext):root),{code,ext,branch:p,defer:true});n+=r.n;dup+=r.skipped||0}
  lib.commit();$('fs').textContent=`Read ${fs.length-skip} files into ${n} new leaves.`+(dup?` Skipped ${dup} already known.`:'')+(skip?` Skipped ${skip} (binary, too big or build folders).`:'');head()}
$('feed').onclick=()=>{const t=$('ft').value.trim();if(!t){$('fs').textContent='Paste some text first.';$('ft').focus();return}const r=lib.feed(t,$('fc').value);$('ft').value='';$('fs').textContent=`Fed ${r.n} new leaves into ${lib.data.Library?'Library › ':''}"${r.c}".`+(r.skipped?` Skipped ${r.skipped} already known.`:'');head()};
['ff','fd'].forEach(id=>$(id).onchange=async e=>{await readFiles([...e.target.files]);e.target.value=''});
$('ex').onclick=()=>{const j=JSON.stringify(lib.data);if(window.FateApp){FateApp.saveText('fate-tree-library.json',j);$('fs').textContent='Choose where to save the library…';return}const a=el('a'),u=URL.createObjectURL(new Blob([j],{type:'application/json'}));a.href=u;a.download='fate-tree-library.json';a.click();setTimeout(()=>URL.revokeObjectURL(u),1e4);$('fs').textContent='Exported '+Object.keys(lib.data).length+' clusters.'};
// Sections that share vocabulary (words of 5+ letters used in 2+ leaves of a section, found in at most 3 sections).
let relKey='',relMap=new Map();
function related(){const L=lib.data.Library||{},key=lib.live+':'+Object.keys(L).length;if(key===relKey)return relMap;relKey=key;relMap=new Map();
  const secs=[...lib.sections().values()],W=secs.map(e=>{const c=new Map();for(const b of e.branches)for(const l of L[b]||[])for(const x of new Set((l.t.toLowerCase().match(/[a-z]{5,}/g)||[])))c.set(x,(c.get(x)||0)+1);return new Map([...c].filter(([,n])=>n>=2))}),df=new Map();
  W.forEach(w=>w.forEach((n,x)=>df.set(x,(df.get(x)||0)+1)));
  secs.forEach((a,i)=>relMap.set(a.name,[]));
  for(let i=0;i<secs.length;i++)for(let j=i+1;j<secs.length;j++){const sh=[];for(const [x,n] of W[i])if(df.get(x)<=3&&W[j].has(x))sh.push([x,n+W[j].get(x)]);
    if(sh.length>=3){sh.sort((p,q)=>q[1]-p[1]);const w=sh.map(p=>p[0]);relMap.get(secs[i].name).push({name:secs[j].name,w});relMap.get(secs[j].name).push({name:secs[i].name,w})}}
  relMap.forEach(a=>a.sort((p,q)=>q.w.length-p.w.length));return relMap}
let treeSec='';
function libBlock(box){const L=lib.data.Library,mem=lib.data.Memory,secs=[...lib.sections().values()],w=el('div','cl');
  const ents=secs.map(e=>({name:e.name,n:e.n,br:e.branches,src:L,mem:0}));
  if(mem&&Object.keys(mem).length)ents.push({name:'Memory',n:Object.values(mem).reduce((a,b)=>a+b.length,0),br:Object.keys(mem),src:mem,mem:1});
  if(!ents.some(e=>e.name===treeSec))treeSec=ents[0]?ents[0].name:'';
  const strip=el('div','chips');ents.forEach(e=>{const b=el('button','chip'+(e.name===treeSec?' on':''),`${e.name} (${e.n})`);b.onclick=()=>{treeSec=e.name;drawTree()};strip.append(b)});w.append(strip);
  const cur=ents.find(e=>e.name===treeSec);
  if(cur){if(cur.mem)w.append(el('div','meta','Memory is kept apart so it is always read first.'));
    else{if(lastSecs.has(cur.name))w.append(el('div','meta','This section helped answer your last question.'));
      const rl=(related().get(cur.name)||[]).slice(0,5);if(rl.length){w.append(el('div','meta','Shares vocabulary with:'));rl.forEach(x=>{const r=el('div','br'),b=el('button','sm',x.name);b.onclick=()=>{treeSec=x.name;drawTree()};r.append(b,el('span',null,x.w.slice(0,5).join(', ')+(x.w.length>5?` +${x.w.length-5}`:'')));w.append(r)})}}
    cur.br.forEach(b=>{const i=b.indexOf(' / '),label=!cur.mem&&i>0?b.slice(i+3):b,r=el('div','br'),x=el('button','sm','✕');
      x.onclick=()=>{if(confirm('Delete branch "'+label+'"?')){lib.remove(cur.mem?'Memory':'Library',b);drawTree();head()}};r.append(el('span',null,`${label} (${cur.src[b].length})`),x);w.append(r)});
    const del=el('button','sm','Delete section');del.onclick=()=>{if(confirm('Delete section "'+cur.name+'" and everything in it?')){cur.mem?lib.remove('Memory'):lib.removeSection(cur.name);drawTree();head()}};w.append(del)}
  box.append(w)}
function drawTree(){const box=$('tr');box.replaceChildren();const rs=el('button','sm','Restore starter content');rs.onclick=()=>{const n=lib.restore();drawTree();$('ts').textContent='Restored '+n+' starter leaves.';head()};box.append(rs);
  for(const c in lib.data){if(c==='Library'){libBlock(box);continue}if(c==='Memory'&&lib.data.Library)continue;const d=el('details','cl'),n=Object.values(lib.data[c]).reduce((a,b)=>a+b.length,0);d.append(el('summary',null,`${c} (${n})`));
    for(const b in lib.data[c]){const r=el('div','br'),x=el('button','sm','✕');x.onclick=()=>{if(confirm('Delete branch "'+b+'"?')){lib.remove(c,b);drawTree();head()}};r.append(el('span',null,`${b} (${lib.data[c][b].length})`),x);d.append(r)}
    const del=el('button','sm','Delete cluster');del.onclick=()=>{if(confirm('Delete cluster "'+c+'"?')){lib.remove(c);drawTree();head()}};d.append(del);box.append(d)}}
addEventListener('visibilitychange',()=>{if(document.hidden)lib.flush()});addEventListener('pagehide',()=>lib.flush());
function welcome(){const m=say('a','Hi, I am Fate Tree. Ask me anything and I answer from the library stored on this device, or tell me to make something (a timer, a list, a letter) and I build it right here in the chat. Nothing leaves the device.'+(lib.memCount()?' I remember '+lib.memCount()+' thing(s) about you.':' Tell me things ("my name is …", "remember that …") and I will keep them in Memory.')),c=el('div','chips');
  [['What are you?',1],['What do you know about me?',1],['Make a 10 minute countdown timer',1],['Make a blue to-do list with milk, eggs and bread',1],['Remember that …',0]].forEach(([t,go])=>{const b=el('button','chip',t);b.onclick=()=>{if(go)send(t);else{$('q').value='remember that ';$('q').focus();grow()}};c.append(b)});m.append(c)}
function grow(){const q=$('q');q.style.height='auto';q.style.height=Math.min(q.scrollHeight,140)+'px'}
$('q').addEventListener('input',grow);
$('clr').onclick=()=>{$('msgs').replaceChildren();histOld=[];lastCreate=false;try{localStorage.removeItem(HK)}catch{}if(window.CreateUI)CreateUI.reset();welcome();saveChat()};
if(window.FateApp){$('fd').hidden=true;$('fdl').hidden=true}
lib.init().then(()=>{try{if(localStorage.getItem('fate-seed')!=='mega-13'){const L=lib.data.Library,k='Fate Tree / How I think';if(L&&L[k])L[k]=L[k].filter(l=>!/Rate my answers with the thumbs|Wrong\? Correct it/.test(l.t));lib.restore();localStorage.setItem('fate-seed','mega-13')}}catch{}head();const h=loadChat();if(h.length)restore(h);else welcome()});
