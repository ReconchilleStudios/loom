#!/usr/bin/env node
// Subtitles for the voice only, from vo-words.json (place.mjs): the script's
// spelling at the voice's times. Cues hold at most two lines of 42
// characters, break at phrase ends, and never overlap.
//
//   node <loom>/tools/voice/srt.mjs <vo-words.json> <out.srt> [--offset 0]

import { readFileSync, writeFileSync } from 'node:fs';
import { parseArgs } from '../lib/args.mjs';

const args = parseArgs();
const [wordsFile, out] = args._;
if (!wordsFile || !out) { console.error('usage: srt.mjs <vo-words.json> <out.srt> [--offset s]'); process.exit(2); }
const offset = Number(args.offset ?? 0);
const { words } = JSON.parse(readFileSync(wordsFile, 'utf8'));

const ts = (s) => {
  const ms = Math.max(0, Math.round(s * 1000));
  const p = (n, w = 2) => String(n).padStart(w, '0');
  return `${p(Math.floor(ms / 3600000))}:${p(Math.floor(ms / 60000) % 60)}:${p(Math.floor(ms / 1000) % 60)},${p(ms % 1000, 3)}`;
};

// On screen: straight quotes, no em or en dashes.
const clean = (t) => t.replace(/[“”]/g, '"').replace(/[‘’]/g, "'").replace(/\s*[—–]\s*/g, ', ');

const cues = [];
let cur = [];
const flush = () => { if (cur.length) cues.push(cur); cur = []; };
words.forEach((w, i) => {
  const next = words[i + 1];
  if (cur.length && (w.line !== cur[0].line && w.start - cur.at(-1).end > 0.6)) flush();
  cur.push(w);
  const text = cur.map((x) => x.text).join(' ');
  const endPhrase = /[.?!]["”]?$/.test(w.text) || (/[,;:]$/.test(w.text) && text.length > 38);
  const gap = next ? next.start - w.end : Infinity;
  if (!next || (endPhrase && cur.length >= 3) || gap > 0.8 || (text + ' ' + next.text).length > 82) flush();
});

// A short orphan after a long cue of the same line reads badly: share the words out evenly.
for (let i = 0; i + 1 < cues.length; i++) {
  const [a, b] = [cues[i], cues[i + 1]];
  const len = (c) => c.map((w) => w.text).join(' ').length;
  if (a.at(-1).line !== b[0].line || /[.?!]["”]?$/.test(a.at(-1).text) || len(b) >= 20 || len(a) < 50) continue;
  const all = [...a, ...b];
  let best = 1;
  let score = Infinity;
  for (let k = 1; k < all.length; k++) {
    const s = Math.max(len(all.slice(0, k)), len(all.slice(k)));
    if (s < score) { score = s; best = k; }
  }
  cues.splice(i, 2, all.slice(0, best), all.slice(best));
}

const wrap = (t) => {
  if (t.length <= 42) return t;
  const mid = t.length / 2;
  let best = -1;
  for (let i = 0; i < t.length; i++) if (t[i] === ' ' && (best < 0 || Math.abs(i - mid) < Math.abs(best - mid))) best = i;
  return `${t.slice(0, best)}\n${t.slice(best + 1)}`;
};

const body = cues.map((c, i) => {
  const s = c[0].start - 0.05 + offset;
  const nextStart = cues[i + 1] ? cues[i + 1][0].start - 0.05 + offset : Infinity;
  const e = Math.min(Math.max(c.at(-1).end + 0.25 + offset, s + 1.0), nextStart - 0.02);
  return `${i + 1}\n${ts(s)} --> ${ts(e)}\n${wrap(clean(c.map((w) => w.text).join(' ')))}\n`;
}).join('\n');

writeFileSync(out, body);
console.log(`${cues.length} cues → ${out}`);
