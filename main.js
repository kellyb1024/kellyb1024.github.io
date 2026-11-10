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

// Live prototypes: the poster becomes the real app inside the phone.
// Desktop: turns on by itself when the phone scrolls into view. Phone screens: tap to start.
(() => {
  let lastInput = 0;
  ['wheel', 'touchmove', 'keydown', 'pointerdown'].forEach((ev) => addEventListener(ev, () => { lastInput = Date.now(); }, { passive: true, capture: true }));
  const guardScroll = () => {
    // A prototype loading inside the page must not move the page on its own.
    const y0 = window.scrollY, until = Date.now() + 2000;
    const onScroll = () => {
      if (Date.now() > until) { removeEventListener('scroll', onScroll); return; }
      if (Date.now() - lastInput > 400 && Math.abs(window.scrollY - y0) > 40) window.scrollTo(window.scrollX, y0);
    };
    addEventListener('scroll', onScroll, { passive: true });
  };
  const desktop = matchMedia('(min-width: 761px)');
  document.querySelectorAll('.phone[data-src]').forEach((phone) => {
    const actions = phone.parentElement.querySelector('.device-actions');
    const btn = actions && actions.querySelector('.run');
    const poster = phone.querySelector('img');
    const start = (byUser) => {
      if (phone.classList.contains('live')) return;
      // Keep the phone's size fixed while the app loads, so the bezel never jumps.
      const r = phone.getBoundingClientRect();
      phone.style.width = r.width + 'px'; phone.style.height = r.height + 'px';
      const frame = document.createElement('iframe');
      frame.src = phone.dataset.src;
      frame.title = phone.dataset.title || '프로토타입';
      frame.allow = 'camera; microphone; clipboard-write';
      frame.style.opacity = '0';
      frame.addEventListener('load', () => {
        try {
          const w = frame.contentWindow;
          const P = w.HTMLElement.prototype, E = w.Element.prototype;
          const focus0 = P.focus, siv0 = E.scrollIntoView;
          P.focus = function (o) { return focus0.call(this, Object.assign({}, o, { preventScroll: true })); };
          E.scrollIntoView = function (arg) {
            const x = window.scrollX, y = window.scrollY;
            const opt = typeof arg === 'object' && arg ? Object.assign({}, arg, { behavior: 'auto' }) : arg;
            siv0.call(this, opt);
            window.scrollTo(x, y);
          };
        } catch (e) { /* cross-origin: guarded by guardScroll instead */ }
        const reveal = () => {
          frame.style.transition = 'opacity 200ms ease';
          frame.style.opacity = '1';
          if (poster) setTimeout(() => poster.remove(), 220);
        };
        // Bundled prototypes unpack after load; keep the poster up until the app has drawn.
        let tries = 0;
        const wait = () => {
          let busy = false;
          try { busy = !!frame.contentDocument.getElementById('__bundler_thumbnail'); } catch (e) { busy = false; }
          if (busy && tries++ < 60) setTimeout(wait, 100); else setTimeout(reveal, busy ? 0 : 150);
        };
        wait();
      });
      phone.classList.add('live');
      phone.appendChild(frame);
      guardScroll();
      if (btn) btn.hidden = true;
      const link = actions && actions.querySelector('.device-link');
      if (link) link.hidden = false;
      if (byUser) frame.focus({ preventScroll: true });
    };
    if (btn) btn.addEventListener('click', () => start(true));
    if (poster) { poster.style.cursor = 'pointer'; poster.addEventListener('click', () => start(true)); }
    if ('IntersectionObserver' in window) {
      const io = new IntersectionObserver((entries) => {
        entries.forEach((e) => { if (e.isIntersecting && desktop.matches) { start(false); io.disconnect(); } });
      }, { threshold: 0.6 });
      io.observe(phone);
    }
  });
})();

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
