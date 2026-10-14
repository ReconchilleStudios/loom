# Motion

A film's motion is not a set of transitions picked from a menu. It is the brand's own behaviour, grown into a vocabulary. When every move in a film comes from one idea, four films made in parallel by four sessions still look like one family.

## Finding the idea

Look at what the product does when a person touches it, then let everything in the film move that way.

- **The press.** What a button does on click: sink, glow, ripple, spring, colour fill.
- **The material.** Borders, shadows (blurred or hard), radii, fills (flat or gradient), what sits on what.
- **How the product itself moves:** sheets sliding up, cards flipping, lists reflowing, toasts landing.
- **The logo's geometry,** and the brand's anti-references.

The worked example is Affilimates, which is neo-brutalist: 2 px black borders, hard offset shadows with no blur, flat fills. On click an element moves 1 px right and down while its shadow shrinks 1 px, so it sinks into the page. From that came **"Press & Stack"**: things are cards set down on a table, pressed, lifted and stacked, and nothing floats, glows or dissolves. A brand with soft shadows and springy sheets gets a different idea, written the same way.

## The vocabulary

Name 8–12 moves in the bible, each with frame counts at the film's fps, eases, what position, scale, opacity and shadow do, and the sound it carries. Storyboards, prompts and code all use these names. Press & Stack, at 30 fps:

| Move | What happens |
|---|---|
| **LAND** | y +24 px → 0, scale 0.96 → 1, opacity 0 → 1 over 10–12 f, `back.out(1.6)`; the shadow grows to its depth, finishing 2 f after the position settles; a soft thunk on the settle frame |
| **PRESS** | Cursor travels in 8–12 f (`power3.out`); the element translates (+1,+1) and its shadow drops 1 px for 3 f, then returns; a tactile click |
| **LIFT-OUT** | A component leaves its screen: shadow 3 → 12 px as it scales up to ~70 % of the frame (`expo.inOut`, 14–18 f); the screen behind takes a flat 80 % veil; the crop becomes the next scene |
| **DEAL** | 2–4 solid panels with a leading edge slide across 2 f apart, cover, reveal the next scene; 14–18 f |
| **SNAP ZOOM** | Punch-in 1.0 → 1.5–1.8 on a component in 8 f `expo.out`, hold, back out in 12 f (animate the inner wrapper, never the timed clip) |
| **PAN-READ** | A slow 2–4 % push over a reading hold, `sine.inOut`: the "alive" state of every held plate |
| **FLIP SHUFFLE** | A grid reorders: each card arcs to its new slot, 1 f stagger, slight overshoot, thunks |
| **STACK** | Many cards converge to the centre at ±6° into one pile (`power4.in`, 8–12 f), one thunk on impact; the top card becomes the next thing |
| **TYPE-ON** | Supers per word, not per letter; the key word's box draws in from the left (scaleX 0 → 1, 6 f) |
| **COUNT** | Numbers count up in tabular figures (`power2.out`); the final value lands with a 1.06 pop and a shadow pulse; ticks underneath |
| **STAMP** | Slams from scale 1.6, −12° to 1.0, −7° in 6 f, with a 2-frame 6 px shake: the only shake allowed |
| **HANDOFF** | An object leaves the desktop and lands on the phone along a curved path, the camera following: the series' signature |
| **WHIP** | A fast lateral whip with capped directional blur: the only blur allowed |

## Rules every vocabulary keeps

- **One hero motion at a time.** Everything else holds or breathes.
- **Eases:** entrances `back.out` or `expo.out`, exits `power3.in`, camera `expo.inOut`. Never linear, except scrubs and counters.
- **Every action lands on its word.** The press starts on the word's start; the counter lands on its last syllable.
- **Cut on the beat; change scenes on the bar.**
- **Nothing is ever fully still.** A PAN-READ (or the brand's equivalent) runs under every held plate; only the final hold is still, for 12 frames.
- **One allowed shake and one allowed blur**, named in the vocabulary. Everything else is clean.
- **The series move:** one move every version shares, from the run's sweet spot (`stages/2-research.md`). For Affilimates it was the HANDOFF between the brand's desktop and the creator's phone.

## Stages

Every shot sits on one of a few named frames, also in the bible. Press & Stack had four:

- **FULL-BLEED UI:** a plate fills the frame and the camera moves inside it; no browser chrome.
- **BOARD:** the brand's canvas colour, UI panels as cards, and the phone with a flat bezel, a drawn status bar, no gloss and at most ±6° of rotation. Desktop and phone side by side make the TWO SCREENS stage.
- **TYPE:** one solid fill, words as the image.
- **FOOTAGE:** live action or generated motion, full-bleed or inside the phone.

## The cursor

Drawn, deterministic, about 1.6× the macOS size at 1080p, with a slight lag on direction changes. On a phone, a tap ring that scales 1 → 0.85. **Its tip rests at the lower edge of what it presses, never on the label.** Every demo first put it over a button's words.

## Supers

At most seven words. The key word sits in the brand's emphasis device (Press & Stack: a white sticker box with a border and a hard shadow, rotated −2 to −3°). Hold any text at least words × 0.25 s + 0.6 s. Keep 5 % safe margins. A super says what the picture does not.

## The run's motion library

When a run has two or more versions, the bible's moves are written once as seek-safe GSAP helpers in `shared/motion/motion.js`, before the versions start. Each takes a timeline, an element and a time, and uses the bible's names: `land(tl, el, t)`, `press(tl, el, t)`. Every version copies the file into its assets and imports it. Then the same LAND is the same LAND in every film.

The demos' libraries are in `examples/affilimates/motion/`:

- `_lib.js` (2:00A): land, press, cursor, tap, count, type-on, stamp, deal in and out, whip in and out, camera, phone;
- `film.js` (2:00B): includes `reverse()`, which plays a forward sub-timeline backwards with `tweenFromTo`. That was the rewind engine.

Read `craft/hyperframes.md` on shared scripts: the first copy loaded wins, so after changing the library, rebuild every scene.
