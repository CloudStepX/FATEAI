# README FOR AI: How to feed Fate Tree

Read this fully before writing anything. The owner will say things like
"feed my AI the **Science** section" or "add a **Cooking** category to my AI".
This file tells you exactly what that means and how to do it without
duplicating or breaking anything.


## 0. Good news: the app now helps you (Phase 12 and newer)
The Feed tab reads the `SECTION: Name` first line by itself, accepts several
`SECTION:` blocks in one paste, ignores `PART n OF N` lines, joins existing
sections and branches regardless of capital letters, and skips any fact it
already has (comparing meaning words, not exact wording). So the owner only
pastes. STILL do your part: skipping known topics keeps your answer short and
useful, and the app only catches duplicates that share the same key words.
Where section 3 below says the app does not remove duplicates, that was true
of older versions only.

## 1. What Fate Tree is
- An **offline Android app**. It has no internet and no outside model.
- All knowledge lives in a library: **section (cluster) > branch > leaf**.
  - Section = a topic (example: "Mathematics").
  - Branch = a sub-topic (example: "Algebra").
  - Leaf = ONE fact written as one sentence.
- It answers by matching the words of a question to leaves. Clear, plain,
  self-contained sentences with the real keywords work best.
- You cannot reach the app. You produce **text**, the owner pastes it in.

## 2. What "feed my AI <category>" means
It means: write NEW knowledge for that category in the format below, skipping
anything the app already knows (see section 5), so the owner can paste it
into the app's **Feed** tab.

Treat these the same way: "feed section X", "add X to my AI", "teach my AI X",
"fill the X cluster", "give my AI more X".

## 3. How the Feed tab reads your text (so you format for it)
- The owner types the **section name** in a box, then pastes your text.
- A line starting with `# ` becomes a **branch name**.
- Paragraphs are split by blank lines. Inside them, **every sentence longer
  than 12 characters becomes one leaf** (cut at 420 characters).
- A fenced code block (three backticks) becomes ONE code leaf (cut at 1,600
  characters).
- Only the first 200,000 characters of a paste are read.
- Newer app versions skip facts they already have, but still avoid
  duplicates yourself (see section 6).

## 4. Output format (Format A: paste into the Feed tab)
Output exactly this, nothing before or after:

```
SECTION: <section name>

# <Branch name>
<Sentence one.> <Sentence two.> <Sentence three.>

<More sentences for the same branch.>

# <Next branch name>
<Sentence.> <Sentence.>
```

Rules:
1. First line is `SECTION: <name>`. The owner copies the name into the section
   box and pastes everything below it. Use the EXACT existing section name from
   section 5 when adding to an existing section (same spelling and capitals).
2. Branch names: 1 to 4 words, title case, no punctuation, no `/` character.
   Reuse an existing branch name only if the new facts truly belong there.
3. Every sentence must stand alone:
   - Name the subject. Write "A transistor is...", not "It is...".
   - One idea per sentence. 40 to 250 characters is ideal (min 13, max 400).
   - Include the words a person would use when asking (the definition word,
     the common name, the common synonym).
4. Plain text only. No tables, no bullet points, no numbered lists, no emojis,
   no bold or italics, no links, no "as an AI" talk, no intro or outro.
5. Facts must be accurate and timeless. No opinions, no "latest" or "currently",
   no prices, no news. If unsure of a fact, leave it out.
6. Code: put ONE short explanatory sentence, then a fenced code block.
   Keep each block under about 25 lines and self-contained.
7. Size: aim for 8 to 20 sentences per branch, 4 to 10 branches per paste.
   If the category is larger, stop at a natural end, write
   `PART 1 OF N` as the last line, and wait for the owner to say "next".

## 5. What the app already knows (DO NOT repeat these)
Before writing, check this list. If the requested category matches or overlaps
an existing section, write ONLY facts that are not already covered by the
branches listed. Never re-cover an existing branch topic.

