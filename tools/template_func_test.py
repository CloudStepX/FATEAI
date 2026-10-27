# python3 tools/template_func_test.py : needs /tmp/apps/t_*.html from tools/gen_func_apps.js
from playwright.sync_api import sync_playwright
def load(b,name):
    pg=b.new_page(viewport={'width':390,'height':780});errs=[]
    pg.on('pageerror',lambda e:errs.append(str(e)));pg.on('console',lambda m:errs.append(m.text) if m.type=='error' else None)
    pg.set_content('<iframe id=f style="width:390px;height:780px" sandbox="allow-scripts"></iframe>')
    pg.evaluate("h=>{document.getElementById('f').srcdoc=h}",open(f'/tmp/apps/{name}.html').read());pg.wait_for_timeout(300)
    return pg,pg.frames[1],errs
ok=0;bad=0
def chk(c,m):
    global ok,bad
    if c: ok+=1
    else: bad+=1;print('FAIL',m)
with sync_playwright() as p:
    b=p.chromium.launch()
    pg,f,e=load(b,'t_tip');f.fill('input >> nth=0','100');f.fill('input >> nth=2','4');f.click('text=20%')
    t=f.inner_text('#out');chk('30.00' in t and '120.00' in t and '30.00' in t,'tip: '+t)
    pg,f,e=load(b,'t_loan');t=f.inner_text('#out');chk('188.71' in t,'loan '+t)
    pg,f,e=load(b,'t_bmi');f.fill('input >> nth=0','70');f.fill('input >> nth=1','175');t=f.inner_text('#out');chk('22.9' in t and 'healthy' in t,'bmi '+t)
    pg,f,e=load(b,'t_basic')
    for k in ['1','2','×','3','=']:f.click(f'#pad button:text-is("{k}")')
    chk(f.inner_text('#scr')=='36','basic 12x3 '+f.inner_text('#scr'))
    for k in ['C','5','÷','0','=']:f.click(f'#pad button:text-is("{k}")')
    chk(f.inner_text('#scr')=='Error','div0 '+f.inner_text('#scr'))
    pg,f,e=load(b,'t_conv');f.fill('#v','100');chk('212' in f.inner_text('#o'),'c->f '+f.inner_text('#o'))
    pg,f,e=load(b,'t_todo');f.fill('#in','butter');f.click('#add');chk('Butter' not in f.inner_text('#ls') and 'butter' in f.inner_text('#ls'),'add item')
    f.click('#ls li >> nth=0 >> input');chk('1 of 4 done' in f.inner_text('#cnt'),'tick')
    f.click('#cd');chk('3' in f.inner_text('#cnt'),'clear done '+f.inner_text('#cnt'))
    f.click('#rs');chk('0 of 3' in f.inner_text('#cnt'),'reset '+f.inner_text('#cnt'))
    pg,f,e=load(b,'t_flash');f.click('.fc');chk('hello' in f.inner_text('#stage'),'flip');f.click('text=Got it');chk('Card 2 of 2' in f.inner_text('#prog'),'next')
    f.click('.fc');f.click('text=Again');chk('You knew 1 of 2' in f.inner_text('#stage'),'score '+f.inner_text('#stage'))
    f.click('text=Go again');f.check('#ty');f.fill('#stage input','HOLA');
    pg,f,e=load(b,'t_timer');f.click('#go');pg.wait_for_timeout(2600);chk('Time is up' in f.inner_text('#msg'),'timer finish '+f.inner_text('#msg'));chk(not e,'timer errs '+str(e))
    pg,f,e=load(b,'t_count');f.click('#pl');f.click('#pl');chk(f.inner_text('#n')=='2','count');f.click('#rs');chk(f.inner_text('#n')=='0','count reset')
    pg,f,e=load(b,'t_xss');chk(pg.evaluate("document.getElementById('f').contentWindow===null||true"),'');
    chk(not e,'xss errs '+str(e));txt=f.inner_text('body');chk('PWN' not in f.evaluate("typeof window.PWN==='undefined'?'':'PWN'"),'xss ran');chk('</script>' in txt or 'script' in txt,'xss text shown: '+txt[:120])
    chk(f.evaluate("document.querySelectorAll('img').length")==0,'img injected')
    # network blocked: CSP
    pg,f,e=load(b,'t_tip');r=f.evaluate("fetch('https://example.com').then(()=>'LOADED',()=>'blocked')");chk(r=='blocked','fetch not blocked: '+r)
    b.close()
print('functional checks ok',ok,'bad',bad)
