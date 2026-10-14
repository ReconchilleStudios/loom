# Film 30B · "Who Sells More" (30-second sales demo, alternative scenario)

You are a senior motion designer and editor making a 30-second sales demo for Affilimates with HyperFrames. Same goal as Diana's 30 ("I need this"), same positioning and close, but a different story: instead of tools collapsing into a platform, it opens on a question every brand gets wrong. It is one of four films made in parallel; the family rules are in the bible.

**Before anything else read, in full:**
1. `~/Developer/Media/Affilimates/Demo/prompts/_bible.md`
2. `~/Developer/Media/Affilimates/Demo/README.md`
3. Open `~/Developer/Media/Affilimates/Demo/captures/index.html` and look at the plates you will use.

Then load `/hyperframes` and follow it. This prompt is the confirmed brief: do not run the intent interview, do not ask questions.

---

## Setup

- Slug: `demo-30b-who-sells-more`. Project: `~/Developer/Media/Affilimates/Demo/films/demo-30b-who-sells-more/`.
- Deliverable: `~/Developer/Media/Affilimates/Films/Affilimates Demo 30s B - Who Sells More.mp4` (+ `.srt`).
- Length: **30.0 s** (hard limit 31 s). 1920x1080, 30 fps.
- Voice: **Chris** (`iP95p4xoKVk53GoZ742B`), `eleven_v4`.

`BRIEF.md` right after `hyperframes init`:

```markdown
---
workflow: general-video
flow: automation
storyboard: no
message: "Followers show who has an audience; Affilimates finds who can move a customer, then runs the whole campaign in one place."
destination: website-and-sales-calls
aspect: 1920x1080
language: en
audience: "Marketing leaders at DTC and e-commerce brands who run creator programs"
length: 30s
angle: question-and-reveal
narration: yes
voice: "ElevenLabs eleven_v4, Chris (iP95p4xoKVk53GoZ742B)"
---

## Intent
Alternative 30-second Affilimates sales demo. Opens on a guess (which creator sells more?), reveals that the smaller account sold eight times more, lands Diana's line "Follower count tells you who has an audience. Sales DNA tells you who can move a customer.", then shows the offer, brief, edit and approval moving between the brand's desktop and the creator's phone, the result, and the close.

## Assets
- ~/Developer/Media/Affilimates/Demo/captures/ and ~/Developer/Media/Affilimates/Demo/kit/assets/
- ~/Developer/Media/Affilimates/Demo/prompts/_bible.md

## Customizations
- Twin follower count-ups, the orders reveal, the comparison split, grid FLIP shuffle, desktop-to-phone HANDOFF, approval STAMP, bible end card.

## Notes
- The comparison lives in the story world. No claims about Affilimates itself. No disclaimers or labels.
```

---

## Script (eleven_v4 tags are performance notes)

| # | Line | Tags / delivery |
|---|---|---|
| V1 | Quick question. | `[whispers]` close to the mic, playful |
| V2 | Same product. Same budget. Who sells more? | `[curious]` |
| V3 | Most teams pick the big one. | `[softly]` knowing |
| V4 | The smaller one sold eight times more. | `[excited]` |
| V5 | Follower count tells you who has an audience. | `[confident]` slow |
| V6 | Sales DNA tells you who can move a customer. | `[confident]` slower, land "move a customer" |
| V7 | Affilimates reads how every creator sells, and matches them to what you sell. | `[warm]` |
| V8 | Then it runs the rest. The offer. The brief. The edit. The approval. | brisk, each noun on a beat |
| V9 | And shows you exactly what it sold. | `[confident]` |
| V10 | Affilimates. The operating system for creator-led commerce. | `[warm]` `[confident]` |

---

## Music

ElevenLabs Music, 30 000 ms, 120 BPM (bible section 6), sections:
1. `The question` 6 000 ms: sparse and curious, a ticking pulse and a plucked bass, small playful stabs, holds back.
2. `The line` 4 000 ms: drops to almost nothing (one held pad, no drums) for V5, the groove snaps in on V6's last word.
3. `The match` 4 000 ms: four on the floor arrives, glassy motif, confident.
4. `The run` 7 000 ms: driving, claps, a stab on every beat (the noun cuts ride them).
5. `The result` 3 000 ms: a one-bar lift.
6. `Close` 6 000 ms: a strong downbeat hit, then a held chord ringing out.

---

## Shot by shot

### 0:00-0:06 · THE QUESTION

