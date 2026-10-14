#!/usr/bin/env node
// Checks every key Loom uses without ever printing a key. This is the only
// way Claude learns about the keys. Free, except --deep (below).
//
//   node tools/keys/check.mjs          a short report for a person
//   node tools/keys/check.mjs --json   the same as JSON, for Claude
//
// --deep also asks ElevenLabs to speak three characters when the key cannot
// read its account (under one credit): a failed payment is invisible otherwise.
//
// Exit 0 when every required key works, 1 when one is missing or rejected.

import { pathToFileURL } from 'node:url';
import { ENV_FILE, lookup } from '../env.mjs';
import { SERVICES } from './services.mjs';

export async function checkAll(file = ENV_FILE, { deep = false } = {}) {
  return Promise.all(SERVICES.map(async (s) => {
    const found = lookup(s.id, file);
    const base = { id: s.id, title: s.title, need: s.need, env: s.env };
    if (!found) return { ...base, status: 'missing', detail: s.need === 'required' ? 'no key yet' : 'skipped' };
    const result = await s.check(found.value, { deep });
    return { ...base, source: found.source === 'shell' ? `shell (${found.name})` : 'file', ...result };
  }));
}

export const ready = (results) => results.every((r) => r.need !== 'required' || r.status === 'ok');

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  const results = await checkAll(ENV_FILE, { deep: process.argv.includes('--deep') });
  if (process.argv.includes('--json')) {
    console.log(JSON.stringify({ file: ENV_FILE, ready: ready(results), services: results }, null, 2));
  } else {
    const mark = { ok: '✓', invalid: '✗', blocked: '✗', error: '!', missing: '·' };
    for (const r of results) console.log(`${mark[r.status]} ${r.title.padEnd(11)} ${r.detail}`);
  }
  process.exit(ready(results) ? 0 : 1);
}
