/* Efeitos complementares: execução após o script de interações original. */
(() => {
 'use strict';
 const reduce=window.matchMedia('(prefers-reduced-motion: reduce)');
 const fine=window.matchMedia('(hover: hover) and (pointer: fine)');
 const progress=document.getElementById('scroll-progress');
 function updateProgress(){if(!progress)return;const max=document.documentElement.scrollHeight-innerHeight;progress.style.width=(max>0?Math.min(100,Math.max(0,scrollY/max*100)):0)+'%'}
 let progressQueued=false;
 const onScroll=()=>{if(progressQueued)return;progressQueued=true;requestAnimationFrame(()=>{updateProgress();progressQueued=false})};
 window.addEventListener('scroll',onScroll,{passive:true});window.addEventListener('resize',onScroll,{passive:true});updateProgress();

 const typing=document.getElementById('typing-words');
 const phrases={pt:['Desenvolvedor Python','Automações Inteligentes','Agentes de IA','APIs e Integrações'],en:['Python Developer','Intelligent Automation','AI Agents','APIs and Integrations']};
 if(typing){let index=0,chars=0,deleting=false,timeout=0,language='';
  const getLanguage=()=>document.documentElement.lang==='en'?'en':'pt';
  function tick(){const lang=getLanguage();if(lang!==language){language=lang;index=0;chars=0;deleting=false}
   const phrase=phrases[lang][index];if(reduce.matches){typing.textContent=phrase;return}
   chars=Math.max(0,Math.min(phrase.length,chars+(deleting?-1:1)));
   typing.textContent=phrase.slice(0,chars);
   let delay=deleting?36:74;
   if(!deleting&&chars===phrase.length){deleting=true;delay=1600}
   else if(deleting&&chars===0){deleting=false;index=(index+1)%phrases[lang].length;delay=380}
   timeout=window.setTimeout(tick,delay);
  }
  tick();
  const obs=new MutationObserver(()=>{clearTimeout(timeout);language='';tick()});obs.observe(document.documentElement,{attributes:true,attributeFilter:['lang']});
  reduce.addEventListener?.('change',()=>{clearTimeout(timeout);language='';tick()});
 }

 const skillItems=[...document.querySelectorAll('.competencias-grid > *')];
 if(skillItems.length&&!reduce.matches&&'IntersectionObserver'in window){
  document.documentElement.classList.add('fx-ready');
  skillItems.forEach((item,i)=>item.style.setProperty('--reveal-delay',Math.min(i,7)*85+'ms'));
  const io=new IntersectionObserver(entries=>{entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('fx-visible');io.unobserve(entry.target)}})},{threshold:.07,rootMargin:'0px 0px -25px 0px'});
  skillItems.forEach(item=>io.observe(item));
  reduce.addEventListener?.('change',()=>{if(reduce.matches){skillItems.forEach(el=>el.classList.add('fx-visible'));io.disconnect()}});
 } else skillItems.forEach(el=>el.classList.add('fx-visible'));

 if(fine.matches&&!reduce.matches){document.querySelectorAll('.card').forEach(card=>{
  card.classList.add('fx-tilt');
  card.addEventListener('pointermove',e=>{if(reduce.matches)return;const r=card.getBoundingClientRect();const px=(e.clientX-r.left)/r.width,py=(e.clientY-r.top)/r.height;
   card.style.setProperty('--tilt-x',((.5-py)*5).toFixed(2)+'deg');card.style.setProperty('--tilt-y',((px-.5)*5).toFixed(2)+'deg');card.style.setProperty('--shine-x',(px*100).toFixed(1)+'%');card.style.setProperty('--shine-y',(py*100).toFixed(1)+'%');
  },{passive:true});
  card.addEventListener('pointerleave',()=>{card.style.removeProperty('--tilt-x');card.style.removeProperty('--tilt-y');card.style.removeProperty('--shine-x');card.style.removeProperty('--shine-y')});
 })}
})();