- **0:00.0** BOARD stage. Two creator cards LAND side by side (each a tall card: portrait on top, name, handle, a big follower number). Left: **Theo Marsh**, `people/theo.jpg`, `1.2M followers`. Right: **Rae Donovan**, `people/rae.jpg`, `184K followers`. Both numbers COUNT up at the same time, Theo's visibly bigger and longer. Build these cards natively in the kit style (borders, offset shadows, Poppins), matching `captures/brand/discover/followers@card-theo.png` and `@card-rae.png` so they read as the same product.
- V1 at 0:00.4. Super above the cards on V2 (TYPE-ON per word): `Same product. Same budget.` then it is replaced by `Who sells **more**?` with "more" in the sticker box.
- **0:03.0** The cursor drifts to Theo's card and hovers; his card lifts (shadow 3 → 6 px). Under the cards a small Inter 600 super: `Most teams pick this one.` timed to V3.
- **0:04.2** REVEAL on V4: an `orders` row slides out of the bottom of each card, both COUNT: Theo **74**, Rae **612**. Theo's card sinks (shadow → 1 px) and desaturates to 40%; Rae's card rises to 8 px and its header bar turns purple. Two thunks and a register-style counter tick. A sticker `8x the orders` slaps onto Rae's card at the end of V4.

### 0:06-0:10 · THE LINE (music drops out)

- Hard cut to TYPE stage: a full-frame split. Left half white with black type, right half purple with white type (restyled `comparison-split`, 2 px black divider). Poppins 800, ~76 px.
- Left TYPES-ON with V5: `Follower count tells you who has an audience.` with "an audience" in the sticker box. Small `1.2M` in the corner.
- Right TYPES-ON with V6: `Sales DNA tells you who can move a customer.` with "move a customer" in a white sticker box. Small `5.4% conversion · 612 orders` in the corner. Music returns on "customer".
- **0:09.6** The purple half collapses into the Sales Style block of Rae's profile: cut on the motion to `captures/brand/creator/compare` → `full` (rings 92 / 88 / 95, `Storyteller + Demonstrator`).

### 0:10-0:14 · THE MATCH

- V7 at 0:10.2. `brand/discover/followers` → the cursor presses `Storyteller` and `Demonstrator` → FLIP SHUFFLE into `matched` (Rae to the first slot, `Best fit` sticker, Theo to the end). Native rebuild from the card crops, as in the bible.
- On "what you sell" a small product card (the kettle, `Brightfold Pour · $89`) LANDS next to Rae's card and a 2 px black connector line draws between them.

### 0:14-0:23 · THE RUN (two screens, one deal; a cut on every noun)

- Stage: TWO SCREENS (desktop panel left, phone right) on canvas.
- "The offer": desktop shows `brand/creator/full`; the cursor PRESSES lime `Send offer`. HANDOFF: an offer card lifts out of the desktop and arcs into the phone, landing as `creator/offer/card` (`AFFILIMATES PICK`, `Perfect match!`, `$1,200`). The phone shows `swipe` then `claimed` (toast `Sent. Brightfold can see you're interested.`).
- "The brief": phone → `creator/offer/brief-ready` → `creator/brief/overview` (the HOOK/STORY/VALUE/CTA timeline lands) → `scene-1` with `s1-hook.mp4` playing in the example slot.
- "The edit": phone → `creator/edit/editing` (steps ticking) → `ready` with `rae-cut.mp4` playing and its captions (rebuild the player overlay natively; caption timings are in the bible).
- "The approval": HANDOFF back: the phone's video shrinks into a card that flies to the desktop and lands in `brand/content/review`; the cursor PRESSES `Approve`; STAMP.

### 0:23-0:26 · THE RESULT

- V9. `brand/analytics/overview` full-bleed; `$184,320` COUNTS in the revenue tile; SNAP ZOOM to Rae's leaderboard row (`@lb-rae`: 612 orders, 5.4%).

### 0:26-0:30 · CLOSE

- The bible's end card. This film puts V10 over it instead of reading the four words: the MATCH. CREATE. SELL. MEASURE. cards land on four beats under the start of V10, the logo lands on "the operating system", then tagline, URL, the CTA pressed. Hold.

---

## What makes it great

- The first 4 seconds are a real question: let the viewer guess wrong before the reveal. Do not rush the hover.
- The reveal is physical: one card sinks, one card rises. Shadow depth tells the story.
- The silence under V5 is the film's peak; protect it.
- In THE RUN the object (offer, video) is always moving between the two screens; never cut to a static screen there.
- Rhythm check: V8's four nouns are four cuts on four beats.
