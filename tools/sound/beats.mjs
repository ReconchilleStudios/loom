#!/usr/bin/env node
// The bar grid of a music take, measured, so the picture can be cut to it.
//
//   node <loom>/tools/sound/beats.mjs <take.mp3> [--bpm 120] [--beats-per-bar 4] [--fps 30]
//
// Finds the tempo (searched ±3 BPM around --bpm, or 70–170 without it) and the
// phase of beat one from the low band's onsets, refines both by regression on
// the detected kicks, and prints every bar: its time, its frame at --fps, and
// its loudness, with a mark where the energy jumps (a section change: the
// place for a chapter turn). Writes <take>.grid.json.

import { writeFileSync } from 'node:fs';
import { parseArgs } from '../lib/args.mjs';
import { decodeMono } from '../lib/av.mjs';

const args = parseArgs();
const file = args._[0];
if (!file) { console.error('usage: beats.mjs <take> [--bpm 120] [--beats-per-bar 4] [--fps 30]'); process.exit(2); }
const hint = args.bpm ? Number(args.bpm) : null;
const perBar = Number(args['beats-per-bar'] ?? 4);
const fps = Number(args.fps ?? 30);

const SR = 22050;
const a = decodeMono(file, SR);
const seconds = a.length / SR;

// Low band (two one-pole stages at 120 Hz) → energy every 2 ms → onset strength.
const HOP = 44;
const dt = HOP / SR;
const k = 1 - Math.exp(-2 * Math.PI * 120 / SR);
const low = [];
const full = [];
let y = 0, y2 = 0, accL = 0, accF = 0, c = 0;
for (let i = 0; i < a.length; i++) {
  y += k * (a[i] - y); y2 += k * (y - y2);
  accL += y2 * y2; accF += a[i] * a[i];
  if (++c === HOP) { low.push(Math.sqrt(accL / HOP)); full.push(accF / HOP); accL = 0; accF = 0; c = 0; }
}
const on = low.map((v, i) => (i ? Math.max(0, v - low[i - 1]) : 0));
const at = (t) => on[Math.round(t / dt)] ?? 0;

// Coarse comb: tempo and phase that collect the most onset energy on the beats.
let best = { bpm: 0, ph: 0, s: -1 };
const [lo, hi, step] = hint ? [hint - 3, hint + 3, 0.01] : [70, 170, 0.05];
for (let bpm = lo; bpm <= hi + 1e-9; bpm += step) {
  const P = 60 / bpm;
  for (let ph = 0; ph < P; ph += 0.004) {
    let s = 0;
    for (let t = ph; t < seconds; t += P) s += at(t) + 0.5 * (at(t - dt) + at(t + dt));
    if (s > best.s) best = { bpm, ph, s };
  }
}

// Refine: the strongest onset within 30 ms of each predicted beat, then a line fit.
const P0 = 60 / best.bpm;
const xs = [], ys = [];
for (let n = 0; best.ph + n * P0 < seconds; n++) {
  const tp = best.ph + n * P0;
  const i0 = Math.max(0, Math.round((tp - 0.03) / dt)), i1 = Math.round((tp + 0.03) / dt);
  let bi = i0;
  for (let i = i0; i <= i1 && i < on.length; i++) if (on[i] > on[bi]) bi = i;
  if (on[bi] > 0) { xs.push(n); ys.push(bi * dt); }
}
const N = xs.length;
const mx = xs.reduce((p, q) => p + q, 0) / N, my = ys.reduce((p, q) => p + q, 0) / N;
let sxy = 0, sxx = 0;
for (let i = 0; i < N; i++) { sxy += (xs[i] - mx) * (ys[i] - my); sxx += (xs[i] - mx) ** 2; }
const period = sxy / sxx;
const beat0 = ((my - period * mx) % period + period) % period;
const resid = Math.sqrt(ys.reduce((acc, v, i) => acc + (v - (beat0 + period * xs[i])) ** 2, 0) / N);
const bpm = 60 / period;

// Bars: loudness of each, and where it jumps.
const bar = period * perBar;
const bars = [];
for (let n = 0, t = beat0; t < seconds; n++, t = beat0 + n * bar) {
  const i0 = Math.round(t / dt), i1 = Math.min(full.length, Math.round((t + bar) / dt));
  let e = 0;
  for (let i = i0; i < i1; i++) e += full[i];
  const db = 10 * Math.log10(e / Math.max(1, i1 - i0) + 1e-12);
  bars.push({ bar: n + 1, t: +t.toFixed(3), frame: Math.round(t * fps), db: +db.toFixed(1) });
}
bars.forEach((b, i) => { if (i && Math.abs(b.db - bars[i - 1].db) >= 4) b.change = +(b.db - bars[i - 1].db).toFixed(1); });

writeFileSync(file.replace(/\.[^.]+$/, '.grid.json'), JSON.stringify({ file, bpm: +bpm.toFixed(3), beat0: +beat0.toFixed(3), beatsPerBar: perBar, beat_s: +period.toFixed(4), bar_s: +bar.toFixed(4), residual_ms: +(resid * 1000).toFixed(1), fps, bars }, null, 1));
console.log(`${file}\n  ${bpm.toFixed(2)} BPM · beat one at ${beat0.toFixed(3)} s · beat ${(period * fps).toFixed(2)} frames · bar ${bar.toFixed(3)} s · fit ±${(resid * 1000).toFixed(1)} ms over ${N} beats`);
for (const b of bars) console.log(`  bar ${String(b.bar).padStart(3)}  ${b.t.toFixed(3).padStart(8)} s  f${String(b.frame).padStart(5)}  ${String(b.db).padStart(6)} dB${b.change ? `  ◆ ${b.change > 0 ? '+' : ''}${b.change} dB` : ''}`);
