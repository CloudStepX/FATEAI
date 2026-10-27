// node tools/gen_func_apps.js then python3 tools/template_func_test.py
require('fs').mkdirSync('/tmp/apps',{recursive:true});const fs=require('fs'),C=require('../app/src/main/assets/create.js'),B=require('../app/src/main/assets/build.js');
const mk=(q,f)=>{let sp=B.specOf(C.parse(q));if(f)sp=f(sp);return B.make(sp).content};
fs.writeFileSync('/tmp/apps/t_tip.html',mk('a tip calculator'));
fs.writeFileSync('/tmp/apps/t_loan.html',mk('loan payment calculator'));
fs.writeFileSync('/tmp/apps/t_bmi.html',mk('bmi calculator'));
fs.writeFileSync('/tmp/apps/t_basic.html',mk('a calculator'));
fs.writeFileSync('/tmp/apps/t_conv.html',mk('convert celsius to fahrenheit'));
fs.writeFileSync('/tmp/apps/t_todo.html',mk('a blue to-do list with milk, eggs and bread',s=>({...s,reset:true})));
fs.writeFileSync('/tmp/apps/t_flash.html',mk('flashcards: hola - hello; adios - goodbye'));
fs.writeFileSync('/tmp/apps/t_timer.html',mk('a 2 second timer'));
fs.writeFileSync('/tmp/apps/t_xss.html',mk('a to-do list called </title><script>window.PWN=1</script> with <img src=x onerror=window.PWN=1>, a-->b, "q" and </script>',s=>s));
fs.writeFileSync('/tmp/apps/t_count.html',mk('a tally counter',s=>({...s,reset:true})));
