# 2 · Research

Loom learns the subject from its source, not from its marketing, until it can say what is true only of this product and which moments of it move on screen. Every concept, line and number later comes out of these papers.

## Sources, in this order

1. **The product's own source.** The repo's docs (`README`, `DESIGN.md`, `PRODUCT.md`, roadmap), its UI copy strings, its data model, the screens' code. This is where capabilities are true or not. Marketing sites over-claim; they are read for tone, never as proof.
2. **The live product**, if there is one and an account: what a person actually sees and does, in what order, with what words.
3. **The brand:** logo files, fonts, the palette as hex, borders, radii, shadows, and the product's own interaction, i.e. what a button does when pressed. This becomes the film's motion (`craft/motion.md`).
4. **The person's brief or script** (stage 1), verbatim.
5. **The viewer and the market,** from the web: the viewer's job and day, their pain in their own words (forums, reviews, job posts), and the three to five alternatives with the words they all use. What everyone says is what this film must not.
6. **For a subject that is not a product** (a company, a cause, a topic): the literature, with citations, and real footage under an open licence before anything generated.

**Large sources get parallel readers.** When the repo or the material is big, send Explore subagents, one area each: capabilities from the code, the design system, the viewer and the market, the material already on disk. Each writes one report to `docs/work/`. Loom then **opens every cited file** for anything that will reach the screen. A subagent's claim is a lead, not a fact.

## The papers

All in `docs/`, in the film's language.

### `dossier.md`

- **The product** in one sentence (what it does, for whom), then one paragraph.
- **Capabilities:** shipped (each with its source, e.g. `app/deals/score.ts:41`), in progress, vision (source: a roadmap doc, or the person).
- **The viewer:** their day, the tools they juggle, the pain in their words, what they already believe, and what would make them say the reaction from the brief.
- **The market:** the alternatives, the phrases they share, and the **only-this-product** sentence: a true thing no competitor could put in its own film.
- **The sweet spot:** where the brief's frame meets the product's unique truth. For Affilimates: the brief wanted the brand's side in one place. The unique truth was that creators already work inside the app. Together that gave *two screens, one deal*, with work physically handed from the brand's desktop to the creator's phone.
- **Moments that move,** ranked. These are the dramatic assets: things the product visibly does on screen, which is what a film is made of. Examples: a grid reorders by a better signal, a brief lands on a phone, an approval stamp, a revenue figure counting up. For each: where it lives in the product, shipped or vision, and how it reaches the screen (plate, native rebuild, capture). At least five. A product with no moment that moves gets a film about its result, said honestly.
- **The brand:** palette, type, borders and shadows, the product's own interaction, and **anti-references** (what the brand must never look like: generic SaaS gradients, crypto glow, corporate navy, or whatever this market's cliché is).
- **The position:** one line, and the line that carries it, if the brief has one.

### `world.md`: the one source of truth

A table of everything fictional or fixed that the films will show or say:

- the brand, product, prices, customers, people with roles, handles, follower counts, cities, dates, campaign names, codes;
- the numbers on every screen (KPIs, scores, orders, revenue);
- how the product's name is written on screen, and how it is pronounced, with a phonetic TTS spelling if the voice gets it wrong;
- the product's own vocabulary that must not be paraphrased (Affilimates' eight selling styles, used by their exact names).

Every fictional name is web-checked before it is used: no real company or person with that name in this market. Generated people are characters, never testimonials. Platform names may appear as plain text; their logos may not.

### `claims.md`: the claims register

One row per thing a film may assert, in words or in a picture: **claim · source · status (shipped / vision) · safe wording**. QC reads the finished films against this table. A film may not make a claim the register does not have.

### `material.md`: what exists and how each picture is made

- **What is on disk:** real screens, App Store frames, photos, fonts, logos, footage, music the person owns. Each with its path and licence.
- **How the product reaches the screen**, chosen per screen:
  1. **Real product, captured as stills.** `tools/capture/shot.mjs` at 2–3×, each component cropped with `--transparent`. Never a screen recording: it is low bitrate and not seek-safe.
  2. **A kit**, for screens that are not built yet (vision) or cannot be reached. It is a static HTML rebuild of those screens in the brand's own CSS tokens, with:
     - one data file that holds every number from `world.md`;
     - states selected with `?state=`, and `?nomotion=1` for the settled frame;
     - `data-shot` on every component and a `data-ready` flag;
     - captured with `shot.mjs` into `shared/captures/`.

     The Affilimates demo kit is the worked example (`examples/affilimates/README.md`). The kit is built in stage 4, only for the screens the chosen concepts need.
  3. **Native rebuilds**, for anything that moves inside the UI: counters, typing, sliders, a grid reshuffle, a stamp, the cursor. These are built in the composition, matched to the plate pixel for pixel, so the cut between plate and rebuild is invisible.
- **World footage:** for software, the places it is used (offices, hands on keyboards and phones, screens), not the sample customer's trade. Real people in stock are atmosphere, never customers.
- **What only generation can make:** people in the story world from reference photos with a consistent face, the product in scenes, a still that wakes into motion near the end. Each is priced in `material.md` before it is made.

## The screen

While reading, one line saying what is being read. At the end, the **findings** sheet (`ui/screens.md`): product, viewer, pain, only-us, look, and the ranked moments that move. Then one `AskUserQuestion`:

- **Right, write the concepts (Recommended)**
- **Something is off**: the person says what, Loom corrects the papers and shows the sheet again

## Gate

Every capability in the dossier has a source that was opened. The only-this-product sentence exists and is true. At least five moments that move are ranked. `world.md` has every name and number the films will need, and the fictional names were checked. `claims.md` exists. `material.md` says how each product screen will reach the picture.
