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

  const expBody = document.querySelector('.experience-body');
  const expContent = document.querySelector('.exp-content');
  if (expBody && expContent) {
    const setGap = () => {
      expBody.style.setProperty('--exp-gap', `${expContent.offsetHeight}px`);
    };
    setGap();
    window.addEventListener('resize', setGap);
  }

  const scrollHint = document.querySelector('.scroll-hint');
  if (scrollHint) {
    window.addEventListener('scroll', () => {
      scrollHint.classList.toggle('is-hidden', window.scrollY > 40);
    }, { passive: true });
  }

  const wordmark = document.querySelector('.home-wordmark');
  const homeMain = document.querySelector('.home-main');
  if (wordmark && homeMain) {
    const setWordmarkGap = () => {
      if (window.innerWidth > 600) {
        homeMain.style.removeProperty('padding-bottom');
        return;
      }
      const mobileScale = 1.3;
      const naturalHeight = wordmark.offsetHeight;
      homeMain.style.setProperty('padding-bottom', `${naturalHeight * (mobileScale - 1)}px`);
    };
    setWordmarkGap();
    window.addEventListener('resize', setWordmarkGap);
  }
});
