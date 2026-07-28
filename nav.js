document.addEventListener('DOMContentLoaded', () => {
  const nav = document.querySelector('.topnav');
  const trigger = document.querySelector('.nav-trigger');
  if (!nav || !trigger) return;

  trigger.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('nav-open');
    trigger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  });
});
