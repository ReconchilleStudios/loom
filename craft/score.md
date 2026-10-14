# The score, the sound and the mix

Film time is music time. The score is planned as the film's acts, generated, measured, and cut so that scenes change on its bars. The sound library is made once per run. The mix is measured, never set by ear over a quiet opening.

## The plan

ElevenLabs Music takes a composition plan (`templates/music-plan.json`):

- `positive_global_styles` / `negative_global_styles`: the series' sound, from the bible;
- `sections`: one per act, named after it, each with its own local styles and a `duration_ms`.

What the line learned:

- **A section under 3000 ms is refused** (HTTP 422). `music.mjs` stops before sending one. A stop, a hit or a one-bar collapse is made in the edit, from a longer section.
- **No take keeps the section lengths exactly,** even with `respect_sections_durations`. Plan the acts, generate, measure, then cut.
- **Some takes come back with long dead air.** One run got two of five that way. `music.mjs` reports every silent stretch.
- **Write the global style concretely:** instruments, tempo, groove, what leaves room for a voice. The demos' series style: instrumental modern indie electronic pop, 120 BPM, tight punchy kick, plucked synth bass, dry claps on 2 and 4, short bright stabs, a playful glassy motif, open mids for a spoken voice. Negative: vocals, choir, EDM risers, trailer booms, cymbal washes, lo-fi, trap hats. That is one brand's sound, not a default.
- **120 BPM is convenient at 30 fps:** a beat is 15 frames and a bar 2 s, so scene changes fall on even seconds. Choose a tempo for the film, then do the grid arithmetic once in the bible.

## Takes, the grid, the bed

1. Three takes (`music.mjs plan.json music/score --takes 3`).
2. Measure each: `beats.mjs music/score.t1.mp3 --bpm 120`. It gives the tempo, beat one's offset, each bar's time and frame, and `◆` where the energy jumps, i.e. a section change.
3. Choose the take whose section changes fall nearest the acts, whose grid fits tightly (the residual in ms) and which has no dead air. Write why in `docs/script.md`.
4. **Cut the bed to the picture** (`bed.mjs`): segments taken from the take on bar lines and placed in film time, with beat one's offset from `beats.mjs` as `phase`.
   - A chapter turn gets a change of register on a downbeat: a lowpass on the same groove, a drop to kick and bass, a section from later in the take.
   - The film's last chord rings past the end card. A short sting take can be made for it (a separate 3–4 s plan) and laid under the last bar.
   - Fit the picture to the bars, not the bars to the picture. Retime an act by a beat before stretching music.
5. `bed.mjs` names every gap it leaves. **There is never a gap under the voice.**

## The score never drops out

The music does not stop under the voice and does not cut to silence at the turn. A hard stop or a silent stretch reads as the film breaking, not as drama. The film's peak line gets the biggest change in the score, made by **register**:

- the bed drops to kick and bass under the line, then the full groove returns on its last word;
- a highpass sweep that opens back up on the downbeat;
- a held pad under a frozen frame, then the hit;
- a riser into a hit on the bar where the product arrives.

A frozen picture may sit on a held chord. It never sits on nothing.

## The sound library

Made once per run, before the versions start (`stages/4-design.md`), by `sfx.mjs` from `templates/sfx-library.json` adapted to the bible:

- tactile UI click;
- a card set down on a table (the thunk);
- a paper card sliding, a short dry whoosh;
- a mechanical counter tick;
- a rubber stamp;
- a phone haptic buzz and a soft generic notification (never an iOS sound);
- a short burst of keyboard typing.

Short and dry, no reverb tails.

- **Generated sounds arrive unusable more often than not.** One demo's stamp came back at −47 dBFS, a thunk had 0.2 s of lead-in, a click clicked twice. `sfx.mjs` keeps every raw file and cleans each one: trimmed 3 ms before its first transient, cut to `keep` seconds, faded, peaked at −3 dBFS. It prints what it found.
- **A repeated landing gets pitched variants** (`variants`: twelve tabs landing, each 0.7 semitone higher) so it rises instead of repeating.
- **Placement:** each film writes its cue lists (`[{ "s": "card-thunk", "t": 4.97, "db": -2 }]`) from its timeline and `stem.mjs` renders them into one stem. That is one `<audio>` in the composition instead of forty, sample-accurate, and it warns about doubled cues.

## The mix

- **Voice** at about −16 LUFS short-term (each line levelled on its own) and always intelligible. Every word must be clear over the music and every word's start intact.
- **The bed** under the voice, ducked 8–10 dB with a **voiceover carve** (`/hyperframes-audio`'s `carve.mjs`). The demos used strength 0.45–0.55, which cut 5–11 dB in the speech band, at bed gains 0.5–0.75. A volume duck alone is not a finished mix. Keep the carved tag; regenerating `index.html` drops it.
- **Effects** tucked under the voice; the stem at about 0.8.
- **Measured, not eyeballed:** after the first render, check the short-term range (`master.mjs` prints it). An opening more than about 10 LU under the body is lifted, as the demos did with a bed that began at −21 LUFS.

## The master

`node <loom>/tools/master.mjs <raw.mp4> <master.mp4>`: −14 LUFS integrated, ≤ −1 dBTP, picture copied. The renderer lowers its audio about a dB on its own, so raw renders come out around −14.6 to −16.7 LUFS. The master corrects that and measures itself afterwards. Its JSON goes into `qc.md`.
