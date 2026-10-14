# Film 30A · "Twelve Places" (30-second sales demo, Diana's structure)

You are a senior motion designer and editor making a 30-second sales demo for Affilimates with HyperFrames. This film must make a marketing leader say "I need this." It is one of four films made in parallel; the family rules are in the bible.

**Before anything else read, in full:**
1. `~/Developer/Media/Affilimates/Demo/prompts/_bible.md` (story world, look, motion, sound, APIs, QC, delivery)
2. `~/Developer/Media/Affilimates/Demo/README.md` (the kit: pages, states, captures)
3. Open `~/Developer/Media/Affilimates/Demo/captures/index.html` and look at the plates you will use.

Then load `/hyperframes` and follow it. This prompt is the confirmed brief: do not run the intent interview, do not ask questions.

---

## Setup

- Slug: `demo-30a-twelve-places`. Project: `~/Developer/Media/Affilimates/Demo/films/demo-30a-twelve-places/`.
- Deliverable: `~/Developer/Media/Affilimates/Films/Affilimates Demo 30s A - Twelve Places.mp4` (+ `.srt`).
- Length: **30.0 s** (hard limit 31 s). 1920x1080, 30 fps.
- Voice: **Sarah** (`EXAVITQu4vr4xnSDxMaL`), `eleven_v4`.

Write this as `BRIEF.md` right after `hyperframes init`:

```markdown
---
workflow: general-video
flow: automation
storyboard: no
message: "Your whole creator marketing operation, in one connected place: match, create, sell, measure."
destination: website-and-sales-calls
aspect: 1920x1080
language: en
audience: "Marketing leaders at DTC and e-commerce brands who run creator programs"
length: 30s
angle: problem-to-platform
narration: yes
voice: "ElevenLabs eleven_v4, Sarah (EXAVITQu4vr4xnSDxMaL)"
---

## Intent
The 30-second Affilimates sales demo on Diana's structure: twelve tools collapse into one platform, then intelligence and matching, then campaign to content to performance, then the close. It must create the "I need this" reaction. Neo-brutalist Affilimates look, "Press & Stack" motion.

## Assets
- ~/Developer/Media/Affilimates/Demo/captures/ — kit plates and crops (brand/*, creator/*, chaos/*)
- ~/Developer/Media/Affilimates/Demo/kit/assets/ — footage, people, product, brand, fonts
- ~/Developer/Media/Affilimates/Demo/prompts/_bible.md — the rules

## Customizations
- Count-ups on Revenue and ROAS; rings fill on the Commerce Profile; grid FLIP shuffle; approval STAMP; end-card system from the bible.

## Notes
- VO is Diana's script verbatim (section "Script" of the prompt). No invented claims. No disclaimers or labels.
```

---

## Script (VO, verbatim from Diana; tags are performance notes for eleven_v4)

| # | Line | Tags / delivery |
|---|---|---|
| V1 | Finding creators is easy. | `[confident]` light, almost dismissive |
| V2 | Managing creator marketing at scale? | `[curious]` rising |
| V3 | That's the problem. | `[softly]` flat, a beat of weight |
| V4 | AffiliMates brings your entire creator marketing workflow into one connected platform. | `[warm]` `[confident]` |
| V5 | Find the right creators based on audience, content, product fit... | `[confident]` evenly paced, the three nouns crisp |
| V6 | and even how they sell. | `[excited]` lift on "how they sell" |
| V7 | Then manage campaigns, content, approvals, commerce and performance... | brisk, list rhythm |
| V8 | all in one place. | `[warm]` land it |
| V9 | Match. Create. Sell. Measure. | `[confident]` one word per beat, rhythmic |

---

## Music

ElevenLabs Music, 30 000 ms, 120 BPM (bible section 6), sections:
1. `Twelve tabs` 4 600 ms: starts at full pulse on beat one, ticking sixteenth hi-hats like a counter, tension building, gets busier every bar.
2. `Collapse` 400 ms: everything stops dead except one low hit at the very end (the STACK impact).
3. `One place` 6 600 ms: the groove arrives, four on the floor, bright glassy motif enters, confident.
4. `Sales DNA` 8 000 ms: bass opens an octave, claps enter, playful stabs answer the motif.
5. `All of it` 6 400 ms: the busiest section, driving, one-bar fill into the last section.
6. `Close` 4 000 ms: a single strong hit on the downbeat, then a held chord that rings out.

---

## Shot by shot (times are targets; land every press, super and cut on the word timings from speech-to-text)

### 0:00.0-0:05.0 · PROBLEM (music: Twelve tabs → Collapse)

- **0:00.0** No fade. Stage: desk grey `#E8E6EE`. The first chaos window, `chaos/sheet`, LANDS slightly left of center, rotated -3°.
- Top-left super (Poppins 800, 64 px, black, two lines): `Your creator marketing shouldn't live in` and below it a sticker box holding a number that flips with every window that lands: `1 place` → `2 different places` → … → `12 different places.` (number in Poppins 900, the box redraws its width each flip).
- The other eleven windows land one after another, each at a new spot and rotation (±4°), overlapping more and more: `inbox, dms, platform, folders, report, briefs, contracts, calendar, shipping, payments, links` (plates `captures/chaos/<page>/full.png`; crop each to its `window` shot). Intervals start at 8 frames and accelerate to 3 frames. Each land gets a dry tab-click, pitched up a little each time. Use `chaos/wall` `scatter` as a layout reference, not as a plate.
- VO V1 at 0:00.5, V2 at ~0:02.0, V3 at ~0:03.8.
- **0:04.3** FREEZE: everything stops for 4 frames, music drops out (section `Collapse`).
- **0:04.6** STACK: all twelve windows fly to center into one pile (`power4.in`, 10 f). Impact thunk exactly on the low hit at 0:05.0. The top window of the pile flips over (rotateY 180°, 8 f) and its back is a solid purple card with the white `logo.svg` wordmark.

