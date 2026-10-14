#!/usr/bin/env node
// The master: the render's audio to −14 LUFS integrated, true peak ≤ −1 dBTP,
// picture copied untouched.
//
//   node <loom>/tools/master.mjs <render.mp4> <master.mp4> [--lufs -14] [--tp -1]
//
// Two-pass loudnorm, linear first (it keeps the mix's dynamics). The renderer
// already lowers its audio about a dB to protect the peak, and AAC overshoots
// true peak a little, so the result is measured again: when it misses the
// target by more than 0.3 LU, or the peak is over, a second dynamic pass with
// a tighter peak and a trim corrects it. Prints the measured numbers as JSON
// for qc.md and exits 1 when the master still misses.

import { spawnSync } from 'node:child_process';
import { renameSync, rmSync } from 'node:fs';
import { parseArgs } from './lib/args.mjs';
import { ffmpeg, loudness, duration } from './lib/av.mjs';

const args = parseArgs();
const [src, out] = args._;
if (!src || !out) { console.error('usage: master.mjs <render.mp4> <master.mp4> [--lufs -14] [--tp -1]'); process.exit(2); }
const I = Number(args.lufs ?? -14);
const TP = Number(args.tp ?? -1);

function measure(input, tp) {
  const r = spawnSync('ffmpeg', ['-hide_banner', '-nostats', '-i', input, '-af', `loudnorm=I=${I}:TP=${tp}:LRA=11:print_format=json`, '-f', 'null', '-'], { encoding: 'utf8', maxBuffer: 1 << 30 });
  const tail = r.stderr.slice(r.stderr.lastIndexOf('[Parsed_loudnorm'));
  return JSON.parse(tail.slice(tail.indexOf('{'), tail.lastIndexOf('}') + 1));
}

function pass(input, output, { tp, linear, trim = 0 }) {
  const m = measure(input, tp);
  const af = `loudnorm=I=${I}:TP=${tp}:LRA=11:measured_I=${m.input_i}:measured_TP=${m.input_tp}:measured_LRA=${m.input_lra}:measured_thresh=${m.input_thresh}:offset=${m.target_offset}:linear=${linear}${trim ? `,volume=${trim}dB` : ''},aresample=48000`;
  ffmpeg(['-i', input, '-map', '0:v', '-map', '0:a', '-c:v', 'copy', '-af', af, '-c:a', 'aac', '-b:a', '256k', '-ar', '48000', '-ac', '2', '-movflags', '+faststart', output]);
  return m;
}

const before = loudness(src);
pass(src, out, { tp: TP, linear: true });
let after = loudness(out);
let route = 'linear';
if (Math.abs(after.integrated - I) > 0.3 || after.truePeak > TP) {
  const tmp = `${out}.pass2.mp4`;
  pass(src, tmp, { tp: TP - 0.7, linear: false });
  let second = loudness(tmp);
  const trim = +(I - second.integrated).toFixed(2);
  if (Math.abs(trim) > 0.1) {
    rmSync(tmp);
    pass(src, tmp, { tp: TP - 0.7, linear: false, trim });
    second = loudness(tmp);
  }
  renameSync(tmp, out);
  after = second;
  route = 'dynamic';
}

const ok = Math.abs(after.integrated - I) <= 0.3 && after.truePeak <= TP + 0.05;
console.log(JSON.stringify({
  master: out, ok, route, seconds: +duration(out).toFixed(3),
  render: { integrated: before.integrated, truePeak: before.truePeak, lra: before.lra },
  result: { integrated: after.integrated, truePeak: after.truePeak, lra: after.lra, shortTermMin: after.shortTermMin, shortTermMax: after.shortTermMax },
}, null, 2));
process.exit(ok ? 0 : 1);
