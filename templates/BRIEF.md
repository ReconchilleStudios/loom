---
workflow: general-video
flow: automation
storyboard: no
message: "<the version's one sentence: what the viewer must take away>"
destination: <website-and-sales-calls | social-feed | investor-meeting>
aspect: <1920x1080 | 1080x1920 | 1080x1080>
language: <en>
audience: "<the viewer, from loom.json>"
length: <30s | 2m>
angle: <the concept's structure, e.g. problem-to-platform, question-first, day-in-the-life, rewind>
narration: yes
voice: "Provided by Loom: ElevenLabs <model>, <voice name> (<voice id>), placed in assets/audio/vo"
---

## Intent
<Two or three sentences from the version's prompt: the concept, the reaction it must cause, the look and the motion vocabulary by name.>

## Assets
- <run>/shared/captures/ — product plates and component crops (copy what you use into assets/)
- <run>/shared/sfx/ — the run's sound library (cleaned WAVs)
- <run>/shared/motion/ — the run's motion library
- <run>/docs/bible.md, <run>/docs/world.md — the rules and the one source of truth

## Customizations
- <The version's signature device and the moves it leans on, by their bible names.>

## Notes
- Render approval: the person approved the delivery render at Loom's go on <date>, to run once every check in Loom's stages/6-closing.md passes. Render only through Loom's tools/render.sh.
- Voice, music and sound effects are provided by Loom. Do not generate TTS, BGM or SFX with media-use.
- The voice is verbatim from the prompt's script. No invented claims; no disclaimers or labels beyond the run's truth mode.
- Telemetry off (tools/hf.sh). No feedback posting.
