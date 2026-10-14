#!/usr/bin/env node
// The score: ElevenLabs Music from a composition plan whose sections are the
// film's acts.
//
//   node <loom>/tools/sound/music.mjs <plan.json> <out-stem> [--takes 3] [--force]
//
// plan.json is the API's composition_plan (templates/music-plan.json):
//   { "positive_global_styles": [...], "negative_global_styles": [...],
//     "sections": [ { "section_name", "positive_local_styles", "negative_local_styles", "duration_ms", "lines": [] } ] }
//
// Writes <out-stem>.t1.mp3 … with a sidecar each. What the line learned:
// - a section under 3000 ms is refused by the API (HTTP 422): make a short
//   hit or a stop in the edit, not in the plan;
// - no take keeps the section lengths exactly: generate, measure the grid
//   (beats.mjs), then cut the bed to the picture's bars (bed.mjs);
// - some takes come back with long dead air: every take is scanned and the
//   silent stretches are reported.

import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { key } from '../env.mjs';
import { parseArgs } from '../lib/args.mjs';
import { analysis, duration } from '../lib/av.mjs';
import { failText, fetchRetry } from '../lib/http.mjs';
import { needProject, reserve, settle } from '../lib/project.mjs';

const args = parseArgs(process.argv.slice(2), ['force']);
const [planFile, stem] = args._;
if (!planFile || !stem) { console.error('usage: music.mjs <plan.json> <out-stem> [--takes n] [--force]'); process.exit(2); }

const plan = JSON.parse(readFileSync(planFile, 'utf8'));
const short = plan.sections.filter((s) => s.duration_ms < 3000);
if (short.length) {
  console.error(`sections under 3000 ms are refused by the API: ${short.map((s) => `${s.section_name} (${s.duration_ms})`).join(', ')}. Merge each into a neighbour and make the hit in the edit.`);
  process.exit(2);
}
const totalMs = plan.sections.reduce((a, s) => a + s.duration_ms, 0);
const project = needProject(dirname(resolve(stem)));
const KEY = key('elevenlabs');
const takes = Number(args.takes ?? 3);
mkdirSync(dirname(resolve(stem)), { recursive: true });

function deadAir(file) {
  const err = analysis(file, 'silencedetect=noise=-45dB:d=1.5');
  const starts = [...err.matchAll(/silence_start: (-?[\d.]+)/g)].map((m) => Number(m[1]));
  const ends = [...err.matchAll(/silence_end: (-?[\d.]+) \| silence_duration: ([\d.]+)/g)].map((m) => ({ end: Number(m[1]), d: Number(m[2]) }));
  return starts.map((s, i) => ({ start: +s.toFixed(2), seconds: ends[i] ? +ends[i].d.toFixed(2) : null }));
}

let failed = 0;
for (let k = 1; k <= takes; k++) {
  const out = `${resolve(stem)}.t${k}.mp3`;
  if (existsSync(out) && !args.force) { console.log(`skip ${out}`); continue; }
  const id = reserve(project, { service: 'elevenlabs', what: `music t${k} · ${plan.sections.length} sections · ${(totalMs / 1000).toFixed(1)} s` });
  try {
    const res = await fetchRetry('https://api.elevenlabs.io/v1/music?output_format=mp3_48000_192', {
      method: 'POST',
      headers: { 'xi-api-key': KEY, 'Content-Type': 'application/json' },
      body: JSON.stringify({ model_id: plan.model_id ?? 'music_v1', composition_plan: { ...plan, model_id: undefined }, respect_sections_durations: true }),
    }, { label: `music t${k}` });
    if (!res.ok) throw new Error(await failText(res));
    writeFileSync(out, Buffer.from(await res.arrayBuffer()));
    const seconds = duration(out);
    const silences = deadAir(out);
    const billing = Object.fromEntries([...res.headers].filter(([h]) => /char|cost|credit|request-id/i.test(h)));
    writeFileSync(out.replace(/\.mp3$/, '.json'), JSON.stringify({ take: k, planned_s: totalMs / 1000, seconds, silences, billing, plan, at: new Date().toISOString() }, null, 2));
    settle(project, id, { status: 'done', seconds });
    const warn = silences.filter((s) => (s.seconds ?? 99) >= 1.5 && s.start < seconds - 3);
    console.log(`ok   ${out}  ${seconds.toFixed(1)} s (planned ${(totalMs / 1000).toFixed(1)})${warn.length ? `  DEAD AIR at ${warn.map((s) => `${s.start}s for ${s.seconds}s`).join(', ')}` : ''}`);
  } catch (err) {
    failed++;
    settle(project, id, { status: 'failed' });
    console.error(`FAIL music t${k}: ${err.message}`);
  }
}
process.exit(failed ? 1 : 0);
