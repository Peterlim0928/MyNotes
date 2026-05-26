import type { NoteFolder } from "../types";

export const MOCK_TREE: NoteFolder = {
  id: "root",
  name: "My Notes",
  parentId: null,
  children: [
    {
      id: "folder-1",
      name: "FIT2014",
      parentId: "root",
      children: [
        {
          id: "file-1",
          name: "Notes",
          parentId: "folder-1",
          content: `<h2>Lecture 1: Languages</h2>

<h3>1.1 Alphabets</h3>
<p>An alphabet is a finite set of symbols.</p>
<p>Example: a, b, c, d</p>

<h3>1.2 Words</h3>
<p>A word is a finite string of symbols.</p>

<ul>
  <li>Some words over English alphabet: wasd, hello, awfnk</li>
  <li>Some words over alphabet {a, b}: ε (epsilon, also called "empty string"), a, b, aa, ab, ...</li>
</ul>

<p>Some standard notation for repetition of letters and words:</p>

<p>
  a<sup>2</sup> = aa,
  ab<sup>3</sup> = abbb,
  (ab)<sup>3</sup> = ababab
</p>

<h3>1.3 Languages</h3>

<p>Example:</p>

<ul>
  <li>
    EVEN-EVEN := {all strings in which each of a,b occurs an even number of times}
  </li>
  <li>
    DOUBLEWORD := {all strings obtained by concatenating some string with itself}
  </li>
</ul>

<h3>1.4 Definitions, Theorems, Proofs</h3>

<p>Terms and definitions:</p>

<ul>
  <li>
    A <strong>definition</strong> specifies the precise meaning of something.
  </li>
  <li>
    A <strong>theorem</strong> is a mathematical statement that has been proved to be true.
  </li>
  <li>
    A <strong>proof</strong> is a step-by-step argument that establishes, logically and with certainty, that something is true.
  </li>
</ul>

<p>General advice on how to prove a subset relationship.</p>

<p>To prove a subset relationship, A ⊆ B:</p>

<ul>
  <li>Prove that every element of A is also an element of B.</li>
  <li>
    Start with a general member of A.
  </li>
  <li>
    Work towards proving that it also belongs to B.
  </li>
  <li>Give names to things.</li>
  <li>Use the definitions of the sets.</li>
</ul>

<p>See Lecture01-05 pdf page 10 for examples.</p>

<hr>

<h2>Lecture 2: Propositional Logic</h2>

<h3>2.1 Propositions</h3>

<p>Terms and definitions:</p>

<ul>
  <li>
    A <strong>proposition</strong> is a statement which is either <em>true</em> or <em>false</em>.
  </li>
</ul>

<h3>2.2 Logical operations</h3>

<ul>
  <li>Not (¬)</li>
  <li>And (∧)</li>
  <li>Or (∨)</li>
  <li>Implies (→)</li>
  <li>Equivalence (↔)</li>
</ul>

<p><em>Logical operations are also called connectives.</em></p>

<h4>2.2.1 Negation</h4>
<p>Negates.</p>

<h4>2.2.2 Conjunction</h4>
<p>True if and only if <u>both</u> its arguments are True.</p>

<h4>2.2.3 Disjunction</h4>
<p>True if and only if <u>at least one</u> of its arguments are True.</p>

<h4>2.2.4 De Morgan's Law</h4>

<p>
  ¬(P ∨ Q) = ¬P ∧ ¬Q<br>
  ¬(P ∧ Q) = ¬P ∨ ¬Q
</p>

<h4>2.2.5 Conditional</h4>

<p>Example:</p>

<p>
  P = Stars are visible<br>
  Q = The sun has set
</p>

<p>
  P implies Q:
</p>

<p>
  <strong>If</strong> stars are visible <strong>then</strong> the sun has set.<br>
  Stars being visible <strong>implies</strong> the sun has set.<br>
  Stars are visible <strong>only if</strong> the sun has set.<br>
  Stars are visible is <strong>sufficient</strong> for the sun to have set.
</p>

<h4>2.2.6 Biconditional</h4>

<p>
  P ↔ Q = "P if and only if Q" or "P is equivalent to Q"
</p>

<h3>2.3 Tautologies and logical equivalence</h3>

<p>Terms and definitions:</p>

<ul>
  <li>
    A <strong>tautology</strong> is a statement that is always true.
  </li>
</ul>

<h4>2.3.2 Distributive Laws</h4>

<p>
  P ∧ (Q ∨ R) = (P ∧ Q) ∨ (P ∧ R)<br>
  P ∨ (Q ∧ R) = (P ∨ Q) ∧ (P ∨ R)
</p>

<h3>2.4 Laws of Boolean algebra</h3>

<p>Lecture01-05 Pdf page 20</p>

<h3>2.5 Disjunctive Normal Form (DNF)</h3>

<p>
  A Boolean expression is in Disjunctive Normal Form (DNF) if
</p>

<ul>
  <li>
    it is written as a disjunction of some number of parts, where
  </li>
  <li>
    each part is a conjunction of some number of literals.
  </li>
</ul>

<h3>2.6 Conjunctive Normal Form (CNF)</h3>

<p>
  A Boolean expression is in Conjunctive Normal Form (CNF) if
</p>

<ul>
  <li>
    it is written as a conjunction of some number of parts (sometimes called clauses),
  </li>
  <li>
    each part is a disjunction of some number of literals.
  </li>
</ul>

<p>Peter's Notes: More likely to be tested compared to DNF</p>

<h3>2.7 Representing logical statements</h3>

<p>Lecture01-05 Pdf page 25</p>

<h3>2.8 Statements about how many variables are True</h3>

<p>
  Exactly k = (at least k) ∧ (at most k)
</p>

<p>Lecture01-05 Pdf page 27</p>

<hr>

<h2>Lecture 3: Predicate Logic</h2>

<h3>3.1 Statements with variables</h3>

<p>Consider this statement:</p>

<ul>
  <li>W is negative</li>
</ul>

<p>
  These statements do not yet have truth values, so they are not yet propositions.
  The variables in these statements are <strong>free</strong>, in that no value is (yet) given to them.
</p>

<h3>3.2 Predicates</h3>

<p>Terms and definitions:</p>

<ul>
  <li>
    A <strong>predicate</strong> is a statement with variables such that,
    for any values of the variables, it is either True or False,
    i.e., it becomes a proposition.
  </li>
  <li>
    The variables of a predicate are also called its <strong>arguments</strong>.
  </li>
  <li>
    A predicate is called k-<strong>ary</strong> if it has k arguments.
  </li>
  <li>
    A predicate with one argument (i.e., a unary predicate) is also called a <strong>property</strong>.
  </li>
  <li>
    A predicate with at least two arguments is also called a <strong>relation</strong>.
  </li>
</ul>

<h3>3.3 Functions</h3>

<p>Terms and definitions:</p>

<ul>
  <li>
    Functions with no arguments are called <strong>constants</strong>.
  </li>
</ul>

<h3>3.4 Existential quantifier</h3>

<p>
  The existential quantifier is written ∃ and read as “there exists”.
</p>

<h3>3.5 Universal quantifier</h3>

<p>
  The universal quantifier is written ∀ and read as
  "for all" (or "for every" or "for each").
</p>

<h3>3.6 Multiple quantifiers</h3>

<p>
  ∃X ∃Y: There exists an X and Y such that...<br>
  ∀X ∀Y: For all X and Y...<br>
  ∃X ∀Y: There exists an X such that for all Y...<br>
  ∀X ∃Y: For all X, there exists a Y such that...
</p>

<h3>3.7 Doing logic with quantifiers</h3>

<p>
  ∀X (p(X) ∧ q(X)) is logically equivalent to
  (∀X p(X)) ∧ (∀X q(X))<br>

  ∃X (p(X) ∨ q(X)) is logically equivalent to
  (∃X p(X)) ∨ (∃X q(X))
</p>

<h3>3.8 Relationship between quantifiers</h3>

<p>
  ¬∀Y means the same as ∃Y ¬<br>
  ¬∃Y means the same as ∀Y ¬
</p>`,
        },
      ],
    },
    {
      id: "folder-2",
      name: "Math",
      parentId: "root",
      children: [
        {
          id: "file-3",
          name: "Calculus Basics.html",
          parentId: "folder-2",
          content: "",
        },
      ],
    },
    { id: "file-4", name: "Quick Notes.html", parentId: "root", content: "" },
  ],
};
