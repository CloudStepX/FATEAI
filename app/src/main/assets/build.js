// Create engine, Phases 3-5: assemble an app or document from templates, refine it, and describe it for the library.
// Pure rules, runs on the device, no network. Every app is ONE self-contained HTML file with its own look.
(function(root){
const Create=typeof require!=='undefined'&&typeof module!=='undefined'&&module.exports?require('./create.js'):root.Create;
const COLORS=Create.COLORS;
const ESC=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
// Data goes into the page as JSON in a non-executing script tag. Break out of </script> and <!-- and keep it one line.
const J=o=>JSON.stringify(o).replace(/</g,'\\u003c').replace(/>/g,'\\u003e').replace(/&/g,'\\u0026').replace(/\u2028/g,'\\u2028').replace(/\u2029/g,'\\u2029');
const cap=s=>s?s[0].toUpperCase()+s.slice(1):s;
const SANS='system-ui,-apple-system,"Segoe UI",Roboto,sans-serif',SERIF='Georgia,"Times New Roman",serif',MONO='ui-monospace,Menlo,Consolas,monospace';
// Each kind has its own look: theme, font, corner radius, accent.
const STY={
 todo:{t:'light',f:SERIF,r:10,acc:'#d9703a',bgl:'#faf6ec'},counter:{t:'dark',f:SANS,r:28,acc:'#4da3ff'},
 timer:{t:'dark',f:MONO,r:14,acc:'#ff6b57',bgd:'#120d0d'},pomo:{t:'dark',f:SANS,r:20,acc:'#ff5c5c',bgd:'#17100f'},stopwatch:{t:'dark',f:MONO,r:12,acc:'#2dd4bf',bgd:'#0a1214'},
 calc:{t:'light',f:SANS,r:14,acc:'#2f7de1'},basic:{t:'dark',f:SANS,r:16,acc:'#ffa94d'},convert:{t:'light',f:SANS,r:12,acc:'#7a5af8',bgl:'#f3f1fb'},
 flash:{t:'light',f:SERIF,r:16,acc:'#e0a526',bgl:'#fbf5e6'},notes:{t:'light',f:SERIF,r:6,acc:'#c9a227',bgl:'#fff8d6'},
 picker:{t:'dark',f:SANS,r:18,acc:'#b388ff',bgd:'#110d1a'},guess:{t:'dark',f:SANS,r:14,acc:'#ffa94d'},password:{t:'dark',f:MONO,r:6,acc:'#39ff88',bgd:'#050a07'},
 text:{t:'light',f:MONO,r:6,acc:'#3b82f6'},site:{t:'light',f:SERIF,r:14,acc:'#2f7d6d',bgl:'#fbfaf6'},expense:{t:'light',f:SANS,r:12,acc:'#16a34a',bgl:'#f1f7f2'}};
const lum=h=>{const c=[1,3,5].map(i=>parseInt(h.slice(i,i+2),16)/255).map(v=>v<=.03928?v/12.92:Math.pow((v+.055)/1.055,2.4));return .2126*c[0]+.7152*c[1]+.0722*c[2]};
const SIZES=[.9,1,1.15,1.3];
function css(sp,st){const dark=(sp.theme||st.t)==='dark',own=(sp.theme||st.t)===st.t;
 const P=dark?{bg:(own&&st.bgd)||'#0e1014',card:'#1a1d24',fg:'#eceff4',mut:'#8e97a8',line:'#2b303b'}:{bg:(own&&st.bgl)||'#f6f4ee',card:'#ffffff',fg:'#22252b',mut:'#6d7280',line:'#ddd8cc'};
 const acc=sp.accent&&/^#[0-9a-f]{6}$/i.test(sp.accent)?sp.accent:sp.color&&COLORS[sp.color]?COLORS[sp.color]:st.acc,on=lum(acc)>.179?'#111':'#fff',k=SIZES[Math.max(0,Math.min(3,(sp.size||0)+1))],R=st.r+'px';
 return `:root{--ac:${acc};--on:${on}}*{box-sizing:border-box}html{font-size:${Math.round(16*k*10)/10}px;color-scheme:${dark?'dark':'light'}}body{margin:0;background:${P.bg};color:${P.fg};font:1rem/1.45 ${st.f};-webkit-text-size-adjust:100%}
main{max-width:520px;margin:0 auto;padding:20px 16px 32px}h1{font-size:1.45rem;margin:0 0 16px;line-height:1.2}
button{font:inherit;min-height:44px;padding:8px 16px;border-radius:${R};border:1px solid ${P.line};background:${P.card};color:${P.fg};cursor:pointer}
button.p{background:${acc};border-color:${acc};color:${on};font-weight:600}button:active{transform:scale(.97)}button:disabled{opacity:.45}
input,select,textarea{font:inherit;font-size:16px;width:100%;min-height:44px;padding:9px 12px;border-radius:${R};border:1px solid ${P.line};background:${P.card};color:${P.fg}}
textarea{resize:vertical}input[type=checkbox],input[type=radio]{width:22px;min-height:22px;height:22px;accent-color:${acc}}input[type=range]{padding:0;accent-color:${acc}}
:focus-visible{outline:2px solid ${acc};outline-offset:2px}.card{background:${P.card};border:1px solid ${P.line};border-radius:${R};padding:14px}
.row{display:flex;gap:8px;align-items:center}.row>*{flex:1}.row>button{flex:0 0 auto}.row>button.p:only-child,.row>button:only-child{flex:1}.mut{color:${P.mut};font-size:.85rem}.acc{color:${acc}}
.chips{display:flex;flex-wrap:wrap;gap:6px;margin:8px 0}.chips button{min-height:36px;padding:4px 14px;border-radius:999px}
label.f{display:block;margin:0 0 12px}label.f>span{display:block;margin-bottom:4px;font-size:.85rem;color:${P.mut}}
ul{list-style:none;margin:0;padding:0}li{display:flex;align-items:center;gap:8px;padding:8px 0;border-bottom:1px solid ${P.line}}li>label{flex:1;display:flex;align-items:center;gap:10px;overflow-wrap:anywhere}li.done span{text-decoration:line-through;color:${P.mut}}
li>button{min-height:36px;padding:2px 12px}.res{margin-top:12px}.res .big{font-size:2.2rem;font-weight:700;color:${acc};line-height:1.1}.res .r{display:flex;justify-content:space-between;padding:6px 0;border-bottom:1px solid ${P.line}}
.t{font-size:3.6rem;font-weight:700;text-align:center;letter-spacing:.02em;margin:10px 0;font-variant-numeric:tabular-nums}.t.done{color:${acc};animation:bl .8s 3}@keyframes bl{50%{opacity:.25}}
.bar{height:8px;border-radius:99px;background:${P.line};overflow:hidden}.bar>i{display:block;height:100%;width:0;background:${acc}}
@media(prefers-reduced-motion:reduce){*{animation:none!important;transition:none!important}}`}
// App page shell. The spec rides in a comment so a saved creation can be reused.
function page(sp,st,title,body,extra,fn,data){
 const hdr='<!--fate-create '+J(sp).replace(/--/g,'-\\u002d')+'-->';
 const key=(sp.kind+':'+title).slice(0,60);
 const shim='var S=(function(){var k='+J('fate:'+key)+',m=null;try{localStorage.setItem("_t","1");localStorage.removeItem("_t");return{get:function(){try{return JSON.parse(localStorage.getItem(k))}catch(e){return null}},set:function(v){try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}}}}catch(e){return{get:function(){return m},set:function(v){m=JSON.parse(JSON.stringify(v))}}}})();';
 return '<!doctype html>\n'+hdr+'\n<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta http-equiv="Content-Security-Policy" content="default-src \'none\'; script-src \'unsafe-inline\'; style-src \'unsafe-inline\'; img-src data:"><title>'+ESC(title)+'</title><style>'+css(sp,st)+(extra||'')+'</style></head><body><main>'+body+'</main>'+(fn?'<script type="application/json" id="fate-data">'+J(data||{})+'</script><script>'+shim+'\n('+fn+')(JSON.parse(document.getElementById("fate-data").textContent),S'+(fn.args||'')+');</script>':'')+'</body></html>'}
const $=`var $=function(i){return document.getElementById(i)};`;
// ---------- templates ----------
// Each app template is a REAL function (so it is syntax-checked) that is written into the page as source text.
const A={};
A.todo=(sp,D)=>({body:`<h1>${ESC(D.title)}</h1><div class="row"><input id="in" placeholder="Add an item" autocomplete="off" enterkeyhint="done"><button class="p" id="add">Add</button></div><div class="mut" id="cnt" style="margin:12px 0" aria-live="polite"></div><ul id="ls"></ul><div class="row" style="margin-top:14px;justify-content:flex-start"><button id="cd">Clear done</button>${sp.reset?'<button id="rs">Reset</button>':''}</div>`,
 fn:function(D,S){var $=function(i){return document.getElementById(i)};var st=S.get();var L=Array.isArray(st)?st:D.items.map(function(t){return{t:t,d:0}});
  function save(){S.set(L)}
  function draw(){var ul=$('ls');ul.textContent='';L.forEach(function(it,i){var li=document.createElement('li'),lab=document.createElement('label'),cb=document.createElement('input'),sp=document.createElement('span');cb.type='checkbox';cb.checked=!!it.d;cb.onchange=function(){it.d=cb.checked?1:0;save();draw()};sp.textContent=it.t;if(it.d)li.className='done';lab.append(cb,sp);var x=document.createElement('button');x.textContent='\u00d7';x.setAttribute('aria-label','Remove '+it.t);x.onclick=function(){L.splice(i,1);save();draw()};li.append(lab,x);ul.append(li)});
   var n=L.filter(function(i){return i.d}).length;$('cnt').textContent=L.length?n+' of '+L.length+' done':'Nothing here yet. Add your first item.'}
  function add(){var v=$('in').value.trim();if(!v)return;L.push({t:v,d:0});$('in').value='';save();draw();$('in').focus()}
  $('add').onclick=add;$('in').onkeydown=function(e){if(e.key==='Enter')add()};
  $('cd').onclick=function(){L=L.filter(function(i){return!i.d});save();draw()};
  if($('rs'))$('rs').onclick=function(){L=D.items.map(function(t){return{t:t,d:0}});save();draw()};draw()}});
A.counter=(sp,D)=>({extra:'.n{font-size:6rem;font-weight:800;text-align:center;line-height:1;margin:6px 0 2px;font-variant-numeric:tabular-nums}.pm{display:flex;gap:12px;margin:16px 0}.pm button{flex:1;min-height:84px;font-size:2.4rem}.days{display:flex;gap:8px;align-items:flex-end;height:90px;margin-top:10px}.dy{flex:1;display:flex;flex-direction:column;align-items:center;height:100%;justify-content:flex-end;gap:4px}.dy i{display:block;width:100%;background:currentColor;border-radius:6px;opacity:.85}.dy span{font-size:.75rem}',
 body:`<h1>${ESC(D.title)}</h1><div class="n" id="n" aria-live="polite">0</div><div class="mut" style="text-align:center" id="sub"></div><div class="pm"><button id="mi" aria-label="Subtract one">\u2212</button><button class="p" id="pl" aria-label="Add one">+</button></div>${sp.reset?'<div class="row"><button id="rs">Reset</button></div>':''}<div class="card" style="margin-top:16px"><div class="mut">Last 7 days</div><div class="days acc" id="days"></div></div>`,
 fn:function(D,S){var $=function(i){return document.getElementById(i)};var st=S.get()||{n:D.start,days:{}};
  function key(d){return d.getFullYear()+'-'+(d.getMonth()+1)+'-'+d.getDate()}
  function bump(k){st.n+=k;var t=key(new Date());st.days[t]=(st.days[t]||0)+k;S.set(st);draw()}
  function draw(){$('n').textContent=st.n;var box=$('days');box.textContent='';var arr=[],max=1,i,d;
   for(i=6;i>=0;i--){d=new Date();d.setDate(d.getDate()-i);var v=st.days[key(d)]||0;arr.push([d,v]);if(v>max)max=v}
   arr.forEach(function(a){var c=document.createElement('div');c.className='dy';var b=document.createElement('i');b.style.height=Math.max(3,Math.round(Math.max(a[1],0)/max*100*.7))+'%';var l=document.createElement('span');l.textContent=['S','M','T','W','T','F','S'][a[0].getDay()];c.title=a[1];c.append(b,l);box.append(c)});
   var s=0;for(i=0;i<400;i++){d=new Date();d.setDate(d.getDate()-i);if((st.days[key(d)]||0)>0)s++;else if(i>0)break}
   $('sub').textContent='Today '+(st.days[key(new Date())]||0)+' \u00b7 streak '+s+' day'+(s===1?'':'s')}
  $('pl').onclick=function(){bump(1)};$('mi').onclick=function(){bump(-1)};
  if($('rs'))$('rs').onclick=function(){st={n:D.start,days:{}};S.set(st);draw()};draw()}});
A.timer=(sp,D)=>({body:`<h1>${ESC(D.title)}</h1><div class="t" id="t" role="timer">00:00</div><div class="bar"><i id="bar"></i></div><div class="mut" id="msg" style="text-align:center;margin:10px 0;min-height:1.4em" aria-live="assertive"></div><div class="row"><button class="p" id="go" style="min-height:56px">Start</button><button id="rs" style="min-height:56px">Reset</button></div><div class="row" style="margin-top:10px"><button id="m1">\u22121 min</button><button id="p1">+1 min</button></div>`,
 fn:function(D,S){var $=function(i){return document.getElementById(i)};var total=D.seconds,left=total,end=0,iv=null,run=false;
  function fmt(s){s=Math.max(0,Math.ceil(s));var h=Math.floor(s/3600),m=Math.floor(s%3600/60),x=s%60,p=function(n){return(n<10?'0':'')+n};return h?h+':'+p(m)+':'+p(x):p(m)+':'+p(x)}
  function show(){$('t').textContent=fmt(left);$('bar').style.width=(total?100*(1-left/total):0)+'%'}
  function beep(){try{var a=new(window.AudioContext||window.webkitAudioContext)();[0,.35,.7].forEach(function(d){var o=a.createOscillator(),g=a.createGain();o.frequency.value=880;g.gain.value=.2;o.connect(g);g.connect(a.destination);o.start(a.currentTime+d);o.stop(a.currentTime+d+.2)})}catch(e){}try{navigator.vibrate&&navigator.vibrate([200,100,200])}catch(e){}}
  function stop(){clearInterval(iv);iv=null;run=false}
  function tick(){left=(end-Date.now())/1000;if(left<=0){left=0;stop();$('t').classList.add('done');$('go').textContent='Start';$('msg').textContent='Time is up';beep()}show()}
  $('go').onclick=function(){if(run){stop();$('go').textContent='Resume'}else{if(left<=0)left=total;end=Date.now()+left*1000;iv=setInterval(tick,200);run=true;$('go').textContent='Pause';$('msg').textContent='';$('t').classList.remove('done')}show()};
  $('rs').onclick=function(){stop();left=total;$('go').textContent='Start';$('msg').textContent='';$('t').classList.remove('done');show()};
  function adj(d){if(run)return;total=Math.max(60,total+d);left=total;$('t').classList.remove('done');$('msg').textContent='';show()}
  $('m1').onclick=function(){adj(-60)};$('p1').onclick=function(){adj(60)};show()}});
A.pomo=(sp,D)=>({body:`<h1>${ESC(D.title)}</h1><div class="chips" id="modes" role="tablist"></div><div class="t" id="t" role="timer">25:00</div><div class="bar"><i id="bar"></i></div><div class="mut" id="msg" style="text-align:center;margin:10px 0;min-height:1.4em" aria-live="assertive"></div><div class="row"><button class="p" id="go" style="min-height:56px">Start</button><button id="rs" style="min-height:56px">Reset</button></div><div class="card mut" style="margin-top:14px;text-align:center" id="cnt"></div>`,
 fn:function(D,S){var $=function(i){return document.getElementById(i)};var M=[['Focus',D.focus],['Short break',300],['Long break',900]],mode=0,done=(S.get()||{}).done||0,total=M[0][1],left=total,end=0,iv=null,run=false;
  function fmt(s){s=Math.max(0,Math.ceil(s));var m=Math.floor(s/60),x=s%60;return(m<10?'0':'')+m+':'+(x<10?'0':'')+x}
  function show(){$('t').textContent=fmt(left);$('bar').style.width=(total?100*(1-left/total):0)+'%';$('cnt').textContent='Focus sessions finished: '+done}
  function stop(){clearInterval(iv);iv=null;run=false;$('go').textContent='Start'}
  function setMode(i){stop();mode=i;total=left=M[i][1];$('t').classList.remove('done');$('msg').textContent='';Array.prototype.forEach.call($('modes').children,function(b,k){b.className=k===i?'p':''});show()}
  M.forEach(function(m,i){var b=document.createElement('button');b.textContent=m[0];b.onclick=function(){setMode(i)};$('modes').append(b)});
  function beep(){try{var a=new(window.AudioContext||window.webkitAudioContext)(),o=a.createOscillator();o.frequency.value=660;o.connect(a.destination);o.start();o.stop(a.currentTime+.4)}catch(e){}try{navigator.vibrate&&navigator.vibrate(300)}catch(e){}}
  function tick(){left=(end-Date.now())/1000;if(left<=0){left=0;stop();$('t').classList.add('done');if(mode===0){done++;S.set({done:done});$('msg').textContent='Focus done. Take a break.'}else $('msg').textContent='Break over. Ready to focus?';beep();show();var nx=mode===0?(done%4===0?2:1):0;setTimeout(function(){setMode(nx)},2500);return}show()}
  $('go').onclick=function(){if(run){stop();$('go').textContent='Resume'}else{end=Date.now()+left*1000;iv=setInterval(tick,200);run=true;$('go').textContent='Pause';$('msg').textContent=''}};
  $('rs').onclick=function(){setMode(mode)};setMode(0)}});
A.stopwatch=(sp,D)=>({body:`<h1>${ESC(D.title)}</h1><div class="t" id="t" role="timer">00:00.00</div><div class="row"><button class="p" id="go" style="min-height:56px">Start</button><button id="lap" style="min-height:56px" disabled>Lap</button><button id="rs" style="min-height:56px">Reset</button></div><ul id="laps" style="margin-top:14px"></ul>`,
 fn:function(D,S){var $=function(i){return document.getElementById(i)};var base=0,t0=0,iv=null,laps=[],lastLap=0;
  function now(){return base+(iv?Date.now()-t0:0)}
  function fmt(ms){var c=Math.floor(ms/10)%100,s=Math.floor(ms/1000)%60,m=Math.floor(ms/60000),p=function(n){return(n<10?'0':'')+n};return p(m)+':'+p(s)+'.'+p(c)}
  function show(){$('t').textContent=fmt(now())}
  $('go').onclick=function(){if(iv){base=now();clearInterval(iv);iv=null;$('go').textContent='Resume';$('lap').disabled=true}else{t0=Date.now();iv=setInterval(show,40);$('go').textContent='Pause';$('lap').disabled=false}show()};
  $('lap').onclick=function(){var n=now();laps.unshift([laps.length+1,n-lastLap,n]);lastLap=n;var ul=$('laps');ul.textContent='';laps.forEach(function(l){var li=document.createElement('li');li.style.justifyContent='space-between';var a=document.createElement('span'),b=document.createElement('span');a.textContent='Lap '+l[0];b.textContent=fmt(l[1])+'  ('+fmt(l[2])+')';li.append(a,b);ul.append(li)})};
  $('rs').onclick=function(){clearInterval(iv);iv=null;base=0;lastLap=0;laps=[];$('laps').textContent='';$('go').textContent='Start';$('lap').disabled=true;show()};show()}});
A.calc=(sp,D)=>({body:`<h1>${ESC(D.title)}</h1><div id="form"></div><div id="quick" class="chips"></div><div class="card res" id="out" aria-live="polite"></div>`,fargs:1,
 fn:function(D,S,compute){var $=function(i){return document.getElementById(i)};
  function f(n){return isFinite(n)?n.toLocaleString(undefined,{minimumFractionDigits:2,maximumFractionDigits:2}):'-'}
  var inp={};D.fields.forEach(function(F){var lab=document.createElement('label');lab.className='f';var s=document.createElement('span');s.textContent=F.label;var e;
   if(F.type==='select'){e=document.createElement('select');F.opts.forEach(function(o){var op=document.createElement('option');op.value=o[0];op.textContent=o[1];e.append(op)});e.value=F.v}
   else{e=document.createElement('input');e.type='number';e.inputMode='decimal';e.step='any';e.min='0';e.value=F.v}
   e.oninput=e.onchange=calc;inp[F.id]=e;lab.append(s,e);$('form').append(lab)});
  if(D.quick){D.quick.vals.forEach(function(v){var b=document.createElement('button');b.textContent=v+'%';b.onclick=function(){inp[D.quick.id].value=v;calc()};$('quick').append(b)})}
  function calc(){var v={};D.fields.forEach(function(F){v[F.id]=F.type==='select'?inp[F.id].value:parseFloat(inp[F.id].value)});
   var rows=compute(v,f),o=$('out');o.textContent='';if(!rows){o.textContent='Enter the numbers above.';o.className='card res mut';return}o.className='card res';
   rows.forEach(function(r,i){var d=document.createElement('div');if(i===0){var l=document.createElement('div');l.className='mut';l.textContent=r[0];var b=document.createElement('div');b.className='big';b.textContent=r[1];d.append(l,b)}else{d.className='r';var a=document.createElement('span'),c=document.createElement('strong');a.textContent=r[0];c.textContent=r[1];d.append(a,c)}o.append(d)})}
  calc()}});
A.basic=(sp,D)=>({extra:'#scr{font-size:2.6rem;text-align:right;padding:18px 14px;overflow:hidden;white-space:nowrap;font-variant-numeric:tabular-nums}.pad{display:grid;grid-template-columns:repeat(4,1fr);gap:8px;margin-top:12px}.pad button{min-height:64px;font-size:1.4rem}',
 body:`<h1>${ESC(D.title)}</h1><div class="card" id="scr" aria-live="polite">0</div><div class="mut" id="ex" style="text-align:right;min-height:1.4em;margin-top:4px"></div><div class="pad" id="pad"></div>`,
 fn:function(D,S){var $=function(i){return document.getElementById(i)};var cur='0',acc=null,op=null,fresh=true;
  var K=['C','\u232b','%','\u00f7','7','8','9','\u00d7','4','5','6','\u2212','1','2','3','+','0','.','='];
  function num(){return parseFloat(cur)}
  function apply(a,o,b){return o==='+'?a+b:o==='\u2212'?a-b:o==='\u00d7'?a*b:o==='\u00f7'?(b===0?NaN:a/b):b}
  function fmt(n){if(!isFinite(n))return'Error';var s=String(Math.round(n*1e10)/1e10);return s.length>14?n.toPrecision(10).replace(/\.?0+(e|$)/,'$1'):s}
  function show(){$('scr').textContent=cur;$('ex').textContent=acc!==null&&op?fmt(acc)+' '+op:''}
  function press(k){if(cur==='Error'&&k!=='C')cur='0';
   if(/^\d$/.test(k)){if(fresh||cur==='0'){cur=k;fresh=false}else if(cur.length<14)cur+=k}
   else if(k==='.'){if(fresh){cur='0.';fresh=false}else if(cur.indexOf('.')<0)cur+='.'}
   else if(k==='C'){cur='0';acc=null;op=null;fresh=true}
   else if(k==='\u232b'){if(!fresh){cur=cur.length>1?cur.slice(0,-1):'0';if(cur==='-')cur='0'}}
   else if(k==='%'){cur=fmt(num()/100);fresh=true}
   else if(k==='='){if(op!==null&&acc!==null){cur=fmt(apply(acc,op,num()));acc=null;op=null;fresh=true}}
   else{if(op!==null&&acc!==null&&!fresh){acc=apply(acc,op,num());cur=fmt(acc)}else acc=num();op=k;fresh=true}
   show()}
  K.forEach(function(k){var b=document.createElement('button');b.textContent=k;if(k==='='||/[\u00f7\u00d7\u2212+]/.test(k))b.className='p';if(k==='0')b.style.gridColumn='span 2';b.onclick=function(){press(k)};$('pad').append(b)});show()}});
A.convert=(sp,D)=>({body:`<h1>${ESC(D.title)}</h1><label class="f"><span>Type of unit</span><select id="cat"></select></label><label class="f"><span>Value</span><input id="v" type="number" inputmode="decimal" step="any" value="${ESC(D.value)}"></label><div class="row" style="align-items:flex-end"><label class="f"><span>From</span><select id="a"></select></label><button id="sw" aria-label="Swap units" style="margin-bottom:12px">\u21c5</button><label class="f"><span>To</span><select id="b"></select></label></div><div class="card res" aria-live="polite"><div class="mut" id="eq"></div><div class="big" id="o"></div></div>`,
 fn:function(D,S){var $=function(i){return document.getElementById(i)};var U=D.units;
  function fill(sel,cat,val){sel.textContent='';U[cat].u.forEach(function(u){var o=document.createElement('option');o.value=u[0];o.textContent=u[1];sel.append(o)});sel.value=val}
  Object.keys(U).forEach(function(c){var o=document.createElement('option');o.value=c;o.textContent=U[c].n;$('cat').append(o)});
  $('cat').value=D.cat;fill($('a'),D.cat,D.from);fill($('b'),D.cat,D.to);
  function toBase(c,u,x){if(c==='temperature')return u==='c'?x:u==='f'?(x-32)*5/9:x-273.15;return x*U[c].u.filter(function(q){return q[0]===u})[0][2]}
  function fromBase(c,u,x){if(c==='temperature')return u==='c'?x:u==='f'?x*9/5+32:x+273.15;return x/U[c].u.filter(function(q){return q[0]===u})[0][2]}
  function fmt(n){if(!isFinite(n))return'-';var a=Math.abs(n);return a!==0&&(a<1e-4||a>=1e12)?n.toExponential(4):String(Math.round(n*1e6)/1e6)}
  function go(){var c=$('cat').value,x=parseFloat($('v').value),a=$('a').value,b=$('b').value;if(isNaN(x)){$('o').textContent='-';$('eq').textContent='Enter a value';return}
   var r=fromBase(c,b,toBase(c,a,x));$('o').textContent=fmt(r)+' '+$('b').selectedOptions[0].textContent;$('eq').textContent=fmt(x)+' '+$('a').selectedOptions[0].textContent+' ='}
  $('cat').onchange=function(){var c=$('cat').value;fill($('a'),c,U[c].u[0][0]);fill($('b'),c,U[c].u[1][0]);go()};
  $('sw').onclick=function(){var t=$('a').value;$('a').value=$('b').value;$('b').value=t;go()};
  $('v').oninput=$('a').onchange=$('b').onchange=go;go()}});
A.flash=(sp,D)=>({extra:'.fc{width:100%;min-height:170px;font-size:1.5rem;text-align:center;white-space:normal;overflow-wrap:anywhere;line-height:1.3}.fc.back{background:var(--ac,#e0a526);color:#111}',
 body:`<h1>${ESC(D.title)}</h1><div class="mut" id="prog" aria-live="polite"></div><div id="stage" style="margin:8px 0 14px"></div><label class="row" style="justify-content:flex-start;gap:10px;margin-bottom:6px"><input type="checkbox" id="ty" style="flex:0 0 22px"><span>Type the answer</span></label><label class="row" style="justify-content:flex-start;gap:10px"><input type="checkbox" id="sh" style="flex:0 0 22px"><span>Shuffle</span></label>${sp.reset?'<div class="row" style="margin-top:12px"><button id="rs">Restart</button></div>':''}<h2 style="font-size:1.1rem;margin:22px 0 8px">Add a card</h2><div class="row"><input id="nq" placeholder="Front"><input id="na" placeholder="Back"></div><div class="row" style="margin-top:8px"><button class="p" id="nadd" style="flex:1">Add card</button></div>`,
 fn:function(D,S){var $=function(i){return document.getElementById(i)};var cards=(S.get()||{}).cards||D.cards.slice(),order=[],i=0,flip=false,know=0,graded=null;
  function save(){S.set({cards:cards})}
  function el(t,c,x){var e=document.createElement(t);if(c)e.className=c;if(x!=null)e.textContent=x;return e}
  function start(){order=cards.map(function(_,k){return k});if($('sh').checked)for(var k=order.length-1;k>0;k--){var j=Math.floor(Math.random()*(k+1)),t=order[k];order[k]=order[j];order[j]=t}i=0;know=0;flip=false;graded=null;draw()}
  function next(ok){if(ok)know++;i++;flip=false;graded=null;draw()}
  function norm(s){return s.toLowerCase().replace(/\s+/g,' ').trim()}
  function draw(){var st=$('stage');st.textContent='';$('prog').textContent=cards.length?(i<order.length?'Card '+(i+1)+' of '+order.length:'Finished'):'';
   if(!cards.length){st.append(el('div','card mut','No cards yet. Add your first one below.'));return}
   if(i>=order.length){var d=el('div','card');d.append(el('div',null,'You knew '+know+' of '+order.length+'.'));var b=el('button','p','Go again');b.style.marginTop='10px';b.onclick=start;d.append(b);st.append(d);return}
   var c=cards[order[i]];
   if($('ty').checked){var q=el('div','card fc',c.q);q.style.display='flex';q.style.alignItems='center';q.style.justifyContent='center';st.append(q);
    if(graded===null){var inp=el('input');inp.placeholder='Your answer';inp.style.marginTop='10px';inp.autocomplete='off';var chk=el('button','p','Check');chk.style.marginTop='8px';var go=function(){graded=norm(inp.value)===norm(c.a)?1:0;draw()};chk.onclick=go;inp.onkeydown=function(e){if(e.key==='Enter')go()};st.append(inp,chk)}
    else{var m=el('div','card',graded?'Correct!':'Not quite. Answer: '+c.a);m.style.marginTop='10px';var n=el('button','p',i+1<order.length?'Next':'Finish');n.style.marginTop='8px';n.onclick=function(){next(graded)};st.append(m,n)}}
   else{var f=el('button','card fc'+(flip?' back':''),flip?c.a:c.q);f.setAttribute('aria-label',flip?'Answer. Tap to see the question.':'Question. Tap to see the answer.');f.onclick=function(){flip=!flip;draw()};st.append(f);
    if(flip){var r=el('div','row');r.style.marginTop='10px';var ag=el('button',null,'Again'),ok=el('button','p','Got it');ag.onclick=function(){next(0)};ok.onclick=function(){next(1)};r.append(ag,ok);st.append(r)}}
   var rm=el('button','sm','Remove this card');rm.style.cssText='margin-top:10px;min-height:36px;font-size:.8rem';rm.onclick=function(){cards.splice(order[i],1);save();start()};st.append(rm)}
  $('nadd').onclick=function(){var q=$('nq').value.trim(),a=$('na').value.trim();if(!q||!a)return;cards.push({q:q,a:a});$('nq').value=$('na').value='';save();start()};
  $('ty').onchange=function(){graded=null;draw()};$('sh').onchange=start;if($('rs'))$('rs').onclick=start;start()}});
A.notes=(sp,D)=>({body:`<h1>${ESC(D.title)}</h1><textarea id="nt" rows="4" placeholder="${D.journal?'Write today\u2019s entry':'Write a note'}"></textarea><div class="row" style="margin:8px 0 14px"><button class="p" id="sv" style="flex:1">Save note</button></div><input id="se" type="search" placeholder="Search notes" aria-label="Search notes"><div id="ls" style="margin-top:12px"></div>${sp.reset?'<div class="row" style="margin-top:14px"><button id="rs">Delete all</button></div>':''}`,
 fn:function(D,S){var $=function(i){return document.getElementById(i)};var N=S.get()||[],arm=false;
  function save(){S.set(N)}
  function draw(){var box=$('ls'),q=$('se').value.trim().toLowerCase();box.textContent='';var shown=0;
   N.forEach(function(n,i){if(q&&n.t.toLowerCase().indexOf(q)<0)return;shown++;var c=document.createElement('div');c.className='card';c.style.marginBottom='10px';var d=document.createElement('div');d.className='mut';d.textContent=new Date(n.d).toLocaleString();var p=document.createElement('div');p.style.cssText='white-space:pre-wrap;overflow-wrap:anywhere;margin:4px 0 8px';p.textContent=n.t;var x=document.createElement('button');x.textContent='Delete';x.style.cssText='min-height:36px;font-size:.8rem';x.onclick=function(){N.splice(i,1);save();draw()};c.append(d,p,x);box.append(c)});
   if(!shown){var m=document.createElement('div');m.className='mut';m.textContent=N.length?'No notes match.':'No notes yet.';box.append(m)}}
  $('sv').onclick=function(){var t=$('nt').value.trim();if(!t)return;N.unshift({t:t,d:Date.now()});$('nt').value='';save();draw()};$('se').oninput=draw;
  if($('rs'))$('rs').onclick=function(){if(!arm){arm=true;$('rs').textContent='Tap again to delete all';setTimeout(function(){arm=false;if($('rs'))$('rs').textContent='Delete all'},3000);return}N=[];save();draw();arm=false;$('rs').textContent='Delete all'};draw()}});
A.picker=(sp,D)=>{const m=D.mode;
 if(m==='coin')return{extra:'.coin{width:170px;height:170px;border-radius:50%;margin:10px auto;display:flex;align-items:center;justify-content:center;font-size:1.6rem;font-weight:700;background:var(--a);color:#111;box-shadow:inset 0 0 0 8px rgba(0,0,0,.15)}',body:`<h1>${ESC(D.title)}</h1><div class="coin acc" id="c" style="--a:currentColor" aria-live="polite">?</div><div class="row"><button class="p" id="go" style="min-height:56px">Flip</button></div><div class="mut" id="tl" style="text-align:center;margin-top:12px"></div>${sp.reset?'<div class="row" style="margin-top:10px"><button id="rs">Reset tally</button></div>':''}`,
  fn:function(D,S){var $=function(i){return document.getElementById(i)};var t=S.get()||{h:0,t:0};function show(){$('tl').textContent='Heads '+t.h+' \u00b7 Tails '+t.t}
   $('go').onclick=function(){var n=0,iv=setInterval(function(){$('c').textContent=n%2?'Heads':'Tails';if(++n>8){clearInterval(iv);var h=new Uint8Array(1);crypto.getRandomValues(h);var r=h[0]%2===0;$('c').textContent=r?'Heads':'Tails';if(r)t.h++;else t.t++;S.set(t);show()}},70)};
   if($('rs'))$('rs').onclick=function(){t={h:0,t:0};S.set(t);$('c').textContent='?';show()};show()}};
 if(m==='dice')return{body:`<h1>${ESC(D.title)}</h1><div class="row"><label class="f"><span>Dice</span><select id="n"></select></label><label class="f"><span>Sides</span><select id="s"></select></label></div><div class="card res" aria-live="polite"><div class="big" id="tot">-</div><div class="mut" id="ea"></div></div><div class="row" style="margin-top:12px"><button class="p" id="go" style="min-height:56px">Roll</button></div><ul id="h" style="margin-top:12px"></ul>${sp.reset?'<div class="row"><button id="rs">Clear history</button></div>':''}`,
  fn:function(D,S){var $=function(i){return document.getElementById(i)};var H=[];for(var i=1;i<=6;i++){var o=document.createElement('option');o.value=i;o.textContent=i;$('n').append(o)}[4,6,8,10,12,20,100].forEach(function(v){var o=document.createElement('option');o.value=v;o.textContent='d'+v;$('s').append(o)});$('n').value=D.n;$('s').value=D.sides;
   function rnd(m){var a=new Uint32Array(1);crypto.getRandomValues(a);return a[0]%m+1}
   $('go').onclick=function(){var n=+$('n').value,s=+$('s').value,r=[],t=0;for(var i=0;i<n;i++){var v=rnd(s);r.push(v);t+=v}$('tot').textContent=t;$('ea').textContent=n>1?r.join(' + '):'';H.unshift(n+'d'+s+': '+t);H=H.slice(0,8);var ul=$('h');ul.textContent='';H.forEach(function(x){var li=document.createElement('li');li.textContent=x;ul.append(li)})};
   if($('rs'))$('rs').onclick=function(){H=[];$('h').textContent='';$('tot').textContent='-';$('ea').textContent=''}}};
 return{body:`<h1>${ESC(D.title)}</h1><label class="f"><span>Names or options (one per line, or commas)</span><textarea id="nm" rows="5"></textarea></label><label class="row" style="justify-content:flex-start;gap:10px;margin-bottom:12px"><input type="checkbox" id="rm" style="flex:0 0 22px"><span>Take the winner off the list</span></label><div class="card res" style="text-align:center" aria-live="polite"><div class="big" id="w">?</div></div><div class="row" style="margin-top:12px"><button class="p" id="go" style="min-height:56px">Pick one</button></div><ul id="h" style="margin-top:12px"></ul>${sp.reset?'<div class="row"><button id="rs">Reset</button></div>':''}`,
  fn:function(D,S){var $=function(i){return document.getElementById(i)};var H=[];$('nm').value=(S.get()||{names:D.items.join('\n')}).names;
   function list(){return $('nm').value.split(/[\n,]+/).map(function(x){return x.trim()}).filter(Boolean)}
   function rnd(m){var a=new Uint32Array(1);crypto.getRandomValues(a);return a[0]%m}
   $('nm').oninput=function(){S.set({names:$('nm').value})};
   $('go').onclick=function(){var L=list();if(!L.length){$('w').textContent='Add some names first';return}var n=0,iv=setInterval(function(){$('w').textContent=L[rnd(L.length)];if(++n>10){clearInterval(iv);var w=L[rnd(L.length)];$('w').textContent=w;H.unshift(w);H=H.slice(0,8);var ul=$('h');ul.textContent='';H.forEach(function(x){var li=document.createElement('li');li.textContent=x;ul.append(li)});if($('rm').checked){var i=L.indexOf(w);L.splice(i,1);$('nm').value=L.join('\n');S.set({names:$('nm').value})}}},60)};
   if($('rs'))$('rs').onclick=function(){$('nm').value=D.items.join('\n');S.set({names:$('nm').value});$('w').textContent='?';H=[];$('h').textContent=''}}}};
A.guess=(sp,D)=>({body:`<h1>${ESC(D.title)}</h1><p class="mut" id="rule"></p><div class="card res" style="text-align:center"><div class="big" id="msg" aria-live="polite">Make a guess</div><div class="mut" id="tries"></div></div><div class="row" style="margin-top:12px"><input id="g" type="number" inputmode="numeric" placeholder="Your guess"><button class="p" id="go">Guess</button></div><div class="row" style="margin-top:10px"><button id="rs">New game</button></div>`,
 fn:function(D,S){var $=function(i){return document.getElementById(i)};var n,tries;
  function rnd(a,b){var x=new Uint32Array(1);crypto.getRandomValues(x);return a+x[0]%(b-a+1)}
  function start(){n=rnd(D.min,D.max);tries=0;$('msg').textContent='Make a guess';$('tries').textContent='';$('g').value='';$('g').disabled=false;$('go').disabled=false;$('rule').textContent='I am thinking of a number from '+D.min+' to '+D.max+'.'}
  function go(){var v=parseInt($('g').value,10);if(isNaN(v))return;tries++;if(v===n){$('msg').textContent='Yes! It was '+n;$('g').disabled=true;$('go').disabled=true}else $('msg').textContent=v<n?'Higher':'Lower';$('tries').textContent='Guesses: '+tries;$('g').value='';$('g').focus()}
  $('go').onclick=go;$('g').onkeydown=function(e){if(e.key==='Enter')go()};$('rs').onclick=start;start()}});
A.password=(sp,D)=>({body:`<h1>${ESC(D.title)}</h1><div class="card" id="pw" style="font-size:1.3rem;overflow-wrap:anywhere;min-height:3.4rem" aria-live="polite"></div><div class="mut" id="st" style="margin:6px 0 12px"></div><label class="f"><span>Length: <b id="ln"></b></span><input type="range" id="len" min="6" max="64"></label><label class="row" style="justify-content:flex-start;gap:10px;margin-bottom:8px"><input type="checkbox" id="u" checked style="flex:0 0 22px"><span>Capital letters</span></label><label class="row" style="justify-content:flex-start;gap:10px;margin-bottom:8px"><input type="checkbox" id="d" checked style="flex:0 0 22px"><span>Numbers</span></label><label class="row" style="justify-content:flex-start;gap:10px;margin-bottom:14px"><input type="checkbox" id="y" checked style="flex:0 0 22px"><span>Symbols</span></label><div class="row"><button class="p" id="go">Generate</button><button id="cp">Copy</button></div>`,
 fn:function(D,S){var $=function(i){return document.getElementById(i)};$('len').value=D.len;
  function rnd(m){var lim=Math.floor(4294967296/m)*m,a=new Uint32Array(1);do{crypto.getRandomValues(a)}while(a[0]>=lim);return a[0]%m}
  function gen(){var sets=['abcdefghijkmnopqrstuvwxyz'];if($('u').checked)sets.push('ABCDEFGHJKLMNPQRSTUVWXYZ');if($('d').checked)sets.push('23456789');if($('y').checked)sets.push('!@#$%^&*-_=+?');var all=sets.join(''),n=+$('len').value,out=[];
   sets.forEach(function(s){out.push(s[rnd(s.length)])});while(out.length<n)out.push(all[rnd(all.length)]);for(var i=out.length-1;i>0;i--){var j=rnd(i+1),t=out[i];out[i]=out[j];out[j]=t}out=out.slice(0,n);
   $('pw').textContent=out.join('');$('ln').textContent=n;var bits=Math.round(n*Math.log(all.length)/Math.LN2);$('st').textContent='About '+bits+' bits \u00b7 '+(bits<50?'weak':bits<80?'okay':'strong')}
  $('go').onclick=gen;$('len').oninput=gen;['u','d','y'].forEach(function(i){$(i).onchange=gen});
  $('cp').onclick=function(){var t=$('pw').textContent,ok=function(){$('cp').textContent='Copied';setTimeout(function(){$('cp').textContent='Copy'},1500)},sel=function(){var r=document.createRange();r.selectNodeContents($('pw'));var s=getSelection();s.removeAllRanges();s.addRange(r);$('cp').textContent='Selected. Copy it';setTimeout(function(){$('cp').textContent='Copy'},2500)};try{navigator.clipboard.writeText(t).then(ok,sel)}catch(e){sel()}};gen()}});
A.text=(sp,D)=>({body:`<h1>${ESC(D.title)}</h1><textarea id="t" rows="8" placeholder="Type or paste text here"></textarea><div class="card res" style="display:grid;grid-template-columns:repeat(2,1fr);gap:8px" id="st"></div><div class="chips"><button id="up">UPPER</button><button id="lo">lower</button><button id="ti">Title Case</button><button id="rv">Reverse</button><button id="sp">Trim spaces</button>${sp.reset?'<button id="rs">Clear</button>':''}</div>`,
 fn:function(D,S){var $=function(i){return document.getElementById(i)};
  function stats(){var t=$('t').value,w=(t.trim().match(/\S+/g)||[]).length,s=(t.match(/[^.!?]+[.!?]+(\s|$)/g)||[]).length,box=$('st');box.textContent='';
   [['Words',w],['Characters',t.length],['No spaces',t.replace(/\s/g,'').length],['Sentences',s],['Lines',t?t.split('\n').length:0],['Reading time',Math.max(w?1:0,Math.round(w/230))+' min']].forEach(function(r){var d=document.createElement('div'),a=document.createElement('div'),b=document.createElement('strong');a.className='mut';a.textContent=r[0];b.textContent=r[1];d.append(a,b);box.append(d)})}
  function ap(f){return function(){$('t').value=f($('t').value);S.set({t:$('t').value});stats()}}
  $('up').onclick=ap(function(s){return s.toUpperCase()});$('lo').onclick=ap(function(s){return s.toLowerCase()});$('ti').onclick=ap(function(s){return s.toLowerCase().replace(/(^|\s)(\S)/g,function(m,a,b){return a+b.toUpperCase()})});
  $('rv').onclick=ap(function(s){return Array.from(s).reverse().join('')});$('sp').onclick=ap(function(s){return s.replace(/[ \t]+/g,' ').replace(/\n{3,}/g,'\n\n').trim()});if($('rs'))$('rs').onclick=ap(function(){return''});
  $('t').oninput=function(){S.set({t:$('t').value});stats()};$('t').value=(S.get()||{t:''}).t;stats()}});
A.expense=(sp,D)=>({body:`<h1>${ESC(D.title)}</h1><div class="card res" style="margin:0 0 14px"><div class="mut">Total spent</div><div class="big" id="tot">0.00</div></div><div class="row"><input id="am" type="number" inputmode="decimal" step="any" min="0" placeholder="Amount"><select id="ct"></select></div><div class="row" style="margin-top:8px"><input id="nt" placeholder="What was it for? (optional)"><button class="p" id="add">Add</button></div><div id="by" class="mut" style="margin:14px 0 4px"></div><ul id="ls"></ul>${sp.reset?'<div class="row" style="margin-top:12px"><button id="rs">Clear all</button></div>':''}`,
 fn:function(D,S){var $=function(i){return document.getElementById(i)};var E=S.get()||[],arm=false;D.cats.forEach(function(c){var o=document.createElement('option');o.textContent=c;$('ct').append(o)});
  function f(n){return n.toLocaleString(undefined,{minimumFractionDigits:2,maximumFractionDigits:2})}
  function save(){S.set(E)}
  function draw(){var t=0,by={};E.forEach(function(e){t+=e.a;by[e.c]=(by[e.c]||0)+e.a});$('tot').textContent=f(t);$('by').textContent=Object.keys(by).map(function(k){return k+' '+f(by[k])}).join(' \u00b7 ');var ul=$('ls');ul.textContent='';
   E.forEach(function(e,i){var li=document.createElement('li');li.style.justifyContent='space-between';var a=document.createElement('span');a.style.flex='1';a.textContent=(e.n||e.c)+' ';var m=document.createElement('span');m.className='mut';m.textContent=new Date(e.d).toLocaleDateString();a.append(m);var b=document.createElement('strong');b.textContent=f(e.a);var x=document.createElement('button');x.textContent='\u00d7';x.setAttribute('aria-label','Remove');x.onclick=function(){E.splice(i,1);save();draw()};li.append(a,b,x);ul.append(li)})}
  $('add').onclick=function(){var a=parseFloat($('am').value);if(!(a>0))return;E.unshift({a:a,c:$('ct').value,n:$('nt').value.trim(),d:Date.now()});$('am').value=$('nt').value='';save();draw()};
  if($('rs'))$('rs').onclick=function(){if(!arm){arm=true;$('rs').textContent='Tap again to clear all';setTimeout(function(){arm=false;if($('rs'))$('rs').textContent='Clear all'},3000);return}E=[];save();draw();arm=false;$('rs').textContent='Clear all'};draw()}});

A.site=(sp,D)=>({extra:'main{max-width:680px;padding:0 0 40px}.hero{padding:56px 22px 44px;background:var(--ac);color:var(--on);text-align:center}.hero h1{font-size:2.2rem;margin:0 0 10px}.hero p{margin:0 0 18px;opacity:.92}.hero a{display:inline-block;padding:12px 24px;border-radius:999px;background:var(--on);color:var(--ac);font-weight:700;text-decoration:none}section.s{padding:30px 22px 0}section.s h2{font-size:1.3rem;margin:0 0 10px}.g{display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:12px}footer{padding:30px 22px 0;text-align:center}',
 body:`<header class="hero"><h1>${ESC(D.title)}</h1><p>${ESC(D.tag)}</p><a href="#contact">${ESC(D.cta)}</a></header><section class="s"><h2>About</h2><p>[Two or three sentences about ${ESC(D.title)}: who you are and what makes you different.]</p></section><section class="s"><h2>${ESC(D.offerTitle)}</h2><div class="g">${D.items.map(x=>`<div class="card"><strong>${ESC(x)}</strong><p class="mut">[One line about ${ESC(x.toLowerCase())}.]</p></div>`).join('')}</div></section><section class="s" id="contact"><h2>Contact</h2><p>[Address] \u00b7 [Opening hours]<br>[Phone] \u00b7 [Email]</p></section><footer class="mut">\u00a9 ${ESC(D.title)}</footer>`});

// ---------- calculators: fields plus one compute function each ----------
const num=(o,d)=>({type:'number',v:d,...o});
const CALCS={
 tip:{title:'Tip calculator',fields:n=>[num({id:'bill',label:'Bill amount'},''),num({id:'tip',label:'Tip %'},n.pct??15),num({id:'ppl',label:'People'},1)],quick:{id:'tip',vals:[10,15,18,20]},
  compute:function(v,f){if(!(v.bill>=0)||!(v.tip>=0)||!(v.ppl>=1))return null;var t=v.bill*v.tip/100,tot=v.bill+t,per=tot/v.ppl;return v.ppl>1?[['Each person pays',f(per)],['Tip',f(t)],['Total',f(tot)]]:[['Total',f(tot)],['Tip',f(t)]]}},
 split:{title:'Bill splitter',fields:n=>[num({id:'bill',label:'Bill amount'},''),num({id:'ppl',label:'People'},2),num({id:'tip',label:'Tip %'},n.pct??0)],quick:{id:'tip',vals:[0,10,15,20]},
  compute:function(v,f){if(!(v.bill>=0)||!(v.tip>=0)||!(v.ppl>=1))return null;var t=v.bill*v.tip/100,tot=v.bill+t;return[['Each person pays',f(tot/v.ppl)],['Tip',f(t)],['Total',f(tot)]]}},
 loan:{title:'Loan calculator',fields:()=>[num({id:'p',label:'Loan amount'},10000),num({id:'r',label:'Yearly interest %'},5),num({id:'y',label:'Years'},5)],
  compute:function(v,f){if(!(v.p>0)||!(v.r>=0)||!(v.y>0))return null;var n=Math.round(v.y*12),i=v.r/1200,m=i?v.p*i/(1-Math.pow(1+i,-n)):v.p/n;return[['Monthly payment',f(m)],['Total paid',f(m*n)],['Total interest',f(m*n-v.p)]]}},
 bmi:{title:'BMI calculator',fields:()=>[{id:'u',label:'Units',type:'select',v:'m',opts:[['m','Metric (kg, cm)'],['i','Imperial (lb, in)']]},num({id:'w',label:'Weight (kg or lb)'},''),num({id:'h',label:'Height (cm or in)'},'')],
  compute:function(v,f){if(!(v.w>0)||!(v.h>0))return null;var b=v.u==='m'?v.w/Math.pow(v.h/100,2):703*v.w/Math.pow(v.h,2),c=b<18.5?'Under 18.5 (underweight range)':b<25?'18.5 to 24.9 (healthy range)':b<30?'25 to 29.9 (overweight range)':'30 or more (obese range)';return[['Your BMI',(Math.round(b*10)/10).toFixed(1)],['Range',c],['Note','A rough guide only. It ignores muscle and build.']]}},
 discount:{title:'Discount calculator',fields:n=>[num({id:'p',label:'Original price'},''),num({id:'d',label:'Discount %'},n.pct??20)],quick:{id:'d',vals:[10,20,30,50]},
  compute:function(v,f){if(!(v.p>=0)||!(v.d>=0))return null;var s=v.p*v.d/100;return[['You pay',f(v.p-s)],['You save',f(s)]]}},
 tax:{title:'Sales tax calculator',fields:n=>[num({id:'p',label:'Price before tax'},''),num({id:'t',label:'Tax %'},n.pct??10)],
  compute:function(v,f){if(!(v.p>=0)||!(v.t>=0))return null;var t=v.p*v.t/100;return[['Total',f(v.p+t)],['Tax',f(t)]]}},
 percent:{title:'Percentage calculator',fields:()=>[num({id:'a',label:'Percent (A)'},10),num({id:'b',label:'Number (B)'},200)],
  compute:function(v,f){if(!isFinite(v.a)||!isFinite(v.b))return null;return[['A% of B',f(v.b*v.a/100)],['A is what % of B',v.b?f(v.a/v.b*100)+'%':'-'],['B increased by A%',f(v.b*(1+v.a/100))],['B decreased by A%',f(v.b*(1-v.a/100))]]}}};
const calcFlavour=low=>/\bsplit\b/.test(low)?'split':/\bbmi\b|body mass/.test(low)?'bmi':/\bloan\b|mortgage|\binterest\b|\brepay/.test(low)?'loan':/\bdiscount\b|\bsale\b|% off/.test(low)?'discount':/\btax\b|\bvat\b/.test(low)?'tax':/percent/.test(low)?'percent':/\btip\b|gratuity/.test(low)?'tip':'basic';
// ---------- converter tables ----------
const UNITS={length:{n:'Length',u:[['m','metres',1],['km','kilometres',1000],['cm','centimetres',.01],['mm','millimetres',.001],['mi','miles',1609.344],['yd','yards',.9144],['ft','feet',.3048],['in','inches',.0254]]},
 weight:{n:'Weight',u:[['kg','kilograms',1],['g','grams',.001],['lb','pounds',.45359237],['oz','ounces',.028349523125],['st','stone',6.35029318],['t','tonnes',1000]]},
 temperature:{n:'Temperature',u:[['c','\u00b0C',1],['f','\u00b0F',1],['k','kelvin',1]]},
 volume:{n:'Volume',u:[['l','litres',1],['ml','millilitres',.001],['gal','US gallons',3.785411784],['qt','US quarts',.946352946],['cup','US cups',.2365882365],['floz','US fluid oz',.0295735295625],['tbsp','tablespoons',.01478676478125],['tsp','teaspoons',.00492892159375]]},
 speed:{n:'Speed',u:[['kmh','km/h',.2777777778],['mph','mph',.44704],['ms','m/s',1],['kn','knots',.5144444444]]},
 time:{n:'Time',u:[['s','seconds',1],['min','minutes',60],['h','hours',3600],['d','days',86400],['wk','weeks',604800]]}};
const UA={m:['length','m'],meter:['length','m'],meters:['length','m'],metre:['length','m'],metres:['length','m'],km:['length','km'],kilometer:['length','km'],kilometers:['length','km'],kilometre:['length','km'],kilometres:['length','km'],cm:['length','cm'],mm:['length','mm'],mi:['length','mi'],mile:['length','mi'],miles:['length','mi'],yd:['length','yd'],yard:['length','yd'],yards:['length','yd'],ft:['length','ft'],foot:['length','ft'],feet:['length','ft'],inch:['length','in'],inches:['length','in'],in:['length','in'],
 kg:['weight','kg'],kilo:['weight','kg'],kilos:['weight','kg'],kilogram:['weight','kg'],kilograms:['weight','kg'],g:['weight','g'],gram:['weight','g'],grams:['weight','g'],lb:['weight','lb'],lbs:['weight','lb'],pound:['weight','lb'],pounds:['weight','lb'],oz:['weight','oz'],ounce:['weight','oz'],ounces:['weight','oz'],stone:['weight','st'],tonne:['weight','t'],tonnes:['weight','t'],
 c:['temperature','c'],celsius:['temperature','c'],f:['temperature','f'],fahrenheit:['temperature','f'],kelvin:['temperature','k'],
 l:['volume','l'],litre:['volume','l'],litres:['volume','l'],liter:['volume','l'],liters:['volume','l'],ml:['volume','ml'],gallon:['volume','gal'],gallons:['volume','gal'],gal:['volume','gal'],cup:['volume','cup'],cups:['volume','cup'],tbsp:['volume','tbsp'],tsp:['volume','tsp'],
 kmh:['speed','kmh'],kph:['speed','kmh'],mph:['speed','mph'],knots:['speed','kn'],knot:['speed','kn'],
 second:['time','s'],seconds:['time','s'],minute:['time','min'],minutes:['time','min'],hour:['time','h'],hours:['time','h'],day:['time','d'],days:['time','d'],week:['time','wk'],weeks:['time','wk']};
function convSetup(raw){const low=String(raw||'').toLowerCase().replace(/[°]/g,''),m=low.match(/\b([a-z]+)\s+(?:to|into|in|->)\s+([a-z]+)\b/),a=m&&UA[m[1]],b=m&&UA[m[2]];
 if(a&&b&&a[0]===b[0]&&a[1]!==b[1])return{cat:a[0],from:a[1],to:b[1]};
 const hit=low.match(/[a-z]+/g)||[];let one=null;for(const w of hit)if(UA[w]&&w!=='in'&&w!=='c'&&w!=='f'&&w!=='m'&&w!=='g'){one=UA[w];break}
 if(one){const c=one[0],us=UNITS[c].u;return{cat:c,from:one[1],to:(us.find(x=>x[0]!==one[1])||us[0])[0]}}
 return{cat:'length',from:'km',to:'mi'}}

// ---------- documents (plain text) ----------
const T_=(s,d)=>s&&String(s).trim()?String(s).trim():d;
const DOCT={
 letter:sp=>{const to=T_(sp.to,'[Recipient name]'),tp=T_(sp.topic,'[subject]'),low=(sp.raw||'').toLowerCase();
  const body=/cover letter/.test(low)?[`I am writing to apply for ${tp}. I believe my skills and experience make me a strong fit, and I would welcome the chance to contribute.`,'','[One or two sentences about your most relevant experience.]','','[One sentence on why you want this role and this team.]','','Thank you for your time and consideration. I would be glad to discuss my application in an interview.']
  :/resign/.test(low)?[`Please accept this letter as formal notice of my resignation from my position as ${T_(sp.topic,'[job title]')}. My last day will be [date].`,'','Thank you for the opportunities I have had here. I will do all I can to make the handover smooth.']
  :/complain/.test(low)?[`I am writing to complain about ${tp}.`,'','[What happened, with dates and any reference numbers.]','','I would like [what you want done] by [date]. Please reply in writing.']
  :[`I am writing about ${tp}.`,'','[Main point.]','','[Any details or requests.]','','Thank you for your time.'];
  return['[Your name]','[Your address]','[Date]','',to,'','Dear '+to+',','',...body,'','Sincerely,','[Your name]'].join('\n')},
 email:sp=>{const to=T_(sp.to,'[Name]'),tp=T_(sp.topic,'[topic]');return['Subject: '+cap(tp),'','Hi '+to+',','',`I wanted to reach out about ${tp}.`,'','[Key point or request.]','','[Any date, deadline or detail they need.]','','Thanks,','[Your name]'].join('\n')},
 agenda:sp=>{const it=sp.items.length?sp.items:['Welcome and introductions','Updates since last meeting','Main discussion','Decisions and next steps','Any other business'];return[cap(T_(sp.title,'Meeting agenda')),T_(sp.topic,'')?'Topic: '+sp.topic:'','Date: [date]   Time: [start] to [end]   Place: [room or link]','Attendees: [names]','',...it.map((x,i)=>(i+1)+'. '+cap(x)+'  ([min] min)'),'','Next meeting: [date]'].filter((x,i)=>x!==''||i>0).join('\n')},
 minutes:sp=>[cap(T_(sp.title,'Meeting minutes')),T_(sp.topic,'')?'Topic: '+sp.topic:'','Date: [date]   Time: [time]','Present: [names]','Absent: [names]','','Discussion',...(sp.items.length?sp.items:['[Item 1]','[Item 2]']).map(x=>'- '+cap(x)+': [notes]'),'','Decisions','- [decision]','','Action items','- [who] will [what] by [date]','','Next meeting: [date]'].filter((x,i)=>x!==''||i>0).join('\n'),
 schedule:sp=>{const days=['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'],it=sp.items.length?sp.items:['[Activity]'];return[cap(T_(sp.title,'Weekly schedule')),'',...days.map((d,i)=>d+(i>4?':  [free time]':':  '+(it[i%it.length]==='[Activity]'?'[morning]   [afternoon]   [evening]':cap(it[i%it.length])+'  at [time]')))].join('\n')},
 workout:sp=>{const it=sp.items.length?sp.items:['Squats','Push-ups','Lunges','Plank','Rows'];return[cap(T_(sp.title,'Workout plan')),'','Warm up: 5 minutes easy movement, then gentle stretching.','',...it.map((x,i)=>(i+1)+'. '+cap(x)+': 3 sets of [10] reps, rest 60 seconds'),'','Cool down: 5 minutes walking and stretching.','','Schedule: [3] days a week, with a rest day between sessions.','Stop if anything hurts. Check with a doctor if you are unsure.'].join('\n')},
 outline:sp=>{const tp=T_(sp.topic,'[topic]');return['Title: '+cap(tp),'','I. Introduction','   A. Hook: [a surprising fact or question]','   B. Background on '+tp,'   C. Thesis: [your main claim]','','II. First point','   A. Claim','   B. Evidence','   C. Link back to the thesis','','III. Second point','   A. Claim','   B. Evidence','   C. Link back to the thesis','','IV. Third point (or a counterargument and your reply)','','V. Conclusion','   A. Restate the thesis in new words','   B. Sum up the points','   C. Closing thought'].join('\n')},
 speech:sp=>{const tp=T_(sp.topic,'[occasion]'),w=/wedding|toast/.test((sp.raw||'').toLowerCase());return w?['Good evening everyone.','','For those who do not know me, I am [your name], [your relationship to the couple].','','[A short, warm story about one of them.]','','[A short, warm story about the two of them together.]','','So please raise your glass: to [names], to love, and to a long and happy life together. Cheers!'].join('\n'):['Good [morning/afternoon/evening], everyone.','','Thank you for being here. Today I want to talk about '+tp+'.','','[Opening story or fact.]','','Point one: [point]','Point two: [point]','Point three: [point]','','[Close with one line people will remember.]','','Thank you.'].join('\n')},
 invitation:sp=>{const tp=T_(sp.topic,'[event]');return['You are invited!','',cap(tp),'','Date: [date]','Time: [time]','Place: [address]',T_(sp.to,'')?'For: '+sp.to:'','','[One line about what to expect, dress code or what to bring.]','','Please let [name] know by [date] if you can come: [phone or email]'].filter((x,i)=>x!==''||i>0).join('\n')}};
const DOC_TITLES={letter:'Letter',email:'Email',agenda:'Meeting agenda',minutes:'Meeting minutes',schedule:'Schedule',workout:'Workout plan',outline:'Outline',speech:'Speech',invitation:'Invitation'};

// ---------- spec and make ----------
function cardOf(x){let m=x.match(/^(.+?)\s+(?:->|=>|–|—|=|-|:)\s+(.+)$/)||x.match(/^(.+?)\s*(?:->|=>|=)\s*(.+)$/)||x.match(/^(.+\?)\s*(.+)$/)||x.match(/^([^:]+?)\s*:\s*(.+)$/);return m?{q:m[1].trim(),a:m[2].trim()}:null}
function specOf(p){return{v:1,route:p.route,kind:p.kind,title:p.title||null,color:p.color||null,items:(p.items||[]).slice(),seconds:p.seconds||null,numbers:(p.numbers||[]).slice(0,4),raw:String(p.raw||'').slice(0,300),to:p.to||null,topic:p.topic||null,reset:false,theme:null,size:0}}
const slug=s=>String(s).toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-+|-+$/g,'').slice(0,40)||'creation';
const BUILDABLE=['site','todo','counter','timer','pomo','stopwatch','calc','flash','notes','picker','guess','password','text','expense'];
function canMake(sp){return sp.route==='doc'?!!DOCT[sp.kind]:sp.route==='app'&&BUILDABLE.includes(sp.kind)}
const tipsOf=sp=>Array.isArray(sp.tips)?sp.tips.filter(x=>x&&typeof x.t==='string'&&x.t).slice(0,2):[];
function make(sp){
 if(!sp||!canMake(sp))return null;
 const low=(sp.raw||'').toLowerCase();
 if(sp.route==='doc'){const label=DOC_TITLES[sp.kind],tp=tipsOf(sp),text=DOCT[sp.kind](sp)+(tp.length?'\n\nFrom the library:\n'+tp.map(x=>'- '+x.t+' ('+String(x.s||'Library')+')').join('\n'):'');return{route:'doc',kind:sp.kind,title:sp.title||label,label,mime:'text/plain',ext:'txt',content:text,file:slug(sp.title||label)+'.txt',notes:[]}}
 let kind=sp.kind,title=sp.title,D={},st,notes=[],label,flav=null;
 if(kind==='todo'){label=/shopping|grocery/.test(low)?'shopping list':/packing/.test(low)?'packing list':/chores/.test(low)?'chore list':'to-do list';D.title=title||(/shopping/.test(low)?'Shopping list':/grocery/.test(low)?'Grocery list':/packing/.test(low)?'Packing list':/chores/.test(low)?'Chores':/checklist/.test(low)?'Checklist':'To-do list');D.items=sp.items.map(cap)}
 else if(kind==='counter'){label='counter';const m=(sp.raw||'').match(/(?:track(?:ing)?|count(?:ing)?)\s+(?:my\s+|the\s+)?([a-z][a-z ]{1,24}?)(?:\s+(?:habit|intake|streak|tracker|count|counter))?\s*$/i);D.title=title||(m&&!/^(it|them|this|that)$/i.test(m[1])?cap(m[1].trim())+' tracker':/tally/.test(low)?'Tally counter':/habit|streak/.test(low)?'Habit tracker':'Counter');D.start=0}
 else if(kind==='timer'){label='countdown timer';D.title=title||'Timer';D.seconds=sp.seconds||300}
 else if(kind==='pomo'){label='pomodoro timer';D.title=title||'Pomodoro';D.focus=sp.seconds||1500}
 else if(kind==='stopwatch'){label='stopwatch';D.title=title||'Stopwatch'}
 else if(kind==='calc'){
  if(/convert/.test(low)){kind='convert';label='unit converter';const c=convSetup(sp.raw);D.title=title||'Unit converter';D.cat=c.cat;D.from=c.from;D.to=c.to;D.value=(sp.numbers[0]??1);D.units=UNITS;flav=c.cat}
  else{flav=calcFlavour(low);if(flav==='basic'){kind='basic';label='calculator';D.title=title||'Calculator'}
   else{const C=CALCS[flav],pm=(sp.raw||'').match(/(\d+(?:\.\d+)?)\s*%/);label=C.title.toLowerCase();D.title=title||C.title;D.fields=C.fields({pct:pm?+pm[1]:undefined});D.quick=C.quick||null;D.compute=C.compute}}}
 else if(kind==='flash'){label='set of flashcards';D.title=title||'Flashcards';D.cards=[];sp.items.forEach(x=>{const c=cardOf(x);if(c)D.cards.push(c);else notes.push('Skipped "'+x+'": a card needs a front and a back, like "hola - hello".')})}
 else if(kind==='notes'){label=/journal|diary/.test(low)?'journal':'notes app';D.title=title||(/journal|diary/.test(low)?'Journal':'Notes');D.journal=/journal|diary/.test(low)}
 else if(kind==='picker'){D.items=sp.items.slice();if(/\bcoin\b|\bflip\b/.test(low)){D.mode='coin';label='coin flipper';D.title=title||'Coin flip'}else if(/\bdice\b|\broll\b|\bdie\b/.test(low)){D.mode='dice';label='dice roller';D.title=title||'Dice roller';const dn=low.match(/(\d)\s*(?:dice|d\d)/),ds=low.match(/(?:^|[^a-z])\d?\s*d(\d{1,3})\b/);D.n=dn&&+dn[1]>=1&&+dn[1]<=6?+dn[1]:1;D.sides=ds&&[4,6,8,10,12,20,100].includes(+ds[1])?+ds[1]:6}else{D.mode='list';label='random picker';D.title=title||'Random picker'}flav=D.mode}
 else if(kind==='guess'){label='guessing game';D.title=title||'Guess the number';const n=sp.numbers.slice(0,2).sort((a,b)=>a-b);D.min=n.length===2&&n[1]>n[0]?Math.round(n[0]):1;D.max=n.length===2&&n[1]>n[0]?Math.round(n[1]):100}
 else if(kind==='password'){label='password generator';D.title=title||'Password generator';D.len=sp.numbers.length&&sp.numbers[0]>=6&&sp.numbers[0]<=64?Math.round(sp.numbers[0]):16}
 else if(kind==='site'){label='one-page website';const m=(sp.raw||'').match(/\bfor\s+(?:my\s+|our\s+|a\s+|the\s+)?([a-z][a-z' &-]{1,30}?)\s*$/i);D.title=title||(m?cap(m[1].trim()):'My website');D.tag='Welcome to '+D.title;D.cta='Get in touch';D.items=sp.items.length?sp.items.map(cap).slice(0,6):['Service one','Service two','Service three'];D.offerTitle=sp.items.length?'What we offer':'What we offer (edit these)';notes.push('Fill in the [brackets] by editing the saved file in any text editor.')}
 else if(kind==='text'){label='text tool';D.title=title||'Text tools'}
 else if(kind==='expense'){label='expense tracker';D.title=title||(/budget/.test(low)?'Budget':'Expense tracker');D.cats=sp.items.length?sp.items.map(cap).slice(0,10):['Food','Transport','Bills','Fun','Other']}
 st=STY[kind];
 const comp=D.compute;delete D.compute;
 const parts=A[kind==='convert'?'convert':kind==='basic'?'basic':kind](sp,D),fnSrc=parts.fn?String(parts.fn):null;
 const fn=fnSrc?Object.assign(fnSrc,{args:comp?','+String(comp):''}):null;
 const tp=tipsOf(sp),tb=tp.length?'<details style="margin-top:20px"><summary style="cursor:pointer;min-height:44px;padding:12px 0">From the library</summary>'+tp.map(x=>'<p style="margin:6px 0;font-size:.9em">'+ESC(x.t)+' <small style="display:block;opacity:.7">'+ESC(x.s||'Library')+'</small></p>').join('')+'</details>':'';
 const html=page(sp,st,D.title,parts.body+tb,parts.extra||'',fn,D);
 return{route:'app',kind:sp.kind,title:D.title,label,flav,mime:'text/html',ext:'html',content:html,file:slug(D.title)+'.html',notes}}

// ---------- Phase 4: follow-ups ----------
const NOUN=/\b(app|apps|tool|tracker|calculator|timer|counter|game|website|page|widget|generator|converter|quiz|flash ?cards?|stopwatch|checklist|list|letter|email|agenda|speech|schedule)\b/;
const COLW=Object.keys(COLORS).join('|');
const split=s=>s.split(/\s*(?:,|;|\band\b|\n)\s*/i).map(x=>x.replace(/^(a|an|the|some)\s+/i,'').replace(/[.!]+$/,'').trim()).filter(Boolean);
// Returns null when the text is not a change request, else {spec, said:[...what changed], skipped:[...what could not]}.
function refine(sp,text){
 const s=String(text||'').trim().replace(/[.!]+$/,''),low=s.toLowerCase();if(!sp||!s)return null;
 const out={...sp,items:sp.items.slice()},said=[],skipped=[];let hit=false;const isApp=sp.route==='app',isDoc=sp.route==='doc';
 const refers=/\b(it|this|that|them|the (?:app|list|timer|page|button|buttons|text|numbers?))\b/.test(low);
 // a full new description starts a new build, not a change
 const p=Create.parse(s);if(p.route!=='unknown'&&!refers&&!/^(add|remove|delete|drop|rename|call it|name it|title|make it|set|change|use|turn|go|reset)\b/.test(low))return null;
 if(p.route!=='unknown'&&!refers&&/^(add|set|change|make)\b/.test(low)&&p.kind&&NOUN.test(low)&&!/\b(button|item|card|name|colou?r|theme|mode|reset)\b/.test(low))return null;
 // rename
 let m=s.match(/^(?:please\s+)?(?:rename(?:\s+it)?(?:\s+to)?|call (?:it|this)|name (?:it|this)|title (?:it|this)|retitle(?:\s+it)?(?:\s+to)?|change (?:the )?(?:name|title)(?:\s+to)?)\s+["“]?(.+?)["”]?$/i);
 if(m&&m[1]){out.title=m[1].replace(/^(to|as)\s+/i,'').trim().slice(0,60);said.push('renamed it "'+out.title+'"');hit=true;
  if(isDoc)out.title=out.title}
 // reset button
 if(!m&&/\breset\b/.test(low)&&!/^reset$/.test(low)){const off=/\b(remove|no|without|drop|delete|hide|take (?:off|away))\b/.test(low);
  if(isDoc)skipped.push('A document has no buttons.');else{out.reset=!off;said.push(off?'removed the reset button':'added a reset button');hit=true}}
 // colour
 const lightReq=/\b(light|bright|white|day)\b\s*(?:mode|theme|background)/.test(low)||/^(?:make it )?(?:light|bright)$/.test(low);
 const cw=lightReq?null:low.match(new RegExp('\\b('+COLW+')\\b'));
 if(cw&&!m&&(refers||/colou?r|theme|accent|button/.test(low)||low.split(/\s+/).length<=3)){if(isDoc)skipped.push('A text document has no colour.');else{out.color=cw[1];said.push('made it '+cw[1]);hit=true}}
 // theme
 if(/\b(dark|night)\b(?:\s*(?:mode|theme|background))?/.test(low)&&!cw&&!m&&(refers||/mode|theme|background/.test(low)||low.split(/\s+/).length<=3)){if(isDoc)skipped.push('A text document has no theme.');else{out.theme='dark';said.push('switched to dark mode');hit=true}}
 else if(/\b(light|bright|white|day)\b\s*(?:mode|theme|background)/.test(low)||/^(?:make it )?(?:light|bright)$/.test(low)){if(isDoc)skipped.push('A text document has no theme.');else{out.theme='light';said.push('switched to light mode');hit=true}}
 // size
 if(/\b(bigger|larger|enlarge|increase)\b/.test(low)&&(/\b(text|font|it|everything|numbers?|buttons?|size)\b/.test(low)||low.split(/\s+/).length<=2)){if(isDoc)skipped.push('Text size is set by the app you open it in.');else{out.size=Math.min(2,(out.size||0)+1);said.push('made it bigger');hit=true}}
 else if(/\b(smaller|reduce|decrease)\b/.test(low)&&(/\b(text|font|it|everything|numbers?|buttons?|size)\b/.test(low)||low.split(/\s+/).length<=2)){if(isDoc)skipped.push('Text size is set by the app you open it in.');else{out.size=Math.max(-1,(out.size||0)-1);said.push('made it smaller');hit=true}}
 // time
 const tm=/\b(?:make|set|change|use|start)\b/.test(low)&&Create.parse(s).seconds;
 if(tm){if(isApp&&(sp.kind==='timer'||sp.kind==='pomo')){out.seconds=tm;said.push('set the time to '+(tm>=60?Math.round(tm/6)/10+' min':tm+' s'));hit=true}else skipped.push('There is no time to change here.')}
 // doc fields
 if(isDoc){m=s.match(/\b(?:address(?:ed)?|send|make)\s+it\s+to\s+(.+)$/i)||s.match(/^(?:to)\s+(.+)$/i);if(m){out.to=m[1].trim().slice(0,60);said.push('addressed it to '+out.to);hit=true}
  m=s.match(/\b(?:change (?:the )?(?:topic|subject) to|make it about|it(?:'s| is) about|about)\s+(.+)$/i);if(m&&!hit){out.topic=m[1].trim().slice(0,80);said.push('changed the topic to '+out.topic);hit=true}}
 // items
 m=s.match(/^(?:please\s+)?(?:also\s+)?(?:add|include|put in|put)\s+(.+?)(?:\s+(?:to|on|in)\s+(?:it|the list|the cards|the app))?$/i);
 if(m&&!hit&&!/\b(button|reset|mode|theme|colou?r|bigger|smaller)\b/i.test(m[1])){
  if(isApp&&['todo','picker','flash','expense','site'].includes(sp.kind)&&!(sp.kind==='picker'&&/coin|dice/.test((sp.raw||'').toLowerCase()))){const xs=split(m[1]);if(xs.length){out.items.push(...xs);said.push('added '+xs.join(', '));hit=true}}
  else if(isDoc&&['agenda','minutes','schedule','workout'].includes(sp.kind)){const xs=split(m[1]);if(xs.length){out.items.push(...xs);said.push('added '+xs.join(', '));hit=true}}
  else{skipped.push('Adding items does not apply to this one.');hit=true}}
 m=s.match(/^(?:please\s+)?(?:remove|delete|drop|take off|take out)\s+(.+?)(?:\s+(?:from|off)\s+(?:it|the list|the cards))?$/i);
 if(m&&!hit&&!/\b(button|reset)\b/i.test(m[1])){if(out.items.length){const xs=split(m[1]).map(x=>x.toLowerCase());const before=out.items.length;out.items=out.items.filter(i=>!xs.some(x=>i.toLowerCase()===x||i.toLowerCase().startsWith(x+' ')||i.toLowerCase().startsWith(x+' - ')));if(out.items.length<before){said.push('removed '+xs.join(', '));hit=true}else{skipped.push('I could not find "'+m[1]+'" in the starting items.');hit=true}}else{skipped.push('There are no starting items to remove.');hit=true}}
 if(!hit&&!said.length&&!skipped.length)return null;
 return{spec:out,said,skipped}}
// ---------- Phase 5: remember a creation ----------
const MARK=/^<!doctype html>\s*<!--fate-create (\{[\s\S]*?\})-->/i;
function specFrom(code){const m=MARK.exec(String(code||''));if(!m)return null;try{const o=JSON.parse(m[1]);return o&&o.v===1&&o.kind?o:null}catch{return null}}
// What to store: a readable note (so Ask and Create can find it) plus the finished file.
function describe(sp,built){const bits=[];if(sp.color)bits.push(sp.color);if(sp.theme)bits.push(sp.theme+' mode');if(sp.reset)bits.push('reset button');if(sp.items.length)bits.push('items: '+sp.items.slice(0,8).join(', '));if(sp.seconds)bits.push(Math.round(sp.seconds/6)/10+' minutes');
 return'Created '+(built.route==='doc'?'a document':'an app')+': '+built.label+' called "'+built.title+'"'+(bits.length?' ('+bits.join('; ')+')':'')+'. Request: '+(sp.raw||'').slice(0,160)}
function created(lib){const r=[];const L=lib&&lib.data&&lib.data.Library;if(L)for(const b in L)if(/^Created \/ /.test(b)&&Array.isArray(L[b]))r.push([L,b,'Library']);const C=lib&&lib.data&&lib.data.Created;if(C)for(const b in C)if(Array.isArray(C[b]))r.push([C,b,'Created']);return r}
function save(lib,sp,built){const id=built.kind+':'+built.title,branch=built.label[0].toUpperCase()+built.label.slice(1);
 // replace an older save of the same thing instead of piling up copies
 for(const[box,key,cl]of created(lib)){const a=box[key],keep=a.filter(l=>l.k!==id);if(keep.length!==a.length){if(keep.length)box[key]=keep;else delete box[key];lib.commit(cl)}}
 return lib.merge({Created:{[branch]:[{t:describe(sp,built),k:id,w:1.2},{t:built.content,k:id,code:1,w:1}]}})}
// The most recent saved creation of the same kind, if any. Only its style choices carry over, never its title or items.
function savedFor(lib,sp){let best=null;
 for(const[box,key]of created(lib))for(const l of box[key]){if(!l||!l.code)continue;const o=specFrom(l.t);if(o&&o.kind===sp.kind&&o.route===sp.route)best=o}return best}
function inherit(sp,saved){if(!saved)return{spec:sp,from:[]};const out={...sp},from=[];
 if(!sp.color&&saved.color){out.color=saved.color;from.push(saved.color)}
 if(!sp.theme&&saved.theme){out.theme=saved.theme;from.push(saved.theme+' mode')}
 if(!sp.reset&&saved.reset){out.reset=true;from.push('reset button')}
 if(!sp.size&&saved.size){out.size=saved.size;from.push('text size')}
 return{spec:out,from}}

const api={specOf,make,refine,save,savedFor,inherit,specFrom,describe};
if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.Build=api;
})(typeof window!=='undefined'?window:globalThis);
