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
      var header = document.querySelector('.site-header');
      var headerHeight = header ? header.offsetHeight : 0;
      var pos = window.scrollY + headerHeight + Math.min(window.innerHeight * .20, 180);
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
    var headerElement = document.querySelector('.site-header');
    var onScrollHeader = function () {
      if (headerElement) headerElement.classList.toggle('is-scrolled', window.scrollY > 12);
      spy();
    };
    window.addEventListener('scroll', onScrollHeader, { passive: true });
    window.addEventListener('resize', onScrollHeader, { passive: true });
    onScrollHeader();
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
    ctx.strokeStyle='rgba(255,255,255,0.028)';
    ctx.lineWidth=1;
    ctx.beginPath();
    for(let x=ox;x<w;x+=grid){ctx.moveTo(Math.round(x)+.5,0);ctx.lineTo(Math.round(x)+.5,h)}
    for(let y=oy;y<h;y+=grid){ctx.moveTo(0,Math.round(y)+.5);ctx.lineTo(w,Math.round(y)+.5)}
    ctx.stroke();
    const cx=mouse.active&&desktop()?mouse.x:w*.72;
    const cy=mouse.active&&desktop()?mouse.y:h*.3;
    const glow=ctx.createRadialGradient(cx,cy,0,cx,cy,Math.max(260,Math.min(w*.38,440)));
    glow.addColorStop(0,'rgba(255,255,255,0.038)');
    glow.addColorStop(.35,'rgba(255,255,255,0.011)');
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
      ctx.fillStyle=`rgba(255,255,255,${(.14+.15*pulse+nearby*.24).toFixed(3)})`;
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


/* Microinterações das seções e formulário — sem dependências */
(()=>{
  'use strict';
  const motion=window.matchMedia('(prefers-reduced-motion: reduce)');
  const fine=window.matchMedia('(hover: hover) and (pointer: fine)');
  let raf=0;
  const items=[...document.querySelectorAll('.card,.contact-panel')];
  document.addEventListener('pointermove',e=>{
    if(!fine.matches||motion.matches||e.pointerType!=='mouse')return;
    if(raf)return;
    raf=requestAnimationFrame(()=>{
      raf=0;
      const node=e.target.closest('.card,.contact-panel');
      if(!node)return;
      const r=node.getBoundingClientRect();
      node.style.setProperty('--mx',(e.clientX-r.left)+'px');
      node.style.setProperty('--my',(e.clientY-r.top)+'px');
    });
  },{passive:true});
  const form=document.getElementById('portfolio-contact-form');
  if(!form)return;
  const feedback=form.querySelector('.contact-feedback');
  const button=form.querySelector('button[type=submit]');
  // Configurar uma chave própria em https://web3forms.com/ antes de habilitar entrega direta.
  const WEB3FORMS_ACCESS_KEY=window.PORTFOLIO_CONFIG?.web3formsAccessKey?.trim()||'';
  form.addEventListener('submit',async e=>{
    e.preventDefault();
    if(!form.reportValidity())return;
    if(form.elements.botcheck.value)return;
    const name=form.elements.name.value.trim();
    const email=form.elements.email.value.trim();
    const message=form.elements.message.value.trim();
    if(!name||!email||message.length<10){feedback.textContent='Confira os campos e tente novamente.';return}
    if(!WEB3FORMS_ACCESS_KEY){
      const subject=encodeURIComponent('Contato pelo portfólio — '+name);
      const body=encodeURIComponent('Nome: '+name+'\nE-mail: '+email+'\n\n'+message);
      feedback.textContent='Abrindo seu aplicativo de e-mail. Confirme o envio por lá.';
      window.location.href='mailto:thia80.ferreira@gmail.com?subject='+subject+'&body='+body;
      return;
    }
    button.disabled=true;feedback.textContent='Enviando mensagem…';
    try{
      const response=await fetch('https://api.web3forms.com/submit',{
        method:'POST',headers:{'Content-Type':'application/json'},
        body:JSON.stringify({access_key:WEB3FORMS_ACCESS_KEY,subject:'Contato pelo portfólio',from_name:name,name,email,message,botcheck:''})
      });
      const result=await response.json();
      if(!response.ok||!result.success)throw new Error('Falha no envio');
      feedback.textContent='Mensagem enviada com sucesso!';form.reset();
    }catch(error){feedback.textContent='Não foi possível enviar. Use o e-mail de contato indicado ao lado.'}
    finally{button.disabled=false}
  });
})();

