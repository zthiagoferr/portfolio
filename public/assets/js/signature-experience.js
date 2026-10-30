/* Experiência autoral do portfólio. Efeitos isolados e sem dependências. */
(() => {
  'use strict';
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  const intro = document.getElementById('signature-intro');
  if (intro) {
    let seen = false;
    try { seen = sessionStorage.getItem('thiago-signature-seen') === '1'; sessionStorage.setItem('thiago-signature-seen','1'); } catch (_) {}
    if (reduced.matches || seen) intro.remove();
    else {
      window.setTimeout(() => { intro.classList.add('is-done'); window.setTimeout(() => intro.remove(), 750); }, 1400);
    }
  }

})();
