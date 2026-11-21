/* Interactions that work with or without motion: menu, nav, accordions, form, carousel, widgets, video */
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
export const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

export function initInteractions() {
  if (!document.documentElement.lang) document.documentElement.lang = 'en';

  /* Menu sheet */
  const menuBtn = $('#menuBtn'), sheet = $('#sheet'), behind = [$('main'), $('footer'), $('.skip-link')];
  function setMenu(open, refocus) {
    document.body.classList.toggle('menu-open', open);
    menuBtn.setAttribute('aria-expanded', open);
    $('.mb-label', menuBtn).textContent = open ? 'Close' : 'Menu';
    sheet.setAttribute('aria-hidden', !open);
    behind.forEach((el) => el && (el.inert = open));
    if (window.__lenis) open ? window.__lenis.stop() : window.__lenis.start();
    if (open) setTimeout(() => $('a', sheet).focus({ preventScroll: true }), 60);
    else if (refocus) menuBtn.focus();
  }
  menuBtn.addEventListener('click', () => setMenu(!document.body.classList.contains('menu-open'), true));
  $$('a', sheet).forEach((a) => a.addEventListener('click', () => setMenu(false)));
  addEventListener('keydown', (e) => { if (e.key === 'Escape' && document.body.classList.contains('menu-open')) setMenu(false, true); });

  /* Nav turns white once the hero is behind it */
  const nav = $('#nav'), hero = $('.hero');
  if (hero) { const solid = () => nav.classList.toggle('solid', scrollY > hero.offsetHeight - 90); addEventListener('scroll', solid, { passive: true }); solid(); }
  else nav.classList.add('solid');

  /* Services accordion */
  const strips = $$('#strips .strip');
  strips.forEach((s) => {
    const open = () => strips.forEach((o) => o.classList.toggle('is-open', o === s));
    s.addEventListener('pointerenter', (e) => { if (e.pointerType === 'mouse') open(); });
    s.addEventListener('focusin', open);
    s.addEventListener('click', open);
  });

  /* FAQ */
  $$('.qa').forEach((q) => {
    const b = $('button', q);
    b.addEventListener('click', () => {
      const isOpen = q.classList.toggle('open');
      b.setAttribute('aria-expanded', isOpen);
      setTimeout(() => window.ScrollTrigger && window.ScrollTrigger.refresh(), 650);
    });
  });

  /* Quote form */
  $$('form[data-validate]').forEach((form) => form.addEventListener('submit', (e) => {
    e.preventDefault();
    let first = null;
    $$('[required]', form).forEach((f) => {
      const bad = f.type === 'tel' ? f.value.replace(/\D/g, '').length < 10 : !f.value.trim();
      const err = $('#e-' + f.id); if (err) err.textContent = bad ? f.dataset.msg : '';
      bad ? f.setAttribute('aria-invalid', 'true') : f.removeAttribute('aria-invalid');
      if (bad && !first) first = f;
    });
    if (first) { first.focus(); return; }
    $('.form-fields', form).hidden = true; const done = $('.form-done', form); done.hidden = false; $('h3', done).focus();
  }));
  const params = new URLSearchParams(location.search);
  ['utm_source', 'utm_campaign'].forEach((k) => { const v = params.get(k); $$(`form [name="${k}"]`).forEach((f) => { if (v) f.value = v; }); });

  /* Process track is keyboard scrollable when it scrolls natively */
  const track = $('#track');
  if (track) {
  const syncTrack = () => { if (track.scrollWidth > track.clientWidth + 2 && getComputedStyle(track).overflowX === 'auto') track.tabIndex = 0; else track.removeAttribute('tabindex'); };
  syncTrack(); addEventListener('resize', syncTrack);
  }

  initVideos();
  initCarousel();
  initWidgets();
  initFilters();
  initViewer();
}

/* Filter chips: buttons with data-filter inside [data-filters], items with data-cat inside its data-target */
function initFilters() {
  $$('[data-filters]').forEach((bar) => {
    const items = $$('[data-cat]', $(bar.dataset.filters)), chips = $$('button[data-filter]', bar), live = $('.filter-count', bar.parentElement);
    chips.forEach((c) => c.addEventListener('click', () => {
      const f = c.dataset.filter;
      chips.forEach((x) => x.setAttribute('aria-pressed', x === c));
      let n = 0; items.forEach((it) => { const show = f === 'all' || it.dataset.cat === f; it.hidden = !show; if (show) n++; });
      if (live) live.textContent = `Showing ${n} of ${items.length}`;
      window.ScrollTrigger && window.ScrollTrigger.refresh();
    }));
  });
}