### 0:05.0-0:12.0 · AFFILIMATES (music: One place)

- **0:05.0** The purple logo card LIFTS-OUT toward camera and fills the frame; inside it the `brand/today/full` plate appears (the card becomes the screen). FULL-BLEED UI. Camera starts at 1.35x on the sidebar top and eases out to 1.0 over 2 s (`expo.inOut`).
- VO V4 at 0:05.3.
- **0:07.5-0:09.5** Diana's nav sequence `Campaigns | Creators | Content | Commerce | Analytics | AI`: rebuild the sidebar natively (bible section 3, way 2) and move the lilac active pill down the six items, one per beat (15 f), each with a tick. As each item activates, a sticker card with its name pops out to the right of the sidebar (Poppins 800, 40 px, white box, black border, 4 px shadow), stacking on the previous one, so after six beats there is a small fanned stack of six stickers reading the six areas. The last one reads `Milo AI` with the Milo avatar.
- **0:09.5-0:11.5** The stickers clear (slide back into the sidebar), the KPI tiles LAND in order with COUNT: `Revenue · 30 days $184,320` and `ROAS 4.6x` count up. SNAP ZOOM to the revenue tile at ~0:11.0, hold 0.5 s.
- **0:11.6** DEAL transition (purple, lilac, mint panels left to right).

### 0:12.0-0:20.0 · INTELLIGENCE + MATCHING (music: Sales DNA)

- **0:12.0** `brand/discover/followers` full-bleed. The sort control reads `Sort: Followers`, Theo's 1.2M card is first. PAN-READ.
- VO V5 at 0:12.3. On the word "audience" the camera SNAPs 1.4x into the filter rail and the cursor drags the Audience Fit slider to 80%+; on "content" the Content Fit slider; on "product fit" the Product Fit slider (rebuild the rail natively so the sliders move; match the `matched` plate's final values).
- VO V6 at ~0:15.6: on "how they sell" the cursor PRESSES `Storyteller` then `Demonstrator` in Sales Style (chips turn purple), camera pulls back to the full grid, and the grid **FLIP SHUFFLES** into the `matched` order: Theo drops to the last slot, Rae arcs to the first slot and the `Best fit` sticker slaps on. Build the shuffle natively from the card crops (`captures/brand/discover/matched@card-<id>.png` and `followers@card-<id>.png`).
- **0:17.2** LIFT-OUT Rae's card; it grows into her Creator Commerce Profile (`brand/creator/full`). The three rings fill (COUNT 0 → 92, 88, 95; 20 f each, 4 f stagger), `Storyteller + Demonstrator` TYPES-ON, the `Advanced` level bar fills.
- **0:19.0** A purple sticker `Sales DNA` with white type pops onto the Sales Style block.
- **0:19.6** WHIP to the right.

### 0:20.0-0:26.0 · CAMPAIGN → CONTENT → PERFORMANCE (music: All of it)

- Stage: BOARD. A 2x2 grid assembles, one card per noun, each landing on its word (VO V7 at 0:20.2):
  - "campaigns" → crop `brand/campaign-new/goal-picked@goal-product-launch` landing, the cursor PRESSES it.
  - "content" → the **phone**, taller than the grid cards and overlapping the grid edge (deeper shadow, it is the hero): `creator/brief` `scene-1` plate with `s1-hook.mp4` playing in its example slot (rebuild the slot so the clip plays). This is the vision moment: the creator's video brief.
  - "approvals" → `brand/content/review@player` crop, then the APPROVED STAMP slams on it (STAMP, the one camera shake).
  - "commerce and performance" → the stacked weekly revenue chart (`brand/analytics/overview@chart`) with bars growing from the baseline, then `$184,320` counting.
- VO V8 "all in one place" at ~0:24.6: all four cards and the phone STACK to center; the top card becomes the purple logo card from 0:05 (a callback).

### 0:26.0-0:30.0 · CLOSE (music: Close)

- The bible's end card. VO V9 lands one word per card on four beats (0:26.0, 0:26.5, 0:27.0, 0:27.5). Logo lands on the music's hit at 0:28.0, then tagline, URL, the lime CTA `See Affilimates in action` pressed at ~0:29.2. Hold.

---

## What makes it great (check before you render)

- The counter in the opening super is the hook: the viewer reads "12 different places" while seeing exactly that.
- The purple logo card at 0:05 and 0:25 is the same object: the film starts and ends its middle on it.
- Every press, slider and chip change lands on a VO word. No action floats between words.
- Lime appears only where the UI itself has it (primary buttons such as Approve and Find creators) and on the final CTA. Selected tiles and chips are purple, never lime.
- Nothing static: every held plate has a PAN-READ.
