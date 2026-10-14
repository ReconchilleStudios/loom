# <Product> films · production bible

Read this whole file before you plan anything. Your version's prompt says what to make; this file says how every film of this run looks, moves, sounds and stays true. <N> films are made in parallel from these rules, so they must feel like one family.

Run root: `<run>`. Loom: `<loom>`.

---

## 1. Who it is for, and the one idea

- **The brief:** <who asked, for whom, where it plays, and the reaction each length must cause, in the brief's own words>.
- **Position:** <one line>. <The words the series closes on.>
- **The line that carries the whole position:** <the must-say line, verbatim>.
- **The sweet spot** (the creative position of every film): <where the brief's frame meets what is true only of this product>. **The series move:** <the one move every version shares, and why it shows the sweet spot>.

## 2. Story world

Every name and number is in `docs/world.md`. Copy from there; never change one. On screen the product is written `<spelling>`; it is said "<pronunciation>" (check with speech-to-text; the TTS-only spelling is `<say>`).

## 3. What you build with

- **Plates:** `shared/captures/<page>/<state>.png` and `<state>@<shot>.png` (component crops at 3×). Browse `shared/captures/index.html`.
- **Footage, people, photos, brand, fonts:** <paths>. Copy into your project; no other font.
- **Three ways to put the product on screen,** in this order: (1) plates and crops, animated; (2) native rebuilds of anything that moves inside the UI, pixel-matched to the plate; (3) a new capture of a copied kit page. Never edit the kit; never record the UI as video.
- **Motion library:** `shared/motion/motion.js` (§ 5). **Sound library:** `shared/sfx/` (§ 6).

## 4. Look

- <The brand's material: borders, shadows and what their depth means, radii, fills.>
- <Palette as hex, with what each colour is for. The colour that means "click" and where it may appear.>
- <Type: the headline face and weight, leading, tracking; the UI face; the floor for grey text.>
- **Anti-references** (any of these is a defect): <the market's clichés this brand must never look like>.

**Stages** (every shot sits on one): <FULL-BLEED UI · BOARD · TYPE · FOOTAGE, or this brand's own, each described>.

**Supers:** at most 7 words; <the emphasis device>; 5 % safe margins; hold at least words × 0.25 s + 0.6 s.

**End card** (same system in all versions, 4–6 s): <the steps, the CTA, the 12-frame hold>.

**Truth mode:** `<shipped | vision-marked | vision-as-product>`. <What that means for labels in this run.>

## 5. Motion: "<the vocabulary's name>"

<One paragraph: the brand's own interaction, and how the whole motion language grows from it.>

| Move | What happens (frames at 30 fps, eases, shadow, sound) |
|---|---|
| **<NAME>** | <…> |

Rules: one hero motion at a time; entrances `<ease>`, exits `<ease>`, camera `<ease>`; never linear except scrubs and counters; cut on the beat, change scenes on the bar; a PAN-READ under every held plate; the only shake is <…>, the only blur is <…>.

**Cursor:** <drawn, size, outline, lag; the phone's tap>. Its tip rests at the lower edge of what it presses, never on the label.

**Registry starting points** (search before hand-building, then restyle to § 4): <names>. Search with `<loom>/tools/hf.sh catalog --query "<the move>"`.

## 6. Sound

- **Voice:** ElevenLabs `<model>`. Cast: A <name id>, B <name id>, <character> <name id>. Audition the first two lines against two alternates; keep the cast unless it clearly fails. Tags inline, one or two per line. One file per line. Every take through `stt.mjs`. Levelled per line to −16 LUFS (`craft/voice.md`).
- **Music:** ElevenLabs Music. Global style: <positive>. Negative: <…>. <BPM> BPM: a beat is <n> frames, a bar <s> s. Sections are the acts, each ≥ 3 s. Three takes, measured with `beats.mjs`, cut to the bars with `bed.mjs`. The peak line gets a change of register, never silence; the score never stops under the voice.
- **SFX:** the run's library in `shared/sfx/` (<list>). One stem per film from cue lists (`stem.mjs`).
- **Mix:** voice ≈ −16 LUFS short-term, always intelligible; bed carved 8–10 dB under the voice (`carve.mjs`); SFX under the voice. Master −14 LUFS, ≤ −1 dBTP (`master.mjs`).

## 7. Generated and stock media

- **fal** (`tools/media/fal.mjs`, under the ledger): <endpoints that this run uses, with prices, and the reference-image wording that keeps a person's face and the product exact>. Budget: <$ per version>. Look at every output.
- **Pexels** (`tools/media/pexels.mjs`): <what the world footage shows>. Look at every clip on its sheet before use: no logos or readable brands, <light>, people as atmosphere only.

## 8. Truth and safety

- No invented claims about <product>: <examples of what must not be said>. Numbers inside the story are fine.
- Every brand, creator and person is fictional. No real brands or logos; platforms as plain text only.
- Generated people are characters, never testimonials.
- On-screen text: <language>, no em or en dashes.
- **Do not touch** the product's repo, other versions' folders, `shared/` (copy what you need).

## 9. Production, QC, delivery

- **Project:** `<loom>/tools/hf.sh init <run>/films/<slug> --non-interactive --example=blank --skill=general-video`, then `BRIEF.md`, then `/general-video` with Loom's overrides (`craft/hyperframes.md`).
- **Format:** <resolution>, 30 fps, H.264 MP4, AAC 48 kHz stereo.
- **Render:** only `<loom>/tools/render.sh` (one render at a time on the machine; never from the Studio UI).
- **QC:** every gate in `<loom>/stages/6-closing.md`, on the master. A green check means no error, not correct output.
- **Render approval:** given at the go (<date>), to run once every check passes.
- **Deliver:** `<deliver>/<the exact file name in your prompt>.mp4` + `.srt`; `docs/script.md`, `shotlist.md`, `qc.md`, `sources.md`; one line in `<run>/DELIVERED.md`.
