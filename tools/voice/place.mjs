#!/usr/bin/env node
// Cut, pace and level the chosen takes, and place them in film time.
//
//   node <loom>/tools/voice/place.mjs <vo.json> [--meta audio_meta.json]
//
// vo.json (templates/vo.json), paths relative to the file:
//   { "lines": "lines.json", "takes": "takes", "out": ".",
//     "lufs": -16, "head": 0.07, "tail": 0.14,
//     "clips": [ { "id": "V1", "take": "V1.t2", "at": 0.34, "tempo": 1.1 },
//                { "id": "V9", "take": "V9.t1", "beats": [26.0, 26.5, 27.0, 27.5] } ] }
//
// `at` is the film time of the line's first spoken word. `tempo` (atempo,
// 1.0–1.15 sounds natural) is how v4 lines are tightened: its speed setting
// does nothing. `beats` cuts the line into one clip per word, each word
// starting on its beat (a "Match. Create. Sell." close).
//
// Each clip is trimmed to its words (head/tail kept for breath and release),
// levelled to `lufs` from its own measured loudness (tags move a line by ±5
// LU, so one gain for the whole voice is wrong), and limited at 0.84. Writes
// <out>/<id>.wav, <out>/vo-words.json (every clip and every word in film time,
// in the script's spelling) and, with --meta, HyperFrames' audio_meta.json
// voices[] so its caption and timing helpers can read Loom's voice.

import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join, relative, resolve } from 'node:path';
import { parseArgs } from '../lib/args.mjs';
import { ffmpeg, loudness } from '../lib/av.mjs';
import { scriptWords } from '../lib/words.mjs';

const args = parseArgs();
const voFile = resolve(args._[0] ?? '');
if (!args._[0] || !existsSync(voFile)) { console.error('usage: place.mjs <vo.json> [--meta audio_meta.json]'); process.exit(2); }
const vo = JSON.parse(readFileSync(voFile, 'utf8'));
const here = dirname(voFile);
const lines = JSON.parse(readFileSync(resolve(here, vo.lines ?? 'lines.json'), 'utf8'));
const takesDir = resolve(here, vo.takes ?? 'takes');
const outDir = resolve(here, vo.out ?? '.');
const LUFS = vo.lufs ?? -16;
const HEAD = vo.head ?? 0.07;
const TAIL = vo.tail ?? 0.14;
const display = lines.display ?? {};
mkdirSync(outDir, { recursive: true });

function takeWords(take) {
  const side = join(takesDir, `${take}.json`);
  const stt = join(takesDir, `${take}.mp3.stt.json`);
  const src = vo.words === 'stt' && existsSync(stt) ? stt : side;
  if (!existsSync(src)) throw new Error(`no words for ${take}: expected ${side}`);
  const words = JSON.parse(readFileSync(src, 'utf8')).words;
  if (!words?.length) throw new Error(`${take}: no words in ${src}`);
  return words;
}

/** A word as it is shown: lines.json "display" maps a spelling to the screen's ("AffiliMates": "Affilimates"). */
function shown(word) {
  for (const [from, to] of Object.entries(display)) {
    if (word.replace(/[^\p{L}\p{N}-]/gu, '') === from) return word.replace(from, to);
  }
  return word;
}

/** The script's own spelling for the take's words, when the counts agree. */
function spelled(lineId, words) {
  const line = lines.lines.find((l) => l.id === lineId);
  const script = line ? scriptWords(line.text) : [];
  if (script.length === words.length) return words.map((w, i) => ({ ...w, text: shown(script[i]) }));
  if (line) console.error(`${lineId}: take has ${words.length} words, script ${script.length}; keeping the take's spelling`);
  return words.map((w) => ({ ...w, text: shown(w.text) }));
}

/** Cut ss..ss+dur, pace, fade; level to LUFS (or by `gain` when given); limit. */
function render(src, ss, dur, tempo, out, gain) {
  const tmp = `${out}.tmp.wav`;
  const outDur = dur / tempo;
  const af = [tempo !== 1 && `atempo=${tempo}`, 'afade=t=in:st=0:d=0.02', `afade=t=out:st=${Math.max(0, outDur - 0.06).toFixed(3)}:d=0.06`].filter(Boolean);
  ffmpeg(['-ss', ss.toFixed(3), '-t', dur.toFixed(3), '-i', src, '-af', af.join(','), '-ac', '1', '-ar', '48000', tmp]);
  const g = gain ?? LUFS - loudness(tmp).integrated;
  ffmpeg(['-i', tmp, '-af', `volume=${g.toFixed(2)}dB,alimiter=limit=0.84:attack=2:release=40:level=false`, '-ac', '1', '-ar', '48000', '-c:a', 'pcm_s16le', out]);
  rmSync(tmp);
  return { duration: outDur, gain: g };
}

