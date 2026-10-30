/* Cinematic Premium V2: visible title decoding + responsive bounded parallax. */
(() => {
  'use strict';
  const root = document.documentElement;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const fine = matchMedia('(hover: hover) and (pointer: fine)');
  const targets = [...document.querySelectorAll('.section-title')];
  const alphabet = '01#@/<>[]{}*X?';
  const active = new Map();
  const original = new WeakMap();
  const normalize = s => (s || '').replace(/\s+/g, ' ').trim();

  function stop(el) {
    const state=active.get(el);
    if(state) { clearInterval(state.id); state.layer.remove(); active.delete(el); }
    el.classList.remove('decode-active');
  }
  function animateText(el) {
    if(reduced.matches || document.hidden || active.has(el)) return;
    const raw = normalize(el.firstChild?.textContent || el.textContent);
    if(!raw || raw.length>100) return;
    original.set(el,raw);
    const layer=document.createElement('span');
    layer.className='decode-overlay';
    layer.setAttribute('aria-hidden','true');
    el.classList.add('decode-active');
    layer.textContent=raw;
    el.appendChild(layer);
    let frame=0;
    const frames=36, tick=52;
    const id=setInterval(()=>{
      frame++;
      const fraction=Math.max(0,(frame-4)/(frames-4));
      const solved=Math.floor(raw.length*fraction);
      const output=[...raw].map((c,i)=>{
        if(i<solved || /\s|[^\p{L}\p{N}]/u.test(c)) return c;
        return alphabet[(Math.floor(Math.random()*alphabet.length))];
      }).join('');
      layer.textContent=output;
      if(frame>=frames) stop(el);
    },tick);
    active.set(el,{id,layer});
  }
  const seen=new WeakSet();
  let observer;
  if('IntersectionObserver' in window){
    observer=new IntersectionObserver(entries=>{
      for(const item of entries){
        if(item.isIntersecting&&!seen.has(item.target)){
          seen.add(item.target);
          if(!reduced.matches) animateText(item.target);
          observer.unobserve(item.target);
        }
      }
    },{threshold:.22});
    targets.forEach(t=>observer.observe(t));
  }
  for(const el of targets){
    el.addEventListener('pointerenter',()=>{if(fine.matches)animateText(el)});
    el.addEventListener('focusin',()=>animateText(el));
  }
  const languageObserver=new MutationObserver(()=>{
    targets.forEach(el=>{
      stop(el);
      seen.delete(el);
      observer?.observe(el);
    });
  });
  languageObserver.observe(root,{attributes:true,attributeFilter:['lang']});

  let scroll=scrollY, mx=0, my=0, raf=0, visible=!document.hidden;
  const clamp=(x,a,b)=>Math.max(a,Math.min(b,x));
  function draw(){
    raf=0;
    if(!visible || reduced.matches)return;
    const docRange=Math.max(1,document.documentElement.scrollHeight-innerHeight);
    const progress=scroll/docRange;
    // Distinct movement speeds make the depth difference apparent but keep the
    // fixed canvases clipped to the viewport.
    const screen=fine.matches && innerWidth>720;
    const x=screen?mx:0, y=screen?my:0;
    const drift=Math.sin(progress*Math.PI*3);
    const layers=[
      ['grid',-12,-12,12],
      ['neural',24,22,-24],
      ['ribbons',-36,-18,38],
      ['rays',30,22,-34]
    ];
    for(const [name,scale,mouseY,scrollY] of layers){
      root.style.setProperty(`--premium-${name}-x`,`${(x*scale).toFixed(1)}px`);
      root.style.setProperty(`--premium-${name}-y`,`${(y*mouseY+drift*scrollY).toFixed(1)}px`);
    }
  }
  function queue(){if(!raf && visible && !reduced.matches)raf=requestAnimationFrame(draw)}
  addEventListener('scroll',()=>{scroll=scrollY;queue()},{passive:true});
  addEventListener('pointermove',e=>{
    if(!fine.matches)return;
    mx=clamp((e.clientX/innerWidth-.5)*2,-1,1);
    my=clamp((e.clientY/innerHeight-.5)*2,-1,1);
    queue();
  },{passive:true});
  const vars=['grid','neural','ribbons','rays'];
  function clean(){cancelAnimationFrame(raf);raf=0;for(const name of vars){root.style.removeProperty(`--premium-${name}-x`);root.style.removeProperty(`--premium-${name}-y`)}}
  reduced.addEventListener('change',()=>{if(reduced.matches){targets.forEach(stop);clean()}else queue()});
  document.addEventListener('visibilitychange',()=>{visible=!document.hidden;if(!visible)clean();else queue()});
  addEventListener('resize',queue,{passive:true});
  draw();
})();
