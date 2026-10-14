# Film 120B · "Rewind" (2-minute sales demo, alternative scenario)

You are a senior motion designer and editor making a 2-minute Affilimates sales demo with HyperFrames. Same goal as Diana's 2:00 (a marketing leader thinks "This could replace a lot of what we're doing manually"), same capabilities, same positioning and close, but a different story: it opens on the result, rewinds to the morning it started, and plays the whole campaign forward to the next decision. It is one of four films made in parallel; the family rules are in the bible.

**Before anything else read, in full:**
1. `~/Developer/Media/Affilimates/Demo/prompts/_bible.md`
2. `~/Developer/Media/Affilimates/Demo/README.md`
3. Open `~/Developer/Media/Affilimates/Demo/captures/index.html` and look at every plate this film uses.

Then load `/hyperframes` and follow it. This prompt is the confirmed brief: do not run the intent interview, do not ask questions.

---

## Setup

- Slug: `demo-120b-rewind`. Project: `~/Developer/Media/Affilimates/Demo/films/demo-120b-rewind/`.
- Deliverable: `~/Developer/Media/Affilimates/Films/Affilimates Demo 2min B - Rewind.mp4` (+ `.srt`).
- Length: **2:00**, allowed 1:58-2:04. 1920x1080, 30 fps.
- Voices: narrator **Chris** (`iP95p4xoKVk53GoZ742B`); **Rae** (`Jessica cgSgspJ2msm6clMCkdW9`). `eleven_v4`.
- One sub-composition per chapter below.

`BRIEF.md` right after `hyperframes init`:

```markdown
---
workflow: general-video
flow: automation
storyboard: no
message: "One video sold 612 kettles; Affilimates is how a brand gets from a goal to that result, and to the next one, in one place."
destination: website-and-sales-calls
aspect: 1920x1080
language: en
audience: "Marketing leaders at DTC and e-commerce brands who run creator programs"
length: 120s
angle: result-first-rewind
narration: yes
voice: "ElevenLabs eleven_v4, Chris (iP95p4xoKVk53GoZ742B); Rae: Jessica (cgSgspJ2msm6clMCkdW9)"
---

## Intent
Alternative 2-minute Affilimates demo. Cold open on Rae's 40-second video selling (612 orders), "Let's rewind", a reverse montage back to Day 1, then nine chapters forward: the morning, the goal, the match (Sales DNA), the offer, the brief, the shoot and edit, the approval, the sales, the next one. A day counter carries time. Ends on Diana's close.

## Assets
- ~/Developer/Media/Affilimates/Demo/captures/ and ~/Developer/Media/Affilimates/Demo/kit/assets/
- ~/Developer/Media/Affilimates/Demo/prompts/_bible.md

## Customizations
- Order pings and a live counter around the phone; a brutalist timeline scrubber that drives a reverse montage; chapter cards; day counter; Sales DNA full-frame line with the music drop; desktop-to-phone HANDOFFs; STAMP; typed copilot question; bible end card.

## Notes
- The 612 orders live in the story world. No claims about Affilimates itself. No disclaimers or labels.
```

---

## Two devices

1. **The scrubber.** A thick timeline bar (2 px border, cream fill, purple progress, a black square playhead with a 3 px shadow) that appears under the phone at "Let's rewind". Dragging it left plays the film's own later shots backwards. It returns, small, at the bottom of each chapter card as a progress indicator (where we are in the 30 days).
2. **The day counter.** A sticker top-left: `DAY 30` → (rewind) → `DAY 1 · 9:00 AM` and onward: `DAY 1 · 9:14 AM`, `DAY 1 · 9:31 AM`, `DAY 2`, `DAY 3`, `DAY 6`, `DAY 7`, `DAY 30`, `TODAY`. Digits flip split-flap style.

**Chapter cards:** between chapters, a 20-frame card: a micro-label eyebrow `CHAPTER 3` and a title in Poppins 900 (`The match.`), on a solid fill that cycles purple / lilac / mint / cream / pink, DEALt in and out. Keep them short; they are rhythm, not titles to read slowly.

---

## Script (tags are eleven_v4 performance notes)

