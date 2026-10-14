#!/usr/bin/env node
// The sound library: generated once per run with ElevenLabs sound effects,
// then cleaned, because generated effects rarely arrive usable (a stamp at
// −47 dBFS, a thunk with 0.2 s of lead-in, a click that clicks twice).
//
//   node <loom>/tools/sound/sfx.mjs <library.json> <outDir> [--only a,b] [--force]
//
// library.json (templates/sfx-library.json):
//   [ { "name": "card-thunk", "text": "a stiff card set down on a wooden table, close, dry",
//       "seconds": 0.6, "influence": 0.45, "keep": 0.36, "variants": { "count": 12, "semitones": 0.7 } } ]
//
// Raw files go to <outDir>/raw/<name>.mp3. Each clean file <outDir>/<name>.wav
// starts 3 ms before its first transient, lasts at most `keep` seconds,
// fades out, and peaks at −3 dBFS. `variants` adds <name>-01.wav … pitched up
// by `semitones` each (twelve tabs landing, each a little higher).
// Listen-free checks are printed: the level found, and how much lead-in was cut.

import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { key } from '../env.mjs';
import { parseArgs } from '../lib/args.mjs';
import { decodeMono, ffmpeg } from '../lib/av.mjs';
import { failText, fetchRetry, pool } from '../lib/http.mjs';
import { needProject, reserve, settle } from '../lib/project.mjs';

const args = parseArgs(process.argv.slice(2), ['force']);
const [libFile, outArg] = args._;
if (!libFile || !outArg) { console.error('usage: sfx.mjs <library.json> <outDir> [--only names] [--force]'); process.exit(2); }
const outDir = resolve(outArg);
const lib = JSON.parse(readFileSync(libFile, 'utf8')).filter((s) => !args.only || args.only.split(',').includes(s.name));
const project = needProject(outDir);
let KEY;
const apiKey = () => (KEY ??= key('elevenlabs'));
const SR = 48000;
mkdirSync(join(outDir, 'raw'), { recursive: true });

function writeWav(samples, file) {
  const tmp = join(tmpdir(), `loom-sfx-${process.pid}-${Math.random().toString(36).slice(2)}.f32`);
  writeFileSync(tmp, Buffer.from(samples.buffer, samples.byteOffset, samples.byteLength));
  try { ffmpeg(['-f', 'f32le', '-ar', String(SR), '-ac', '1', '-i', tmp, '-c:a', 'pcm_s16le', file]); }
  finally { rmSync(tmp, { force: true }); }
}

function clean(s, raw) {
  const a = decodeMono(raw, SR);
  let rawPeak = 0;
  for (const v of a) rawPeak = Math.max(rawPeak, Math.abs(v));
  // First transient: the first sample above 10% of the take's own peak.
  let i0 = 0;
  while (i0 < a.length && Math.abs(a[i0]) < rawPeak * 0.1) i0++;
  i0 = Math.max(0, i0 - Math.round(0.003 * SR));
  const len = Math.min(a.length - i0, Math.round((s.keep ?? s.seconds ?? 0.9) * SR));
  const out = new Float32Array(len);
  const fadeIn = Math.round(0.003 * SR);
  const fadeOut = Math.round(Math.min(0.25, len / SR / 3) * SR);
  const gain = rawPeak ? Math.pow(10, -3 / 20) / rawPeak : 1;
  for (let i = 0; i < len; i++) {
    let e = 1;
    if (i < fadeIn) e = i / fadeIn;
    if (i > len - fadeOut) e = Math.min(e, (len - i) / fadeOut);
    out[i] = a[i0 + i] * gain * e;
  }
  const file = join(outDir, `${s.name}.wav`);
  writeWav(out, file);
  if (s.variants) {
    for (let v = 1; v <= s.variants.count; v++) {
      const ratio = Math.pow(2, ((v - 1) * s.variants.semitones) / 12);
      ffmpeg(['-i', file, '-af', `asetrate=${Math.round(SR * ratio)},aresample=${SR}`, '-ac', '1', '-c:a', 'pcm_s16le', join(outDir, `${s.name}-${String(v).padStart(2, '0')}.wav`)]);
    }
  }
  return { rawPeakDb: +(20 * Math.log10(rawPeak || 1e-9)).toFixed(1), leadInCut: +(i0 / SR).toFixed(3), seconds: +(len / SR).toFixed(3) };
}

let failed = 0;
await pool(lib, 3, async (s) => {
  const raw = join(outDir, 'raw', `${s.name}.mp3`);
  try {
    if (!existsSync(raw) || args.force) {
      const id = reserve(project, { service: 'elevenlabs', what: `sfx ${s.name} · ${s.seconds ?? 'auto'} s` });
      const body = { text: s.text, model_id: s.model ?? 'eleven_text_to_sound_v2', prompt_influence: s.influence ?? 0.45, ...(s.seconds ? { duration_seconds: s.seconds } : {}) };
      const res = await fetchRetry('https://api.elevenlabs.io/v1/sound-generation?output_format=mp3_44100_192', {
        method: 'POST', headers: { 'xi-api-key': apiKey(), 'Content-Type': 'application/json' }, body: JSON.stringify(body),
      }, { label: `sfx ${s.name}` });
      if (!res.ok) { settle(project, id, { status: 'failed' }); throw new Error(await failText(res)); }
      writeFileSync(raw, Buffer.from(await res.arrayBuffer()));
      writeFileSync(`${raw}.json`, JSON.stringify({ ...s, request: body, at: new Date().toISOString() }, null, 2));
      settle(project, id, { status: 'done' });
    }
    const r = clean(s, raw);
    console.log(`ok   ${s.name.padEnd(16)} raw peak ${String(r.rawPeakDb).padStart(6)} dBFS  lead-in cut ${r.leadInCut}s  → ${r.seconds}s at −3 dBFS${s.variants ? `  + ${s.variants.count} variants` : ''}`);
  } catch (err) {
    failed++;
    console.error(`FAIL ${s.name}: ${err.message}`);
  }
});
process.exit(failed ? 1 : 0);