const clips = [];
const allWords = [];
for (const c of vo.clips) {
  const words = spelled(c.id, takeWords(c.take));
  const src = join(takesDir, `${c.take}.mp3`);
  const tempo = c.tempo ?? 1;
  const ss = Math.max(0, words[0].start - HEAD);
  const end = words.at(-1).end + TAIL;
  if (c.beats) {
    // One clip per word. Short clips cannot be measured (ebur128 gates under
    // 0.4 s), so every word takes the gain of the whole line.
    const whole = join(outDir, `.${c.id}.whole.wav`);
    const { gain } = render(src, ss, end - ss, 1, whole);
    rmSync(whole);
    if (c.beats.length !== words.length) throw new Error(`${c.id}: ${c.beats.length} beats for ${words.length} words`);
    words.forEach((w, i) => {
      const wss = Math.max(0, w.start - HEAD);
      const file = join(outDir, `${c.id}-${i + 1}.wav`);
      // A word ends before the next word's clip begins: one voice never overlaps itself.
      const room = i + 1 < c.beats.length ? c.beats[i + 1] - c.beats[i] - 0.01 : Infinity;
      const r = render(src, wss, Math.min(w.end + 0.08 - wss, room), 1, file, gain);
      const start = c.beats[i] - HEAD;
      clips.push({ id: `${c.id}-${i + 1}`, line: c.id, file: relative(outDir, file), start: +start.toFixed(3), duration: +r.duration.toFixed(3), tempo: 1, gain_db: +r.gain.toFixed(2), text: w.text, take: c.take });
      allWords.push({ line: c.id, text: w.text, start: +c.beats[i].toFixed(3), end: +(c.beats[i] + w.end - w.start).toFixed(3) });
    });
    continue;
  }
  const file = join(outDir, `${c.id}.wav`);
  const r = render(src, ss, end - ss, tempo, file);
  const start = c.at - HEAD / tempo;
  clips.push({ id: c.id, line: c.id, file: relative(outDir, file), start: +start.toFixed(3), duration: +r.duration.toFixed(3), tempo, gain_db: +r.gain.toFixed(2), text: words.map((w) => w.text).join(' '), take: c.take });
  for (const w of words) allWords.push({ line: c.id, text: w.text, start: +(start + (w.start - ss) / tempo).toFixed(3), end: +(start + (w.end - ss) / tempo).toFixed(3) });
}

clips.sort((a, b) => a.start - b.start);
allWords.sort((a, b) => a.start - b.start);
writeFileSync(join(outDir, 'vo-words.json'), JSON.stringify({ lufs: LUFS, clips, words: allWords }, null, 1));

// Overlaps on one voice are a defect HyperFrames' lint also catches late.
for (let i = 1; i < clips.length; i++) {
  const prev = clips[i - 1];
  if (prev.start + prev.duration > clips[i].start + 0.001) console.error(`OVERLAP ${prev.id} ends ${(prev.start + prev.duration).toFixed(3)} after ${clips[i].id} starts ${clips[i].start}`);
}

if (args.meta) {
  const metaFile = resolve(args.meta);
  const meta = existsSync(metaFile) ? JSON.parse(readFileSync(metaFile, 'utf8')) : {};
  meta.tts_provider = 'elevenlabs (loom)';
  meta.voice_id = lines.voice?.id ?? null;
  meta.voices = clips.map((c) => ({
    id: c.id,
    path: relative(dirname(metaFile), join(outDir, c.file)),
    start_s: c.start,
    duration_s: c.duration,
    words: allWords.filter((w) => w.line === c.line && w.start >= c.start - 0.001 && w.end <= c.start + c.duration + 0.001)
      .map((w, i) => ({ id: `${c.id}-w${i + 1}`, text: w.text, start: +(w.start - c.start).toFixed(3), end: +(w.end - c.start).toFixed(3) })),
  }));
  meta.total_duration_s = +clips.reduce((a, c) => Math.max(a, c.start + c.duration), 0).toFixed(3);
  writeFileSync(metaFile, JSON.stringify(meta, null, 2));
}

for (const c of clips) console.log(`${c.id.padEnd(7)} ${c.start.toFixed(3).padStart(8)} → ${(c.start + c.duration).toFixed(3).padStart(8)}  tempo ${c.tempo}  ${c.gain_db >= 0 ? '+' : ''}${c.gain_db} dB  ${c.text}`);
console.log(`\n${allWords.length} words → ${relative(process.cwd(), join(outDir, 'vo-words.json'))}`);
