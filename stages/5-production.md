# 5 · Production

One version, from its prompt to a rendered film. A worker session reads this (in its own window or as the main session), with its prompt as the confirmed brief. It asks the person nothing: it decides, writes the decision and its reason in one line, and keeps going.

**Read first, in full:** this skill's `SKILL.md` (what never bends), this file and `6-closing.md`, `craft/hyperframes.md`, `craft/voice.md`, `craft/score.md`, `craft/motion.md`. Then the run's `docs/bible.md` and `docs/world.md`, then the version's prompt. `<loom>` is the skill folder and `<run>` the folder with `loom.json`.

## 1. The project

```bash
cd <run>
<loom>/tools/hf.sh init films/<slug> --non-interactive --example=blank --skill=general-video
```

`init` refuses an existing folder. Right after it, write `films/<slug>/BRIEF.md` from the prompt's block (`templates/BRIEF.md`): `workflow: general-video`, `flow: automation`, `storyboard: no`, `narration: yes` with the voice "provided by Loom". In Notes, put the go's render approval with its date. Then load `/hyperframes`. With a brief present it asks nothing and routes to `/general-video`; follow it with the overrides in `craft/hyperframes.md`.

Work in `films/<slug>/`. Copy what the film uses into its own `assets/`: plates from `shared/captures/`, fonts, people, footage, the sound library. HyperFrames rejects asset paths that climb out of the project, and the shared folders are read-only.

Log progress in `films/<slug>/docs/progress.md`, one line per milestone (voice locked, score locked, scenes built, first render, QC passed, delivered). The main session reads it when the person asks how things stand.

## 2. The voice, first

The picture is cut to the voice, so the voice is locked before any scene is built (`craft/voice.md`).

1. `assets/audio/vo/lines.json` from the prompt's script table (`templates/lines.json`): every line verbatim with its tags, its stability, and a phonetic `say` only where needed.
2. **Audition:** the prompt's first two lines with the cast voice and two alternates (`tts.mjs --audition`), checked by `stt.mjs`. Keep the cast voice unless it clearly fails: it mispronounces the product, or the energy is wrong for the film. Write the decision and the reason in `docs/script.md`.
3. **Takes:** two per line (`--takes 2`). Then `stt.mjs takes/*.mp3 --lines lines.json` on all of them. Any `DIFF` on the product's name: try the spellings in `world.md` in `say`, re-render that line only, check again.
4. **Choose** the take per line, write it down, and **place** the lines at the prompt's times (`templates/vo.json` → `place.mjs --meta audio_meta.json`). Tighten a slow line with `tempo` (1.05–1.15); v4's speed setting does nothing. A close of single words ("Match. Create. Sell. Measure.") is cut one word per beat with `beats`.
5. `docs/script.md`: the final lines with their film times, voices, tags and the takes chosen.

## 3. The score

`craft/score.md`. Three takes of the prompt's music plan (`music.mjs`). Measure each with `beats.mjs --bpm <bible's BPM>`. Choose the take whose section changes land nearest the acts and which has no dead air; say why. Cut the bed to the picture's bars (`bed.mjs`). If an act has to move to sit on a bar, move the act and write it down; never stretch the music against the voice. The score never stops under the voice.

## 4. Pictures

- **Plates** from `shared/captures/`. A state that does not exist: copy the kit page into the project, change it there, shoot the copy (`shot.mjs`). Never edit the kit.
- **Generated media:** a `fal` jobs file per batch (`templates/fal-jobs.json`), priced, run under the ledger. Look at every output; a defect is regenerated or cut, never retouched.
- **Stock:** `pexels.mjs search` → look at the sheet → `get` the chosen ids. Look again at the downloaded clips' frames before use.

## 5. Scenes

Follow `/general-video`'s plan. Its `STORYBOARD.md` frames come straight from the prompt's shot list: same times, same stages, same moves by the same names. Search the registry for every named look before hand-building (`craft/hyperframes.md`), then restyle anything found to the bible. Import the run's motion library from `shared/motion/` instead of re-writing the moves.

- Every action is placed from `vo-words.json`: an action on the word "audience" starts on that word's `start`.
- Everything that moves inside the UI is rebuilt natively, pixel-matched to its plate.
- More than six scenes: split the build across parallel workers the way `/general-video` describes, 2–3 scenes each, with file ownership written down. Workers own their scene files only, never audio, transitions or the root timeline, and never render.

## 6. Assembly

`index.html` carries the voice clips (each with an `id` and `data-duration`, alternating tracks so no two overlap on one), the bed, and the sound stem from `stem.mjs` (one `<audio>` instead of dozens). Carve the bed under the voice with `/hyperframes-audio`'s `carve.mjs`; a volume duck alone is not a finished mix. Keep the carved bed tag in `assets/audio/bed-tag.html` and re-insert it whenever `index.html` is regenerated: regenerating drops the carve.

## 7. The loop until it is right

Repeat until clean, without the render lock:

1. `<loom>/tools/hf.sh check --json` clean: lint, runtime, layout, motion, contrast.
2. Snapshots at every scene midpoint (`hf.sh snapshot --at …`), into one sheet (`tools/qc/sheet.mjs`). **Look at it** against the list in `6-closing.md`.
3. `/hyperframes-animation`'s animation map, for dead zones where nothing moves.

Then the closing: `6-closing.md`.

## Gate

The voice is locked and every take on the timeline passed `stt.mjs`. The bed sits on the bars with no gap under the voice. Every shot in the prompt exists at its time. `check` is clean, and the midpoint sheet was looked at with nothing left on the list.
