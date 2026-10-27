// node tools/create_test.js : checks that Create understands descriptions (Phase 1)
const {parse}=require('../app/src/main/assets/create.js');
const T=[
 ['make me a blue to-do app called Chores with milk, eggs and bread',{route:'app',kind:'todo',title:'Chores',color:'blue',items:['milk','eggs','bread']}],
 ['a shopping list',{kind:'todo'}],['packing checklist: passport, charger, socks',{kind:'todo',items:['passport','charger','socks']}],
 ['a 10 minute countdown timer',{kind:'timer',seconds:600}],['30 second timer',{kind:'timer',seconds:30}],
 ['pomodoro timer',{kind:'pomo'}],['a stopwatch with laps',{kind:'stopwatch'}],
 ['write a python function that reverses a string',{route:'code',lang:'python'}],
 ['how do I write a loop in javascript',{route:'code',lang:'javascript'}],
 ['write a regex for emails',{route:'code',lang:'regex'}],['sql query to count users by country',{route:'code',lang:'sql'}],
 ['a tip calculator',{kind:'calc'}],['bmi calculator',{kind:'calc'}],['convert km to miles',{kind:'calc'}],['loan payment calculator',{kind:'calc'}],
 ['flashcards: hola - hello; adios - goodbye',{kind:'flash',items:['hola - hello','adios - goodbye']}],['a spanish quiz app',{kind:'flash'}],
 ['write a cover letter to Sam about the barista job',{route:'doc',kind:'letter',to:'Sam',topic:'barista job'}],
 ['draft an email to my boss about a day off',{route:'doc',kind:'email'}],['write a meeting agenda',{route:'doc',kind:'agenda'}],
 ['make a weekly study schedule',{route:'doc',kind:'schedule'}],['create a workout plan',{route:'doc',kind:'workout'}],['write a speech for my sister wedding',{route:'doc',kind:'speech'}],
 ['random name picker with Ann, Bob, Cy',{kind:'picker',items:['Ann','Bob','Cy']}],['a dice roller',{kind:'picker'}],['flip a coin',{kind:'picker'}],
 ['a website for my bakery',{kind:'site'}],['a landing page called Sunrise Yoga',{kind:'site',title:'Sunrise Yoga'}],
 ['track my water habit',{kind:'counter'}],['a tally counter',{kind:'counter'}],
 ['a password generator',{kind:'password'}],['an expense tracker',{kind:'expense'}],['a budget app',{kind:'expense'}],
 ['a notes app',{kind:'notes'}],['a journal',{kind:'notes'}],['word counter for my essay',{kind:'text'}],['number guessing game',{kind:'guess'}],
 ['a red timer',{kind:'timer',color:'red'}],
 ['something that tells jokes',{route:'unknown'}],['',{route:'unknown'}]
];
let bad=0;for(const[q,e]of T){const r=parse(q);for(const k in e){const ok=Array.isArray(e[k])?JSON.stringify(r[k])===JSON.stringify(e[k]):r[k]===e[k];if(!ok){bad++;console.log('FAIL',JSON.stringify(q),k,'expected',JSON.stringify(e[k]),'got',JSON.stringify(r[k]))}}}
console.log(T.length+' descriptions checked, '+bad+' problems');process.exit(bad?1:0);
