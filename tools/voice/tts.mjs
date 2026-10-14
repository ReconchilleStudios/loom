#!/usr/bin/env node
// The voice: ElevenLabs v4, one file per line, directed with [audio tags].
//
//   node <loom>/tools/voice/tts.mjs <lines.json> [--only V1,V4] [--takes 2] [--force]
//   node <loom>/tools/voice/tts.mjs <lines.json> --audition "Rachel=21m00Tcm4TlvDq8ikWAM,Laura=FGY2WhTYpPnrIDTdsKH5" --only V1,V2
//
// lines.json (templates/lines.json):
//   { "model": "eleven_v4" | "eleven_v4_turbo",
//     "voice": { "name": "Sarah", "id": "EXAVITQu4vr4xnSDxMaL" },
//     "stability": 0.45, "similarity": 0.8, "out": "assets/audio/vo/takes",
//     "display": { "Affili-mates": "Affilimates" },
//     "lines": [ { "id": "V1", "text": "[confident] Finding creators is easy.",
//                  "say"?: "...", "stability"?: 0.4, "voice"?: {...}, "model"?: "...", "seed"?: 7 } ] }
//
// `text` is the line as performed: tags plus the words exactly as the script
// writes them. `say` replaces it for the TTS only (a phonetic spelling); the
// words on screen and in the .srt always come from `text`.
//
// Each take lands as <out>/<id>.t<k>.mp3 with a sidecar <id>.t<k>.json: the
// request (never the key), the billed character cost, the duration and the
// spoken words with their times from the character alignment, tags removed.
// Takes differ by seed. Existing takes are skipped unless --force. Every call
// is written to the run's ledger before it is sent.

import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { key } from '../env.mjs';
import { parseArgs } from '../lib/args.mjs';
import { failText, fetchRetry, pool } from '../lib/http.mjs';
import { needProject, reserve, settle } from '../lib/project.mjs';
import { wordsFromAlignment } from '../lib/words.mjs';

const args = parseArgs(process.argv.slice(2), ['force']);
const specFile = args._[0];
if (!specFile) { console.error('usage: tts.mjs <lines.json> [--only ids] [--takes n] [--force] [--audition Name=id,…]'); process.exit(2); }

const spec = JSON.parse(readFileSync(specFile, 'utf8'));
const base = dirname(resolve(specFile));
const outDir = resolve(base, args.out ?? spec.out ?? 'takes');
const only = args.only?.split(',');
const takes = Number(args.takes ?? spec.takes ?? 1);
const force = Boolean(args.force);
const audition = args.audition?.split(',').map((p) => { const [name, id] = p.split('='); return { name, id }; });
const project = needProject(base);
const KEY = key('elevenlabs');
const API = 'https://api.elevenlabs.io/v1';

const jobs = [];
for (const line of spec.lines) {
  if (only && !only.includes(line.id)) continue;
  const voices = audition ?? [line.voice ?? spec.voice];
  for (const voice of voices) {
    for (let k = 1; k <= takes; k++) {
      const tag = audition ? `${line.id}.${voice.name.toLowerCase()}` : line.id;
      jobs.push({ line, voice, k, file: join(outDir, `${tag}.t${k}.mp3`) });
    }
  }
}

mkdirSync(outDir, { recursive: true });
let failed = 0;

await pool(jobs, 3, async ({ line, voice, k, file }) => {
  if (existsSync(file) && !force) { console.log(`skip ${file}`); return; }
  const model = line.model ?? spec.model ?? 'eleven_v4';
  const text = line.say ?? line.text;
  const body = {
    text,
    model_id: model,
    voice_settings: { stability: line.stability ?? spec.stability ?? 0.45, similarity_boost: line.similarity ?? spec.similarity ?? 0.8 },
    seed: (line.seed ?? 0) + k,
  };
  const what = `tts ${line.id} t${k} · ${voice.name} · ${model} · ${text.length} chars`;
  const id = reserve(project, { service: 'elevenlabs', what, credits: text.length });
  try {
    const res = await fetchRetry(`${API}/text-to-speech/${voice.id}/with-timestamps?output_format=mp3_44100_192`, {
      method: 'POST',
      headers: { 'xi-api-key': KEY, 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    }, { label: `tts ${line.id}` });
    if (!res.ok) throw new Error(await failText(res));
    const billing = Object.fromEntries([...res.headers].filter(([h]) => /char|cost|credit|request-id/i.test(h)));
    const data = await res.json();
    writeFileSync(file, Buffer.from(data.audio_base64, 'base64'));
    const words = wordsFromAlignment(data.alignment);
    const seconds = data.alignment?.character_end_times_seconds.at(-1) ?? null;
    writeFileSync(file.replace(/\.mp3$/, '.json'), JSON.stringify({
      id: line.id, take: k, voice, model, text: line.text, said: text, request: body, billing, seconds, words,
      alignment: data.alignment ?? null, at: new Date().toISOString(),
    }, null, 2));
    const credits = Number(billing['character-cost'] ?? billing['x-character-count'] ?? text.length);
    settle(project, id, { status: 'done', credits });
    console.log(`ok   ${file}  ${seconds?.toFixed(2) ?? '?'} s  ${words.map((w) => w.text).join(' ')}`);
  } catch (err) {
    failed++;
    settle(project, id, { status: 'failed', credits: 0 });
    console.error(`FAIL ${line.id} t${k}: ${err.message}`);
  }
});

process.exit(failed ? 1 : 0);
