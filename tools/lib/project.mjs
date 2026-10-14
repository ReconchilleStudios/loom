// A Loom run lives in one project folder with a loom.json at its root (written
// at the go, see templates/loom.json). Tools find it by walking up from the
// current directory, so they work from the project root and from inside any
// version's HyperFrames folder.
//
// The ledger is <project>/ledger.jsonl: one line before every paid call
// (status "planned", with its estimate), one line after it ("done" or
// "failed"). A planned call that would cross the run's cap is refused before
// anything is sent.

import { appendFileSync, existsSync, readFileSync } from 'node:fs';
import { basename, dirname, join, relative, resolve } from 'node:path';
import { randomUUID } from 'node:crypto';

export function findProject(start = process.cwd()) {
  let dir = resolve(start);
  for (;;) {
    const file = join(dir, 'loom.json');
    if (existsSync(file)) return { root: dir, manifest: JSON.parse(readFileSync(file, 'utf8')) };
    const up = dirname(dir);
    if (up === dir) return null;
    dir = up;
  }
}

export function needProject(start) {
  const p = findProject(start);
  if (!p) throw new Error('no loom.json found here or above: run this inside a Loom project (stages/1-opening.md, "the go")');
  return p;
}

/** Which version a tool is working for: LOOM_FILM, else the films/<slug> folder it runs in. */
export function currentFilm(project, cwd = process.cwd()) {
  if (process.env.LOOM_FILM) return process.env.LOOM_FILM;
  const rel = relative(join(project.root, 'films'), cwd);
  if (rel && !rel.startsWith('..')) return rel.split('/')[0];
  return 'shared';
}

function ledgerFile(project) { return join(project.root, 'ledger.jsonl'); }

export function readLedger(project) {
  const file = ledgerFile(project);
  if (!existsSync(file)) return [];
  return readFileSync(file, 'utf8').split('\n').filter(Boolean).map((l) => JSON.parse(l));
}

/** Calls that ran or may still be running, with their final figures. */
export function spending(project) {
  const rows = readLedger(project);
  const settled = new Map(rows.filter((r) => r.ref).map((r) => [r.ref, r]));
  return rows.filter((r) => r.id).map((r) => ({ ...r, ...(settled.get(r.id) ?? {}), id: r.id }))
    .filter((r) => r.status !== 'failed');
}

export function totals(project) {
  const live = spending(project);
  const usd = live.reduce((a, r) => a + (Number(r.usd) || 0), 0);
  const credits = live.reduce((a, r) => a + (Number(r.credits) || 0), 0);
  return { usd: Math.round(usd * 100) / 100, credits: Math.round(credits), calls: live.length };
}

/**
 * Write the planned call before it runs. Throws when the estimate would take
 * the run over its cap: the person decides about money at the cap, not a tool.
 */
export function reserve(project, { service, what, usd = 0, credits = 0, film }) {
  const cap = project.manifest.budget ?? {};
  const t = totals(project);
  if (cap.usd != null && t.usd + usd > cap.usd + 1e-9) {
    throw new Error(`over the run's cap: ${t.usd.toFixed(2)} + ${usd.toFixed(2)} USD > ${cap.usd} USD (ask the person before raising budget.usd in loom.json)`);
  }
  if (cap.credits != null && t.credits + credits > cap.credits) {
    throw new Error(`over the run's ElevenLabs credit cap: ${t.credits} + ${credits} > ${cap.credits} (ask the person)`);
  }
  const id = randomUUID().slice(0, 8);
  appendFileSync(ledgerFile(project), `${JSON.stringify({ id, at: new Date().toISOString(), film: film ?? currentFilm(project), service, what, usd, credits, status: 'planned' })}\n`);
  return id;
}

export function settle(project, id, fields) {
  appendFileSync(ledgerFile(project), `${JSON.stringify({ ref: id, at: new Date().toISOString(), ...fields })}\n`);
}

/** Paths relative to the project, for sidecars and reports. */
export function rel(project, file) { return relative(project.root, resolve(file)) || basename(file); }
