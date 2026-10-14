#!/usr/bin/env node
// Every sound effect of a film on one sample-accurate stem, so the film has
// one SFX <audio> instead of dozens of overlapping ones.
//
//   node <loom>/tools/sound/stem.mjs <cues.json …> --lib <sfx dir> --total 30 --out sfx-stem.wav
//
// cues.json: [ { "s": "card-thunk", "t": 4.97, "db": -2 }, … ]  (t in film seconds)
// `s` names a cleaned file in --lib (sfx.mjs), with or without .wav.
// Prints the peak, and every cue that falls within 40 ms of another of the
// same sound (a doubled click is a defect nobody hears in a timeline).

import { existsSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { parseArgs } from '../lib/args.mjs';
import { decodeMono, ffmpeg } from '../lib/av.mjs';

const args = parseArgs();
if (!args._.length || !args.lib || !args.total || !args.out) { console.error('usage: stem.mjs <cues.json…> --lib <dir> --total <s> --out <file.wav>'); process.exit(2); }
const SR = 48000;
const N = Math.round(SR * Number(args.total));
const lib = {};
const sound = (name) => {
  if (!lib[name]) {
    const file = join(resolve(args.lib), name.endsWith('.wav') ? name : `${name}.wav`);
    if (!existsSync(file)) throw new Error(`no sound "${name}" in ${args.lib}`);
    lib[name] = decodeMono(file, SR);
  }
  return lib[name];
};

const cues = args._.flatMap((f) => JSON.parse(readFileSync(f, 'utf8')));
cues.sort((a, b) => a.t - b.t);
const mix = new Float32Array(N);
for (const c of cues) {
  const s = sound(c.s);
  const g = Math.pow(10, (c.db ?? 0) / 20);
  const o = Math.round(c.t * SR);
  for (let i = 0; i < s.length && o + i < N; i++) if (o + i >= 0) mix[o + i] += s[i] * g;
}
for (let i = 1; i < cues.length; i++) {
  const prev = cues.slice(0, i).reverse().find((p) => p.s === cues[i].s);
  if (prev && cues[i].t - prev.t < 0.04) console.error(`DOUBLE ${cues[i].s} at ${prev.t} and ${cues[i].t}`);
}
let pk = 0;
for (const v of mix) pk = Math.max(pk, Math.abs(v));
const stereo = new Float32Array(N * 2);
for (let i = 0; i < N; i++) { stereo[2 * i] = mix[i]; stereo[2 * i + 1] = mix[i]; }
const tmp = join(tmpdir(), `loom-stem-${process.pid}.f32`);
writeFileSync(tmp, Buffer.from(stereo.buffer));
try { ffmpeg(['-f', 'f32le', '-ar', String(SR), '-ac', '2', '-i', tmp, '-c:a', 'pcm_s24le', resolve(args.out)]); }
finally { rmSync(tmp, { force: true }); }
console.log(`stem: ${cues.length} cues → ${args.out}, peak ${(20 * Math.log10(pk || 1e-9)).toFixed(1)} dBFS${pk > 1 ? '  CLIPS: lower the cues' : ''}`);
