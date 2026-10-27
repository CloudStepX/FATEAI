// Create engine, Phase 1: understand a description. Pure rules, runs on the device, no network.
(function(root){
const COLORS={green:'#39ff88',blue:'#4da3ff',red:'#ff5c5c',purple:'#b388ff',orange:'#ffa94d',pink:'#ff7eb6',yellow:'#ffd84d',teal:'#2dd4bf',white:'#e8e8e8'};
const LANGS=[['python',/\bpython\b|\bpy\b/],['javascript',/\bjavascript\b|\bjs\b|\bnode(js)?\b/],['typescript',/\btypescript\b/],['java',/\bjava\b/],['kotlin',/\bkotlin\b/],['c++',/(^|[^\w])c\+\+/],['c#',/(^|[^\w])c#/],['go',/\bgolang\b|\bin go\b|\bgo (function|program|script|code)\b/],['rust',/\brust\b/],['swift',/\bswift\b/],['php',/\bphp\b/],['ruby',/\bruby\b/],['sql',/\bsql\b/],['html',/\bhtml\b/],['css',/\bcss\b/],['bash',/\bbash\b|\bshell script\b/],['c',/\bin c\b|\bc (function|program|code)\b/]];
const APPW=/\b(app|apps|tool|tracker|calculator|timer|counter|game|website|web ?page|page|site|widget|generator|converter|quiz|flash ?cards?|stopwatch|checklist|list)\b/;
const CODEW=/\b(function|script|program|snippet|code|class|regex|regular expression|query|loop|algorithm|method)\b/;
// App kinds, most specific first. Each says what the thing is and what it needs.
const KINDS=[
 ['site','a one-page website',/\b(web ?site|web ?page|landing page|portfolio|home ?page|one-?page site)\b/],
 ['flash','flashcards',/flash ?cards?|\bquiz\b|study cards|vocab(ulary)? (cards|trainer)|memori[sz]e/],
 ['guess','a number guessing game',/guess(ing)? (the |a )?number|number (guessing )?game|higher or lower/],
 ['pomo','a pomodoro timer',/pomodoro|focus timer/],
 ['stopwatch','a stopwatch',/stopwatch|lap timer/],
 ['timer','a countdown timer',/\b(count ?down|timer|alarm)\b/],
 ['calc','a calculator',/calculator|calculate|converter|\bconvert\b|split (the |a )?bill|\btip\b|\bbmi\b|\bloan\b|mortgage|\binterest\b|\bdiscount\b|percent|\btax\b/],
 ['picker','a random picker',/\brandom\b|\bpick(er)?\b|\bdecid(e|er)\b|decision|\bdice\b|\bcoin\b|\broll\b|\bspin\b|raffle|draw names|\bwheel\b/],
 ['password','a password generator',/password|passcode|\bpin generator\b/],
 ['expense','an expense tracker',/expense|budget|spending|money tracker|savings tracker|finance/],
 ['text','a text tool',/word count|character count|text tool|case convert|\buppercase\b|reverse text/],
 ['counter','a counter or habit tracker',/\bcounter\b|\btally\b|\bhabit\b|\bstreak\b|\btracker\b|\btrack\b|\bcount (my|the)\b/],
 ['notes','a notes app',/\bnotes?\b|journal|diary|\bmemo\b|notebook/],
 ['todo','a to-do list',/to-?do|\btasks?\b|checklist|shopping|grocery|packing|\blist\b|reminder|chores/]
];
// Documents (plain text), used when no app word is present.
const DOCS=[
 ['letter','a letter',/\b(cover letter|letter|resignation|complaint)\b/],
 ['email','an email',/\be-?mail\b|\bmessage\b/],
 ['agenda','a meeting agenda',/\bagenda\b/],
 ['minutes','meeting minutes',/\bminutes\b/],
 ['schedule','a schedule',/\b(schedule|timetable|weekly plan|study plan|routine)\b/],
 ['workout','a workout plan',/\b(workout|exercise plan|training plan)\b/],
 ['outline','an outline',/\b(outline|essay|report)\b/],
 ['speech','a speech',/\b(speech|toast|presentation script)\b/],
 ['invitation','an invitation',/\binvit(e|ation)\b/]
];
const WRITE=/\b(write|draft|compose|make|create|prepare|plan|need|want|help me with)\b/;
const clean=s=>s.replace(/\s+/g,' ').replace(/^[\s,.;:'"“”-]+|[\s,.;:'"“”-]+$/g,'').replace(/^(a|an|the|some|my|your)\s+/i,'').trim();
function colorOf(s){for(const k in COLORS)if(new RegExp('\\b'+k+'\\b','i').test(s))return k;return null}
function titleOf(s){const m=s.match(/\b(?:called|named|titled|title)\s+(?:it\s+)?["“]?([^"”,.;:\n]+?)["”]?(?=$|[,.;:\n]|\s+(?:with|and|that|which|in|using|for|to)\b)/i);return m?clean(m[1]).slice(0,60):null}
function itemsOf(s){let rest=null,m;
 if((m=s.match(/:\s*([\s\S]+)$/)))rest=m[1];
 else if((m=s.match(/\b(?:with|containing|including|that has|having)\s+([\s\S]+)$/i)))rest=m[1];
 if(rest==null)return[];
 const flash=/\s(?:-|=|–|—|->|=>)\s|\?\s/.test(rest)||/;\s*\S/.test(rest)&&/[-=–—]/.test(rest);
 const parts=flash?rest.split(/\s*[;\n]\s*/):rest.split(/\s*(?:,|;|\n|\band\b|\bthen\b)\s*/i);
 return parts.map(clean).filter(x=>x&&x.length<=120&&!/\b(theme|colou?rs?|dark mode|light mode|button|background|font|big|small|simple|nice|pretty)\b/i.test(x)&&!/^(that|which|so|it|them)\b/i.test(x)).slice(0,60)}
function numbersOf(s){return(s.match(/\d+(?:\.\d+)?/g)||[]).map(Number)}
function timeOf(s){const m=s.match(/(\d+(?:\.\d+)?)\s*-?\s*(hours?|hrs?|minutes?|mins?|seconds?|secs?)\b/i);if(!m)return null;const n=+m[1],u=m[2][0].toLowerCase();return Math.round(u==='h'?n*3600:u==='m'?n*60:n)}
function langOf(low){for(const[n,re]of LANGS)if(re.test(low))return n;return null}
function parse(raw){
 const s=String(raw||'').trim(),low=s.toLowerCase(),out={raw:s,route:'unknown',kind:null,what:null,title:titleOf(s),items:itemsOf(s),color:colorOf(low),numbers:numbersOf(s),seconds:timeOf(s),lang:langOf(low),notes:[]};
 if(!s){out.notes.push('Describe what you want first.');return out}
 const app=APPW.test(low),lang=out.lang||(/\bregex|regular expression\b/.test(low)?'regex':/\bsql\b/.test(low)?'sql':null);
 const codeAsk=CODEW.test(low)&&(lang||/^(write|how (do|to|can)|show me)\b/.test(low));
 if(lang&&codeAsk&&!/\b(app|website|web ?page|game|tracker|calculator|timer)\b/.test(low)){out.route='code';out.kind='code';out.what='code'+(lang==='regex'?' (a regular expression)':' in '+lang);out.lang=lang;return out}
 const doc=!app&&WRITE.test(low)?DOCS.find(d=>d[2].test(low)):null;
 if(doc){out.route='doc';out.kind=doc[0];out.what=doc[1];
  const to=s.match(/\bto\s+(?:my\s+|the\s+)?([A-Z][\w'-]*(?:\s+[A-Z][\w'-]*)*|boss|manager|landlord|teacher|team|client|friend|mom|dad|neighbou?r)/);if(to)out.to=clean(to[1]);
  const ab=s.match(/\b(?:about|regarding|on|for)\s+([^,.;:\n]+)/i);if(ab)out.topic=clean(ab[1]).slice(0,80);
  return out}
 const k=KINDS.find(x=>x[2].test(low));
 if(k){out.route='app';out.kind=k[0];out.what=k[1];
  if(k[0]==='flash'&&!out.items.length)out.notes.push('No cards given. You can add cards inside the app.');
  if(k[0]==='todo'&&!out.items.length)out.notes.push('Starts empty. You can add items inside the app.');
  return out}
 out.notes.push('I do not recognise a thing to build yet. I will search the library for the closest match.');return out}

// ---- Phase 2: find what the library already knows ----
// Look-up that leaves the Ask tab untouched: no follow-up context in, and context, usage counts and synapses restored after.
function peek(lib,q){const s={last:lib.last,wm:lib.wm,lastIds:lib.lastIds,use:Object.assign({},lib.use),links:Object.assign({},lib.links)};let r=null,unk=[];
 lib.wm=[];try{r=lib.ask(q);unk=r?(r.unk||[]):(lib._unk||[])}catch(e){r=null}
 finally{lib.last=s.last;lib.wm=s.wm;lib.lastIds=s.lastIds;lib.use=s.use;lib.links=s.links;lib._rel=new Map();if(lib.saveBrain)try{lib.saveBrain()}catch(e){}}
 return{r,unk}}
const KQ={todo:'todo list app build html single file task',timer:'timer javascript',pomo:'timer javascript',stopwatch:'timer javascript',calc:'calculator formula percentage',flash:'memory techniques active recall spaced repetition',guess:'random number javascript',picker:'random number javascript',password:'password hashing security',expense:'budget spreadsheet formulas',counter:'counter javascript localstorage save data',notes:'note taking',text:'text string javascript',site:'html css website page layout'};
const DQ={letter:'writing tone',email:'writing tone',agenda:'writing',minutes:'note taking',schedule:'study skills',workout:'planning',outline:'essay structure',speech:'speaking',invitation:'writing'};
function queriesFor(p){const q=[];
 if(p.route==='code'){const rest=p.raw.replace(/^\s*(please\s+)?(can you\s+)?(write|make|show me|give me|how (do|to|can) (i|you))\s+(me\s+)?(an?\s+|the\s+)?/i,'');q.push(p.raw);if(rest&&rest!==p.raw)q.push('how to '+rest)}
 else if(p.route==='app'){q.push(p.raw.replace(/\b(make|build|create|me|an?|the|app)\b/gi,' ').replace(/\s+/g,' ').trim()||p.what);q.push(KQ[p.kind]||p.what)}
 else if(p.route==='doc'){q.push(((p.what||'')+' '+(p.topic||'')).trim());q.push(DQ[p.kind]||p.what)}
 else q.push(p.raw);
 return[...new Set(q.filter(Boolean))]}
function where(lib,leaves){const set=new Set(leaves),pa=new Map(),L=(lib.data&&lib.data.Library)||{};
 for(const b in L){if(!set.size)break;const a=L[b];if(!Array.isArray(a))continue;for(const l of a)if(set.has(l)){pa.set(l,b.replace(' / ',' › '));set.delete(l)}}return pa}
// Returns {queries, pieces:[{t,code,path,conf,mine}], unknown:[], sections:[]}. Never writes to the library.
function gather(lib,p){const qs=queriesFor(p),got=[],unknown=new Set();
 for(const q of qs){const{r,unk}=peek(lib,q);unk.forEach(x=>unknown.add(x));if(!r)continue;r.leaves.forEach(l=>{if(l&&l.t&&!got.some(g=>g.l.t===l.t))got.push({l,conf:r.conf,q})})}
 const pa=where(lib,got.map(g=>g.l)),want=p.route==='doc'?0:1;
 const pieces=got.map(g=>{const path=pa.get(g.l)||'Library';return{t:g.l.t,code:!!g.l.code,path,conf:g.conf,mine:/^Created\b/.test(path),score:g.conf+((!!g.l.code)===!!want?15:0)+(/^Created\b/.test(path)?20:0)}})
  .filter(x=>x.mine||x.conf>=(p.route==='unknown'?80:50)).sort((a,b)=>b.score-a.score).slice(0,6).map(({score,...x})=>x);
 const sections=[...new Set(pieces.map(x=>x.path.split(' › ')[0]))];
 const own=new Set((p.items.join(' ')+' '+(p.title||'')+' '+(p.to||'')+' '+(p.topic||'')).toLowerCase().match(/[a-z]+/g)||[]);
 const known=w=>KINDS.some(k=>k[2].test(w))||DOCS.some(d=>d[2].test(w))||APPW.test(w)||CODEW.test(w)||WRITE.test(w);
 const unk=[...unknown].filter(w=>!known(w)&&![...own].some(o=>o===w||o.startsWith(w)||w.startsWith(o)));
 return{queries:qs,pieces,unknown:unk,sections}}

// ---- Phase 9: take real information from the library for a build ----
// Each kind has a targeted look-up and a topic test. A leaf is only taken when it is plain text, passes the topic test, has no code-like or placeholder words, and is not one of your own saved creations.
const TIPQ={todo:'task list priorities checklist',timer:'timer setTimeout setInterval delay',pomo:'pomodoro focus break',stopwatch:'stopwatch timing lap',calc:'tip percent discount calculate',flash:'flashcards active recall spaced repetition',guess:'binary search guess number',picker:'random fair coin probability',password:'password strong passphrase',expense:'budget money spend plan',counter:'habit streak tracking',notes:'note taking notes',text:'text word count string',site:'html css layout responsive page',letter:'tone reader subject writing',email:'email subject tone reader',agenda:'agenda meeting',minutes:'meeting notes minutes',schedule:'study plan schedule time',workout:'exercise workout plan',outline:'essay outline thesis structure',speech:'presentation audience speech',invitation:'invitation event writing'};
const TOPIC={todo:/\b(to-?do|checklists?|prioriti[sz])/i,timer:/\b(timers?|setTimeout|setInterval|countdown)/i,pomo:/\b(pomodoro|focus|breaks?)\b/i,stopwatch:/\b(stopwatch|laps?|timing)\b/i,calc:/\b(tip|percent|discount|tax|interest|loan|bill|convert|bmi)/i,flash:/\b(flash ?cards?|active recall|spaced repetition|recall)/i,guess:/\b(binary search|guess)/i,picker:/\b(random|probabilit|coin|dice|fair)/i,password:/\b(passwords?|passphrase|hash)/i,expense:/\b(budget|expenses?|saving|spend|profit)/i,counter:/\b(habits?|streaks?|tracking)\b/i,notes:/\b(notes?|journal|cornell|zettelkasten)/i,text:/\b(word count|characters?|strings?|text)\b/i,site:/\b(html|css|layout|responsive|landing|accessib)/i,letter:/\b(letters?|e-?mail|tone|subject line|reader)/i,email:/\b(e-?mail|subject line|tone|reader)/i,agenda:/\b(agenda|meetings?)\b/i,minutes:/\b(minutes|meetings?)\b/i,schedule:/\b(schedule|study|routine|plan)/i,workout:/\b(workout|exercise|training)/i,outline:/\b(essay|outline|thesis|paragraph)/i,speech:/\b(speaking|audience|presentation)/i,invitation:/\b(invit|event)/i};
const BADTIP=/\b(null|undefined|NaN)\b|\[|\]/;
function brief(t){const s=String(t).replace(/\s+/g,' ').trim(),sen=s.match(/[^.!?]+[.!?]+(?:\s|$)/g)||[s];let o='';for(const x of sen){if((o+x).trim().length>240)break;o+=x}return o.trim()}
// Returns up to 2 {t, s}: the sentence and the section it came from. Never writes to the library.
function tips(lib,p){const q=TIPQ[p&&p.kind],re=TOPIC[p&&p.kind];if(!q||!re)return[];
 const{r}=peek(lib,q);if(!r||!r.leaves||r.conf<50)return[];
 const pa=where(lib,r.leaves),out=[];
 for(const l of r.leaves){if(!l||!l.t||l.code)continue;const path=pa.get(l)||'Library';if(/^Created\b/.test(path))continue;
  const t=brief(l.t);if(!t||!re.test(t)||BADTIP.test(t)||out.some(o=>o.t===t))continue;out.push({t,s:path});if(out.length>=2)break}
 return out}

const api={parse,gather,peek,tips,COLORS,KINDS:KINDS.map(k=>k[0]),DOCS:DOCS.map(d=>d[0])};
if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.Create=api;
})(typeof window!=='undefined'?window:globalThis);
