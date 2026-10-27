const STOP=new Set('a an the is are was were be been of in on at to for and or but if then so as by with from that this it its what who how why when where which do does did can could should would will i you he she we they me my your our their about into than too very please tell show explain give more else another again also next other just those these they there im ive dont whats thats'.split(' '));
const stem=w=>{if(w.length>4)w=w.replace(/(ing|edly|ed|es|s)$/,'');return w.length>3?w.replace(/e$/,''):w};
const BAD=new Set(['__proto__','constructor','prototype']),safe=s=>BAD.has(s)?s+'_':s;
const MEM='Memory';
const LIB='Library',MEGA=()=>typeof window!=='undefined'&&window.MEGA===true,secOf=b=>{const i=b.indexOf(' / ');return i>0?b.slice(0,i):b},place=(c,b)=>MEGA()&&c!==MEM&&c!==LIB?[LIB,c+' / '+b]:[c,b];
// Tesseract regions: every cluster is a 4D square (n x n x n x n cells, all four sides equal).
// Leaves are placed by 4 balanced axes (equal-frequency bins), stored in Morton order so each cell is one contiguous id range.
const SIDE=m=>m<=40?2:m<=400?4:8;
const hh=(s,k)=>{let h=2166136261^Math.imul(k+1,16777619);for(let i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619)}h^=h>>>13;h=Math.imul(h,0x5bd1e995);h^=h>>>15;return(h>>>0)/2147483648-1};
const morton=(a,b,c,d,n)=>{let m=0;for(let i=0;i<n;i++)m|=(((a>>i)&1)|((b>>i)&1)<<1|((c>>i)&1)<<2|((d>>i)&1)<<3)<<(i*4);return m};
// Phase 1: built-in synonym groups (users can add more by saying "fix means repair")
const SYN=[['fix','debug','repair','solve','patch','resolve'],['error','bug','issue','problem','crash','fail','failure'],['make','build','create','generate','produce','construct'],['write','compose','draft','author'],['show','display','render','draw','present'],['phone','mobile','android','smartphone'],['website','web','webpage','site'],['fast','quick','quickly','speed','rapid','performance'],['slow','lag','laggy','sluggish'],['delete','remove','erase','clear','discard'],['save','store','keep','persist','retain'],['start','begin','launch','run','open'],['stop','halt','end','quit','close'],['change','edit','modify','update','alter','adjust'],['big','large','huge','massive'],['small','tiny','little','compact'],['color','colour','shade','hue'],['style','design','look','appearance','theme'],['code','program','script','source'],['learn','teach','train','study'],['ai','bot','assistant','brain','model'],['help','assist','support','aid'],['use','utilize','employ','apply'],['find','search','locate','lookup'],['explain','describe','clarify','define'],['fact','info','information','knowledge','data'],['wrong','incorrect','mistake','broken'],['good','great','excellent','nice'],['bad','poor','terrible','awful'],['word','term','vocabulary','phrase'],['sentence','statement','clause'],['correct','right','accurate'],['quick','short','brief','concise']];
const tok=s=>(s.replace(/([a-z0-9])([A-Z])/g,'$1 $2').replace(/_/g,' ').toLowerCase().replace(/['’]/g,'').match(/[a-z0-9#+]+/g)||[]).filter(w=>/[a-z0-9]/.test(w)&&!STOP.has(w)).map(stem);
const CODE=/\.(js|mjs|cjs|ts|tsx|jsx|py|html?|css|scss|java|kt|c|h|cpp|cs|go|rs|rb|php|sh|sql|json|ya?ml|xml|swift|lua|gradle|toml|bat)$/i;
function lev(a,b){let p=[...Array(b.length+1).keys()];for(let i=1;i<=a.length;i++){const c=[i];for(let j=1;j<=b.length;j++)c[j]=Math.min(p[j]+1,c[j-1]+1,p[j-1]+(a[i-1]===b[j-1]?0:1));p=c}return p[b.length]}
function chunkCode(t){const out=[],st=/^\s{0,2}(export\s+)?(async\s+)?(function\b|class\b|def\b|const\s+\w+\s*=\s*(async\s*)?(\(|function)|fn\b|func\b|public\b|private\b|interface\b|<(section|script|style|template)\b|[.#][\w-]+\s*\{)/;let cur=[],len=0;
  const flush=()=>{const s=cur.join('\n');if(s.trim().length>20)out.push(s);cur=[];len=0};
  for(const l of t.split('\n')){if(len>120&&st.test(l))flush();cur.push(l);len+=l.length+1;if(len>1400)flush()}flush();return out}
const idb=(m,v,k='lib')=>new Promise((ok,no)=>{const q=indexedDB.open('fate-tree',1);q.onupgradeneeded=()=>q.result.createObjectStore('s');q.onerror=()=>no(q.error);
  q.onsuccess=()=>{const t=q.result.transaction('s',m==='get'?'readonly':'readwrite'),s=t.objectStore('s'),r=m==='get'?s.get(k):s.put(v,k);t.oncomplete=()=>ok(r.result);t.onerror=()=>no(t.error)}});
class Library{
  constructor(){this.lg=.4;this.tess=!(typeof window!=='undefined'&&window.TESSERACT===false);this.links={};this.use={};this.last=null;this.wm=[];this.lastIds=new Set();this.data=this.arrange(JSON.parse(JSON.stringify(window.SEED||{})));this.build()}
  async init(){try{let d=await idb('get');if(!d){try{d=JSON.parse(localStorage.getItem('fate-tree')||'null')}catch{}}if(d&&typeof d==='object'&&!Array.isArray(d))this.data=d}catch{}
    const ar=this.arrange(this.data),moved=ar!==this.data;this.data=ar;
    try{const b=await idb('get',null,'links');if(b&&typeof b==='object'){this.links=b.links||{};this.use=b.use||{}}}catch{}if(moved){this.links={};this.use={}}this.build();if(moved)this.save()}
  save(){clearTimeout(this._t);this._t=setTimeout(()=>this.flush(),300)}
  flush(){clearTimeout(this._t);this.flushBrain();return idb('put',this.data).catch(()=>{})}
  flushBrain(){clearTimeout(this._bt);return idb('put',{links:this.links,use:this.use},'links').catch(()=>{})}
  saveBrain(){clearTimeout(this._bt);this._bt=setTimeout(()=>this.flushBrain(),800)}
  commit(c){this._dk=null;this.save();c?this.patch(c):this.build()}
  // Each cluster is a "region" of the brain with its own index. Leaves keep one global id; dead ids are skipped until a full rebuild compacts them.
  build(){this._sk=null;this._rel=new Map();this._ov=new Map();this._cn=new Map();this._dirty=new Set();this._hc=new Map();this.fib=new Map();this.fn=new Map();this._by=[];this._no=0;this.buildSyn();this.leaves=[];this.reg={};this.df=new Map();this.kw={};this.tot=0;this.live=0;this.dead=0;
    for(const c in this.data)this.addRegion(c);this.avg=this.tot/Math.max(1,this.live)}
  addRegion(c){const K=this.kw[c]=new Set(),items=[];this._tc??=new WeakMap();
    for(const b in this.data[c]){if(!Array.isArray(this.data[c][b]))continue;this.data[c][b].forEach(l=>{if(!l||typeof l.t!=='string')return;
      const sig=b+'\u0001'+c+'\u0001'+(l.k||''),ch=this._tc.get(l);let t;if(ch&&ch.sig===sig)t=ch.t;else{t=tok((l.k||'')+' '+l.t+' '+b+' '+c);this._tc.set(l,{sig,t})}
      items.push({b,l,t})})}
    const m=items.length,n=this.tess?SIDE(m):1,cells=n**4,cell=this.tesseract(items,n),cnt=new Int32Array(cells),base=this.leaves.length;cell.forEach(x=>cnt[x]++);
    const cs=new Int32Array(cells+1);cs[0]=base;for(let k=0;k<cells;k++)cs[k+1]=cs[k]+cnt[k];
    const G=this.reg[c]={no:this._no++,idx:new Map(),n:0,ids:[],tot:0,side:n,cells,cs,occ:cnt,tm:new Map(),co:new Map()},ord=new Int32Array(m),pos=Int32Array.from(cs.subarray(0,cells),x=>x-base);for(let i=0;i<m;i++)ord[pos[cell[i]]++]=i;
    for(const oi of ord){const it=items[oi],t=it.t,L={id:this.leaves.length,c,b:it.b,l:it.l,t,n:t.length||1,o:oi,cell:cell[oi]},tf=Object.create(null);this.leaves.push(L);G.ids.push(L.id);G.n++;G.tot+=L.n;this.tot+=L.n;this.live++;
      t.forEach(x=>{tf[x]=(tf[x]||0)+1;K.add(x)});
      for(const x in tf){let p=G.idx.get(x);if(!p)G.idx.set(x,p=[]);p.push([L.id,tf[x]]);this.df.set(x,(this.df.get(x)||0)+1)}}
    // fiber: every word has one direct line to each cluster that holds it (and how many leaves there)
    this._by[G.no]=c;for(const[x,p]of G.idx){let f=this.fib.get(x);if(!f)this.fib.set(x,f=new Map());f.set(c,p.length);let q=this.fn.get(x);if(!q)this.fn.set(x,q=[]);q.push(G.no)}
    // per-term map of which cells contain it (only for long posting lists; short ones are cheap to walk)
    if(cells>1)for(const[x,p]of G.idx){if(p.length<=24)continue;const mk=new Uint32Array(Math.ceil(cells/32));for(const e of p){const k=this.leaves[e[0]].cell;mk[k>>5]|=1<<(k&31)}G.tm.set(x,mk)}}
  // Places every leaf of a cluster on a 4D grid with equal sides. 4 axes = 4 random projections of the leaf's (idf-weighted) words,
  // cut into equal-frequency bins so all cells stay balanced. Returns the Morton index of each leaf's cell.
  tesseract(items,n){const m=items.length,cell=new Int32Array(m);if(n<2||m<2)return cell;const b=Math.log2(n),dfl=new Map(),hc=this._hc??=new Map();
    items.forEach(it=>{it.u=new Set(it.t);it.u.forEach(x=>dfl.set(x,(dfl.get(x)||0)+1))});
    const P=new Float64Array(m*4);
    items.forEach((it,i)=>{let nn=0;const p=[0,0,0,0];for(const x of it.u){let h=hc.get(x);if(!h){h=[hh(x,0),hh(x,1),hh(x,2),hh(x,3)];hc.set(x,h)}const w=Math.log(1+m/dfl.get(x));nn+=w*w;for(let k=0;k<4;k++)p[k]+=w*h[k]}const s=Math.sqrt(nn)||1;for(let k=0;k<4;k++)P[i*4+k]=p[k]/s;delete it.u});
    const co=[];for(let k=0;k<4;k++){const v=new Float64Array(m);for(let i=0;i<m;i++)v[i]=P[i*4+k];const so=Float64Array.from(v).sort(),cut=[];for(let r=1;r<n;r++)cut.push(so[Math.floor(r*m/n)]);
      const bn=new Uint8Array(m);for(let i=0;i<m;i++){let q=0;while(q<n-1&&v[i]>=cut[q])q++;bn[i]=q}co.push(bn)}
    for(let i=0;i<m;i++)cell[i]=morton(co[0][i],co[1][i],co[2][i],co[3][i],b);return cell}
  // For the Tree tab: side length, cell count and how full each cell is.
  shape(c){const G=this.reg[c];return G?{side:G.side,cells:G.cells,occ:G.occ,leaves:G.n}:null}
  // Incremental update: only the changed cluster is re-indexed, so storing a memory stays instant on a huge library.
  patch(c){if(this.dead>this.live*.3+300)return this.build();const old=this.reg[c];
    if(old){this._by[old.no]=undefined;for(const x of old.idx.keys()){const f=this.fib.get(x);if(f){f.delete(c);if(!f.size)this.fib.delete(x)}const q=this.fn.get(x);if(q){const i=q.indexOf(old.no);if(i>=0){q[i]=q[q.length-1];q.pop()}if(!q.length)this.fn.delete(x)}}}
    if(old){for(const[x,p]of old.idx){const n=(this.df.get(x)||0)-p.length;if(n>0)this.df.set(x,n);else this.df.delete(x)}
      old.ids.forEach(i=>{this.leaves[i].dead=true});this.dead+=old.n;this.live-=old.n;this.tot-=old.tot}
    delete this.reg[c];delete this.kw[c];if(this.data[c])this.addRegion(c);
    this.avg=this.tot/Math.max(1,this.live);this._rel=new Map();this._ov=new Map();this._cn.delete(c);this._dirty.add(c);if(c==='Vocabulary')this.buildSyn()}
  // Shared-word counts between clusters, cached per cluster and kept across edits: an edit to cluster c only changes the pair (x,c) in every other cached row.
  counts(c){if(this._dirty.size)this.recount();let cn=this._cn.get(c);if(cn)return cn;cn=new Map();const A=this.kw[c],G=this.reg[c];
    if(A&&G){const a=new Int32Array(this._no);for(const x of A){const q=this.fn.get(x);if(q)for(let i=0;i<q.length;i++)a[q[i]]++}
      a[G.no]=0;for(let n=0;n<a.length;n++)if(a[n])cn.set(this._by[n],a[n])}
    this._cn.set(c,cn);return cn}
  recount(){const ds=[...this._dirty];this._dirty.clear();
    for(const c of ds){if(!this._cn.size)return;const row=this.counts(c);if(!this.kw[c])this._cn.delete(c);
      for(const[x,cn]of this._cn){if(x===c)continue;const v=row.get(x);if(v)cn.set(c,v);else cn.delete(c)}}}
  fix(x){if(this.df.has(x))return x;let best=null,bd=9;for(const k of this.df.keys()){if(k[0]!==x[0]||Math.abs(k.length-x.length)>2)continue;const d=lev(x,k);if(d<bd){bd=d;best=k}}return (x.length>4&&bd<=1)||(x.length>6&&bd<=2)?best:null}
  stats(){return{clusters:Object.keys(this.data).length,branches:Object.values(this.data).reduce((a,c)=>a+Object.keys(c).length,0),leaves:this.live,code:this.leaves.filter(L=>!L.dead&&L.l.code).length,terms:this.df.size,links:Object.keys(this.links).length}}
  // Brain connectivity: how strongly a region is wired to others = shared vocabulary + synapses learned from use.
  neighbors(c){if(this._rel.has(c))return this._rel.get(c);let ov=this._ov.get(c);
    if(!ov){ov=new Map();const A=this.kw[c];
      if(A&&A.size){const cnt=this.counts(c);
        for(const k of[...cnt.keys()].sort((a,b)=>(this.reg[a]?this.reg[a].no:1e9)-(this.reg[b]?this.reg[b].no:1e9))){const B=this.kw[k];if(!B||!B.size)continue;const v=cnt.get(k)/Math.sqrt(A.size*B.size);if(v>.05)ov.set(k,v)}}
      this._ov.set(c,ov)}
    const out=new Map(ov);
    for(const key in this.links){const[a,b]=key.split('\u0001'),o=a===c?b:b===c?a:null;if(o&&this.reg[o])out.set(o,(out.get(o)||0)+this.links[key])}
    const r=[...out].sort((x,y)=>y[1]-x[1]).slice(0,4);this._rel.set(c,r);return r}
  related(c){return this.neighbors(c).map(x=>x[0]).slice(0,3)}
  // Hebbian learning: regions that answer together get wired together; unused wiring slowly fades.
  hebb(used,tr,top){this.use[top]=(this.use[top]||0)+1;
    if(used.length>1){for(const k in this.links){this.links[k]*=.98;if(this.links[k]<.02)delete this.links[k]}
      for(let i=0;i<used.length;i++)for(let j=i+1;j<used.length;j++){const k=[used[i],used[j]].sort().join('\u0001');this.links[k]=Math.min(1,(this.links[k]||0)+.1);tr.push('synapse strengthened: '+used[i]+' ↔ '+used[j])}
      this._rel=new Map()}
    this.saveBrain()}
  // A region answers a narrow question ("who knows these words?") from its own index without a full search.
  consult(c,terms,allowCode){const G=this.reg[c];if(!G)return null;const N=this.live,sc=new Map();
    for(const x of terms){const p=G.idx.get(x);if(!p)continue;const idf=Math.log(1+N/this.df.get(x));
      for(const[i,tf]of(p.length>400?p.slice(0,400):p)){const L=this.leaves[i];if(L.l.code&&!allowCode)continue;let e=sc.get(i);if(!e)sc.set(i,e={s:0,g:new Set()});e.s+=idf*tf*2.2/(tf+1.2*(.25+.75*L.n/this.avg));e.g.add(x)}}
    let best=null;for(const[i,e]of sc){const v=e.s*(1+e.g.size)*(this.leaves[i].l.w||1);if(!best||v>best.v)best={v,L:this.leaves[i],g:[...e.g]}}
    return best}
  // Router: wake only the regions that look relevant (lateral inhibition), then let activation spread along strong synapses.
  route(qw,pers,tr){const N=this.live,sc=[],acc=new Map();let tw=0;for(const w of qw.values())tw+=w;
    for(const[x,w]of qw){const f=this.fib.get(x);if(!f)continue;const idf=Math.log(1+N/this.df.get(x));for(const[c,len]of f){let e=acc.get(c);if(!e)acc.set(c,e={s:0,cov:0});e.s+=w*idf*(len/(len+1.5));e.cov+=w}}
    for(const[c,e]of acc)if(e.s>0)sc.push([c,e.s*(.5+.5*e.cov/(tw||1))*(1+Math.min(.3,(this.use[c]||0)/50))]);
    sc.sort((a,b)=>b[1]-a[1]||this.reg[a[0]].no-this.reg[b[0]].no);const act=new Set();
    if(sc.length){const best=sc[0][1];sc.filter(v=>v[1]>=best*.3).slice(0,3).forEach(v=>act.add(v[0]));
      tr.push('woke: '+sc.slice(0,3).filter(v=>act.has(v[0])).map(v=>v[0]+' '+Math.round(100*v[1]/best)+'%').join(', '))}
    if(this.reg[MEM])act.add(MEM);
    let sp=0;for(const c of[...act].slice(0,2))for(const[n,w]of this.neighbors(c)){if(sp>=2)break;if(!act.has(n)&&w>=.2){act.add(n);sp++;tr.push('activation spread '+c+' → '+n+' (synapse '+w.toFixed(2)+')')}}
    return[...act]}
  memCount(){return Object.values(this.data[MEM]||{}).reduce((a,b)=>a+(Array.isArray(b)?b.length:0),0)}
  // ---- Phase 1: language layer ----
  buildSyn(){const m=this.syn=new Map(),link=g=>{const a=[...new Set(g.map(w=>stem(String(w).toLowerCase())))];a.forEach(x=>{if(!m.has(x))m.set(x,new Set());a.forEach(y=>{if(y!==x)m.get(x).add(y)})})};
    SYN.forEach(link);for(const b of Object.values(this.data.Vocabulary||{}))if(Array.isArray(b))b.forEach(l=>{if(l&&Array.isArray(l.s))link(l.s)})}
  synOf(x){return[...(this.syn.get(x)||[])]}
  // Learned word associations: when a term fires, look at the leaves containing it (sampled) and see which words fire alongside it. No precomputed matrix.
  coRel(x,act){const best=new Map();for(const c of act){const G=this.reg[c];if(!G)continue;let r=G.co.get(x);
      if(!r){r=[];const p=G.idx.get(x);if(p){const dx=p.length,st=Math.ceil(p.length/200),use=st>1?p.filter((_,j)=>j%st===0):p,sc=dx/use.length,cnt=new Map(),lim=G.n*.5+1;
        for(const[id]of use)for(const y of new Set(this.leaves[id].t))if(y!==x)cnt.set(y,(cnt.get(y)||0)+1);
        for(const[y,n]of cnt){const dy=G.idx.get(y).length;if(n<2||dy<2||dy>lim)continue;const v=n*sc/Math.sqrt(dx*dy);if(v>=.4)r.push([y,v])}}
        G.co.set(x,r)}
      for(const[y,v]of r)if(v>(best.get(y)||0))best.set(y,v)}
    return[...best].sort((a,b)=>b[1]-a[1]).slice(0,2).map(v=>v[0])}
  expand(own,qw){const out=[];let n=0;for(const x of own)this.synOf(x).forEach(y=>{if(n<8&&!qw.has(y)&&this.df.has(y)){qw.set(y,.45);n++;out.push(y)}});return out}
  expandCo(own,qw,act){const out=[];for(const x of own)this.coRel(x,act).forEach(y=>{if(out.length<6&&!qw.has(y)&&this.df.has(y)){qw.set(y,.25);out.push(y)}});return out}
  intent(s){const t=s.trim();
    if(/^(hi|hello|hey|yo|hiya|sup|howdy|good\s+(morning|afternoon|evening))\b[\s!.,?]*$/i.test(t))return{k:'greet'};
    if(/^(thanks|thank you|thx|ty|cheers|great|nice|cool|awesome)\b[\s!.,]*(a lot|so much|very much)?[\s!.,]*$/i.test(t))return{k:'thanks'};
    if(/^(bye|goodbye|see you|cya|good night)\b/i.test(t))return{k:'bye'};
    if(/^(how are you|how'?s it going|what'?s up|how do you do)[\s!.,?]*$/i.test(t))return{k:'howru'};
    const w=(t.match(/^(what|who|where|when|why|how|which)\b/i)||[])[1];if(w)return{k:'question',wh:w.toLowerCase()};
    if(/^(build|make|create|write|generate|show|give|tell|explain|list|teach|help|fix|find)\b/i.test(t))return{k:'command'};
    if(/\?\s*$/.test(t))return{k:'question',wh:'yn'};return{k:'statement'}}
  chat(it){let nm='';for(const b in this.data[MEM]||{})for(const l of this.data[MEM][b]){const m=l.t.match(/(?:my name is|call me|i am|i'?m)\s+([A-Za-z]+)/i);if(m&&!nm)nm=m[1]}
    const pick=a=>a[Math.floor(Math.random()*a.length)],n=nm?' '+nm:'';
    if(it.k==='greet')return pick(['Hello','Hi','Hey'])+n+'! Ask me something, or feed me more knowledge on the Feed tab.';
    if(it.k==='thanks')return pick(['You\'re welcome','Glad to help','Anytime'])+n+'.';
    if(it.k==='bye')return 'Goodbye'+n+'. Everything you taught me is saved.';
    return 'I\'m running well'+n+', and I know '+this.live+' things. What would you like to know?'}
  teachSyn(a,b){a=a.toLowerCase();b=b.toLowerCase();const arr=((this.data.Vocabulary??={}).Synonyms??=[]);
    if(!arr.some(x=>x.s&&x.s.includes(a)&&x.s.includes(b)))arr.push({t:'"'+a+'" and "'+b+'" mean the same thing.',s:[a,b],w:1});this.commit('Vocabulary');
    return{kind:'chat',text:'Understood. From now on "'+a+'" and "'+b+'" mean the same to me.'}}
  // turns the matched leaves into readable sentences instead of dumping them raw
  compose(ps,top,it){const seen=[],paras=[],con=['Also, ','In addition, ','On top of that, '];let ci=0,cur=null;
    const FW=new Set('a an the this that these those it they he she we you when if to for in on at by with each every most some many one two there'.split(' ')),
      lc=s=>FW.has(s.split(/\s+/)[0].toLowerCase())?s[0].toLowerCase()+s.slice(1):s,end=s=>/[.!?:;)]$/.test(s)?s:s+'.',
      jac=(a,b)=>{const A=new Set(tok(a)),B=new Set(tok(b));let n=0;A.forEach(x=>B.has(x)&&n++);return n/Math.max(1,Math.min(A.size,B.size))};
    for(const p of ps){if(p.L.l.code)continue;const s=end(p.L.l.t.trim());if(seen.some(x=>jac(x,s)>.8))continue;seen.push(s);
      if(!cur||cur.c!==p.L.c||cur.b!==p.L.b){cur={c:p.L.c,b:p.L.b,t:(!paras.length||p.L.c===top.L.c?'':'Related, from '+p.L.c+': ')+s};paras.push(cur)}
      else cur.t+=' '+con[ci++%con.length]+lc(s)}
    return paras.map(x=>x.t).join('\n\n')}
  // Entry point: decides what the message is (store / forget / recall-all / question) and acts.
  think(q){const s=q.trim();let m;
    if(m=s.match(/^forget\s+(?:that\s+)?(.+)/i))return this.forget(m[1]);
    if(/\b(what do you (know|remember)|what'?s in (your )?memory|who am i|about me\b)/i.test(s)&&!/\bgit|css|html/i.test(s)){const items=[];for(const b in this.data[MEM]||{})this.data[MEM][b].forEach(l=>items.push({b,t:l.t}));return{kind:'memory',items}}
    if((m=s.match(/^([a-z][\w'-]*)\s+(?:means|is the same as|is another word for|is a synonym of)\s+([a-z][\w'-]*)[.!]?$/i))&&!STOP.has(m[1].toLowerCase())&&!STOP.has(m[2].toLowerCase()))return this.teachSyn(m[1],m[2]);
    if(m=s.match(/^(?:please\s+)?(?:remember|note|save|keep in mind|don'?t forget)\s*(?:that|:)?\s*(.+)/i))return this.store(m[1],'Notes');
    if(!/\?\s*$/.test(s)&&!/^(what|who|how|why|when|where|which|do|does|did|can|could|should|is|are|was|were|tell|show|explain|give|make|build|create|write)\b/i.test(s)&&
      (m=s.match(/^(my\s+.+|i\s*(?:am|'m)\s+.+|call me\s+.+|i\s+(?:like|love|prefer|hate|use|have|work|live|study|play)\b.+)/i))){
      return this.store(s,/\b(like|love|prefer|hate|use)\b/i.test(s)?'Preferences':'Facts')}
    const it=this.intent(s);if(['greet','thanks','bye','howru'].includes(it.k))return{kind:'chat',text:this.chat(it)};
    const r=this.ask(s);return r?{kind:'answer',r}:{kind:'unknown',words:this._unk||[]}}
  store(text,branch){text=text.trim();text=text[0].toUpperCase()+text.slice(1);const a=((this.data[MEM]??={})[branch]??=[]);
    if(!a.some(x=>x.t.toLowerCase()===text.toLowerCase()))a.push({t:text,w:1});this.commit(MEM);return{kind:'store',path:MEM+' › '+branch,text}}
  forget(text){const t=tok(text),m=this.data[MEM];if(!m||!t.length)return{kind:'forgot',n:0};let best=null,bo=0;
    for(const b in m)for(const l of m[b]){const lt=new Set(tok(l.t)),o=t.filter(x=>lt.has(x)).length;if(o>bo){bo=o;best={b,l}}}
    if(!best||bo<Math.ceil(t.length/2))return{kind:'forgot',n:0};const a=m[best.b];a.splice(a.indexOf(best.l),1);if(!a.length)delete m[best.b];if(!Object.keys(m).length)delete this.data[MEM];this.commit(MEM);return{kind:'forgot',n:1,text:best.l.t}}
  // Reads every cluster, uses conversation context, fills gaps across clusters, and also reads Memory automatically.
  ask(q){const it=this.intent(q),t0=performance.now(),tr=[],more=/\b(more|else|another|again|next|other)\b/i.test(q),pron=/\b(it|its|that|this|those|these|them|they|there)\b/i.test(q),pers=/\b(my|mine|me|our)\b/i.test(q),
      raw=[...new Set(tok(q))],prev=this.wm[this.wm.length-1],unk=[];let own=[],ctx=[],pure=false;this._unk=[];
    for(const x of raw){const f=this.fix(x);if(f){if(f!==x)tr.push('typo fixed: '+x+' → '+f);own.push(f)}else{const sy=this.synOf(x).find(y=>this.df.has(y));if(sy){tr.push('understood "'+x+'" as "'+sy+'" (synonym)');own.push(sy)}else{unk.push(x);tr.push('unknown to me: '+x)}}}
    own=[...new Set(own)];
    if(prev&&(more||pron||!raw.length)){ctx=prev.terms.filter(x=>!own.includes(x));if(!own.length){own=ctx;ctx=[];pure=true}tr.unshift('follow-up: carried context from "'+prev.q.slice(0,40)+'"')}
    if(!own.length)return null;const known=pure||!raw.length?1:own.length/raw.length;
    // A word the library has never seen cannot be in any leaf, so an answer would silently skip part of the question. When half or more of the question is unknown, decline instead of returning a related but wrong leaf.
    if(!pure&&unk.length&&known<=.5){this._unk=unk;return null}
    const vibe=/\b(build|make|create|write|code|script|function|app|component|snippet|example|implement|how to|how do)\b/i.test(q),
      N=this.live,sc=new Map(),hit=new Map(),cs={},bs={},qw=new Map([...ctx.map(x=>[x,.5]),...own.map(x=>[x,1])]);
    const xs=this.expand(own,qw),act=this.route(qw,pers,tr),xp=[...xs,...this.expandCo(own,qw,act)];if(xp.length)tr.push('also considered related words: '+xp.join(', '));
    let S=0;
    const need=Math.ceil(own.length/2),prune=this.tess&&own.length>=3;
    // Tesseract skip: a leaf can only reach 50% word coverage if its cell holds at least `need` of the question's words, so every other cell is skipped (exact, nothing that could win is lost).
    const score=cl=>{const G=this.reg[cl];let cand=null,cl_=null;
      if(prune&&G.cells>1){const cnt=new Uint8Array(G.cells),seen=new Int16Array(G.cells);let t=0;
        for(const x of own){t++;const p=G.idx.get(x);if(!p)continue;const mk=G.tm.get(x);
          if(mk){for(let w=0;w<mk.length;w++){let v=mk[w];while(v){cnt[w*32+31-Math.clz32(v&-v)]++;v&=v-1}}}
          else for(const e of p){const k=this.leaves[e[0]].cell;if(seen[k]!==t){seen[k]=t;cnt[k]++}}}
        cl_=[];for(let k=0;k<G.cells;k++)if(cnt[k]>=need)cl_.push(k);if(!cl_.length)return;
        cand=new Uint8Array(G.cells);for(const k of cl_){cand[k]=1;S+=G.cs[k+1]-G.cs[k]}}
      else S+=G.n;
      for(const[x,w]of qw){const p=G.idx.get(x);if(!p)continue;const idf=Math.log(1+N/this.df.get(x)),
        add=e=>{const i=e[0],tf=e[1],L=this.leaves[i];sc.set(i,(sc.get(i)||0)+w*idf*tf*2.2/(tf+1.2*(.25+.75*L.n/this.avg)));if(w===1)hit.set(i,(hit.get(i)||0)+1)};
        if(!cand)for(const e of p)add(e);
        else if(cl_.length*Math.log2(p.length+1)<p.length){for(const k of cl_){const lo=G.cs[k],hi=G.cs[k+1];let a=0,z=p.length;while(a<z){const md=(a+z)>>1;if(p[md][0]<lo)a=md+1;else z=md}for(;a<p.length&&p[a][0]<hi;a++)add(p[a])}}
        else for(const e of p)if(cand[this.leaves[e[0]].cell])add(e)}};act.forEach(score);let wide=false;
    if(![...sc.keys()].some(i=>(hit.get(i)||0)/own.length>=.5)&&Object.keys(this.reg).length>act.length){{const wc=new Set();for(const x of qw.keys()){const f=this.fib.get(x);if(f)for(const k of f.keys())if(!act.includes(k))wc.add(k)}for(const c of[...wc].sort((a,b)=>this.reg[a].no-this.reg[b].no))score(c)}wide=true;tr.push('fast path found nothing: widened search to every cluster')}
    for(const[i,s]of sc){const L=this.leaves[i];cs[L.c]=(cs[L.c]||0)+s;bs[L.c+'\u0001'+L.b]=(bs[L.c+'\u0001'+L.b]||0)+s}
    const ct=Object.values(cs).reduce((a,b)=>a+b,0)||1,ex=more?this.lastIds:new Set();
    const R=[...sc].map(([i,s])=>{const L=this.leaves[i],cov=(hit.get(i)||0)/own.length;let f=s*cov*(L.l.w||1)*(1+cs[L.c]/ct)*(1+.15*Math.log(1+bs[L.c+'\u0001'+L.b]/s));if(L.c===this.last)f*=1.25;if(vibe&&L.l.code)f*=1.6;if(pers&&L.c===MEM)f*=2;return{L,f,cov}}).filter(r=>!ex.has(r.L.l)).sort((a,b)=>b.f-a.f);
    const top=R[0];if(!top||top.cov<.5)return null;
    if(/^(what|who|where|which|when)\b.*\bmy\b/i.test(q)&&top.L.c!==MEM)return null; // a question about the user must be answered from Memory
    let ps=R.filter(r=>r.L.c===top.L.c&&r.L.b===top.L.b&&r.f>=top.f*.45).slice(0,3).sort((a,b)=>a.L.o-b.L.o);
    const codeAns=vibe&&top.L.l.code;if(codeAns)ps=R.filter(r=>r.L.l.code&&r.f>=top.f*.4).slice(0,3);
    const clusters=Object.keys(this.reg).length,rel=this.related(top.L.c);
    tr.push('intent: '+it.k+(it.wh?' ('+it.wh+')':''),'terms: '+own.join(', ')+(ctx.length?' (+ context: '+ctx.join(', ')+')':''),'searched '+S+' of '+N+' leaves ('+(wide?'all':act.length)+' of '+clusters+' clusters'+(this.tess?', 4D cells':'')+')','strongest cluster: '+top.L.c+' ('+Math.round(100*cs[top.L.c]/ct)+'% of evidence)');
    if(rel.length)tr.push('related clusters: '+rel.join(', '));
    // Phase 3: the awake regions talk. Each reports its confidence, the leader asks for what it is missing.
    const talk=[],rep=new Map();for(const r of R)if(!rep.has(r.L.c))rep.set(r.L.c,r);
    [...rep].slice(0,3).forEach(([c,r])=>talk.push({from:c,to:'everyone',text:Math.round(100*r.f/top.f)+'% sure'+(c===top.L.c?' (leading)':'')+', best branch: '+r.L.b}));
    {const seen=new Set();ps.forEach(p=>p.L.t.forEach(x=>seen.add(x)));let miss=own.filter(x=>!seen.has(x));const lead=top.L.c,cap=codeAns?5:4;
      const take=(L,got,how)=>{ps.push({L,f:0,cov:0});L.t.forEach(x=>seen.add(x));miss=own.filter(x=>!seen.has(x));
        if(L.c===lead)talk.push({from:lead,to:'itself',text:'I was missing "'+got.join(', ')+'", found it in my other branch '+L.b});else{talk.push({from:lead,to:L.c,text:'I am missing "'+got.join(', ')+'"'+how});talk.push({from:L.c,to:lead,text:'I know that, see '+L.b})}tr.push('filled a gap ('+got.join(', ')+') from '+L.c+' › '+L.b)};
      // 1) regions that are already awake answer from what they scored
      while(miss.length&&ps.length<cap){let best=null,bv=0;for(const r of R.slice(0,60)){if(ps.some(p=>p.L===r.L)||r.f<top.f*.2)continue;const g=miss.filter(x=>r.L.t.includes(x)).length;if(!g)continue;const v=g*r.f*(rel.includes(r.L.c)||r.L.c===lead?1.2:1);if(v>bv){bv=v;best=r}}
        if(!best)break;take(best.L,miss.filter(x=>best.L.t.includes(x)),'')}
      // 2) then the leader asks wired neighbours first, then every other region (they answer a narrow question, no full search)
      if(miss.length&&ps.length<cap){const cn=new Set();miss.forEach(x=>{const f=this.fib.get(x);if(f)for(const k of f.keys())cn.add(k)});
      for(const c of[...new Set([...(this.tess?[lead]:[]),...rel,...[...cn].sort((a,b)=>this.reg[a].no-this.reg[b].no)])].filter(c=>cn.has(c)&&(c!==lead||this.tess)&&c!==MEM)){if(!miss.length||ps.length>=cap)break;
        const a=this.consult(c,miss,vibe);if(!a||a.v<top.f*(c===lead?this.lg:rel.includes(c)?.2:.3)||ps.some(p=>p.L===a.L))continue;take(a.L,a.g,c===lead?'':rel.includes(c)?' (asked a wired neighbour)':' (asked every region)')}}
      if(miss.length)talk.push({from:lead,to:'everyone',text:'nobody knows "'+miss.join(', ')+'" yet'})}
    let memo=null;if(this.data[MEM]){const m=R.find(r=>r.L.c===MEM&&!ps.includes(r)&&r.cov>=.5&&r.f>=top.f*.1);if(m){memo=m.L.l;tr.push('auto-read Memory: '+memo.t.slice(0,60))}}
    this.last=top.L.c;this.wm.push({q,terms:own});if(this.wm.length>4)this.wm.shift();this.lastIds=new Set(ps.map(p=>p.L.l));this.hebb([...new Set([top.L.c,...ps.map(p=>p.L.c)])].filter(c=>c!==MEM),tr,top.L.c);
    return{unk,talk,text:this.compose(ps,top,it),path:[...new Set(ps.map(p=>p.L.c+' › '+p.L.b))].join(' + '),conf:Math.round(top.cov*known*100),leaves:ps.map(p=>p.L.l),memo,trace:tr,
      also:[...new Set(R.filter(r=>!ps.includes(r)).slice(0,6).map(r=>r.L.c+' › '+r.L.b))].slice(0,3),scanned:S,ms:(performance.now()-t0).toFixed(2)}}
  pick(top){if(MEGA()){let best=null,bo=2;for(const[sn,K]of this.secKw()){const o=top.filter(x=>K.has(x)).length;if(o>bo){bo=o;best=sn}}return best||(top[0]?top[0][0].toUpperCase()+top[0].slice(1):'General')}
    let best=null,bo=2;for(const c in this.data){const K=this.kw[c]||new Set(),o=top.filter(x=>K.has(x)).length;if(o>bo){bo=o;best=c}}
    return best||(top[0]?top[0][0].toUpperCase()+top[0].slice(1):'General')}
  // Auto-feed (Phase 12): reads the 'SECTION: Name' format, files each part into the right section, and never stores a fact twice.
  leafCount(){let n=0;for(const c in this.data)if(c!==MEM)for(const b in this.data[c])if(Array.isArray(this.data[c][b]))n+=this.data[c][b].length;return n}
  dupKey(t){const w=[...new Set(tok(String(t)))].sort();return w.length>=3?w.join(' '):'x:'+String(t).toLowerCase().replace(/[^a-z0-9]+/g,' ').trim()}
  dupSet(){const n=this.leafCount();if(this._dk&&this._dkn===n)return this._dk;const S=new Set();for(const c in this.data)if(c!==MEM)for(const b in this.data[c])if(Array.isArray(this.data[c][b]))for(const l of this.data[c][b])if(l&&l.t)S.add(l.code?'c:'+String(l.t).replace(/\s+/g,' ').trim():this.dupKey(l.t));this._dk=S;this._dkn=n;return S}
  canonSec(c){const lc=c.toLowerCase();if(MEGA()){const L=this.data[LIB];if(L)for(const b in L){const s=secOf(b);if(s.toLowerCase()===lc)return s}return c}for(const k in this.data)if(k!==MEM&&k.toLowerCase()===lc)return k;return c}
  // Splits a paste on 'SECTION: Name' lines (one or many), drops 'PART n OF N' lines, then feeds each part.
  feed(text,name,o={}){text=String(text||'').replace(/\r/g,'');
    if(o.code)return this.feed1(text,name,o);
    const re=/^[ \t]*SECTION[ \t]*:[ \t]*(.+?)[ \t]*$/gim,hs=[];let m;while((m=re.exec(text)))hs.push({name:m[1].replace(/^["'*`]+|["'*`]+$/g,'').slice(0,60),at:m.index,end:m.index+m[0].length});
    const clean=t=>t.replace(/^[ \t]*PART[ \t]+\d+[ \t]+OF[ \t]+\d+[ \t]*$/gim,'').trim();
    if(!hs.length)return this.feed1(clean(text),name,o);
    let n=0,sk=0;const names=[],pre=clean(text.slice(0,hs[0].at));
    if(pre){const r=this.feed1(pre,name,{...o,defer:true});n+=r.n;sk+=r.skipped;names.push(r.c)}
    hs.forEach((h,i)=>{const body=clean(text.slice(h.end,i+1<hs.length?hs[i+1].at:text.length));if(!body)return;const r=this.feed1(body,h.name,{...o,defer:true});n+=r.n;sk+=r.skipped;if(!names.includes(r.c))names.push(r.c)});
    if(!o.defer){this.commit();this._dk=null}
    return{c:names.join(', ')||(hs[0]&&hs[0].name)||'',n,skipped:sk}}
  feed1(text,name,o={}){const cnt=Object.create(null);tok(text.slice(0,200000)).forEach(x=>cnt[x]=(cnt[x]||0)+1);
    const top=Object.entries(cnt).sort((a,b)=>b[1]-a[1]).slice(0,8).map(x=>x[0]),c=this.canonSec(safe((name||'').trim()||(o.code?'Code · '+(o.ext||'misc'):this.pick(top)))),dk=this.dupSet(),add=(b,l)=>{const k=l.code?'c:'+l.t.replace(/\s+/g,' ').trim():this.dupKey(l.t);if(k&&dk.has(k)){skipped++;return false}const[pc,pb0]=place(c,safe(b)),D=(this.data[pc]??={}),pb=Object.keys(D).find(x=>x.toLowerCase()===pb0.toLowerCase())||pb0;(D[pb]??=[]).push(l);if(k)dk.add(k);return true};let n=0,h='',skipped=0;
    if(o.code){chunkCode(text).forEach(ch=>{if(add(o.branch||'snippet',{t:ch.slice(0,1600),code:1,w:1}))n++})}
    else for(const seg of text.replace(/\r/g,'').split(/(```[\s\S]*?```)/)){
      if(seg.startsWith('```')){const s=seg.replace(/^```[^\n]*\n?|```$/g,'').trim();if(s.length>20){if(add(h||'code',{t:s.slice(0,1600),code:1,w:1}))n++}continue}
      for(let p of seg.split(/\n\s*\n/).map(p=>p.trim()).filter(Boolean)){
        const m=p.match(/^#+\s*(.+)/);if(m){h=m[1].slice(0,50);p=p.replace(/^#+\s*.+\n?/,'').trim();if(!p)continue}
        const b=h||p.slice(0,40).replace(/\s+\S*$/,'')+'…';
        for(const s of p.split(/(?<=[.!?])\s+|\n/).map(s=>s.trim()).filter(s=>s.length>12)){if(add(b,{t:s.slice(0,420),w:1}))n++}}}
    const pc=place(c,'')[0];(this.kw[pc]??=new Set());top.forEach(x=>this.kw[pc].add(x));this.skAdd(c,top);if(!o.defer)this.commit(pc);this._dk=dk;this._dkn=this.leafCount();return{c,n,skipped}}
  merge(o,defer){let n=0;for(const c0 in o)if(o[c0]&&typeof o[c0]==='object')for(const b0 in o[c0])if(Array.isArray(o[c0][b0])){const[c,b]=place(safe(c0),safe(b0));o[c0][b0].forEach(l=>{if(l&&l.t){((this.data[c]??={})[b]??=[]).push({t:String(l.t),k:l.k,w:l.w||1,code:l.code,s:Array.isArray(l.s)?l.s.map(String):undefined});n++}})}if(!defer)this.commit();return n}
  // Mega Library (window.MEGA): every cluster becomes a section of one Library cluster. Branch names are 'Section / Branch'. Memory stays separate.
  arrange(d){if(!d||typeof d!=='object')return d;const out={};
    if(MEGA()){if(!Object.keys(d).some(c=>c!==MEM&&c!==LIB))return d;const Lb=out[LIB]={},put=(b,arr)=>{const a=(Lb[safe(b)]??=[]);for(const l of arr)if(l&&!a.some(x=>x.t===l.t))a.push(l)};
      for(const c in d){if(c===MEM){out[MEM]=d[MEM];continue}for(const b in d[c])if(Array.isArray(d[c][b]))put(c===LIB?b:c+' / '+b,d[c][b])}return out}
    const Lb=d[LIB];if(!Lb||!Object.keys(Lb).some(b=>b.indexOf(' / ')>0))return d;
    for(const c in d)if(c!==LIB)out[c]=d[c];
    for(const b in Lb){const i=b.indexOf(' / '),c=i>0?safe(b.slice(0,i)):LIB,bb=i>0?safe(b.slice(i+3)):b;((out[c]??={})[bb]??=[]).push(...Lb[b])}return out}
  sections(){const m=new Map(),L=this.data[LIB]||{};for(const b in L){const s=secOf(b);let e=m.get(s);if(!e)m.set(s,e={name:s,branches:[],n:0});e.branches.push(b);e.n+=Array.isArray(L[b])?L[b].length:0}return m}
  removeSection(s){const L=this.data[LIB];if(!L)return 0;let n=0;for(const b in L)if(secOf(b)===s){delete L[b];n++}if(!Object.keys(L).length)delete this.data[LIB];if(n)this.commit(LIB);return n}
  secKw(){if(this._sk)return this._sk;const m=this._sk=new Map();for(const b in this.data[LIB]||{}){const s=secOf(b);let K=m.get(s);if(!K)m.set(s,K=new Set(tok(s)));for(const l of this.data[LIB][b])if(l&&typeof l.t==='string')tok(l.t).forEach(x=>K.add(x))}return m}
  skAdd(c,top){if(this._sk&&MEGA()&&c!==MEM&&c!==LIB){let K=this._sk.get(c);if(!K)this._sk.set(c,K=new Set(tok(c)));top.forEach(x=>K.add(x))}}
  restore(){let n=0;const S=window.SEED||{};for(const c0 in S)for(const b0 in S[c0]){const[c,b]=place(c0,b0);S[c0][b0].forEach(l=>{const a=((this.data[c]??={})[b]??=[]);if(!a.some(x=>x.t===l.t)){a.push({...l});n++}})}this.commit();return n}
  teach(q,a){const[c,b]=place('Taught',safe(q.slice(0,50)));((this.data[c]??={})[b]??=[]).push({t:a,k:q,w:1.3});this.commit(c)}
  remove(c,b){if(b)delete this.data[c][b];if(!b||!Object.keys(this.data[c]).length)delete this.data[c];this.commit(c)}
}
