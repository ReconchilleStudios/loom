# 4 · Design, and the go

The last questions, then everything a film is made from is written before anything is bought or built: the plates, the bible, a screenplay per version, a table read, the budget. The act ends with the go.

## The practical questions

Banner, rail at `versions`. Two `AskUserQuestion` calls at most, recommended option first.

**First call**

1. **Format:** 16:9 at 1920×1080 (website and sales calls) · 9:16 at 1080×1920 (Reels, Shorts, TikTok) · 1:1 (feeds) · 16:9 plus a 9:16 cut of each.
2. **Voices:** a different narrator for the A and B films, one character speaking for themselves where a film lets them (the demos: Sarah for A, Chris for B, Jessica as the creator) · one narrator for every version · no voice, words and music only. The preview lists the shortlist Loom would audition (`craft/voice.md`). The exact voice is settled by audition in production, so the person chooses the casting idea, not an ID.
3. **What the product may show** (`craft/truth.md`): only what ships today · vision screens marked as coming · vision shown as the product, for a sales demo the product's owner approves. Recommend by viewer: investors and sales demos usually the second or the third, a public launch the first.
4. **Where the finished films go:** a films folder the person already uses (from their memory or `CLAUDE.md`), else `<run>/final/` · `Other`. File names are `<Product> <Length> <A|B> - <Title>.mp4`, plus a `.srt`.

**Second call**

5. **The cap for paid generation** for the whole run, in USD (fal), with Loom's estimate in the preview, e.g. $20 · $40 · $80. ElevenLabs bills credits on the person's plan; their use is counted, estimated and reported, and has its own cap if the person gives one.
6. **How the versions are made:**
   - **Each in its own window, in parallel (Recommended).** One full Claude Code session per version, as the demos were made. They share one render lock and one sound library. Each window may ask for permissions.
   - **One after another, in this session.**

Write the answers into `loom.json`: `versions[]` (id, slug, title, length, aspect, deliverable name, cast), `truth`, `deliver`, `budget`, `runs`.

## Then, without asking

1. **Plates.** Build what `material.md` planned for the screens the chosen concepts use: captures of the real product, or the kit, then its captures (`shared/captures/`, with an index page or a sheet to browse). Plates are shared, read-only, by every version.
2. **The bible** (`docs/bible.md`, from `templates/bible.md`). Every version obeys it, so the films come out as one family. It covers who the films are for and the one idea; the story world, pointing to `world.md`; what the films are built with; the look; the motion vocabulary; the sound; generated and stock media; truth; production, QC and delivery.
3. **The motion library** when the run has two or more versions: the bible's named moves written once as seek-safe functions in `shared/motion/` (`craft/motion.md`), so the same move looks identical in every version.
4. **A screenplay per version** (`prompts/<slug>.md`, from `templates/prompt.md`). The prompt is the version's confirmed brief and its worker's whole instruction. It holds:
   - setup and the `BRIEF.md` block;
   - the script, verbatim, with performance tags per line;
   - the music plan, sections as acts, each at least 3 s;
   - the film **shot by shot with timecodes**: stage, plate, moves, which spoken word each action lands on;
   - a closing "what makes it great" checklist.

   `examples/affilimates/film-30a-twelve-places.md` is the standard of detail.
5. **The table read.** Two cold subagents per version, in parallel. The **muted** reader gets only the supers with their times. The **blind** reader gets only the voice lines. Each must say what the product is, who it is for, and how it made them feel, without having seen anything else. A version where either reader cannot say what the product is gets rewritten before the go. The read's answers go into the prompt's notes.
6. **The budget.** Per version: ElevenLabs characters (lines × takes × auditions), music takes, the shared sound library; fal jobs at their prices; nothing for Pexels. Total against the cap.
7. **`PLAN.md`**, in the person's language and complete on its own: the versions table (title, length, logline, structure, voice, score), the truth mode, where everything goes, the budget, and what happens after the go.

## The go

Banner, rail at `the go`, the **ready to make** card (`ui/screens.md`), then `AskUserQuestion`:

- **Start (Recommended).** This approves the delivery render of each version once every check in `6-closing.md` passes. Write that approval with its date into `PLAN.md` and into every version's `BRIEF.md` Notes.
- **Show me a screenplay first.** Show the chosen version's script table and shot list compactly, then ask again.
- **Change something.** Change it, update the papers, show the card again.

On start:

1. Make the run's **sound library** once (`tools/sound/sfx.mjs templates/sfx-library.json shared/sfx`, adapted to the bible's sounds), so no version generates its own.
2. Launch the versions: for windows, `bash <loom>/tools/run/launch.sh <run>/prompts/<slug>.md "<A · Title>"` for each, then one state card listing them; for one session, start `5-production.md` with the first version.
3. Set `loom.json` status to `production`.

## Gate

Every version has a prompt at the example's level of detail. Both table reads say what the product is. The budget fits the cap. Every plate a prompt names exists. The person chose Start.
