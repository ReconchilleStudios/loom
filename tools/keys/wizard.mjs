#!/usr/bin/env node
// Loom's key wizard. Runs in its own terminal window (tools/keys/open.sh), so
// keys are typed where Claude cannot see them: input is masked, every key is
// tried against its own service for free, and the result goes to <loom>/.env
// with mode 600. Claude then runs check.mjs, which reports only ok / not ok.
//
//   node tools/keys/wizard.mjs [--lang en|tr]
//
// No dependencies: Node 18+, a TTY, 256 colours (NO_COLOR turns them off).

import { spawn } from 'node:child_process';
import { chmodSync, existsSync, readFileSync, renameSync, writeFileSync } from 'node:fs';
import { homedir } from 'node:os';
import { resolve } from 'node:path';
import { ENV_FILE, lookup, namesOf, parseEnv } from '../env.mjs';
import { SERVICES } from './services.mjs';

const langArg = process.argv.indexOf('--lang');
const LANG = langArg > 0 && process.argv[langArg + 1] === 'tr' ? 'tr' : 'en';

// ─── strings ────────────────────────────────────────────────────────────────

const STR = {
  en: {
    title: 'key setup',
    intro: [
      'Loom makes every film from a few outside services. Their keys live in',
      'one file on this machine that only you can read, and they are never',
      'shown to Claude: Claude only learns whether each key works.',
    ],
    startHint: [['Enter', 'start'], ['i', 'import from an existing .env'], ['q', 'quit']],
    need: { required: 'required', recommended: 'recommended' },
    origin: { file: 'saved', shell: 'found in your shell', import: 'imported', new: 'new' },
    keepHint: [['Enter', 'keep it'], ['n', 'paste a new one'], ['o', 'open the key page'], ['s', 'skip']],
    pasteHint: [['Enter', 'paste the key'], ['o', 'open the key page'], ['s', 'skip']],
    requiredHint: [['Enter', 'paste the key'], ['o', 'open the key page'], ['s', 'skip anyway']],
    requiredNote: 'Loom cannot voice a film without this key.',
    pastePrompt: 'paste',
    pasteFoot: 'Enter to confirm · Esc to go back · the key is never shown',
    tooShort: 'That does not look like a whole key. Paste it again.',
    have: 'A key is already here',
    getKey: 'get a key',
    importPrompt: 'path to the .env file',
    importFoot: 'Enter to read it · Esc to go back · only Loom\'s key names are taken',
    importNone: 'No key Loom uses was found in that file.',
    importMissing: 'There is no file at that path.',
    importFound: (names) => `Imported: ${names}.`,
    checking: 'Trying each key with its own service (at most a three-letter test line on ElevenLabs).',
    summary: 'checked',
    status: { ok: 'works', invalid: 'rejected', blocked: 'blocked', error: 'could not check', missing: 'skipped' },
    fixHint: [['r', 'fix the rejected ones'], ['Enter', 'save and finish'], ['q', 'quit without saving']],
    saveHint: [['Enter', 'save and finish'], ['b', 'go back'], ['q', 'quit without saving']],
    saved: 'Saved to',
    private: 'Only your user can read this file.',
    next: ['You can close this window now.', 'Back in Claude Code, choose “Check keys”.'],
    cancelled: 'Nothing was saved.',
    step: (i, n) => `${i} of ${n}`,
    needTty: 'The key wizard needs a terminal. Run it in a terminal window.',
  },
  tr: {
    title: 'anahtar kurulumu',
    intro: [
      'Loom her filmi birkaç dış servisle üretir. Anahtarlar bu makinede,',
      'yalnızca senin okuyabildiğin tek bir dosyada durur ve Claude\'a asla',
      'gösterilmez: Claude yalnızca her anahtarın çalışıp çalışmadığını öğrenir.',
    ],
    startHint: [['Enter', 'başla'], ['i', 'var olan bir .env dosyasından al'], ['q', 'çık']],
    need: { required: 'gerekli', recommended: 'önerilen' },
    origin: { file: 'kayıtlı', shell: 'terminal ortamında bulundu', import: 'içe aktarıldı', new: 'yeni' },
    keepHint: [['Enter', 'bunu kullan'], ['n', 'yenisini yapıştır'], ['o', 'anahtar sayfasını aç'], ['s', 'atla']],
    pasteHint: [['Enter', 'anahtarı yapıştır'], ['o', 'anahtar sayfasını aç'], ['s', 'atla']],
    requiredHint: [['Enter', 'anahtarı yapıştır'], ['o', 'anahtar sayfasını aç'], ['s', 'yine de atla']],
    requiredNote: 'Loom bu anahtar olmadan filmi seslendiremez.',
    pastePrompt: 'yapıştır',
    pasteFoot: 'Enter ile onayla · Esc ile geri dön · anahtar ekranda görünmez',
    tooShort: 'Bu tam bir anahtar gibi görünmüyor. Tekrar yapıştır.',
    have: 'Bir anahtar zaten var',
    getKey: 'anahtar al',
    importPrompt: '.env dosyasının yolu',
    importFoot: 'Enter ile oku · Esc ile geri dön · yalnızca Loom\'un anahtar adları alınır',
    importNone: 'Bu dosyada Loom\'un kullandığı bir anahtar yok.',
    importMissing: 'Bu yolda bir dosya yok.',
    importFound: (names) => `İçe aktarıldı: ${names}.`,
    checking: 'Her anahtar kendi servisinde deneniyor (ElevenLabs\'te en fazla üç harflik bir deneme).',
    summary: 'kontrol',
    status: { ok: 'çalışıyor', invalid: 'reddedildi', blocked: 'engelli', error: 'kontrol edilemedi', missing: 'atlandı' },
    fixHint: [['r', 'reddedilenleri düzelt'], ['Enter', 'kaydet ve bitir'], ['q', 'kaydetmeden çık']],
    saveHint: [['Enter', 'kaydet ve bitir'], ['b', 'geri dön'], ['q', 'kaydetmeden çık']],
    saved: 'Kaydedildi:',
    private: 'Bu dosyayı yalnızca senin kullanıcın okuyabilir.',
    next: ['Bu pencereyi artık kapatabilirsin.', 'Claude Code\'a dönüp “Anahtarları kontrol et”i seç.'],
    cancelled: 'Hiçbir şey kaydedilmedi.',
    step: (i, n) => `${i} / ${n}`,
    needTty: 'Anahtar sihirbazı bir terminal ister. Bir terminal penceresinde çalıştır.',
  },
}[LANG];

