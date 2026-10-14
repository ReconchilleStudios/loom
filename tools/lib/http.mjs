// fetch with the two things every Loom call needs: a retry on 429 (one key is
// often shared by several windows of the same run) and an error that says
// what the service answered, never what was sent.

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/** `opts` may be a function, so a multipart body is rebuilt for each try. */
export async function fetchRetry(url, opts, { tries = 8, label = 'request' } = {}) {
  for (let i = 0; ; i++) {
    let res;
    try {
      res = await fetch(url, typeof opts === 'function' ? opts() : opts);
    } catch (err) {
      if (i >= tries - 1) throw new Error(`${label}: network error (${err.cause?.code ?? err.message})`);
      await sleep(3000 * (i + 1));
      continue;
    }
    if (res.status !== 429 && res.status < 500) return res;
    if (i >= tries - 1) return res;
    const wait = 4000 * (i + 1) + ((i * 977) % 2000);
    console.error(`${label}: busy (HTTP ${res.status}), retry ${i + 1} in ${(wait / 1000).toFixed(1)} s`);
    await sleep(wait);
  }
}

export async function failText(res) {
  let t = '';
  try { t = await res.text(); } catch { /* empty body */ }
  return `HTTP ${res.status} ${res.statusText} ${t.slice(0, 600)}`.trim();
}

/** Run async jobs with at most `n` in flight; resolves to results in order. */
export async function pool(items, n, fn) {
  const results = new Array(items.length);
  let next = 0;
  await Promise.all(Array.from({ length: Math.min(n, items.length) }, async () => {
    while (next < items.length) {
      const i = next++;
      results[i] = await fn(items[i], i);
    }
  }));
  return results;
}
