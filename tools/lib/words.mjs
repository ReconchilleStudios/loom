// Words: from ElevenLabs' character alignment, from a script line, and the
// comparison that tells whether a take said what the script says.

/** Spoken words with times from a TTS character alignment; [tags] dropped. */
export function wordsFromAlignment(a) {
  if (!a) return [];
  const words = [];
  let cur = null;
  let inTag = false;
  for (let i = 0; i < a.characters.length; i++) {
    const ch = a.characters[i];
    if (ch === '[') { inTag = true; if (cur) { words.push(cur); cur = null; } continue; }
    if (ch === ']') { inTag = false; continue; }
    if (inTag) continue;
    if (/\s/.test(ch)) { if (cur) { words.push(cur); cur = null; } continue; }
    if (!cur) cur = { text: '', start: a.character_start_times_seconds[i], end: a.character_end_times_seconds[i] };
    cur.text += ch;
    cur.end = a.character_end_times_seconds[i];
  }
  if (cur) words.push(cur);
  return words.filter((w) => /[\p{L}\p{N}]/u.test(w.text)).map((w) => ({ ...w, start: +w.start.toFixed(3), end: +w.end.toFixed(3) }));
}

/** A script line as it appears on screen: tags removed, spacing tidied. */
export const displayText = (text) => text.replace(/\[[^\]]*\]/g, ' ').replace(/\s+/g, ' ').trim();

/** The words of a line, as displayed. */
export const scriptWords = (text) => displayText(text).split(' ').filter((w) => /[\p{L}\p{N}]/u.test(w));

/** For comparing: lower case, letters and digits only, hyphens joined. */
export const norm = (w) => w.toLowerCase().normalize('NFKD').replace(/[̀-ͯ]/g, '').replace(/[^\p{L}\p{N}]/gu, '');

/**
 * Which script words a transcript missed or changed (LCS alignment on the
 * normalised words). Returns [] when the take says the line.
 */
export function wordDiff(expected, heard) {
  const a = expected.map(norm).filter(Boolean);
  const b = heard.map(norm).filter(Boolean);
  const dp = Array.from({ length: a.length + 1 }, () => new Array(b.length + 1).fill(0));
  for (let i = a.length - 1; i >= 0; i--) for (let j = b.length - 1; j >= 0; j--) {
    dp[i][j] = a[i] === b[j] ? dp[i + 1][j + 1] + 1 : Math.max(dp[i + 1][j], dp[i][j + 1]);
  }
  const out = [];
  let i = 0, j = 0;
  while (i < a.length || j < b.length) {
    if (i < a.length && j < b.length && a[i] === b[j]) { i++; j++; continue; }
    if (j < b.length && (i >= a.length || dp[i][j + 1] >= dp[i + 1][j])) { out.push({ heard: b[j] }); j++; }
    else { out.push({ expected: a[i] }); i++; }
  }
  return out;
}
