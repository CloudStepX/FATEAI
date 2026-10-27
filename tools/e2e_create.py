# python3 tools/e2e_create.py : drives the real app (index.html) in headless Chromium.
# Checks Ask, Feed and Tree still work, and the whole Create flow: build, preview, follow-ups, undo, save, learn.
import subprocess,time,sys,os,json
from playwright.sync_api import sync_playwright
ROOT=os.path.join(os.path.dirname(os.path.abspath(__file__)),'..','app','src','main','assets')
srv=subprocess.Popen([sys.executable,'-m','http.server','8765','--directory',ROOT],stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL);time.sleep(1)
ok=bad=0
def chk(c,m):
    global ok,bad
    if c: ok+=1
    else: bad+=1;print('FAIL',m)
try:
  with sync_playwright() as p:
    b=p.chromium.launch();ctx=b.new_context(viewport={'width':390,'height':800},accept_downloads=True);pg=ctx.new_page();errs=[]
    pg.on('pageerror',lambda e:errs.append(str(e)))
    reqs=[];pg.on('request',lambda r:reqs.append(r.url) if not r.url.startswith(('http://localhost:8765','data:','blob:','about:')) else None)
    pg.goto('http://localhost:8765/index.html');pg.wait_for_timeout(1500)
    # existing tabs
    pg.click('#task');pg.fill('#q','what is a closure');pg.click('#go');pg.wait_for_timeout(500)
    chk('closure' in pg.inner_text('#msgs').lower(),'ask works')
    for q,p in [('12*7+3','= 87'),('what is 15% of 80','= 12'),('5 miles to km','8.04672'),('who are you','Fate Tree'),('what can you do','Calculate'),('what time is it','device'),('what is machin lerning','I read')]:
        pg.fill('#q',q);pg.click('#go');pg.wait_for_timeout(400);chk(p in pg.inner_text('#msgs'),'skills: '+q)
    pg.click('#tfeed');pg.fill('#fc','Pets');pg.fill('#ft','My cat is called Mimi. She likes tuna and sleeping on the sofa.');pg.click('#feed');chk('Fed' in pg.inner_text('#fs'),'feed works')
    pg.click('#ttree');chk('Pets' in pg.inner_text('#tr'),'tree shows fed section')
    stat0=pg.inner_text('#stat')
    # create flow
    pg.click('#tcreate')
    def say(t):
        pg.fill('#cq',t);pg.click('#cgo');pg.wait_for_timeout(700)
    def frame():
        fs=[f for f in pg.frames if f!=pg.main_frame];return fs[-1] if fs else None
    say('a blue to-do list called Chores with milk, eggs and bread')
    f=frame();chk(f is not None,'preview iframe present');chk('Milk' in f.inner_text('body'),'todo preview shows items')
    chk(pg.evaluate("document.querySelector('iframe.pv').getAttribute('sandbox')")=='allow-scripts','sandbox attr is allow-scripts only')
    acc0=f.evaluate("getComputedStyle(document.querySelector('button.p')).backgroundColor")
    say('make it red');f=frame();acc1=f.evaluate("getComputedStyle(document.querySelector('button.p')).backgroundColor")
    chk(acc0!=acc1 and acc1=='rgb(255, 92, 92)','make it red changes accent '+acc0+' -> '+acc1)
    chk(f.query_selector('#rs') is None,'no reset yet');say('add a reset button');f=frame();chk(f.query_selector('#rs') is not None,'reset button added')
    say('rename it Weekend jobs');f=frame();chk('Weekend jobs' in f.inner_text('h1'),'renamed')
    say('add butter and jam');f=frame();chk('Butter' in f.inner_text('#ls') and 'Jam' in f.inner_text('#ls'),'items added')
    bg_before=f.evaluate("getComputedStyle(document.body).backgroundColor")
    say('dark mode');f=frame();chk(f.evaluate("getComputedStyle(document.body).backgroundColor")!=bg_before or bg_before=='rgb(14, 16, 20)','dark mode changes bg')
    say('undo');f=frame();chk('Jam' in f.inner_text('#ls'),'undo only reverted the last change')
    chk(f.evaluate("getComputedStyle(document.body).backgroundColor")==bg_before,'undo restored the page as it was before dark mode')
    chk(pg.evaluate("document.querySelectorAll('iframe.pv').length")==1,'only one live preview')
    # Phase 8: sections commit to the four parts, and the mind view draws the 4D library
    pg.wait_for_timeout(2200)
    cmt=pg.inner_text('#cmsgs')
    chk('committed to' in cmt and all(k in cmt for k in ('Shape','Logic','Look','Words')),'commit block lists the four parts')
    chk(pg.evaluate("document.querySelectorAll('#cmsgs .cr').length")>=4,'four commit rows present')
    pg.click('#tmind');pg.wait_for_timeout(600)
    chk('8×8×8×8' in pg.inner_text('#mi') and 'Last build: address' in pg.inner_text('#mi'),'mind shows the 4D grid and the last build address')
    chk(pg.evaluate("(()=>{const c=document.getElementById('mc'),x=c.getContext('2d').getImageData(0,0,c.width,c.height).data;let n=0;for(let i=3;i<x.length;i+=4*50)if(x[i]>0)n++;return n>200})()"),'mind canvas has drawn pixels')
    pg.click('#ml >> text=Coding');chk('Coding:' in pg.inner_text('#mi') and 'corners' in pg.inner_text('#mi'),'tapping a section explains its 4D footprint')
    pg.click('#tcreate')
    # network: the app never asked for anything off-device
    chk(not reqs,'no external requests: '+str(reqs[:3]))
    # copy / save file
    with pg.expect_download() as d: pg.click('#pcreate button:text-is("Save file") >> nth=-1')
    dl=d.value;txt=open(dl.path()).read();chk(dl.suggested_filename.endswith('.html') and txt.startswith('<!doctype html>'),'save file downloads html '+dl.suggested_filename)
    # keep + learn
    pg.click('#pcreate button:text-is("Save to library") >> nth=-1');pg.wait_for_timeout(500)
    chk('Created' in pg.evaluate("Object.keys(lib.data.Library).join('|')"),'saved under Created')
    chk(pg.inner_text('#stat')!=stat0,'header counts updated after save')
    say('a to-do list');f=frame()
    chk('saved version' in pg.inner_text('#cmsgs'),'next to-do starts from saved version')
    chk(f.evaluate("getComputedStyle(document.querySelector('button.p')).backgroundColor")=='rgb(255, 92, 92)' and f.query_selector('#rs') is not None,'inherited colour and reset button')
    chk('Chores' not in f.inner_text('h1') and 'Weekend' not in f.inner_text('h1'),'did not inherit title')
    # other kinds + doc
    for t,needle in [('a 10 minute countdown timer','10:00'),('a tip calculator','Tip %'),('convert km to miles','miles'),('flashcards: hola - hello; adios - goodbye','hola')]:
        say(t);f=frame();chk(needle in f.inner_text('body'),'builds: '+t)
    say('random name picker with Ann, Bob, Cy');f=frame();chk('Ann' in f.evaluate("document.getElementById('nm').value"),'builds: picker with names')
    say('a 10 minute countdown timer');say('make it 5 minutes');f=frame();chk('05:00' in f.inner_text('#t'),'timer follow-up: make it 5 minutes -> '+f.inner_text('#t'))
    say('make it 3 minutes');f=frame();chk('03:00' in f.inner_text('#t'),'timer follow-up again')
    say('write a cover letter to Sam about the barista job')
    ta=pg.evaluate("document.querySelector('textarea.pv').value");chk('Dear Sam' in ta and 'barista job' in ta,'doc built')
    say('address it to Alex');ta=pg.evaluate("document.querySelector('textarea.pv').value");chk('Dear Alex' in ta,'doc refine to')
    say('make it blue');chk('no colour' in pg.inner_text('#cmsgs')[-200:],'doc says no colour')
    say('write a python function that reverses a string');chk('From the library' in pg.inner_text('#cmsgs') or 'Nothing in the library' in pg.inner_text('#cmsgs'),'code route still uses library')
    say('a website for my bakery');f=frame();chk('Welcome to Bakery' in f.inner_text('body'),'one-page website builds')
    say('make it purple');say('add cakes and bread');f=frame();chk('Cakes' in f.inner_text('body') and 'Bread' in f.inner_text('body'),'site follow-up adds offers')
    say('something that tells jokes');chk('do not recognise' in pg.inner_text('#cmsgs'),'unknown says so')
    # Ask / Feed / Tree still fine after Create use, and Create did not leak into Ask memory
    pg.click('#task');pg.fill('#q','what is a closure');pg.click('#go');pg.wait_for_timeout(500);chk('closure' in pg.inner_text('#msgs').lower(),'ask still works')
    pg.click('#ttree');chk('Created' in pg.inner_text('#tr'),'tree lists Created section')
    pg.click('#tfeed');chk(pg.is_visible('#ft'),'feed visible')
    chk(not errs,'page errors: '+str(errs[:3]))
    b.close()
finally:
  srv.terminate()
print('e2e checks ok',ok,'bad',bad);sys.exit(1 if bad else 0)
