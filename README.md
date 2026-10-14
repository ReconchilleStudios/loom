# Loom

**A film line for Claude Code.** Loom makes product films, sales demos and launch videos end to end:

1. It researches the subject from its source.
2. It pitches screenplay concepts and lets you choose.
3. It writes a bible and a shot-by-shot screenplay per version.
4. It voices each version with ElevenLabs v4, directed line by line.
5. It scores each version on a measured bar grid.
6. It builds and animates each version on [HyperFrames](https://github.com/heygen-com/hyperframes).
7. It judges each film frame by frame and delivers it mastered at −14 LUFS.

You talk to Loom; it decides with you in the opening and works on its own after you say go.

```
/loom make a 30-second and a 2-minute sales demo for our app, two versions of each
```

## What a run looks like

| | You | Loom |
|---|---|---|
| **Setup** | Paste your keys once, in a separate window | Checks each key with its service (free, or a three-letter ElevenLabs test line); never sees them |
| **Brief** | Answer a few questions: who watches, what they must think | Reads your product's repo, site and docs first |
| **Research** | Confirm the findings | The dossier: what is true only of your product, the moments of it that move on screen, one story world, a claims register |
| **Concepts** | Pick one concept per version from cards | Five or six concepts forced apart by structure, judged by three independent readers |
| **Design** | Choose format, voices, truth mode, folder, budget, then **go** | Plates, a series bible, a screenplay per version timed to the tenth of a second, two cold table reads |
| **Production** | Nothing, or watch the windows | One Claude Code window per version, in parallel, one render at a time |
| **Closing** | Watch the films | Gates on the master, three cold viewers, fix rounds, master, delivery, a report |

The opening screens are designed for the terminal: banners, a progress rail, concept cards with the structure drawn to scale, and colour-coded states.

## Requirements

- [Claude Code](https://claude.com/claude-code)
- Node 18+ and ffmpeg (`brew install ffmpeg`)
- Nothing else for the picture: Loom **bundles HyperFrames** (v0.8.140, the version its reference films were made with) and installs it on first run if the machine has none. An existing HyperFrames install or plugin is used as it is.
- An [ElevenLabs](https://elevenlabs.io) key (required for voiced films), and optionally [fal](https://fal.ai) and [Pexels](https://www.pexels.com/api/) keys
- Playwright, only if Loom will capture your product's screens: `npm install --prefix ~/.claude/skills/loom && npx --prefix ~/.claude/skills/loom playwright install chromium`

## Install

```bash
git clone https://github.com/ReconchilleStudios/loom ~/.claude/skills/loom
```

Then in Claude Code: `/loom`. On the first run Loom opens its key wizard in a new terminal window. You can also open it yourself:

```bash
bash ~/.claude/skills/loom/tools/keys/open.sh        # or: node tools/keys/wizard.mjs
node ~/.claude/skills/loom/tools/keys/check.mjs      # works / rejected / skipped, never the key
```

## Keys and privacy

Keys are written to `~/.claude/skills/loom/.env` with mode 600. The file is git-ignored. Claude never reads it, prints it or copies it; it learns only whether each key works. Every paid call is written to the run's `ledger.jsonl` before it is sent, and refused if it would cross the budget you set at the go.

## Layout

```
SKILL.md        the contract: the three acts, what never bends
stages/         0-setup … 6-closing: what happens, what it writes, the gate
craft/          story, motion, voice, score, truth, HyperFrames integration
ui/screens.md   how the opening looks in the terminal
templates/      loom.json, PLAN.md, bible.md, prompt.md, BRIEF.md and tool inputs
examples/       the reference run: four sales demos, their bible and screenplays
tools/          keys, HyperFrames install, voice, score, media, capture, render, master, QC, ledger, launcher
vendor/         HyperFrames v0.8.140 skills (Apache-2.0), installed when a machine has none
```

## Licence

Loom's own files: MIT, see `LICENSE`. `vendor/hyperframes/` is HeyGen's HyperFrames, unmodified, under its own Apache License 2.0 (`vendor/hyperframes/LICENSE`).

## Credits

The picture engine is [HyperFrames](https://github.com/heygen-com/hyperframes) by HeyGen (Apache-2.0). Loom bundles its skills unmodified in `vendor/hyperframes/` and runs its CLI from npm at the same version. Voice, music, sound effects and transcription: ElevenLabs. Generated stills and motion: fal. Stock footage: Pexels.
