// js/main.js
document.addEventListener('DOMContentLoaded', function () {
  // Mobile menu toggle
  const mobileBtn = document.getElementById('mobileMenuButton');
  const mobileMenu = document.getElementById('mobileMenu');
  const iconOpen = document.getElementById('icon-open');
  const iconClose = document.getElementById('icon-close');

  if (mobileBtn) {
    mobileBtn.addEventListener('click', () => {
      const isHidden = mobileMenu.classList.toggle('hidden');
      // aria-expanded should reflect whether the menu is open (true when not hidden)
      mobileBtn.setAttribute('aria-expanded', String(!isHidden));
      if (iconOpen) iconOpen.classList.toggle('hidden');
      if (iconClose) iconClose.classList.toggle('hidden');
    });
  }

  // Close mobile menu when a link or login button inside it is clicked
  if (mobileMenu) {
    mobileMenu.addEventListener('click', (e) => {
      // if clicked element is an anchor or the login button, close the menu
      if (e.target.closest('a') || e.target.closest('#mobileLoginBtn')) {
        if (!mobileMenu.classList.contains('hidden')) {
          mobileMenu.classList.add('hidden');
          if (mobileBtn) mobileBtn.setAttribute('aria-expanded', 'false');
          if (iconOpen) iconOpen.classList.remove('hidden');
          if (iconClose) iconClose.classList.add('hidden');
        }
      }
    });
  }

  // Fill current year (only if element exists)
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Students carousel arrows logic (if the track exists)
  (function () {
    const prev = document.getElementById('students-prev');
    const next = document.getElementById('students-next');
    const track = document.getElementById('students-track');

    if (!track) return;

    function scrollByPage(direction = 1) {
      const gap = parseFloat(getComputedStyle(track).gap) || 24;
      const card = track.querySelector('article');
      if (!card) return;
      const cardWidth = card.getBoundingClientRect().width + gap;
      const visibleCards = Math.max(1, Math.floor(track.getBoundingClientRect().width / cardWidth));
      const amount = cardWidth * visibleCards;
      track.scrollBy({ left: direction * amount, behavior: 'smooth' });
    }

    prev?.addEventListener('click', () => scrollByPage(-1));
    next?.addEventListener('click', () => scrollByPage(1));

    // Hide arrows when at start/end
    function updateArrows() {
      const atStart = track.scrollLeft <= 5;
      const atEnd = track.scrollWidth - Math.ceil(track.clientWidth + track.scrollLeft) <= 5;
      if (prev) prev.style.visibility = atStart ? 'hidden' : 'visible';
      if (next) next.style.visibility = atEnd ? 'hidden' : 'visible';
    }
    track.addEventListener('scroll', updateArrows);
    window.addEventListener('resize', updateArrows);
    updateArrows();
  })();
});
