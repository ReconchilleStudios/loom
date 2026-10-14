#!/usr/bin/env node
// HyperFrames, bundled. Loom carries the HyperFrames skills it was verified
// with (vendor/hyperframes, Apache-2.0, unmodified) and installs them when a
// machine has none, so a fresh machine needs nothing but Loom.
//
//   node <loom>/tools/hyperframes/install.mjs [--json]          what is there
//   node <loom>/tools/hyperframes/install.mjs --install [--json] install the missing skills from the bundle
//   node <loom>/tools/hyperframes/install.mjs --upgrade [--json] replace only skills Loom installed earlier
//   [--skills-dir <dir>]  install somewhere else (default: $CLAUDE_CONFIG_DIR/skills or ~/.claude/skills)
//
// It never overwrites a HyperFrames install that Loom did not make: a
// standalone install or the Claude Code plugin is the person's, and Loom uses
// it as it is. Skills Loom installs carry a .loom-bundled marker; tools/hf.sh
// reads it to pin the CLI to the same version and to stop HyperFrames from
// replacing the bundle with a newer one mid-run.

import { cpSync, existsSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { homedir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseArgs } from '../lib/args.mjs';

const args = parseArgs(process.argv.slice(2), ['json', 'install', 'upgrade']);
const LOOM = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const VENDOR = join(LOOM, 'vendor', 'hyperframes');
const bundle = JSON.parse(readFileSync(join(VENDOR, 'VERSION.json'), 'utf8'));
const version = bundle.tag.replace(/^v/, '');
const config = process.env.CLAUDE_CONFIG_DIR ?? join(homedir(), '.claude');
const skillsDir = args['skills-dir'] ?? join(config, 'skills');
const loomVersion = readFileSync(join(LOOM, 'VERSION'), 'utf8').trim();

function pluginInstalled() {
  const file = join(config, 'plugins', 'installed_plugins.json');
  if (!existsSync(file)) return false;
  try {
    const j = JSON.parse(readFileSync(file, 'utf8'));
    return Object.keys(j.plugins ?? j).some((k) => /^hyperframes@/.test(k));
  } catch { return false; }
}

function state(name) {
  const dir = join(skillsDir, name);
  if (!existsSync(join(dir, 'SKILL.md'))) return 'missing';
  return existsSync(join(dir, '.loom-bundled')) ? 'bundled' : 'installed';
}

function install(name) {
  const dir = join(skillsDir, name);
  if (existsSync(dir)) rmSync(dir, { recursive: true, force: true });
  cpSync(join(VENDOR, 'skills', name), dir, { recursive: true });
  writeFileSync(join(dir, '.loom-bundled'), `${JSON.stringify({ hyperframes: version, tag: bundle.tag, commit: bundle.commit, loom: loomVersion, at: new Date().toISOString() }, null, 2)}\n`);
}

const plugin = args['skills-dir'] ? false : pluginInstalled();
const changed = [];
for (const name of bundle.skills) {
  const s = state(name);
  if (args.install && s === 'missing' && !plugin) { install(name); changed.push(name); }
  else if (args.upgrade && s === 'bundled') { install(name); changed.push(name); }
}

const skills = bundle.skills.map((name) => ({ name, state: state(name) }));
const counts = skills.reduce((m, s) => ({ ...m, [s.state]: (m[s.state] ?? 0) + 1 }), {});
const overall = counts.missing === bundle.skills.length ? (plugin ? 'plugin' : 'missing')
  : counts.missing ? 'partial'
  : counts.installed ? 'standalone'
  : 'bundled';
const result = {
  skillsDir, plugin, overall,
  bundle: { version, commit: bundle.commit },
  pinnedCli: overall === 'bundled' ? version : null,
  skills, changed,
  others: existsSync(skillsDir) ? readdirSync(skillsDir).filter((n) => /^hyperframes|^media-use$|^general-video$/.test(n) && !bundle.skills.includes(n)) : [],
};

if (args.json) console.log(JSON.stringify(result, null, 2));
else {
  console.log(`HyperFrames: ${overall}${plugin ? ' (plugin installed)' : ''} · bundle v${version} · ${skillsDir}`);
  for (const s of skills) console.log(`  ${s.state === 'missing' ? '·' : '✓'} ${s.name.padEnd(22)} ${s.state}`);
  if (changed.length) console.log(`installed from the bundle: ${changed.join(', ')}`);
}
process.exit(overall === 'missing' || overall === 'partial' ? 1 : 0);
