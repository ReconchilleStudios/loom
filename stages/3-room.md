# 3 · The writers' room

Several films are pitched before one is made. The person chooses from concepts that are really different, each judged by three independent readers.

## First: the set

How many versions at which lengths decides what a concept must do (a 30-second film is one idea and one turn; two minutes is a story). Unless the brief already said, ask now: banner, rail at `concepts`, an option list (`ui/screens.md`), then `AskUserQuestion`:

- **2 × 30 s + 2 × 2 min.** The full set: an A and a B at each length. This is the Affilimates set.
- **1 × 30 s + 1 × 2 min.** One story at both lengths.
- **2 × 30 s.** A short A/B.
- **One film.** The person names the length next.

`Other` takes anything else ("three 15 s cuts and one 60 s"). Record the slots in `loom.json` (`versions[]`: id, length).

## Writing the concepts

Write **at least two more concepts than there are slots** (five or six for four slots), in `docs/concepts.md`. Force them apart: each starts from a different structure in `craft/story.md` (the collapse, the wrong signal, a day, the rewind, one object's journey, the count, the voice of the user, before and after, the question answered by the last frame). Two concepts on the same structure are one concept.

Every concept has:

| Field | What it is |
|---|---|
| **Title** | Two or three words, the film's working name ("Twelve Places", "Who Sells More", "Rewind") |
| **Logline** | One sentence a stranger could repeat |
| **Hook** | What is on screen and said in the first two seconds, and why nobody scrolls past it |
| **Turn** | The moment the problem becomes the product |
| **Peak** | The line or image the whole film exists for (the brief's must-say line, if it has one) |
| **Close** | How it ends. All versions of a run share one end-card system (`craft/story.md`) |
| **Acts** | The structure with times, at each length it is offered for |
| **Signature** | The one device only this version uses |
| **Moments used** | Which ranked moments from the dossier it puts on screen |
| **Voice and score** | The cast (narrator, a character's own voice, or none) and the music's character |
| **Needs** | Material it depends on: kit screens, generated people, footage, a service key |
| **Risk** | What could make it fail |

When the person gave a script, concept A of each length is their structure, made as well as it can be made. The B concepts tell a different story to the same goal and the same close (in the demos, 30B opened on a question instead of a collapse, and 2:00B opened on the result and rewound).

## The jury

Three subagents, run in parallel, each with **only** the dossier's summary (product, viewer, only-this-product, moments that move) and the concepts. They do not see Loom's ranking.

- **The viewer:** the person from the brief, in their seat (a marketing lead between two calls). They answer: would I watch past the hook, do I understand what this is, do I feel the reaction, what would I say about it to a colleague?
- **The filmmaker:** judges craft. Is the hook visual, does the turn land, can the peak hold the film, is the signature new, is there a single idea?
- **The producer:** judges whether it can be made well from the material and the keys, the budget at the slot's length, and the truth. Does any picture or line claim something the register does not have?

Each scores every concept 1–5 on hook, clarity with the sound off, the reaction, only-this-product, and feasibility, with one sentence of reason each, and names the concept it would make. Brief them with exactly this and nothing of Loom's preference. The scores are advice. Loom decides, and writes the decision and the reason for each slot into `concepts.md`.

## The screen

Banner, rail at `concepts`, then:

1. One concept card per concept that survived (at least slots + 1), in the order Loom recommends (`ui/screens.md`, Concept card). Under each, one line: the jury's strongest praise and strongest doubt.
2. The recommendation, two sentences: which concept for which slot and why.
3. `AskUserQuestion`, **one question per slot** ("30 s · A", "30 s · B", "2 min · A", "2 min · B"), up to four in one call. Each option is a concept. The recommended concept comes first, labelled `(Recommended)`. Its **preview is the concept card drawn at that slot's length.** `Other` lets the person combine two concepts or change one; Loom then rewrites that concept and shows its card again.

## Gate

Every slot has a chosen concept. Each chosen concept passes the only-this-product test, has a hook in its first two seconds and a peak, and uses at least two ranked moments that move. No two slots use the same signature. The jury's notes and Loom's reasons are in `concepts.md`.
