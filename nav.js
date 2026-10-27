document.addEventListener('DOMContentLoaded', () => {
  const nav = document.querySelector('.topnav');
  const trigger = document.querySelector('.nav-trigger');

  if (nav && trigger) {
    trigger.addEventListener('click', () => {
      const isOpen = nav.classList.toggle('nav-open');
      trigger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });
  }

  const revealEls = document.querySelectorAll('.reveal');
  if (revealEls.length) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -10% 0px' });

    revealEls.forEach((el) => observer.observe(el));
  }

  // inspiration: outer columns drift up, middle column drifts down while scrolling.
  // The middle column is built shorter so that all columns end level once the drift is complete.
  const inspGrid = document.querySelector('.insp-grid');
  if (inspGrid && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const items = Array.from(inspGrid.querySelectorAll('.insp-item'));
    let dirs = [];
    let ticking = false;
    let colCount = 0;
    const shiftFor = () => (window.innerWidth <= 900 ? 120 : 240);

    const layout = () => {
      const n = window.innerWidth <= 900 ? 2 : 3;
      const s = shiftFor();
      inspGrid.classList.add('is-cols');
      inspGrid.innerHTML = '';
      const cols = Array.from({ length: n }, () => {
        const c = document.createElement('div');
        c.className = 'insp-col';
        inspGrid.appendChild(c);
        return c;
      });
      items.forEach((el) => cols[0].appendChild(el));
      const hs = items.map((el) => el.offsetHeight + parseFloat(getComputedStyle(el).marginBottom));
      const total = hs.reduce((a, b) => a + b, 0);
      // pick the split points (items stay in order) that leave all columns level after the drift
      const pre = [0];
      hs.forEach((h, i) => pre.push(pre[i] + h));
      const ends = (sum, c) => sum + (n === 3 ? (c === 1 ? s : -s) : (c === 0 ? -s : s));
      let best = null;
      const consider = (cuts) => {
        const bounds = [0, ...cuts, items.length];
        const e = cols.map((_, c) => ends(pre[bounds[c + 1]] - pre[bounds[c]], c));
        const cost = Math.max(...e) - Math.min(...e);
        if (!best || cost < best.cost) best = { cost, bounds };
      };
      if (n === 3) {
        for (let i = 0; i <= items.length; i++) for (let j = i; j <= items.length; j++) consider([i, j]);
      } else {
        for (let i = 0; i <= items.length; i++) consider([i]);
      }
      dirs = [];
      cols.forEach((col, c) => {
        for (let i = best.bounds[c]; i < best.bounds[c + 1]; i++) {
          col.appendChild(items[i]);
          dirs[i] = n === 3 ? (c === 1 ? 1 : -1) : (c === 0 ? -1 : 1);
        }
      });
      colCount = n;
      inspGrid.style.marginBottom = `${-s}px`;
    };

    const update = () => {
      ticking = false;
      const heading = inspGrid.parentElement.querySelector('h1');
      const hb = heading.getBoundingClientRect().bottom;
      const gap = inspGrid.getBoundingClientRect().top - hb;
      const s = shiftFor();
      const range = Math.max(1, gap + inspGrid.offsetHeight - s - window.innerHeight);
      const p = Math.max(0, Math.min(1, -hb / range));
      items.forEach((el, i) => {
        el.style.translate = `0 ${(dirs[i] * p * s).toFixed(1)}px`;
      });
    };

    const request = () => {
      if (!ticking) { ticking = true; requestAnimationFrame(update); }
    };

    layout();
    update();
    window.addEventListener('scroll', request, { passive: true });
    window.addEventListener('resize', () => { layout(); request(); });
    window.addEventListener('load', () => { layout(); request(); });
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => { layout(); request(); });
  }

  const scrollHint = document.querySelector('.scroll-hint');
  if (scrollHint) {
    window.addEventListener('scroll', () => {
      scrollHint.classList.toggle('is-hidden', window.scrollY > 40);
    }, { passive: true });
  }
});
