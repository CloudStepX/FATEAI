# Fate Tree (Android app)
Offline AI library app. The app has no INTERNET permission, so it cannot go online.

## Get the APK
1. Create a new GitHub repo and upload everything in this folder (keep the .github folder).
2. Open the Actions tab. The "Build APK" workflow runs on every push (about 3-5 minutes).
3. Open Releases, download FATE-TREE.apk, install it (allow "install unknown apps").

The app is the same files as the web version, bundled in app/src/main/assets. Export saves your library through the Android file picker.
The icon is a placeholder copied from FATE GBA; replace the mipmap-* images to change it.

## Language layer (Phase 1)
- Understands synonyms (built in, plus "big means large" teaches new ones) and learns related words from the library itself.
- Detects intent: greetings, thanks, questions (what/how/why...), commands, statements.
- Composes answers as readable sentences, merging leaves and removing near-duplicates, instead of dumping raw lines.
- New starter cluster "Language" (grammar, punctuation, tone, vocabulary, writing).

## Brain regions (Phase 2)
Every cluster is a self-contained region with its own index. On each question:
1. **Router** scores every region cheaply and wakes only the best few (lateral inhibition). Memory always stays awake.
2. **Spreading activation**: awake regions pass activation to neighbours along synapses (shared vocabulary + learned wiring).
3. **Slow path**: if the fast path finds nothing good, the search widens to every region, so accuracy is never traded for speed.
4. **Hebbian learning**: regions that answer together get wired together (the "synapses" count in the header). Unused wiring fades. Frequently used regions get a small routing boost. Saved on the device (IndexedDB key "links").
5. **Incremental updates**: remembering, forgetting, teaching and feeding text re-index only the changed region, so they stay instant on a huge library. Feeding a whole folder does one full rebuild at the end.

Measured on a synthetic 48,000-leaf library (desktop Node): common-word questions 263 ms -> 31 ms, storing a memory 3,250 ms -> 2 ms, startup build 3.6 s -> 1.4 s. A 160,000-leaf library built in about 6 s and still answered every test question correctly. Phones are slower than desktop, so expect a few times these numbers.

## Clusters talking (Phase 3)
- Every awake cluster reports how sure it is. The leader then says what it is missing and asks: awake clusters first, then its wired neighbours (strongest synapses first), then every other cluster. Sleeping clusters answer a narrow question without a full search.
- If nobody knows a word, the answer says so ("nobody knows X yet") so you know what to teach.
- Tap "how the clusters talked" under an answer to read the conversation. It opens by itself when more than one cluster took part. Every conversation strengthens the synapses between the clusters involved.

## Tesseract clusters (Phase 4)
Every cluster is now a 4D square: a tesseract with four equal sides. A small cluster is 2x2x2x2 (16 cells), a medium one 4x4x4x4 (256 cells), a big one 8x8x8x8 (4,096 cells).
- Each leaf gets four coordinates from four random projections of its (idf-weighted) words, cut into equal-frequency bins, so every axis is balanced and no cell becomes a hot spot.
- Leaves are stored cell by cell (Morton order), so each cell is one contiguous block of ids.
- **Tesseract skip:** for a question with 3 or more words, a leaf can only reach 50% word coverage if its cell holds at least half of the question's words. Every other cell is skipped. Short questions (1-2 words) still scan normally.
- If the leading cluster is missing a word, it now also asks its own other branches first (cheap, from its own index).
- Word associations ("related words") are cached per cluster and refreshed only when that cluster changes. Same results, no repeated work.
- To compare with the old behaviour, set `window.TESSERACT=false` before brain.js loads.

Measured on desktop Node (a phone will be a few times slower):
- Leaves scanned per question: about 3x fewer (7,200 -> 2,500 on a 48,000-leaf library).
- Question time on 48,000 leaves: about 4.3 ms -> 3.1 ms. Small libraries: no real difference, they were already instant.
- Answer quality (137 questions built from the real starter clusters): right sentence returned 134 -> 135, right branch the same. On synthetic libraries with known answers: within 3 questions of the old engine.
- Cost: building the index at startup is about 1.8x slower (0.54 s -> 1.0 s on 48,000 leaves). Feeding a big cluster re-lays it out.
- The grid itself does not group similar leaves much better than chance. The speed-up comes from equal, balanced, fine cells that let a question rule cells out exactly, not from the geometry being 4D.

## Fiber (Phase 5)
A direct line from every word to each cluster that holds it (and how many leaves it has there). A question no longer walks every cluster to find where its words live:
- **Router** reads the lines for the question's words instead of scoring every cluster.
- **Neighbours** (shared vocabulary between clusters) are counted through the lines instead of comparing every pair.
- **Asking other clusters** and the **slow wide search** only visit clusters that hold a word you are missing.
- The fiber follows every edit (remember, forget, feed, teach, delete) and always equals a full rebuild.