| Section | Existing branches |
|---|---|
| Artificial Intelligence | AI basics; Training and evaluation; Language models; Using AI well; Learning types; Layers and weights; Code examples |
| Building Software | Testing in depth; Git workflows; Packages and dependencies; CI/CD and Docker; Building Android apps; Front-end frameworks and the web; APIs and authentication; Databases in depth; Security in depth; Game development basics |
| Coding | Programming basics; JavaScript; Python; Data structures; Algorithms; HTML and CSS; Databases and SQL; APIs and the web; Git and version control; Command line; Debugging and testing; Software design; Security basics; Android and Java; Putting coding to use |
| CS Theory | Big-O and complexity; Algorithm ideas; Computing basics; Operating systems; Networking; How the internet works; Data formats |
| Dictionary | Question words; Who: people words; What: thing and idea words; Where: place words; When: time words; Why: reason words; How: method words; Important words; Science words; Math words; Feeling words; Action words; Society and money words; Opposites |
| Language | Grammar; Sentences; Punctuation; Tone; Vocabulary; Writing; Spelling; Figures of speech; Reading; Speaking |
| Programming Languages | Language basics; Language profiles; Hello World in many languages; Same idea, different syntax; Turning code into English; Turning English into code; Examples from requests |
| Life and Work Skills | Passwords and online safety; Time management; Meetings; Personal finance; Health and fitness basics; Writing everyday messages; Goals and planning |
| Logic | Basics; Deduction; Induction; Fallacies; Boolean logic; Sets and counting; Probability; Critical thinking; Problem solving; Programming logic; Puzzles |
| Mathematics | Arithmetic; Fractions, decimals and percentages; Algebra; Geometry; Statistics and probability; Putting math to use; Advanced ideas |
| Programming Concepts | Object-oriented programming; Functional programming; Design patterns; Concurrency and async; Clean code and refactoring; Error handling and logging; Performance and memory; Regular expressions |
| Science Basics | Physics; Chemistry; Biology; Earth and space; Measurement and units; The scientific method |
| Statistics and Data | Descriptive statistics; Data and sampling; Reading charts; Spotting misleading numbers; Spreadsheet formulas; Cleaning and preparing data |
| Writing and Study Skills | Essay structure; Writing process and style; Citing sources; Note-taking; Memory techniques; Study skills |
| Vibe Coding | Method; Layout; Theme; Storage; Network; Utilities; Components; Offline; Git workflow |
| Web | HTML; CSS; JavaScript |
| Git | Basics |
| Fate Tree | What I am; How I think; Library |

Approximate size today: 18 sections, about 1,800 leaves.

If the owner pastes an updated list of sections/branches in the chat, trust
that list over this one.

## 6. Anti-duplication checklist (run before you answer)
- [ ] Is this fact already covered by an existing branch above? If yes, skip it.
- [ ] Did I say the same fact twice in different words inside my own output? Remove one.
- [ ] Is my section name spelled exactly like an existing one (when adding to it)?
      If it is a brand new topic, did I pick a clear new name (1 to 3 words)?
- [ ] Does any branch I created have the same meaning as an existing branch under
      another name (example: "Basics of JS" vs "JavaScript")? If yes, don't.
- [ ] Is every sentence self-contained and 13 to 400 characters?
- [ ] Did I avoid tables, bullets, emojis, and filler text?
- [ ] Did I avoid the words "above", "below", "previous", "as mentioned"?
- [ ] Is it under about 150,000 characters?

## 7. DO NOT (things that would mess up the app)
- Do not rename or restructure existing sections or branches.
- Do not write to the section named **Memory**. That is the owner's personal
  facts (name, likes) and is kept separate on purpose.
- Do not include personal data about the owner or anyone else.
- Do not output JSON, JavaScript, or file contents unless the owner explicitly
  asks for Format B below.
- Do not use the characters `__proto__`, `constructor`, or `prototype` as a
  section or branch name.
- Do not use `/` in a section or branch name (the app uses ` / ` internally).
- Do not tell the owner to change any app code to add knowledge. Feeding never
  needs code changes.
- Do not pad. 10 good, unique facts beat 100 vague ones.

## 8. Format B (only if the owner asks for a cluster FILE)
Some knowledge ships inside the app as files in
`app/src/main/assets/clusters/<name>.js`. Only do this when the owner says
"make a cluster file" or "give me the file for the build". Format:

```js
(window.SEED=window.SEED||{})["Section Name"]={
 "Branch Name": [
  {"t": "One standalone factual sentence."},
  {"t": "Another sentence.", "k": "optional question words people would ask"},
  {"t": "Short explanation of the code below.\n\nfunction add(a,b){return a+b}", "code": 1}
 ],
 "Next Branch": [
  {"t": "Sentence."}
 ]
};
```

- Valid JSON-style strings: escape `"` as `\"` and newlines as `\n`.
- `t` is required. `k` (optional) is a few extra search words for that leaf.
  `code: 1` marks a code leaf.
- Save as a new lowercase file with hyphens (example: `cooking.js`). The owner
  must also add `<script src="clusters/cooking.js"></script>` to `index.html`
  next to the other cluster script tags. Never overwrite an existing cluster
  file; to extend one, output only the NEW branches to add.

## 9. Teaching a single answer (small fixes)
For one fact, the owner can also just type in the app's Ask tab:
`remember that <fact>` (goes to Memory, personal) or teach a synonym with
`big means large`. Do not use these for general knowledge. Use the Feed tab.

## 10. Quick example
Owner says: **"feed my AI the Cooking section."**
"Cooking" is not in the list, so it is a new section. You reply with only:

```
SECTION: Cooking

# Heat and Methods
Boiling cooks food in water at 100 degrees Celsius at sea level. Simmering uses water just below boiling, with small bubbles rising slowly. Sauteing cooks small pieces of food quickly in a little hot fat.

# Knife Skills
Dicing means cutting food into small, even cubes. Julienne means cutting food into thin matchstick strips.
```

Owner says: **"feed my AI more Mathematics."**
"Mathematics" exists with branches like Algebra and Geometry. You must NOT
rewrite those topics. You write only new branches or genuinely new facts, for
example a new branch "Number Theory" or "Trigonometry", using
`SECTION: Mathematics`.

## 11. If you are unsure
Ask the owner ONE short question (for example: "Do you want a brand new section
or more facts added to the existing one?"). Otherwise, just follow this file.
