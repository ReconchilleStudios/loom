# The reference run: Affilimates sales demos

Four films made on 2026-10-07 in four parallel windows from one bible. These files set Loom 1.5's standard of detail. When a screenplay or a bible is written, it is compared with these.

| File | What it is |
|---|---|
| `bible.md` | The series bible: brief, story world, material, look, the "Press & Stack" motion vocabulary, sound, media, truth, production and delivery |
| `film-30a-twelve-places.md` | 30 s A, the stakeholder's structure: twelve tools collapse into one platform (delivered 30.0 s) |
| `film-30b-who-sells-more.md` | 30 s B, a different story to the same close: which creator sells more (30.0 s) |
| `film-120a-monday-at-brightfold.md` | 2 min A: a marketing department's day solved scene by scene (2:03) |
| `film-120b-rewind.md` | 2 min B: open on the result, rewind, play the campaign forward (2:03.5) |
| `motion/_lib.js`, `_lib.css` | 2:00A's move library ("M"): land, press, cursor, tap, count, type-on, stamp, deal, whip, camera, phone |
| `motion/film.js` | 2:00B's library ("AF"), with `reverse()`, the rewind engine |

## How the run was set up

- **A kit, not the app.** The vision screens did not exist yet. A static HTML rebuild of Affilimates' screens was made instead: the shipped look plus the vision screens, in the app's own CSS tokens. It had:
  - one `data.js` holding every name and number;
  - states selected with `?state=` and `?nomotion=1`;
  - `data-shot` on every component;
  - Playwright captures of every state and every component at 3×, browsable on an index page.

  The films used those plates, with native rebuilds for anything that moved. The kit is not included here; `stages/2-research.md` describes how to build one.
- **One story world:** Brightfold (a fictional kitchenware brand), its kettle, its partnerships lead, a creator and her foil, and every number fixed in one table.
- **A stakeholder's script** used verbatim for the A films. The B films told different stories to the same goal and the same close.

## Where Loom 1.5 differs from these files

These are the files as they ran. A Loom 1.5 run changes three things:

- **Keys** come from `<loom>/.env` through the key wizard, not from a `.env` on the desktop.
- **The music never drops out.** The bible's "one silence per film" is replaced by a change of register on the downbeat (`craft/score.md`). A stop under the voice reads as the film breaking.
- **The truth mode is chosen,** not assumed. These films showed vision screens as the product, by the product owner's choice (`craft/truth.md`).

The production lessons of the four builds are folded into `craft/hyperframes.md` (HyperFrames gotchas), `craft/voice.md`, `craft/score.md` and `tools/`.