| # | Chapter | Line | Voice / tags |
|---|---|---|---|
| R1 | Cold open | Forty inches of counter. This earned a spot. | Rae, `[playful]` |
| V1 | Cold open | This forty-second video sold six hundred and twelve kettles. | Chris `[whispers]` |
| V2 | Cold open | Nobody chased an email. Nobody lost a draft in a folder. | `[curious]` |
| V3 | Cold open | Let's rewind. | `[playful]` |
| V4 | Morning | Day one. Jordan runs creator partnerships at Brightfold. | `[warm]` |
| V5 | Morning | Everything their team does with creators starts on one screen. | |
| V6 | Goal | They don't start with a creator list. They start with the goal. | `[confident]` |
| V7 | Goal | A launch. One kettle. Twenty-five thousand dollars. Forty seconds of TikTok. | four beats |
| V8 | Match | The biggest account on the list had one point two million followers. | `[curious]` |
| V9 | Match | Affilimates didn't care. | `[playful]` |
| V10 | Match | It read how each creator sells. Rae is a Storyteller and a Demonstrator, and her audience cooks in tiny kitchens. | `[warm]` |
| V11 | Match | Follower count tells you who has an audience. Sales DNA tells you who can move a customer. | `[confident]` slow, pause between the sentences |
| V12 | Offer | One click sends the offer. It lands where Rae already works: her deal inbox. | |
| V13 | Brief | Then Milo writes her video brief. Five scenes, written for how she sells. What to shoot, what to say, and why it works for her audience. | `[warm]` |
| V14 | Shoot + edit | She shoots it in twenty minutes. Milo cuts it, captions it and checks it against the brief. | brisk |
| V15 | Approval | Jordan approves it from the same screen. It goes live that afternoon. | |
| V16 | Sales | Thirty days later, every order is tied to the creator and the video that drove it. | `[confident]` |
| V17 | Next | And Milo already knows what to do next. | `[warm]` |
| V18 | Close | Affilimates is built for what's next. | `[confident]` |

---

## Music

ElevenLabs Music, 121 000 ms, 120 BPM:
1. `The win` 10 000 ms: confident groove from beat one, bright motif, it feels like a victory lap; stops on the last beat.
2. `Rewind` 4 000 ms: the same motif played backwards and pitched (render it as a reversed, accelerating figure), ending in a tape-free snap.
3. `Morning` 12 000 ms: light, warm, a plucked melody and a soft pulse.
4. `The goal` 14 000 ms: steady four on the floor, purposeful.
5. `The match` 20 000 ms: curious build; at 13 s in, drums drop out for 4 s on a held chord (the Sales DNA line); back on the downbeat.
6. `Offer to edit` 26 000 ms: the busiest, most playful section, stabs on every beat, claps.
7. `The approval and the sales` 18 000 ms: big, confident, a lift at the end.
8. `Close` 17 000 ms → trim to fit: lighter for the copilot, then a strong downbeat hit and a held chord for the end card.

---

## Shot by shot

### 0:00-0:10 · COLD OPEN: THE WIN (`DAY 30`)

- BOARD stage, the phone center, playing `rae-cut.mp4` from 0.0 with its captions and hook text (rebuild the overlay natively; timings in the bible). R1 is Rae's voice over the first shot (her hands are pouring, no lips to sync).
- Around the phone, order pings LAND in rhythm on both sides, small white cards with a 2 px border: `New order · Brightfold Pour · $89 · via @rae.donovan`. They start one per beat and accelerate, stacking and scrolling up. A big counter sticker to the right of the phone COUNTS `612 orders`, and under it `$54,468`.
- V1 at ~0:03.0 (whisper, intimate), V2 at ~0:06.0. On "lost a draft in a folder" one grey chaos window (`chaos/folders`) peeks in at the frame edge and gets slapped away by an order card.
- **0:08.8** V3 "Let's rewind." The scrubber LANDS under the phone.

### 0:10-0:14 · THE REWIND

- The cursor grabs the playhead and drags it left. Everything plays backwards at increasing speed in ~12 cuts of 6-9 frames: the order pings fly back into the phone; the cut un-edits into `creator/edit/ready` → `editing` → `upload` (takes fly out); takes fly back into `creator/brief/shoot` → `scene-1` → `overview`; the brief folds into `creator/offer/brief-ready` → `card`; the offer card flies back out of the phone into the desktop `brand/creator/full`; the rings empty (`empty`); the grid unshuffles (`matched` → `followers`); the campaign fields empty (`details` → `goal`).
- The day counter rolls `DAY 30 → DAY 1`. Use reversed versions of your own forward animations, not a VHS effect: no scanlines, no tape noise, no chromatic aberration.
- Lands with a snap on `brand/today/full`: `DAY 1 · 9:00 AM`.

### 0:14-0:26 · CHAPTER 1 · THE MORNING

- Chapter card `The morning.` (purple), then `brand/today/full` full-bleed, PAN-READ across the KPI tiles, then onto `Needs your attention` and `Milo recommends`. V4 at ~0:15.5, V5 at ~0:20.
- On "one screen" the camera pulls back to the whole dashboard, and the twelve chaos windows from the opening of film 30A flick in tiny around it and vanish (one frame each), as if the screen absorbed them.

### 0:26-0:40 · CHAPTER 2 · THE GOAL (`DAY 1 · 9:14 AM`)

- `brand/campaign-new/goal`. V6. The cursor PRESSES `Product Launch` on "the goal".
- V7, four beats, four fields fill on four cuts: "A launch." (the Product Launch chip) · "One kettle." (the product card with the kettle LANDS) · "Twenty-five thousand dollars." (the budget slider drags, `$25,000` COUNTS) · "Forty seconds of TikTok." (the `1 TikTok, 30 to 45 seconds` requirement ticks).
- `summary`: `37 creators fit, 9 strong matches` COUNTS; the cursor PRESSES lime `Find creators`.