/* PT/EN — preserva o texto original em português */
(()=>{
'use strict';
const dictionary={"Pular para o conteúdo":"Skip to content","Início":"Home","Sobre":"About","Competências":"Skills","Agentes de IA":"AI Agents","Cursos":"Courses","Projetos":"Projects","Contato":"Contact","Desenvolvimento · Python · Agentes de IA":"Development · Python · AI Agents","Projetos reais com":"Real-world projects with","e":"and","Conhecimento prático em Python, automações e integração de tecnologias — com foco crescente em configuração e desenvolvimento de agentes de Inteligência Artificial, arquitetura multiagente, Skills e MCP.":"Hands-on experience with Python, automation, and technology integration — with a growing focus on configuring and developing AI agents, multi-agent architectures, Skills, and MCP.","Arquitetura multiagente":"Multi-agent architecture","Automações":"Automation","Conhecer meus projetos":"Explore my projects","Entrar em contato":"Get in touch","PORTFÓLIO / 2026":"PORTFOLIO / 2026","PYTHON • IA • AUTOMAÇÕES":"PYTHON • AI • AUTOMATION","DESENVOLVEDOR PYTHON":"PYTHON DEVELOPER","Olá, meu nome é Thiago Ferreira de Oliveira, tenho 20 anos e atualmente sou desenvolvedor Python júnior. Estou estudando e aprimorando meus conhecimentos em Python há um ano. Gostei muito do que aprendi e venho desenvolvendo minhas ideias e aperfeiçoando minhas habilidades cada vez mais.":"Hello, my name is Thiago Ferreira de Oliveira. I am 20 years old and currently a Junior Python Developer. I have been studying and improving my Python skills for a year. I enjoy what I have learned and keep developing my ideas and strengthening my abilities.","Desenvolvo projetos com foco em":"I develop projects focused on","automação":"automation","agentes de IA":"AI agents",". Tenho trabalhado com arquitetura multiagente, Skills, MCP e integrações entre serviços, além de aplicações que combinam backend, interfaces web e serviços externos. Busco transformar esses conhecimentos em soluções práticas, organizadas e testáveis.":". I have worked with multi-agent architectures, Skills, MCP, and service integrations, as well as applications combining backends, web interfaces, and external services. My goal is to turn this knowledge into practical, well-organized, and testable solutions.","Conhecimento prático organizado em quatro pilares: backend e APIs, agentes de IA e automação, frontend e interfaces, e DevOps e ferramentas.":"Practical knowledge across four areas: backend and APIs, AI agents and automation, frontend and interfaces, and DevOps and tools.","FastAPI e aiohttp":"FastAPI and aiohttp","APIs REST e integrações":"REST APIs and integrations","Programação assíncrona":"Asynchronous programming","PostgreSQL, SQLite e SQLAlchemy":"PostgreSQL, SQLite and SQLAlchemy","Migrações com Alembic":"Alembic migrations","Agentes de IA & Automação":"AI Agents & Automation","Configuração e desenvolvimento de agentes de IA":"AI agent configuration and development","Agentes especializados e Agente Orquestrador":"Specialized agents and an orchestrator agent","Criação e configuração de Skills":"Creating and configuring Skills","Automação e integração de tecnologias":"Automation and technology integration","Frontend & Interfaces":"Frontend & Interfaces","React e TypeScript":"React and TypeScript","HTML, CSS e JavaScript":"HTML, CSS and JavaScript","Interfaces responsivas":"Responsive interfaces","DevOps & Ferramentas":"DevOps & Tools","Git, GitHub e GitLab":"Git, GitHub and GitLab","GitHub Actions e GitLab CI":"GitHub Actions and GitLab CI","Testes automatizados com pytest":"Automated testing with pytest","— fundamentos e lógica de programação aplicada":"— fundamentals and applied programming logic","Conheço a criação e a configuração de ambientes com agentes especializados. Cada agente tem um papel bem definido e ações coordenadas por um Orquestrador:":"I am familiar with building and configuring environments with specialized agents. Each agent has a clear role, with actions coordinated by an Orchestrator:","Orquestrador":"Orchestrator","Coordena os agentes especializados e consolida os resultados.":"Coordinates specialized agents and consolidates their results.","Analista":"Analyst","Trabalha requisitos, regras, ambiguidades e critérios de aceite.":"Handles requirements, rules, ambiguities, and acceptance criteria.","Arquiteto":"Architect","Define a arquitetura e a estratégia técnica.":"Defines the architecture and technical strategy.","Engenheiro":"Engineer","Implementa código, testes e correções.":"Implements code, tests, and fixes.","Revisor":"Reviewer","Realiza revisão independente dos resultados.":"Independently reviews the results.","Pesquisador":"Researcher","Consulta documentação e fontes externas quando necessário.":"Consults documentation and external sources when needed.","Destaques do meu conhecimento":"Knowledge highlights","Skills especializadas para agentes":"Specialized agent Skills","Permissões e isolamento de responsabilidades":"Permissions and separation of responsibilities","MCPs (Model Context Protocol)":"MCPs (Model Context Protocol)","Integração de ferramentas":"Tool integration","Workflows multiagente":"Multi-agent workflows","Validação e revisão de resultados":"Result validation and review","Certificações e Formação":"Certifications & Education","Certificados concluídos":"Completed certificates","Concluída":"Completed","Lógica de Programação com Arduino":"Programming Logic with Arduino","Instituição":"Institution","Carga horária":"Duration","Período":"Dates","32 horas":"32 hours","30 horas":"30 hours","60 horas":"60 hours","Validar certificado no site do SENAI":"Verify certificate on SENAI website","Fundamentos do Python 1":"Python Fundamentals 1","Programação em Python":"Python Programming","Em andamento":"In progress","Inteligências Artificiais Generativas Aplicadas à Programação - ChatGPT":"Generative Artificial Intelligence Applied to Programming - ChatGPT","Projetos reais com código-fonte disponível nos repositórios do GitHub.":"Real-world projects with source code available on GitHub.","Projeto principal":"Featured project","Plataforma de análise de código com inteligência artificial, desenvolvida com Python e FastAPI. Permite analisar código e carregar repositórios públicos do GitHub, além de oferecer autenticação com Firebase e histórico individual de análises.":"AI-powered code analysis platform built with Python and FastAPI. It can analyze code and load public GitHub repositories, with Firebase authentication and a personal analysis history.","Aplicação":"Live application","Repositório":"Repository","Casa do Pastel Judá — Bot de Pedidos":"Casa do Pastel Judá — Ordering Bot","Bot de pedidos via Telegram com cardápio, carrinho persistente, Pix, Mercado Pago, entrega por CEP e painel administrativo. Backend Python com aiohttp, PostgreSQL e Alembic, além de suíte automatizada com 89 testes.":"Telegram ordering bot featuring a menu, persistent shopping cart, Pix, Mercado Pago, ZIP-code-based delivery, and an admin panel. Python backend with aiohttp, PostgreSQL, and Alembic, plus an automated suite of 89 tests.","Repositório no GitHub":"GitHub repository","API REST para encurtamento de URLs, com códigos seguros de 6 caracteres, redirecionamento HTTP 301 e rastreamento de cliques. Desenvolvida com FastAPI, SQLAlchemy assíncrono e SQLite, com Alembic, Docker e testes automatizados.":"REST API for shortening URLs, with secure six-character codes, HTTP 301 redirects, and click tracking. Built with FastAPI, asynchronous SQLAlchemy, and SQLite, with Alembic, Docker, and automated tests.","Plataforma full-stack para criação e gerenciamento de portfólios, com autenticação JWT, CRUD de projetos, skills e experiências e página pública por usuário. Backend FastAPI/SQLAlchemy e frontend React/TypeScript/Tailwind, com Docker e CI pelo GitHub Actions.":"Full-stack platform for creating and managing portfolios, with JWT authentication, CRUD for projects, skills, and experience, and a public page per user. FastAPI/SQLAlchemy backend and React/TypeScript/Tailwind frontend, with Docker and GitHub Actions CI.","Fale comigo pelos canais abaixo. Nesta versão não há formulário de envio.":"Contact me through the channels below. This version does not include a contact form.","E-mail":"Email","Thiago Ferreira de Oliveira · Feito com HTML, CSS e JavaScript — sem dependências externas.":"Thiago Ferreira de Oliveira · Built with HTML, CSS, and JavaScript — no external dependencies.","Página preparada para GitHub Pages e GitLab Pages.":"Page ready for GitHub Pages and GitLab Pages.","07/03/2026 a 28/03/2026":"Mar 7, 2026 to Mar 28, 2026","11/03/2026 a 15/04/2026":"Mar 11, 2026 to Apr 15, 2026","16/04/2026 a 18/06/2026":"Apr 16, 2026 to Jun 18, 2026","Portfólio":"Portfolio","Menu":"Menu","Conhecer agentes de IA":"Explore AI agents","Cursos e Certificações":"Courses and certifications","Tem um projeto ou uma oportunidade? Entre em contato pelos canais abaixo ou use o formulário.":"Have a project or an opportunity? Reach out through the channels below or use the form.","Fale comigo pelos canais abaixo. Agora você também pode enviar uma mensagem pelo formulário.":"Get in touch through the channels below. You can also send a message using the form.","// VAMOS CONVERSAR":"// LET’S TALK","Tem uma ideia?":"Have an idea?","Vamos criar.":"Let's build it.","Envie uma mensagem sobre projetos, colaboração ou oportunidades. O formulário acompanha a identidade do portfólio.":"Send a message about projects, collaboration, or opportunities. The form follows the portfolio’s visual identity.","Seu nome":"Your name","Seu e-mail":"Your email","Mensagem":"Message","Enviar mensagem":"Send message","Deixe vazio":"Leave blank","O envio direto depende da configuração da chave Web3Forms. Enquanto não estiver configurado, o botão abre seu aplicativo de e-mail.":"Direct delivery requires a configured Web3Forms access key. Until then, this button opens your email app.","Confira os campos e tente novamente.":"Check the fields and try again.","Abrindo seu aplicativo de e-mail. Confirme o envio por lá.":"Opening your email app. Confirm sending there.","Enviando mensagem…":"Sending message…","Mensagem enviada com sucesso!":"Message sent successfully!","Não foi possível enviar. Use o e-mail de contato indicado ao lado.":"Could not send. Please use the contact email shown alongside."};
const placeholders={'Digite seu nome':'Enter your name','voce@exemplo.com':'you@example.com','Conte um pouco sobre sua ideia...':'Tell me about your idea...'};
const originalTitle=document.title;
const meta=document.querySelector('meta[name="description"]');const originalDescription=meta?.content||'';
const skipSelector='script,style,svg,#language-switch';
const walker=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT,{acceptNode(node){if(!node.parentElement||node.parentElement.closest(skipSelector))return NodeFilter.FILTER_REJECT;return node.nodeValue.trim()?NodeFilter.FILTER_ACCEPT:NodeFilter.FILTER_REJECT}});
const records=[];while(walker.nextNode()){const node=walker.currentNode,raw=node.nodeValue,key=raw.trim();if(Object.hasOwn(dictionary,key))records.push({node,raw,key});}
const attrs=[];document.querySelectorAll('[aria-label],[alt],[title],[placeholder]').forEach(el=>{if(el.id==='language-switch')return;for(const name of ['aria-label','alt','title','placeholder']){const val=el.getAttribute(name);if(val!==null)attrs.push({el,name,val})}});
const attrMap={'Navegação principal':'Main navigation','Retrato de Thiago Ferreira de Oliveira em fundo escuro':'Portrait of Thiago Ferreira de Oliveira against a dark background','Tecnologias e áreas de atuação':'Technologies and areas of expertise'};
function translateAttr(t){if(placeholders[t])return placeholders[t];for(const [pt,en] of Object.entries(attrMap))t=t.replaceAll(pt,en);for(const [pt,en] of Object.entries(dictionary))if(pt.length>12)t=t.replaceAll(pt,en);return t}
const button=document.getElementById('language-switch'),label=document.getElementById('language-label');if(!button)return;
let lang='pt-BR';
function setLanguage(next){lang=next==='en'?'en':'pt-BR';const en=lang==='en';for(const r of records)r.node.nodeValue=en?r.raw.replace(r.key,dictionary[r.key]):r.raw;for(const r of attrs)r.el.setAttribute(r.name,en?translateAttr(r.val):r.val);document.documentElement.lang=lang;document.title=en?'Thiago Ferreira de Oliveira — Portfolio · Python, AI Agents & Automation':originalTitle;if(meta)meta.content=en?'Professional portfolio focused on Python, AI agents, multi-agent architecture, Skills, MCP, and automation.':originalDescription;label.textContent=en?'PT':'EN';button.setAttribute('aria-pressed',String(en));button.setAttribute('aria-label',en?'Mudar para português':'Switch to English');button.title=en?'Mudar para português':'Switch to English';try{localStorage.setItem('portfolio-language',lang)}catch(e){}
const fb=document.querySelector('.contact-feedback');if(fb&&fb.textContent.trim()){const val=fb.textContent.trim();const pair=Object.entries(dictionary).find(([pt,english])=>val===pt||val===english);if(pair)fb.textContent=en?pair[1]:pair[0];}
}
button.addEventListener('click',()=>setLanguage(lang==='en'?'pt-BR':'en'));
const fb=document.querySelector('.contact-feedback');if(fb){const obs=new MutationObserver(()=>{if(lang!=='en')return;const val=fb.textContent.trim();if(dictionary[val]){obs.disconnect();fb.textContent=dictionary[val];obs.observe(fb,{childList:true,characterData:true,subtree:true})}});obs.observe(fb,{childList:true,characterData:true,subtree:true});}
let saved='pt-BR';try{saved=localStorage.getItem('portfolio-language')||'pt-BR'}catch(e){}setLanguage(saved);
})();


