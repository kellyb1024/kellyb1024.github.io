// Lens switch: 디자인 / PM / 브랜딩 — the page's one live thing.
(() => {
  const body = document.body;
  const buttons = [...document.querySelectorAll('[data-set-lens]')];
  const setLens = (lens, focus) => {
    body.dataset.lens = lens;
    buttons.forEach((b) => {
      const on = b.dataset.setLens === lens;
      b.setAttribute('aria-checked', on ? 'true' : 'false');
      b.tabIndex = on ? 0 : -1;
      if (on && focus) b.focus();
    });
    try { history.replaceState(null, '', '#lens-' + lens); } catch (e) {}
  };
  buttons.forEach((b, i) => {
    b.addEventListener('click', () => setLens(b.dataset.setLens));
    b.addEventListener('keydown', (e) => {
      if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
      e.preventDefault();
      const next = buttons[(i + (e.key === 'ArrowRight' ? 1 : buttons.length - 1)) % buttons.length];
      setLens(next.dataset.setLens, true);
    });
  });
  const m = location.hash.match(/^#lens-(design|pm|brand)$/);
  setLens(m ? m[1] : 'design');
})();

// Ring frames: pointing at a frame names its project under the lens switch.
(() => {
  const now = document.querySelector('.core-now');
  if (!now) return;
  let label = document.createElement('span');
  label.className = 'frame-label';
  label.hidden = true;
  now.appendChild(label);
  const show = (t) => { label.textContent = t; label.hidden = false; now.classList.add('naming'); };
  const hide = () => { label.hidden = true; now.classList.remove('naming'); };
  document.querySelectorAll('.frame').forEach((f) => {
    f.addEventListener('pointerenter', (e) => { if (e.pointerType === 'mouse') show(f.dataset.label); });
    f.addEventListener('pointerleave', hide);
    f.addEventListener('focus', () => { if (f.matches(':focus-visible')) show(f.dataset.label); });
    f.addEventListener('blur', hide);
  });
  window.addEventListener('scroll', hide, { passive: true });
  document.querySelectorAll('[data-set-lens]').forEach((b) => b.addEventListener('click', hide));
})();

// Live prototypes: the poster becomes the real app inside the phone on request.
document.querySelectorAll('.phone[data-src]').forEach((phone) => {
  const actions = phone.parentElement.querySelector('.device-actions');
  const btn = actions && actions.querySelector('.run');
  const start = () => {
    if (phone.classList.contains('live')) return;
    const frame = document.createElement('iframe');
    frame.src = phone.dataset.src;
    frame.title = phone.dataset.title || '프로토타입';
    frame.loading = 'lazy';
    frame.allow = 'camera; microphone; clipboard-write';
    phone.classList.add('live');
    phone.replaceChildren(frame);
    if (btn) btn.hidden = true;
    const link = actions && actions.querySelector('.device-link');
    if (link) link.hidden = false;
    frame.focus();
  };
  if (btn) btn.addEventListener('click', start);
  const poster = phone.querySelector('img');
  if (poster) { poster.style.cursor = 'pointer'; poster.addEventListener('click', start); }
});

// Seoul clock in the footer.
(() => {
  const el = document.querySelector('[data-clock]');
  if (!el) return;
  const fmt = new Intl.DateTimeFormat('ko-KR', { timeZone: 'Asia/Seoul', hour: '2-digit', minute: '2-digit', hour12: false });
  const tick = () => { el.textContent = fmt.format(new Date()) + ' KST'; };
  tick();
  setInterval(tick, 30000);
})();

// Videos: show the fixed thumbnail again when a video ends.
document.querySelectorAll('video[poster]').forEach((v) => {
  v.addEventListener('ended', () => { v.load(); });
});
