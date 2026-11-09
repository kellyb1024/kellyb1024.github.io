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

// Signature: the paper plane is drawn from its left tail as the contact section scrolls in.
(() => {
  const cv = document.querySelector('canvas.sig-fly');
  if (!cv) return;
  const img = new Image();
  img.onload = () => {
    const w = img.naturalWidth, h = img.naturalHeight;
    cv.width = w; cv.height = h;
    const ctx = cv.getContext('2d', { willReadFrequently: true });
    ctx.drawImage(img, 0, 0);
    const src = ctx.getImageData(0, 0, w, h).data;
    ctx.clearRect(0, 0, w, h);
    const idx = [];
    for (let i = 0; i < w * h; i++) if (src[i * 4 + 3]) idx.push(i);
    const dv = new Uint16Array(w * h);
    for (const i of idx) dv[i] = (src[i * 4] << 8) | src[i * 4 + 1];
    idx.sort((a, b) => dv[a] - dv[b]);
    const out = ctx.createImageData(w, h), o = out.data;
    const rgb = (getComputedStyle(cv).color.match(/\d+/g) || [0, 47, 167]).map(Number);
    let drawn = 0;
    const upto = (lim) => { let lo = 0, hi = idx.length; while (lo < hi) { const m = (lo + hi) >> 1; if (dv[idx[m]] <= lim) lo = m + 1; else hi = m; } return lo; };
    const paint = (p) => {
      const target = upto(Math.round(p * 65535));
      if (target === drawn) return;
      if (target > drawn) for (let k = drawn; k < target; k++) { const i = idx[k] * 4; o[i] = rgb[0]; o[i + 1] = rgb[1]; o[i + 2] = rgb[2]; o[i + 3] = src[i + 3]; }
      else for (let k = target; k < drawn; k++) o[idx[k] * 4 + 3] = 0;
      drawn = target;
      ctx.putImageData(out, 0, 0);
    };
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) { paint(1); return; }
    let queued = false;
    const update = () => {
      queued = false;
      const vh = innerHeight, top = cv.getBoundingClientRect().top + scrollY;
      const maxY = document.documentElement.scrollHeight - vh;
      const start = top - vh * 0.95, end = Math.max(start + 1, Math.min(top - vh * 0.4, maxY - 2));
      const p = Math.min(1, Math.max(0, (scrollY - start) / (end - start)));
      paint(p);
    };
    addEventListener('scroll', () => { if (!queued) { queued = true; requestAnimationFrame(update); } }, { passive: true });
    addEventListener('resize', update);
    update();
  };
  img.src = cv.dataset.src;
})();
