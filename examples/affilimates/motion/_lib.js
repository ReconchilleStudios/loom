// Shared, seek-safe "Press & Stack" moves for every scene. All functions add tweens to a paused timeline.
// Page coordinates: kit desktop pages are 1440x900 CSS px inside .x-world; the camera scales the world.
window.M = window.M || (function () {
  const F = 1 / 30;
  const S0 = 1920 / 1440;
  const sh = (d, c) => `${Math.max(0, d)}px ${Math.max(0, d)}px 0px 0px ${c || '#000'}`;
  const $ = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => [...(r || document).querySelectorAll(s)];

  // fonts must be loaded before layout is measured
  const FONTS = ['400 16px Inter', '500 16px Inter', '600 16px Inter', '700 16px Inter', '800 16px Inter',
    '500 16px Poppins', '600 16px Poppins', '700 16px Poppins', '800 16px Poppins', '900 16px Poppins'];
  const ready = () => Promise.all(FONTS.map((f) => document.fonts.load(f))).then(() => document.fonts.ready);

  // Timelines are built while a scene's host may still be display:none (no layout, every box 0).
  // layout(root, fn): force hidden ancestors to lay out, run fn (measure + build), restore.
  function layout(root, fn) {
    const fixed = [];
    for (let n = root; n && n !== document.documentElement; n = n.parentElement) {
      if (getComputedStyle(n).display === 'none') { fixed.push([n, n.style.getPropertyValue('display'), n.style.getPropertyPriority('display')]); n.style.setProperty('display', 'block', 'important'); }
    }
    try { return fn(); } finally { fixed.forEach(([n, d, pr]) => { if (d) n.style.setProperty('display', d, pr); else n.style.removeProperty('display'); }); }
  }
  // build(root, fn): fonts ready → layout(root, fn)
  const build = (root, fn) => ready().then(() => layout(root, fn));

  // layout box of el in root's coordinates (offset chain, transforms ignored)
  function box(el, root) {
    let x = 0, y = 0, n = el;
    while (n && n !== root) {
      x += n.offsetLeft; y += n.offsetTop;
      const p = n.offsetParent;
      if (!p) break;
      if (p !== root) { x += p.clientLeft; y += p.clientTop; }
      n = p;
    }
    const w = el.offsetWidth, h = el.offsetHeight;
    return { x, y, w, h, cx: x + w / 2, cy: y + h / 2, r: x + w, b: y + h };
  }

  // LAND: y+24 → 0, scale .96 → 1, opacity 0 → 1, back.out(1.6); shadow grows to its depth 2 f later
  function land(tl, el, t, o) {
    o = o || {};
    const f = o.f || 11;
    tl.fromTo(el, { y: o.y != null ? o.y : 18, x: o.x || 0, scale: o.s != null ? o.s : 0.96, opacity: 0, rotation: o.rot0 != null ? o.rot0 : (o.rot || 0) },
      { y: 0, x: 0, scale: 1, opacity: 1, rotation: o.rot || 0, duration: f * F, ease: 'back.out(1.6)' }, t);
    if (o.depth != null) tl.fromTo(el, { boxShadow: sh(0, o.sc) }, { boxShadow: sh(o.depth, o.sc), duration: (f + 2) * F, ease: 'power2.out' }, t);
  }
  // fade-up for quiet secondary content
  function rise(tl, el, t, o) {
    o = o || {};
    tl.fromTo(el, { y: o.y != null ? o.y : 10, opacity: 0 }, { y: 0, opacity: 1, duration: (o.f || 8) * F, ease: 'power2.out' }, t);
  }
  // PRESS: sinks (+1,+1) while its shadow drops 1 px for 3 f, then returns
  function press(tl, el, t, o) {
    o = o || {};
    const d = o.depth != null ? o.depth : 4, k = o.k || 1;
    tl.fromTo(el, { x: 0, y: 0, boxShadow: sh(d) }, { x: k, y: k, boxShadow: sh(d - 1), duration: 2 * F, ease: 'power1.out', immediateRender: false }, t);
    tl.to(el, { x: 0, y: 0, boxShadow: sh(d), duration: 4 * F, ease: 'power2.out' }, t + 5 * F);
  }

  // ---- cursor (black arrow, 2 px white outline) ----
  const CUR = '<svg class="x-cursor" viewBox="0 0 17 25"><path d="M1.6 1.2 L1.6 19.6 L6.3 15.4 L9.5 22.4 L12.5 21.1 L9.4 14.3 L15.4 14.3 Z" fill="#0A0A0A" stroke="#fff" stroke-width="1.9" stroke-linejoin="round"/></svg>';
  function cursor(tl, parent, x, y, t, o) {
    o = o || {};
    parent.insertAdjacentHTML('beforeend', CUR);
    const c = parent.lastElementChild;
    if (o.scale) c.style.width = 17 * o.scale + 'px', c.style.height = 25 * o.scale + 'px';
    tl.set(c, { x, y, opacity: 0 }, 0);
    if (t != null) tl.to(c, { opacity: 1, duration: 4 * F }, t);
    return c;
  }
  function move(tl, c, x, y, t, dur, ease) {
    dur = dur || 10 * F;
    tl.to(c, { x, y, duration: dur, ease: ease || 'power3.out' }, t);
    tl.to(c, { rotation: -7, duration: dur * 0.35, ease: 'power1.out' }, t);
    tl.to(c, { rotation: 0, duration: dur * 0.65, ease: 'power2.out' }, t + dur * 0.35);
  }
  function click(tl, c, t) {
    tl.to(c, { scale: 0.84, duration: 2 * F, ease: 'power1.out' }, t);
    tl.to(c, { scale: 1, duration: 4 * F, ease: 'power2.out' }, t + 3 * F);
  }
  function fadeOut(tl, el, t, f) { tl.to(el, { opacity: 0, duration: (f || 6) * F, ease: 'power2.in' }, t); }
  function fadeIn(tl, el, t, f) { tl.fromTo(el, { opacity: 0 }, { opacity: 1, duration: (f || 6) * F, ease: 'power2.out' }, t); }
  // phone tap ring (black 44 px ring, white center, 1 → .85)
  function tap(tl, parent, x, y, t) {
    parent.insertAdjacentHTML('beforeend', '<div class="x-tap"></div>');
    const r = parent.lastElementChild;
    tl.set(r, { x, y }, 0);
    tl.fromTo(r, { opacity: 0, scale: 1.25 }, { opacity: 1, scale: 1, duration: 4 * F, ease: 'power2.out' }, t - 6 * F);
    tl.to(r, { scale: 0.85, duration: 3 * F, ease: 'power1.out' }, t);
    tl.to(r, { scale: 1, opacity: 0, duration: 6 * F, ease: 'power2.in' }, t + 4 * F);
    return r;
  }

  // ---- numbers ----
  const fmt = {
    int: (v) => Math.round(v).toLocaleString('en-US'),
    money: (v) => '$' + Math.round(v).toLocaleString('en-US'),
    x1: (v) => v.toFixed(1) + 'x',
    pct: (v) => Math.round(v) + '%',
    pct1: (v) => v.toFixed(1) + '%',
    k1: (v) => v.toFixed(1) + 'K',
  };
  // COUNT: tabular count-up, power2.out; final value pops 1.06
  function count(tl, el, to, t, o) {
    o = o || {};
    const from = o.from || 0, f = o.fmt || fmt.int, dur = o.dur || 0.8;
    const p = { v: from };
    el.textContent = f(from);
    tl.to(p, { v: to, duration: dur, ease: 'power2.out', onUpdate: () => { el.textContent = f(p.v); } }, t);
    if (o.pop !== false) {
      tl.to(el, { scale: 1.06, duration: 3 * F, ease: 'power2.out' }, t + dur - 2 * F);
      tl.to(el, { scale: 1, duration: 4 * F, ease: 'power2.inOut' }, t + dur + F);
    }
  }
  // typing into an element (characters), deterministic
  function type(tl, el, text, t, dur, o) {
    o = o || {};
    const p = { n: 0 };
    if (!o.keep) el.textContent = '';
    tl.to(p, { n: text.length, duration: dur, ease: 'none', onUpdate: () => { el.textContent = text.slice(0, Math.round(p.n)); } }, t);
  }

  // STAMP: 1.6, -12° → 1.0, -7° in 6 f, then a 2-frame 6 px shake on `shake`
  function stamp(tl, el, t, shake) {
    tl.fromTo(el, { scale: 1.6, rotation: -12, opacity: 0 }, { scale: 1, rotation: -7, opacity: 1, duration: 6 * F, ease: 'power4.in' }, t);
    if (shake) {
      tl.to(shake, { x: 6, y: -3, duration: F, ease: 'none' }, t + 6 * F);
      tl.to(shake, { x: -4, y: 4, duration: F, ease: 'none' }, t + 7 * F);
      tl.to(shake, { x: 0, y: 0, duration: F, ease: 'none' }, t + 8 * F);
    }
  }

  // DEAL: purple, lilac, mint, cream panels with a 2 px leading edge, dealt 2 f apart
  const DEAL = ['#7614FF', '#E9D4FF', '#B9FDF3', '#FEFBD6'];
  function dealPanels(parent) {
    return DEAL.map((c) => { const d = document.createElement('div'); d.className = 'x-deal'; d.style.background = c; parent.appendChild(d); return d; });
  }
  // cover: panels slide in from the right and finish covering at `end`
  function dealIn(tl, parent, end) {
    const ps = dealPanels(parent);
    ps.forEach((p, i) => {
      const t = end - (8 + (3 - i) * 2) * F;
      tl.fromTo(p, { x: 1960 }, { x: -40, duration: 8 * F, ease: 'power3.inOut' }, t);
    });
    return ps;
  }
  // reveal: covered at `t`, panels leave to the left, top panel first
  function dealOut(tl, parent, t) {
    const ps = dealPanels(parent);
    ps.forEach((p, i) => {
      tl.fromTo(p, { x: -40 }, { x: -2300, duration: 9 * F, ease: 'power3.inOut' }, t + (3 - i) * 2 * F);
    });
    return ps;
  }

  // WHIP: lateral whip with capped horizontal blur (an SVG filter per element)
  let wid = 0;
  function blurFilter(el) {
    const id = 'xwhip' + (++wid) + '_' + Math.floor(el.getBoundingClientRect().width);
    el.insertAdjacentHTML('beforebegin', `<svg width="0" height="0" style="position:absolute"><filter id="${id}" x="-20%" y="-5%" width="140%" height="110%"><feGaussianBlur stdDeviation="0 0"/></filter></svg>`);
    const blur = el.previousElementSibling.querySelector('feGaussianBlur');
    return { id, blur };
  }
  function whipOut(tl, el, t, dir) {
    const { id, blur } = blurFilter(el);
    tl.set(el, { filter: `url(#${id})` }, t);
    tl.to(el, { x: (dir || -1) * 760, duration: 7 * F, ease: 'power3.in' }, t);
    tl.fromTo(blur, { attr: { stdDeviation: '0 0' } }, { attr: { stdDeviation: '42 0' }, duration: 7 * F, ease: 'power2.in', immediateRender: false }, t);
  }
  function whipIn(tl, el, t, dir) {
    const { id, blur } = blurFilter(el);
    tl.set(el, { filter: `url(#${id})` }, 0);
    tl.fromTo(el, { x: -(dir || -1) * 760 }, { x: 0, duration: 8 * F, ease: 'power3.out' }, t);
    tl.fromTo(blur, { attr: { stdDeviation: '42 0' } }, { attr: { stdDeviation: '0 0' }, duration: 8 * F, ease: 'power2.out' }, t);
    tl.set(el, { filter: 'none' }, t + 8 * F);
  }

  // ---- camera on a .x-world (page coords → frame) ----
  function camFor(cx, cy, z, o) {
    o = o || {};
    const W = o.W || 1920, H = o.H || 1080, PW = o.PW || 1440, PH = o.PH || 900, s = (o.s0 || S0) * z;
    let x = W / 2 - cx * s, y = H / 2 - cy * s;
    if (o.clamp !== false) {
      x = PW * s <= W ? (W - PW * s) / 2 : Math.min(0, Math.max(W - PW * s, x));
      y = PH * s <= H ? (H - PH * s) / 2 : Math.min(0, Math.max(H - PH * s, y));
    }
    return { x, y, scale: s };
  }
  function cam(tl, world, t, cx, cy, z, dur, ease, o) {
    tl.to(world, Object.assign(camFor(cx, cy, z, o), { duration: dur != null ? dur : 0.6, ease: ease || 'expo.inOut' }), t);
  }
  function camSet(tl, world, cx, cy, z, t, o) { tl.set(world, camFor(cx, cy, z, o), t || 0); }

  // ---- labels ----
  const ARROWS = {
    left: '<svg viewBox="0 0 24 24" fill="none" stroke="#000" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M19 12H5M11 6l-6 6 6 6"/></svg>',
    up: '<svg viewBox="0 0 24 24" fill="none" stroke="#000" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M12 19V5M6 11l6-6 6 6"/></svg>',
    down: '<svg viewBox="0 0 24 24" fill="none" stroke="#000" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14M6 13l6 6 6-6"/></svg>',
    right: '<svg viewBox="0 0 24 24" fill="none" stroke="#000" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
  };
  function pill(parent, text, dir) {
    parent.insertAdjacentHTML('beforeend', `<div class="x-pill">${ARROWS[dir || 'left']}<span>${text}</span></div>`);
    return parent.lastElementChild;
  }
  // outline pulse ring around a box
  function ring(parent, b, pad, radius) {
    pad = pad == null ? 6 : pad;
    const r = document.createElement('div');
    r.className = 'x-ring';
    Object.assign(r.style, { left: b.x - pad + 'px', top: b.y - pad + 'px', width: b.w + pad * 2 + 'px', height: b.h + pad * 2 + 'px' });
    if (radius != null) r.style.borderRadius = radius + 'px';
    parent.appendChild(r);
    return r;
  }
  function pulse(tl, r, t, hold) {
    tl.fromTo(r, { opacity: 0, scale: 1.06 }, { opacity: 1, scale: 1, duration: 6 * F, ease: 'back.out(2)' }, t);
    tl.to(r, { opacity: 0, duration: 8 * F, ease: 'power2.in' }, t + (hold != null ? hold : 0.9));
  }

  // ---- phone (flat bezel, drawn status bar) ----
  const SB = '<span>9:41</span><span class="isl"></span><span class="ico"><svg width="18" height="12" viewBox="0 0 18 12"><rect x="0" y="8" width="3" height="4" rx="1"/><rect x="5" y="5.5" width="3" height="6.5" rx="1"/><rect x="10" y="3" width="3" height="9" rx="1"/><rect x="15" y="0" width="3" height="12" rx="1"/></svg><svg width="16" height="12" viewBox="0 0 16 12"><path d="M8 11.5 5.6 9a3.4 3.4 0 0 1 4.8 0L8 11.5Zm-4.2-4.3L2.2 5.6a8.2 8.2 0 0 1 11.6 0l-1.6 1.6a5.9 5.9 0 0 0-8.4 0ZM.6 4 0 3.4a11.3 11.3 0 0 1 16 0L15.4 4A10.4 10.4 0 0 0 .6 4Z"/></svg><svg width="27" height="13" viewBox="0 0 27 13"><rect x=".5" y=".5" width="23" height="12" rx="3.5" fill="none" stroke="#000" opacity=".45"/><rect x="2" y="2" width="20" height="9" rx="2"/><path d="M25 4.5v4a2 2 0 0 0 0-4Z" opacity=".45"/></svg></span>';
  function phone(parent) {
    parent.insertAdjacentHTML('beforeend', `<div class="x-phone"><div class="scr"><div class="sb">${SB}</div><div class="page"></div></div></div>`);
    const el = parent.lastElementChild;
    return { el, scr: el.querySelector('.scr'), page: el.querySelector('.page') };
  }

  // ---- TYPE-ON per word ----
  // words: array of [text, isSticker]; returns elements; reveals per word from t with gap
  function typeOn(tl, words, t, gap) {
    words.forEach((w, i) => {
      const at = t + i * gap;
      if (w.classList.contains('x-stkw')) {
        const bg = w.querySelector('.bg');
        tl.fromTo(bg, { scaleX: 0 }, { scaleX: 1, duration: 6 * F, ease: 'power3.out' }, at);
        tl.fromTo(w.querySelector('.tx'), { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 5 * F, ease: 'power2.out' }, at + 3 * F);
      } else {
        tl.fromTo(w, { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 5 * F, ease: 'power2.out' }, at);
      }
    });
  }

  // Deliberate layers (a modal over its veiled page, a panel over a screen, the clock sticker): mark every
  // text block of the covering layer as an intended overlap for the layout audit (the flag is per element).
  function allowOverlap() {
    [...arguments].flat().filter(Boolean).forEach((el) => [el, ...el.querySelectorAll('*')].forEach((n) => n.setAttribute('data-layout-allow-overlap', '')));
  }

  // ---- sound cues (collected from the live page, mixed into one SFX bus) ----
  function sfx(sceneId, name, t, db) {
    const host = document.querySelector('[data-composition-id="' + sceneId + '"][data-start]');
    const base = host ? parseFloat(host.getAttribute('data-start')) || 0 : 0;
    (window.__sfx = window.__sfx || []).push({ scene: sceneId, name, t: +(base + t).toFixed(3), db: db || 0 });
  }

  return { F, S0, sh, $, $$, ready, layout, build, box, land, rise, press, cursor, move, click, fadeIn, fadeOut, tap, fmt, count, type, stamp, dealIn, dealOut, whipOut, whipIn, camFor, cam, camSet, pill, ring, pulse, phone, typeOn, allowOverlap, sfx };
})();
