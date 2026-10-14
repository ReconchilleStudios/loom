// ffmpeg and ffprobe, the few ways Loom uses them. Every function throws with
// ffmpeg's own error text when a command fails.

import { execFileSync, spawnSync } from 'node:child_process';

/** Run ffmpeg quietly with -y; returns stdout. */
export function ffmpeg(args) {
  const r = spawnSync('ffmpeg', ['-v', 'error', '-y', ...args], { maxBuffer: 1 << 30 });
  if (r.status !== 0) throw new Error(`ffmpeg ${args.join(' ').slice(0, 200)}\n${r.stderr.toString().slice(-600)}`);
  return r.stdout;
}

/** An analysis pass: ffmpeg prints filter reports to stderr even on success. */
export function analysis(input, filter) {
  const r = spawnSync('ffmpeg', ['-hide_banner', '-nostats', '-i', input, '-af', filter, '-f', 'null', '-'], { encoding: 'utf8', maxBuffer: 1 << 30 });
  if (r.status !== 0) throw new Error(`ffmpeg failed on ${input}: ${r.stderr.slice(-400)}`);
  return r.stderr;
}

export function duration(file) {
  const out = execFileSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', file], { encoding: 'utf8' });
  return Number(out.trim());
}

/** Integrated loudness, true peak, LRA and the short-term range, from ebur128. */
export function loudness(file) {
  const err = analysis(file, 'ebur128=peak=true');
  const summary = err.slice(err.lastIndexOf('Summary:'));
  const num = (re) => { const m = summary.match(re); return m ? Number(m[1]) : null; };
  const shortTerm = [...err.matchAll(/ S:\s*(-?[\d.]+)/g)].map((m) => Number(m[1])).filter((v) => v > -70);
  return {
    integrated: num(/I:\s+(-?[\d.]+) LUFS/),
    lra: num(/LRA:\s+(-?[\d.]+) LU/),
    truePeak: num(/Peak:\s+(-?[\d.]+) dBFS/),
    shortTermMin: shortTerm.length ? Math.min(...shortTerm) : null,
    shortTermMax: shortTerm.length ? Math.max(...shortTerm) : null,
  };
}

/** Peak level in dBFS (volumedetect). */
export function peak(file) {
  const m = analysis(file, 'volumedetect').match(/max_volume:\s*(-?[\d.]+) dB/);
  return m ? Number(m[1]) : null;
}

/** Decode to mono float32 samples. */
export function decodeMono(file, sr = 48000) {
  const buf = execFileSync('ffmpeg', ['-v', 'error', '-i', file, '-ac', '1', '-ar', String(sr), '-f', 'f32le', '-'], { maxBuffer: 1 << 30 });
  return new Float32Array(buf.buffer, buf.byteOffset, buf.length / 4);
}
