#!/usr/bin/env node
// Generated pictures and motion on fal: a jobs file, run under the ledger.
//
//   node <loom>/tools/media/fal.mjs <jobs.json> [ids…]
//   node <loom>/tools/media/fal.mjs --inputs <endpoint-id>      what an endpoint accepts
//
// jobs.json (templates/fal-jobs.json), paths relative to the file:
//   [ { "id": "rae-kitchen", "endpoint": "fal-ai/nano-banana-2/edit", "out": "people/rae-kitchen.png",
//       "usd": 0.08, "input": { "prompt": "…", "image_urls": ["file:people/rae.jpg"], "aspect_ratio": "16:9" } } ]
//
// "file:<path>" inputs are sent as data URIs. A job whose `out` exists is
// skipped. A submitted job is remembered in <out>.pending.json, so running the
// file again after a network drop or a closed window resumes the same request
// instead of paying twice. Every job is reserved on the run's ledger at its
// `usd` before it is submitted, and refused past the cap. Each output gets a
// sidecar <out>.json with the endpoint, the request id and the prompt.
// Look at every output before it is used.

import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, extname, join, resolve } from 'node:path';
import { key } from '../env.mjs';
import { parseArgs } from '../lib/args.mjs';
import { failText, pool } from '../lib/http.mjs';
import { needProject, reserve, settle } from '../lib/project.mjs';

const args = parseArgs();
const KEY = key('fal');
const auth = { Authorization: `Key ${KEY}` };

if (args.inputs) {
  const res = await fetch(`https://fal.ai/api/openapi/queue/openapi.json?endpoint_id=${encodeURIComponent(args.inputs)}`);
  if (!res.ok) { console.error(await failText(res)); process.exit(1); }
  const spec = await res.json();
  const schemas = spec.components?.schemas ?? {};
  const input = Object.entries(schemas).find(([n]) => /Input$/.test(n))?.[1];
  for (const [name, p] of Object.entries(input?.properties ?? {})) {
    const req = input.required?.includes(name) ? '*' : ' ';
    console.log(`${req} ${name.padEnd(24)} ${p.type ?? (p.anyOf ? p.anyOf.map((x) => x.type).join('|') : '')}${p.enum ? ` [${p.enum.join(', ')}]` : ''}${p.default !== undefined ? ` = ${JSON.stringify(p.default)}` : ''}`);
  }
  process.exit(0);
}

const jobsFile = args._[0];
if (!jobsFile) { console.error('usage: fal.mjs <jobs.json> [ids…] | --inputs <endpoint>'); process.exit(2); }
const here = dirname(resolve(jobsFile));
const project = needProject(here);
const only = args._.slice(1);
const jobs = JSON.parse(readFileSync(jobsFile, 'utf8')).filter((j) => !only.length || only.includes(j.id));
const MIME = { '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.mp4': 'video/mp4', '.mp3': 'audio/mpeg', '.wav': 'audio/wav' };
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function resolveInput(v) {
  if (typeof v === 'string' && v.startsWith('file:')) {
    const p = resolve(here, v.slice(5));
    return `data:${MIME[extname(p).toLowerCase()] ?? 'application/octet-stream'};base64,${readFileSync(p).toString('base64')}`;
  }
  if (Array.isArray(v)) return v.map(resolveInput);
  if (v && typeof v === 'object') return Object.fromEntries(Object.entries(v).map(([k, x]) => [k, resolveInput(x)]));
  return v;
}

async function json(url, init) {
  for (let i = 0; ; i++) {
    try {
      const res = await fetch(url, init);
      if (res.ok) return res.json();
      if (res.status < 500 && res.status !== 429) throw new Error(await failText(res));
    } catch (err) {
      if (!/network|fetch failed|ECONN|ETIMEDOUT|EAI_AGAIN/i.test(err.message) || i > 30) throw err;
    }
    await sleep(Math.min(30000, 2000 * (i + 1)));
  }
}

async function run(job) {
  const out = resolve(here, job.out);
  const pendingFile = `${out}.pending.json`;
  if (existsSync(out)) return console.log(`skip ${job.id} (exists)`);
  mkdirSync(dirname(out), { recursive: true });
  const t0 = Date.now();
  let pending = existsSync(pendingFile) ? JSON.parse(readFileSync(pendingFile, 'utf8')) : null;
  if (!pending) {
    const ledgerId = reserve(project, { service: 'fal', what: `${job.endpoint} · ${job.id}`, usd: Number(job.usd ?? 0) });
    try {
      const sub = await json(`https://queue.fal.run/${job.endpoint}`, { method: 'POST', headers: { ...auth, 'Content-Type': 'application/json' }, body: JSON.stringify(resolveInput(job.input)) });
      if (!sub.request_id) throw new Error(`submit returned no request id: ${JSON.stringify(sub).slice(0, 300)}`);
      pending = { ledgerId, request_id: sub.request_id, status_url: sub.status_url, response_url: sub.response_url, at: new Date().toISOString() };
      writeFileSync(pendingFile, JSON.stringify(pending, null, 2));
      console.log(`submit ${job.id} → ${sub.request_id}`);
    } catch (err) {
      settle(project, ledgerId, { status: 'failed', usd: 0 });
      throw err;
    }
  } else console.log(`resume ${job.id} → ${pending.request_id}`);
  for (;;) {
    const st = await json(pending.status_url, { headers: auth });
    if (st.status === 'COMPLETED') break;
    if (st.status && !['IN_QUEUE', 'IN_PROGRESS'].includes(st.status)) {
      settle(project, pending.ledgerId, { status: 'failed', usd: 0 });
      rmSync(pendingFile, { force: true });
      throw new Error(`${st.status}: ${JSON.stringify(st).slice(0, 300)}`);
    }
    if (Date.now() - t0 > 30 * 60 * 1000) throw new Error('still running after 30 min: run the file again later to resume');
    await sleep(4000);
  }
  const res = await json(pending.response_url, { headers: auth });
  const url = res.video?.url ?? res.images?.[0]?.url ?? res.image?.url ?? res.audio?.url ?? res.audio_file?.url;
  if (!url) throw new Error(`no media in the response: ${JSON.stringify(res).slice(0, 300)}`);
  const media = await fetch(url);
  if (!media.ok) throw new Error(`download ${await failText(media)}`);
  writeFileSync(out, Buffer.from(await media.arrayBuffer()));
  const { input, ...meta } = job;
  const slim = JSON.parse(JSON.stringify(input, (k, v) => (typeof v === 'string' && v.length > 300 && !v.startsWith('file:') ? `${v.slice(0, 80)}…` : v)));
  writeFileSync(`${out}.json`, JSON.stringify({ ...meta, request_id: pending.request_id, seconds: +((Date.now() - t0) / 1000).toFixed(1), input: slim, description: res.description ?? null, at: new Date().toISOString() }, null, 2));
  settle(project, pending.ledgerId, { status: 'done', usd: Number(job.usd ?? 0) });
  rmSync(pendingFile, { force: true });
  console.log(`done ${job.id} → ${job.out}`);
}

let failed = 0;
await pool(jobs, Number(process.env.LOOM_FAL_CONCURRENCY ?? 3), async (j) => {
  try { await run(j); } catch (err) { failed++; console.error(`FAIL ${j.id}: ${err.message}`); }
});
process.exit(failed ? 1 : 0);
