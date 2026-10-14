# The voice

The narrator is half of a film. A line read flat makes a good picture look cheap, and a line performed carries a weak frame. Loom directs ElevenLabs v4 the way a voice director works a booth. It casts by audition, gives one or two directions per line, records more than one take, checks every take against the script, and levels each line on its own.

What follows was measured: in a voice lab of 48 takes comparing v2 with v4 (2026-09-30), and in four demo films voiced line by line (2026-10-07).

## Models

- **`eleven_v4`** and **`eleven_v4_turbo`** give the same read: with the same seed and text, durations matched on 15 of 16 pairs and the envelopes correlated at 0.94–0.99. Turbo costs about half the credits. Audition and draft on Turbo; record the film on v4 unless `loom.json` sets `voice.model`. Choose between them by listening when someone can.
- **v4 has only stability and similarity.** It has no style or speed setting (sending `speed` does nothing or is refused). Pace and delivery come from tags in the text. SSML `<break>` is off.
- **Never put a tag in a v2 job:** v2 reads tags aloud. v4 does not.
- The API's `character-cost` header is what a request was billed. `tts.mjs` records it on the ledger. On one plan it was about 0.125 credits per character on v4 and 0.06 on Turbo. Tags count as characters.

## Casting

- **Premade voices only, addressed by id.** A key may not be allowed to list voices; these ids work:

  `Sarah EXAVITQu4vr4xnSDxMaL` · `Rachel 21m00Tcm4TlvDq8ikWAM` · `Laura FGY2WhTYpPnrIDTdsKH5` · `Jessica cgSgspJ2msm6clMCkdW9` · `Alice Xb7hH8MSUJpSbSDYk0k2` · `Aria 9BWtsMINqrJLrRacOk9x` · `River SAz9YHcvj6GT2YYXdXww` · `Chris iP95p4xoKVk53GoZ742B` · `Eric cjVigY5qzO86Huf0OWal` · `Brian nPczCjzI2devNBz1zQrb` · `Will bIHbv24MWmeRgasZH58o` · `Daniel onwK4e9ZLuTAKqWW03F9` · `Roger CwhRBWXzGAHq8TQ4Fs17` · `Adam pNInz6obpgDQGcFmaJgB` · `George JBFqnCBsd6RMkjVDRZzb` · `Matilda XrExE9yKIg1WjnnlVkGX`

- **Cast the series, not the film.** A runs with one narrator and B with another, so the two read as siblings and not as copies. A character who speaks for themselves gets their own voice (the demos used Sarah for A, Chris for B and Jessica for the creator). Write the casting into the bible.
- **Audition** each film's first two lines with the cast voice and two alternates (`tts.mjs --audition "Laura=…,Alice=…" --only V1,V2`, on Turbo). Keep the cast voice unless it clearly fails: it mispronounces the product, or its energy is wrong for the film. Write the decision and its reason in `docs/script.md`. In all four demos the cast voice was kept.

## Directing a line

- **Tags go inline, right before the words they colour,** one or two per line, never one on every word. These worked: `[confident]`, `[curious]`, `[softly]`, `[warm]`, `[excited]`, `[playful]`, `[whispers]`, `[laughs softly]`, `[pause]`. Longer stage directions work as well: `[slow, measured narration]`, `[urgent, rising tension]`, `[awestruck]`.
- **Tags move a line by up to ±5 LU and ±25 % in pace.** `[whispering]` came out 5.5 LU quieter, `[urgent, rising tension]` 4.5 LU louder and a quarter faster, `[slow, measured narration]` 13 % slower. This is why every line is levelled on its own.
- **`[pause]` is a real beat of about one second.** It can be placed on the bar grid.
- **A breath or whisper tag before a short final word can swallow the word.** "Then… `[pause] [awestruck, breathless]` water." lost "water" on both models. Keep such tags off a line's only key word. The speech-to-text gate catches it if not.
- **Stability:** 0.35–0.40 for an expressive line, 0.45 by default, 0.5–0.6 for a steady one. Stability 0.2 or 0.9 changes the reading.
- **The seed is deterministic.** The same request twice correlates at 0.993, so one line can be re-recorded without touching its neighbours. `tts.mjs` makes takes differ by seed.
- **v4 ends tight,** right on the last word (v2 left about 0.35 s of tail). `place.mjs` keeps a 140 ms tail. Check the last word's release on the waveform.

## Writing for the voice

- One thought per line. Split lines where the picture changes, because each line is placed on its own.
- The script's words are the screen's words. Write a phonetic spelling in `say` only for the voice: `"say": "[warm] Affili-mates brings…"`, and `display` maps it back for the captions.
- A run of single words for a close ("Match. Create. Sell. Measure.") is one line recorded together, then cut one word per beat (`place.mjs` `beats`).

## Pronunciation

1. Send the name as written and transcribe the take (`stt.mjs`).
2. If it comes back wrong, try spellings in `say`, one line at a time: `Affili-mates`, `Affilli-mates`, `uh-FILL-ih-mates`. Up to four tries, then pick the best and note it. One demo shipped `Affilli-mates`; another fixed "The Philomates" by reusing an audition take.
3. A fictional first name heard with another spelling ("Rae" as "Ray") is fine. List it under `accept` in `lines.json` so the gate does not fail on it.

## The pipeline

```bash
node <loom>/tools/voice/tts.mjs lines.json --audition "Laura=FGY2WhTYpPnrIDTdsKH5,Alice=Xb7hH8MSUJpSbSDYk0k2" --only V1,V2
node <loom>/tools/voice/tts.mjs lines.json --takes 2
node <loom>/tools/voice/stt.mjs takes/*.mp3 --lines lines.json
node <loom>/tools/voice/place.mjs vo.json --meta ../../../audio_meta.json
node <loom>/tools/voice/srt.mjs vo-words.json "<deliver>/<name>.srt"
```

- **Trim and pace:** each take is trimmed to its words with 70 ms before and 140 ms after. `tempo` 1.05–1.15 tightens a slow line and still sounds natural; above that it starts to sound processed.
- **Level:** each line goes to −16 LUFS from its own measurement, then through a 0.84 limiter. A line levelled with one gain for the whole voice is wrong by up to 5 LU.
- **Word timings** come from the TTS alignment, with tags removed, and are shifted into film time. Every press, super and cut is placed on them.
- **On the master,** the whole film is transcribed once more against the whole script. The demos reached 216 of 216 words and 197 of 199; the two misses were the accepted "Raye".