/* Gallery viewer: native dialog, arrows and Escape, only for frames that hold a photo */
function initViewer() {
  const dlg = $('#viewer'); if (!dlg) return;
  const img = $('img', dlg), cap = $('.viewer-cap', dlg);
  let list = [], i = 0, from = null;
  const show = () => { const it = list[i]; img.src = $('.ph-asset', it).getAttribute('src'); img.alt = it.dataset.label || ''; cap.textContent = `${it.dataset.label} · ${i + 1} of ${list.length}`; };
  $$('.gal-open').forEach((b) => b.addEventListener('click', () => {
    if (document.body.classList.contains('editing')) return;
    list = $$('.gal-item:not([hidden])').filter((x) => $('.ph-asset', x)); const it = b.closest('.gal-item');
    if (!$('.ph-asset', it)) return;
    i = list.indexOf(it); from = b; show(); dlg.showModal();
  }));
  $('.v-prev', dlg).addEventListener('click', () => { i = (i - 1 + list.length) % list.length; show(); });
  $('.v-next', dlg).addEventListener('click', () => { i = (i + 1) % list.length; show(); });
  $('.v-close', dlg).addEventListener('click', () => dlg.close());
  dlg.addEventListener('keydown', (e) => { if (e.key === 'ArrowRight') $('.v-next', dlg).click(); if (e.key === 'ArrowLeft') $('.v-prev', dlg).click(); });
  dlg.addEventListener('close', () => from && from.focus());
}

/* Video: autoplay only without reduced motion, always with a pause control */
export function initVideos(root = document) {
  $$('.ph video.ph-asset', root).forEach((v) => {
    const slot = v.closest('.ph'); if ($('.vid-toggle', slot)) return;
    const t = document.createElement('button'); t.type = 'button'; t.className = 'vid-toggle';
    const sync = () => { t.textContent = v.paused ? 'Play video' : 'Pause video'; };
    t.addEventListener('click', (e) => { e.stopPropagation(); v.paused ? v.play().catch(() => {}) : v.pause(); });
    v.addEventListener('play', sync); v.addEventListener('pause', sync);
    slot.appendChild(t); sync();
    if (!reduce) { v.autoplay = true; v.play().catch(() => {}); }
  });
}

/* Spring helper (damping ratio plus response) */
function spring({ from, to, velocity = 0, response = 0.45, damping = 1, onUpdate }) {
  let x = from, v = velocity, last = performance.now(), id;
  const k = Math.pow((2 * Math.PI) / response, 2), c = (4 * Math.PI * damping) / response;
  function step(now) {
    const dt = Math.min((now - last) / 1000, 1 / 30); last = now;
    for (let i = 0; i < 4; i++) { const h = dt / 4; const a = -k * (x - to) - c * v; v += a * h; x += v * h; }
    onUpdate(x);
    if (Math.abs(v) < 4 && Math.abs(x - to) < 0.4) { onUpdate(to); return; }
    id = requestAnimationFrame(step);
  }
  id = requestAnimationFrame(step);
  return { stop() { cancelAnimationFrame(id); } };
}

