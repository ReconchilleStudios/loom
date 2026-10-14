# Tools

No dependencies beyond Node 18+ and ffmpeg (Playwright only for `capture/`). Every tool prints its usage when run without arguments. Paid tools find the run by walking up to `loom.json` and write the ledger before each call.

| Tool | What it does |
|---|---|
| `keys/open.sh [en\|tr]` | Opens the key wizard in its own terminal window |
| `keys/wizard.mjs` | The wizard: why each key matters, masked input, a free check per key, `.env` at mode 600 |
| `keys/check.mjs [--json]` | Whether each key works. The only thing Claude reads about keys |
| `keys/services.mjs` | The services: names, why, where to get a key, the free check. Add one here |
| `voice/tts.mjs` | ElevenLabs v4 per line, with tags, takes by seed, auditions, alignment → words |
| `voice/stt.mjs` | Scribe transcription of takes or the master, compared with the script |
| `voice/place.mjs` | Trim, pace, level per line to −16 LUFS, place in film time → `vo-words.json`, `audio_meta.json` |
| `voice/srt.mjs` | Voice-only subtitles in the script's spelling |
| `sound/music.mjs` | ElevenLabs Music from a composition plan; refuses sections under 3 s; reports dead air |
| `sound/beats.mjs` | Tempo, beat one, every bar with its frame and loudness, section changes |
| `sound/bed.mjs` | Bar-aligned segments of a take → the bed; names every gap |
| `sound/sfx.mjs` | The run's sound library, generated and cleaned (onset trim, fade, −3 dBFS, pitched variants) |
| `sound/stem.mjs` | Cue lists → one sample-accurate SFX stem; warns on doubled cues |
| `media/fal.mjs` | fal jobs under the ledger, resumable after a drop; `--inputs <endpoint>` shows its parameters |
| `media/pexels.mjs` | Search to a contact sheet, then download only the chosen clips with credits |
| `capture/shot.mjs` | Playwright stills of a page, a state or a component, transparent crops |
| `hf.sh` | The HyperFrames CLI with telemetry off; refuses `render` outside `render.sh` |
| `render.sh` | One render at a time on the machine: waits, takes over stale locks, exits with the render's status |
| `master.mjs` | −14 LUFS / ≤ −1 dBTP, picture copied, measured afterwards, JSON for `qc.md` |
| `qc/frames.sh` | Every half second on tiled sheets, plus the hard-cut list |
| `qc/sheet.mjs` | Any stills on one sheet with a legend |
| `ledger.mjs` | What the run has spent, by service and version, against its cap |
| `run/launch.sh` | One version in its own Claude Code window, reading its prompt |
| `env.mjs`, `lib/` | Shared: key lookup, args, HTTP with retry, ffmpeg helpers, the project and ledger, words and diffs |
