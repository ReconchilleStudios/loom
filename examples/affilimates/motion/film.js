/* Affilimates demo 120B "Rewind": shared motion helpers ("Press & Stack", bible section 5).
   Loaded once by index.html (before any sub-composition script). Every helper only ADDS tweens
   to the timeline it is given at the time it is given, so a whole beat can be built into a small
   paused timeline and played backwards (AF.reverse) for the rewind montage.
   All positions: desktop overlays use plate CSS px (1440x900) inside .af-desk; phone overlays
   use mobile CSS px (390x844) inside .af-app. Frame px only for stage-level elements. */
(function () {
  const F = 1 / 30; // one frame
  const AF = {};
  AF.F = F;

  // ---------- deterministic randomness ----------
  AF.rng = function (seed) {
    let a = seed >>> 0;
    return function () { a |= 0; a = (a + 0x6D2B79F5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
  };

  // ---------- DOM helpers ----------
  AF.el = function (tag, cls, parent, style, html) {
    const e = document.createElement(tag); if (cls) e.className = cls; if (style) Object.assign(e.style, style); if (html != null) e.innerHTML = html; if (parent) parent.appendChild(e); return e;
  };
  // Crop placed over its probe box [x,y,w,h]; radius in the same units clips the crop's white corners.
  AF.crop = function (parent, src, box, radius, extraStyle) {
    const d = AF.el('div', 'af-crop', parent, Object.assign({ left: box[0] + 'px', top: box[1] + 'px', width: box[2] + 'px', height: box[3] + 'px' }, extraStyle || {}));
    const img = AF.el('img', null, d); img.src = src; img.alt = '';
    if (radius) { d.style.borderRadius = radius + 'px'; d.style.overflow = 'hidden'; }
    return d;
  };
  AF.cursorSVG = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 3 L5 19 L9 15 L12 22 L15 20.5 L11.5 14 L18 14 Z"/></svg>';
  AF.cursor = function (parent) { const c = AF.el('div', 'af-cursor', parent, null, AF.cursorSVG); return c; };
  AF.tapEl = function (parent) { return AF.el('div', 'af-tap', parent); };
  // iOS-style status bar for .af-status
  AF.statusBar = function (parent, dark) {
    const s = AF.el('div', 'af-status' + (dark ? ' dark' : ''), parent);
    const col = dark ? '#fff' : '#000';
    s.innerHTML = '<span class="t">9:41</span><span class="island"></span>' +
      '<svg class="glyphs" viewBox="0 0 66 14"><g fill="' + col + '"><rect x="0" y="9" width="3" height="5" rx="1"/><rect x="5" y="6" width="3" height="8" rx="1"/><rect x="10" y="3" width="3" height="11" rx="1"/><rect x="15" y="0" width="3" height="14" rx="1"/>' +
      '<path d="M30 4.2a9 9 0 0 1 12 0l-1.6 1.7a6.7 6.7 0 0 0-8.8 0zM32.7 7a5.2 5.2 0 0 1 6.6 0l-1.6 1.7a3 3 0 0 0-3.4 0zM36 13l-2-2.1a2.8 2.8 0 0 1 4 0z"/>' +
      '<rect x="44" y="1" width="20" height="12" rx="3.5" fill="none" stroke="' + col + '" stroke-width="1.4" opacity="0.5"/><rect x="46" y="3" width="15" height="8" rx="2"/><rect x="64.6" y="5" width="1.4" height="4" rx="0.7" opacity="0.5"/></g></svg>';
    return s;
  };
  // Phone: returns {phone, screen, app}. opts: {x,y (frame px of top-left), scale, plate (src), dark}
  AF.phone = function (parent, opts) {
    opts = opts || {};
    const phone = AF.el('div', 'af-phone', parent, { left: (opts.x || 0) + 'px', top: (opts.y || 0) + 'px' });
    const screen = AF.el('div', 'af-screen', phone);
    AF.statusBar(screen, opts.dark);
    const app = AF.el('div', 'af-app', screen);
    if (opts.plate) { const i = AF.el('img', 'af-mplate', app); i.src = opts.plate; i.alt = ''; }
    if (opts.id) phone.id = opts.id;
    return { phone, screen, app };
  };
  // Hard cut between stacked layers at time t (never swap img src at render time: decode races).
  AF.cut = function (tl, show, hide, t) { if (hide) tl.set(hide, { opacity: 0 }, t); if (show) tl.set(show, { opacity: 1 }, t); };

  // ---------- named moves ----------
  // LAND: y +24 -> 0, scale .96 -> 1, opacity 0 -> 1, 11f back.out(1.6); shadow grows to depth, settles 2f later.
  AF.land = function (tl, el, t, o) {
    o = o || {}; const d = o.depth != null ? o.depth : 3; const dur = o.dur || 11 * F; const dy = o.dy != null ? o.dy : 24;
    tl.fromTo(el, { y: dy, scale: o.fromScale || 0.96, opacity: 0 }, { y: 0, scale: 1, opacity: 1, duration: dur, ease: 'back.out(1.6)', immediateRender: false }, t);
    if (o.shadow !== false && d > 0) {
      const col = o.shadowColor || '#000';
      if (o.filterShadow) tl.fromTo(el, { filter: 'drop-shadow(0px 0px 0px ' + col + ')' }, { filter: 'drop-shadow(' + d + 'px ' + d + 'px 0px ' + col + ')', duration: dur + 2 * F, ease: 'power2.out', immediateRender: false }, t);
      else tl.fromTo(el, { boxShadow: '0px 0px 0px 0px ' + col }, { boxShadow: d + 'px ' + d + 'px 0px 0px ' + col, duration: dur + 2 * F, ease: 'power2.out', immediateRender: false }, t);
    }
    return t + dur;
  };
  // Hide before a LAND without CSS transforms (keeps lint happy): opacity 0 at time 0.
  AF.hide = function (tl, els) { tl.set(els, { opacity: 0 }, 0); };
  // PRESS: element sinks (+px,+px) for 3 frames then returns. Use px=1 on 1:1 elements, ~1 on plate overlays (plate px).
  // base = the element's resting {x,y} (default 0,0). Absolute values only (seek-safe both directions).
  AF.press = function (tl, el, t, px, base) {
    px = px == null ? 1.5 : px; const bx = base ? base.x : 0, by = base ? base.y : 0;
    tl.fromTo(el, { x: bx, y: by }, { x: bx + px, y: by + px, duration: 2 * F, ease: 'power2.out', immediateRender: false }, t);
    tl.fromTo(el, { x: bx + px, y: by + px }, { x: bx, y: by, duration: 4 * F, ease: 'power2.out', immediateRender: false }, t + 5 * F);
    return t + 9 * F;
  };
  // Cursor travel: 10f power3.out with a small lean (lag on direction change). x,y in the cursor's parent space.
  AF.move = function (tl, cur, x, y, t, dur) {
    dur = dur || 10 * F;
    tl.to(cur, { x: x, y: y, duration: dur, ease: 'power3.out' }, t);
    tl.fromTo(cur, { rotation: -10 }, { rotation: 0, duration: dur + 4 * F, ease: 'power2.out', immediateRender: false }, t);
    return t + dur;
  };
  AF.click = function (tl, cur, t) {
    tl.to(cur, { scale: 0.86, duration: 2 * F, ease: 'power2.out' }, t);
    tl.to(cur, { scale: 1, duration: 4 * F, ease: 'power2.out' }, t + 3 * F);
    return t + 7 * F;
  };
  // Phone tap: ring appears, scales 1 -> .85 on the tap, fades.
  AF.tap = function (tl, tap, x, y, t) {
    tl.set(tap, { x: x, y: y }, t - 8 * F);
    tl.fromTo(tap, { opacity: 0, scale: 1.25 }, { opacity: 1, scale: 1, duration: 6 * F, ease: 'power2.out', immediateRender: false }, t - 8 * F);
    tl.to(tap, { scale: 0.85, duration: 3 * F, ease: 'power2.out' }, t);
    tl.to(tap, { scale: 1, opacity: 0, duration: 8 * F, ease: 'power2.in' }, t + 4 * F);
    return t + 12 * F;
  };
  // COUNT: tabular count with power2.out; final value pops 1.06 with a one-step shadow pulse (popEl optional).
  AF.count = function (tl, el, from, to, t, dur, fmt, popEl) {
    fmt = fmt || function (v) { return Math.round(v).toLocaleString('en-US'); };
    const o = { v: from };
    tl.fromTo(o, { v: from }, { v: to, duration: dur, ease: 'power2.out', immediateRender: false, onUpdate: function () { el.textContent = fmt(o.v); } }, t);
    if (popEl !== false) {
      const p = popEl || el;
      tl.fromTo(p, { scale: 1 }, { scale: 1.06, duration: 3 * F, ease: 'power2.out', yoyo: true, repeat: 1, immediateRender: false }, t + dur - F);
    }
    return t + dur;
  };
  // Camera: frame plate-px point (cx,cy) at zoom s (1 = fit-width). cam = .af-cam element.
  AF.camVals = function (cx, cy, s, fx, fy) {
    const k = 1.333334 * s; return { x: (fx == null ? 960 : fx) - cx * k, y: (fy == null ? 540 : fy) - cy * k, scale: s };
  };
  AF.camSet = function (tl, cam, cx, cy, s, t) { tl.set(cam, AF.camVals(cx, cy, s), t || 0); };
  AF.camTo = function (tl, cam, cx, cy, s, t, dur, ease) {
    tl.to(cam, Object.assign(AF.camVals(cx, cy, s), { duration: dur || 0.5, ease: ease || 'expo.inOut' }), t); return t + (dur || 0.5);
  };
  // SNAP ZOOM: punch in over 8f expo.out, hold, ease back out over 12f to (backCx, backCy, backS).
  AF.snapZoom = function (tl, cam, cx, cy, s, t, hold, back) {
    tl.to(cam, Object.assign(AF.camVals(cx, cy, s), { duration: 8 * F, ease: 'expo.out' }), t);
    if (back) tl.to(cam, Object.assign(AF.camVals(back[0], back[1], back[2]), { duration: 12 * F, ease: 'expo.inOut' }), t + 8 * F + hold);
    return t + 8 * F + hold + (back ? 12 * F : 0);
  };
  // PAN-READ: slow 2-4% push, sine.inOut. Use on .af-pan (or any wrapper not otherwise scaled).
  AF.panRead = function (tl, el, t, dur, amt, dx) {
    tl.fromTo(el, { scale: 1, x: 0 }, { scale: 1 + (amt || 0.03), x: dx || 0, duration: dur, ease: 'sine.inOut', immediateRender: false }, t);
  };
  // LIFT-OUT: shadow 3 -> 12 while it scales to `to` {x,y,scale}; veil to 80%.
  AF.liftOut = function (tl, el, veil, t, to, dur) {
    dur = dur || 16 * F;
    tl.to(el, Object.assign({ duration: dur, ease: 'expo.inOut' }, to), t);
    tl.fromTo(el, { boxShadow: '3px 3px 0px 0px #000' }, { boxShadow: '12px 12px 0px 0px #000', duration: dur, ease: 'expo.inOut', immediateRender: false }, t);
    if (veil) tl.to(veil, { opacity: 0.8, duration: dur * 0.7, ease: 'power2.out' }, t);
    return t + dur;
  };
  // STAMP: scale 1.6, -12deg -> 1.0, -7deg in 6f; 2-frame 6px camera shake on shakeEl.
  AF.stamp = function (tl, el, t, shakeEl) {
    tl.fromTo(el, { scale: 1.6, rotation: -12, opacity: 0 }, { scale: 1, rotation: -7, opacity: 1, duration: 6 * F, ease: 'power4.in', immediateRender: false }, t);
    if (shakeEl) { // shakeEl must be a wrapper with no other x/y animation (rest 0,0)
      tl.fromTo(shakeEl, { x: 0, y: 0 }, { x: 6, y: -4, duration: F, ease: 'none', immediateRender: false }, t + 6 * F);
      tl.fromTo(shakeEl, { x: 6, y: -4 }, { x: -4, y: 2, duration: F, ease: 'none', immediateRender: false }, t + 7 * F);
      tl.fromTo(shakeEl, { x: -4, y: 2 }, { x: 0, y: 0, duration: F, ease: 'none', immediateRender: false }, t + 8 * F);
    }
    return t + 9 * F;
  };
  // FLIP SHUFFLE: cards arc from their current spot to `to` [{x,y}] offsets (in parent px), 1f stagger, slight overshoot.
  AF.flip = function (tl, cards, to, t, dur, lift) {
    dur = dur || 14 * F; lift = lift == null ? 60 : lift;
    cards.forEach(function (c, i) {
      const tt = t + i * F; const tgt = to[i];
      tl.to(c, { x: tgt.x, duration: dur, ease: 'back.out(1.3)' }, tt);
      tl.to(c, { y: tgt.y, duration: dur, ease: 'back.out(1.3)' }, tt);
      tl.to(c, { scale: 1.06, rotation: (i % 2 ? 2.5 : -2.5), duration: dur * 0.45, ease: 'power2.out', yoyo: true, repeat: 1 }, tt);
      if (lift) tl.to(c, { zIndex: 10 + i, duration: 0.001 }, tt);
    });
    return t + (cards.length - 1) * F + dur;
  };
  // HANDOFF: el travels along a quadratic curve from a {x,y,scale,rotation} to b, apex lifted by `arc` px (frame space).
  AF.handoff = function (tl, el, a, b, t, dur, arc) {
    dur = dur || 0.8; arc = arc == null ? 160 : arc;
    const cx = (a.x + b.x) / 2, cy = Math.min(a.y, b.y) - arc; const o = { p: 0 };
    const apply = function () {
      const p = o.p, q = 1 - p;
      el.style.transform = 'translate(' + (q * q * a.x + 2 * q * p * cx + p * p * b.x) + 'px,' + (q * q * a.y + 2 * q * p * cy + p * p * b.y) + 'px) rotate(' +
        (a.rotation + (b.rotation - a.rotation) * p) + 'deg) scale(' + (a.scale + (b.scale - a.scale) * p) + ')';
    };
    tl.fromTo(o, { p: 0 }, { p: 1, duration: dur, ease: 'power2.inOut', immediateRender: false, onUpdate: apply, onStart: apply }, t);
    return t + dur;
  };
  // TYPE: characters into an input element (fast), caret element optional.
  AF.type = function (tl, el, text, t, dur) {
    const o = { n: 0 };
    tl.fromTo(o, { n: 0 }, { n: text.length, duration: dur, ease: 'none', immediateRender: false, onUpdate: function () { el.textContent = text.slice(0, Math.round(o.n)); } }, t);
    return t + dur;
  };
  // TYPE-ON per word: words = [{el, t, box}] -> each word pops in (y 14 -> 0, 4f); a sticker box draws in from left in 6f first.
  AF.typeOn = function (tl, words) {
    words.forEach(function (w) {
      if (w.box) tl.fromTo(w.box, { scaleX: 0 }, { scaleX: 1, duration: 6 * F, ease: 'expo.out', immediateRender: false }, w.t - 2 * F);
      tl.fromTo(w.el, { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 5 * F, ease: 'back.out(2)', immediateRender: false }, w.t);
    });
  };
  // Reverse: play a paused forward timeline backwards on `tl` from time t over dur (the rewind's engine).
  AF.reverse = function (tl, fwd, t, dur, ease) {
    fwd.pause(0);
    tl.add(fwd.tweenFromTo(fwd.duration(), 0, { duration: dur, ease: ease || 'power1.in', immediateRender: false }), t);
    return t + dur;
  };

  window.AF = AF;
})();