Answers are identical to Phase 4 (checked on the starter clusters and synthetic libraries, including synapses). Measured on desktop Node:
- 300 clusters: 4.3 -> 2.2 ms per question. 1,000 clusters: 11.4 -> 4.1 ms.
- Few big clusters (20): no real gain, they were already quick.
- Cost: about +2% startup time and +1 MB per 48,000 leaves.
- The cluster-neighbour calculation was still the biggest cost with many clusters; see the next section.

## Neighbour cache (Phase 5b)
Neighbours (which clusters share vocabulary with this one) were about 75% of a question's time with hundreds of clusters. Two changes, answers identical:
- **Counts survive edits.** The shared-word counts between clusters are cached per cluster. Before, any edit threw all of them away. Now an edit only updates the edited cluster's entry in the other rows, and only when a neighbour is next read (several edits in a row, such as feeding, are applied once). A full rebuild still starts clean.
- **Faster first calculation.** Counting uses a small list of cluster numbers per word, kept next to the fiber, and counts into a typed array instead of a Map (about 12x faster for the counting step).

Measured on desktop Node, synthetic library of 300 clusters / 48,000 leaves, per question:
- No edits: 2.56 -> 1.35 ms.
- An edit every 10 questions: 4.41 -> 2.02 ms.
- 1,000 clusters, an edit every 10 questions: 6.57 -> 3.85 ms (neighbours are still about 70% of it here, since every cluster has to be calculated once).
- Startup build: no measurable change (within noise). An edit itself costs about 1.5 ms more than before at 300 clusters (the removal from the per-word lists).

Checked against Phase 5: same answers, same neighbour lists and same synapses on the starter clusters (174 inputs including remember, forget and teach) and on synthetic libraries through 30 edits. A randomised test confirms the cached counts always equal a full recount after bursts of adds, edits and deletes. Scripts are in `tools/` (`node tools/equiv.js`, `invariant.js`; `bench2.js <brain.js> <clusters> <leaves per cluster> <questions> <edit every N>`). `tools/brain.phase5.js` is the previous engine, kept for the comparison.

## How the memory works
Clusters are the app's memory. On every message it reads all of them, then:
- "my name is Sam", "I like dark mode" or "remember that ..." is stored in the Memory cluster; "forget ..." removes it; "what do you know about me" lists it.
- Memory is read automatically on each question and shown as "from memory".
- Short follow-ups ("tell me more", "what about grid") reuse the last question as context; "more" skips leaves already shown.
- If one leaf cannot cover the whole question, it fills the gap from other (related) clusters.
- Tap "how I reasoned" under an answer to see the steps.

## More language and logic (starter content)
- **Language** grew from 22 to 112 leaves: grammar, sentence errors, punctuation, tone, vocabulary and word parts, writing, spelling, figures of speech, reading, speaking.
- **Logic** is a new starter cluster (101 leaves): basics, deduction, induction, fallacies, Boolean logic (with code), sets and counting, probability, critical thinking and biases, problem solving, programming logic (with code), puzzles.
- Existing installs get the new leaves once, automatically, on the next launch (nothing you taught or deleted is overwritten; leaves you deleted from the starters may come back once). "Restore starter clusters" on the Tree tab does the same on demand.

## Mega Library (all clusters merged)
Every cluster is now a **section** of one cluster called **Library**. A branch is stored as `Section / Branch`, so nothing is lost, and the Tree tab shows the sections as tabs.
- **Everything learned is filed in the Library automatically:** fed text and files (into the section you name, or the section that matches the topic, or a new one), taught answers (section *Taught*) and imported libraries.
- **Memory stays separate** (your name, likes, notes). It must stay awake on every question, so it appears as a tab in the Tree view but is stored apart.
- **Existing installs upgrade once, automatically:** old clusters are folded into sections, nothing is deleted. The learned synapse wiring between old clusters is reset, because there is now one cluster.
- **Switch:** `window.MEGA=true` in index.html turns it on. Set it to `false` and the Library is split back into clusters on the next launch. Without the switch the engine behaves exactly as in Phase 5b (`node tools/equiv.js` still passes).
- **Trade-off:** with one big cluster the routing, synapse and cluster-talk features have little to do, and every edit re-indexes the whole Library. Questions stay about as fast. Teaching or feeding gets slower as the Library grows (desktop Node: about 20 ms at 800 leaves, 170 ms at 9,600, 0.9 s at 48,000; a phone is a few times slower). `node tools/bench_mega.js 300 160` measures it.
- Tests: `node tools/mega.js` (folding, unfolding, filing, answers equal to the normal mode).