/* Tema claro/escuro, independente do seletor de idioma e do fundo animado. */
(()=>{
  const button=document.getElementById('theme-switch');
  if(!button)return;
  const root=document.documentElement;
  function apply(light){
    if(light)root.dataset.theme='light';else delete root.dataset.theme;
    button.setAttribute('aria-pressed',String(light));
    const en=root.lang==='en';
    const text=light?(en?'Switch to dark theme':'Ativar tema escuro'):(en?'Switch to light theme':'Ativar tema claro');
    button.setAttribute('aria-label',text);button.title=text;
    try{localStorage.setItem('portfolio-theme',light?'light':'dark')}catch(e){}
  }
  apply(root.dataset.theme==='light');
  button.addEventListener('click',()=>apply(root.dataset.theme!=='light'));
  const observer=new MutationObserver(()=>{const light=root.dataset.theme==='light';const en=root.lang==='en';const text=light?(en?'Switch to dark theme':'Ativar tema escuro'):(en?'Switch to light theme':'Ativar tema claro');button.setAttribute('aria-label',text);button.title=text;});
  observer.observe(root,{attributes:true,attributeFilter:['lang']});
})();

/* Rede neural adicional: camada leve, independente do canvas original */
(()=>{
  const canvas=document.getElementById('neural-background');if(!canvas)return;
  const ctx=canvas.getContext('2d');if(!ctx)return;
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  const pointer=matchMedia('(hover:hover) and (pointer:fine)');
  let w=0,h=0,dpr=1,nodes=[],mouse={x:-2000,y:-2000},raf=0,active=true,last=0;
  function measure(){w=innerWidth;h=innerHeight;dpr=Math.min(devicePixelRatio||1,2);canvas.width=Math.round(w*dpr);canvas.height=Math.round(h*dpr);ctx.setTransform(dpr,0,0,dpr,0,0);
    const count=Math.min(33,Math.max(13,Math.round(w*h/36000)));
    nodes=Array.from({length:count},(_,i)=>({x:((i*137.507+33)%1000)/1000*w,y:((i*71.33+147)%997)/997*h,vx:Math.sin(i*2.3)*.13,vy:Math.cos(i*3.1)*.13}));draw();}
  function draw(){ctx.clearRect(0,0,w,h);const light=document.documentElement.dataset.theme==='light';ctx.lineWidth=.75;
    nodes.forEach((a,i)=>{
      nodes.slice(i+1).forEach(b=>{const d=Math.hypot(a.x-b.x,a.y-b.y);if(d>135)return;ctx.strokeStyle=`rgba(255,255,255,${((1-d/135)*.22).toFixed(3)})`;ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.stroke()});
      const dm=Math.hypot(a.x-mouse.x,a.y-mouse.y);if(pointer.matches&&dm<145){ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(mouse.x,mouse.y);ctx.strokeStyle=`rgba(255,255,255,${((1-dm/145)*.32).toFixed(3)})`;ctx.stroke()}
      ctx.beginPath();ctx.arc(a.x,a.y,1.25,0,Math.PI*2);ctx.fillStyle='rgba(255,255,255,.4)';ctx.fill();
    });
  }
  function tick(t){if(!active||reduced.matches){raf=0;return}if(t-last>32){nodes.forEach(p=>{p.x+=p.vx;p.y+=p.vy;if(p.x<0||p.x>w)p.vx*=-1;if(p.y<0||p.y>h)p.vy*=-1});draw();last=t}raf=requestAnimationFrame(tick)}
  function update(){cancelAnimationFrame(raf);raf=0;draw();if(!reduced.matches&&!document.hidden){active=true;raf=requestAnimationFrame(tick)}}
  addEventListener('pointermove',e=>{mouse.x=e.clientX;mouse.y=e.clientY},{passive:true});
  document.addEventListener('pointerout',e=>{if(!e.relatedTarget){mouse.x=-2000;mouse.y=-2000}},{passive:true});
  document.addEventListener('visibilitychange',()=>{active=!document.hidden;update()});
  addEventListener('resize',()=>{measure();update()},{passive:true});
  if(reduced.addEventListener)reduced.addEventListener('change',update);
  measure();update();
})();
/* Mantém o diagrama localizado sem alterar o dicionário PT/EN existente */
(()=>{
  const lang=document.getElementById('language-switch');
  if(lang)lang.addEventListener('click',()=>{queueMicrotask(()=>document.querySelectorAll('.agent-flow [data-pt]').forEach(el=>{el.textContent=document.documentElement.lang==='en'?el.dataset.en:el.dataset.pt}))});
  document.querySelectorAll('.agent-flow [data-pt]').forEach(el=>{el.textContent=document.documentElement.lang==='en'?el.dataset.en:el.dataset.pt});
})();
/* Coordenadas do destaque luminoso, sem mudar o layout original dos cards */
(()=>{if(matchMedia('(prefers-reduced-motion: reduce)').matches)return;
  document.querySelectorAll('.card').forEach(card=>card.addEventListener('pointermove',e=>{const r=card.getBoundingClientRect();card.style.setProperty('--edge-x',((e.clientX-r.left)/r.width*100)+'%');card.style.setProperty('--edge-y',((e.clientY-r.top)/r.height*100)+'%')},{passive:true}));
})();
