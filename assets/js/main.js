/* main.js — melhorias progressivas: menu mobile, ano do rodapé, reveal,
   scrollspy e smooth scroll. A página funciona integralmente sem este arquivo. */
(function () {
  'use strict';

  var html = document.documentElement;
  html.classList.add('js');

  var reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)');
  var reduceMotion = Boolean(reduced && reduced.matches);

  var forEach = function (list, fn) {
    Array.prototype.forEach.call(list, fn);
  };

  /* ---------- Ano no rodapé ---------- */
  var ano = document.querySelector('[data-ano]');
  if (ano) ano.textContent = String(new Date().getFullYear());

  /* ---------- Menu mobile ---------- */
  var toggle = document.querySelector('[data-menu-toggle]');
  var nav = document.querySelector('[data-nav-menu]');
  var rotulo = document.querySelector('[data-menu-label]');

  function fecharMenu() {
    if (!nav || !toggle) return;
    nav.classList.remove('is-open');
    toggle.setAttribute('aria-expanded', 'false');
    if (rotulo) rotulo.textContent = 'Menu';
  }

  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var aberto = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!aberto));
      nav.classList.toggle('is-open', !aberto);
      if (rotulo) rotulo.textContent = aberto ? 'Menu' : 'Fechar menu';
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.classList.contains('is-open')) {
        fecharMenu();
        toggle.focus();
      }
    });

    document.addEventListener('click', function (e) {
      if (nav.classList.contains('is-open') &&
          !nav.contains(e.target) && !toggle.contains(e.target)) {
        fecharMenu();
      }
    });

    nav.addEventListener('click', function (e) {
      if (e.target.closest('a')) fecharMenu();
    });
  }

  /* ---------- Smooth scroll (apenas com movimento reduzido desativado) ---------- */
  if (!reduceMotion && 'scrollBehavior' in document.documentElement.style) {
    var links = document.querySelectorAll('a[href^="#"]');
    forEach(links, function (link) {
      var alvoId = link.getAttribute('href');
      if (!alvoId || alvoId === '#') return;
      link.addEventListener('click', function (e) {
        var alvo = document.querySelector(alvoId);
        if (!alvo) return;
        e.preventDefault();
        alvo.scrollIntoView({ behavior: 'smooth', block: 'start' });
        try {
          history.replaceState(null, '', alvoId);
        } catch (err) {
          /* SecurityError no protocolo file:// — segue sem atualizar a URL */
        }
      });
    });
  }

  /* ---------- Reveal no scroll (IntersectionObserver) ---------- */
  var revelaveis = document.querySelectorAll('[data-reveal]');

  function revelarTudo() {
    forEach(revelaveis, function (el) { el.classList.add('is-visible'); });
  }

  if (revelaveis.length && !reduceMotion && 'IntersectionObserver' in window) {
    var observador = new IntersectionObserver(function (entradas) {
      forEach(entradas, function (entrada) {
        if (!entrada.isIntersecting) return;
        entrada.target.classList.add('is-visible');
        observador.unobserve(entrada.target);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -32px 0px' });
    forEach(revelaveis, function (el) { observador.observe(el); });
  } else {
    revelarTudo();
  }

  /* ---------- Scrollspy (aria-current na navegação) ---------- */
  var navLinks = document.querySelectorAll('[data-nav]');
  var alvos = [];

  forEach(navLinks, function (link) {
    var id = link.getAttribute('href');
    if (!id || id === '#') return;
    var secao = document.querySelector(id);
    if (secao) alvos.push({ secao: secao, link: link });
  });

  if (alvos.length) {
    var spy = function () {
      var pos = window.scrollY + 100;
      var atual = alvos[0].secao.id;
      forEach(alvos, function (item) {
        if (item.secao.offsetTop <= pos) atual = item.secao.id;
      });
      if (window.innerHeight + window.scrollY >= document.body.scrollHeight - 8) {
        atual = alvos[alvos.length - 1].secao.id;
      }
      forEach(alvos, function (item) {
        if (item.secao.id === atual) {
          item.link.setAttribute('aria-current', 'true');
        } else {
          item.link.removeAttribute('aria-current');
        }
      });
    };
    window.addEventListener('scroll', spy, { passive: true });
    spy();
  }
})();

/* ---------- Cursor ambiente + brilho nos cards (verbatim da referência) ---------- */
(()=>{
  const allow = window.matchMedia('(hover: hover) and (pointer: fine)').matches && !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if(!allow) return;
  const glow=document.createElement('div');glow.className='cursor-ambient';glow.setAttribute('aria-hidden','true');document.body.appendChild(glow);
  const portrait=document.querySelector('.portrait-wrap');
  const photo=portrait?.querySelector('img');
  let tx=-600,ty=-600,x=tx,y=ty,raf=0;
  const update=()=>{
    x+=(tx-x)*.16;y+=(ty-y)*.16;
    glow.style.transform=`translate3d(${x-240}px,${y-240}px,0)`;
    if(Math.abs(tx-x)>.3||Math.abs(ty-y)>.3){raf=requestAnimationFrame(update)}else{raf=0}
  };
  document.addEventListener('pointermove',e=>{
    if(e.pointerType!=='mouse' && e.pointerType!=='pen')return;
    tx=e.clientX;ty=e.clientY;glow.classList.add('is-visible');
    if(!raf)raf=requestAnimationFrame(update);
    const card=e.target.closest('.card');
    if(card){const r=card.getBoundingClientRect();card.style.setProperty('--mx',`${e.clientX-r.left}px`);card.style.setProperty('--my',`${e.clientY-r.top}px`)}
    if(portrait&&photo){const r=portrait.getBoundingClientRect();const inside=e.clientX>=r.left&&e.clientX<=r.right&&e.clientY>=r.top&&e.clientY<=r.bottom;
      photo.style.transform=inside?`scale(1.035) translate(${((e.clientX-r.left)/r.width-.5)*-8}px,${((e.clientY-r.top)/r.height-.5)*-8}px)`:'none';}
  },{passive:true});
  document.addEventListener('pointerout',e=>{if(!e.relatedTarget){glow.classList.remove('is-visible');if(photo)photo.style.transform='none'}});
  window.addEventListener('blur',()=>{glow.classList.remove('is-visible');if(photo)photo.style.transform='none'});
})();

/* FUNDO MONOCROMÁTICO — animação contínua sincronizada com mouse e rolagem.
   Canvas sem dependências, não interfere nos links nem nas animações existentes. */
(()=>{
  const canvas=document.getElementById('ambient-background');
  if(!canvas)return;
  const ctx=canvas.getContext('2d',{alpha:true});
  if(!ctx)return;
  const reduced=window.matchMedia('(prefers-reduced-motion: reduce)');
  const fine=window.matchMedia('(hover: hover) and (pointer: fine)');
  const desktop=()=>fine.matches&&!reduced.matches;
  let w=0,h=0,dpr=1,particles=[],raf=0,last=0;
  let mouse={x:-1000,y:-1000,tx:-1000,ty:-1000,active:false};
  let scroll=window.scrollY||0,scrollTarget=scroll,visible=!document.hidden;
  const random=(n)=>{const x=Math.sin(n*127.1+78.233)*43758.5453;return x-Math.floor(x)};
  const size=()=>{
    w=window.innerWidth;h=window.innerHeight;
    dpr=Math.min(window.devicePixelRatio||1,2);
    canvas.width=Math.round(w*dpr);canvas.height=Math.round(h*dpr);
    ctx.setTransform(dpr,0,0,dpr,0,0);
    const count=Math.min(75,Math.max(25,Math.round(w*h/19000)));
    particles=Array.from({length:count},(_,i)=>({
      x:random(i+7)*w,y:random(i+187)*h,
      radius:.65+random(i+39)*1.15,
      speed:.12+random(i+92)*.25,
      drift:(random(i+130)-.5)*.2,
      phase:random(i+331)*Math.PI*2
    }));
    paint(0,true);
  };
  function paint(t,still=false){
    ctx.clearRect(0,0,w,h);
    const move=!still&&!reduced.matches;
    if(move){
      mouse.x+=(mouse.tx-mouse.x)*.065;
      mouse.y+=(mouse.ty-mouse.y)*.065;
      scroll+=(scrollTarget-scroll)*.035;
    }
    const shiftX=desktop()&&mouse.active?(mouse.x-w/2)*.012:0;
    const shiftY=desktop()&&mouse.active?(mouse.y-h/2)*.012:0;
    const grid=56;
    const ox=((shiftX%grid)+grid)%grid;
    const oy=(((scroll*.055+shiftY)%grid)+grid)%grid;
    ctx.strokeStyle='rgba(255,255,255,0.037)';
    ctx.lineWidth=1;
    ctx.beginPath();
    for(let x=ox;x<w;x+=grid){ctx.moveTo(Math.round(x)+.5,0);ctx.lineTo(Math.round(x)+.5,h)}
    for(let y=oy;y<h;y+=grid){ctx.moveTo(0,Math.round(y)+.5);ctx.lineTo(w,Math.round(y)+.5)}
    ctx.stroke();
    const cx=mouse.active&&desktop()?mouse.x:w*.72;
    const cy=mouse.active&&desktop()?mouse.y:h*.3;
    const glow=ctx.createRadialGradient(cx,cy,0,cx,cy,Math.max(260,Math.min(w*.38,440)));
    glow.addColorStop(0,'rgba(255,255,255,0.052)');
    glow.addColorStop(.35,'rgba(255,255,255,0.017)');
    glow.addColorStop(1,'rgba(255,255,255,0)');
    ctx.fillStyle=glow;ctx.fillRect(0,0,w,h);
    const seconds=t*.001;
    for(const p of particles){
      const px=p.x+((move?seconds:0)*p.drift*8)+shiftX*.45;
      const py=((p.y-(move?seconds:0)*p.speed*5-scroll*.028)%h+h)%h;
      const pulse=move?.7+.3*Math.sin(seconds*.55+p.phase):.8;
      const dist=mouse.active&&desktop()?Math.hypot(px-mouse.x,py-mouse.y):9999;
      const nearby=Math.max(0,1-dist/190);
      ctx.beginPath();ctx.arc(px,py,p.radius+nearby*.65,0,Math.PI*2);
      ctx.fillStyle=`rgba(255,255,255,${(.18+.19*pulse+nearby*.28).toFixed(3)})`;
      ctx.fill();
    }
  }
  function frame(t){
    if(!visible||reduced.matches){raf=0;return}
    if(t-last>=28){paint(t);last=t}
    raf=requestAnimationFrame(frame);
  }
  function start(){
    if(raf)cancelAnimationFrame(raf);
    raf=0;
    size();
    if(!reduced.matches&&visible)raf=requestAnimationFrame(frame);
  }
  window.addEventListener('resize',start,{passive:true});
  window.addEventListener('scroll',()=>{scrollTarget=window.scrollY||0;if(reduced.matches)paint(0,true)},{passive:true});
  document.addEventListener('pointermove',e=>{if(!desktop()||e.pointerType!=='mouse')return;mouse.tx=e.clientX;mouse.ty=e.clientY;mouse.active=true},{passive:true});
  document.addEventListener('pointerout',e=>{if(!e.relatedTarget)mouse.active=false});
  window.addEventListener('blur',()=>{mouse.active=false});
  document.addEventListener('visibilitychange',()=>{visible=!document.hidden;if(visible)start();else if(raf){cancelAnimationFrame(raf);raf=0}});
  if(reduced.addEventListener)reduced.addEventListener('change',start);
  if(fine.addEventListener)fine.addEventListener('change',start);
  start();
})();
