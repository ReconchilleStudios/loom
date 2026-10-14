#!/usr/bin/env node
// One still of a page, a state of it, or one element of it: the product's
// plates. Stills, not screen recordings: a recording is low bitrate and not
// seek-safe; a still at 2–3x plus a native rebuild of what moves stays sharp
// and deterministic.
//
//   node <loom>/tools/capture/shot.mjs <url | file.html> --out plate.png
//        [--viewport 1440x900] [--scale 2] [--query "state=review&nomotion=1"]
//        [--el compare | --el ".card:nth-child(2)"] [--transparent] [--full]
//        [--wait "html[data-ready='1']"] [--delay 150] [--storage auth.json]
//
// --el takes a CSS selector, or a bare name for [data-shot="name"].
// --transparent drops the page background, so a crop carries no page colour
// or neighbouring shadow into its corners (re-shoot crops this way).
// --storage is a Playwright storageState file for a signed-in product (made
// once by hand; never commit it). Page errors are printed: a plate shot over a
// console error is suspect.
//
// Needs Playwright: `npm install --prefix <loom>` once (package.json), then
// `npx --prefix <loom> playwright install chromium`.

import { mkdirSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { parseArgs } from '../lib/args.mjs';

const args = parseArgs(process.argv.slice(2), ['transparent', 'full']);
const target = args._[0];
if (!target || !args.out) { console.error('usage: shot.mjs <url|file> --out file.png [options]'); process.exit(2); }

async function playwright() {
  const roots = [join(dirname(fileURLToPath(import.meta.url)), '..', '..'), process.cwd()];
  for (const root of roots) {
    try { return createRequire(join(root, 'package.json'))('playwright'); } catch { /* next */ }
  }
  console.error('Playwright is not installed: run `npm install --prefix <loom>` and `npx --prefix <loom> playwright install chromium`');
  process.exit(3);
}

const { chromium } = await playwright();
const [vw, vh] = (args.viewport ?? '1440x900').split('x').map(Number);
const url = /^https?:|^file:/.test(target) ? new URL(target) : pathToFileURL(resolve(target));
if (args.query) for (const [k, v] of new URLSearchParams(args.query)) url.searchParams.set(k, v);
const out = resolve(args.out);
mkdirSync(dirname(out), { recursive: true });

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: vw, height: vh }, deviceScaleFactor: Number(args.scale ?? 2), ...(args.storage ? { storageState: resolve(args.storage) } : {}) });
const page = await ctx.newPage();
const errors = [];
page.on('pageerror', (e) => errors.push(e.message));
page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
await page.goto(url.href, { waitUntil: 'networkidle' });
if (args.wait) await page.waitForSelector(args.wait, { timeout: 20000 });
await page.waitForTimeout(Number(args.delay ?? 150));
const opts = { path: out, omitBackground: Boolean(args.transparent) };
if (args.el) {
  const sel = /^[.#\[]|[\s>:]/.test(args.el) ? args.el : `[data-shot="${args.el}"]`;
  await page.locator(sel).first().screenshot(opts);
} else await page.screenshot({ ...opts, fullPage: Boolean(args.full) });
await browser.close();
if (errors.length) console.error(`PAGE ERRORS (check the plate):\n${errors.join('\n')}`);
console.log(out);
