/* In place editor for the Claude artifact: text marked data-edit, photos and video in data-slot frames, saved to content.json */
import { initVideos } from './interactions.js';

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

function clean(node) {
  let out = '';
  node.childNodes.forEach((n) => {
    if (n.nodeType === 3) out += esc(n.textContent);
    else if (n.nodeType === 1) {
      const t = n.tagName;
      if (t === 'BR') out += '<br>';
      else if (t === 'EM') out += '<em>' + clean(n) + '</em>';
      else if (t === 'SPAN' && n.classList.contains('hl')) out += '<span class="hl">' + clean(n) + '</span>';
      else if (t === 'DIV' || t === 'P') out += (out ? '<br>' : '') + clean(n);
      else out += clean(n);
    }
  });
  return out;
}

const texts = () => $$('[data-edit]');
const slots = () => $$('.ph[data-slot]');
let state = { text: {}, media: {} };
let loaded = { text: {}, media: {} };
const orig = {};

function renderMedia(slot, m) {
  const pm = $('.ph-media', slot);
  $('.ph-asset', slot)?.remove(); $('.vid-toggle', slot)?.remove();
  slot.classList.toggle('has-media', !!m);
  if (!m) return;
  const video = m.kind === 'video';
  const el = document.createElement(video ? 'video' : 'img');
  el.className = 'ph-asset'; el.src = m.file ? m.file : '/_blob/' + m.id;
  if (video) { el.muted = true; el.loop = true; el.playsInline = true; el.setAttribute('playsinline', ''); el.preload = 'metadata'; }
  else { el.alt = slot.dataset.alt || ''; el.decoding = 'async'; }
  pm.appendChild(el);
  if (video) initVideos(slot.parentElement);
}

