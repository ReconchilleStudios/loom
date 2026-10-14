# <ID> · "<Title>" (<length> <kind>, <structure>)

You are the senior motion designer, editor and sound designer making version <ID> of a Loom run: a <length> <kind> for <product>. It must make <the viewer> think "<the reaction>". It is one of <N> versions made in parallel; the family rules are in the bible. This prompt is the confirmed brief: do not ask questions, decide and write down why.

**Read first, in full, in this order:**

1. `<loom>/SKILL.md`: what never bends
2. `<loom>/stages/5-production.md` and `<loom>/stages/6-closing.md`: how this version is made and judged
3. `<loom>/craft/hyperframes.md`, `voice.md`, `score.md`, `motion.md`
4. `<run>/docs/bible.md` and `<run>/docs/world.md`: the rules and every name and number
5. `<run>/shared/captures/index.html` (or its sheet): the plates you will use

---

## Setup

- Slug `<slug>` · project `<run>/films/<slug>/` (create it with `hf.sh init`; it must not exist yet)
- Deliverable `<deliver>/<deliverable>.mp4` + `.srt`
- Length **<length_s> s** (hard limit <limit_s> s) · <aspect>, 30 fps
- Voice: **<narrator name>** (`<id>`), `<model>`<; character voice: name (id)>

`BRIEF.md`, written right after `init` (`<loom>/templates/BRIEF.md`):

```markdown
<the filled BRIEF.md block>
```

---

## Script

Verbatim. Tags are performance notes for v4; `say` spellings, where given, are for the voice only.

| # | Line | Tags · delivery | Stability |
|---|---|---|---|
| V1 | <line> | `[tag]` how it is said | 0.40 |
| V2 | <line> | `[tag]` | 0.45 |
| … | | | |

---

## Music

ElevenLabs Music, <total> ms, <BPM> BPM (bible § sound), sections, each ≥ 3000 ms:

1. `<Act name>` <ms>: <what the music does>
2. `<Act name>` <ms>: <…>
3. …

The turn at <time> is a change of register on the downbeat (<how>), not silence.

---

## Shot by shot

Times are targets. Land every press, super and cut on the word timings from `vo-words.json`.

### 0:00.0–0:0X.X · <ACT> (music: <section>)

- **0:00.0** No fade. Stage: <STAGE>. <What is on screen, which plate (`captures/<page>/<state>.png`, crop `<shot>`), which move by name, with frames and ease if it differs from the bible.>
- <Super: exact words, size, where the key word's box is.>
- VO V1 at 0:00.5, V2 at ~0:02.0.
- **0:04.3** <The turn, exactly.>

### 0:0X.X–0:XX.X · <ACT> (music: <section>)

- **0:05.0** <…> On the word "<word>" <the action>.
- …

### 0:XX.X–0:<end> · CLOSE (music: Close)

- The bible's end card. <How V9 lands one word per card, on which beats; the logo on the hit; the CTA pressed at ~0:XX.X; hold 12 frames.>

---

## What makes it great (check before you render)

- <The hook, and why it works.>
- <The callback or the signature device, and where it must land.>
- Every press, slider and chip change lands on a VO word. No action floats between words.
- <The colour rule that is easiest to break in this film.>
- Nothing static: every held plate has a PAN-READ.

## Notes from the table read

- Muted reader: "<what they said the film is>"
- Blind reader: "<what they said>"
- <What was changed because of them.>
