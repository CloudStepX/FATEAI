(window.SEED=window.SEED||{})["Coding"]={
 "Programming basics": [
  {
   "t": "A program is a list of instructions that a computer follows. Code is written in a programming language and then either run by an interpreter or translated into machine code by a compiler."
  },
  {
   "t": "Interpreted languages such as Python and JavaScript run the code through an interpreter. Compiled languages such as C, Rust and Go are translated to machine code before they run, which is usually faster. Java compiles to bytecode that runs on a virtual machine."
  },
  {
   "t": "A variable is a named place that stores a value. A constant is a named value that cannot change after it is set."
  },
  {
   "t": "Common data types are numbers (integers and floats), strings (text), booleans (true or false), lists or arrays, and objects or dictionaries that store key and value pairs."
  },
  {
   "t": "Operators do work on values. Arithmetic operators are + - * / and %, comparison operators are == != < and >, and logical operators are and, or and not (written && || ! in many languages)."
  },
  {
   "t": "A conditional runs code only when a condition is true. It uses if, else if and else."
  },
  {
   "t": "A loop repeats code. A for loop is used when you know how many times to repeat, and a while loop repeats until a condition becomes false. A loop that never ends is an infinite loop."
  },
  {
   "t": "A function is a reusable block of code. It takes inputs called parameters and can return an output. Define it once and call it as many times as you need."
  },
  {
   "t": "Scope is where a variable can be seen. A local variable exists only inside its function or block, and a global variable can be seen everywhere. Prefer local variables because they cause fewer bugs."
  },
  {
   "t": "Recursion is when a function calls itself with a simpler input. Every recursive function needs a base case that stops it, or it will run until the program crashes."
  },
  {
   "t": "A comment is a note for humans that the computer ignores. Comments start with // in JavaScript, Java and C, and with # in Python."
  },
  {
   "t": "A syntax error means the code breaks the grammar rules of the language and cannot run. A runtime error happens while the program is running. A logic error runs without crashing but gives the wrong result, and it is the hardest to find."
  },
  {
   "t": "Pseudocode is a plan written in plain language before you write real code. Writing the steps in simple sentences first makes the real code much easier."
  },
  {
   "t": "Big O notation describes how the running time of an algorithm grows as the input gets larger. O(1) is constant, O(log n) is very fast, O(n) grows in step with the input, O(n log n) is typical for good sorting, and O(n squared) gets slow quickly."
  },
  {
   "t": "A bit is a 0 or a 1, and a byte is 8 bits. Binary is base 2, and hexadecimal is base 16 using the digits 0 to 9 and the letters A to F. Computers store everything as bits."
  },
  {
   "t": "Text is stored as numbers using an encoding. ASCII covers basic English characters, and Unicode with the UTF-8 encoding covers almost every writing system and emoji."
  },
  {
   "t": "Abstraction means hiding the details so you only deal with what matters. A function name such as sendEmail hides the many steps inside it."
  }
 ],
 "JavaScript": [
  {
   "t": "JavaScript runs in every web browser and also on servers through Node.js. It makes web pages interactive."
  },
  {
   "t": "Use const for values that will not be reassigned and let for variables that change. Avoid var, which has confusing scope rules."
  },
  {
   "t": "In JavaScript, === compares both value and type, while == converts types first and can give surprising results. Prefer ===.",
   "k": "difference double equals triple equals equality operator comparison javascript"
  },
  {
   "t": "An arrow function is a short way to write a function: const add = (a, b) => a + b. Arrow functions also keep the this value of the code around them."
  },
  {
   "t": "Useful array methods are push and pop (add and remove at the end), map (change every item), filter (keep matching items), reduce (combine items into one value), find, includes, forEach, slice and sort."
  },
  {
   "t": "An object stores key and value pairs. Read a value with obj.key or obj['key']. Destructuring pulls values out in one line: const { name, age } = person."
  },
  {
   "t": "Template literals use backticks and let you put values in text: `Hello ${name}`. They can also span several lines."
  },
  {
   "t": "A Promise stands for a value that will arrive later. With async and await, an async function can pause at await until the Promise finishes, which makes asynchronous code read from top to bottom."
  },
  {
   "t": "The DOM is the page seen as a tree of elements. Use document.querySelector to find an element, textContent to change its text, classList to add or remove classes and addEventListener to react to clicks and other events."
  },
  {
   "t": "JSON.stringify turns a JavaScript value into text and JSON.parse turns that text back into a value. They are used to save data and to send it over the network."
  },
  {
   "t": "In JavaScript the falsy values are false, 0, an empty string, null, undefined and NaN. Everything else is truthy, including an empty array and an empty object."
  },
  {
   "t": "A closure is a function that remembers the variables from the place where it was created, even after that place has finished running. Closures are used to keep private data."
  },
  {
   "t": "setTimeout runs a function once after a delay in milliseconds, and setInterval runs it again and again. clearTimeout and clearInterval stop them."
  },
  {
   "t": "Use try, catch and finally to handle errors in JavaScript. Code in try runs first, catch runs if an error is thrown, and finally always runs."
  },
  {
   "t": "A common JavaScript trap: the default sort() compares items as text, so [10, 9, 1].sort() gives [1, 10, 9]. Pass a compare function to sort numbers.",
   "k": "sort numbers wrong order default sort javascript"
  },
  {
   "t": "const nums = [1, 2, 3, 4];\nconst doubled = nums.map(n => n * 2);\nconst evens = nums.filter(n => n % 2 === 0);\nconst sum = nums.reduce((a, n) => a + n, 0);",
   "code": 1,
   "k": "map filter reduce array javascript example sum double"
  },
  {
   "t": "async function load(url) {\n  try {\n    const res = await fetch(url);\n    if (!res.ok) throw new Error('HTTP ' + res.status);\n    return await res.json();\n  } catch (e) {\n    console.error(e);\n  }\n}",
   "code": 1,
   "k": "fetch data api async await json javascript load"
  },
  {
   "t": "document.querySelector('#btn').addEventListener('click', () => {\n  document.querySelector('#out').textContent = 'Clicked';\n});",
   "code": 1,
   "k": "button click event listener dom javascript"
  },
  {
   "t": "function debounce(fn, ms) {\n  let t;\n  return (...args) => {\n    clearTimeout(t);\n    t = setTimeout(() => fn(...args), ms);\n  };\n}",
   "code": 1,
   "k": "debounce delay search input typing javascript"
  },
  {
   "t": "nums.sort((a, b) => a - b);   // ascending numbers\nnums.sort((a, b) => b - a);   // descending",
   "code": 1,
   "k": "sort numbers ascending descending javascript"
  },
  {
   "t": "const unique = [...new Set(arr)];",
   "code": 1,
   "k": "remove duplicates unique array set javascript"
  },
  {
   "t": "const copy = { ...obj };            // shallow copy\nconst deep = structuredClone(obj);  // deep copy",
   "code": 1,
   "k": "copy clone object shallow deep javascript"
  },
  {
   "t": "const randInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;",
   "code": 1,
   "k": "random number integer between min max javascript"
  },
  {
   "t": "class Animal {\n  constructor(name) { this.name = name; }\n  speak() { return this.name + ' makes a sound'; }\n}\nclass Dog extends Animal {\n  speak() { return this.name + ' barks'; }\n}",
   "code": 1,
   "k": "class inheritance extends object oriented javascript"
  },
  {
   "t": "const counts = {};\nfor (const w of words) counts[w] = (counts[w] || 0) + 1;",
   "code": 1,
   "k": "count words frequency occurrences object javascript"
  },
  {
   "t": "navigator.clipboard.writeText(text);",
   "code": 1,
   "k": "copy text clipboard javascript"
  },
  {
   "t": "const capitalize = s => s.charAt(0).toUpperCase() + s.slice(1);",
   "code": 1,
   "k": "capitalize first letter string javascript"
  }
 ],
 "Python": [
  {
   "t": "Python is a readable language that uses indentation to mark blocks of code. It is popular for scripts, automation, data analysis, web servers and artificial intelligence."
  },
  {
   "t": "Python's print() shows output and input() reads text typed by the user. An f-string puts values in text: f\"Hello {name}\"."
  },
  {
   "t": "Python's main collections are the list (ordered and changeable), the tuple (ordered and fixed), the dict (key and value pairs) and the set (unique values with no order)."
  },
  {
   "t": "A list comprehension builds a list in one line: [x * x for x in range(5)] gives [0, 1, 4, 9, 16]. Add a condition at the end to filter: [x for x in nums if x > 0]."
  },
  {
   "t": "Define a function in Python with def and give back a result with return. Parameters can have default values, and *args and **kwargs collect extra positional and keyword arguments."
  },
  {
   "t": "Useful loop tools in Python are range(n), enumerate(list) which gives index and item, and zip(a, b) which walks through two lists together."
  },
  {
   "t": "Use with open('file.txt') as f to read or write a file. The with block closes the file for you even if an error happens."
  },
  {
   "t": "Python handles errors with try, except and finally. Catch a specific error such as ValueError rather than every error."
  },
  {
   "t": "A Python virtual environment keeps each project's packages separate. Create it with python -m venv .venv, activate it, then use pip install to add packages."
  },
  {
   "t": "In Python, == checks whether two values are equal, while is checks whether they are the same object. Use is only for None: if x is None."
  },
  {
   "t": "A common Python error is IndentationError, which means the lines in a block do not line up. Use four spaces for each level and never mix tabs and spaces."
  },
  {
   "t": "with open('data.txt') as f:\n    for line in f:\n        print(line.strip())",
   "code": 1,
   "k": "read file lines text open python"
  },
  {
   "t": "from collections import Counter\nCounter(words).most_common(3)",
   "code": 1,
   "k": "count frequency most common words python counter"
  },
  {
   "t": "people.sort(key=lambda p: p['age'])",
   "code": 1,
   "k": "sort list of dictionaries by key lambda python"
  },
  {
   "t": "evens = [n for n in nums if n % 2 == 0]",
   "code": 1,
   "k": "filter list comprehension even numbers python"
  },
  {
   "t": "import json\ndata = json.loads(text)\ntext = json.dumps(data, indent=2)",
   "code": 1,
   "k": "json parse load dump python"
  },
  {
   "t": "import requests\nr = requests.get(url)\ndata = r.json()",
   "code": 1,
   "k": "http request get api requests python"
  },
  {
   "t": "class Dog:\n    def __init__(self, name):\n        self.name = name\n    def speak(self):\n        return self.name + ' barks'",
   "code": 1,
   "k": "class object init method python"
  },
  {
   "t": "for i in range(1, 101):\n    if i % 15 == 0: print('FizzBuzz')\n    elif i % 3 == 0: print('Fizz')\n    elif i % 5 == 0: print('Buzz')\n    else: print(i)",
   "code": 1,
   "k": "fizzbuzz loop modulo python"
  },
  {
   "t": "python -m venv .venv\nsource .venv/bin/activate   # Windows: .venv\\Scripts\\activate\npip install requests",
   "code": 1,
   "k": "virtual environment venv pip install python"
  }
 ],
 "Data structures": [
  {
   "t": "An array stores items in order, and you reach any item by its index in constant time. Inserting in the middle is slow because the other items must shift.",
   "k": "array data structure index"
  },
  {
   "t": "A linked list is a chain of nodes where each node points to the next one. Inserting and removing is fast, but finding an item means walking along the chain."
  },
  {
   "t": "A stack is last in, first out, like a pile of plates. You push onto the top and pop from the top. Stacks power undo, back buttons and the function call stack."
  },
  {
   "t": "A queue is first in, first out, like a line of people. You enqueue at the back and dequeue from the front. Queues are used for tasks, printing and breadth-first search."
  },
  {
   "t": "A hash table, also called a dictionary or map, stores values by key and finds them in about constant time on average. It is the most useful structure for fast lookup."
  },
  {
   "t": "A set stores unique values and tells you very quickly whether a value is in it. Use a set to remove duplicates."
  },
  {
   "t": "A tree is a hierarchy with a root and children, and an item with no children is a leaf. A binary tree gives each node at most two children, and a binary search tree keeps smaller values on the left and larger on the right."
  },
  {
   "t": "A heap, or priority queue, always gives you the smallest or largest item first. It is used for scheduling and for finding the top results."
  },
  {
   "t": "A graph is made of nodes joined by edges. Graphs model maps, social networks, the web and dependencies between tasks."
  },
  {
   "t": "A trie is a tree of letters that stores words by their prefixes. It is used for autocomplete and spell checking."
  },
  {
   "t": "How to choose a data structure: use a hash table for lookup by key, an array for ordered items, a set for uniqueness, a stack for undo, a queue for first come first served, and a graph for connections."
  }
 ],
 "Algorithms": [
  {
   "t": "Linear search checks every item one by one and takes O(n) time. Binary search works only on sorted data and works by halving the search area at every step, so it takes O(log n) time."
  },
  {
   "t": "Sorting algorithms: bubble sort is simple but slow at O(n squared), merge sort splits the list and merges it back in O(n log n), and quicksort is also O(n log n) on average. In real code, use the built-in sort."
  },
  {
   "t": "Breadth-first search explores a graph level by level using a queue and finds the shortest path when all steps cost the same. Depth-first search goes as deep as it can first, using a stack or recursion."
  },
  {
   "t": "Dijkstra's algorithm finds the shortest path in a graph whose edges have different non-negative costs, such as a road map."
  },
  {
   "t": "Dynamic programming solves a problem by saving the answers to smaller sub-problems so they are never calculated twice. Saving results this way is called memoization."
  },
  {
   "t": "A greedy algorithm takes the best choice at each step and never looks back. It works for some problems, such as making change with standard coins, but not for all."
  },
  {
   "t": "Backtracking tries a choice, goes forward, and undoes the choice when it hits a dead end. It is used for puzzles such as sudoku and the eight queens problem."
  },
  {
   "t": "Divide and conquer splits a problem into smaller copies of itself, solves each one and combines the results. Merge sort and binary search are examples."
  },
  {
   "t": "The two pointers technique uses two positions that move through a list, which solves many problems in one pass. The sliding window technique keeps a moving range, for example to find the best group of k items in a row."
  },
  {
   "t": "To find duplicates or pairs quickly, store what you have seen in a hash table or set. This turns a slow O(n squared) check into an O(n) one."
  },
  {
   "t": "function bsearch(a, x) {   // a must be sorted\n  let lo = 0, hi = a.length - 1;\n  while (lo <= hi) {\n    const mid = Math.floor((lo + hi) / 2);\n    if (a[mid] === x) return mid;\n    if (a[mid] < x) lo = mid + 1; else hi = mid - 1;\n  }\n  return -1;\n}",
   "code": 1,
   "k": "binary search sorted array algorithm javascript"
  },
  {
   "t": "from functools import lru_cache\n\n@lru_cache(None)\ndef fib(n):\n    return n if n < 2 else fib(n - 1) + fib(n - 2)",
   "code": 1,
   "k": "fibonacci memoization dynamic programming recursion python"
  },
  {
   "t": "function twoSum(nums, target) {\n  const seen = new Map();\n  for (let i = 0; i < nums.length; i++) {\n    const need = target - nums[i];\n    if (seen.has(need)) return [seen.get(need), i];\n    seen.set(nums[i], i);\n  }\n  return null;\n}",
   "code": 1,
   "k": "two sum pair target hash map algorithm javascript"
  },
  {
   "t": "const isPalindrome = s => {\n  const t = s.toLowerCase().replace(/[^a-z0-9]/g, '');\n  return t === [...t].reverse().join('');\n};",
   "code": 1,
   "k": "palindrome check reverse string javascript"
  },
  {
   "t": "for (let i = 1; i <= 100; i++) {\n  console.log(i % 15 === 0 ? 'FizzBuzz' : i % 3 === 0 ? 'Fizz' : i % 5 === 0 ? 'Buzz' : i);\n}",
   "code": 1,
   "k": "fizzbuzz loop modulo javascript"
  }
 ],
 "HTML and CSS": [
  {
   "t": "Semantic HTML uses elements that describe their meaning, such as header, nav, main, section, article and footer. They help screen readers, search engines and other developers."
  },
  {
   "t": "For pages that work on phones, add <meta name=\"viewport\" content=\"width=device-width, initial-scale=1\"> in the head and use flexible widths instead of fixed pixels."
  },
  {
   "t": "The CSS box model wraps every element in content, padding, border and margin. Set box-sizing: border-box so the width you set includes the padding and the border."
  },
  {
   "t": "CSS selectors pick elements: an element name, a .class or an #id. When rules conflict, an id beats a class and a class beats an element, and for equal rules the later one wins."
  },
  {
   "t": "A media query applies styles only on some screens, for example @media (max-width: 600px) { ... } for narrow phones. Write the phone layout first and add media queries for larger screens."
  },
  {
   "t": "CSS position values: static is normal flow, relative offsets an element from its place, absolute places it relative to the nearest positioned parent, fixed sticks it to the screen and sticky sticks it once you scroll to it."
  },
  {
   "t": "Use flexbox to lay items out in one direction, in a row or a column, and grid to lay them out in rows and columns together. Use gap for the spacing between items."
  },
  {
   "t": "Accessibility basics: give every image an alt text, connect each input to a label, keep text color contrast high, make everything usable with the keyboard and never use color alone to carry meaning."
  },
  {
   "t": "Common input types in HTML forms are text, email, password, number, date, checkbox, radio and file. The right type gives phone users the right keyboard and gives built-in validation."
  },
  {
   "t": "CSS units: px is fixed, % is relative to the parent, rem is relative to the root font size, em is relative to the current font size and vh and vw are relative to the screen size. Use rem for text so it respects the user's settings."
  },
  {
   "t": "z-index controls which overlapping element is on top. It only works on positioned elements, and a higher number sits above a lower one."
  },
  {
   "t": "button{padding:12px 18px;min-height:44px;border:0;border-radius:10px;background:#4f46e5;color:#fff;font:inherit}\nbutton:active{transform:scale(.97)}",
   "code": 1,
   "k": "button style css tap target mobile"
  },
  {
   "t": "img{max-width:100%;height:auto;display:block}",
   "code": 1,
   "k": "responsive image css fit screen"
  }
 ],
 "Databases and SQL": [
  {
   "t": "A relational database stores data in tables of rows and columns, such as SQLite, PostgreSQL and MySQL. A NoSQL database stores data in other shapes, such as documents in MongoDB or keys and values in Redis."
  },
  {
   "t": "A primary key is a column that gives every row a unique id. A foreign key is a column that points to the primary key of another table and links the two."
  },
  {
   "t": "The basic SQL commands are SELECT to read, INSERT to add, UPDATE to change and DELETE to remove rows. Always write a WHERE clause on UPDATE and DELETE, or every row is changed."
  },
  {
   "t": "A JOIN combines rows from two tables where a key matches. An INNER JOIN keeps only matching rows, and a LEFT JOIN keeps every row from the left table even when nothing matches."
  },
  {
   "t": "GROUP BY collects rows into groups so you can use COUNT, SUM, AVG, MIN and MAX on each group. HAVING filters the groups, while WHERE filters rows before grouping."
  },
  {
   "t": "An index makes lookups on a column much faster, like the index at the back of a book. It costs extra space and makes writes a little slower, so index the columns you search often."
  },
  {
   "t": "Normalization means splitting data into separate tables so that each fact is stored only once. It prevents the same information from getting out of step in many places."
  },
  {
   "t": "A transaction groups several database steps so they all succeed or all fail together. Databases that follow ACID guarantee atomicity, consistency, isolation and durability."
  },
  {
   "t": "To stop SQL injection, never build a query by joining text typed by users. Use parameterized queries, where the database receives the values separately from the command."
  },
  {
   "t": "SELECT name, age FROM users WHERE age >= 18 ORDER BY age DESC LIMIT 10;",
   "code": 1,
   "k": "select where order by limit sql query"
  },
  {
   "t": "SELECT customer_id, SUM(total) AS spent\nFROM orders\nGROUP BY customer_id\nHAVING SUM(total) > 100;",
   "code": 1,
   "k": "group by sum having aggregate sql"
  },
  {
   "t": "CREATE TABLE users (\n  id INTEGER PRIMARY KEY,\n  name TEXT NOT NULL,\n  email TEXT UNIQUE\n);",
   "code": 1,
   "k": "create table primary key unique sql"
  },
  {
   "t": "UPDATE users SET email = 'new@example.com' WHERE id = 7;",
   "code": 1,
   "k": "update row where sql change"
  }
 ],
 "APIs and the web": [
  {
   "t": "An API is a set of rules that lets programs talk to each other. A web API is reached over HTTP at a URL and usually answers in JSON."
  },
  {
   "t": "A REST API uses URLs for things and HTTP methods for actions: GET reads, POST creates, PUT replaces, PATCH changes part and DELETE removes."
  },
  {
   "t": "HTTP status codes: 200 OK, 201 Created, 301 Moved permanently, 400 Bad request, 401 Not signed in, 403 Forbidden, 404 Not found, 429 Too many requests and 500 Server error. Codes starting with 2 mean success, 4 mean the client made a mistake and 5 mean the server failed."
  },
  {
   "t": "JSON is a text format for data. Keys and strings use double quotes, and there are no comments and no trailing commas. It supports objects, arrays, strings, numbers, true, false and null."
  },
  {
   "t": "The frontend is the part of an app that runs in the user's browser or phone, and the backend is the part that runs on a server and handles data, logins and business rules."
  },
  {
   "t": "HTTPS encrypts the traffic between the browser and the server. DNS is the system that turns a name such as example.com into the number address of a server."
  },
  {
   "t": "CORS is a browser rule that blocks a page from reading responses from another website unless that website allows it. A CORS error is fixed on the server, not in the page."
  },
  {
   "t": "Cookies are small pieces of data the browser sends with every request to a site, often used for logins. localStorage keeps data in the browser, but only your own page code can read it."
  },
  {
   "t": "Never put a secret API key in code that runs in the browser, because anyone can read it. Keep keys on a server, in environment variables, and out of your git repository."
  },
  {
   "t": "Many APIs have a rate limit, which is the number of requests you may make in a period. If you get status 429, wait and try again more slowly."
  },
  {
   "t": "A WebSocket keeps a connection open so the server and the browser can send messages to each other at any time. It is used for chat, live scores and games."
  },
  {
   "t": "A service worker is a script that runs in the background of a web page. It can store files so a web app opens offline, and it is what makes a progressive web app work without internet."
  }
 ],
 "Git and version control": [
  {
   "t": "Version control records every change to your files so you can go back and work with other people. Git is the most popular version control system, and GitHub is a website that hosts Git repositories."
  },
  {
   "t": "The everyday Git commands are git status to see what changed, git add to choose files, git commit -m \"message\" to save a snapshot, git push to send commits to GitHub and git pull to get new commits."
  },
  {
   "t": "To start a repository use git init in a folder, or git clone with a URL to copy an existing one. Connect a local repository to GitHub with git remote add origin followed by the URL."
  },
  {
   "t": "To work on a feature, make a branch with git switch -c name, commit there, then merge it with git merge name from the main branch. Branches let you try things without breaking the main code."
  },
  {
   "t": "A merge conflict happens when two branches change the same lines. Git marks the file with <<<<<<<, ======= and >>>>>>>. Edit the file to keep what you want, remove the markers, then git add and commit."
  },
  {
   "t": "To undo changes: git restore file throws away changes you have not committed, git stash puts them aside for later, git revert makes a new commit that cancels an old one, and git reset --hard erases changes for good, so use it with care.",
   "k": "undo changes git restore stash revert reset discard"
  },
  {
   "t": "To undo your last commit but keep the changes in your files, run git reset --soft HEAD~1. To fix only the commit message, run git commit --amend.",
   "k": "undo last commit git reset soft amend"
  },
  {
   "t": "A .gitignore file lists the files Git should not track, such as node_modules, build folders and secret keys. Never commit passwords or API keys, because they stay in the history."
  },
  {
   "t": "A good commit message is short, in the present tense and says what the change does, such as Add login form. Make small commits that each do one thing."
  },
  {
   "t": "A pull request asks the owners of a repository to merge your branch. Other people can read the changes, comment and approve before they are merged."
  },
  {
   "t": "git log --oneline lists past commits briefly, and git diff shows the exact lines that changed. git blame shows who last changed each line."
  },
  {
   "t": "GitHub Actions runs jobs automatically when you push, using a workflow file in .github/workflows. It can run tests and build an app such as an Android APK."
  }
 ],
 "Command line": [
  {
   "t": "The command line lets you control the computer by typing commands. Common ones are pwd (where am I), ls (list files, dir on Windows), cd (change folder), mkdir (make folder), cp (copy), mv (move or rename) and rm (delete, with no undo)."
  },
  {
   "t": "cat shows a file, head and tail show the start and the end, grep searches for text, wc -l counts lines and find looks for files. Use man followed by a command name to read its manual."
  },
  {
   "t": "A pipe | sends the output of one command into another, as in ls | grep txt. The symbol > writes output to a file and replaces it, and >> adds to the end of a file."
  },
  {
   "t": "Shortcuts: Tab completes names, the up arrow brings back earlier commands and Ctrl+C stops a running command."
  },
  {
   "t": "An environment variable is a named setting available to programs, such as PATH or an API key. Set one with export NAME=value on Mac and Linux. The PATH variable lists the folders where the shell looks for commands."
  },
  {
   "t": "sudo runs a command as the administrator. Only use it when you understand the command, because it can change anything on the system."
  },
  {
   "t": "curl sends web requests from the command line, for example curl https://example.com to download a page. Add -X POST and -d to send data."
  },
  {
   "t": "chmod changes who may read, write or run a file. chmod +x script.sh makes a script runnable."
  }
 ],
 "Debugging and testing": [
  {
   "t": "How to debug: reproduce the problem, find the smallest case that shows it, read the error, guess the cause, test the guess, fix it and check that it is really fixed. Change one thing at a time."
  },
  {
   "t": "How to read an error message: the first line says what went wrong, and the file name and line number say where. In a long stack trace, look for the first line that points to your own code."
  },
  {
   "t": "Print debugging means adding console.log or print lines to see the values while the code runs. A debugger lets you stop at a breakpoint and step through the code one line at a time."
  },
  {
   "t": "Rubber duck debugging means explaining your code line by line out loud to a rubber duck or a friend. Saying it clearly often shows the mistake."
  },
  {
   "t": "To find which change caused a bug, comment out half of the code and see whether the bug stays, then repeat with the remaining half. git bisect does the same thing through your commit history."
  },
  {
   "t": "Common causes of bugs: off-by-one errors in loops, null or undefined values, a wrong data type, asynchronous code that has not finished yet, a typo in a name, and changing a shared object by accident."
  },
  {
   "t": "A unit test checks one small function. An integration test checks that several parts work together. An end-to-end test acts like a real user going through the whole app."
  },
  {
   "t": "Test-driven development means writing a failing test first, writing just enough code to make it pass, then cleaning up the code while the test keeps passing."
  },
  {
   "t": "Edge cases to test: an empty input, zero, negative numbers, a very large number, null, duplicates, very long text and special characters."
  },
  {
   "t": "Logging records what the program is doing. Use levels such as debug, info, warning and error, so you can turn the detail up when you hunt a bug."
  },
  {
   "t": "console.assert(add(2, 3) === 5, 'add failed');",
   "code": 1,
   "k": "assert test javascript console check function"
  },
  {
   "t": "def test_add():\n    assert add(2, 3) == 5\n# run with: pytest",
   "code": 1,
   "k": "test pytest assert python unit"
  }
 ],
 "Software design": [
  {
   "t": "Clean code uses meaningful names, small functions that do one thing, little nesting and clear comments only where the code cannot explain itself."
  },
  {
   "t": "DRY means do not repeat yourself: put repeated code in one function. KISS means keep it simple. YAGNI means you are not going to need it, so do not build features before you need them."
  },
  {
   "t": "Separation of concerns means keeping different jobs in different places, such as data, logic and display. The model view controller pattern splits an app into the data, the screen and the code that connects them."
  },
  {
   "t": "Refactoring means improving the structure of code without changing what it does. Do it in small steps and run your tests after each step."
  },
  {
   "t": "Technical debt is the extra work you create later by taking shortcuts now. A little debt can be sensible, but it must be paid back."
  },
  {
   "t": "A minimum viable product, or MVP, is the smallest version that solves the main problem. Build it first, get feedback and then improve it."
  },
  {
   "t": "Naming styles: camelCase (userName) is common in JavaScript and Java, snake_case (user_name) in Python, PascalCase (UserName) for classes and kebab-case (user-name) in CSS and URLs."
  },
  {
   "t": "A good README says what the project does, how to install it, how to run it and how to use it. Write it for someone who has never seen the project."
  },
  {
   "t": "Semantic versioning writes versions as MAJOR.MINOR.PATCH. Increase MAJOR for breaking changes, MINOR for new features that still work with old code, and PATCH for bug fixes."
  },
  {
   "t": "A code review is when another person reads your changes before they are merged. It catches bugs, spreads knowledge and keeps the style consistent."
  }
 ],
 "Security basics": [
  {
   "t": "Never trust input from users. Check its type, length and format (validate it) and clean it (sanitize it) before you use it."
  },
  {
   "t": "Cross-site scripting, or XSS, happens when an attacker gets their script to run in your page. Show untrusted text with textContent instead of innerHTML, and escape it before putting it in HTML."
  },
  {
   "t": "Never store passwords as plain text. Store a salted hash made with a slow algorithm such as bcrypt or Argon2, so that even you cannot read the password."
  },
  {
   "t": "Hashing is one-way and cannot be reversed, which suits passwords. Encryption can be reversed with a key, which suits data that must be read again."
  },
  {
   "t": "Authentication proves who you are, such as a password plus a code. Authorization decides what you are allowed to do once you are signed in."
  },
  {
   "t": "Keep secrets such as keys and tokens out of your code and out of Git. Load them from environment variables, and if one leaks, replace it at once."
  },
  {
   "t": "Use HTTPS everywhere, give each program only the permissions it needs (least privilege) and keep libraries up to date, because old versions have known holes."
  },
  {
   "t": "Two-factor authentication asks for a second proof, such as a code from an app, in addition to a password. It stops most account takeovers."
  }
 ],
 "Android and Java": [
  {
   "t": "Android apps are written in Kotlin or Java. An Activity is one screen, and AndroidManifest.xml declares the app name, the activities and the permissions."
  },
  {
   "t": "Gradle is the build tool for Android. The build.gradle files list the SDK versions and the libraries. An APK is the installable app file, and an AAB is the format for Google Play.",
   "k": "apk android gradle build aab what is apk"
  },
  {
   "t": "An Android app must be signed with a keystore before it can be installed. Keep the keystore file and its passwords safe, because without them you cannot publish updates to the same app."
  },
  {
   "t": "A WebView shows web pages inside an app. webView.loadUrl(\"file:///android_asset/index.html\") loads the HTML files you put in the assets folder, so a web app can be packaged as an Android app.",
   "k": "webview web view android app html assets"
  },
  {
   "t": "An app can only use the network if its manifest asks for the INTERNET permission. An app without that permission cannot go online, which keeps its data on the device."
  },
  {
   "t": "The activity lifecycle runs through onCreate, onStart, onResume, onPause, onStop and onDestroy. Save your data in onPause, because Android can close an app in the background."
  },
  {
   "t": "Dangerous permissions, such as the camera or location, must be requested from the user while the app is running. Ask only for what you need and explain why."
  },
  {
   "t": "minSdk is the oldest Android version the app supports and targetSdk is the version it was built and tested for. A lower minSdk reaches more phones."
  },
  {
   "t": "To install an APK you built yourself, allow installs from unknown apps in the phone settings, or connect the phone and run adb install app.apk."
  },
  {
   "t": "Java is statically typed, so you declare types such as int, String and boolean. Common collections are ArrayList and HashMap. A Java program starts in a main method. Java and JavaScript are two different languages."
  }
 ],
 "Putting coding to use": [
  {
   "t": "How to start learning to code: pick one language, JavaScript or Python, learn variables, conditions, loops and functions, then build small projects as soon as possible. Code a little every day instead of a lot once a week."
  },
  {
   "t": "How to build your first app: describe the goal in one sentence, build the smallest working version, run it, then add one feature at a time. Good first projects are a to-do list, a calculator, a quiz and a unit converter."
  },
  {
   "t": "How to break a big problem into small ones: write the steps in plain language, turn each step into a function, solve the easiest step first and test each part before you join them."
  },
  {
   "t": "How to ask for help with code: say what you want to happen, what happens instead, the exact error message, what you already tried and the smallest piece of code that shows the problem."
  },
  {
   "t": "How to read documentation: start with the examples, then look up the exact function you need. MDN Web Docs is the best reference for HTML, CSS and JavaScript, and docs.python.org is the reference for Python."
  },
  {
   "t": "How to organize a project: keep source code in one folder, assets such as images in another, tests next to the code, and a README at the top. Use clear file names and keep each file about one topic."
  },
  {
   "t": "How to put a static website online for free: push the files to a GitHub repository, then turn on GitHub Pages in the repository settings. The site is served over https."
  },
  {
   "t": "How to save data in a web app: use localStorage for small amounts of text, IndexedDB for large or structured data, and a server database when the data must be shared between devices."
  },
  {
   "t": "How to use AI tools for coding: describe the task clearly, ask for a small piece at a time, read and understand every line, run it and test it, and never paste passwords or private keys into a prompt."
  },
  {
   "t": "How to back up your work: commit often, push to GitHub and keep a copy of important files, such as keystores, somewhere else. A commit is a saved point you can return to."
  },
  {
   "t": "How to automate a boring task: write down the steps you repeat by hand, then write a short script that does them. Python is good for files and data, and shell scripts are good for simple jobs."
  },
  {
   "t": "How to get better at coding: read other people's code, rebuild small apps you like, fix bugs in your own old projects, and explain what you learned to someone else."
  },
  {
   "t": "<ul id=\"list\"></ul>\n<input id=\"item\"><button id=\"add\">Add</button>\n<script>\ndocument.getElementById('add').onclick = () => {\n  const v = document.getElementById('item').value.trim();\n  if (!v) return;\n  const li = document.createElement('li');\n  li.textContent = v;\n  document.getElementById('list').appendChild(li);\n  document.getElementById('item').value = '';\n};\n</script>",
   "code": 1,
   "k": "todo list app html javascript simple example first project"
  }
 ]
};
