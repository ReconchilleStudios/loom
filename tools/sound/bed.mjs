#!/usr/bin/env node
// Cut a music take into the film's bed: bar-aligned segments placed in film
// time, so the music changes where the story does.
//
//   node <loom>/tools/sound/bed.mjs <bed.json>
//
// bed.json (paths relative to it):
//   { "src": "music/score.t2.mp3", "out": "music/bed.wav", "total": 30.0, "phase": 0.02,
//     "segments": [
//       { "at": 0.0,  "from": 0.0,  "dur": 4.4, "fadeOut": 0.01 },
//       { "at": 5.0,  "from": 8.0,  "dur": 21.0, "fadeIn": 0.004 },
//       { "at": 12.0, "from": 11.5, "dur": 4.0, "reverse": true, "rate": 1.6, "gain": -3 },
//       { "at": 26.0, "from": 52.0, "dur": 4.0, "lowpass": 700, "fadeOut": 1.2 } ] }
//
// `from` is a time in the take, `phase` the take's beat one (beats.mjs) added
// to every `from`. A turn is a change of register on a downbeat (a filter,
// a drop to the kick, a riser into a hit), never silence under the voice.
// Each segment: fadeIn/fadeOut (s, default 0.012), gain (dB), lowpass/highpass
// (Hz), reverse, rate (pitch and speed together, as a tape would).

import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { parseArgs } from '../lib/args.mjs';
import { duration, ffmpeg } from '../lib/av.mjs';

const args = parseArgs();
const specFile = args._[0];
if (!specFile) { console.error('usage: bed.mjs <bed.json>'); process.exit(2); }
const spec = JSON.parse(readFileSync(specFile, 'utf8'));
const here = dirname(resolve(specFile));
const src = resolve(here, spec.src);
const out = resolve(here, spec.out);
const PH = spec.phase ?? 0;
const SR = 48000;

const parts = spec.segments.map((s, i) => {
  const fin = s.fadeIn ?? 0.012;
  const len = s.rate ? s.dur * s.rate : s.dur;
  const f = [`[0:a]atrim=start=${(PH + s.from).toFixed(3)}:duration=${len.toFixed(3)}`, 'asetpts=PTS-STARTPTS'];
  if (s.reverse) f.push('areverse');
  if (s.rate) f.push(`asetrate=${Math.round(SR * s.rate)}`, `aresample=${SR}`);
  if (s.lowpass) f.push(`lowpass=f=${s.lowpass}:p=2`);
  if (s.highpass) f.push(`highpass=f=${s.highpass}:p=2`);
  if (s.gain) f.push(`volume=${s.gain}dB`);
  f.push(`afade=t=in:st=0:d=${fin}`, `afade=t=out:st=${Math.max(0, s.dur - (s.fadeOut ?? 0.012)).toFixed(3)}:d=${s.fadeOut ?? 0.012}`);
  const ms = Math.round(s.at * 1000);
  f.push(`adelay=${ms}|${ms}`);
  return `${f.join(',')}[s${i}]`;
});
const labels = spec.segments.map((_, i) => `[s${i}]`).join('');
const graph = `${parts.join(';')};${labels}amix=inputs=${spec.segments.length}:normalize=0:dropout_transition=0,apad,atrim=duration=${spec.total}[out]`;
ffmpeg(['-i', src, '-filter_complex', graph, '-map', '[out]', '-ar', String(SR), '-ac', '2', out]);

// Gaps between segments are silence: name them, so none sits under a voice by accident.
const cover = spec.segments.map((s) => [s.at, s.at + s.dur]).sort((a, b) => a[0] - b[0]);
let reach = 0;
for (const [a, b] of cover) { if (a - reach > 0.05) console.error(`GAP ${reach.toFixed(2)}–${a.toFixed(2)} s has no music`); reach = Math.max(reach, b); }
if (spec.total - reach > 0.05) console.error(`GAP ${reach.toFixed(2)}–${spec.total} s has no music (the last chord should ring to the end)`);
console.log(`bed → ${out} (${duration(out).toFixed(2)} s, ${spec.segments.length} segments)`);
