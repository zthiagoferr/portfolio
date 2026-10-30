/* Angular portfolio: progressive visual enhancements, no external dependencies. */
(() => {
  'use strict';
  const reduce = matchMedia('(prefers-reduced-motion: reduce)');
  const fine = matchMedia('(hover: hover) and (pointer: fine)');
  const hero = document.querySelector('.hero-title-shell') || document.querySelector('.hero-title');
  if (hero) {
    hero.classList.add('pro-hero-accent');
    if (fine.matches && !reduce.matches) {
      hero.addEventListener('pointermove', event => {
        const box = hero.getBoundingClientRect();
        hero.style.setProperty('--pro-light-x',((event.clientX-box.left)/box.width*100).toFixed(1)+'%');
        hero.style.setProperty('--pro-light-y',((event.clientY-box.top)/box.height*100).toFixed(1)+'%');
      },{passive:true});
    }
  }
  const panel = document.querySelector('#contato .contact-panel');
  if(panel) panel.classList.add('pro-sweep');
  // Use only the actual technology labels already shown on each project.
  document.querySelectorAll('#projetos .projetos-grid > .card').forEach(card => {
    card.insertAdjacentHTML('beforeend','<span class="pro-data-strip" aria-hidden="true"></span>');
    const tags = [...card.querySelectorAll('.projeto-tags li')].slice(0,2).map(x=>x.textContent.trim());
    if(tags.length){
      const label=document.createElement('span');
      label.className='pro-project-tech';
      label.textContent=tags.join(' / ');
      label.setAttribute('aria-hidden','true');
      // right side of project cards is already occupied by IDs, keep marker at bottom of card
      label.style.top='auto'; label.style.bottom='7px';
      card.appendChild(label);
    }
  });
  // Keep frame work to zero on hidden tabs and for reduced motion (CSS animations already disabled).
})();