### 0:40-1:00 · CHAPTER 3 · THE MATCH (`DAY 1 · 9:31 AM`)

- `brand/discover/followers`. V8: SNAP ZOOM onto Theo's card (`1.2M followers`). V9 "Affilimates didn't care.": the filters snap on in one rapid sequence and the grid FLIP SHUFFLES into `matched`; Theo slides to the end, Rae rises first with `Best fit`.
- LIFT-OUT Rae's card → `brand/creator/full`. V10: on "Storyteller" and "Demonstrator" the two style quotes highlight (`@sales-style` crop: "Let me tell you what happened when I started using this." / "Let me show you exactly how this works."); on "tiny kitchens" the Audience 92% ring pulses.
- **~0:53-0:59 THE LINE** with V11 and the music drop: the compare block LIFTS-OUT full frame, white half / purple half, TYPE-ON per word in sync with the VO, key phrases in sticker boxes. Day counter hidden.

### 1:00-1:08 · CHAPTER 4 · THE OFFER (`DAY 2`)

- TWO SCREENS stage. V12. The cursor PRESSES lime `Send offer` on the desktop profile; HANDOFF: the offer arcs into the phone and lands as `creator/offer/card` (`AFFILIMATES PICK`, `Perfect match!`, `$1,200 + 10% commission`). On "her deal inbox" the phone shows the deck with Pantry Theory and Tinsmere cards behind it (inbox deals), then the tap on `Claim offer` → `swipe` → `claimed` toast.

### 1:08-1:22 · CHAPTER 5 · THE BRIEF (`DAY 3`)

- Phone fills more of the frame. `creator/offer/brief-ready` (Milo's banner) → tap `Open brief` → `creator/brief/writing` (steps tick fast) → `overview` (the HOOK/STORY/VALUE/CTA timeline LANDS segment by segment, the five scene rows stagger in).
- V13. On "What to shoot" → `scene-1` (example clip `s1-hook.mp4` playing in the slot); "what to say" → the `Say it like this` card SNAP ZOOM; "why it works for her audience" → the `Why this works for you` Milo card SNAP ZOOM. Then a quick flip through `scene-3` and `scene-5` (2 beats each) so the viewer sees it is a full plan.

### 1:22-1:34 · CHAPTER 6 · THE SHOOT AND THE EDIT (`DAY 6`)

- `creator/brief/shoot` (the prompter reads Rae's line, the record button PRESSES, timer runs) → hard cut to the actual clip `s1-hook.mp4` full-frame in the phone for one beat → `creator/brief/done` (five takes check in) → `creator/edit/upload` (takes land, stars appear) → `editing` (the six steps tick on six beats) → `ready` with the cut playing, captions on, `Milo's check` card with `96` COUNTING. V14 across it.
- The cursor (tap) presses lime `Send to Brightfold`.

### 1:34-1:42 · CHAPTER 7 · THE APPROVAL (`DAY 7`)

- HANDOFF back to the desktop: the video card flies into `brand/content/review`. V15. PRESS lime `Approve` → STAMP → `published` with first-hour stats COUNTING.

### 1:42-1:52 · CHAPTER 8 · THE SALES (`DAY 30`)

- `brand/analytics/overview`: the stacked chart grows week by week (Rae's purple layer grows fastest), `Rae's video goes live` sticker. V16. Cursor clicks Rae's row → `drill`: `612` orders COUNTS to the same number the cold open showed (rhyme: hold it a beat).

### 1:52-1:57 · CHAPTER 9 · THE NEXT ONE (`TODAY`)

- `brand/copilot`: the question TYPES fast: `What should we change in our next campaign?` → `q2a2`: three recommendation cards LAND. V17. The cursor PRESSES lime `Apply to next campaign` on `Re-book Rae before Oct 20`. The scrubber at the bottom jumps forward past its end: the next campaign has started.

### 1:57-2:03 · CLOSE

- `THE CREATOR ECONOMY IS GROWING UP.` (three lines, LAND per line, `GROWING UP.` in a purple sticker box), V18, then the bible's end card (four word cards on half-beats, logo, tagline, URL, lime CTA pressed). Hold.

---

## What makes it great

- The cold open must work with the sound off: the phone, the pings, the counter.
- The rewind is the film's signature move. Build every forward animation reversible from the start, so the rewind is your own film running backwards, frame-accurate.
- 612 appears twice (cold open and chapter 8). Same typography, same sticker, so the viewer feels the loop close.
- The day counter does the storytelling between chapters; do not add extra date text.
- Keep the chapter cards fast. If a chapter runs long, cut plate time, never the Sales DNA line or the end card.
