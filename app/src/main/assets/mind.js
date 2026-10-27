// Mind view (Phase 8): the library drawn on its real 4D scale.
//  - The glowing brain is the Library's own tesseract (8x8x8x8 = 4,096 cells for a big library). Every dot is a filled cell; every line joins
//    two filled cells that are neighbours on one of the four axes. The 4D grid is turned through the 4th dimension and projected, so the brain breathes.
//  - Every section is a hub with its own rotating 2x2x2x2 tesseract (16 corners). A corner glows by how many of the section's leaves sit in that corner of the Library grid.
//  - The pad at the bottom is the build's own tesseract: four axes (Shape, Logic, Look, Words), 16 corners. When a build is made, the sections that
//    committed to its parts send a beam to the pad and the corner for that build's address lights up (1 = a section committed and the file passed its check).
// Everything drawn comes from lib.leaves, lib.reg and the commit records. Nothing is random: the same library draws the same picture.
(function(root){
const AX=['#2ee6ff','#a56bff','#38f2d0','#ff5ad8'],PAL=['#2ee6ff','#a56bff','#38f2d0','#ff5ad8','#5b9dff'];
const secOf=b=>{const i=String(b).indexOf(' / ');return i>0?b.slice(0,i):b};
function decode(m,bits){let a=0,b=0,c=0,d=0;for(let i=0;i<bits;i++){const q=(m>>(i*4))&15;a|=(q&1)<<i;b|=((q>>1)&1)<<i;c|=((q>>2)&1)<<i;d|=((q>>3)&1)<<i}return[a,b,c,d]}
const hash=n=>{let h=Math.imul(n+1,2654435761);h^=h>>>15;h=Math.imul(h,2246822519);h^=h>>>13;return(h>>>0)/4294967296};
// ---- model: pure, works in Node ----
function model(lib,maxEdges){maxEdges=maxEdges||2200;
 const hubs=new Map(),cells=new Map(),G=lib.reg&&lib.reg.Library,side=G?G.side:1,bits=side>1?Math.log2(side):0;
 for(const L of lib.leaves||[]){if(!L||L.dead||!L.l)continue;const g=lib.reg[L.c];if(!g)continue;
  const n=g.side,co=n>1?decode(L.cell,Math.log2(n)):[0,0,0,0],name=L.c==='Library'?secOf(L.b):L.c;
  let h=hubs.get(name);if(!h)hubs.set(name,h={name,n:0,fill:new Array(16).fill(0),cells:new Set(),mem:L.c!=='Library'});
  h.n++;h.fill[n>1?((co[0]>=n/2?1:0)|(co[1]>=n/2?2:0)|(co[2]>=n/2?4:0)|(co[3]>=n/2?8:0)):0]++;
  if(L.c==='Library'){h.cells.add(L.cell);const id=co[0]+co[1]*n+co[2]*n*n+co[3]*n*n*n;let c=cells.get(id);if(!c)cells.set(id,c={co,n:0,by:new Map()});c.n++;c.by.set(name,(c.by.get(name)||0)+1)}}
 const list=[...hubs.values()].sort((a,b)=>b.n-a.n||(a.name<b.name?-1:1));list.forEach((h,i)=>{h.i=i;h.color=PAL[i%PAL.length]});
 const idx=new Map(list.map(h=>[h.name,h])),nodes=[],at=new Map();
 for(const[id,c]of[...cells].sort((a,b)=>a[0]-b[0])){let best=null,bn=0;for(const[s,k]of c.by)if(k>bn||(k===bn&&s<best)){bn=k;best=s}
  at.set(id,nodes.length);nodes.push({co:c.co,n:c.n,hub:idx.get(best),id})}
 let edges=[];const st=[1,side,side*side,side*side*side];
 for(const nd of nodes)for(let ax=0;ax<4;ax++)if(nd.co[ax]+1<side){const j=at.get(nd.id+st[ax]);if(j!==undefined)edges.push([at.get(nd.id),j])}
 const total=edges.length;if(edges.length>maxEdges)edges=edges.filter((e,i)=>hash(i)<maxEdges/total);
 return{hubs:list,nodes,edges,side,cellsTotal:side**4,filled:nodes.length,leaves:list.reduce((a,h)=>a+h.n,0),bits,edgesTotal:total}}
// ---- the 16 corners of a tesseract and its 32 edges ----
const V16=[];for(let i=0;i<16;i++)V16.push([i&1?1:-1,i&2?1:-1,i&4?1:-1,i&8?1:-1]);
const E32=[];for(let i=0;i<16;i++)for(let b=0;b<4;b++)if(!(i>>b&1))E32.push([i,i|1<<b]);
function turn(v,a,b,c,o){let x=v[0],y=v[1],z=v[2],w=v[3],s,k;
 k=Math.cos(a);s=Math.sin(a);let t=x*k-w*s;w=x*s+w*k;x=t;
 k=Math.cos(b);s=Math.sin(b);t=y*k-w*s;w=y*s+w*k;y=t;
 k=Math.cos(c);s=Math.sin(c);t=z*k-w*s;w=z*s+w*k;z=t;
 const p=1/(2.4-w*.8);o[0]=x*p*1.6;o[1]=y*p*1.6;o[2]=z*p*1.6}
// ---- view ----
let M=null,key='',cv,cx,info,leg,W=300,H=340,dpr=1,sel=null,active=new Set(),cm=null,t0=0,raf=0,last=0,on=false,lib_,pos=[],reduce=false;
const tmp=[0,0,0],ball=[0,0,0,0];
function build(){const k=lib_.live+':'+lib_.dead+':'+Object.keys(lib_.data||{}).length;if(M&&k===key)return;key=k;M=model(lib_);
 M.nodes.forEach(n=>{const u=n.co.map(c=>(c+.5)/M.side*2-1),m2=Math.hypot(u[0],u[1],u[2],u[3])||1,mx=Math.max(...u.map(Math.abs))||1;const v=u.map(x=>x*mx/m2),r=Math.hypot(...v)||1,k=Math.pow(r,-.45);n.v=v.map(x=>x*k)});
 layout();legend()}
function layout(){pos=[];const L=[],R=[];M.hubs.forEach((h,i)=>(i%2?R:L).push(h));
 const put=(a,left)=>a.forEach((h,j)=>{const y=H*(.1+.62*(a.length>1?j/(a.length-1):.5));h.x=left?W*(.085+(j%2)*.07):W*(.915-(j%2)*.07);h.y=y;h.r=Math.max(8,Math.min(15,6+Math.log2(h.n+1)*1.1))});put(L,true);put(R,false)}
function legend(){if(!leg)return;leg.replaceChildren();M.hubs.forEach(h=>{const b=document.createElement('button');b.className='chip'+(sel===h.name?' on':'');b.textContent=h.name+' ('+h.n+')';b.style.borderLeft='4px solid '+h.color;b.onclick=()=>pick(h.name);leg.append(b)})}
function pick(n){sel=sel===n?null:n;legend();text();draw(performance.now())}
function text(){if(!info||!M)return;const h=sel&&M.hubs.find(x=>x.name===sel);let s;
 if(h){const k=h.fill.filter(x=>x).length;s=h.name+': '+h.n+' leaves. '+(h.mem?'Kept in its own 4D square (2×2×2×2 or larger). ':'It fills '+h.cells.size+' of the Library\'s '+M.cellsTotal+' cells, and sits in '+k+' of the 16 corners of its 4D square.');
  if(cm){const mine=cm.commits.filter(c=>c.owner===h.name);if(mine.length)s+=' In the last build it committed: '+mine.map(c=>c.name+(c.ok?' (kept)':' (not kept)')).join(', ')+'.'}}
 else s='The Library is one 4D square, '+M.side+'×'+M.side+'×'+M.side+'×'+M.side+' = '+M.cellsTotal+' cells, '+M.filled+' filled by '+M.leaves+' leaves in '+M.hubs.length+' sections. Each side hub is a section and its 16 corners. Tap one.'+(cm?' Last build: address '+cm.addr.join('·')+' ('+cm.addr.reduce((a,b)=>a+b,0)+' of 4 parts committed and kept).':'');
 info.textContent=s;cv.setAttribute('aria-label','4D map of the library. '+s)}
function size(){const r=cv.parentElement.getBoundingClientRect();W=Math.max(260,Math.floor(r.width));H=Math.round(Math.min(380,Math.max(300,W*.95)));dpr=Math.min(2,window.devicePixelRatio||1);cv.width=W*dpr;cv.height=H*dpr;cv.style.width=W+'px';cv.style.height=H+'px';if(M)layout()}
const rgba=(h,a)=>'rgba('+parseInt(h.slice(1,3),16)+','+parseInt(h.slice(3,5),16)+','+parseInt(h.slice(5,7),16)+','+a+')';
function draw(now){if(!M||!cx)return;const t=reduce?2.2:now/1000,c=cx;c.setTransform(dpr,0,0,dpr,0,0);c.globalCompositeOperation='source-over';c.clearRect(0,0,W,H);
 const bx=W*.5,by=H*.37,R=W*.3,px=W*.5,py=H*.86;
 // room: floor in perspective, glow behind the brain
 let g=c.createRadialGradient(bx,by,4,bx,by,W*.5);g.addColorStop(0,'rgba(46,230,255,.20)');g.addColorStop(.5,'rgba(120,80,255,.08)');g.addColorStop(1,'rgba(0,0,0,0)');c.fillStyle=g;c.fillRect(0,0,W,H);
 c.lineWidth=1;const vy=H*.62;for(let i=-9;i<=9;i++){c.strokeStyle=rgba(i%3?'#2ee6ff':'#a56bff',i%3?.07:.14);c.beginPath();c.moveTo(bx+i*8,vy);c.lineTo(bx+i*W*.12,H);c.stroke()}
 for(let i=1;i<7;i++){const y=vy+(H-vy)*Math.pow(i/6,1.8);c.strokeStyle=rgba('#2ee6ff',.05+.02*i);c.beginPath();c.moveTo(0,y);c.lineTo(W,y);c.stroke()}
 c.globalCompositeOperation='lighter';
 // circuit traces to the pad
 [[-1,.0],[1,.0],[-1,1],[1,1]].forEach(([s,k],i)=>{const y0=py+6+k*10;c.strokeStyle=rgba(i%2?'#a56bff':'#2ee6ff',.32);c.lineWidth=1.2;c.beginPath();c.moveTo(px+s*40,y0);c.lineTo(px+s*(W*.2),y0);c.lineTo(px+s*(W*.2+14),y0+(k?6:-8));c.lineTo(px+s*(W*.42),y0+(k?6:-8));c.stroke();
  const f=(t*.35+i*.27)%1;c.fillStyle=rgba('#ffffff',.8);c.fillRect(px+s*(40+f*(W*.2-40))-1,y0-1,3,3)});
 // 4D turn: gentle, so the brain keeps its shape and breathes through the 4th dimension
 const a=.55*Math.sin(t*.31),b=.5*Math.sin(t*.23+1),cc=.45*Math.sin(t*.17+2),ya=.35*Math.sin(t*.13);const cy=Math.cos(ya),sy=Math.sin(ya);
 const N=M.nodes,sx=new Float32Array(N.length),sy2=new Float32Array(N.length),dz=new Float32Array(N.length);
 for(let i=0;i<N.length;i++){turn(N[i].v,a,b,cc,tmp);let x=tmp[0],y=tmp[1],z=tmp[2];const x2=x*cy+z*sy,z2=-x*sy+z*cy;x=x2;z=z2;if(y>0)y*=.72;y-=.1*Math.max(0,x)*(1-y);
  const p=1/(1.9-z*.32);sx[i]=bx+x*R*2.05*p;sy2[i]=by+y*R*1.55*p;dz[i]=z}
 const sc=M.hubs.length;
 // edges: neighbours on one of the four axes
 c.lineWidth=.7;c.strokeStyle='rgba(60,210,255,.3)';c.beginPath();for(const[i,j]of M.edges){if(M.edges.length&&((i+j)&1))continue;c.moveTo(sx[i],sy2[i]);c.lineTo(sx[j],sy2[j])}c.stroke();
 c.strokeStyle='rgba(165,107,255,.3)';c.beginPath();for(const[i,j]of M.edges){if(!((i+j)&1))continue;c.moveTo(sx[i],sy2[i]);c.lineTo(sx[j],sy2[j])}c.stroke();
 // nodes: lit when their section answered the last question or is selected
 for(let i=0;i<N.length;i++){const h=N[i].hub,hot=h&&(active.has(h.name)||sel===h.name),al=(.3+.45*(dz[i]+1)/2)*(sel&&!hot?.35:1);c.fillStyle=rgba(h?h.color:'#2ee6ff',hot?Math.min(1,al+.4):al);const s=hot?2.8:1.4;c.fillRect(sx[i]-s/2,sy2[i]-s/2,s,s)}
 // beams from every hub to the brain: a few of its own cells
 for(const h of M.hubs){const mine=N.map((n,i)=>n.hub===h?i:-1).filter(i=>i>=0);if(!mine.length)continue;const hot=active.has(h.name)||sel===h.name,k=Math.min(mine.length,hot?9:3);
  for(let q=0;q<k;q++){const i=mine[Math.floor(hash(h.i*31+q)*mine.length)];c.strokeStyle=rgba(h.color,hot?.42:.12);c.lineWidth=hot?.9:.6;c.beginPath();c.moveTo(h.x,h.y);c.lineTo(sx[i],sy2[i]);c.stroke();
   if(hot){const f=(t*.5+q*.21+h.i*.13)%1;c.fillStyle=rgba('#ffffff',.85);c.fillRect(h.x+(sx[i]-h.x)*f-1,h.y+(sy2[i]-h.y)*f-1,2.4,2.4)}}}
 // hubs: each is its own rotating tesseract; a corner glows with the share of the section's leaves that sit in it
 const P=[];for(const h of M.hubs){const ta=t*.45+h.i,r=h.r,mx=Math.max(1,...h.fill),hot=active.has(h.name)||sel===h.name;
  for(let i=0;i<16;i++){turn(V16[i],ta,ta*.7,ta*.4,tmp);P[i]=[h.x+tmp[0]*r*.5,h.y+tmp[1]*r*.5]}
  c.lineWidth=hot?1.1:.7;c.strokeStyle=rgba(h.color,hot?.95:.55);c.beginPath();for(const[i,j]of E32){c.moveTo(P[i][0],P[i][1]);c.lineTo(P[j][0],P[j][1])}c.stroke();
  for(let i=0;i<16;i++){const f=h.fill[i]/mx;if(!f)continue;c.fillStyle=rgba(h.color,.35+.65*f);const s=1.6+2.2*f;c.beginPath();c.arc(P[i][0],P[i][1],s,0,6.283);c.fill()}
  if(sel===h.name){c.strokeStyle='rgba(255,255,255,.8)';c.lineWidth=1;c.beginPath();c.arc(h.x,h.y,r+5,0,6.283);c.stroke()}}
 // core
 g=c.createRadialGradient(bx,by,0,bx,by,R*.32);g.addColorStop(0,'rgba(255,255,255,.85)');g.addColorStop(.25,'rgba(120,240,255,.45)');g.addColorStop(1,'rgba(0,0,0,0)');c.fillStyle=g;c.fillRect(bx-R,by-R,R*2,R*2);
 // fan from the brain down to the pad
 for(let q=0;q<16;q++){const f=q/15-.5,i0=bx+f*R*1.5;c.strokeStyle=rgba(q%3?'#2ee6ff':'#a56bff',.12);c.lineWidth=.7;c.beginPath();c.moveTo(i0,by+R*.75);c.lineTo(px+f*30,py-26);c.stroke()}
 // pad: the build's own tesseract (4 axes x 2 = 16 corners)
 c.strokeStyle=rgba('#2ee6ff',.7);c.lineWidth=1.2;[[46,17],[32,12]].forEach(([w,h])=>{c.beginPath();c.moveTo(px,py-h+10);c.lineTo(px+w,py+10);c.lineTo(px,py+h+10);c.lineTo(px-w,py+10);c.closePath();c.stroke()});
 const Q=[];const bt=reduce?1.2:t*.5;for(let i=0;i<16;i++){turn(V16[i],bt,bt*.6,bt*.35,tmp);Q[i]=[px+tmp[0]*15,py-20+tmp[1]*15]}
 const el=cm?now-t0:1e9,lit=cm?cm.addr.reduce((a,v,k)=>a|v<<k,0):-1;
 c.lineWidth=.8;c.strokeStyle=rgba('#a56bff',.55);c.beginPath();for(const[i,j]of E32){c.moveTo(Q[i][0],Q[i][1]);c.lineTo(Q[j][0],Q[j][1])}c.stroke();
 for(let i=0;i<16;i++){const on_=cm&&el>2200&&i===lit;c.fillStyle=on_?'rgba(255,255,255,.95)':rgba('#a56bff',.55);c.beginPath();c.arc(Q[i][0],Q[i][1],on_?3.6:1.8,0,6.283);c.fill();if(on_){c.strokeStyle='rgba(255,255,255,.5)';c.beginPath();c.arc(Q[i][0],Q[i][1],7,0,6.283);c.stroke()}}
 // commits: each part's owner sends a beam to the pad, one after the other
 if(cm){cm.commits.forEach((k,i)=>{const h=k.owner&&M.hubs.find(x=>x.name===k.owner);if(!h)return;const s=el-i*450,f=Math.max(0,Math.min(1,s/650));if(s<0)return;const col=AX[i],x1=h.x+(px-h.x)*f,y1=h.y+(py-26-h.y)*f;
  c.strokeStyle=rgba(col,k.ok?.8:.35);c.lineWidth=k.ok?1.6:1;c.beginPath();c.moveTo(h.x,h.y);c.lineTo(x1,y1);c.stroke();c.fillStyle=rgba('#ffffff',.95);c.beginPath();c.arc(x1,y1,f<1?3:0,0,6.283);c.fill();
  if(f>=1){c.strokeStyle=rgba(col,.9);c.lineWidth=1.4;c.beginPath();c.arc(h.x,h.y,h.r+3,0,6.283);c.stroke()}})}
 c.globalCompositeOperation='source-over'}
function loop(now){raf=0;if(!on||document.hidden)return;if(now-last>=33){last=now;draw(now)}raf=requestAnimationFrame(loop)}
function start(){on=true;if(!raf&&!reduce)raf=requestAnimationFrame(loop);else draw(performance.now())}
function stop(){on=false;if(raf)cancelAnimationFrame(raf);raf=0}
const api={model,decode,AX,
 mount(o,lib){cv=o.canvas;info=o.info;leg=o.legend;lib_=lib;cx=cv.getContext('2d');reduce=!!(window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches);
  cv.addEventListener('pointerdown',e=>{if(!M)return;const r=cv.getBoundingClientRect(),x=e.clientX-r.left,y=e.clientY-r.top;let best=null,bd=26;for(const h of M.hubs){const d=Math.hypot(h.x-x,h.y-y);if(d<bd){bd=d;best=h}}pick(best?best.name:sel)});
  addEventListener('resize',()=>{if(on){size();draw(performance.now())}});document.addEventListener('visibilitychange',()=>{if(on&&!document.hidden&&!raf&&!reduce)raf=requestAnimationFrame(loop)})},
 show(){size();build();text();start()},hide(){stop()},
 commit(res){cm={commits:res.commits,addr:res.addr};t0=performance.now();if(M)text()},
 setActive(s){active=new Set(s||[])},
 get state(){return{M,sel,cm}}};
if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.Mind=api;
})(typeof window!=='undefined'?window:globalThis);
