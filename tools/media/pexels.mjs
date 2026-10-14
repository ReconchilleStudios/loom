#!/usr/bin/env node
// Stock footage from Pexels: search into a contact sheet first, download only
// what was looked at and chosen.
//
//   node <loom>/tools/media/pexels.mjs search <dir> "query one" "query two" [--orientation landscape|portrait] [--min 1920]
//   node <loom>/tools/media/pexels.mjs get <dir> <id…>
//
// search writes <dir>/candidates.json, a poster frame per clip and
// <dir>/candidates.jpg, a numbered sheet of them all: look at it before
// choosing (no logos or readable brands, light that matches the film, people
// as atmosphere, never presented as customers). get downloads the smallest
// file at least --min wide for each id, with a sidecar crediting the author
// (Pexels licence: free, attribution appreciated; keep the sidecar for sources.md).

import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { key } from '../env.mjs';
import { parseArgs } from '../lib/args.mjs';
import { ffmpeg } from '../lib/av.mjs';
import { failText, fetchRetry, pool } from '../lib/http.mjs';

const args = parseArgs();
const [cmd, dirArg, ...rest] = args._;
if (!['search', 'get'].includes(cmd) || !dirArg) { console.error('usage: pexels.mjs search <dir> <query…> | get <dir> <id…>'); process.exit(2); }
const dir = resolve(dirArg);
mkdirSync(dir, { recursive: true });
const headers = { Authorization: key('pexels') };
const min = Number(args.min ?? 1920);
const candidatesFile = join(dir, 'candidates.json');

if (cmd === 'search') {
  const orientation = args.orientation ?? 'landscape';
  const found = [];
  for (const q of rest) {
    const res = await fetchRetry(`https://api.pexels.com/videos/search?query=${encodeURIComponent(q)}&orientation=${orientation}&size=large&per_page=${args.per ?? 15}`, { headers }, { label: `pexels ${q}` });
    if (!res.ok) { console.error(`FAIL "${q}": ${await failText(res)}`); continue; }
    for (const v of (await res.json()).videos ?? []) {
      const files = v.video_files.filter((f) => f.file_type === 'video/mp4' && (orientation === 'portrait' ? f.height : f.width) >= min);
      if (!files.length) continue;
      found.push({ query: q, id: v.id, url: v.url, author: v.user?.name, author_url: v.user?.url, seconds: v.duration, width: v.width, height: v.height, poster: v.image });
    }
  }
  const seen = new Set();
  const uniq = found.filter((v) => !seen.has(v.id) && seen.add(v.id));
  writeFileSync(candidatesFile, JSON.stringify(uniq, null, 1));
  await pool(uniq, 6, async (v) => {
    const file = join(dir, `${v.id}.jpg`);
    if (existsSync(file)) return;
    const r = await fetch(v.poster);
    if (r.ok) writeFileSync(file, Buffer.from(await r.arrayBuffer()));
  });
  // A sheet, 5 across, so the choice is made by looking; the legend says which
  // cell is which clip (no text is drawn: not every ffmpeg has drawtext).
  const posters = uniq.filter((v) => existsSync(join(dir, `${v.id}.jpg`))).slice(0, 40);
  const C = 5;
  let sheet = null;
  if (posters.length) {
    const W = 384, H = 216;
    const inputs = posters.flatMap((v) => ['-i', join(dir, `${v.id}.jpg`)]);
    const cells = posters.map((_, i) => `[${i}:v]scale=${W}:${H}:force_original_aspect_ratio=increase,crop=${W}:${H},pad=${W + 4}:${H + 4}:2:2:color=white[c${i}]`).join(';');
    const layout = posters.map((_, j) => `${(j % C) * (W + 4)}_${Math.floor(j / C) * (H + 4)}`).join('|');
    const graph = posters.length > 1 ? `${cells};${posters.map((_, i) => `[c${i}]`).join('')}xstack=inputs=${posters.length}:layout=${layout}:fill=white[o]` : cells.replace('[c0]', '[o]');
    try { ffmpeg([...inputs, '-filter_complex', graph, '-map', '[o]', '-frames:v', '1', '-q:v', '3', join(dir, 'candidates.jpg')]); sheet = join(dir, 'candidates.jpg'); }
    catch (err) { console.error(`sheet failed (posters are still in ${dir}): ${err.message.split('\n').at(-2) ?? ''}`); }
  }
  const legend = posters.map((v, i) => `row ${Math.floor(i / C) + 1} col ${(i % C) + 1}  ${v.id}  ${Math.round(v.seconds)}s  ${v.width}x${v.height}  "${v.query}"  ${v.author ?? ''}`);
  writeFileSync(join(dir, 'candidates.txt'), `${legend.join('\n')}\n`);
  console.log(`${uniq.length} candidates → ${candidatesFile}${sheet ? `\nsheet  ${sheet}` : ''}\nlegend ${join(dir, 'candidates.txt')}`);
  console.log(legend.join('\n'));
} else {
  const ids = rest.map(Number);
  let failed = 0;
  await pool(ids, 3, async (id) => {
    const out = join(dir, `pexels-${id}.mp4`);
    if (existsSync(out)) return console.log(`skip ${id}`);
    const res = await fetchRetry(`https://api.pexels.com/videos/videos/${id}`, { headers }, { label: `pexels ${id}` });
    if (!res.ok) { failed++; return console.error(`FAIL ${id}: ${await failText(res)}`); }
    const v = await res.json();
    const file = v.video_files.filter((f) => f.file_type === 'video/mp4' && Math.max(f.width, f.height) >= min).sort((a, b) => a.width - b.width)[0]
      ?? v.video_files.sort((a, b) => b.width - a.width)[0];
    const media = await fetch(file.link);
    if (!media.ok) { failed++; return console.error(`FAIL ${id}: download ${media.status}`); }
    writeFileSync(out, Buffer.from(await media.arrayBuffer()));
    writeFileSync(`${out}.json`, JSON.stringify({ source: 'pexels', id, url: v.url, author: v.user?.name, author_url: v.user?.url, width: file.width, height: file.height, fps: file.fps, seconds: v.duration, licence: 'https://www.pexels.com/license/', at: new Date().toISOString() }, null, 2));
    console.log(`ok   ${id} → ${out} (${file.width}x${file.height}, ${v.duration}s, ${v.user?.name})`);
  });
  process.exit(failed ? 1 : 0);
}
