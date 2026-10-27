(window.SEED=window.SEED||{})["Programming Concepts"]={
 "Object-oriented programming": [
  {
   "t": "Object-oriented programming (OOP) organizes code into objects that bundle data (attributes) with behavior (methods). A class is the blueprint, and an object or instance is one thing built from it. Java, C#, Python, Kotlin and JavaScript all support it."
  },
  {
   "t": "Encapsulation means keeping an object's internal data hidden and letting other code reach it only through methods. It protects the data from invalid changes, and you can change the inside later without breaking the code that uses it."
  },
  {
   "t": "Inheritance lets a child class reuse and extend a parent class, which models an 'is-a' relationship: a Dog is an Animal. Deep inheritance chains become fragile, so use them sparingly."
  },
  {
   "t": "Polymorphism means different classes respond to the same method name in their own way. Calling speak() on a Dog gives a bark and on a Cat gives a meow, and the caller does not need to know which one it has."
  },
  {
   "t": "Abstraction means exposing what an object does and hiding how it does it. An interface or abstract class defines a contract of methods that other classes must provide."
  },
  {
   "t": "Composition over inheritance: build behavior by combining small objects that an object has (a 'has-a' relationship) instead of inheriting from a big parent. A Car has an Engine. It is more flexible and easier to change."
  },
  {
   "t": "A constructor runs when a new object is created and sets up its starting state. Inside a method, this (JavaScript, Java) or self (Python) refers to the current object."
  },
  {
   "t": "Static or class members belong to the class itself instead of to each instance. They suit shared constants and utility functions, such as Math.max in JavaScript."
  },
  {
   "t": "SOLID is a set of five design principles: Single responsibility (a class has one reason to change), Open/closed (open to extension, closed to modification), Liskov substitution (a child can stand in for its parent), Interface segregation (many small interfaces beat one big one) and Dependency inversion (depend on abstractions, not concrete classes)."
  },
  {
   "t": "Good design has low coupling and high cohesion. Coupling is how much classes depend on each other's details, and cohesion is how closely the parts of one class belong together. Aim for classes that know little about each other and do one focused job."
  },
  {
   "t": "class Dog:\n    def __init__(self, name):\n        self.name = name\n\n    def speak(self):\n        return self.name + \" says woof\"\n\nd = Dog(\"Rex\")\nprint(d.speak())",
   "code": 1,
   "k": "class object oop python create make define example"
  },
  {
   "t": "class Animal {\n  constructor(name) { this.name = name; }\n  speak() { return this.name + \" makes a sound\"; }\n}\nclass Dog extends Animal {\n  speak() { return this.name + \" barks\"; }\n}\nconsole.log(new Dog(\"Rex\").speak());",
   "code": 1,
   "k": "class inheritance extends oop javascript create make example subclass"
  }
 ],
 "Functional programming": [
  {
   "t": "Functional programming builds programs from functions that transform data instead of changing it step by step. Its main ideas are pure functions, immutable data and functions as values. JavaScript, Python, Haskell, Elixir and Scala support it to different degrees."
  },
  {
   "t": "A pure function always returns the same output for the same input and has no side effects, meaning it changes nothing outside itself. Pure functions are easy to test, reuse and reason about."
  },
  {
   "t": "Immutability means never changing data after it is created. Instead of editing a list you make a new one with the change. In JavaScript use const, the spread operator and map or filter, and in Python use tuples and new lists."
  },
  {
   "t": "In many languages functions are first-class values: they can be stored in variables, passed to other functions and returned. A higher-order function takes or returns a function, like map, filter, reduce and sort with a comparison function."
  },
  {
   "t": "map transforms every item in a list, filter keeps the items that pass a test, and reduce folds the list into a single value such as a sum. Chained together they replace many loops with short, readable steps."
  },
  {
   "t": "A closure is a function that remembers the variables from the place where it was created, even after that place has finished running. Closures power counters, private state, callbacks and many event handlers."
  },
  {
   "t": "A side effect is anything a function does besides returning a value: printing, changing a variable, writing a file, calling a server or using a random number. Functional style keeps side effects at the edges of the program and the core logic pure."
  },
  {
   "t": "Currying turns a function of several arguments into a chain of functions that each take one, and partial application fixes some arguments in advance. For example add(2) can return a function that adds 2 to anything."
  },
  {
   "t": "Declarative code says what you want (filter the adults), while imperative code says how to do it step by step (loop, test, push). Functional code leans declarative."
  },
  {
   "t": "A lambda or arrow function is a small unnamed function written inline, like x => x * 2 in JavaScript or lambda x: x * 2 in Python. Use them for short callbacks and give anything longer a name."
  },
  {
   "t": "Recursion replaces loops in functional languages. Each call works on a smaller part of the data, and some languages optimize tail calls to avoid stack growth. Python and JavaScript engines mostly do not, so deep recursion can overflow the stack there."
  },
  {
   "t": "const nums = [1, 2, 3, 4, 5];\nconst doubled = nums.map(n => n * 2);\nconst evens = nums.filter(n => n % 2 === 0);\nconst sum = nums.reduce((a, n) => a + n, 0);\nconsole.log(doubled, evens, sum);",
   "code": 1,
   "k": "map filter reduce array sum double transform js javascript"
  },
  {
   "t": "function makeCounter() {\n  let n = 0;\n  return () => ++n;\n}\nconst next = makeCounter();\nconsole.log(next(), next(), next());",
   "code": 1,
   "k": "closure counter private state function js javascript example"
  }
 ],
 "Design patterns": [
  {
   "t": "A design pattern is a reusable solution to a common design problem. The book by the Gang of Four (1994) named 23 classic patterns. Patterns give developers a shared vocabulary, and they are tools to use when a problem fits, not goals in themselves."
  },
  {
   "t": "Singleton means a class has only one instance that everyone shares, such as a settings object or logger. It is easy to overuse, because hidden global state makes code harder to test."
  },
  {
   "t": "Factory: a function or class creates objects so the caller does not choose the concrete class. For example createShape('circle') returns a Circle, and adding a new shape does not change the callers."
  },
  {
   "t": "Observer: an object keeps a list of subscribers and notifies them when it changes. Event listeners, publish and subscribe systems and reactive user interfaces work this way."
  },
  {
   "t": "Strategy: put interchangeable algorithms behind the same interface and pick one at run time, for example different sorting or payment methods. In languages with first-class functions you can simply pass a function."
  },
  {
   "t": "Decorator: wrap an object or function to add behavior without changing its code, such as logging, caching or timing. Python has @decorator syntax built in for this."
  },
  {
   "t": "Adapter: a wrapper that converts one interface into another so that incompatible code can work together, such as wrapping an old library to match the interface your app expects."
  },
  {
   "t": "MVC (model, view, controller) separates the data and rules (model), what the user sees (view) and the code that connects them (controller). MVVM is a similar split used in Android and many front-end frameworks, with a view model holding the screen state."
  },
  {
   "t": "Dependency injection means passing the things an object needs into it instead of creating them inside. Then a test can pass in a fake database or a fake clock, and you can swap parts without editing the class."
  },
  {
   "t": "const listeners = [];\nconst subscribe = f => listeners.push(f);\nconst publish = data => listeners.forEach(f => f(data));\nsubscribe(x => console.log(\"got\", x));\npublish(42);",
   "code": 1,
   "k": "observer publish subscribe events listener pattern js javascript"
  },
  {
   "t": "import time\n\ndef timed(f):\n    def wrap(*a, **k):\n        t = time.time()\n        r = f(*a, **k)\n        print(f.__name__, round(time.time() - t, 4), \"s\")\n        return r\n    return wrap\n\n@timed\ndef work():\n    return sum(range(1000000))\n\nwork()",
   "code": 1,
   "k": "decorator timing wrapper python timed function"
  }
 ],
 "Concurrency and async": [
  {
   "t": "Concurrency means handling several tasks in overlapping time, and parallelism means actually running them at the same instant on different CPU cores. A single core can be concurrent by switching quickly between tasks, but only multiple cores are parallel."
  },
  {
   "t": "A task is I/O-bound when it mostly waits for something slow, like a network, a disk or a database, and CPU-bound when it mostly calculates. Async code and threads help I/O-bound work, while CPU-bound work needs real parallelism such as multiple processes."
  },
  {
   "t": "JavaScript runs your code on a single thread with an event loop. Slow operations such as network requests are handed off, and their callbacks wait in a queue until the call stack is empty. Long loops block the page, so keep each piece of work short."
  },
  {
   "t": "A callback is a function passed to run later. A Promise represents a value that will arrive in the future and is pending, then either fulfilled with a result or rejected with an error. async and await let you write promise code so it reads top to bottom."
  },
  {
   "t": "An async function always returns a promise. await pauses that function until the promise settles while the rest of the program keeps running. Wrap awaited calls in try and catch, and remember that a rejected promise with no handler is an error."
  },
  {
   "t": "Promise.all runs several promises at once and waits for all of them, so three requests that each take a second finish in about one second instead of three. Promise.allSettled waits for all and reports each success or failure, and Promise.race returns the first one to finish."
  },
  {
   "t": "Python's asyncio runs many I/O tasks on one thread with async and await. Because of the global interpreter lock (GIL), Python threads do not speed up CPU-heavy work, so use the multiprocessing module for that."
  },
  {
   "t": "On Android, never do network or disk work on the main (UI) thread, because the screen freezes and the system may show an 'App not responding' error. Use Kotlin coroutines, an executor or a background worker, then update the UI back on the main thread. In browsers a Web Worker does the same job."
  },
  {
   "t": "To share data safely between threads, avoid sharing at all when you can: use immutable data or pass messages. Otherwise protect shared data with a lock (mutex) and keep the locked section as short as possible to avoid races and deadlocks."
  },
  {
   "t": "Debounce waits until events stop for a set time before running (good for search boxes), and throttle runs at most once per interval (good for scroll and resize handlers)."
  },
  {
   "t": "When calling unreliable services use timeouts and retry with exponential backoff, waiting longer after each failure (for example 0.5, 1, 2 seconds). Only retry operations that are safe to repeat, and give up after a few tries."
  },
  {
   "t": "async function loadUser(id) {\n  try {\n    const res = await fetch(\"/api/users/\" + id);\n    if (!res.ok) throw new Error(\"HTTP \" + res.status);\n    return await res.json();\n  } catch (err) {\n    console.error(\"Could not load user:\", err.message);\n    return null;\n  }\n}",
   "code": 1,
   "k": "async await fetch try catch error handling load data js javascript example"
  },
  {
   "t": "async function both(urlA, urlB) {\n  const [a, b] = await Promise.all([\n    fetch(urlA).then(r => r.json()),\n    fetch(urlB).then(r => r.json())\n  ]);\n  return { a, b };\n}",
   "code": 1,
   "k": "promise all parallel requests fetch two urls at once js javascript"
  },
  {
   "t": "async function retry(fn, tries = 3) {\n  for (let i = 0; i < tries; i++) {\n    try { return await fn(); }\n    catch (e) {\n      if (i === tries - 1) throw e;\n      await new Promise(r => setTimeout(r, 2 ** i * 500));\n    }\n  }\n}",
   "code": 1,
   "k": "retry backoff exponential delay failed request js javascript"
  }
 ],
 "Clean code and refactoring": [
  {
   "t": "Readable code is written for the next person to read, who is often you in six months. Good names reveal intent: daysUntilExpiry beats d, and isEmpty beats flag. If you need a comment to explain a name, rename it."
  },
  {
   "t": "Functions should do one thing and be short enough to understand at a glance. If you cannot name a function without using 'and', it probably does two jobs. Few parameters (three or fewer) are easier to use and test."
  },
  {
   "t": "DRY (Don't Repeat Yourself) says every piece of knowledge should live in one place. Copy-pasted code means a bug fix must be made in several places. A useful rule is to tolerate duplication twice and extract it the third time."
  },
  {
   "t": "KISS (Keep It Simple) and YAGNI (You Aren't Gonna Need It) warn against building features and flexibility for needs that do not exist yet. Simple code that works is easier to change than clever code built for a guess."
  },
  {
   "t": "Comments should explain why something is done, not what the code does, because the code already shows what. A comment that contradicts the code is worse than none, so update comments with the code."
  },
  {
   "t": "Code smells are warning signs of deeper problems: very long functions, huge classes, duplicated code, deep nesting, many parameters, magic numbers and boolean flag arguments. A smell does not prove a bug, but it says look here."
  },
  {
   "t": "Refactoring means changing the structure of code without changing its behavior. Do it in small steps with tests passing after each one, and never mix a refactor with a new feature in the same change."
  },
  {
   "t": "Replace magic numbers with named constants. 86400 means nothing, while SECONDS_PER_DAY = 86400 explains itself and is changed in one place."
  },
  {
   "t": "Guard clauses return early for bad or special cases so the main logic is not buried in nested if statements. Flat code is easier to read than code nested five levels deep."
  },
  {
   "t": "Technical debt is the cost of past shortcuts: the quick fix saves time now but makes every later change slower, like interest on a loan. Note it down and pay it off steadily instead of letting it pile up."
  },
  {
   "t": "A formatter (Prettier, Black, gofmt) fixes layout automatically, and a linter (ESLint, flake8, Ruff) flags likely mistakes and style problems. Running both on every save or commit ends arguments about style and catches bugs early."
  },
  {
   "t": "A good code review is small, kind and specific. Reviewers check correctness, clarity, tests and security, and ask questions instead of giving orders. Authors keep changes small so they can be reviewed properly."
  },
  {
   "t": "The boy scout rule: leave the code a little cleaner than you found it. Small, steady improvements beat occasional rewrites."
  },
  {
   "t": "function discount(user, total) {\n  if (!user) return 0;\n  if (total <= 0) return 0;\n  return user.isMember ? total * 0.1 : 0;\n}",
   "code": 1,
   "k": "guard clause early return nested if flat code js javascript example"
  }
 ],
 "Error handling and logging": [
  {
   "t": "Use try and catch (try and except in Python) around code that can fail, and catch the specific error you can handle. An empty catch block hides problems, so at least log the error or pass it on."
  },
  {
   "t": "Fail fast: check inputs at the edge of your program (forms, API requests, files) and stop with a clear error right away instead of letting bad data travel deeper and fail somewhere confusing."
  },
  {
   "t": "Languages handle errors differently. Exceptions jump up the call stack until something catches them. Go returns errors as values to check, Rust uses Result and Option types, and C often uses return codes. Whichever style you use, never ignore a failure."
  },
  {
   "t": "Custom error types with clear messages and context (what failed, which input, why) make bugs far quicker to find. 'Could not read config.json: file not found' beats 'Error'."
  },
  {
   "t": "Always clean up after errors. finally in JavaScript and Java, with in Python and try-with-resources in Java close files, connections and locks even when something throws."
  },
  {
   "t": "Log levels from least to most serious are DEBUG, INFO, WARN, ERROR and FATAL. Log with enough context to trace a problem (time, user or request ID, the values involved), and never log passwords, tokens or personal data."
  },
  {
   "t": "Show users a friendly message and keep technical details, such as stack traces, in the logs. Exposing stack traces on a public site helps attackers and confuses everyone else."
  },
  {
   "t": "Null and undefined cause many crashes (null was called a billion-dollar mistake by its inventor, Tony Hoare). Check for them, use optional chaining (user?.name) and defaults (name ?? 'guest') in JavaScript, and Optional or nullable types in typed languages."
  },
  {
   "t": "try:\n    n = int(input(\"Number: \"))\nexcept ValueError:\n    print(\"That is not a number\")\nelse:\n    print(n * 2)\nfinally:\n    print(\"done\")",
   "code": 1,
   "k": "try except finally python error handling input int number"
  }
 ],
 "Performance and memory": [
  {
   "t": "Measure before you optimize. Use a profiler or simple timers to find the slow part, because guesses are usually wrong. Knuth's warning is that premature optimization is the root of much evil: make it work and make it clear first."
  },
  {
   "t": "The biggest speed-ups usually come from a better algorithm or data structure, fewer database or network calls, and caching, not from tweaking individual lines. Going from O(n^2) to O(n log n) beats any micro-tuning."
  },
  {
   "t": "Caching stores the result of expensive work so it can be reused. Memoization caches a function's results by its arguments. The hard part is cache invalidation: knowing when stored data is out of date and must be refreshed."
  },
  {
   "t": "The N+1 query problem is fetching a list with one query and then running one more query for each item, so 100 items cost 101 queries. Fix it with a join or by loading the related data in one batch."
  },
  {
   "t": "Lazy loading delays work until it is needed, such as loading images only when they scroll into view, and pagination loads a long list a page at a time. Both keep start-up fast and memory use low."
  },
  {
   "t": "Garbage collection is the runtime automatically freeing objects that nothing refers to any more (Java, JavaScript, Python, Go, C#). A memory leak still happens when objects stay referenced by mistake, for example event listeners never removed, growing caches or global lists."
  },
  {
   "t": "In languages with manual memory (C and C++) you free what you allocate, and mistakes cause leaks, use-after-free and buffer overflows, which are serious security flaws. Rust avoids them with ownership rules checked at compile time."
  },
  {
   "t": "Web page speed: send less (compress images, minify and compress files), load scripts with defer, cache static files, avoid layout-shifting content, and use a CDN. Google's Core Web Vitals measure loading, responsiveness and visual stability."
  },
  {
   "t": "Batch small operations into one: one database insert of 500 rows is much faster than 500 separate inserts, and updating the screen once for many changes is faster than updating it for each."
  },
  {
   "t": "const memo = fn => {\n  const cache = new Map();\n  return x => {\n    if (!cache.has(x)) cache.set(x, fn(x));\n    return cache.get(x);\n  };\n};\nconst slowSquare = memo(x => x * x);\nconsole.log(slowSquare(9), slowSquare(9));",
   "code": 1,
   "k": "memoize cache function results speed up js javascript"
  }
 ],
 "Regular expressions": [
  {
   "t": "A regular expression (regex) is a compact pattern for matching text. It is used to search, validate input such as emails and phone numbers, extract pieces and find and replace. Most languages share a similar syntax."
  },
  {
   "t": "Basic symbols: . matches any character, \\d a digit, \\w a letter, digit or underscore, \\s whitespace, ^ the start and $ the end of the text, and \\b a word boundary. Capital versions (\\D, \\W, \\S) mean the opposite."
  },
  {
   "t": "Quantifiers say how many: * means zero or more, + one or more, ? zero or one, {3} exactly three and {2,4} two to four. Adding ? after a quantifier makes it lazy, taking as little as possible instead of as much as possible (greedy)."
  },
  {
   "t": "Character classes match one character from a set: [abc] is a, b or c, [a-z] is a lowercase letter, and [^0-9] is anything except a digit. A vertical bar means or: cat|dog matches either word."
  },
  {
   "t": "Parentheses make a group. (\\d+)-(\\d+) captures two numbers that you can use later as $1 and $2 (or \\1 and \\2), and (?:...) groups without capturing. Special characters like . + * ? ( ) [ ] need a backslash to match literally."
  },
  {
   "t": "Useful patterns: a five-digit ZIP is ^\\d{5}$, a simple email check is ^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$, and a hex colour is ^#[0-9a-fA-F]{6}$. A perfect email regex does not exist, so confirm real addresses by sending a message."
  },
  {
   "t": "Regex has limits: do not use it to parse HTML or other nested formats, because a real parser is safer. Badly written patterns can also cause catastrophic backtracking that freezes a program, especially nested quantifiers like (a+)+."
  },
  {
   "t": "Build regexes step by step and test them in a live tool such as regex101.com, which explains each part. Start with a simple pattern, add one piece at a time, and test on both text that should match and text that should not."
  },
  {
   "t": "const m = \"Order 4521 shipped\".match(/\\d+/);\nconsole.log(m[0]);\nconsole.log(\"2026-10-26\".replace(/(\\d+)-(\\d+)-(\\d+)/, \"$3/$2/$1\"));",
   "code": 1,
   "k": "regex match replace extract number date js javascript"
  },
  {
   "t": "import re\ntext = \"Mail sam@example.com or kim@test.org\"\nprint(re.findall(r\"[\\w.]+@[\\w.]+\\.\\w+\", text))\nprint(re.sub(r\"\\s+\", \" \", \"too   many    spaces\"))",
   "code": 1,
   "k": "regex findall sub email extract replace python re"
  }
 ]
};
