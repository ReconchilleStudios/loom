# 6 · The closing

The film is judged as if someone else made it, fixed, mastered and delivered. Nothing is delivered on the strength of green checks. "A green check means no error, not correct output."

## 1. Render and master

```bash
<loom>/tools/render.sh films/<slug> renders/<slug>-raw.mp4 --fps 30
node <loom>/tools/master.mjs films/<slug>/renders/<slug>-raw.mp4 films/<slug>/renders/<slug>-master.mp4
```

`render.sh` waits for the machine's lock. While it waits, keep working on anything that needs no render. The master's JSON goes into `docs/qc.md`.

## 2. The gates

All of them on the **master**, in this order. A failure goes to the fix list with its timecode.

### Technical

- `ffprobe` gives the bible's format: resolution, 30 fps, H.264, AAC 48 kHz stereo.
- The duration is within the prompt's limit.
- `master.mjs` reports `ok`: −14 LUFS ±0.3 integrated, ≤ −1 dBTP. The short-term minimum is not more than ~10 LU under the body; a quiet opening is a defect.
- `hf.sh check` is clean on the final composition.

### Pictures

- **Every half second:** `tools/qc/frames.sh <master> docs/qc/frames`, then **open every sheet**. Look for a black, white or single-colour cell that is not a planned transition, a cell from the wrong scene, a jump, an element visible before its entrance, and a frame where the board is empty after a transition.
- **Every scene's midpoint:** snapshots from the composition, on one sheet (`qc/sheet.mjs`). Look at each for:
  - text clipped at an edge or overlapping;
  - a word hidden under the cursor (the cursor tip sits at a button's lower edge, never on its label);
  - an empty or half-built frame, a stretched image, a plate showing the wrong state;
  - **a number that differs from `world.md`**;
  - the brand's colour rules broken (the bible's "this colour means click" used as decoration);
  - grey text under the bible's floor, a fallback font.

### Words

- `node <loom>/tools/voice/stt.mjs <master> --lines assets/audio/vo/lines.json --whole`. Every scripted word is said, and the product's name is heard right. Names on the `accept` list (a fictional first name heard with another spelling) are the only allowed differences.
- The `.srt` from `tools/voice/srt.mjs` reads right: the script's spelling, no dashes, nothing over two lines.

### Truth

Every super and every voice line, read against `claims.md`: nothing claimed that the register does not hold, and the truth mode respected (`craft/truth.md`). Every name and number against `world.md`. No real brand, logo or person.

### Craft

- Every action lands on its word. Compare the composition's action times with `vo-words.json`; more than 3 frames off is a defect.
- Every held plate moves (the animation map shows no dead zone outside the last hold).
- The version's signature device and the series move are there, and the end card is the bible's.
- The score is under the voice all the way, and the bed changes register where the acts turn.

### Cold viewers

`tools/qc/frames.sh` sheets plus the master's transcript with times make the **viewing kit**: no prompt, no bible, no plan. Three subagents in parallel, each given only the kit:

- **The viewer** from the brief, in their seat;
- **an editor** who cuts trailers and ads for a living;
- **a scroller on mute**, given the sheets only, no transcript.

Each answers four things: what this is and who it is for, in one sentence; what they would do next; the weakest moment, with its timecode; anything that looked wrong. **Pass: two of the three say what the product is without being told.**

## 3. Fixes

Class every finding: **truth** (a claim, a number, a name), **reads wrong** (a viewer misunderstood), **craft** (a frame, a timing, a level). Fix truth first. Work in bounded rounds, at most three: fix, re-render, re-master, re-run every gate the fix could have touched. A finding Loom decides not to fix is written down with its reason.

## 4. Delivery

- The master, copied as a real file (not a link) to `loom.json`'s `deliver` folder under the version's exact deliverable name, plus its `.srt`.
- A **9:16 cut** when the person asked for one. It is its own composition, re-laid for the portrait frame from the same scenes, voice and score, and never a crop of the 16:9 master. It is rendered, mastered and checked the same way, with `, vertical` at the end of its name.
- In `films/<slug>/docs/`:
  - `script.md`: the final voice with timecodes, voices, tags and the takes chosen;
  - `shotlist.md`: every shot with its time, stage, source and moves;
  - `qc.md`: every gate and its result, every fix, the master's numbers, and the Loom version;
  - `sources.md`: every generated or stock asset with its cost or licence.
- One line appended to `<run>/DELIVERED.md`: `<date> · <file name> · <duration> · <one-sentence logline>`.
- `docs/progress.md`: delivered.

## 5. The report

In the version's own window, the delivery state card (`ui/screens.md`): file, duration, loudness, spend (`node <loom>/tools/ledger.mjs`), anything open.

When the person asks the main session, or every version is delivered, show the act III banner and one card for the whole run. Then give the folder, the total spend against the cap, and every open item in plain sentences. Update `PLAN.md` and set `loom.json` to `delivered`.

## Gate

Every gate above passes on the master that was delivered, or its exception is written in `qc.md` with a reason. The files are in the delivery folder under their names, and the report says what is open.
