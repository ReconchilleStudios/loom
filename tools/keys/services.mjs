// The outside services Loom uses, in the order the wizard asks for them.
//
// Adding one is one entry here: its env name, the older names people already
// use for it (the wizard imports those), why a film needs it in both of the
// wizard's languages, where to get a key, and a check that costs nothing.
// A check never spends credits and never returns the key.

const TIMEOUT = 12_000;

async function get(url, headers) {
  try {
    const res = await fetch(url, { headers, signal: AbortSignal.timeout(TIMEOUT) });
    let body = null;
    try { body = await res.json(); } catch { /* not JSON */ }
    return { status: res.status, headers: res.headers, body };
  } catch (err) {
    return { status: 0, error: err.name === 'TimeoutError' ? 'timeout' : (err.cause?.code ?? err.message) };
  }
}

const unreachable = (r) => ({ status: 'error', detail: `could not reach the service (${r.error})` });

/** Three characters on v4 Turbo: proves the account can generate. */
async function speak(k) {
  try {
    const res = await fetch('https://api.elevenlabs.io/v1/text-to-speech/EXAVITQu4vr4xnSDxMaL?output_format=mp3_22050_32', {
      method: 'POST',
      headers: { 'xi-api-key': k, 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: 'Hi.', model_id: 'eleven_v4_turbo' }),
      signal: AbortSignal.timeout(TIMEOUT),
    });
    if (res.ok) { await res.arrayBuffer(); return { ok: true }; }
    let d = null;
    try { d = (await res.json())?.detail; } catch { /* not JSON */ }
    const code = typeof d === 'object' ? (d?.status ?? d?.code) : undefined;
    if (/payment/i.test(code ?? '') || d?.type === 'payment_required') return { ok: false, result: { status: 'blocked', detail: 'the key works but the account cannot generate: complete the latest invoice on elevenlabs.io' } };
    if (/quota|credits|limit/i.test(code ?? '')) return { ok: false, result: { status: 'blocked', detail: 'the account is out of credits' } };
    if (/permission/i.test(code ?? '')) return { ok: false, result: { status: 'blocked', detail: 'the key lacks the Text to Speech permission' } };
    return { ok: false, result: { status: 'error', detail: `test line refused (HTTP ${res.status}${code ? ` ${code}` : ''})` } };
  } catch (err) {
    return { ok: false, result: { status: 'error', detail: `could not reach the service (${err.name})` } };
  }
}