## Dictionary (starter content)
A starter cluster, **Dictionary** (361 leaves), appears as a section of the Library. Branches:
- **Question words**: who, whom, whose, what, which, where, when, why, how, how much/many/long/often.
- **Word lists grouped by question**: Who (people words), What (thing and idea words), Where (place words), When (time words), Why (reason words), How (method words).
- **Important words**: analyze, evaluate, infer, bias, evidence and similar.
- **Science words**, **Math words**, **Feeling words**, **Action words**, **Society and money words**, and **Opposites** ("The opposite of hot is cold.").
- Each word is one leaf: "Word (part of speech) means ...", so "what does ancestor mean" finds it.
- The engine treats who/what/where/when/why/how as filler words and ignores them when matching, so question-word leaves are found through the words around them (person, place, time, reason, method, question).
- Existing installs get the new leaves once, automatically, on the next launch. To add your own words, use the Feed tab (section "Dictionary") or teach them.

## Mathematics (starter content)
A starter cluster, **Mathematics** (109 leaves), appears as a section of the Library. Branches: Arithmetic, Fractions decimals and percentages, Algebra, Geometry, Statistics and probability, Advanced ideas (limits, derivatives, integrals, vectors, matrices, sequences, proof), and **Putting math to use** (36 how-to leaves with worked examples: discounts, sales tax, tips, splitting a bill, unit prices, simple and compound interest, the rule of 72, loan payments, budgeting, profit margin and break-even, scaling recipes, unit and temperature conversion, speed and fuel economy, paint, flooring and concrete, weighted averages, checking answers, mental math tricks, reading statistics in the news).
- Existing installs get the new leaves once, automatically, on the next launch (seed version mega-4).

## Coding (starter content)
A starter cluster, **Coding** (201 leaves), appears as a section of the Library. Branches: Programming basics, JavaScript, Python, Data structures, Algorithms, HTML and CSS, Databases and SQL, APIs and the web, Git and version control, Command line, Debugging and testing, Software design, Security basics, Android and Java, and **Putting coding to use** (how to learn, build a first app, ask for help, read docs, publish a site, save data, use AI tools safely, back up work).
- 35 leaves are copy-ready code snippets (tagged as code, shown when you ask how to build or write something). The JavaScript and Python snippets were syntax-checked, and the algorithm ones were run.
- Existing installs get the new leaves once, automatically, on the next launch (seed version mega-5).

## Programming Languages (starter content)
A starter cluster, **Programming Languages** (155 leaves), appears as a section of the Library. Branches:
- **Language basics**: machine code and assembly, high and low level, compiled and interpreted, static and dynamic typing, paradigms, markup versus programming languages, how a language works inside, how to choose one.
- **Language profiles** (51): who made it, when, and what it is used for. Python, JavaScript, TypeScript, Java, Kotlin, C, C++, C#, Go, Rust, Swift, PHP, Ruby, Perl, Lua, R, MATLAB, Julia, Scala, Haskell, Lisp, Clojure, Erlang, Dart, Fortran, COBOL, BASIC, Pascal, Ada, Smalltalk, Prolog, Bash, PowerShell, SQL, HTML, CSS, XML, JSON, YAML, Markdown, regular expressions, GraphQL, LaTeX, Scratch, Solidity, WebAssembly, hardware description languages and esoteric languages.
- **Hello World in many languages** (29 snippets) and **Same idea, different syntax** (variables, if, loops, functions, lists, dictionaries, comments, classes, errors, null, equality, integer division).
- **Turning code into English**: a step-by-step method, a table of symbols and keywords in plain English, and worked examples for JavaScript, Python, SQL, CSS, regular expressions, HTML, JSON and shell commands.
- **Turning English into code**: a step-by-step method, a table of English phrases and the code they become, how to write a good request, and **Examples from requests** with working code.
- The Hello World snippets for C, C++, Python, JavaScript, Perl, Bash, Java, Go, Rust, PHP, Ruby, TypeScript and SQL (SQLite) were compiled or run and print `Hello, World!`. The 8 worked examples (Python and JavaScript) and the regular expression, SQL and JavaScript examples in "Turning code into English" were run too. The snippets for Swift, Kotlin, C#, Lua, R, PowerShell, Haskell, Scheme, Dart, Scala, Julia, Elixir, Pascal, Fortran, COBOL and BASIC were written by hand and not run (no compiler was available).
- Existing installs get the new leaves once, automatically, on the next launch (seed version mega-7).

