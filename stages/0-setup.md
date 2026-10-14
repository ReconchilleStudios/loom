# 0 · Setup

The first screen of every run. It checks the machine, then the keys. Most runs pass it in one screen. A first run walks the person through the key wizard.

`<loom>` below is this skill's folder (the directory holding `SKILL.md`).

## 1. The machine

Run these quietly and show only what is missing:

| Need | Check | When missing |
|---|---|---|
| Node 18+ | `node --version` | Stop: Loom's tools need it. Say how to install it for the person's OS. |
| ffmpeg + ffprobe | `ffmpeg -version` | Stop. macOS: `brew install ffmpeg`. |
| HyperFrames | `node <loom>/tools/hyperframes/install.mjs --json` | Loom carries it. See below. |
| HyperFrames CLI | `<loom>/tools/hf.sh --version` | It installs itself through npx on first use. A failure here is a network or npm problem. |
| Chrome for rendering | `<loom>/tools/hf.sh doctor --json` and gate on `.ok` (it always exits 0) | Relay what doctor says. |
| Playwright (only if the product will be captured) | `node -e "require.resolve('playwright', {paths: ['<loom>']})"` | `npm install --prefix <loom>` then `npx --prefix <loom> playwright install chromium`, with the person's OK (it downloads a browser). |
| Claude CLI on PATH (only for parallel windows) | `command -v claude` | Versions run one by one in this session instead. |

### HyperFrames

Loom builds every picture with HyperFrames and **carries it**: `vendor/hyperframes/` holds the HyperFrames skills (v0.8.140, Apache-2.0) that Loom is verified with. `install.mjs --json` reports `overall` as one of:

- `standalone`: the person's own install; Loom uses it as it is;
- `plugin`: the Claude Code plugin; Loom uses it as it is;
- `bundled`: installed by Loom earlier;
- `partial`: some skills are missing;
- `missing`: none are installed.

On `missing` or `partial`, one `AskUserQuestion`:

- **Install the HyperFrames that comes with Loom (Recommended).** The version the reference films were made with. It is copied into `~/.claude/skills/`, works offline and never touches skills already there.
- **Install the latest from GitHub.** `npx hyperframes skills update general-video`: newer, but not the version Loom was verified with.
- **Cancel.**

Then run `node <loom>/tools/hyperframes/install.mjs --install --json` (or the GitHub command) and show the result as a state card.

Skills installed during a session may not appear in that session's skill list until Claude Code restarts. That does not stop the run:

- Act I does not use HyperFrames.
- Production windows are new sessions and see the skills.
- In a one-session run, read `~/.claude/skills/hyperframes/SKILL.md` and the skills it names directly by path.

## 2. The keys

```bash
node <loom>/tools/keys/check.mjs --json --deep
```

The result lists each service with a `status`:

- `ok`;
- `invalid`: the service refused the key;
- `blocked`: the key is accepted but the account cannot generate, because of a failed payment, no credits or a missing permission;
- `error`: the service could not be reached;
- `missing`.

Nothing in it is secret. `--deep` matters for ElevenLabs. A key with limited permissions cannot read its own account, and an account with a failed payment still accepts the key and only refuses when asked to speak. So the deep check speaks three characters on v4 Turbo, well under one credit. Every other check is free.

**All required keys `ok`:** show one state card and continue:

```diff
@@ keys @@
+ ✓ ElevenLabs   the voice              works · Creator plan
+ ✓ fal.ai       generated pictures     works
+ ✓ Pexels       stock footage          works
```

**Anything required missing or rejected**, or the run will need a recommended service that is missing: this is the key screen.

1. The banner and rail, then a **note** on why the keys matter, in the person's language. The voice comes first: the narrator is half the film, and v4 with tags is what makes it perform. The same key makes the score, the sound effects and the word timings. fal makes what no stock library has: people, products and scenes in the film's world, and stills that wake into motion. Pexels is free footage of the world around the product. Say plainly that the keys stay in one file on this machine (`<loom>/.env`, mode 600, git-ignored) and that Claude never sees them, only whether they work.
2. The current state card (`diff`, as above, with `-` rows for what is missing or rejected).
3. `AskUserQuestion`, one question:
   - **Open the key setup (Recommended).** A separate window opens where each key is pasted masked, checked with its service for free and saved.
   - **My keys are already in a .env file.** The same window; its `[i]` imports from that file.
   - **Skip for now.** Only with ElevenLabs working, or for a film with no voice and no generated media. Say what that costs.
4. On either open answer:
   ```bash
   bash <loom>/tools/keys/open.sh <en|tr>     # the person's language
   ```
   Exit 0: say in one line that the window is open, and what to do there (paste each key, Enter, close the window when it says so). Exit 3: no window could be opened; show the printed command and ask the person to run it in a new terminal.
5. `AskUserQuestion`, one question, worded in the person's language:
   - **Check keys** (the wizard's last screen tells the person to choose this one)
   - **The window did not open**: give the command from `open.sh`'s exit-3 text, or `node <loom>/tools/keys/wizard.mjs --lang <xx>`.
   - **Cancel**
6. On "Check keys", run the check again (`--json --deep`) and show the state card. If a required key still fails, say which one and why (the `detail`), and offer the window again. A `blocked` account is fixed on the service's site (an invoice, credits, the key's permissions), not with a new key. Never ask for the key in the chat.

A key the person pastes into the chat anyway is not repeated, not written anywhere and not used. Ask them to enter it in the wizard and to rotate it, because it is now in the transcript.

## 3. What each key unlocks

| Service | Without it |
|---|---|
| ElevenLabs (required for a voiced film) | No voice, no score, no sound library and no word timings. Loom can still make an unnarrated motion film on licensed music the person provides, and says so before the brief. |
| fal (recommended) | No generated people, products or footage, and no still that wakes into motion. Real captures, the product's own assets and stock only. |
| Pexels (recommended) | No stock footage. Real captures and generated media only. |

The run's stages read this table. A concept that needs a missing service is either changed or marked with what it needs before the person chooses.

## Gate

The machine has what the run needs, the check says every key the run relies on is `ok` (or the person chose to go without, knowing the cost), and nothing secret was printed.
