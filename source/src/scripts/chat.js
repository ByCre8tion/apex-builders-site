/* Concierge: ask the AI about Apex, or text Jason.
   Answers come from, in order: the site's own AI endpoint (data-ai-endpoint, Phase 3),
   Claude inside the artifact preview, or the built in answer set below. */
import { brief, local, pages } from '../data/kb';

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const store = { get(k) { try { return sessionStorage.getItem(k); } catch (e) { return null; } }, set(k, v) { try { sessionStorage.setItem(k, v); } catch (e) {} } };

const RULES = `You are the assistant on the Apex Builders website. Answer the visitor using ONLY the facts below.
Be warm, plain and brief: one to three short sentences, no headings, no lists.
When a page on this site helps, link it as [Page name](file.html), using only the page files listed below.
Never invent prices, dates, availability, warranties or anything not in the facts. If you do not know, say so and suggest texting Jason with the Text us tab or calling 602.345.1071.
If the question is not about Apex Builders, building or this website, politely steer back.
Do not use em dashes, and do not use hyphens as punctuation.

FACTS:
${brief}`;

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const okHref = (h) => /^[a-z0-9-]+\.html(#[\w-]+)?$/i.test(h) || /^tel:\+?\d+$/.test(h) || /^mailto:[^\s"]+$/.test(h);
function render(text) {
  return esc(text.trim()).split(/\n{2,}/).map((para) => '<p>' + para
    .replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (m, label, href) => okHref(href) ? `<a href="${href}">${label}</a>` : label)
    .replace(/\*\*([^*]+)\*\*/g, '<b>$1</b>')
    .replace(/\n/g, '<br>') + '</p>').join('');
}

/* Built in answers: keyword overlap, good enough until the AI endpoint is live */
const STOP = new Set('the and for you your are can how what does with that this have from about our any get much will who when where why which into just like need want'.split(' '));
const words = (s) => (s.toLowerCase().match(/[a-z0-9]+/g) || []).filter((w) => w.length > 2 && !STOP.has(w)).map((w) => w.replace(/(ing|es|s)$/, ''));
function localAnswer(q) {
  const qw = new Set(words(q));
  let best = null, score = 0;
  local.forEach((e) => { const k = new Set(words(e.k + ' ' + e.q)); let n = 0; qw.forEach((w) => { if (k.has(w)) n++; }); if (n > score) { score = n; best = e; } });
  const page = pages.find((p) => qw.has(p.label.toLowerCase().replace(/s$/, '')));
  if (best && score > 0) return best.a;
  if (page) return `That is on the [${page.label}](${page.href}) page.`;
  return 'I do not have that answer yet. Text Jason with the Text us tab, or call 602.345.1071, and he will get back to you.';
}

