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