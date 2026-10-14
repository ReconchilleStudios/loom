# Affilimates demo films · production bible

Read this whole file before you plan anything. Your film prompt says what to make; this file says how every Affilimates film looks, moves, sounds and stays true. Four films are being made in parallel in four terminals from these rules, so they must feel like one family.

Kit root: `~/Developer/Media/Affilimates/Demo` (below: `DEMO`). Read `DEMO/README.md` too.

---

## 1. Who it is for, and the one idea

**Brief from Diana (marketing):** two sales demos for marketing leaders at DTC and e-commerce brands.
- "The 30 should create the 'I need this' reaction."
- "The 2:00 should make a marketing leader think 'This could replace a lot of what we're doing manually.'"
- "This one should actually show the product solving a marketing department's day, rather than explaining every feature."

**Positioning:** creator marketing at scale is an operations problem. Affilimates is the operating system for creator-led commerce. **Match. Create. Sell. Measure.**

**The line that carries the whole position** (Diana: "very important"):
> Follower count tells you who has an audience.
> Sales DNA tells you who can move a customer.

**The sweet spot between Diana's brief and the real product (the creative position of every film):**
Diana's frame is the brand's side: one place for discovery, campaigns, content, commerce and performance. What no marketplace has is that **creators already work inside Affilimates**: Milo, the AI, reads their brand-deal inbox, scores every offer and drafts replies, and each creator has a Creator Commerce Profile built from a 20-question sales quiz (8 real selling styles). So the brand's side is wired straight to the creator's phone.

