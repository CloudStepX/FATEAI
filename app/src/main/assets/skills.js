// Skills (Phase 11): things the Library cannot answer but the device can compute, plus honest answers about what the app is and cannot do.
// Runs before the Library look-up. Rule-based, no network, never runs user code, never writes to the Library.
//   Skills.answer(q, lib, now) -> {text, note} | null     arithmetic, percentages, unit conversion, date and time, who/what am I, live-data limits
//   Skills.fix(q, lib)         -> {q, changes:[[from,to]]} | null   repairs words the Library has never seen when a close known word exists
(function(root){
const NUM='-?\\d+(?:,\\d{3})*(?:\\.\\d+)?|-?\\.\\d+';
const toNum=s=>parseFloat(String(s).replace(/,/g,''));
function fmt(n){if(!isFinite(n))return null;if(n===0)return '0';const a=Math.abs(n);
 if(a>=1e15||a<1e-7)return n.toExponential(6).replace(/\.?0+e/,'e');
 return String(+n.toPrecision(12)).replace(/^(-?\d+)(\.\d+)?$/,(m,i,f)=>i.replace(/\B(?=(\d{3})+(?!\d))/g,',')+(f||''))}
const skipStore=/^(remember|forget|teach|call me|my |i am |i'm |i like|i love|i hate|i live|i work|feed )/i;

// ---------- arithmetic ----------
function evaluate(src){let i=0;const s=src;
 const ws=()=>{while(s[i]===' ')i++};
 const fail=()=>{throw new Error('x')};
 function num(){ws();const m=/^(\d+(?:\.\d+)?|\.\d+)/.exec(s.slice(i));if(!m)fail();i+=m[1].length;return parseFloat(m[1])}
 function prim(){ws();if(s[i]==='('){i++;const v=add();ws();if(s[i]!==')')fail();i++;return v}
  const f=/^(sqrt|abs)\s*\(/.exec(s.slice(i));if(f){i+=f[0].length;const v=add();ws();if(s[i]!==')')fail();i++;fn=true;return f[1]==='sqrt'?Math.sqrt(v):Math.abs(v)}
  return num()}
 function un(){ws();if(s[i]==='-'){i++;return -un()}if(s[i]==='+'){i++;return un()}return pw()}
 function pw(){const b=prim();ws();if(s[i]==='^'){i++;ops=true;return Math.pow(b,un())}return b}
 function mul(){let v=un();for(;;){ws();const c=s[i];if(c==='*'||c==='/'){i++;ops=true;const r=un();if(c==='/'&&r===0){zero=true;return NaN}v=c==='*'?v*r:v/r}else if(c==='%'&&/^%\s*[\d(]/.test(s.slice(i))){i++;ops=true;const r=un();if(r===0){zero=true;return NaN}v=v%r}else return v}}
 function add(){let v=mul();for(;;){ws();const c=s[i];if(c==='+'||c==='-'){i++;ops=true;const r=mul();v=c==='+'?v+r:v-r}else return v}}
 let ops=false,fn=false,zero=false;
 try{const v=add();ws();if(i!==s.length)return null;if(!ops&&!fn)return null;return{v,zero}}catch(e){return null}}
function words2ops(t){return t.replace(/\bsquare root of\s+(\d[\d.,]*)/g,'sqrt($1)').replace(/\b(\d[\d.,]*)\s+squared\b/g,'$1^2').replace(/\b(\d[\d.,]*)\s+cubed\b/g,'$1^3')
 .replace(/\bto the power of\b|\braised to\b/g,'^').replace(/\bmultiplied by\b|\btimes\b/g,'*').replace(/\bdivided by\b|\bover\b/g,'/').replace(/\bplus\b|\band\b(?=\s*\d)/g,'+').replace(/\bminus\b|\btake away\b/g,'-').replace(/\bmod(?:ulo)?\b/g,'%')
 .replace(/(\d)\s*[x×]\s*(?=[\d(])/g,'$1*').replace(/÷/g,'/').replace(/×/g,'*').replace(/−/g,'-')}
function calc(q){let t=q.toLowerCase().trim().replace(/[?!]+$/,'').replace(/\s*=\s*$/,'').replace(/^(?:hey |hi )?(?:please\s+)?(?:what(?:'s| is| are)|whats|calculate|compute|solve|work out|how much is|how much are|tell me|find|evaluate)\s+(?:the\s+(?:result|answer|value) of\s+)?/,'').trim();
 let m,r;
 if((m=t.match(new RegExp('^('+NUM+')\\s*(?:%|percent|per cent)\\s+(?:off|discount on)\\s+('+NUM+')$')))){const p=toNum(m[1]),x=toNum(m[2]);return{text:fmt(x*(1-p/100))+' ('+fmt(x)+' with '+fmt(p)+'% off: you save '+fmt(x*p/100)+')',how:'percentage'}}
 if((m=t.match(new RegExp('^('+NUM+')\\s*(?:%|percent|per cent)\\s+of\\s+('+NUM+')$')))){return{text:fmt(toNum(m[1])/100*toNum(m[2])),how:'percentage',show:m[1]+'% of '+m[2]}}
 if((m=t.match(new RegExp('^what\\s+(?:percent|percentage|%)\\s+(?:is|of)\\s+('+NUM+')\\s+(?:of\\s+)?('+NUM+')$')))||(m=t.match(new RegExp('^('+NUM+')\\s+is\\s+what\\s+(?:percent|percentage|%)\\s+of\\s+('+NUM+')$')))){const b=toNum(m[2]);if(b===0)return{text:'That divides by zero, which has no answer.',how:'percentage'};return{text:fmt(toNum(m[1])/b*100)+'%',how:'percentage',show:m[1]+' as a percent of '+m[2]}}
 if((m=t.match(new RegExp('^(increase|raise|add|decrease|reduce|lower|cut|subtract)\\s+('+NUM+')\\s+by\\s+('+NUM+')\\s*(?:%|percent|per cent)$')))){const x=toNum(m[2]),p=toNum(m[3]),up=/^(increase|raise|add)$/.test(m[1]);return{text:fmt(up?x*(1+p/100):x*(1-p/100)),how:'percentage',show:m[1]+' '+m[2]+' by '+m[3]+'%'}}
 t=words2ops(t).replace(/(\d),(?=\d{3}\b)/g,'$1');
 if(!/[\d)]/.test(t)||!/^[\d\s.+\-*/^()%a-z]+$/.test(t))return null;
 if(/[a-z]/.test(t.replace(/sqrt|abs/g,'')))return null;
 r=evaluate(t);if(!r)return null;
 if(r.zero||Number.isNaN(r.v))return{text:r.zero?'That divides by zero, which has no answer.':'That has no real answer.',how:'arithmetic'};
 const f=fmt(r.v);if(f==null)return{text:'That number is too big for me to show.',how:'arithmetic'};
 return{text:f,how:'arithmetic',show:t.replace(/\*/g,' × ').replace(/\//g,' ÷ ').replace(/\s+/g,' ').trim()}}

// ---------- unit conversion ----------
const U={};const def=(cat,base,list)=>{for(const[names,f]of list)names.split('|').forEach(n=>U[n]={cat,f,name:names.split('|')[0]})};
def('length','m',[['m|meter|meters|metre|metres',1],['km|kilometer|kilometers|kilometre|kilometres',1000],['cm|centimeter|centimeters|centimetre|centimetres',.01],['mm|millimeter|millimeters|millimetre|millimetres',.001],['mi|mile|miles',1609.344],['yd|yard|yards',.9144],['ft|foot|feet',.3048],['inch|inches',.0254]]);
def('mass','kg',[['kg|kilogram|kilograms|kilo|kilos',1],['g|gram|grams',.001],['mg|milligram|milligrams',1e-6],['lb|lbs|pound|pounds',.45359237],['oz|ounce|ounces',.028349523125],['tonne|tonnes',1000]]);
def('volume','l',[['l|liter|liters|litre|litres',1],['ml|milliliter|milliliters|millilitre|millilitres',.001],['gal|gallon|gallons',3.785411784],['qt|quart|quarts',.946352946],['pint|pints',.473176473],['cup|cups',.2365882365],['tbsp|tablespoon|tablespoons',.01478676478125],['tsp|teaspoon|teaspoons',.00492892159375]]);
def('speed','m/s',[['m/s|mps',1],['km/h|kph|kmh|kmph',1/3.6],['mph|mi/h',.44704],['knot|knots|kn',.514444],['ft/s|fps',.3048]]);
def('time','s',[['s|sec|secs|second|seconds',1],['ms|millisecond|milliseconds',.001],['min|mins|minute|minutes',60],['h|hr|hrs|hour|hours',3600],['day|days',86400],['week|weeks|wk|wks',604800],['year|years',31536000]]);
def('temperature','c',[['c|celsius|centigrade',1],['f|fahrenheit',1],['k|kelvin',1]]);
const tempTo={c:v=>v,f:v=>(v-32)*5/9,k:v=>v-273.15},tempFrom={c:v=>v,f:v=>v*9/5+32,k:v=>v+273.15};
const clean=s=>s.replace(/°/g,'').replace(/\s+/g,' ').trim().replace(/^(a|an|the|of)\s+/,'');
function unit(s){s=clean(s.toLowerCase());if(U[s])return U[s];if(s.endsWith('s')&&U[s.slice(0,-1)])return U[s.slice(0,-1)];return null}
function convert(q){let t=q.toLowerCase().trim().replace(/[?!.]+$/,'').replace(/\bsquare\b/g,'sq'),m,n,a,b;
 if((m=t.match(new RegExp('^how many\\s+([a-z/°. ]+?)\\s+(?:are |is |do you get )?(?:there )?in\\s+(?:(a|an|one)\\s+|('+NUM+')\\s*)([a-z/°. ]+)$')))){b=unit(m[1]);a=unit(m[4]);n=m[2]?1:toNum(m[3])}
 else if((m=t.match(new RegExp('^(?:convert|change|turn|what is|what\'s|how much is|how many)?\\s*('+NUM+')\\s*([a-z/°.]+(?: [a-z]+)?)\\s+(?:to|in|into|as|equals? how many|=)\\s+([a-z/°.]+(?: [a-z]+)?)$')))){n=toNum(m[1]);a=unit(m[2]);b=unit(m[3])}
 else return null;
 if(!a||!b)return null;
 if(a.cat!==b.cat)return{text:'I cannot convert '+a.cat+' ('+a.name+') into '+b.cat+' ('+b.name+'): they measure different things.',how:'units'};
 let v;if(a.cat==='temperature'){const ka=a.name[0]==='c'?'c':a.name==='fahrenheit'||a.name==='f'?'f':'k',kb=b.name==='c'||b.name==='celsius'||b.name==='centigrade'?'c':b.name==='f'||b.name==='fahrenheit'?'f':'k';v=tempFrom[kb](tempTo[ka](n))}
 else v=n*a.f/b.f;
 const out=fmt(+v.toPrecision(6));if(out==null)return null;
 const note=a.name==='year'||b.name==='year'?'A year is counted as 365 days.':'';
 return{text:out+' '+b.name+(b.name==='feet'||b.name==='inches'?'':''),how:'units',show:fmt(n)+' '+a.name+' = '+out+' '+b.name,note}}

// ---------- date and time (from the device clock) ----------
function clock(q,now){const t=q.toLowerCase().trim().replace(/[?!.]+$/,'').replace(/\s+/g,' ');
 if(!/\b(time|date|day|year|month|today)\b/.test(t))return null;
 const D=now||new Date(),opt=o=>D.toLocaleString('en-US',o);
 const time=opt({hour:'numeric',minute:'2-digit'}),day=opt({weekday:'long'}),date=opt({day:'numeric',month:'long',year:'numeric'});
 let w=null;
 if(/^(?:what(?:'s| is)?\s+)?the (?:current )?time(?: now| right now)?$|^what time is it(?: now| right now)?$|^(?:what(?:'s| is) )?(?:the )?current time$|^time now$/.test(t))w='It is '+time+' by your device\'s clock.';
 else if(/^what(?:'s| is)? (?:the )?(?:today'?s |current )?date(?: today)?$|^today'?s date$|^what date is (?:it|today)$|^what is today'?s date$/.test(t))w='Today is '+day+', '+date+'.';
 else if(/^what day (?:is it|is today|of the week is it|of the week is today)$|^what(?:'s| is) today$|^which day is (?:it|today)$/.test(t))w='Today is '+day+' ('+date+').';
 else if(/^what (?:year|month) is it(?: now)?$|^what(?:'s| is) the (?:current )?(year|month)$|^what(?:'s| is) (?:the )?current (year|month)$/.test(t))w=/year/.test(t)?'It is '+D.getFullYear()+'.':'It is '+opt({month:'long'})+' '+D.getFullYear()+'.';
 else if(/^what time and date is it$|^what(?:'s| is) the date and time$|^date and time$/.test(t))w='It is '+time+' on '+day+', '+date+'.';
 return w?{text:w,how:'clock',note:'Read from your device\'s clock.'}:null}

// ---------- who am I, what can I do, what I cannot know ----------
function stats(lib){const live=(lib.leaves||[]).filter(x=>x&&!x.dead),sec=new Set();
 for(const b in (lib.data&&lib.data.Library)||{}){const i=b.indexOf(' / ');sec.add(i>0?b.slice(0,i):b)}return{leaves:live.length,sections:[...sec]}}
function meta(q,lib){const t=q.toLowerCase().trim().replace(/[?!.]+$/,'').replace(/\s+/g,' '),st=stats(lib||{}),n=st.leaves.toLocaleString('en-US');
 const secs=st.sections.length?st.sections.join(', '):'none yet';
 if(/^(?:who|what) (?:are|r) (?:you|u)$|^what(?:'s| is) your name$|^your name$|^who is this$|^tell me about yourself$|^introduce yourself$|^what should i call you$|^who am i talking to$/.test(t))
  return{text:'I am Fate Tree, an AI that lives entirely on this device. I have no internet and no outside model. I answer by looking things up in my own Library of '+n+' facts in '+st.sections.length+' sections, and I tell you plainly when I do not know something.',how:'about me'};
 if(/^who (?:made|built|created|wrote|programmed|designed|owns) (?:you|this|this app)$|^who is your (?:creator|maker|developer|author)$/.test(t))
  return{text:'I was built as an offline app called Fate Tree. I do not have a record of a personal creator beyond that. My knowledge comes from the starter Library plus whatever you feed or teach me.',how:'about me'};
 if(/^(?:what can you do|what do you do|how can you help(?: me)?|what are you good at|what can i ask(?: you)?|what should i ask(?: you)?|what can i do here|help|help me|commands|what are your (?:skills|features|abilities)|how do i use (?:this|you|the app|this app)|how does this app work|how do i use fate tree)$/.test(t))
  return{text:'Here is what I can do:\n• Answer questions from my Library: '+n+' facts in these sections: '+secs+'.\n• Calculate: "15% of 80", "12*7+3", "square root of 144".\n• Convert units: "5 miles to km", "20 C to F".\n• Tell the date and time from your device.\n• Explain code: paste it into the Ask box.\n• Remember things about you: "my name is Sam" or "remember that ...".\n• Learn: when I do not know something, teach me the answer.\n• Build: describe an app or a document on the Create tab.\nI cannot look anything up online, and I only know what is in my Library.',how:'about me'};
 if(/^what do you know$|^what do you know about$|^what (?:topics|subjects|things) (?:do you know|can you answer|do you cover)$|^which (?:topics|subjects) do you know$|^what (?:are|is) in your library$|^what is your library$|^what do you know about everything$|^how much do you know$/.test(t))
  return{text:'I know '+n+' facts in '+st.sections.length+' sections: '+secs+'. Open the Tree tab to browse them, or ask me about any of these. Say "what do you know about me" to hear what I remember about you.',how:'about me'};
 if(/^(?:are you|r u) (?:online|connected|offline)$|^do you (?:use|have|need) (?:the )?(?:internet|wifi|wi-fi|a connection|network)$|^can you (?:go online|browse|search the web|access the internet)$|^do you (?:search|browse) the (?:web|internet)$/.test(t))
  return{text:'No. I have no internet permission at all, so I cannot go online. Everything I say comes from my own Library on this device.',how:'about me'};
 if(/^(?:are|r) (?:you|u) (?:an? )?(?:ai|a\.i\.|bot|robot|chatbot|machine|computer|program|real|human|a person|alive|smart|chatgpt|gpt|claude|gemini)$|^is this (?:an )?(?:ai|a bot|a real person|chatgpt)$/.test(t))
  return{text:'I am an AI program, not a person. I am a small, rule-based one: I match your words to facts in my Library. I am not ChatGPT or another large language model, and I do not run on a server.',how:'about me'};
 if(/^how do you (?:work|think|learn|answer|know things)$|^how (?:were|are) you (?:made|built)$|^how does fate tree work$|^explain how you work$/.test(t))
  return{text:'When you ask something, I split it into words, match them (and their synonyms) against every leaf in my Library, and combine the best matches into an answer. If one section is missing a word, it asks the others. I learn only when you feed me text or teach me an answer, and I say so when I do not know.',how:'about me'};
 return null}
const LIVE=/\b(?:weather|forecast)\b.*\b(?:today|tonight|tomorrow|now|this week|this weekend|in [a-z ]+|like)\b|^(?:what(?:'s| is) )?(?:the )?(?:weather|forecast)\b(?! and)|\b(?:latest|today'?s|breaking) (?:news|headlines)\b|^(?:any |what'?s the )?news\b|\b(?:stock|share|bitcoin|btc|ethereum|crypto) price\b|\bexchange rate\b|\bwho won\b|\blive score\b|\bnear me\b|\bdirections to\b|\btraffic (?:now|today|on)\b|\btrending\b/;
const FACTS=/^(?:what(?:'s| is) the (?:capital|population|currency|president|prime minister|area|flag) of|who is the (?:current )?(?:president|prime minister|ceo|king|queen|leader|mayor|governor) of|how (?:old|tall|big|far) is|when was .+ (?:born|founded|elected))\b/;
function limits(q,lib){const t=q.toLowerCase().trim().replace(/[?!.]+$/,'');
 if(!(LIVE.test(t)||FACTS.test(t)))return null;
 const sec=stats(lib||{}).sections.slice(0,6).join(', ');
 return{text:'I cannot answer that. I am offline, so I have no live information (weather, news, prices, scores), and my Library does not hold general facts about places, people or things in the news. I do know: '+sec+(sec?' and more':'')+'. If you know the answer, tell me and I will keep it: type it in the Teach box when I say I do not know, or say "remember that ...".',how:'limit'}}

function answer(q,lib,now){const s=String(q||'').trim();if(!s||s.length>300||skipStore.test(s))return null;
 let r=null;for(const f of[()=>meta(s,lib),()=>clock(s,now),()=>calc(s),()=>convert(s),()=>limits(s,lib)]){try{r=f()}catch(e){r=null}if(r)break}
 if(!r)return null;
 const note=r.note||(r.how==='arithmetic'||r.how==='percentage'?'Calculated on this device.':r.how==='units'?'Converted on this device.':'');
 const text=r.show&&(r.how==='arithmetic'||r.how==='percentage'||r.how==='units')?(r.how==='units'?r.show:r.show+' = '+r.text):r.text;
 return{text,note,how:r.how}}

// ---------- repair misspelt words ----------
const stem=w=>{if(w.length>4)w=w.replace(/(ing|edly|ed|es|s)$/,'');return w.length>3?w.replace(/e$/,''):w};
function dist(a,b,max){if(Math.abs(a.length-b.length)>max)return max+1;let p2=null,p=Array.from({length:b.length+1},(_,j)=>j);
 for(let i=1;i<=a.length;i++){const c=[i];let lo=i;for(let j=1;j<=b.length;j++){let v=Math.min(p[j]+1,c[j-1]+1,p[j-1]+(a[i-1]===b[j-1]?0:1));
  if(i>1&&j>1&&a[i-1]===b[j-2]&&a[i-2]===b[j-1])v=Math.min(v,p2[j-2]+1);c[j]=v;if(v<lo)lo=v}
  if(lo>max)return max+1;p2=p;p=c}return p[b.length]}
const FILL=new Set('what which where when whose whom does this that with from have tell show explain give about would could should there their them they your mean means please rather than then also into over under some many much more most such like just only very make made'.split(' '));
const surf=new WeakMap();
function surface(lib){const key=(lib.leaves||[]).length;let c=surf.get(lib);if(c&&c.key===key)return c.m;const m=new Map();
 for(const L of lib.leaves||[]){if(!L||L.dead||!L.l||L.l.code)continue;for(const w of (L.l.t.toLowerCase().match(/[a-z]{4,}/g)||[])){const s=stem(w);let e=m.get(s);if(!e)m.set(s,e=new Map());e.set(w,(e.get(w)||0)+1)}}
 const out=new Map();for(const[s,e]of m){let best=null,bn=0;for(const[w,n]of e)if(n>bn){best=w;bn=n}out.set(s,best)}surf.set(lib,{key,m:out});return out}
function fix(q,lib){if(!lib||!lib.df||!lib.df.size)return null;const s=String(q||'');if(s.length>200||skipStore.test(s.trim()))return null;
 const words=[...new Set(s.toLowerCase().match(/[a-z]{4,}/g)||[])],changes=[];let out=s;
 const sf=words.some(w=>!lib.df.has(stem(w)))?surface(lib):null;if(!sf)return null;
 for(const w of words){const st=stem(w);if(lib.df.has(st)||FILL.has(w)||sf.has(st))continue;const max=st.length>=6?2:1;let best=null,bd=max+1,bn=0;
  for(const[k,n]of lib.df){if(k.length<4||Math.abs(k.length-st.length)>max||!sf.has(k))continue;const d=dist(st,k,max);if(d<bd||(d===bd&&n>bn)){best=k;bd=d;bn=n}}
  if(best&&bd<=max){const to=sf.get(best);if(to&&to!==w){out=out.replace(new RegExp('\\b'+w+'\\b','gi'),to);changes.push([w,to])}}}
 return changes.length?{q:out,changes}:null}

const api={answer,fix,calc,convert,clock,meta,limits};
if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.Skills=api;
})(typeof window!=='undefined'?window:globalThis);