export function initChat() {
  const root = $('#cg'); if (!root) return;
  const panel = $('#cgPanel'), launch = $('#cgLaunch'), hello = $('#cgHello');
  const tabs = $$('[role=tab]', panel), tabBar = $('.cg-tabs', panel);
  const thread = $('#cgThread'), q = $('#cgQ'), askForm = $('#cgAskForm'), sendBtn = $('.cg-send', askForm), chips = $('#cgChips');
  const textForm = $('#cgTextForm'), done = $('#cgDone');
  const history = [];
  let sample = null, busy = false, ctl = null;

  /* Claude in the artifact preview */
  if (window.claude && window.claude.use) window.claude.use('sample').then((s) => { sample = s; }).catch(() => {});

  const isOpen = () => !panel.hidden;
  function open(tab) {
    hideHello();
    if (tab) select(tab);
    if (isOpen()) return;
    panel.hidden = false; panel.classList.remove('leaving'); panel.classList.add('in');
    root.classList.add('open'); launch.setAttribute('aria-expanded', 'true'); launch.setAttribute('aria-label', 'Close chat');
    const view = $('.cg-view:not([hidden])', panel);
    setTimeout(() => ($('textarea, input', view) || view).focus({ preventScroll: true }), reduce ? 0 : 120);
  }
  function close(focusLaunch = true) {
    if (!isOpen()) return;
    root.classList.remove('open'); launch.setAttribute('aria-expanded', 'false'); launch.removeAttribute('aria-label');
    const end = () => { panel.hidden = true; panel.classList.remove('leaving', 'in'); };
    if (reduce) end(); else { panel.classList.add('leaving'); setTimeout(end, 180); }
    if (focusLaunch) launch.focus();
  }
  launch.addEventListener('click', () => (isOpen() ? close() : open()));
  $('#cgClose').addEventListener('click', () => close());
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && isOpen() && root.contains(document.activeElement)) close(); });

  /* Greeting bubble: once per visit, after a few seconds */
  function hideHello() { hello.hidden = true; store.set('cg-hello', '1'); }
  if (!store.get('cg-hello')) setTimeout(() => { if (!isOpen()) hello.hidden = false; }, 6000);
  $('#cgHelloX').addEventListener('click', hideHello);
  $('#cgHelloOpen').addEventListener('click', () => open('ask'));

  /* Tabs with arrow keys */
  function select(which) {
    tabs.forEach((t) => {
      const on = (which === 'text') === (t.id === 'cgTabText');
      t.setAttribute('aria-selected', on); t.tabIndex = on ? 0 : -1;
      $('#' + t.getAttribute('aria-controls')).hidden = !on;
    });
    tabBar.classList.toggle('right', which === 'text');
  }
  tabs.forEach((t, i) => {
    t.addEventListener('click', () => { select(i ? 'text' : 'ask'); });
    t.addEventListener('keydown', (e) => { if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') { const n = tabs[(i + 1) % 2]; n.focus(); select(n.id === 'cgTabText' ? 'text' : 'ask'); } });
  });
  $$('[data-goto="text"]', root).forEach((b) => b.addEventListener('click', () => { select('text'); $('#cgName').focus(); }));

  /* Ask */
  const grow = () => { q.style.height = 'auto'; q.style.height = Math.min(q.scrollHeight, 120) + 'px'; };
  q.addEventListener('input', () => { grow(); sendBtn.disabled = busy || !q.value.trim(); });
  q.addEventListener('keydown', (e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); askForm.requestSubmit(); } });
  sendBtn.disabled = true;
  const scrollDown = () => { thread.scrollTop = thread.scrollHeight; };
  function bubble(cls, html) { const d = document.createElement('div'); d.className = 'cg-msg ' + cls; d.innerHTML = html; thread.appendChild(d); scrollDown(); return d; }

  async function answer(question) {
    const ep = root.dataset.aiEndpoint;
    if (ep) {
      const r = await fetch(ep, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ messages: history }) });
      if (!r.ok) throw new Error('endpoint');
      return (await r.json()).text;
    }
    if (sample) {
      const turns = history.slice(-8).map((m) => ({ ...m }));
      turns[0] = { role: 'user', content: RULES + '\n\nVisitor: ' + turns[0].content };
      if (turns[0].role !== 'user') turns.shift();
      ctl = new AbortController();
      const out = bubble('bot', '<span class="cg-dots"><i></i><i></i><i></i></span>');
      try {
        const { text } = await sample(turns, { modelTier: 'quick', cache: false, signal: ctl.signal, onText: ({ text }) => { out.innerHTML = render(text); scrollDown(); } });
        out.innerHTML = render(text); return { text, el: out };
      } catch (err) { out.remove(); if (err && err.code === 'not_granted') sample = null; throw err; }
    }
    await new Promise((r) => setTimeout(r, reduce ? 0 : 500));
    return localAnswer(question);
  }

  askForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const text = q.value.trim(); if (!text || busy) return;
    busy = true; sendBtn.disabled = true; chips.hidden = true;
    q.value = ''; grow();
    bubble('me', render(text));
    history.push({ role: 'user', content: text });
    let typing = null;
    if (!sample) typing = bubble('bot', '<span class="cg-dots" aria-label="Typing"><i></i><i></i><i></i></span>');
    let reply;
    try {
      const r = await answer(text);
      if (typeof r === 'object' && r.el) reply = r.text;
      else { reply = r; typing ? (typing.innerHTML = render(reply)) : bubble('bot', render(reply)); typing = null; }
    } catch (err) {
      reply = localAnswer(text);
      typing ? (typing.innerHTML = render(reply)) : bubble('bot', render(reply)); typing = null;
    }
    history.push({ role: 'assistant', content: reply });
    busy = false; sendBtn.disabled = !q.value.trim(); scrollDown();
  });
  $$('button', chips).forEach((c) => c.addEventListener('click', () => { q.value = c.textContent; askForm.requestSubmit(); }));

  /* Text us */
  const fields = $$('input, textarea', textForm);
  const check = (f) => {
    let ok = f.value.trim().length > 0;
    if (f.type === 'tel') ok = f.value.replace(/\D/g, '').replace(/^1/, '').length === 10;
    f.setAttribute('aria-invalid', !ok);
    const err = $('#e-' + f.id); err.textContent = ok ? '' : f.dataset.msg;
    if (ok) f.removeAttribute('aria-describedby'); else f.setAttribute('aria-describedby', err.id);
    return ok;
  };
  fields.forEach((f) => ['input', 'blur'].forEach((ev) => f.addEventListener(ev, () => { if (f.getAttribute('aria-invalid') === 'true') check(f); })));
  const phone = $('#cgPhone');
  phone.addEventListener('input', () => {
    const d = phone.value.replace(/\D/g, '').replace(/^1(?=\d{10})/, '').slice(0, 10);
    phone.value = d.length > 6 ? `(${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6)}` : d.length > 3 ? `(${d.slice(0, 3)}) ${d.slice(3)}` : d;
  });
  textForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const bad = fields.filter((f) => !check(f));
    if (bad.length) { bad[0].focus(); return; }
    const btn = $('.cg-submit', textForm); btn.disabled = true; btn.firstChild.textContent = 'Sending';
    const data = Object.fromEntries(new FormData(textForm)); data.page = location.pathname.split('/').pop() || 'index.html';
    const ep = root.dataset.smsEndpoint;
    try {
      if (ep) { const r = await fetch(ep, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) }); if (!r.ok) throw new Error('sms'); }
      else await new Promise((r) => setTimeout(r, 700)); /* Not connected yet: Phase 3 wires this to Jason's phone */
      $('#cgDoneMsg').textContent = `Thanks, ${data.name.split(' ')[0]}. Jason will text you back at ${phone.value}.`;
      textForm.hidden = true; done.hidden = false; done.focus();
    } catch (err) {
      $('#e-cgMsg').textContent = 'That did not send. Try again, or call 602.345.1071.';
    }
    btn.disabled = false; btn.firstChild.textContent = 'Send text';
  });
  $('#cgAgain').addEventListener('click', () => { textForm.reset(); fields.forEach((f) => f.removeAttribute('aria-invalid')); done.hidden = true; textForm.hidden = false; $('#cgMsg').focus(); });
}