/* ===== Pacote adicional de animações imersivas ===== */
(() => {
  'use strict';
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  const fine = window.matchMedia('(hover: hover) and (pointer: fine)');

  function setupGlitch() {
    const targets = [document.querySelector('.hero-title'), ...document.querySelectorAll('.section-title')].filter(Boolean);
    if (!targets.length) return;
    targets.forEach((el) => {
      if (!el.classList.contains('glitch-target')) {
        el.classList.add('glitch-target');
      }
      const text = (el.textContent || '').replace(/\s+/g, ' ').trim();
      el.setAttribute('data-text', text);
    });
    if (reduce.matches) return;
    let idx = 0;
    setInterval(() => {
      const visible = targets.filter((el) => {
        const r = el.getBoundingClientRect();
        return r.bottom > 0 && r.top < innerHeight;
      });
      const pool = visible.length ? visible : targets;
      const el = pool[idx % pool.length];
      idx += 1;
      el.classList.add('is-glitching');
      setTimeout(() => el.classList.remove('is-glitching'), 240);
    }, 3200);
  }

  function setupClickRipples() {
    if (reduce.matches) return;
    window.addEventListener('pointerdown', (e) => {
      if (e.pointerType === 'mouse' && e.button !== 0) return;
      const ripple = document.createElement('span');
      ripple.className = 'click-ripple';
      ripple.style.left = e.clientX + 'px';
      ripple.style.top = e.clientY + 'px';
      document.body.appendChild(ripple);
      ripple.addEventListener('animationend', () => ripple.remove(), { once: true });
    }, { passive: true });
  }

  function setupTitleParticles() {
    const canvas = document.getElementById('hero-title-particles');
    const title = document.querySelector('.hero-title');
    const shell = document.querySelector('.hero-title-shell');
    if (!canvas || !title || !shell) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    let w = 0, h = 0, raf = 0, points = [], phase = 0, lastText = '';
    let ro;

    function splitText(text) {
      const flat = text.replace(/\s+/g, ' ').trim();
      const idx = flat.indexOf('Python');
      if (idx > 0) {
        const before = flat.slice(0, idx).trim();
        const after = flat.slice(idx).trim();
        return [before, after];
      }
      const words = flat.split(' ');
      const mid = Math.ceil(words.length / 2);
      return [words.slice(0, mid).join(' '), words.slice(mid).join(' ')].filter(Boolean);
    }

    function buildTargets() {
      const rect = shell.getBoundingClientRect();
      w = Math.max(260, Math.round(rect.width));
      h = Math.max(120, Math.round(rect.height * 1.15));
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      canvas.style.width = w + 'px';
      canvas.style.height = h + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const off = document.createElement('canvas');
      off.width = w;
      off.height = h;
      const octx = off.getContext('2d');
      if (!octx) return;
      octx.clearRect(0, 0, w, h);
      const styles = getComputedStyle(title);
      const fontSize = Math.max(26, Math.min(56, parseFloat(styles.fontSize) * 0.82));
      const fontWeight = styles.fontWeight || '800';
      const fontFamily = styles.fontFamily || 'sans-serif';
      const lines = splitText(title.textContent || 'Python AI');
      const lineHeight = fontSize * 1.06;
      const totalHeight = lines.length * lineHeight;
      const startY = Math.round((h - totalHeight) / 2 + fontSize * 0.88);
      octx.fillStyle = '#fff';
      octx.textAlign = 'left';
      octx.textBaseline = 'alphabetic';
      octx.font = `${fontWeight} ${fontSize}px ${fontFamily}`;
      const left = Math.max(0, w * 0.02);
      lines.forEach((line, i) => octx.fillText(line, left, startY + i * lineHeight));
      const img = octx.getImageData(0, 0, w, h).data;
      const density = Math.max(5, Math.round(w / 120));
      const targets = [];
      for (let y = 0; y < h; y += density) {
        for (let x = 0; x < w; x += density) {
          const a = img[(y * w + x) * 4 + 3];
          if (a > 120) {
            targets.push({
              x, y,
              ox: Math.random() * w,
              oy: Math.random() * h,
              vx: 0, vy: 0,
              s: 0.6 + Math.random() * 1.25
            });
          }
        }
      }
      points = targets;
      phase = 0;
      lastText = title.textContent || '';
      if (reduce.matches) drawStatic();
    }

    function drawStatic() {
      ctx.clearRect(0, 0, w, h);
      points.forEach((p) => {
        ctx.fillStyle = 'rgba(255,255,255,0.18)';
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.s * 0.8, 0, Math.PI * 2);
        ctx.fill();
      });
    }

    function animate() {
      if (reduce.matches) { drawStatic(); return; }
      ctx.clearRect(0, 0, w, h);
      phase += 0.012;
      for (const p of points) {
        const tx = phase < 1 ? p.ox + (p.x - p.ox) * phase : p.x;
        const ty = phase < 1 ? p.oy + (p.y - p.oy) * phase : p.y;
        const twinkle = 0.18 + (Math.sin(phase * 6 + p.x * 0.04 + p.y * 0.02) + 1) * 0.11;
        ctx.fillStyle = `rgba(255,255,255,${Math.min(0.48, twinkle + 0.06)})`;
        ctx.beginPath();
        ctx.arc(tx, ty, p.s, 0, Math.PI * 2);
        ctx.fill();
      }
      raf = requestAnimationFrame(animate);
    }

    const observer = new MutationObserver(() => {
      const text = title.textContent || '';
      if (text !== lastText) {
        buildTargets();
        if (!reduce.matches) {
          cancelAnimationFrame(raf);
          animate();
        }
      }
    });
    observer.observe(title, { childList: true, subtree: true, characterData: true });
    ro = new ResizeObserver(() => {
      buildTargets();
      if (!reduce.matches) {
        cancelAnimationFrame(raf);
        animate();
      }
    });
    ro.observe(shell);
    buildTargets();
    if (!reduce.matches) animate();
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) cancelAnimationFrame(raf);
      else if (!reduce.matches) animate();
    });
  }

  setupGlitch();
  setupClickRipples();
  setupTitleParticles();
})();


