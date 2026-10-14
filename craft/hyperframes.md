# HyperFrames, inside Loom

HyperFrames turns HTML compositions into video. Loom uses it for every picture and keeps everything else (the research, the words, the voice, the score, the judgment) to itself. This file says which HyperFrames skill does what at which point of a Loom run, where Loom overrides it, and what the line learned the hard way.

Loom carries HyperFrames (`vendor/hyperframes/`, v0.8.140, Apache-2.0, unmodified). The setup installs it on a machine that has none (`tools/hyperframes/install.mjs`), and HyperFrames itself can also be installed separately. Keep **one** tree: the bundle, a standalone install, or the plugin, not a mix in one run.

- **With the bundle,** `tools/hf.sh` pins the CLI to the bundle's version and sets `HYPERFRAMES_SKIP_SKILLS=1`.
- **With a standalone install,** it runs the current CLI.
- **With the plugin,** whose rule is to call the CLI through its own launcher, set `LOOM_HYPERFRAMES_CLI` to that launcher.

## Who does what

| Step of a version | HyperFrames | Loom |
|---|---|---|
| Brief | `/hyperframes` reads `BRIEF.md` and skips its interview | Writes `BRIEF.md` from the version's prompt right after `init` |
| Plan | `/general-video` → `STORYBOARD.md`; `/hyperframes-creative` for composition | The shot list in the prompt is the plan; frames copy its times, stages and moves |
| Look | `/hyperframes-creative`: house style, `design.md` / `frame.md` | The bible's look overrides house style. Put it in the project's `design.md` |
| Motion | `/hyperframes-animation`, `/hyperframes-keyframes` | The bible's named moves; the run's `shared/motion/` library |
| Named looks | `/hyperframes-registry`: `npx hyperframes catalog --query "<the move>"` | Search before hand-building, then restyle to the bible |
| Voice | ~~`/media-use` TTS~~ | `tools/voice/*`. HyperFrames' ElevenLabs path is fixed to `eleven_multilingual_v2`, with no v4, no audio tags and no alignment. Loom writes `audio_meta.json` `voices[]` itself (`place.mjs --meta`) |
| Music | ~~HeyGen catalog / local generation~~ | `tools/sound/music.mjs`, `beats.mjs`, `bed.mjs` |
| SFX | ~~HeyGen library / bundled set~~ | The run's library (`sfx.mjs`) and one stem per film (`stem.mjs`) |
| Mix | `/hyperframes-audio`: `carve.mjs`, `data-fx-chain`, `data-automation`, `<hf-audio-group>` | Decides the levels (`craft/score.md`) |
| Media operations | `/media-use` cut / reframe / transform, background removal | Calls them when needed |
| Checks | `/hyperframes-cli`: `check`, `snapshot`, `compare`, `timeline`, animation map | Its own gates on top (`stages/6-closing.md`) |
| Render | `render` (user-gated) | Only through `tools/render.sh`, under the go's approval |
| Master | — | `tools/master.mjs`: the renderer has no loudness target |

## `BRIEF.md`, as Loom writes it

`templates/BRIEF.md`. The fields HyperFrames reads:

- `workflow: general-video`;
- `flow: automation` and `storyboard: no`, so it runs autonomously;
- `message`, `destination`, `aspect` (`1920x1080`, `1080x1920`, `1080x1080`), `language`, `audience`, `length`, `angle`;
- `narration: yes`, with `voice` naming Loom as the source.

Body: `## Intent`, `## Assets`, `## Customizations`, `## Notes`. Notes always carry three things:

- the render approval from the go, with its date;
- "voice, music and SFX are provided by Loom: do not generate them";
- "no feedback posting".

Rules HyperFrames holds and Loom respects:

- write `BRIEF.md` only after `init`;
- an edited brief is re-confirmed before it runs;
- inferred defaults are not recorded as the person's preferences.

## Overrides, stated once

- **Render gate.** HyperFrames never renders on passing checks alone. The person's go is the approval, written into `BRIEF.md`. Render only through `tools/render.sh`, which holds the machine lock, and **never from the Studio UI**, which bypasses it.
- **No silent fallback.** If a Loom voice tool fails, fix it or stop. Never let HyperFrames' local TTS or music fill in.
- **Telemetry off.** `tools/hf.sh` sets `HYPERFRAMES_NO_TELEMETRY=1` and `DO_NOT_TRACK=1`. Do not run `feedback --rating`: it posts to a public channel.
- **No skill refresh on the bundle.** `/hyperframes` § 4 and `/general-video`'s first step run `npx hyperframes skills update …`. When the skills carry Loom's `.loom-bundled` marker, skip that step: `general-video` is already installed, and refreshing it would pair newer skills with the pinned CLI. On a standalone install, let it run as HyperFrames intends.

## What the line hit, and the fix

From the four Affilimates demo builds (2026-10-07). Each of these cost a fix round.

**Assets and media**

- **`../assets/` paths are rejected** (`invalid_parent_traversal_in_asset_path`). Copy everything into the project's `assets/`.
- **A timed `<video>` needs `muted` or `data-has-audio="true"`** (since 0.8.107). Music, voice and replacement sound go in separate `<audio>` elements.
- **A nested timed `<video>` is ambiguous** (`nested_media_start_basis_ambiguous`). Set `data-hf-media-start-basis="local"`.
- **Footage with a long keyframe interval freezes on seek.** Re-encode the clip with a short GOP (`ffmpeg -i in.mp4 -g 15 -keyint_min 15 -c:v libx264 -crf 16 out.mp4`), or step through extracted stills.

**Audio**

- **Every `<audio>` needs an `id`,** or the render is silent. It also needs a `data-duration`, or it reads as open-ended.
- **Two clips on one track overlap** (`duplicate_audio_track`). Alternate the voice clips over two tracks.
- **Regenerating `index.html` drops the carve.** Save the carved tag and re-insert it, or make the carve the last step of the build script.

**Determinism and layout**

- **No `Math.random`, clocks or network at render time.** Do not tween `visibility`/`autoAlpha` on a `.clip`, and do not put a CSS transform and a GSAP transform on one element.
- **A kit's own `.clip` class collides with HyperFrames' `.clip`.** Rename it (the demos used `.kclip`), scope the kit's CSS under one class, and strip its transitions.
- **Scenes built while their host is `display:none` measure every box as 0.** Force layout on hidden ancestors during the build.
- **A shared script is "first loaded wins".** After changing the motion library, rebuild every scene, or a stale copy freezes the others.
- **The runtime hides an inactive scene with inline `visibility:hidden`, but a child revealed with inline `visibility:visible` leaks into other scenes.** Guard it with a root CSS rule (an opacity guard fails lint).
- **`preserve-3d` turns off fast capture.** Use 3D only where it is the shot.

**Preview and render**

- **Give each preview its own `--port`**, and stop it after use. Two previews on one port confuse the context queries.
- **The renderer lowers the audio about 1 dB** to protect the peak, so a raw render measures −14.6 to −16.7 LUFS. `master.mjs` brings it to the target.

## Commands Loom uses

```bash
<loom>/tools/hf.sh init films/<slug> --non-interactive --example=blank --skill=general-video
<loom>/tools/hf.sh check --json
<loom>/tools/hf.sh snapshot --at 2.5,7.0,11.5 -o snaps
<loom>/tools/hf.sh preview --background --port 4310        # then --stop
<loom>/tools/hf.sh catalog --query "comparison split" --json
<loom>/tools/render.sh films/<slug> renders/<slug>-raw.mp4 --fps 30
```
