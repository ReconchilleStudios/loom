// The one argument shape every Loom tool takes: positionals, `--name value`,
// and boolean `--name` for the names listed in `bools`.

export function parseArgs(argv = process.argv.slice(2), bools = []) {
  const out = { _: [] };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (!a.startsWith('--')) { out._.push(a); continue; }
    const name = a.slice(2);
    if (bools.includes(name)) out[name] = true;
    else out[name] = argv[++i];
  }
  return out;
}
