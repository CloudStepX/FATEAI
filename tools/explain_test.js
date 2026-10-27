const E=require('../app/src/main/assets/explain.js');
const cases=[
 ['for n in range(1, 11):\n    if n % 2 == 0:\n        print(n)'],
 ['function isAdult(age) { return age >= 18; }'],
 ['total = 0\nfor n in nums:\n    total += n'],
 ['[x * x for x in nums if x > 0]'],
 ['SELECT name FROM users WHERE age >= 18 ORDER BY name;'],
 ['.card { padding: 16px; color: red; }'],
 ['what does ^\\d{3}-\\d{4}$ mean'],
 ['explain ls -la'],['explain this command: rm -r folder'],['explain python decorators'],['explain git commit -m "x"'],
 ['explain this code:\nint add(int a, int b) { return a + b; }'],['explain this go code:\nfunc main() {\n  fmt.Println("hi")\n}'],
 ['INSERT INTO users (name, age) VALUES (\'Sam\', 30);'],
 ['try {\n  risky();\n} catch (e) {\n  console.log(e);\n}'],['if x > 3:\n    print("big")\nelif x > 1:\n    print("mid")\nelse:\n    print("small")'],
 ['<a href="x.html">Home</a>'],
 ['{"name": "Sam", "age": 30}'],
 ['def count_vowels(word):\n    count = 0\n    for ch in word.lower():\n        if ch in "aeiou":\n            count += 1\n    return count'],
 ['for (let i = 0; i < 5; i++) {\n  if (i % 2 === 0 && i !== 4) console.log(i);\n}'],
 ['public class Main {\n  public static void main(String[] args) {\n    System.out.println("Hello, World!");\n  }\n}'],
 ['explain this code: const toF = (c) => c * 9 / 5 + 32;'],
 ['hello how are you today'],['what is a loop'],
];
for(const [q] of cases){const r=E.explain(q);console.log('=== '+JSON.stringify(q).slice(0,70));if(!r){console.log('  null');continue}console.log('  lang:',r.lang);r.rows.forEach(x=>console.log('  ',x[0].slice(0,40).padEnd(40),'→',x[1]));if(r.summary)console.log('  ',r.summary);if(r.note)console.log('  NOTE',r.note)}