// ─── paint ──────────────────────────────────────────────────────────────────

const PLAIN = 'NO_COLOR' in process.env;
const esc = (code) => (PLAIN ? '' : `\x1b[${code}m`);
const C = {
  reset: esc(0), bold: esc(1), dim: esc(2), italic: esc(3),
  purple: esc('38;5;135'), violet: esc('38;5;99'), lilac: esc('38;5;183'), mint: esc('38;5;122'),
  lime: esc('38;5;191'), cream: esc('38;5;230'), grey: esc('38;5;245'), soft: esc('38;5;250'),
  green: esc('38;5;114'), red: esc('38;5;203'), amber: esc('38;5;221'), white: esc('38;5;231'),
};
const paint = (color, s) => `${color}${s}${C.reset}`;
const visible = (s) => s.replace(/\x1b\[[0-9;]*m/g, '').length;

const out = process.stdout;
// The window the wizard asks for (open.sh's Terminal window), columns × rows.
const WINDOW = { cols: 128, rows: 20 };
const cols = () => out.columns || 80;
const rows = () => out.rows || 24;
const WIDTH = () => Math.min(112, cols() - 8);
// Under 28 rows every screen drops its spare lines so it fits without scrolling.
const compact = () => rows() < 28;
const margin = () => ' '.repeat(Math.max(2, Math.floor((cols() - WIDTH()) / 2)));

const write = (s) => out.write(s);
const line = (s = '') => write(`${margin()}${s}\n`);
const clear = () => write('\x1b[2J\x1b[3J\x1b[H');
const rule = (color = C.grey, ch = '─') => line(paint(color, ch.repeat(WIDTH())));

function banner(sub) {
  const loom = [
    paint(C.bold + C.purple, 'L'), paint(C.bold + C.lilac, 'O'),
    paint(C.bold + C.mint, 'O'), paint(C.bold + C.lime, 'M'),
  ].join('  ');
  const title = `${loom}    ${paint(C.soft, '1.5')}     ${paint(C.grey, '·')}  ${paint(C.cream, sub)}`;
  if (compact()) {
    // One line: ✦ · · ·   L O O M  1.5  ·  sub   · · · ✦
    const side = Math.max(3, Math.floor((WIDTH() - visible(title) - 6) / 2));
    const dots = (n) => paint(C.grey, ' ·'.repeat(Math.max(0, Math.floor((n - 1) / 2))));
    write('\n');
    line(`${paint(C.violet, '✦')}${dots(side)}   ${title}   ${dots(side)} ${paint(C.violet, '✦')}`);
    write('\n');
    return;
  }
  const stars = paint(C.violet, '✦') + paint(C.grey, '  ·  '.repeat(Math.max(1, Math.floor((WIDTH() - 2) / 5) - 1))) + paint(C.violet, '✦');
  write('\n');
  line(stars);
  line();
  line(`   ${title}`);
  line();
  line(stars);
  write('\n');
}

function hints(pairs) {
  const parts = pairs.map(([k, label]) => `${paint(C.bold + C.lime, `[${k}]`)} ${paint(C.soft, label)}`);
  line(parts.join('   '));
}

function bar(text = '', color = C.purple) {
  line(`${paint(color, '┃')}  ${text}`);
}

const LOOK = { ok: [C.green, '✓'], invalid: [C.red, '✗'], blocked: [C.red, '✗'], error: [C.amber, '!'], missing: [C.grey, '·'] };

function needTag(need) {
  return need === 'required' ? paint(C.bold + C.lime, `● ${STR.need.required}`) : paint(C.mint, `○ ${STR.need.recommended}`);
}

/** Greedy word wrap on visible width. */
function wrap(text, width) {
  const lines = [];
  let cur = '';
  for (const word of text.split(/\s+/)) {
    if (cur && visible(cur) + 1 + visible(word) > width) { lines.push(cur); cur = word; }
    else cur = cur ? `${cur} ${word}` : word;
  }
  if (cur) lines.push(cur);
  return lines;
}

function padTo(s, width) {
  return s + ' '.repeat(Math.max(1, width - visible(s)));
}

// ─── input ──────────────────────────────────────────────────────────────────

const stdin = process.stdin;

function restore() {
  if (stdin.isTTY) stdin.setRawMode(false);
  write('\x1b[?25h');
}

function quit(message) {
  restore();
  clear();
  banner(STR.title);
  if (message) line(paint(C.soft, message));
  write('\n');
  process.exit(130);
}

function nextChunk() {
  return new Promise((res) => {
    const on = (buf) => { stdin.off('data', on); res(buf.toString('utf8')); };
    stdin.on('data', on);
  });
}

/**
 * One key press, lower-cased; Enter comes back as 'enter', Esc as 'esc'. When
 * 'paste' is allowed, a whole key pasted at the menu comes back as { paste }.
 */
async function press(allowed) {
  for (;;) {
    const k = await nextChunk();
    if (k === '\x03') quit(STR.cancelled);
    const text = k.replace(/\x1b\[20[01]~/g, '');
    if (allowed.includes('paste') && text.replace(/\s+/g, '').length >= 16) return { paste: text };
    const key = k === '\r' || k === '\n' ? 'enter' : k === '\x1b' ? 'esc' : k.toLowerCase();
    if (allowed.includes(key)) return key;
  }
}

/**
 * A line of input. Masked shows a bullet per character and never echoes the
 * text. Returns the text, or null on Esc.
 */
async function readLine(label, { masked }) {
  let value = '';
  const draw = () => {
    const shown = masked
      ? paint(C.purple, '•'.repeat(Math.min(value.length, 40))) + (value.length > 40 ? paint(C.grey, ` +${value.length - 40}`) : '')
      : paint(C.white, value);
    const count = masked && value.length ? paint(C.grey, `  ${value.length}`) : '';
    write(`\r\x1b[2K${margin()}${paint(C.bold + C.lime, '▸')} ${paint(C.soft, label)}  ${shown}${count}`);
  };
  write('\x1b[?25h');
  draw();
  for (;;) {
    let chunk = await nextChunk();
    if (chunk === '\x03') quit(STR.cancelled);
    if (chunk === '\x1b') { write('\n\x1b[?25l'); return null; }
    chunk = chunk.replace(/\x1b\[20[01]~/g, '').replace(/\x1b\[[0-9;?]*[A-Za-z~]/g, '');
    let done = false;
    for (const ch of chunk) {
      if (ch === '\r' || ch === '\n') { done = true; break; }
      if (ch === '\x7f' || ch === '\b') value = value.slice(0, -1);
      else if (ch === '\x15') value = '';
      else if (ch >= ' ') value += ch;
    }
    draw();
    if (done) { write('\n\x1b[?25l'); return masked ? value.replace(/\s+/g, '') : value.trim(); }
  }
}

function openPage(url) {
  const cmd = process.platform === 'darwin' ? 'open' : process.platform === 'win32' ? 'cmd' : 'xdg-open';
  const args = process.platform === 'win32' ? ['/c', 'start', '', url] : [url];
  try { spawn(cmd, args, { detached: true, stdio: 'ignore' }).unref(); } catch { /* the URL is on screen anyway */ }
}

// ─── state ──────────────────────────────────────────────────────────────────

/** id → { value, origin } for every service the user keeps or adds. */
const chosen = {};
for (const s of SERVICES) {
  const found = lookup(s.id);
  if (found) chosen[s.id] = { value: found.value, origin: found.source };
}

function writeEnv(file) {
  const known = new Set(SERVICES.flatMap(namesOf));
  const previous = existsSync(file) ? readFileSync(file, 'utf8').split('\n') : [];
  const others = previous.filter((l) => {
    const m = l.match(/^\s*(?:export\s+)?([A-Za-z_][A-Za-z0-9_]*)\s*=/);
    return m && !known.has(m[1]);
  });
  const body = [
    '# Loom 1.5 · keys',
    '# Written by tools/keys/wizard.mjs. This file stays on this machine (mode 600)',
    '# and is git-ignored. Loom never prints it and Claude never reads it: Claude runs',
    '# tools/keys/check.mjs, which only says whether each key works.',
    '',
  ];
  for (const s of SERVICES) {
    body.push(`# ${s.title} · ${s.role.en} · ${s.need} · ${s.url}`);
    body.push(chosen[s.id] ? `${s.env}=${chosen[s.id].value}` : `# ${s.env}=`);
    body.push('');
  }
  if (others.length) body.push('# other', ...others, '');
  const tmp = `${file}.tmp`;
  writeFileSync(tmp, body.join('\n'), { mode: 0o600 });
  renameSync(tmp, file);
  chmodSync(file, 0o600);
}

// ─── screens ────────────────────────────────────────────────────────────────

async function intro() {
  for (;;) {
    clear();
    banner(STR.title);
    for (const l of wrap(STR.intro.join(' '), WIDTH())) line(paint(C.soft, l));
    write('\n');
    SERVICES.forEach((s, i) => {
      const have = chosen[s.id] ? paint(C.green, `✓ ${STR.origin[chosen[s.id].origin]}`) : '';
      line(`${paint(C.grey, `${i + 1}`)}  ${padTo(paint(C.bold + C.white, s.title), 13)}${padTo(paint(C.soft, s.role[LANG]), 27)}${padTo(needTag(s.need), 15)}${have}`);
    });
    write('\n');
    rule();
    hints(STR.startHint);
    const k = await press(['enter', 'i', 'q']);
    if (k === 'q') quit(STR.cancelled);
    if (k === 'enter') return;
    await importFile();
  }
}

async function importFile() {
  write('\n');
  const path = await readLine(STR.importPrompt, { masked: false });
  line(paint(C.grey, STR.importFoot));
  if (path === null || !path) return;
  const cleaned = path.replace(/^['"]|['"]$/g, '').replace(/\\ /g, ' ');
  const file = resolve(cleaned.replace(/^~(?=$|\/)/, homedir()));
  if (!existsSync(file)) { line(paint(C.amber, STR.importMissing)); await pause(); return; }
  const found = parseEnv(readFileSync(file, 'utf8'));
  const names = [];
  for (const s of SERVICES) {
    const name = namesOf(s).find((n) => found[n]);
    if (name) { chosen[s.id] = { value: found[name], origin: 'import' }; names.push(s.title); }
  }
  line(names.length ? paint(C.green, STR.importFound(names.join(', '))) : paint(C.amber, STR.importNone));
  await pause();
}

function pause(ms = 1400) { return new Promise((r) => setTimeout(r, ms)); }

async function serviceStep(s, i, n) {
  for (;;) {
    clear();
    banner(`${STR.title}  ·  ${STR.step(i + 1, n)}`);
    const color = s.need === 'required' ? C.lime : C.mint;
    bar(`${padTo(paint(C.bold + C.white, s.title), 16)}${padTo(paint(C.soft, s.role[LANG]), WIDTH() - 36)}${needTag(s.need)}`, color);
    if (!compact()) bar('', color);
    for (const l of wrap(s.why[LANG].join(' '), WIDTH() - 3)) bar(paint(C.soft, l), color);
    if (s.scopes) { if (!compact()) bar('', color); for (const l of wrap(s.scopes[LANG], WIDTH() - 3)) bar(paint(C.grey + C.italic, l), color); }
    bar('', color);
    bar(`${paint(C.grey, `${STR.getKey} →`)} ${paint(C.lilac, s.url)}`, color);
    if (!compact()) write('\n');
    const have = chosen[s.id];
    if (have) line(paint(C.green, `✓ ${STR.have} · ${STR.origin[have.origin]}`));
    else if (s.need === 'required') line(paint(C.amber, STR.requiredNote));
    rule();
    hints(have ? STR.keepHint : s.need === 'required' ? STR.requiredHint : STR.pasteHint);
    const k = await press(have ? ['enter', 'n', 'o', 's', 'paste'] : ['enter', 'o', 's', 'paste']);
    if (k === 'o') { openPage(s.url); continue; }
    if (k === 's') { delete chosen[s.id]; return; }
    if (typeof k === 'object') {
      const v = k.paste.replace(/\s+/g, '');
      if (s.shape(v)) { chosen[s.id] = { value: v, origin: 'new' }; return; }
      continue;
    }
    if (k === 'enter' && have) return;
    // paste
    for (;;) {
      if (!compact()) write('\n');
      const v = await readLine(STR.pastePrompt, { masked: true });
      line(paint(C.grey, STR.pasteFoot));
      if (v === null) break;
      if (!v) continue;
      if (!s.shape(v)) { line(paint(C.amber, STR.tooShort)); continue; }
      chosen[s.id] = { value: v, origin: 'new' };
      return;
    }
  }
}

async function check() {
  clear();
  banner(`${STR.title}  ·  ${STR.summary}`);
  line(paint(C.soft, STR.checking));
  write('\n');
  const results = await Promise.all(SERVICES.map(async (s) => {
    if (!chosen[s.id]) return { s, r: { status: 'missing', detail: '' } };
    return { s, r: await s.check(chosen[s.id].value, { deep: true }) };
  }));
  write('\x1b[2A\x1b[0J');
  for (const { s, r } of results) {
    const [color, mark] = LOOK[r.status];
    line(`${paint(C.bold + color, mark)}  ${padTo(paint(C.bold + C.white, s.title), 13)}${padTo(paint(color, STR.status[r.status]), 20)}${paint(C.grey, r.detail ?? '')}`);
  }
  write('\n');
  return results;
}

async function finish() {
  for (;;) {
    const results = await check();
    const rejected = results.filter(({ r }) => r.status === 'invalid' || r.status === 'blocked').map(({ s }) => s);
    rule();
    hints(rejected.length ? STR.fixHint : STR.saveHint);
    const k = await press(rejected.length ? ['r', 'enter', 'q'] : ['enter', 'b', 'q']);
    if (k === 'q') quit(STR.cancelled);
    if (k === 'r') { for (const s of rejected) { delete chosen[s.id]; await serviceStep(s, SERVICES.indexOf(s), SERVICES.length); } continue; }
    if (k === 'b') { await walk(); continue; }
    writeEnv(ENV_FILE);
    return results;
  }
}

async function walk() {
  for (let i = 0; i < SERVICES.length; i++) await serviceStep(SERVICES[i], i, SERVICES.length);
}

async function done(results) {
  clear();
  banner(STR.title);
  for (const { s, r } of results) {
    const [color, mark] = LOOK[r.status];
    line(`${paint(C.bold + color, mark)}  ${padTo(paint(C.bold + C.white, s.title), 13)}${padTo(paint(C.soft, s.role[LANG]), 27)}${paint(color, STR.status[r.status])}`);
  }
  write('\n');
  const where = ENV_FILE.startsWith(homedir()) ? `~${ENV_FILE.slice(homedir().length)}` : ENV_FILE;
  if (visible(`${STR.saved} ${where}`) <= WIDTH()) line(`${paint(C.grey, STR.saved)} ${paint(C.lilac, where)}`);
  else { line(paint(C.grey, STR.saved)); for (const l of wrap(where.replace(/\//g, '/ '), WIDTH())) line(paint(C.lilac, l.replace(/\/ /g, '/'))); }
  line(paint(C.grey, STR.private));
  write('\n');
  rule(C.violet, '·');
  write('\n');
  for (const l of STR.next) line(paint(C.bold + C.cream, l));
  write('\n');
}

// ─── run ────────────────────────────────────────────────────────────────────

if (!stdin.isTTY || !out.isTTY) {
  console.error(STR.needTty);
  process.exit(2);
}

write('\x1b]0;Loom · keys\x07');
if (!process.env.LOOM_NO_RESIZE) {
  // Ask the terminal for the wizard's window size, then wait for it to land
  // (or 300 ms) so the first screen is laid out for the new width.
  write(`\x1b[8;${WINDOW.rows};${WINDOW.cols}t`);
  await new Promise((done) => {
    const t = setTimeout(done, 300);
    out.once('resize', () => { clearTimeout(t); setTimeout(done, 40); });
  });
}
stdin.setRawMode(true);
stdin.resume();
write('\x1b[?25l');
process.on('exit', restore);

await intro();
await walk();
await done(await finish());
restore();
process.exit(0);
