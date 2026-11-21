/* Scroll motion. Desktop gets the full set, phones and touch screens a lighter one, reduced motion gets none. */
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import { reduce } from './interactions.js';

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];

export function initMotion() {
  /* Marquee copy so the strip loops without a gap */
  const mq = $('#marquee'); if (mq) mq.appendChild(mq.firstElementChild.cloneNode(true));
  if (reduce) { document.documentElement.classList.remove('motion'); return; }

  gsap.registerPlugin(ScrollTrigger);
  window.ScrollTrigger = ScrollTrigger;
  ScrollTrigger.config({ ignoreMobileResize: true });
  const touch = matchMedia('(pointer: coarse)').matches;
  const small = touch || matchMedia('(max-width: 900px)').matches;

  if (!touch) {
    const lenis = new Lenis({ lerp: 0.09, smoothWheel: true });
    window.__lenis = lenis;
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((t) => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
    $$('a[href^="#"]').forEach((a) => a.addEventListener('click', (e) => {
      const id = a.getAttribute('href'); const el = id.length > 1 ? document.querySelector(id) : document.body;
      if (!el || document.body.classList.contains('editing')) return;
      e.preventDefault(); lenis.scrollTo(el, { offset: id === '#top' || id === '#main' ? 0 : -88, duration: 1.4 });
      if (!el.hasAttribute('tabindex')) el.setAttribute('tabindex', '-1');
      el.focus({ preventScroll: true });
    }));
  }

  /* Nav hides on the way down, returns on the way up (desktop only) */
  const nav = $('#nav');
  if (!small) ScrollTrigger.create({ start: 0, end: 'max', onUpdate: (self) => {
    nav.classList.toggle('is-hidden', self.direction === 1 && self.scroll() > 240 && !document.body.classList.contains('menu-open') && !nav.contains(document.activeElement));
  } });

  /* Hero intro */
  if ($('#heroFrame')) gsap.timeline({ defaults: { ease: 'expo.out' } })
    .from('#heroFrame', { clipPath: 'inset(4% 3% 4% 3% round 4px)', duration: 1.6, clearProps: 'clipPath' })
    .from('#heroFrame .ph-media', { scale: 1.14, duration: 2 }, 0)
    .fromTo('.hero h1 .line > span', { y: 0, yPercent: 110 }, { y: 0, yPercent: 0, duration: 1.3, stagger: 0.1 }, 0.25)
    .fromTo('[data-intro]', { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 1.1, stagger: 0.08 }, 0.6)
    .from('.nav-bar', { y: -16, opacity: 0, duration: 1 }, 0.5);

  if (!small && $('.hero')) gsap.to('.hero-content', { y: -90, opacity: 0.15, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: '70% top', scrub: true } });

  /* Statement words light up as you read */
  const st = $('#statement');
  const split = (html) => {
    if (window.__stTween) { window.__stTween.scrollTrigger?.kill(); window.__stTween.kill(); }
    st.dataset.src = html;
    st.innerHTML = html.replace(/(<span class="hl">)?([^\s<]+)(<\/span>)?/g, (m, open, word) => (open ? `<span class="w hl">${word}</span>` : `<span class="w">${word}</span>`));
    window.__stTween = gsap.fromTo('#statement .w', { opacity: 0.16 }, { opacity: 1, ease: 'none', stagger: 0.12, scrollTrigger: { trigger: st, start: 'top 78%', end: 'bottom 42%', scrub: true } });
  };
  if (st) { split(st.innerHTML); window.__resplitStatement = split; }
  /* Page titles rise in */
  if ($('.page-head h1')) gsap.fromTo('.page-head-in > *', { y: 28, opacity: 0 }, { y: 0, opacity: 1, duration: 1.1, ease: 'expo.out', stagger: 0.07, delay: 0.15 });

  /* Reveals */
  ScrollTrigger.batch('[data-reveal]', { start: 'top 88%', once: true, onEnter: (els) => gsap.fromTo(els, { y: 32, opacity: 0 }, { y: 0, opacity: 1, duration: 1.1, ease: 'expo.out', stagger: 0.08, overwrite: true }) });
  document.documentElement.classList.add('motion-ready');

  if (!small) {
    /* Photos drift a little slower than the page */
    $$('[data-parallax]').forEach((f) => { const m = $('.ph-media', f); if (m) gsap.fromTo(m, { yPercent: -5 }, { yPercent: 5, ease: 'none', scrollTrigger: { trigger: f, start: 'top bottom', end: 'bottom top', scrub: true } }); });
    if ($('#heroFrame')) gsap.to('#heroFrame .ph-media', { yPercent: 8, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });

    /* House drawings wipe in from the left */
    $$('.bg-draw').forEach((d) => {
      const img = $('img', d), sec = d.parentElement;
      gsap.fromTo(img, { clipPath: 'inset(0 100% 0 0)' }, { clipPath: 'inset(0 0% 0 0)', ease: 'none', scrollTrigger: { trigger: sec, start: 'top 85%', end: 'top 15%', scrub: true } });
      gsap.fromTo(d, { yPercent: -6 }, { yPercent: 8, ease: 'none', scrollTrigger: { trigger: sec, start: 'top bottom', end: 'bottom top', scrub: true } });
    });

    /* Project cards tuck under the next one */
    const cards = $$('#stack .card');
    cards.forEach((c, i) => { const next = cards[i + 1]; if (next) gsap.to($('.card-inner', c), { scale: 0.94, ease: 'none', scrollTrigger: { trigger: next, start: 'top bottom', end: 'top 96px', scrub: true } }); });
  }

  /* 2016 counter */
  $$('[data-count]').forEach((el) => {
    const to = +el.dataset.count, from = +el.dataset.from || 0, o = { v: from };
    el.textContent = from;
    ScrollTrigger.create({ trigger: el, start: 'top 85%', once: true, onEnter: () => gsap.to(o, { v: to, duration: 1.8, ease: 'expo.out', onUpdate: () => (el.textContent = Math.round(o.v)) }) });
  });

  /* Process pans sideways on desktop */
  gsap.matchMedia().add('(min-width: 901px)', () => {
    const track = $('#track'); if (!track) return;
    const dist = () => track.scrollWidth - document.documentElement.clientWidth;
    gsap.to(track, { x: () => -dist(), ease: 'none', scrollTrigger: { trigger: '.process', start: 'top top', end: () => '+=' + dist(), pin: true, scrub: 1, invalidateOnRefresh: true, onUpdate: (self) => gsap.set('#progress', { scaleX: self.progress }) } });
  });

  /* City strip drifts, with a pause control */
  if (mq) {
  const drift = gsap.to('#marquee', { xPercent: -50, ease: 'none', duration: 80, repeat: -1, paused: true });
  const btn = $('#mqToggle'); let paused = false; btn.hidden = false;
  ScrollTrigger.create({ trigger: '.areas', start: 'top 90%', once: true, onEnter: () => { if (!paused) drift.play(0); } });
  btn.addEventListener('click', () => { paused = !paused; paused ? drift.pause() : drift.play(); btn.setAttribute('aria-pressed', paused); btn.textContent = paused ? 'Play' : 'Pause'; });
  }

  /* Footer wordmark rises */
  gsap.from('#footMark span', { yPercent: 100, duration: 1.4, ease: 'expo.out', stagger: 0.07, scrollTrigger: { trigger: '#footMark', start: 'top 95%' } });

  addEventListener('load', () => ScrollTrigger.refresh());
  document.fonts?.ready.then(() => ScrollTrigger.refresh());
  setTimeout(() => ScrollTrigger.refresh(), 300);
}
