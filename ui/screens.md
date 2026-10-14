# Screens

How Loom looks while it talks to the person in Act I. Read this before the first screen of a run. Every screen in the opening uses these parts and nothing else, so a run looks like one designed thing from the key check to the go.

## What the terminal can show

Claude Code renders a message as Markdown in the terminal. That fixes the rules:

- **Art goes inside a fenced code block.** Outside a fence Markdown collapses spaces and line breaks, so a card falls apart. Inside a plain fence (no language) every column is kept.
- **Colour comes from the fence's language.** A ` ```diff ` fence paints `+` lines green, `-` lines red and `@@ … @@` lines in the accent colour. Loom uses it for anything that has a state: keys, checks, deliveries. Nothing else gets colour, so colour always means "this is a state".
- **Never write raw ANSI escapes** (`\x1b[…m`) in a message: they print as junk. Full colour exists only in the key wizard's own window (`tools/keys/wizard.mjs`), which is a real terminal program.
- **Single-width characters only:** ASCII, box drawing `─ ━ │ ┃ ╭ ╮ ╰ ╯`, and `✦ · ▸ ● ○ ✓ ✗ ▕ █ ░`. No emoji: they are two columns wide in most terminals and break every alignment after them.
- **At most 64 columns** inside a fence, so a card fits a split pane.
- **`AskUserQuestion` previews** render Markdown in a monospace box, so a preview is also a fenced block. Previews only exist on single-select questions.

## The parts

Labels and copy are in the person's language (the run's session language). The film's own titles, lines and supers stay in the film's language, exactly as they will appear on screen.

### Banner: opens each act, and the first screen of a run

```
  ✦ ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ✦

       L  O  O  M    1.5      ·   act I  ·  the opening

  ✦ ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ✦
```

Turkish labels: `perde I · açılış`, `perde II · üretim`, `perde III · kapanış`.

### Rail: where the run is, under the banner of every Act I screen

```
  ✓ keys        ✓ brief       ▸ research
  · concepts    · versions    · the go
```

`✓` done, `▸` now, `·` ahead. Turkish: `anahtarlar · brif · araştırma · konseptler · versiyonlar · başla`.

### State card: keys, checks, deliveries, always a `diff` fence

```diff
@@ keys @@
+ ✓ ElevenLabs   the voice              works · Creator plan
+ ✓ Pexels       stock footage          works
- ✗ fal.ai       generated pictures     rejected: paste it again
  · HeyGen       optional               skipped
```

`+` for good, `-` for a problem, two spaces for neutral. One row per item, columns aligned with spaces.

### Note: why something matters, before a decision

```
  ┃  The voice is half of the film.
  ┃
  ┃  Loom directs ElevenLabs v4 line by line with audio tags,
  ┃  [warm], [curious], [whispers], so the narrator performs
  ┃  instead of reading. The same key makes the score, the
  ┃  sound effects and the word timings every cut lands on.
```

A left rule, never a full box: a right edge misaligns as soon as one character is wider than expected.

### Findings: what the research found, before the concepts

```
  ━━ what we found ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  product    Creator marketing OS: match, brief, approve, sell
  buyer      marketing leads at DTC brands, 5 to 50 creators
  pain       twelve tools, no single view of who actually sells
  only us    creators already work inside it (Milo, Sales DNA)
  look       neo-brutalist: 2 px borders, hard shadows, Poppins

  moments that move on screen
    1  a grid reorders by how creators sell, not followers
    2  the brief lands on the creator's phone
    3  an approval stamp, then the revenue counts up
```

Labels are one word, values one line. `moments that move` are the dramatic assets from the dossier, ranked.

### Concept card: one per concept, in the message or as a preview

```
  ━━ A ━━ TWELVE PLACES ━━━━━━━━━━━━━━━━━━━━━━━━━ 30 s ━━

  "Twelve tools a marketing team juggles collapse into one."

  hook    twelve windows land, faster and faster, then stack
  turn    the pile flips over: it is the logo card
  peak    Follower count tells you who has an audience.
          Sales DNA tells you who can move a customer.
  close   MATCH. CREATE. SELL. MEASURE.

  ▕████▏▕██████▏▕████████▏▕██████▏▕████▏
   0:05   0:12    0:20     0:26   0:30
  problem  one place  matching  workflow  close

  voice   Sarah · confident, warm    score   120 BPM indie pop
  why     the room says "I need this" before the logo lands
```

- The title is the film's working title in capitals; the length sits at the end of the rule.
- The logline is one sentence in quotes.
- `hook / turn / peak / close` are the four beats every concept must have.
- The bar is the act structure drawn to scale: one `█` per second for a 30 s film, one per four seconds for 2 minutes, acts separated by `▏▕`. Times are act ends; names under them may be abbreviated.
- Two closing lines: the cast and the score, and why this concept fits this viewer.

### Option list: when a question needs more context than its labels

```
  ▸ 1   2 × 30 s  +  2 × 2 min      the full set: A and B of each
    2   1 × 30 s  +  1 × 2 min      one story at both lengths
    3   2 × 30 s                    a short A/B test
    4   1 film                      one version, one length
```

Then the `AskUserQuestion` call with the same options. The recommended one comes first and its label ends with `(Recommended)` / `(Önerilen)`.

### The go: the last screen of Act I

```
  ━━ ready to make ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  A  TWELVE PLACES        30 s   16:9   Sarah    ~$6
  B  WHO SELLS MORE       30 s   16:9   Chris    ~$6
  C  MONDAY AT BRIGHTFOLD 2:00   16:9   Sarah    ~$14
  D  REWIND               2:00   16:9   Chris    ~$14

  films go to      ~/Movies/Loom/brightfold/
  working files    ~/Movies/Loom/brightfold/_work/
  budget           $40 cap · nothing spent yet
  runs             four windows, one render at a time
```

followed by one question: start, or change something. Saying start also approves the delivery renders once every check passes (see `stages/4-design.md` → The go).

### Act II and III: progress and delivery

During production a screen is shown only at a milestone: voices locked, first full render, QC passed. One state card each:

```diff
@@ A · TWELVE PLACES @@
+ ✓ voice     9 lines · Sarah · names checked by speech-to-text
+ ✓ score     6 sections · 120 BPM · 30.0 s
  ▸ build     scene 4 of 6
```

The delivery screen is the banner for act III, then:

```diff
@@ delivered @@
+ ✓ A  Twelve Places          0:30.0   -14.0 LUFS   $5.80
+ ✓ B  Who Sells More         0:30.0   -14.1 LUFS   $4.90
- ! C  Monday at Brightfold   0:2:03   over length: 3 s to cut
```

then the folder, the spend and anything open, in plain sentences.

## Rhythm of a screen

1. Banner (only when an act opens) or the rail.
2. One part: a note, a findings sheet, cards, an option list or a state card.
3. At most two sentences of plain text outside the fences.
4. The question, if there is one, as an `AskUserQuestion` call.

One screen per message. No walls of prose between screens. If a screen needs more than one part, the second part is the question's preview.
