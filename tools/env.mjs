// Where Loom's keys live, and how every tool reads them.
//
// One file, `<loom>/.env` (git-ignored, chmod 600), written by the key wizard
// (tools/keys/open.sh). A variable already exported in the shell wins, so a
// CI or a one-off override never needs the file. LOOM_ENV_FILE points the
// whole kit at another file (the wizard's own tests use it).
//
// Nothing here ever prints a value. Claude never reads the file either: it
// runs tools/keys/check.mjs, which only reports whether each key works.

import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { SERVICES } from './keys/services.mjs';

/** The Loom skill folder. This file lives in tools/. */
export const LOOM_ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');

export const ENV_FILE = process.env.LOOM_ENV_FILE || join(LOOM_ROOT, '.env');

/** KEY=VALUE lines, `#` comments, optional quotes. */
export function parseEnv(text) {
  const out = {};
  for (const raw of text.split('\n')) {
    const line = raw.trim();
    if (!line || line.startsWith('#')) continue;
    const eq = line.indexOf('=');
    if (eq < 1) continue;
    const name = line.slice(0, eq).replace(/^export\s+/, '').trim();
    let val = line.slice(eq + 1).trim();
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) val = val.slice(1, -1);
    if (val) out[name] = val;
  }
  return out;
}

export function readEnvFile(file = ENV_FILE) {
  return existsSync(file) ? parseEnv(readFileSync(file, 'utf8')) : {};
}

/** Every name a service's key may go by, the canonical one first. */
export function namesOf(service) {
  return [service.env, ...(service.aliases ?? [])];
}

/**
 * The key for a service id ('elevenlabs', 'fal', 'pexels', …) and where it
 * came from, or undefined. The shell wins over the file.
 */
export function lookup(id, file = ENV_FILE) {
  const service = SERVICES.find((s) => s.id === id);
  if (!service) throw new Error(`unknown service: ${id}`);
  const fromFile = readEnvFile(file);
  for (const name of namesOf(service)) {
    if (process.env[name]) return { value: process.env[name], source: 'shell', name };
  }
  for (const name of namesOf(service)) {
    if (fromFile[name]) return { value: fromFile[name], source: 'file', name };
  }
  return undefined;
}

/** The key itself, or a clear error that tells the user how to add it. */
export function key(id) {
  const found = lookup(id);
  if (found) return found.value;
  const service = SERVICES.find((s) => s.id === id);
  throw new Error(`${service.title} key missing: run tools/keys/open.sh (or export ${service.env})`);
}
