#!/usr/bin/env node
// The ear Loom does not have: ElevenLabs Scribe transcribes a take (or the
// finished film) and the words are compared with the script.
//
//   node <loom>/tools/voice/stt.mjs <take.mp3 …> --lines lines.json     each take against its line
//   node <loom>/tools/voice/stt.mjs film.mp4 --lines lines.json --whole  the master against the whole script
//   node <loom>/tools/voice/stt.mjs <file> --expect "the words"
//
// A take's line is the part of its file name before the first dot (V4.t2.mp3 → V4).
// Results are cached next to the file as <file>.stt.json (--force to redo).
// Prints `ok` or the words that differ; exits 1 when any take is wrong.
// Names the voice may legitimately spell differently go in lines.json
// "accept": { "rae": ["ray", "raye"] }.

import { existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { basename, dirname, join, resolve } from 'node:path';
import { key } from '../env.mjs';
import { parseArgs } from '../lib/args.mjs';
import { duration, ffmpeg } from '../lib/av.mjs';
import { failText, fetchRetry } from '../lib/http.mjs';
import { needProject, reserve, settle } from '../lib/project.mjs';
import { norm, scriptWords, wordDiff } from '../lib/words.mjs';

const args = parseArgs(process.argv.slice(2), ['force', 'whole']);
const files = args._;
if (!files.length) { console.error('usage: stt.mjs <audio…> [--lines lines.json [--whole]] [--expect "text"] [--model scribe_v1] [--force]'); process.exit(2); }

const project = needProject(dirname(resolve(files[0])));
let KEY;
const apiKey = () => (KEY ??= key('elevenlabs'));
const model = args.model ?? 'scribe_v1';
const spec = args.lines ? JSON.parse(readFileSync(args.lines, 'utf8')) : null;
const accept = Object.fromEntries(Object.entries(spec?.accept ?? {}).map(([k, v]) => [norm(k), v.map(norm)]));

async function transcribe(file) {
  const cache = `${file}.stt.json`;
  if (existsSync(cache) && !args.force) return JSON.parse(readFileSync(cache, 'utf8'));
  let audio = file;
  let tmp;
  if (/\.(mp4|mov|m4v|webm)$/i.test(file)) {
    tmp = mkdtempSync(join(tmpdir(), 'loom-stt-'));
    audio = join(tmp, 'audio.mp3');
    ffmpeg(['-i', file, '-vn', '-ac', '1', '-ar', '44100', '-b:a', '128k', audio]);
  }
  const seconds = duration(audio);
  const id = reserve(project, { service: 'elevenlabs', what: `stt ${basename(file)} · ${model} · ${seconds.toFixed(1)} s` });
  try {
    const res = await fetchRetry('https://api.elevenlabs.io/v1/speech-to-text', () => {
      const fd = new FormData();
      fd.append('model_id', model);
      fd.append('timestamps_granularity', 'word');
      fd.append('file', new Blob([readFileSync(audio)], { type: 'audio/mpeg' }), basename(audio));
      return { method: 'POST', headers: { 'xi-api-key': apiKey() }, body: fd };
    }, { label: `stt ${basename(file)}` });
    if (!res.ok) throw new Error(await failText(res));
    const j = await res.json();
    const out = { text: j.text, model, seconds, words: (j.words ?? []).filter((w) => w.type === 'word').map((w) => ({ text: w.text, start: w.start, end: w.end })) };
    writeFileSync(cache, JSON.stringify(out, null, 2));
    settle(project, id, { status: 'done', seconds });
    return out;
  } catch (err) {
    settle(project, id, { status: 'failed' });
    throw err;
  } finally {
    if (tmp) rmSync(tmp, { recursive: true, force: true });
  }
}

/** Differences that are not on the accept list. */
function real(diff) {
  const heard = new Set(diff.filter((d) => d.heard).map((d) => d.heard));
  return diff.filter((d) => {
    if (d.expected && accept[d.expected]?.some((alt) => heard.has(alt))) return false;
    if (d.heard && Object.values(accept).some((alts) => alts.includes(d.heard))) return false;
    return true;
  });
}

const show = (diff) => {
  const miss = diff.filter((d) => d.expected).map((d) => d.expected);
  const extra = diff.filter((d) => d.heard).map((d) => d.heard);
  return [miss.length && `expected ${miss.join(' ')}`, extra.length && `heard ${extra.join(' ')}`].filter(Boolean).join(' · ');
};

let wrong = 0;
for (const file of files) {
  const t = await transcribe(resolve(file));
  const heard = t.words.map((w) => w.text);
  let expected;
  if (args.expect) expected = scriptWords(args.expect);
  else if (spec && args.whole) expected = spec.lines.flatMap((l) => scriptWords(l.text));
  else if (spec) {
    const id = basename(file).split('.')[0];
    const line = spec.lines.find((l) => l.id === id);
    if (!line) { console.log(`?    ${basename(file)}  no line "${id}" in ${args.lines}: "${t.text}"`); continue; }
    expected = scriptWords(line.text);
  }
  if (!expected) { console.log(`     ${basename(file)}  "${t.text}"`); continue; }
  const diff = real(wordDiff(expected, heard));
  const said = expected.length - diff.filter((d) => d.expected).length;
  if (!diff.length) console.log(`ok   ${basename(file)}  ${said}/${expected.length} words`);
  else { wrong++; console.log(`DIFF ${basename(file)}  ${said}/${expected.length} words · ${show(diff)}`); }
}
process.exit(wrong ? 1 : 0);
