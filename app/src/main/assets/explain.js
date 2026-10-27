// Fate Tree code explainer: turns pasted code into plain English, fully offline, by rules.
// It does not run the code and it does not understand everything: lines it cannot read are shown as "(not understood)".
(function(G){
const OPS=[[/!==|!=/g,' is not equal to '],[/===|==/g,' is equal to '],[/>=/g,' is at least '],[/<=/g,' is at most '],[/&&/g,' and '],[/\|\|/g,' or '],[/(^|[\s(])!(?!=)/g,'$1not '],[/\s>\s/g,' is greater than '],[/\s<\s/g,' is less than '],[/\bnot\b/g,'not'],[/\bis not None\b/g,'is not nothing'],[/\bis None\b/g,'is nothing'],[/\bNone\b|\bnull\b|\bnil\b|\bundefined\b/g,'nothing'],[/\bTrue\b|\btrue\b/g,'true'],[/\bFalse\b|\bfalse\b/g,'false']];
const bal=x=>{let d=0;for(const c of x){if(c==='(')d++;if(c===')'&&--d<0)return false}return d===0};
const tidy=s=>s.replace(/\s+/g,' ').replace(/^\s+|\s+$/g,'');
function expr(e,noIn){let s=e.trim().replace(/;$/,'');if(/^\(.*\)$/.test(s)&&bal(s.slice(1,-1)))s=s.slice(1,-1);s=' '+s+' ';s=s.replace(/(\w+)\s%\s(\w+)\s*(?:===|==)\s*0\b/g,'$1 divides evenly by $2').replace(/(\w+)\s%\s(\w+)\s*(?:!==|!=)\s*0\b/g,'$1 does not divide evenly by $2').replace(/(\w+)\s%\s(\w+)/g,'the remainder of $1 divided by $2');
  s=s.replace(/\blen\(([^()]*)\)/g,'the length of $1').replace(/\b(\w+)\.length\b/g,'the length of $1').replace(/\b(\w+)\.size\(\)/g,'the size of $1')
   .replace(/\b(\w+)\[0\]/g,'the first item of $1').replace(/\b(\w+)\[-1\]/g,'the last item of $1').replace(/\b(\w+)\[([^\]]+)\]/g,'item $2 of $1')
   .replace(/\b(\w+)\+\+/g,'$1 plus one').replace(/\bMath\.floor\(([^()]*)\)/g,'$1 rounded down').replace(/\bMath\.max\(([^()]*)\)/g,'the largest of $1').replace(/\bMath\.min\(([^()]*)\)/g,'the smallest of $1').replace(/\bMath\.random\(\)/g,'a random number')
   .replace(/\bint\(([^()]*)\)/g,'$1 as a whole number').replace(/\bstr\(([^()]*)\)/g,'$1 as text').replace(/\bfloat\(([^()]*)\)/g,'$1 as a decimal number').replace(/\bsum\(([^()]*)\)/g,'the sum of $1').replace(/\bmax\(([^()]*)\)/g,'the largest of $1').replace(/\bmin\(([^()]*)\)/g,'the smallest of $1').replace(/\bsorted\(([^()]*)\)/g,'$1 sorted').replace(/\b(\w+)\.toLowerCase\(\)|\b(\w+)\.lower\(\)/g,(m,a,b)=>(a||b)+' in lower case').replace(/\b(\w+)\.toUpperCase\(\)|\b(\w+)\.upper\(\)/g,(m,a,b)=>(a||b)+' in upper case').replace(/\b(\w+)\.trim\(\)|\b(\w+)\.strip\(\)/g,(m,a,b)=>(a||b)+' without spaces at the ends')
   .replace(/\b(\w+)\.push\(([^()]*)\)|\b(\w+)\.append\(([^()]*)\)/g,(m,a,b,c,d)=>'add '+(b||d)+' to the end of '+(a||c))
   .replace(/\binput\(([^()]*)\)/g,'what the user types').replace(/\bprompt\(([^()]*)\)/g,'what the user types').replace(/\brange\((\d+),\s*(\d+)\)/g,(m,a,b)=>'the numbers from '+a+' up to '+(b-1)).replace(/\brange\((\d+)\)/g,(m,a)=>'the numbers from 0 up to '+(a-1));
  for(const [r,t] of OPS)s=s.replace(r,t);if(!noIn)s=s.replace(/\bnot in\b/g,'is not found in').replace(/(\w)\s+in\s+(?=["'\w])/g,'$1 is found in ');
  s=s.replace(/\s\+\s/g,' plus ').replace(/\s-\s/g,' minus ').replace(/\s\*\s/g,' times ').replace(/\s\/\/\s/g,' divided by (rounded down) ').replace(/\s\/\s/g,' divided by ').replace(/\s\*\*\s/g,' to the power of ');
  return tidy(s)}
const plist=s=>{const a=s.split(',').map(x=>x.trim().replace(/^(?:final\s+)?(?:int|long|double|float|char|string|String|boolean|bool|var|let|const|auto)\s+/,'').replace(/\s*(?::|=).*$/,'')).filter(Boolean);return a.length?'takes '+a.join(a.length>2?', ':' and ').replace(/, ([^,]+)$/,', and $1'):'takes nothing'};
const out=(s)=>tidy(s.replace(/^\(|\)$/g,'')).replace(/^f?(["'`])(.*)\1$/,'the text "$2"');
const show=a=>{const t=a.trim();return /^f?["'`]/.test(t)&&/["'`]$/.test(t)?'the text '+t.replace(/^f/,'').replace(/^["'`]|["'`]$/g,'"'):expr(t)};
function showMany(a){return a.split(/,(?=(?:[^"']*["'][^"']*["'])*[^"']*$)/).map(show).join(', then ')}
// ---- language detection
function detect(t,asked,explicit){const s=t.trim(),one=!s.includes('\n');
  if(/^\s*(SELECT|INSERT|UPDATE|DELETE|CREATE|DROP|ALTER|WITH)\b/i.test(s)&&/\b(FROM|INTO|SET|TABLE|VALUES)\b/i.test(s))return'SQL';
  if(/^\s*<(!doctype|html|div|p|a|img|ul|ol|h\d|span|body|head|section|button|form|input|table|li|nav)\b/i.test(s))return'HTML';
  if(/^\s*[\[{]/.test(s)){try{JSON.parse(s);return'JSON'}catch{}}
  if(/^\s*[.#]?[\w-]+(\s*[,>+ ]\s*[.#]?[\w-]+)*\s*\{[^{}]*:[^{}]*\}\s*$/s.test(s)&&!/\b(function|if|for|while|return)\b/.test(s))return'CSS';
  if(/^\s*#include\b|\bstd::|\bcout\b/.test(s))return/std::|cout|class\s/.test(s)?'C++':'C';
  if(/^\s*(public|private|protected)?\s*(static\s+)?(class|void|int)\b.*[{(]|System\.out\./.test(s))return'Java';
  if(/^\s*package \w+|^\s*func\s+(\(\w+\s+\*?\w+\)\s*)?\w*\s*\(|\bfmt\.Print/m.test(s))return'Go';
  if(/\bfn\s+\w+\s*\(|\bprintln!\(|\blet mut\b/.test(s))return'Rust';
  if(/^\s*(def |class \w+.*:|import \w+|from \w+ import|print\()|\bfor \w+ in\b.*(:\s*$|\]\s*$)|\bif .*:\s*$|\belif\b/m.test(s)&&!/[;{]\s*$/m.test(s))return'Python';
  if(/\b(function|const|let|var|console\.log|=>|require\(|await|async)\b/.test(s))return'JavaScript';
  if((!one||explicit||asked)&&/^\s*(ls|cd|rm|cp|mv|mkdir|cat|echo|grep|git|npm|pip|sudo|chmod|curl|python3?|node|find|touch|pwd)\b/m.test(s)&&!/[;{]\s*$/m.test(s)&&(explicit||/\s-\w|\||&&|\.\.?\/|\bgit (status|add|commit|push|pull|clone|checkout|log|diff|branch|merge)\b|\bnpm (install|run|init|start|test)\b|\bpip3? install\b|\bcd \S|\bmkdir \S/.test(s)))return'Shell';
  if(/^\^?(?:\\.|\[[^\]]*\]|[\w\s@,:;\/'"!#%&=<>~-]|[(){}|?*+.$\\])+\$?$/.test(s)&&/\\[a-zA-Z.\\]|\[[^\]]+\]|\{\d+(,\d*)?\}|^\^|\$$|\.[*+]|[\w)\]][*+]\s*$|\(\?:/.test(s)&&s.length<120&&!/^\w+$/.test(s)&&(asked||(!/\s/.test(s)&&/\\[dws]|^\^.*\$$/.test(s))))return'Regex';
  if(/[;{}]\s*$/m.test(s)&&/\b(if|for|while|return)\b/.test(s))return'JavaScript';
  return null}
// ---- line rules for C-style and Python code
function splitStmts(line){const segs=[];let cur='',q=null,par=0,br=0;
  for(let i=0;i<line.length;i++){const c=line[i];cur+=c;
    if(q){if(c==='\\'){cur+=line[++i]||'';continue}if(c===q)q=null;continue}
    if(c==='"'||c==="'"||c==='`'){q=c;continue}
    if(c==='(')par++;else if(c===')')par--;
    else if(par===0&&c==='{'){if(br>0||!/(\)|=>|\belse|\btry|\bfinally|\bdo|\bclass\s+\w+(?:\s+extends\s+\w+)?)\s*\{$/.test(cur.replace(/\s+/g,' ').trim())){br++;continue}segs.push(cur.trim());cur=''}
    else if(par===0&&c==='}'){if(br>0){br--;continue}const t=cur.slice(0,-1).trim();if(t)segs.push(t);segs.push('}');cur=''}
    else if(par===0&&br===0&&c===';'){segs.push(cur.trim());cur=''}}
  if(cur.trim())segs.push(cur.trim());return segs}
function head(body,kw){const m=body.match(new RegExp('^'+kw+'\\s*\\('));if(!m)return null;let d=0;for(let i=m[0].length-1;i<body.length;i++){if(body[i]==='(')d++;else if(body[i]===')'&&--d===0)return{cond:body.slice(m[0].length,i),rest:body.slice(i+1).trim()}}return null}

const lc=x=>x.replace(/^./,c=>c.toLowerCase());
function codeLine(l,lang){const raw=l.trim();let m,s=raw;if(!s)return null;
  if(/^[{}();,]*$/.test(s)||/^(end|fi|done|esac|\)|\]|\}\)?;?)$/.test(s))return null;
  if(/^(#|\/\/|\/\*|\*)/.test(s)&&!/^#include|^#define/.test(s))return'A comment for human readers, the computer ignores it: '+s.replace(/^(#|\/\/+|\/\*+|\*+)\s*|\s*\*\/$/g,'');
  s=s.replace(/\s*(\/\/|#(?!include|define)).*$/,'');if(lang==='Python')s=s.replace(/\s*#.*$/,'');
  s=s.replace(/^\}\s*/,'');if(!s)return null;const body=s.replace(/;\s*$/,'');let h;const inl=(h,pre)=>h.rest&&h.rest!=='{'?pre+expr(h.cond)+', '+lc(codeLine(h.rest,lang)||h.rest):pre+expr(h.cond)+':';
  if(m=body.match(/^#include\s*[<"](.+)[>"]/))return'Bring in the "'+m[1]+'" library.';
  if(m=body.match(/^(?:from\s+(\S+)\s+)?import\s+(.+?)(?:\s+from\s+['"](.+)['"])?$/))return m[1]?'From '+m[1]+', bring in '+m[2]+'.':m[3]?'Bring in '+m[2]+' from "'+m[3]+'".':'Bring in '+m[2]+'.';
  if(m=body.match(/^(?:async\s+)?def\s+(\w+)\s*\((.*)\)\s*(?:->\s*\w+)?\s*:?$/))return'Define a function called '+m[1]+' that '+plist(m[2])+'.';
  if(m=body.match(/^(?:pub\s+)?(?:fn|func)\s+(\w+)\s*\((.*?)\)\s*(?:->\s*[\w<>]+|[\w<>\[\]*]+)?\s*\{?$/))return'Define a function called '+m[1]+' that '+plist(m[2])+'.';
  if(m=body.match(/^(?:export\s+)?(?:async\s+)?function\s*\*?\s*(\w+)\s*\((.*?)\)\s*\{?$/))return'Define a function called '+m[1]+' that '+plist(m[2])+'.';
  if(m=body.match(/^(?:export\s+)?(?:const|let|var)\s+(\w+)\s*=\s*(?:async\s*)?\(?([\w\s,]*)\)?\s*=>\s*(.*?)\{?$/))return'Define a function called '+m[1]+' that '+plist(m[2])+(m[3]?' and gives back '+expr(m[3])+'.':'.');
  if((m=body.match(/^(?:public|private|protected|static|final|\s)*(?:[\w<>\[\]]+)\s+(\w+)\s*\(([^)]*)\)\s*(?:throws \w+\s*)?\{?$/))&&!/^(if|for|while|switch|return|else|catch|new|print)\b/.test(body)&&/^(?:public|private|protected|static|int|void|double|float|long|char|bool|boolean|String|string|auto)\b/.test(body))return'Define a function called '+m[1]+' that '+plist(m[2])+'.';
  if(m=body.match(/^(?:public\s+|export\s+|final\s+|abstract\s+)*class\s+(\w+)(?:\s*\(?\s*(?:extends\s+)?(\w*)\)?)?\s*[:{]?$/))return'Define a class called '+m[1]+(m[2]?', built on '+m[2]:'')+': a blueprint for objects.';
  if(h=head(body,'else\\s+if'))return inl(h,'Otherwise, if ');if(m=body.match(/^elif\s+(.*?):$/))return'Otherwise, if '+expr(m[1])+':';
  if(/^else\s*[:{]?$/.test(body))return'Otherwise:';if(m=body.match(/^else\s+(.+)$/))return'Otherwise, '+lc(codeLine(m[1],lang)||m[1]);
  if(h=head(body,'if'))return inl(h,'Only when ');if(m=body.match(/^if\s+(.*?):$/))return'Only when '+expr(m[1])+':';
  if(m=body.match(/^for\s+(\w+)\s+in\s+range\((.*)\)\s*:$/)){const a=m[2].split(',').map(x=>x.trim());return a.length===1?'Repeat for '+m[1]+' = 0 up to '+expr(a[0])+' (not including it):':'Repeat for '+m[1]+' = '+expr(a[0])+' up to '+expr(a[1])+' (not including it):'}
  if(m=body.match(/^for\s+(\w+)\s+in\s+(.*?):$/))return'For each '+m[1]+' in '+expr(m[2],1)+':';
  if(m=body.match(/^for\s*\((?:let|var|int|long|size_t)?\s*(\w+)\s*=\s*([^;]+);\s*\1\s*(<=?|>=?)\s*([^;]+);\s*([^)]*)\)\s*\{?$/)){const up=/\+\+|\+=/.test(m[5]),inc=m[3].length===2;return'Repeat with '+m[1]+' starting at '+expr(m[2])+' and '+(up?'counting up':'counting down')+' '+(inc?'through ':'to just before ')+expr(m[4])+':'}
  if(m=body.match(/^for\s*\((?:const|let|var)\s+(\w+)\s+(?:of|in)\s+(.*)\)\s*\{?$/)||body.match(/^for\s*\((?:final\s+)?[\w<>\[\]]+\s+(\w+)\s*:\s*(.*)\)\s*\{?$/))return'For each '+m[1]+' in '+expr(m[2],1)+':';
  if(h=head(body,'while'))return inl(h,'Keep going as long as ');if(m=body.match(/^while\s+(.*?):$/))return'Keep going as long as '+expr(m[1])+':';
  if(m=body.match(/^try\s*[:{]?$/))return'Try this, and if it fails, do the "catch" part:';
  if(m=body.match(/^\}?\s*(?:catch|except)\s*\(?\s*(.*?)\)?\s*[:{]?$/))return'If that failed'+(m[1]?' ('+m[1].replace(/^(?:const|final)\s+/,'')+')':'')+', do this instead:';
  if(/^\}?\s*finally\s*[:{]?$/.test(body))return'Whatever happened, do this at the end:';
  if(m=body.match(/^(?:throw|raise)\s+(?:new\s+)?(.*)$/))return'Signal an error: '+expr(m[1]);
  if(m=body.match(/^return\s*(.*)$/)){if(!m[1])return'Stop and give back nothing.';const e=expr(m[1]);return/\b(is (equal|not equal|at least|at most|greater|less)|divides evenly|does not divide|is found in)\b|\band\b.*\bis\b/.test(e)?'Give back true when '+e+', otherwise false.':'Give back '+e+'.'}
  if(/^break$/.test(body))return'Stop the loop.';if(/^continue$/.test(body))return'Skip to the next round of the loop.';if(/^pass$/.test(body))return'Do nothing (a placeholder).';
  if(m=body.match(/^(?:print|console\.log|System\.out\.println?|puts|echo|println!?|fmt\.Println|fmt\.Printf?|cout\s*<<)\s*\(?(.*?)\)?(?:\s*<<\s*(?:std::)?endl)?$/))return'Show '+showMany(m[1])+' on the screen.';
  if(m=body.match(/^printf\s*\((.*)\)$/))return'Print formatted text: '+m[1]+'.';
  if(m=body.match(/^(?:const|let|var|final)?\s*(?:int|long|double|float|char|bool|boolean|String|string|auto|var)?\s*(\w+)\s*(?:=|:=)\s*(?:await\s+)?\[\s*\]$/)||body.match(/^(\w+)\s*=\s*\[\s*\]$/))return'Make an empty list called '+m[1]+'.';
  if(m=body.match(/^\[(.+)\s+for\s+(\w+)\s+in\s+(.+?)(?:\s+if\s+(.+))?\]$/))return'Make a new list: for every '+m[2]+' in '+expr(m[3],1)+(m[4]?' where '+expr(m[4]):'')+', take '+expr(m[1])+'.';
  if(m=body.match(/^(?:const|let|var)(?:\s+mut)?\s+(\w+)\s*(?::\s*\w+\s*)?=\s*(?:await\s+)?(.*)$/)||body.match(/^(?:final\s+)?(?:int|long|double|float|char|bool|boolean|String|string|auto|var|List<\w+>|\w+\[\])\s+(\w+)\s*=\s*(.*)$/)||body.match(/^(\w+)\s*:?=\s*(.*)$/)){const v=m[2];
    if(/^\[.*\]$|^\{.*\}$/.test(v)&&!/=>/.test(v))return'Store '+(v[0]==='['?'the list ':'the group ')+v+' in a variable called '+m[1]+'.';
    if(/^\[(.+)\s+for\s+(\w+)\s+in\s+(.+?)(?:\s+if\s+(.+))?\]$/.test(v)){const c=v.match(/^\[(.+)\s+for\s+(\w+)\s+in\s+(.+?)(?:\s+if\s+(.+))?\]$/);return'Make a new list called '+m[1]+': for every '+c[2]+' in '+expr(c[3],1)+(c[4]?' where '+expr(c[4]):'')+', take '+expr(c[1])+'.'}
    if(/^new\s+(\w+)/.test(v))return'Create a new '+v.match(/^new\s+(\w+)/)[1]+' and store it in '+m[1]+'.';
    return'Set '+m[1]+' to '+show(v)+'.'}
  if(m=body.match(/^(\w+(?:\.\w+|\[.*?\])*)\s*(\+|-|\*|\/|%)=\s*(.*)$/)){const w={'+':'Add '+expr(m[3])+' to ','-':'Subtract '+expr(m[3])+' from ','*':'Multiply ','/':'Divide ','%':'Take the remainder of '}[m[2]];return m[2]==='*'?'Multiply '+m[1]+' by '+expr(m[3])+'.':m[2]==='/'?'Divide '+m[1]+' by '+expr(m[3])+'.':m[2]==='%'?'Set '+m[1]+' to its remainder after dividing by '+expr(m[3])+'.':w+m[1]+'.'}
  if(m=body.match(/^(\w+)\s*(\+\+|--)$/))return(m[2]==='++'?'Add one to ':'Subtract one from ')+m[1]+'.';
  if(m=body.match(/^(\w+(?:\.\w+)*)\s*=\s*(.*)$/))return'Set '+m[1]+' to '+show(m[2])+'.';
  if(m=body.match(/^(\w+)\.(?:push|append)\((.*)\)$/))return'Add '+expr(m[2])+' to the end of '+m[1]+'.';
  if(m=body.match(/^(?:await\s+)?([\w.]+)\((.*)\)$/))return'Call '+m[1]+(m[2]?' with '+showMany(m[2]):'')+'.';
  return null}
function explainCode(t,lang){const rows=[];let skipped=0;
  for(const l of t.split('\n')){if(!l.trim())continue;const parts=lang==='Python'||/^\s*(#|\/\/|\/\*|\*)/.test(l)?[l]:splitStmts(l.replace(/\s+\/\/.*$/,''));
    for(const seg of parts){const e=codeLine(seg,lang);if(e==null){if(/^[\s{}();,\])]*$/.test(seg)||/^\s*(end|fi|done|esac)\s*$/.test(seg))continue;rows.push([seg.trim(),'(not understood)']);skipped++}else rows.push([seg.trim(),e])}}
  return{rows,skipped}}
// ---- SQL
function sql(t){const rows=[];const s=t.replace(/\s+/g,' ').replace(/;\s*$/,'').trim();let m;
  const clause=(re,f)=>{const x=s.match(re);return x?f(x):null};
  if(/^SELECT/i.test(s)){const sel=clause(/^SELECT\s+(DISTINCT\s+)?(.*?)\s+FROM\s/i,x=>x),from=clause(/\bFROM\s+(\w+(?:\s+(?:AS\s+)?(?!WHERE|GROUP|ORDER|LIMIT|JOIN|INNER|LEFT|RIGHT|HAVING|ON\b)\w+)?)/i,x=>x[1]),where=clause(/\bWHERE\s+(.*?)(?=\s+(?:GROUP BY|HAVING|ORDER BY|LIMIT)\b|$)/i,x=>x[1]),grp=clause(/\bGROUP BY\s+(.*?)(?=\s+(?:HAVING|ORDER BY|LIMIT)\b|$)/i,x=>x[1]),hav=clause(/\bHAVING\s+(.*?)(?=\s+(?:ORDER BY|LIMIT)\b|$)/i,x=>x[1]),ord=clause(/\bORDER BY\s+(.*?)(?=\s+LIMIT\b|$)/i,x=>x[1]),lim=clause(/\bLIMIT\s+(\d+)/i,x=>x[1]),join=[...s.matchAll(/\b(?:INNER |LEFT |RIGHT )?JOIN\s+(\w+)\s+ON\s+(.*?)(?=\s+(?:WHERE|GROUP BY|ORDER BY|LIMIT|JOIN|INNER|LEFT|RIGHT)\b|$)/gi)];
    const cols=sel?sel[2]:'*';const col=c=>c.replace(/COUNT\(\*\)/ig,'the number of rows').replace(/\b(SUM|AVG|MIN|MAX|COUNT)\((\w+)\)/gi,(a,f,c)=>({SUM:'the total of ',AVG:'the average of ',MIN:'the smallest ',MAX:'the largest ',COUNT:'the count of '}[f.toUpperCase()])+c);
    rows.push([(sel?sel[0].replace(/\s+FROM\s$/i,''):'SELECT')+(from?' FROM '+from:''),'Get '+(sel&&sel[1]?'the different values of ':'')+(cols==='*'?'every column':col(cols).replace(/\s+AS\s+(\w+)/gi,' (called $1)'))+(from?' from the table '+from+'.':'.')]);
    join.forEach(j=>rows.push(['JOIN '+j[1]+' ON '+j[2],'Also match each row with the rows of '+j[1]+' where '+expr(j[2].replace(/=/g,' == '))+'.']));
    if(where)rows.push(['WHERE '+where,'Keep only the rows where '+expr(where.replace(/(?<![<>!=])=(?!=)/g,' == ').replace(/\bAND\b/gi,'&&').replace(/\bOR\b/gi,'||').replace(/<>/g,'!=')).replace(/\bLIKE\b/gi,'matches')+'.']);
    if(grp)rows.push(['GROUP BY '+grp,'Bunch the rows that share the same '+grp+'.']);if(hav)rows.push(['HAVING '+hav,'Keep only the bunches where '+expr(hav.replace(/>=/g,'>=').replace(/\bAND\b/gi,'&&'))+'.']);
    if(ord)rows.push(['ORDER BY '+ord,'Sort the result by '+ord.replace(/\s+DESC/i,' (largest first)').replace(/\s+ASC/i,' (smallest first)')+'.']);if(lim)rows.push(['LIMIT '+lim,'Keep only the first '+lim+' rows.']);return rows}
  if(m=s.match(/^INSERT INTO\s+(\w+)\s*(?:\((.*?)\))?\s*VALUES\s*\((.*)\)/i))return[[s,'Add a new row to '+m[1]+(m[2]?', filling '+m[2]:'')+' with the values '+m[3]+'.']];
  if(m=s.match(/^UPDATE\s+(\w+)\s+SET\s+(.*?)(?:\s+WHERE\s+(.*))?$/i))return[[s,'Change '+m[2]+' in the table '+m[1]+(m[3]?', only for the rows where '+expr(m[3].replace(/=/g,' == '))+'.':', for every row.')]];
  if(m=s.match(/^DELETE FROM\s+(\w+)(?:\s+WHERE\s+(.*))?$/i))return[[s,'Delete rows from '+m[1]+(m[2]?' where '+expr(m[2].replace(/=/g,' == '))+'.':' (all of them!).')]];
  if(m=s.match(/^CREATE TABLE\s+(?:IF NOT EXISTS\s+)?(\w+)\s*\((.*)\)$/i))return[[s,'Make a new table called '+m[1]+' with the columns: '+m[2].split(/,(?![^(]*\))/).map(c=>c.trim().replace(/\s+/,' (')+(c.trim().includes(' ')?')':'')).join(', ')+'.']];
  if(m=s.match(/^DROP TABLE\s+(?:IF EXISTS\s+)?(\w+)/i))return[[s,'Delete the whole table '+m[1]+' and its data.']];
  return[[s,'(not understood)']]}
// ---- CSS
const CSSP={padding:'inside spacing',margin:'outside spacing',color:'text color',background:'background','background-color':'background color','font-size':'text size','font-weight':'text boldness',width:'width',height:'height',display:'layout mode','border-radius':'corner roundness',border:'border','text-align':'text alignment',gap:'gap between items','max-width':'maximum width',position:'positioning',opacity:'see-through level','flex-direction':'direction of the flex layout','justify-content':'sideways alignment','align-items':'cross alignment'};
function css(t){const rows=[];for(const m of t.matchAll(/([^{}]+)\{([^{}]*)\}/g)){const sel=m[1].trim(),d=m[2].split(';').map(x=>x.trim()).filter(Boolean).map(x=>{const i=x.indexOf(':');return[x.slice(0,i).trim(),x.slice(i+1).trim()]});
  const who=sel.split(',').map(x=>x.trim()).map(x=>x.startsWith('.')?'every element with the class '+x.slice(1):x.startsWith('#')?'the element with the id '+x.slice(1):/^[a-z][\w]*$/i.test(x)?'every '+x+' element':'everything matching '+x.replace(/:hover/,' while the pointer is over it')).join(' and ');
  rows.push([sel+' { … }','For '+who+', set '+d.map(([p,v])=>(CSSP[p]||p)+' to '+v).join(', ')+'.'])}return rows}
// ---- HTML
const TAGS={a:'a link',img:'a picture',p:'a paragraph',div:'a block (a box)',span:'an inline piece of text',ul:'a bullet list',ol:'a numbered list',li:'a list item',button:'a button',input:'an input box',form:'a form',table:'a table',tr:'a table row',td:'a table cell',th:'a table heading',h1:'the main heading',h2:'a heading',h3:'a smaller heading',nav:'a navigation area',header:'a header area',footer:'a footer area',section:'a section',script:'a script (program code)',style:'a block of style rules',br:'a line break',strong:'bold text',em:'emphasized text',label:'a label',select:'a drop-down list',textarea:'a multi-line text box',body:'the visible page',html:'the whole page',head:'the page information area',title:'the page title'};
function html(t){const rows=[];for(const l of t.split('\n')){const s=l.trim();if(!s)continue;const m=s.match(/^<(\w+)([^>]*)>(.*?)(?:<\/\1>)?$/);if(/^<\/|^<!--/.test(s)){continue}if(/^<!doctype/i.test(s)){rows.push([s,'Says this page is written in modern HTML.']);continue}
  if(!m){rows.push([s,'(not understood)']);continue}const [,tag,attrs,inner]=m,at=[...attrs.matchAll(/(\w[\w-]*)\s*=\s*"([^"]*)"/g)].map(a=>a[1]+' "'+a[2]+'"');const t2=tag.toLowerCase();
  rows.push([s,'Makes '+(TAGS[t2]||'a '+t2+' element')+(inner&&!/</.test(inner)?' showing "'+inner+'"':'')+(at.length?', with '+at.join(', ')+'':'')+'.'])}return rows}
// ---- JSON
function jsonE(t){const v=JSON.parse(t);const d=(x,k)=>Array.isArray(x)?'a list of '+x.length+' item'+(x.length===1?'':'s')+(x.length&&typeof x[0]!=='object'?': '+x.slice(0,5).map(a=>JSON.stringify(a)).join(', ')+(x.length>5?', …':''):''):x&&typeof x==='object'?'a thing with '+Object.keys(x).length+' named part'+(Object.keys(x).length===1?'':'s'):x===null?'nothing':typeof x==='string'?'the text "'+x+'"':typeof x==='number'?'the number '+x:x?'true':'false';
  const rows=[[Array.isArray(v)?'[ … ]':'{ … }','This is '+d(v)+'.']];if(v&&typeof v==='object')Object.entries(v).slice(0,25).forEach(([k,x])=>rows.push([JSON.stringify(k)+': …','"'+k+'" is '+d(x)+'.']));return rows}
// ---- regular expressions
function regex(t){const s=t.trim().replace(/^\/(.*)\/[gimsuy]*$/,'$1'),rows=[];let i=0;
  const q=()=>{const m=s.slice(i).match(/^(?:\{(\d+)(,(\d*))?\}|\*|\+|\?)/);if(!m)return'';i+=m[0].length;const x=m[0];return x==='*'?'zero or more of ':x==='+'?'one or more of ':x==='?'?'optionally ':m[2]!==undefined?(m[3]?'between '+m[1]+' and '+m[3]+' of ':'at least '+m[1]+' of '):'exactly '+m[1]+' of '};
  const cls={d:'a digit',w:'a letter, digit or underscore',s:'a space',D:'anything but a digit',W:'anything but a letter, digit or underscore',S:'anything but a space',b:'a word boundary',n:'a new line',t:'a tab'};
  while(i<s.length){const a=i,c=s[i];let d;
    if(c==='^'){i++;d='the text must start here'}else if(c==='$'){i++;d='the text must end here'}
    else if(c==='\\'){const k=s[i+1];i+=2;d=cls[k]||'the character "'+k+'"'}
    else if(c==='['){const j=s.indexOf(']',i+1);if(j<0){i=s.length;d='an unfinished set'}else{const body=s.slice(i+1,j);i=j+1;const neg=body[0]==='^';d=(neg?'any character except ':'any one of ')+body.slice(neg?1:0).replace(/(\w)-(\w)/g,'$1 to $2').replace(/\\d/g,'digits').replace(/\\w/g,'letters, digits or underscore')}}
    else if(c==='('){const m=s.slice(i).match(/^\((\?:|\?<\w+>)?/);i+=m[0].length;d=m[0]==='('?'start a group (captured)':'start a group'}else if(c===')'){i++;d='end the group'}else if(c==='|'){i++;d='or'}else if(c==='.'){i++;d='any character'}
    else{i++;d='the character "'+c+'"'}
    const quant=/^(?:\{\d|\*|\+|\?)/.test(s.slice(i))&&!/start a group|end the group|^or$|must (start|end)/.test(d)?q():'';
    rows.push([s.slice(a,i),quant+d])}
  return rows}
// ---- shell
const SH={ls:'list the files',cd:'move to the folder',rm:'delete',cp:'copy',mv:'move or rename',mkdir:'make a folder',cat:'show the contents of',echo:'print',grep:'search for text in',git:'use Git (version control) to',npm:'use npm (JavaScript packages) to',pip:'use pip (Python packages) to',sudo:'as an administrator, run',chmod:'change permissions of',curl:'download from',python:'run the Python program',python3:'run the Python program',node:'run the JavaScript program',find:'search for files in',touch:'create an empty file or update the time of',pwd:'show the current folder'};
function shell(t){return t.split('\n').filter(l=>l.trim()&&!/^\s*#/.test(l)).map(l=>{const w=l.trim().split(/\s+/),c=w[0],opts=w.filter(x=>/^-/.test(x)),rest=w.slice(1).filter(x=>!/^-/.test(x));let e=SH[c]?SH[c][0].toUpperCase()+SH[c].slice(1)+(rest.length?' '+rest.join(' '):''):'Run the program '+c+(rest.length?' on '+rest.join(' '):'');
  if(c==='ls'&&opts.some(o=>/l/.test(o)))e='List the files in the long format'+(opts.some(o=>/a/.test(o))?', including hidden ones':'')+(rest.length?' in '+rest.join(' '):'')+'.';
  else if(c==='rm'&&opts.some(o=>/r/.test(o)))e='Delete '+rest.join(' ')+' and everything inside it'+(opts.some(o=>/f/.test(o))?', without asking':'')+'. This cannot be undone.';
  else if(c==='cd'&&rest[0]==='..')e='Go up one folder.';else if(c==='git'&&rest[0])e='Use Git: '+({commit:'save a snapshot of your changes',add:'prepare files for the next snapshot',push:'send your snapshots to the remote copy',pull:'bring in changes from the remote copy',clone:'copy a repository',status:'show what has changed',log:'show the history',checkout:'switch branch',branch:'list or make branches',merge:'combine branches',diff:'show the exact changes'}[rest[0]]||rest.join(' '))+'.';
  else if(opts.length)e+=' (options: '+opts.join(' ')+')';return[l.trim(),e.replace(/\.?$/,'.')]})}
// ---- main
const leadRe=/^\s*(?:please\s+)?(?:can you\s+|could you\s+)?(?:explain|translate|describe|decode|read|what\s+(?:does|do)|tell me what)\s+(?:(?:this|these|the|following|below|my|that|me)\s+)*((?:\w+\s+)?(?:code|snippet|program|function|script|query|regex|regular expression|command|line|lines)\s*)?(?:(?:does|do|mean|means|say|says)\s*)?(:?)\s*/i;
function looksLikeCode(s){const lines=s.split('\n').filter(l=>l.trim());const sym=(s.match(/[{}();=<>\[\]\\$^|*]/g)||[]).length/Math.max(1,s.length);return(lines.length>=2&&sym>.04)||(lines.length===1&&sym>.06&&/\b(function|def|const|let|var|SELECT|FROM|print|console|return|import|for|if|while)\b|=>/i.test(s))}
function match(q){let body=q,asked=false,explicit=false;const m=q.match(leadRe);
  if(m&&q.slice(m[0].length).trim()){body=q.slice(m[0].length);asked=true;explicit=!!(m[1]||m[2])||/\n/.test(m[0])}
  else if(/^\s*```/.test(q)){asked=explicit=true}
  body=body.replace(/^\s*```\w*\n?|\n?```\s*$/g,'').replace(/\s+$/,'');if(asked)body=body.replace(/\s+(?:mean|means|do|does|say|says)\??$/i,'').replace(/\?$/,'');if(!body.trim())return null;
  const lang=detect(body,asked,explicit);
  if(lang){if(!asked){const strong=['SQL','HTML','JSON','CSS','Java','C','C++','Regex','Go','Rust'].includes(lang)||looksLikeCode(body);if(!strong)return null}return{lang,body}}
  return explicit&&looksLikeCode(body)?{lang:null,body}:null}
function explain(q){const m=match(q);if(!m)return null;if(!m.lang)return{lang:null,rows:[],note:'I could not tell which language this is. Add the language name (for example "explain this Python code: …") and I will try again.'};
  const{lang,body}=m;let rows,skipped=0,note='';
  try{if(lang==='SQL')rows=sql(body);else if(lang==='CSS')rows=css(body);else if(lang==='HTML')rows=html(body);else if(lang==='JSON')rows=jsonE(body);else if(lang==='Regex')rows=regex(body);else if(lang==='Shell')rows=shell(body);else{const r=explainCode(body,lang);rows=r.rows;skipped=r.skipped}}catch(e){rows=[];if(typeof process!=="undefined"&&process.env.EXPLAIN_DEBUG)console.error(e)}
  skipped=rows.filter(r=>r[1]==='(not understood)').length;
  if(!rows.length)return{lang,rows,note:'I recognised '+lang+' but could not read it with my rules.'};
  note=skipped?skipped+' of '+rows.length+' lines used something my rules do not cover, so those are marked. Read them with the symbol and keyword tables in the Library ("what does && mean").':'';
  return{lang,rows,note,summary:summarise(rows,lang)}}
function summarise(rows,lang){const t=rows.map(r=>r[1]).join(' ');const fn=(t.match(/Define a function called (\w+)/)||[])[1];if(lang==='SQL'&&/^Get/.test(rows[0][1]))return'In short: it asks the database a question and shows the matching rows.';if(lang==='CSS')return'In short: it changes how some elements look.';if(lang==='HTML')return'In short: it describes the structure of a web page.';if(lang==='JSON')return'In short: it is stored data, not steps to run.';if(lang==='Regex')return'In short: it is a pattern that text is matched against.';
  if(lang==='Shell')return'In short: it is a command you type into a terminal.';if(lang==='SQL')return/^Get/.test(rows[0][1])?'In short: it asks the database a question and shows the matching rows.':'In short: it changes data or tables in a database.';
  return'In short: '+(fn?'it defines a function called '+fn+(/Give back/.test(t)?' that works out and gives back a result':'')+'.':/For each|Repeat|Keep going/.test(t)?'it repeats some steps (a loop).':/Only when/.test(t)?'it makes a decision with an if.':'it runs the steps above from top to bottom.')}
G.Explain={explain,match};if(typeof module!=='undefined')module.exports=G.Explain;
})(typeof window!=='undefined'?window:globalThis);