Every film therefore shows **two screens, one deal**: the brand's desktop is the main stage, and the creator's phone appears at the exact moments the creator acts (the offer lands, the video brief, the shoot, Milo's edit, the submission). Work is physically handed between the two screens. That handoff is the visual signature of the series.

---

## 2. Story world (fixed, never change a name or a number)

| | |
|---|---|
| Brand | **Brightfold**, DTC kitchenware (fictional). Brand-side user **Jordan Ellis**, Partnerships Lead. Plan chip "Brand · Growth plan". |
| Product | **Brightfold Pour**, matte sage-green gooseneck kettle with a light oak handle, **$89**. Photos: `DEMO/kit/assets/photo/kettle-*.{png,jpg}`. |
| Campaign | **Brightfold Pour · Fall Launch**, goal **Product Launch**, budget **$25,000**, platforms TikTok, Instagram, TikTok Shop LIVE. |
| Creator | **Rae Donovan** `@rae.donovan`, Portland OR, small-space cooking, **184K** followers. Commerce Profile: **Audience 92% · Content 88% · Product 95% match**, Sales Style **Storyteller + Demonstrator**, Commerce Experience **Advanced**. CVR **5.4%** vs Brightfold average **1.6%** (**3.4x**), **612 orders**, **$54,468** revenue. |
| The offer | **$1,200 + 10% commission**, **1 TikTok · 40 seconds**, **Due Oct 20**, code **RAE15**. Brief match **96**. |
| The foil | **Theo Marsh** `@theomakes`, comedy lifestyle, **1.2M** followers, Enthusiast, commerce experience New, **74 orders**, CVR **0.4%**. |
| Others | Mina Cho 38K (Demonstrator + Problem Solver), Priya Natarajan 62K (Educator + Demonstrator), Sam Okoro 95K (Reviewer + Closer), Dani Ruiz 240K (Storyteller), Lou Bennett 410K (Expert). |
| Today (brand) | Monday, Oct 12. Active campaigns **6**, Creators **48**, Content awaiting approval **7**, Creator responses **12**, Revenue 30 days **$184,320** (+38%), ROAS **4.6x**. |
| Analytics | Creators 23, Content 41, Clicks 128.4K, Conversions 2,071, Revenue $184,320, ROAS 4.6x. |
| Milo | The AI, in the creator app and on the brand side ("Milo AI · Copilot"). Avatar `DEMO/kit/assets/brand/milo-avatar.png` (100 px: keep it small). |

**Selling styles are the app's own eight:** The Storyteller ("Let me tell you what happened when I started using this."), The Educator, The Demonstrator ("Let me show you exactly how this works."), The Problem Solver, The Reviewer, The Enthusiast, The Expert, The Closer. Commerce experience levels: New / Developing / Experienced / Advanced. Never invent another style name.

**Product name on screen:** `Affilimates` (how the app and docs write it). Diana's script writes `AffiliMates`; the voiceover says it either way. The end card URL is `AFFILIMATES.AI`.

**Pronunciation:** "uh-FILL-ih-mates". Check the TTS output with speech-to-text; if it comes back wrong, write `Affili-mates` in the TTS text only.

---

## 3. What you build with

Read `DEMO/README.md` for the page and state table. In short:

- **Kit captures** `DEMO/captures/<page>/<state>.png` (desktop 2880x1800, mobile 1170x2532) and `<state>@<shot>.png` (each component at 3x). Browse `DEMO/captures/index.html`. These are your UI plates.
- **Footage:** Rae's five scene clips `DEMO/kit/assets/footage/s1-hook.mp4 … s5-cta.mp4` (1080x1920, 6 s, silent) and `rae-cut.mp4` (the five back to back, 30 s). Stills with the same names `.jpg`. Captions for the cut, by time: 0.3-2.6 "Forty inches of counter." · 2.6-5.6 "This earned a spot." · 6.3-8.9 "Everything on my counter" · 8.9-11.8 "has to fight for its spot." · 18.4-21.0 "It holds temp for an hour." · 21.0-23.6 "I checked." · 24.4-26.9 "Link's in my bio." · 26.9-29.8 "RAE15 takes 15% off." Hook text 0-5.6 "40 inches. One kettle.", sticker 12.6-17.8 "Slow, steady pour".
- **People:** `DEMO/kit/assets/people/{rae,theo,mina,priya,sam,dani,lou,jordan}.jpg`.
- **Brand:** `logo.svg` (wordmark), `logodashboard.svg` (M mark), `app-icon.png` (1024), `milo-avatar.png`.
- **Fonts:** `DEMO/kit/assets/fonts/` (Poppins 400-900, Inter 400-800). Copy them into your project; no other font.

**Three ways to put UI on screen, in this order of preference:**
1. **Plates and crops** from `captures/` animated in the composition (camera moves, LIFT-OUT of a crop, LAND of a crop).
2. **Rebuild the micro-moment natively** for anything that must move inside the UI: counters, typing, rings filling, a slider dragging, the grid shuffle, the stamp, the cursor, a nav highlight. Copy `kit/css/mate.css` and the fonts into your project and rebuild just that component in HTML so GSAP drives it seek-safe. It must match the plate pixel for pixel so you can cut between them invisibly.
3. **New Playwright angle:** `cd DEMO && node capture/shot.mjs <page> <state> --el <shot> --scale 3 --out <your project>/assets/x.png` (see README). Never edit kit files. If you need a state that does not exist, copy the page HTML into your own project folder, change it there, and shoot that copy with Playwright (point `shot.mjs` logic at your copy, or write a 10-line script).

Do not record UI with Playwright video (low bitrate, not seek-safe). Stills plus native rebuilds look sharper and stay deterministic.

**Real shipped screens** (optional proof shots): `~/Developer/Media/Affilimates/Screenshots/source/raw/*.png` (390x790 @3x: My Deals list, Deal Details with "SOLID DEAL 81", the respond sheet, the Deal Script, the media kit). They are an older look of the same story world; never cut them next to the kit's deck screens in the same sequence.

---

## 4. Look

The brand is **neo-brutalist** (from the app's `docs/DESIGN.md` and `docs/PRODUCT.md`):

- Hard **2 px black borders**, **solid offset black shadows** with no blur. **Shadow depth = hierarchy:** chips 2 px, cards 3 px, primary button 4 px, hero card 6-8 px.
- Flat fills, no gradients. Palette: purple `#7614FF` (identity, the color that pops), lilac `#E9D4FF`, pale purple `#E2D3FC`, canvas `#F5F3FF`, mint `#B9FDF3`, cream `#FEFBD6`, pink `#FDE2F1`, ink `#0A0A0A`.
- **Lime `#DAFB38` means "this is the thing to click."** In the films lime appears only on buttons being pressed and on the final CTA. Never as decoration, never as a background, never on a word.
- **Poppins** 800/900 for every headline and super, tight leading (1.0-1.05), tracking -0.02em. **Inter** for UI text and micro-labels (11-14 px equivalent, 600, uppercase, +0.08em tracking).
- Never light grey text. Floor: `#4B5563` at weight 500+.
- **Anti-references (any of these is a defect):** generic B2B SaaS (blue gradients, 3D blobs, a dashboard floating in a browser frame on a gradient, a "Trusted by" logo wall), crypto or AI hype (dark mode, neon glow, particle fields, lens flares, "the future of X is here"), corporate fintech (navy and gold, serif headlines, handshake stock footage).

**Stages** (every shot sits on one of these):
- **FULL-BLEED UI:** a desktop plate fills the frame and the camera moves inside it. No browser chrome.
- **BOARD:** canvas `#F5F3FF`, UI panels as cards (2 px border, radius 16-20, offset shadow 8 px) and the **phone** (flat black bezel `#131418`, 2 px black outline, 10 px offset shadow, drawn iOS status bar, no glossy reflection, rotation at most ±6°). Desktop panel and phone side by side is the TWO SCREENS stage.
- **TYPE:** one solid fill (purple with white type, or lilac / mint / cream / canvas with black type), words as the image.
- **FOOTAGE:** Rae's clips or b-roll, full-bleed or inside the phone.

**Supers (on-screen text):** at most 7 words per card. The key word sits in a **sticker box**: white box, 2-3 px border, 4-6 px offset shadow, rotated -2 to -3°, like the App Store frames ("More **collabs.**"). A micro-label eyebrow may sit above. Keep 5% safe margins. Hold any text at least (words x 0.25 s + 0.6 s).

**End card (same system in all four films, built once per film, 4-6 s):**
1. Canvas `#F5F3FF`. Four word cards land on four beats: **MATCH.** (purple, white type) · **CREATE.** (lilac) · **SELL.** (mint) · **MEASURE.** (cream). Poppins 900, ~120 px at 1080p, 2 px border, 6 px shadow, alternating ±2° rotation.
2. The cards slide up and shrink into one row; the `logo.svg` wordmark lands in the center, then `The Operating System for Creator-Led Commerce.` (Inter 600, ~30 px) and `AFFILIMATES.AI` (Poppins 800, +0.04em).
3. A lime button `See Affilimates in action` lands; the cursor presses it (the PRESS move). This is the last lime on screen. Hold the last frame 12 frames.

No disclaimers or labels anywhere in the film: no "Demo data", no "Coming soon", no "In development", no "Example" stamps. The vision screens are shown as the product. (The video brief's own "Example" chip on Milo's example clip is product UI, not a disclaimer, and stays.)

---

## 5. Motion: "Press & Stack"

The brand's own interaction is the **press**: on click an element moves 1 px right and down while its shadow shrinks by 1 px, so it sinks into the page. The whole motion language grows from that: **things are cards set down on a table, pressed, lifted and stacked.** Nothing floats, glows or dissolves.

Named moves (30 fps; use these names in your storyboard):

| Move | What happens |
|---|---|
| **LAND** | Element enters y +24 px → 0, scale 0.96 → 1, opacity 0 → 1 over 10-12 f, `back.out(1.6)`. Its shadow grows 0 → its depth over the same window, finishing 2 f after the position settles (it drops onto the page). A soft card thunk on the settle frame. |
| **PRESS** | Cursor travels in 8-12 f (`power3.out`), the button translates (+1,+1) and its shadow drops 1 px for 3 f, then returns. Tactile click. Any clickable element sinks this way (tiles, chips, nav items); only primary buttons are lime. |
| **LIFT-OUT** | A component crop leaves its screen: shadow 3 → 12 px while it scales up to ~70% of frame (`expo.inOut`, 14-18 f); the screen behind takes a flat 80% canvas veil (no blur). The crop becomes the next scene's container. |
| **DEAL** | Transition: 2-4 solid panels (purple, lilac, mint, cream, each with a 2 px black leading edge) slide across the frame 2 f apart, like cards dealt, cover, then reveal the next scene. 14-18 f total. |
| **SNAP ZOOM** | Camera punch-in 1.0 → 1.5-1.8 on a component in 8 f `expo.out`, hold, ease back out in 12 f. Animate the inner visual wrapper, never the timed clip. |
| **PAN-READ** | Slow push of 2-4% over a reading hold, `sine.inOut`. The default "alive" state of any held plate. |
| **FLIP SHUFFLE** | A grid reorders: each card arcs to its new slot, 1 f stagger, slight overshoot, card thunks. |
| **STACK** | Many cards or windows converge to center with random ±6° rotations into one pile (`power4.in`, 8-12 f), one thunk on impact; the top card becomes the next thing. |
| **TYPE-ON** | Supers reveal per word, not per letter; the sticker box draws in from the left (scaleX 0 → 1, 6 f) and its word sits on it. |
| **COUNT** | Numbers count up with tabular figures (`power2.out`); the final value lands with a 1.06 pop and a one-step shadow pulse. Counter ticks underneath. |
| **STAMP** | An approval stamp slams from scale 1.6, -12° to 1.0, -7° in 6 f, with a 2-frame 6 px camera shake. The only shake allowed. |
| **HANDOFF** | An object leaves the desktop and lands on the phone (or back) along a curved path; on the TWO SCREENS stage the camera follows it. The series' signature. |
| **WHIP** | Fast lateral whip between two scenes with capped directional blur. The only blur allowed. |

Rules: one hero motion at a time; entrances `back.out` or `expo.out`, exits `power3.in`, camera `expo.inOut`; never linear except scrubs and counters. Cut on the beat. Every scene has a PAN-READ under it so nothing is ever fully static, except the final end-card hold.

**Cursor:** a black arrow with a 2 px white outline, about 1.6x the macOS size at 1080p, with a slight lag on direction changes. On the phone use a tap: a black 44 px ring with a white center, scaling 1 → 0.85 on tap. Drawn by you, deterministic.

**Registry starting points** (search before hand-building, then restyle everything to section 4): `whip-pan-cut`, `directional-wipe`, `oversized-cursor`, `cursor-glyph-trail`, `number-wheel`, `mk-progress-stat`, `device-frame-stage`, `multi-device-splay`, `comparison-split`, `animated-bar-chart`, `pull-back-reveal`, `logo-brand-close`. Do not use `logo-outro` as is (its glow bloom breaks the brand). Search with `npx hyperframes catalog --query "<the move in English>"`.

---

## 6. Sound

**Keys:** `set -a; source ~/Desktop/RemotionHyperFrames/.env; set +a` gives `ELEVEN_KEY`, `FAL_KEY`, `PEXELS_API_KEY`. Never print, log or copy a key into a file.

**Voiceover: ElevenLabs `eleven_v4`.**
- `POST https://api.elevenlabs.io/v1/text-to-speech/<voice_id>?output_format=mp3_44100_192`, header `xi-api-key: $ELEVEN_KEY`, body `{"text": "...", "model_id": "eleven_v4"}`. The key cannot list voices or models; use these verified IDs:
  `Sarah EXAVITQu4vr4xnSDxMaL` · `Rachel 21m00Tcm4TlvDq8ikWAM` · `Laura FGY2WhTYpPnrIDTdsKH5` · `Jessica cgSgspJ2msm6clMCkdW9` · `Alice Xb7hH8MSUJpSbSDYk0k2` · `Aria 9BWtsMINqrJLrRacOk9x` · `River SAz9YHcvj6GT2YYXdXww` · `Chris iP95p4xoKVk53GoZ742B` · `Eric cjVigY5qzO86Huf0OWal` · `Brian nPczCjzI2devNBz1zQrb` · `Will bIHbv24MWmeRgasZH58o` · `Daniel onwK4e9ZLuTAKqWW03F9` · `Roger CwhRBWXzGAHq8TQ4Fs17` · `Adam pNInz6obpgDQGcFmaJgB` · `George JBFqnCBsd6RMkjVDRZzb`.
- **Casting (fixed so the series is consistent):** films **A** narrator **Sarah**; films **B** narrator **Chris**; **Rae's own voice** (when a film lets her speak) **Jessica**. Audition step: render the film's first two lines with the cast voice and with two alternates from the list; keep the cast voice unless it clearly fails (mispronounces the name, wrong energy). Write the decision and reason in `docs/script.md`.
- **Emotion tags work and are not spoken** (tested): put them inline in square brackets before the words they color, e.g. `[whispers]`, `[curious]`, `[excited]`, `[confident]`, `[warm]`, `[softly]`, `[playful]`, `[laughs softly]`, `[pause]`. Use them where the script marks them; one or two per line, never on every word. Lower `voice_settings.stability` (about 0.35) makes a line more expressive, higher (0.6) steadier.
- Generate **one file per line**, not the whole script, so you can time each line to picture. Trim heads and tails; keep breaths that sound natural.
- **Word timings:** `POST https://api.elevenlabs.io/v1/speech-to-text` (multipart: `model_id=scribe_v1`, `file=@line.mp3`) returns each word with start and end. Use them to land supers, presses and cuts on the exact word. Also use it to check the name is said right.

**Music: ElevenLabs Music.** `POST https://api.elevenlabs.io/v1/music` with `{"model_id":"music_v1","composition_plan":{...},"respect_sections_durations":true}`, `output_format=mp3_48000_192`. A plan has `positive_global_styles`, `negative_global_styles` and `sections` (each: `section_name`, `positive_local_styles`, `negative_local_styles`, `duration_ms`, `lines: []`). Make the sections your acts so the music changes where the story does.
- Global style for the series: instrumental, modern indie electronic pop, 120 BPM, tight punchy kick, plucked synth bass, dry claps on 2 and 4, short bright synth stabs, a playful glassy motif, confident and optimistic, open mids for a spoken voice, clean modern mix. Negative: vocals, choir, spoken word, EDM white-noise risers, cinematic trailer booms, cymbal washes, lo-fi, trap hi-hats, dubstep.
- 120 BPM: a beat is 15 frames, a bar 2 s. Cut on beats, change scenes on bars. Generate, then fit the picture to the bars (not the other way round). Generate up to 3 takes and pick by ear-proxy: check the waveform for the section changes landing where planned.
- **One silence per film:** the music drops out for the Sales DNA line (or the film's equivalent peak) and comes back on its last word.

**SFX: ElevenLabs sound generation.** `POST https://api.elevenlabs.io/v1/sound-generation` with `{"text": "...", "duration_seconds": 0.6, "prompt_influence": 0.45, "model_id": "eleven_text_to_sound_v2"}`. Build a small library once and reuse it: tactile UI click, card set down on a wooden table (thunk), paper card slide, short dry whoosh, mechanical counter tick, rubber stamp thud, phone haptic buzz, soft generic notification ping (not an iOS sound), keyboard typing (short burst). Short and dry, no reverb tails.

**Mix:** VO about -16 LUFS short-term and always intelligible; music ducked 8-10 dB under VO with a voiceover carve (`/hyperframes-audio`); SFX tucked under VO. Deliver **-14 LUFS integrated, -1.0 dBTP**. Check with `ffmpeg -i out.mp4 -af ebur128=peak=true -f null -`.

---

## 7. Generated and stock media

**fal** (`FAL_KEY`). Use `DEMO/_gen/fal.mjs` (copy it into your project; it reads a jobs JSON, polls the queue, downloads, writes a sidecar and appends `DEMO/cost.log`). Verified endpoints and prices:
- `fal-ai/nano-banana-2` (text to image, $0.08) and `fal-ai/nano-banana-2/edit` (with reference images, $0.08). For anything with Rae, pass `kit/assets/people/rae.jpg` and the kettle `kit/assets/photo/kettle-hero-1920.jpg` as references and say "keep her exact face, hair and oatmeal knit sweater" and "keep the exact same matte sage-green gooseneck kettle with the light oak handle".
- `fal-ai/veo3.1/fast/image-to-video` ($0.15 per second; `aspect_ratio` 9:16 or 16:9, `duration` 4s/6s/8s, `resolution` 1080p, `generate_audio` false). Animate a still you generated first.
- Check any other endpoint's inputs at `https://fal.ai/api/openapi/queue/openapi.json?endpoint_id=<id>`. A lip-sync option exists (`minimax/h3-max/lip-sync/image-to-video`) if a film needs Rae speaking on camera.
- **Budget: $20 of fal per film**, logged. Prefer reusing the kit's footage.

**Pexels** (`PEXELS_API_KEY`) for b-roll: `GET https://api.pexels.com/videos/search?query=<q>&orientation=landscape&size=large&per_page=15`, header `Authorization: $PEXELS_API_KEY`. Download the largest `video_files` entry at 1920 wide or more into your project's `assets/broll/` with a sidecar (id, url, user). **Look at every clip before you use it** (a frame contact sheet): no logos or readable brand names, no dark or neon offices, warm daylight, people as atmosphere only (never presented as customers).

---

## 8. Truth and safety

- **No invented claims about Affilimates itself** in VO or supers: no "saves 10 hours a week", no "trusted by 1,000 brands", no "3x faster". Numbers inside the fictional story are fine.
- Every brand, creator and person is fictional. No real brands or logos. Platform names may appear as plain text (TikTok, Instagram, YouTube Shorts, TikTok Shop); no platform logos.
- Generated people are characters, never testimonials.
- On-screen text: English, no em dashes or en dashes (use a period or a comma). VO scripts keep their punctuation only for timing.
- **Do not touch** the app repo (`~/Developer/App/affilimates`), other films' folders, `DEMO/kit/` or `DEMO/captures/`. Copy what you need into your project.

---

## 9. Production, QC, delivery

- **Project:** `npx hyperframes init DEMO/films/<your-slug>` (the folder must not exist yet), then immediately write `BRIEF.md` from your prompt, then follow `/general-video`. Load the domain skills it routes to: `/hyperframes-core`, `/hyperframes-animation`, `/hyperframes-keyframes`, `/hyperframes-audio`, `/hyperframes-registry`, `/hyperframes-creative`, `/media-use`, `/hyperframes-cli`.
- **Run shape:** `flow: automation`, `storyboard: no` → autonomous. Ask the user nothing; state each decision in one line with its reason. Your prompt is the confirmed brief.
- **Format:** 1920x1080, 30 fps, H.264 MP4, AAC 48 kHz stereo.
- **Render lock:** only one full-quality render on this machine at a time across all terminals. `mkdir DEMO/.render-lock` succeeds → render → `rmdir DEMO/.render-lock` (also when the render fails). If `mkdir` fails, another film is rendering: keep working (snapshots, audio, QC) and try again in a few minutes. Draft snapshots do not need the lock. Before rendering, check at least 10 GB free disk (`df -h ~`).
- **QC before delivery (CLAUDE.md: "a green check means no error, not correct output"):**
  1. `npx hyperframes check` clean.
  2. A snapshot sheet at every scene midpoint, and **look at it**: clipped or overlapping text, a word hidden under the cursor, empty frames, stretched images, a plate showing the wrong state, a number that differs from section 2, lime used as decoration, light grey text.
  3. Frame samples every 0.5 s across the whole render for flashes and jumps.
  4. Loudness measured (section 6). Every VO word intelligible over the music; no clipped word starts.
  5. Duration within your prompt's limit.
- **Render approval:** the person who pasted your prompt pre-approves the delivery render once every check above passes. Open the Studio preview, post the summary, then render without waiting.
- **Deliver:**
  - Final MP4 to `~/Developer/Media/Affilimates/Films/<the exact file name in your prompt>.mp4`, plus a `.srt` with the same name next to it (VO lines only).
  - In your project `docs/`: `script.md` (final VO with timecodes, voices and tags), `shotlist.md` (every shot: time, stage, source file, moves), `qc.md` (the checks and what you fixed), `sources.md` (every generated or stock asset with its cost or license).
  - Append one line to `DEMO/films/DELIVERED.md` (create it if missing; append only): `<date> · <file name> · <duration> · <one-sentence logline>`.
- Final report to the user: the MP4 path, actual duration, loudness, a link to the snapshot sheet, total spend, anything you could not do and why.