function initCarousel() {
  const vp = $('#rvViewport'), track = $('#rvTrack'); if (!vp || !track) return;
  const cards = $$('.review', track); if (!cards.length) return;
  let x = 0, anim = null, drag = null;
  const set = (v) => { x = v; track.style.transform = `translate3d(${v}px,0,0)`; };
  const bounds = () => ({ min: Math.min(0, -(track.scrollWidth - vp.clientWidth)), max: 0 });
  const snaps = () => { const { min } = bounds(); return [...new Set(cards.map((c) => Math.max(min, -c.offsetLeft)))]; };
  const nearest = (p) => snaps().reduce((a, b) => (Math.abs(b - p) < Math.abs(a - p) ? b : a));
  const project = (v, d = 0.998) => ((v / 1000) * d) / (1 - d);
  const rubber = (o, dim, c = 0.55) => (o * dim * c) / (dim + c * Math.abs(o));
  function go(target, velocity = 0, damping = 1) { anim && anim.stop(); if (reduce) { set(target); return; } anim = spring({ from: x, to: target, velocity, response: 0.5, damping, onUpdate: set }); }
  vp.addEventListener('pointerdown', (e) => {
    if (e.button !== 0 || document.body.classList.contains('editing')) return;
    anim && anim.stop();
    drag = { id: e.pointerId, sx: e.clientX, sy: e.clientY, start: x, hist: [{ x: e.clientX, t: performance.now() }], active: false };
  });
  vp.addEventListener('pointermove', (e) => {
    if (!drag || e.pointerId !== drag.id) return;
    const dx = e.clientX - drag.sx, dy = e.clientY - drag.sy;
    if (!drag.active) { if (Math.abs(dx) < 8) { if (Math.abs(dy) > 8) drag = null; return; } drag.active = true; vp.setPointerCapture(e.pointerId); vp.classList.add('dragging'); }
    const { min, max } = bounds(); let nx = drag.start + dx;
    if (nx > max) nx = max + rubber(nx - max, vp.clientWidth);
    if (nx < min) nx = min - rubber(min - nx, vp.clientWidth);
    set(nx);
    drag.hist.push({ x: e.clientX, t: performance.now() }); if (drag.hist.length > 6) drag.hist.shift();
  });
  function end() {
    if (!drag) return; const d = drag; drag = null; vp.classList.remove('dragging'); if (!d.active) return;
    const now = performance.now(), recent = d.hist.filter((h) => now - h.t < 100);
    const a = recent[0] || d.hist[0], b = d.hist[d.hist.length - 1];
    const v = b.t > a.t ? (b.x - a.x) / ((b.t - a.t) / 1000) : 0;
    const { min, max } = bounds();
    go(nearest(Math.max(min, Math.min(max, x + project(v)))), v, Math.abs(v) > 400 ? 0.82 : 1);
  }
  vp.addEventListener('pointerup', end); vp.addEventListener('pointercancel', end);
  const idx = () => { const s = snaps(); let i = 0; s.forEach((p, j) => { if (Math.abs(p - x) < Math.abs(s[i] - x)) i = j; }); return i; };
  $('#rvNext').addEventListener('click', () => { const s = snaps(); go(s[Math.min(s.length - 1, idx() + 1)]); });
  $('#rvPrev').addEventListener('click', () => { const s = snaps(); go(s[Math.max(0, idx() - 1)]); });
  vp.addEventListener('keydown', (e) => { if (e.key === 'ArrowRight') { e.preventDefault(); $('#rvNext').click(); } if (e.key === 'ArrowLeft') { e.preventDefault(); $('#rvPrev').click(); } });
  addEventListener('resize', () => { const { min } = bounds(); if (x < min) set(min); });
}

function initWidgets() {
  const STEPS = ['Call or referral', 'Walk the site', 'Budget and design', 'Proposal for review', 'Pricing locked', 'Build and hand over'];
  const tr = $('#tracker'), est = $('#estimate');
  if (tr) {
    const bars = $$('.tr-bars i', tr), n = $('.tr-n', tr), name = $('.tr-name', tr), row = $('.tr-step', tr);
    let k = 2, timer = null;
    const show = (j) => { bars.forEach((b, x) => b.classList.toggle('on', x <= j)); n.textContent = String(j + 1).padStart(2, '0'); name.textContent = STEPS[j]; };
    show(k);
    if (!reduce) {
      const tick = () => { k = (k + 1) % STEPS.length; row.classList.add('out'); setTimeout(() => { show(k); row.classList.remove('out'); }, 250); };
      new IntersectionObserver(([e]) => { clearInterval(timer); if (e.isIntersecting) timer = setInterval(tick, 2200); }, { threshold: 0.4 }).observe(tr);
    }
  }
  if (est) {
    if (reduce) est.classList.add('play');
    else new IntersectionObserver(([e]) => est.classList.toggle('play', e.isIntersecting), { threshold: 0.5 }).observe(est);
  }
}