export const SERVICES = [
  {
    id: 'elevenlabs',
    title: 'ElevenLabs',
    env: 'ELEVENLABS_API_KEY',
    aliases: ['ELEVEN_API_KEY', 'ELEVEN_KEY', 'XI_API_KEY'],
    need: 'required',
    role: { en: 'the voice', tr: 'ses' },
    url: 'https://elevenlabs.io/app/settings/api-keys',
    why: {
      en: [
        'The narrator is half of the film. Loom directs ElevenLabs v4 line by line',
        'with audio tags ([warm], [curious], [whispers], [laughs softly]) so the',
        'voice performs instead of reading, and auditions the cast before it commits.',
        'The same key makes the score (Music), the sound library (sound effects)',
        'and the word timings (Scribe) that land every cut and press on a word.',
        'Without it Loom cannot make a film to its standard.',
      ],
      tr: [
        'Filmin yarısı anlatıcıdır. Loom ElevenLabs v4\'ü satır satır yönetir:',
        '[warm], [curious], [whispers], [laughs softly] gibi ses etiketleriyle',
        'ses okumaz, oynar; seçmeden önce seslendirmenleri dinleyip karşılaştırır.',
        'Aynı anahtar müziği (Music), efekt kütüphanesini (ses efektleri) ve',
        'her kesmeyi bir kelimeye oturtan kelime zamanlamalarını (Scribe) üretir.',
        'Bu anahtar olmadan Loom kendi standardında bir film çıkaramaz.',
      ],
    },
    scopes: {
      en: 'Key permissions: Text to Speech, Speech to Text, Sound Effects, Music (User: read is optional, it shows your remaining credits).',
      tr: 'Anahtar izinleri: Text to Speech, Speech to Text, Sound Effects, Music (User: read isteğe bağlı, kalan krediyi gösterir).',
    },
    shape: (k) => k.length >= 20,
    // Free by default. With deep, a key whose account cannot be read is also
    // asked to speak three characters on Turbo (well under one credit): the
    // only way to see a subscription with a failed payment, which accepts the
    // key and refuses to generate.
    async check(k, { deep = false } = {}) {
      const r = await get('https://api.elevenlabs.io/v1/user/subscription', { 'xi-api-key': k });
      if (r.status === 0) return unreachable(r);
      if (r.status === 200) {
        const b = r.body ?? {};
        if (/past_due|incomplete|unpaid|cancel/i.test(b.status ?? '')) {
          return { status: 'blocked', detail: `the account is ${b.status}: complete the latest invoice on elevenlabs.io` };
        }
        const left = typeof b.character_limit === 'number' && typeof b.character_count === 'number'
          ? b.character_limit - b.character_count : undefined;
        return { status: 'ok', detail: [b.tier && `${b.tier} plan`, left !== undefined && `${left.toLocaleString('en-US')} characters left`].filter(Boolean).join(' · ') || 'connected', info: { tier: b.tier, charactersLeft: left } };
      }
      const d = r.body?.detail;
      const code = typeof d === 'object' ? d?.status : undefined;
      const msg = typeof d === 'object' ? d?.message ?? '' : String(d ?? '');
      if (code === 'missing_permissions' || /missing the permission/i.test(msg)) {
        if (!deep) return { status: 'ok', detail: 'connected · account details hidden by the key\'s permissions', info: { restricted: true } };
        const t = await speak(k);
        if (t.ok) return { status: 'ok', detail: 'connected · generates (account details hidden by the key\'s permissions)', info: { restricted: true, generated: true } };
        return t.result;
      }
      if (r.status === 401 || r.status === 403 || (typeof d === 'object' && d?.type === 'authentication_error')) {
        return { status: 'invalid', detail: /length/.test(code ?? '') ? 'ElevenLabs rejected the key (wrong length: copy it again)' : 'ElevenLabs rejected the key' };
      }
      return { status: 'error', detail: `unexpected answer (HTTP ${r.status})` };
    },
  },
  {
    id: 'fal',
    title: 'fal.ai',
    env: 'FAL_KEY',
    aliases: ['FAL_API_KEY'],
    need: 'recommended',
    role: { en: 'generated pictures', tr: 'üretilmiş görseller' },
    url: 'https://fal.ai/dashboard/keys',
    why: {
      en: [
        'Generated stills and image-to-video: the people, products and scenes a',
        'film needs that no stock library has, and the moment a still wakes into',
        'motion. Every call is priced and logged before it runs, under the budget',
        'you set for the film. Without it Loom uses only real captures and stock.',
      ],
      tr: [
        'Üretilmiş fotoğraflar ve görselden videoya: filmin ihtiyaç duyduğu, hiçbir',
        'stok kütüphanesinde olmayan insanlar, ürünler, sahneler; ve durağan bir',
        'karenin harekete uyandığı an. Her çağrı çalışmadan önce fiyatlanır ve',
        'filme koyduğun bütçe altında kayda geçer. Bu anahtar olmadan Loom yalnızca',
        'gerçek ekran görüntüleri ve stok görüntüyle çalışır.',
      ],
    },
    shape: (k) => k.length >= 20,
    async check(k) {
      // Status of a request id that cannot exist: a valid key gets "not found",
      // a bad key gets 401/403. Nothing is queued and nothing is billed.
      const r = await get('https://queue.fal.run/fal-ai/nano-banana-2/requests/00000000-0000-4000-8000-000000000000/status', { Authorization: `Key ${k}` });
      if (r.status === 0) return unreachable(r);
      if (r.status === 401 || r.status === 403) return { status: 'invalid', detail: 'fal rejected the key' };
      if (r.status >= 500) return { status: 'error', detail: `fal is having trouble (HTTP ${r.status})` };
      return { status: 'ok', detail: 'connected' };
    },
  },
  {
    id: 'pexels',
    title: 'Pexels',
    env: 'PEXELS_API_KEY',
    aliases: ['PEXELS_KEY'],
    need: 'recommended',
    role: { en: 'stock footage · free', tr: 'stok görüntü · ücretsiz' },
    url: 'https://www.pexels.com/api/new/',
    why: {
      en: [
        'Free, licensed stock video for the world around the product: offices at',
        'dawn, hands on keyboards, screens, the people the product is for. Loom',
        'looks at every clip on a contact sheet before it is used. The key is free',
        'and takes a minute to get.',
      ],
      tr: [
        'Ürünün etrafındaki dünya için ücretsiz, lisanslı stok video: sabah ofisleri,',
        'klavyedeki eller, ekranlar, ürünün hitap ettiği insanlar. Loom her klibe',
        'kullanmadan önce bir kare dökümünde bakar. Anahtar ücretsizdir, almak bir',
        'dakika sürer.',
      ],
    },
    shape: (k) => k.length >= 20,
    async check(k) {
      const r = await get('https://api.pexels.com/v1/search?query=office&per_page=1', { Authorization: k });
      if (r.status === 0) return unreachable(r);
      if (r.status === 200) {
        const left = r.headers.get('x-ratelimit-remaining');
        return { status: 'ok', detail: left ? `connected · ${Number(left).toLocaleString('en-US')} requests left this month` : 'connected' };
      }
      if (r.status === 401 || r.status === 403) return { status: 'invalid', detail: 'Pexels rejected the key' };
      if (r.status === 429) return { status: 'ok', detail: 'connected · monthly request limit reached' };
      return { status: 'error', detail: `unexpected answer (HTTP ${r.status})` };
    },
  },
];
