// Commit engine (Phase 8). A build has four parts, one per axis of a small 4D square (2x2x2x2 = 16 corners):
//   Shape (x): the parts and layout     Logic (y): what it does     Look (z): colour, size, legibility     Words (w): labels and wording
// For every part, the Library sections bid with what they know. The best match above 50% COMMITS to the part:
// its leaf is the evidence, its place in the Library's own 4D grid is recorded, and the commit is then CHECKED against the finished file.
// A check that fails is reported as not kept. If the accent colour cannot be read on the page, the Look owner repairs it by switching mode.
// Rule templates still write the file; the sections claim, prove and repair. A part no section matched stays with the built-in rules and does not count.
// Pure rules, runs on the device, no network. Does not write to the library or disturb Ask.
(function(root){
const Create=typeof require!=='undefined'&&typeof module!=='undefined'&&module.exports?require('./create.js'):root.Create;
const AXES=[['shape','Shape','parts and layout'],['logic','Logic','what it does'],['look','Look','colour and legibility'],['words','Words','labels and wording']];
const LOGICQ={todo:'javascript array add remove items state',counter:'save data localstorage javascript',timer:'delay code setTimeout setInterval',pomo:'delay code setTimeout setInterval',stopwatch:'delay code setTimeout setInterval',calc:'formula percentage calculation',flash:'memory techniques active recall spaced repetition',guess:'random number javascript',picker:'random number javascript',password:'password hashing security',expense:'budget spreadsheet formulas',notes:'save data localstorage javascript',text:'text string javascript',site:'html css website page layout'};
function queries(sp){const app=sp.route==='app',k=sp.kind;
 return{shape:app?(k==='site'?'html css website page layout':'html semantic landmarks headings accessibility'):'document structure headings paragraphs',
  logic:app?(LOGICQ[k]||'javascript function'):'order of ideas paragraphs writing process',
  look:app?'color contrast accessibility readable':'readable formatting spacing writing style',
  words:app?'writing tone clear wording':'writing tone '+(k||'')}}
const secOf=b=>{const i=String(b).indexOf(' / ');return i>0?b.slice(0,i):b};
// Morton index -> 4 coordinates (inverse of brain.js morton).
function decode(m,bits){let a=0,b=0,c=0,d=0;for(let i=0;i<bits;i++){const q=(m>>(i*4))&15;a|=(q&1)<<i;b|=((q>>1)&1)<<i;c|=((q>>2)&1)<<i;d|=((q>>3)&1)<<i}return[a,b,c,d]}
function locate(lib,leaf){const L=(lib.leaves||[]).find(x=>x&&x.l===leaf&&!x.dead);if(!L)return null;const G=lib.reg[L.c],side=G?G.side:1;
 return{section:L.c==='Library'?secOf(L.b):L.c,branch:L.c==='Library'?L.b.slice(L.b.indexOf(' / ')+3):L.b,side,cell:side>1?decode(L.cell,Math.log2(side)):[0,0,0,0]}}
function claim(lib,sp){const q=queries(sp);
 return AXES.map(([k,name,what])=>{const{r}=Create.peek(lib,q[k]);
  const base={axis:k,name,what,query:q[k],owner:null,branch:null,evidence:null,conf:r?r.conf:0,cell:null,side:null,ok:false,repaired:false,note:''};
  if(r&&r.conf>=50&&r.leaves&&r.leaves[0]){const loc=locate(lib,r.leaves[0]);
   if(loc)return Object.assign(base,{owner:loc.section,branch:loc.branch,evidence:r.leaves[0].t.replace(/\s+/g,' ').slice(0,140),cell:loc.cell,side:loc.side})}
  return base})}
// ---- checks on the finished file ----
const hex=s=>/^#[0-9a-f]{6}$/i.test(s)?[1,3,5].map(i=>parseInt(s.slice(i,i+2),16)/255):null;
const lum=c=>{const v=c.map(x=>x<=.03928?x/12.92:Math.pow((x+.055)/1.055,2.4));return .2126*v[0]+.7152*v[1]+.0722*v[2]};
const ratio=(a,b)=>{const x=lum(a),y=lum(b),hi=Math.max(x,y),lo=Math.min(x,y);return(hi+.05)/(lo+.05)};
function tones(html){const ac=(html.match(/--ac:(#[0-9a-f]{6})/i)||[])[1],on=(html.match(/--on:(#[0-9a-f]{3,6})/i)||[])[1],bg=(html.match(/body\{margin:0;background:(#[0-9a-f]{6})/i)||[])[1];
 const on6=on&&on.length===4?'#'+on[1]+on[1]+on[2]+on[2]+on[3]+on[3]:on;return{ac:hex(ac||''),bg:hex(bg||''),on:hex(on6||'')}}
function checkApp(axis,html,sp){const bad=[];let contrast=false;
 if(axis==='shape'){if(!/^<!doctype html>/i.test(html))bad.push('no doctype');if(!/<html lang="/.test(html))bad.push('no page language');if(!/<title>[^<]+<\/title>/.test(html))bad.push('no title');if(!/<h1[ >]/.test(html))bad.push('no heading');if(!/<main[ >]/.test(html))bad.push('no main area')}
 if(axis==='logic'){const sc=[...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(m=>m[1]);
  sc.forEach(c=>{try{new Function(c)}catch(e){bad.push('script does not parse')}if(/\bfetch\s*\(|XMLHttpRequest|WebSocket|EventSource|\bimport\s*\(/.test(c))bad.push('script reaches for the network')});
  if(!sc.length&&sp.kind!=='site')bad.push('no script')}
 if(axis==='look'){const t=tones(html);
  if(!t.ac||!t.bg||!t.on)bad.push('colours not readable');
  else{const a=ratio(t.ac,t.bg),o=ratio(t.on,t.ac);if(a<3){bad.push('accent colour is hard to see on the page ('+a.toFixed(1)+':1, needs 3:1)');contrast=true}if(o<4.5)bad.push('button text is hard to read on the accent ('+o.toFixed(1)+':1, needs 4.5:1)')}
  if(!/min-height:44px/.test(html))bad.push('touch targets under 44px');if(!/prefers-reduced-motion/.test(html))bad.push('ignores reduced motion');if(!/:focus-visible/.test(html))bad.push('no keyboard focus ring')}
 if(axis==='words'){const bs=[...html.matchAll(/<button([^>]*)>([\s\S]*?)<\/button>/g)];
  if(bs.some(b=>!/aria-label=/.test(b[1])&&!b[2].replace(/<[^>]*>/g,'').trim()))bad.push('a button has no label');
  if(/>\s*(undefined|null|NaN)\s*</.test(html))bad.push('a placeholder word leaked into the page')}
 return{bad,contrast}}
function checkDoc(axis,text){const bad=[];
 if(axis==='shape'){const ls=text.split('\n');if(!ls[0].trim())bad.push('no title line');if(ls.length<4)bad.push('too short to have parts')}
 if(axis==='logic'&&/\b(undefined|NaN)\b|\[object/.test(text))bad.push('a placeholder word leaked into the text');
 if(axis==='look'){if(/\t/.test(text))bad.push('tab characters');if(/\n{4,}/.test(text))bad.push('long runs of blank lines')}
 if(axis==='words'&&/\bnull\b/.test(text))bad.push('a placeholder word leaked into the text');
 return{bad,contrast:false}}
function verify(built,sp){const out={};
 for(const[k]of AXES)out[k]=built.route==='app'?checkApp(k,built.content,sp):checkDoc(k,built.content);
 return out}
const left=t=>(String(t).match(/\[[^\]\n]{1,60}\]/g)||[]).length;
const mix=(c,t,f)=>c.map((v,i)=>v+(t[i]-v)*f),toHex=c=>'#'+c.map(v=>Math.round(Math.max(0,Math.min(1,v))*255).toString(16).padStart(2,'0')).join('');
// Settle a spec: claim, build, check, repair, check again. Returns {spec,built,commits,addr,repaired} or null when nothing can be built.
// Repair 1: an accent that cannot be seen on the page switches mode (only when the person did not pick a mode).
// Repair 2: an accent that is still too faint, or has unreadable button text, is darkened or lightened in small steps until the Look checks pass.
function settle(lib,spec,Build){
 let sp=Object.assign({},spec);if(sp.autoTheme){sp.theme=null;delete sp.autoTheme}if(sp.autoAccent){delete sp.accent;delete sp.autoAccent}
 let built=Build.make(sp);if(!built)return null;
 const commits=claim(lib,sp);let res=verify(built,sp);const fixed=[];
 if(sp.route==='app'&&!sp.theme&&res.look.contrast){const dark=/color-scheme:dark/.test(built.content),sp2=Object.assign({},sp,{theme:dark?'light':'dark',autoTheme:true}),b2=Build.make(sp2);
  if(b2){const r2=verify(b2,sp2);if(!r2.look.contrast&&r2.look.bad.length<res.look.bad.length){sp=sp2;built=b2;res=r2;fixed.push('switched to '+sp.theme+' mode so the accent colour can be seen')}}}
 if(sp.route==='app'&&res.look.bad.length){const t=tones(built.content);let best=null;
  if(t.ac)for(const tgt of[[0,0,0],[1,1,1]]){for(let f=.06;f<=.6;f+=.06){if(best&&best.f<=f)break;const sp3=Object.assign({},sp,{accent:toHex(mix(t.ac,tgt,f)),autoAccent:true}),b3=Build.make(sp3);if(!b3)continue;const r3=verify(b3,sp3);if(!r3.look.bad.length){best={f,sp:sp3,b:b3,r:r3};break}}}
  if(best){sp=best.sp;built=best.b;res=best.r;fixed.push('adjusted the accent colour until it and the button text can be read')}}
 commits.forEach(c=>{const r=res[c.axis];c.ok=!r.bad.length;c.problems=r.bad;
  if(c.axis==='look'&&fixed.length){c.repaired=true;c.note=fixed.join('; ')}
  if(c.axis==='words'&&built.route==='doc'){const n=left(built.content);if(n)c.note=n+' [bracket'+(n>1?'s':'')+'] left for you to fill in'}
  if(!c.owner)c.note=(c.note?c.note+'; ':'')+'no section matched this part, so the built-in rules kept it'});
 const addr=commits.map(c=>c.owner&&c.ok?1:0);
 return{spec:sp,built,commits,addr,repaired:fixed.length>0}}
const api={settle,verify,decode,queries};
if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.Commit=api;
})(typeof window!=='undefined'?window:globalThis);
