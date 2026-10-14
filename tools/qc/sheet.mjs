#!/usr/bin/env node
// Stills side by side on one image: snapshots at every scene midpoint, takes
// of one shot, generated candidates. Looking at one sheet beats opening twenty files.
//
//   node <loom>/tools/qc/sheet.mjs <out.jpg> <stills…> [--cols 4] [--cell 480x270]
//
// Cells keep their aspect (letterboxed on grey), in the order given; the
// legend (cell → file) is printed and written next to the sheet.

import { writeFileSync } from 'node:fs';
import { basename } from 'node:path';
import { parseArgs } from '../lib/args.mjs';
import { ffmpeg } from '../lib/av.mjs';

const args = parseArgs();
const [out, ...files] = args._;
if (!out || !files.length) { console.error('usage: sheet.mjs <out.jpg> <stills…> [--cols 4] [--cell 480x270]'); process.exit(2); }
const C = Number(args.cols ?? 4);
const [W, H] = (args.cell ?? '480x270').split('x').map(Number);
const inputs = files.flatMap((f) => ['-i', f]);
const cells = files.map((_, i) => `[${i}:v]scale=${W}:${H}:force_original_aspect_ratio=decrease,pad=${W + 4}:${H + 4}:(ow-iw)/2:(oh-ih)/2:color=0x808080[c${i}]`).join(';');
const layout = files.map((_, j) => `${(j % C) * (W + 4)}_${Math.floor(j / C) * (H + 4)}`).join('|');
const graph = files.length > 1 ? `${cells};${files.map((_, i) => `[c${i}]`).join('')}xstack=inputs=${files.length}:layout=${layout}:fill=0x808080[o]` : cells.replace('[c0]', '[o]');
ffmpeg([...inputs, '-filter_complex', graph, '-map', '[o]', '-frames:v', '1', '-q:v', '3', out]);
const legend = files.map((f, i) => `row ${Math.floor(i / C) + 1} col ${(i % C) + 1}  ${basename(f)}`).join('\n');
writeFileSync(out.replace(/\.[^.]+$/, '.txt'), `${legend}\n`);
console.log(`${out}\n${legend}`);