/* Nova camada de efeitos leves, progressivos e adaptados a acessibilidade. */
(() => {
  'use strict';
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  const fine = window.matchMedia('(hover: hover) and (pointer: fine)');
  const motionEnabled = () => !reduced.matches;

  // Faixa de energia aparece quando cada seção entra na viewport.
  const headings = [...document.querySelectorAll('.section-title')];
  headings.forEach(el => el.classList.add('fx-energy'));
  if ('IntersectionObserver' in window && motionEnabled()) {
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('fx-energized');
        observer.unobserve(entry.target);
      }
    }), {threshold: 0.1});
    headings.forEach(el => observer.observe(el));
  } else headings.forEach(el => el.classList.add('fx-energized'));

  // Chips flutuam ligeiramente, sem atrapalhar os links ou a leitura.
  document.querySelectorAll('.hero-chips').forEach(list => {
    list.classList.add('fx-stagger');
    list.querySelectorAll('li').forEach((item, index) =>
      item.style.setProperty('--chip-delay', `-${index * 620}ms`));
  });

  // Desenha os ícones dos agentes na primeira visualização.
  const icons = [...document.querySelectorAll('.agente svg')];
  icons.forEach(icon => icon.classList.add('fx-icon-draw'));
  if ('IntersectionObserver' in window && motionEnabled()) {
    const io = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('fx-drawn');
        io.unobserve(entry.target);
      }
    }), {threshold: 0.2});
    icons.forEach(icon => io.observe(icon));
  } else icons.forEach(icon => icon.classList.add('fx-drawn'));

  if (fine.matches && motionEnabled()) {
    // Botões magnéticos usam "translate" independente do transform original.
    document.querySelectorAll('.btn').forEach(button => {
      button.classList.add('fx-magnetic');
      button.addEventListener('pointermove', e => {
        const bounds = button.getBoundingClientRect();
        const x = (e.clientX - (bounds.left + bounds.width / 2)) * 0.10;
        const y = (e.clientY - (bounds.top + bounds.height / 2)) * 0.13;
        button.style.setProperty('--magnet-x', `${Math.max(-8,Math.min(8,x)).toFixed(1)}px`);
        button.style.setProperty('--magnet-y', `${Math.max(-7,Math.min(7,y)).toFixed(1)}px`);
      }, {passive:true});
      button.addEventListener('pointerleave', () => {
        button.style.removeProperty('--magnet-x');
        button.style.removeProperty('--magnet-y');
      });
    });
    document.querySelectorAll('.contact-socials a').forEach(a => a.classList.add('fx-social-lift'));

    // Trilha suave com 7 pontos compartilhando um único rAF.
    const dots = Array.from({length: 7}, () => {
      const dot = document.createElement('span');
      dot.className = 'fx-cursor-dot';
      document.body.append(dot);
      return dot;
    });
    let x=-300,y=-300,active=false,raf=0;
    const pts = dots.map(()=>({x:-300,y:-300}));
    const tick = () => {
      if (!active || document.hidden || reduced.matches) {raf=0;return;}
      dots.forEach((dot,i) => {
        const target = i ? pts[i-1] : {x,y};
        pts[i].x += (target.x-pts[i].x)*0.35;
        pts[i].y += (target.y-pts[i].y)*0.35;
        dot.style.transform=`translate3d(${pts[i].x}px,${pts[i].y}px,0)`;
        dot.style.opacity=String((1-i/dots.length)*0.62);
      });
      raf=requestAnimationFrame(tick);
    };
    window.addEventListener('pointermove',e=>{
      x=e.clientX;y=e.clientY;active=true;
      if (!raf) raf=requestAnimationFrame(tick);
    },{passive:true});
    document.addEventListener('pointerleave',()=>{active=false;dots.forEach(dot=>dot.style.opacity='0')});
    reduced.addEventListener('change',()=>{if(reduced.matches){active=false;dots.forEach(dot=>dot.style.opacity='0')}});
  }
})();
