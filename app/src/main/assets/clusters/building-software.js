(window.SEED=window.SEED||{})["Building Software"]={
 "Testing in depth": [
  {
   "t": "The test pyramid says to have many fast unit tests at the bottom, fewer integration tests in the middle and a few slow end-to-end tests at the top. Fast tests get run often, and slow ones are saved for the important paths."
  },
  {
   "t": "A unit test checks one small piece, such as a function, on its own. An integration test checks that parts work together, such as your code with a real database. An end-to-end test drives the whole app like a user, with tools like Playwright, Cypress or Selenium."
  },
  {
   "t": "Structure a test as Arrange, Act, Assert: set up the data, run the code being tested, then check the result. One test should check one behavior, and its name should say what it expects, such as returns_zero_for_empty_cart."
  },
  {
   "t": "Test-driven development (TDD) follows a cycle: red (write a test that fails), green (write the least code that passes it) and refactor (clean up while the tests stay green). It keeps code testable and stops you building more than is needed."
  },
  {
   "t": "A fake, stub or mock stands in for a real dependency such as a network, database or clock, so tests are fast and repeatable. A stub returns canned answers, and a mock also records and checks how it was called. Do not mock so much that the test only tests the mocks."
  },
  {
   "t": "Test the edges, where bugs live: empty input, zero, one item, negative numbers, very large values, null, duplicates, unicode characters and exact boundaries such as the last valid index (off-by-one errors)."
  },
  {
   "t": "Code coverage is the percentage of code lines that tests run. Low coverage shows untested areas, but high coverage does not prove the tests are good, because a test can run code without checking anything."
  },
  {
   "t": "A flaky test passes and fails at random, usually because of timing, shared state, randomness or the network. Fix or remove flaky tests, because a team that ignores red builds stops trusting all of them."
  },
  {
   "t": "Write a regression test whenever you fix a bug: first write a test that fails because of the bug, then fix it. The bug can never quietly come back."
  },
  {
   "t": "Common test tools: pytest and unittest for Python, Jest and Vitest for JavaScript, JUnit for Java and Kotlin, and Espresso for Android screens. Most can be run by CI on every push."
  },
  {
   "t": "import unittest\n\ndef add(a, b):\n    return a + b\n\nclass TestAdd(unittest.TestCase):\n    def test_adds_numbers(self):\n        self.assertEqual(add(2, 3), 5)\n\n    def test_negative(self):\n        self.assertEqual(add(-1, 1), 0)\n\nif __name__ == \"__main__\":\n    unittest.main()",
   "code": 1,
   "k": "unit test python unittest example assert write test"
  },
  {
   "t": "const assert = require(\"assert\");\n\nfunction add(a, b) { return a + b; }\n\nassert.strictEqual(add(2, 3), 5);\nassert.strictEqual(add(-1, 1), 0);\nconsole.log(\"all tests passed\");",
   "code": 1,
   "k": "unit test javascript assert node example write test"
  }
 ],
 "Git workflows": [
  {
   "t": "The everyday Git loop is git status (see what changed), git add (stage files), git commit -m \"message\" (save a snapshot) and git push (send commits to GitHub). git pull brings other people's commits down, and git fetch downloads them without merging."
  },
  {
   "t": "A branch is a separate line of work. git switch -c new-feature makes and moves to a new branch, and git merge new-feature brings it into the branch you are on. Short-lived branches that merge back often are easier than long-lived ones."
  },
  {
   "t": "Merge keeps the full history and adds a merge commit. Rebase replays your commits on top of another branch to make a straight line. Never rebase commits that other people have already pulled, because it rewrites history."
  },
  {
   "t": "A merge conflict happens when two branches changed the same lines. Git marks the file with <<<<<<<, ======= and >>>>>>>. Edit the file to keep the right version, delete the marker lines, then git add the file and commit."
  },
  {
   "t": "git stash saves your uncommitted changes and gives you a clean working folder, and git stash pop brings them back. It is handy when you must switch branches in the middle of work."
  },
  {
   "t": "Undoing things: git restore file throws away uncommitted changes to a file. git reset --soft HEAD~1 undoes the last commit but keeps the changes, and git reset --hard HEAD~1 deletes them. git revert makes a new commit that undoes an old one, which is the safe choice for shared history."
  },
  {
   "t": "git commit --amend replaces the last commit, to fix its message or add a forgotten file. Use it only before pushing. After others have the commit, make a new commit instead."
  },
  {
   "t": "A .gitignore file lists files Git should not track, such as node_modules, build output, .env files and editor settings. If a file is already tracked, adding it to .gitignore is not enough: run git rm --cached file to stop tracking it."
  },
  {
   "t": "A good commit message has a short summary in the imperative mood under about 50 characters (Fix login redirect), then an optional blank line and details explaining why. Small, focused commits are easier to review and to undo."
  },
  {
   "t": "A pull request asks the team to merge a branch. Others review it, automatic checks (CI) run, and it is then merged, often as a squash that combines the branch into one commit. It is the standard way to collaborate on GitHub."
  },
  {
   "t": "Releases use tags such as v1.4.0 that mark a commit. Semantic versioning numbers them MAJOR.MINOR.PATCH, so major means breaking changes, minor means new features and patch means bug fixes."
  },
  {
   "t": "Inspecting history: git log --oneline --graph shows a compact history, git diff shows changes, git blame shows who last changed each line, and git bisect finds the commit that introduced a bug by binary search through history."
  },
  {
   "t": "Never commit passwords, tokens or keys. If you do, treat the secret as leaked: revoke and replace it right away, because deleting the file in a later commit leaves it in the history."
  },
  {
   "t": "git switch -c my-feature\n# ...edit files...\ngit add -A\ngit commit -m \"Add search box\"\ngit push -u origin my-feature\n# open a pull request on GitHub, then after merging:\ngit switch main\ngit pull",
   "code": 1,
   "k": "git feature branch workflow commands push pull request how"
  },
  {
   "t": "node_modules/\ndist/\nbuild/\n.env\n*.log\n.DS_Store",
   "code": 1,
   "k": "gitignore file example node_modules env ignore files"
  }
 ],
 "Packages and dependencies": [
  {
   "t": "A package manager downloads and installs libraries and everything they depend on. npm, yarn and pnpm serve JavaScript, pip serves Python, Gradle and Maven serve Java and Android, Cargo serves Rust, and NuGet serves .NET."
  },
  {
   "t": "In a JavaScript project package.json lists the dependencies and scripts, and package-lock.json pins the exact versions installed so that every machine gets the same ones. The node_modules folder holds the installed code and is not committed to Git."
  },
  {
   "t": "Semantic versioning writes versions as MAJOR.MINOR.PATCH: a major change may break things, a minor one adds features compatibly, and a patch fixes bugs. In package.json ^1.2.3 allows updates up to but not including 2.0.0, and ~1.2.3 allows only 1.2.x patches."
  },
  {
   "t": "A Python virtual environment keeps each project's packages separate so projects do not clash. Create one with python -m venv .venv, activate it, install with pip, and record the packages in requirements.txt."
  },
  {
   "t": "Every dependency is code you are trusting, and it can contain bugs or malicious changes (a supply-chain attack). Add only what you need, pin versions, avoid brand-new releases of unknown packages, and run npm audit or pip-audit to find known vulnerabilities."
  },
  {
   "t": "Dev dependencies are needed only while building and testing (test tools, linters, bundlers), and runtime dependencies are needed when the app runs. Keeping them apart keeps production installs small."
  },
  {
   "t": "npm init -y\nnpm install express\nnpm install --save-dev vitest\nnpm run build\nnpm audit",
   "code": 1,
   "k": "npm install package json node init run commands javascript"
  },
  {
   "t": "python -m venv .venv\nsource .venv/bin/activate   # Windows: .venv\\Scripts\\activate\npip install requests\npip freeze > requirements.txt\npip install -r requirements.txt",
   "code": 1,
   "k": "python virtual environment venv pip install requirements"
  }
 ],
 "CI/CD and Docker": [
  {
   "t": "Continuous integration (CI) automatically builds and tests the code on every push, so a broken change shows up within minutes. Continuous delivery or deployment (CD) then automatically ships builds that pass."
  },
  {
   "t": "A GitHub Actions workflow is a YAML file in .github/workflows/. on says what triggers it (push, pull_request, workflow_dispatch for a manual run, schedule for a timer), jobs holds the work, runs-on picks the machine, and each step either uses a ready-made action or runs a shell command with run."
  },
  {
   "t": "A workflow job can produce an artifact, such as an APK or a build folder, and actions/upload-artifact saves it so you can download it from the run's page. A job can also create a GitHub release with the file attached."
  },
  {
   "t": "Secrets such as tokens and passwords are stored in the repository settings and read in a workflow as ${{ secrets.NAME }}. Never print them in logs or put them in the code. The built-in github.token lets a workflow act on its own repository, and the permissions block limits what it may do."
  },
  {
   "t": "Keep configuration out of the code: use environment variables for things that change between machines (database address, API keys, mode). The same code then runs in development, testing and production."
  },
  {
   "t": "A Docker image is a packaged, read-only template holding your app and everything it needs, and a container is a running copy of an image. Containers share the host kernel, start in seconds, and solve 'it works on my machine' by shipping the same environment everywhere."
  },
  {
   "t": "A Dockerfile lists the steps to build an image: start FROM a base image, COPY your files, RUN install commands and set the CMD to start. Put the lines that change least (installing dependencies) first, so Docker can reuse its cached layers."
  },
  {
   "t": "Useful Docker commands: docker build -t myapp . builds an image, docker run -p 3000:3000 myapp starts a container and maps a port, docker ps lists running containers and docker logs shows their output. A volume keeps data after a container is removed, and Docker Compose runs several containers together from one file."
  },
  {
   "t": "Where to deploy: a static site (HTML, CSS, JavaScript) can go on GitHub Pages or Netlify for free, an app with a server can run on a cloud platform such as Render or a rented VPS, and small functions can run serverless. Pick the simplest option that fits."
  },
  {
   "t": "Plan for failure: keep the ability to roll back quickly to the last good version, release small changes often, use feature flags to switch new features on gradually, and watch logs, error rates and alerts after each release."
  },
  {
   "t": "name: Build APK\non:\n  push:\n  workflow_dispatch:\njobs:\n  build:\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v4\n      - uses: actions/setup-java@v4\n        with: { distribution: temurin, java-version: '17' }\n      - uses: gradle/actions/setup-gradle@v4\n        with: { gradle-version: '8.9' }\n      - run: gradle assembleDebug --no-daemon\n      - uses: actions/upload-artifact@v4\n        with:\n          name: app-debug\n          path: app/build/outputs/apk/debug/app-debug.apk",
   "code": 1,
   "k": "github actions workflow yaml build android apk artifact upload"
  },
  {
   "t": "FROM node:20-alpine\nWORKDIR /app\nCOPY package*.json ./\nRUN npm ci\nCOPY . .\nEXPOSE 3000\nCMD [\"node\", \"server.js\"]",
   "code": 1,
   "k": "dockerfile docker image node app container build"
  }
 ],
 "Building Android apps": [
  {
   "t": "An Android project has these parts: app/src/main/java holds the code, res holds layouts, images, strings and icons, assets holds raw files such as an HTML app, AndroidManifest.xml describes the app, and the Gradle files describe how to build it."
  },
  {
   "t": "AndroidManifest.xml declares the app's name and icon, its activities (screens), the permissions it needs and which activity opens first, marked by an intent filter with the MAIN action and LAUNCHER category."
  },
  {
   "t": "Permissions: normal ones such as INTERNET are granted at install, while dangerous ones such as camera, microphone, location and contacts must also be approved by the user at run time. Ask only for what you need, because every permission is a reason for users to say no."
  },
  {
   "t": "Gradle is the Android build system. settings.gradle lists the modules, the root build.gradle sets plugin versions, and app/build.gradle sets the applicationId, compileSdk, minSdk, targetSdk, versionCode, versionName and the dependencies."
  },
  {
   "t": "minSdk is the oldest Android version your app supports, targetSdk is the version it is built and tested for (Google Play requires a recent one) and compileSdk is the API it is compiled against. versionCode is an integer that must rise with every update, and versionName is the text users see."
  },
  {
   "t": "gradle assembleDebug (or ./gradlew assembleDebug when the project has the wrapper) builds a debug APK at app/build/outputs/apk/debug/app-debug.apk, and assembleRelease builds a release APK, which needs a signing key."
  },
  {
   "t": "Every APK must be signed. Debug builds use an automatic debug key. Android installs an update only when it is signed with the same key as the installed version, so if you lose your release keystore you cannot update the app under the same identity. Back it up safely and keep it and its passwords out of public repositories."
  },
  {
   "t": "To install an APK, allow 'install unknown apps' for the app you open it from (a browser or file manager) and tap the file. With a computer, enable USB debugging and run adb install app.apk. Installing a new build with a different signing key over an old one fails until you uninstall the old one."
  },
  {
   "t": "An Activity is one screen of an app. Its lifecycle runs onCreate, onStart, onResume (visible and active), onPause, onStop and onDestroy. Rotating the screen destroys and recreates the activity by default, so save state you need to keep."
  },
  {
   "t": "A WebView shows web content inside an app, which lets an HTML, CSS and JavaScript project become an APK. Load bundled files with loadUrl(\"file:///android_asset/index.html\"), enable JavaScript and DOM storage (so localStorage works) in its settings, and be careful with addJavascriptInterface, which exposes native code to the page."
  },
  {
   "t": "adb logcat prints the device's logs, including your Log.d messages and crash traces. Filtering with adb logcat | grep AndroidRuntime shows crashes, and the first 'Caused by' line usually names the real problem."
  },
  {
   "t": "Kotlin is Google's preferred language for Android, and Java is still fully supported. Jetpack Compose is the modern way to build screens in code, and XML layouts are the older way. Sizes use dp (density-independent pixels) and text uses sp."
  },
  {
   "t": "Launcher icons live in res/mipmap folders for several screen densities (mdpi, hdpi, xhdpi, xxhdpi, xxxhdpi). Android Studio's Image Asset tool can generate them all from one picture."
  },
  {
   "t": "Common build failures: a Java version mismatch (Android Gradle Plugin 8 needs JDK 17), a missing SDK path, a wrong version of Gradle for the plugin, duplicate class errors from clashing libraries, and a missing manifest entry. Read the first error line of the build log, which names the cause."
  },
  {
   "t": "Publishing on Google Play needs a developer account, a signed Android App Bundle (AAB) rather than an APK, a privacy policy and store listing, and passing the review and testing requirements, which change over time, so check the current rules in the Play Console."
  },
  {
   "t": "<manifest xmlns:android=\"http://schemas.android.com/apk/res/android\">\n  <uses-permission android:name=\"android.permission.INTERNET\"/>\n  <application android:label=\"My App\" android:icon=\"@mipmap/ic_launcher\">\n    <activity android:name=\".MainActivity\" android:exported=\"true\">\n      <intent-filter>\n        <action android:name=\"android.intent.action.MAIN\"/>\n        <category android:name=\"android.intent.category.LAUNCHER\"/>\n      </intent-filter>\n    </activity>\n  </application>\n</manifest>",
   "code": 1,
   "k": "androidmanifest manifest internet permission activity launcher android"
  },
  {
   "t": "WebView w = new WebView(this);\nWebSettings s = w.getSettings();\ns.setJavaScriptEnabled(true);\ns.setDomStorageEnabled(true);\nw.loadUrl(\"file:///android_asset/index.html\");\nsetContentView(w);",
   "code": 1,
   "k": "webview android java load html assets local file javascript localstorage"
  }
 ],
 "Front-end frameworks and the web": [
  {
   "t": "A component is a reusable piece of user interface with its own markup, logic and style. Frameworks such as React, Vue, Angular and Svelte build pages from components. A library like React does one job (the view), while a framework such as Angular also decides how to structure the whole app."
  },
  {
   "t": "In React, props are inputs a parent passes to a component, and state is data the component owns. When state changes React re-renders the component and updates only the parts of the page that differ, using a virtual copy of the page (virtual DOM) to work this out."
  },
  {
   "t": "React hooks add features to function components: useState keeps a value, useEffect runs code after rendering (such as loading data) and useRef holds a value or element without causing a re-render. Hooks must be called at the top level of a component, not inside loops or conditions."
  },
  {
   "t": "TypeScript adds types to JavaScript, such as name: string, so mistakes are caught while writing the code. Browsers cannot run it directly, so it is compiled (transpiled) to plain JavaScript first."
  },
  {
   "t": "A bundler such as Vite or webpack combines many source files and packages into a few optimized files, minifies them (removes spaces and shortens names) and can split code so each page loads only what it needs."
  },
  {
   "t": "A single-page app (SPA) loads once and then changes the page with JavaScript, which feels fast but needs extra work for search engines and first load time. Server-side rendering (SSR) builds the HTML on the server first, as Next.js does."
  },
  {
   "t": "Responsive design makes one page work on every screen size: use flexible units, flexbox and grid, media queries such as @media (min-width: 600px), and design mobile-first by starting with the small screen. Include <meta name=\"viewport\" content=\"width=device-width, initial-scale=1\">."
  },
  {
   "t": "Accessibility means everyone can use the site: use semantic HTML (button, nav, main, label), write alt text for images, keep colour contrast high, make everything usable with a keyboard, and add ARIA attributes only when plain HTML cannot express the meaning."
  },
  {
   "t": "Browser storage options: localStorage keeps strings of around 5 MB per site until cleared, sessionStorage lasts until the tab closes, cookies are small and are sent to the server with every request, and IndexedDB stores large structured data. Never store passwords or secrets in any of them."
  },
  {
   "t": "CORS (cross-origin resource sharing) is a browser rule: a page may only call another origin if that server's response allows it with Access-Control-Allow-Origin headers. A CORS error is fixed on the server, not in your front-end code."
  },
  {
   "t": "A progressive web app (PWA) is a website that can be installed and work offline. It needs HTTPS, a manifest.json with a name and icons, and a service worker script that caches files."
  },
  {
   "t": "Component tips: keep components small, lift shared state up to the nearest common parent, give list items stable keys, and do not change state directly, always use the setter."
  },
  {
   "t": "import { useState } from \"react\";\n\nexport default function Counter() {\n  const [n, setN] = useState(0);\n  return <button onClick={() => setN(n + 1)}>Clicked {n} times</button>;\n}",
   "code": 1,
   "k": "react counter usestate button click example jsx"
  }
 ],
 "APIs and authentication": [
  {
   "t": "A REST API models things as resources with URLs, such as /users/42, and uses HTTP methods as the verbs: GET to read, POST to create, PUT or PATCH to update and DELETE to remove. It is stateless, so each request carries everything the server needs."
  },
  {
   "t": "GET, PUT and DELETE are idempotent, meaning repeating the same request has the same effect as sending it once, while POST is not, so a repeated POST may create duplicates. This is why retries need care."
  },
  {
   "t": "Good API design uses nouns in URLs, plural names (/orders), consistent JSON field names, the correct status codes, pagination for long lists (?page=2&limit=20), versioning (/v1/) and clear error messages that say what was wrong."
  },
  {
   "t": "GraphQL has one endpoint and the client asks for exactly the fields it needs, which avoids fetching too much or too little. WebSockets keep a two-way connection open for live data, and a webhook is the reverse of polling: the other service calls your URL when something happens."
  },
  {
   "t": "Authentication is proving who you are (a password, a code, a fingerprint), and authorization is what you are allowed to do once known. Check authorization on the server for every request, because the client can be altered."
  },
  {
   "t": "Sessions store login state on the server and give the browser a session ID in a cookie. Token-based login gives the client a signed token, often a JWT, that it sends with each request. Each has trade-offs, but both need HTTPS."
  },
  {
   "t": "A JSON Web Token (JWT) has three Base64 parts: header, payload and signature. The signature proves it was not altered, but the payload is only encoded and not encrypted, so anyone can read it. Never put secrets in it, and give it a short expiry."
  },
  {
   "t": "OAuth 2.0 lets an app act on your account at another service without ever seeing your password, as in 'Log in with Google'. You approve access, and the app receives a limited, revocable token."
  },
  {
   "t": "An API key identifies the app calling an API, and it is a secret. Keep it on the server or in environment variables, never in front-end code, public repositories or an APK, where anyone can copy it. If one leaks, revoke it and make a new one."
  },
  {
   "t": "Rate limiting caps how many requests a client can make in a period, and the server answers 429 Too Many Requests when it is exceeded. Clients should slow down and retry later, using the Retry-After header if present."
  },
  {
   "t": "Passwords must be stored as salted hashes made with a slow algorithm such as bcrypt, scrypt or Argon2, never as plain text or a fast hash like plain MD5 or SHA-256. Add two-factor authentication (2FA) for important accounts."
  },
  {
   "t": "async function postJSON(url, data, token) {\n  const res = await fetch(url, {\n    method: \"POST\",\n    headers: {\n      \"Content-Type\": \"application/json\",\n      \"Authorization\": \"Bearer \" + token\n    },\n    body: JSON.stringify(data)\n  });\n  if (!res.ok) throw new Error(\"HTTP \" + res.status);\n  return res.json();\n}",
   "code": 1,
   "k": "fetch post json authorization bearer token api request send data js javascript"
  }
 ],
 "Databases in depth": [
  {
   "t": "A relational database stores data in tables of rows and columns. A primary key uniquely identifies each row, and a foreign key is a column that points to a row in another table, such as orders.user_id pointing to users.id."
  },
  {
   "t": "Relationships: one-to-many (one user has many orders) uses a foreign key on the many side, and many-to-many (students and courses) needs a third join table holding both keys. Drawing the tables first saves trouble later."
  },
  {
   "t": "Normalization organizes tables so each fact is stored once. Store a customer's address in one place and refer to it by id, instead of copying it onto every order, so a change is made in one spot and the data cannot contradict itself."
  },
  {
   "t": "A JOIN combines rows from two tables. INNER JOIN keeps only rows that match in both, LEFT JOIN keeps every row from the left table and fills in nulls where there is no match, and GROUP BY with SUM or COUNT summarises the result."
  },
  {
   "t": "An index works like a book's index: it lets the database find rows without scanning the whole table. Indexes speed up reads on the columns you filter or join on, but they use space and slow down writes, so add them where queries are slow, not everywhere."
  },
  {
   "t": "A transaction groups steps so that all happen or none do. ACID stands for Atomicity (all or nothing), Consistency (rules stay true), Isolation (transactions do not see each other's half-finished work) and Durability (committed data survives a crash). A bank transfer needs this."
  },
  {
   "t": "NoSQL databases trade fixed tables for other shapes: document stores such as MongoDB hold JSON-like records, key-value stores such as Redis are very fast lookups and caches, column stores handle huge analytics, and graph databases model relationships. Pick by how the data is used."
  },
  {
   "t": "SQL injection happens when user input is pasted into a query string, so input like ' OR '1'='1 changes the query. Prevent it with parameterized queries (placeholders such as ? or $1) so input is always treated as data, never as SQL."
  },
  {
   "t": "Migrations are small versioned scripts that change the database structure (add a column, create a table) and can be run in order on any copy of the database. They keep development, test and production in step, and they are kept in Git with the code."
  },
  {
   "t": "An ORM (object-relational mapper) such as SQLAlchemy, Prisma, Hibernate or Room lets you work with tables as objects. It saves typing and helps prevent injection, but it can hide slow queries, so check the SQL it produces."
  },
  {
   "t": "Back up databases regularly and test restoring from the backup, because a backup you have never restored is only a hope. SQLite keeps a whole database in one file, which makes it a good fit for apps and small projects."
  },
  {
   "t": "CREATE TABLE users (id INTEGER PRIMARY KEY, name TEXT NOT NULL);\nCREATE TABLE orders (id INTEGER PRIMARY KEY, user_id INTEGER REFERENCES users(id), total REAL);\n\nSELECT users.name, SUM(orders.total) AS spent\nFROM users\nJOIN orders ON orders.user_id = users.id\nGROUP BY users.id\nORDER BY spent DESC;",
   "code": 1,
   "k": "sql join group by sum total per user tables create select"
  },
  {
   "t": "import sqlite3\n\ndb = sqlite3.connect(\":memory:\")\ndb.execute(\"CREATE TABLE users (id INTEGER PRIMARY KEY, name TEXT)\")\nname = \"Sam'; DROP TABLE users;--\"\ndb.execute(\"INSERT INTO users (name) VALUES (?)\", (name,))\nprint(db.execute(\"SELECT name FROM users WHERE id = ?\", (1,)).fetchone())",
   "code": 1,
   "k": "sqlite3 parameterized query placeholder sql injection safe python"
  }
 ],
 "Security in depth": [
  {
   "t": "The OWASP Top 10 is a widely used list of the most serious web application risks, including broken access control, cryptographic failures, injection, insecure design, security misconfiguration, vulnerable components and authentication failures. It is a good checklist for any web project."
  },
  {
   "t": "Cross-site scripting (XSS) is when an attacker gets their script to run in other users' browsers, usually through text your site displays without escaping. Prevent it by showing user text with textContent instead of innerHTML, escaping output and setting a Content Security Policy."
  },
  {
   "t": "Cross-site request forgery (CSRF) tricks a logged-in user's browser into sending an unwanted request. Defend with SameSite cookies and anti-CSRF tokens on actions that change data."
  },
  {
   "t": "Broken access control is the number one web risk: users reaching data or actions they should not, for example by changing an id in a URL. Check on the server that the logged-in user may access each item, every time."
  },
  {
   "t": "Validate input on the server even if the page also checks it, because anyone can send requests directly. Accept only what you expect (types, lengths, allowed values) and reject the rest, rather than trying to remove bad characters."
  },
  {
   "t": "Treat secrets carefully: keep keys in environment variables or a secrets manager, never in the code or in Git, rotate them regularly and give each service only the access it needs (least privilege). Anything inside an APK or front-end bundle can be extracted, so it is not secret."
  },
  {
   "t": "Use HTTPS everywhere, and set cookies with HttpOnly (scripts cannot read them), Secure (sent only over HTTPS) and SameSite flags. Encrypt sensitive data both in transit and at rest."
  },
  {
   "t": "Keep dependencies updated and scan them, since many breaches use known bugs in old libraries. Turn on automatic alerts such as GitHub Dependabot, and remove packages you do not use."
  },
  {
   "t": "Security misconfiguration includes default passwords, open admin pages, debug mode left on in production, verbose error messages and storage buckets that are public by mistake. Check configuration before launching."
  },
  {
   "t": "Phishing and social engineering target people, not code. Be wary of urgent messages, check the real address of links, never share one-time codes, and use a password manager with 2FA."
  },
  {
   "t": "Think like an attacker when you design: ask what an attacker could change, what happens if a request is repeated or forged, and what an insider could see. Log security events and plan how you will respond to a breach."
  },
  {
   "t": "// Unsafe: runs any HTML or script the user typed\nbox.innerHTML = userText;\n\n// Safe: shows it as plain text\nbox.textContent = userText;",
   "code": 1,
   "k": "xss innerhtml textcontent escape user input safe display js javascript"
  }
 ],
 "Game development basics": [
  {
   "t": "Every game runs a loop: read input, update the game state, draw the frame, repeat, about 60 times a second. In the browser requestAnimationFrame calls your loop in step with the screen."
  },
  {
   "t": "Use delta time, the seconds since the last frame, to move things (position += speed * dt), so the game runs at the same speed on fast and slow devices. For physics many games use a fixed time step for consistency."
  },
  {
   "t": "A sprite is a 2D image or animated character. A sprite sheet packs many frames into one image, and an animation shows one frame after another at a set rate. Tiles are small repeated images that build a level."
  },
  {
   "t": "A tile map stores a level as a grid of numbers, each pointing to a tile image. Position in a flat array is y * width + x, and drawing only the tiles on screen keeps big maps fast."
  },
  {
   "t": "Collision detection with rectangles (AABB, axis-aligned bounding boxes) checks whether two boxes overlap on both axes. It is cheap and good enough for many games. Circles use the distance between centres, and big worlds use a grid to check only nearby objects."
  },
  {
   "t": "A state machine models what the game or a character is doing now, such as menu, playing, paused, game over, or idle, walking and attacking, with clear rules for moving between states. It keeps the logic tidy as a game grows."
  },
  {
   "t": "The canvas 2D API draws shapes, images and text with commands like fillRect and drawImage. For pixel art turn off smoothing with ctx.imageSmoothingEnabled = false and set image-rendering: pixelated in CSS, so scaled-up pixels stay sharp."
  },
  {
   "t": "Save a game by turning the state (position, items, progress) into JSON and storing it in localStorage, or in a file on a device. Include a version number so old saves can be upgraded when the game changes."
  },
  {
   "t": "Random numbers drive loot, enemies and maps. A seeded generator gives the same sequence from the same seed, which lets you replay a bug or share a world, as Minecraft world seeds do."
  },
  {
   "t": "An emulator reproduces another machine's hardware in software: it reads the game file (ROM), runs the processor's instructions one by one, simulates memory, draws the screen, plays sound and maps your keys or touches to the console buttons, all paced to the original frame rate. Emulators are legal, but you should only use ROMs you own or that are homebrew."
  },
  {
   "t": "The Game Boy Advance has an ARM7TDMI processor at about 16.78 MHz, a 240 by 160 pixel screen, about 59.7 frames per second and 15-bit colour (32,768 colours). Knowing the original limits helps explain why its games look and run the way they do."
  },
  {
   "t": "let last = 0;\nfunction loop(t) {\n  const dt = (t - last) / 1000;\n  last = t;\n  update(dt);\n  draw();\n  requestAnimationFrame(loop);\n}\nrequestAnimationFrame(loop);",
   "code": 1,
   "k": "game loop requestanimationframe delta time update draw js javascript canvas"
  },
  {
   "t": "const hit = (a, b) =>\n  a.x < b.x + b.w && a.x + a.w > b.x &&\n  a.y < b.y + b.h && a.y + a.h > b.y;\n\nconsole.log(hit({x:0,y:0,w:10,h:10}, {x:5,y:5,w:10,h:10}));\nconsole.log(hit({x:0,y:0,w:10,h:10}, {x:20,y:0,w:5,h:5}));",
   "code": 1,
   "k": "collision detection rectangle overlap aabb hit test boxes game js javascript"
  }
 ]
};
