# Loom changelog

## 1.5.0 · 2026-10-14

Loom becomes a film line any Claude Code user can run. It turns the process that made the four Affilimates sales demos (2026-10-07) into a skill, and puts HyperFrames inside it as the engine.

- **Three acts.** An interactive opening covers setup, the brief, research, the writers' room, design and the go. Production and the closing run on their own after the go. Questions belong only to the opening.
- **Designed screens.** The opening has its own visual language in the terminal (`ui/screens.md`): banners, a progress rail, concept cards with the act structure drawn to scale, and `diff`-coloured state cards.
- **The key wizard.** `tools/keys/` opens its own terminal window and explains why each service matters, with the voice first. Each key is entered masked, checked against its service for free, and saved to `.env` (mode 600, git-ignored). Claude never sees a key; it only runs `check.mjs`, which reports ok or not.
- **Research like the reference run.** The product is learned from its source. The run keeps a dossier with ranked moments that move, one story world, a claims register, and a material plan: real captures, or a kit for vision screens.
- **The writers' room.** Concepts are forced apart by structure and judged by three independent readers (viewer, filmmaker, producer). The person chooses one concept per slot from cards.
- **A bible and a screenplay per version,** at the reference run's level of detail. Two cold table reads (muted and blind) happen before the go.
- **The voice.** ElevenLabs v4 or v4 Turbo, directed with audio tags and cast by audition (`tools/voice/`):
  - two takes per line;
  - every take transcribed back and compared with the script;
  - every line levelled on its own;
  - word timings from the TTS alignment drive every action;
  - captions in the script's spelling.

  HyperFrames' own ElevenLabs path (fixed to `multilingual_v2`, no tags) is never used.
- **The score.** ElevenLabs Music planned as the acts, measured on its bar grid and cut to the picture's bars. The score never drops out under the voice.
- **The sound library.** Made once per run and cleaned automatically (generated effects arrive quiet, late or doubled), then placed on one stem per film.
- **Production in parallel windows**, one Claude Code session per version (`tools/run/launch.sh`). `tools/render.sh` keeps one render at a time on the machine: it waits, takes over stale locks, exits with the render's own status, and refuses renders that would bypass it.
- **The closing:** technical, picture, words, truth and craft gates on the master, then three cold viewers (two of three must say what the product is), bounded fix rounds, the −14 LUFS master (`tools/master.mjs`) and delivery.
- **The ledger.** Every paid call is written to `ledger.jsonl` before it is sent. A call that would cross the run's cap is refused.
- **Lessons folded in** from the four demo builds: the HyperFrames lint and runtime gotchas, ElevenLabs Music refusing sections under 3 s and returning dead air, carve lost on index regeneration, the cursor over labels, the Studio UI bypassing the render lock.

## Earlier

Loom 1.2 (production) and 1.3 (authorship) were Remotion-based lines for one person's product films, with their own rules; 1.5 keeps their standards of truth and measurement and starts its rulebook fresh.