export function applyContent(c) {
  loaded = { text: { ...(c.text || {}) }, media: { ...(c.media || {}) } };
  texts().forEach((el) => { orig[el.dataset.edit] = clean(el); });
  Object.entries(c.text || {}).forEach(([k, h]) => { const el = $(`[data-edit="${k}"]`); if (el && typeof h === 'string') { el.innerHTML = h; state.text[k] = h; } });
  Object.entries(c.media || {}).forEach(([k, m]) => {
    const key = m.slot || k, slot = $(`.ph[data-slot="${key}"]`); if (!slot) return;
    state.media[key] = { id: m.id, kind: m.kind, slot: key, ...(m.file ? { file: m.file } : {}) };
    const cur = $('.ph-asset', slot);
    const want = m.file ? m.file : '/_blob/' + m.id;
    if (!cur || !cur.getAttribute('src') || !cur.getAttribute('src').endsWith(want.replace(/^\//, ''))) renderMedia(slot, state.media[key]);
  });
}

export async function loadContent() {
  try {
    const ctl = new AbortController(), tm = setTimeout(() => ctl.abort(), 2500);
    const r = await fetch('content.json', { signal: ctl.signal, cache: 'no-store' });
    clearTimeout(tm);
    if (r.ok) return await r.json();
  } catch (e) {}
  return {};
}

export async function initEditor() {
  if (!window.claude || !window.claude.use) return;
  const art = await window.claude.use('artifact'); if (!art) return;
  const user = await window.claude.use('user');
  if (user && typeof user.canEdit === 'function') { const ok = await user.canEdit(); if (ok === false) return; }
  const assets = await window.claude.use('assets');

  const bar = document.createElement('div'); bar.className = 'edbar';
  bar.innerHTML = '<span class="ed-status" aria-live="polite"></span><button type="button" class="ed-btn">Edit page</button><button type="button" class="ed-btn primary" disabled>Save</button>';
  document.body.appendChild(bar);
  const [status, toggle, saveBtn] = [$('.ed-status', bar), ...$$('button', bar)];
  let editing = false, dirty = false, saving = false;
  const say = (t) => { status.textContent = t; };
  const markDirty = () => { dirty = true; saveBtn.disabled = false; say('Unsaved changes'); };
  say(assets ? 'You can edit this page.' : 'You can edit text. Photo uploads are not available in this view.');

  function addUploaders() {
    slots().forEach((slot) => {
      if (slot.dataset.up) return; slot.dataset.up = '1';
      const key = slot.dataset.slot, kind = slot.dataset.kind === 'video' ? 'video' : 'image';
      const box = document.createElement('div'); box.className = 'ph-up';
      const input = document.createElement('input'); input.type = 'file'; input.hidden = true; input.accept = 'image/*,video/*';
      const add = document.createElement('button'); add.type = 'button';
      const rm = document.createElement('button'); rm.type = 'button'; rm.textContent = 'Remove'; rm.className = 'rm';
      const label = () => { add.textContent = (slot.classList.contains('has-media') ? 'Replace ' : 'Add ') + kind; rm.hidden = !slot.classList.contains('has-media'); };
      label();
      add.addEventListener('click', (e) => { e.stopPropagation(); input.click(); });
      rm.addEventListener('click', (e) => { e.stopPropagation(); state.media[key] = null; renderMedia(slot, null); label(); markDirty(); });
      input.addEventListener('change', () => { const f = input.files[0]; input.value = ''; if (f) upload(f); });
      slot.addEventListener('dragover', (e) => { if (!editing) return; e.preventDefault(); slot.classList.add('drop'); });
      slot.addEventListener('dragleave', () => slot.classList.remove('drop'));
      slot.addEventListener('drop', (e) => { if (!editing) return; e.preventDefault(); slot.classList.remove('drop'); const f = [...e.dataTransfer.files].find((x) => /^(image|video)\//.test(x.type)); if (f) upload(f); else say('Drop a JPG, PNG, WebP, MP4 or WebM file.'); });
      async function upload(f) {
        say('Uploading ' + f.name + '…'); slot.classList.add('busy');
        try {
          const r = await assets.upload(f);
          state.media[key] = { id: r.id, kind: r.contentType.startsWith('video') ? 'video' : 'image', slot: key };
          renderMedia(slot, state.media[key]); label(); markDirty(); say('Added. Press Save to keep it.');
        } catch (err) {
          const c = err && err.code;
          say(c === 'too_large' ? 'That file is over 20 MB. Compress it and try again.' : c === 'unsupported_type' ? 'That file type is not supported. Use JPG, PNG, WebP, MP4 or WebM.' : c === 'rate_limited' ? 'Too many uploads at once. Wait a moment and try again.' : 'Upload failed. Try again.');
        }
        slot.classList.remove('busy');
      }
      box.append(add, rm, input);
      if (slot.classList.contains('sig-ph')) slot.parentElement.appendChild(box); else slot.appendChild(box);
    });
  }

  function setEditing(on) {
    editing = on;
    document.body.classList.toggle('editing', on);
    toggle.textContent = on ? 'Done' : 'Edit page';
    if (on) {
      const st = $('#statement');
      if (window.__stTween) { window.__stTween.scrollTrigger?.kill(); window.__stTween.kill(); window.__stTween = null; }
      if (st.dataset.src && $('.w', st)) st.innerHTML = state.text.statement ?? st.dataset.src;
      if (assets) addUploaders();
      say(dirty ? 'Unsaved changes' : 'Click any text to edit it. Use the buttons on each frame for photos and video.');
    } else say(dirty ? 'Unsaved changes' : 'Saved');
    texts().forEach((el) => (on ? el.setAttribute('contenteditable', 'true') : el.removeAttribute('contenteditable')));
  }

  async function save() {
    if (saving) return; saving = true; saveBtn.disabled = true; say('Saving…');
    /* Start from everything saved on every page, then apply this page's changes */
    const out = { text: { ...loaded.text }, media: { ...loaded.media } };
    texts().forEach((el) => { const k = el.dataset.edit, h = clean(el); if (h !== orig[k]) out.text[k] = h; else delete out.text[k]; });
    Object.entries(state.media).forEach(([k, m]) => { if (m) out.media[k] = m; else delete out.media[k]; });
    try { await art.publish({ 'content.json': JSON.stringify(out, null, 1) }); loaded = out; dirty = false; say('Saved'); }
    catch (err) {
      const c = err && err.code; saveBtn.disabled = false;
      say(c === 'conflict' ? 'Someone saved a newer version. Loading it now.' : c === 'not_writer' || c === 'not_granted' ? 'You can view this page but not save changes to it.' : c === 'rate_limited' ? 'Saving too often. Wait a few seconds and press Save again.' : 'Save failed. Press Save to try again.');
    }
    saving = false;
  }

  document.addEventListener('input', (e) => { if (editing && e.target.closest('[contenteditable]')) markDirty(); });
  document.addEventListener('paste', (e) => { if (!editing || !e.target.closest?.('[contenteditable]')) return; e.preventDefault(); document.execCommand('insertText', false, e.clipboardData.getData('text/plain')); });
  document.addEventListener('keydown', (e) => {
    if (!editing) return;
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 's') { e.preventDefault(); if (dirty) save(); return; }
    const el = e.target.closest?.('[contenteditable]');
    if (el && e.key === 'Enter' && !e.shiftKey && !/^(P|Q)$/.test(el.tagName) && el.id !== 'statement') { e.preventDefault(); el.blur(); }
  });
  document.addEventListener('click', (e) => { if (!editing) return; const a = e.target.closest('a[href], button[type="submit"]'); if (a && !a.closest('.edbar')) { e.preventDefault(); e.stopPropagation(); } }, true);
  addEventListener('beforeunload', (e) => { if (dirty) { e.preventDefault(); e.returnValue = ''; } });
  toggle.addEventListener('click', () => setEditing(!editing));
  saveBtn.addEventListener('click', save);
}
