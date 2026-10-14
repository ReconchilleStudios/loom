#!/usr/bin/env node
// What the run has spent, by service and by version, against its cap.
//
//   node <loom>/tools/ledger.mjs [--json]      (inside a Loom project)

import { needProject, spending, totals } from './lib/project.mjs';

const project = needProject();
const rows = spending(project);
const t = totals(project);
const by = (key) => rows.reduce((m, r) => {
  const k = r[key];
  m[k] ??= { usd: 0, credits: 0, calls: 0 };
  m[k].usd += Number(r.usd) || 0; m[k].credits += Number(r.credits) || 0; m[k].calls++;
  return m;
}, {});
const cap = project.manifest.budget ?? {};

if (process.argv.includes('--json')) {
  console.log(JSON.stringify({ totals: t, cap, byService: by('service'), byFilm: by('film'), pending: rows.filter((r) => r.status === 'planned').length }, null, 2));
} else {
  const line = (name, v) => console.log(`  ${name.padEnd(28)} ${`$${v.usd.toFixed(2)}`.padStart(9)}  ${String(Math.round(v.credits)).padStart(8)} cr  ${String(v.calls).padStart(4)} calls`);
  console.log(`spent $${t.usd.toFixed(2)}${cap.usd != null ? ` of $${cap.usd}` : ''} · ${t.credits} ElevenLabs credits${cap.credits != null ? ` of ${cap.credits}` : ''} · ${t.calls} calls`);
  console.log('by service'); for (const [k, v] of Object.entries(by('service'))) line(k, v);
  console.log('by version'); for (const [k, v] of Object.entries(by('film'))) line(k, v);
}
