# Film 120A · "Monday at Brightfold" (2-minute sales demo, Diana's structure)

You are a senior motion designer and editor making the 2-minute Affilimates sales demo with HyperFrames. Diana's direction: "This one should actually show the product solving a marketing department's day, rather than explaining every feature." The 2:00 must make a marketing leader think "This could replace a lot of what we're doing manually." It is one of four films made in parallel; the family rules are in the bible.

**Before anything else read, in full:**
1. `~/Developer/Media/Affilimates/Demo/prompts/_bible.md`
2. `~/Developer/Media/Affilimates/Demo/README.md`
3. Open `~/Developer/Media/Affilimates/Demo/captures/index.html` and look at every plate this film uses.

Then load `/hyperframes` and follow it. This prompt is the confirmed brief: do not run the intent interview, do not ask questions.

---

## Setup

- Slug: `demo-120a-monday`. Project: `~/Developer/Media/Affilimates/Demo/films/demo-120a-monday/`.
- Deliverable: `~/Developer/Media/Affilimates/Films/Affilimates Demo 2min A - Monday at Brightfold.mp4` (+ `.srt`).
- Length: **2:00**, allowed 1:58-2:04. 1920x1080, 30 fps.
- Voices: narrator **Sarah** (`EXAVITQu4vr4xnSDxMaL`); Rae's single line **Jessica** (`cgSgspJ2msm6clMCkdW9`). `eleven_v4`.
- Build each section as its own sub-composition (one per heading below), so the timeline reads cleanly in Studio.

`BRIEF.md` right after `hyperframes init`:

```markdown
---
workflow: general-video
flow: automation
storyboard: no
message: "Affilimates replaces the manual work of creator marketing: from the goal to the creator, the content, the sales and the next decision, in one place."
destination: website-and-sales-calls
aspect: 1920x1080
language: en
audience: "Marketing leaders at DTC and e-commerce brands who run creator programs"
length: 120s
angle: a-day-in-the-department
narration: yes
voice: "ElevenLabs eleven_v4, Sarah (EXAVITQu4vr4xnSDxMaL); Rae: Jessica (cgSgspJ2msm6clMCkdW9)"
---

## Intent
Diana's 2-minute sales demo, VO verbatim. Jordan Ellis (Partnerships Lead at Brightfold) moves through one campaign: command center, a new campaign, finding Rae by Sales DNA, the video brief and Milo's edit on Rae's phone, approval, commerce and performance, Milo copilot, the big close. A day-clock sticker carries the "marketing department's day".

## Assets
- ~/Developer/Media/Affilimates/Demo/captures/ and ~/Developer/Media/Affilimates/Demo/kit/assets/
- Pexels b-roll for the hook only (bright, daylight marketing team at work)
- ~/Developer/Media/Affilimates/Demo/prompts/_bible.md

## Customizations
- Day-clock sticker; word-synced UI highlights; count-ups; rings; FLIP shuffle; the Sales DNA full-frame line with the music drop; desktop-to-phone HANDOFF; STAMP; typed copilot questions; bible end card.

## Notes
- Diana's VO is verbatim. On-screen product name "Affilimates". No invented claims. No disclaimers or labels.
```

---

## The device: a day-clock

