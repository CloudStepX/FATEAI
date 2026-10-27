(window.SEED=window.SEED||{})["Vibe Coding"]={
 "Method": [
  {
   "t": "Vibe coding method: describe the goal in one sentence, build the smallest working version in a single file, run it, then change one thing at a time."
  },
  {
   "t": "When code breaks, read the first error line, find that line, fix only that, and run again. Never rewrite everything at once."
  },
  {
   "t": "Keep it mobile first: use flexible widths, big tap targets of 44px, and test on a real phone."
  }
 ],
 "Layout": [
  {
   "t": ".center{display:flex;align-items:center;justify-content:center;min-height:100vh}",
   "code": 1,
   "k": "center anything flexbox css layout"
  },
  {
   "t": ".grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:12px}",
   "code": 1,
   "k": "responsive grid cards css layout"
  }
 ],
 "Theme": [
  {
   "t": ":root{--bg:#fff;--ink:#111}\n@media(prefers-color-scheme:dark){:root{--bg:#0b0b0f;--ink:#eee}}\nbody{background:var(--bg);color:var(--ink)}",
   "code": 1,
   "k": "dark mode theme css variables"
  }
 ],
 "Storage": [
  {
   "t": "const save=(k,v)=>localStorage.setItem(k,JSON.stringify(v));\nconst load=(k,d)=>{try{return JSON.parse(localStorage.getItem(k))??d}catch{return d}};",
   "code": 1,
   "k": "localStorage save load json persist data js"
  }
 ],
 "Network": [
  {
   "t": "async function getJSON(url){\n  const r=await fetch(url);\n  if(!r.ok)throw new Error(r.status);\n  return r.json();\n}",
   "code": 1,
   "k": "fetch json api request error handling js"
  }
 ],
 "Utilities": [
  {
   "t": "const debounce=(f,ms=300)=>{let t;return(...a)=>{clearTimeout(t);t=setTimeout(()=>f(...a),ms)}};",
   "code": 1,
   "k": "debounce delay input search js"
  },
  {
   "t": "list.addEventListener('click',e=>{const b=e.target.closest('button');if(b)console.log(b.dataset.id)});",
   "code": 1,
   "k": "event delegation click buttons list js"
  }
 ],
 "Components": [
  {
   "t": "<dialog id=\"m\"><p>Hello</p><button onclick=\"m.close()\">Close</button></dialog>\n<button onclick=\"m.showModal()\">Open</button>",
   "code": 1,
   "k": "modal popup dialog html component"
  },
  {
   "t": "<!doctype html><meta name=viewport content=\"width=device-width\">\n<input id=t placeholder=\"new task\"><button onclick=add()>Add</button><ul id=l></ul>\n<script>\nconst l=document.getElementById('l');\nfunction add(){if(!t.value)return;const li=document.createElement('li');li.textContent=t.value;li.onclick=()=>li.remove();l.append(li);t.value=''}\n</script>",
   "code": 1,
   "k": "todo list app build make create html single file task"
  }
 ],
 "Offline": [
  {
   "t": "self.addEventListener('install',e=>e.waitUntil(caches.open('v1').then(c=>c.addAll(['./','index.html']))));\nself.addEventListener('fetch',e=>e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request))));",
   "code": 1,
   "k": "pwa service worker offline cache js"
  }
 ],
 "Git workflow": [
  {
   "t": "Git flow: git add -A, then git commit -m \"message\", then git push. Make a branch with git checkout -b name to try risky changes safely."
  }
 ]
};
