(window.SEED=window.SEED||{})["Logic"]={
 "Basics": [
  {"t": "Logic is the study of correct reasoning. It checks whether a conclusion follows from the statements, called premises, that support it."},
  {"t": "An argument is a set of premises that support a conclusion. A good argument is valid and has true premises."},
  {"t": "A statement is a sentence that is either true or false. Questions and commands are not statements."},
  {"t": "An argument is valid when the conclusion must be true if all the premises are true. It is sound when it is valid and the premises really are true."},
  {"t": "A valid argument can still have a false conclusion if one of its premises is false. All birds can fly, a penguin is a bird, so a penguin can fly is valid but not sound."},
  {"t": "Truth and validity are different things. Truth belongs to statements, and validity belongs to the shape of an argument."}
 ],
 "Deduction": [
  {"t": "Deductive reasoning goes from general rules to a specific conclusion, and a valid deduction guarantees the conclusion. All humans are mortal, Sam is human, so Sam is mortal."},
  {"t": "A syllogism has two premises and a conclusion. All A are B, all B are C, so all A are C."},
  {"t": "Modus ponens: if P then Q, and P is true, so Q is true. If it rains the ground is wet, it rains, so the ground is wet."},
  {"t": "Modus tollens: if P then Q, and Q is false, so P is false. If it rains the ground is wet, the ground is dry, so it did not rain."},
  {"t": "Hypothetical syllogism: if P then Q, and if Q then R, so if P then R."},
  {"t": "Disjunctive syllogism: either P or Q, not P, so Q."},
  {"t": "Contraposition: if P then Q means the same as if not Q then not P. The converse, if Q then P, does not mean the same thing."},
  {"t": "A necessary condition must hold for a result to happen, and a sufficient condition guarantees it. Oxygen is necessary for fire but does not by itself cause fire."},
  {"t": "The statement all A are B does not mean all B are A. All dogs are animals, but not all animals are dogs."}
 ],
 "Induction": [
  {"t": "Inductive reasoning goes from specific observations to a general conclusion. It makes the conclusion likely but never certain."},
  {"t": "A strong induction uses many varied examples. Every swan I have seen is white is weak evidence that all swans are white."},
  {"t": "Abduction is inference to the best explanation: from an observation, pick the cause that explains it most simply."},
  {"t": "Occam's razor says that when several explanations fit the facts, prefer the one with the fewest assumptions."},
  {"t": "Correlation means two things change together. It does not prove that one causes the other, because a third factor may cause both or it may be chance."},
  {"t": "A hypothesis should be falsifiable, which means some possible observation could show it to be wrong."}
 ],
 "Fallacies": [
  {"t": "A logical fallacy is an error in reasoning that makes an argument weak even if it sounds convincing."},
  {"t": "Ad hominem attacks the person making an argument instead of the argument itself."},
  {"t": "A straw man misrepresents someone's position as weaker or more extreme and then attacks that version."},
  {"t": "A false dilemma presents only two options when more exist, as in you are either with us or against us."},
  {"t": "A slippery slope claims that one step will inevitably lead to extreme results without evidence for each step."},
  {"t": "Circular reasoning, or begging the question, uses the conclusion as one of its own premises."},
  {"t": "Appeal to authority argues that something is true only because an authority said so. It is weak when the person is not an expert on that subject."},
  {"t": "Appeal to popularity, or bandwagon, argues that something is true because many people believe it."},
  {"t": "Post hoc ergo propter hoc assumes that because B came after A, A caused B."},
  {"t": "Hasty generalization draws a broad conclusion from too few examples."},
  {"t": "Affirming the consequent is invalid: if P then Q, Q is true, so P is true. The ground is wet does not prove it rained."},
  {"t": "Denying the antecedent is invalid: if P then Q, not P, so not Q. It did not rain does not prove the ground is dry."},
  {"t": "Equivocation uses a word in two different meanings within one argument so that it seems to prove something it does not."},
  {"t": "Red herring introduces an irrelevant topic to divert attention from the real question."},
  {"t": "The burden of proof lies on the person making a claim. Saying you cannot prove me wrong does not prove the claim right."},
  {"t": "Appeal to nature assumes that something is good because it is natural, or bad because it is not. Many natural things are harmful."}
 ],
 "Boolean logic": [
  {"t": "Boolean logic works with true and false values. The basic operations are AND, OR and NOT."},
  {"t": "A AND B is true only when both A and B are true."},
  {"t": "A OR B is true when at least one of A and B is true. Exclusive or, XOR, is true when exactly one of them is true."},
  {"t": "NOT A flips the value of A: true becomes false and false becomes true."},
  {"t": "De Morgan's laws: NOT (A AND B) equals (NOT A) OR (NOT B), and NOT (A OR B) equals (NOT A) AND (NOT B)."},
  {"t": "A truth table lists every combination of true and false inputs and shows the result of an expression for each one. Two inputs give four rows and three inputs give eight rows."},
  {"t": "An implication, if A then B, is false only when A is true and B is false. If A is false the implication is true by default."},
  {"t": "A tautology is a statement that is always true, such as A OR NOT A. A contradiction is always false, such as A AND NOT A."},
  {"t": "The law of excluded middle says every statement is either true or false. The law of non-contradiction says a statement cannot be both at once."},
  {"t": "Logic gates build computers from Boolean logic: AND, OR, NOT, NAND, NOR and XOR gates combine to make adders and memory."},
  {"t": "if (a && b) {...}   // AND\nif (a || b) {...}   // OR\nif (!a) {...}       // NOT\nif (a !== b) {...}  // XOR for booleans", "code": 1, "k": "boolean and or not xor operators javascript logic code"},
  {"t": "// De Morgan in code\n!(a && b) === (!a || !b)\n!(a || b) === (!a && !b)", "code": 1, "k": "de morgan law simplify condition code"}
 ],
 "Sets and counting": [
  {"t": "A set is a collection of distinct items. The union of two sets holds everything in either one, and the intersection holds only what is in both."},
  {"t": "A subset is a set whose items are all inside another set. The empty set is a subset of every set."},
  {"t": "The complement of a set is everything in the universe that is not in the set."},
  {"t": "The inclusion-exclusion rule: the size of A union B equals the size of A plus the size of B minus the size of A intersection B."},
  {"t": "The multiplication rule: if one choice has m options and another has n options, together they have m times n options."},
  {"t": "A permutation counts orders, so n items can be arranged in n factorial ways. A combination counts selections where order does not matter."},
  {"t": "The pigeonhole principle says that if more items are put into fewer boxes, at least one box holds two or more items."}
 ],
 "Probability": [
  {"t": "Probability measures how likely an event is, from 0 for impossible to 1 for certain. It equals favorable outcomes divided by all equally likely outcomes."},
  {"t": "For independent events, multiply their probabilities to get the chance of both happening. Two coin flips both landing heads is one half times one half, which is one quarter."},
  {"t": "The chance of A or B for events that cannot both happen is the sum of their probabilities. If they can overlap, subtract the overlap."},
  {"t": "The probability that an event does not happen equals 1 minus the probability that it does."},
  {"t": "Conditional probability is the chance of A given that B happened. Bayes' rule updates a belief with new evidence."},
  {"t": "The gambler's fallacy is the false belief that past random results change future ones. A fair coin has no memory."},
  {"t": "The base rate fallacy ignores how common something is overall. A positive result from a test for a rare condition is often a false alarm."},
  {"t": "Expected value is the average result over many tries: multiply each outcome by its probability and add them up."}
 ],
 "Critical thinking": [
  {"t": "Critical thinking means judging claims by evidence and reasoning instead of by feeling or authority."},
  {"t": "To check a claim, ask what is being claimed, what evidence supports it, who says so and what do they gain, and what would show it wrong."},
  {"t": "Confirmation bias is the habit of noticing evidence that supports what you already believe and ignoring the rest."},
  {"t": "Anchoring bias is relying too much on the first number or fact you hear when making a judgment."},
  {"t": "The availability bias makes you overestimate how common things are that come easily to mind, such as dramatic news events."},
  {"t": "Survivorship bias draws conclusions only from the successes that are visible and ignores the failures that are hidden."},
  {"t": "The sunk cost fallacy keeps you investing in something because of what you already spent, even when stopping would be better."},
  {"t": "The Dunning-Kruger effect is when people with little skill in a subject overestimate their ability."},
  {"t": "Steelmanning means stating the strongest version of an opposing view before you answer it."},
  {"t": "A claim backed by one anecdote is weak evidence. Look for large samples, controls and repeated results."},
  {"t": "Absence of evidence is not always evidence of absence, but if you looked properly and found nothing, that is real evidence against the claim."}
 ],
 "Problem solving": [
  {"t": "To solve a problem, restate it in your own words, list what you know and what you need, make a plan, carry it out, then check the result."},
  {"t": "Break a big problem into smaller parts and solve each part on its own."},
  {"t": "Work backwards from the goal when the end state is clear but the start is not."},
  {"t": "Try a simpler version of the problem first, then add complexity back."},
  {"t": "Draw a diagram or a table. Seeing the structure often reveals the answer."},
  {"t": "Look for a pattern by trying small cases and asking what stays the same and what changes."},
  {"t": "Proof by contradiction assumes the opposite of what you want to prove and shows that it leads to something impossible."},
  {"t": "Proof by induction proves a base case and then proves that if the rule holds for one step it holds for the next, so it holds for all steps."},
  {"t": "To debug a problem, change one thing at a time, so you know which change had the effect."},
  {"t": "Estimate before you calculate. A rough answer lets you notice when the exact answer is wrong."}
 ],
 "Programming logic": [
  {"t": "An algorithm is a clear step-by-step procedure for solving a problem. Good algorithms are correct, finite and efficient."},
  {"t": "A loop repeats steps until a condition changes. An off-by-one error happens when a loop runs one time too many or too few."},
  {"t": "A conditional runs code only when a condition is true. Check the most specific case first, then the general one."},
  {"t": "Short-circuit evaluation stops as soon as the result is known: in A AND B, if A is false then B is not checked."},
  {"t": "A guard clause returns early when input is invalid, which avoids deep nesting."},
  {"t": "An invariant is a condition that stays true throughout a loop. Stating it helps you prove the loop is correct."},
  {"t": "Recursion solves a problem by calling itself on a smaller version, and it needs a base case to stop."},
  {"t": "Binary search finds an item in a sorted list by repeatedly halving the range, so it takes about log2 of n steps."},
  {"t": "// guard clause\nfunction area(w, h) {\n  if (w <= 0 || h <= 0) return 0;\n  return w * h;\n}", "code": 1, "k": "guard clause early return validate input code"},
  {"t": "// recursion with a base case\nfunction fact(n) {\n  if (n <= 1) return 1;\n  return n * fact(n - 1);\n}", "code": 1, "k": "recursion base case factorial code"},
  {"t": "// binary search\nfunction find(a, x) {\n  let lo = 0, hi = a.length - 1;\n  while (lo <= hi) {\n    const mid = (lo + hi) >> 1;\n    if (a[mid] === x) return mid;\n    if (a[mid] < x) lo = mid + 1; else hi = mid - 1;\n  }\n  return -1;\n}", "code": 1, "k": "binary search sorted array algorithm code"}
 ],
 "Puzzles": [
  {"t": "Knights and knaves: knights always tell the truth and knaves always lie. If someone says I am a knave, the statement is impossible for both, so no one can say it."},
  {"t": "If all A are B and no B are C, then no A are C."},
  {"t": "If you have three boxes labeled wrongly, opening one reveals enough to relabel all of them, because every label is known to be false."},
  {"t": "The Monty Hall problem: after you pick one of three doors and the host opens a losing door, switching wins two thirds of the time."},
  {"t": "If a bat and a ball cost 1.10 together and the bat costs 1.00 more than the ball, the ball costs 5 cents, not 10."}
 ]
};