## Code explainer (Phase 6)
Paste code into the Ask box (or write `explain this code:` followed by the code) and the app answers line by line in plain English, with a one-sentence summary. It is rule-based (`app/src/main/assets/explain.js`), runs on the device, never runs your code, and does not use the library.
- Reads Python, JavaScript, Java, C, C++, Go, Rust, SQL, CSS, HTML, JSON, regular expressions and common shell commands.
- Unusual code: lines the rules do not cover are shown as "(not understood)", with a count at the bottom.
- Short one-line shell commands and regular expressions need a lead such as `explain ls -la` or `what does ^\d{3}-\d{4}$ mean`, so ordinary questions are not mistaken for code.
- Normal questions are untouched: `node tools/explain_false_pos.js` checks that 22 ordinary questions are not treated as code, and `node tools/explain_test.js` prints the explanation for 24 sample inputs.
- Not done: it does not translate code between languages and does not learn from the library.
- Library seed version is now mega-7 (one new leaf in Turning code into English describes the feature). Service worker cache is fate-tree-v15.

## Design rule: nothing decorative
Every element on screen must do a job. What was removed and why:
- **Mind tab** (glowing brain, rotating tesseract, beams, twinkling nodes) and `mind.js`: it showed nothing the Tree tab cannot show in words. **It came back in Phase 8 on request, with jobs** (see below): every dot, line and corner is read from the library, tap a section for its numbers, and it shows which sections committed to your last build. Its two useful facts moved to the Tree tab: which sections share vocabulary ("Shares vocabulary with:" under the selected section, with the shared words as evidence, tap to jump) and which section answered your last question.
- **4D square pictures** in the Tree tab: a map of how the index is balanced, nothing you can act on. The tesseract still speeds up search; it just is not drawn.
- **Message fade-in, button press scaling, smooth scrolling, transitions**, the extra left bar on answers (alignment already separates you from the app), the accent colour and letter spacing on the title.
- **Emoji labels** (library, tree, brain). 
- **Header counts that do not help**: vocabulary terms, code-leaf count, "used N times", and the duplicate Library total in the Tree tab.
- **Scan time** ("scanned N leaves in N ms") moved from every answer into "how I reasoned".
- **Welcome text** now says what to do instead of describing the app's "mind".
- **👍/👎 ratings**: they silently nudged a hidden score and showed nothing. Removed. Correct answers now come from the engine itself (next section) and from teaching.
Seed version is mega-10 (replaces the outdated rating leaf with one about unknown words). Service worker cache is fate-tree-v17.

## Unknown-word guard
A word the library has never seen (not in any leaf, not a typo of one, not a synonym of one) cannot be matched, so the old engine dropped it and answered with a leaf about the rest of the question. Example: "what is the capital of zorbland" returned the dictionary entry for "capital" at 50%.
- If half or more of a question's words are unknown, the app now declines, names the unknown words ("I don't know "zorbland" yet") and offers the Teach box.
- If fewer are unknown, it still answers and adds a line: "Not in my library, so not answered: ...".
- Follow-ups that reuse the previous question's context are not declined.
- `node tools/unknown.js` checks it. On 2,108 questions built from the starter clusters, 2,061 answers are unchanged and the 47 that now decline all contain unknown words (code fragments glued together by the test generator). `node tools/equiv.js` still passes. `node tools/unknown.js` compares with the phase-5 engine and allows exactly those declines.