A small sticker top-right (white, 2 px border, 3 px shadow, Inter 700 26 px, a tiny clock icon) shows the time of Jordan's work. When the time changes the digits flip like a split-flap (6 f per digit). It hides during the hook, the Sales DNA line and the close.
`MON 9:02 AM` (command center) → `MON 9:40 AM` (campaign) → `MON 9:52 AM` (creators) → `TUE 10:12 AM` (brief lands on Rae's phone) → `THU 2:15 PM` (video submitted) → `THU 4:40 PM` (approved) → `30 DAYS LATER` (performance) → `TODAY` (copilot).

---

## Script (verbatim from Diana; tags are eleven_v4 performance notes)

| # | Section | Line | Tags |
|---|---|---|---|
| V1 | Hook | Your brand probably doesn't have a creator problem. | `[confident]` |
| V2 | Hook | You have a creator marketing operations problem. | `[confident]` weight on "operations" |
| V3 | Hook | What if it all lived in one place? | `[softly]` `[curious]` |
| V4 | Command center | Meet AffiliMates, the creator marketing operating system built to connect discovery, relationships, campaigns, content, commerce and performance. | `[warm]` `[confident]`, the six nouns evenly spaced |
| V5 | Command center | Instead of opening five different platforms to figure out what's happening, your team starts here. | land "starts here" |
| V6 | Campaign | Start with the goal, not a creator list. | `[confident]` |
| V7 | Campaign | Tell AffiliMates what you're trying to accomplish, who you're trying to reach, what you're selling, your platform, budget and campaign requirements. | list rhythm, a beat per item |
| V8 | Creator | And this is where AffiliMates goes beyond traditional creator marketplaces. | `[confident]` |
| V9 | Creator | We're not just asking, "How many followers does this creator have?" | `[playful]` slight shrug |
| V10 | Creator | We're asking, "Is this the right person to move this customer?" | `[confident]` slower |
| V11 | Content | Once you've found the right creator, AffiliMates helps turn the campaign brief into content designed to perform. | `[warm]` |
| V12 | Content | Creators get clearer direction. Brands get more strategic content. And everyone is working from the same campaign objective. | three beats |
| R1 | Content | Forty inches of counter. This earned a spot. | **Jessica**, `[playful]` natural, like talking to a friend |
| V13 | Performance | And after the content goes live, you're not left wondering what happened. | `[confident]` |
| V14 | Performance | AffiliMates connects creator activity to commerce and performance so your team can see what's actually working. | |
| V15 | Copilot | And with AI built into the workflow, AffiliMates doesn't just show your team data. It helps your team decide what to do next. | `[warm]`, lift on "decide what to do next" |
| V16 | Close | AffiliMates is built for what's next. | `[confident]` |

(Diana wrote dashes inside V4 and V15; they are spoken as pauses. On screen there are no dashes.)

---

## Music

ElevenLabs Music, 121 000 ms, 120 BPM, sections matching the acts:
1. `Overload` 12 000 ms: tense ticking pulse, getting busier, stops dead on the last beat.
2. `Command center` 18 000 ms: the groove arrives on beat one, bright glassy motif, confident.
3. `The goal` 20 000 ms: steady, light percussion, room for a list-like VO.
4. `Sales DNA` 20 000 ms: bass opens up, claps; at 14 s in, drums drop out for 3 s on one held chord (the Sales DNA line), back on the downbeat.
5. `Made to perform` 20 000 ms: warmer, a plucked melody, a lift at the end.
6. `Numbers` 15 000 ms: driving, the busiest groove.
7. `Copilot` 10 000 ms: lighter, curious, a ticking hi-hat like typing.
8. `Close` 6 000 ms: one strong downbeat hit, a held chord ringing out.

---

## Shot by shot (targets; land every highlight on the VO word timings)

### 0:00-0:12 · THE HOOK

- **0:00** Pexels b-roll, warm daylight, a marketing team at desks with laptops and sticky notes (search `marketing team office laptops`, `woman working laptop spreadsheet`, `team meeting startup office`; 2-3 clips, 1.2-2 s each, look at them first). Over the b-roll, chaos windows (`captures/chaos/*/full.png`, cropped to `window`) LAND around the people like they are surrounding them: sheet, inbox, dms, platform, report, folders.
- V1 at 0:00.5, V2 at ~0:03.2 ("operations" lands with a hard thunk and every window jolts 4 px).
- **0:06.4-0:09.4** No VO. Four super cards LAND on four beats in the center, each pushing the previous up into a stack (Poppins 800, 70 px, 2 px border, 6 px shadow, alternating ±2°): `Too many tools.` (white) · `Too many creators.` (lilac) · `Too much content.` (mint) · `Not enough visibility.` (cream, "visibility" in the sticker box).
- **0:09.6** V3. Everything freezes; the b-roll drops to a still; then all windows, cards and the still STACK into one point at the center: a purple tile with `app-icon.png` artwork (rounded 22%, 2 px border, 8 px shadow). Music stops dead at 0:12.0.

### 0:12-0:30 · THE AFFILIMATES COMMAND CENTER (clock `MON 9:02 AM`)

- **0:12.0** The app tile expands into `brand/today/build` (skeleton) and the tiles fill to `full` in Diana's order: Active campaigns, Creators, Content awaiting approval, Creator responses, Revenue, ROAS (performance), then Needs your attention, then Milo recommends (AI recommendations). Rebuild the tile fill natively from the crops so each one LANDS with COUNT.
- V4 at 0:12.4. Word-synced labels: as each noun is spoken, a small white pill label with an arrow (Inter 700, micro-label style) pops next to the part of the screen that does it: "discovery" → Creators nav item · "relationships" → Creator responses tile · "campaigns" → Active campaigns tile · "content" → Content awaiting approval tile · "commerce" → Revenue tile · "performance" → ROAS tile. Each pill stays; by the end of V4 six pills are on screen. PAN-READ left to right underneath.
- V5 at ~0:22.5. On "five different platforms" five tiny grey chaos thumbnails flick in at the edge and get swept off-screen by the Affilimates panel. On "your team starts here" the pills clear and the camera eases to the full dashboard with the `TODAY` eyebrow and "Good morning, Jordan" in focus.
- **0:29.0** The cursor clicks `Campaigns` in the nav (PRESS). DEAL transition.

### 0:30-0:50 · BUILD A CAMPAIGN (clock `MON 9:40 AM`)

- `brand/campaign-new/goal`. V6 at 0:30.4. The cursor glides over the goal tiles (Awareness → UGC → Sales → Affiliate) as if considering, each lifting on hover, and on "goal" PRESSES `Product Launch` → `goal-picked` (purple, check, Milo hint bar slides in). Diana lists the seven goals; all seven tiles are visible, hold them long enough to read.
- The cursor presses lime `Continue` → `details` (rebuild the five numbered cards natively so they fill on cue). V7 at ~0:35.5, each phrase lights its card with a lilac outline pulse and fills it:
  - "what you're trying to accomplish" → the `Product Launch` chip in the summary column
  - "who you're trying to reach" → (1) audience chips type in one by one
  - "what you're selling" → (2) the Brightfold Pour product card LANDS with the kettle photo
  - "your platform" → (3) TikTok, Instagram, TikTok Shop LIVE chips press on
  - "budget" → (4) the slider drags to `$25,000` (COUNT)
  - "campaign requirements" → (5) the five checkboxes tick in sequence
- **0:46.5** `summary` modal LANDS: "Here's your campaign", `37 creators fit, 9 strong matches` COUNTS. **0:49.3** the cursor PRESSES lime `Find creators`.

### 0:50-1:10 · FIND THE RIGHT CREATOR (clock `MON 9:52 AM`)

- WHIP to `brand/discover/followers` (sorted by followers, Theo first). Diana's filters set one by one, quickly, with the camera SNAPped 1.4x into the rail: Audience Fit, Product Fit, Content Fit (sliders), Sales Style (`Storyteller`, `Demonstrator`), Commerce Experience (`Experienced`, `Advanced`). Then FLIP SHUFFLE into `matched`, Rae first with `Best fit`. Cursor clicks Rae → `select` → `View Commerce Profile`.
- `brand/creator/empty` → `full`: CREATOR COMMERCE PROFILE builds: Audience 92% Match, Content 88% Match, Product 95% Match (rings COUNT), Sales Style `Storyteller + Demonstrator` (TYPE-ON), Commerce Experience `Advanced` (bar fills). Then `why`: WHY THIS CREATOR? lines check in one by one.
- V8 at ~0:55.5 over the profile build. V9 at ~1:00: SNAP ZOOM onto `184K followers` (`compare@compare-followers` crop or the header); V10 at ~1:03: SNAP across onto `5.4%` (`compare@compare-dna`).
- **1:05.5-1:09.5 · THE LINE.** The compare block LIFTS-OUT to full frame: left white `Follower count tells you who has an audience.`, right purple `Sales DNA tells you who can move a customer.` (Poppins 800, ~80 px, TYPE-ON per word, key phrases in sticker boxes). No VO, music drops to the held chord (section 4), clock hidden. Hold until both lines are fully readable plus 1 s. This is the most important frame of the film.

### 1:10-1:30 · CREATE CONTENT THAT SELLS (clock `TUE 10:12 AM` → `THU 2:15 PM` → `THU 4:40 PM`)

- **1:10** `brand/content/brief`: the campaign brief with the four colored sections HOOK · STORY · VALUE · CTA. V11 at 1:10.3.
- **1:13** HANDOFF to Rae: the four-color section bar lifts off the desktop and flies onto a phone (TWO SCREENS stage), where it becomes the timeline of `creator/brief/overview` (same four colors: the match cut that says "same objective"). Then `scene-1` with `s1-hook.mp4` playing in the example slot, "Start mid-pour."
- V12 at ~1:16: "Creators get clearer direction." (phone: scene-1, the do-list ticks) · "Brands get more strategic content." (desktop: the `Brief match 96` badge and checklist from `brand/content/review`) · "And everyone is working from the same campaign objective." (both screens side by side, the four-color bars on phone and desktop align and pulse once together).
- **1:22** Phone: `creator/brief/shoot` (record PRESS, timer) → `creator/edit/editing` (steps tick) → `ready` with `rae-cut.mp4` playing full-screen in the phone and captions on. **R1** (Jessica) plays over the hook shot of the cut, VO-free gap around it. Clock `THU 2:15 PM`.
- **1:26** Diana's pipeline `Draft → Submit → Review → Approve → Publish`: rebuild `brand/content`'s pipeline strip natively, big, centered; each step checks on a beat. On Approve: the cursor PRESSES lime `Approve`, STAMP on the video (clock `THU 4:40 PM`). On Publish: `Live on TikTok` and the first-hour stats COUNT (`brand/content/published@first-hour`).

### 1:30-1:45 · COMMERCE + PERFORMANCE (clock `30 DAYS LATER`)

- `brand/analytics/overview`. The KPI strip LANDS in Diana's order with COUNTs: Creators 23, Content 41, Clicks 128.4K, Conversions 2,071, Revenue $184,320, ROAS 4.6x. The stacked weekly chart grows; the `Rae's video goes live` sticker slaps on.
- V13 at 1:30.4, V14 at ~1:34.5. On "see what's actually working" the cursor clicks Rae's leaderboard row → `drill` panel slides in: 612 orders, $54,468, CVR 5.4% vs 1.6% with the `3.4x your average` sticker, the retention curve draws.

### 1:45-1:55 · MILO COPILOT (clock `TODAY`)

- `brand/copilot/empty` → the question TYPES into the composer with keyboard clicks: `Which creators are driving the highest conversion rate this month?` → send PRESS → three typing dots → `a1` (the ranked table builds row by row; Theo's `Big reach, low conversion` chip last).
- Then fast: `What should we change in our next campaign?` → `q2a2`: the three recommendation cards LAND. The cursor PRESSES lime `Apply to next campaign` on card 3 (Re-book Rae before Oct 20).
- V15 runs across this section starting ~1:45.5. Rebuild the composer and the typing natively; the answers are plates and crops.

### 1:55-2:01 · THE BIG CLOSE

- Clean canvas. `THE CREATOR ECONOMY IS GROWING UP.` in three lines (Poppins 900, black, `GROWING UP.` in a purple sticker box with white type), each line LANDS on a beat.
- V16 at ~1:56.5.
- Then the bible's end card, fast version (the four word cards on four half-beats, logo, `The Operating System for Creator-Led Commerce.`, `AFFILIMATES.AI`, the lime `See Affilimates in action` pressed). Hold the last frame.

---

## What makes it great

- It is a day, not a feature list: the clock moves, Jordan's cursor has intent, every screen exists because a person needs it now.
- Every noun in V4 and V7 has a visible home on screen at the moment it is spoken.
- The four-color HOOK/STORY/VALUE/CTA bar travelling from the brand's brief to Rae's phone is the film's best cut. Make it perfect.
- The Sales DNA frame gets silence and time.
- Pace: 2 minutes is long for a demo. Vary the energy: busy (hook, campaign), still (Sales DNA), warm (content), punchy (numbers), light (copilot), clean (close).
