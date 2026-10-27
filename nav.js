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

  // inspiration: outer columns drift up, middle column drifts down while scrolling
  const inspGrid = document.querySelector('.insp-grid');
  if (inspGrid && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const items = Array.from(inspGrid.querySelectorAll('.insp-item'));
    let dirs = [];
    let ticking = false;

    const measure = () => {
      const lefts = [...new Set(items.map((el) => el.offsetLeft))].sort((a, b) => a - b);
      const mid = (lefts.length - 1) / 2;
      dirs = items.map((el) => {
        const i = lefts.indexOf(el.offsetLeft);
        if (lefts.length === 3) return i === 1 ? 1 : -1;
        return i < mid ? -1 : 1;
      });
    };

    const update = () => {
      ticking = false;
      const heading = inspGrid.parentElement.querySelector('h1');
      const hb = heading.getBoundingClientRect().bottom;
      const gap = inspGrid.getBoundingClientRect().top - hb;
      const range = Math.max(1, gap + inspGrid.offsetHeight - window.innerHeight);
      const p = Math.max(0, Math.min(1, -hb / range));
      items.forEach((el, i) => {
        el.style.translate = `0 ${(dirs[i] * p * 100).toFixed(1)}px`;
      });
    };

    const request = () => {
      if (!ticking) { ticking = true; requestAnimationFrame(update); }
    };

    measure();
    update();
    window.addEventListener('scroll', request, { passive: true });
    window.addEventListener('resize', () => { measure(); request(); });
    window.addEventListener('load', () => { measure(); request(); });
  }

  const scrollHint = document.querySelector('.scroll-hint');
  if (scrollHint) {
    window.addEventListener('scroll', () => {
      scrollHint.classList.toggle('is-hidden', window.scrollY > 40);
    }, { passive: true });
  }
});