## CS Theory, Statistics and Data, Writing and Study Skills
Three new starter sections of the Library (267 leaves), each in its own file under `clusters/` and loaded from `index.html`:
- **CS Theory** (103 leaves): Big-O and complexity (growth rates, how to work out Big-O, amortized cost, data structure costs, P vs NP, the halting problem), Algorithm ideas, Computing basics (binary, hex, floating point, CPU, memory, stack and heap, compilers), Operating systems (processes, threads, scheduling, virtual memory, deadlock, Android's sandbox), Networking (layers, IP, subnets, ports, TCP vs UDP, handshake, routers), How the internet works (DNS, URLs, HTTP and status codes, HTTPS and TLS, CDNs, cookies) and Data formats (text, CSV, JSON, XML, YAML, Base64, image, audio and video formats, compression, dates, serialization).
- **Statistics and Data** (81 leaves): Descriptive statistics, Data and sampling (bias, correlation vs causation, p-values, confidence intervals, base rates), Reading charts, Spotting misleading numbers (relative vs absolute risk, cherry-picking, Simpson's paradox, truncated axes), Spreadsheet formulas (about 25 leaves: SUM, IF, COUNTIF, lookups, absolute references, errors, dates, text, SUMPRODUCT, pivot tables, SORT and FILTER) and Cleaning and preparing data.
- **Writing and Study Skills** (83 leaves): Essay structure, Writing process and style, Citing sources (APA, MLA, Chicago, plagiarism, paraphrasing, CRAAP test), Note-taking (Cornell, outline, mind map, Zettelkasten), Memory techniques (active recall, spaced repetition, method of loci, mnemonics, Feynman technique) and Study skills.
- Existing installs get the new leaves once, automatically, on the next launch (seed version mega-11). Service worker cache is fate-tree-v18.
- Checks: `node tools/equiv.js` and `node tools/mega.js` pass unchanged. 30 sample questions about the new content were asked in the real configuration (Mega Library, index.html load order) and 29 returned a leaf from the right section; "what is JSON" still leads with an existing Python snippet.
- Test change: `tools/unknown.js` used to require identical leaves between the phase-5 engine and the current engine on every generated question. With the new data, 7 of 2,642 vague generated questions (for example "tell me about check result") now pick a different leaf that matches equally well. The test now allows under 0.5% of such questions and still requires every decline to name an unknown word.
- The numbers, formulas and facts were written from general knowledge and checked by hand; the spreadsheet formulas were not run in a spreadsheet.

## More coding: Programming Concepts and Building Software
Two new starter sections of the Library (220 leaves, 31 of them copy-ready code snippets), going deeper than the Coding section. Seed version is now mega-12 and the service worker cache is fate-tree-v19.
- **Programming Concepts** (93 leaves): Object-oriented programming (classes, encapsulation, inheritance, polymorphism, composition, SOLID), Functional programming (pure functions, immutability, map, filter, reduce, closures, currying), Design patterns (singleton, factory, observer, strategy, decorator, adapter, MVC, dependency injection), Concurrency and async (event loop, promises, async and await, Promise.all, asyncio, threads, debounce, retry with backoff), Clean code and refactoring, Error handling and logging, Performance and memory (profiling, caching, N+1 queries, garbage collection, memory leaks) and Regular expressions.
- **Building Software** (127 leaves): Testing in depth (test pyramid, TDD, mocks, edge cases, flaky tests), Git workflows (merge vs rebase, conflicts, stash, undoing, .gitignore, commit messages, bisect), Packages and dependencies (npm, pip, semantic versioning, virtual environments), CI/CD and Docker (GitHub Actions, artifacts, secrets, Dockerfile, deployment), Building Android apps (project layout, manifest, permissions, Gradle, SDK versions, signing and keystores, installing APKs, activity lifecycle, WebView, adb logcat, Play Store), Front-end frameworks and the web (components, React hooks, TypeScript, bundlers, responsive design, accessibility, storage, CORS, PWA), APIs and authentication (REST, GraphQL, JWT, OAuth, API keys, rate limiting, password hashing), Databases in depth (keys, joins, normalization, indexes, ACID, NoSQL, SQL injection, migrations), Security in depth (OWASP Top 10, XSS, CSRF, access control, secrets) and Game development basics (game loop, delta time, sprites, tile maps, collision, state machines, how an emulator works, Game Boy Advance specs).
- Code snippets were checked: the Python, JavaScript and SQL examples were run (or syntax-checked when they need a browser or server), the workflow YAML and AndroidManifest XML were parsed. The Dockerfile, the Java WebView snippet and the React component were written by hand and not compiled.
- Checks: `node tools/equiv.js` and `node tools/mega.js` pass unchanged, and `node tools/unknown.js` passes (4 of 3,080 vague generated questions now pick a different but equally matching leaf). 45 sample questions about the new content were asked in the real configuration, and 41 returned the expected leaf. Of the other four, "what is test driven development" returned the older Coding leaf on the same topic, "how do I test for collision" and "retry with backoff" returned the matching code snippet first, and "what is DRY" returned a Logic leaf (an existing quirk; "what does DRY mean" works).

## Create (Phase 7)
A fourth tab, **create**: describe what you want in plain words and the app works out what it is. Rule-based, on the device, no network, no language model. It cannot invent from nothing; it matches your words to building blocks (later phases assemble them from the library).
- **Phase 1 (done): understand.** `create.js` reads a description and returns the route (small app, document, or code), the kind (to-do, timer, calculator, flashcards, picker, notes, expense tracker, website, letter, agenda, schedule and more), title ("called X"), items ("with a, b and c" or after a colon), colour, time ("10 minute"), language, and who a document is to and what it is about. Anything it does not recognise is said so plainly.
- **Phase 2 (done): find what the library knows.** `Create.gather(lib, parsed)` turns the description into 1-2 search queries (for example a to-do list also searches "todo list app build html single file task"), looks them up, and returns up to 6 pieces with their section, branch and match %. Code pieces come first for apps and code, text pieces first for documents. Matches under 50% are dropped (80% when the request is not recognised). Words you typed as items (milk, eggs) are not reported as unknown. The tab shows the pieces with a Copy button on code.
- The look-up never disturbs the Ask tab: it uses no follow-up context, and the Ask context, usage counts and synapses are restored afterwards. It never writes Memory (it does not use the store/forget path).
- Tests: `node tools/create_test.js` (40 descriptions), `node tools/create_gather.js [-v]` (library look-up, Ask and Memory untouched). 
- **Phase 3 (done): assemble.** `build.js` turns the understood request into one self-contained HTML file with its own look (fonts, colours, corners differ per kind). Apps: one-page website, to-do and shopping lists, counters and habit trackers (7-day bars, streak), countdown timer, pomodoro, stopwatch, calculators (tip, bill split, loan, BMI, discount, tax, percent, basic keypad), unit converter (length, weight, temperature, volume, speed, time), flashcards (flip or type the answer), notes and journal, random pickers (names, dice, coin), number guessing game, password generator, text tools, expense tracker. Documents (plain text with [brackets] to fill in): letter, cover letter, resignation, email, agenda, minutes, schedule, workout plan, outline, speech, invitation. One-page websites (hero, about, offers, contact; no script, [brackets] to fill in) are built too.
- **Phase 4 (done): preview and refine.** The result runs in an iframe with `sandbox="allow-scripts"` only, plus a Content-Security-Policy inside the page (no network, no images from outside). Follow-ups rebuild from a saved spec: make it blue, add a reset button, rename it X, dark or light mode, bigger or smaller text, add or remove items, make it 5 minutes, address it to X (documents), undo, start over. A new description replaces the current build.
- **Phase 5 (done): keep and learn.** Copy; Save file (Android file picker through `FateApp.saveFile`, a download in a browser); Save to library, which stores a readable note plus the finished file under the section **Created**. The next request of the same kind starts from the saved colour, mode, size and reset button (never its title or items) and says so. Saving the same thing again replaces it. Matched library pieces are listed under "Matched in the library"; only your own saved creations change a build.
- **Phase 6 (done): test and package.** `node tools/create_build_test.js` (1,199 checks: every kind builds, scripts parse, no network calls, hostile text cannot break out, follow-ups, save and reuse, Ask and Memory untouched). `python3 tools/e2e_create.py` drives the real app in headless Chromium (Ask, Feed, Tree and the full Create flow, 40 checks). `node tools/gen_func_apps.js` then `python3 tools/template_func_test.py` checks calculator maths, timer, flashcards, XSS and CSP inside the sandbox. Service worker cache is fate-tree-v21, app version 1.1.
- Known: `MainActivity.java` was not compiled where this was built; the GitHub workflow compiles it.

## Mind and commits (Phase 8)
The whole system now sits on its real 4D scale, and the look follows a glowing neural-network brain: cyan and violet on black, circuit floor, one hub per section.

**Mind tab** (`mind.js`). The Library is one tesseract (8x8x8x8 = 4,096 cells for a big library; 2x2x2x2 or 4x4x4x4 for small ones).
- The brain is that grid. Each dot is a filled cell, each line joins two filled cells that are one step apart on one of the four axes. The grid is turned through the 4th dimension and projected, so it breathes. The dot colour is the section that holds most leaves in that cell.
- Each side hub is a section, drawn as its own rotating 2x2x2x2 tesseract (16 corners). A corner glows by how many of the section's leaves sit in that half of each axis.
- Sections that answered your last question glow and send travelling pulses to the brain. Tap a hub or its chip for the numbers: leaves, cells filled out of 4,096, corners used out of 16.
- The pad at the bottom is the **build's own tesseract**: four axes, 16 corners.
- Nothing is random: the same library draws the same picture (`mind.model` is tested). Reduced-motion draws one still frame.

**Commits** (`commit.js`). A build has four parts, one per axis of the build's 4D square: **Shape** (parts and layout), **Logic** (what it does), **Look** (colour and legibility), **Words** (labels and wording). For each part:
1. **Claim.** Every section bids through a normal library look-up. The best match at 50% or more commits to the part. Its leaf is shown as evidence, with its coordinates in the Library's own 4D grid. If nothing reaches 50%, the built-in rules keep the part and it does not count.
2. **Check.** The commit is tested against the finished file. Shape: doctype, page language, title, heading, main area. Logic: every script parses and none reaches for the network. Look: accent against page 3:1, button text on the accent 4.5:1, 44 px touch targets, reduced motion, keyboard focus. Words: no unlabelled buttons, no leaked "undefined". Documents get the matching text checks and a count of [brackets] left to fill.
3. **Repair.** If the accent cannot be seen on the page, the Look owner switches mode (only when you did not choose a mode), then darkens or lightens the accent in small steps until Look passes. A mode you chose is never overridden. Changing the colour or mode later drops the automatic fix and re-decides.
4. **Address.** A part counts as 1 when a section committed to it and its check passed. The four bits pick one of the 16 corners of the build's tesseract. 1·1·1·1 means all four parts were committed and kept.

Shown under every build on the Create tab, one row per part, with a "why" toggle for the evidence. "Show in mind" replays the commit as beams from the committing hubs to the pad.

What it does not do: the rule templates still write the file. The sections claim, prove and repair parts of it; they do not write code. The 4D grid places leaves by word projections, so the position of a leaf shows which part of the library it lives in, not a meaning.

What the checks found on the first run: the unit converter's button text was 4.2:1 on its violet accent (needs 4.5:1), and every named colour except a few is too faint as text on a light page. Both are now repaired automatically.

Tests: `node tools/commit_test.js [-v]` (441 checks: all 28 sample requests, repairs, explicit mode kept, broken file caught, 4D decode, mind model equals the engine's grid, Ask and Memory untouched). `tools/e2e_create.py` now has 45 checks including the mind tab and the commit rows. Everything else passes unchanged.
- `build.js` has one change: it honours a `accent` hex in the spec (used by the repair). New files: `commit.js`, `mind.js`. Look: `index.html` colours and the new tab. Service worker cache is fate-tree-v22.

## Cleanup (v23)
- Removed `Library.rate` (nothing called it since the thumbs ratings went), `tools/equiv_seed.js` (it failed on one case since Phase 3 and `tools/unknown.js` covers the same comparison), and exports nobody used (`Create.queriesFor`, `Build.canMake/CALCS/UNITS/DOCT/BUILDABLE/esc`, `Commit.AXES/claim/ratio`, `Explain.detect/codeLine/expr`).
- Checked and found clean: no unused functions or variables in any app script, no unused CSS, no `console` or TODO leftovers, no duplicate, empty or blank leaves in the 15 starter sections.

## Create reads the library and uses it (Phase 9)
Before this, Create looked things up in the library and only listed them; nothing from the library reached the build.
- **Taking information.** `Create.tips(lib, parsed)` runs a targeted look-up for the kind of build and keeps at most 2 sentences. A sentence is kept only if it is plain text, passes a topic test for that kind (for example a timer needs timer, setTimeout or setInterval words), has no code-like or placeholder words (`null`, `undefined`, brackets), is at most 240 characters, and is not one of your own saved creations. The tips go into the spec as `tips: [{t, s}]` (sentence and section).
- **Using it.** Apps get a closed "From the library" block under the main area (text escaped, with the section name beneath each tip). Documents get a "From the library:" list at the end. A build with no tips is unchanged. Follow-ups (colour, rename, undo) keep the tips; saving to the library stores them in the file's header. The Create tab says which sections the tips came from.
- **Understanding.** Words that Create itself recognises (countdown, timer, agenda and the other kind and document words) are no longer reported as "unknown". Before, "a 10 minute countdown timer" listed "countdown" as a word the library did not know.
- Tests: `node tools/tips_test.js [-v]` (149 checks: relevance and source section for 10 requests, all four commit parts still kept, escaping of hostile tip text, tips kept by follow-ups, no tips means no block, Ask state, library and Memory untouched).
- Not done: 1 of the 10 sample requests (a plain to-do list) finds no on-topic sentence, so it gets no tips. A tip is only added when the library has something on that topic. Service worker cache is fate-tree-v24.

## More knowledge: AI, Life and Work, Science (Phase 10)
Three new starter sections of the Library (241 leaves, 6 of them copy-ready code), each in its own file under `clusters/`. Seed version is now mega-13 and the service worker cache is fate-tree-v25. Existing installs get the new leaves once, automatically, on the next launch.
- **Artificial Intelligence** (85 leaves): AI basics (including what this app's rule-based AI is and is not, the Turing test, AI winters), Learning types (supervised, unsupervised, reinforcement, self-supervised, classification, regression, clustering, KNN, decision trees), Layers and weights (neurons, activation, backpropagation, gradient descent, CNN, RNN, transformer, attention, GPUs), Training and evaluation (data splits, overfitting, loss, epochs, accuracy, precision, recall, F1, confusion matrix, leakage, bias), Language models (tokens, pretraining, RLHF, context window, temperature, hallucination, embeddings, RAG, prompting, agents), Using AI well (prompting, checking answers, privacy, human in the loop, safety) and Code examples (train/test split, gradient descent, perceptron, metrics, KNN, softmax; all six were run).
- **Life and Work Skills** (84 leaves): Passwords and online safety, Time management (timeboxing, Pomodoro, Eisenhower matrix, time blocking), Meetings (agendas, minutes, action items), Personal finance (budgeting, emergency fund, compound interest, debt, credit score), Health and fitness basics (general guidance, workout plans, with a doctor reminder), Writing everyday messages (cover and resignation letters, invitations, complaints, thank-you notes) and Goals and planning (SMART goals, habits, decision matrix, premortem). These also fill the topics Create's tips could not find before (agenda, minutes, workout, passwords).
- **Science Basics** (71 leaves): Physics, Chemistry, Biology, Earth and space, Measurement and units, The scientific method.
- Facts, numbers and formulas were written from general knowledge and checked by hand. Health, money and legal leaves are general information, not advice.
- **Naming matters to the engine:** it indexes the section name and the branch name onto every leaf. The first drafts ("AI and Machine Learning", a branch called "Types of machine learning") made the real definitions lose to other leaves of the same section, so the section is called "Artificial Intelligence" and branch names avoid the words people ask about.
- Test: `node tools/knowledge_test.js [-v]` asks 37 plain questions and needs the right leaf in the top 3 for at least 90 percent (36 of 37 now). `tools/tips_test.js` expectations were updated: a pomodoro timer now takes its tip from Life and Work Skills.

## Skills: answers the Library cannot give (Phase 11)
Probing the real pipeline showed questions the Library could never answer correctly: "12*7+3" was reported as an unknown word, "15% of 80" returned a discount recipe, "who are you" and "what can you do" returned a fact about Earth's orbit, "what time is it" returned a dictionary entry, and "what is machin lerning" was declined. `skills.js` now runs before the Library look-up in the Ask tab (rule-based, on the device, never runs your code, never writes to the Library):
- **Calculate:** + - * / ^ mod, brackets, "times", "divided by", "squared", square root, "15% of 80", "20% off 80", "increase 80 by 15%", "what percent is 20 of 80". Uses its own parser, not `eval`. Division by zero and huge numbers get a plain explanation.
- **Convert units:** length, mass, volume, speed, time and temperature ("5 miles to km", "20 C to F", "how many minutes in an hour"). Different kinds of unit ("kg to km") are explained, not guessed.
- **Date and time:** read from the device clock.
- **About me:** who and what I am, what I can do, what I know (counts and section names come from the live Library), whether I am online or ChatGPT, how I work.
- **Honest limits:** weather, news, prices, scores, and general facts about places and officeholders get a clear "I cannot answer that, I am offline" with what I do know, instead of a confident wrong leaf.
- **Typo repair:** a word the Library has never seen is replaced by a close known word (edit distance 1 or 2) only if one exists; the reply says what was changed ("I read "lerning" as "learning""). Words that appear anywhere in the Library text, common filler words and Memory commands (remember, forget, my name is) are never touched.
- Skills never intercept ordinary questions: `tools/skills_test.js` (154 checks) includes 32 near-miss questions such as "what is a date in sql" and "how do I calculate a tip", all 37 questions of `knowledge_test.js`, and Memory commands. The browser test checks 7 of these through the real Ask box.
- Honest limit that remains: a question about something the Library does not contain still gets the closest leaf the engine finds, or a request to teach. The app cannot know everything; it now says so more often and answers the computable things exactly. Service worker cache is fate-tree-v26.

## Auto-feed (Phase 12)
The Feed tab now does the "feed my AI" work by itself, so any other AI (or you) can paste text in the format from `README-FOR-AI.md` and nothing needs checking by hand.
- **Reads the `SECTION: Name` line.** A paste that starts with `SECTION: Cooking` is filed in the section "Cooking" with no typing in the section box. The line in the text wins over the box. One paste can hold several `SECTION:` blocks and each goes to its own section.
- **Never stores a fact twice.** Every sentence is compared with the whole library (all sections, Memory excluded) by its meaningful words, ignoring case, punctuation and word order, and with the other sentences in the same paste. Known facts are skipped, and the status line says how many ("Fed 12 new leaves into Cooking. Skipped 5 already known."). Code blocks are compared by exact text. Feeding the same text twice adds nothing.
- **Joins existing sections and branches** even if capitals differ ("mathematics" goes into "Mathematics", "# algebra" into "Algebra"), instead of creating look-alikes.
- **Ignores `PART 1 OF 3` lines** that multi-part pastes end with.
- Works for pasted text, files and whole folders. Memory is never used for matching or filing.
- Test: `node tools/autofeed_test.js` (12 checks). All older tests still pass. Service worker cache is fate-tree-v27.

## Chat interface (v11)
Ask and Create are now one chat. Tabs: chat, feed, tree, mind.
- Message bubbles with avatar, typing dots and a send button.
- Modes under the chat: **Auto** (building requests like "make a timer" go to Create, follow-ups such as "make it purple" or "undo" change the last build, everything else asks the library), **Ask** (library only) and **Create** (always build).
- Chat history (last 40 messages, text only) is kept on the device and comes back when you reopen the app. "new chat" clears it.
